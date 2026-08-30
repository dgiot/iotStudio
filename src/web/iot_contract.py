# ============================================================
# IOT 底座轻量契约 API（plugins-base 合并配套）
# GET /api/iot/devices|products|channels → { total, items:[...] }
# 契约定义见仓库根 BASE_PLUGINS.md「契约」节
# ============================================================
import json
import sqlite3
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/api/iot", tags=["iot-contract"])


def _parse_db():
    """parse.db — 与 main.py list_devices 同源"""
    db_path = Path(__file__).resolve().parent.parent.parent / "data" / "parse.db"
    db = sqlite3.connect(str(db_path))
    db.row_factory = sqlite3.Row
    return db


def _read_class(class_name: str) -> list:
    """读取 Parse 类表（objectId + data JSON）"""
    db = _parse_db()
    try:
        rows = db.execute(
            f"SELECT objectId, data FROM {class_name} ORDER BY createdAt DESC"
        ).fetchall()
    except sqlite3.OperationalError:
        rows = []
    db.close()
    return rows


@router.get("/devices")
async def iot_devices():
    """设备台账 — 字段对齐 DeviceView.vue"""
    items = []
    for r in _read_class("Device"):
        d = json.loads(r["data"]) if r["data"] else {}
        online = bool(d.get("online", d.get("status") == "online"))
        items.append({
            "id": d.get("devaddr", r["objectId"]),
            "code": d.get("devaddr", r["objectId"]),
            "name": d.get("name", d.get("device_name", r["objectId"])),
            "type": d.get("devType", d.get("device_type", "")),
            "model": d.get("model", ""),
            "protocol": d.get("protocol", ""),
            "status": d.get("status", "online" if online else "offline"),
            "online": online,
            "location": d.get("location", d.get("install_location", "")),
            "last_active": d.get("last_active", d.get("updatedAt", "")),
        })
    return {"total": len(items), "items": items}


@router.get("/products")
async def iot_products():
    """产品台账 — 字段对齐 ProductView.vue"""
    items = []
    for r in _read_class("Product"):
        d = json.loads(r["data"]) if r["data"] else {}
        items.append({
            "id": r["objectId"],
            "code": d.get("code", r["objectId"]),
            "name": d.get("name", ""),
            "category": d.get("category", d.get("devType", "")),
            "protocol": d.get("protocol", ""),
            "spec": d.get("spec", d.get("model", "")),
            "desc": d.get("desc", d.get("description", "")),
        })
    return {"total": len(items), "items": items}


@router.get("/channels")
async def iot_channels():
    """通道台账 — 字段对齐 ChannelView.vue（数据源 ChannelManager 快照）"""
    from ..channel_registry import ChannelManager
    items = []
    for ch in ChannelManager.list_all():
        items.append({
            "id": ch.get("channel_id", ""),
            "name": ch.get("name", ch.get("channel_id", "")),
            "type": ch.get("cType", ""),
            "protocol": ch.get("protocol", ch.get("cType", "")),
            "transport": ch.get("endpoint", ch.get("transport", "")),
            "status": "running" if ch.get("status") == "running" else ch.get("status", ""),
            "desc": ch.get("desc", ch.get("error", "")),
        })
    return {"total": len(items), "items": items}
