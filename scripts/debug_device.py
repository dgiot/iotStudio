import os, sys; sys.path.insert(0, '.')
os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:YOUR_PG_PASSWORD@127.0.0.1:7432/parse'
from src.parse_db import reset_backend; reset_backend()
from src.parse_lite import parse_query
r = parse_query('Device', {'limit': 1})
print('Count:', r.get('count'))
d = r['results'][0] if r['results'] else {}
print('Keys:', list(d.keys())[:15])
print('Name:', repr(d.get('name')))
print('Devaddr:', repr(d.get('devaddr')))
print('Status:', repr(d.get('status')))
print('IP:', repr(d.get('ip')))
print('Product:', repr(d.get('product')))
reset_backend()
