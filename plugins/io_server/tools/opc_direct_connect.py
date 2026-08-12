#!/usr/bin/env python3
"""OPC DA 直连 — win32com + CLSID"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

# 用 CLSID 直连 Kepware: 6E6170F0-FF2D-11D2-8087-00105AA8F840
script = b'''
import pythoncom, win32com.client, pywintypes

# 用 OPCAutomation 接口
# Kepware CLSID from OPCClientCfg.ini
KEPWARE_CLSID = "6E6170F0-FF2D-11D2-8087-00105AA8F840"

hosts = [
    ("192.168.10.23", KEPWARE_CLSID),
    ("192.168.10.23", KEPWARE_CLSID),
    ("172.26.6.3", KEPWARE_CLSID),
]

for host, clsid in hosts:
    try:
        pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)
        # CLSID from string
        obj = win32com.client.Dispatch(
            pythoncom.CoGetClassObject(
                pywintypes.IID(clsid),
                pythoncom.CLSCTX_REMOTE_SERVER,
                None,
                host
            )
        )
        print(f"{host}: CONNECTED via CLSID")
        obj = None
    except pywintypes.com_error as e:
        code = hex(e.hresult & 0xFFFFFFFF) if hasattr(e, 'hresult') else '?'
        msg = str(e)[:120]
        print(f"{host}: {code} {msg}")
    except Exception as e:
        print(f"{host}: {str(e)[:120]}")
    finally:
        pythoncom.CoUninitialize()

print("\\nDone")
'''

b64 = base64.b64encode(script).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc3.py', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc3.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err: print('ERR:', err[:500])
