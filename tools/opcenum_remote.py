#!/usr/bin/env python3
"""用OpcEnum远程枚举DCS OPC服务器"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

script = b'''
import pythoncom, win32com.client
pythoncom.CoInitialize()

# OpcEnum
opcenum = win32com.client.Dispatch("OpcEnum.ServerList.1")
print("OpcEnum OK")

for host in ["172.23.9.3", "172.23.9.23", "172.26.6.3"]:
    try:
        servers = opcenum.EnumClassesOfCategories(host)
        print(f"{host}: {servers}")
    except Exception as e:
        print(f"{host}: {str(e)[:100]}")

pythoncom.CoUninitialize()
'''

b64 = base64.b64encode(script).decode()
py_file = r'C:\Users\Administrator\opc2.py'

# 直接用 PS WriteAllBytes with base64
s.run_ps(f"[IO.File]::WriteAllBytes('{py_file}', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

print('Running...')
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc2.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err: print('ERR:', err[:500])
