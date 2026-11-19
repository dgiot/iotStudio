# ============================================================
# pythonIot — 数据库初始化脚本
# ============================================================
"""
初始化 PostgreSQL 和配置的遥测库
"""
import sys
sys.path.insert(0, ".")

import asyncio
from src.config import cfg
from src.models.device import init_db
from src.storage.telemetry import create_telemetry_store, initialize_telemetry


async def init_telemetry():
    store = create_telemetry_store(cfg)
    try:
        await initialize_telemetry(store)
        print(f"[OK] Telemetry schema ready ({cfg.telemetry_backend}).")
    finally:
        await store.close()


def init_postgres():
    init_db(cfg.db.sync_url)
    print(f"[OK] PostgreSQL tables created in {cfg.db.database}.")


async def main():
    print("=" * 60)
    print("pythonIot 数据库初始化")
    print("=" * 60)
    print(f"PostgreSQL: {cfg.db.host}:{cfg.db.port}/{cfg.db.database}")
    target = getattr(cfg, cfg.telemetry_backend)
    print(f"{cfg.telemetry_backend}: {target.host}:{target.port}/{target.database}")
    print()

    # PostgreSQL
    try:
        init_postgres()
    except Exception as e:
        print(f"[WARN] PostgreSQL 初始化失败: {e}")
        print("[WARN] 将使用 SQLite 降级模式 (无需手动操作)")

    # 遥测存储
    try:
        await init_telemetry()
    except Exception as e:
        if cfg.telemetry_backend == "iotdb":
            raise
        print(f"[WARN] TDengine 初始化失败: {e}")
        print("[WARN] 将使用 SQLite 降级模式 (无需手动操作)")

    print()
    print("初始化完成!")


if __name__ == "__main__":
    asyncio.run(main())
