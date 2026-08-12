#!/usr/bin/env python3
"""psAPI 管理员权限测试 — 共享内存需要 SeCreateGlobalPrivilege"""
import os, sys, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60, operation_timeout_sec=50)

# 思路: psAPI通过共享内存连本地IoProject, 不是TCP
# IoProject PID 5096 创建共享内存, IOMan通过psAPI连接
# 需要管理员权限创建/访问全局共享内存对象

ps_script = r'''
# 检查当前用户权限
Write-Host "User: $env:USERNAME"
Write-Host "Admin: $([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"

# 用管理员权限加载DLL
$code = @"
using System; using System.Runtime.InteropServices;
public class Ps {
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Common_StartAPI(string init);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_Connect(int a,int b,int c,int d,int e,int f,int g,int h);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_GetAllConnectInfo(IntPtr buf, ref int cnt);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_IsConnected(int h);
}
"@
Add-Type -TypeDefinition $code

Write-Host "StartAPI: $([Ps]::psAPI_Common_StartAPI(''))"

# 检查IoProject是否创建了共享内存连接
$cnt = 0
$r = [Ps]::psAPI_Server_GetAllConnectInfo([IntPtr]::Zero, [ref]$cnt)
Write-Host "Existing connections: ret=$r count=$cnt"

# 试Connect — 共享内存只需要本地，不需要IP
Write-Host "Connect(0,0,0,0,0,0,0,0): $([Ps]::psAPI_Server_Connect(0,0,0,0,0,0,0,0))"
Write-Host "Connect(1,0,0,0,0,0,0,0): $([Ps]::psAPI_Server_Connect(1,0,0,0,0,0,0,0))"

# 检查IoProject连接
for ($h=0; $h -lt 10; $h++) {
    $r2 = [Ps]::psAPI_Server_IsConnected($h)
    if ($r2 -ne 0) { Write-Host "IsConnected($h)=$r2 (IOMan?)" }
}
'''

ps1 = r'C:\Users\Administrator\psapi_admin.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
time.sleep(0.5)

# 用管理员权限运行(注意: WinRM已经是admin)
r = s.run_cmd(r'C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Users\Administrator\psapi_admin.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err:
        print('ERR:', err[:500])
