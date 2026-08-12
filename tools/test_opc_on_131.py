#!/usr/bin/env python3
"""在131上用win32com直连远程OPC — 绕过OpenOPC"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

opc_script = r"""
import pythoncom, win32com.client, pywintypes

# 初始化COM (多线程)
pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)

# 尝试直接连远程OPC服务器
# Kepware CLSID: 6E6170F0-FF2D-11D2-8087-00105AA8F840
servers = [
    ('192.168.10.23', 'KEPware.KEPServerEx.V4'),
    ('192.168.10.23', 'RSLinx.OPCServer'),
    ('192.168.10.23', 'KEPware.KEPServerEx.V4'),
    ('172.26.6.3', 'OPCServer.WinCC.1'),
]

for host, progid in servers:
    try:
        print(f"\nTrying {host}:{progid}")
        # win32com Dispatch with remote server
        obj = win32com.client.Dispatch(progid, host)
        name = obj.ServerName if hasattr(obj, 'ServerName') else 'unknown'
        print(f"  CONNECTED! Server: {name}")

        # Try to browse
        try:
            # OPC server interface
            from win32com.client import CastTo
            import win32com.client.gencache as gencache
        except:
            pass

        obj = None
    except pywintypes.com_error as e:
        err_code = e.hresult if hasattr(e, 'hresult') else str(e)
        err_msg = str(e)[:120]
        if '80004005' in str(e):
            print(f"  DCOM ACCESS DENIED (80004005)")
        elif '80070005' in str(e):
            print(f"  ACCESS DENIED (80070005)")
        else:
            print(f"  Error: {err_msg}")
    except Exception as e:
        print(f"  Error: {str(e)[:120]}")

pythoncom.CoUninitialize()
print("\nDone")
"""

b64 = base64.b64encode(opc_script.encode('utf-8')).decode()
b64_file = r'C:\Users\Administrator\opc_test.b64'
py_file = r'C:\Users\Administrator\opc_test.py'

s.run_cmd(f'echo. > {b64_file}')
for i in range(0, len(b64), 4000):
    s.run_ps(f"Add-Content -Path '{b64_file}' -Value '{b64[i:i+4000]}' -NoNewline")
s.run_cmd(f'certutil -decode {b64_file} {py_file}')
time.sleep(1)

print('Running OPC direct...')
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc_test.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('ERR:', err[:500])
