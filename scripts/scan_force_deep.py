"""Deep scan ForceControl/IoMonitor registry on 131."""
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
        return (out + '\n' + err).strip()[:6000]
    except Exception as e:
        return f'ERR: {e}'

def cmd(command):
    try:
        r = s.run_cmd(command)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:6000]
    except Exception as e:
        return f'ERR: {e}'

# 1. ForceControl registry details
print("=== 1. ForceControl Registry ===")
print(ps(r"Get-ChildItem 'HKLM:\SOFTWARE\ForceControl' -Recurse -ErrorAction SilentlyContinue | ForEach-Object { $_.Name + ' = ' + (Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue | Out-String) }"))
print()

# 2. Sunway/FactorySoft registry details
print("=== 2. FactorySoft Registry ===")
print(ps(r"Get-ChildItem 'HKLM:\SOFTWARE\WOW6432Node\FactorySoft' -Recurse -ErrorAction SilentlyContinue | ForEach-Object { $_.Name + ' = ' + (Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue | Out-String) }"))
print()

# 3. Beijing ForceCon
print("=== 3. Beijing ForceCon Registry ===")
print(ps(r"Get-ChildItem 'HKLM:\SOFTWARE\WOW6432Node\Beijing ForceCon' -Recurse -ErrorAction SilentlyContinue | ForEach-Object { $_.Name + ' = ' + (Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue | Out-String) }"))
print()

# 4. D:\Bin contents
print("=== 4. D:\\Bin Contents ===")
print(cmd('cmd /c "dir D:\\Bin\\*.exe D:\\Bin\\*.dll D:\\Bin\\*.ini D:\\Bin\\*.xml D:\\Bin\\*.config 2>nul"'))
print()

# 5. D:\Source contents
print("=== 5. D:\\Source Contents ===")
print(cmd('cmd /c "dir /b /s D:\\Source\\*.sln D:\\Source\\*.vcproj D:\\Source\\*.vcxproj 2>nul"'))
print(cmd('cmd /c "dir D:\\Source\\ 2>nul"'))
print()

# 6. IoMonitor process details
print("=== 6. IoMonitor Process Details ===")
print(ps(r"Get-Process -Name IoMonitor -ErrorAction SilentlyContinue | Select Id,Path,StartTime,WorkingSet | Format-List"))
print(ps(r"Get-WmiObject Win32_Process -Filter \"Name='IoMonitor.exe'\" | Select ProcessId,CommandLine,ExecutablePath | Format-List"))
print()

# 7. Check if A11 (port 8889) is listening
print("=== 7. Port 8889 Listener ===")
print(ps(r"Get-Process -Id (Get-NetTCPConnection -LocalPort 8889 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Select Name,Id,Path"))
print(cmd('netstat -an | findstr ":8889"'))
print()

# 8. ForceControl config files in common locations
print("=== 8. ForceControl Config Files ===")
print(cmd('cmd /c "dir /s /b C:\\*.fcs C:\\*.fcp C:\\IoMonitor* C:\\ForceControl* 2>nul | findstr /v node_modules"'))
print(cmd('cmd /c "dir /s /b D:\\*.fcs D:\\*.fcp D:\\*.ini D:\\*.cfg D:\\IoMonitor* D:\\ForceControl* 2>nul"'))
print()

# 9. Check C: root for IoMonitor
print("=== 9. C: Root ===")
print(cmd('cmd /c "dir /b C:\\ 2>nul | findstr /i \"io force opc\""'))
print()

print("=== DONE ===")
