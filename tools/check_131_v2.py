#!/usr/bin/env python3
"""检查 131 上 v2.0 Server 状态"""
import os, sys
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# 进程
r = s.run_cmd('tasklist /FI "IMAGENAME eq commbridge_server.exe" /FO CSV')
print('Process:', r.std_out.decode('gbk',errors='ignore').strip())

# 端口
r = s.run_cmd('netstat -ano | findstr ":53002" | findstr LISTENING')
print('Port:', r.std_out.decode('gbk',errors='ignore').strip())

# 日志
r = s.run_cmd(r'type C:\Users\Administrator\commbridge.log 2>nul')
lines = r.std_out.decode('gbk',errors='ignore').strip().split('\n')
print('Log (last 3):')
for l in lines[-3:]:
    print(f'  {l[-120:]}')

# 测试真实协议
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
        $hex = [BitConverter]::ToString($buf, 0, [Math]::Min(16,$n)) -replace '-',' '
        Write-Host "OK:$n B $hex"
    } else { Write-Host 'NO_QUERY' }
    $st.Close(); $c.Close()
} catch { Write-Host "ERR" }
'''

s.run_ps(f"Set-Content -Path 'C:\\Users\\Administrator\\tst.ps1' -Value @'\n{PS_TEST}\n'@ -Encoding UTF8")
import time; time.sleep(0.5)
r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\tst.ps1')
print('Test:', r.std_out.decode('gbk',errors='ignore').strip())
