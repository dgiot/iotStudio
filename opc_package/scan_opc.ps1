# OPC DA 服务器扫描器 — 测试用
$BinDir = Join-Path (Split-Path -Parent $PSCommandPath) "Bin"
if (!$BinDir -or !(Test-Path $BinDir)) { $BinDir = "D:\temp\opc_package\Bin" }
Add-Type -Path (Join-Path $BinDir "OpcRcw.Da.dll")
Add-Type -Path (Join-Path $BinDir "OpcRcw.Comn.dll")
Write-Host "DLLs OK. Scanning OPC servers..."

$hosts = @("localhost","172.23.9.23","172.23.9.3","172.23.18.194","172.26.6.3","172.21.14","172.28.5")
foreach ($h in $hosts) {
    try {
        $s = New-Object OpcRcw.Da.OpcServer
        $servers = $s.GetOPCServers($h)
        Write-Host "$h : $($servers.Count) servers"
        foreach ($srv in $servers) {
            Write-Host "  -> $srv"
            try {
                $s.Connect($srv, $h)
                $b = $s.CreateBrowser()
                $b.ShowLeafs()
                $tags = @($b)[0..9]
                Write-Host "     Tags: $($tags.Count)"
                foreach ($t in $tags) { Write-Host "       $t" }
                $s.Disconnect()
            } catch { Write-Host "     (connect failed)" }
        }
    } catch { Write-Host "$h : DCOM拒绝" }
}
Write-Host "Scan complete."
