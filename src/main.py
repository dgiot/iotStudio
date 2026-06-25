# ============================================================
# pythonIot — FastAPI 主入口
# ============================================================
import asyncio
import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pydantic import BaseModel, Field

from .config import cfg
from .storage.tdengine import TDEngineStore
from .storage.postgres import PostgresStore
from .services.collector import CollectorEngine
from .services.alarm_engine import AlarmEngine
from .services.push_engine import PushEngine

# ===== 日志 =====
logging.basicConfig(level=getattr(logging, cfg.log_level.upper(), logging.INFO),
                    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

# ===== 全局服务 =====
pg_store = PostgresStore()
td_store = TDEngineStore()
collector = CollectorEngine(pg_store, td_store)
alarm_engine = AlarmEngine(pg_store)
push_engine = PushEngine(pg_store)

# ===== WebSocket 连接管理 =====
ws_clients: set[WebSocket] = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期"""
    # 启动
    await pg_store.connect()
    await td_store.connect()
    await td_store.ensure_supertable("default")
    await push_engine.start()

    # 采集引擎回调链
    collector.on_data(alarm_engine.evaluate)
    collector.on_data(push_engine.push)

    await collector.start()
    logger.info(f"[main] {cfg.title} V{cfg.version} 启动完成")
    yield
    # 关闭
    await collector.stop()
    await td_store.close()
    await pg_store.close()


app = FastAPI(
    title=cfg.title,
    version=cfg.version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ===== Pydantic 模型 =====

class DeviceCreate(BaseModel):
    device_id: str
    device_name: str
    device_type: str = "inverter"
    station_id: str = "default"
    protocol: str = "modbus_tcp"
    comm_params: Optional[Dict] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    install_location: Optional[str] = None


class PointCreate(BaseModel):
    point_id: str
    device_id: str
    point_name: str
    protocol_addr: str
    register_type: Optional[str] = "3"
    data_type: str = "float32"
    scale: float = 1.0
    offset: float = 0.0
    unit: Optional[str] = None
    collect_interval: int = 5
    alarm_high: Optional[float] = None
    alarm_low: Optional[float] = None


class PushTargetCreate(BaseModel):
    target_id: str
    target_name: str
    target_type: str = "mqtt"    # mqtt / http / dgiot
    endpoint: str
    config: Optional[Dict] = None


# ===== 认证 API =====
from .auth import authenticate, verify_token, get_current_user, USERS

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/auth/login")
async def login(body: LoginRequest):
    token = authenticate(body.username, body.password)
    if token is None:
        raise HTTPException(401, "用户名或密码错误")
    payload = verify_token(token)
    return {"token": token, "username": payload["sub"], "role": payload["role"]}

@app.get("/api/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"username": user["sub"], "role": user["role"]}

# ===== REST API =====

@app.get("/api/health")
async def health():
    """健康检查"""
    stats = await collector.get_stats()
    return {
        "status": "ok",
        "version": cfg.version,
        "uptime_seconds": stats.get("uptime", 0),
        "collector": stats,
    }


# ---- Device ----

@app.get("/api/devices")
async def list_devices(station_id: Optional[str] = None, device_type: Optional[str] = None):
    devices = await pg_store.list_devices(station_id, device_type)
    return {
        "total": len(devices),
        "devices": [{
            "device_id": d.device_id, "device_name": d.device_name,
            "device_type": d.device_type, "protocol": d.protocol,
            "status": d.status, "station_id": d.station_id,
            "manufacturer": d.manufacturer, "model": d.model,
            "last_online_at": d.last_online_at.isoformat() if d.last_online_at else None,
        } for d in devices]
    }


@app.get("/api/devices/{device_id}")
async def get_device(device_id: str):
    dev = await pg_store.get_device(device_id)
    if dev is None:
        raise HTTPException(404, "设备不存在")
    return {"device_id": dev.device_id, "device_name": dev.device_name, "status": dev.status,
            "protocol": dev.protocol, "device_type": dev.device_type}


@app.post("/api/devices")
async def create_device(body: DeviceCreate):
    existing = await pg_store.get_device(body.device_id)
    if existing:
        raise HTTPException(400, "设备ID已存在")
    dev = await pg_store.create_device(body.model_dump())
    await collector.add_device(dev)
    return {"device_id": dev.device_id, "status": "created"}


@app.delete("/api/devices/{device_id}")
async def delete_device(device_id: str):
    await collector.remove_device(device_id)
    return {"status": "removed"}


# ---- Data Points ----

@app.get("/api/devices/{device_id}/points")
async def list_points(device_id: str):
    points = await pg_store.list_points(device_id)
    return {"total": len(points), "points": [{
        "point_id": p.point_id, "point_name": p.point_name,
        "protocol_addr": p.protocol_addr, "data_type": p.data_type,
        "unit": p.unit, "scale": p.scale, "offset": p.offset,
        "collect_interval": p.collect_interval,
    } for p in points]}


@app.post("/api/devices/{device_id}/points")
async def create_point(device_id: str, body: PointCreate):
    await pg_store.create_points_batch([body.model_dump()])
    return {"status": "created"}


@app.post("/api/devices/{device_id}/points/batch")
async def create_points_batch(device_id: str, points: List[PointCreate]):
    data = [p.model_dump() for p in points]
    count = await pg_store.create_points_batch(data)
    return {"status": "created", "count": count}


# ---- Alarms ----

@app.get("/api/alarms")
async def list_alarms(status: Optional[str] = "active", limit: int = 100):
    alarms = await pg_store.list_alarms(status, limit)
    return {"total": len(alarms), "alarms": [{
        "alarm_id": a.alarm_id, "device_id": a.device_id,
        "alarm_type": a.alarm_type, "alarm_level": a.alarm_level,
        "alarm_msg": a.alarm_msg, "status": a.status,
        "created_at": a.created_at.isoformat() if a.created_at else None,
    } for a in alarms]}


@app.post("/api/alarms/{alarm_id}/confirm")
async def confirm_alarm(alarm_id: str):
    await alarm_engine.confirm_alarm(alarm_id)
    return {"status": "confirmed"}


@app.post("/api/alarms/{alarm_id}/clear")
async def clear_alarm(alarm_id: str):
    await alarm_engine.clear_alarm(alarm_id)
    return {"status": "cleared"}


# ---- Telemetry Query ----

@app.get("/api/telemetry/{device_id}/latest")
async def device_latest(device_id: str):
    points = await pg_store.list_points(device_id)
    point_ids = [p.point_id for p in points]
    rows = await td_store.query_device_latest(device_id, point_ids)
    return {"device_id": device_id, "data": rows}


@app.get("/api/telemetry/{device_id}/{point_id}")
async def query_telemetry(device_id: str, point_id: str,
                          start: Optional[str] = None,
                          end: Optional[str] = None,
                          limit: int = 1000):
    rows = await td_store.query(device_id, point_id, start, end, limit)
    if isinstance(rows, list) and len(rows) > 0 and hasattr(rows[0], 'isoformat'):
        rows = [{"ts": r[0].isoformat() if hasattr(r[0], 'isoformat') else str(r[0]),
                 "value": r[1], "quality": r[2]} for r in rows]
    return {"total": len(rows), "data": rows}


# ---- Simulator Status ----

@app.get("/api/simulators/status")
async def simulators_status():
    """检测本地模拟器端口状态"""
    import socket
    simulators = [
        {"id": "modbus_tcp_502",  "name": "Modbus TCP 逆变器", "protocol": "Modbus TCP", "port": 502,  "device": "光伏逆变器",    "itemCount": 10},
        {"id": "modbus_tcp_1502", "name": "Modbus TCP 储能",   "protocol": "Modbus TCP", "port": 1502, "device": "储能PCS",       "itemCount": 10},
        {"id": "modbus_tcp_2502", "name": "Modbus TCP 充电桩", "protocol": "Modbus TCP", "port": 2502, "device": "充电桩",        "itemCount": 8},
        {"id": "iec104_2404",     "name": "IEC 104 储能PCS",   "protocol": "IEC 104",    "port": 2404, "device": "储能PCS从站",    "itemCount": 14},
        {"id": "opcua_4840",      "name": "OPC UA 充电桩",     "protocol": "OPC UA",     "port": 4840, "device": "充电桩+环境",    "itemCount": 12},
        {"id": "opcda_9090",      "name": "OPC DA 数据源",     "protocol": "OPC DA",     "port": 9090, "device": "光储充数据源",   "itemCount": 19},
    ]
    for sim in simulators:
        s = socket.socket(); s.settimeout(1)
        r = s.connect_ex(("127.0.0.1", sim["port"])); s.close()
        sim["status"] = "running" if r == 0 else "stopped"
        sim["startCmd"] = "python simulators/run_all.py"
    return {"simulators": simulators}


# ---- Collector Stats ----

@app.get("/api/stats")
async def collector_stats():
    return await collector.get_stats()


# ---- Scanner (设备自动发现) ----

class ScanRequest(BaseModel):
    host: str = "127.0.0.1"
    port: int = 502
    start: int = 1
    end: int = 10

# 全局报文日志
_packet_log: List[Dict] = []

def log_packet(device_id: str, direction: str, raw: bytes):
    """记录报文到全局日志"""
    import time as _time
    _packet_log.append({"ts": _time.time(), "device": device_id, "dir": direction,
                         "len": len(raw), "hex": raw.hex()})
    if len(_packet_log) > 500:
        _packet_log[:] = _packet_log[-200:]

@app.get("/api/packets")
async def get_packets(device_id: Optional[str] = None, limit: int = 50):
    """获取报文日志"""
    logs = _packet_log
    if device_id:
        logs = [p for p in _packet_log if p["device"] == device_id]
    return {"total": len(logs), "packets": logs[-limit:]}

@app.post("/api/scanner/scan")
async def scan_network(body: ScanRequest):
    """扫描 Modbus 从站 + 点位"""
    from .protocols.modbus_scanner import SlaveScanner, PointScanner
    results = {"host": body.host, "port": body.port, "slaves": [], "error": None}
    try:
        scanner = SlaveScanner(body.host, body.port, timeout=1.5, max_workers=10)
        active = scanner.find_active(body.start, body.end)
        for slave_id in active:
            slave_info = {"slave_id": slave_id, "registers": []}
            try:
                ps = PointScanner(body.host, body.port, slave_id, timeout=1.5)
                if ps.connect():
                    regs = ps.scan_range(0, 30, max_workers=10)
                    for r in regs[:10]:
                        if r.success:
                            slave_info["registers"].append({"address": r.address, "value": r.value})
                    ps.disconnect()
            except Exception as e:
                slave_info["error"] = str(e)
            results["slaves"].append(slave_info)
    except Exception as e:
        results["error"] = str(e)
    return results


# ---- Push Target ----

@app.post("/api/push-targets")
async def create_push_target(body: PushTargetCreate):
    async with pg_store.session as s:
        from ..models.device import PushTarget as PT
        target = PT(**body.model_dump())
        s.add(target)
        await s.commit()
    await push_engine.start()  # 重载
    return {"status": "created"}


# ---- WebSocket (实时数据推送) ----

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    ws_clients.add(ws)
    try:
        while True:
            data = await ws.receive_text()
            # 客户端心跳
            if data == "ping":
                await ws.send_text("pong")
    except WebSocketDisconnect:
        pass
    finally:
        ws_clients.discard(ws)


async def broadcast_ws(message: Dict[str, Any]):
    """向所有 WebSocket 客户端广播"""
    global ws_clients
    dead = set()
    for ws in ws_clients:
        try:
            await ws.send_json(message)
        except Exception as e:
            logger.debug(f"[ws] broadcast error: {e}")
            dead.add(ws)
    ws_clients -= dead
    if ws_clients:
        logger.debug(f"[ws] broadcast to {len(ws_clients)} clients: {message.get('device_id', '')} {len(message.get('data', []))}pts")


# 注册广播到采集引擎回调
async def _ws_broadcast(device_id: str, points):
    await broadcast_ws({
        "type": "telemetry",
        "device_id": device_id,
        "data": [{"point_id": pv.point_id, "point_name": pv.point_name,
                  "value": pv.value, "unit": pv.unit} for pv in points],
    })

collector.on_data(_ws_broadcast)

# ---- Bridge (外部数据接入) ----
class BridgePoint(BaseModel):
    point_id: str = ""; point_name: str = ""; value: float = 0.0
    data_type: str = "float32"; unit: str = ""; quality: int = 0

class BridgeData(BaseModel):
    device_id: str; points: List[BridgePoint]

@app.post("/api/bridge/telemetry")
async def bridge_telemetry(body: BridgeData):
    """c104 桥接器数据接入"""
    meta = collector._device_meta.get(body.device_id, {"device_type": "pcs", "station_id": "station_01"})
    rows = [{"device_id": body.device_id, "point_id": p.point_id, "point_name": p.point_name,
             "value": p.value, "unit": p.unit, "quality": p.quality,
             "device_type": meta.get("device_type","default"), "station_id": meta.get("station_id","default")}
            for p in body.points]
    await td_store.batch_insert(rows)
    return {"status": "ok", "count": len(rows)}


# ---- Vue3 前端托管 ----
from pathlib import Path as _Path
from starlette.responses import Response as _Response

_FRONTEND_DIR = _Path(__file__).resolve().parent.parent / "frontend-vue" / "dist"

# 硬编码 MIME 映射（Windows 上 mimetypes 不可靠）
_MIME_MAP = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml",
    ".pdf": "application/pdf",
}

def _media_type(path: str) -> str:
    """返回正确的 MIME 类型"""
    ext = _Path(path).suffix.lower()
    return _MIME_MAP.get(ext, "application/octet-stream")

def _static_response(full_path: str) -> _Response:
    """读取静态文件并返回带正确 Content-Type 的响应"""
    file_path = _FRONTEND_DIR / full_path
    if file_path.is_file():
        content = file_path.read_bytes()
        return _Response(content=content, media_type=_media_type(full_path))
    return None

if _FRONTEND_DIR.exists():

    @app.get("/assets/{file_path:path}")
    async def serve_assets(file_path: str):
        """静态资源 — 强制正确 MIME"""
        resp = _static_response(f"assets/{file_path}")
        if resp:
            return resp
        raise HTTPException(status_code=404)

    @app.get("/favicon.svg")
    async def serve_favicon():
        resp = _static_response("favicon.svg")
        if resp:
            return resp
        raise HTTPException(status_code=404)

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """SPA 路由"""
        if full_path.startswith("api"):
            raise HTTPException(status_code=404)

        file_path = _FRONTEND_DIR / full_path
        if file_path.is_file() and not full_path.startswith("api"):
            content = file_path.read_bytes()
            return _Response(content=content, media_type=_media_type(full_path))

        # SPA fallback
        index = (_FRONTEND_DIR / "index.html").read_bytes()
        return _Response(content=index, media_type="text/html; charset=utf-8")

    @app.get("/")
    async def root():
        index = (_FRONTEND_DIR / "index.html").read_bytes()
        return _Response(content=index, media_type="text/html; charset=utf-8")

    logger.info(f"[main] Vue3 前端已托管: {_FRONTEND_DIR}")
else:
    @app.get("/scada", response_class=HTMLResponse)
    async def scada_page():
        path = _Path(__file__).resolve().parent.parent / "frontend" / "index.html"
        return HTMLResponse(path.read_text(encoding="utf-8")) if path.exists() else HTMLResponse("<h2>SCADA not found</h2>")

    logger.info("[main] Vue3 dist 未构建，使用旧版 SCADA 页面")
