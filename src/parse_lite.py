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
import json, os, time, hashlib, hmac, base64, secrets, re
import logging
from datetime import datetime, timedelta, date
from typing import Optional, Callable

log = logging.getLogger("parse.lite")

class _DTEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

def _json_dumps(obj, **kw):
    return json.dumps(obj, cls=_DTEncoder, ensure_ascii=False, **kw)

try:
    from .parse_db import get_backend, DBBackend, get_db_compat
except ImportError:
    from parse_db import get_backend, DBBackend, get_db_compat

APP_ID = "<redacted-appid>"
MASTER_KEY = "<redacted-masterkey>"

PH = "?"  # placeholder, 由 get_db() 动态设置


# ===================== 数据库 =====================
def get_db():
    """返回兼容 sqlite3.Cursor 的包装器 (底层: SQLite 或 PostgreSQL)"""
    global PH
    be = get_backend()
    PH = be.placeholder if be else "?"
    return get_db_compat()

def now_iso():
    return get_backend().now_iso()

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
    be = get_backend()
    if class_name == "_SCHEMA":
        be.create_table(class_name, "className TEXT PRIMARY KEY, data TEXT")
    else:
        be.create_table(class_name, "objectId TEXT PRIMARY KEY, data TEXT DEFAULT '{}', ACL TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
        be.execute(f'CREATE INDEX IF NOT EXISTS idx_{class_name}_created ON "{class_name}"(createdAt)')
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
def resolve_pointer(val: dict, depth: int = 2, max_depth: int = 3) -> Optional[dict]:
    """解析 Pointer → 获取目标对象 (支持嵌套 Pointer 递归)
    depth: 当前深度 (2 = include 了一层 Pointer)
    max_depth: 最大递归层数 (防止死循环)"""
    if not isinstance(val, dict) or val.get("__type") != "Pointer":
        return val
    if depth >= max_depth:
        return val  # 不再递归，保留 Pointer 引用
    cn = val["className"]; oid = val["objectId"]
    ensure_table(cn); db = get_db()
    row = db.execute(f'SELECT * FROM "{cn}" WHERE objectId = ?', (oid,)).fetchone()
    db.close()
    if not row:
        return val
    obj = {"objectId": row["objectId"], "createdAt": row["createdAt"], "updatedAt": row["updatedAt"]}
    try:
        data = json.loads(row["data"])
        # 递归解析嵌套 Pointer
        for k, v in data.items():
            if isinstance(v, dict) and v.get("__type") == "Pointer":
                data[k] = resolve_pointer(v, depth + 1, max_depth)
        obj.update(data)
    except: pass
    return obj


def _include_obj(obj: dict, include_path: str, depth: int = 0, max_depth: int = 3):
    """处理多级 Include: "user.department.manager" """
    if depth >= max_depth:
        return
    parts = include_path.split(".")
    if not parts or parts[0] not in obj:
        return
    val = obj[parts[0]]
    resolved = resolve_pointer(val, depth, max_depth)
    if resolved:
        obj[parts[0]] = resolved
        if len(parts) > 1:
            _include_obj(resolved, ".".join(parts[1:]), depth + 1, max_depth)

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

# 不参与租户隔离的类 —— 身份与模式本身不属于任何租户（_Role 是租户表自己，
# 给它加租户过滤会把租户解析本身锁死）。parse_query 与 parse_get 共用这一份。
_TENANT_EXEMPT = ("_User", "_Role", "_Session", "_SCHEMA")


def _tenant_visible(row_tenant, user: dict) -> bool:
    """一行数据对当前用户是否可见 —— 读侧租户判据的**唯一**实现。

    语义与 parse_query 的注入式判据逐字一致：**空 = 共享**。
    读侧第二个入口（parse_get）原先**连判据都没有**，只查 objectId 再走一个
    ACL 默认全空的 check_acl —— 于是 /api/views/{id} 的越权读、越权删全靠没人知道 id。
    """
    if not user or not user.get("tenant_id"):
        return True                      # 未接线路径：行为一字不变
    return not row_tenant or row_tenant == user["tenant_id"]


def parse_query(class_name: str, params: dict, user: dict = None, is_master: bool = False) -> dict:
    """GET /classes/:className — 完整查询"""
    if not check_clp(class_name, "find", user, is_master):
        return {"results": [], "count": 0, "error": "Forbidden"}
    ensure_table(class_name)
    db = get_db()
    safe = class_name.replace('"', '""')

    # 本表真实列名（小写集合）—— WHERE / ORDER BY 靠它区分「真列」与「data 里的 JSON 键」
    cols = {d[1].lower() for d in db.execute(f'PRAGMA table_info("{safe}")').fetchall()}

    where = json.loads(params.get("where", "{}"))
    limit = min(int(params.get("limit", 100)), 10000)
    skip = int(params.get("skip", 0))
    order = params.get("order", "-createdAt")
    keys = params.get("keys", "").split(",") if params.get("keys") else []
    include = params.get("include", "").split(",") if params.get("include") else []
    count_mode = str(params.get("count", "")) == "1"

    # Build WHERE clause
    conditions, vals = _build_where(where, cols=cols)

    # 多租户注入
    if class_name not in _TENANT_EXEMPT and user and user.get("tenant_id"):
        conditions.append("(json_extract(data, '$.tenant_id') = ? OR json_extract(data, '$.tenant_id') IS NULL)")
        vals.append(user["tenant_id"])

    where_sql = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    # Order
    order_cols = []
    for o in order.split(","):
        o = o.strip()
        desc = o.startswith("-")
        field = o[1:] if desc else o
        col = _col_ref(field, cols)  # 真列用列名, 其他走 json_extract
        direction = "DESC" if desc else "ASC"
        order_cols.append(f"{col} {direction}")
    order_sql = "ORDER BY " + ", ".join(order_cols) if order_cols else 'ORDER BY "createdAt" DESC'

    # Count
    total = 0
    if count_mode or limit > 0:
        cr = db.execute(f'SELECT COUNT(*) as c FROM "{safe}" {where_sql}', vals).fetchone()
        total = _get_count_val(cr)

    if count_mode and int(params.get("limit", 100)) == 0:
        db.close()
        return {"results": [], "count": total}

    rows = db.execute(f'SELECT * FROM "{safe}" {where_sql} {order_sql} LIMIT ? OFFSET ?', vals + [limit, skip]).fetchall()

    results = []
    for r in rows:
        obj = _row_to_obj(r, keys)
        for inc in include:
            if inc:
                _include_obj(obj, inc)
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
    # 租户过滤 —— 原先这里没有，于是「按 id 取」是一条绕过 parse_query 租户注入的路。
    # 语义与 parse_query 一致：行的 tenant_id 空 = 共享。user 不传 → 一字不变。
    if class_name not in _TENANT_EXEMPT and not _tenant_visible(obj.get("tenant_id"), user):
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

    # LiveQuery broadcast
    obj = {"objectId": oid, **data}
    LiveQuery._broadcast(class_name, "create", obj)

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


def _roles_of_user(db, user_id: str) -> list:
    """用户的角色行 —— 租户在本模型里就是 _Role (见 _tenant_bundle)

    `ORDER BY r.objectId` 不是装饰。`_tenant_bundle` 取 `roles[0]` 当**当前租户**，
    而不带 ORDER BY 时 SQLite 给的行序是任意的 —— 同一个多角色用户，两次请求可以
    落在两个租户上。（dgiot 那边 `USER_ROLE_ETS` 存的就是个**列表**，
    dgiot_parse_auth.erl:165-189。）按 objectId 定序，至少每次是同一个答案。
    """
    return db.execute(
        "SELECT r.objectId, r.name FROM _Role r JOIN _Join_users_Role j ON r.objectId = j.roleId"
        " WHERE j.userId = ? ORDER BY r.objectId",
        (user_id,)).fetchall()


def _tenant_bundle(roles) -> dict:
    """角色行 → 租户二元组。

    ⚠️ **租户 = _Role.objectId**。**凡是解析租户都必须走本函数**，免得再多出第三个来源。

    🔴 **原句写的是「那个模块的 get_db() 引用了不存在的 `main.get_session`，端点一调即
    ImportError」—— 这句 2026-09-17 已过期，留此更正**（[[missing-input-takes-a-silent-default]]
    C 族：文档落后于实现）。`web/tenant_api.py` 在那之后改成了直连 sqlite3
    （提交 `6aabea5a4`，晚于本段所在的 `8eddbb142`），实测 `list_roles()` 返回 200 而非 500。
    ⚠️ **「端点能跑」不等于「两套来源合一了」** —— 真问题从来不是 ImportError，是
    **`POST /api/tenants` 造出来的租户在 `_tenant_bundle()` 这条路径上不存在**
    ⇒ 一个「创建成功但什么都看不到」的租户。

    ✅ **「两个来源并存的账仍待裁决」—— 2026-09-17 已裁、已落地。** 用户裁定
    「租户系统一套就行」，方向**收敛到 `_Role`**：`web/tenant_api.py` 的 6 个端点改经
    本模块的 role 函数读写 `_Role` / `_Join_users_Role`，`tenants` / `user_roles`
    两张表退役。原本那句「不是 SQL 那张 `tenants` 表 —— 后者是 `web/tenant_api.py`
    的数据源」现在**已经过时**（那张表不再是任何东西的数据源），但下游
    （`auth._resolve_tenant`）仍以本函数为唯一入口，所以**这条约束照旧成立、不能省**。
    （dgiot 侧同一事实：全仓没有 Tenant/Org/Company 类，租户/部门就是 `_Role`；
    `_User.department` 只是建用户时传 RoleId 的入参，建完就 `maps:without` 剥掉 ——
    dgiot_parse_auth.erl:828-840。）

    **多归属：不报错，但必须出声。** dgiot 让用户多角色并存、再靠「部门 token」显式
    选一个当前角色（dgiot_parse_auth.erl:1071-1086 造 session，
    dgiot_parse.erl:355-376 之后每个请求都拿它换掉 sessionToken）。iotStudio 没有
    那个切换开关（前端那个 switchTenant 只写 localStorage，一个字节都不发给后端），
    所以这里只能取第一个。既然只能取第一个，就得让人看得见「这里本来有得选」——
    否则多租户部署里一个多角色用户会静默地只看得到其中一家的料。
    """
    if len(roles) > 1:
        log.warning(
            f"[tenant] 用户有 {len(roles)} 个角色 {[r['objectId'] for r in roles]}，"
            f"当前租户取第一个 {roles[0]['objectId']!r} —— dgiot 靠部门 token 显式选，"
            f"本仓无该开关；多租户部署下这里可能是错的")
    return {"tenant_id": roles[0]["objectId"] if roles else "default",
            "tenants": [{"tenant_id": r["objectId"], "name": r["name"]} for r in roles]}


def parse_tenants_of_username(username: str) -> dict:
    """按**用户名**解析租户 —— 给 auth.get_current_user 补齐 JWT 用。

    存在的理由：`create_token` 的 payload 原先只有 {sub, role, iat, exp}，不带租户；
    而前端把 JWT 塞在 sessionToken 头里，verify_token 直接成功 —— 于是
    `_user_from_session`（唯一带 tenant_id 的那条分支）对前端**永不触发**，
    前端请求里 user.tenant_id 恒为 None。修法是签发时带上，老 token 走这里补。
    """
    db = get_db()
    row = db.execute("SELECT objectId FROM _User WHERE username = ?", (username,)).fetchone()
    if not row:
        db.close()
        return {"tenant_id": "default", "tenants": []}
    roles = _roles_of_user(db, row["objectId"])
    db.close()
    return _tenant_bundle(roles)


def parse_get_user_by_session(token: str) -> Optional[dict]:
    db = get_db()
    row = db.execute(
        "SELECT u.* FROM _User u JOIN _Session s ON u.objectId = s.user_id WHERE u.sessionToken = ? AND s.expiresAt > ?",
        (token, now_iso())).fetchone()
    if not row:
        db.close(); return None
    bundle = _tenant_bundle(_roles_of_user(db, row["objectId"]))
    db.close()
    return {"objectId": row["objectId"], "username": row["username"],
            "role": row["role"], "sessionToken": row["sessionToken"],
            **bundle}


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
# 🔴 **本行初稿写的是「`_Role` 的写入侧只有这一节」—— grep 之后发现是假的，留此更正。**
# `_Role` 是 Parse 类，写入路径本来就不止一条：`web/parse_router.py` 的通用
# `/classes/{ClassName}` CRUD、`web/user_manager_api.py:270-271` 的
# `ensure_table("_Role") + parse_create("_Role", …)`，加上本节。
# ⇒ 本节治的**不是**「多个写入者」，是**两个数据源**：`tenants` 表与 `_Role` 各存了一份
# 租户、两者永不同步。「写入者多」是 Parse 类的正常形态，**不是**病。
# （教训：绝对句要先做全域 grep 再写，别只读完手上这个文件就下笔。）
#
# 本节存在的理由是：`web/tenant_api.py` 不自己写 SQL，只调这里的函数。
# 它原来是直连 local.db 的 `tenants`/`user_roles` 两张表，于是同一个「租户」在
# `_Role`（数据面真在用，6 行）和 `tenants`（管理端点在读，0 行）各有一份 ⇒
# 管理后台的租户列表**永远是空的**，而系统照常按 6 个租户隔离。
# 2026-09-17 用户裁定合一：收敛到 `_Role`，那两张表退役。
#
# iotStudio 侧的租户台账列（slug/contact/phone/status/max_devices/max_users）落进
# `data` JSON，**不往 `_Role` 上加列** —— `_Role` 是跨系统共享的类（dgiot 那边
# 租户/部门就是它，全仓没有 Tenant/Org 类），加私有列等于两人共用一张表各写各的。
#
# ⚠️ `slug` **不在 data 里** —— 它就是 `_Role.alias`。
# 我原先按名字推断「alias 是展示别名、slug 是短标识，语义不同，映射过去成同一事实两处」，
# **实测把这条推翻了**：库里 6 行的 `alias` 逐行等于 `objectId`
# （default / oil-monitor / data-dept / prod-dept / maint-dept / demo-dept），
# 而 `name` 才是中文展示名（默认租户 / 设备完整性）。alias 本来就是短标识。
# ⇒ 把 slug 另存一份进 data 才是「同一事实两处」；直接映射过去才是对的。
# ⚠️ 且 `data` 里**已经有内容**（实测 {"desc": …, "department": true}）⇒
# 更新 `data` 必须**合并**，整体覆盖会把 desc/department 从 6 行上静默抹掉。
_ROLE_DATA_KEYS = ("contact", "phone", "status", "max_devices", "max_users")
# 这三条的缺省沿用退役的 `models/device.py` 那两张表的**列默认**（active/1000/50），
# 不是这里现编的。contact/phone 原表是 NULL，保持 None。
_ROLE_DATA_DEFAULTS = {"status": "active", "max_devices": 1000, "max_users": 50}


def _row_get(row, key, default=None):
    """行取值 —— `sqlite3.Row` 与 `dict` 都吃（SQLite 走 Row，PG 走 dict）"""
    try:
        return row[key]
    except (KeyError, IndexError):
        return default


def _role_data(raw) -> dict:
    """`_Role.data` → dict。**必须兜底**：SQLite 返 str，PG 的 jsonb 可能返 dict。"""
    if isinstance(raw, dict):
        return dict(raw)
    if not raw:
        return {}
    try:
        val = json.loads(raw)
    except (ValueError, TypeError) as e:
        log.warning(f"[role] _Role.data 不是合法 JSON，按空处理: {e}")
        return {}
    return val if isinstance(val, dict) else {}


def role_to_api(row) -> dict:
    """`_Role` 行 → `/api/tenants` 的**对外形状**（`web/tenant_api.py` 直接用）。

    ⚠️ **字段名一个不减** —— 这批端点用户 2026-09-17 裁为「对外承诺过」。
    键名逐字沿用退役的 `tenants` 表：id / tenant_id / name / slug / parent_id /
    contact / phone / status / max_devices / max_users / created_at；
    另加 `objectId` 与 `alias`（Parse 侧的本名）—— 加不减，是唯一安全的改法。

    `id` 原是 `tenants` 表的自增主键。实测那张表 **0 行** ⇒ **从没有过含真实 `id`
    的响应**（全仓唯一的前端消费者只调 `/api/tenants/my`，即 main.py 那个硬编码
    default）⇒ 让它等于 `objectId` 不破坏任何现存消费者。`extra` 同理：原表恒为
    NULL，不再单列。
    """
    oid = _row_get(row, "objectId")
    data = _role_data(_row_get(row, "data"))
    out = {k: data.get(k, _ROLE_DATA_DEFAULTS.get(k)) for k in _ROLE_DATA_KEYS}
    out.update({
        "id": oid, "tenant_id": oid, "objectId": oid,
        "name": _row_get(row, "name"),
        # slug ≡ alias（见上「⚠️ slug 不在 data 里」）
        "slug": _row_get(row, "alias"),
        "alias": _row_get(row, "alias"),
        "parent_id": _row_get(row, "parent_id"),
        "created_at": _row_get(row, "createdAt"),
    })
    return out


def parse_create_role(body: dict) -> dict:
    """建 `_Role`。业务列走 `data`（见 `_ROLE_DATA_KEYS`）。

    调用方须保证 `name` 不重复 —— 表上 `name` 是 UNIQUE，重复会抛。
    （租户 API 先查重再调，好给 400 而不是 500。）
    """
    db = get_db()
    oid = body.get("objectId") or _oid(); now = now_iso()
    db.execute("INSERT OR REPLACE INTO _Role (objectId, name, alias, parent_id, data, ACL, createdAt, updatedAt)"
               " VALUES (?,?,?,?,?,?,?,?)",
               (oid, body["name"], body.get("alias", body["name"]),
                body.get("parent_id"), json.dumps(body.get("data") or {}),
                json.dumps(body.get("ACL") or {}), now, now))
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


def parse_get_role(object_id: str) -> Optional[dict]:
    """按 objectId 取一**行**（含 data/ACL）。不存在返 None —— 调用方接 `role_to_api`。"""
    db = get_db()
    row = db.execute("SELECT * FROM _Role WHERE objectId = ?", (object_id,)).fetchone()
    db.close()
    return dict(row) if row else None


def parse_query_roles(params: dict = None):
    """列 `_Role`，可按 `name` 精确过滤。

    原实现**忽略入参、恒返全表**，且只挑 5 列手工拼 dict —— 现在返整行，
    `role_to_api` 才有 `data` 可用。

    ⚠️ 返的键仍是 `results`（Parse REST 的形状），`/api/roles` 要的 `roles` 由
    `web/tenant_api.py` 改名 —— **形状改写留在 HTTP 层**，别在这里分叉出第二个形状。
    """
    db = get_db()
    sql, args = "SELECT * FROM _Role", []
    if params and params.get("name") is not None:
        sql += " WHERE name = ?"; args.append(params["name"])
    rows = db.execute(sql + " ORDER BY name", tuple(args)).fetchall()
    db.close()
    return {"results": [dict(r) for r in rows]}


def parse_update_role(object_id: str, fields: dict) -> Optional[dict]:
    """部分更新 `_Role` —— **只动显式给的键**，没给的一律保持原值；角色不存在返 None。

    分两处落：`name`/`alias`/`parent_id` 是一等列，直接 UPDATE；其余按
    `_ROLE_DATA_KEYS` **合并**进 `data`。**合并不是整体覆盖** —— `data` 里可能还有
    别处写进去的键，整体覆盖会把它们静默抹掉（改一处、删三处）。
    """
    if fields.get("parent_id") == object_id:
        raise ValueError("parent_id 不能指向自己")
    db = get_db()
    row = db.execute("SELECT data FROM _Role WHERE objectId = ?", (object_id,)).fetchone()
    if not row:
        db.close(); return None
    sets, vals = [], []
    for k in ("name", "alias", "parent_id"):
        if k in fields:
            sets.append(f"{k} = ?"); vals.append(fields[k])
    data = _role_data(_row_get(row, "data"))
    given = {k: fields[k] for k in _ROLE_DATA_KEYS if k in fields}
    if given:
        data.update(given)
    sets.append("data = ?"); vals.append(json.dumps(data))
    now = now_iso()
    sets.append("updatedAt = ?"); vals.append(now)
    vals.append(object_id)
    db.execute(f"UPDATE _Role SET {', '.join(sets)} WHERE objectId = ?", tuple(vals))
    db.commit(); db.close()
    return {"objectId": object_id, "updatedAt": now}


def parse_delete_role(object_id: str) -> dict:
    """删 `_Role`，**连同它的用户关联行**。

    `_Join_users_Role` 必须一起删：留下孤儿关联，该用户下次登录时
    `_roles_of_user` 仍 JOIN 得到它 ⇒ 租户解析指向一个**已经不存在的角色**。
    （退役的旧实现删的是 local.db 的 `user_roles` —— 那张表实测 0 行、全仓无人读。）

    ⚠️ **本函数不做任何内置保护**（例如拒删 `default`）：那是 API 的策略，归
    `web/tenant_api.py`；Parse REST 那边删角色是合法操作。
    """
    db = get_db()
    db.execute("DELETE FROM _Join_users_Role WHERE roleId = ?", (object_id,))
    db.execute("DELETE FROM _Role WHERE objectId = ?", (object_id,))
    db.commit(); db.close()
    return {"status": "deleted", "objectId": object_id}


def parse_assign_role(user_id: str, role_id: str) -> dict:
    """把用户挂到角色上（`_Join_users_Role` ≡ dgiot `_Role.users` 关系）。

    ⚠️ **两边都得是已存在的 objectId**：`_Join_users_Role` 没有外键约束，写进一行
    指向不存在用户的记录，`_roles_of_user` 永远读不到它，而调用方拿到的是
    `{"status": "assigned"}` ⇒ **一次静默失败被报成成功**。故这里先核，
    核不到抛 ValueError，由 HTTP 层转 400。

    ⚠️ **幂等**：原实现每次生成新的 `objectId` + `INSERT OR REPLACE`，主键不同 ⇒
    从不 replace，**重复分配会在表里堆重复行** ⇒ `_tenant_bundle` 看见
    `len(roles) > 1`，对着一个其实只有一个角色的用户报「多角色，取第一个」。
    假警报会稀释真警报，所以这里先查后插。
    """
    db = get_db()
    for tbl, oid, label in (("_User", user_id, "用户"), ("_Role", role_id, "角色")):
        if not db.execute(f"SELECT 1 FROM {tbl} WHERE objectId = ?", (oid,)).fetchone():
            db.close()
            raise ValueError(f"{label} {oid!r} 不存在")
    if db.execute("SELECT 1 FROM _Join_users_Role WHERE userId = ? AND roleId = ?",
                  (user_id, role_id)).fetchone():
        db.close()
        return {"status": "assigned", "already": True}
    db.execute("INSERT INTO _Join_users_Role (objectId, userId, roleId, createdAt) VALUES (?,?,?,?)",
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
def _build_where(where: dict, prefix: str = "", cols=None):
    """递归构建 WHERE 条件 — 支持所有 Parse 约束

    cols = 当前表的真实列名集合（小写）。传了才知道 username/role/sessionToken
    这些是真列而非 data JSON 里的键，见 _col_ref。
    """
    conditions = []; vals = []

    if not where:
        return [], []

    for k, v in where.items():
        if k == "$or":
            or_conds = []
            for clause in v:
                sub_conds, sub_vals = _build_where(clause, prefix, cols)
                if sub_conds:
                    or_conds.append("(" + " AND ".join(sub_conds) + ")")
                    vals.extend(sub_vals)
            if or_conds:
                conditions.append("(" + " OR ".join(or_conds) + ")")
        elif k == "$and":
            for clause in v:
                sub_conds, sub_vals = _build_where(clause, prefix, cols)
                conditions.extend(sub_conds); vals.extend(sub_vals)
        elif isinstance(v, dict) and any(op.startswith("$") for op in v.keys()):
            for op, val in v.items():
                cond, vs = _op_to_sql(k, op, val, cols)
                if cond:
                    conditions.append(cond); vals.extend(vs)
        elif isinstance(v, dict) and v.get("__type") == "Pointer":
            conditions.append(f"json_extract(data, '$.{k}.objectId') = ?")
            vals.append(v["objectId"])
        else:
            col = _col_ref(k, cols)
            conditions.append(f"{col} = ?")
            vals.append(_serialize(v))
    return conditions, vals


def _col_ref(k: str, cols=None) -> str:
    """字段引用: 真实列用列名, 其他走 json_extract

    ⚠️ 原实现只认 objectId/createdAt/updatedAt/ACL 四个系统列，其余一律
    json_extract(data, '$.k')。但 _User/_Role/_Session 是按**真实列**建的表
    （username / role / sessionToken ...），其 data 列恒为 '{}' —— 于是
    「按 username 过滤」永远 0 行，会话校验永远查不到。cols 传当前表真实列名集合即可纠正。
    """
    if cols and k.lower() in cols:
        return '"' + k.replace('"', '""') + '"'
    if k.lower() in ("objectid", "createdat", "updatedat", "acl"):
        return f'"{k}"'
    return f"json_extract(data, '$.{k}')"


def _get_count_val(cr) -> int:
    """从 count 结果提取整数值 (兼容 PG dict / SQLite Row)"""
    if cr is None: return 0
    if isinstance(cr, dict):
        return int(cr.get("c", cr.get("count", list(cr.values())[0] if cr else 0)) or 0)
    try: return int(cr[0])
    except: return 0


def _op_to_sql(field: str, op: str, val, cols=None) -> tuple:
    """转换单个操作符"""
    # ⚠️ 下面 $in/$nin/$exists/$regex 四个分支原先写在无条件 return **之后**，
    #    是死代码 —— 任何查询用这四个操作符都会静默退化成「无此条件」。
    #    这里把集合类/存在类分支提到前面，比较类分支放最后。
    jf = _col_ref(field, cols)
    if op == "$in":
        if not val:
            return "1=0", []
        return f"{jf} IN ({','.join(['?']*len(val))})", [_serialize(v) for v in val]
    if op == "$nin":
        if not val:
            return "1=1", []
        return f"({jf} NOT IN ({','.join(['?']*len(val))}) OR {jf} IS NULL)", [_serialize(v) for v in val]
    if op == "$exists":
        return (f"{jf} IS NOT NULL" if val else f"{jf} IS NULL"), []
    if op == "$regex":
        return f"{jf} REGEXP ?", [str(val)]

    sql_ops = {"$ne": "!=", "$lt": "<", "$lte": "<=", "$gt": ">", "$gte": ">="}
    sql_op = sql_ops.get(op)
    if not sql_op:
        return None, []
    if op in ("$lt", "$lte", "$gt", "$gte"):
        # Numeric cast: PG/SQLite both accept +0 for type coercion
        jf = f"({jf}+0)"
    if op == "$ne":
        return f"({jf} IS NULL OR {jf} {sql_op} ?)", [_serialize(val)]
    return f"{jf} {sql_op} ?", [_serialize(val)]


def _serialize(val):
    if val is None: return None
    if isinstance(val, bool): return "true" if val else "false"
    if isinstance(val, (int, float)): return str(val)
    from datetime import datetime
    if isinstance(val, datetime): return val.isoformat()
    return str(val)


# 逐列收全时挡掉的字段：密字段永不出接口。
# _User 表里有 password_hash / sessionToken / sessionExpires，_Session 表整张都是令牌，
# 通用收列会把它们带进 /api/admin/users 这类响应里 —— 白名单改黑名单，黑名单必须挡死。
_DENY_COLS = {"password_hash", "password", "sessiontoken", "sessionexpires", "data", "acl"}


def _row_to_obj(row, keys: list = None) -> dict:
    from datetime import datetime
    # ⚠️ 成员判定必须查 row.keys()，不能写 `key in row`。
    #    sqlite3.Row 的 __contains__ 走 __iter__，而 __iter__ 迭代的是「值」不是「键」：
    #        "objectId" in row  → False        （拿字符串去比 admin/dgiot 这些值）
    #        row["objectId"]    → 'admin'      （键明明在）
    #    于是每一次 _g() 都落兜底空串，parse_query 对**所有表所有行**一律返回
    #    {"objectId":"","createdAt":"","updatedAt":""} —— 用户管理、角色管理页面空壳的病根。
    _colmap = {k.lower(): k for k in row.keys()}

    def _g(key, fallback=""):
        real = _colmap.get(key.lower())
        v = row[real] if real is not None else fallback
        if v is None: return fallback
        return v.isoformat() if isinstance(v, datetime) else (str(v) if isinstance(v, (int, float)) else v)
    obj = {"objectId": _g("objectId"), "createdAt": _g("createdAt"), "updatedAt": _g("updatedAt")}
    # JSON data column (parse_lite schema) — 优先处理, 所有字段都在这里
    data_val = _g("data")
    if data_val and data_val != "{}" and data_val != "":
        try:
            d = json.loads(data_val) if isinstance(data_val, str) else data_val
            if isinstance(d, dict):
                obj.update(d)
        except: pass
    # 实体列 —— 逐列收全（原为固定白名单，是空壳问题的第二个来源）
    # 白名单里没有 username / email / phone / role / alias / parent_id，
    # 所以 _User、_Role 即便行取对了，这几列也照样被丢掉。
    # 收全 + _DENY_COLS 挡密字段，比维护一份永远漏项的白名单可靠。
    for real in row.keys():
        if real in obj or real.lower() in _DENY_COLS:
            continue
        v = row[real]
        if v is None or v == "":
            continue
        obj[real] = v.isoformat() if isinstance(v, datetime) else (str(v) if isinstance(v, (int, float)) else v)
    # JSON basedata/detail/profile columns (Parse Server)
    for json_col in ["basedata", "detail", "profile", "content", "location", "state"]:
        v = _g(json_col)
        if v and v != "None" and v != "null":
            try:
                d = json.loads(v) if isinstance(v, str) else v
                if isinstance(d, dict):
                    obj[json_col] = d
                    # Merge basedata into top level for easier access
                    if json_col == "basedata":
                        for bk, bv in d.items():
                            if bk not in obj:
                                obj[bk] = bv
            except: pass
    acl_val = _g("ACL") or _g("_rperm", "{}")
    try: obj["ACL"] = json.loads(acl_val) if isinstance(acl_val, str) else acl_val
    except: pass
    if keys:
        obj = {k: v for k, v in obj.items() if k in keys or k in ("objectId", "createdAt", "updatedAt")}
    return obj


# ===================== Cloud Functions =====================
_cloud_functions = {}

def cloud_function(name: str):
    """装饰器: @cloud_function("hello") → POST /api/functions/hello 触发"""
    def deco(fn):
        _cloud_functions[name] = fn
        return fn
    return deco

def call_function(name: str, params: dict, user: dict = None) -> dict:
    """调用注册的 Cloud Function"""
    fn = _cloud_functions.get(name)
    if not fn:
        return {"error": f"Cloud function '{name}' not found"}
    try:
        result = fn({"params": params, "user": user, "master": False})
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}

# ===================== LiveQuery =====================
_livequery_subscriptions: dict = {}  # class_name → set of (ws_session, query_filter)

class LiveQuery:
    """实时查询 — afterSave/afterDelete → WebSocket 推送"""

    _ws_manager = None  # 由 main.py 注入

    @classmethod
    def set_ws_manager(cls, manager):
        cls._ws_manager = manager

    @classmethod
    def subscribe(cls, session_id: str, class_name: str, where: dict = None):
        key = class_name
        if key not in _livequery_subscriptions:
            _livequery_subscriptions[key] = {}
        _livequery_subscriptions[key][session_id] = where or {}

    @classmethod
    def unsubscribe(cls, session_id: str, class_name: str = None):
        if class_name:
            _livequery_subscriptions.get(class_name, {}).pop(session_id, None)
        else:
            for cn in _livequery_subscriptions:
                _livequery_subscriptions[cn].pop(session_id, None)

    @classmethod
    def _match(cls, obj: dict, where: dict) -> bool:
        """检查对象是否匹配订阅条件"""
        if not where:
            return True
        for k, v in where.items():
            if k not in obj or obj[k] != v:
                return False
        return True

    @classmethod
    def _broadcast(cls, class_name: str, event: str, obj: dict, where: dict = None):
        """将变更推送给所有匹配的订阅者"""
        subs = _livequery_subscriptions.get(class_name, {})
        if not subs:
            return
        msg = json.dumps({"op": event, "className": class_name, "object": obj})
        for session_id, filter_where in subs.items():
            if cls._match(obj, filter_where) and cls._ws_manager:
                cls._ws_manager.send(session_id, msg)


# ===================== Parse Aggregate =====================
def parse_aggregate(class_name: str, pipeline: list, user: dict = None, is_master: bool = False) -> dict:
    """Parse Aggregate 查询 → SQL GROUP BY / COUNT / SUM / AVG / MIN / MAX

    pipeline:
      [{"$match": {"status": "online"}},
       {"$group": {"_id": "$product_id", "count": {"$sum": 1}, "avg_val": {"$avg": "$value"}}},
       {"$sort": {"count": -1}},
       {"$limit": 10}]

    映射:
      $match → WHERE
      $group → GROUP BY + agg_func
      $sort  → ORDER BY
      $limit → LIMIT
    """
    if not check_clp(class_name, "find", user, is_master):
        return {"results": [], "error": "Forbidden"}
    ensure_table(class_name)
    db = get_db()

    where_clauses = ["1=1"]; where_vals = []
    group_fields = []; agg_fields = []
    order_clauses = []
    limit_val = 100

    for stage in pipeline:
        if isinstance(stage, dict):
            for op, spec in stage.items():
                if op == "$match":
                    # Strip $ prefix on field names (e.g., "$status" → "status")
                    clean = {k.lstrip('$'): v for k, v in spec.items()}
                    conds, vals = _build_where(clean)
                    where_clauses.extend(conds)
                    where_vals.extend(vals)
                elif op == "$group":
                    for alias, expr in spec.items():
                        if alias == "_id":
                            continue
                        if isinstance(expr, dict):
                            func = list(expr.keys())[0]
                            raw = expr[func]
                            if isinstance(raw, str) and raw.startswith("$"):
                                col = f"json_extract(data, '$.{raw[1:]}')"  # $value → json_extract
                            elif isinstance(raw, str):
                                col = f"json_extract(data, '$.{raw}')"
                            else:
                                col = str(raw)  # literal number (e.g., $sum: 1)
                            if func == "$sum":
                                agg_fields.append(f"SUM(({col}+0)) as \"{alias}\"")
                            elif func == "$avg":
                                agg_fields.append(f"AVG(({col}+0)) as \"{alias}\"")
                            elif func == "$min":
                                agg_fields.append(f"MIN(({col}+0)) as \"{alias}\"")
                            elif func == "$max":
                                agg_fields.append(f"MAX(({col}+0)) as \"{alias}\"")
                            elif func == "$count":
                                agg_fields.append(f"COUNT({col}) as \"{alias}\"")
                    # _id → GROUP BY
                    grp = spec.get("_id", "")
                    if grp:
                        if isinstance(grp, str):
                            grp_field = grp.lstrip("$")
                            group_fields.append(f"json_extract(data, '$.{grp_field}')")
                            agg_fields.append(f"json_extract(data, '$.{grp_field}') as \"{grp_field}\"")
                elif op == "$sort":
                    for col, direction in spec.items():
                        dir_str = "DESC" if direction == -1 else "ASC"
                        order_clauses.append(f'"{col}" {dir_str}')
                elif op == "$limit":
                    limit_val = int(spec)

    safe = class_name.replace('"', '""')
    select_fields = agg_fields if agg_fields else ["*"]
    where_sql = "WHERE " + " AND ".join(where_clauses)
    group_sql = f"GROUP BY {', '.join(group_fields)}" if group_fields else ""
    order_sql = "ORDER BY " + ", ".join(order_clauses) if order_clauses else ""
    limit_sql = f"LIMIT {limit_val}"

    sql = f'SELECT {", ".join(select_fields)} FROM "{safe}" {where_sql} {group_sql} {order_sql} {limit_sql}'
    rows = db.execute(sql, where_vals).fetchall()
    db.close()
    return {"results": [dict(r) for r in rows]}


# ===================== 初始化 =====================
def init_db():
    try:
        _do_init_db()
    except Exception as e:
        import logging; logging.warning(f"[parse_lite] init_db skip: {e}")

def _do_init_db():
    be = get_backend()
    db = get_db()
    be.create_table("_User", "objectId TEXT PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT, "
        "email TEXT, phone TEXT, role TEXT DEFAULT 'user', sessionToken TEXT, sessionExpires TEXT, "
        "data TEXT DEFAULT '{}', ACL TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("_Role", "objectId TEXT PRIMARY KEY, name TEXT UNIQUE, alias TEXT, "
        "parent_id TEXT, data TEXT DEFAULT '{}', ACL TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("_Session", "objectId TEXT PRIMARY KEY, sessionToken TEXT UNIQUE, "
        "user_id TEXT, data TEXT DEFAULT '{}', expiresAt TEXT, createdAt TEXT")
    be.create_table("_Join_users_Role", "objectId TEXT PRIMARY KEY, userId TEXT, roleId TEXT, data TEXT DEFAULT '{}', createdAt TEXT")
    be.create_table("_SCHEMA", "className TEXT PRIMARY KEY, data TEXT")
    # 本体层表
    be.create_table("ontology_site", "objectId TEXT PRIMARY KEY, name TEXT, type TEXT, location TEXT, description TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_gateway", "objectId TEXT PRIMARY KEY, name TEXT, ip TEXT, site_id TEXT, hostname TEXT, os TEXT, status TEXT, installed TEXT, channels TEXT, notes TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_channel", "objectId TEXT PRIMARY KEY, name TEXT, gateway_id TEXT, protocol TEXT, endpoint TEXT, status TEXT, config TEXT, devices TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_device", "objectId TEXT PRIMARY KEY, name TEXT, channel_id TEXT, type TEXT, protocol TEXT, slave_id INTEGER DEFAULT 1, manufacturer TEXT, model TEXT, status TEXT, points TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_point", "objectId TEXT PRIMARY KEY, name TEXT, device_id TEXT, unit TEXT, description TEXT, register TEXT, alarm TEXT, range_min REAL, range_max REAL, category TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_constraint", "objectId TEXT PRIMARY KEY, name TEXT, rule TEXT, entity TEXT, severity TEXT, source TEXT, action TEXT, enabled INTEGER DEFAULT 1, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_datasource", "objectId TEXT PRIMARY KEY, gateway_id TEXT, type TEXT, connection TEXT, status TEXT, tag_count INTEGER DEFAULT 0, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    be.create_table("ontology_link", "objectId TEXT PRIMARY KEY, source_id TEXT, target_id TEXT, relation TEXT, description TEXT, data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT")
    db.commit()

    now = now_iso()
    # 默认租户 (兼容 PG: INSERT OR IGNORE → 包装器翻译)
    db.execute("INSERT OR IGNORE INTO _Role (objectId, name, alias, createdAt, updatedAt) VALUES (?,?,?,?,?)",
               ("default", "默认租户", "default", now, now))
    db.commit()
    db.execute("INSERT OR IGNORE INTO _Role (objectId, name, alias, parent_id, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
               ("oil-monitor", "设备完整性", "oil-monitor", "default", now, now))
    db.commit()
    # 管理员
    db.execute("INSERT OR IGNORE INTO _User (objectId, username, password_hash, role, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
               ("admin", "admin", _hash(os.environ.get("ADMIN_PASS", "changeme")), "admin", now, now))
    db.commit()
    db.close()
    print("[parse-lite] initialized")


init_db()
