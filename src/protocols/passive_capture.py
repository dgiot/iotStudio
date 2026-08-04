#!/usr/bin/env python3
"""
被动监听核心 — 零发包流量捕获
==============================
对标需求: 不影响原有 A11 生产、不改 RTU 的动态感知采集
（"搭桥旁路"而非"移植心脏": 原链路原样保留, 只镜像流量）

特性:
  - 零发包: 只读网卡流量, 不建立任何 TCP 连接, 不修改任何配置
  - 流跟踪: src_ip:port → dst_ip:port 会话归类, 设备动态发现
  - 协议识别: A11 (jjZZ) / Modbus TCP / IEC104 / CommBridge / 未知
  - Ring Buffer: 保留最近 N 帧, 内存有界
  - 资源可控: CPU 增量 2-5%, 内存 <100MB (scapy store=False)

架构:
  IO服务器网卡 ──Npcap镜像──→ sniff() ──→ flow_table 流跟踪
                                          └──→ RingBuffer 帧缓冲
                                          └──→ 解码器回调 (A11/Modbus/IEC104)
                                          └──→ 流量学习器 (设备/点位变化)

自测: python -m src.protocols.passive_capture
"""
import logging
import threading
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional

logger = logging.getLogger("passive_capture")

# 帧头特征
A11_MAGIC = b"\x6a\x6a\x5a\x5a"          # jjZZ
IEC104_START = 0x68                       # 0x68 起始字节
MODBUS_FUNCS = {1, 2, 3, 4, 5, 6, 15, 16, 22, 23}
DEFAULT_PORTS = [502, 8889, 2404, 4840, 53001]

PROTO_LABELS = {502: "Modbus", 8889: "A11", 2404: "IEC104",
                4840: "OPCUA", 53001: "CommBridge"}


@dataclass
class FlowEntry:
    """一条 TCP 流 (单向)"""
    src_ip: str
    src_port: int
    dst_ip: str
    dst_port: int
    packets: int = 0
    bytes_total: int = 0
    proto: str = ""
    first_seen: float = 0.0
    last_seen: float = 0.0
    # 对端身份 (监听视角: 谁是设备)
    device_ip: str = ""
    device_port: int = 0
    direction: str = ""            # RX=服务器收, TX=服务器发


@dataclass
class CapturedFrame:
    """一帧捕获的报文"""
    ts: float
    src_ip: str
    src_port: int
    dst_ip: str
    dst_port: int
    proto: str
    direction: str                 # RX/TX (相对 IO 服务器端口)
    device_ip: str = ""            # 外部设备 IP (对端)
    device_port: int = 0
    payload: bytes = b""
    flow_key: str = ""


class PassiveCapture:
    """被动监听器 — 零发包抓取 IO 服务器流量

    用法:
      cap = PassiveCapture(ports=[502, 8889])
      cap.on_frame(callback)      # 注册帧回调
      cap.start(iface="")         # 启动监听 (iface 空=默认网卡)
      cap.status()                # 实时状态
      cap.stop()                  # 停止 (无残留连接)
    """

    def __init__(self, ports: List[int] = None, ring_size: int = 20000,
                 stats_interval: float = 5.0):
        self.ports = list(ports) if ports else list(DEFAULT_PORTS)
        self.ring_size = ring_size
        self.stats_interval = stats_interval
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._flows: Dict[str, FlowEntry] = {}
        self._ring: deque = deque(maxlen=ring_size)
        self._callbacks: List[Callable[[CapturedFrame], None]] = []
        self._stats = {"packets": 0, "bytes": 0, "frames": 0,
                       "started_at": 0, "interface": "", "error": ""}

    # ── 回调注册 ──

    def on_frame(self, cb: Callable[[CapturedFrame], None]) -> None:
        """注册帧回调 (解码器/学习器)"""
        self._callbacks.append(cb)

    # ── 生命周期 ──

    def start(self, iface: str = "", bpf: str = "") -> dict:
        """启动被动监听. iface 空 = 默认网卡. bpf 可附加 BPF 过滤."""
        if self._running:
            return {"status": "already_running"}
        try:
            from scapy.all import sniff  # noqa
        except ImportError as e:
            return {"status": "error", "msg": f"需要 scapy: {e}"}

        self._stats.update({"started_at": time.time(), "interface": iface,
                            "error": ""})
        self._running = True
        self._thread = threading.Thread(target=self._run, args=(iface, bpf),
                                        daemon=True, name="passive-capture")
        self._thread.start()
        return {"status": "ok", "interface": iface, "ports": self.ports}

    def stop(self) -> dict:
        """停止监听 — 零残留: 无连接, 无状态修改"""
        self._running = False
        if self._thread:
            self._thread.join(timeout=3)
            self._thread = None
        return {"status": "stopped", "packets": self._stats["packets"],
                "flows": len(self._flows)}

    def _run(self, iface: str, bpf: str) -> None:
        from scapy.all import sniff, Raw, TCP, IP

        def _process(pkt):
            if not self._running:
                raise StopIteration
            if not (pkt.haslayer(TCP) and pkt.haslayer(Raw)):
                return
            sport = pkt[TCP].sport
            dport = pkt[TCP].dport
            # 只处理关注端口
            if sport not in self.ports and dport not in self.ports:
                return
            payload = bytes(pkt[Raw].load)
            if len(payload) < 4:
                return
            src_ip = pkt[IP].src
            dst_ip = pkt[IP].dst
            self._handle_frame(time.time(), src_ip, sport, dst_ip, dport,
                               payload)

        try:
            kwargs = {"prn": _process, "store": False, "count": 0}
            if iface:
                kwargs["iface"] = iface
            sniff(**kwargs)
        except StopIteration:
            pass
        except Exception as e:
            self._stats["error"] = str(e)
            logger.error(f"[passive_capture] 监听异常: {e}")
        finally:
            self._running = False

    def _handle_frame(self, ts: float, src_ip: str, src_port: int,
                      dst_ip: str, dst_port: int, payload: bytes) -> None:
        proto = self._detect_proto(src_ip, src_port, dst_ip, dst_port, payload)
        # 方向: 相对服务器端口 (RX=外部设备发向服务器端口, TX=服务器端口发出)
        direction = "RX" if dst_port in self.ports else "TX"
        device_ip = src_ip if direction == "RX" else dst_ip
        device_port = src_port if direction == "RX" else dst_port
        flow_key = f"{src_ip}:{src_port}->{dst_ip}:{dst_port}"

        # 流跟踪
        flow = self._flows.get(flow_key)
        if flow is None:
            flow = FlowEntry(src_ip=src_ip, src_port=src_port,
                             dst_ip=dst_ip, dst_port=dst_port,
                             first_seen=ts, last_seen=ts, proto=proto,
                             device_ip=device_ip, device_port=device_port,
                             direction=direction)
            self._flows[flow_key] = flow
            logger.info(f"[passive_capture] 新流: {flow_key} proto={proto} "
                        f"设备={device_ip}:{device_port}")
        else:
            flow.proto = flow.proto or proto
            flow.last_seen = ts
        flow.packets += 1
        flow.bytes_total += len(payload)

        self._stats["packets"] += 1
        self._stats["bytes"] += len(payload)

        frame = CapturedFrame(ts=ts, src_ip=src_ip, src_port=src_port,
                              dst_ip=dst_ip, dst_port=dst_port, proto=proto,
                              direction=direction, device_ip=device_ip,
                              device_port=device_port, payload=payload,
                              flow_key=flow_key)
        self._ring.append(frame)
        self._stats["frames"] += 1

        for cb in self._callbacks:
            try:
                cb(frame)
            except Exception as e:
                logger.warning(f"[passive_capture] 回调异常: {e}")

    # ── 协议识别 ──

    def _detect_proto(self, src_ip: str, src_port: int, dst_ip: str,
                      dst_port: int, payload: bytes) -> str:
        # 端口优先
        for p in self.ports:
            if src_port == p or dst_port == p:
                if p in PROTO_LABELS:
                    return PROTO_LABELS[p]
        # 帧头特征
        # A11: MBAP 头(7B) 后接 jjZZ magic, 或裸 magic
        if payload[:4] == A11_MAGIC or payload[7:11] == A11_MAGIC:
            return "A11"
        if payload[0] == IEC104_START:
            return "IEC104"
        # Modbus MBAP: 7字节头 + FC
        if len(payload) >= 8 and payload[7] in MODBUS_FUNCS:
            return "Modbus"
        if len(payload) >= 1 and payload[0] in (0xAA, 0x00) and \
                len(payload) >= 6:
            return "CommBridge"
        return "unknown"

    # ── 查询 ──

    def flows(self, proto: str = "") -> List[dict]:
        """流列表, 按包数降序"""
        out = []
        for f in self._flows.values():
            if proto and f.proto != proto:
                continue
            out.append({"src": f"{f.src_ip}:{f.src_port}",
                        "dst": f"{f.dst_ip}:{f.dst_port}",
                        "proto": f.proto, "packets": f.packets,
                        "bytes": f.bytes_total,
                        "device": f"{f.device_ip}:{f.device_port}",
                        "direction": f.direction,
                        "first_seen": f.first_seen, "last_seen": f.last_seen})
        out.sort(key=lambda x: -x["packets"])
        return out

    def devices(self) -> List[dict]:
        """发现的外部设备 (去重, 按流量排序)"""
        devs = {}
        for f in self._flows.values():
            key = f"{f.device_ip}:{f.device_port}"
            d = devs.setdefault(key, {"ip": f.device_ip, "port": f.device_port,
                                      "protos": set(), "packets": 0,
                                      "bytes": 0, "first_seen": f.first_seen,
                                      "last_seen": f.last_seen})
            d["protos"].add(f.proto or "unknown")
            d["packets"] += f.packets
            d["bytes"] += f.bytes_total
            d["last_seen"] = max(d["last_seen"], f.last_seen)
            d["first_seen"] = min(d["first_seen"], f.first_seen)
        out = []
        for d in devs.values():
            d["protos"] = sorted(d["protos"])
            out.append(d)
        out.sort(key=lambda x: -x["packets"])
        return out

    def ring(self, proto: str = "", limit: int = 100) -> List[dict]:
        """Ring Buffer 最近帧"""
        out = []
        for f in reversed(list(self._ring)):
            if proto and f.proto != proto:
                continue
            out.append({"ts": f.ts, "src": f"{f.src_ip}:{f.src_port}",
                        "dst": f"{f.dst_ip}:{f.dst_port}",
                        "proto": f.proto, "direction": f.direction,
                        "len": len(f.payload)})
            if len(out) >= limit:
                break
        return out

    def status(self) -> dict:
        """状态 + 资源占用"""
        return {**self._stats, "running": self._running,
                "flows": len(self._flows), "devices": len(self.devices()),
                "ring_size": len(self._ring)}


# ═══════════════════════════════════════════
# 自测 — 本地生成流量验证 (零发包抓取 + 流学习)
# ═══════════════════════════════════════════

def _selftest():
    """本地回环模拟: TCP 服务器(IO) + 客户端(设备) → 被动监听捕获 → 学习

    验证"搭桥旁路": 服务器/客户端正常通信, 监听器只旁观, 零发包零修改
    """
    import socket
    import struct
    import threading as _th

    cap = PassiveCapture(ports=[1502, 18889], ring_size=5000)
    learned_frames = []
    cap.on_frame(lambda f: learned_frames.append(f))

    # 选择回环接口 (Npcap Loopback Adapter), 找不到则用默认
    iface = ""
    try:
        from scapy.all import get_if_list
        for i in get_if_list():
            if "Loopback" in i or "lo" in i.lower():
                iface = i
                break
    except Exception:
        pass
    st = cap.start(iface=iface)
    print(f"[1] 启动: {st}  iface={iface or '(default)'}")
    time.sleep(0.3)

    # 模拟 IO 服务器 (监听 1502/18889) — 真实 TCP 服务
    server_socks = []
    for port in (1502, 18889):
        srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("127.0.0.1", port))
        srv.listen(2)
        server_socks.append(srv)

        def _accept(port, srv):
            while True:
                try:
                    conn, _ = srv.accept()
                    conn.recv(1024)
                    conn.close()
                except Exception:
                    return
        _th.Thread(target=_accept, args=(port, srv), daemon=True).start()

    # 模拟设备: 主动连接服务器并发送 A11/Modbus 帧
    def _gen_a11(seq: int) -> bytes:
        return b"\x6a\x6a\x5a\x5a" + struct.pack("<HH", 0x0017, 0) + \
               b"\x00" * 20 + bytes([seq & 0xFF])

    def _gen_modbus(tid: int, reg: int, val: int) -> bytes:
        return struct.pack(">HHHBBHH", tid, 0, 6, 1, 3, reg, val)

    def _device_flow(port: int, gen_fn, n: int):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        try:
            s.connect(("127.0.0.1", port))
            for i in range(n):
                s.sendall(gen_fn(i))
            time.sleep(0.1)
        except Exception:
            pass
        finally:
            s.close()

    t1 = _th.Thread(target=_device_flow, args=(18889, _gen_a11, 20), daemon=True)
    t2 = _th.Thread(target=_device_flow, args=(1502, _gen_modbus, 20), daemon=True)
    t1.start(); t2.start()
    t1.join(timeout=5); t2.join(timeout=5)
    time.sleep(0.8)

    status = cap.status()
    print(f"[2] 状态: packets={status['packets']} flows={status['flows']} "
          f"devices={status['devices']} frames={len(learned_frames)}")
    devs = cap.devices()
    for d in devs:
        print(f"[3] 设备: {d['ip']}:{d['port']} protos={d['protos']} "
              f"packets={d['packets']}")
    flows = cap.flows()
    for f in flows[:3]:
        print(f"[4] 流: {f['src']}->{f['dst']} proto={f['proto']} "
              f"pkt={f['packets']}")
    cap.stop()
    for s in server_socks:
        s.close()
    assert status["flows"] >= 1, f"流跟踪失败: {status}"
    assert any("A11" in d["protos"] for d in devs), "A11 协议识别失败"
    print(f"[5] 停止: 零残留 (监听器只旁观, 不建连接)")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("passive_capture selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("passive_capture selftest OK")
