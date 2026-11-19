from datetime import datetime, timezone
import asyncio
import struct

import pytest

from src.config import IoTDBConfig
from src.storage import iotdb as storage


class QueryResult:
    def __init__(self, rows, columns=("ts", "value", "quality")):
        self._rows = iter(rows)
        self._columns = columns
        self.closed = False
        self._next = None

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.closed = True

    def get_column_names(self):
        return self._columns

    def has_next(self):
        if self._next is not None:
            return True
        try:
            self._next = next(self._rows)
        except StopIteration:
            return False
        return True

    def next(self):
        from types import SimpleNamespace

        values, self._next = self._next, None
        fields = [SimpleNamespace(
            get_object_value=lambda _data_type, value=value: value,
            get_data_type=lambda: None,
        ) for value in values]
        return SimpleNamespace(get_fields=lambda: fields)


class Session:
    def __init__(self):
        self.statements = []
        self.tablets = []
        self.result = None
        self.closed = False

    def execute_non_query_statement(self, sql):
        self.statements.append(sql)

    def insert(self, tablet):
        self.tablets.append(tablet)

    def execute_query_statement(self, sql, timeout):
        self.statements.append((sql, timeout))
        self.result = QueryResult([(
            datetime(2025, 1, 2, tzinfo=timezone.utc), 12.5, 0,
        )])
        return self.result

    def close(self):
        self.closed = True


def test_timestamp_precision_and_iso_timezone():
    value = "2025-01-02T05:04:05.123456+02:00"
    assert storage._timestamp(value, "ms") == 1735787045123
    assert storage._timestamp(value, "us") == 1735787045123456
    assert storage._timestamp(value, "ns") == 1735787045123456000


def test_limit_rejects_boolean_and_out_of_range_values():
    for value in (True, 0, -1, 10001, "10"):
        with pytest.raises(ValueError):
            storage._limit(value)


def test_config_rejects_unsafe_database_identifier():
    with pytest.raises(ValueError):
        IoTDBConfig(database='telemetry"; DROP DATABASE root')


def test_from_env_reads_iotdb_transport_settings(monkeypatch):
    from src.config import AppConfig

    for name, value in {
        "IOTDB_USER": "iot-user",
        "IOTDB_PASSWORD": "iot-secret",
        "IOTDB_TIMEOUT_MS": "5000",
        "IOTDB_USE_SSL": "yes",
        "IOTDB_CA_CERTS": "C:/certs/ca.pem",
        "IOTDB_TIMESTAMP_PRECISION": "us",
        "TELEMETRY_BACKEND": "iotdb",
    }.items():
        monkeypatch.setenv(name, value)

    config = AppConfig.from_env()
    assert config.telemetry_backend == "iotdb"
    assert config.iotdb.user == "iot-user"
    assert config.iotdb.password.get_secret_value() == "iot-secret"
    assert config.iotdb.timeout_ms == 5000
    assert config.iotdb.use_ssl is True
    assert config.iotdb.ca_certs == "C:/certs/ca.pem"
    assert config.iotdb.timestamp_precision == "us"


def test_connect_is_idempotent_and_close_releases_session(monkeypatch):
    session = Session()
    monkeypatch.setattr(storage, "_open", lambda _: session)
    store = storage.IoTDBStore(IoTDBConfig(user="tester", password="secret"))

    assert store.connect_sync() is True
    assert store.connect_sync() is True
    assert session.statements == [
        'CREATE DATABASE IF NOT EXISTS "iot_telemetry"',
        'USE "iot_telemetry"',
        storage._DDL,
    ]
    store.close_sync()
    assert session.closed is True
    assert store.connected is False


def test_connect_failure_closes_new_session(monkeypatch):
    session = Session()
    session.execute_non_query_statement = lambda _sql: (_ for _ in ()).throw(RuntimeError("schema failed"))
    monkeypatch.setattr(storage, "_open", lambda _: session)
    store = storage.IoTDBStore(IoTDBConfig(user="tester", password="secret"))

    with pytest.raises(RuntimeError, match="schema failed"):
        store.connect_sync()
    assert session.closed is True
    assert store.connected is False


def test_tablet_batches_are_typed_and_timestamped(monkeypatch):
    from iotdb.utils.Tablet import ColumnType
    from iotdb.utils.IoTDBConstants import TSDataType

    store = storage.IoTDBStore(IoTDBConfig(timestamp_precision="us"))
    session = Session()
    store._session = session
    timestamp = "2025-01-02T03:04:05.123456+00:00"
    rows = [{"device_id": "sensor.one", "point_id": "p'temp", "point_name": "temperature",
             "unit": "C", "device_type": "sensor", "station_id": "station1",
             "value": 17.5, "quality": 3, "ts": timestamp} for _ in range(513)]

    assert store.batch_insert_sync(rows) == 513
    assert [tablet.get_row_number() for tablet in session.tablets] == [512, 1]
    tablet = session.tablets[0]
    assert struct.unpack(">q", tablet.get_binary_timestamps()[:8]) == (1735787045123456,)
    assert tablet.__dict__["_Tablet__values"][0] == ["sensor.one", "p'temp", "temperature", "C", "sensor", "station1", 17.5, 3]
    assert tablet.get_column_categories()[:2] == [ColumnType.TAG, ColumnType.TAG]
    assert tablet.get_data_types() == [TSDataType.STRING] * 6 + [TSDataType.DOUBLE, TSDataType.INT32]


def test_invalid_later_row_fails_before_inserting(monkeypatch):
    store = storage.IoTDBStore(IoTDBConfig())
    session = Session()
    store._session = session
    rows = [{"device_id": "sensor", "point_id": "p", "value": 1.0} for _ in range(513)]
    rows[-1]["value"] = float("nan")

    with pytest.raises(ValueError, match="invalid telemetry"):
        store.batch_insert_sync(rows)
    assert session.tablets == []


def test_query_escapes_identifiers_bounds_results_and_releases_result():
    async def exercise():
        store = storage.IoTDBStore(IoTDBConfig(timeout_ms=2300))
        session = Session()
        store._session = session
        start = "2025-01-02T03:04:05.123+00:00"

        rows = await store.query("device' OR 1=1 --", "p'temp", start, start, limit=7)

        sql, timeout = session.statements[-1]
        assert "device_id = 'device'' OR 1=1 --'" in sql
        assert "point_id = 'p''temp'" in sql
        assert "time >= 1735787045123" in sql and "time <= 1735787045123" in sql
        assert "LIMIT 7" in sql
        assert timeout == 2300
        assert rows == [{"ts": "2025-01-02T00:00:00+00:00", "value": 12.5, "quality": 0}]
        assert session.result.closed is True

    asyncio.run(exercise())


def test_latest_query_empty_point_list_does_not_issue_invalid_sql():
    async def exercise():
        store = storage.IoTDBStore(IoTDBConfig())
        session = Session()
        store._session = session

        assert await store.query_device_latest("device1", []) == []
        assert session.statements == []

    asyncio.run(exercise())
