#!/usr/bin/env python3
"""测试 psAPISDK — 查现有连接 + 尝试ConnectTimeout"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

# 试ConnectTimeout (可能参数不同) + 查IsConnected + 看GetAllConnectInfo
ps_script = r'''
$dll = "E:\IO ServerOnLine\psAPISDK.dll"
$code = @"
using System; using System.Runtime.InteropServices;
public class PSA {
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_ConnectTimeout(int a,int b,int c,int d,int e,int f,int g,int h);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_IsConnected(int a);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Common_StartAPI(string init);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_GetAllConnectInfo(IntPtr buf, ref int count);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_Disconnect(int handle);
}
"@
try {
    Add-Type -TypeDefinition $code
    Write-Host "StartAPI: $([PSA]::psAPI_Common_StartAPI(''))"

    # 看看有没有已存在的连接 (count=0 means none)
    $cnt = 0
    $r = [PSA]::psAPI_Server_GetAllConnectInfo([IntPtr]::Zero, [ref]$cnt)
    Write-Host "GetAllConnectInfo: ret=$r count=$cnt"

    # IsConnected (试试各种handle)
    Write-Host "IsConnected(0): $([PSA]::psAPI_Server_IsConnected(0))"
    Write-Host "IsConnected(1): $([PSA]::psAPI_Server_IsConnected(1))"

    # ConnectTimeout - 尝试6参数 (server,port,user,pwd,timeout,mode)
    $code2 = @"
    using System; using System.Runtime.InteropServices;
    public class PSB {
        [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
        public static extern int psAPI_Server_ConnectTimeout(int a,int b,int c,int d,int e,int f);
    }
"@
    Add-Type -TypeDefinition $code2
    Write-Host "CT(srv=0x,port=9004,usr=0,pwd=0,to=10,mode=5): $([PSB]::psAPI_Server_ConnectTimeout(0,9004,0,0,10,5))"

} catch { Write-Host "ERR: $($_.Exception.Message)" }
'''

ps1 = r'C:\Users\Administrator\psapi_t.ps1'
s.run_ps(f"Set-Content -Path '{ps1}' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
time.sleep(0.5)
r = s.run_cmd(r'C:\Windows\SysWOW64\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File C:\Users\Administrator\psapi_t.ps1')
out = r.std_out.decode('gbk', errors='ignore').strip()
print(out)
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err and 'Copyright' not in err: print('ERR:', err[:400])
