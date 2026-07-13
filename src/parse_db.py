"""
parse_db.py — DB abstraction layer for parse_lite
==================================================
Backend: sqlite (embedded) | postgres (system service)
Auto-select: Linux → postgres, Windows → sqlite (fallback to embedded PG)
"""
import os, sys, json, logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, List, Tuple, Any

log = logging.getLogger("parse_db")

# ═══════════════════════════════════════════
# Abstract Backend
# ═══════════════════════════════════════════

class DBBackend(ABC):
    @abstractmethod
    def connect(self) -> bool: ...
    @abstractmethod
    def close(self): ...
    @abstractmethod
    def execute(self, sql: str, params: tuple = ()) -> Any: ...
    @abstractmethod
    def fetchone(self, sql: str, params: tuple = ()) -> Optional[dict]: ...
    @abstractmethod
    def fetchall(self, sql: str, params: tuple = ()) -> List[dict]: ...
    @abstractmethod
    def commit(self): ...
    @property
    @abstractmethod
    def placeholder(self) -> str: ...  # '?' for sqlite, '%s' for pg
    @abstractmethod
    def json_field(self, col: str, path: str, as_text: bool = False) -> str: ...
    @abstractmethod
    def now_iso(self) -> str: ...
    @abstractmethod
    def create_table(self, name: str, columns: str): ...
    @abstractmethod
    def upsert(self, table: str, keys: dict, data: dict): ...

# ═══════════════════════════════════════════
# SQLite Backend
# ═══════════════════════════════════════════

class SQLiteBackend(DBBackend):
    def __init__(self, db_path: str):
        import sqlite3
        self._path = db_path
        self._conn: Optional[sqlite3.Connection] = None
        self._placeholder = "?"

    @property
    def placeholder(self) -> str:
        return self._placeholder

    def connect(self) -> bool:
        import sqlite3
        os.makedirs(os.path.dirname(self._path), exist_ok=True)
        self._conn = sqlite3.connect(self._path)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA foreign_keys=ON")
        return True

    def close(self):
        if self._conn:
            self._conn.close()
            self._conn = None

    def execute(self, sql: str, params: tuple = ()) -> Any:
        """返回 cursor 用于 fetchone/fetchall"""
        return self._conn.execute(sql, params)

    def fetchone(self, sql: str, params: tuple = ()) -> Optional[dict]:
        row = self._conn.execute(sql, params).fetchone()
        return dict(row) if row else None

    def fetchall(self, sql: str, params: tuple = ()) -> List[dict]:
        return [dict(r) for r in self._conn.execute(sql, params).fetchall()]

    def commit(self):
        self._conn.commit()

    def json_field(self, col: str, path: str, as_text: bool = False) -> str:
        """SQLite: json_extract(data, '$.field')"""
        return f"json_extract({col}, '$.{path}')"

    def now_iso(self) -> str:
        return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")

    def create_table(self, name: str, columns: str):
        safe = name.replace('"', '""')
        # SQLite: TEXT is fine, PG will use JSONB after translation
        self._conn.execute(f'CREATE TABLE IF NOT EXISTS "{safe}" ({columns})')

    def upsert(self, table: str, keys: dict, data: dict):
        cols = list(keys.keys()) + list(data.keys())
        vals = list(keys.values()) + list(data.values())
        placeholders = ", ".join(["?"] * len(cols))
        safe = table.replace('"', '""')
        self._conn.execute(
            f'INSERT OR REPLACE INTO "{safe}" ({", ".join(cols)}) VALUES ({placeholders})',
            vals
        )


# ═══════════════════════════════════════════
# PostgreSQL Backend (asyncpg)
# ═══════════════════════════════════════════

class PostgresBackend(DBBackend):
    def __init__(self, dsn: str = None):
        self._dsn = dsn or os.getenv("PARSE_PG_DSN",
            "postgresql://dgiot:dgiot123@127.0.0.1:7432/parse")
        self._pool = None
        self._placeholder = "%s"
        import asyncio
        self._loop = None

    @property
    def placeholder(self) -> str:
        return self._placeholder

    def connect(self) -> bool:
        """同步 connect — 内部用 asyncio"""
        import asyncio, asyncpg
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        async def _connect():
            self._pool = await asyncpg.create_pool(
                self._dsn,
                min_size=1,
                max_size=10,
            )
            # 确保 parse 数据库存在
            async with self._pool.acquire() as conn:
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS _SCHEMA (className TEXT PRIMARY KEY, data JSONB);
                    CREATE TABLE IF NOT EXISTS _User (objectId TEXT PRIMARY KEY, username TEXT UNIQUE,
                        password_hash TEXT, email TEXT, phone TEXT, role TEXT DEFAULT 'user',
                        sessionToken TEXT, sessionExpires TEXT, data JSONB DEFAULT '{}', ACL JSONB DEFAULT '{}',
                        createdAt TEXT, updatedAt TEXT);
                    CREATE TABLE IF NOT EXISTS _Role (objectId TEXT PRIMARY KEY, name TEXT UNIQUE,
                        alias TEXT, parent_id TEXT, data JSONB DEFAULT '{}', ACL JSONB DEFAULT '{}',
                        createdAt TEXT, updatedAt TEXT);
                    CREATE TABLE IF NOT EXISTS _Session (objectId TEXT PRIMARY KEY,
                        sessionToken TEXT UNIQUE, user_id TEXT, data JSONB DEFAULT '{}',
                        expiresAt TEXT, createdAt TEXT);
                    CREATE TABLE IF NOT EXISTS _Join_users_Role (objectId TEXT PRIMARY KEY,
                        userId TEXT, roleId TEXT, data JSONB DEFAULT '{}', createdAt TEXT);
                """)
            return True

        try:
            return loop.run_until_complete(_connect())
        except Exception as e:
            log.warning(f"[parse_db] PostgreSQL connect failed: {e}, fallback to SQLite")
            return False

    def close(self):
        if self._pool:
            import asyncio
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
            loop.run_until_complete(self._pool.close())
            self._pool = None

    def _run(self, coro):
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        # Ensure pool is alive
        if self._pool is None:
            if not self.connect():
                raise RuntimeError("PostgreSQL pool is dead, reconnect failed")

        if loop.is_running():
            # 已经在 async 上下文中: 创建新 task
            import concurrent.futures
            future = concurrent.futures.Future()
            async def _wrap():
                try:
                    result = await coro
                    future.set_result(result)
                except Exception as e:
                    future.set_exception(e)
            loop.create_task(_wrap())
            return future.result(timeout=30)
        else:
            return loop.run_until_complete(coro)

    def execute(self, sql: str, params: tuple = ()):
        async def _exec():
            async with self._pool.acquire() as conn:
                # Quote PascalCase column names + convert placeholders
                sql_quoted = DBWrapper._translate_static(sql)
                pg_sql = self._to_pg_sql(sql_quoted, params)
                upper = sql.strip().upper()
                if upper.startswith(('INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER')):
                    await conn.execute(pg_sql, *params)
                    return "OK"
                return await conn.fetch(pg_sql, *params)
        return self._run(_exec())

    def fetchone(self, sql: str, params: tuple = ()) -> Optional[dict]:
        async def _fetch():
            async with self._pool.acquire() as conn:
                sql_q = DBWrapper._translate_static(sql)
                pg_sql = self._to_pg_sql(sql_q, params)
                row = await conn.fetchrow(pg_sql, *params)
                return dict(row) if row else None
        return self._run(_fetch())

    def fetchall(self, sql: str, params: tuple = ()) -> List[dict]:
        async def _fetch():
            async with self._pool.acquire() as conn:
                sql_q = DBWrapper._translate_static(sql)
                pg_sql = self._to_pg_sql(sql_q, params)
                rows = await conn.fetch(pg_sql, *params)
                return [dict(r) for r in rows]
        return self._run(_fetch())

    def commit(self):
        # asyncpg auto-commit
        pass

    def json_field(self, col: str, path: str, as_text: bool = False) -> str:
        """PG: data->>'field' (text) or data->'field' (jsonb)"""
        if as_text:
            return f"{col}->>'{path}'"
        return f"{col}->'{path}'"

    def now_iso(self) -> str:
        return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")

    def create_table(self, name: str, columns: str):
        safe_name = name.replace("'", "''")
        pg_cols = DBWrapper._translate_static(columns)
        async def _create():
            async with self._pool.acquire() as conn:
                await conn.execute(f'CREATE TABLE IF NOT EXISTS "{safe_name}" ({pg_cols})')
        self._run(_create())

    def upsert(self, table: str, keys: dict, data: dict):
        all_cols = list(keys.keys()) + list(data.keys())
        all_vals = list(keys.values()) + list(data.values())
        safe = table.replace("'", "''")
        # PostgreSQL UPSERT
        pk_cols = list(keys.keys())
        update_cols = [c for c in list(data.keys()) if c not in pk_cols]
        placeholders = ", ".join([f"${i+1}" for i in range(len(all_cols))])
        update_set = ", ".join([f'"{c}" = EXCLUDED."{c}"' for c in update_cols])

        async def _upsert():
            async with self._pool.acquire() as conn:
                await conn.execute(
                    f'INSERT INTO "{safe}" ({", ".join(all_cols)}) VALUES ({placeholders}) '
                    f'ON CONFLICT ({", ".join(pk_cols)}) DO UPDATE SET {update_set}',
                    *all_vals
                )
        self._run(_upsert())

    def _to_pg_sql(self, sql: str, params: tuple) -> str:
        """占位符转换 + 列名加引号"""
        sql = DBWrapper._translate_static(sql)
        if "?" not in sql and "%s" not in sql:
            return sql
        idx = [0]
        def _replace(m):
            idx[0] += 1
            return f"${idx[0]}"
        import re
        return re.sub(r'\?|%s', _replace, sql)

    def replace_json_functions(self, sql: str) -> str:
        """将 SQLite 的 json_extract → PG 的 ->  / ->>
        同时 REGEXP → ~   (如果使用了)"""
        sql = sql.replace("REGEXP", "~")
        return sql


# ═══════════════════════════════════════════
# Backend Factory
# ═══════════════════════════════════════════

_backend: Optional[DBBackend] = None

def get_backend() -> DBBackend:
    """PG-only: 关系数据统一走 PostgreSQL"""
    global _backend
    if _backend is not None:
        return _backend

    # 环境变量覆盖
    dsn_env = os.getenv("PARSE_PG_DSN", "")

    if dsn_env:
        _backend = PostgresBackend(dsn_env)
        if _backend.connect():
            log.info(f"[parse_db] PG: {dsn_env.split('@')[0]}@...")
            return _backend

    # 嵌入式 PG 自动发现 (Linux: 系统 PG, Windows: WSL PG 或 本地 PG)
    try:
        try:
            from .embedded_pg import ensure_pg
        except ImportError:
            from embedded_pg import ensure_pg
        dsn = ensure_pg()
        if dsn:
            _backend = PostgresBackend(dsn)
            if _backend.connect():
                log.info(f"[parse_db] Embedded PG OK")
                return _backend
    except ImportError:
        log.warning("[parse_db] embedded_pg not available")
    except Exception as e:
        log.warning(f"[parse_db] Embedded PG error: {e}")

    # Final fallback: 直接连 localhost:7432
    _backend = PostgresBackend("postgresql://dgiot:dgiot123@127.0.0.1:7432/parse")
    if _backend.connect():
        log.info("[parse_db] Direct PG connect OK")
        return _backend

    import warnings
    warnings.warn("[parse_db] PG not available - using SQLite")
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'parse.db')
    _backend = SQLiteBackend(db_path)
    _backend.connect()
    log.info("[parse_db] SQLite fallback OK")
    return _backend


def reset_backend():
    global _backend
    if _backend:
        _backend.close()
    _backend = None


# ═══════════════════════════════════════════
# Compatibility wrapper — sqlite3-like API
# 让 parse_lite.py 代码无需改动，底层自动切 PG/SQLite
# ═══════════════════════════════════════════

class DBWrapper:
    """sqlite3.Cursor 兼容包装 — 让现有 parse_lite 代码零改动
    自动翻译 SQLite SQL → PostgreSQL SQL"""

    def __init__(self, backend: DBBackend):
        self._be = backend
        self._is_pg = isinstance(backend, PostgresBackend)

    def execute(self, sql: str, params: tuple = ()):
        """返回 self (支持 fetchone/fetchall 链式调用)
        INSERT/UPDATE/DELETE 立即执行 (无结果集)"""
        self._last_sql = sql
        self._last_params = params
        upper = sql.strip().upper().split()[0] if sql.strip() else ""
        if upper in ('INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'):
            # 突变: 立即执行
            if self._is_pg:
                self._be.execute(self._translate_sql(sql), params)
            else:
                self._be.execute(sql, params)
            self._was_mutation = True
        else:
            # 查询: 延迟执行 (等 fetchone/fetchall)
            if self._is_pg:
                self._last_sql = self._translate_sql(sql)
            self._was_mutation = False
        return self

    def fetchone(self):
        if self._was_mutation:
            return None
        if self._is_pg:
            row = self._be.fetchone(self._last_sql, self._last_params)
            return _normalize_keys(row)
        return self._be.execute(self._last_sql, self._last_params).fetchone()

    def fetchall(self):
        if self._was_mutation:
            return []
        if self._is_pg:
            rows = self._be.fetchall(self._last_sql, self._last_params)
            return [_normalize_keys(r) for r in rows]
        return self._be.execute(self._last_sql, self._last_params).fetchall()

    def close(self):
        pass  # 池化连接不关闭

    def commit(self):
        # PG auto-commit; SQLite needs explicit commit
        if not self._is_pg:
            self._be.commit()

    @staticmethod
    def _translate_static(sql: str) -> str:
        """Quote PascalCase columns (shared by DBWrapper + PostgresBackend)"""
        import re
        PG_COLS = ["objectId", "createdAt", "updatedAt", "sessionToken", "expiresAt",
                    "className", "devaddr", "parentId", "isEnable", "lastOnlineTime",
                    "assetNum", "namenumber", "deviceSecret"]
        for c in PG_COLS:
            sql = re.sub(rf'(?<!")\b{re.escape(c)}\b(?!")', f'"{c}"', sql)
        return sql

    def _translate_sql(self, sql: str) -> str:
        """SQLite SQL → PostgreSQL SQL"""
        import re
        sql = self._translate_static(sql)
        # (json_extract(data, '$.field')+0) → (data::jsonb->>'field')::numeric
        sql = re.sub(r"\(?json_extract\((\w+),\s*'\$\.(\w+)'\)\+0\)?", r"(\1::jsonb->>'\2')::numeric", sql)
        # json_extract(data, '$.field') → data::jsonb->>'field'  (PG TEXT列需cast)
        sql = re.sub(r"json_extract\((\w+),\s*'\$\.(\w+)'\)", r"\1::jsonb->>'\2'", sql)
        # json_extract(data, '$.field.sub') → data::jsonb->'field'->>'sub'
        sql = re.sub(r"json_extract\((\w+),\s*'\$\.([^']+)'\)", lambda m: self._pg_json_path(m), sql)
        # REGEXP → ~
        sql = sql.replace(" REGEXP ", " ~ ")
        # INSERT OR IGNORE → INSERT ... ON CONFLICT DO NOTHING
        if "INSERT OR IGNORE" in sql:
            sql = sql.replace("INSERT OR IGNORE", "INSERT")
            if "ON CONFLICT" not in sql:
                sql = sql.replace(";", "") + " ON CONFLICT DO NOTHING"
        # INSERT OR REPLACE → INSERT ... ON CONFLICT
        if "INSERT OR REPLACE" in sql:
            sql = self._translate_upsert(sql)
        # PRAGMA → skip (no-op in PG)
        if sql.strip().upper().startswith("PRAGMA"):
            sql = "SELECT 1"  # no-op
        return sql

    def _pg_json_path(self, m):
        """data::jsonb->'field'->>'sub' → PG JSONB路径"""
        col = m.group(1)
        path = m.group(2)
        parts = path.split('.')
        ops = [f"{col}::jsonb->'{parts[0]}'"]
        for p in parts[1:-1]:
            ops.append(f"->'{p}'")
        if len(parts) > 1:
            ops.append(f"->>'{parts[-1]}'")
        return "".join(ops)

    def _translate_upsert(self, sql: str) -> str:
        """INSERT OR REPLACE INTO t(a,b) VALUES(?,?) → INSERT INTO t(a,b) VALUES($1,$2) ON CONFLICT(a) DO UPDATE SET b=EXCLUDED.b"""
        import re
        m = re.match(r"INSERT OR REPLACE INTO\s+\"(\w+)\"\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)", sql, re.I)
        if not m:
            m = re.match(r"INSERT OR REPLACE INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)", sql, re.I)
        if not m:
            return sql.replace("INSERT OR REPLACE", "INSERT")
        table = m.group(1)
        cols = [c.strip() for c in m.group(2).split(",")]
        vals = m.group(3)
        # Assume first column is PK
        pk = cols[0]
        update_cols = [f'"{c}" = EXCLUDED."{c}"' for c in cols[1:]]
        n = vals.count("?") if "?" in vals else vals.count("$")
        pg_vals = ", ".join([f"${i+1}" for i in range(n)])
        update = ", ".join(update_cols) if update_cols else f'"{pk}" = EXCLUDED."{pk}"'
        return f'INSERT INTO "{table}" ({m.group(2)}) VALUES ({pg_vals}) ON CONFLICT ("{pk}") DO UPDATE SET {update}'


def _normalize_keys(row):
    """Pass-through — PG columns are already PascalCase"""
    if row is None:
        return None
    return dict(row) if not isinstance(row, dict) else row


def get_db_compat():
    """返回 sqlite3.Cursor 兼容对象 (供 parse_lite.py 使用)"""
    return DBWrapper(get_backend())


# Monkey-patch: 让现有 parse_lite.py 的 get_db() 返回兼容包装
__all__ = ["get_backend", "get_db_compat", "DBBackend", "SQLiteBackend",
           "PostgresBackend", "reset_backend", "DBWrapper"]
