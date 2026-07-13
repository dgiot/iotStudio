"""Minimal PG test: create → query → verify"""
import os; os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:dgiot123@127.0.0.1:7432/parse'
import sys; sys.path.insert(0, '.')
from src.parse_db import get_backend, get_db_compat, reset_backend; reset_backend()
from src.parse_lite import ensure_table, parse_create, parse_get, parse_query

TBL = "minimal_pg_test"
ensure_table(TBL)
db = get_db_compat()

# Clean
db.execute(f'DELETE FROM "{TBL}"'); db.commit()
print("[1] Cleaned")

# Create
r = parse_create(TBL, {"objectId": "test1", "name": "Hello", "value": 42})
print(f"[2] Create: {r}")

# Direct PG query
be = get_backend()
row = be.fetchone(f'SELECT * FROM "{TBL}" WHERE objectId=%s', ('test1',))
print(f"[3] Direct PG: {dict(row) if row else 'NOT FOUND'}")

# Via parse_get
obj = parse_get(TBL, "test1")
print(f"[4] parse_get: {obj}")

# Via parse_query
r = parse_query(TBL, {})
print(f"[5] parse_query: count={r.get('count','?')} results={len(r.get('results',[]))}")

db.execute(f'DROP TABLE "{TBL}"'); db.commit()
be.execute(f'DROP TABLE "{TBL}"')
reset_backend()
print("Done")
