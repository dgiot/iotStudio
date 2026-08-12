"""诊断设备列表问题 + 修复"""
import sqlite3, json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

db = sqlite3.connect(r'D:\ai\dgiot_lite\data\parse.db')

# 1. Direct SQLite check
print("=== 1. SQLite 直接查询 ===")
rows = db.execute('SELECT objectId, data FROM Device LIMIT 3').fetchall()
for r in rows:
    oid, data_raw = r
    print(f"  {oid}: type={type(data_raw).__name__} null={data_raw is None}")
    if data_raw:
        try:
            d = json.loads(data_raw)
            print(f"    name={d.get('device_name','?')} type={d.get('device_type','?')}")
        except Exception as e:
            print(f"    PARSE ERROR: {e} raw={str(data_raw)[:80]}")

# 2. Direct SQLite query via _row_to_obj
print("\n=== 2. parse_lite _row_to_obj ===")
from parse_db import reset_backend
reset_backend()
from parse_lite import _row_to_obj

for r in rows:
    obj = _row_to_obj(r)
    has_data = any(v for k, v in obj.items() if k not in ('objectId','createdAt','updatedAt'))
    print(f"  {r['objectId']}: data_keys={[k for k in obj if k not in ('objectId','createdAt','updatedAt')]} has_content={has_data}")
    if not has_data:
        print(f"    原始 data 内容: {str(r['data'])[:120] if r['data'] else 'EMPTY'}")

# 3. parse_query
print("\n=== 3. parse_query('Device') ===")
from parse_lite import parse_query
r = parse_query("Device", {"limit": 2})
print(f"  count={r.get('count')}")
for dev in r.get('results',[])[:2]:
    has_data = any(v for k,v in dev.items() if k not in ('objectId','createdAt','updatedAt'))
    print(f"  {dev.get('objectId','?')}: has_fields={has_data}")
    if not has_data:
        print(f"    ALL KEYS: {list(dev.keys())}")

db.close()
print("\n=== 诊断完毕 ===")
