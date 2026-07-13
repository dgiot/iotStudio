#!/usr/bin/env python3
"""下载 psAPISDK.dll 并分析"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

dll_remote = r'E:\IO ServerOnLine\psAPISDK.dll'
b64_remote = r'C:\Users\Administrator\psapi.b64'

r = s.run_cmd(f'dir "{dll_remote}"')
print('File:', r.std_out.decode('gbk',errors='ignore').strip())

r = s.run_cmd(f'certutil -encode "{dll_remote}" {b64_remote}')
time.sleep(1)
r = s.run_ps(f'Get-Content {b64_remote} -Raw')
b64 = r.std_out.decode('gbk',errors='ignore')
lines = [l for l in b64.split('\n') if l.strip() and not l.strip().startswith('---')]
data = base64.b64decode(''.join(lines))
out = r'D:\ai\dgiot_lite\reverse\commbridge\downloaded\psAPISDK.dll'
with open(out, 'wb') as f: f.write(data)
print(f'Downloaded: {len(data)} bytes -> {out}')

# 分析导出
import pefile
pe = pefile.PE(out)
if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT'):
    print(f'\n=== psAPISDK.dll 导出函数 ({len(pe.DIRECTORY_ENTRY_EXPORT.symbols)} total) ===')
    for exp in pe.DIRECTORY_ENTRY_EXPORT.symbols:
        if exp.name:
            name = exp.name.decode('utf-8','ignore')
            print(f'  {name}')
