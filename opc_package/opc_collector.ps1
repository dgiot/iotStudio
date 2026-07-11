# OPC DA Collector for dgiot_lite
param($DgiotHost = "127.0.0.1:8000", $Interval = 10)

$ErrorActionPreference = "Continue"
$BinDir = "D:\Bin"

Add-Type -Path "$BinDir\OpcRcw.Da.dll"
Add-Type -Path "$BinDir\OpcRcw.Comn.dll"
Write-Host "[OPC] DLLs loaded from $BinDir"

$Server1 = "RSLinx OPC Server"
$ApiUrl = "http://$DgiotHost/api"
Write-Host "[OPC] Starting, push to $ApiUrl, interval=$Interval s"

while ($true) {
    $hosts = @("172.23.9.23", "172.23.9.3", "172.23.18.194", "172.26.6.3")
    foreach ($h in $hosts) {
        Write-Host "[OPC] Scanning $h ..."
        try {
            $opc = New-Object OpcRcw.Da.OpcServer
            $opc.Connect($Server1, $h)
            $browser = $opc.CreateBrowser()
            $browser.ShowLeafs()
            $count = 0
            foreach ($t in $browser) {
                if ($count -ge 10) { break }
                try {
                    $v = $opc.Read($t)
                    Write-Host "[OPC]   $t = $($v.Value)"
                } catch {}
                $count++
            }
            Write-Host "[OPC] $h : $count tags read"
            $opc.Disconnect()
        } catch {
            Write-Host "[OPC] $h : $_"
        }
    }
    Start-Sleep -Seconds $Interval
}
