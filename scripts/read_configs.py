"""Read critical IoMonitor config files from 131."""
import os
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
os.environ['no_proxy'] = '11.66.12.131,11.*,172.*'
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)

import winrm
s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=60)

def ps(script):
    try:
        r = s.run_ps(script)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:8000]
    except Exception as e:
        return f'ERR: {e}'

def cmd(command):
    try:
        r = s.run_cmd(command)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:8000]
    except Exception as e:
        return f'ERR: {e}'

BASE = r'E:\IO ServerOnLine'

# CRITICAL configs to read
configs = [
    f'{BASE}\\IoMonitor.ini',
    f'{BASE}\\IoChannelCfg.ini',
    f'{BASE}\\SqlFilSet.ini',
    f'{BASE}\\Cfg.ini',
    f'{BASE}\\Device.ini',
    f'{BASE}\\IOconfigProject.ini',
    f'{BASE}\\RedunndancyCfg.ini',
    f'{BASE}\\IO Servers\\IM_A11_RTU\\Cfg.ini',
    f'{BASE}\\IO Servers\\IM_A11_RTU\\Iodesc.TXT',
]

for cfg in configs:
    name = cfg.split('\\')[-1]
    print(f"=== {name} ===")
    # Use type to read (handles encoding)
    result = cmd(f'cmd /c "type \"{cfg}\" 2>nul"')
    if not result or result.strip() == '':
        # Try PS Get-Content
        result = ps(f"Get-Content '{cfg}' -Encoding UTF8 -ErrorAction SilentlyContinue")
    if not result or result.strip() == '':
        result = ps(f"Get-Content '{cfg}' -Encoding Default -ErrorAction SilentlyContinue")
    print(result[:6000] if result else '(empty or not found)')
    print()

# Also read the Data Servers XML configs
for xml_cfg in [
    f'{BASE}\\Data Servers\\eForceCon DB\\eForceCon DB.xml',
    f'{BASE}\\Data Servers\\OPC Server\\OPC Server.xml',
    f'{BASE}\\Data Servers\\pSpace\\pSpace.xml',
]:
    name = xml_cfg.split('\\')[-1]
    print(f"=== {name} ===")
    result = cmd(f'cmd /c "type \"{xml_cfg}\" 2>nul"')
    print(result[:5000] if result else '(empty)')
    print()

# OPC_FC_Client directory
print(f"=== OPC_FC_Client Files ===")
print(cmd(f'cmd /c "dir \"{BASE}\\IO Servers\\OPC_FC_Client\" 2>nul"'))
print()

# run directory
print(f"=== run\\ Directory ===")
print(cmd(f'cmd /c "dir \"{BASE}\\run\" 2>nul"'))
print()

print("=== DONE ===")
