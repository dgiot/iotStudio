"""
Extract CHM HTML content with proper GBK encoding
"""
import winrm, os, sys, base64

def get_session():
    for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
        os.environ.pop(k, None)
    os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
    return winrm.Session(
        'http://192.168.10.131:5985/wsman',
        auth=('administrator', r'CHANGEME'),
        transport='ntlm',
        read_timeout_sec=60
    )

s = get_session()

def run_ps(script, desc):
    sys.stdout.buffer.write(f"\n=== {desc} ===\n".encode())
    sys.stdout.buffer.flush()
    r = s.run_ps(script)
    if r.std_out:
        sys.stdout.buffer.write(r.std_out[:100000])
    sys.stdout.buffer.flush()
    return r

# Read the extracted HTML files with GBK encoding as base64
ps1 = r'''
$dir = "C:\Users\Administrator\chm_extract"
$files = Get-ChildItem -Path $dir -Filter "*.htm" -ErrorAction SilentlyContinue
foreach($f in $files){
    Write-Host ("`nFILE: " + $f.Name + " [" + $f.Length + "B]")
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $b64 = [System.Convert]::ToBase64String($bytes)
    Write-Host $b64
}
'''
raw = run_ps(ps1, "CHM extracted HTML files")
if raw and raw.std_out:
    import re
    txt = raw.std_out.decode('ascii', errors='replace')
    # Split by FILE: markers
    parts = re.split(r'FILE: ([^\[]+) \[(\d+)B\]', txt)
    for i in range(1, len(parts)-2, 3):
        fname = parts[i].strip()
        fsize = parts[i+1].strip()
        b64 = parts[i+2].strip()
        # Extract the base64
        b64_match = re.search(r'([A-Za-z0-9+/=]{100,})', b64)
        if b64_match:
            try:
                decoded = base64.b64decode(b64_match.group(1))
                sys.stdout.buffer.write(f"\n--- {fname} (decoded {len(decoded)} bytes) ---\n".encode())
                # Try UTF-8 first, then GBK
                try:
                    content = decoded.decode('utf-8')
                except:
                    content = decoded.decode('gbk', errors='replace')
                sys.stdout.buffer.write(content.encode('utf-8', errors='replace')[:30000])
            except Exception as e:
                sys.stdout.buffer.write(f"  decode err: {e}\n".encode())

sys.stdout.buffer.write(b"\n===== DONE =====\n")
