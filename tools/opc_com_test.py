#!/usr/bin/env python3
"""32位PS COM互操作 — 直接创建远程OPC对象"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

# 用32位PowerShell的COM创建远程OPC对象
ps_script = r'''
# 方式1: 用 Type.GetTypeFromCLSID + Activator 创建远程COM
$clsid = "6E6170F0-FF2D-11D2-8087-00105AA8F840"
$hosts = @("192.168.10.23", "192.168.10.23", "172.26.6.3")

foreach ($h in $hosts) {
    try {
        $type = [Type]::GetTypeFromCLSID($clsid, $h, $true)
        if ($type) {
            $obj = [Activator]::CreateInstance($type)
            Write-Host "$h CONNECTED: $($obj.GetType().Name)"
        }
    } catch {
        $msg = $_.Exception.Message
        if ($msg -match "80004005") { Write-Host "${h}: DCOM ACCESS DENIED" }
        elseif ($msg -match "80070005") { Write-Host "${h}: ACCESS DENIED" }
        elseif ($msg -match "800706ba") { Write-Host "${h}: RPC unavailable" }
        else { Write-Host "${h}: $($msg.Substring(0,[Math]::Min(100,$msg.Length)))" }
    }
}

# 方式2: 直接试 New-Object -ComObject with remote
foreach ($h in $hosts) {
    try {
        $obj = New-Object -ComObject "KEPware.KEPServerEx.V4" -ErrorAction Stop
        Write-Host "Local KEPware: $obj"
        break
    } catch {}
}

# 方式3: 列出本地所有OPC ProgID
Write-Host "`nLocal OPC ProgIDs:"
Get-ChildItem "HKCR:\CLSID\*\ProgID" -ErrorAction SilentlyContinue |
    Where-Object { (Get-ItemProperty $_.PSPath).'(default)' -match "OPC|KEPware|RSLinx|WinCC" } |
    ForEach-Object { Write-Host "  $(Get-ItemProperty $_.PSPath).'(default)'" }
'''

ps1 = r'C:\Users\Administrator\opc_com.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Users\Administrator\opc_com.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('ERR:', err[:500])
