"""The telemetry store shared by the collector and the platform API."""
from functools import lru_cache

from ..config import AppConfig, cfg
from .iotdb import IoTDBStore
from .tdengine import TDEngineStore


def create_telemetry_store(config: AppConfig) -> TDEngineStore | IoTDBStore:
    if config.telemetry_backend == "iotdb":
        return IoTDBStore(config.iotdb)
    return TDEngineStore(config.tdengine)


@lru_cache(maxsize=1)
def get_telemetry_store() -> TDEngineStore | IoTDBStore:
    return create_telemetry_store(cfg)


def configured_iotdb() -> IoTDBStore | None:
    store = get_telemetry_store()
    return store if isinstance(store, IoTDBStore) else None


async def initialize_telemetry(store):
    await store.connect()
    if isinstance(store, TDEngineStore) and not store._is_fallback:
        await store.ensure_supertable("default")
