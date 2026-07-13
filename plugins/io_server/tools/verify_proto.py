"""
Final verification: Try the correct registration format 0xAA + slave + ASCII ID + 0x0D
"""
import winrm, os, sys

os.environ['NO_PROXY']='11.66.12.131,11.*,172.*'
s=winrm.Session('http://11.66.12.131:5985/wsman',auth=('administrator','GKYWB-5991792$1c8k'),transport='ntlm',read_timeout_sec=60)

# Try registration with 0xAA + slave=1 + ASCII device ID + 0x0D
# Registration frame: AA 01 30 32 32 30 34 30 36 30 31 30 30 0D
# This means: 0xAA, slave=1, ASCII "02204060100", 0x0D
ps=r'''
$T="11.66.12.131";$P=53001
try{
    $c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=5000;$c.SendTimeout=3000;$s=$c.GetStream()
    Write-Host "Connected"

    # Attempt 1: 0xAA + slave=1 + ASCII ID "02204060100" + 0x0D as documented
    $hb=[byte[]]::new(14);$hb[0]=0xAA;$hb[1]=0x01
    $ascii=[System.Text.Encoding]::ASCII.GetBytes("02204060100")
    for($i=0;$i-lt$ascii.Length;$i++){$hb[2+$i]=$ascii[$i]}
    $hb[13]=0x0D
    $s.Write($hb,0,$hb.Length)
    Write-Host "Sent: 0xAA+slave=1+ID=02204060100+0x0D"
    Start-Sleep -Milliseconds 2000
    if($s.DataAvailable){
        $buf=New-Object byte[]4096;$ms=New-Object System.IO.MemoryStream
        do{$r=$s.Read($buf,0,$buf.Length);if($r-gt0){$ms.Write($buf,0,$r)}}while($s.DataAvailable -and $ms.Length-lt4096)
        $hx=[BitConverter]::ToString($ms.ToArray())-replace'-',''
        Write-Host "REG-RESP($($ms.Length)B):$hx"
        # Try sending query after registration
        if($ms.Length -gt 0){
            Start-Sleep -Milliseconds 500
            $q=[byte[]]::new(12);$q[0]=1;$q[1]=0;$q[2]=0;$q[3]=0;$q[4]=0;$q[5]=6;$q[6]=1;$q[7]=3;$q[8]=0;$q[9]=0;$q[10]=0;$q[11]=10
            $s.Write($q,0,$q.Length)
            Write-Host "Sent query: Seq=1 Flags=0 Len=6 Slave=1 Func=3 Addr=0 Qty=10"
            Start-Sleep -Milliseconds 2000
            if($s.DataAvailable){
                $buf2=New-Object byte[]4096;$ms2=New-Object System.IO.MemoryStream
                do{$r=$s.Read($buf2,0,$buf2.Length);if($r-gt0){$ms2.Write($buf2,0,$r)}}while($s.DataAvailable -and $ms2.Length-lt4096)
                $hx2=[BitConverter]::ToString($ms2.ToArray())-replace'-',''
                Write-Host "QUERY-RESP($($ms2.Length)B):$hx2"
                $ms2.Close()
            }else{Write-Host "QUERY-RESP:(timeout)"}
        }
        $ms.Close()
    }else{Write-Host "REG-RESP:(timeout)"}
    $s.Close();$c.Close()
}catch{Write-Host "ERR:$_"}

Write-Host "`n---"

# Attempt 2: Try with different device IDs from Event.txt
$ids = @("02204060100","240C8042F000251100000000000510B","240C_8042_F000_2511_0000_0000_0005_10B")
foreach($did in $ids){
    try{
        $c=New-Object System.Net.Sockets.TcpClient;$c.Connect($T,$P);$c.ReceiveTimeout=3000;$c.SendTimeout=3000;$s=$c.GetStream()
        # Try 0xAA + slave=1 + ASCII ID + 0x0D
        $reg=[byte[]]::new(3+$did.Length);$reg[0]=0xAA;$reg[1]=0x01
        $ascii=[System.Text.Encoding]::ASCII.GetBytes($did)
        for($i=0;$i-lt$ascii.Length;$i++){$reg[2+$i]=$ascii[$i]}
        $reg[$reg.Length-1]=0x0D
        $s.Write($reg,0,$reg.Length)
        Write-Host "Sent AA+1+$did+0D"
        Start-Sleep -Milliseconds 1500
        if($s.DataAvailable){
            $buf=New-Object byte[]1024;$r=$s.Read($buf,0,$buf.Length)
            if($r-gt0){$hx=[BitConverter]::ToString($buf[0..($r-1)])-replace'-','';Write-Host "  RESP:$hx"}
        }else{Write-Host "  (timeout)"}
        $s.Close();$c.Close()
    }catch{Write-Host "ERR:$_"}
}
'''
r = s.run_ps(ps)
if r and r.std_out:
    sys.stdout.buffer.write(r.std_out)
    sys.stdout.buffer.flush()
