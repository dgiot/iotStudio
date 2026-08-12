"""通过 WinRM 读取 131 上 RTDB 共享内存中的实时数据"""
import os, time, struct
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# PowerShell: enumerate and read Global\ shared memory
ps_script = r'''
# List all named objects from IoProject/IOMan
Write-Host "=== Global\ named objects ==="
$objects = @()
# Check known names
$names = @(
    "Global\IO7CEE918", "Global\IO7CEE898",
    "Global\psGuardMMapFile", "Global\psTrayMMapFile",
    "Global\IOCommitDB0", "Global\IO_RTDB",
    "Global\CMutualEvent0", "Global\CMutualEvent1",
    "Global\mutex recv 0", "Global\mutex recv 1"
)

Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices;
public class Shm {
    [DllImport("kernel32.dll")] public static extern IntPtr OpenFileMapping(uint dwAccess, bool bInherit, string lpName);
    [DllImport("kernel32.dll")] public static extern IntPtr MapViewOfFile(IntPtr hMap, uint dwAccess, uint dwOffHi, uint dwOffLo, uint cb);
    [DllImport("kernel32.dll")] public static extern bool UnmapViewOfFile(IntPtr lpBase);
    [DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr h);
    [DllImport("kernel32.dll")] public static extern uint GetLastError();
}
"@

foreach ($name in $names) {
    $h = [Shm]::OpenFileMapping(0x0004, $false, $name)  # FILE_MAP_READ
    if ($h -ne [IntPtr]::Zero) {
        $buf = [Shm]::MapViewOfFile($h, 0x0004, 0, 0, 256)
        if ($buf -ne [IntPtr]::Zero) {
            $bytes = New-Object byte[] 256
            [Marshal]::Copy($buf, $bytes, 0, 256)
            $hex = [BitConverter]::ToString($bytes[0..63]) -replace '-',' '
            Write-Host "$name : FOUND (first 64B: $hex)"
            [Shm]::UnmapViewOfFile($buf)
        }
        [Shm]::CloseHandle($h)
    } else {
        $err = [Shm]::GetLastError()
        if ($err -ne 2) { Write-Host "$name : err=$err" }
    }
}

# Also check IoProject/IOMan process details
Write-Host ""
Write-Host "=== IoProject command line ==="
Get-CimInstance Win32_Process -Filter "Name='IoProject.exe'" | % { $_.CommandLine }

Write-Host ""
Write-Host "=== Active IOMan processes (first 3) ==="
Get-CimInstance Win32_Process -Filter "Name='IOMan.exe'" | Select -First 3 | % {
    Write-Host "PID=$($_.ProcessId) CMD=$($_.CommandLine.Substring(0, [Math]::Min(200, $_.CommandLine.Length)))"
}
'''

r = s.run_ps(ps_script)
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err:
        print('ERR:', err[:300])
