"""Dump RTDB Tag ID file from 131"""
import os, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=15, operation_timeout_sec=10)

# Read RTDB.dat and get base64
r = s.run_ps(r'$p="E:\IO ServerOnLine\run\TagID_IOCommitDB0_RTDB.dat"; $b=[IO.File]::ReadAllBytes($p); Write-Host ("SIZE="+$b.Length); Write-Host ("B64="+[Convert]::ToBase64String($b))')
out = r.std_out.decode('gbk', errors='ignore').strip()

for line in out.splitlines():
    line = line.strip()
    if line.startswith('SIZE='):
        print(f"Size: {line[5:]}")
    elif line.startswith('B64='):
        data = base64.b64decode(line[4:])
        print(f"Decoded: {len(data)} bytes")
        for i in range(0, len(data), 32):
            chunk = data[i:i+32]
            hx = ' '.join(f'{b:02x}' for b in chunk)
            asc = ''.join(chr(b) if 32<=b<127 else '.' for b in chunk)
            print(f'  {i:04x}: {hx:<48s} {asc}')
