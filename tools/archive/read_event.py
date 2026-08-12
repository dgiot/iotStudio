"""
Read Event.txt using cmd type (no encoding issues)
"""
import winrm, os, sys

os.environ['NO_PROXY']='192.168.10.131,11.*,172.*'
s=winrm.Session('http://192.168.10.131:5985/wsman',auth=('administrator','CHANGEME'),transport='ntlm',read_timeout_sec=60)

# Use PowerShell Get-Content to read Event.txt
r=s.run_ps('$ErrorActionPreference="SilentlyContinue"; Get-Content "E:\\IO ServerOnLine\\Event.txt" -Encoding UTF8 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }')
if r.std_out:
    raw = r.std_out
    print(f"Event.txt size: {len(raw)} bytes")
    sys.stdout.buffer.write(raw[-30000:])
    sys.stdout.buffer.flush()

# Also try to tail the LOG file - use PowerShell Get-Content -Tail
r2=s.run_ps('$ErrorActionPreference=\"SilentlyContinue\"; Get-Content \"E:\\IO ServerOnLine\\WIN-F3LV5NR0QCC.LOG\" -Tail 500 -Encoding UTF8 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }')
if r2.std_out:
    print(f"\nLOG tail lines ({len(r2.std_out)} bytes):")
    sys.stdout.buffer.write(r2.std_out[:30000])
    sys.stdout.buffer.flush()

sys.stdout.buffer.write(b"\n===== DONE =====\n")
