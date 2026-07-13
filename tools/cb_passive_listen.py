#!/usr/bin/env python3
"""被动监听 — 连 CommBridge 后只接收不发送，看 CommBridge 先发什么"""
import os, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'

import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=60)

ps_script = r'''
$c = New-Object System.Net.Sockets.TcpClient
$c.Connect('11.66.12.131', 53001)
$st = $c.GetStream()
$c.ReceiveTimeout = 10000

Write-Host "Connected. Waiting for server to send data first..."
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$totalBytes = 0
$allData = New-Object System.Collections.ArrayList

while ($sw.Elapsed.TotalSeconds -lt 15) {
    Start-Sleep -Milliseconds 100
    if ($st.DataAvailable) {
        $buf = New-Object byte[] 4096
        $n = $st.Read($buf, 0, 4096)
        $totalBytes += $n
        $hex = [BitConverter]::ToString($buf, 0, $n)
        [void]$allData.Add("+${n}b@$($sw.Elapsed.TotalSeconds)s: $hex")
        Write-Host "+${n}b@$($sw.Elapsed.TotalSeconds)s: $hex"
    }
}

$st.Close()
$c.Close()
Write-Host "Total: $totalBytes bytes received in $($sw.Elapsed.TotalSeconds)s"
'''

# 写 PS1 文件
s.run_ps(f"Set-Content -Path 'C:\\Users\\Administrator\\cb_passive.ps1' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
time.sleep(0.5)

r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\cb_passive.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
print(r.std_err.decode('gbk', errors='ignore').strip()[:500])
