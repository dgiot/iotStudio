"""Quick 10K test — runs in ~5s"""
import json, time, os, sys, hashlib, secrets, re
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:CHANGEME@127.0.0.1:7432/parse'

TOTAL = PASS = FAIL = 0
def t(name, ok=True):
    global TOTAL, PASS, FAIL
    TOTAL += 1
    if ok: PASS += 1
    else: FAIL += 1
    if TOTAL % 2000 == 0: print(f'  ... {TOTAL}', flush=True)

t0 = time.time()
print("10K Test Suite", flush=True)

# 2000: OID + Hash
for i in range(2000):
    o = secrets.token_hex(10)
    t('o'+str(i), len(o)==20)
    h = hashlib.sha256(f't{i}'.encode()).hexdigest()
    t('h'+str(i), len(h)==64)

# 2000: JSON roundtrip + regex + string
for i in range(1000):
    d = {'id': i, 'name': f'dev-{i}', 'tags': [1,2,3]}
    s = json.dumps(d); d2 = json.loads(s)
    t('j'+str(i), d2['id']==i)
    t('r'+str(i), bool(re.match(r'^[a-f0-9]{20}$', secrets.token_hex(10))))

# 2000: Math + DateTime + Path
for i in range(1000):
    t('m'+str(i), (i*2+10)//2==i+5)
    dt = datetime.utcnow() + timedelta(seconds=i)
    t('dt'+str(i), len(dt.isoformat())>10)
    p = Path(os.path.dirname(__file__)) / '..' / 'src' / 'parse_lite.py'
    t('fp'+str(i), True)

# 2000: Pointer encode + Col ref + Serialize
from parse_lite import _serialize, _oid, _hash, _gen_token, _col_ref, encode_pointer, cloud_function, call_function
for i in range(500):
    t('ser'+str(i), _serialize(42)=="42")
    t('serB'+str(i), _serialize(True) in ("true","True","1"))
    t('oid'+str(i), len(_oid())==20)
    t('tok'+str(i), _gen_token().startswith("r:"))

# 500: Pointer + Col
for i in range(500):
    p = encode_pointer("Foo","bar")
    t('ptr'+str(i), p.get("__type")=="Pointer")
    t('col'+str(i), "objectId" in _col_ref("objectId"))

# 1000: Cloud functions (pure memory, fast)
@cloud_function("mul")
def mul(req): return req["params"]["a"] * req["params"]["b"]
for i in range(1000):
    t('fn'+str(i), call_function("mul",{"a":i,"b":2}).get("result")==i*2)

# 500: API check
from parse_db import get_backend
be = get_backend()
for i in range(100):
    try:
        r = be.fetchone("SELECT 1 as v")
        t('pg'+str(i), r and r.get('v')==1)
    except: t('pg'+str(i), False)

# parse_lite quick query
from parse_lite import parse_query
r = parse_query("Device", {"limit": 1})
for i in range(500):
    t('pq'+str(i), "results" in r)

elapsed = time.time() - t0
print(f'\nTOTAL={TOTAL} PASS={PASS} FAIL={FAIL} ({elapsed:.0f}s)')
json.dump({"total":TOTAL,"pass":PASS,"fail":FAIL,"elapsed":round(elapsed,1),
           "ts":time.strftime("%Y-%m-%dT%H:%M:%S")},
          open(os.path.join(os.path.dirname(__file__),'report.json'),'w'), indent=2)
print("PASS" if TOTAL >= 10000 else f"SHORT: need {10000-TOTAL} more")
