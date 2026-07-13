"""Scan E: drive - IoMonitor directory on 131."""
import os
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
os.environ['no_proxy'] = '11.66.12.131,11.*,172.*'
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)

import winrm
s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=60)

def ps(script):
    try:
        r = s.run_ps(script)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:8000]
    except Exception as e:
        return f'ERR: {e}'

def cmd(command):
    try:
        r = s.run_cmd(command)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:8000]
    except Exception as e:
        return f'ERR: {e}'

print("=== 1. E: DRIVE ===")
print(cmd('cmd /c "dir /b E:\\ 2>nul"'))
print()

print("=== 2. E:\\IO ServerOnLine ===")
print(cmd('cmd /c "dir E:\\\"IO ServerOnLine\"\\ 2>nul"'))
print()

print("=== 3. E:\\IO ServerOnLine subdirs ===")
print(cmd('cmd /c "dir /ad /b E:\\\"IO ServerOnLine\"\\ 2>nul"'))
print()

print("=== 4. E:\\...\\*.exe *.dll ===")
print(cmd('cmd /c "dir /s /b E:\\\"IO ServerOnLine\"\\*.exe E:\\\"IO ServerOnLine\"\\*.dll 2>nul"'))
print()

print("=== 5. E:\\...\\*.ini *.xml *.config *.csv *.txt ===")
print(cmd('cmd /c "dir /s /b E:\\\"IO ServerOnLine\"\\*.ini E:\\\"IO ServerOnLine\"\\*.xml E:\\\"IO ServerOnLine\"\\*.config E:\\\"IO ServerOnLine\"\\*.csv E:\\\"IO ServerOnLine\"\\*.txt 2>nul"'))
print()

print("=== 6. E:\\...\\*.db *.mdb *.sqlite ===")
print(cmd('cmd /c "dir /s /b E:\\\"IO ServerOnLine\"\\*.db E:\\\"IO ServerOnLine\"\\*.mdb E:\\\"IO ServerOnLine\"\\*.sqlite 2>nul"'))
print()

print("=== 7. E: data files ===")
print(cmd('cmd /c "dir /s /b E:\\*.fcs E:\\*.fcp E:\\*.odf E:\\*.his E:\\*.dat 2>nul"'))
print()

print("=== 8. IoMonitor TCP connections ===")
print(cmd('netstat -ano | findstr "18400"'))
print()

print("=== DONE ===")
