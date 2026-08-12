#!/usr/bin/env python3
"""读取 LegacyComm 窗口信息——寻找调试/收发数据窗口"""
import os, sys
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=60)

# 用 PowerShell 列出 LegacyComm 进程的所有窗口
ps_script = r'''
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;
public class WinAPI {
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

$cbPid = (Get-Process LegacyComm -ErrorAction SilentlyContinue | Select -First 1).Id
if (-not $cbPid) { Write-Host "LegacyComm not running"; exit }

$windows = New-Object System.Collections.ArrayList
$callback = {
    param($hWnd, $lParam)
    $procId = 0
    [WinAPI]::GetWindowThreadProcessId($hWnd, [ref]$procId)
    if ($procId -eq $cbPid) {
        $len = [WinAPI]::GetWindowTextLength($hWnd)
        $sb = New-Object System.Text.StringBuilder($len + 1)
        [WinAPI]::GetWindowText($hWnd, $sb, $sb.Capacity) | Out-Null
        $title = $sb.ToString()
        $visible = [WinAPI]::IsWindowVisible($hWnd)
        $rect = New-Object WinAPI+RECT
        [WinAPI]::GetWindowRect($hWnd, [ref]$rect) | Out-Null
        $size = "$($rect.Right - $rect.Left)x$($rect.Bottom - $rect.Top)"
        [void]$windows.Add([PSCustomObject]@{
            HWND = "0x$($hWnd.ToInt64().ToString('X'))"
            Title = $title
            Visible = $visible
            Size = $size
        })
    }
    return $true
}
$delegate = [WinAPI+EnumWindowsProc]$callback
[WinAPI]::EnumWindows($delegate, [IntPtr]::Zero)

$windows | Format-Table -AutoSize
Write-Host "Total windows: $($windows.Count)"
'''

# 写入文件避免转义问题
s.run_ps(f"Set-Content -Path 'C:\\Users\\Administrator\\cb_windows.ps1' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
import time; time.sleep(0.5)

r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\cb_windows.ps1')
print(r.std_out.decode('gbk', errors='ignore').strip())
print(r.std_err.decode('gbk', errors='ignore').strip()[:1000])
