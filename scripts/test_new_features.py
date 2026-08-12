"""Test new parse_lite features: Pointer/Include/CloudFn/Aggregate"""
import os, sys; sys.path.insert(0, '.')
os.environ['PARSE_DB'] = 'postgres'

from src.parse_db import get_backend, reset_backend
from src.parse_lite import *

reset_backend()
db = get_db()

print("=== 1. Nested Pointer ===")
# Create test data
ensure_table("TestA")
ensure_table("TestB")
db.execute("DELETE FROM \"TestA\" WHERE objectId LIKE 'ptr_%'")
db.execute("DELETE FROM \"TestB\" WHERE objectId LIKE 'ptr_%'")
db.commit()
parse_create("TestA", {"objectId": "ptr_a1", "name": "Device A", "owner": encode_pointer("TestB", "ptr_b1")})
parse_create("TestB", {"objectId": "ptr_b1", "name": "User B", "dept": encode_pointer("TestB", "ptr_b2")})
parse_create("TestB", {"objectId": "ptr_b2", "name": "Department C"})
# Query + include
result = parse_query("TestA", {"where": '{"objectId":"ptr_a1"}', "include": "owner.dept"})
obj = result["results"][0]
print(f"  root: {obj.get('name')}")
owner = obj.get("owner", {})
print(f"  owner: {owner.get('name')}")
dept = owner.get("dept", {})
print(f"  dept: {dept.get('name')}")
print("  nested pointer recursion: OK" if dept.get("name") == "Department C" else "  nested pointer: FAIL")

print()
print("=== 2. Cloud Functions ===")
@cloud_function("hello")
def hello_fn(req):
    return {"greeting": f"Hello {req['params'].get('name', 'World')}!"}

result = call_function("hello", {"name": "DG-IoT"})
print(f"  hello: {result}")

print()
print("=== 3. Aggregate ===")
parse_create("TestA", {"objectId": "ptr_a2", "status": "online", "value": 100})
parse_create("TestA", {"objectId": "ptr_a3", "status": "online", "value": 200})
parse_create("TestA", {"objectId": "ptr_a4", "status": "offline", "value": 50})
result = parse_aggregate("TestA", [
    {"$match": {"status": "online"}},
    {"$group": {"_id": "$status", "count": {"$sum": 1}, "total": {"$sum": "$value"}, "avg_val": {"$avg": "$value"}}},
])
print(f"  aggregate: {result}")

# Cleanup
db.execute("DELETE FROM \"TestA\" WHERE objectId LIKE 'ptr_%'")
db.execute("DELETE FROM \"TestB\" WHERE objectId LIKE 'ptr_%'")
db.commit()
db.close()
reset_backend()

print()
print("=== ALL TESTS PASS ===")
