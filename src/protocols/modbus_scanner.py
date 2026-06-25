#!/usr/bin/env python3
""" dgiot_lite — Modbus 从站+点位扫描器 (pymodbus) """
import logging
from typing import List, Optional
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed
from pymodbus.client import ModbusTcpClient

logger = logging.getLogger(__name__)

@dataclass
class SlaveScanResult: slave_id:int; responded:bool; error_message:str=""
@dataclass
class RegisterScanResult: address:int; success:bool; value:int=None; error:str=None

class SlaveScanner:
    """Modbus 从站扫描器"""
    def __init__(self, host:str, port:int=502, timeout:float=1.0, max_workers:int=10):
        self.host=host;self.port=port;self.timeout=timeout;self.max_workers=min(max_workers,20)
    def scan_single(self, slave_id:int)->SlaveScanResult:
        c=ModbusTcpClient(self.host,self.port,timeout=self.timeout)
        if not c.connect(): return SlaveScanResult(slave_id,False,"连接失败")
        try:
            r=c.read_holding_registers(0,1,slave=slave_id)
            ok=not r.isError()
            return SlaveScanResult(slave_id,ok,"" if ok else "无响应")
        except Exception as e: return SlaveScanResult(slave_id,False,str(e))
        finally: c.close()
    def scan_range(self,start:int=1,end:int=247)->List[SlaveScanResult]:
        results=[]
        with ThreadPoolExecutor(max_workers=self.max_workers) as ex:
            futures={ex.submit(self.scan_single,sid):sid for sid in range(start,end+1)}
            for f in as_completed(futures): results.append(f.result())
        return sorted(results,key=lambda r:r.slave_id)
    def find_active(self,start:int=1,end:int=10)->List[int]:
        return [r.slave_id for r in self.scan_range(start,end) if r.responded]

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
