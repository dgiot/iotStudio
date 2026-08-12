"""Test PostgreSQL backend end-to-end"""
import os, sys
sys.path.insert(0, '.')
os.environ['PARSE_DB'] = 'postgres'

from src.parse_db import get_backend, get_db_compat, reset_backend
reset_backend()
be = get_backend()
print(f'Backend: {type(be).__name__}')

# CRUD test
be.create_table('test_pg', 'id TEXT PRIMARY KEY, name TEXT, val REAL, tags TEXT')
print('[1] create_table OK')
be.execute('INSERT INTO test_pg(id,name,val,tags) VALUES(%s,%s,%s,%s)', ('d1','Device A',42.5,'{"loc":"CY1"}'))
print('[2] INSERT OK')
row = be.fetchone('SELECT * FROM test_pg WHERE id=%s', ('d1',))
print(f'[3] Query: id={row["id"]} name={row["name"]} val={row["val"]}')
be.execute('DROP TABLE test_pg')
print('[4] DROP OK')

# parse_lite init on PG
from src.parse_lite import init_db
init_db()
be2 = get_backend()
tables = be2.fetchall("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' ORDER BY tablename")
print(f'[5] PG tables after init: {len(tables)}')
for t in tables[:12]:
    print(f'    {t["tablename"]}')

# parse_lite CRUD via wrapper
db = get_db_compat()
db.execute('SELECT count(*) as c FROM _User')
row = db.fetchone()
print(f'[6] Users via wrapper: {row["c"]}')

reset_backend()
print('=== ALL TESTS PASS ===')
