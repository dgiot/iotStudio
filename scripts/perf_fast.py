"""Quick perf test against local :8000 (parse_lite via main.py)"""
import requests, time, statistics, sys
URL = 'http://127.0.0.1:8000/api'
TBL = 'Perf_0'

# Create 20 records
requests.post(f'{URL}/classes/{TBL}', json={'objectId': 'p1', 'name': 'test', 'val': 42})
for i in range(20):
    requests.post(f'{URL}/classes/{TBL}', json={'name': f'item-{i}', 'val': i * 10})

print(f'parse_lite :8000 Performance (50 reqs each)')
print(f'{"Test":20s} {"avg":>7s} {"p50":>7s} {"p99":>7s} {"rps":>6s}')
print('-' * 48)
sys.stdout.flush()

tests = [
    ('health',  f'{URL}/health'),
    ('GET/ID',  f'{URL}/classes/{TBL}/p1'),
    ('query20', f'{URL}/classes/{TBL}?limit=20'),
    ('count',   f'{URL}/classes/{TBL}?count=1&limit=0'),
    ('login',   f'{URL}/auth/login'),
]

for name, url in tests:
    times = []
    for _ in range(50):
        t0 = time.perf_counter()
        try:
            if 'login' in url:
                r = requests.post(url, json={'username': 'admin', 'password': os.environ.get('ADMIN_PASS', 'changeme')}, timeout=5)
            else:
                r = requests.get(url, timeout=5)
            if r.status_code < 400:
                times.append(time.perf_counter() - t0)
        except:
            pass
    if times:
        s = sorted(times)
        avg = statistics.mean(times) * 1000
        p50 = s[len(s) // 2] * 1000
        p99 = s[int(len(s) * 0.99)] * 1000
        rps = len(times) / sum(times)
        print(f'{name:20s} {avg:6.1f}ms {p50:6.1f}ms {p99:6.1f}ms {rps:5.0f}/s')
        sys.stdout.flush()

requests.delete(f'{URL}/classes/{TBL}')
print('Done')
