"""Scan 131 server for ForceControl/IoMonitor/OPC configuration."""
import os, sys

os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*,127.0.0.1'
os.environ['no_proxy'] = '11.66.12.131,11.*,172.*,127.0.0.1'
os.environ.pop('HTTP_PROXY', None)
os.environ.pop('HTTPS_PROXY', None)
os.environ.pop('http_proxy', None)
os.environ.pop('https_proxy', None)

import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm',
    read_timeout_sec=60
)

def ps(script):
    """Run PowerShell and return output."""
    try:
        r = s.run_ps(script)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        combined = (out + '\n' + err).strip()
        return combined[:5000] if combined else '(empty)'
    except Exception as e:
        return f'PS ERR: {e}'

def cmd(command):
    """Run cmd command and return output."""
    try:
        r = s.run_cmd(command)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        combined = (out + '\n' + err).strip()
        return combined[:5000] if combined else '(empty)'
    except Exception as e:
        return f'CMD ERR: {e}'

print("=== 1. HOST INFO ===")
print(cmd('hostname'))
print(cmd('whoami'))
print(cmd('ver'))
print()

print("=== 2. D: DRIVE ===")
print(cmd('cmd /c "dir /b D:\\ 2>nul"'))
print()

print("=== 3. PROCESSES (force/opc/rslinx/iomonitor/rockwell) ===")
print(ps("""
Get-Process | Where-Object {
    $_.ProcessName -match 'force|opc|rslinx|iomonitor|factory|rockwell|harmony|wonderware'
} | Select Name,Id,StartTime | Format-Table -AutoSize
"""))
print()

print("=== 4. SERVICES ===")
print(cmd('sc query state= all 2>nul | findstr /i "RSLinx Factory OPC IoMonitor Harmony Rockwell"'))
print()

print("=== 5. INSTALLED SOFTWARE (x64) ===")
print(ps("""
Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' |
    Where-Object {$_.DisplayName -match 'OPC|Force|RSLinx|Factory|Rockwell|Wonderware|Intouch|iFix|WinCC|Cimplicity|Kepware|Matrikon'} |
    Select DisplayName, InstallLocation | Format-List
"""))
print()

print("=== 6. INSTALLED SOFTWARE (x86) ===")
print(ps("""
Get-ItemProperty 'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' |
    Where-Object {$_.DisplayName -match 'OPC|Force|RSLinx|Factory|Rockwell|Wonderware|Intouch|iFix|WinCC|Cimplicity|Kepware|Matrikon'} |
    Select DisplayName, InstallLocation | Format-List
"""))
print()

print("=== 7. OPC DCOM AppIDs ===")
print(ps("""
Get-ChildItem 'HKLM:\\SOFTWARE\\Classes\\AppID' -ErrorAction SilentlyContinue |
    Where-Object {
        $name = $_.PSChildName
        $name -match 'OPC|OpcRcw|Automation|ServerList'
    } | ForEach-Object { $_.PSChildName }
"""))
print()

print("=== 8. OPC ProgIDs ===")
print(ps("""
Get-ChildItem 'HKLM:\\SOFTWARE\\Classes' -ErrorAction SilentlyContinue |
    Where-Object {$_.PSChildName -like 'OPC.*'} |
    Select -First 30 PSChildName | Format-Table -HideTableHeaders
"""))
print()

print("=== 9. RSLINx Registry ===")
print(ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Rockwell' -ErrorAction SilentlyContinue | Select Name"))
print(ps("Get-ChildItem 'HKLM:\\SOFTWARE\\WOW6432Node\\Rockwell' -ErrorAction SilentlyContinue | Select Name"))
print()

print("=== 10. FORCECONTROL Registry ===")
for key in ['ForceControl','Sunway','SunWay','Beijing ForceCon','ForceCon','FC','FactorySoft']:
    for hive in ['HKLM:\\SOFTWARE', 'HKLM:\\SOFTWARE\\WOW6432Node']:
        result = ps(f"Get-ChildItem '{hive}\\{key}' -ErrorAction SilentlyContinue | Select Name")
        if result and result.strip() and '(empty)' not in result and 'ERR' not in result:
            print(f"  FOUND: {hive}\\{key}")
            print(f"  {result}")
print()

print("=== 11. C: Program Files dirs ===")
print(cmd('cmd /c "dir /ad /b \"C:\\Program Files\" 2>nul | findstr /i \"force opc rslinx rockwell factory wonderware kepware matrikon\""'))
print(cmd('cmd /c "dir /ad /b \"C:\\Program Files (x86)\" 2>nul | findstr /i \"force opc rslinx rockwell factory wonderware kepware matrikon\""'))
print()

print("=== 12. LISTENING PORTS ===")
print(cmd('netstat -an 2>nul | findstr ":8889 :502 :135 :53001"'))
print()

print("=== 13. OPC DLLs in System32 ===")
print(cmd('cmd /c "dir C:\\Windows\\System32\\opc*.dll C:\\Windows\\SysWOW64\\opc*.dll 2>nul"'))
print()

print("=== 14. DCOM Config (OpcEnum) ===")
print(ps("""
$components = Get-ChildItem 'HKLM:\\SOFTWARE\\Classes\\CLSID' -ErrorAction SilentlyContinue |
    Where-Object {$_.PSChildName -match '^\\{' } |
    ForEach-Object {
        $path = $_.PSPath
        $progid = (Get-ItemProperty "$path\\ProgID" -ErrorAction SilentlyContinue).'(default)'
        if ($progid -and $progid -match 'OPC') {
            $appid = (Get-ItemProperty $path -ErrorAction SilentlyContinue).AppID
            [PSCustomObject]@{CLSID=$_.PSChildName; ProgID=$progid; AppID=$appid}
        }
    }
if ($components) { $components | Format-Table -AutoSize } else { Write-Host 'No OPC COM components found' }
"""))
print()

print("=== DONE ===")
