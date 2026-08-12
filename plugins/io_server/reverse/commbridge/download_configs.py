"""
Download critical config files from LegacyComm directory on 192.168.10.131
"""
import winrm, os, base64, hashlib

for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'

REMOTE_DIR = r"E:\IO ServerOnLine"
LOCAL_DIR = "D:/ai/dgiot_lite/reverse/commbridge/downloaded"

s = winrm.Session('http://192.168.10.131:5985/wsman',
                  auth=('administrator', r'CHANGEME'),
                  transport='ntlm', read_timeout_sec=120)

def run_ps(cmd):
    r = s.run_ps(cmd)
    return r.std_out.decode('gbk', errors='ignore')

def download_file(remote_path, local_filename):
    local_path = os.path.join(LOCAL_DIR, local_filename)
    b64_tmp = f"C:\\Users\\Administrator\\_cfg_{local_filename}.b64"
    print(f"  Downloading: {remote_path}")

    r = s.run_ps(f"certutil -encode '{remote_path}' '{b64_tmp}'")
    if r.status_code != 0:
        err = r.std_err.decode('gbk', errors='ignore') if r.std_err else ''
        print(f"  ERROR: {err}")
        return None

    r = s.run_ps(f"Get-Content '{b64_tmp}' -Raw")
    s.run_ps(f"Remove-Item '{b64_tmp}' -Force -ErrorAction SilentlyContinue")

    b64_text = r.std_out.decode('gbk', errors='ignore')
    in_body = False
    lines = []
    for line in b64_text.split('\n'):
        stripped = line.strip()
        if stripped.startswith('-----BEGIN CERTIFICATE-----'):
            in_body = True; continue
        if stripped.startswith('-----END CERTIFICATE-----'):
            in_body = False; continue
        if in_body and stripped:
            lines.append(stripped)

    try:
        data = base64.b64decode(''.join(lines))
        with open(local_path, 'wb') as f:
            f.write(data)
        md5 = hashlib.md5(data).hexdigest()
        print(f"    -> {local_path} ({len(data)} bytes, MD5: {md5})")
        return local_path
    except Exception as e:
        print(f"    ERROR: {e}")
        return None

config_files = [
    "Device.ini",
    "IoChannelCfg.ini",
    "IOconfigProject.ini",
    "IOFileServer.ini",
    "RedunndancyCfg.ini",
    "SqlFilSet.ini",
    "Cfg.ini",
    "Driver.back",
]

print("Downloading config files...")
for cf in config_files:
    remote = os.path.join(REMOTE_DIR, cf)
    download_file(remote, cf)

# Download port directory files (may contain connection info)
print("\nDownloading port directory files...")
port_files = run_ps(f"Get-ChildItem '{REMOTE_DIR}\\port' | Select-Object Name | Format-Table -HideTableHeaders")
for line in port_files.strip().split('\n'):
    fname = line.strip()
    if fname:
        remote = f"{REMOTE_DIR}\\port\\{fname}"
        download_file(remote, f"port_{fname}")

# Download DTU directory files
print("\nDownloading DTU directory files...")
dtu_files = run_ps(f"Get-ChildItem '{REMOTE_DIR}\\DTU' | Select-Object Name | Format-Table -HideTableHeaders")
for line in dtu_files.strip().split('\n'):
    fname = line.strip()
    if fname:
        remote = f"{REMOTE_DIR}\\DTU\\{fname}"
        download_file(remote, f"DTU_{fname}")

print("\nConfig download complete!")
