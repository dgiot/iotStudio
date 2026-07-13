"""
Find more pSpace config files and A11 protocol artifacts
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
        if r.status_code == 0:
            if r.std_out:
                sys.stdout.buffer.write(r.std_out[:100000])
        else:
            sys.stdout.buffer.write(b"FAIL\n")
        if r.std_err and len(r.std_err) > 2000:
            pass  # suppress large stderr
        sys.stdout.buffer.flush()
        return r
    except Exception as e:
        sys.stdout.buffer.write(f"ERR: {e}\n".encode())
        return None

# 1. Search for all .ini files containing A11 or CommBridge references
ps1 = r'''
$ErrorActionPreference="SilentlyContinue"
$base = "E:\IO ServerOnLine"
Write-Host "=== Search for A11-related files ==="
Get-ChildItem -Path $base -Filter "*A11*" -Recurse -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "$($_.FullName) [$($_.Length)B]" }
Write-Host "`n=== Search for CommBridge config ==="
Get-ChildItem -Path $base -Filter "*CommBridge*" -Recurse -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "$($_.FullName) [$($_.Length)B]" }
'''
run_ps(ps1, "Search A11/CommBridge files")

# 2. List subdirectories
ps2 = r'''
$ErrorActionPreference="SilentlyContinue"
Write-Host "=== Subdirectories of E:\IO ServerOnLine ==="
Get-ChildItem -Path "E:\IO ServerOnLine" -Directory -Recurse -Depth 1 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "$($_.FullName)" }
Write-Host "`n=== Check for F:\TRANgo path ==="
if(Test-Path "F:\TRANgo"){Write-Host "F:\TRANgo EXISTS"}
Get-ChildItem "F:\TRANgo\IO ServerOnLine" -Recurse -Depth 2 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "$($_.FullName) [$($_.Length)B]" }
'''
run_ps(ps2, "Directory structure")

# 3. Check for CommBridge channel config (the 3 devices from IoChannelCfg)
ps3 = r'''
$ErrorActionPreference="SilentlyContinue"
# Search for any config files with CHANNEL or DEVICE definitions
$dirs = @("E:\IO ServerOnLine")
foreach($d in "E:\IO ServerOnLine","F:\TRANgo\IO ServerOnLine"){
    if(Test-Path $d){
        Get-ChildItem -Path $d -Include "*.ini","*.xml","*.cfg","*.config" -Recurse -ErrorAction SilentlyContinue | Where-Object {$_.Length -gt 10 -and $_.Length -lt 1MB} | ForEach-Object {
            Write-Host "$($_.FullName) [$($_.Length)B]"
        }
    }
}
'''
run_ps(ps3, "All config files")

# 4. Read Event.txt (last 500 lines)
ps4 = r'''
$path = "E:\IO ServerOnLine\Event.txt"
if(Test-Path $path){
    $lines = Get-Content $path -Tail 500 -Encoding UTF8 -ErrorAction SilentlyContinue
    $content = $lines -join "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
    $b64 = [System.Convert]::ToBase64String($bytes)
    Write-Host $b64
}
'''
raw = run_ps(ps4, "Event.txt tail 500")
if raw and raw.std_out:
    import re, base64
    txt = raw.std_out.decode('ascii', errors='replace')
    m = re.search(r'([A-Za-z0-9+/=]{500,})', txt)
    if m:
        try:
            decoded = base64.b64decode(m.group(1))
            content = decoded.decode('utf-8', errors='replace')
            sys.stdout.buffer.write(f"\nEvent.txt tail:\n".encode() + content.encode()[:20000] + b"\n")
        except Exception as e:
            sys.stdout.buffer.write(f"  event.txt decode err: {e}\n".encode())

# 5. Check for "IM_A11_RTU" SQL files
ps5 = r'''
$paths = @("E:\IO ServerOnLine\IO Servers\IM_A11_RTU", "F:\TRANgo\IO ServerOnLine\IO Servers\IM_A11_RTU")
foreach($p in $paths){
    if(Test-Path $p){
        Write-Host "=== $p ==="
        Get-ChildItem -Path $p -Recurse -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  $($_.Name) [$($_.Length)B]" }
    }
}
'''
run_ps(ps5, "IM_A11_RTU directory")

# 6. Search for any DMP data protocol documentation or examples
ps6 = r'''
$ErrorActionPreference="SilentlyContinue"
Write-Host "=== Search for files containing 'Modbus' or 'CRC' or 'DTU' in E: drive ==="
Get-ChildItem -Path "E:\IO ServerOnLine" -Include "*.txt","*.ini","*.log" -Recurse -ErrorAction SilentlyContinue | Where-Object {$_.Length -lt 500KB} | Select-String -List -Pattern "Modbus|CRC|DTU|GPRS|register|protocol" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_.Path }
'''
run_ps(ps6, "Search Modbus/CRC/DTU config")

sys.stdout.buffer.write(b"\n===== DONE =====\n")
