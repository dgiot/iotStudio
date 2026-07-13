#!/usr/bin/env python3
"""杀 + 启动 + 验证 131 上 v2.0 Server"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

remote_exe = r'C:\Users\Administrator\commbridge_server.exe'

# Step 1: Kill
print('1. Kill old...')
r = s.run_cmd('taskkill /F /IM commbridge_server.exe 2>nul')
print('  done')
time.sleep(3)

# Step 2: Download new EXE from HTTP
print('2. Download new EXE...')
ps_dl = r'''
$ProgressPreference = 'SilentlyContinue'
try {
    Invoke-WebRequest -Uri 'http://11.66.191.155:8888/commbridge_server.exe' -OutFile 'C:\Users\Administrator\commbridge_server.exe'
    $size = (Get-Item 'C:\Users\Administrator\commbridge_server.exe').Length
    Write-Host "OK size=$size"
} catch { Write-Host "FAIL: $($_.Exception.Message)" }
'''
s.run_ps(f"Set-Content -Path '{r'C:\Users\Administrator\dl.ps1'}' -Value @'\n{ps_dl}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\dl.ps1')
print('  ' + r.std_out.decode('gbk', errors='ignore').strip())

# Step 3: Verify EXE exists and check size
print('3. Check EXE...')
r = s.run_cmd(f'dir {remote_exe}')
out = r.std_out.decode('gbk', errors='ignore')
print('  ' + out.strip())

# Step 4: Start
print('4. Start...')
r = s.run_cmd(f'start /b {remote_exe}')
time.sleep(5)

# Step 5: Process
print('5. Process:')
r = s.run_cmd('tasklist /FI "IMAGENAME eq commbridge_server.exe" /FO CSV')
print('  ' + r.std_out.decode('gbk', errors='ignore').strip())

# Step 6: Port
print('6. Port 53002:')
r = s.run_cmd('netstat -ano | findstr ":53002 " | findstr LISTENING')
print('  ' + (r.std_out.decode('gbk', errors='ignore').strip() or 'NOT LISTENING!'))

# Step 7: Log
print('7. Log:')
r = s.run_cmd(r'type C:\Users\Administrator\commbridge.log 2>nul')
lines = r.std_out.decode('gbk', errors='ignore').strip().split('\n')
for l in lines[-3:]:
    print('  ' + l[-120:])

# Step 8: Protocol test
print('8. Real protocol test:')
ps = r'''
try {
    $c = New-Object System.Net.Sockets.TcpClient
    $c.Connect('127.0.0.1', 53002)
    $st = $c.GetStream()
    $reg = [byte[]]@(0xAA,0x01,0x30,0x32,0x32,0x30,0x34,0x30,0x36,0x30,0x31,0x30,0x30,0x0D)
    $st.Write($reg, 0, $reg.Length)
    Start-Sleep -Milliseconds 1500
    $buf = New-Object byte[] 256
    if ($st.DataAvailable) {
        $n = $st.Read($buf, 0, 256)
        $hex = [BitConverter]::ToString($buf, 0, [Math]::Min(20,$n)) -replace '-',' '
        Write-Host "OK $n B: $hex"
    } else { Write-Host 'NO_QUERY' }
    $st.Close(); $c.Close()
} catch { Write-Host "ERR: $($_.Exception.Message)" }
'''
ps1 = r'C:\Users\Administrator\rt.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{ps}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\rt.ps1')
print('  ' + r.std_out.decode('gbk', errors='ignore').strip())

print('\nDONE')
