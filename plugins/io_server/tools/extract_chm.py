"""
Extract CHM file and search binary files for protocol clues
"""
import winrm, os, sys, base64

def get_session():
    for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
        os.environ.pop(k, None)
    os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
    return winrm.Session(
        'http://11.66.12.131:5985/wsman',
        auth=('administrator', r'GKYWB-5991792$1c8k'),
        transport='ntlm',
        read_timeout_sec=60
    )

s = get_session()

def run_ps(script, desc):
    sys.stdout.buffer.write(f"\n=== {desc} ===\n".encode())
    sys.stdout.buffer.flush()
    try:
        r = s.run_ps(script)
        if r.std_out:
            sys.stdout.buffer.write(r.std_out[:100000])
        sys.stdout.buffer.flush()
        return r
    except Exception as e:
        sys.stdout.buffer.write(f"ERR: {e}\n".encode())
        return None

# 1. Try to decompile the CHM file using hh.exe
ps1 = r'''
$chmPath = "E:\IO ServerOnLine\IO Servers\IM_A11_RTU\IM_A11_RTU.chm"
$outDir = "C:\Users\Administrator\chm_extract"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
Write-Host "Attempting CHM decompile..."
$p = Start-Process -FilePath "hh.exe" -ArgumentList "-decompile",$outDir,$chmPath -Wait -NoNewWindow -PassThru
Start-Sleep -Seconds 2
if (Test-Path $outDir) {
    $files = Get-ChildItem -Path $outDir -Recurse -ErrorAction SilentlyContinue
    if ($files) {
        Write-Host "Extracted $($files.Count) files:"
        $files | ForEach-Object { Write-Host "  $($_.FullName) [$($_.Length)B]" }
        # Read HTML files
        Get-ChildItem -Path $outDir -Filter "*.htm*" -ErrorAction SilentlyContinue | Where-Object {$_.Length -lt 500KB} | ForEach-Object {
            Write-Host "`n--- $($_.Name) ---"
            try { Get-Content $_.FullName -Encoding UTF8 -TotalCount 200 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  $_" } }
            catch { Write-Host "  (unreadable)" }
        }
    } else { Write-Host "No files extracted (CHM may have protection)" }
} else { Write-Host "Output dir not created" }
'''
run_ps(ps1, "CHM decompile")

# 2. Try strings on CommBridge.pdb for function names
ps2 = r'''
$ErrorActionPreference="SilentlyContinue"
# Use findstr to search for protocol-related strings
$targets = @(
    "E:\IO ServerOnLine\CommBridge.pdb",
    "E:\IO ServerOnLine\CommBridge.exe",
    "E:\IO ServerOnLine\CommBridge-.exe",
    "E:\IO ServerOnLine\IO Servers\IM_A11_RTU\IM_A11_RTU.chm",
    "E:\IO ServerOnLine\IO Servers\IM_A11_RTU\RTUSql\A11SQLSERVICE.exe"
)
foreach ($t in $targets) {
    Write-Host "`n=== $t ==="
    # Search for ASCII strings (simple approach)
    $content = Get-Content $t -Encoding Byte -ReadCount 0 -TotalCount 500000 -ErrorAction SilentlyContinue
    if ($content) {
        $str = ""
        $ascii = ""
        foreach ($b in $content) {
            if ($b -ge 32 -and $b -le 126) {
                $ascii += [char]$b
            } else {
                if ($ascii.Length -ge 4) {
                    # Check if interesting
                    if ($ascii -match "Modbus|TCP|RTU|CRC|register|DTU|GPRS|frame|header|protocol|parse|serial|COM|port|socket|connect|listen|A11|heart|beat|imei|login|auth") {
                        $str += $ascii + "`n"
                    }
                }
                $ascii = ""
            }
        }
        if ($str) { Write-Host $str } else { Write-Host "(no interesting strings found)" }
    }
}
'''
run_ps(ps2, "Search binary files for protocol strings")

# 3. Read Event.txt (last 500 lines, as Base64)
ps3 = r'''
$path = "E:\IO ServerOnLine\Event.txt"
if(Test-Path $path -and (Get-Item $path).Length -gt 0){
    $lines = Get-Content $path -Tail 500 -Encoding UTF8 -ErrorAction SilentlyContinue
    $content = $lines -join "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
    $b64 = [System.Convert]::ToBase64String($bytes)
    Write-Host $b64
}
'''
raw = run_ps(ps3, "Event.txt tail 500 (base64)")
if raw and raw.std_out:
    import re
    txt = raw.std_out.decode('ascii', errors='replace')
    m = re.search(r'([A-Za-z0-9+/=]{200,})', txt)
    if m:
        try:
            decoded = base64.b64decode(m.group(1))
            content = decoded.decode('utf-8', errors='replace')
            sys.stdout.buffer.write(content.encode()[:30000] + b"\n")
        except Exception as e:
            sys.stdout.buffer.write(f"  err: {e}\n".encode())

# 4. Check what CommBridge - command line arguments / help
ps4 = r'''
$ErrorActionPreference="SilentlyContinue"
Write-Host "=== CommBridge command line help === "
# Run with --help or /?
try {
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "E:\IO ServerOnLine\CommBridge.exe"
    $pinfo.RedirectStandardError = $true
    $pinfo.RedirectStandardOutput = $true
    $pinfo.UseShellExecute = $false
    $pinfo.Arguments = "--help"
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $pinfo
    $p.Start() | Out-Null
    $out = $p.StandardOutput.ReadToEnd()
    $p.WaitForExit(2000)
    if ($out) { Write-Host $out }
} catch { Write-Host "Cannot run CommBridge --help" }
try {
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "E:\IO ServerOnLine\CommBridge.exe"
    $pinfo.RedirectStandardError = $true
    $pinfo.RedirectStandardOutput = $true
    $pinfo.UseShellExecute = $false
    $pinfo.Arguments = "/?"
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $pinfo
    $p.Start() | Out-Null
    $out = $p.StandardOutput.ReadToEnd()
    $p.WaitForExit(2000)
    if ($out) { Write-Host $out }
} catch { Write-Host "Cannot run CommBridge /?" }
'''
run_ps(ps4, "CommBridge command line")

sys.stdout.buffer.write(b"\n===== DONE =====\n")
