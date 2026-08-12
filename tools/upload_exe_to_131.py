#!/usr/bin/env python3
"""上传 commbridge_server.exe 到 131"""
import os, sys, base64, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

EXE_PATH = r'D:\ai\dgiot_lite\dist\commbridge_server.exe'
REMOTE_DIR = r'C:\Users\Administrator'
REMOTE_EXE = REMOTE_DIR + r'\commbridge_server.exe'
B64_REMOTE = REMOTE_DIR + r'\cbsrv.b64'

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=300, operation_timeout_sec=250)

# 读本地 EXE
with open(EXE_PATH, 'rb') as f:
    exe_data = f.read()
print(f'EXE: {len(exe_data)} bytes ({len(exe_data)/1024/1024:.1f} MB)')

b64 = base64.b64encode(exe_data).decode()
print(f'Base64: {len(b64)} chars')

# 清空旧文件
s.run_cmd(f'echo. > {B64_REMOTE}')

# 分块写入
CHUNK = 6000
total = len(b64)
for i in range(0, total, CHUNK):
    chunk = b64[i:i+CHUNK]
    ps_cmd = f"Add-Content -Path '{B64_REMOTE}' -Value '{chunk}' -NoNewline"
    s.run_ps(ps_cmd)
    if (i // CHUNK) % 20 == 0:
        pct = min(100, (i + CHUNK) * 100 // total)
        print(f'  Upload: {pct}% ({i//1000}/{total//1000} KB)')

print('Upload complete. Decoding...')

# Decode
r = s.run_cmd(f'certutil -decode {B64_REMOTE} {REMOTE_EXE}')
out = r.std_out.decode('gbk', errors='ignore').strip()
if 'successfully' in out.lower() or '成功' in out:
    print('Decode: OK')
else:
    print(f'Decode: {out[:300]}')

# 验证文件大小
r = s.run_cmd(f'dir {REMOTE_EXE}')
info = r.std_out.decode('gbk', errors='ignore')
print(info)

# 清理 base64
s.run_cmd(f'del {B64_REMOTE}')
print('Cleaned up base64 file')
