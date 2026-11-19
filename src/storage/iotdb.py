"""iotStudio telemetry on the Apache IoTDB 2.x Table model."""
import asyncio
import math
import threading
from datetime import datetime, timedelta, timezone

from ..config import IoTDBConfig


_DDL = """CREATE TABLE IF NOT EXISTS telemetry (
    device_id STRING TAG, point_id STRING TAG,
    point_name STRING FIELD, unit STRING FIELD, device_type STRING FIELD,
    station_id STRING FIELD, value DOUBLE FIELD, quality INT32 FIELD
)"""
_COLUMNS = ["device_id", "point_id", "point_name", "unit", "device_type", "station_id", "value", "quality"]
_MAX_ROWS = 10000
_BATCH_SIZE = 512
_EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)


def _literal(value: str) -> str:
    if not isinstance(value, str):
        raise ValueError("IoTDB string values must be text")
    return "'" + value.replace("'", "''") + "'"


def _timestamp(value, precision):
    if isinstance(value, str):
        value = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if not isinstance(value, datetime):
        raise ValueError("expected an ISO 8601 timestamp or datetime")
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    delta = value - _EPOCH
    micros = (delta.days * 86400 + delta.seconds) * 1_000_000 + delta.microseconds
    return {"ms": micros // 1000, "us": micros, "ns": micros * 1000}[precision]


def _limit(value):
    if isinstance(value, bool) or not isinstance(value, int) or not 1 <= value <= _MAX_ROWS:
        raise ValueError(f"limit must be between 1 and {_MAX_ROWS}")
    return value


def _open(config):
    try:
        from iotdb.table_session import TableSession, TableSessionConfig
    except ImportError as exc:
        raise RuntimeError("IoTDB requires pip install -r requirements-iotdb.txt") from exc
    if not config.user or not config.password.get_secret_value():
        raise ValueError("configure IOTDB_USER and IOTDB_PASSWORD")
    return TableSession(TableSessionConfig(
        node_urls=[f"{config.host}:{config.port}"], username=config.user,
        password=config.password.get_secret_value(), fetch_size=_BATCH_SIZE,
        enable_redirection=False, time_zone="UTC", use_ssl=config.use_ssl,
        ca_certs=config.ca_certs, connection_timeout_in_ms=config.timeout_ms,
    ))


class IoTDBStore:
    def __init__(self, config: IoTDBConfig):
        self.config = config
        self._session = None
        # A native session and its open result sets must not interleave across threads.
        self._lock = threading.Lock()

    @property
    def connected(self):
        return self._session is not None

    def connect_sync(self):
        with self._lock:
            if self.connected:
                return True
            session = _open(self.config)
            try:
                database = f'"{self.config.database}"'
                session.execute_non_query_statement(f"CREATE DATABASE IF NOT EXISTS {database}")
                session.execute_non_query_statement(f"USE {database}")
                session.execute_non_query_statement(_DDL)
            except BaseException:
                session.close()
                raise
            self._session = session
            return True

    async def connect(self):
        return await asyncio.to_thread(self.connect_sync)

    def close_sync(self):
        with self._lock:
            session, self._session = self._session, None
            if session is not None:
                session.close()

    async def close(self):
        await asyncio.to_thread(self.close_sync)

    def _active(self):
        if self._session is None:
            raise RuntimeError("IoTDB telemetry store is not connected")
        return self._session

    async def insert_point(self, device_id, point_id, point_name, value, unit="",
                           device_type="default", station_id="default", quality=0, ts=None):
        return await self.batch_insert([{
            "device_id": device_id, "point_id": point_id, "point_name": point_name,
            "value": value, "unit": unit, "device_type": device_type,
            "station_id": station_id, "quality": quality, "ts": ts,
        }]) == 1

    async def batch_insert(self, rows):
        return await asyncio.to_thread(self.batch_insert_sync, rows)

    def batch_insert_sync(self, rows):
        if not rows:
            return 0
        from iotdb.utils.IoTDBConstants import TSDataType
        from iotdb.utils.Tablet import ColumnType, Tablet

        types = [TSDataType.STRING] * 6 + [TSDataType.DOUBLE, TSDataType.INT32]
        categories = [ColumnType.TAG] * 2 + [ColumnType.FIELD] * 6
        now = datetime.now(timezone.utc)

        def prepare(row):
            device_id = row.get("device_id")
            point_id = row.get("point_id")
            if not isinstance(device_id, str) or not device_id or not isinstance(point_id, str) or not point_id:
                raise ValueError("device_id and point_id must be non-empty strings")
            value = row.get("value")
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise ValueError("telemetry value must be numeric")
            value = float(value)
            quality = row.get("quality", 0)
            if isinstance(quality, bool) or not isinstance(quality, int):
                raise ValueError("telemetry quality must be an integer")
            if not math.isfinite(value) or not -(2**31) <= quality < 2**31:
                raise ValueError("invalid telemetry value or quality")
            metadata = [row.get("point_name") or "", row.get("unit") or "",
                        row.get("device_type") or "default", row.get("station_id") or "default"]
            if any(not isinstance(item, str) for item in metadata):
                raise ValueError("telemetry metadata must be strings")
            timestamp = row["ts"] if row.get("ts") is not None else now
            return [device_id, point_id, *metadata, value, quality], _timestamp(timestamp, self.config.timestamp_precision)

        for row in rows:
            prepare(row)

        with self._lock:
            session = self._active()
            for offset in range(0, len(rows), _BATCH_SIZE):
                values, times = [], []
                for row in rows[offset:offset + _BATCH_SIZE]:
                    value_row, timestamp = prepare(row)
                    values.append(value_row)
                    times.append(timestamp)
                session.insert(Tablet("telemetry", _COLUMNS, types, values, times, categories))
        return len(rows)

    def _select(self, sql):
        rows = []
        with self._lock:
            with self._active().execute_query_statement(sql, self.config.timeout_ms) as result:
                columns = result.get_column_names()
                while result.has_next():
                    record = {}
                    for name, field in zip(columns, result.next().get_fields()):
                        value = field.get_object_value(field.get_data_type())
                        if isinstance(value, datetime):
                            value = value.isoformat()
                        elif hasattr(value, "item"):
                            value = value.item()  # numpy scalar to JSON-native scalar
                        record[name] = value
                    rows.append(record)
        return rows

    async def query(self, device_id, point_id, start=None, end=None, limit=1000):
        predicates = [f"device_id = {_literal(device_id)}", f"point_id = {_literal(point_id)}"]
        for operator, bound in ((">=", start), ("<=", end)):
            if bound is not None:
                predicates.append(f"time {operator} {_timestamp(bound, self.config.timestamp_precision)}")
        sql = ("SELECT time AS ts, value, quality FROM telemetry WHERE " + " AND ".join(predicates)
               + f" ORDER BY time DESC LIMIT {_limit(limit)}")
        return await asyncio.to_thread(self._select, sql)

    async def point_ids(self, device_id):
        rows = await asyncio.to_thread(self._select,
            "SELECT DISTINCT point_id FROM telemetry WHERE device_id = " + _literal(device_id)
            + f" ORDER BY point_id LIMIT {_MAX_ROWS}")
        return [row["point_id"] for row in rows]

    async def query_device_latest(self, device_id, point_ids):
        ids = list(dict.fromkeys(point_ids))
        if not ids:
            return []
        rows = []
        for offset in range(0, len(ids), _BATCH_SIZE):
            batch = ",".join(_literal(pid) for pid in ids[offset:offset + _BATCH_SIZE])
            sql = ("SELECT point_id, max(time) AS ts, last_by(value, time) AS value "
                   f"FROM telemetry WHERE device_id = {_literal(device_id)} AND point_id IN ({batch}) "
                   "GROUP BY point_id ORDER BY point_id")
            rows.extend(await asyncio.to_thread(self._select, sql))
        return rows

    async def row_count(self):
        rows = await asyncio.to_thread(self._select, "SELECT count(*) AS n FROM telemetry")
        return rows[0]["n"]

    # GraphRAG and report generation expose synchronous APIs. Their queries share
    # the collector's session and lock, with aggregation done on the server.
    def point_latest(self, point_id):
        rows = self._select("SELECT time AS ts, device_id, point_id, point_name, value, unit, quality "
                            f"FROM telemetry WHERE point_id = {_literal(point_id)} ORDER BY time DESC LIMIT 1")
        return rows[0] if rows else None

    def device_snapshot(self, device_id):
        rows = self._select("SELECT point_id, max(time) AS ts, last_by(point_name, time) AS point_name, "
                            "last_by(unit, time) AS unit, last_by(value, time) AS value, "
                            "last_by(quality, time) AS quality FROM telemetry "
                            f"WHERE device_id = {_literal(device_id)} GROUP BY point_id ORDER BY point_id LIMIT {_MAX_ROWS}")
        return {"device_id": device_id, "points": rows, "count": len(rows), "available": True}

    def trend(self, point_id, hours, limit):
        where = f"point_id = {_literal(point_id)}"
        order = "DESC"
        if hours > 0:
            cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
            where += f" AND time >= {_timestamp(cutoff, self.config.timestamp_precision)}"
            order = "ASC"
        return self._select(f"SELECT time AS ts, value FROM telemetry WHERE {where} ORDER BY time {order} LIMIT {_limit(limit)}")

    def _counts(self, where):
        return self._select("SELECT count(*) AS total_points, count(DISTINCT device_id) AS active_devices, "
                            "max(time) AS latest_ts FROM telemetry" + where)[0]

    def stats(self):
        return self._counts("")

    def period_report(self, start, end):
        precision = self.config.timestamp_precision
        after_end = datetime.fromisoformat(end) + timedelta(days=1)
        where = f" WHERE time >= {_timestamp(start, precision)} AND time < {_timestamp(after_end, precision)}"
        counts = self._counts(where)
        devices = self._select("SELECT device_id, count(*) AS points, avg(value) AS avg_value, "
                               "min(value) AS min_value, max(value) AS max_value FROM telemetry" + where
                               + " GROUP BY device_id ORDER BY points DESC LIMIT 20")
        daily = self._select("SELECT date_bin(1d, time) AS day, count(*) AS n FROM telemetry" + where
                             + " GROUP BY 1 ORDER BY 1")
        return {"summary": {"total_points": counts["total_points"], "active_devices": counts["active_devices"],
                            "avg_daily_points": counts["total_points"] / max(1, len(daily))},
                "devices": {row["device_id"]: {k: v if k == "points" else round(v, 4) for k, v in row.items()
                                               if k != "device_id"} for row in devices},
                "trends": {row["day"][:10]: row["n"] for row in daily}}
