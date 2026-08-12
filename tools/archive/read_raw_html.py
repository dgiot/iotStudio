"""
Read HTML file as raw hex to avoid encoding issues
"""
import winrm, os, sys

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

# Read raw bytes as hex dump
ps = r'''
$f = "C:\Users\Administrator\chm_extract\??.htm"
if(Test-Path $f){
    $bytes = [System.IO.File]::ReadAllBytes($f)
    $lines = @()
    $sb = New-Object System.Text.StringBuilder
    for($i=0; $i -lt $bytes.Length -and $i -lt 20000; $i++){
        $sb.AppendFormat("{0:X2}",$bytes[$i]) | Out-Null
        if(($i+1) % 32 -eq 0){
            $lines += $sb.ToString()
            $sb = New-Object System.Text.StringBuilder
        }
    }
    if($sb.Length -gt 0){ $lines += $sb.ToString() }
    foreach($l in $lines){ Write-Host $l }
}
'''
r = s.run_ps(ps)
if r.std_out:
    # Parse hex and decode as GBK
    hex_str = r.std_out.decode('ascii', errors='replace').strip()
    # Remove non-hex chars
    import re
    hex_clean = re.sub(r'[^0-9A-Fa-f]', '', hex_str)
    if hex_clean:
        raw_bytes = bytes.fromhex(hex_clean)
        print(f"Raw bytes: {len(raw_bytes)}")
        # Try GBK decode
        content = raw_bytes.decode('gbk', errors='replace')
        # Find key sections
        sections = [
            ("pro_info", "协议描述"),
            ("safe", "注册登录"),
            ("conneted", "设备连接"),
            ("data_link", "数据传输"),
            ("sun_info", "参数设置"),
        ]
        for anchor, name in sections:
            idx = content.find(f'name="{anchor}"')
            if idx >= 0:
                # Find next anchor or end
                next_anchor = 999999
                for a2, _ in sections:
                    i2 = content.find(f'name="{a2}"', idx + 10)
                    if i2 > 0 and i2 < next_anchor:
                        next_anchor = i2
                if next_anchor == 999999:
                    section_text = content[idx:idx+5000]
                else:
                    section_text = content[idx:next_anchor]
                print(f"\n{'='*60}")
                print(f"Section: {anchor} ({name})")
                print(f"{'='*60}")
                print(section_text[:5000])
    else:
        print("No hex data found")
        print("Raw output:", r.std_out[:1000].decode('ascii', errors='replace'))

sys.stdout.buffer.write(b"\n===== DONE =====\n")
