"""全量解析 131 上所有 TagID 文件 — 提取每台设备每个通道的完整 RTDB 路径"""
import os, base64, struct, json
from collections import defaultdict

for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=25)

# List all TagID files
r = s.run_cmd(r'cmd /c dir "E:\IO ServerOnLine\run\TagID_IOCommitDB*" /b 2>nul')
files = [f.strip() for f in r.std_out.decode('gbk', errors='ignore').splitlines() if f.strip()]
print(f"Found {len(files)} TagID files")

all_tags = defaultdict(list)  # station → [(path, db_index)]

for fname in files:
    # Parse filename: TagID_IOCommitDB{N}_{STATION}.dat
    parts = fname.replace('.dat','').split('_')
    if len(parts) < 3: continue
    station = '_'.join(parts[2:])
    db_name = parts[1]  # IOCommitDB0, IOCommitDB1, ...

    print(f"\n{fname}: ", end='', flush=True)

    # Read file via base64
    r = s.run_ps(f'$p="E:\\IO ServerOnLine\\run\\{fname}"; $b=[IO.File]::ReadAllBytes($p); Write-Host ("SIZE="+$b.Length); Write-Host ("B64="+[Convert]::ToBase64String($b))')
    out = r.std_out.decode('gbk', errors='ignore')

    size = 0
    b64_data = ''
    for line in out.splitlines():
        line = line.strip()
        if line.startswith('SIZE='): size = int(line[5:])
        elif line.startswith('B64='): b64_data = line[4:]

    if not b64_data:
        print("READ FAILED")
        continue

    data = base64.b64decode(b64_data)
    print(f"{len(data)}B", end='', flush=True)

    # Parse: first 4 bytes = count
    offset = 0
    strings = []
    while offset + 4 <= len(data):
        slen = struct.unpack('<I', data[offset:offset+4])[0]
        offset += 4
        if slen == 0 or slen > 2000 or offset + slen > len(data):
            break
        s = data[offset:offset+slen].decode('ascii', errors='ignore')
        offset += slen
        strings.append(s)
        # skip terminator 0xFFFFFFFF
        if offset + 4 <= len(data):
            term = struct.unpack('<I', data[offset:offset+4])[0]
            if term == 0xFFFFFFFF:
                offset += 4

    tag_paths = [s for s in strings if s.startswith('/')]
    meta = [s for s in strings if not s.startswith('/')]

    all_tags[station].append({
        'db': db_name,
        'size': size,
        'tag_count': len(tag_paths),
        'tags': tag_paths,
        'meta': meta
    })

    print(f" → {len(tag_paths)} tags, {len(meta)} meta", flush=True)

# Summary
print(f"\n{'='*60}")
total_tags = 0
for station in sorted(all_tags.keys()):
    entries = all_tags[station]
    total = sum(e['tag_count'] for e in entries)
    total_tags += total
    dbs = [e['db'] for e in entries]
    print(f"{station}: {total} tags across {dbs}")

print(f"\nTOTAL: {total_tags} tags across {len(all_tags)} stations")

# Show sample tags for each station
print(f"\n{'='*60}")
print("Sample tags per station:")
for station in sorted(all_tags.keys()):
    entries = all_tags[station]
    for e in entries:
        if e['tags']:
            print(f"\n  {station}/{e['db']} ({len(e['tags'])} tags):")
            for t in e['tags'][:5]:
                print(f"    {t}")
            if len(e['tags']) > 5:
                print(f"    ... +{len(e['tags'])-5} more")
            if e['meta']:
                print(f"    Meta: {e['meta']}")

# Save to local file
out_path = r'D:\ai\dgiot_lite\logs\all_tagid_paths.json'
with open(out_path, 'w') as f:
    json.dump({k: [{**e, 'tags': e['tags'][:20]} for e in v] for k, v in all_tags.items()}, f, indent=2, ensure_ascii=False)
print(f"\nSaved summary: {out_path}")
