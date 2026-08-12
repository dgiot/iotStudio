"""
Read LegacyComm config files from RTDB IO Server
Target: E:\\IO ServerOnLine\\ directory
"""
import winrm, os, sys

def get_session():
    for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
        os.environ.pop(k, None)
    os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
    return winrm.Session(
        'http://127.0.0.1:5985/wsman',
        auth=('administrator', r'CHANGEME'),
        transport='ntlm',
        read_timeout_sec=120
    )

s = get_session()
sys.stdout.buffer.write(b"Session created.\n")
sys.stdout.buffer.flush()

def run_ps(script, desc):
    sys.stdout.buffer.write(b"\n=== " + desc.encode() + b" ===\n")
    sys.stdout.buffer.flush()
    try:
        r = s.run_ps(script)
        st = 'OK' if r.status_code == 0 else f'FAIL(rc={r.status_code})'
        sys.stdout.buffer.write(f"Status: {st}\n".encode())
        if r.std_out:
            sys.stdout.buffer.write(b"StdOut:\n" + r.std_out[:50000] + b"\n")
        if r.std_err:
            sys.stdout.buffer.write(r.std_err[:10000] + b"\n")
        sys.stdout.buffer.flush()
        return r
    except Exception as e:
        sys.stdout.buffer.write(("Exception: " + str(e) + "\n").encode())
        sys.stdout.buffer.flush()
        return None

CONFIG_DIR = "E:\\IO ServerOnLine"

# Read ALL config files
config_files = [
    "Cfg.ini",
    "Device.ini",
    "IoChannelCfg.ini",
    "IOconfigProject.ini",
    "IOFileServer.ini",
    "IOManLogCfg.ini",
    "IoMonitor.ini",
    "RedunndancyCfg.ini",
    "SqlFilSet.ini",
    "Event.txt",
    "IOManErrorLog.Txt",
]

for cfg in config_files:
    ps = f'''
$ErrorActionPreference="SilentlyContinue"
$f = "{CONFIG_DIR}\\{cfg}"
if(Test-Path $f){{
    Write-Host "=== {cfg} ($((Get-Item $f).Length)B) ==="
    Get-Content $f -Encoding UTF8 -ErrorAction SilentlyContinue | ForEach-Object {{ Write-Host $_ }}
}}
'''
    run_ps(ps, f"Read: {cfg}")

# Also try to read log files
logs = [
    "WIN-F3LV5NR0QCC.LOG",
]

for log in logs:
    ps = f'''
$ErrorActionPreference="SilentlyContinue"
$f = "{CONFIG_DIR}\\{log}"
if(Test-Path $f){{
    $fi = Get-Item $f
    Write-Host "=== {log} ($($fi.Length)B) ==="
    if($fi.Length -lt 200KB){{
        Get-Content $f -Encoding UTF8 -TotalCount 500 -ErrorAction SilentlyContinue | ForEach-Object {{ Write-Host $_ }}
    }} else {{
        Get-Content $f -Encoding UTF8 -TotalCount 200 -ErrorAction SilentlyContinue | ForEach-Object {{ Write-Host $_ }}
        Write-Host "... (truncated, total $($fi.Length)B)"
    }}
}}
'''
    run_ps(ps, f"Read: {log}")

# Also list subdirectories to find any additional configs
ps2 = r'''
$ErrorActionPreference="SilentlyContinue"
$dir = "E:\IO ServerOnLine"
Write-Host "=== Subdirectories ==="
Get-ChildItem -Path $dir -Directory -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_.Name }
Write-Host "`n=== Root non-dmp files ==="
Get-ChildItem -Path $dir -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -ne '.dmp' -or $_.Length -gt 1MB } | ForEach-Object { Write-Host "$($_.Name) [$($_.Length)B] $($_.LastWriteTime)" }
'''
run_ps(ps2, "Directory overview (non-dmp)")

sys.stdout.buffer.write(b"\n===== ALL CONFIG READ =====\n")
