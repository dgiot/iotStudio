# OPC DA Server Scanner
$BinDir = "D:\temp\opc_package\Bin"
Add-Type -Path "$BinDir\OpcRcw.Da.dll"
Add-Type -Path "$BinDir\OpcRcw.Comn.dll"
Write-Host "DLLs OK. Scanning OPC servers..."
foreach ($h in @("localhost","172.23.9.23","172.23.9.3","172.23.18.194","172.26.6.3","172.21.14","172.28.5")) {
    try {
        $s = New-Object OpcRcw.Da.OpcServer
        $servers = $s.GetOPCServers($h)
        Write-Host "$h : $($servers.Count) servers"
        foreach ($srv in $servers) { Write-Host "  -> $srv" }
    } catch { Write-Host "$h : DCOM rejected" }
}
Write-Host "Scan complete."
