#!/usr/bin/env python3
"""
parse_lite (:1334) vs Node.js Parse Server (:1337) — 基准测试
=============================================================
同一请求 → 两个服务 → 对比响应时间 + 正确性
"""
import requests, json, time, statistics

PY_URL  = "http://127.0.0.1:1334/parse"
PS_URL  = "http://127.0.0.1:1337/parse"
PS_HEADERS = {
    "X-Parse-Application-Id": "ddc9ac052450367e4a03c4056c21bff8",
    "X-Parse-Master-Key": "b59551ab147d580a84272044b2139fbd",
    "Content-Type": "application/json",
}
TBL = "Bench_" + hex(int(time.time()))[-4:]

def bench(name, method, path, data=None, params=None, rounds=20):
    """对两个服务同时跑基准测试"""
    p_url = PY_URL + path
    s_url = PS_URL + path
    p_times, s_times = [], []
    p_errs, s_errs = 0, 0

    for _ in range(rounds):
        # parse_lite
        t0 = time.perf_counter()
        try:
            if method == "GET":
                r = requests.get(p_url, params=params, timeout=5)
            else:
                r = requests.post(p_url, json=data, timeout=5)
            p_times.append(time.perf_counter() - t0)
            if r.status_code >= 400: p_errs += 1
        except:
            p_errs += 1

        # Parse Server
        t0 = time.perf_counter()
        try:
            if method == "GET":
                r = requests.get(s_url, params=params, headers=PS_HEADERS, timeout=5)
            else:
                r = requests.post(s_url, json=data, headers=PS_HEADERS, timeout=5)
            s_times.append(time.perf_counter() - t0)
            if r.status_code >= 400: s_errs += 1
        except:
            s_errs += 1

    p_avg = statistics.mean(p_times) * 1000 if p_times else 0
    s_avg = statistics.mean(s_times) * 1000 if s_times else 0
    ratio = f"{p_avg/s_avg:.1f}x" if s_avg > 0 else "N/A"
    status = "OK" if p_errs == 0 else f"{p_errs}errs"

    print(f"  {name:20s} | py={p_avg:6.1f}ms | ps={s_avg:6.1f}ms | ratio={ratio:>6s} | {status}")
    return {"name": name, "py_ms": round(p_avg, 1), "ps_ms": round(s_avg, 1), "py_errs": p_errs}

# ============================================================
print(f"\n{'='*70}")
print(f"parse_lite :1334  vs  Parse Server :1337  —  基准测试 ({TBL})")
print(f"{'='*70}")

# 1. Health
print("\n--- 基础 ---")
bench("health", "GET", "/health")

# 2. CRUD
print("\n--- CRUD ---")
# Create
data = {"objectId": "b1", "name": "bench-test", "value": 42}
r = requests.post(PY_URL + f"/classes/{TBL}", json=data)
if r.status_code < 400:
    # Read
    bench("GET by ID", "GET", f"/classes/{TBL}/b1")
    # Query
    bench("query (full)", "GET", f"/classes/{TBL}", params={"limit": 50})
    bench("query (where)", "GET", f"/classes/{TBL}", params={"where": json.dumps({"name": "bench-test"})})
    bench("query (gt)", "GET", f"/classes/{TBL}", params={"where": json.dumps({"value": {"$gt": 0}})})
    # Update
    bench("update", "POST", f"/classes/{TBL}/b1", data={"value": 99})
    # Count
    bench("count", "GET", f"/classes/{TBL}", params={"count": 1, "limit": 0})

# 3. Login
print("\n--- 认证 ---")
bench("login", "GET", "/login", params={"username": "admin", "password": "admin123"})

# 4. Batch
print("\n--- 批量 ---")
bench("batch", "POST", "/batch", data={"requests": [
    {"method": "POST", "path": f"/classes/{TBL}", "body": {"name": "batch-1"}},
    {"method": "POST", "path": f"/classes/{TBL}", "body": {"name": "batch-2"}},
]})

# 5. Schema
print("\n--- Schema ---")
bench("schemas", "GET", "/schemas")

# Cleanup
requests.delete(PY_URL + f"/classes/{TBL}", json={})

print(f"\n{'='*70}")
print("测试完成 — parse_lite :1334 vs Parse Server :1337 共用 PG :7432")
print(f"{'='*70}")
