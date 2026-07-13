"""OPC DA 自主读取 — 在 131 上执行，读取指定 Tag 值"""
import os, time, base64, sys
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

KEPWARE_CLSID = "6E6170F0-FF2D-11D2-8087-00105AA8F840"
OPC_HOSTS = ["172.23.9.3", "172.23.9.23", "172.28.5.200"]
TAGS = sys.argv[1:] if len(sys.argv) > 1 else ["02204060100.Ia", "02204060100.Ua"]

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=35)

# Check prerequisites
print("=== Prerequisites ===")
r = s.run_cmd(r'cmd /c dir C:\Users\Administrator\opc_portable\python.exe 2>nul')
out = r.std_out.decode('gbk', errors='ignore').strip()
print(f"Python: {'OK' if 'python.exe' in out else 'NOT FOUND'}")

# Simple OPC test script to run on 131
opc_py = r'''
import pythoncom, win32com.client, pywintypes, sys

KEPWARE_CLSID = "6E6170F0-FF2D-11D2-8087-00105AA8F840"
hosts = ["172.23.9.3", "172.23.9.23", "172.28.5.200"]
tags = ["02204060100.Ia", "02204060100.Ua", "02105100097.Ia"]

results = []
for host in hosts:
    print(f"\n=== {host} ===")
    try:
        pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)
        obj = win32com.client.Dispatch(pythoncom.CoGetClassObject(
            pywintypes.IID(KEPWARE_CLSID),
            pythoncom.CLSCTX_REMOTE_SERVER, None, host))
        print(f"  Dispatch: OK")

        # Get available OPC servers
        servers = obj.GetOPCServers()
        server_list = str(servers).split('|') if '|' in str(servers) else [str(servers)]
        print(f"  Servers: {server_list[0][:80]}")

        # Connect to first server
        srv_name = server_list[0].strip()
        if srv_name:
            obj.Connect(srv_name)
            print(f"  Connected: {srv_name}")

            # Add group + items + read
            try:
                grp = obj.OPCGroups.Add("dgiot_test")
                grp.IsActive = True
                grp.UpdateRate = 1000
                handles = grp.OPCItems.AddItems(len(tags), tags)
                print(f"  Items: {len(tags)} added")

                import time
                time.sleep(1)
                vals = grp.SyncRead(1, len(tags), 0)
                for i, (item_id, val, qual, ts) in enumerate(vals):
                    print(f"  {tags[i] if i<len(tags) else item_id} = {val} (Q={qual})")
                    results.append({"host": host, "tag": tags[i] if i<len(tags) else str(item_id), "value": val})
            except Exception as e:
                print(f"  Read failed: {e}")

            obj.Disconnect()
        pythoncom.CoUninitialize()

    except pywintypes.com_error as e:
        code = hex(e.hresult & 0xFFFFFFFF) if hasattr(e, 'hresult') else '?'
        print(f"  COM: {code} {str(e)[:150]}")
        try: pythoncom.CoUninitialize()
        except: pass
    except Exception as e:
        print(f"  ERROR: {str(e)[:200]}")
        try: pythoncom.CoUninitialize()
        except: pass

print(f"\n=== DONE: {len(results)} values ===")
for r in results:
    print(f"  {r['host']}/{r['tag']} = {r['value']}")
'''

# Transfer via base64
b64 = base64.b64encode(opc_py.encode()).decode()
s.run_ps(f"$b=[Convert]::FromBase64String('{b64}'); [IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_simple.py', $b)")
time.sleep(0.5)

# Verify transfer
r = s.run_cmd(r'cmd /c dir C:\Users\Administrator\opc_simple.py 2>nul')
if 'opc_simple.py' not in r.std_out.decode('gbk', errors='ignore'):
    print("TRANSFER FAILED")
    sys.exit(1)

print("\n=== Running OPC DA Test ===\n")
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc_simple.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('STDERR:', err[:500])
