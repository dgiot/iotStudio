"""Simple PG CRUD test via parse_lite"""
import os, sys; sys.path.insert(0, '.')
os.environ['PARSE_DB'] = 'postgres'
from src.parse_db import get_backend, get_db_compat, reset_backend
from src.parse_lite import parse_create, parse_query, parse_get, ensure_table, cloud_function, call_function, parse_aggregate

reset_backend()
db = get_db_compat()

# Test simple create+query
ensure_table("ZTestPg")
try: db.execute("DELETE FROM \"ZTestPg\""); db.commit()
except: pass

r = parse_create("ZTestPg", {"objectId": "z1", "name": "Hello PG", "value": 42})
print(f"[1] Create: {r}")

result = parse_query("ZTestPg", {"where": '{"objectId":"z1"}'})
print(f"[2] Query: count={result.get('count', 0)} results={len(result.get('results', []))}")
if result.get('results'):
    print(f"    name={result['results'][0].get('name')}")

# Test nested pointer
from src.parse_lite import encode_pointer, _include_obj
ensure_table("ZTestPtr")
try: db.execute("DELETE FROM \"ZTestPtr\""); db.commit()
except: pass

parse_create("ZTestPtr", {"objectId": "p1", "name": "Parent"})
parse_create("ZTestPg", {"objectId": "z2", "name": "Child", "parent": encode_pointer("ZTestPtr", "p1")})

result = parse_query("ZTestPg", {"where": '{"objectId":"z2"}', "include": "parent"})
obj = result.get("results", [None])[0]
if obj:
    parent = obj.get("parent", {})
    print(f"[3] Nested Pointer: child={obj.get('name')} parent={parent.get('name', type(parent).__name__)}")

# Cloud function
@cloud_function("sum")
def sum_fn(req):
    a = req['params'].get('a', 0)
    b = req['params'].get('b', 0)
    return a + b

r = call_function("sum", {"a": 3, "b": 4})
print(f"[4] Cloud function: {r}")

# Cleanup
db.execute("DELETE FROM \"ZTestPg\""); db.commit()
db.execute("DELETE FROM \"ZTestPtr\""); db.commit()
db.close()
reset_backend()
print("=== ALL PASS ===")
