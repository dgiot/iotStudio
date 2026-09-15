"""多租户管理 API — 对齐 DG-IoT _Role 模型

表（tenants / user_roles）由 src/main.py 的 lifespan 按 src/models/device.py
的模型建（scripts/seed_tenants.py 走同一个 init_db），库路径取 cfg.sqlite_path
（已在 src/config.py 归一为绝对），故这里直连同一个库 —— 同表必须同源。

原实现是 `from ..main import get_session` + SQLAlchemy 的 `text()`，但**本仓
从未有过 get_session**（全仓无 `def get_session`），6 个端点全部
ImportError ⇒ HTTP 500（/api/roles 实测）。其中 5 个带
`Depends(require_admin)`，认证先拦，所以这个洞只在唯一不带依赖的那个上露面。
"""
import os
import sqlite3
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_admin
from ..config import cfg

router = APIRouter(tags=["tenants"])

# 与 src/main.py 的 log_packet / packet_history 同一个库 —— 原先这里按 __file__
# 拼绝对路径，而那边按 cfg.data_dir 拼（本机是相对值）⇒ 从非仓根 cwd 起服务时
# 两条路读写两个不同的库。cfg.sqlite_path 已在 src/config.py 归一为绝对路径。
DB_PATH = cfg.sqlite_path


def get_db():
    """直连 local.db —— 库与表由 src/main.py 的 lifespan 建（同源事实源）。"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ---- 租户/岗位 CRUD (≡ DG-IoT /roletemp) ----

@router.get("/api/tenants")
def list_tenants(user=Depends(require_admin)):
    db = get_db()
    try:
        rows = db.execute(
            "SELECT t.*, p.name as parent_name FROM tenants t "
            "LEFT JOIN tenants p ON t.parent_id=p.tenant_id ORDER BY t.created_at DESC"
        ).fetchall()
        return {"tenants": [dict(r) for r in rows]}
    finally:
        db.close()


@router.get("/api/roles")
def list_roles():
    """对齐 DG-IoT /roles — 公开可读的角色列表"""
    db = get_db()
    try:
        rows = db.execute(
            "SELECT tenant_id, name, slug, parent_id, status FROM tenants "
            "WHERE status='active' ORDER BY name"
        ).fetchall()
        return {"roles": [{"objectId": r["tenant_id"], "name": r["name"],
                           "slug": r["slug"], "parent": r["parent_id"]} for r in rows]}
    finally:
        db.close()


@router.post("/api/tenants")
def create_tenant(body: dict, user=Depends(require_admin)):
    """创建租户/岗位 — 对齐 DG-IoT POST /roletemp"""
    db = get_db()
    try:
        tid = body.get("tenant_id") or f"t_{uuid.uuid4().hex[:8]}"
        slug = body.get("slug") or tid
        existing = db.execute("SELECT id FROM tenants WHERE tenant_id=:tid OR slug=:slug",
                              {"tid": tid, "slug": slug}).fetchone()
        if existing:
            raise HTTPException(400, "租户ID或短标识已存在")
        db.execute(
            """INSERT INTO tenants (tenant_id, name, slug, parent_id, contact, phone, status, max_devices, max_users, created_at)
               VALUES (:tid, :name, :slug, :pid, :contact, :phone, :status, :max_d, :max_u, :now)""",
            {"tid": tid, "name": body.get("name", ""), "slug": slug, "pid": body.get("parent_id"),
             "contact": body.get("contact", ""), "phone": body.get("phone", ""),
             "status": body.get("status", "active"),
             "max_d": body.get("max_devices", 1000), "max_u": body.get("max_users", 50),
             # sqlite3 只接受 str/int/float/bytes/None —— created_at 是 TEXT 列，
             # 与 seed_tenants.py:41 同格式。
             "now": datetime.utcnow().isoformat()})
        db.commit()
        return {"objectId": tid, "status": "created"}
    finally:
        db.close()


@router.put("/api/tenants/{tenant_id}")
def update_tenant(tenant_id: str, body: dict, user=Depends(require_admin)):
    db = get_db()
    try:
        if not db.execute("SELECT id FROM tenants WHERE tenant_id=:tid",
                          {"tid": tenant_id}).fetchone():
            raise HTTPException(404, "租户不存在")
        fields = ["name", "slug", "parent_id", "contact", "phone", "status", "max_devices", "max_users"]
        sets = [f"{k}=:{k}" for k in fields if k in body]
        if sets:
            params = {k: body[k] for k in fields if k in body}
            params["tid"] = tenant_id
            db.execute(f"UPDATE tenants SET {', '.join(sets)} WHERE tenant_id=:tid", params)
            db.commit()
        return {"objectId": tenant_id, "status": "updated"}
    finally:
        db.close()


@router.delete("/api/tenants/{tenant_id}")
def delete_tenant(tenant_id: str, user=Depends(require_admin)):
    if tenant_id == "default":
        raise HTTPException(400, "不能删除默认租户")
    db = get_db()
    try:
        db.execute("DELETE FROM tenants WHERE tenant_id=:tid", {"tid": tenant_id})
        db.execute("DELETE FROM user_roles WHERE tenant_id=:tid", {"tid": tenant_id})
        db.commit()
        return {"status": "deleted"}
    finally:
        db.close()


# ---- 用户-租户关联 (≡ DG-IoT /roleuser) ----

@router.post("/api/roleuser")
def assign_user_role(body: dict, user=Depends(require_admin)):
    """分配用户到角色 — 对齐 DG-IoT POST /roleuser"""
    db = get_db()
    try:
        db.execute(
            # created_at 必给：模型里是 NOT NULL（src/models/device.py:49），而
            # create_all 生成的 DDL 没有 SQL 层 DEFAULT（SQLAlchemy 的 default=
            # 只在 ORM 侧生效）⇒ 原先这条 INSERT 实测抛
            #   IntegrityError: NOT NULL constraint failed: user_roles.created_at
            # 端点恒 500。格式与 create_tenant 的 created_at 一致。
            "INSERT OR REPLACE INTO user_roles (user_id, tenant_id, is_admin, created_at) "
            "VALUES (:uid, :tid, :admin, :now)",
            {"uid": body.get("user_id"), "tid": body.get("tenant_id"),
             "admin": body.get("is_admin", False),
             "now": datetime.utcnow().isoformat()}
        )
        db.commit()
        return {"status": "assigned"}
    finally:
        db.close()
