"""
Read extracted CHM HTML files directly from remote machine
"""
import winrm, os, sys, base64, re

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

# Use 'cmd /c type' to read the HTML file and capture as base64 from the bytes
ps1 = r'''
$path = "C:\Users\Administrator\chm_extract\??.htm"
if(Test-Path $path){
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $b64 = [System.Convert]::ToBase64String($bytes)
    # Output as raw bytes directly to stdout (no Write-Host encoding issues)
    [Console]::OutputEncoding = [System.Text.Encoding]::ASCII
    [Console]::Write($b64)
}
'''

r = s.run_ps(ps1)
if r.std_out:
    txt = r.std_out.decode('ascii', errors='replace')
    # The base64 might have CLIXML wrapping, extract it
    # Look for base64 pattern (starts with PCFET0NUWVB)
    m = re.search(r'(PCFET0NUWVB[A-Za-z0-9+/=]+)', txt)
    if m:
        b64 = m.group(1)
        print(f"Base64 length: {len(b64)}")
        # Pad if needed
        padding = 4 - (len(b64) % 4)
        if padding != 4:
            b64 += '=' * padding
        try:
            decoded = base64.b64decode(b64)
            content = decoded.decode('gbk', errors='replace')
            print(f"Decoded: {len(content)} chars")
            print(content[:20000])
        except Exception as e:
            print(f"Decode error: {e}")
            # Try just the first valid part
            print("Raw head:", b64[:200])
    else:
        print("No base64 found")
        print("Head:", txt[:500])

# Also read the HHC (table of contents)
ps2 = r'''
$path = "C:\Users\Administrator\chm_extract\IM_A11_RTU.hhc"
if(Test-Path $path){
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $b64 = [System.Convert]::ToBase64String($bytes)
    [Console]::OutputEncoding = [System.Text.Encoding]::ASCII
    [Console]::Write($b64)
}
'''
r2 = s.run_ps(ps2)
if r2.std_out:
    txt2 = r2.std_out.decode('ascii', errors='replace')
    m2 = re.search(r'([A-Za-z0-9+/=]{50,})', txt2)
    if m2:
        try:
            decoded = base64.b64decode(m2.group(1))
            content = decoded.decode('gbk', errors='replace')
            print(f"\n\n=== TOC (HHC) ===\n{content}")
        except Exception as e:
            print(f"HHC error: {e}")

# Also read HHK (index)
ps3 = r'''
$path = "C:\Users\Administrator\chm_extract\IM_A11_RTU.hhk"
if(Test-Path $path){
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $b64 = [System.Convert]::ToBase64String($bytes)
    [Console]::OutputEncoding = [System.Text.Encoding]::ASCII
    [Console]::Write($b64)
}
'''
r3 = s.run_ps(ps3)
if r3.std_out:
    txt3 = r3.std_out.decode('ascii', errors='replace')
    m3 = re.search(r'([A-Za-z0-9+/=]{50,})', txt3)
    if m3:
        try:
            decoded = base64.b64decode(m3.group(1))
            content = decoded.decode('gbk', errors='replace')
            print(f"\n=== Index (HHK) ===\n{content}")
        except Exception as e:
            print(f"HHK error: {e}")

sys.stdout.buffer.write(b"\n===== DONE =====\n")
