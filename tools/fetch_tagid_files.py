"""Download TagID files from 131"""
import os, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=20, operation_timeout_sec=15)

# List files
r = s.run_cmd(r'cmd /c dir "E:\IO ServerOnLine\run\*RTDB*" "E:\IO ServerOnLine\run\*pPluse*" 2>nul')
print("=== Files ===")
print(r.std_out.decode('gbk', errors='ignore').strip())

# Read RTDB.dat via PowerShell and transfer as base64
ps = r'''
$path = "E:\IO ServerOnLine\run\TagID_IOCommitDB0_RTDB.dat"
$bytes = [IO.File]::ReadAllBytes($path)
$b64 = [Convert]::ToBase64String($bytes)
Write-Host "SIZE=$($bytes.Length)"
Write-Host "B64=$b64"
'''
r = s.run_ps(ps)
out = r.std_out.decode('gbk', errors='ignore').strip()
print("\n=== RTDB.dat ===")
for line in out.splitlines():
    if line.startswith('SIZE='):
        size = int(line.split('=')[1])
        print(f"Size: {size} bytes")
    elif line.startswith('B64='):
        b64 = line[4:]
        data = base64.b64decode(b64)
        print(f"Decoded: {len(data)} bytes")
        # Try to parse as binary struct
        import struct
        # TagID_ format: likely [uint32 count][(uint32 tag_id, uint32 device_id)...]
        if len(data) >= 4:
            header = struct.unpack('<I', data[0:4])[0]
            print(f"Header: {header} (0x{header:08X})")
            # Try as count
            if header < 10000 and len(data) >= 4 + header * 8:
                print(f"Looks like {header} tag entries:")
                for i in range(min(header, 30)):
                    off = 4 + i * 8
                    if off + 8 <= len(data):
                        tid, did = struct.unpack('<II', data[off:off+8])
                        print(f"  [{i}] tag={tid} val={did}")
            else:
                print(f"Raw hex (first 256B): {data[:256].hex()}")
