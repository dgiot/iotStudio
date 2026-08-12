"""
OPC DA 数据采集器 — Oracle SYS_POINTRELATION_STATION
=====================================================
通过 WinRM→VBS/ADO 从 Oracle 读取 OPC DA 测点数据。
与 Modbus 采集共用同一条管线。

点位分布 (SYS_POINTRELATION_STATION, 40,410行):
  DX 前缀: 16,375 条 (OPC DA 遥测 — 注水站/联合站)
  JB 前缀: 969 条   (OPC DA 遥信)
  Z1/Z2:   18,814 条 (注水站)

用法:
  collector = OpcdaCollector(oracle_reader, event_bus)
  await collector.start(interval=300)
"""
import asyncio, logging, time, re
from typing import Optional, Dict, List
from dataclasses import dataclass

log = logging.getLogger("opcda")


@dataclass
class OpcdaPoint:
    """OPC DA 测点"""
    point_id: str
    long_name: str
    describe: str
    res_id: str
    point_name: str

    @property
    def station(self) -> str:
        """提取站名 (如 DX1ZRZ, Z1xxx)"""
        parts = self.long_name.split('/')
        for p in parts:
            if p and not p.startswith('CY') and not p.startswith('_'):
                return p.split('_')[0] if '_' in p else p[:8]
        return 'unknown'

    @property
    def point_type(self) -> str:
        """提取测点类型 (如 TGP, ZWG, ADL)"""
        match = re.search(r'([A-Z]{2,4})$', self.point_name)
        return match.group(1) if match else 'unknown'


class OpcdaCollector:
    """OPC DA Oracle 采集器"""

    def __init__(self, oracle_reader, event_bus=None):
        self._oracle = oracle_reader
        self._bus = event_bus
        self._running = False
        self._task: Optional[asyncio.Task] = None
        self._stats = {"polls": 0, "points_total": 0, "errors": 0, "last_poll": None}
        self._points_cache: Dict[str, OpcdaPoint] = {}

    async def start(self, interval: float = 300):
        self._running = True
        # 先加载点位索引
        await self._load_points()
        self._task = asyncio.create_task(self._loop(interval))
        log.info(f"[opcda] Started interval={interval}s points={len(self._points_cache)}")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()

    async def _load_points(self):
        """加载点位定义"""
        try:
            r = self._oracle.query(
                "SELECT POINT_ID, POINT_LONGNAME, DESCRIBE, RES_ID, WELLPOINT_NAME "
                "FROM (SELECT * FROM SYS_POINTRELATION_STATION ORDER BY POINT_ID) "
                "WHERE ROWNUM <= 5000"
            )
            for row in r.get('rows', []):
                pt = OpcdaPoint(
                    point_id=row.get('POINT_ID', ''),
                    long_name=row.get('POINT_LONGNAME', ''),
                    describe=row.get('DESCRIBE', ''),
                    res_id=row.get('RES_ID', ''),
                    point_name=row.get('WELLPOINT_NAME', ''),
                )
                self._points_cache[pt.point_id] = pt
            log.info(f"[opcda] Loaded {len(self._points_cache)} point definitions")
        except Exception as e:
            log.error(f"[opcda] Load points failed: {e}")

    async def _loop(self, interval: float):
        while self._running:
            try:
                await self._poll_stats()
            except Exception as e:
                self._stats["errors"] += 1
                log.error(f"[opcda] Poll error: {e}")
            await asyncio.sleep(interval)

    async def _poll_stats(self):
        """查询 OPC DA 点位统计"""
        r = self._oracle.query(
            "SELECT "
            "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/DX%') AS DX, "
            "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/JB%') AS JB, "
            "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/Z1%') AS Z1, "
            "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/Z2%') AS Z2 "
            "FROM dual"
        )
        if r['rows']:
            row = r['rows'][0]
            self._stats["polls"] += 1
            self._stats["last_poll"] = time.time()

            payload = {
                "source": "opcda",
                "dx_points": int(row.get('DX', 0) or 0),
                "jb_points": int(row.get('JB', 0) or 0),
                "z1_points": int(row.get('Z1', 0) or 0),
                "z2_points": int(row.get('Z2', 0) or 0),
                "total": sum(int(row.get(k, 0) or 0) for k in ['DX', 'JB', 'Z1', 'Z2']),
                "timestamp": time.time(),
                "poll_seq": self._stats["polls"],
            }
            self._stats["points_total"] = payload["total"]

            if self._bus:
                self._bus.emit("opcda.stats", **payload)
            log.debug(f"[opcda] DX={payload['dx_points']} JB={payload['jb_points']} "
                      f"Z1={payload['z1_points']} Z2={payload['z2_points']}")

    def status(self) -> dict:
        return {"running": self._running, **self._stats}
