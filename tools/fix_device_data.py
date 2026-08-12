"""修复 Device 表 — 确保 data JSON 字段可被 API 正确解析"""
import sqlite3, json

db = sqlite3.connect(r'D:\ai\dgiot_lite\data\parse.db')

# 检查 Device 表实际内容
rows = db.execute("SELECT objectId, data FROM Device LIMIT 3").fetchall()
print("=== Sample Device rows ===")
for oid, data in rows:
    print(f"  {oid}: type={type(data).__name__}")
    if data:
        try:
            d = json.loads(data) if isinstance(data, str) else data
            print(f"    keys: {list(d.keys())[:6]}")
            print(f"    device_name: {d.get('device_name', 'N/A')}")
            print(f"    device_type: {d.get('device_type', 'N/A')}")
        except Exception as e:
            print(f"    JSON parse error: {e}")
            print(f"    raw: {str(data)[:100]}")
    else:
        print(f"    data is NULL or empty")

# 看看 _row_to_obj 实际收到了什么
print("\n=== Testing _row_to_obj ===")
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))
from parse_db import reset_backend, get_backend
reset_backend()
from parse_lite import parse_query

r = parse_query("Device", {"limit": 2, "skip": 0})
print(f"Count: {r.get('count', 0)}")
for dev in r.get('results', [])[:2]:
    print(f"  objectId={dev.get('objectId', '?')}")
    print(f"  keys: {[k for k in dev.keys() if k not in ('objectId','createdAt','updatedAt')]}")

db.close()
