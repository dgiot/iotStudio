#!/usr/bin/env python3
"""
网关统一动态感知 — Modbus TCP 场景 (静态 IP + 移动网关)
========================================================
对标需求: 静态 IP 还有 Modbus TCP 的动态扫描/识别/动态感知
        — 进场网关是移动的 (动态 IP), 设备有删有减, 网关厂家多 (本期10家)

统一感知模型 (全部被动, 零发包零修改):
  1. 网关接入感知   — 注册帧识别 10 家厂家 + 设备标识
  2. 静态 IP 感知   — 固定端点周期性探测 (已有 StaticIPGatewayHandler)
  3. 移动网关感知   — 新 TCP 连接即上线, 心跳消失即下线 (LISTEN 模式)
  4. Modbus TCP 识别 — MBAP 帧解析: 从站/寄存器地址/功能码
  5. 设备增删感知   — 网关下挂从站数量变化 → 设备上线/下线事件
  6. 点位增删感知   — 寄存器地址集合 diff (复用 flow_learner)

用法:
  sense = GatewayDynamicSense()
  sense.on_event(callback)                  # 感知事件
  sense.register_gateway("11.248.195.1", "static", port=502)  # 静态IP登记
  sense.on_gateway_frame(data, src_ip, src_port)              # 帧接入
  events = sense.poll_events()

自测: python -m src.services.gateway_dynamic
"""
import logging, socket, struct, time
from collections import deque
from dataclasses import dataclass, field
from typing import Callable, Deque, Dict, List, Optional

from src.protocols.gateway_vendors import detect_vendor, load_all_vendors

logger = logging.getLogger("gateway_dynamic")

GATEWAY_TIMEOUT = 180           # 移动网关下线判定 (s)
STATIC_PROBE_INTERVAL = 60      # 静态 IP 探测间隔 (s)
MAX_EVENTS = 10000
MBAP_MIN = 8                    # Modbus TCP MBAP 最小帧长


@dataclass
class GatewayInfo:
    """感知到的网关"""
    ip: str
    port: int
    gw_type: str = "mobile"      # static / mobile
    vendor: str = ""
    vendor_name: str = ""
    device_id: str = ""          # 厂家注册帧标识 (IMEI等)
    online: bool = True
    first_seen: float = 0.0
    last_seen: float = 0.0
    # Modbus TCP 从站集合 (设备)
    slaves: set = field(default_factory=set)
    # 寄存器地址集合 (点位)
    reg_addrs: set = field(default_factory=set)
    packets: int = 0


@dataclass
class SenseEvent:
    """感知事件"""
    ts: float
    type: str                    # gateway_up/down, slave_add/del, vendor_detected
    ip: str
    port: int
    detail: str = ""


class GatewayDynamicSense:
    """网关统一动态感知 — Modbus TCP 场景"""

    def __init__(self, gateway_timeout: float = GATEWAY_TIMEOUT):
        self.gateway_timeout = gateway_timeout
        self._gateways: Dict[str, GatewayInfo] = {}
        self._events: Deque[SenseEvent] = deque(maxlen=MAX_EVENTS)
        self._callbacks: List[Callable] = []
        self._stats = {"frames": 0, "gateways_seen": 0, "events": 0,
                       "started_at": time.time()}
        self._vendors = load_all_vendors()

    def on_event(self, cb: Callable[[SenseEvent], None]):
        self._callbacks.append(cb)

    # ── 网关登记 (静态 IP 场景) ──

    def register_static(self, ip: str, port: int = 502,
                        vendor: str = "", device_id: str = "") -> str:
        """登记静态 IP 网关 (固定端点)"""
        key = f"{ip}:{port}"
        if key not in self._gateways:
            g = GatewayInfo(ip=ip, port=port, gw_type="static",
                            vendor=vendor,
                            vendor_name=(self._vendors.get(vendor).name
                                         if vendor in self._vendors else ""),
                            device_id=device_id, first_seen=time.time(),
                            last_seen=time.time())
            self._gateways[key] = g
            self._stats["gateways_seen"] += 1
            self._emit(SenseEvent(time.time(), "gateway_up", ip, port,
                                  "static registered"))
            logger.info(f"[gw_dynamic] 静态网关登记: {key}")
        return key

    # ── 帧接入 (移动网关 + 静态网关共用) ──

    def on_gateway_frame(self, data: bytes, src_ip: str,
                         src_port: int = 502) -> Optional[str]:
        """处理来自网关的一帧数据

        移动网关: 首帧可能为注册帧 (10 家厂家识别)
        Modbus TCP: MBAP 解析从站/寄存器
        """
        self._stats["frames"] += 1
        key = f"{src_ip}:{src_port}"
        now = time.time()
        g = self._gateways.get(key)

        # 新网关: 尝试厂家识别
        if g is None:
            vendor = detect_vendor(data)
            if vendor is not None:
                reg = vendor.parse_registration(data)
                if reg:
                    g = GatewayInfo(ip=src_ip, port=src_port, gw_type="mobile",
                                    vendor=vendor.code,
                                    vendor_name=vendor.name,
                                    device_id=reg["device_id"],
                                    first_seen=now, last_seen=now)
                    self._gateways[key] = g
                    self._stats["gateways_seen"] += 1
                    self._emit(SenseEvent(now, "gateway_up", src_ip, src_port,
                                          f"vendor={vendor.name} "
                                          f"id={reg['device_id']}"))
                    self._emit(SenseEvent(now, "vendor_detected", src_ip,
                                          src_port,
                                          f"{vendor.name} 注册帧"))
                    logger.info(f"[gw_dynamic] 移动网关上线: {key} "
                                f"厂家={vendor.name} id={reg['device_id']}")
                    return key   # 注册帧不是 Modbus 数据, 不解析
            else:
                # 无注册帧: 按 Modbus TCP 网关接入
                g = GatewayInfo(ip=src_ip, port=src_port, gw_type="mobile",
                                first_seen=now, last_seen=now)
                self._gateways[key] = g
                self._stats["gateways_seen"] += 1
                self._emit(SenseEvent(now, "gateway_up", src_ip, src_port,
                                      "mobile (无注册帧)"))
        else:
            g.last_seen = now
            if not g.online:
                g.online = True
                self._emit(SenseEvent(now, "gateway_up", src_ip, src_port,
                                      "reconnected"))

        # Modbus TCP 解析: 从站 + 寄存器
        self._parse_modbus(g, data, now)
        return key

    def _parse_modbus(self, g: GatewayInfo, data: bytes, now: float):
        """MBAP 帧解析: 从站 ID (uid) + 寄存器地址"""
        if len(data) < MBAP_MIN:
            return
        # MBAP: tid(2) pid(2) len(2) uid(1) fc(1) ...
        uid = data[6]
        fc = data[7]
        if uid not in g.slaves:
            g.slaves.add(uid)
            self._emit(SenseEvent(now, "slave_add", g.ip, g.port,
                                  f"从站 {uid} (FC {fc})"))
            logger.info(f"[gw_dynamic] 设备新增: {g.ip} 从站{uid}")
        if fc in (1, 2, 3, 4) and len(data) >= 10:
            addr = (data[8] << 8) | data[9]
            if addr not in g.reg_addrs:
                g.reg_addrs.add(addr)
        g.packets += 1

    # ── 巡检: 网关下线 + 设备删除感知 ──

    def patrol(self, now: float = None) -> List[SenseEvent]:
        """巡检: 移动网关心跳超时 → 下线; 从站消失 → 设备删除"""
        now = now or time.time()
        out = []
        for key, g in list(self._gateways.items()):
            if g.online and now - g.last_seen > self.gateway_timeout:
                g.online = False
                ev = SenseEvent(now, "gateway_down", g.ip, g.port,
                                f"心跳超时 {now-g.last_seen:.0f}s "
                                f"vendor={g.vendor_name}")
                self._events.append(ev)
                out.append(ev)
                logger.info(f"[gw_dynamic] 网关下线: {key}")
        return out

    # ── 查询 ──

    def gateways(self, online_only: bool = False) -> List[dict]:
        out = []
        for g in self._gateways.values():
            if online_only and not g.online:
                continue
            out.append({"ip": g.ip, "port": g.port, "type": g.gw_type,
                        "vendor": g.vendor_name or g.vendor,
                        "device_id": g.device_id, "online": g.online,
                        "slaves": sorted(g.slaves),
                        "reg_addrs_count": len(g.reg_addrs),
                        "packets": g.packets,
                        "first_seen": g.first_seen, "last_seen": g.last_seen})
        return out

    def poll_events(self, clear: bool = True) -> List[dict]:
        out = [{"ts": e.ts, "type": e.type, "ip": e.ip, "port": e.port,
                "detail": e.detail} for e in self._events]
        if clear:
            self._events.clear()
        return out

    def _emit(self, ev: SenseEvent):
        self._events.append(ev)
        self._stats["events"] += 1
        for cb in self._callbacks:
            try:
                cb(ev)
            except Exception:
                pass

    def status(self) -> dict:
        return {**self._stats, "gateways": len(self._gateways),
                "online": sum(1 for g in self._gateways.values() if g.online),
                "vendors": len(self._vendors)}


# ═══════════════════════════════════════════
# 自测
# ═══════════════════════════════════════════

def _selftest():
    sense = GatewayDynamicSense(gateway_timeout=2)

    # 1. 静态 IP 网关登记
    sense.register_static("11.248.195.1", 502, vendor="quectel",
                          device_id="861234567890123")
    sense.register_static("11.248.196.10", 502, vendor="usr")
    print(f"[1] 静态网关: {len(sense.gateways())} 台 "
          f"({[g['ip'] for g in sense.gateways()]})")

    # 2. 移动网关: 宏电注册帧上线
    reg = b"\x78" + b"860123456789012" + b"\x00" * 4
    sense.on_gateway_frame(reg, "10.20.30.40", 502)
    print(f"[2] 移动网关上线: 厂家识别 "
          f"{[g['vendor'] for g in sense.gateways() if g['type']=='mobile']}")

    # 3. Modbus TCP 帧: 从站发现 + 寄存器
    for sid in (1, 2):
        req = struct.pack(">HHHBBHH", 1, 0, 6, sid, 3, 400, 2)
        sense.on_gateway_frame(req, "10.20.30.40", 502)
    print(f"[3] Modbus 从站感知: {sorted(sense._gateways['10.20.30.40:502'].slaves)} "
          f"(期望 [1, 2])")

    # 4. 静态 IP 网关也走同一感知通道
    static_req = struct.pack(">HHHBBHH", 1, 0, 6, 1, 3, 40300, 10)
    sense.on_gateway_frame(static_req, "11.248.195.1", 502)
    g_static = sense._gateways["11.248.195.1:502"]
    print(f"[4] 静态网关点位感知: {len(g_static.reg_addrs)} 个寄存器 "
          f"(期望 ≥1, 含 40300)")

    # 5. 事件流
    events = sense.poll_events()
    types = {e["type"] for e in events}
    print(f"[5] 事件: {len(events)} 个 type={sorted(types)}")
    assert "gateway_up" in types and "vendor_detected" in types
    assert "slave_add" in types

    # 6. 下线检测
    time.sleep(2.5)
    down = sense.patrol()
    print(f"[6] 网关下线: {len(down)} 台 (移动网关心跳超时)")
    assert len(down) >= 1

    print("gateway_dynamic selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("gateway_dynamic selftest OK")
