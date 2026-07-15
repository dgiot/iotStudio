"""
Parse REST API 路由 — 对齐 iotStudio/DG-IoT
=============================================
映射 iotStudio src/api/Parse/index.js 的 7 个核心函数:
  query_object   → GET  /api/classes/{className}
  create_object  → POST /api/classes/{className}
  get_object     → GET  /api/classes/{className}/{id}
  update_object  → PUT  /api/classes/{className}/{id}
  del_object     → DEL  /api/classes/{className}/{id}
  shuwa_batch    → POST /api/batch

对齐 DG-IoT 23+ 实体类:
  Device, Product, Channel, ProductTemplet, Dict, Category,
  _Role, _User, _Session, Menu, View, Log, Notification,
  Evidence, Instruct, Timescale, Alarm, _SCHEMA
"""
from fastapi import APIRouter, Request, HTTPException, Query
from typing import Optional
import json

router = APIRouter(prefix="/api", tags=["parse"])

# ═══════════════════════════════════════════════════════════
# 核心 CRUD (映射 iotStudio Parse/index.js)
# ═══════════════════════════════════════════════════════════

@router.get("/classes/{class_name}")
async def query_objects(
    class_name: str,
    request: Request,
    where: Optional[str] = None,
    order: Optional[str] = None,
    limit: Optional[int] = None,
    skip: Optional[int] = None,
    keys: Optional[str] = None,
    include: Optional[str] = None,
    count: Optional[int] = None,
    page: Optional[int] = None,
    page_size: Optional[int] = None,
):
    """query_object — 查询对象列表"""
    from ..parse_lite import parse_query
    params = {}
    if where: params["where"] = where
    if order: params["order"] = order
    if keys: params["keys"] = keys
    if include: params["include"] = include
    if count is not None: params["count"] = count
    # Support page/page_size (frontend pagination)
    if page and page_size:
        params["limit"] = page_size
        params["skip"] = (page - 1) * page_size
    elif limit is not None:
        params["limit"] = limit
    if skip is not None:
        params["skip"] = skip
    return parse_query(class_name, params)


@router.post("/classes/{class_name}")
async def create_object(class_name: str, request: Request):
    """create_object — 创建对象 (含 beforeSave/afterSave 钩子)"""
    from ..parse_lite import parse_create, ensure_table
    from .parse_hooks import run_hooks, HookError
    ensure_table(class_name)
    body = await request.json()
    try:
        body = await run_hooks(class_name, "beforeSave", body, is_new=True)
    except HookError as e:
        raise HTTPException(e.code, e.message)
    result = parse_create(class_name, body)
    await run_hooks(class_name, "afterSave", result, is_new=True)
    return result


@router.get("/classes/{class_name}/{object_id}")
async def get_object(class_name: str, object_id: str):
    """get_object — 获取单个对象"""
    from ..parse_lite import parse_get
    obj = parse_get(class_name, object_id)
    if not obj:
        raise HTTPException(404, "对象不存在")
    return obj


@router.put("/classes/{class_name}/{object_id}")
async def update_object(class_name: str, object_id: str, request: Request):
    """update_object — 更新对象 (含 beforeSave/afterSave 钩子)"""
    from ..parse_lite import parse_update, parse_get
    from .parse_hooks import run_hooks
    body = await request.json()
    old = parse_get(class_name, object_id)
    body["objectId"] = object_id
    body = await run_hooks(class_name, "beforeSave", body, is_new=False)
    result = parse_update(class_name, object_id, body)
    await run_hooks(class_name, "afterSave", result, is_new=False)
    return result


@router.delete("/classes/{class_name}/{object_id}")
async def del_object(class_name: str, object_id: str):
    """del_object — 删除对象"""
    from ..parse_lite import parse_delete
    return parse_delete(class_name, object_id)


# ═══════════════════════════════════════════════════════════
# Batch + Auth + Schema (对齐 DG-IoT)
# ═══════════════════════════════════════════════════════════

@router.post("/batch")
async def batch_operation(request: Request):
    """shuwa_batch — 批量操作 (max 50)"""
    from ..parse_lite import parse_batch
    body = await request.json()
    requests_list = body.get("requests", [])
    return parse_batch(requests_list)


@router.post("/login")
async def login(request: Request):
    """用户登录"""
    from ..parse_lite import parse_login
    body = await request.json()
    return parse_login(body.get("username", ""), body.get("password", ""))


@router.post("/logout")
async def logout(request: Request):
    """用户登出 — 支持 body.sessionToken 和 header.sessionToken 两种方式"""
    from ..parse_lite import parse_logout
    body = await request.json()
    # 优先从 body 取，其次从 header 取（前端 axios 拦截器放在 header）
    token = body.get("sessionToken", "") or request.headers.get("sessionToken", "") or ""
    return parse_logout(token)


@router.post("/register")
async def register(request: Request):
    """用户注册 (DG-IoT 兼容)"""
    from ..parse_lite import parse_register
    body = await request.json()
    return parse_register(body.get("username", ""), body.get("password", ""),
                          body.get("email", ""))

@router.post("/users")
async def create_user(request: Request):
    """DG-IoT 标准用户注册: POST /api/users"""
    from ..parse_lite import parse_create_user
    body = await request.json()
    return parse_create_user(body)


@router.get("/schemas")
async def list_schemas():
    """列出所有 Schema (DG-IoT 标准格式)"""
    from ..parse_lite import parse_query
    result = parse_query("_SCHEMA", {"limit": 100})
    # 确保返回 {results: [], count: N} 格式
    if isinstance(result, dict) and "results" not in result:
        results = result.get("data", []) if isinstance(result, dict) else []
        return {"results": results, "count": len(results)}
    return result


@router.get("/schemas/{class_name}")
async def get_schema(class_name: str):
    """获取单个 Schema"""
    from ..parse_lite import parse_get
    return parse_get("_SCHEMA", class_name)


@router.post("/schemas/{class_name}")
async def create_schema(class_name: str, request: Request):
    """创建/更新 Schema"""
    from ..parse_lite import parse_create
    body = await request.json()
    return parse_create("_SCHEMA", {**body, "className": class_name})


# ═══════════════════════════════════════════════════════════
# 兼容旧端点 (保持前端不报错)
# ═══════════════════════════════════════════════════════════

@router.get("/users/me")
async def current_user(request: Request):
    from ..parse_lite import parse_get
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if token:
        sessions = parse_query("_Session", {"where": json.dumps({"sessionToken": token})})
        for s in sessions.get("results", []):
            user = parse_get("_User", s.get("user_id", ""))
            if user:
                return {"username": user.get("username"), "objectId": user.get("objectId")}
    raise HTTPException(401, "未登录")


@router.get("/tenants/my")
def my_tenants():
    """获取当前用户租户列表 (无需认证)"""
    from ..parse_lite import parse_query
    roles = parse_query("_Role", {"limit": 50})
    tenants = [{"tenant_id": r.get("objectId",""), "name": r.get("name","")}
               for r in roles.get("results", [])]
    if not tenants:
        tenants = [{"tenant_id": "default", "name": "默认租户"}]
    return {"tenants": tenants, "current": "default"}


# ═══════════════════════════════════════════════════════════
# LiveQuery WebSocket (对标 Parse LiveQuery)
# ═══════════════════════════════════════════════════════════

@router.get("/livequery/{class_name}")
async def livequery_subscribe(class_name: str, request: Request):
    """WebSocket 端点: 订阅某个 Class 的实时变更"""
    from fastapi import WebSocket
    ws_manager = getattr(request.app.state, 'ws_manager', None)
    if not ws_manager:
        raise HTTPException(500, "WebSocket manager not configured")
    raise HTTPException(426, "Use WebSocket upgrade: ws://host/api/livequery/{class_name}")


# ═══════════════════════════════════════════════════════════
# Aggregate (对标 Parse Aggregate)
# ═══════════════════════════════════════════════════════════

@router.post("/aggregate/{class_name}")
async def aggregate_query(class_name: str, request: Request):
    """POST /api/aggregate/:className — Parse Aggregate 查询"""
    from ..parse_lite import parse_aggregate
    body = await request.json()
    pipeline = body.get("pipeline", body.get("_pipeline", []))
    return parse_aggregate(class_name, pipeline)
