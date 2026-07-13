"""从 ETL 提取 pSpace TCP payload"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# PowerShell script to extract TCP frames from ETL
ps_script = r'''
$etl = "C:\Users\Administrator\pspace_cap2.etl"
Write-Host "Size: $((Get-Item $etl).Length / 1MB) MB"

# Use Message Analyzer format conversion if available
# netsh trace convert with different format
netsh trace convert $etl dump=csv tracefile=C:\Users\Administrator\pspace_cap2.csv 2>&1
Write-Host "CSV created: $((Get-Item 'C:\Users\Administrator\pspace_cap2.csv').Length) bytes"
'''

# Encode as base64 to avoid escaping
b64 = base64.b64encode(ps_script.encode('utf-16-le')).decode()
r = s.run_ps(f"$s=[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('{b64}')); Invoke-Expression $s")
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if 'CLIXML' not in err:
        print('ERR:', err[:300])

# Read CSV
print("\n=== CSV header ===")
r = s.run_cmd(r'cmd /c type C:\Users\Administrator\pspace_cap2.csv 2>nul | more +1 | findstr /N "." | findstr "^[1-9]:" ')
out = r.std_out.decode('gbk', errors='ignore')
lines = out.splitlines()[:30]
for line in lines:
    print(line.strip()[:250])
