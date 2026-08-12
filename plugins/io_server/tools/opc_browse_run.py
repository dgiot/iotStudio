"""OPC Browse — 直接在 131 上浏览所有标签"""
import os, time, base64, sys
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=35)

# The OPC browse script to run on 131
script = '''
import pythoncom, win32com.client, pywintypes, sys

K = "6E6170F0-FF2D-11D2-8087-00105AA8F840"
hosts = sys.argv[1:] if len(sys.argv) > 1 else ["192.168.10.23", "192.168.10.23"]

def browse_all(opc_server, path=""):
    tags = []
    try:
        b = opc_server.CreateBrowser()
        b.MoveToRoot()
        b.ShowLeafs(True)
        b.ShowBranches()

        # Leaves at current level
        for i in range(1, min(b.Count + 1, 501)):
            try:
                name = b.Item(i)
                tags.append(path + "." + name if path else name)
            except:
                break

        # Recurse into branches
        b.ShowBranches()
        for i in range(1, min(b.Count + 1, 51)):
            try:
                branch = b.Item(i)
                b.MoveDown(branch)
                new_path = path + "." + branch if path else branch
                tags += browse_all(opc_server, new_path)
                b.MoveUp()
            except:
                break
    except Exception as e:
        print(f"  Browse error: {e}")
    return tags

for host in hosts:
    print(f"\\n=== {host} ===")
    try:
        pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)
        o = win32com.client.Dispatch(pythoncom.CoGetClassObject(
            pywintypes.IID(K), pythoncom.CLSCTX_REMOTE_SERVER, None, host))
        srvs = o.GetOPCServers()
        srv = str(srvs).split(chr(9))[0].split("|")[0].strip()
        print(f"  Server: {srv}")
        o.Connect(srv)
        print(f"  Connected")

        tags = browse_all(o)
        print(f"  Total tags: {len(tags)}")
        for t in tags[:100]:
            print(f"    {t}")
        if len(tags) > 100:
            print(f"    ... +{len(tags)-100} more")

        o.Disconnect()
        pythoncom.CoUninitialize()
    except Exception as e:
        print(f"  ERROR: {str(e)[:200]}")
        try: pythoncom.CoUninitialize()
        except: pass

print("\\nDONE")
'''

# Transfer to 131
b64 = base64.b64encode(script.encode()).decode()
print(f"Script: {len(script)} bytes, b64: {len(b64)} chars")

# Write in chunks if needed
chunk_size = 8000
chunks = [b64[i:i+chunk_size] for i in range(0, len(b64), chunk_size)]
print(f"Transferring in {len(chunks)} chunk(s)...")

for i, chunk in enumerate(chunks):
    s.run_ps(f"$c='{chunk}'; $f='C:\\Users\\Administrator\\opc_br_chunk{i}.txt'; [IO.File]::WriteAllText($f,$c)")
    time.sleep(0.2)

# Reassemble
s.run_ps("$b64=(Get-Content C:\\Users\\Administrator\\opc_br_chunk*.txt -Raw) -replace '\\s',''; [IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_br.py',[Convert]::FromBase64String($b64))")
time.sleep(0.5)

# Verify
r = s.run_cmd('cmd /c dir C:\\Users\\Administrator\\opc_br.py 2>nul')
if 'opc_br.py' not in r.std_out.decode('gbk','ignore'):
    print("TRANSFER FAILED")
    sys.exit(1)
print("Transfer OK")

# Run
r = s.run_cmd(r'C:\Users\Administrator\opc_portable\python.exe C:\Users\Administrator\opc_br.py 192.168.10.23')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err:
        print('STDERR:', err[:300])
