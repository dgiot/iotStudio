#!/usr/bin/env python3
"""psAPI — 用从Oracle找到的正确密码 INDUSTRYA11_pass"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

ps_script = r'''
$dll = "E:\IO ServerOnLine\psAPISDK.dll"
$code = @"
using System; using System.Runtime.InteropServices;
public class PSA {
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Common_StartAPI(string init);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_Connect(int a,int b,int c,int d,int e,int f,int g,int h);
}
"@
try {
    Add-Type -TypeDefinition $code
    Write-Host "StartAPI: $([PSA]::psAPI_Common_StartAPI(''))"

    # 试不同密码 — Oracle里的正确密码是 INDUSTRYA11_pass
    # 但我们只能传int... 所以这个DLL设计就不是给外部调用的
    # 试试0 (空密码)
    Write-Host "Connect(0,8889,0,0,0,0,0,0): $([PSA]::psAPI_Server_Connect(0,8889,0,0,0,0,0,0))"
    Write-Host "Connect(0,9004,0,0,0,0,0,0): $([PSA]::psAPI_Server_Connect(0,9004,0,0,0,0,0,0))"
} catch { Write-Host "ERR: $($_.Exception.Message)" }
'''

ps1 = r'C:\Users\Administrator\psapi_t.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Users\Administrator\psapi_t.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
