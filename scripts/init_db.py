# ============================================================
# pythonIot — 数据库初始化脚本
# ============================================================
"""
初始化 PostgreSQL 表结构 + TDengine 超级表
"""
import sys
sys.path.insert(0, ".")

import asyncio
from src.config import cfg
from src.models.device import init_db
from src.storage.tdengine import TDEngineStore


async def init_tdengine():
    store = TDEngineStore()
    await store.connect()
    await store.create_supertable()
    print("[OK] TDengine supertable created.")
    store.close()


def init_postgres():
    init_db(cfg.db.sync_url)
    print(f"[OK] PostgreSQL tables created in {cfg.db.database}.")


async def main():
    print("=" * 60)
    print("pythonIot 数据库初始化")
    print("=" * 60)
    print(f"PostgreSQL: {cfg.db.host}:{cfg.db.port}/{cfg.db.database}")
    print(f"TDengine:   {cfg.tdengine.host}:{cfg.tdengine.port}/{cfg.tdengine.database}")
    print()

    # PostgreSQL
    try:
        init_postgres()
    except Exception as e:
        print(f"[WARN] PostgreSQL 初始化失败: {e}")
        print("[WARN] 将使用 SQLite 降级模式 (无需手动操作)")

    # TDengine
    try:
        await init_tdengine()
    except Exception as e:
        print(f"[WARN] TDengine 初始化失败: {e}")
        print("[WARN] 将使用 SQLite 降级模式 (无需手动操作)")

    print()
    print("初始化完成!")


if __name__ == "__main__":
    asyncio.run(main())
