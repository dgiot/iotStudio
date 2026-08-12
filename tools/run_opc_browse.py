"""Run OPC COM Browse on 131 via WinRM"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=35)

# Upload the PS1 script
with open(r'D:\ai\dgiot_lite\tools\opc_com_browse.ps1', 'rb') as f:
    content = f.read()
b64 = base64.b64encode(content).decode()
print(f"Script: {len(content)} bytes, b64: {len(b64)} chars")

# Upload via PowerShell
s.run_ps(f"$b=[Convert]::FromBase64String('{b64}'); [IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_browse.ps1', $b)")
time.sleep(0.5)

# Verify
r = s.run_cmd('cmd /c dir C:\\Users\\Administrator\\opc_browse.ps1 2>nul')
if 'opc_browse.ps1' not in r.std_out.decode('gbk','ignore'):
    print("UPLOAD FAILED")
    raise SystemExit(1)
print("Upload OK")

# Run on 192.168.10.23
print("\n=== Running on 192.168.10.23 ===\n")
r = s.run_ps('powershell -ExecutionPolicy Bypass -File C:\\Users\\Administrator\\opc_browse.ps1 -host_ip 192.168.10.23')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err:
        print('STDERR:', err[:500])

# Also try 192.168.10.23
print("\n\n=== Running on 192.168.10.23 ===\n")
r = s.run_ps('powershell -ExecutionPolicy Bypass -File C:\\Users\\Administrator\\opc_browse.ps1 -host_ip 192.168.10.23')
print(r.std_out.decode('gbk', errors='ignore').strip())
