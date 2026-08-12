#!/usr/bin/env python3
"""OPC DA 自主读取 — 指定 OPC Server + Tag 列表，读取实时值"""
import os, sys, time, base64

for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

# ── 用户自定义参数 ──
OPC_SERVERS = [
    {"host": "192.168.10.23",   "clsid": "6E6170F0-FF2D-11D2-8087-00105AA8F840", "name": "Kepware1"},
    {"host": "192.168.10.23",  "clsid": "6E6170F0-FF2D-11D2-8087-00105AA8F840", "name": "Kepware2"},
    {"host": "172.26.6.3",   "clsid": "6E6170F0-FF2D-11D2-8087-00105AA8F840", "name": "Kepware3"},
    {"host": "172.28.5.200", "clsid": "6E6170F0-FF2D-11D2-8087-00105AA8F840", "name": "Kepware4"},
]

# 要读取的 Tag (从 IOMan type=0 设备列表)
TAGS_TO_READ = [
    "02204060100.Ia", "02204060100.Ua", "02204060100.P",
    "02105100097.Ia", "02105100097.Ua",
]

# ── 在 131 上执行 OPC DA 读取 ──
py_script = f'''
import pythoncom, win32com.client, pywintypes, time

KEPWARE_CLSID = "6E6170F0-FF2D-11D2-8087-00105AA8F840"
OPC_SERVERS = {OPC_SERVERS}
TAGS = {TAGS_TO_READ}

results = []

for srv in OPC_SERVERS[:2]:  # 先试前2台
    host = srv["host"]
    print(f"\\n=== {{host}} ===")
    try:
        pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)

        # Step 1: 获取 OPC Server 对象
        opc_cls = pythoncom.CoGetClassObject(
            pywintypes.IID(KEPWARE_CLSID),
            pythoncom.CLSCTX_REMOTE_SERVER,
            None,
            host
        )
        print(f"  CLSCTX OK")

        # Step 2: 通过 OPCAutomation 接口创建 OPC Server
        opc_server = win32com.client.Dispatch(opc_cls)
        print(f"  Dispatch OK")

        # Step 3: 连接 (ProgID)
        server_name = opc_server.GetOPCServers()
        print(f"  Servers: {{server_name}}")

        # Step 4: 连接第一个可用的 OPC Server
        if isinstance(server_name, tuple):
            server_name = server_name[0]
        if isinstance(server_name, str):
            opc_server.Connect(server_name.split('|')[0] if '|' in str(server_name) else str(server_name).split(chr(9))[0])
            print(f"  Connected to {{server_name}}")

            # Step 5: 添加 Group
            group = opc_server.OPCGroups.Add("dgiot_test")
            group.IsActive = True
            group.UpdateRate = 1000
            print(f"  Group added, UpdateRate=1000ms")

            # Step 6: 添加 Items
            item_count = group.OPCItems.AddItems(len(TAGS), TAGS)
            print(f"  Items added: {{item_count}}")

            # Step 7: 同步读取
            time.sleep(1)
            values = group.SyncRead(1, item_count, 0)  # OPCDevice, Count, Source
            for i, (item_id, val, qual, ts) in enumerate(values):
                results.append({{
                    "host": host, "tag": TAGS[i] if i < len(TAGS) else str(item_id),
                    "value": val, "quality": qual, "ts": str(ts)
                }})
                print(f"    {{TAGS[i] if i < len(TAGS) else item_id}} = {{val}} (Q={{qual}})")

            opc_server.Disconnect()

        pythoncom.CoUninitialize()

    except pywintypes.com_error as e:
        code = hex(e.hresult & 0xFFFFFFFF) if hasattr(e, 'hresult') else '?'
        print(f"  COM ERROR: {{code}} {{str(e)[:200]}}")
        pythoncom.CoUninitialize()
    except Exception as e:
        print(f"  ERROR: {{str(e)[:200]}}")
        try: pythoncom.CoUninitialize()
        except: pass

print(f"\\n=== SUMMARY: {{len(results)}} values ===")
for r in results:
    print(f"{{r['host']}}/{{r['tag']}} = {{r['value']}}")
'''

# 传输脚本到 131 并执行
b64 = base64.b64encode(py_script.encode()).decode()
cleanup = s.run_cmd('del C:\\Users\\Administrator\\opc_da_read.py 2>nul')
transfer = s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_da_read.py', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

print("=== Running OPC DA Read on 131 ===\n")
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc_da_read.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('ERR:', err[:500])
