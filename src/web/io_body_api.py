"""IO 服务器本体 API — 从 io_server.db 提供结构化数据"""
import sqlite3, os
from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/api/io-body", tags=["IO本体"])

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'io_server.db')

def query_db(table, limit=100):
    try:
        db = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
        c = db.cursor()
        c.execute(f"SELECT * FROM {table} LIMIT ?", (limit,))
        rows = [dict(r) for r in c.fetchall()]
        db.close()
        return rows
    except Exception as e:
        return {"error": str(e)}

@router.get("/servers")
def get_servers():
    return query_db("servers")

@router.get("/processes")
def get_processes():
    return query_db("processes")

@router.get("/data-sources")
def get_data_sources():
    return query_db("data_sources")

@router.get("/dcs")
def get_dcs():
    return query_db("dcs")

@router.get("/rtu")
def get_rtu():
    return query_db("rtu")

@router.get("/ports")
def get_ports():
    return query_db("ports")

@router.get("/protocols")
def get_protocols():
    return query_db("protocols")

@router.get("/opc-tags")
def get_opc_tags():
    return query_db("opc_tags")

@router.get("/s7-tags")
def get_s7_tags():
    return query_db("s7_tags")

@router.get("/wireless")
def get_wireless():
    return query_db("wireless")

@router.get("/events")
def get_events():
    return query_db("events")

@router.get("/scales")
def get_scales():
    return query_db("scales")

@router.get("/routes")
def get_routes():
    return query_db("routes")

@router.get("/summary")
def get_summary():
    """IO 服务器汇总"""
    db = sqlite3.connect(DB_PATH)
    c = db.cursor()
    summary = {}
    for table in ["servers","processes","data_sources","dcs","rtu","ports","protocols","opc_tags","s7_tags","wireless","events"]:
        c.execute(f"SELECT COUNT(*) FROM {table}")
        summary[table] = c.fetchone()[0]
    db.close()
    return summary

@router.get("/ontology")
def get_ontology():
    """获取 IO 服务器本体论 JSON-LD"""
    import json
    path = os.path.join(os.path.dirname(DB_PATH), 'io_ontology.json')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"error": "ontology not built, run build_db.py first"}

@router.get("/info/{server_id}")
def get_server_info(server_id: int):
    """获取单个服务器详情"""
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    c = db.cursor()
    c.execute("SELECT * FROM servers WHERE id=?", (server_id,))
    row = c.fetchone()
    if not row:
        db.close()
        return {"error": "not found"}
    server = dict(row)
    # 获取关联的端口
    c.execute("SELECT * FROM ports WHERE server_id=?", (server_id,))
    server['ports'] = [dict(r) for r in c.fetchall()]
    db.close()
    return server
