#!/usr/bin/env python3
"""RTDB Tag ID 全量扫描 — 子进程隔离 + 限流控制"""
import subprocess, time, sys, json, re
from datetime import datetime

PY32 = r"C:\Python311-32\python.exe"
TOOL = r"D:\ai\dgiot_lite\tools\rtdb_collector.py"
WAIT = int(sys.argv[1]) if len(sys.argv) > 1 else 30
START = int(sys.argv[2]) if len(sys.argv) > 2 else 1
END = int(sys.argv[3]) if len(sys.argv) > 3 else 20000
STEP = int(sys.argv[4]) if len(sys.argv) > 4 else 500

all_tags = {}
errors = 0
total = ((END - START) // STEP) + 1

print(f"Scan: {START}-{END} step={STEP} wait={WAIT}s ({total} batches)")
print(f"Start: {datetime.now().strftime('%H:%M:%S')}")
print()

for i, base in enumerate(range(START, END + 1, STEP)):
    ids = f"{base},{base+1},{base+2}" if base + 2 <= END else str(base)
    try:
        r = subprocess.run(
            [PY32, TOOL, "--ids", ids],
            capture_output=True, text=True, timeout=20,
            cwd=r"D:\ai\dgiot_lite"
        )
        # Parse output: "5000           1.8750     2026-07-13T20:13:52    GOOD"
        for line in r.stdout.splitlines():
            m = re.match(r'(\d+)\s+([\d.-]+)\s+(\S+)\s+(\w+)', line.strip())
            if m:
                tid = int(m.group(1))
                val = float(m.group(2))
                ts = m.group(3)
                qual = m.group(4)
                if abs(val) > 0.001:
                    all_tags[tid] = (val, ts, qual)

        n = len(all_tags)
        pct = (i + 1) * 100 / total
        ts = datetime.now().strftime('%H:%M:%S')
        print(f"[{ts}] {pct:5.1f}%  batch {i+1}/{total}  tags={n}  errors={errors}", end="")
        if n > 0:
            last = sorted(all_tags.keys())[-1]
            print(f"  last={last}={all_tags[last][0]:.4f}", end="")
        print()

    except subprocess.TimeoutExpired:
        errors += 1
        print(f"[{datetime.now().strftime('%H:%M:%S')}] TIMEOUT @ {base}")
    except Exception as e:
        errors += 1
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: {e}")

    if base + STEP <= END:
        time.sleep(WAIT)

# Save results
out_file = f"D:/ai/dgiot_lite/logs/tag_map_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
with open(out_file, "w") as f:
    json.dump({str(k): list(v) for k, v in sorted(all_tags.items())}, f, indent=2)

print(f"\nDone: {len(all_tags)} active tags found")
print(f"Saved: {out_file}")
if all_tags:
    ids = sorted(all_tags.keys())
    print(f"Range: {min(ids)}-{max(ids)}")
    print(f"Values: {min(v for v,_,_ in all_tags.values()):.4f}-{max(v for v,_,_ in all_tags.values()):.4f}")
