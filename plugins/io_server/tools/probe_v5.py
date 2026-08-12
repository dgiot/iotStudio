"""
LegacyComm probe v5 - Registration/login patterns + netsh capture
"""
import winrm, os, sys, base64, re

os.environ['NO_PROXY']='192.168.10.131,11.*,172.*'
s=winrm.Session('http://192.168.10.131:5985/wsman',auth=('administrator','CHANGEME'),transport='ntlm',read_timeout_sec=120)

def run_ps(script, desc):
    sys.stdout.buffer.write(f"\n=== {desc} ===\n".encode())
    sys.stdout.buffer.flush()
    try:
        r = s.run_ps(script)
        if r.std_out:
            sys.stdout.buffer.write(r.std_out[:80000])
        sys.stdout.buffer.flush()
        return r
    except Exception as e:
        sys.stdout.buffer.write(f"ERR: {e}\n".encode())
        return None

# ============================================================
# 1. Try registration using device IDs from Event.txt
# ============================================================
device_ids = [
    "240C_8042_F000_2511_0000_0000_0005_10B",
    "240C_8042_F000_2511_0000_0000_0005_CD",
    "240C_8042_F000_2511_0000_0000_0005_CE",
    "240C_8042_F000_2511_0000_0000_0005_CF",
    "240C_8042_F000_2511_0000_0000_0005_DD",
    "240C_8042_F000_2511_0000_0000_0005_DC",
]

for dev_id in device_ids:
    ps = r'''
$T="192.168.10.131";$P=53001
function REG($dev){
    try{
        $c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=3000;$c.SendTimeout=3000;$s=$c.GetStream()
        $reg=[System.Text.Encoding]::ASCII.GetBytes($dev);$s.Write($reg,0,$reg.Length)
        Write-Host ("Sent device ID: "+$dev);Start-Sleep -Milliseconds 1500
        if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host ("  RESP: "+$hx);$ms.Close()}else{Write-Host "  RESP:(timeout)"}
        $s.Close();$c.Close()
    }catch{Write-Host ("  ERR: "+$_)}}
''' + f'REG "{dev_id}"'
    run_ps(ps, f"Reg1: {dev_id[:16]}")

# ============================================================
# 2. Try various registration handshake patterns
# ============================================================
# Define all patterns as (hex_string, description)
patterns = []

# Device ID patterns
did = "240C_8042_F000_2511_0000_0000_0005_10B"
patterns.append((did.encode().hex(), "DeviceID ASCII"))
patterns.append(((did + "\r\n").encode().hex(), "DeviceID+CRLF"))
patterns.append((f"{len(did):02X}".encode().hex() + did.encode().hex(), "Len+DeviceID"))
patterns.append((did.replace("_","").encode().hex(), "DeviceID no underscore"))

# Common handshake patterns
patterns.append(("0000", "0000"))
patterns.append(("FFFFFFFF", "FFFFFFFF"))
patterns.append(("0D0A", "CRLF"))
patterns.append(("4C4F47494E", "LOGIN ASCII"))
patterns.append(("524547", "REG ASCII"))
patterns.append(("014C4F47494E", "0x01+LOGIN"))
patterns.append(("FE", "0xFE"))
patterns.append(("EF", "0xEF"))
patterns.append(("AABB", "AABB"))
patterns.append(("55AA", "55AA"))
patterns.append(("AABBCCDD", "AABBCCDD"))

for hex_data, desc in patterns:
    bcount = len(hex_data) // 2
    ps = r'''
$T="192.168.10.131";$P=53001
try{$c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=3000;$c.SendTimeout=3000;$s=$c.GetStream()
$b=[byte[]]::new(''' + str(bcount) + r''');for($i=0;$i-lt''' + str(len(hex_data)) + r''';$i+=2){$b[$i/2]=[Convert]::ToByte("''' + hex_data + r'''".Substring($i,2),16)}
$s.Write($b,0,$b.Length);Write-Host ("Sent "+''' + str(bcount) + r'''+"B")+":''' + desc + r'''";Start-Sleep -Milliseconds 1500
if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host ("  RESP: "+$hx);$ms.Close()}else{Write-Host "  RESP:(timeout)"}
$s.Close();$c.Close()}catch{Write-Host ("  ERR: "+$_)}
'''
    run_ps(ps, f"Pat: {desc}")

# ============================================================
# 3. Multi-step: Send reg pattern, then send Modbus RTU
# ============================================================
for first_bytes, fdesc in [("4C4F47494E","LOGIN"),("AABB","AABB"),("FE","FE"),("AA","AA")]:
    ps = r'''
$T="192.168.10.131";$P=53001
try{$c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=3000;$c.SendTimeout=3000;$s=$c.GetStream()
$b1=[byte[]]::new(''' + str(len(first_bytes)//2) + r''');for($i=0;$i-lt''' + str(len(first_bytes)) + r''';$i+=2){$b1[$i/2]=[Convert]::ToByte("''' + first_bytes + r'''".Substring($i,2),16)}
$s.Write($b1,0,$b1.Length);Write-Host "Step1:''' + fdesc + r'''";Start-Sleep -Milliseconds 800
if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "  R1:"+$hx;$ms.Close()}else{Write-Host "  R1:(timeout)"}
$b2=[byte[]]::new(12);for($i=0;$i-lt12;$i+=2){$b2[$i/2]=[Convert]::ToByte("01030000000AC5CD".Substring($i,2),16)}
$s.Write($b2,0,$b2.Length);Write-Host "Step2:Modbus01:03";Start-Sleep -Milliseconds 1500
if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "  R2:"+$hx;$ms.Close()}else{Write-Host "  R2:(timeout)"}
$s.Close();$c.Close()}catch{Write-Host "ERR:"+$_}
'''
    run_ps(ps, f"2step: {fdesc}+Modbus")

# ============================================================
# 4. Server push with longer wait (6 seconds)
# ============================================================
run_ps(r'''
$T="192.168.10.131";$P=53001
try{$c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=6000;$s=$c.GetStream()
Write-Host "Connected, waiting 6s for server push..."
Start-Sleep -Seconds 6
if($s.DataAvailable){$buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream;do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable);$hx=[BitConverter]::ToString($ms.ToArray())-replace'-','';Write-Host "PUSH($($ms.Length)B):$hx";$ms.Close()}else{Write-Host "No server push (6s)"}
$s.Close();$c.Close()}catch{Write-Host "ERR:$_"}
''', "Server push 6s")

# ============================================================
# 5. netsh trace capture (60 seconds)
# ============================================================
run_ps(r'''
$ErrorActionPreference="SilentlyContinue"
netsh trace stop 2>&1|Out-Null;Start-Sleep -Seconds 2
netsh trace start capture=yes IPv4.TCPPort=53001 tracefile=C:\Users\Administrator\cb_final.etl maxsize=300 persistent=no overwrite=yes 2>&1
if($LASTEXITCODE -ne 0){
    netsh trace stop 2>&1|Out-Null;Start-Sleep -Seconds 1
    netsh trace start capture=yes tracefile=C:\Users\Administrator\cb_final.etl maxsize=300 persistent=no overwrite=yes 2>&1
}
Write-Host "Capturing 60s at $(Get-Date)...";Start-Sleep -Seconds 60
netsh trace stop 2>&1
if(Test-Path C:\Users\Administrator\cb_final.etl){
    $fi=Get-Item C:\Users\Administrator\cb_final.etl;Write-Host "File:$($fi.Length)B"
    netsh trace convert input=C:\Users\Administrator\cb_final.etl output=C:\Users\Administrator\cb_final.csv dump=csv 2>&1
    if(Test-Path C:\Users\Administrator\cb_final.csv){
        Get-Content C:\Users\Administrator\cb_final.csv -TotalCount 500|ForEach-Object{Write-Host $_}
    }
}
''', "netsh trace 60s")

# ============================================================
# 6. Cleanup
# ============================================================
run_ps(r'''
Remove-Item C:\Users\Administrator\cb_* -Force -ErrorAction SilentlyContinue
Remove-Item C:\Users\Administrator\chm_extract -Recurse -Force -ErrorAction SilentlyContinue
pktmon stop 2>&1|Out-Null;pktmon filter remove 2>&1|Out-Null
netsh trace stop 2>&1|Out-Null
Write-Host "Cleanup done"
''', "Cleanup")

sys.stdout.buffer.write(b"\n===== PROBE V5 DONE =====\n")
