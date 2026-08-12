"""
用户管理 API — 角色/部门/权限/菜单
====================================
对标 DG-IoT dgiot_parse_auth + dgiot_role

端点:
  GET  /api/admin/users          用户列表(含角色+部门)
  PUT  /api/admin/users/{id}/role  分配角色
  PUT  /api/admin/users/{id}/dept  分配部门
  GET  /api/admin/roles           角色树
  POST /api/admin/roles           创建角色
  GET  /api/admin/departments     部门列表
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import json, logging

log = logging.getLogger("user_mgr")
router = APIRouter(prefix="/api/admin", tags=["User Management"])

# ═══════════════════════════════════════════════════════════
# 用户列表 (含角色+部门信息)
# ═══════════════════════════════════════════════════════════

@router.get("/users")
async def list_users():
    """用户列表 — 合并 _User + _Role 信息"""
    from ..parse_lite import parse_query
    users = parse_query("_User", {"limit": 100})
    roles = parse_query("_Role", {"limit": 100})

    role_map = {}
    for r in roles.get("results", []):
        role_map[r.get("objectId", "")] = r.get("name", r.get("objectId", "?"))

    results = []
    for u in users.get("results", []):
        user_role = u.get("role", "")
        dept = u.get("department", "")
        results.append({
            "objectId": u.get("objectId"),
            "username": u.get("username"),
            "email": u.get("email", ""),
            "phone": u.get("phone", ""),
            "role": user_role,
            "role_name": role_map.get(user_role, user_role or "未分配"),
            "department": dept,
            "department_name": role_map.get(dept, dept or "未分配"),
            "createdAt": u.get("createdAt"),
            "updatedAt": u.get("updatedAt"),
        })
    return {"results": results, "count": len(results)}


# ═══════════════════════════════════════════════════════════
# 角色分配
# ═══════════════════════════════════════════════════════════

class RoleAssign(BaseModel):
    role: str = ""

@router.put("/users/{user_id}/role")
async def assign_role(user_id: str, body: RoleAssign):
    """为用户分配角色"""
    from ..parse_lite import parse_update, parse_get
    user = parse_get("_User", user_id)
    if not user:
        raise HTTPException(404, "用户不存在")
    return parse_update("_User", user_id, {"role": body.role})


@router.put("/users/{user_id}/department")
async def assign_department(user_id: str, body: RoleAssign):
    """为用户分配部门"""
    from ..parse_lite import parse_update, parse_get
    user = parse_get("_User", user_id)
    if not user:
        raise HTTPException(404, "用户不存在")
    return parse_update("_User", user_id, {"department": body.role})


# ═══════════════════════════════════════════════════════════
# 角色树
# ═══════════════════════════════════════════════════════════

@router.get("/roles")
async def list_roles():
    """角色树 — 含父子关系"""
    from ..parse_lite import parse_query
    roles = parse_query("_Role", {"limit": 100})
    role_map = {}
    for r in roles.get("results", []):
        oid = r.get("objectId", "")
        role_map[oid] = {
            "objectId": oid,
            "name": r.get("name", oid),
            "parent": r.get("parent"),
            "desc": r.get("desc", ""),
            "users": r.get("users", []),
            "menus": r.get("menus", []),
            "permissions": r.get("permissions", []),
            "children": [],
        }
    # 构建树
    roots = []
    for oid, role in role_map.items():
        parent = role.get("parent")
        if parent and parent in role_map:
            role_map[parent]["children"].append(role)
        else:
            roots.append(role)
    return {"results": roots, "count": len(role_map)}


class CreateRole(BaseModel):
    name: str
    parent: str = ""
    desc: str = ""

@router.post("/roles")
async def create_role(body: CreateRole):
    """创建角色"""
    from ..parse_lite import parse_create, ensure_table
    ensure_table("_Role")
    return parse_create("_Role", {
        "name": body.name,
        "parent": body.parent or None,
        "desc": body.desc,
        "users": [],
        "menus": [],
        "permissions": [],
    })


# ═══════════════════════════════════════════════════════════
# 部门列表
# ═══════════════════════════════════════════════════════════

@router.get("/departments")
async def list_departments():
    """部门列表 — 从 _Role 中 parent=null 的为部门"""
    from ..parse_lite import parse_query
    roles = parse_query("_Role", {"limit": 100})
    depts = []
    for r in roles.get("results", []):
        if not r.get("parent"):  # 顶级角色 = 部门
            depts.append({
                "objectId": r.get("objectId"),
                "name": r.get("name", r.get("objectId")),
                "desc": r.get("desc", ""),
                "user_count": len(r.get("users", [])),
            })
    return {"results": depts, "count": len(depts)}
