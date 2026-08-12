#!/usr/bin/env python3
"""
parse_lite 独立服务 — Parse 兼容 REST API :1334
================================================
对标 Node.js Parse Server :1337
共享同一 PG 数据库, 可并行运行做 A/B 对比
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:YOUR_PG_PASSWORD@127.0.0.1:7432/parse'

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import uvicorn, json

from src.parse_lite import *

app = FastAPI(title="parse_lite", version="1.0")

# ── CRUD ──
@app.get("/parse/classes/{class_name}")
def query(class_name: str, where: str = "{}", order: str = "-createdAt",
          limit: int = 100, skip: int = 0, keys: str = "", include: str = "",
          count: int = 0):
    return parse_query(class_name, {"where": where, "order": order,
        "limit": limit, "skip": skip, "keys": keys, "include": include, "count": count})

@app.post("/parse/classes/{class_name}")
async def create(class_name: str, request: Request):
    return parse_create(class_name, await request.json())

@app.get("/parse/classes/{class_name}/{oid}")
def get_one(class_name: str, oid: str):
    obj = parse_get(class_name, oid)
    if not obj: raise HTTPException(404, "Not found")
    return obj

@app.put("/parse/classes/{class_name}/{oid}")
async def update(class_name: str, oid: str, request: Request):
    return parse_update(class_name, oid, await request.json())

@app.delete("/parse/classes/{class_name}/{oid}")
def delete(class_name: str, oid: str):
    return parse_delete(class_name, oid)

# ── Auth ──
@app.get("/parse/login")
def login(username: str, password: str):
    r = parse_login(username, password)
    if not r: raise HTTPException(401, "Invalid credentials")
    return r

@app.post("/parse/logout")
async def logout(request: Request):
    body = await request.json()
    parse_logout(body.get("sessionToken", ""))
    return {}

# ── Batch / Schemas / Health ──
@app.post("/parse/batch")
async def batch(request: Request):
    body = await request.json()
    return parse_batch(body.get("requests", []))

@app.get("/parse/schemas")
def schemas(): return parse_get_schemas()

@app.get("/parse/health")
def health(): return {"status": "ok", "server": "parse_lite", "db": "PG"}

# ── Aggregate / Cloud Functions ──
@app.post("/parse/aggregate/{class_name}")
async def aggregate(class_name: str, request: Request):
    return parse_aggregate(class_name, (await request.json()).get("pipeline", []))

@app.post("/parse/functions/{name}")
async def cloud_fn(name: str, request: Request):
    return call_function(name, await request.json())

if __name__ == "__main__":
    print("parse_lite :1334 — sharing PG with Parse Server :1337")
    uvicorn.run(app, host="0.0.0.0", port=1334, log_level="info")
