"""多租户管理 API — 对齐 DG-IoT _Role 模型"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text

from ..auth import get_current_user, require_admin

router = APIRouter(tags=["tenants"])


def get_db():
    from ..main import get_session
    return next(get_session())


# ---- 租户/岗位 CRUD (≡ DG-IoT /roletemp) ----

@router.get("/api/tenants")
def list_tenants(user=Depends(require_admin)):
    db = get_db()
    rows = db.execute(text(
        "SELECT t.*, p.name as parent_name FROM tenants t LEFT JOIN tenants p ON t.parent_id=p.tenant_id ORDER BY t.created_at DESC"
    )).fetchall()
    return {"tenants": [dict(r) for r in rows]}


@router.get("/api/roles")
def list_roles():
    """对齐 DG-IoT /roles — 公开可读的角色列表"""
    db = get_db()
    rows = db.execute(text("SELECT tenant_id, name, slug, parent_id, status FROM tenants WHERE status='active' ORDER BY name")).fetchall()
    return {"roles": [{"objectId": r.tenant_id, "name": r.name, "slug": r.slug, "parent": r.parent_id} for r in rows]}


@router.post("/api/tenants")
def create_tenant(body: dict, user=Depends(require_admin)):
    """创建租户/岗位 — 对齐 DG-IoT POST /roletemp"""
    db = get_db()
    tid = body.get("tenant_id") or f"t_{uuid.uuid4().hex[:8]}"
    slug = body.get("slug") or tid
    existing = db.execute(text("SELECT id FROM tenants WHERE tenant_id=:tid OR slug=:slug"), {"tid": tid, "slug": slug}).fetchone()
    if existing:
        raise HTTPException(400, "租户ID或短标识已存在")
    db.execute(
        text("""INSERT INTO tenants (tenant_id, name, slug, parent_id, contact, phone, status, max_devices, max_users, created_at)
                VALUES (:tid, :name, :slug, :pid, :contact, :phone, :status, :max_d, :max_u, :now)"""),
        {"tid": tid, "name": body.get("name", ""), "slug": slug, "pid": body.get("parent_id"),
         "contact": body.get("contact", ""), "phone": body.get("phone", ""),
         "status": body.get("status", "active"),
         "max_d": body.get("max_devices", 1000), "max_u": body.get("max_users", 50),
         "now": datetime.utcnow()})
    db.commit()
    return {"objectId": tid, "status": "created"}


@router.put("/api/tenants/{tenant_id}")
def update_tenant(tenant_id: str, body: dict, user=Depends(require_admin)):
    db = get_db()
    if not db.execute(text("SELECT id FROM tenants WHERE tenant_id=:tid"), {"tid": tenant_id}).fetchone():
        raise HTTPException(404, "租户不存在")
    fields = ["name", "slug", "parent_id", "contact", "phone", "status", "max_devices", "max_users"]
    sets = [f"{k}=:{k}" for k in fields if k in body]
    if sets:
        params = {k: body[k] for k in fields if k in body}
        params["tid"] = tenant_id
        db.execute(text(f"UPDATE tenants SET {', '.join(sets)} WHERE tenant_id=:tid"), params)
        db.commit()
    return {"objectId": tenant_id, "status": "updated"}


@router.delete("/api/tenants/{tenant_id}")
def delete_tenant(tenant_id: str, user=Depends(require_admin)):
    if tenant_id == "default":
        raise HTTPException(400, "不能删除默认租户")
    db = get_db()
    db.execute(text("DELETE FROM tenants WHERE tenant_id=:tid"), {"tid": tenant_id})
    db.execute(text("DELETE FROM user_roles WHERE tenant_id=:tid"), {"tid": tenant_id})
    db.commit()
    return {"status": "deleted"}


# ---- 用户-租户关联 (≡ DG-IoT /roleuser) ----

@router.get("/api/tenants/my")
def my_tenants(user=Depends(get_current_user)):
    """获取当前用户的租户列表 — 对齐 DG-IoT /roleuser?user_id=xxx"""
    db = get_db()
    rows = db.execute(text(
        "SELECT t.tenant_id, t.name, t.slug, ur.is_admin FROM tenants t "
        "JOIN user_roles ur ON t.tenant_id = ur.tenant_id "
        "WHERE ur.user_id = :uid AND t.status = 'active' ORDER BY t.name"
    ), {"uid": getattr(user, "user_id", "default")}).fetchall()
    if not rows:
        rows = db.execute(text("SELECT tenant_id, name, slug FROM tenants WHERE tenant_id='default'")).fetchall()
    return {"tenants": [dict(r) for r in rows], "current": getattr(user, "tenant_id", "default")}


@router.post("/api/roleuser")
def assign_user_role(body: dict, user=Depends(require_admin)):
    """分配用户到角色 — 对齐 DG-IoT POST /roleuser"""
    db = get_db()
    db.execute(
        text("INSERT OR REPLACE INTO user_roles (user_id, tenant_id, is_admin) VALUES (:uid, :tid, :admin)"),
        {"uid": body.get("user_id"), "tid": body.get("tenant_id"), "admin": body.get("is_admin", False)}
    )
    db.commit()
    return {"status": "assigned"}
