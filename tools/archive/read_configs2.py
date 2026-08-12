"""
Read config files using raw byte base64 to avoid any encoding corruption
"""
import winrm, os, sys, base64

def get_session():
    for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
        os.environ.pop(k, None)
    os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
    return winrm.Session(
        'http://127.0.0.1:5985/wsman',
        auth=('administrator', r'CHANGEME'),
        transport='ntlm',
        read_timeout_sec=60
    )

s = get_session()

def run_ps_raw(script, desc):
    """Run PS and return raw stdout bytes"""
    sys.stdout.buffer.write(f"\n=== {desc} ===\n".encode())
    sys.stdout.buffer.flush()
    try:
        r = s.run_ps(script)
        if r.std_out:
            return r.std_out.strip()
        return b""
    except Exception as e:
        sys.stdout.buffer.write(f"ERR: {e}\n".encode())
        return b""

# Read files as raw bytes, base64 encode
KEY_FILES = [
    "Device.ini",
    "IoChannelCfg.ini",
    "IOconfigProject.ini",
    "IoMonitor.ini",
    "IOFileServer.ini",
    "RedunndancyCfg.ini",
    "SqlFilSet.ini",
]

for fname in KEY_FILES:
    ps = f'''
$path = "E:\\IO ServerOnLine\\{fname}"
if(Test-Path $path){{
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $b64 = [System.Convert]::ToBase64String($bytes)
    Write-Host $b64
}}
'''
    raw = run_ps_raw(ps, fname)
    if raw:
        try:
            # The output might have CLIXML wrapped around it
            # Try to find base64 pattern within the output
            txt = raw.decode('ascii', errors='replace')
            # Extract base64 (it's only chars: A-Za-z0-9+/=)
            import re
            b64_match = re.search(r'^([A-Za-z0-9+/=]+)', txt)
            if b64_match:
                b64 = b64_match.group(1)
                decoded = base64.b64decode(b64)
                # Try UTF-8 first, then GBK
                try:
                    content = decoded.decode('utf-8')
                except:
                    content = decoded.decode('gbk', errors='replace')
                print(f"\n{fname} ({len(content)} chars):")
                print(content[:10000])
        except Exception as e:
            print(f"  decode err: {e}")

# Also read Event.txt (last 200 lines) and LOG tail
ps2 = r'''
$path = "E:\IO ServerOnLine\Event.txt"
if(Test-Path $path){
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $b64 = [System.Convert]::ToBase64String($bytes)
    Write-Host $b64
}
'''
raw = run_ps_raw(ps2, "Event.txt")
if raw:
    import re
    txt = raw.decode('ascii', errors='replace')
    b64_match = re.search(r'([A-Za-z0-9+/=]+)', txt)
    if b64_match:
        try:
            decoded = base64.b64decode(b64_match.group(1))
            content = decoded.decode('utf-8', errors='replace')
            print(f"\nEvent.txt ({len(content)} chars) - LAST 200 LINES:")
            print('\n'.join(content.split('\n')[-200:]))
        except Exception as e:
            print(f"  err: {e}")

# LOG tail
ps3 = r'''
$path = "E:\IO ServerOnLine\WIN-F3LV5NR0QCC.LOG"
if(Test-Path $path){
    $fi = Get-Item $path
    Write-Host "LOG size: $($fi.Length) bytes"
    $lines = Get-Content $path -Tail 200 -Encoding UTF8 -ErrorAction SilentlyContinue
    $content = $lines -join "`n"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
    $b64 = [System.Convert]::ToBase64String($bytes)
    Write-Host $b64
}
'''
raw = run_ps_raw(ps3, "LOG tail 200")
if raw:
    import re
    txt = raw.decode('ascii', errors='replace')
    # Find last base64 block (after "LOG size: X bytes" line)
    parts = re.findall(r'([A-Za-z0-9+/=]{100,})', txt)
    if parts:
        b64 = parts[-1]  # Last base64 block
        try:
            decoded = base64.b64decode(b64)
            content = decoded.decode('utf-8', errors='replace')
            print(f"\nLOG tail (last 200 lines):")
            print(content[:10000])
        except Exception as e:
            print(f"  err: {e}")

sys.stdout.buffer.write(b"\n===== DONE =====\n")
