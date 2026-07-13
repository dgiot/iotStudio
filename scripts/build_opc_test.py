"""Build 32-bit OPC DA test on 131 — 3 steps: upload, compile, run"""
import os, base64, time
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
os.environ['no_proxy'] = '11.66.12.131,11.*,172.*'
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)

import winrm
s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=90)

def ps(script):
    try:
        r = s.run_ps(script)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:8000]
    except Exception as e:
        return f'PS_ERR: {e}'

def cmd(command):
    try:
        r = s.run_cmd(command)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:8000]
    except Exception as e:
        return f'CMD_ERR: {e}'

# Read C# source and base64 encode
with open(r'D:\ai\dgiot_lite\opc_package\OpcTest.cs', 'rb') as f:
    cs_b64 = base64.b64encode(f.read()).decode()
print(f"C# source: {len(cs_b64)} bytes base64")

# === STEP 1: Upload via certutil (chunked echo) ===
print("\n=== STEP 1: Upload ===")
# Write base64 in chunks of 5000 chars
with open(r'D:\ai\dgiot_lite\scripts\_up.py', 'r') as f:
    pass  # just checking it exists

# Actually, let's just try small chunks via run_ps
chunk_sz = 4000
chunks = [cs_b64[i:i+chunk_sz] for i in range(0, len(cs_b64), chunk_sz)]
print(f"Uploading in {len(chunks)} chunks...")

# First chunk - create file
r = ps(f"[System.IO.File]::WriteAllText('D:\\temp\\ot.b64', '{chunks[0]}')")
print(f"  Chunk 0: OK" if "ERR" not in r else f"  Chunk 0: {r[:100]}")

# Remaining chunks - append
for i, chunk in enumerate(chunks[1:], 1):
    r = ps(f"[System.IO.File]::AppendAllText('D:\\temp\\ot.b64', '{chunk}')")
    if i % 10 == 0:
        print(f"  Chunk {i}/{len(chunks)-1}: OK" if "ERR" not in r else f"  Chunk {i}: {r[:80]}")

# Decode
print("\nDecoding...")
print(cmd('certutil -decode D:\\temp\\ot.b64 D:\\temp\\OpcTest.cs'))

# Verify
print("\nVerify source...")
print(cmd('dir D:\\temp\\OpcTest.cs'))

# === STEP 2: Compile 32-bit ===
print("\n=== STEP 2: Compile ===")
compile_result = ps(r"""
$csc = 'C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe'
& $csc /platform:x86 /target:exe /reference:D:\Bin\OpcRcw.Da.dll /reference:D:\Bin\OpcRcw.Comn.dll /out:D:\temp\OpcTest.exe D:\temp\OpcTest.cs 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host 'OK'; dir D:\temp\OpcTest.exe } else { Write-Host "FAILED: exit=$LASTEXITCODE" }
""")
print(compile_result)

# === STEP 3: Test all OPC servers ===
print("\n=== STEP 3: Test OPC Servers ===")
for target in [
    ('172.23.9.23', 'RSLinx OPC Server'),
    ('172.23.18.194', 'RSLinx OPC Server'),
    ('172.26.6.3', 'RSLinx OPC Server'),
    ('172.23.9.3', 'RSLinx OPC Server'),
]:
    host, progid = target
    print(f"\n--- {host} ---")
    print(cmd(f'D:\\temp\\OpcTest.exe {host} "{progid}"'))
    time.sleep(2)

print("\n=== DONE ===")
