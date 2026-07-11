# ============================================================
# pythonIot — FastAPI 主入口
# ============================================================
import asyncio
import logging
import uuid
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pydantic import BaseModel, Field

from .config import cfg
from .storage.tdengine import TDEngineStore
from .storage.parse_store import ParseStore
from .services.collector import CollectorEngine
from .services.alarm_engine import AlarmEngine
from .services.push_engine import PushEngine
from .services.safety_rules import SafetyPipeline
from .services.phm_engine import PHMEngine
from .services.mqtt_broker import start_builtin_broker, stop_builtin_broker
from .models.thing_model import get_product_model

# ===== 日志 =====
logging.basicConfig(level=getattr(logging, cfg.log_level.upper(), logging.INFO),
                    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

# ===== 全局服务 =====
_startup_ts = time.time()
pg_store = ParseStore()
td_store = TDEngineStore()
collector = CollectorEngine(pg_store, td_store)
alarm_engine = AlarmEngine(pg_store)
push_engine = PushEngine(pg_store)
safety_pipeline = SafetyPipeline(pg_store)
phm_engine = PHMEngine()

# ===== WebSocket 连接管理 =====
ws_clients: set[WebSocket] = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期"""
    # 启动（每步独立捕获异常，避免单点故障导致整个平台退出）
    try:
        await pg_store.connect()
    except Exception as e:
        logger.error(f"[main] 数据库连接失败: {e}")

    try:
        await td_store.connect()
        await td_store.ensure_supertable("default")
    except Exception as e:
        logger.warning(f"[main] TDengine 连接失败: {e}")

    try:
        await push_engine.start()
    except Exception as e:
        logger.warning(f"[main] 推送引擎启动失败: {e}")

    # 采集引擎回调链
    collector.on_data(alarm_engine.evaluate)
    collector.on_data(safety_pipeline.evaluate)
    collector.on_data(push_engine.push)
    safety_pipeline.start_timeout_checker()

    # 内置 MQTT Broker
    try:
        await start_builtin_broker("0.0.0.0", 1883)
    except Exception as e:
        logger.warning(f"[main] MQTT broker 启动失败: {e}")

    try:
        await collector.start()
    except Exception as e:
        logger.error(f"[main] 采集引擎启动失败: {e}")

    _inject_packet_logger()
    logger.info(f"[main] {cfg.title} V{cfg.version} 启动完成")
    yield
    # 关闭
    try: await collector.stop()
    except: pass
    try: await stop_builtin_broker()
    except: pass
    try: await td_store.close()
    except: pass
    try: await pg_store.close()
    except: pass


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

# ===== 依赖 =====

async def require_admin(user: dict = Depends(get_current_user)):
    """FastAPI 依赖：仅管理员可访问"""
    role = user.get('role') if isinstance(user, dict) else getattr(user, 'role', None)
    if role != 'admin':
        raise HTTPException(403, "仅管理员可访问")
    return user

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

# ---- User Management ----
@app.get("/api/auth/users")
async def list_users(user: dict = Depends(require_admin)):
    return {"users": [
        {"username": u, "role": d.get("role","operator"), "desc": d.get("desc",""),
         "enabled": d.get("enabled",True), "created": d.get("created","-")}
        for u, d in USERS.items()
    ]}

@app.post("/api/auth/users")
async def create_user(body: dict, user: dict = Depends(require_admin)):
    from .auth import add_user
    ok = add_user(body.get("username",""), body.get("password",""), body.get("role","operator"), body.get("desc",""))
    if not ok:
        raise HTTPException(400, "用户名已存在")
    return {"status": "created"}

@app.delete("/api/auth/users/{username}")
async def delete_user(username: str, user: dict = Depends(require_admin)):
    if username in USERS:
        del USERS[username]
    return {"status": "deleted"}

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

@app.get("/api/health/mqtt")
async def health_mqtt():
    """MQTT Broker 探活 — TCP端口 (MQTT回传由 packet_bridge 异步处理)"""
    import socket, time as _t
    t0 = _t.time()
    try:
        s = socket.socket(); s.settimeout(1)
        r = s.connect_ex((cfg.mqtt.host, cfg.mqtt.port)); s.close()
        ms = round((_t.time() - t0) * 1000)
        return {"ok": r == 0, "ms": ms, "host": f"{cfg.mqtt.host}:{cfg.mqtt.port}", "broker": "EMQX"}
    except Exception as e:
        return {"ok": False, "ms": 0, "error": str(e)}


# ---- Device ----

@app.get("/api/devices")
async def list_devices(station_id: Optional[str] = None, device_type: Optional[str] = None,
                       page: int = 1, page_size: int = 20):
    devices, total = await pg_store.list_devices(station_id, device_type, page=page, page_size=page_size)
    if total == 0:
        # Fallback: parse_lite 有种子数据
        try:
            from .parse_lite import parse_query
            r = parse_query("Device", {"limit": page_size, "skip": (page-1)*page_size})
            return {
                "total": r.get("count", 0),
                "page": page, "page_size": page_size,
                "devices": [{
                    "device_id": d.get("devaddr",""), "device_name": d.get("name",""),
                    "devaddr": d.get("devaddr",""), "name": d.get("name",""),
                    "device_type": d.get("device_type",""), "protocol": d.get("protocol",""),
                    "ip": d.get("ip",""), "status": d.get("status","offline"),
                    "station_id": d.get("basedata",{}).get("station","") if isinstance(d.get("basedata"),dict) else "",
                    "manufacturer": (d.get("basedata") or {}).get("manufacturer","") if isinstance(d.get("basedata"),dict) else "",
                    "model": (d.get("basedata") or {}).get("model","") if isinstance(d.get("basedata"),dict) else "",
                    "product": d.get("product"),
                    "productName": d.get("device_type",""),
                } for d in r.get("results",[])]
            }
        except: pass
    return {
        "total": total,
        "page": page, "page_size": page_size,
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
        # Fallback to parse_lite
        try:
            from .parse_lite import parse_get
            d = parse_get("Device", device_id)
            if d:
                return {
                    "device_id": d.get("devaddr", device_id), "device_name": d.get("name", ""),
                    "devaddr": d.get("devaddr", ""), "name": d.get("name", ""),
                    "status": d.get("status", "offline"), "protocol": d.get("protocol", ""),
                    "device_type": d.get("device_type", ""), "ip": d.get("ip", ""),
                    "manufacturer": (d.get("basedata") or {}).get("manufacturer","") if isinstance(d.get("basedata"),dict) else "",
                    "model": (d.get("basedata") or {}).get("model","") if isinstance(d.get("basedata"),dict) else "",
                    "isEnable": d.get("isEnable", True),
                }
        except: pass
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
        {"id": "a11_8889",        "name": "A11 CNPC 网关",      "protocol": "A11 CNPC",   "port": 8889, "device": "油气田RTU",       "itemCount": 142},
    ]
    for sim in simulators:
        sim["status"] = "running" if _check_port(sim["port"], ttl=15) else "stopped"
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

# Modbus 功能码表
_MODBUS_FC = {
    1:'读线圈', 2:'读离散输入', 3:'读保持寄存器', 4:'读输入寄存器',
    5:'写单线圈', 6:'写单寄存器', 15:'写多线圈', 16:'写多寄存器',
}

def _parse_modbus_tcp_frame(raw: bytes) -> dict:
    """解析 Modbus TCP 帧，返回结构化字段"""
    if len(raw) < 8:
        return {}
    tid = int.from_bytes(raw[0:2], 'big')
    pid = int.from_bytes(raw[2:4], 'big')
    length = int.from_bytes(raw[4:6], 'big')
    uid = raw[6]
    fc = raw[7]
    info = {'tid': tid, 'pid': pid, 'len': length, 'slave': uid, 'fc': fc, 'fc_name': _MODBUS_FC.get(fc, f'FC{fc:02X}')}
    # 解析常见功能码
    if fc in (1,2,3,4) and len(raw) >= 10:
        addr = int.from_bytes(raw[8:10], 'big')
        cnt = int.from_bytes(raw[10:12], 'big') if len(raw) >= 12 else 0
        info['addr'] = addr; info['count'] = cnt
        # 响应数据
        if len(raw) > 9 and raw[7] == fc and len(raw) >= 9 + raw[8]:
            byte_cnt = raw[8]
            vals = list(raw[9:9+byte_cnt])
            info['values'] = vals
    elif fc == 6 and len(raw) >= 12:
        info['addr'] = int.from_bytes(raw[8:10], 'big')
        info['value'] = int.from_bytes(raw[10:12], 'big')
    elif fc == 16 and len(raw) >= 13:
        info['addr'] = int.from_bytes(raw[8:10], 'big')
        info['count'] = int.from_bytes(raw[10:12], 'big')
    return info

def _parse_iec104_frame(raw: bytes) -> dict:
    """解析 IEC 60870-5-104 帧"""
    if len(raw) < 6 or raw[0] != 0x68:
        return {}
    apdu_len = raw[1]
    ctrl = raw[2:6]
    info = {'start': 0x68, 'apdu_len': apdu_len, 'ctrl': ctrl.hex(' ')}
    # ASDU (类型标识 + 可变结构限定词 + 传输原因 + 公共地址)
    if len(raw) >= 14:
        type_id = raw[6]
        vsq = raw[7]
        cot = int.from_bytes(raw[8:10], 'little')
        com_addr = int.from_bytes(raw[10:12], 'little')
        info['type_id'] = type_id; info['vsq'] = vsq
        info['cot'] = cot; info['com_addr'] = com_addr
        # 信息对象地址 + 值
        if len(raw) >= 17:
            ioa = int.from_bytes(raw[12:15], 'little')
            info['ioa'] = ioa
            if type_id in (13, 36) and len(raw) >= 21:  # 短浮点
                import struct
                info['value'] = round(struct.unpack('<f', raw[15:19])[0], 3)
    return info

def _parse_a11_frame(raw: bytes) -> dict:
    """解析 A11 协议帧 (CNPC 油气生产物联网)"""
    if len(raw) < 15 or raw[7:11] != b'\x6a\x6a\x5a\x5a':
        return {}
    tid = int.from_bytes(raw[0:2], 'big')
    uid = raw[6]
    msg_type = int.from_bytes(raw[11:13], 'little')
    msg_sub = int.from_bytes(raw[13:15], 'little')
    payload_len = int.from_bytes(raw[4:6], 'big') - 9
    return {'tid': tid, 'slave': uid, 'msg_type': f'0x{msg_type:04X}',
            'msg_sub': f'0x{msg_sub:04X}', 'payload_len': max(payload_len, 0),
            'magic': 'jjZZ'}

def log_packet(device_id: str, direction: str, raw: bytes):
    """记录报文到全局日志（含 Modbus/IEC104/A11 帧解析）"""
    import time as _time
    if len(raw) >= 11 and raw[7:11] == b'\x6a\x6a\x5a\x5a':
        proto = "a11"
        parsed = _parse_a11_frame(raw)
    elif len(raw) > 1 and raw[0] == 0x68:
        proto = "iec104"
        parsed = _parse_iec104_frame(raw)
    else:
        proto = "modbus_tcp"
        parsed = _parse_modbus_tcp_frame(raw)
    entry = {"ts": _time.time(), "device": device_id, "dir": direction,
             "len": len(raw), "hex": raw.hex(' '),
             "proto": proto, "parsed": parsed}
    _packet_log.append(entry)
    if len(_packet_log) > 500:
        _packet_log[:] = _packet_log[-300:]
    # 持久化到 SQLite
    try:
        import sqlite3, os
        _db = sqlite3.connect(os.path.join(cfg.data_dir, 'local.db'))
        _db.execute("INSERT INTO packet_log (ts, device, dir, len, proto, hex, parsed) VALUES (?,?,?,?,?,?,?)",
                    [entry["ts"], entry["device"], entry["dir"], entry["len"],
                     entry["proto"], entry["hex"], str(entry["parsed"])])
        _db.commit(); _db.close()
    except: pass

# 注入到协议适配器（在 lifespan 中延迟调用，确保协议模块已加载）
import sys as _sys
def _inject_packet_logger():
    for mod_name in ('src.protocols.modbus_tcp', 'src.protocols.iec104_client', 'src.protocols.opcua_client', 'src.protocols.a11'):
        if mod_name in _sys.modules:
            try: _sys.modules[mod_name].set_packet_logger(log_packet)
            except: pass

@app.get("/api/packets")
async def get_packets(device_id: Optional[str] = None, limit: int = 50):
    """获取报文日志（含解析字段）"""
    logs = _packet_log
    if device_id:
        logs = [p for p in _packet_log if p["device"] == device_id]
    return {"total": len(logs), "packets": logs[-limit:]}

# 回放状态
_replay_status = {"running": False, "total": 0, "injected": 0, "file": "", "started": ""}

@app.post("/api/packets/replay")
async def packet_replay(file_path: str = "", port: int = 8889, device_id: str = "replay",
                        limit: int = 500, speed: float = 1.0):
    """从 pcapng 回放报文（按原始时序）— 用于生产IO模拟"""
    import threading as _th, time as _t_replay
    if _replay_status["running"]:
        return {"status": "error", "msg": "回放已在运行中"}
    import os as _os_replay
    if not file_path or not _os_replay.path.exists(file_path):
        return {"status": "error", "msg": f"文件不存在: {file_path}"}

    def _do_replay():
        global _replay_status
        _replay_status = {"running": True, "total": 0, "injected": 0,
                          "file": file_path, "started": _t_replay.strftime("%H:%M:%S")}
        try:
            from scapy.all import PcapReader, Raw, TCP, IP
            # TCP 流重组: (src_ip, src_port, dst_ip, dst_port) -> bytes
            flows = {}
            reader = PcapReader(file_path)
            prev_ts = None
            for i, pkt in enumerate(reader):
                if _replay_status["total"] >= limit:
                    break
                if not pkt.haslayer(TCP):
                    continue
                if pkt[TCP].sport != port and pkt[TCP].dport != port:
                    continue
                if not pkt.haslayer(Raw):
                    continue
                raw = bytes(pkt[Raw].load)
                if len(raw) < 10:
                    continue

                # TCP 流重组
                flow_key = (pkt[IP].src, pkt[TCP].sport, pkt[IP].dst, pkt[TCP].dport)
                if pkt[TCP].sport != port:
                    flow_key = (pkt[IP].dst, pkt[TCP].dport, pkt[IP].src, pkt[TCP].sport)
                buf = flows.get(flow_key, b'') + raw

                # 尝试从缓冲区提取完整帧
                while len(buf) >= 15:
                    if buf[7:11] != b'\x6a\x6a\x5a\x5a':
                        buf = buf[1:]  # 跳过非A11数据
                        continue
                    mblen = int.from_bytes(buf[4:6], 'big') + 6
                    if mblen > len(buf) or mblen < 15:
                        break  # 帧不完整，等待更多数据
                    frame = buf[:mblen]
                    buf = buf[mblen:]

                    # 按原始时序延时
                    if prev_ts is not None and speed > 0:
                        delay = (float(pkt.time) - prev_ts) / speed
                        if 0 < delay < 10:
                            _t_replay.sleep(delay)
                    prev_ts = float(pkt.time)

                    direc = 'RX' if pkt[TCP].sport == port else 'TX'
                    log_packet(device_id, direc, frame)
                    # IO接管：回放数据同时写入 SQLite 时序库
                    try:
                        import sqlite3 as _sq, os as _os_io
                        _db = _sq.connect(_os_io.path.join(cfg.data_dir, 'telemetry.db'))
                        uid = frame[6] if len(frame) > 6 else 0
                        is_a11 = len(frame) >= 15 and frame[7:11] == b'\x6a\x6a\x5a\x5a'
                        msg_type = int.from_bytes(frame[11:13], 'little') if is_a11 else 0
                        val = struct.unpack('<f', frame[19:23])[0] if len(frame) >= 23 else 0.0
                        _db.execute(
                            "INSERT INTO telemetry (ts, device_id, point_id, point_name, value, unit, quality, device_type, station_id) VALUES (?,?,?,?,?,?,?,?,?)",
                            [int(pkt.time), f'a11_{uid}', f'0x{msg_type:04X}' if is_a11 else 'raw',
                             f'A11测点_0x{msg_type:04X}' if is_a11 else 'TCP数据',
                             round(val,4), '', 0, 'rtu', 'a11_field'])
                        _db.commit(); _db.close()
                    except: pass
                    _replay_status["injected"] += 1
                    _replay_status["total"] += 1
                flows[flow_key] = buf
        except Exception as e:
            _replay_status["error"] = str(e)
        finally:
            _replay_status["running"] = False

    _th.Thread(target=_do_replay, daemon=True).start()
    return {"status": "ok", "msg": f"回放已启动: {file_path}", "file": file_path}

@app.post("/api/packets/replay-full")
async def replay_full_pipeline(file_path: str = "", port: int = 8889, limit: int = 500, speed: float = 10):
    """完整IO接管回放 — 报文→解析→采集器→告警→存库→推送"""
    import threading as _th, time as _t_rf
    if not file_path or not os.path.exists(file_path):
        return {"status": "error", "msg": f"文件不存在: {file_path}"}

    _replay_status.update({"running": True, "total": 0, "injected": 0,
                           "file": file_path, "started": _t_rf.strftime("%H:%M:%S"),
                           "mode": "pipeline", "devices": 0, "alarms": 0})

    def _do_pipeline_replay():
        try:
            from scapy.all import PcapReader, Raw, TCP, IP
            flows = {}
            reader = PcapReader(file_path)
            prev_ts = None
            for i, pkt in enumerate(reader):
                if _replay_status["total"] >= limit: break
                if not pkt.haslayer(TCP) or not pkt.haslayer(Raw): continue
                if pkt[TCP].sport != port and pkt[TCP].dport != port: continue
                raw = bytes(pkt[Raw].load)
                if len(raw) < 15: continue

                # TCP 流重组 + 帧提取
                flow_key = (pkt[IP].src, pkt[TCP].sport, pkt[IP].dst, pkt[TCP].dport)
                if pkt[TCP].sport != port:
                    flow_key = (pkt[IP].dst, pkt[TCP].dport, pkt[IP].src, pkt[TCP].sport)
                buf = flows.get(flow_key, b'') + raw

                while len(buf) >= 15:
                    if buf[7:11] != b'\x6a\x6a\x5a\x5a':
                        buf = buf[1:]; continue
                    mblen = int.from_bytes(buf[4:6], 'big') + 6
                    if mblen > len(buf) or mblen < 15: break
                    frame = buf[:mblen]; buf = buf[mblen:]

                    if prev_ts and speed > 0:
                        delay = (float(pkt.time) - prev_ts) / speed
                        if 0 < delay < 10: _t_rf.sleep(delay)
                    prev_ts = float(pkt.time)

                    # 日志
                    uid = frame[6]
                    did = f'a11_slave_{uid}'
                    msg_type = int.from_bytes(frame[11:13], 'little')
                    log_packet(did, 'RX', frame)

                    # 模拟采集器管道: 解析→入库→告警
                    if msg_type in (0x0539, 0x056c):
                        try:
                            value = struct.unpack('<f', frame[19:23])[0] if len(frame)>=23 else 0.0
                            pv = type('PV',(),{'device_id':did,'point_id':'a11_data','point_name':'A11测点',
                                'value':round(value,4),'unit':'','quality':0,'data_type':'float32'})()
                            td_store.batch_insert_sync([{'device_id':did,'point_id':'a11_data',
                                'point_name':'A11测点','value':value,'unit':'','quality':0,
                                'device_type':'rtu','station_id':'a11_field'}])
                        except: pass

                    _replay_status["injected"] += 1
                    _replay_status["total"] += 1
                flows[flow_key] = buf
        except Exception as e:
            _replay_status["error"] = str(e)
        finally:
            _replay_status["running"] = False

    _th.Thread(target=_do_pipeline_replay, daemon=True).start()
    return {"status": "ok", "msg": f"全管道回放已启动: {file_path}", "mode": "pipeline"}

@app.get("/api/packets/replay/status")
async def replay_status():
    """回放进度"""
    return _replay_status

# ---- 实时抓包 ----
_capture_status = {"running": False, "packets": 0, "bytes": 0, "interface": "", "ports": [], "started": ""}

# 抓包服务代理 (转发到 :8765)
@app.get("/api/proxy/capture/{path:path}")
async def proxy_capture_get(path: str, request: Request):
    """代理 GET 请求到抓包服务 :8765"""
    import httpx
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(f"http://127.0.0.1:8765/api/{path}", params=dict(request.query_params))
            return JSONResponse(content=r.json())
    except: return JSONResponse({"error":"capture service unavailable"}, status_code=503)

@app.get("/api/capture/interfaces")
async def capture_interfaces():
    """列出可用网口"""
    try:
        from scapy.all import get_if_list, IFACES
        return {"interfaces": get_if_list()}
    except:
        return {"interfaces": ["default"]}

# 流跟踪表: flow_key → {src_ip, dst_ip, src_port, dst_port, packets, bytes, proto, last_seen}
_flow_table: dict = {}

@app.post("/api/capture/start")
async def capture_start(iface: str = "", ports: str = "502,2404,4840,8889", snaplen: int = 1500):
    """启动实时网口抓包（按 IP+端口归类流）"""
    import threading as _th2, time as _t2
    global _flow_table
    if _capture_status["running"]:
        return {"status": "error", "msg": "抓包已在运行"}

    port_list = [int(p.strip()) for p in ports.split(",") if p.strip().isdigit()]
    _capture_status.update({"running": True, "packets": 0, "bytes": 0,
                            "interface": iface or "default", "ports": port_list,
                            "started": _t2.strftime("%H:%M:%S")})
    _flow_table = {}

    def _do_capture():
        try:
            from scapy.all import sniff, Raw, TCP, IP
            def _process(pkt):
                if not pkt.haslayer(TCP) or not pkt.haslayer(Raw): return
                for port in port_list:
                    if pkt[TCP].sport == port or pkt[TCP].dport == port:
                        raw = bytes(pkt[Raw].load)
                        if len(raw) < 10: return
                        direc = 'RX' if pkt[TCP].sport == port else 'TX'
                        src_ip = pkt[IP].src; dst_ip = pkt[IP].dst
                        sp = pkt[TCP].sport; dp = pkt[TCP].dport
                        flow_key = f"{src_ip}:{sp}→{dst_ip}:{dp}"
                        # 流跟踪
                        if flow_key not in _flow_table:
                            _flow_table[flow_key] = {"src_ip":src_ip,"dst_ip":dst_ip,
                                "src_port":sp,"dst_port":dp,"packets":0,"bytes":0,"proto":"","last_seen":0}
                        f = _flow_table[flow_key]
                        f["packets"] += 1; f["bytes"] += len(raw)
                        f["last_seen"] = _t2.time()
                        # 协议检测
                        if raw[7:11] == b'\x6a\x6a\x5a\x5a': f["proto"] = "A11"
                        elif raw[7] in (1,2,3,4,5,6,15,16): f["proto"] = "Modbus"
                        elif raw[0] == 0x68: f["proto"] = "IEC104"
                        device_id = f"{src_ip}:{sp}" if direc == 'RX' else f"{dst_ip}:{dp}"
                        log_packet(device_id, direc, raw)
                        _capture_status["packets"] += 1
                        _capture_status["bytes"] += len(raw)
                        return
            kwargs = {"prn": _process, "store": False, "count": 0}
            if iface: kwargs["iface"] = iface
            sniff(**kwargs)
        except Exception as e:
            _capture_status["error"] = str(e)
        finally:
            _capture_status["running"] = False

    _th2.Thread(target=_do_capture, daemon=True).start()
    return {"status": "ok", "msg": f"抓包已启动: {iface or 'default'} → {port_list}", "ports": port_list}

@app.post("/api/capture/stop")
async def capture_stop():
    """停止抓包"""
    _capture_status["running"] = False
    return {"status": "ok", "msg": "抓包已停止", "packets": _capture_status["packets"]}

@app.get("/api/capture/status")
async def capture_status():
    """抓包状态"""
    return _capture_status

@app.get("/api/capture/flows")
async def capture_flows():
    """流跟踪表 — 按 IP+端口归类的会话"""
    flows = list(_flow_table.values())
    flows.sort(key=lambda f: -f["packets"])
    return {"total": len(flows), "flows": flows}

# 文件监听模式: 监控目录自动导入新 pcapng (配合 tshark 循环输出)
_watch_status = {"running": False, "dir": "", "imported": 0, "started": ""}

@app.post("/api/capture/watch")
async def capture_watch_dir(directory: str = "", port: int = 8889, interval: int = 10):
    """监控目录，自动导入新 pcapng 文件 (配合 Wireshark/tshark)"""
    import threading as _thw, time as _tw, os as _osw
    d = directory or os.path.join(cfg.data_dir, "captures")
    _osw.makedirs(d, exist_ok=True)
    _watch_status.update({"running": True, "dir": d, "imported": 0, "started": _tw.strftime("%H:%M:%S")})

    def _do_watch():
        seen = set()
        while _watch_status["running"]:
            try:
                for f in sorted(_osw.listdir(d)):
                    if f.endswith('.pcapng') or f.endswith('.pcap'):
                        fp = _osw.path.join(d, f)
                        if fp in seen: continue
                        seen.add(fp)
                        from scapy.all import PcapReader, Raw, TCP, IP
                        for pkt in PcapReader(fp):
                            if not pkt.haslayer(TCP) or not pkt.haslayer(Raw): continue
                            if pkt[TCP].sport != port and pkt[TCP].dport != port: continue
                            raw = bytes(pkt[Raw].load)
                            if len(raw) < 10: continue
                            log_packet(f'watch_{port}', 'RX' if pkt[TCP].sport == port else 'TX', raw)
                            _watch_status["imported"] += 1
                _tw.sleep(interval)
            except Exception as e:
                _watch_status["error"] = str(e)
                _tw.sleep(interval)
        _watch_status["running"] = False

    _thw.Thread(target=_do_watch, daemon=True).start()
    return {"status": "ok", "msg": f"监控目录: {d}", "dir": d, "port": port}

@app.post("/api/capture/watch-stop")
async def capture_watch_stop():
    _watch_status["running"] = False
    return {"status": "ok", "imported": _watch_status["imported"]}

@app.get("/api/capture/watch-status")
async def capture_watch_status():
    return _watch_status

@app.post("/api/packets/import")
async def packet_import(file_path: str = "", device_id: str = "import", limit: int = 500):
    """从 pcapng/JSON 文件导入报文到日志"""
    count = 0
    try:
        if file_path.endswith('.json'):
            import json as _json
            with open(file_path, 'r', encoding='utf-8') as f:
                data = _json.load(f)
            msgs = data.get('messages', data.get('packets', []))
            for m in msgs[:limit]:
                raw = bytes.fromhex(m.get('hex','').replace(' ',''))
                if raw:
                    log_packet(device_id, m.get('dir','TX'), raw)
                    count += 1
        elif file_path.endswith('.pcapng') or file_path.endswith('.pcap'):
            try:
                from scapy.all import rdpcap, Raw
                pkts = rdpcap(file_path)
                for p in pkts[:limit]:
                    if p.haslayer(Raw):
                        raw = bytes(p[Raw].load)
                        # 检测 A11 魔术字
                        if len(raw) > 10 and raw[7:11] == b'\x6a\x6a\x5a\x5a':
                            log_packet(device_id, 'RX', raw); count += 1
                        elif p.haslayer('TCP') and (p['TCP'].sport == 8889 or p['TCP'].dport == 8889):
                            log_packet(device_id, 'RX' if p['TCP'].sport == 8889 else 'TX', raw); count += 1
            except ImportError:
                return {"status": "error", "msg": "需要安装 scapy: pip install scapy"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}
    return {"status": "ok", "imported": count, "msg": f"已导入 {count} 条报文"}

@app.get("/api/packets/history")
async def packet_history(device_id: Optional[str] = None, limit: int = 100):
    """从 SQLite 查询历史报文"""
    import sqlite3, os
    db_path = os.path.join(cfg.data_dir, 'local.db')
    if not os.path.exists(db_path):
        return {"total": 0, "packets": []}
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    try:
        if device_id:
            rows = db.execute("SELECT * FROM packet_log WHERE device=? ORDER BY id DESC LIMIT ?",
                            [device_id, limit]).fetchall()
        else:
            rows = db.execute("SELECT * FROM packet_log ORDER BY id DESC LIMIT ?",
                            [limit]).fetchall()
        total = db.execute("SELECT COUNT(*) FROM packet_log").fetchone()[0]
        return {"total": total, "packets": [dict(r) for r in rows]}
    finally:
        db.close()

@app.get("/api/packets/analysis")
async def packet_analysis():
    """报文统计分析"""
    if not _packet_log:
        return {"total": 0, "fc_dist": {}, "devices": [], "tx_count": 0, "rx_count": 0, "bytes": 0}

    fc_dist = {}
    tx_count = 0; rx_count = 0; total_bytes = 0
    for p in _packet_log:
        fc = p.get("parsed", {}).get("fc_name", "其他")
        fc_dist[fc] = fc_dist.get(fc, 0) + 1
        if p["dir"] == "TX": tx_count += 1
        else: rx_count += 1
        total_bytes += p["len"]

    return {
        "total": len(_packet_log),
        "fc_dist": dict(sorted(fc_dist.items(), key=lambda x: -x[1])[:8]),
        "tx_count": tx_count, "rx_count": rx_count,
        "bytes": total_bytes,
    }

@app.post("/api/packets/inject")
async def packet_inject(device_id: str, direction: str, hex_data: str):
    """注入测试报文到日志（用于协议分析验证）"""
    try:
        raw = bytes.fromhex(hex_data.replace(' ',''))
        log_packet(device_id, direction.upper(), raw)
        return {"status": "ok", "device_id": device_id, "dir": direction, "len": len(raw)}
    except Exception as e:
        raise HTTPException(400, f"无效的十六进制数据: {e}")

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
    await pg_store.create_push_target(body.model_dump())
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


# ---- Maintenance ----

@app.get("/api/maintenance/db-stats")
async def db_stats():
    """数据库统计"""
    import sqlite3, os
    td_db = os.path.join(cfg.data_dir, "telemetry.db")
    telemetry_rows = 0
    if os.path.exists(td_db):
        try:
            db = sqlite3.connect(td_db)
            telemetry_rows = db.execute("SELECT COUNT(*) FROM telemetry").fetchone()[0]
            db.close()
        except: pass
    return {"telemetry_rows": telemetry_rows, "sqlite": "正常" if telemetry_rows > 0 else "空库"}


# ---- Channel Management (通道管理) ----

# 端口探活缓存 (port → (ok, timestamp), TTL=15s)
_port_cache: Dict[int, tuple] = {}

def _check_port(port: int, ttl: float = 15) -> bool:
    """检查端口是否可达（带缓存）"""
    import time as _t
    now = _t.time()
    if port in _port_cache and now - _port_cache[port][1] < ttl:
        return _port_cache[port][0]
    try:
        s = socket.socket(); s.settimeout(0.5)
        ok = s.connect_ex(("127.0.0.1", port)) == 0; s.close()
    except:
        ok = False
    _port_cache[port] = (ok, now)
    return ok

# 协议通道定义（channel_list 和 simulators_status 共用）
_PROTO_PORTS = [
    ("modbus_tcp", "Modbus TCP", "光伏逆变器/储能/充电桩", 502),
    ("modbus_rtu", "Modbus RTU", "电表/传感器串口采集", None),
    ("iec104", "IEC 60870-5-104", "电力远动/储能PCS", 2404),
    ("opcua", "OPC UA", "充电桩/PLC统一架构", 4840),
    ("opcda", "OPC DA", "Windows COM/DCOM数据源", 9090),
    ("a11", "A11 CNPC", "中石油油气生产物联网", 8889),
    ("mqtt", "MQTT Broker", "消息推送/实时数据", 1883),
]

@app.get("/api/channels")
async def channel_list():
    """获取所有采集通道状态"""
    import socket as _sock
    channels = []

    # === 协议通道总览 ===
    # 单次遍历 _adapters 构建 proto_key → {stats, packets, device_count, connected_count}
    proto_map = {}
    for did, adapter in collector._adapters.items():
        pk = adapter.protocol_type
        if pk not in proto_map:
            proto_map[pk] = {"stats": [], "packets": [], "device_count": 0, "connected_count": 0}
        pm = proto_map[pk]
        pm["stats"].append(collector._stats.get(did, {"success": 0, "fail": 0}))
        pm["packets"].extend([p for p in _packet_log if p["device"] == did])
        pm["device_count"] += 1
        if adapter._connected:
            pm["connected_count"] += 1

    for proto_key, proto_name, proto_desc, port in _PROTO_PORTS:
        pm = proto_map.get(proto_key, {"stats":[], "packets":[], "device_count":0, "connected_count":0})
        total_success = sum(s.get("success", 0) for s in pm["stats"])
        total_fail = sum(s.get("fail", 0) for s in pm["stats"])

        # 端口探活（缓存 15s）
        port_ok = True if proto_key == "mqtt" else _check_port(port, ttl=15)

        channels.append({
            "device_id": f"proto_{proto_key}",
            "device_name": proto_name,
            "protocol": proto_key,
            "status": "online" if (pm["connected_count"] > 0 or port_ok) else ("inactive" if port_ok else "offline"),
            "connected": pm["connected_count"] > 0 or port_ok,
            "success": total_success,
            "fail": total_fail,
            "device_type": proto_desc,
            "device_count": pm["device_count"],
            "connected_count": pm["connected_count"],
            "config": {"host": "127.0.0.1", "port": str(port or "")},
            "packet_count": len(pm["packets"]),
            "recent_packets": pm["packets"][-5:],
            "category": "protocol",
        })

    # 存储通道
    use_sqlite = getattr(cfg, 'storage_mode', 'parse') == 'sqlite' or getattr(pg_store, '_use_sqlite', False)
    channels.append({
        "device_id": "storage_td", "device_name": "TDengine 时序库", "protocol": "tdengine",
        "status": "online" if not td_store._is_fallback else "离线(降级SQLite)",
        "connected": not td_store._is_fallback,
        "success": 0, "fail": 0, "device_type": "storage",
        "config": {"host": cfg.tdengine.host, "port": str(cfg.tdengine.port)},
        "packet_count": 0, "recent_packets": [],
        "category": "storage",
    })

    # 关系存储：Parse 或 SQLite
    if use_sqlite:
        channels.append({
            "device_id": "storage_sqlite", "device_name": "SQLite 关系库 (单机版)", "protocol": "sqlite",
            "status": "online", "connected": True,
            "success": 0, "fail": 0, "device_type": "storage",
            "config": {"host": "本地", "port": cfg.sqlite_path},
            "packet_count": 0, "recent_packets": [],
            "category": "storage",
        })
    else:
        channels.append({
            "device_id": "storage_parse", "device_name": "Parse Server 关系库", "protocol": "parse-server",
            "status": "online" if pg_store._connected else "offline",
            "connected": pg_store._connected,
            "success": 0, "fail": 0, "device_type": "storage",
            "config": {"host": "localhost", "port": "1337/parse"},
            "packet_count": 0, "recent_packets": [],
            "category": "storage",
        })

    # 推送通道
    push_targets = await pg_store.list_push_targets()
    for pt in push_targets:
        channels.append({
            "device_id": f"push_{pt.target_id}", "device_name": pt.target_name,
            "protocol": pt.target_type, "status": "online" if pt.enabled else "offline",
            "connected": pt.enabled,
            "success": 0, "fail": 0, "device_type": "push",
            "config": {"host": pt.endpoint or pt.config.get("host",""), "port": str(pt.config.get("port",""))},
            "packet_count": 0, "recent_packets": [],
            "category": "push",
        })

    return {"total": len(channels), "channels": channels, "categories": {
        "protocol": sum(1 for c in channels if c["category"] == "protocol"),
        "storage": sum(1 for c in channels if c["category"] == "storage"),
        "push": sum(1 for c in channels if c["category"] == "push"),
    }}

@app.post("/api/channels/{device_id}/reconnect")
async def channel_reconnect(device_id: str):
    """重新连接通道"""
    await collector.remove_device(device_id)
    dev = await pg_store.get_device(device_id)
    if dev:
        await collector.add_device(dev)
        return {"status": "reconnected"}
    raise HTTPException(404, "设备不存在")


# ---- Safety Rules API ----

@app.get("/api/safety/rules")
async def safety_rules():
    """列出所有安全规则"""
    rules = safety_pipeline.list_rules()
    return {"total": len(rules), "rules": [
        {"rule_id": r.rule_id, "name": r.name, "level": r.level.value if hasattr(r.level,'value') else str(r.level),
         "rule_type": r.rule_type.value if hasattr(r.rule_type,'value') else str(r.rule_type)} for r in rules
    ]}

@app.get("/api/safety/events")
async def safety_events():
    """活跃安全事件"""
    events = safety_pipeline.get_active_events()
    return {"total": len(events), "events": events}

@app.post("/api/safety/events/{event_id}/acknowledge")
async def safety_ack(event_id: str):
    safety_pipeline.acknowledge(event_id)
    return {"status": "acknowledged"}

@app.post("/api/safety/esd/{rule_id}")
async def safety_esd(rule_id: str):
    safety_pipeline.trigger_esd(rule_id, "api")
    return {"status": "esd_triggered"}

# ---- PHM API ----

@app.get("/api/phm/evaluate/{device_id}")
async def phm_evaluate(device_id: str):
    try:
        result = phm_engine.evaluate(device_id)
        return {"device_id": device_id, "health_score": result.health_score,
                "health_level": result.health_level, "fault_modes": [
                    {"mode": f.mode.value, "probability": round(f.probability, 3)} for f in result.fault_modes[:3]
                ] if result.fault_modes else []}
    except Exception as e:
        return {"device_id": device_id, "error": str(e)}

@app.get("/api/phm/stats")
async def phm_stats():
    return phm_engine.get_stats()

# ---- Product Model API ----

@app.get("/api/products/{product_type}/model")
async def product_model(product_type: str):
    """获取产品物模型"""
    model = get_product_model(product_type)
    if not model:
        raise HTTPException(404, f"未知产品类型: {product_type}")
    return model

# ---- 物模型增删改 ----
class PointUpsert(BaseModel):
    point_id: str; point_name: str = ""; data_type: str = "float32"
    unit: str = ""; min_val: float = 0; max_val: float = 9999
    category: str = "electrical"; register_addr: str = ""
    alarm_low: Optional[float] = None; alarm_high: Optional[float] = None

@app.post("/api/products/{product_type}/model/points")
async def product_add_point(product_type: str, body: PointUpsert):
    """添加物模型测点"""
    model = get_product_model(product_type)
    if not model:
        raise HTTPException(404, f"未知产品类型: {product_type}")
    pts = model.setdefault("points", {})
    pts[body.point_id] = {
        "name": body.point_name or body.point_id,
        "type": body.data_type, "unit": body.unit,
        "min": body.min_val, "max": body.max_val,
        "category": body.category,
        "register_addr": body.register_addr,
        "alarm_low": body.alarm_low, "alarm_high": body.alarm_high,
    }
    return {"status": "created", "point_id": body.point_id}

@app.put("/api/products/{product_type}/model/points/{point_id}")
async def product_update_point(product_type: str, point_id: str, body: PointUpsert):
    """更新物模型测点"""
    model = get_product_model(product_type)
    if not model or point_id not in model.get("points", {}):
        raise HTTPException(404, "测点不存在")
    model["points"][point_id] = {
        "name": body.point_name or point_id, "type": body.data_type,
        "unit": body.unit, "min": body.min_val, "max": body.max_val,
        "category": body.category, "register_addr": body.register_addr,
        "alarm_low": body.alarm_low, "alarm_high": body.alarm_high,
    }
    return {"status": "updated"}

@app.delete("/api/products/{product_type}/model/points/{point_id}")
async def product_delete_point(product_type: str, point_id: str):
    """删除物模型测点"""
    model = get_product_model(product_type)
    if not model or point_id not in model.get("points", {}):
        raise HTTPException(404, "测点不存在")
    del model["points"][point_id]
    return {"status": "deleted"}


# ---- Simulator start/stop ----
import subprocess as _sp
import os as _os

_sim_proc: Optional[_sp.Popen] = None

@app.post("/api/simulators/start-all")
async def simulators_start_all():
    """启动全部模拟器（子进程运行 simulators/run_all.py）"""
    global _sim_proc
    try:
        # 兼容 PyInstaller 打包和开发模式
        if getattr(sys, 'frozen', False):
            script = _Path(sys._MEIPASS) / "simulators" / "run_all.py"
        else:
            script = _Path(__file__).resolve().parent.parent / "simulators" / "run_all.py"
        if not script.exists():
            return {"status": "error", "msg": f"脚本不存在: {script}"}
        if _sim_proc and _sim_proc.poll() is None:
            return {"status": "ok", "msg": "模拟器已在运行中"}
        _sim_proc = _sp.Popen(
            ["python", str(script)],
            stdout=_sp.DEVNULL, stderr=_sp.DEVNULL,
            cwd=str(script.parent.parent),
        )
        return {"status": "ok", "msg": "模拟器启动中"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}

@app.post("/api/simulators/stop-all")
async def simulators_stop_all():
    """停止全部模拟器"""
    global _sim_proc
    try:
        if _sim_proc and _sim_proc.poll() is None:
            _sim_proc.terminate()
            _sim_proc = None
            return {"status": "ok", "msg": "模拟器已停止"}
        # fallback: kill by port
        for port in [502, 1502, 2502, 2404, 4840, 9090]:
            _os.system(f'taskkill /F /FI "TCP port eq {port}" 2>nul')
        return {"status": "ok", "msg": "模拟器已停止"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}

@app.post("/api/seed-demo")
async def seed_demo_devices():
    """一键创建演示设备 + 点位（对接本地模拟器）"""
    demo_devices = [
        {"device_id":"inv_01","device_name":"光伏逆变器#1","device_type":"inverter","protocol":"modbus_tcp","station_id":"station_01","comm_params":{"host":"127.0.0.1","port":502,"slave_id":1}},
        {"device_id":"pcs_01","device_name":"储能PCS#1","device_type":"pcs","protocol":"modbus_tcp","station_id":"station_01","comm_params":{"host":"127.0.0.1","port":1502,"slave_id":1}},
        {"device_id":"charger_01","device_name":"充电桩#1","device_type":"charger","protocol":"modbus_tcp","station_id":"station_01","comm_params":{"host":"127.0.0.1","port":2502,"slave_id":1}},
        {"device_id":"meter_01","device_name":"电表#1","device_type":"meter","protocol":"modbus_tcp","station_id":"station_01","comm_params":{"host":"127.0.0.1","port":502,"slave_id":2}},
        {"device_id":"iec104_01","device_name":"IEC104终端#1","device_type":"pcs","protocol":"iec104","station_id":"station_01","comm_params":{"host":"127.0.0.1","port":2404}},
        {"device_id":"a11_01","device_name":"A11 RTU#1","device_type":"rtu","protocol":"a11","station_id":"station_01","comm_params":{"host":"127.0.0.1","port":8889}},
    ]
    count = 0
    for d in demo_devices:
        dev = await pg_store.get_device(d["device_id"])
        if not dev:
            await pg_store.create_device(d)
            # 创建默认点位
            points = []
            for i, (pid, pt) in enumerate(get_product_model(d["device_type"]).get("points", {}).items()):
                points.append({"device_id":d["device_id"],"point_id":pid,"point_name":pt.get("name",pid),
                    "protocol_addr":str(i*2),"register_type":"3","data_type":pt.get("type","float32"),
                    "unit":pt.get("unit",""),"collect_interval":5,"scale":1.0,"offset":0})
            if points:
                try: await pg_store.create_points_batch(points)
                except: pass
            # 启动采集
            new_dev = await pg_store.get_device(d["device_id"])
            if new_dev:
                await collector.add_device(new_dev)
            count += 1
    return {"status":"ok","created":count,"msg":f"已创建 {count} 台演示设备，请启动模拟器后查看数据"}

@app.post("/api/a11-sim/respond")
async def a11_sim_respond(hex_data: str = "", msg_type: str = "heartbeat_ack"):
    """A11 IO模拟器 — 根据收到的报文返回响应帧"""
    try:
        raw = bytes.fromhex(hex_data.replace(' ',''))
        if len(raw) < 15:
            return {"status": "error", "msg": "报文太短"}
        tid = int.from_bytes(raw[0:2], 'big')
        uid = raw[6]
        msg = int.from_bytes(raw[11:13], 'little') if raw[7:11] == b'\x6a\x6a\x5a\x5a' else 0

        # 构造响应
        resp_types = {
            'heartbeat_ack': (0x0013, b''),
            'register_ack': (0x0507, b'\x01'),
            'data_ack': (0x056d, b'\x00'*8),
            'alarm_ack': (0x04f6, b''),
        }
        rtype, rpayload = resp_types.get(msg_type, (0x0013, b''))
        pdu = b'\x6a\x6a\x5a\x5a' + rtype.to_bytes(2,'little') + b'\x00\x00' + rpayload
        mblen = len(pdu) + 1
        resp = tid.to_bytes(2,'big') + b'\x00\x00' + mblen.to_bytes(2,'big') + uid.to_bytes(1,'big') + pdu

        log_packet('a11_io_sim', 'TX', resp)
        return {"status": "ok", "hex": resp.hex(' '), "msg": f"响应 0x{rtype:04X}"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}

@app.post("/api/simulators/{sim_id}/register/{addr}")
async def simulator_set_register(sim_id: str, addr: int, value: float = 0):
    """设置模拟器寄存器固定值 (用于协议一致性验证)"""
    import sys, importlib
    mod_name = 'simulators.modbus_tcp_server'
    if mod_name in sys.modules:
        sim_mod = sys.modules[mod_name]
        # 找到对应模拟器实例
        for inst_name in dir(sim_mod):
            obj = getattr(sim_mod, inst_name, None)
            if hasattr(obj, 'simulator'):
                try: obj.simulator.set_fixed(addr, value); break
                except: pass
    return {"status": "ok", "sim_id": sim_id, "addr": addr, "value": value}

@app.get("/api/simulators/{sim_id}/registers")
async def simulator_get_registers(sim_id: str):
    """获取模拟器当前寄存器值"""
    import sys as _ss
    regs = {}
    mod_name = 'simulators.modbus_tcp_server'
    if mod_name in _ss.modules:
        sim_mod = _ss.modules[mod_name]
        for inst_name in dir(sim_mod):
            obj = getattr(sim_mod, inst_name, None)
            if hasattr(obj, 'simulator'):
                try:
                    for addr, val in obj.simulator.get_registers().items():
                        regs[str(addr)] = val
                    break
                except: pass
    return {"sim_id": sim_id, "registers": regs}


# ---- 多租户 API ----
from .web.tenant_api import router as tenant_router
app.include_router(tenant_router)

# ---- IO 本体 API ----
from .web.io_body_api import router as io_body_router
app.include_router(io_body_router)

# ---- 系统信息 + 插件 API ----
from .web.system_api import router as system_router
app.include_router(system_router)

# ---- 厂商通道桥接 API ----
from .web.vendor_api import router as vendor_router
app.include_router(vendor_router)

# ---- 采集端点管理 API ----
from .web.capture_endpoint_api import router as cap_ep_router
app.include_router(cap_ep_router)

# ---- PCAP 文件读取 API ----
from .web.pcap_api import router as pcap_router
app.include_router(pcap_router)

# ---- 远程抓包 API ----
from .web.remote_capture import router as remote_cap_router
app.include_router(remote_cap_router)

# ---- Vue3 前端托管 ----
from pathlib import Path as _Path
from starlette.responses import Response as _Response
import sys as _sys2

def _get_frontend_dir() -> _Path:
    """前端 dist 目录 — 兼容 PyInstaller 冻结"""
    if getattr(_sys2, 'frozen', False):
        return _Path(_sys2._MEIPASS) / "frontend-vue" / "dist"
    return _Path(__file__).resolve().parent.parent / "frontend-vue" / "dist"

_FRONTEND_DIR = _get_frontend_dir()

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

# ---- 插件管理 API ----
from .plugin_registry import list_all, list_enabled, health as plugin_health, enable, disable

@app.get("/api/plugins")
def get_plugins(category: str = None):
    """获取所有插件及其状态"""
    return {
        "plugins": [
            {"name": p["name"], "category": p["category"], "version": p["version"],
             "enabled": p["enabled"], "config": p.get("config_schema", {}),
             "depends": p.get("depends", [])}
            for p in list_all(category)
        ],
        "health": plugin_health()
    }

@app.post("/api/plugins/{name}/enable")
def enable_plugin(name: str):
    enable(name)
    return {"status": "enabled", "name": name}

@app.post("/api/plugins/{name}/disable")
def disable_plugin(name: str):
    disable(name)
    return {"status": "disabled", "name": name}

# ---- 系统信息 API (边缘代理本体扫描) ----
@app.get("/api/system")
def system_info():
    import platform, os, time as _time, socket
    info = {
        "hostname": socket.gethostname(),
        "os": f"{platform.system()} {platform.release()}",
        "python": platform.python_version(),
        "uptime": int(_time.time() - _startup_ts),
    }
    # CPU / Memory / Disk / Network (psutil)
    try:
        import psutil
        info["cpu_percent"] = psutil.cpu_percent(interval=0.1)
        info["cpu_cores"] = psutil.cpu_count()
        mem = psutil.virtual_memory()
        info["memory_used_gb"] = round(mem.used / (1024**3), 1)
        info["memory_total_gb"] = round(mem.total / (1024**3), 1)
        info["memory_percent"] = mem.percent
        disk = psutil.disk_usage(cfg.data_dir)
        info["disk_used_gb"] = round(disk.used / (1024**3), 1)
        info["disk_total_gb"] = round(disk.total / (1024**3), 1)
        info["disk_percent"] = disk.percent
        # 网络接口
        interfaces = []
        for name, addrs in psutil.net_if_addrs().items():
            iface = {"name": name, "ips": []}
            for addr in addrs:
                iface["ips"].append({"family": str(addr.family), "address": addr.address, "netmask": addr.netmask or ""})
                if addr.family == 2 and not addr.address.startswith("127."):
                    iface["ipv4"] = addr.address
            if iface.get("ipv4"):
                interfaces.append(iface)
        info["interfaces"] = interfaces
        # 网络流量
        net = psutil.net_io_counters()
        info["net_sent_mb"] = round(net.bytes_sent / (1024**2), 1)
        info["net_recv_mb"] = round(net.bytes_recv / (1024**2), 1)
        # 监听端口
        ports = set()
        for c in psutil.net_connections(kind='inet'):
            if c.status == 'LISTEN':
                ports.add(c.laddr.port)
        info["listening_ports"] = sorted(ports)
    except ImportError:
        info["cpu_percent"] = None
        info["memory_used_gb"] = None
    # Storage mode
    info["storage_mode"] = cfg.storage_mode
    info["data_dir"] = cfg.data_dir
    # Plugin registry health
    try:
        from .plugin_registry import health as plugin_health
        info["plugins"] = plugin_health()
    except: pass
    return info

# ---- 厂商通道 API ----
@app.get("/api/channels")
async def list_channels():
    """协议通道 + 厂商通道状态"""
    from .plugin_registry import list_all
    protocol_channels = []
    vendor_status = []
    try:
        from .parse_lite import parse_query
        chs = parse_query("Channel", {})
        for ch in chs.get("results", []):
            protocol_channels.append({
                "device_id": ch.get("objectId",""),
                "device_name": ch.get("name",""),
                "protocol": ch.get("cType",""),
                "connected": ch.get("status") == "running",
                "config": {
                    "host": ch.get("config",{}).get("host","127.0.0.1") if isinstance(ch.get("config"),dict) else "127.0.0.1",
                    "port": ch.get("config",{}).get("port",502) if isinstance(ch.get("config"),dict) else 502,
                },
                "success": 0, "fail": 0,
            })
        # Vendor channel status from parse_lite
        vendors_map = {
            "youyeyun": "ch_youyeyun", "boiler": "ch_boiler", "phm_vib": "ch_vib",
            "bolt": "ch_bolt", "video": "ch_video", "tdlas": "ch_tdlas",
        }
        for key, chid in vendors_map.items():
            ch = next((c for c in chs.get("results",[]) if c.get("objectId") == chid), None)
            vendor_status.append({
                "key": key,
                "connected": ch.get("status") == "running" if ch else False,
                "lastSync": ch.get("updatedAt","")[:16] if ch else None,
                "devices": 2 if key == "youyeyun" else 4 if key == "boiler" else 36 if key == "phm_vib" else 17 if key == "bolt" else 29 if key == "video" else 1,
                "points": 45 if key == "youyeyun" else 19 if key == "boiler" else 10 if key == "phm_vib" else 3,
            })
    except Exception as e:
        logger.warning(f"Channel query failed: {e}")
    return {"channels": protocol_channels, "vendors": vendor_status, "categories": {"protocol": len(protocol_channels)}}

# ---- 采集端点管理 API ----
from pydantic import BaseModel as PydanticBase
class CaptureEndpointModel(PydanticBase):
    name: str
    host: str
    port: int = 2500
    username: str = "administrator"
    password: str = ""
    method: str = "winrm"  # winrm | ssh | local

@app.get("/api/capture/endpoints")
def list_capture_endpoints():
    try:
        from .parse_lite import parse_query
        r = parse_query("CaptureEndpoint", {})
        return {"endpoints": r.get("results", [])}
    except: return {"endpoints": []}

@app.post("/api/capture/endpoints")
def create_capture_endpoint(body: CaptureEndpointModel):
    from .parse_lite import parse_create
    return parse_create("CaptureEndpoint", body.model_dump())

@app.delete("/api/capture/endpoints/{oid}")
def delete_capture_endpoint(oid: str):
    from .parse_lite import parse_delete
    return parse_delete("CaptureEndpoint", oid)

# ---- 厂商通道数据桥接 (oil-monitor.db) ----
import sqlite3 as _sqlite3, os as _os
_OIL_DB = _os.path.join(_os.path.dirname(__file__), "..", "data", "oil_monitor.db")

@app.get("/api/vendor/{key}/status")
def get_vendor_status(key: str):
    """厂商通道实时状态 — 真实数据优先，无则模拟"""
    # 油液监测: 真实数据
    if key == "youyeyun" and _os.path.exists(_OIL_DB):
        db = _sqlite3.connect(_OIL_DB); db.row_factory = _sqlite3.Row
        devices = db.execute("SELECT DISTINCT device_id, device_name FROM sensor_meta").fetchall()
        points = db.execute("SELECT COUNT(DISTINCT key_id) as cnt FROM sensor_meta").fetchone()
        last = db.execute("SELECT MAX(update_time) as t FROM sensor_realtime").fetchone()
        db.close()
        return {
            "key": key, "connected": True,
            "devices": len(devices), "points": points["cnt"] if points else 45,
            "lastSync": str(last["t"])[:16] if last and last["t"] else "2026-07-09 01:43",
            "relatedDevices": [{"id": d["device_id"], "name": d["device_name"], "status": "online"} for d in devices[:5]],
        }
    # 其他通道: 模拟器数据 (30s 刷新)
    if key in _vendor_sim_data:
        return _vendor_sim_data[key]
    return {"key": key, "connected": False, "devices": 0, "points": 0, "lastSync": None, "relatedDevices": []}

# ---- 厂商通道模拟器 (缺真实后端时自动生成演示数据) ----
import threading, random as _random, time as _time

_vendor_sim_data = {}
def _vendor_sim_loop():
    """后台模拟: 为缺后端的厂商通道生成演示数据"""
    while True:
        _time.sleep(30)
        now = _time.strftime("%Y-%m-%d %H:%M")
        for key in ["boiler", "phm_vib", "bolt", "video", "tdlas"]:
            _vendor_sim_data[key] = {
                "key": key, "connected": True, "lastSync": now,
                "devices": {"boiler":4,"phm_vib":36,"bolt":17,"video":29,"tdlas":1}.get(key,0),
                "points": {"boiler":19,"phm_vib":10,"bolt":3,"video":2,"tdlas":1}.get(key,0),
                "relatedDevices": [{"id":f"{key}_dev{i}","name":f"{key}设备-{i}","status":"online" if _random.random()>0.2 else "offline"} for i in range(1,4)]
            }

# 启动模拟器线程
try:
    _t = threading.Thread(target=_vendor_sim_loop, daemon=True); _t.start()
except: pass
