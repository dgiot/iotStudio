"""重启 131 commbridge_server"""
import os, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=15, operation_timeout_sec=10)

# Start
print('Starting commbridge_server...')
s.run_cmd(r'cd /d C:\Users\Administrator && start /b commbridge_server.exe > commbridge_server.log 2>&1')
time.sleep(5)

# Verify
r = s.run_cmd('netstat -ano | findstr ":53002"')
out = r.std_out.decode('gbk', errors='ignore').strip()
if out:
    print(f'OK: :53002 LISTENING')
    print(out)
else:
    print('NOT LISTENING — checking log')
    r = s.run_cmd('cmd /c type C:\\Users\\Administrator\\commbridge_server.log 2>nul')
    print(r.std_out.decode('gbk', errors='ignore')[:600] or '(empty)')
