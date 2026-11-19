"""Opt in with IOTSTUDIO_SMOKE_HOST and IoTDB credentials. Uses its own database."""
import asyncio
import os
import uuid

import pytest

from src.config import AppConfig, IoTDBConfig
from src.storage.iotdb import _open
from src.storage.telemetry import create_telemetry_store, initialize_telemetry


@pytest.mark.skipif(not os.getenv("IOTSTUDIO_SMOKE_HOST"), reason="no IoTDB test RPC endpoint configured")
def test_platform_roundtrip():
    async def exercise():
        config = IoTDBConfig(host=os.environ["IOTSTUDIO_SMOKE_HOST"], port=int(os.getenv("IOTSTUDIO_SMOKE_PORT", "6667")),
                             database="studio_smoke_" + uuid.uuid4().hex,
                             timestamp_precision=os.getenv("IOTDB_TIMESTAMP_PRECISION", "ms"))
        admin = _open(config)
        store = create_telemetry_store(AppConfig(telemetry_backend="iotdb", iotdb=config))
        try:
            await initialize_telemetry(store)
            await store.close()
            await initialize_telemetry(store)  # existing schema
            dev, pid = "sensor.one", "p'温度"
            t1, t2 = "2025-01-02T03:04:05.123+00:00", "2025-01-02T03:04:06.123+00:00"
            assert await store.insert_point(dev, pid, "温度", 17.5, "°C", "sensor", "s1", 192, t1)
            data = [{"device_id": d, "point_id": p, "value": v, "quality": q,
                     "point_name": "温度", "unit": "°C", "device_type": "sensor",
                     "station_id": "s1", "ts": t2}
                    for d, p, v, q in [(dev, pid, 21.5, 3), (dev, "p2", 0, 0), ("other", pid, 93, 1)]]
            assert await store.batch_insert(data) == 3
            assert await store.batch_insert(data) == 3  # same millisecond, same device and point
            assert await store.row_count() == 4
            assert sorted(await store.point_ids(dev)) == sorted([pid, "p2"])
            rows = await store.query(dev, pid, t1, t2, 2)
            assert [(r["value"], r["quality"]) for r in rows] == [(21.5, 3), (17.5, 192)]
            assert rows[0]["ts"].startswith("2025-01-02T03:04:06.123")
            assert (await store.query(dev, pid, t1, t1, 1)) == [rows[1]]
            latest = await store.query_device_latest(dev, [pid, "p2", "absent", pid])
            assert {r["point_id"]: r["value"] for r in latest} == {pid: 21.5, "p2": 0}
            snapshot = store.device_snapshot(dev)
            snapshot_points = {row["point_id"]: row for row in snapshot["points"]}
            assert snapshot["available"] is True
            assert snapshot_points[pid]["value"] == 21.5
            assert snapshot_points[pid]["unit"] == "°C"
            assert len(store.trend(pid, hours=0, limit=10)) == 3
            assert store.stats()["total_points"] == 4
            report = store.period_report("2025-01-02", "2025-01-02")
            assert report["summary"]["total_points"] == 4
            assert report["summary"]["active_devices"] == 2
            assert report["trends"] == {"2025-01-02": 4}
        finally:
            try:
                await store.close()
            finally:
                try:
                    admin.execute_non_query_statement(f'DROP DATABASE IF EXISTS "{config.database}"')
                finally:
                    admin.close()
    asyncio.run(exercise())
