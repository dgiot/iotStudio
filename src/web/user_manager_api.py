"""
用户管理 API — 角色/部门/权限/菜单
====================================
对标 DG-IoT dgiot_parse_auth + dgiot_role

端点（全部要求 admin 身份）:
  GET  /api/admin/users            用户列表(含角色+部门)
  PUT  /api/admin/users/{id}/role  分配角色
  PUT  /api/admin/users/{id}/department  分配部门
  GET  /api/admin/roles            角色树
  POST /api/admin/roles            创建角色
  GET  /api/admin/departments      部门列表
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import json, logging

from ..auth import require_admin, USERS as AUTH_USERS

log = logging.getLogger("user_mgr")

# ⚠️ 这里必须挂 require_admin。
#    原先 router 无任何依赖 —— GET /api/admin/users 未认证可读（枚举账号），
#    PUT /api/admin/users/{id}/role 未认证可写 = **任意人可把自己提成 admin**。
#    登录态与角色判定都走 auth.USERS，所以门禁放在同一处。
router = APIRouter(prefix="/api/admin", tags=["User Management"],
                   dependencies=[Depends(require_admin)])

# 内置角色的显示名（auth.USERS 里的 role 值，不是 _Role 表的 objectId）
BUILTIN_ROLE_LABELS = {
    "admin": "管理员",
    "operator": "运维操作员",
    "viewer": "只读用户",
}


def _role_label(role: str, role_map: dict) -> str:
    """角色显示名：先查 _Role 表，再查内置角色，最后原样回显"""
    if not role:
        return "未分配"
    return role_map.get(role) or BUILTIN_ROLE_LABELS.get(role) or role


def _dept_label(dept: str, dept_map: dict) -> str:
    """部门显示名"""
    if not dept:
        return "未分配"
    return dept_map.get(dept) or dept


# ═══════════════════════════════════════════════════════════
# 用户列表 (含角色+部门信息)
# ═══════════════════════════════════════════════════════════

@router.get("/users")
async def list_users():
    """用户列表 — 以 auth.USERS 为准（**能登录的才是账号**），_User 表补充资料

    ⚠️ 只读 _User 表会漏人：auth.USERS 有 4 个可登录账号（admin/dgiot_dev/
    dgiot/operator），_User 表只有 3 行（无 dgiot_dev）。管理页面必须列出
    「实际能登录的人」，否则改了半天角色，人家照样登不进来 / 照样登得进来。

    角色的**权威值取 auth.USERS** —— 那是 verify_token 之后真正判权限的字段。
    """
    from ..parse_lite import parse_query
    users = parse_query("_User", {"limit": 100})
    roles = parse_query("_Role", {"limit": 100})

    role_map = {r.get("objectId", ""): r.get("name", r.get("objectId", "?"))
                for r in roles.get("results", [])}
    # 部门名映射取**全部** _Role 行 —— 用户可能挂在子部门（prod-dept 挂在 default 下），
    # 只收顶层的话，子部门用户会显示成裸 ID
    dept_map = {r.get("objectId", ""): r.get("name", r.get("objectId", "?"))
                for r in roles.get("results", [])}
    rows = {u.get("username"): u for u in users.get("results", []) if u.get("username")}

    results = []
    for username, d in AUTH_USERS.items():
        row = rows.pop(username, None) or {}
        role = d.get("role", "")
        dept = row.get("department") or d.get("department", "") or ""
        results.append({
            # objectId 供前端定位：优先用 _User 行主键，没有则退回用户名
            "objectId": row.get("objectId") or username,
            "username": username,
            "name": d.get("name", username),
            "desc": d.get("desc", ""),
            "email": row.get("email", "") or "",
            "phone": row.get("phone", "") or "",
            "role": role,
            "role_name": _role_label(role, role_map),
            "department": dept,
            "department_name": _dept_label(dept, dept_map),
            "enabled": d.get("enabled", True),
            "source": d.get("source") or ("auth+parse" if row else "auth"),
            "createdAt": d.get("created") or row.get("createdAt", ""),
            "updatedAt": row.get("updatedAt", ""),
        })

    # _User 表里存在、但登不进来的行（无密码或未登记到 auth.USERS）—— 明确标出来
    for username, row in rows.items():
        results.append({
            "objectId": row.get("objectId") or username,
            "username": username,
            "name": row.get("username", username),
            "desc": "",
            "email": row.get("email", "") or "",
            "phone": row.get("phone", "") or "",
            "role": row.get("role", ""),
            "role_name": _role_label(row.get("role", ""), role_map),
            "enabled": False,
            "source": "parse-only",
            "createdAt": row.get("createdAt", ""),
            "updatedAt": row.get("updatedAt", ""),
        })

    return {"results": results, "count": len(results)}


# ═══════════════════════════════════════════════════════════
# 角色分配
# ═══════════════════════════════════════════════════════════

class RoleAssign(BaseModel):
    role: str = ""


def _find_user(user_id: str):
    """按 objectId 或 username 定位一个可登录账号 —— 返回 (username, 资料dict) 或 (None, None)"""
    if user_id in AUTH_USERS:
        return user_id, AUTH_USERS[user_id]
    from ..parse_lite import parse_get, parse_query
    row = parse_get("_User", user_id)
    if not row:
        # 真列过滤（parse_lite 已修：username 是 _User 的真实列，不再当 JSON 键找）
        hit = parse_query("_User", {"where": json.dumps({"objectId": user_id}), "limit": 1})
        row = (hit.get("results") or [None])[0]
    if row and row.get("username") in AUTH_USERS:
        return row["username"], AUTH_USERS[row["username"]]
    return None, None


@router.put("/users/{user_id}/role")
async def assign_role(user_id: str, body: RoleAssign):
    """为用户分配角色

    ⚠️ 两处都要写：auth.USERS 是权限判定的权威源（下次登录/签发的 token 生效），
    _User 表是 Parse 侧的镜像（管理页展示）。只写一边 = 页面显示改了、权限没改。
    另注：已签发的 JWT 里带着旧 role，要等它过期或重新登录才换过来。
    """
    from ..parse_lite import parse_update
    username, d = _find_user(user_id)
    if not username:
        raise HTTPException(404, "用户不存在")
    d["role"] = body.role

    from ..parse_lite import parse_get, parse_query
    row = parse_get("_User", user_id)
    if not row:
        hit = parse_query("_User", {"where": json.dumps({"username": username}), "limit": 1})
        row = (hit.get("results") or [None])[0]
    if row and row.get("objectId"):
        try:
            parse_update("_User", row["objectId"], {"role": body.role})
        except Exception as e:
            # 镜像写失败不该挡住权限变更 —— 记日志，返回成功但说明
            log.warning("_User 镜像更新失败 %s: %s", username, e)
    return {"status": "ok", "username": username, "role": body.role}


@router.put("/users/{user_id}/department")
async def assign_department(user_id: str, body: RoleAssign):
    """为用户分配部门"""
    from ..parse_lite import parse_update, parse_get, parse_query
    username, _d = _find_user(user_id)
    if not username:
        raise HTTPException(404, "用户不存在")
    row = parse_get("_User", user_id) or {}
    if not row.get("objectId"):
        hit = parse_query("_User", {"where": json.dumps({"username": username}), "limit": 1})
        row = (hit.get("results") or [{}])[0]
    if not row.get("objectId"):
        raise HTTPException(404, "该账号没有 Parse 档案，无法分配部门")
    parse_update("_User", row["objectId"], {"department": body.role})
    return {"status": "ok", "username": username, "department": body.role}


# ═══════════════════════════════════════════════════════════
# 角色树
# ═══════════════════════════════════════════════════════════

@router.get("/roles")
async def list_roles():
    """角色树 — 含父子关系

    ⚠️ _Role 表的父指针列名是 **parent_id**，原代码读 r.get("parent") 恒为空，
    于是每个角色都成了根节点，树永远是平的。别名列是 alias，也不是 desc。
    """
    from ..parse_lite import parse_query
    roles = parse_query("_Role", {"limit": 100})
    users = parse_query("_User", {"limit": 200})

    # 每个角色的实际人数。
    # ⚠️ 要同时看两个字段：
    #   · _User.role       —— admin / operator / viewer 这类**权限**角色
    #   · _User.department —— prod-dept / maint-dept 这类**部门**（也存在 _Role 表里）
    # 只按 role 归并的话，部门行的人数恒为 0，角色页上每个部门都显示「0 人」——
    # 而部门接口（list_departments）按 department 计数，两边对不上会更让人困惑。
    by_role, by_dept = {}, {}
    for u in users.get("results", []):
        r = u.get("role") or ""
        if r:
            by_role[r] = by_role.get(r, 0) + 1
        d = u.get("department") or ""
        if d:
            by_dept[d] = by_dept.get(d, 0) + 1

    # 同一个人可能既是 operator 又在 maint-dept —— 两个名字各自记一次是合理的，
    # 因为它们是两条不同的 _Role 行，本来就在树里各占一个节点。
    counts = dict(by_role)
    for k, v in by_dept.items():
        counts[k] = counts.get(k, 0) + v

    role_map = {}
    for r in roles.get("results", []):
        oid = r.get("objectId", "")
        role_map[oid] = {
            "objectId": oid,
            "name": r.get("name", oid),
            "alias": r.get("alias", oid),
            "parent": r.get("parent_id") or "",
            "desc": r.get("desc", "") or r.get("description", ""),
            "users": r.get("users", []) or [],
            "user_count": counts.get(oid, 0),
            "menus": r.get("menus", []) or [],
            "permissions": r.get("permissions", []) or [],
            "children": [],
        }

    roots = []
    for oid, role in role_map.items():
        parent = role.get("parent")
        if parent and parent in role_map:
            role_map[parent]["children"].append(role)
        else:
            roots.append(role)

    # 内置角色也列出来 —— 它们不在 _Role 表里，但确实是可分配的角色
    for name, label in BUILTIN_ROLE_LABELS.items():
        if name not in role_map:
            roots.append({
                "objectId": name, "name": label, "alias": name, "parent": "",
                "desc": "内置角色（权限判定源：auth.USERS）",
                "users": [], "user_count": counts.get(name, 0),
                "menus": [], "permissions": [], "children": [], "builtin": True,
            })
    return {"results": roots, "count": len(role_map) + len(BUILTIN_ROLE_LABELS)}


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
        "alias": body.name,
        "parent_id": body.parent or None,
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
    """部门树 — _Role 里 parent_id 为空的是顶级（部门/租户）

    原实现只回顶层，`prod-dept` 这类挂在 `default` 下的部门一个都看不到；
    现在整棵树都回，前端用 el-tree / 缩进展示。
    """
    from ..parse_lite import parse_query
    roles = parse_query("_Role", {"limit": 200})
    users = parse_query("_User", {"limit": 300})

    counts = {}
    for u in users.get("results", []):
        d = u.get("department") or ""
        if d:
            counts[d] = counts.get(d, 0) + 1

    nodes = {}
    for r in roles.get("results", []):
        oid = r.get("objectId", "")
        nodes[oid] = {
            "objectId": oid,
            "name": r.get("name", oid),
            "alias": r.get("alias", ""),
            "parent": r.get("parent_id") or "",
            "desc": r.get("desc", ""),
            "user_count": counts.get(oid, 0),
            "children": [],
        }
    roots = []
    for oid, node in nodes.items():
        p = node["parent"]
        if p and p in nodes:
            nodes[p]["children"].append(node)
        else:
            roots.append(node)

    def _total(n):
        return n["user_count"] + sum(_total(c) for c in n["children"])
    for n in roots:
        n["total_user_count"] = _total(n)
    return {"results": roots, "count": len(nodes)}
