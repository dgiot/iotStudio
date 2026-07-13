"""Dump pPluse Tag ID file - contains full device mapping"""
import os, base64, struct
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=25)

# Read pPluse.dat (123KB)
r = s.run_ps(r'$p="E:\IO ServerOnLine\run\TagID_IOCommitDB0_pPluse.dat"; $b=[IO.File]::ReadAllBytes($p); Write-Host ("SIZE="+$b.Length); Write-Host ("B64="+[Convert]::ToBase64String($b))')
out = r.std_out.decode('gbk', errors='ignore').strip()

for line in out.splitlines():
    line = line.strip()
    if line.startswith('SIZE='):
        size = int(line[5:])
    elif line.startswith('B64='):
        data = base64.b64decode(line[4:])
        print(f"Size: {len(data)} bytes")

        # Parse as variable-length string records
        offset = 0
        count = 0
        strings = []
        while offset < len(data) and count < 100:
            if offset + 4 > len(data): break
            slen = struct.unpack('<I', data[offset:offset+4])[0]
            offset += 4
            if slen == 0 or slen > 1000 or offset + slen > len(data):
                break
            s = data[offset:offset+slen].decode('ascii', errors='ignore')
            offset += slen
            strings.append(s)
            count += 1
            # skip padding/terminator
            if offset + 4 <= len(data):
                maybe_term = struct.unpack('<I', data[offset:offset+4])[0]
                if maybe_term == 0xFFFFFFFF:
                    offset += 4

        print(f"Parsed {len(strings)} strings:")
        for i, s in enumerate(strings[:80]):
            print(f"  [{i:3d}] {s[:120]}")

        # Show tail of file
        print(f"\n=== Tail (last 256 bytes) ===")
        tail = data[-256:]
        for i in range(0, len(tail), 32):
            chunk = tail[i:i+32]
            hx = ' '.join(f'{b:02x}' for b in chunk)
            asc = ''.join(chr(b) if 32<=b<127 else '.' for b in chunk)
            print(f'  {i:04x}: {hx:<48s} {asc}')
