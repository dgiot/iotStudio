"""Test all new parse_lite features on SQLite"""
import os, sys; sys.path.insert(0, '.')
os.environ['PARSE_DB'] = 'sqlite'
from src.parse_db import reset_backend; reset_backend()
from src.parse_lite import *

db = get_db()

# 1. Cloud Functions
@cloud_function('add')
def add(req): return req['params']['a'] + req['params']['b']
r = call_function('add', {'a': 10, 'b': 20})
print(f'[1] Cloud fn: add(10,20) = {r["result"]}')

# 2. Nested Pointer + Multi-level Include
ensure_table('T1'); ensure_table('T2'); ensure_table('T3')
db.execute('DELETE FROM T1'); db.execute('DELETE FROM T2'); db.execute('DELETE FROM T3'); db.commit()
parse_create('T3', {'objectId': 'c1', 'name': 'Department', 'code': 'D001'})
parse_create('T2', {'objectId': 'b1', 'name': 'User', 'dept': encode_pointer('T3', 'c1')})
parse_create('T1', {'objectId': 'a1', 'name': 'Device', 'owner': encode_pointer('T2', 'b1')})
result = parse_query('T1', {'where': '{"objectId":"a1"}', 'include': 'owner.dept'})
obj = result['results'][0]
owner = obj.get('owner', {})
dept = owner.get('dept', {})
print(f'[2] Nested Include: {obj["name"]} → {owner.get("name","?")} → {dept.get("name","?")} ({dept.get("code","?")})')

# 3. Aggregate
parse_create('T1', {'objectId': 'a2', 'status': 'online', 'val': 100})
parse_create('T1', {'objectId': 'a3', 'status': 'online', 'val': 200})
parse_create('T1', {'objectId': 'a4', 'status': 'offline', 'val': 50})
r = parse_aggregate('T1', [
    {'$match': {'status': 'online'}},
    {'$group': {'_id': '$status', 'cnt': {'$sum': 1}, 'total': {'$sum': '$val'}}},
])
print(f'[3] Aggregate: {r["results"]}')

# 4. Cloud function list
print(f'[4] Functions: {list(_cloud_functions.keys())}')

# Cleanup
db.execute('DELETE FROM T1'); db.execute('DELETE FROM T2'); db.execute('DELETE FROM T3'); db.commit()
db.close(); reset_backend()
print('=== ALL 4 TESTS PASS ===')
