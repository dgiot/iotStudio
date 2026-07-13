#!/usr/bin/env python3
"""部署v2.1到131 (float32支持)"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

# Kill old
print('1. Kill...')
s.run_cmd('taskkill /F /IM commbridge_server.exe 2>nul')
time.sleep(2)

# Download via PS
print('2. Download...')
dl = r'''
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri 'http://11.66.191.155:8888/commbridge_server.exe' -OutFile 'C:\Users\Administrator\commbridge_server.exe'
$s = (Get-Item 'C:\Users\Administrator\commbridge_server.exe').Length
Write-Host "OK $s"
'''
ps1 = r'C:\Users\Administrator\dl.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{dl}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\dl.ps1')
print('  ' + r.std_out.decode('gbk', errors='ignore').strip())

# Start
print('3. Start...')
s.run_cmd(r'start /b C:\Users\Administrator\commbridge_server.exe')
time.sleep(5)

# Verify
print('4. Port:')
r = s.run_cmd('netstat -ano | findstr ":53002" | findstr LISTENING')
print('  ' + (r.std_out.decode('gbk', errors='ignore').strip() or 'NOT LISTENING!'))

# Protocol test
print('5. Protocol test:')
test_ps = r'''
try {
    $c=New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1',53002); $st=$c.GetStream()
    $r=[byte[]]@(0xAA,0x01,0x30,0x32,0x32,0x30,0x34,0x30,0x36,0x30,0x31,0x30,0x30,0x0D)
    $st.Write($r,0,$r.Length); Start-Sleep -Milliseconds 1200
    $b=New-Object byte[] 64
    if($st.DataAvailable){$n=$st.Read($b,0,64); Write-Host "OK $n B: $([BitConverter]::ToString($b,0,[Math]::Min(12,$n)) -replace '-',' ')"} else{Write-Host 'NO'}
    $st.Close();$c.Close()
} catch { Write-Host "ERR $($_.Exception.Message)" }
'''
ps2 = r'C:\Users\Administrator\pt.ps1'
s.run_ps(f"Set-Content -Path '{ps2}' -Value @'\n{test_ps}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\pt.ps1')
print('  ' + r.std_out.decode('gbk', errors='ignore').strip())

print('\nDONE')
