# ============================================================
# pythonIot — Modbus RTU 协议适配器
# ============================================================
import asyncio
import struct
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

from pymodbus.client import AsyncModbusSerialClient
from pymodbus.exceptions import ModbusException

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)


class ModbusRTUAdapter(BaseProtocolAdapter):
    """Modbus RTU 协议适配器

    配置示例 (config.extra):
    {
        "port": "/dev/ttyUSB0",
        "baudrate": 9600,
        "parity": "N",       # N/E/O
        "stopbits": 1,
        "bytesize": 8,
        "slave_id": 1
    }
    """

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self.client: Optional[AsyncModbusSerialClient] = None

    async def connect(self) -> bool:
        try:
            extra = self.config.extra
            self.client = AsyncModbusSerialClient(
                port=extra.get("port", "/dev/ttyUSB0"),
                baudrate=extra.get("baudrate", 9600),
                parity=extra.get("parity", "N"),
                stopbits=extra.get("stopbits", 1),
                bytesize=extra.get("bytesize", 8),
                timeout=self.config.timeout,
                retries=self.config.retry,
            )
            await self.client.connect()
            self._connected = True
            logger.info(f"[modbus_rtu] {self.device_id} 连接成功 port={extra['port']}")
            return True
        except Exception as e:
            logger.error(f"[modbus_rtu] {self.device_id} 连接失败: {e}")
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
        group_cache: Dict[tuple, List[tuple]] = {}  # (func, addr, count) → [(point, data_type)]

        for pt in points:
            addr_str = pt.get("protocol_addr", "")
            try:
                addr = int(addr_str) if addr_str.isdigit() else int(addr_str, 16)
            except (ValueError, TypeError):
                continue

            func = int(pt.get("register_type", "3"))  # 默认 holding register
            dtype = pt.get("data_type", "float32")
            # 计算需要读取的寄存器数量
            size_map = {"int16": 1, "uint16": 1, "int32": 2, "uint32": 2, "float32": 2, "float64": 4}
            count = size_map.get(dtype, 2)

            key = (func, addr, count)
            if key not in group_cache:
                group_cache[key] = []
            group_cache[key].append((pt, dtype))

        for (func, addr, count), pts in group_cache.items():
            try:
                raw = await self._read_registers(func, addr, count, slave_id)
                if raw is None:
                    continue
                for pt, dtype in pts:
                    offset = (pt["protocol_addr"] if isinstance(pt["protocol_addr"], int)
                              else int(pt.get("protocol_addr", "0"), 16) if pt.get("protocol_addr", "0").replace('-', '').isalnum()
                              else 0)
                    offset = int(pt.get("protocol_addr", "0"), 16) if isinstance(pt.get("protocol_addr"), str) and pt["protocol_addr"].startswith("0x") else (
                        int(pt["protocol_addr"]) if isinstance(pt["protocol_addr"], str) and pt["protocol_addr"].isdigit() else 0)
                    reg_offset = (offset - addr) if isinstance(offset, int) and isinstance(addr, int) else 0
                    val = self._parse_value(raw, reg_offset, dtype)
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
                logger.warning(f"[modbus_rtu] {self.device_id} addr={addr} func={func} 读取失败: {e}")

        return results

    async def _read_registers(self, func: int, addr: int, count: int, slave_id: int) -> Optional[list]:
        """读取寄存器"""
        try:
            if func == 3:       # Holding Register
                resp = await self.client.read_holding_registers(addr, count, slave_id)
            elif func == 4:     # Input Register
                resp = await self.client.read_input_registers(addr, count, slave_id)
            elif func == 1:     # Coil
                resp = await self.client.read_coils(addr, count, slave_id)
            elif func == 2:     # Discrete Input
                resp = await self.client.read_discrete_inputs(addr, count, slave_id)
            else:
                resp = await self.client.read_holding_registers(addr, count, slave_id)

            if hasattr(resp, 'registers'):
                return list(resp.registers)
            return None
        except ModbusException:
            self._connected = False
            return None

    def _parse_value(self, registers: list, offset: int, dtype: str) -> Optional[Any]:
        """将寄存器列表解析为指定类型"""
        if offset < 0 or offset >= len(registers):
            return None
        try:
            if dtype == "int16":
                return registers[offset] if registers[offset] < 32768 else registers[offset] - 65536
            elif dtype == "uint16":
                return registers[offset]
            elif dtype == "int32":
                raw = (registers[offset] << 16) | registers[offset + 1]
                return raw if raw < 2**31 else raw - 2**32
            elif dtype == "uint32":
                return (registers[offset] << 16) | registers[offset + 1]
            elif dtype == "float32":
                raw_bytes = struct.pack('>HH', registers[offset], registers[offset + 1])
                return struct.unpack('>f', raw_bytes)[0]
            elif dtype == "float64":
                raw_bytes = struct.pack('>HHHH', registers[offset], registers[offset + 1],
                                       registers[offset + 2], registers[offset + 3])
                return struct.unpack('>d', raw_bytes)[0]
            return registers[offset]
        except (IndexError, struct.error):
            return None

    async def read_holding(self, addr: int, count: int = 1, slave_id: Optional[int] = None) -> Optional[list]:
        """读取保持寄存器 (Modbus 功能码 0x03)

        Args:
            addr: 起始寄存器地址
            count: 寄存器数量
            slave_id: 从站地址 (默认使用配置中的 slave_id)

        Returns:
            寄存器值列表，失败返回 None
        """
        sid = slave_id or self.config.extra.get("slave_id", 1)
        raw = await self._read_registers(3, addr, count, sid)
        return list(raw) if raw else None

    async def read_coils(self, addr: int, count: int = 1, slave_id: Optional[int] = None) -> Optional[list]:
        """读取线圈状态 (Modbus 功能码 0x01)

        Args:
            addr: 起始线圈地址
            count: 线圈数量
            slave_id: 从站地址 (默认使用配置中的 slave_id)

        Returns:
            线圈状态列表 [bool, ...]，失败返回 None
        """
        sid = slave_id or self.config.extra.get("slave_id", 1)
        raw = await self._read_registers(1, addr, count, sid)
        return list(raw) if raw else None

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """写入单个寄存器"""
        if not self.client or not self._connected:
            return False
        try:
            addr = int(point.get("protocol_addr", "0"))
            func = int(point.get("register_type", "6"))
            slave_id = self.config.extra.get("slave_id", 1)
            if func == 6:  # 写单个寄存器
                await self.client.write_register(addr, int(value), slave_id)
            elif func == 16:  # 写多个寄存器
                await self.client.write_registers(addr, [int(value)], slave_id)
            return True
        except Exception:
            return False

    async def health(self) -> dict:
        """健康检查 — 测试串口连接状态"""
        if self._connected and self.client:
            # 执行一次空读验证连接
            try:
                sid = self.config.extra.get("slave_id", 1)
                resp = await self.client.read_holding_registers(0, 1, sid)
                if resp and not hasattr(resp, 'registers'):
                    self._connected = False
                    return {"ok": False, "msg": "从站无响应"}
                return {"ok": True, "msg": "已连接"}
            except Exception:
                self._connected = False
                return {"ok": False, "msg": "连接已断开"}
        # 尝试重连
        try:
            ok = await self.connect()
            return {"ok": ok, "msg": "已连接" if ok else "重连失败"}
        except Exception as e:
            return {"ok": False, "msg": str(e)}


# ===== 简化版重试读取函数（解析地址） =====
def _parse_addr(addr_str: str) -> int:
    """解析地址字符串 → int"""
    if isinstance(addr_str, int):
        return addr_str
    if isinstance(addr_str, str):
        addr_str = addr_str.strip()
        if addr_str.lower().startswith("0x"):
            return int(addr_str, 16)
        if addr_str.isdigit():
            return int(addr_str)
    return 0


# -- plugin registration --
try:
    from plugin_registry import register
    register("modbus_rtu", version="1.0", category="protocol",
             adapter="ModbusRTUAdapter",
             config={
                 "port": "/dev/ttyUSB0",
                 "baudrate": 9600,
                 "parity": "N",
                 "slave_id": 1,
             })
except ImportError:
    pass
