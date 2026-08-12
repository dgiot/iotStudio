#!/usr/bin/env python3
"""RTDB SDK 主动采集测试"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

ps_script = r'''
$dll = "E:\IO ServerOnLine\psAPISDK.dll"
$code = @"
using System; using System.Runtime.InteropServices;
public class PSA {
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Common_StartAPI(string init);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_Connect(int a,int b,int c,int d,int e,int f,int g,int h);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_Disconnect(int conn);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Real_NewSubscribeAndRead(int conn, IntPtr tags, int count, IntPtr buf);
}
"@
try {
    Add-Type -TypeDefinition $code
    Write-Host "StartAPI: $([PSA]::psAPI_Common_StartAPI(''))"
    Write-Host "C0: $([PSA]::psAPI_Server_Connect(0,0,0,0,0,0,0,0))"
    Write-Host "C1: $([PSA]::psAPI_Server_Connect(1,0,0,0,0,0,0,0))"
    Write-Host "C2: $([PSA]::psAPI_Server_Connect(0,9004,0,0,5000,0,0,0))"
} catch { Write-Host "ERR: $($_.Exception.Message)" }
'''

ps1 = r'C:\Users\Administrator\psapi_t.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Users\Administrator\psapi_t.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err: print('ERR:', err[:500])
