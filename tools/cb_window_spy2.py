#!/usr/bin/env python3
"""简化版 - 枚举 LegacyComm 窗口"""
import os
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session(
    'http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60)

# 简化方法：用 tasklist + .NET Process 看主窗口标题
ps_script = r'''
$cb = Get-Process LegacyComm -ErrorAction SilentlyContinue | Select -First 1
if (-not $cb) { Write-Host "NOT_RUNNING"; exit }
Write-Host "PID: $($cb.Id)"
Write-Host "MainWindowTitle: [$($cb.MainWindowTitle)]"
Write-Host "MainWindowHandle: $($cb.MainWindowHandle)"
Write-Host "StartTime: $($cb.StartTime)"
Write-Host "TotalWindows: $(($cb.MainWindowHandle -ne 0))"
'''

s.run_ps(f"Set-Content -Path 'C:\\Users\\Administrator\\cb_win2.ps1' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
import time; time.sleep(0.5)

r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\cb_win2.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
print('STDERR:', r.std_err.decode('gbk', errors='ignore').strip()[:500])
