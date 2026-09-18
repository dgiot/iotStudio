"""多租户管理 API — 租户/岗位**就是** Parse `_Role`（与 dgiot 一致）

★ 2026-09-17 合一（用户裁定「租户系统一套就行」）。本模块原先直连 `local.db` 的
`tenants` / `user_roles` 两张表，而数据面（`auth._resolve_tenant` → JWT → 各处租户
过滤）读的是 Parse 的 `_Role` / `_Join_users_Role`。两个来源并存的**实测**后果：

    local.db `tenants`    = **0 行**   ← 本模块在读 ⇒ 管理端租户列表永远是空的
    local.db `user_roles` = **0 行**   ← 全仓无人读
    Parse   `_Role`       = **6 行**   ← 系统照常按这 6 个租户隔离
    （default / oil-monitor / data-dept / prod-dept / maint-dept / demo-dept）

⇒ 不是「新建的租户看不到」，是**连种子里那 6 个都看不到**。
现在**唯一数据源 = `_Role`**：本模块不写任何 SQL，全部经 `parse_lite` 的 role 函数；
两张本地表退役（`models/device.py` 的 `Tenant` / `UserRole` 已删，旧库里残留的空表无害，
`create_all` 不再建）。

⚠️ 说「唯一数据源」而**不说「唯一写入者」** —— `_Role` 是 Parse 类，写入路径不止一条
（`web/parse_router.py` 的通用 CRUD、`web/user_manager_api.py:270`）。**那不是病**：
同一个源被多个入口写是正常的，两个源各存一份才是病。

⚠️ **返回形状逐字保持** —— 这批端点用户裁为「对外承诺过」，字段名**一个不减**。
    字段映射见 `parse_lite.role_to_api`（含 `id` 为什么等于 `objectId` 的理由）。

⚠️ **依赖方向变了**：这 6 个端点原先「与 Parse/PG 无关」（只读一个本地文件），现在要
    经 `parse_db.get_backend()`。该函数 **PG 优先、SQLite 兜底**（`PARSE_PG_DSN` →
    嵌入式 PG → `data/parse.db`），本机实测走 SQLite 兜底 ⇒ 不引入 PG 硬依赖；
    但 `src/main.py` 那段「这些端点不看任何外部服务脸色」的注释已随之收窄，
    现在只对同在该段的 `log_packet` / `packet_history` 成立。
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_admin
# `_ROLE_DATA_KEYS` 是包内私有约定（下划线 = 不出包），本模块在包内，直接复用 ——
# 不在这里另抄一份业务列清单，那正是「同一事实两处」的起手式。
from ..parse_lite import (
    _ROLE_DATA_KEYS, parse_assign_role, parse_create_role, parse_delete_role,
    parse_get_role, parse_query_roles, parse_update_role, role_to_api,
)

router = APIRouter(tags=["tenants"])


def _all_roles() -> list:
    """全部 `_Role` 行（dict 列表，按 name 排）。

    `_Role` 是几十行量级的字典表，一次全取比逐次查库省事也省连接 ——
    唯一性检查与 parent_name 拼装都在这一份快照上做。
    """
    return parse_query_roles()["results"]


# ---- 租户/岗位 CRUD (≡ DG-IoT /roletemp) ----

@router.get("/api/tenants")
def list_tenants(user=Depends(require_admin)):
    """租户列表 —— 全量 `_Role`，附父租户显示名。

    原实现是 `LEFT JOIN tenants p ON t.parent_id=p.tenant_id` 取 `parent_name`；
    改为在内存里按 objectId 建索引。**`parent_name` 键保持不变** —— 它是唯一
    一个不在 `_Role` 列里的返回字段，最难注意到，也最容易在改写时丢掉。
    """
    rows = _all_roles()
    names = {r.get("objectId"): r.get("name") for r in rows}
    out = []
    for r in rows:
        item = role_to_api(r)
        item["parent_name"] = names.get(item["parent_id"])
        out.append(item)
    # 原 SQL 是 ORDER BY t.created_at DESC；parse_query_roles 按 name 排，
    # 这里补回时间倒序 —— 改实现不该顺手改掉对外顺序。
    out.sort(key=lambda x: x["created_at"] or "", reverse=True)
    return {"tenants": out}


@router.get("/api/roles")
def list_roles():
    """对齐 DG-IoT /roles — **公开可读**（无认证，与改前一致：不收紧也不放宽）"""
    out = []
    for r in _all_roles():
        item = role_to_api(r)
        if item["status"] != "active":        # 原实现是 WHERE status='active'
            continue
        # 键名逐字保持原样：objectId / name / slug / parent
        out.append({"objectId": item["objectId"], "name": item["name"],
                    "slug": item["slug"], "parent": item["parent_id"]})
    return {"roles": out}


@router.post("/api/tenants")
def create_tenant(body: dict, user=Depends(require_admin)):
    """创建租户/岗位 — 对齐 DG-IoT POST /roletemp。落点是 `_Role`。

    这里建出来的租户**当场就是数据面认的租户** —— 这正是合一要解决的问题
    （原先建完在 `_tenant_bundle()` 那条路径上不存在）。
    """
    tid = body.get("tenant_id") or f"t_{uuid.uuid4().hex[:8]}"
    slug = body.get("slug") or tid            # 原实现同款缺省
    name = body.get("name", "")
    for r in _all_roles():
        if r.get("objectId") == tid or r.get("alias") == slug:
            raise HTTPException(400, "租户ID或短标识已存在")
        # `_Role.name` 有 UNIQUE 约束（原 `tenants.name` 没有）⇒ 不先拦就是
        # `parse_create_role` 抛约束错 → 500。原实现这个 400 拦不住它。
        if name and r.get("name") == name:
            raise HTTPException(400, "租户名称已存在")
    parse_create_role({
        "objectId": tid, "name": name, "alias": slug,
        "parent_id": body.get("parent_id"),
        # 只挑业务列进 data —— `data` 里可能还有别的键（实测种子里有
        # desc/department），由 parse_lite 负责**合并**而非覆盖。
        "data": {k: body[k] for k in _ROLE_DATA_KEYS if k in body},
    })
    return {"objectId": tid, "status": "created"}


@router.put("/api/tenants/{tenant_id}")
def update_tenant(tenant_id: str, body: dict, user=Depends(require_admin)):
    """改租户。`slug` → `_Role.alias`；业务列 → `_Role.data`（**合并**，不覆盖）。

    未给的键一律保持原值 —— 原实现也是这么做的（`sets` 只含 body 里出现的键）。
    """
    rows = _all_roles()
    # **存在性先于一切** —— 反过来的话，`PUT /api/tenants/不存在的id` 只要 slug 撞车
    # 就会返 400 而不是 404，而 400 在讲一件与调用方意图无关的事。
    if not any(r.get("objectId") == tenant_id for r in rows):
        raise HTTPException(404, "租户不存在")
    fields = {}
    for k in ("name", "parent_id", "contact", "phone", "status",
              "max_devices", "max_users"):
        if k in body:
            fields[k] = body[k]
    if "slug" in body:
        # `alias` 在表上没有唯一约束（Parse 侧不要求），而退役的 `tenants.slug`
        # 是 UNIQUE ⇒ 唯一性只能在这里守。不守的话 `slug` 会静默变歧义：
        # 同一个短标识指两个租户，而 GET /api/roles 只有 slug 一个索引键。
        for r in rows:
            if r.get("objectId") != tenant_id and r.get("alias") == body["slug"]:
                raise HTTPException(400, "短标识已存在")
        fields["alias"] = body["slug"]
    try:
        # 上面的快照与这里之间理论上可被并发删掉 ⇒ 仍接 None 这一支
        updated = parse_update_role(tenant_id, fields)
    except ValueError as e:
        raise HTTPException(400, str(e))
    if updated is None:
        raise HTTPException(404, "租户不存在")
    return {"objectId": tenant_id, "status": "updated"}


@router.delete("/api/tenants/{tenant_id}")
def delete_tenant(tenant_id: str, user=Depends(require_admin)):
    """删租户，连带清掉它的用户关联行。

    ⚠️ **不存在的 id 仍返 200 `{"status":"deleted"}`，不改成 404** —— 原实现就是这样，
    而 DELETE 的幂等性是对的：调用方要的是「它没了」，重复删不该报错。
    （原实现对不存在 id 的静默成功是**幂等**，不是**漏判** —— 两者形状一样，
    区别在于「本可以做到」：这里做到了。别顺手改成 404 破坏契约。）
    """
    if tenant_id == "default":
        raise HTTPException(400, "不能删除默认租户")
    parse_delete_role(tenant_id)
    return {"status": "deleted"}


# ---- 用户-租户关联 (≡ DG-IoT /roleuser) ----

@router.post("/api/roleuser")
def assign_user_role(body: dict, user=Depends(require_admin)):
    """分配用户到角色 — 对齐 DG-IoT POST /roleuser。

    ⚠️ `user_id` 必须是 **`_User.objectId`**、`tenant_id` 必须是 **`_Role.objectId`**。
    原实现往一张没人读的表里写什么都不被发现；现在写进 `_Join_users_Role`，而
    **那正是 `auth._resolve_tenant` 的取数处** ⇒ 一个错 id 会变成该用户租户解析
    错误，或（更坏）一行永远读不到的记录配一个 `{"status":"assigned"}` 的成功回执。
    存在性由 `parse_assign_role` 核，核不到转 400。
    """
    try:
        return parse_assign_role(body.get("user_id"), body.get("tenant_id"))
    except ValueError as e:
        raise HTTPException(400, str(e))
