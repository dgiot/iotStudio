# ============================================================
# pythonIot — TDengine 时序存储
# ============================================================
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from ..config import cfg, TDEngineConfig

logger = logging.getLogger(__name__)

# TDengine connector 可选
try:
    import taos
    HAS_TAOS = True
except ImportError:
    try:
        import taosws
        HAS_TAOS = True
    except ImportError:
        HAS_TAOS = False

try:
    from taosrest import RestClient
    HAS_REST = True
except ImportError:
    HAS_REST = False


class TDEngineStore:
    """TDengine 时序数据存储

    使用 REST 接口（taosAdapter），无需原生客户端。
    数据模型: 超级表 → 子表
    """

    def __init__(self, config: Optional[TDEngineConfig] = None):
        self.config = config or cfg.tdengine
        self._conn = None
        self._db = self.config.database

    async def connect(self) -> bool:
        try:
            if HAS_TAOS:
                self._conn = taos.connect(
                    host=self.config.host,
                    user=self.config.user,
                    password=self.config.password,
                    database=self._db,
                    port=self.config.port,
                )
            elif HAS_REST:
                self._conn = RestClient(
                    url=f"http://{self.config.host}:{self.config.port}",
                    user=self.config.user,
                    password=self.config.password,
                    database=self._db,
                )
            else:
                logger.warning("TDengine connector 未安装，使用 SQLite 降级模式")
                return await self._fallback_connect()

            # 创建数据库
            self.execute(f"CREATE DATABASE IF NOT EXISTS {self._db} KEEP 365 DURATION 10 BUFFER 16")
            self.execute(f"USE {self._db}")
            logger.info(f"[tdengine] 连接成功 {self.config.host}:{self.config.port}")
            return True
        except Exception as e:
            logger.error(f"[tdengine] 连接失败: {e}")
            return False

    async def _fallback_connect(self) -> bool:
        """降级为 SQLite"""
        import sqlite3
        import os
        os.makedirs(cfg.data_dir, exist_ok=True)
        self._conn = sqlite3.connect(os.path.join(cfg.data_dir, "telemetry.db"))
        self.execute("""
            CREATE TABLE IF NOT EXISTS telemetry (
                ts TEXT, device_id TEXT, point_id TEXT, point_name TEXT,
                value REAL, unit TEXT, quality INTEGER
            )
        """)
        self.execute("CREATE INDEX IF NOT EXISTS idx_telemetry_ts ON telemetry(ts)")
        return True

    def execute(self, sql: str, *args) -> Any:
        try:
            cur = self._conn.cursor()
            cur.execute(sql, args or ())
            self._conn.commit()
            return cur
        except Exception as e:
            logger.debug(f"[tdengine] SQL error: {e}")
            return None

    async def create_supertable(self) -> None:
        """创建超级表"""
        sql = f"""
            CREATE STABLE IF NOT EXISTS {self._db}.device_telemetry (
                ts TIMESTAMP,
                value DOUBLE,
                quality TINYINT
            ) TAGS (
                device_id NCHAR(64),
                point_id NCHAR(64),
                point_name NCHAR(128),
                unit NCHAR(32),
                device_type NCHAR(32)
            )
        """
        self.execute(sql)

    async def create_subtable(self, device_id: str, point_id: str, point_name: str,
                               unit: str = "", device_type: str = "") -> str:
        """创建子表"""
        table_name = f"t_{device_id}_{point_id}".replace('-', '_').replace('.', '_')
        safe_device_id = device_id.replace("'", "''")
        sql = f"""
            CREATE TABLE IF NOT EXISTS {self._db}.`{table_name}`
            USING {self._db}.device_telemetry
            TAGS ('{safe_device_id}', '{point_id}', '{point_name}', '{unit}', '{device_type}')
        """
        self.execute(sql)
        return table_name

    async def insert(self, device_id: str, point_id: str, point_name: str,
                     value: float, unit: str = "", device_type: str = "",
                     quality: int = 0, ts: Optional[str] = None) -> bool:
        """插入一条遥测数据"""
        if ts is None:
            ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        table_name = f"t_{device_id}_{point_id}".replace('-', '_').replace('.', '_')
        safe_device_id = device_id.replace("'", "''")
        try:
            sql = f"INSERT INTO {self._db}.`{table_name}` VALUES ('{ts}', {value}, {quality})"
            self.execute(sql)
            return True
        except Exception:
            # 自动建表后重试
            try:
                await self.create_subtable(device_id, point_id, point_name, unit, device_type)
                self.execute(sql)
                return True
            except Exception:
                return False

    async def batch_insert(self, rows: List[Dict[str, Any]]) -> int:
        """批量插入"""
        count = 0
        for row in rows:
            if await self.insert(**row):
                count += 1
        return count

    async def query(self, device_id: str, point_id: str,
                    start: Optional[str] = None, end: Optional[str] = None,
                    limit: int = 1000) -> List[Dict]:
        """查询时序数据"""
        table_name = f"t_{device_id}_{point_id}".replace('-', '_').replace('.', '_')
        conditions = []
        if start:
            conditions.append(f"ts >= '{start}'")
        if end:
            conditions.append(f"ts <= '{end}'")
        where = "WHERE " + " AND ".join(conditions) if conditions else ""
        sql = f"SELECT ts, value, quality FROM {self._db}.`{table_name}` {where} ORDER BY ts DESC LIMIT {limit}"
        cur = self.execute(sql)
        if cur is None:
            return []
        cols = ["ts", "value", "quality"]
        return [dict(zip(cols, row)) for row in cur.fetchall()]

    async def query_device_latest(self, device_id: str, point_ids: List[str]) -> List[Dict]:
        """查询设备各点位最新值"""
        results = []
        for pid in point_ids:
            table_name = f"t_{device_id}_{pid}".replace('-', '_').replace('.', '_')
            sql = f"SELECT ts, value FROM {self._db}.`{table_name}` ORDER BY ts DESC LIMIT 1"
            cur = self.execute(sql)
            if cur:
                row = cur.fetchone()
                if row:
                    results.append({"point_id": pid, "ts": row[0], "value": row[1]})
        return results

    def close(self) -> None:
        if self._conn:
            try:
                self._conn.close()
            except Exception:
                pass
