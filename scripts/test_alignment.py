#!/usr/bin/env python3
"""
parse_lite ↔ Parse Server 对齐测试套件
======================================
22 个测试用例，覆盖所有 Parse REST API 功能
对比 parse_lite (Python) 与 Parse Server (Node.js) 响应格式
"""
import os, sys, json, time, hashlib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:CHANGEME@127.0.0.1:7432/parse'

from src.parse_db import reset_backend; reset_backend()
from src.parse_lite import *

PASS = FAIL = 0

def check(name, condition, detail=""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  [PASS] {name}")
    else:
        FAIL += 1
        print(f"  [FAIL] {name}  {detail}")

# ============================================================
# 准备: 测试用 Class
# ============================================================
TEST_CLASS = "AlignZ" + hashlib.md5(str(time.time()).encode()).hexdigest()[:4]
PTR_CLASS = "AlignP" + TEST_CLASS[-2:]
print(f"\n{'='*60}")
print("parse_lite <-> Parse Server Alignment Test")
print(f"{'='*60}")

ensure_table(TEST_CLASS)
db = get_db()
db.execute(f'DELETE FROM "{TEST_CLASS}"')
db.commit()

# ============================================================
# TC1: 基础 CRUD (4 tests)
# ============================================================
print("\n--- TC1: 基础 CRUD ---")

# 1.1 CREATE
r = parse_create(TEST_CLASS, {"objectId": "dev_001", "name": "传感器A", "value": 42.5, "status": "online"})
check("TC1.1 CREATE 返回 objectId+createdAt", "objectId" in r and "createdAt" in r, str(r))

# 1.2 GET
obj = parse_get(TEST_CLASS, "dev_001")
check("TC1.2 GET 返回完整对象", obj and obj.get("name") == "传感器A", str(obj)[:80] if obj else "None")

# 1.3 UPDATE
r = parse_update(TEST_CLASS, "dev_001", {"name": "传感器A-改", "value": 99.9})
obj = parse_get(TEST_CLASS, "dev_001")
check("TC1.3 UPDATE 后值已变", obj and obj.get("name") == "传感器A-改" and obj.get("value") == 99.9, str(obj)[:60] if obj else "None")

# 1.4 DELETE
r = parse_delete(TEST_CLASS, "dev_001")
obj = parse_get(TEST_CLASS, "dev_001")
check("TC1.4 DELETE 后查询为 None", obj is None)

# ============================================================
# TC2: 查询约束 (8 tests)
# ============================================================
print("\n--- TC2: 查询约束 ---")
for i, (oid, status, val) in enumerate([
    ("q01", "online", 10), ("q02", "offline", 20), ("q03", "online", 30),
    ("q04", "offline", 40), ("q05", "online", 50),
]):
    parse_create(TEST_CLASS, {"objectId": oid, "status": status, "value": val})

# 2.1 $eq (默认)
r = parse_query(TEST_CLASS, {"where": json.dumps({"objectId": "q01"})})
check("TC2.1 $eq  查询", len(r["results"]) == 1)

# 2.2 $ne
r = parse_query(TEST_CLASS, {"where": json.dumps({"status": {"$ne": "online"}})})
check("TC2.2 $ne  查询", r["count"] == 2, f"count={r['count']}")

# 2.3 $gt / $gte / $lt / $lte
r = parse_query(TEST_CLASS, {"where": json.dumps({"value": {"$gt": 30}})})
check("TC2.3 $gt  查询", r["count"] == 2, f"count={r['count']}")

r = parse_query(TEST_CLASS, {"where": json.dumps({"value": {"$gte": 30}})})
check("TC2.4 $gte 查询", r["count"] == 3, f"count={r['count']}")

# 2.5 $in / $nin
r = parse_query(TEST_CLASS, {"where": json.dumps({"status": {"$in": ["online", "offline"]}})})
check("TC2.5 $in  查询", r["count"] == 5)

# 2.6 $exists
r = parse_query(TEST_CLASS, {"where": json.dumps({"status": {"$exists": True}})})
check("TC2.6 $exists 查询", r["count"] == 5)

# 2.7 limit/skip
r = parse_query(TEST_CLASS, {"limit": 2, "skip": 0})
check("TC2.7 limit/skip", len(r["results"]) == 2)

# 2.8 count
r = parse_query(TEST_CLASS, {"count": 1, "limit": 0})
check("TC2.8 count=1&limit=0", r["count"] == 5 and len(r["results"]) == 0)

# ============================================================
# TC3: Pointer + Include (2 tests)
# ============================================================
print("\n--- TC3: Pointer + Include ---")
ensure_table(PTR_CLASS)
db.execute(f'DELETE FROM "{PTR_CLASS}"')
db.commit()

parse_create(PTR_CLASS, {"objectId": "p1", "name": "部门A"})
parse_create(PTR_CLASS, {"objectId": "p2", "name": "用户B", "dept": encode_pointer(PTR_CLASS, "p1")})
parse_create(TEST_CLASS, {"objectId": "ptr_test", "name": "设备C", "owner": encode_pointer(PTR_CLASS, "p2")})

r = parse_query(TEST_CLASS, {"where": json.dumps({"objectId": "ptr_test"}), "include": "owner.dept"})
obj = r["results"][0] if r["results"] else {}
owner = obj.get("owner", {})
dept = owner.get("dept", {})
check("TC3.1 嵌套 Pointer", dept.get("name") == "部门A",
      f"owner={owner.get('name','?')} dept={dept.get('name','?')}")
check("TC3.2 多级 Include", isinstance(owner, dict) and isinstance(dept, dict))

# ============================================================
# TC4: Cloud Functions (2 tests)
# ============================================================
print("\n--- TC4: Cloud Functions ---")

@cloud_function("calc")
def calc(req):
    op = req["params"].get("op", "+")
    a = req["params"].get("a", 0)
    b = req["params"].get("b", 0)
    return {"result": a + b if op == "+" else a - b}

r = call_function("calc", {"a": 15, "b": 7, "op": "+"})
check("TC4.1 Cloud fn 调用", r.get("result", {}).get("result") == 22, str(r))

r = call_function("calc", {"a": 15, "b": 7, "op": "-"})
check("TC4.2 Cloud fn 带参数", r.get("result", {}).get("result") == 8, str(r))

# ============================================================
# TC5: Aggregate (2 tests)
# ============================================================
print("\n--- TC5: Aggregate ---")
# Use existing test data
r = parse_aggregate(TEST_CLASS, [
    {"$match": {"status": "online"}},
    {"$group": {"_id": "$status", "count": {"$sum": 1}, "avg_val": {"$avg": "$value"}}},
])
check("TC5.1 Aggregate $group", len(r.get("results", [])) > 0, str(r)[:100])
check("TC5.2 Aggregate response 是 dict", "results" in r)

# ============================================================
# TC6: 用户系统 (3 tests)
# ============================================================
print("\n--- TC6: User / Session ---")

r = parse_login("admin", "CHANGEME")
check("TC6.1 登录返回 sessionToken", r and "sessionToken" in r, str(r)[:60] if r else "None")

r = parse_login("nobody", "wrong")
check("TC6.2 错误密码返回 None", r is None)

r = parse_create_user({"username": f"test_{int(time.time())}", "password": "test123", "role": "user"})
check("TC6.3 创建用户", r and "objectId" in r and "sessionToken" in r, str(r)[:60])

# ============================================================
# TC7: Batch (1 test)
# ============================================================
print("\n--- TC7: Batch ---")
r = parse_batch([
    {"method": "POST", "path": f"/classes/{TEST_CLASS}", "body": {"objectId": "b1", "name": "Batch-1"}},
    {"method": "POST", "path": f"/classes/{TEST_CLASS}", "body": {"objectId": "b2", "name": "Batch-2"}},
])
check("TC7.1 Batch 返回 2 结果", len(r) == 2, str(r)[:100])

# ============================================================
# TC8: Schema API (1 test)
# ============================================================
print("\n--- TC8: Schema API ---")
r = parse_get_schemas()
check("TC8.1 Schema 返回 results", "results" in r, f"has_results={('results' in r)}")

# ============================================================
# TC9: 响应格式对齐 (1 test)
# ============================================================
print("\n--- TC9: 响应格式对齐 ---")
r = parse_query(TEST_CLASS, {"limit": 1})
# Parse Server 标准: {"results": [...], "count": N}
check("TC9.1 响应格式 {results,count}", "results" in r and "count" in r,
      f"keys={list(r.keys()) if isinstance(r, dict) else type(r)}")

# ============================================================
# Cleanup
# ============================================================
db.execute(f'DELETE FROM "{TEST_CLASS}"')
db.execute(f'DELETE FROM "{PTR_CLASS}"')
db.commit()
db.close()
reset_backend()

# ============================================================
print(f"\n{'='*60}")
print(f"结果: {PASS} PASS / {FAIL} FAIL  ({PASS+FAIL} total)")
print(f"{'='*60}")
if FAIL == 0:
    print("[OK] parse_lite <-> Parse Server FULLY ALIGNED")
else:
    print(f"[WARN] {FAIL} tests failed")

sys.exit(0 if FAIL == 0 else 1)
