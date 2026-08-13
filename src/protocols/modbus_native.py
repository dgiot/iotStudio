#!/usr/bin/env python3
# ============================================================
# iotStudio — Modbus TCP 原生 Socket 客户端
# 来源: dgiot_collector/src/core/modbus_client.py
# 特性: IPv4/IPv6双栈, 报文追溯, 连接统计, 零外部依赖
# ============================================================
import socket
import struct
import time
import logging
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


class ModbusPacketTracer:
    """报文追溯器 — 记录收发报文"""
    def __init__(self):
        self.history: List[Dict] = []
    def trace(self, direction: str, raw: bytes):
        self.history.append({"dir": direction, "len": len(raw), "hex": raw.hex(), "ts": time.time()})


class ModbusNativeClient:
    """原生 Socket Modbus TCP 客户端

    不依赖 pymodbus，支持 IPv4/IPv6，带连接统计和报文追溯。
    """

    def __init__(self, host: str, port: int = 502, slave_id: int = 1, timeout: int = 5):
        self.host = host
        self.port = port
        self.slave_id = slave_id
        self.timeout = timeout
        self._sock: Optional[socket.socket] = None
        self.connected = False
        self.transaction_id = 0
        self.tracer = ModbusPacketTracer()
        self.stats = {"sent": 0, "received": 0, "errors": 0, "timeouts": 0, "reconnects": 0,
                       "bytes_sent": 0, "bytes_recv": 0}

    # ===== 连接管理 =====

    def connect(self) -> bool:
        """连接设备 (IPv4/IPv6 自动检测, 指数退避重试)"""
        delay = 1
        for attempt in range(3):
            try:
                if ':' in self.host and '.' not in self.host:
                    clean = self.host.strip('[]')
                    self._sock = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
                    try:
                        self._sock.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
                    except (AttributeError, OSError):
                        self._sock.setsockopt(41, 27, 0)
                else:
                    self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

                self._sock.settimeout(self.timeout)
                self._sock.connect((self.host, self.port))
                self.connected = True
                self.stats["reconnects"] += 1
                return True
            except Exception as e:
                self.stats["errors"] += 1
                if attempt < 2:
                    time.sleep(delay); delay *= 2
        return False

    def disconnect(self):
        if self._sock:
            try: self._sock.close()
            except: pass
        self._sock = None
        self.connected = False

    # ===== Modbus 协议操作 =====

    def _send(self, pdu: bytes) -> Optional[bytes]:
        """发送 Modbus TCP 帧并接收响应"""
        if not self._sock or not self.connected:
            return None

        self.transaction_id = (self.transaction_id + 1) % 65536
        tid = self.transaction_id
        length = 2 + len(pdu)  # uid(1) + pdu
        frame = struct.pack('>HHHB', tid, 0, length, self.slave_id) + pdu

        try:
            self._sock.send(frame)
            self.stats["sent"] += 1
            self.stats["bytes_sent"] += len(frame)
            self.tracer.trace("TX", frame)

            # 接收响应
            resp = self._recv_frame()
            if resp:
                self.stats["received"] += 1
                self.stats["bytes_recv"] += len(resp)
                self.tracer.trace("RX", resp)
                return resp
        except socket.timeout:
            self.stats["timeouts"] += 1
            self.connected = False
        except Exception as e:
            self.stats["errors"] += 1
            self.connected = False
        return None

    def _recv_frame(self) -> Optional[bytes]:
        """接收完整 MBAP 帧"""
        header = self._sock.recv(7)
        if len(header) < 7:
            return None
        tid, pid, length = struct.unpack('>HHH', header[:6])
        remaining = length - 1  # 减去 uid
        data = b''
        while len(data) < remaining:
            chunk = self._sock.recv(remaining - len(data))
            if not chunk:
                break
            data += chunk
        return header + data if len(data) == remaining else None

    # ===== 功能码 =====

    def read_holding_registers(self, addr: int, count: int) -> Optional[List[int]]:
        """FC03 — 读取保持寄存器"""
        pdu = struct.pack('>BHH', 0x03, addr, count)
        resp = self._send(pdu)
        if resp and len(resp) >= 9:
            byte_count = resp[8]
            values = []
            for i in range(count):
                offset = 9 + i * 2
                if offset + 2 <= len(resp):
                    values.append(struct.unpack('>H', resp[offset:offset + 2])[0])
            return values
        return None

    def read_input_registers(self, addr: int, count: int) -> Optional[List[int]]:
        """FC04 — 读取输入寄存器"""
        pdu = struct.pack('>BHH', 0x04, addr, count)
        resp = self._send(pdu)
        if resp and len(resp) >= 9:
            return [struct.unpack('>H', resp[9 + i * 2:11 + i * 2])[0] for i in range(count) if 9 + i * 2 + 2 <= len(resp)]
        return None

    def read_coils(self, addr: int, count: int) -> Optional[List[bool]]:
        """FC01 — 读取线圈"""
        pdu = struct.pack('>BHH', 0x01, addr, count)
        resp = self._send(pdu)
        if resp and len(resp) >= 9:
            byte_count = resp[8]
            result = []
            for i in range(count):
                result.append(bool(resp[9 + i // 8] & (1 << (i % 8))))
            return result
        return None

    def write_single_register(self, addr: int, value: int) -> bool:
        """FC06 — 写单个寄存器"""
        pdu = struct.pack('>BHH', 0x06, addr, value & 0xFFFF)
        resp = self._send(pdu)
        return resp is not None and len(resp) >= 12

    def write_multiple_registers(self, addr: int, values: List[int]) -> bool:
        """FC10 — 写多个寄存器"""
        count = len(values)
        byte_count = count * 2
        pdu = struct.pack(f'>BHHB{count}H', 0x10, addr, count, byte_count, *values)
        resp = self._send(pdu)
        return resp is not None and len(resp) >= 12


# ===== 数据解析 =====

class ModbusDataParser:
    """Modbus 寄存器数据解析器"""

    @staticmethod
    def parse_float(regs: list, offset: int, byte_order: str = "big") -> float:
        """float32 解析"""
        if offset + 1 >= len(regs):
            return 0.0
        if byte_order == "big":
            val = (regs[offset] << 16) | regs[offset + 1]
        else:
            val = (regs[offset + 1] << 16) | regs[offset]
        return struct.unpack('>f', struct.pack('>I', val))[0]

    @staticmethod
    def parse_int16(regs: list, offset: int) -> int:
        """int16 解析"""
        if offset >= len(regs):
            return 0
        return regs[offset] - 65536 if regs[offset] >= 32768 else regs[offset]

    @staticmethod
    def parse_uint16(regs: list, offset: int) -> int:
        return regs[offset] if offset < len(regs) else 0

    @staticmethod
    def parse_int32(regs: list, offset: int, byte_order: str = "big") -> int:
        if offset + 1 >= len(regs):
            return 0
        val = (regs[offset] << 16) | regs[offset + 1] if byte_order == "big" else (regs[offset + 1] << 16) | regs[offset]
        return val - 2**32 if val >= 2**31 else val

    @staticmethod
    def parse_float64(regs: list, offset: int) -> float:
        if offset + 3 >= len(regs):
            return 0.0
        b = struct.pack('>HHHH', *regs[offset:offset+4])
        return struct.unpack('>d', b)[0]


def parse_modbus_address(addr_str: str) -> int:
    """通用地址解析: 0x格式 / 十进制 / 十六进制"""
    if isinstance(addr_str, int):
        return addr_str
    s = str(addr_str).strip()
    if s.lower().startswith("0x"):
        return int(s, 16)
    if s.isdigit():
        return int(s)
    return 0
