#!/usr/bin/env python3
"""杀旧进程, 启动v2.0, 测试真实协议"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# 1. 杀所有旧进程
print('1. Killing old processes...')
s.run_cmd('taskkill /F /IM commbridge_server.exe 2>nul')
time.sleep(3)

# 2. 确认端口
r = s.run_cmd('netstat -ano | findstr ":53002"')
out = r.std_out.decode('gbk',errors='ignore').strip()
print(f'2. Port 53002: {"FREE" if not out else out}')

# 3. 确认EXE
r = s.run_cmd(r'dir C:\Users\Administrator\commbridge_server.exe')
info = r.std_out.decode('gbk',errors='ignore')
if 'commbridge_server.exe' in info:
    print('3. EXE found')
else:
    print('3. EXE MISSING! Need re-upload')

# 4. 启动
print('4. Starting...')
s.run_cmd(r'start /b C:\Users\Administrator\commbridge_server.exe')
time.sleep(5)

# 5. 进程
r = s.run_cmd('tasklist /FI "IMAGENAME eq commbridge_server.exe" /FO CSV')
print('5. Process:', r.std_out.decode('gbk',errors='ignore').strip())

# 6. 端口
r = s.run_cmd('netstat -ano | findstr ":53002" | findstr LISTENING')
print('6. Port:', r.std_out.decode('gbk',errors='ignore').strip())

# 7. 真实协议测试
print('7. Testing real protocol...')
PS_TEST = r'''
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

ps1_path = r'C:\Users\Administrator\rtest.ps1'
s.run_ps(f"Set-Content -Path '{ps1_path}' -Value @'\n{PS_TEST}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\rtest.ps1')
print('7. Result:', r.std_out.decode('gbk',errors='ignore').strip())
