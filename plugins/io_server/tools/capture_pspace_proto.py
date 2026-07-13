"""在 131 上抓 pSpace 协议包 (130:8889)"""
import os, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=15, operation_timeout_sec=10)

TRACE = r'C:\Users\Administrator\pspace_cap2'

print("=== 1. Start capture ===")
r = s.run_cmd(f'netsh trace start capture=yes protocol=TCP maxsize=512 tracefile={TRACE}.etl 2>&1')
print(r.std_out.decode('gbk', errors='ignore').strip())

print("\n=== 2. Check pSpace connections ===")
r = s.run_cmd('netstat -ano | findstr ":8889"')
print(r.std_out.decode('gbk', errors='ignore').strip())

print("\n=== 3. IoMonitor.ini ===")
r = s.run_cmd('type "E:\\IO ServerOnLine\\IoMonitor.ini" 2>nul')
print(r.std_out.decode('gbk', errors='ignore').strip())

print("\n=== 4. pSpace datasource config ===")
r = s.run_cmd('type "E:\\IO ServerOnLine\\Data Servers\\pSpace\\pSpace.xml" 2>nul')
print(r.std_out.decode('gbk', errors='ignore').strip())

print("\nCapture running for 30s...")
time.sleep(30)

print("\n=== 5. Stop capture ===")
r = s.run_cmd(f'netsh trace stop 2>&1')
print(r.std_out.decode('gbk', errors='ignore').strip())

print(f"\nDone. Trace saved to {TRACE}.etl")
