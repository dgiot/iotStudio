#!/usr/bin/env python3
""" dgiot_lite — Modbus 从站+点位扫描器 (pymodbus) + IPv6 支持 """
import logging
import socket
import struct
import time
from typing import List, Optional
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed
from pymodbus.client import ModbusTcpClient

logger = logging.getLogger(__name__)

@dataclass
class SlaveScanResult: slave_id:int; responded:bool; host:str=""; error_message:str=""
@dataclass
class RegisterScanResult: address:int; success:bool; value:int=None; error:str=None

class SlaveScanner:
    """Modbus 从站扫描器（支持 IPv4/IPv6）"""
    def __init__(self, host:str, port:int=502, timeout:float=1.0, max_workers:int=10):
        self.host=host;self.port=port;self.timeout=timeout;self.max_workers=min(max_workers,20)
        self._is_ipv6 = ':' in host
    def scan_single(self, slave_id:int)->SlaveScanResult:
        c=ModbusTcpClient(self.host,self.port,timeout=self.timeout)
        if not c.connect(): return SlaveScanResult(slave_id,False,self.host,"连接失败")
        try:
            r=c.read_holding_registers(0,1,slave=slave_id)
            ok=not r.isError()
            return SlaveScanResult(slave_id,ok,self.host,"" if ok else "无响应")
        except Exception as e: return SlaveScanResult(slave_id,False,self.host,str(e))
        finally: c.close()
    def scan_range(self,start:int=1,end:int=247)->List[SlaveScanResult]:
        results=[]
        with ThreadPoolExecutor(max_workers=self.max_workers) as ex:
            futures={ex.submit(self.scan_single,sid):sid for sid in range(start,end+1)}
            for f in as_completed(futures): results.append(f.result())
        return sorted(results,key=lambda r:r.slave_id)
    def find_active(self,start:int=1,end:int=10)->List[int]:
        return [r.slave_id for r in self.scan_range(start,end) if r.responded]


class IPv6SlaveScanner:
    """IPv6 前缀扫描器 — 扫描 IPv6 地址段 + Modbus 从站

    工业园场景：RTU 通过 IPv6 组网，前缀 240C:8042:F000::
    用法: scanner = IPv6SlaveScanner('240C:8042:F000::', port=502)
          results = scanner.scan_subnets(1, 50, slave_range=(1, 20))
    """
    def __init__(self, ipv6_prefix: str, port: int = 502, timeout: float = 2.0):
        self.prefix = ipv6_prefix.rstrip(':')  # 240C:8042:F000::
        self.port = port
        self.timeout = timeout
        self.results = []

    def _connect_subnet(self, subnet_id: int) -> Optional[socket.socket]:
        """连接指定子网 ID 的 IPv6 地址"""
        host = f"{self.prefix}{subnet_id:04d}"
        try:
            sock = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
            sock.settimeout(self.timeout)
            sock.connect((host, self.port))
            return sock
        except Exception:
            return None

    def _try_read_slave(self, sock: socket.socket, slave_id: int, host: str) -> dict:
        """通过 raw socket 发送 Modbus TCP 读保持寄存器请求"""
        t0 = time.time()
        try:
            # Modbus TCP 帧头 + FC03 请求
            req = struct.pack('>HHHBBHH', 0, 0, 6, slave_id, 0x03, 0, 1)
            sock.sendall(req)
            resp = sock.recv(256)
            latency = round((time.time() - t0) * 1000, 1)
            return {'slave_id': slave_id, 'host': host, 'success': True, 'latency_ms': latency}
        except Exception as e:
            return {'slave_id': slave_id, 'host': host, 'success': False, 'error': str(e)}

    def scan_subnets(self, start_subnet: int = 1, end_subnet: int = 50,
                     slave_range: tuple = (1, 20)) -> List[dict]:
        """扫描子网段 + 从站"""
        results = []
        for subnet in range(start_subnet, end_subnet + 1):
            sock = self._connect_subnet(subnet)
            if not sock:
                continue
            host = f"{self.prefix}{subnet:04d}"
            try:
                for sid in range(slave_range[0], min(slave_range[1] + 1, 249)):
                    r = self._try_read_slave(sock, sid, host)
                    if r['success']:
                        results.append(r)
                        logger.info(f"[ipv6] 发现 {host}:{self.port} 从站#{sid}")
            finally:
                try: sock.close()
                except: pass
        self.results = results
        return results

class PointScanner:
    """点位扫描器"""
    def __init__(self,host:str,port:int=502,slave_id:int=1,timeout:float=1.0):
        self.host=host;self.port=port;self.slave_id=slave_id;self.timeout=timeout;self._c=None
    def connect(self)->bool: self._c=ModbusTcpClient(self.host,self.port,timeout=self.timeout);return self._c.connect()
    def disconnect(self):
        if self._c: self._c.close()
    def scan_register(self,addr:int)->RegisterScanResult:
        if not self._c: return RegisterScanResult(addr,False,error="未连接")
        try:
            r=self._c.read_holding_registers(addr,1,slave=self.slave_id)
            if not r.isError(): return RegisterScanResult(addr,True,r.registers[0])
            return RegisterScanResult(addr,False,error="异常")
        except Exception as e: return RegisterScanResult(addr,False,error=str(e))
    def scan_range(self,start:int,count:int,max_workers:int=10)->List[RegisterScanResult]:
        results=[]
        with ThreadPoolExecutor(max_workers=min(max_workers,20)) as ex:
            futures={ex.submit(self.scan_register,addr):addr for addr in range(start,start+count)}
            for f in as_completed(futures): results.append(f.result())
        return sorted(results,key=lambda r:r.address)
