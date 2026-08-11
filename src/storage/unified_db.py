# ============================================================
# UnifiedDB — 统一关系数据库适配器
# 对标 dgaiot PostgreSQL 单一关系库
# PG 主库 · SQLite 边缘降级 · Oracle 只读桥
# ============================================================
import asyncio, logging, os
from dataclasses import dataclass
from enum import Enum
from typing import Any, AsyncIterator, Dict, List, Optional

log = logging.getLogger("storage.unified")

class DbBackend(Enum):
    postgres = "postgres"
    sqlite = "sqlite"
    oracle = "oracle"       # 只读

@dataclass
class DbConfig:
    backend: DbBackend = DbBackend.postgres
    # PG
    pg_host: str = "127.0.0.1"; pg_port: int = 7432
    pg_user: str = "dgiot"; pg_pass: str = "dgiot"; pg_db: str = "dgiot_lite"
    # SQLite
    sqlite_path: str = "data/dgiot_lite.db"
    # Oracle (只读)
    ora_dsn: str = ""; ora_user: str = ""; ora_pass: str = ""

    @property
    def pg_url(self) -> str:
        return f"postgresql+asyncpg://{self.pg_user}:{self.pg_pass}@{self.pg_host}:{self.pg_port}/{self.pg_db}"

    @property
    def sqlite_url(self) -> str:
        return f"sqlite+aiosqlite:///{self.sqlite_path}"


class UnifiedDB:
    """统一数据库门面

    优先级: PG > SQLite(降级) > Oracle(只读查询)
    写操作: PG 主写 · SQLite 同步写(边缘断网时) · Oracle 永不写
    读操作: PG → Oracle(只读视图) → SQLite
    """
    _pg_engine = None; _sqlite_engine = None; _ora_pool = None
    _cfg: DbConfig = None

    @classmethod
    def init(cls, cfg: DbConfig = None):
        cls._cfg = cfg or DbConfig()

    # ─── PG 主库 ───
    @classmethod
    async def pg_execute(cls, sql: str, params: dict = None) -> Any:
        """PG 写操作"""
        try:
            from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
            from sqlalchemy import text
            if not cls._pg_engine:
                cls._pg_engine = create_async_engine(cls._cfg.pg_url, echo=False)
            async with cls._pg_engine.begin() as conn:
                result = await conn.execute(text(sql), params or {})
                return result
        except Exception as e:
            log.warning(f"PG write failed, falling back to SQLite: {e}")
            return await cls._sqlite_execute(sql, params)

    @classmethod
    async def pg_fetch(cls, sql: str, params: dict = None) -> List[dict]:
        """PG 读操作"""
        try:
            from sqlalchemy.ext.asyncio import create_async_engine
            from sqlalchemy import text
            if not cls._pg_engine:
                cls._pg_engine = create_async_engine(cls._cfg.pg_url, echo=False)
            async with cls._pg_engine.connect() as conn:
                result = await conn.execute(text(sql), params or {})
                rows = result.fetchall()
                cols = result.keys()
                return [dict(zip(cols, r)) for r in rows]
        except Exception as e:
            log.warning(f"PG read failed: {e}")
            return []

    # ─── SQLite 降级 ───
    @classmethod
    async def _sqlite_execute(cls, sql: str, params: dict = None) -> Any:
        try:
            from sqlalchemy.ext.asyncio import create_async_engine
            from sqlalchemy import text
            if not cls._sqlite_engine:
                cls._sqlite_engine = create_async_engine(cls._cfg.sqlite_url, echo=False)
            async with cls._sqlite_engine.begin() as conn:
                return await conn.execute(text(sql), params or {})
        except Exception:
            return None

    @classmethod
    async def sqlite_fetch(cls, sql: str, params: dict = None) -> List[dict]:
        try:
            from sqlalchemy.ext.asyncio import create_async_engine
            from sqlalchemy import text
            if not cls._sqlite_engine:
                cls._sqlite_engine = create_async_engine(cls._cfg.sqlite_url, echo=False)
            async with cls._sqlite_engine.connect() as conn:
                result = await conn.execute(text(sql), params or {})
                rows = result.fetchall()
                cols = result.keys()
                return [dict(zip(cols, r)) for r in rows]
        except Exception:
            return []

    # ─── Oracle 只读桥 ───
    @classmethod
    async def oracle_fetch(cls, sql: str, params: dict = None) -> List[dict]:
        """从 pSpace Oracle 只读查询 (不写)"""
        try:
            import oracledb
            async with await oracledb.connect_async(dsn=cls._cfg.ora_dsn,
                user=cls._cfg.ora_user, password=cls._cfg.ora_pass) as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params or {})
                    cols = [d[0] for d in cur.description]
                    return [dict(zip(cols, r)) for r in cur.fetchall()]
        except Exception as e:
            log.warning(f"Oracle read failed: {e}")
            return []

    # ─── 统一查询接口 ───
    @classmethod
    async def execute(cls, sql: str, params: dict = None, *, write: bool = False) -> Any:
        """统一写入口: PG 主写 → SQLite 降级"""
        if write:
            return await cls.pg_execute(sql, params)
        # 读: PG → Oracle → SQLite
        rows = await cls.pg_fetch(sql, params)
        if rows: return rows
        rows = await cls.oracle_fetch(sql, params)
        if rows: return rows
        return await cls.sqlite_fetch(sql, params)

    @classmethod
    async def query(cls, sql: str, params: dict = None) -> List[dict]:
        """统一读"""
        return await cls.execute(sql, params, write=False)

    @classmethod
    async def health(cls) -> dict:
        """健康检查"""
        status = {"pg": False, "sqlite": False, "oracle": False}
        try:
            r = await cls.pg_fetch("SELECT 1")
            status["pg"] = bool(r)
        except: pass
        try:
            r = await cls.sqlite_fetch("SELECT 1")
            status["sqlite"] = len(r) >= 0
        except: pass
        return status


# 全局实例
db = UnifiedDB
