#!/usr/bin/env python3
"""上传并执行32位PS结构体测试"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

# 读本地PS1
with open(r'D:\ai\dgiot_lite\tools\pspace_32bit_struct.ps1', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

# 上传
ps_file = r'C:\Users\Administrator\psapi_struct.ps1'
s.run_ps(f"[IO.File]::WriteAllBytes('{ps_file}', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

# 32位PS执行
print('Running 32-bit PS struct test...')
r = s.run_cmd(r'C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Users\Administrator\psapi_struct.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('ERR:', err[:500])
