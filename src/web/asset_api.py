"""
资产全生命周期管理 API — 模块5
================================
五级资产层级: 采油厂 → 作业区 → 站库 → 设备组 → 设备
维保记录 + 报废流程 + 资产台账
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone
import json, os, sqlite3

router = APIRouter(prefix="/api/assets", tags=["asset-lifecycle"])

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)))), "data", "asset_lifecycle.db")


def _get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.executescript("""
        CREATE TABLE IF NOT EXISTS asset_tree (
            id TEXT PRIMARY KEY, name TEXT, parent_id TEXT,
            level TEXT, level_name TEXT,      -- level: 0厂/1区/2站/3组/4设备
            device_type TEXT, status TEXT DEFAULT 'active',
            install_date TEXT, location TEXT,
            manufacturer TEXT, model TEXT, sn TEXT,
            created_at TEXT, updated_at TEXT
        );
        CREATE TABLE IF NOT EXISTS maintenance_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_id TEXT, type TEXT,          -- plan/repair/inspect/replace
            description TEXT, cost REAL,
            operator TEXT, result TEXT,
            planned_date TEXT, executed_date TEXT,
            next_date TEXT, status TEXT DEFAULT 'pending',
            created_at TEXT
        );
        CREATE TABLE IF NOT EXISTS scrap_record (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset_id TEXT, reason TEXT,
            scrap_date TEXT, approved_by TEXT,
            disposal_method TEXT, residual_value REAL,
            status TEXT DEFAULT 'pending',
            created_at TEXT
        );
    """)
    db.commit()
    return db


# ═══════════════════════════════════════════
# Pydantic 模型
# ═══════════════════════════════════════════

class AssetCreate(BaseModel):
    id: str
    name: str
    parent_id: str = ""
    level: int = Field(4, ge=0, le=4, description="0厂/1区/2站/3组/4设备")
    level_name: str = "设备"
    device_type: str = ""
    status: str = "active"
    location: str = ""
    manufacturer: str = ""
    model: str = ""
    sn: str = ""

class MaintenanceCreate(BaseModel):
    asset_id: str
    type: str = Field("inspect", description="plan/repair/inspect/replace")
    description: str = ""
    cost: float = 0.0
    operator: str = ""
    result: str = ""
    planned_date: str = ""
    next_date: str = ""

class ScrapCreate(BaseModel):
    asset_id: str
    reason: str = ""
    approved_by: str = ""
    disposal_method: str = "报废回收"
    residual_value: float = 0.0


# ═══════════════════════════════════════════
# 资产树 (五级层级)
# ═══════════════════════════════════════════

@router.get("/tree")
def asset_tree(root_id: str = None, level: int = None):
    """五级资产树: 厂→区→站→组→设备"""
    db = _get_db()
    if root_id:
        rows = db.execute("SELECT * FROM asset_tree WHERE parent_id=? ORDER BY level, name",
                         (root_id,)).fetchall()
    elif level is not None:
        rows = db.execute("SELECT * FROM asset_tree WHERE level=? ORDER BY name",
                         (level,)).fetchall()
    else:
        rows = db.execute("SELECT * FROM asset_tree ORDER BY level, name").fetchall()

    assets = [dict(r) for r in rows]
    db.close()

    # 构建树
    if not root_id and level is None:
        tree = _build_tree(assets)
        return {"tree": tree, "count": len(assets)}

    return {"assets": assets, "count": len(assets)}


def _build_tree(assets: list) -> list:
    """平铺列表 → 嵌套树"""
    children_map = {}
    roots = []
    for a in assets:
        a["children"] = []
        children_map[a["id"]] = a
    for a in assets:
        pid = a.get("parent_id", "")
        if pid and pid in children_map:
            children_map[pid]["children"].append(a)
        else:
            roots.append(a)
    return roots


@router.post("/tree")
def asset_create(body: AssetCreate):
    """创建资产节点"""
    db = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    db.execute("""
        INSERT OR REPLACE INTO asset_tree VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (body.id, body.name, body.parent_id, body.level, body.level_name,
          body.device_type, body.status, "", body.location,
          body.manufacturer, body.model, body.sn, now, now))
    db.commit()
    db.close()
    return {"status": "created", "id": body.id}


@router.delete("/tree/{asset_id}")
def asset_delete(asset_id: str):
    """删除资产节点（含子节点）"""
    db = _get_db()
    # 级联删除
    children = db.execute("SELECT id FROM asset_tree WHERE parent_id=?",
                         (asset_id,)).fetchall()
    for c in children:
        db.execute("DELETE FROM asset_tree WHERE id=?", (c["id"],))
    db.execute("DELETE FROM asset_tree WHERE id=?", (asset_id,))
    db.commit()
    db.close()
    return {"status": "deleted", "cascade": len(children)}


# ═══════════════════════════════════════════
# 维保记录
# ═══════════════════════════════════════════

@router.get("/maintenance/{asset_id}")
def maintenance_list(asset_id: str, limit: int = 50):
    db = _get_db()
    rows = db.execute(
        "SELECT * FROM maintenance_log WHERE asset_id=? ORDER BY created_at DESC LIMIT ?",
        (asset_id, limit)).fetchall()
    db.close()
    return {"asset_id": asset_id, "records": [dict(r) for r in rows]}


@router.post("/maintenance")
def maintenance_create(body: MaintenanceCreate):
    db = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    db.execute("""
        INSERT INTO maintenance_log (asset_id, type, description, cost, operator,
            result, planned_date, next_date, status, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    """, (body.asset_id, body.type, body.description, body.cost,
          body.operator, body.result, body.planned_date, body.next_date,
          "pending", now))
    db.commit()
    rid = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.close()
    return {"status": "created", "id": rid}


@router.put("/maintenance/{record_id}/complete")
def maintenance_complete(record_id: int, result: str = "", next_date: str = ""):
    db = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    db.execute("""
        UPDATE maintenance_log SET status='done', executed_date=?, result=?, next_date=?
        WHERE id=?
    """, (now, result, next_date, record_id))
    db.commit()
    db.close()
    return {"status": "completed", "id": record_id}


# ═══════════════════════════════════════════
# 报废流程
# ═══════════════════════════════════════════

@router.get("/scrap/{asset_id}")
def scrap_list(asset_id: str = None, limit: int = 50):
    db = _get_db()
    if asset_id:
        rows = db.execute(
            "SELECT * FROM scrap_record WHERE asset_id=? ORDER BY created_at DESC LIMIT ?",
            (asset_id, limit)).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM scrap_record ORDER BY created_at DESC LIMIT ?",
            (limit,)).fetchall()
    db.close()
    return {"records": [dict(r) for r in rows]}


@router.post("/scrap")
def scrap_create(body: ScrapCreate):
    db = _get_db()
    now = datetime.now(timezone.utc).isoformat()

    # 更新资产状态为待报废
    db.execute("UPDATE asset_tree SET status='scrapping' WHERE id=?", (body.asset_id,))

    db.execute("""
        INSERT INTO scrap_record (asset_id, reason, scrap_date, approved_by,
            disposal_method, residual_value, status, created_at)
        VALUES (?,?,?,?,?,?,?,?)
    """, (body.asset_id, body.reason, now, body.approved_by,
          body.disposal_method, body.residual_value, "pending", now))
    db.commit()
    rid = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.close()
    return {"status": "created", "id": rid}


@router.put("/scrap/{record_id}/approve")
def scrap_approve(record_id: int):
    db = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    r = db.execute("SELECT asset_id FROM scrap_record WHERE id=?", (record_id,)).fetchone()
    if r:
        db.execute("UPDATE asset_tree SET status='scrapped' WHERE id=?", (r["asset_id"],))
    db.execute("UPDATE scrap_record SET status='approved', scrap_date=? WHERE id=?",
              (now, record_id))
    db.commit()
    db.close()
    return {"status": "approved", "id": record_id}


# ═══════════════════════════════════════════
# 统计看板
# ═══════════════════════════════════════════

@router.get("/dashboard")
def asset_dashboard():
    """资产统计看板"""
    db = _get_db()
    total = db.execute("SELECT COUNT(*) FROM asset_tree").fetchone()[0]
    by_level = {}
    for row in db.execute("SELECT level_name, COUNT(*) as cnt FROM asset_tree GROUP BY level_name"):
        by_level[row["level_name"]] = row["cnt"]

    active_maintenance = db.execute(
        "SELECT COUNT(*) FROM maintenance_log WHERE status='pending'").fetchone()[0]
    active_scrap = db.execute(
        "SELECT COUNT(*) FROM scrap_record WHERE status='pending'").fetchone()[0]

    db.close()
    return {
        "total_assets": total,
        "by_level": by_level,
        "active_maintenance": active_maintenance,
        "active_scrap": active_scrap,
    }


# ═══════════════════════════════════════════
# 批量导入（从A11点位导出）
# ═══════════════════════════════════════════

@router.post("/seed-demo")
def seed_demo_assets():
    """一键播种演示资产数据：100作业区 × 5站 × 4组 × 20设备"""
    db = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    count = 0

    for zone_idx in range(1, 101):
        zone_id = f"zone_{zone_idx:03d}"
        # 作业区
        db.execute("INSERT OR REPLACE INTO asset_tree VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  (zone_id, f"第{zone_idx}作业区", "dqyt_c1", 1, "作业区",
                   "", "active", "", "", "", "", "", now, now))

        for station_idx in range(1, 6):
            station_id = f"{zone_id}_station_{station_idx}"
            db.execute("INSERT OR REPLACE INTO asset_tree VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      (station_id, f"站库{station_idx}", zone_id, 2, "站库",
                       "", "active", "", "", "", "", "", now, now))

            for group_idx in range(1, 5):
                group_id = f"{station_id}_group_{group_idx}"
                db.execute("INSERT OR REPLACE INTO asset_tree VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          (group_id, f"设备组{group_idx}", station_id, 3, "设备组",
                           "", "active", "", "", "", "", "", now, now))

                for dev_idx in range(1, 21):
                    dev_id = f"{group_id}_dev_{dev_idx:02d}"
                    dtype = ["抽油机", "螺杆泵", "注水井", "压缩机", "电表"][dev_idx % 5]
                    db.execute("INSERT OR REPLACE INTO asset_tree VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                              (dev_id, f"{dtype}#{dev_idx:02d}", group_id, 4, "设备",
                               dtype, "active", "", f"大庆采油一厂第{zone_idx}作业区",
                               "大庆油田装备", f"CYJ{zone_idx}-{dev_idx}", f"SN{zone_idx:03d}{dev_idx:03d}",
                               now, now))
                    count += 1

    db.commit()
    db.close()
    return {"status": "seeded", "assets": count,
            "structure": "100区 × 5站 × 4组 × 20设备 = 40,000设备"}
