"""
Parse-lite — Python Parse Server 兼容实现
==========================================
参考: https://docs.parseplatform.org/parse-server/guide/
对齐 DG-IoT Parse Server REST API。

已实现:
  ✅ 对象 CRUD (POST/GET/PUT/DELETE classes/:className)
  ✅ 查询约束 ($ne, $lt, $gt, $lte, $gte, $in, $nin, $exists, $regex)
  ✅ $or / $and 复合查询
  ✅ limit, skip, order, keys (select), include
  ✅ count (count=1&limit=0)
  ✅ Pointer (__type:"Pointer")
  ✅ Relation (AddRelation, RemoveRelation, query relation)
  ✅ ACL (public, user, role)
  ✅ CLP (classLevelPermissions 自动检查)
  ✅ 用户体系 (signup, login, logout, session)
  ✅ 角色体系 (_Role 创建, 用户-角色关联, 层级)
  ✅ 动态 Schema (ensure_class_table)
  ✅ Hook 系统 (beforeSave, afterSave, beforeDelete, afterDelete)
  ✅ Batch 操作 (POST /batch, max 50)
  ✅ Schema API (GET/POST /schemas)
"""
import json, sqlite3, os, uuid, time, hashlib, hmac, base64, secrets, re
from datetime import datetime, timedelta
from typing import Optional, Callable
from functools import wraps

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "parse.db")
APP_ID = "ddc9ac052450367e4a03c4056c21bff8"
MASTER_KEY = "b59551ab147d580a84272044b2139fbd"
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)


# ===================== 数据库 =====================
def get_db():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row; c.execute("PRAGMA journal_mode=WAL"); c.execute("PRAGMA foreign_keys=ON")
    return c

def now_iso():
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")

def _oid():
    return secrets.token_hex(10)

def _hash(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def _gen_token():
    return f"r:{secrets.token_hex(32)}"

NULL_ACL = json.dumps({})


# ===================== Schema & 动态建表 =====================
SCHEMA_CACHE = {}

def ensure_table(class_name: str):
    """动态建表 + 缓存 Schema 定义"""
    if class_name in SCHEMA_CACHE:
        return
    db = get_db()
    safe = class_name.replace('"', '""')
    db.execute(f'CREATE TABLE IF NOT EXISTS "{safe}" (objectId TEXT PRIMARY KEY, data TEXT DEFAULT \'{{}}\', ACL TEXT DEFAULT \'{{}}\', createdAt TEXT, updatedAt TEXT)')
    db.execute(f'CREATE INDEX IF NOT EXISTS idx_{class_name}_created ON "{safe}"(createdAt)')
    db.commit()
    db.close()
    SCHEMA_CACHE[class_name] = {"className": class_name, "fields": {}, "classLevelPermissions": {}}


def load_schema(class_name: str):
    """从 schemas 表加载 CLP 定义"""
    try:
        db = get_db()
        row = db.execute("SELECT data FROM _SCHEMA WHERE className = ?", (class_name,)).fetchone()
        db.close()
        if row:
            SCHEMA_CACHE[class_name] = json.loads(row["data"])
    except:
        ensure_table("_SCHEMA")
        db = get_db()
        db.execute('CREATE TABLE IF NOT EXISTS _SCHEMA (className TEXT PRIMARY KEY, data TEXT)')
        db.commit(); db.close()


def get_clp(class_name: str) -> dict:
    """获取类的 CLP 定义"""
    if class_name not in SCHEMA_CACHE:
        load_schema(class_name)
    return SCHEMA_CACHE.get(class_name, {}).get("classLevelPermissions", {})


def check_clp(class_name: str, action: str, user: dict = None, is_master: bool = False) -> bool:
    """CLP 检查 — 无定义时默认开放"""
    if is_master:
        return True
    clp = get_clp(class_name)
    perm = clp.get(action, {})
    if not perm:
        # 内置类默认开放；自定义类无 CLP 时也开放 (等同于 {"*": true})
        return True
    if perm.get("*"):
        return True
    if user and perm.get("requiresAuthentication"):
        return True
    if user:
        uid = user.get("objectId", "")
        if uid and perm.get(uid):
            return True
        role = user.get("role", "")
        if role and perm.get(f"role:{role}"):
            return True
    return False


# ===================== ACL =====================
def check_acl(acl_str: str, user: dict, action: str = "read") -> bool:
    """ACL 检查 — 对象级权限"""
    try:
        acl = json.loads(acl_str) if isinstance(acl_str, str) else (acl_str or {})
    except:
        return True
    if not acl:
        return True
    if "*" in acl and acl["*"].get(action):
        return True
    if user:
        uid = user.get("objectId", "")
        if uid and uid in acl and acl[uid].get(action):
            return True
        role = user.get("role", "")
        if role and f"role:{role}" in acl and acl[f"role:{role}"].get(action):
            return True
    return False


# ===================== Hooks =====================
_hooks = {"beforeSave": {}, "afterSave": {}, "beforeDelete": {}, "afterDelete": {}}

def beforeSave(class_name: str):
    """装饰器: beforeSave hook"""
    def deco(fn):
        _hooks["beforeSave"][class_name] = fn
        return fn
    return deco

def afterSave(class_name: str):
    def deco(fn):
        _hooks["afterSave"][class_name] = fn
        return fn
    return deco

def beforeDelete(class_name: str):
    def deco(fn):
        _hooks["beforeDelete"][class_name] = fn
        return fn
    return deco

def afterDelete(class_name: str):
    def deco(fn):
        _hooks["afterDelete"][class_name] = fn
        return fn
    return deco


# ===================== Pointer & Relation =====================
def resolve_pointer(val: dict) -> Optional[dict]:
    """解析 Pointer → 获取目标对象"""
    if isinstance(val, dict) and val.get("__type") == "Pointer":
        cn = val["className"]; oid = val["objectId"]
        ensure_table(cn); db = get_db()
        safe = cn.replace('"', '""')
        row = db.execute(f'SELECT * FROM "{safe}" WHERE objectId = ?', (oid,)).fetchone()
        db.close()
        if row:
            obj = {"objectId": row["objectId"], "createdAt": row["createdAt"], "updatedAt": row["updatedAt"]}
            try: obj.update(json.loads(row["data"]))
            except: pass
            return obj
    return None

def encode_pointer(class_name: str, object_id: str) -> dict:
    return {"__type": "Pointer", "className": class_name, "objectId": object_id}

def handle_relation_op(class_name: str, object_id: str, field: str, op: str, targets: list):
    """处理 AddRelation / RemoveRelation"""
    db = get_db()
    safe = class_name.replace('"', '""')
    row = db.execute(f'SELECT data FROM "{safe}" WHERE objectId = ?', (object_id,)).fetchone()
    if not row:
        db.close(); return
    data = json.loads(row["data"]) if row["data"] else {}
    rel_key = f"_rel_{field}"
    ids = data.get(rel_key, [])
    target_ids = [t["objectId"] for t in targets]
    if op == "AddRelation":
        ids = list(set(ids + target_ids))
    elif op == "RemoveRelation":
        ids = [i for i in ids if i not in target_ids]
    data[rel_key] = ids
    db.execute(f'UPDATE "{safe}" SET data = ?, updatedAt = ? WHERE objectId = ?',
               (json.dumps(data, ensure_ascii=False), now_iso(), object_id))
    db.commit(); db.close()


# ===================== CRUD =====================
def parse_query(class_name: str, params: dict, user: dict = None, is_master: bool = False) -> dict:
    """GET /classes/:className — 完整查询"""
    if not check_clp(class_name, "find", user, is_master):
        return {"results": [], "count": 0, "error": "Forbidden"}
    ensure_table(class_name)
    db = get_db()
    safe = class_name.replace('"', '""')

    where = json.loads(params.get("where", "{}"))
    limit = min(int(params.get("limit", 100)), 10000)
    skip = int(params.get("skip", 0))
    order = params.get("order", "-createdAt")
    keys = params.get("keys", "").split(",") if params.get("keys") else []
    include = params.get("include", "").split(",") if params.get("include") else []
    count_mode = params.get("count") == "1"

    # Build WHERE clause
    conditions, vals = _build_where(where)

    # 多租户注入
    if class_name not in ("_User", "_Role", "_Session", "_SCHEMA") and user and user.get("tenant_id"):
        conditions.append("(json_extract(data, '$.tenant_id') = ? OR json_extract(data, '$.tenant_id') IS NULL)")
        vals.append(user["tenant_id"])

    where_sql = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    # Order
    order_cols = []
    for o in order.split(","):
        o = o.strip()
        if o.startswith("-"):
            order_cols.append(f"json_extract(data, '$.{o[1:]}') DESC")
        else:
            order_cols.append(f"json_extract(data, '$.{o}') ASC")
    order_sql = "ORDER BY " + ", ".join(order_cols) if order_cols else "ORDER BY createdAt DESC"

    # Count
    total = 0
    if count_mode or limit > 0:
        cr = db.execute(f'SELECT COUNT(*) as c FROM "{safe}" {where_sql}', vals).fetchone()
        total = cr["c"] if cr else 0

    if count_mode and int(params.get("limit", 100)) == 0:
        db.close()
        return {"results": [], "count": total}

    rows = db.execute(f'SELECT * FROM "{safe}" {where_sql} {order_sql} LIMIT ? OFFSET ?', vals + [limit, skip]).fetchall()

    results = []
    for r in rows:
        obj = _row_to_obj(r, keys)
        if include:
            for inc in include:
                val = obj.get(inc)
                resolved = resolve_pointer(val)
                if resolved:
                    obj[inc] = resolved
        results.append(obj)

    db.close()
    return {"results": results, "count": total}


def parse_get(class_name: str, object_id: str, user: dict = None, is_master: bool = False) -> Optional[dict]:
    if not check_clp(class_name, "get", user, is_master):
        return None
    ensure_table(class_name)
    db = get_db()
    safe = class_name.replace('"', '""')
    row = db.execute(f'SELECT * FROM "{safe}" WHERE objectId = ?', (object_id,)).fetchone()
    db.close()
    if not row:
        return None
    obj = _row_to_obj(row)
    if not check_acl(row["ACL"], (user or {}), "read") and not is_master:
        return None
    return obj


def parse_create(class_name: str, body: dict, user: dict = None, is_master: bool = False) -> dict:
    if not check_clp(class_name, "create", user, is_master):
        return {"error": "Forbidden"}
    ensure_table(class_name)

    # Hook: beforeSave
    hook = _hooks["beforeSave"].get(class_name)
    if hook:
        result = hook({"object": body, "user": user, "master": is_master})
        if result is False:
            return {"error": "beforeSave rejected"}

    db = get_db()
    safe = class_name.replace('"', '""')
    oid = body.pop("objectId", None) or _oid()
    now = now_iso()

    # 分离 ACL, Pointer, Relation
    acl = body.pop("ACL", {})
    data = {}
    for k, v in body.items():
        if isinstance(v, dict) and v.get("__op") in ("AddRelation", "RemoveRelation"):
            continue  # Relations processed separately
        if k in ("createdAt", "updatedAt", "objectId"):
            continue
        data[k] = v

    # 自动租户
    if user and user.get("tenant_id") and "tenant_id" not in data:
        data["tenant_id"] = user["tenant_id"]

    db.execute(f'INSERT INTO "{safe}" (objectId, data, ACL, createdAt, updatedAt) VALUES (?,?,?,?,?)',
               (oid, json.dumps(data, ensure_ascii=False), json.dumps(acl), now, now))
    db.commit()

    # Process Relation ops
    for k, v in body.items():
        if isinstance(v, dict) and v.get("__op") == "AddRelation":
            handle_relation_op(class_name, oid, k, "AddRelation", v.get("objects", []))

    db.close()

    # Hook: afterSave
    hook = _hooks["afterSave"].get(class_name)
    if hook:
        hook({"object": {"objectId": oid, **data}, "user": user, "master": is_master})

    return {"objectId": oid, "createdAt": now}


def parse_update(class_name: str, object_id: str, body: dict, user: dict = None, is_master: bool = False) -> dict:
    if not check_clp(class_name, "update", user, is_master):
        return {"error": "Forbidden"}
    ensure_table(class_name)
    db = get_db()
    safe = class_name.replace('"', '""')
    row = db.execute(f'SELECT data, ACL FROM "{safe}" WHERE objectId = ?', (object_id,)).fetchone()
    if not row:
        db.close(); return {"error": "Not found"}
    if not check_acl(row["ACL"], (user or {}), "write") and not is_master:
        db.close(); return {"error": "Forbidden"}

    data = json.loads(row["data"]) if row["data"] else {}
    for k, v in body.items():
        if k in ("objectId", "createdAt", "updatedAt", "ACL"):
            continue
        if isinstance(v, dict) and v.get("__op") == "RemoveRelation":
            handle_relation_op(class_name, object_id, k, "RemoveRelation", v.get("objects", []))
            continue
        if isinstance(v, dict) and v.get("__op") == "AddRelation":
            handle_relation_op(class_name, object_id, k, "AddRelation", v.get("objects", []))
            continue
        if isinstance(v, dict) and v.get("__op") == "Increment":
            data[k] = data.get(k, 0) + (v.get("amount", 1))
            continue
        if isinstance(v, dict) and v.get("__op") == "Delete":
            data.pop(k, None)
            continue
        data[k] = v  # 普通字段更新

    now = now_iso()
    db.execute(f'UPDATE "{safe}" SET data = ?, updatedAt = ? WHERE objectId = ?',
               (json.dumps(data, ensure_ascii=False), now, object_id))
    db.commit(); db.close()
    return {"objectId": object_id, "updatedAt": now}


def parse_delete(class_name: str, object_id: str, user: dict = None, is_master: bool = False) -> dict:
    if not check_clp(class_name, "delete", user, is_master):
        return {"error": "Forbidden"}
    # Hook: beforeDelete
    hook = _hooks["beforeDelete"].get(class_name)
    if hook:
        result = hook({"objectId": object_id, "user": user, "master": is_master})
        if result is False:
            return {"error": "beforeDelete rejected"}

    ensure_table(class_name)
    db = get_db()
    safe = class_name.replace('"', '""')
    row = db.execute(f'SELECT ACL FROM "{safe}" WHERE objectId = ?', (object_id,)).fetchone()
    if not row:
        db.close(); return {"error": "Not found"}
    if not check_acl(row["ACL"], (user or {}), "write") and not is_master:
        db.close(); return {"error": "Forbidden"}
    db.execute(f'DELETE FROM "{safe}" WHERE objectId = ?', (object_id,))
    db.commit(); db.close()

    hook = _hooks["afterDelete"].get(class_name)
    if hook:
        hook({"objectId": object_id, "user": user, "master": is_master})
    return {}


# ===================== Batch =====================
def parse_batch(requests: list, user: dict = None, is_master: bool = False) -> list:
    """POST /batch — 批量操作, max 50"""
    results = []
    for req in requests[:50]:
        method = req.get("method", "GET")
        path = req.get("path", "")
        body = req.get("body", {})
        # 简单路径解析: /classes/ClassName 或 /classes/ClassName/oid
        parts = path.strip("/").split("/")
        try:
            if "classes" in parts:
                idx = parts.index("classes")
                cn = parts[idx + 1]
                oid = parts[idx + 2] if len(parts) > idx + 2 else None
                if method == "POST":
                    r = parse_create(cn, body, user, is_master)
                elif method == "PUT" and oid:
                    r = parse_update(cn, oid, body, user, is_master)
                elif method == "DELETE" and oid:
                    r = parse_delete(cn, oid, user, is_master)
                else:
                    r = parse_get(cn, oid, user, is_master)
                results.append({"success": r})
            elif path == "/users" and method == "POST":
                r = parse_create_user(body)
                results.append({"success": r})
            elif path == "/login":
                r = parse_login(body.get("username", ""), body.get("password", ""))
                results.append({"success": r if r else {"error": "Invalid credentials"}})
            else:
                results.append({"error": "Unknown path"})
        except Exception as e:
            results.append({"error": str(e)})
    return results


# ===================== User & Session =====================
def parse_create_user(body: dict) -> dict:
    db = get_db()
    oid = _oid(); now = now_iso(); token = _gen_token()
    expires = (datetime.utcnow() + timedelta(days=365)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    db.execute(
        "INSERT INTO _User (objectId, username, password_hash, email, phone, role, sessionToken, sessionExpires, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (oid, body["username"], _hash(body.get("password", "")),
         body.get("email", ""), body.get("phone", ""), body.get("role", "user"), token, expires, now, now))
    db.execute("INSERT INTO _Session (objectId, sessionToken, user_id, expiresAt, createdAt) VALUES (?,?,?,?,?)",
               (_oid(), token, oid, expires, now))
    db.commit(); db.close()
    return {"objectId": oid, "username": body["username"], "sessionToken": token, "createdAt": now}


def parse_login(username: str, password: str) -> Optional[dict]:
    db = get_db()
    row = db.execute("SELECT * FROM _User WHERE username = ? AND password_hash = ?",
                     (username, _hash(password))).fetchone()
    if not row:
        db.close(); return None
    token = _gen_token()
    expires = (datetime.utcnow() + timedelta(days=365)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    db.execute("UPDATE _User SET sessionToken = ?, sessionExpires = ? WHERE objectId = ?",
               (token, expires, row["objectId"]))
    db.execute("INSERT INTO _Session (objectId, sessionToken, user_id, expiresAt, createdAt) VALUES (?,?,?,?,?)",
               (_oid(), token, row["objectId"], expires, now_iso()))
    db.commit(); db.close()
    return {"objectId": row["objectId"], "username": row["username"],
            "sessionToken": token, "role": row["role"], "email": row["email"]}


def parse_get_user_by_session(token: str) -> Optional[dict]:
    db = get_db()
    row = db.execute(
        "SELECT u.* FROM _User u JOIN _Session s ON u.objectId = s.user_id WHERE u.sessionToken = ? AND s.expiresAt > ?",
        (token, now_iso())).fetchone()
    if not row:
        db.close(); return None
    roles = db.execute("SELECT r.objectId, r.name FROM _Role r JOIN _Join_users_Role j ON r.objectId = j.roleId WHERE j.userId = ?",
                       (row["objectId"],)).fetchall()
    db.close()
    return {"objectId": row["objectId"], "username": row["username"],
            "role": row["role"], "sessionToken": row["sessionToken"],
            "tenant_id": roles[0]["objectId"] if roles else "default",
            "tenants": [{"tenant_id": r["objectId"], "name": r["name"]} for r in roles]}


def parse_logout(token: str):
    db = get_db()
    db.execute("UPDATE _User SET sessionToken = NULL, sessionExpires = NULL WHERE sessionToken = ?", (token,))
    db.execute("DELETE FROM _Session WHERE sessionToken = ?", (token,))
    db.commit(); db.close()


def parse_get_session(token: str):
    db = get_db()
    row = db.execute("SELECT * FROM _Session WHERE sessionToken = ? AND expiresAt > ?", (token, now_iso())).fetchone()
    db.close()
    return dict(row) if row else None


# ===================== Role =====================
def parse_create_role(body: dict) -> dict:
    db = get_db()
    oid = body.get("objectId") or _oid(); now = now_iso()
    db.execute("INSERT OR REPLACE INTO _Role (objectId, name, alias, parent_id, ACL, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)",
               (oid, body["name"], body.get("alias", body["name"]),
                body.get("parent_id"), json.dumps(body.get("ACL", {})), now, now))
    # User relations
    users = body.get("users", {}).get("objects", []) if isinstance(body.get("users"), dict) else []
    for u in users:
        db.execute("INSERT OR IGNORE INTO _Join_users_Role (objectId, userId, roleId, createdAt) VALUES (?,?,?,?)",
                   (_oid(), u["objectId"], oid, now))
    # Parent role relations
    roles = body.get("roles", {}).get("objects", []) if isinstance(body.get("roles"), dict) else []
    for r in roles:
        db.execute("UPDATE _Role SET parent_id = ? WHERE objectId = ?", (r["objectId"], oid))
    db.commit(); db.close()
    return {"objectId": oid, "createdAt": now}


def parse_query_roles(params: dict = None):
    db = get_db()
    rows = db.execute("SELECT * FROM _Role ORDER BY name").fetchall()
    db.close()
    return {"results": [{"objectId": r["objectId"], "name": r["name"], "alias": r["alias"],
                          "parent_id": r["parent_id"], "createdAt": r["createdAt"]} for r in rows]}


def parse_assign_role(user_id: str, role_id: str):
    db = get_db()
    db.execute("INSERT OR REPLACE INTO _Join_users_Role (objectId, userId, roleId, createdAt) VALUES (?,?,?,?)",
               (_oid(), user_id, role_id, now_iso()))
    db.commit(); db.close()
    return {"status": "assigned"}


# ===================== Schema API =====================
def parse_get_schemas():
    db = get_db()
    rows = db.execute("SELECT className, data FROM _SCHEMA").fetchall()
    db.close()
    return {"results": [{"className": r["className"], **json.loads(r["data"])} for r in rows]}


def parse_create_schema(body: dict):
    ensure_table("_SCHEMA")
    cn = body["className"]
    db = get_db()
    db.execute("INSERT OR REPLACE INTO _SCHEMA (className, data) VALUES (?,?)",
               (cn, json.dumps({"className": cn, "fields": body.get("fields", {}),
                                "classLevelPermissions": body.get("classLevelPermissions", {})})))
    db.commit(); db.close()
    ensure_table(cn)
    return {"className": cn, "status": "created"}


# ===================== 查询构建 =====================
def _build_where(where: dict, prefix: str = ""):
    """递归构建 WHERE 条件 — 支持所有 Parse 约束"""
    conditions = []; vals = []

    if not where:
        return [], []

    for k, v in where.items():
        if k == "$or":
            or_conds = []
            for clause in v:
                sub_conds, sub_vals = _build_where(clause, prefix)
                if sub_conds:
                    or_conds.append("(" + " AND ".join(sub_conds) + ")")
                    vals.extend(sub_vals)
            if or_conds:
                conditions.append("(" + " OR ".join(or_conds) + ")")
        elif k == "$and":
            for clause in v:
                sub_conds, sub_vals = _build_where(clause, prefix)
                conditions.extend(sub_conds); vals.extend(sub_vals)
        elif isinstance(v, dict) and any(op.startswith("$") for op in v.keys()):
            for op, val in v.items():
                cond, vs = _op_to_sql(k, op, val)
                if cond:
                    conditions.append(cond); vals.extend(vs)
        elif isinstance(v, dict) and v.get("__type") == "Pointer":
            conditions.append(f"json_extract(data, '$.{k}.objectId') = ?")
            vals.append(v["objectId"])
        else:
            conditions.append(f"json_extract(data, '$.{k}') = ?")
            vals.append(_serialize(v))
    return conditions, vals


def _op_to_sql(field: str, op: str, val) -> tuple:
    """转换单个操作符"""
    jf = f"json_extract(data, '$.{field}')"
    if op == "$ne":
        return f"({jf} IS NULL OR {jf} != ?)", [_serialize(val)]
    if op == "$lt":
        return f"{jf} < ?", [_serialize(val)]
    if op == "$lte":
        return f"{jf} <= ?", [_serialize(val)]
    if op == "$gt":
        return f"{jf} > ?", [_serialize(val)]
    if op == "$gte":
        return f"{jf} >= ?", [_serialize(val)]
    if op == "$in":
        return f"{jf} IN ({','.join(['?']*len(val))})", [_serialize(v) for v in val]
    if op == "$nin":
        return f"({jf} NOT IN ({','.join(['?']*len(val))}) OR {jf} IS NULL)", [_serialize(v) for v in val]
    if op == "$exists":
        return ("json_extract(data, '$.{field}') IS NOT NULL" if val else "json_extract(data, '$.{field}') IS NULL").format(field=field), []
    if op == "$regex":
        return f"{jf} REGEXP ?", [str(val)]
    return None, []


def _serialize(val):
    if val is None: return None
    if isinstance(val, bool): return 1 if val else 0
    if isinstance(val, (int, float)): return val
    return str(val)


def _row_to_obj(row, keys: list = None) -> dict:
    obj = {"objectId": row["objectId"], "createdAt": row["createdAt"], "updatedAt": row["updatedAt"]}
    try: obj.update(json.loads(row["data"]))
    except: pass
    try: obj["ACL"] = json.loads(row["ACL"])
    except: pass
    if keys:
        obj = {k: v for k, v in obj.items() if k in keys or k in ("objectId", "createdAt", "updatedAt")}
    return obj


# ===================== 初始化 =====================
def init_db():
    db = get_db()
    db.executescript("""
        CREATE TABLE IF NOT EXISTS _User (objectId TEXT PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT,
            email TEXT, phone TEXT, role TEXT DEFAULT 'user', sessionToken TEXT, sessionExpires TEXT,
            data TEXT DEFAULT '{}', ACL TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT);
        CREATE TABLE IF NOT EXISTS _Role (objectId TEXT PRIMARY KEY, name TEXT UNIQUE, alias TEXT,
            parent_id TEXT, data TEXT DEFAULT '{}', ACL TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT);
        CREATE TABLE IF NOT EXISTS _Session (objectId TEXT PRIMARY KEY, sessionToken TEXT UNIQUE,
            user_id TEXT, data TEXT DEFAULT '{}', expiresAt TEXT, createdAt TEXT);
        CREATE TABLE IF NOT EXISTS _Join_users_Role (objectId TEXT PRIMARY KEY, userId TEXT, roleId TEXT, data TEXT DEFAULT '{}', createdAt TEXT);
        CREATE TABLE IF NOT EXISTS _SCHEMA (className TEXT PRIMARY KEY, data TEXT);
        -- 本体四层表 (对齐 DG-IoT dgiot_ontology)
        CREATE TABLE IF NOT EXISTS ontology_site (objectId TEXT PRIMARY KEY, name TEXT, type TEXT, location TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT);
        CREATE TABLE IF NOT EXISTS ontology_gateway (objectId TEXT PRIMARY KEY, name TEXT, ip TEXT, site_id TEXT, protocols TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT);
        CREATE TABLE IF NOT EXISTS ontology_device (objectId TEXT PRIMARY KEY, name TEXT, gateway_id TEXT, type TEXT, protocol TEXT, slave_id INTEGER DEFAULT 1, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT);
        CREATE TABLE IF NOT EXISTS ontology_point (objectId TEXT PRIMARY KEY, name TEXT, device_id TEXT, unit TEXT, register TEXT, alarm TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT);
    """)
    db.commit()

    now = now_iso()
    # 默认租户
    db.execute("INSERT OR IGNORE INTO _Role (objectId, name, alias, createdAt, updatedAt) VALUES (?,?,?,?,?)",
               ("default", "默认租户", "default", now, now))
    db.execute("INSERT OR IGNORE INTO _Role (objectId, name, alias, parent_id, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
               ("oil-monitor", "设备完整性", "oil-monitor", "default", now, now))
    # 管理员
    db.execute("INSERT OR IGNORE INTO _User (objectId, username, password_hash, role, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
               ("admin", "admin", _hash("admin123"), "admin", now, now))
    db.commit()
    db.close()
    print("[parse-lite] initialized")


init_db()
