# OPC DA 数据采集器 — 在 131 上运行
# 使用 .NET OpcRcw.Da.dll，无需 COM 注册
param(
    [string]$DgiotHost = "127.0.0.1:8000",
    [int]$Interval = 10
)

$ErrorActionPreference = "Continue"
$BinDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $BinDir "Bin"

# 加载 OPC DLL
Add-Type -Path (Join-Path $BinDir "OpcRcw.Da.dll")
Add-Type -Path (Join-Path $BinDir "OpcRcw.Comn.dll")
Write-Host "[OPC] DLLs loaded from $BinDir"

# OPC 服务器配置
$Servers = @(
    @{Name="RSLinx OPC Server"; Host="172.23.9.23"},
    @{Name="RSLinx OPC Server"; Host="172.23.9.3"},
    @{Name="RSLinx OPC Server"; Host="172.23.18.194"},
    @{Name="RSLinx OPC Server"; Host="172.26.6.3"}
)

$ApiUrl = "http://$DgiotHost/api"

function Push-Data($server, $tags) {
    $body = @{
        device_id = "opc_da_gateway"
        points = @($tags | ForEach-Object { @{point_id=$_.Tag; value=$_.Value; quality=$_.Quality; ts=$_.Timestamp} })
    } | ConvertTo-Json -Compress
    try {
        Invoke-RestMethod -Uri "$ApiUrl/telemetry/opc_da_gateway" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5 | Out-Null
    } catch { Write-Host "[OPC] Push failed: $_" }
}

Write-Host "[OPC] Starting OPC DA scanner, push to $ApiUrl, interval=${Interval}s"
Write-Host "[OPC] $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

while ($true) {
    foreach ($srv in $Servers) {
        try {
            $opc = New-Object OpcRcw.Da.OpcServer
            $opc.Connect($srv.Name, $srv.Host)

            # Browse first level tags
            $browser = $opc.CreateBrowser()
            $browser.ShowLeafs()
            $tagCount = 0
            $tags = @()
            foreach ($t in $browser) {
                if ($tagCount -ge 50) { break }
                $tags += $t
                $tagCount++
            }

            if ($tags.Count -gt 0) {
                # Read values
                $values = $opc.Read($tags)
                $results = @()
                for ($i = 0; $i -lt $tags.Count; $i++) {
                    $results += @{
                        Tag = $tags[$i]
                        Value = $values[$i].Value
                        Quality = $values[$i].Quality
                        Timestamp = $values[$i].Timestamp.ToString("o")
                    }
                }

                Write-Host "[OPC] $($srv.Host):$($srv.Name) — $($tags.Count) tags read"
                Push-Data -server $srv -tags $results
            } else {
                Write-Host "[OPC] $($srv.Host):$($srv.Name) — no tags"
            }

            $opc.Disconnect()
        } catch {
            Write-Host "[OPC] $($srv.Host):$($srv.Name) — FAIL: $_"
        }
    }
    Start-Sleep -Seconds $Interval
}
