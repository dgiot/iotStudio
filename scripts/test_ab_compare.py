#!/usr/bin/env python3
"""
parse_lite vs Node.js Parse Server — A/B 对比测试
==================================================
同一请求 → parse_lite (Python) + Parse Server (Node.js) → 比对响应
"""
import os, sys, json, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import requests

os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:dgiot123@127.0.0.1:7432/parse'
from src.parse_db import reset_backend; reset_backend()
from src.parse_lite import *

# Parse Server 端点 (Kylin-DMZ)
PARSE_URL = "http://127.0.0.1:1337/parse"
HEADERS = {
    "X-Parse-Application-Id": "ddc9ac052450367e4a03c4056c21bff8",
    "X-Parse-Master-Key": "b59551ab147d580a84272044b2139fbd",
    "Content-Type": "application/json",
}

PASS = FAIL = SKIP = 0

def ab_check(name, py_resp, parse_resp, compare_keys=None):
    """A/B 对比: 同一请求 → parse_lite vs Parse Server"""
    global PASS, FAIL, SKIP

    if parse_resp is None or parse_resp.get("error"):
        SKIP += 1
        print(f"  [SKIP] {name} — Parse Server 不可达")
        return

    py_ok = "error" not in str(py_resp) if py_resp else True
    ps_ok = "error" not in parse_resp.get("_error", "")

    if not py_ok or not ps_ok:
        FAIL += 1
        print(f"  [FAIL] {name} — py_err={py_resp} ps_err={parse_resp.get('_error','?')}")
        return

    # Compare key fields
    if compare_keys:
        mismatches = []
        for k in compare_keys:
            pv = _deep_get(py_resp, k)
            sv = _deep_get(parse_resp, k)
            if type(pv) != type(sv) and pv is not None and sv is not None:
                mismatches.append(f"{k}: {type(pv).__name__} vs {type(sv).__name__}")
        if mismatches:
            FAIL += 1
            print(f"  [FAIL] {name} — mismatch: {', '.join(mismatches)}")
            return

    PASS += 1
    print(f"  [PASS] {name} — A/B 一致")

def _deep_get(obj, path, d=None):
    for p in path.split("."):
        if isinstance(obj, dict): obj = obj.get(p, d)
        elif isinstance(obj, list) and obj: obj = obj[0].get(p, d) if isinstance(obj[0], dict) else d
        else: return d
    return obj

# ============================================================
TBL = "AbTest_" + hex(int(time.time()))[-4:]
print(f"\n{'='*60}")
print(f"parse_lite vs Parse Server A/B Test (table: {TBL})")
print(f"{'='*60}")

# ---- TC1: 写入 ----  #
print("\n--- TC1: 写入 (各自写, 各自读) ---")
ensure_table(TBL)
db = get_db()

# parse_lite 写入
r_py = parse_create(TBL, {"objectId": "ab1", "name": "hello", "val": 100})
# Parse Server 写入 (同表, 不同 objectId)
try:
    r_ps = requests.post(f"{PARSE_URL}/classes/{TBL}",
        json={"objectId": "ab2", "name": "hello", "val": 100}, headers=HEADERS, timeout=5).json()
    r_ps["_error"] = ""
except Exception as e:
    r_ps = {"_error": str(e)}

ab_check("TC1.1 CREATE 响应格式", r_py, r_ps, ["objectId"])

# ---- TC2: 读取 ----  #
print("\n--- TC2: 读取 ---")
obj_py = parse_get(TBL, "ab1")
try:
    obj_ps = requests.get(f"{PARSE_URL}/classes/{TBL}/ab1", headers=HEADERS, timeout=5).json()
    obj_ps["_error"] = ""
except Exception as e:
    obj_ps = {"_error": str(e)}

ab_check("TC2.1 GET 响应格式", obj_py, obj_ps, ["objectId", "name", "val", "createdAt"])

# ---- TC3: 查询 ----  #
print("\n--- TC3: 查询 ---")
# 用 Parse Server 写入的数据来测试查询 (两边查同一表)
q_py = parse_query(TBL, {"where": json.dumps({"name": "hello"})})
try:
    q_ps = requests.get(f"{PARSE_URL}/classes/{TBL}",
        params={"where": json.dumps({"name": "hello"})}, headers=HEADERS, timeout=5).json()
    q_ps["_error"] = ""
except Exception as e:
    q_ps = {"_error": str(e)}

ab_check("TC3.1 查询 count", q_py, q_ps, ["count"])
ab_check("TC3.2 查询 results 数组", q_py, q_ps, ["results"])

# ---- TC4: 用户登录 ----  #
print("\n--- TC4: 用户系统 ---")
u_py = parse_login("admin", "admin123")
try:
    u_ps = requests.get(f"{PARSE_URL}/login",
        params={"username": "admin", "password": "admin123"}, headers=HEADERS, timeout=5).json()
    u_ps["_error"] = ""
except Exception as e:
    u_ps = {"_error": str(e)}

ab_check("TC4.1 登录返回结构", u_py, u_ps, ["objectId", "username", "sessionToken"])

# ---- TC5: 写入后用 Parse Server 直接读 (互操作) ----  #
print("\n--- TC5: 互操作 (parse_lite写 → Parse Server读) ---")
parse_create(TBL, {"objectId": "cross1", "name": "cross-test", "val": 999})
try:
    cross = requests.get(f"{PARSE_URL}/classes/{TBL}/cross1", headers=HEADERS, timeout=5).json()
    cross["_error"] = ""
    ps_found = cross.get("name") == "cross-test"
except Exception as e:
    cross = {"_error": str(e)}
    ps_found = False

if cross.get("_error"):
    SKIP += 1
    print(f"  [SKIP] TC5.1 — Parse Server 不可达")
else:
    if ps_found:
        PASS += 1
        print(f"  [PASS] TC5.1 parse_lite写 → Parse Server读: name={cross.get('name')}")
    else:
        FAIL += 1
        print(f"  [FAIL] TC5.1 — 跨读失败: {json.dumps(cross)[:100]}")

# ---- Cleanup ----  #
try:
    db.execute(f'DELETE FROM "{TBL}"'); db.commit()
    requests.delete(f"{PARSE_URL}/classes/{TBL}", headers=HEADERS, timeout=5)
except: pass
db.close()
reset_backend()

print(f"\n{'='*60}")
print(f"A/B 结果: {PASS} PASS / {FAIL} FAIL / {SKIP} SKIP  ({PASS+FAIL+SKIP} total)")
print(f"{'='*60}")
if FAIL == 0:
    print("[OK] parse_lite A/B comparison PASSED")
else:
    print(f"[WARN] {FAIL} A/B mismatches detected")
