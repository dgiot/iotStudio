"""
LegacyComm protocol probe via WinRM - v4
Splits PS scripts to avoid "command line too long" errors.
Uses unique variable names (not $pid which is reserved).
"""
import winrm, os, sys, time

def get_session():
    for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
        os.environ.pop(k, None)
    os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
    return winrm.Session(
        'http://192.168.10.131:5985/wsman',
        auth=('administrator', r'CHANGEME'),
        transport='ntlm',
        read_timeout_sec=120
    )

s = get_session()
sys.stdout.buffer.write(b"Session created.\n")
sys.stdout.buffer.flush()

def run_ps(script, desc):
    label = f"[{desc}]"
    sys.stdout.buffer.write(b"\n" + b"="*60 + b"\n" + label.encode() + b"\n" + b"="*60 + b"\n")
    sys.stdout.buffer.flush()
    try:
        r = s.run_ps(script)
        st = 'OK' if r.status_code == 0 else f'FAIL(rc={r.status_code})'
        sys.stdout.buffer.write(f"  Status: {st}\n".encode())
        if r.std_out:
            sys.stdout.buffer.write(b"  StdOut (" + str(len(r.std_out)).encode() + b" bytes):\n")
            sys.stdout.buffer.write(r.std_out[:40000] + b"\n")
        if r.std_err:
            sys.stdout.buffer.write(b"  StdErr (" + str(len(r.std_err)).encode() + b" bytes):\n")
            sys.stdout.buffer.write(r.std_err[:20000] + b"\n")
        sys.stdout.buffer.flush()
        return r
    except Exception as e:
        sys.stdout.buffer.write(("  Exception: " + str(e) + "\n").encode())
        sys.stdout.buffer.flush()
        return None

# =====================================================================
# S1: Find LegacyComm PID and path (use wmi, avoid $pid variable)
# =====================================================================
s1 = r'''
$ErrorActionPreference = "SilentlyContinue"
$cbid = $null
$na = netstat -ano | Select-String ":53001" | Select-String "LISTENING"
if ($na) {
    $cbid = [int]($na -replace '.*LISTENING\s+(\d+).*','$1')
}
Write-Host "cbid=$cbid"
if (-not $cbid -or $cbid -eq 0) { Write-Host "ERROR:cbid_not_found"; exit 1 }

# Get process via WMI (more reliable)
$proc = Get-WmiObject Win32_Process -Filter "ProcessId=$cbid" -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "Name=$($proc.Name) Path=$($proc.ExecutablePath) CmdLine=$($proc.CommandLine) Start=$($proc.CreationDate)"
} else {
    Write-Host "ERROR:cannot_get_process_via_wmi"
    $alt = Get-Process -Id $cbid -ErrorAction SilentlyContinue
    if ($alt) { Write-Host "AltName=$($alt.Name) AltPath=$($alt.Path)" }
}
'''

# =====================================================================
# S2: LegacyComm directory listing using cmd (no PowerShell cmdlets)
# =====================================================================
s2 = r'''
$ErrorActionPreference = "SilentlyContinue"
$cbid = [int]((netstat -ano | Select-String ":53001" | Select-String "LISTENING") -replace '.*LISTENING\s+(\d+).*','$1')
if (-not $cbid) { Write-Host "ERROR:no_pid"; exit 1 }
$p = Get-WmiObject Win32_Process -Filter "ProcessId=$cbid" -ErrorAction SilentlyContinue
if (-not $p) { Write-Host "ERROR:no_process"; exit 1 }
$dir = $p.ExecutablePath
Write-Host "ExePath=$dir"
$parent = Split-Path $dir -Parent
Write-Host "Parent=$parent"
# Use cmd dir for speed
cmd /c "dir /b ""$parent"" 2>nul"
cmd /c "dir ""$parent"" 2>nul"
'''

# =====================================================================
# S3: Test single frame
# =====================================================================
def run_frame_test(hex_str, desc):
    ps = r'''
$T="192.168.10.131";$P=53001
function Test-F($h,$d){Write-Host "[$d]";try{$b=[byte[]]::new($h.Length/2);for($i=0;$i-lt$h.Length;$i+=2){$b[$i/2]=[Convert]::ToByte($h.Substring($i,2),16)}
$c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=2000;$c.SendTimeout=2000;$s=$c.GetStream();$s.Write($b,0,$b.Length);Start-Sleep -Milliseconds 800
if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable -and $ms.Length-lt$buf.Length);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "  RESP($($ms.Length)B):$hx";$ms.Close()}else{Write-Host "  RESP:(timeout)"}
$s.Close();$c.Close()}catch{Write-Host "  ERR:$_"}}
''' + f'Test-F "{hex_str}" "{desc}"'
    return run_ps(ps, desc)

# =====================================================================
# S4: Multi-step DTU simulation
# =====================================================================
def run_dtu_test(desc, handshake_hex, payload_hex):
    ps = r'''
$T="192.168.10.131";$P=53001
function DTU($d,$hh,$ph){Write-Host "[DTU:$d]";try{$c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=3000;$c.SendTimeout=3000;$s=$c.GetStream();Write-Host "  Connected"
if($hh){$hb=[byte[]]::new($hh.Length/2);for($i=0;$i-lt$hh.Length;$i+=2){$hb[$i/2]=[Convert]::ToByte($hh.Substring($i,2),16)};$s.Write($hb,0,$hb.Length);Write-Host "  HND($($hb.Length)B):$hh";Start-Sleep -Milliseconds 1500
if($s.DataAvailable){$buf=New-Object byte[]2048;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable -and $ms.Length-lt4096);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "  HND-RESP($($ms.Length)B):$hx";$ms.Close()}else{Write-Host "  HND-RESP:(timeout)"}}
if($ph){$pb=[byte[]]::new($ph.Length/2);for($i=0;$i-lt$ph.Length;$i+=2){$pb[$i/2]=[Convert]::ToByte($ph.Substring($i,2),16)};$s.Write($pb,0,$pb.Length);Write-Host "  PAY($($pb.Length)B):$ph";Start-Sleep -Milliseconds 1500
if($s.DataAvailable){$buf=New-Object byte[]2048;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable -and $ms.Length-lt4096);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "  PAY-RESP($($ms.Length)B):$hx";$ms.Close()}else{Write-Host "  PAY-RESP:(timeout)"}}
Start-Sleep -Milliseconds 1000;if($s.DataAvailable){$buf=New-Object byte[]2048;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable -and $ms.Length-lt4096);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "  EXTRA($($ms.Length)B):$hx";$ms.Close()}
$s.Close();$c.Close()}catch{Write-Host "  ERR:$_"}}
''' + f'DTU "{desc}" "{handshake_hex}" "{payload_hex}"'
    return run_ps(ps, f"DTU: {desc}")

# =====================================================================
# S5: netsh trace short
# =====================================================================
s5 = r'''
$ErrorActionPreference = "SilentlyContinue"
netsh trace stop 2>&1 | Out-Null; Start-Sleep -Seconds 2
Write-Host "Start 30s capture with port filter..."
netsh trace start capture=yes IPv4.TCPPort=53001 tracefile=C:\Users\Administrator\cb_cap.etl maxsize=200 persistent=no overwrite=yes 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Port filter not supported, trying without filter..."
    netsh trace stop 2>&1 | Out-Null; Start-Sleep -Seconds 1
    netsh trace start capture=yes tracefile=C:\Users\Administrator\cb_cap.etl maxsize=200 persistent=no overwrite=yes 2>&1
}
Write-Host "Wait 30s..."; Start-Sleep -Seconds 30
netsh trace stop 2>&1
if(Test-Path C:\Users\Administrator\cb_cap.etl){
    $fi=Get-Item C:\Users\Administrator\cb_cap.etl; Write-Host "File:$($fi.Length)B"
    netsh trace convert input=C:\Users\Administrator\cb_cap.etl output=C:\Users\Administrator\cb_cap.csv dump=csv 2>&1
    if(Test-Path C:\Users\Administrator\cb_cap.csv){
        Write-Host "CSV:"; Get-Content C:\Users\Administrator\cb_cap.csv -TotalCount 200 | ForEach-Object { Write-Host $_ }
    } else { Write-Host "CSV convert failed" }
} else { Write-Host "No file" }
'''

# =====================================================================
# S6: netsh trace long
# =====================================================================
s6 = r'''
$ErrorActionPreference = "SilentlyContinue"
netsh trace stop 2>&1 | Out-Null; Start-Sleep -Seconds 2
Write-Host "Start 120s capture..."
netsh trace start capture=yes tracefile=C:\Users\Administrator\cb_long.etl maxsize=500 persistent=no overwrite=yes 2>&1
Write-Host "Wait 120s at $(Get-Date -Format HH:mm:ss)..."; Start-Sleep -Seconds 120
netsh trace stop 2>&1
Write-Host "Stopped at $(Get-Date -Format HH:mm:ss)"
if(Test-Path C:\Users\Administrator\cb_long.etl){
    $fi=Get-Item C:\Users\Administrator\cb_long.etl; Write-Host "LongFile:$($fi.Length)B"
    netsh trace convert input=C:\Users\Administrator\cb_long.etl output=C:\Users\Administrator\cb_long.csv dump=csv 2>&1
    if(Test-Path C:\Users\Administrator\cb_long.csv){
        Write-Host "LongCSV:"; Get-Content C:\Users\Administrator\cb_long.csv -TotalCount 500 | ForEach-Object { Write-Host $_ }
    } else { Write-Host "CSV convert failed" }
    Get-ChildItem C:\Users\Administrator\cb_* | ForEach-Object { Write-Host "$($_.Name) $($_.Length)B" }
} else { Write-Host "No file" }
'''

# =====================================================================
# S7: pktmon
# =====================================================================
s7 = r'''
$ErrorActionPreference = "SilentlyContinue"
try { $v = pktmon --version 2>&1; Write-Host "pktmon:$v" } catch { Write-Host "pktmon unavailable"; exit }
pktmon stop 2>&1 | Out-Null; Start-Sleep -Seconds 1
pktmon filter add -p 53001 -t tcp 2>&1
pktmon start --etw -m real-time -f C:\Users\Administrator\cb_pkt.etl 2>&1
Write-Host "pktmon 20s..."; Start-Sleep -Seconds 20
pktmon stop 2>&1
if(Test-Path C:\Users\Administrator\cb_pkt.etl){
    $fi=Get-Item C:\Users\Administrator\cb_pkt.etl; Write-Host "PKT:$($fi.Length)B"
    pktmon etl2txt -f C:\Users\Administrator\cb_pkt.etl -o C:\Users\Administrator\cb_pkt.txt 2>&1
    if(Test-Path C:\Users\Administrator\cb_pkt.txt){ Get-Content C:\Users\Administrator\cb_pkt.txt -TotalCount 200 | ForEach-Object { Write-Host $_ } }
}
'''

# =====================================================================
# S8: Cleanup
# =====================================================================
s8 = r'''
$ErrorActionPreference = "SilentlyContinue"
Remove-Item C:\Users\Administrator\cb_* -Force -ErrorAction SilentlyContinue
pktmon stop 2>&1 | Out-Null; pktmon filter remove 2>&1 | Out-Null
netsh trace stop 2>&1 | Out-Null
Write-Host "Cleanup done"
'''

# =====================================================================
# Execute
# =====================================================================
sys.stdout.buffer.write(b"\n\n========== COMMBRIDGE PROBE v4 ==========\n")
sys.stdout.buffer.flush()

# Step 1: Find LegacyComm
run_ps(s1, "S1: Find LegacyComm PID & Path")

# Step 2: List directory
run_ps(s2, "S2: LegacyComm directory (root only)")

# Step 2b: Read config files in the LegacyComm dir (using cmd for listing, GC for content)
run_ps(r'''
$ErrorActionPreference="SilentlyContinue"
$cbid=[int]((netstat -ano|Select-String ":53001"|Select-String "LISTENING")-replace'.*LISTENING\s+(\d+).*','$1')
$p=Get-WmiObject Win32_Process -Filter "ProcessId=$cbid" -ErrorAction SilentlyContinue
if(-not $p){Write-Host "ERROR:no_process";exit 1}
$dir=Split-Path $p.ExecutablePath -Parent
Write-Host "Config files in $dir`:"
cmd /c "dir /b ""$dir\*.ini"" ""$dir\*.cfg"" ""$dir\*.xml"" ""$dir\*.config"" ""$dir\*.json"" ""$dir\*.yaml"" ""$dir\*.yml"" ""$dir\*.txt"" ""$dir\*.log"" ""$dir\*.dat"" ""$dir\*.properties"" 2>nul"
''', "S2b: List config files")

# Step 3: Frame tests (split to avoid "cmd line too long")
modbus_rtu_frames = [
    ("01030000000AC5CD", "RTU 01:03 addr0 cnt10"),
    ("010300000001840A", "RTU 01:03 addr0 cnt1"),
    ("010300000019045C", "RTU 01:03 addr0 cnt25"),
    ("02030000000845F8", "RTU 02:03 addr0 cnt8"),
    ("03030000000804EE", "RTU 03:03 addr0 cnt8"),
    ("FF030000000A8010", "RTU FF:03 addr0 cnt10"),
    ("010100000001AC0A", "RTU 01:01 coil addr0 cnt1"),
    ("010400000001B1CA", "RTU 01:04 inputReg addr0 cnt1"),
    ("01050000FF008CFA", "RTU 01:05 coil addr0=ON"),
    ("01060000000189CA", "RTU 01:06 reg addr0=1"),
]
for h, d in modbus_rtu_frames:
    run_frame_test(h, d)

addr_frames = [
    ("010300640001D5CB", "RTU 01:03 addr100 cnt1"),
    ("010300C8000155CB", "RTU 01:03 addr200 cnt1"),
    ("01030190000155CB", "RTU 01:03 addr400 cnt1"),
    ("010303E80001D4DA", "RTU 01:03 addr1000 cnt1"),
    ("010307D00001D4DA", "RTU 01:03 addr2000 cnt1"),
    ("010300000032C400", "RTU 01:03 addr0 cnt50"),
    ("0103000000644000", "RTU 01:03 addr0 cnt100"),
    ("0103000000FAC580", "RTU 01:03 addr0 cnt250"),
    ("01040000000AF1C1", "RTU 01:04 addr0 cnt10"),
]
for h, d in addr_frames:
    run_frame_test(h, d)

func_frames = [
    ("010F0000000A0201FFCC", "RTU 01:0F coils addr0=10"),
    ("01100000000A1400100A1D4CC0", "RTU 01:10 regs addr0 cnt10"),
    ("0108000000F0F0", "RTU 01:08 diag"),
    ("0111000000F0F0", "RTU 01:11 slaveID"),
    ("01030000000AC5CE", "RTU CRC error C5CE"),
    ("01030000000A0000", "RTU CRC=0000"),
]
for h, d in func_frames:
    run_frame_test(h, d)

tcp_frames = [
    ("00000000000601030000000A", "TCP 01:03 addr0 cnt10"),
    ("000100000006010300000001", "TCP tid=1 01:03 addr0 cnt1"),
    ("000000000006010300000032", "TCP 01:03 addr0 cnt50"),
]
for h, d in tcp_frames:
    run_frame_test(h, d)

ascii_frames = [
    ("38363039333230333431313039333230", "IMEI 8609320341109320"),
    ("38363039333230333534353134393630", "IMEI 8609320354514960"),
    ("4142313233343536373839", "ASCII AB123456789"),
    ("353138373632303030303030303030", "ASCII 5187620000000"),
]
for h, d in ascii_frames:
    run_frame_test(h, d)

prefix_frames = [
    ("7E01030000000AC5CD", "7E+RTU"),
    ("000B01030000000AC5CD", "2B-len+RTU"),
    ("AABB01030000000AC5CD", "AABB+RTU"),
    ("FE01030000000AC5CD", "FE+RTU"),
    ("CDAB01030000000AC5CD", "CDAB+RTU"),
    ("3A3031303330303030303030410D0A", "ModbusASCII"),
]
for h, d in prefix_frames:
    run_frame_test(h, d)

raw_frames = [
    ("0000000000000000", "8x00"),
    ("FFFFFFFFFFFFFFFF", "8xFF"),
    ("AAAA", "AAAA"),
    ("AAAA5555", "AAAA5555"),
    ("55AA", "55AA"),
    ("0000", "0000"),
    ("FFFF", "FFFF"),
    ("FE", "FE"),
    ("EF", "EF"),
    ("0100", "0100"),
    ("AABB", "AABB"),
]
for h, d in raw_frames:
    run_frame_test(h, d)

# DTU multi-step tests
dtu_tests = [
    ("Plain RTU 01:03", "", "01030000000AC5CD"),
    ("IMEI reg + RTU", "38363039333230333431313039333230", "01030000000AC5CD"),
    ("IMEI+CR+RTU", "383630393332303335343531343936300D0A", "01030000000AC5CD"),
    ("Station 01 only + RTU", "01", "01030000000AC5CD"),
    ("AA+RTU", "AA", "01030000000AC5CD"),
    ("AAAA+RTU", "AAAA", "01030000000AC5CD"),
    ("55AA+RTU", "55AA", "01030000000AC5CD"),
    ("L-prefix+RTU", "0C", "01030000000AC5CD"),
    ("2B-len+RTU", "000C", "01030000000AC5CD"),
    ("No data wait", "", ""),
    ("7E+RTU", "7E", "01030000000AC5CD"),
    ("FE+RTU", "FE", "01030000000AC5CD"),
    ("AAAA+IMEI+RTU", "AAAA38363039333230333431313039333230", "01030000000AC5CD"),
    ("Send multi RTU", "", "01030000000AC5CD"),
]
for desc, hnd, pay in dtu_tests:
    run_dtu_test(desc, hnd, pay)

# Server push test
run_ps(r'''
$T="192.168.10.131";$P=53001
try{$c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=3000;$s=$c.GetStream();Start-Sleep -Seconds 3
if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "ServerPush($($ms.Length)B):$hx";$ms.Close()}else{Write-Host "NoServerPush"}
$s.Close();$c.Close()}catch{Write-Host "ERR:$_"}
''', "Server push test (3s)")

# Capture
run_ps(s5, "S5: netsh trace 30s")
run_ps(s6, "S6: netsh trace 120s")
run_ps(s7, "S7: pktmon capture")
run_ps(s8, "S8: Cleanup")

sys.stdout.buffer.write(b"\n\n===== ALL DONE =====\n")
