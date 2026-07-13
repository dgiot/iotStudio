#!/usr/bin/env python3
"""通过HTTP让131下载EXE + 启动测试"""
import os, sys, time, threading
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm
from http.server import HTTPServer, SimpleHTTPRequestHandler

# 在 dist 目录启动 HTTP
dist_dir = r'D:\ai\dgiot_lite\dist'
os.chdir(dist_dir)

httpd = HTTPServer(('11.66.191.155', 8888), SimpleHTTPRequestHandler)
thread = threading.Thread(target=httpd.serve_forever, daemon=True)
thread.start()
print('HTTP Server: http://11.66.191.155:8888')

time.sleep(1)

# WinRM 让131下载
s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=120, operation_timeout_sec=100)

# 用 PowerShell 下载
r = s.run_ps('''
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri "http://11.66.191.155:8888/commbridge_server.exe" -OutFile "C:\\Users\\Administrator\\commbridge_server.exe"
    $size = (Get-Item "C:\\Users\\Administrator\\commbridge_server.exe").Length
    Write-Host "DOWNLOAD_OK size=$size"
} catch {
    Write-Host "DOWNLOAD_FAIL: $($_.Exception.Message)"
}
''')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err:
        print('ERR:', err[:300])

# 验证
print('\n--- Remote file ---')
r = s.run_cmd(r'dir C:\Users\Administrator\commbridge_server.exe')
print(r.std_out.decode('gbk', errors='ignore').strip())

httpd.shutdown()
print('\nHTTP Server stopped')
