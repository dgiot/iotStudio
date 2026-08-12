#!/usr/bin/env python3
"""下载 IoProject.exe"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

src = r'E:\IO ServerOnLine\IoProject.exe'
dst = r'C:\Users\Administrator\iop.b64'

r = s.run_cmd(f'dir "{src}"')
print(r.std_out.decode('gbk', errors='ignore').strip())

r = s.run_cmd(f'certutil -encode "{src}" {dst}')
time.sleep(1)

r = s.run_ps(f'Get-Content {dst} -Raw')
b64 = r.std_out.decode('gbk', errors='ignore')
lines = [l for l in b64.split('\n') if l.strip() and not l.strip().startswith('---')]
data = base64.b64decode(''.join(lines))

out = r'D:\ai\dgiot_lite\reverse\commbridge\downloaded\IoProject.exe'
with open(out, 'wb') as f:
    f.write(data)

print(f'Downloaded: {len(data)} bytes ({len(data)/1024:.0f}KB) -> {out}')

# 快速分析
import pefile
pe = pefile.PE(out)
print(f'Entry: 0x{pe.OPTIONAL_HEADER.AddressOfEntryPoint:X}')
if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT'):
    print(f'Exports: {len(pe.DIRECTORY_ENTRY_EXPORT.symbols)}')
if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
    for entry in pe.DIRECTORY_ENTRY_IMPORT:
        dll = entry.dll.decode('utf-8','ignore')
        if any(k in dll.lower() for k in ['kernel','psapi','share','mem']):
            funcs = [i.name.decode('utf-8','ignore') for i in entry.imports if i.name]
            print(f'  {dll}: {funcs[:8]}')
