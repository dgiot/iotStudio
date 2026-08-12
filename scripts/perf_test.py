import requests, json, time, statistics, sys
url = 'http://127.0.0.1:1334/parse'
TBL = 'Perf_' + hex(int(time.time()))[-4:]

print(f'=== parse_lite :1334 Performance ({TBL}) ===')
sys.stdout.flush()

# Seed: create 20 records
requests.post(f'{url}/classes/{TBL}', json={'objectId': 'p1', 'name': 'test', 'value': 42})
for i in range(20):
    requests.post(f'{url}/classes/{TBL}', json={'name': f'item-{i}', 'value': i * 10})

tests = [
    ('health',      'GET', '/health'),
    ('GET by ID',   'GET', f'/classes/{TBL}/p1'),
    ('query 20',    'GET', f'/classes/{TBL}?limit=20'),
    ('query where', 'GET', f'/classes/{TBL}?where={{"name":"test"}}'),
    ('count',       'GET', f'/classes/{TBL}?count=1&limit=0'),
    ('login',       'GET', '/login?username=admin&password='),
]

for name, method, path in tests:
    times = []
    for _ in range(50):
        t0 = time.perf_counter()
        try:
            if method == 'GET':
                r = requests.get(url + path, timeout=5)
            else:
                r = requests.post(url + path, json={}, timeout=5)
            if r.status_code < 400:
                times.append(time.perf_counter() - t0)
        except:
            pass
    if times:
        avg = statistics.mean(times) * 1000
        p50 = sorted(times)[len(times) // 2] * 1000
        p99 = sorted(times)[int(len(times) * 0.99)] * 1000
        rps = len(times) / sum(times) if sum(times) > 0 else 0
        print(f'  {name:15s} avg={avg:5.1f}ms p50={p50:5.1f}ms p99={p99:5.1f}ms rps={rps:.0f}')
        sys.stdout.flush()

requests.delete(f'{url}/classes/{TBL}')
print('=== Done ===')
