"""
Step 1: Download CommBridge.exe, PDB, and associated DLLs from 11.66.12.131 via WinRM.
"""
import winrm, os, base64, hashlib, re, json

# Setup - disable proxies
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'

LOCAL_DIR = "D:/ai/dgiot_lite/reverse/commbridge/downloaded"
os.makedirs(LOCAL_DIR, exist_ok=True)

s = winrm.Session('http://11.66.12.131:5985/wsman',
                  auth=('administrator', r'GKYWB-5991792$1c8k'),
                  transport='ntlm', read_timeout_sec=120)

def run_ps(session, cmd):
    """Run PowerShell command and return stdout decoded as gbk."""
    r = session.run_ps(cmd)
    if r.status_code != 0:
        print(f"WARN: exit code {r.status_code}")
    return r.std_out.decode('gbk', errors='ignore')

def run_cmd(session, cmd):
    """Run cmd.exe command and return stdout decoded as gbk."""
    r = session.run_cmd(cmd)
    if r.status_code != 0:
        print(f"WARN: exit code {r.status_code}")
    return r.std_out.decode('gbk', errors='ignore')

def download_file_via_certutil(session, remote_path, local_filename):
    """
    Download a file from remote via certutil base64 encoding.
    Returns local path and md5.
    """
    local_path = os.path.join(LOCAL_DIR, local_filename)
    b64_tmp = f"C:\\Users\\Administrator\\_{local_filename}.b64"

    print(f"  Encoding: {remote_path} -> {b64_tmp}")
    r = session.run_ps(f"certutil -encode '{remote_path}' '{b64_tmp}'")
    if r.status_code != 0:
        err = r.std_err.decode('gbk', errors='ignore') if r.std_err else ''
        print(f"  ERROR encoding: {err}")
        return None, None

    # Read the b64 content
    r = session.run_ps(f"Get-Content '{b64_tmp}' -Raw")
    if r.status_code != 0:
        err = r.std_err.decode('gbk', errors='ignore') if r.std_err else ''
        print(f"  ERROR reading b64: {err}")
        return None, None

    b64_text = r.std_out.decode('gbk', errors='ignore')

    # Clean up remote temp file
    session.run_ps(f"Remove-Item '{b64_tmp}' -Force -ErrorAction SilentlyContinue")

    # Remove certutil header/footer lines
    lines = []
    in_body = False
    for line in b64_text.split('\n'):
        stripped = line.strip()
        if stripped.startswith('-----BEGIN CERTIFICATE-----'):
            in_body = True
            continue
        if stripped.startswith('-----END CERTIFICATE-----'):
            in_body = False
            continue
        if in_body and stripped:
            lines.append(stripped)

    b64_data = ''.join(lines)

    try:
        data = base64.b64decode(b64_data)
    except Exception as e:
        print(f"  ERROR decoding base64: {e}")
        print(f"  First 200 chars: {b64_text[:200]}")
        return None, None

    with open(local_path, 'wb') as f:
        f.write(data)

    md5 = hashlib.md5(data).hexdigest()
    sha256 = hashlib.sha256(data).hexdigest()

    print(f"  Downloaded: {local_path} ({len(data)} bytes, MD5: {md5})")

    return local_path, md5

print("=" * 60)
print("Step 1: Locating and downloading CommBridge files")
print("=" * 60)

# 1. Get CommBridge process path
print("\n[1] Finding CommBridge.exe path...")
ps_out = run_ps(s, "(Get-Process CommBridge -ErrorAction SilentlyContinue).Path")
if not ps_out.strip():
    # Try alternative
    ps_out = run_ps(s, "Get-WmiObject Win32_Process -Filter \"Name='CommBridge.exe'\" | Select-Object -ExpandProperty ExecutablePath")
if not ps_out.strip():
    ps_out = run_ps(s, "Get-CimInstance Win32_Process -Filter \"Name='CommBridge.exe'\" | Select-Object -ExpandProperty ExecutablePath")

exe_path = ps_out.strip().split('\n')[0].strip() if ps_out.strip() else ''
print(f"  CommBridge.exe path: {exe_path}")

if not exe_path:
    print("  ERROR: Could not find CommBridge process!")
    # Try directory listing
    dirs_to_try = [
        "C:\\Program Files\\CommBridge",
        "C:\\Program Files (x86)\\CommBridge",
        "C:\\CommBridge",
        "D:\\CommBridge",
        "C:\\Program Files\\DG\\CommBridge",
        "C:\\Program Files (x86)\\DG\\CommBridge",
    ]
    for d in dirs_to_try:
        r = session.run_ps(f"Test-Path '{d}'")
        exists = r.std_out.decode('gbk', errors='ignore').strip()
        if exists:
            print(f"  Found directory: {d}")
            listing = run_ps(s, f"Get-ChildItem '{d}' | Select-Object Name, Length")
            print(f"  Contents:\n{listing}")

    print("\n  Trying broader search...")
    search_out = run_ps(s, "Get-ChildItem -Path C:\\ -Filter CommBridge.exe -Recurse -ErrorAction SilentlyContinue | Select-Object FullName")
    print(f"  Search results:\n{search_out}")
    exit(1)

exe_dir = os.path.dirname(exe_path)
print(f"  Directory: {exe_dir}")

# 2. List directory contents
print(f"\n[2] Listing directory: {exe_dir}")
listing = run_ps(s, f"Get-ChildItem '{exe_dir}' | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize -Wrap")
print(f"  {listing}")

# 3. Download CommBridge.exe
print(f"\n[3] Downloading CommBridge.exe...")
download_file_via_certutil(s, exe_path, "CommBridge.exe")

# 4. Find and download PDB files
print(f"\n[4] Searching for PDB files...")

# Check same directory for PDB
pdb_check = run_ps(s, f"Get-ChildItem '{exe_dir}' -Filter *.pdb | Select-Object Name, Length")
print(f"  PDB files in exe dir:\n{pdb_check}")

# Search for PDB more broadly
pdb_search = run_ps(s, f"Get-ChildItem -Path C:\\ -Filter CommBridge*.pdb -Recurse -ErrorAction SilentlyContinue | Select-Object FullName, Length")
print(f"  PDB search results:\n{pdb_search}")

pdb_search2 = run_ps(s, f"Get-ChildItem -Path 'C:\\Program Files' -Filter *.pdb -Recurse -ErrorAction SilentlyContinue | Select-Object FullName, Length | Format-Table -AutoSize")
print(f"  All PDBs in Program Files:\n{pdb_search2}")

# Download PDB from same directory as exe
pdb_path = os.path.join(exe_dir, "CommBridge.pdb")
pdb_check2 = run_ps(s, f"Test-Path '{pdb_path}'")
if 'True' in pdb_check2:
    print(f"\n  Downloading CommBridge.pdb...")
    download_file_via_certutil(s, pdb_path, "CommBridge.pdb")
else:
    print(f"  No CommBridge.pdb found at {pdb_path}")

# Check for any other PDBs in the directory
pdb_list_out = run_ps(s, f"Get-ChildItem '{exe_dir}' -Filter *.pdb | Select-Object FullName")
for line in pdb_list_out.strip().split('\n'):
    line = line.strip()
    if line and line != 'FullName' and '---' not in line:
        print(f"  Downloading additional PDB: {line}")
        fname = os.path.basename(line)
        download_file_via_certutil(s, line, fname)

# 5. Download all DLLs from the same directory
print(f"\n[5] Downloading DLL from exe directory...")
dll_list = run_ps(s, f"Get-ChildItem '{exe_dir}' -Filter *.dll | Select-Object Name, Length")
print(f"  DLLs:\n{dll_list}")

dll_full = run_ps(s, f"Get-ChildItem '{exe_dir}' -Filter *.dll | Select-Object FullName")
for line in dll_full.strip().split('\n'):
    line = line.strip()
    if line and line != 'FullName' and '---' not in line:
        fname = os.path.basename(line)
        print(f"  Downloading: {line}")
        download_file_via_certutil(s, line, fname)

# 6. Also check for config files
print(f"\n[6] Checking for config files...")
config_files = run_ps(s, f"Get-ChildItem '{exe_dir}' -Include *.ini,*.cfg,*.xml,*.conf,*.txt,*.json -Name")
print(f"  Config files:\n{config_files}")

# 7. Generate file manifest
print("\n" + "=" * 60)
print("Download complete. Generating manifest...")
print("=" * 60)

manifest = {}
for f in os.listdir(LOCAL_DIR):
    fpath = os.path.join(LOCAL_DIR, f)
    if os.path.isfile(fpath):
        with open(fpath, 'rb') as fh:
            data = fh.read()
        manifest[f] = {
            'size': len(data),
            'md5': hashlib.md5(data).hexdigest(),
            'sha256': hashlib.sha256(data).hexdigest(),
        }

manifest_path = os.path.join(LOCAL_DIR, "manifest.json")
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print(f"Manifest written to: {manifest_path}")
for name, info in manifest.items():
    print(f"  {name}: {info['size']} bytes, MD5={info['md5']}")

print("\nStep 1 complete!")
