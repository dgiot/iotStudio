#!/usr/bin/env python3
"""OPC DA Browse — 不依赖 Oracle，直接从 Kepware 浏览所有 Tag"""
import os, time, base64

for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

# Python script to run on 131: browse OPC DA tags
opc_py = r'''
import pythoncom, win32com.client, pywintypes

KEPWARE_CLSID = "6E6170F0-FF2D-11D2-8087-00105AA8F840"
hosts = [
    ("192.168.10.23", KEPWARE_CLSID),
    ("192.168.10.23", KEPWARE_CLSID),
    ("172.28.5.200", KEPWARE_CLSID),
]

def browse_tree(opc_server, indent=0):
    """递归浏览 OPC 标签树"""
    tags = []
    try:
        # 获取根节点
        browser = opc_server.CreateBrowser()
        browser.ShowLeafs(True)   # 显示叶子节点(实际标签)
        browser.ShowBranches()     # 显示分支节点
        browser.MoveToRoot()

        def browse_level(browser, path="", depth=0):
            if depth > 10:
                return
            browser.ShowLeafs(True)
            try:
                # 枚举当前层的叶子
                count = browser.Count
                for i in range(1, min(count + 1, 500)):
                    try:
                        name = browser.Item(i)
                        full_path = path + "." + name if path else name
                        tags.append(full_path)
                    except:
                        break
            except:
                pass

            # 进分支
            browser.ShowBranches()
            try:
                for i in range(1, min(browser.Count + 1, 50)):
                    try:
                        branch = browser.Item(i)
                        browser.MoveDown(branch)
                        browse_level(browser, path + "." + branch if path else branch, depth + 1)
                        browser.MoveUp()
                    except:
                        break
            except:
                pass

        browse_level(browser)
    except Exception as e:
        print(f"  Browse failed: {e}")
    return tags

for host, clsid in hosts:
    print(f"\n=== {host} ===")
    try:
        pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)
        obj = win32com.client.Dispatch(pythoncom.CoGetClassObject(
            pywintypes.IID(clsid), pythoncom.CLSCTX_REMOTE_SERVER, None, host))
        servers = obj.GetOPCServers()
        srv_list = str(servers).split("|") if "|" in str(servers) else [str(servers)]
        print(f"  Servers: {srv_list[0][:120]}")

        srv_name = srv_list[0].strip()
        if srv_name:
            obj.Connect(srv_name)
            print(f"  Connected: {srv_name}")

            # Browse
            tags = browse_tree(obj)
            print(f"  Tags found: {len(tags)}")
            for t in tags[:50]:
                print(f"    {t}")
            if len(tags) > 50:
                print(f"    ... +{len(tags)-50} more")

            obj.Disconnect()
        pythoncom.CoUninitialize()

    except pywintypes.com_error as e:
        code = hex(e.hresult & 0xFFFFFFFF) if hasattr(e, 'hresult') else '?'
        print(f"  COM ERROR: {code}")
        try: pythoncom.CoUninitialize()
        except: pass
    except Exception as e:
        print(f"  ERROR: {str(e)[:200]}")
        try: pythoncom.CoUninitialize()
        except: pass

print("\nDONE")
'''

b64 = base64.b64encode(opc_py.encode()).decode()
s.run_ps(f"$b=[Convert]::FromBase64String('{b64}'); [IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_browse.py', $b)")
time.sleep(0.5)

print("=== Browsing OPC DA Tag Trees ===\n")
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc_browse.py')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('STDERR:', err[:300])
