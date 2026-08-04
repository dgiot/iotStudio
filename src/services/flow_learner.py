#!/usr/bin/env python3
"""
流量学习器 — 从被动监听流量学习动态感知
========================================
对标需求: Modbus TCP 点位和 IP 动态变化时的动态感知

输入: 被动监听帧 (PassiveCapture 回调)
输出: 动态变化事件 — 设备上线/下线, 点位新增/消失, 协议识别

学习机制 (全部被动, 零发包):
  1. 设备发现    — 新 IP:端口 发起连接 → 设备上线
  2. 设备消失    — 流静默超时 (DEVICE_TIMEOUT) → 设备下线
  3. 点位学习    — 报文内寄存器地址/字段变化 → 点位范围扩展
  4. 协议指纹    — 帧头特征自动识别 (A11/Modbus/IEC104/CommBridge)
  5. 变化报告    — 输出 diff 事件, 供告警/配置更新

用法:
  learner = FlowLearner()
  cap = PassiveCapture(ports=[502, 8889])
  cap.on_frame(learner.on_frame)     # 接线
  cap.start()
  events = learner.poll_events()     # 消费变化事件
"""
import logging
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Deque, Dict, List, Optional

logger = logging.getLogger("flow_learner")

# 学习参数
DEVICE_TIMEOUT = 300           # 设备下线判定: 流静默 N 秒
POINT_SCAN_WINDOW = 120        # 点位学习统计窗口 (秒)
MAX_EVENTS = 10000             # 事件缓冲上限
MODBUS_FUNCS = {1, 2, 3, 4, 5, 6, 15, 16, 22, 23}
A11_MAGIC = b"\x6a\x6a\x5a\x5a"


@dataclass
class LearnedDevice:
    """学习到的设备"""
    ip: str
    port: int
    protos: set = field(default_factory=set)
    packets: int = 0
    first_seen: float = 0.0
    last_seen: float = 0.0
    online: bool = True
    # 点位学习: proto → 出现过的寄存器/字段集合
    points: Dict[str, set] = field(default_factory=dict)


@dataclass
class LearnEvent:
    """动态变化事件"""
    ts: float
    type: str                    # device_up/device_down/point_seen/proto_seen
    ip: str
    port: int
    detail: str = ""


class FlowLearner:
    """流量学习器 — 被动学习设备/点位动态"""

    def __init__(self, device_timeout: float = DEVICE_TIMEOUT,
                 max_events: int = MAX_EVENTS):
        self.device_timeout = device_timeout
        self._devices: Dict[str, LearnedDevice] = {}
        self._events: Deque[LearnEvent] = deque(maxlen=max_events)
        self._learned_points: Dict[str, set] = {}   # key=ip:port:proto → addr集合
        self._stats = {"frames": 0, "devices_seen": 0, "points_learned": 0,
                       "started_at": time.time()}

    # ── 帧接入 (从 PassiveCapture 回调) ──

    def on_frame(self, frame) -> None:
        """处理一帧捕获报文 (被动, 只学习不干预)"""
        self._stats["frames"] += 1
        self._learn_device(frame)
        self._learn_point(frame)

    def _learn_device(self, frame) -> None:
        """设备发现 + 保活"""
        key = f"{frame.device_ip}:{frame.device_port}"
        dev = self._devices.get(key)
        now = frame.ts
        if dev is None:
            dev = LearnedDevice(ip=frame.device_ip, port=frame.device_port,
                                first_seen=now, last_seen=now)
            self._devices[key] = dev
            self._stats["devices_seen"] += 1
            self._events.append(LearnEvent(now, "device_up", frame.device_ip,
                                           frame.device_port,
                                           f"proto={frame.proto}"))
            logger.info(f"[learner] 设备上线: {frame.device_ip}:"
                        f"{frame.device_port} proto={frame.proto}")
        elif not dev.online:
            dev.online = True
            self._events.append(LearnEvent(now, "device_up", frame.device_ip,
                                           frame.device_port, "reconnected"))
        dev.protos.add(frame.proto or "unknown")
        dev.packets += 1
        dev.last_seen = now

    def _learn_point(self, frame) -> None:
        """点位学习: 从报文提取寄存器/字段地址"""
        addrs = _extract_addresses(frame)
        if not addrs:
            return
        key = f"{frame.device_ip}:{frame.device_port}:{frame.proto}"
        known = self._learned_points.setdefault(key, set())
        before = len(known)
        known.update(addrs)
        if len(known) > before:
            self._stats["points_learned"] += len(known) - before
            self._events.append(LearnEvent(frame.ts, "point_seen",
                                           frame.device_ip, frame.device_port,
                                           f"proto={frame.proto} "
                                           f"addrs={sorted(addrs)[:6]}"))
            logger.info(f"[learner] 点位学习: {frame.device_ip} "
                        f"proto={frame.proto} +{len(known)-before} 个 "
                        f"(累计 {len(known)})")

    # ── 巡检: 设备下线检测 ──

    def patrol(self, now: float = None) -> List[LearnEvent]:
        """巡检设备状态, 返回新事件 (设备下线)"""
        now = now or time.time()
        out = []
        for key, dev in self._devices.items():
            if dev.online and now - dev.last_seen > self.device_timeout:
                dev.online = False
                ev = LearnEvent(now, "device_down", dev.ip, dev.port,
                                f"idle {now-dev.last_seen:.0f}s")
                self._events.append(ev)
                out.append(ev)
                logger.info(f"[learner] 设备下线: {dev.ip}:{dev.port} "
                            f"(静默 {now-dev.last_seen:.0f}s)")
        return out

    # ── 查询 ──

    def devices(self, online_only: bool = False) -> List[dict]:
        out = []
        for d in self._devices.values():
            if online_only and not d.online:
                continue
            out.append({"ip": d.ip, "port": d.port, "protos": sorted(d.protos),
                        "packets": d.packets, "online": d.online,
                        "points": {p: len(s) for p, s in d.points.items()},
                        "first_seen": d.first_seen, "last_seen": d.last_seen})
        return out

    def learned_points(self) -> Dict[str, list]:
        """已学习点位: key=ip:port:proto → 寄存器地址列表"""
        return {k: sorted(v) for k, v in self._learned_points.items()}

    def poll_events(self, clear: bool = True) -> List[dict]:
        """消费事件缓冲"""
        out = [{"ts": e.ts, "type": e.type, "ip": e.ip, "port": e.port,
                "detail": e.detail} for e in self._events]
        if clear:
            self._events.clear()
        return out

    def status(self) -> dict:
        return {**self._stats, "devices": len(self._devices),
                "online": sum(1 for d in self._devices.values() if d.online),
                "events_pending": len(self._events)}


def _extract_addresses(frame) -> List[int]:
    """从帧负载提取寄存器/字段地址 (被动解析, 零发包)

    - Modbus TCP: MBAP 后 FC 码 + 寄存器起始地址 (字节 8-9)
    - A11: 帧头后设备地址字段
    """
    payload = frame.payload
    proto = frame.proto
    addrs: List[int] = []
    if proto == "Modbus" and len(payload) >= 10:
        fc = payload[7]
        if fc in MODBUS_FUNCS:
            # 读请求: 起始地址在高 16 位; 写请求: 地址+值
            addr = (payload[8] << 8) | payload[9]
            addrs.append(addr)
            if fc in (5, 6, 15, 16) and len(payload) >= 12:
                addrs.append((payload[10] << 8) | payload[11])
    elif proto == "A11" and len(payload) >= 8 and payload[:4] == A11_MAGIC:
        # A11: 从 payload 中提取长度与类型, 地址字段在帧中
        pass  # 地址结构由 protocol_decoder 精细解析
    return addrs


# ═══════════════════════════════════════════
# 自测 — 用被动监听捕获本地流量驱动学习器
# ═══════════════════════════════════════════

def _selftest():
    import socket
    import struct
    import threading as _th

    from src.protocols.passive_capture import PassiveCapture

    learner = FlowLearner(device_timeout=3)
    cap = PassiveCapture(ports=[1502, 18889], ring_size=5000)
    cap.on_frame(learner.on_frame)

    iface = ""
    try:
        from scapy.all import get_if_list
        for i in get_if_list():
            if "Loopback" in i:
                iface = i
                break
    except Exception:
        pass
    cap.start(iface=iface)
    time.sleep(0.3)

    # 模拟设备1: A11 客户端
    def _dev_a11():
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        try:
            s.connect(("127.0.0.1", 18889))
            for i in range(5):
                s.sendall(b"\x6a\x6a\x5a\x5a" + struct.pack("<HH", 0x0017, 0)
                          + b"\x00" * 20 + bytes([i]))
            time.sleep(0.5)
        except Exception:
            pass
        finally:
            s.close()

    def _dev_modbus():
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        try:
            s.connect(("127.0.0.1", 1502))
            for i in range(5):
                s.sendall(struct.pack(">HHHBBHH", i, 0, 6, 1, 3, 400 + i, 100))
            time.sleep(0.5)
        except Exception:
            pass
        finally:
            s.close()

    # IO 服务器侧
    for port in (1502, 18889):
        srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", port))
        srv.listen(2)

        def _accept(srv=srv):
            while True:
                try:
                    conn, _ = srv.accept()
                    conn.recv(1024)
                    conn.close()
                except Exception:
                    return
        _th.Thread(target=_accept, daemon=True).start()

    t1 = _th.Thread(target=_dev_a11, daemon=True)
    t2 = _th.Thread(target=_dev_modbus, daemon=True)
    t1.start(); t2.start()
    t1.join(timeout=5); t2.join(timeout=5)
    time.sleep(0.8)

    print(f"[1] 学习设备: {len(learner.devices())} (期望≥1)")
    for d in learner.devices():
        print(f"    {d['ip']}:{d['port']} protos={d['protos']} "
              f"packets={d['packets']} online={d['online']}")
    pts = learner.learned_points()
    for k, v in pts.items():
        print(f"[2] 点位: {k} → {v[:6]}")
    evs = learner.poll_events()
    print(f"[3] 事件: {len(evs)} 个")
    for e in evs[:5]:
        print(f"    {e['type']} {e['ip']}:{e['port']} {e['detail']}")

    cap.stop()
    # 等超时验证下线检测
    time.sleep(3.5)
    down = learner.patrol()
    print(f"[4] 下线检测: {len(down)} 个设备下线")
    assert len(learner.devices()) >= 1, "设备学习失败"
    print("flow_learner selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("flow_learner selftest OK")
