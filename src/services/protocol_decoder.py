#!/usr/bin/env python3
"""
协议解码器 — 被动监听的帧解析层
=================================
对标需求: 被动检测需要抓包分析 — 从镜像流量中解码出结构化数据点

复用已有解析器 (零重复实现):
  - A11       → A11Message.decode_batch (a11.py)
  - LegacyComm→ parse_response / parse_reg_values (commbridge_server.py)
  - Modbus TCP→ MBAP + FC 解析 (内联, 依赖 pymodbus 可选)
  - IEC104    → 内联 (帧头 0x68)

输入: 被动监听帧 (CapturedFrame)
输出: DecodedPoint 列表 — {device, point_id, value, ts, quality, protocol}

用法:
  decoder = ProtocolDecoder()
  cap.on_frame(decoder.on_frame)          # 接线到被动监听
  points = decoder.take()                 # 消费解码结果 (供入库/流式引擎)

自测: python -m src.services.protocol_decoder
"""
import logging
import struct
from collections import deque
from dataclasses import dataclass, field
from typing import Deque, Dict, List, Optional

logger = logging.getLogger("protocol_decoder")

MAX_POINTS = 100000                 # 解码点缓冲上限


@dataclass
class DecodedPoint:
    """解码出的数据点"""
    ts: float
    device_id: str
    point_id: str
    value: float
    quality: int = 192              # 192=良好 (对齐 DG-IoT 标准)
    protocol: str = ""
    raw_hex: str = ""


class ProtocolDecoder:
    """统一协议解码器 — A11 / Modbus TCP / LegacyComm / IEC104"""

    def __init__(self, max_points: int = MAX_POINTS):
        self._points: Deque[DecodedPoint] = deque(maxlen=max_points)
        self._stats = {"frames": 0, "decoded": 0, "skipped": 0,
                       "by_proto": {}, "started_at": __import__("time").time()}

    # ── 帧接入 ──

    def on_frame(self, frame) -> None:
        """被动监听回调: 解码一帧"""
        self._stats["frames"] += 1
        proto = frame.proto
        device = f"{frame.device_ip}:{frame.device_port}"
        try:
            if proto == "A11":
                pts = self._decode_a11(frame, device)
            elif proto == "Modbus":
                pts = self._decode_modbus(frame, device)
            elif proto == "LegacyComm":
                pts = self._decode_commbridge(frame, device)
            elif proto == "IEC104":
                pts = self._decode_iec104(frame, device)
            else:
                self._stats["skipped"] += 1
                return
        except Exception as e:
            logger.warning(f"[decoder] {proto} 解码失败: {e}")
            self._stats["skipped"] += 1
            return

        for p in pts:
            self._points.append(p)
            self._stats["decoded"] += 1
            self._stats["by_proto"][proto] = self._stats["by_proto"].get(proto, 0) + 1

    # ── 解码器 ──

    def _decode_a11(self, frame, device: str) -> List[DecodedPoint]:
        """A11 — 复用 A11Message.decode_batch"""
        from src.protocols.a11 import A11Message
        msgs = A11Message.decode_batch(frame.payload, frame.ts)
        pts = []
        for m in msgs:
            # 遥测类消息提取 payload 值 (简化: 记录消息级信息)
            pts.append(DecodedPoint(ts=frame.ts, device_id=device,
                                    point_id=f"a11_0x{m.msg_type:04X}",
                                    value=0.0, quality=192, protocol="A11",
                                    raw_hex=m.payload[:16].hex()))
        return pts

    def _decode_modbus(self, frame, device: str) -> List[DecodedPoint]:
        """Modbus TCP — MBAP(7B) + FC + 数据"""
        p = frame.payload
        if len(p) < 8:
            return []
        fc = p[7]
        pts = []
        # 请求方向: 寄存器地址+数量 (读)
        if fc in (1, 2, 3, 4):
            if len(p) >= 12:
                addr = (p[8] << 8) | p[9]
                count = (p[10] << 8) | p[11]
                pts.append(DecodedPoint(ts=frame.ts, device_id=device,
                                        point_id=f"hr_{addr}",
                                        value=float(addr), quality=192,
                                        protocol="Modbus",
                                        raw_hex=f"FC{fc} addr={addr} n={count}"))
        # 响应方向: 字节数 + 值 (帧方向 TX)
        elif fc in (1, 2, 3, 4) and frame.direction == "TX" and len(p) >= 9:
            byte_count = p[8]
            for i in range(byte_count // 2):
                off = 9 + i * 2
                if off + 2 <= len(p):
                    val = struct.unpack(">H", p[off:off + 2])[0]
                    pts.append(DecodedPoint(ts=frame.ts, device_id=device,
                                            point_id=f"hr_{i}",
                                            value=float(val), quality=192,
                                            protocol="Modbus",
                                            raw_hex=p[off:off+2].hex()))
        return pts

    def _decode_commbridge(self, frame, device: str) -> List[DecodedPoint]:
        """LegacyComm — 复用 parse_response / parse_reg_values"""
        from src.protocols.commbridge_server import parse_response, parse_reg_values
        parsed = parse_response(frame.payload)
        if not parsed:
            return []
        if parsed.get("is_heartbeat"):
            return []
        func = parsed.get("func", 0)
        data = parsed.get("data", b"")
        vals = parse_reg_values(data, func)
        pts = []
        if vals and vals.get("values"):
            for i, v in enumerate(vals["values"]):
                pts.append(DecodedPoint(ts=frame.ts, device_id=device,
                                        point_id=f"slave{parsed.get('slave')}_r{i}",
                                        value=float(v), quality=192,
                                        protocol="LegacyComm",
                                        raw_hex=data[:8].hex()))
        else:
            pts.append(DecodedPoint(ts=frame.ts, device_id=device,
                                    point_id=f"cb_slave{parsed.get('slave')}",
                                    value=0.0, quality=192, protocol="LegacyComm",
                                    raw_hex=frame.payload[:16].hex()))
        return pts

    def _decode_iec104(self, frame, device: str) -> List[DecodedPoint]:
        """IEC104 — 帧头 0x68, 提取遥测类型"""
        p = frame.payload
        if len(p) < 10 or p[0] != 0x68:
            return []
        # APDU 长度
        apdu_len = p[1]
        if apdu_len < 4 or len(p) < 2 + apdu_len:
            return []
        # I 帧: 类型标识在偏移 4
        type_id = p[4] if len(p) > 4 else 0
        pts = [DecodedPoint(ts=frame.ts, device_id=device,
                            point_id=f"iec104_t{type_id}",
                            value=0.0, quality=192, protocol="IEC104",
                            raw_hex=p[:12].hex())]
        return pts

    # ── 消费 ──

    def take(self, limit: int = -1) -> List[DecodedPoint]:
        """消费解码点 (用于写入存储/流式引擎)"""
        if limit < 0:
            out = list(self._points)
            self._points.clear()
            return out
        out = []
        for _ in range(min(limit, len(self._points))):
            out.append(self._points.popleft())
        return out

    def stats(self) -> dict:
        return {**self._stats}


# ═══════════════════════════════════════════
# 自测 — 构造各协议帧验证解码
# ═══════════════════════════════════════════

def _selftest():
    import time as _t
    from types import SimpleNamespace

    dec = ProtocolDecoder()
    t0 = _t.time()

    def _frame(proto: str, payload: bytes, device_ip="192.168.1.10",
               device_port=502, direction="RX"):
        return SimpleNamespace(ts=t0, proto=proto, payload=payload,
                               device_ip=device_ip, device_port=device_port,
                               direction=direction)

    # A11 帧: MBAP头(7B) + PDU(jjZZ magic + type 0x0017 心跳)
    a11_pdu = b"\x6a\x6a\x5a\x5a" + struct.pack("<HH", 0x0017, 0) + \
              b"\x00" * 20 + b"\x01"
    a11_frame = struct.pack(">HHHB", 1, 0, len(a11_pdu) + 1, 1) + a11_pdu
    dec.on_frame(_frame("A11", a11_frame, device_port=8889))

    # Modbus 读请求 FC03 addr=400 n=2
    mb_req = struct.pack(">HHHBBHH", 1, 0, 6, 1, 3, 400, 2)
    dec.on_frame(_frame("Modbus", mb_req, direction="RX"))

    # Modbus 响应 FC03 4字节 (2×uint16)
    mb_resp = struct.pack(">HHHBBBH", 1, 0, 7, 1, 3, 4, 0x03E8) + \
              struct.pack(">H", 0x03E9)
    dec.on_frame(_frame("Modbus", mb_resp, direction="TX"))

    # LegacyComm 数据帧
    cb_frame = bytes([1, 0, 0, 0, 0, 6, 10, 0x03, 4]) + struct.pack(">HH", 100, 200)
    dec.on_frame(_frame("LegacyComm", cb_frame, device_port=53001))

    # IEC104 帧
    iec_frame = b"\x68" + bytes([14, 0, 0, 0, 0x09, 0x06, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6])
    dec.on_frame(_frame("IEC104", iec_frame, device_port=2404))

    pts = dec.take()
    print(f"[1] 解码点数: {len(pts)}")
    by_proto = {}
    for p in pts:
        by_proto[p.protocol] = by_proto.get(p.protocol, 0) + 1
        print(f"    {p.protocol:10s} {p.device_id:20s} {p.point_id:14s} "
              f"v={p.value}")
    print(f"[2] 分协议: {by_proto}")
    print(f"[3] 统计: {dec.stats()['decoded']} 解码 "
          f"{dec.stats()['skipped']} 跳过")
    assert dec.stats()["decoded"] >= 4, "解码失败"
    assert by_proto.get("A11") == 1 and by_proto.get("LegacyComm") >= 1
    print("protocol_decoder selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("protocol_decoder selftest OK")
