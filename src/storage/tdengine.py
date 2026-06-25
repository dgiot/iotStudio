# ============================================================
# dgiot_lite — TDengine 物模型时序存储
# 参考 shixu 项目: point_mapping → supertable TAG 模式
# ============================================================
"""
物模型 → TDengine 映射规则:
  设备类型(product) → 超级表(STABLE) → 每个设备一个子表(TABLE)

超级表 TAG 设计:
  device_id, point_id, point_name, unit, device_type, station_id

数据写入:
  INSERT INTO t_{device_id} USING {stable} TAGS(...) VALUES(ts, value, quality)
"""
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from ..config import cfg, TDEngineConfig

logger = logging.getLogger(__name__)

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


# 物模型：设备类型 → 超级表名
DEVICE_TYPE_STABLE = {
    "inverter": "inverter_telemetry",
    "pcs": "pcs_telemetry",
    "charger": "charger_telemetry",
    "meter": "meter_telemetry",
    "sensor": "sensor_telemetry",
    "default": "device_telemetry",
}


class TDEngineStore:
    """TDengine 物模型时序存储

    特性:
      - 按设备类型自动建超级表
      - 按设备+点位自动建子表
      - TAG 索引支持多维查询
      - 无 TDengine 时降级 SQLite
    """

    def __init__(self, config: Optional[TDEngineConfig] = None):
        self.config = config or cfg.tdengine
        self._conn = None
        self._db = self.config.database
        self._is_fallback = False
        self._supertable_cache: set = set()

    async def connect(self) -> bool:
        # 快速端口检查避免长时间超时
        import socket
        try:
            s = socket.socket(); s.settimeout(2)
            if s.connect_ex((self.config.host, self.config.port)) != 0:
                logger.info(f"[tdengine] {self.config.host}:{self.config.port} 不可达, 降级 SQLite")
                self._is_fallback = True
                return await self._fallback_connect()
            s.close()
        except Exception:
            pass

        try:
            if HAS_TAOS:
                self._conn = taos.connect(
                    host=self.config.host,
                    user=self.config.user,
                    password=self.config.password,
                    port=self.config.port,
                    timeout=3,
                )
            elif HAS_REST:
                self._conn = RestClient(
                    url=f"http://{self.config.host}:{self.config.port}",
                    user=self.config.user, password=self.config.password,
                )
            else:
                logger.warning("TDengine connector 未安装，降级 SQLite")
                self._is_fallback = True
                return await self._fallback_connect()

            self.execute(f"CREATE DATABASE IF NOT EXISTS {self._db} KEEP 365 DURATION 10 BUFFER 16 WAL_LEVEL 1")
            self.execute(f"USE {self._db}")
            logger.info(f"[tdengine] 连接成功 {self.config.host}:{self.config.port}")
            return True
        except Exception as e:
            logger.error(f"[tdengine] 连接失败: {e}")
            logger.info("[tdengine] 降级使用 SQLite")
            self._is_fallback = True
            return await self._fallback_connect()

    async def _fallback_connect(self) -> bool:
        import sqlite3, os
        os.makedirs(cfg.data_dir, exist_ok=True)
        self._db = self.config.database
        self._conn = sqlite3.connect(os.path.join(cfg.data_dir, "telemetry.db"))
        self.execute("""CREATE TABLE IF NOT EXISTS telemetry (
            ts TEXT, device_id TEXT, point_id TEXT, point_name TEXT,
            value REAL, unit TEXT, quality INTEGER DEFAULT 0,
            device_type TEXT, station_id TEXT
        )""")
        self.execute("CREATE INDEX IF NOT EXISTS idx_tele ON telemetry(device_id, point_id, ts)")
        self._is_fallback = True
        return True

    def execute(self, sql: str, *args) -> Any:
        try:
            cur = self._conn.cursor()
            cur.execute(sql, args or ())
            self._conn.commit()
            return cur
        except Exception as e:
            logger.debug(f"[tdengine] SQL: {e}")
            return None

    # ===== 物模型超级表管理 =====

    async def ensure_supertable(self, device_type: str) -> str:
        """确保设备类型对应的超级表存在"""
        stable = DEVICE_TYPE_STABLE.get(device_type, DEVICE_TYPE_STABLE["default"])

        if stable not in self._supertable_cache:
            sql = f"""CREATE STABLE IF NOT EXISTS {self._db}.{stable} (
                ts TIMESTAMP,
                value DOUBLE,
                quality TINYINT
            ) TAGS (
                device_id NCHAR(64),
                point_id NCHAR(64),
                point_name NCHAR(128),
                unit NCHAR(32),
                device_type NCHAR(32),
                station_id NCHAR(64)
            )"""
            self.execute(sql)
            self._supertable_cache.add(stable)
            logger.info(f"[tdengine] 超级表: {stable}")

        return stable

    async def ensure_subtable(self, device_id: str, point_id: str, point_name: str,
                               unit: str = "", device_type: str = "default",
                               station_id: str = "default") -> str:
        """确保设备+点位的子表存在，返回子表名"""
        stable = await self.ensure_supertable(device_type)
        table_name = f"t_{device_id}_{point_id}".replace('-', '_').replace('.', '_').replace(':', '_')

        safe_device_id = device_id.replace("'", "''")
        safe_point_id = point_id.replace("'", "''")
        safe_point_name = point_name.replace("'", "''")
        safe_unit = (unit or "").replace("'", "''")
        safe_station = (station_id or "default").replace("'", "''")

        sql = f"""CREATE TABLE IF NOT EXISTS {self._db}.`{table_name}`
            USING {self._db}.{stable}
            TAGS ('{safe_device_id}', '{safe_point_id}', '{safe_point_name}',
                  '{safe_unit}', '{device_type}', '{safe_station}')"""
        self.execute(sql)
        return table_name

    # ===== 数据写入 =====

    async def insert_point(self, device_id: str, point_id: str, point_name: str,
                           value: float, unit: str = "", device_type: str = "default",
                           station_id: str = "default", quality: int = 0,
                           ts: Optional[datetime] = None) -> bool:
        """写入单个点位值"""
        if ts is None:
            ts = datetime.now(timezone.utc)
        ts_str = ts.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

        # SQLite 降级模式：直接写入 telemetry 表
        if self._is_fallback:
            try:
                sql = f"INSERT INTO telemetry (ts, device_id, point_id, point_name, value, unit, quality, device_type, station_id) VALUES ('{ts_str}', '{device_id}', '{point_id}', '{point_name}', {value}, '{unit}', {quality}, '{device_type}', '{station_id}')"
                self.execute(sql)
                return True
            except Exception as e:
                logger.debug(f"[sqlite] insert failed: {e}")
                return False

        # TDengine 模式
        table_name = await self.ensure_subtable(
            device_id, point_id, point_name, unit, device_type, station_id)

        try:
            sql = f"INSERT INTO {self._db}.`{table_name}` VALUES ('{ts_str}', {value}, {quality})"
            self.execute(sql)
            return True
        except Exception:
            try:
                await self.ensure_subtable(device_id, point_id, point_name, unit, device_type, station_id)
                self.execute(sql)
                return True
            except Exception as e:
                logger.debug(f"[tdengine] insert failed: {e}")
                return False

    async def batch_insert(self, rows: List[Dict[str, Any]]) -> int:
        """批量写入点位值"""
        count = 0
        for row in rows:
            if await self.insert_point(
                device_id=row.get("device_id", ""),
                point_id=row.get("point_id", ""),
                point_name=row.get("point_name", ""),
                value=float(row.get("value", 0)),
                unit=row.get("unit", ""),
                device_type=row.get("device_type", "default"),
                station_id=row.get("station_id", "default"),
                quality=row.get("quality", 0),
            ):
                count += 1
        return count

    # ===== 数据查询 =====

    async def query(self, device_id: str, point_id: str,
                    start: Optional[str] = None, end: Optional[str] = None,
                    limit: int = 1000) -> List[Dict]:
        """查询点位时序数据"""
        if self._is_fallback:
            conds = [f"device_id='{device_id}'", f"point_id='{point_id}'"]
            if start: conds.append(f"ts >= '{start}'")
            if end: conds.append(f"ts <= '{end}'")
            sql = f"SELECT ts, value, quality FROM telemetry WHERE {' AND '.join(conds)} ORDER BY ts DESC LIMIT {limit}"
            cur = self.execute(sql)
            if cur is None: return []
            return [{"ts": r[0], "value": r[1], "quality": r[2]} for r in cur.fetchall()]

        table_name = f"t_{device_id}_{point_id}".replace('-', '_').replace('.', '_').replace(':', '_')
        conds = []
        if start: conds.append(f"ts >= '{start}'")
        if end: conds.append(f"ts <= '{end}'")
        where = ("WHERE " + " AND ".join(conds)) if conds else ""
        sql = f"SELECT ts, value, quality FROM {self._db}.`{table_name}` {where} ORDER BY ts DESC LIMIT {limit}"
        cur = self.execute(sql)
        if cur is None: return []
        return [{"ts": r[0], "value": r[1], "quality": r[2]} for r in cur.fetchall()]

    async def query_device_latest(self, device_id: str, point_ids: List[str]) -> List[Dict]:
        """查询设备所有点位最新值"""
        logger.info(f"[tdengine] query_latest device={device_id} fallback={self._is_fallback} pids={len(point_ids)}")
        if self._is_fallback:
            results = []
            for pid in point_ids:
                sql = f"SELECT ts, value FROM telemetry WHERE device_id='{device_id}' AND point_id='{pid}' ORDER BY ts DESC LIMIT 1"
                cur = self.execute(sql)
                if cur:
                    row = cur.fetchone()
                    if row: results.append({"point_id": pid, "ts": str(row[0]), "value": row[1]})
            return results

        results = []
        for pid in point_ids:
            table_name = f"t_{device_id}_{pid}".replace('-', '_').replace('.', '_').replace(':', '_')
            sql = f"SELECT ts, value FROM {self._db}.`{table_name}` ORDER BY ts DESC LIMIT 1"
            cur = self.execute(sql)
            if cur:
                row = cur.fetchone()
                if row: results.append({"point_id": pid, "ts": str(row[0]), "value": row[1]})
        return results

    # ===== 降采样与保留 =====

    async def setup_retention(self, keep_days: int = 365, interval_days: int = 30):
        """设置自动降采样策略"""
        for stable in DEVICE_TYPE_STABLE.values():
            sql = f"ALTER STABLE {self._db}.{stable} INTERVAL({interval_days}d) KEEP({keep_days}d)"
            self.execute(sql)

    async def close(self) -> None:
        if self._conn:
            try:
                self._conn.close()
            except Exception:
                pass
