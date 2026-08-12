"""
Read key sections of the CHM HTML using findstr/certutil
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

def run_ps(script, desc):
    sys.stdout.buffer.write(f"\n=== {desc} ===\n".encode())
    sys.stdout.buffer.flush()
    r = s.run_ps(script)
    if r.std_out:
        sys.stdout.buffer.write(r.std_out[:100000])
    sys.stdout.buffer.flush()
    return r

# Method: Use findstr to search for specific patterns in the HTML
run_ps(r'''
$ErrorActionPreference="SilentlyContinue"
$f = "C:\Users\Administrator\chm_extract\??.htm"
Write-Host "=== Extract sections around protocol keywords ==="
$keywords = @("pro_info","safe","conneted","data_link","sun_info","MODBUS","TCP","0x06","0x10","注册","登录","心跳","协议","RTU","报文","帧","字节","校验","CRC")
foreach($kw in $keywords){
    $lines = Select-String -Path $f -Pattern $kw -Encoding Default -ErrorAction SilentlyContinue
    if($lines){
        Write-Host "`n--- Keyword: $kw ($($lines.Count) matches) ---"
        $lines | ForEach-Object {
            Write-Host "  Line $($_.LineNumber): $($_.Line.Trim())"
        }
    }
}
''', "Search keywords in HTML")

# Also try to read the HTML in chunks using cmd
run_ps(r'''
$f = "C:\Users\Administrator\chm_extract\??.htm"
Write-Host "=== File exists: $(Test-Path $f) ==="
$fi = Get-Item $f
Write-Host "Size: $($fi.Length)B"
# Use Get-Content with encoding Default (system's ANSI/GBK)
$lines = Get-Content $f -Encoding Default -ErrorAction SilentlyContinue
Write-Host "Lines: $($lines.Count)"
# Show first 200 lines
for($i=0; $i -lt 200 -and $i -lt $lines.Count; $i++){
    Write-Host "$i: $($lines[$i])"
}
''', "Read HTML first 200 lines as GBK")

# Also try reading the html as UTF-8 to get some English text
run_ps(r'''
$f = "C:\Users\Administrator\chm_extract\??.htm"
$lines = Get-Content $f -Encoding UTF8 -ErrorAction SilentlyContinue
for($i=0; $i -lt 200 -and $i -lt $lines.Count; $i++){
    Write-Host "$i: $($lines[$i])"
}
''', "Read HTML first 200 lines as UTF8")

sys.stdout.buffer.write(b"\n===== DONE =====\n")
