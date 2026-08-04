"""
被动采集 API — 动态感知视图
============================
对标需求: Modbus TCP 点位和 IP 动态变化时的动态感知
（被动监听 + 流量学习, 零发包零修改, 不影响原业务）

路由:
  POST   /api/passive/start         启动被动监听 (接口/端口可选)
  POST   /api/passive/stop          停止 (零残留)
  GET    /api/passive/status        监听状态 + 资源占用
  GET    /api/passive/devices       发现的设备 (动态 IP 感知)
  GET    /api/passive/flows         TCP 流视图
  GET    /api/passive/points        学习到的点位 (动态点位感知)
  GET    /api/passive/events        动态变化事件 (上线/下线/点位)
  GET    /api/passive/decoded       解码的数据点 (最近 N 条)
"""
from fastapi import APIRouter, Query
import logging, time

logger = logging.getLogger("passive_api")
router = APIRouter(prefix="/api/passive", tags=["passive-capture"])

# 全局单例 (延迟初始化, 避免 import 时依赖 scapy)
_capture = None
_learner = None
_decoder = None


def _get_components():
    global _capture, _learner, _decoder
    if _capture is None:
        from src.protocols.passive_capture import PassiveCapture
        from src.services.flow_learner import FlowLearner
        from src.services.protocol_decoder import ProtocolDecoder
        _capture = PassiveCapture()
        _learner = FlowLearner()
        _decoder = ProtocolDecoder()
        _capture.on_frame(_learner.on_frame)
        _capture.on_frame(_decoder.on_frame)
    return _capture, _learner, _decoder


@router.post("/start")
def passive_start(iface: str = "", ports: str = "502,8889,2404,53001"):
    """启动被动监听 — 零发包, 只读流量"""
    cap, learner, dec = _get_components()
    port_list = [int(p.strip()) for p in ports.split(",") if p.strip().isdigit()]
    cap.ports = port_list or cap.ports
    result = cap.start(iface=iface)
    if result.get("status") == "ok":
        # 后台巡检线程: 设备下线检测
        import threading

        def _patrol():
            while cap.status()["running"]:
                learner.patrol()
                time.sleep(30)
        threading.Thread(target=_patrol, daemon=True, name="passive-patrol").start()
    return {**result, "msg": "被动监听已启动 (零发包, 不影响生产)"}


@router.post("/stop")
def passive_stop():
    """停止监听 — 零残留连接"""
    cap, _, _ = _get_components()
    return cap.stop()


@router.get("/status")
def passive_status():
    cap, learner, dec = _get_components()
    return {"capture": cap.status(), "learner": learner.status(),
            "decoder": dec.stats()}


@router.get("/devices")
def passive_devices(online: bool = False):
    """发现的设备 — 动态 IP 感知结果"""
    _, learner, _ = _get_components()
    return {"total": len(learner.devices(online_only=online)),
            "devices": learner.devices(online_only=online)}


@router.get("/flows")
def passive_flows(proto: str = "", limit: int = 50):
    """TCP 流视图"""
    cap, _, _ = _get_components()
    flows = cap.flows(proto=proto)
    return {"total": len(flows), "flows": flows[:limit]}


@router.get("/points")
def passive_points():
    """学习到的点位 — 动态点位感知结果"""
    _, learner, _ = _get_components()
    pts = learner.learned_points()
    return {"total": sum(len(v) for v in pts.values()), "points": pts}


@router.get("/events")
def passive_events(limit: int = 100):
    """动态变化事件 (设备上线/下线/点位新增)"""
    _, learner, _ = _get_components()
    evs = learner.poll_events()
    return {"total": len(evs), "events": evs[-limit:]}


@router.get("/decoded")
def passive_decoded(limit: int = 100):
    """解码的数据点 (最近 N 条)"""
    _, _, dec = _get_components()
    pts = dec.take(limit=limit)
    return {"total": len(pts), "points": [
        {"ts": p.ts, "device_id": p.device_id, "point_id": p.point_id,
         "value": p.value, "quality": p.quality, "protocol": p.protocol}
        for p in pts]}


# ═══════════════════════════════════════════
# IO 服务器全面体检 (搭桥手术前评估)
# ═══════════════════════════════════════════

@router.post("/health/io/{ip}")
def io_health_check(ip: str, hostname: str = "", winrm_user: str = "",
                    winrm_password: str = "", scan_data: dict = None):
    """IO 服务器全面体检 — 8 维度 (只读, 零修改)

    参数:
      ip: IO 服务器 IP (如 11.66.12.131)
      hostname: 可选主机名
      winrm_user/password: 可选, 提供则实时 WinRM 采集
      scan_data: 可选, 注入已采集数据 (JSON body)
    """
    from src.services.io_health_check import IOHostHealthChecker
    winrm_cfg = {}
    if winrm_user and winrm_password:
        winrm_cfg = {"ip": ip, "user": winrm_user, "password": winrm_password,
                     "port": 5985}
    checker = IOHostHealthChecker(ip=ip, hostname=hostname,
                                  winrm_config=winrm_cfg,
                                  scan_data=scan_data or {})
    report = checker.check()
    return report.to_dict()


# ═══════════════════════════════════════════
# 作业区适配层 (Zone Adapter Layer)
# ═══════════════════════════════════════════

_zone_adapters = {}

def _get_zone(zone_id: str):
    from src.services.zone_adapter import ZoneAdapter
    if zone_id not in _zone_adapters:
        _zone_adapters[zone_id] = ZoneAdapter(zone_id)
    return _zone_adapters[zone_id]


@router.post("/zones/{zone_id}/health")
def zone_health(zone_id: str):
    """作业区术前体检 (8 维度)"""
    return _get_zone(zone_id).check_health()


@router.post("/zones/{zone_id}/start")
def zone_start(zone_id: str, require_healthy: bool = True):
    """启动作业区适配层 (默认要求体检 READY)"""
    return _get_zone(zone_id).start(require_healthy=require_healthy)


@router.post("/zones/{zone_id}/stop")
def zone_stop(zone_id: str):
    _get_zone(zone_id).stop()
    return {"status": "stopped", "zone": zone_id}


@router.get("/zones/{zone_id}/status")
def zone_status(zone_id: str):
    return _get_zone(zone_id).status()


@router.post("/health/ledger")
def io_health_ledger(servers: list = None):
    """多作业区体检台账 — 批量体检全部 IO 服务器

    body: {"servers": [{"ip": "...", "name": "南4联合站",
                        "zone": "采油二厂-第四作业区",
                        "scan_data": {...}}, ...]}
    """
    from src.services.health_ledger import HealthLedger
    ledger = HealthLedger()
    for s in (servers or []):
        ledger.add_server(s.get("ip", ""), s.get("name", s.get("ip", "")),
                          s.get("zone", ""), scan_data=s.get("scan_data", {}))
    ledger.run_all()
    return {"summary": ledger.summary(),
            "servers": [e.__dict__ for e in ledger.entries],
            "worst_items": ledger.worst_items(10)}
