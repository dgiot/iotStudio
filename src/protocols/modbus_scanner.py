#!/usr/bin/env python3
# ============================================================
# dgiot_lite — Modbus 从站+点位扫描器
# 来源: dgiot_collector/src/core/connectivity/slave_scanner.py
#       dgiot_collector/src/core/modbus_point_scanner.py
# ============================================================
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed

from .modbus_native import ModbusNativeClient

logger = logging.getLogger(__name__)


@dataclass
class SlaveScanResult:
    slave_id: int
    responded: bool
    error_message: str = ""


@dataclass
class RegisterScanResult:
    address: int
    success: bool
    value: Optional[int] = None
    error: Optional[str] = None


class SlaveScanner:
    """Modbus 从站地址扫描器 — 扫描 1-247 从站"""

    def __init__(self, host: str, port: int = 502, timeout: float = 1.0, max_workers: int = 10):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.max_workers = min(max_workers, 20)

    def scan_single(self, slave_id: int) -> SlaveScanResult:
        """扫描单个从站"""
        client = ModbusNativeClient(self.host, self.port, slave_id, timeout=self.timeout)
        if not client.connect():
            return SlaveScanResult(slave_id, False, "连接失败")
        try:
            values = client.read_holding_registers(0, 1)
            if values and len(values) > 0:
                return SlaveScanResult(slave_id, True)
            return SlaveScanResult(slave_id, False, "无响应")
        except Exception as e:
            return SlaveScanResult(slave_id, False, str(e))
        finally:
            client.disconnect()

    def scan_range(self, start: int = 1, end: int = 247) -> List[SlaveScanResult]:
        """并发扫描从站范围"""
        results = []
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {executor.submit(self.scan_single, sid): sid for sid in range(start, end + 1)}
            for future in as_completed(futures):
                results.append(future.result())
        return sorted(results, key=lambda r: r.slave_id)

    def find_active(self, start: int = 1, end: int = 10) -> List[int]:
        """快速扫描，返回活跃从站 ID 列表"""
        results = self.scan_range(start, end)
        return [r.slave_id for r in results if r.responded]


class PointScanner:
    """Modbus 点位扫描器 — 发现有效寄存器地址"""

    def __init__(self, host: str, port: int = 502, slave_id: int = 1, timeout: float = 1.0):
        self.host = host
        self.port = port
        self.slave_id = slave_id
        self.timeout = timeout
        self._client: Optional[ModbusNativeClient] = None

    def connect(self) -> bool:
        self._client = ModbusNativeClient(self.host, self.port, self.slave_id, timeout=self.timeout)
        return self._client.connect()

    def disconnect(self):
        if self._client:
            self._client.disconnect()

    def scan_register(self, addr: int) -> RegisterScanResult:
        """扫描单个寄存器"""
        if not self._client or not self._client.connected:
            return RegisterScanResult(addr, False, error="未连接")
        try:
            values = self._client.read_holding_registers(addr, 1)
            if values and len(values) > 0:
                return RegisterScanResult(addr, True, values[0])
            return RegisterScanResult(addr, False, error="无响应")
        except Exception as e:
            return RegisterScanResult(addr, False, error=str(e))

    def scan_range(self, start: int, count: int, max_workers: int = 10) -> List[RegisterScanResult]:
        """并发扫描寄存器范围"""
        results = []
        with ThreadPoolExecutor(max_workers=min(max_workers, 20)) as executor:
            futures = {executor.submit(self.scan_register, addr): addr
                       for addr in range(start, start + count)}
            for future in as_completed(futures):
                results.append(future.result())
        return sorted(results, key=lambda r: r.address)

    def scan_block(self, start: int, count: int) -> Optional[List[int]]:
        """批量读取一个连续寄存器块"""
        if not self._client or not self._client.connected:
            return None
        if count > 125:  # Modbus 单次最大 125 个寄存器
            count = 125
        return self._client.read_holding_registers(start, count)
