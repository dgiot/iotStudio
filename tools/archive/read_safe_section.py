"""
Read the "Registration/Login" section of the CHM HTML
Use certutil to encode as base64 on remote machine
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
        read_timeout_sec=120
    )

s = get_session()

# Use certutil to base64 encode the file (no encoding issues)
ps = r'''
$f = "C:\Users\Administrator\chm_extract\??.htm"
$b64file = "C:\Users\Administrator\chm_extract\page.b64"
certutil -f -encode $f $b64file > $null 2>&1
if(Test-Path $b64file){
    $fi = Get-Item $b64file
    Write-Host "B64 size: $($fi.Length)B"
    Get-Content $b64file -TotalCount 5000 -Encoding ASCII -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }
    Remove-Item $b64file -Force -ErrorAction SilentlyContinue
}
'''
r = s.run_ps(ps)
if r and r.std_out:
    output = r.std_out.decode('ascii', errors='replace')
    print(f"Output length: {len(output)}")

    # Extract the base64 between BEGIN/END lines
    b64_lines = []
    in_b64 = False
    for line in output.split('\n'):
        if 'BEGIN' in line:
            in_b64 = True
            continue
        if 'END' in line:
            in_b64 = False
            continue
        if in_b64:
            line = line.strip()
            if line:
                b64_lines.append(line)

    b64 = ''.join(b64_lines)
    print(f"Base64 length: {len(b64)}")

    if b64:
        try:
            decoded = base64.b64decode(b64)
            print(f"Decoded: {len(decoded)} bytes")
            # Decode as GBK (charset=gb2312 in HTML)
            content = decoded.decode('gbk', errors='replace')

            # Find key sections
            anchors = ['pro_info', 'safe', 'conneted', 'data_link', 'sun_info']
            names = ['协议描述 Protocol', '注册登录 Register', '设备连接 Connect', '数据传输 Data', '参数设置 Params']

            for i, (anchor, name) in enumerate(zip(anchors, names)):
                idx = content.find(f'name="{anchor}"')
                if idx >= 0:
                    # Find next anchor
                    next_idx = len(content)
                    for a2 in anchors[i+1:]:
                        i2 = content.find(f'name="{a2}"', idx + 10)
                        if i2 > 0 and i2 < next_idx:
                            next_idx = i2

                    section = content[idx:next_idx]
                    # Clean HTML tags
                    clean = re.sub(r'<[^>]+>', '\n', section)
                    clean = re.sub(r'\n+', '\n', clean)
                    clean = re.sub(r'&nbsp;', ' ', clean)
                    clean = re.sub(r'&lt;', '<', clean)
                    clean = re.sub(r'&gt;', '>', clean)
                    clean = re.sub(r'&amp;', '&', clean)

                    print(f"\n{'='*60}")
                    print(f"Section: {anchor} ({name})")
                    print(f"{'='*60}")
                    print(clean[:5000])
        except Exception as e:
            print(f"Decode error: {e}")
            # Print first 500 chars of raw
            print(f"Raw start: {b64[:200]}")

sys.stdout.buffer.write(b"\n===== DONE =====\n")
