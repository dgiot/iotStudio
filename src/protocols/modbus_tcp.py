# ============================================================
# pythonIot — Modbus TCP 协议适配器
# ============================================================
import struct, time
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

from pymodbus.client import AsyncModbusTcpClient
from pymodbus.exceptions import ModbusException

# 全局报文日志（由 main.py 注入）
_packet_logger = None
def set_packet_logger(fn): global _packet_logger; _packet_logger = fn

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)


class ModbusTCPAdapter(BaseProtocolAdapter):
    """Modbus TCP 协议适配器

    配置示例 (config.extra):
    {
        "host": "192.168.1.100",
        "port": 502,
        "slave_id": 1
    }
    """

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self.client: Optional[AsyncModbusTcpClient] = None

    async def connect(self) -> bool:
        try:
            extra = self.config.extra
            self.client = AsyncModbusTcpClient(
                host=extra.get("host", "127.0.0.1"),
                port=extra.get("port", 502),
                timeout=self.config.timeout,
                retries=self.config.retry,
            )
            await self.client.connect()
            self._connected = True
            logger.info(f"[modbus_tcp] {self.device_id} 连接成功 host={extra['host']}:{extra.get('port', 502)}")
            return True
        except Exception as e:
            logger.error(f"[modbus_tcp] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if self.client:
            self.client.close()
        self._connected = False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        if not self.client or not self._connected:
            await self.connect()
            if not self._connected:
                return []

        slave_id = self.config.extra.get("slave_id", 1)
        results = []
        batch: Dict[tuple, List[tuple]] = {}

        for pt in points:
            addr = self._resolve_addr(pt.get("protocol_addr", "0"))
            func = int(pt.get("register_type", "3"))
            dtype = pt.get("data_type", "float32")
            cnt = {"int16": 1, "uint16": 1, "int32": 2, "uint32": 2, "float32": 2, "float64": 4}.get(dtype, 2)
            key = (func, addr, cnt)
            batch.setdefault(key, []).append((pt, dtype))

        for (func, addr, cnt), items in batch.items():
            try:
                regs = await self._read(func, addr, cnt, slave_id)
                if regs is None:
                    continue
                for pt, dtype in items:
                    offset = self._resolve_addr(pt.get("protocol_addr", "0")) - addr
                    val = self._decode(regs, offset, dtype)
                    if val is not None:
                        results.append(PointValue(
                            device_id=self.device_id,
                            point_id=pt.get("point_id", ""),
                            point_name=pt.get("point_name", ""),
                            value=round(val * pt.get("scale", 1.0) + pt.get("offset", 0.0), 6),
                            data_type=dtype,
                            unit=pt.get("unit"),
                            timestamp=datetime.utcnow(),
                        ))
            except Exception as e:
                logger.warning(f"[modbus_tcp] {self.device_id} addr={addr} func={func}: {e}")

        return results

    async def _read(self, func: int, addr: int, cnt: int, slave: int) -> Optional[list]:
        # 构建请求报文 hex
        req_hex = f"0001 0000 0006 {slave:02x} {func:02x} {addr>>8:02x}{addr&0xff:02x} {cnt>>8:02x}{cnt&0xff:02x}"
        try:
            if func == 3:
                r = await self.client.read_holding_registers(addr, cnt, slave)
            elif func == 4:
                r = await self.client.read_input_registers(addr, cnt, slave)
            elif func == 1:
                r = await self.client.read_coils(addr, cnt, slave)
            elif func == 2:
                r = await self.client.read_discrete_inputs(addr, cnt, slave)
            else:
                r = await self.client.read_holding_registers(addr, cnt, slave)
            regs = list(r.registers) if hasattr(r, 'registers') else None
            # 记录报文 (运行时导入避免循环依赖)
            if regs:
                try:
                    from src.main import log_packet as _lp
                    resp_bytes = struct.pack(f'>{len(regs)}H', *regs)
                    resp_hex = f"0001 0000 {3+len(regs)*2:04x} {slave:02x} {func:02x} {len(regs)*2:02x} " + resp_bytes.hex(' ')
                    _lp(self.device_id, "TX", bytes.fromhex(req_hex.replace(' ','')))
                    _lp(self.device_id, "RX", bytes.fromhex(resp_hex.replace(' ','')))
                except: pass
            return regs
        except ModbusException:
            self._connected = False
            return None

    def _decode(self, regs: list, offset: int, dtype: str) -> Optional[Any]:
        if offset < 0 or offset >= len(regs):
            return None
        try:
            if dtype == "int16":
                return regs[offset] - 65536 if regs[offset] >= 32768 else regs[offset]
            elif dtype == "uint16":
                return regs[offset]
            elif dtype == "int32":
                v = (regs[offset] << 16) | regs[offset + 1]
                return v - 2**32 if v >= 2**31 else v
            elif dtype == "uint32":
                return (regs[offset] << 16) | regs[offset + 1]
            elif dtype == "float32":
                return struct.unpack('>f', struct.pack('>HH', regs[offset], regs[offset + 1]))[0]
            elif dtype == "float64":
                return struct.unpack('>d', struct.pack('>HHHH', *regs[offset:offset + 4]))[0]
            return regs[offset]
        except (IndexError, struct.error):
            return None

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        if not self.client or not self._connected:
            return False
        try:
            addr = self._resolve_addr(point.get("protocol_addr", "0"))
            slave = self.config.extra.get("slave_id", 1)
            func = int(point.get("register_type", "6"))
            if func == 6:
                await self.client.write_register(addr, int(value), slave)
            elif func == 16:
                await self.client.write_registers(addr, [int(value)], slave)
            return True
        except Exception:
            return False

    @staticmethod
    def _resolve_addr(a: str) -> int:
        if isinstance(a, int):
            return a
        s = str(a).strip()
        return int(s, 16) if s.lower().startswith("0x") else (int(s) if s.isdigit() else 0)
