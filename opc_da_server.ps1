# OPC DA Server Scanner — 在 131 上运行
# 列出所有可用的 OPC 服务器

Add-Type -Path "D:\Bin\OpcRcw.Da.dll"
Add-Type -Path "D:\Bin\OpcRcw.Comn.dll"

Write-Host "=== 本地 OPC 服务器 ==="
$local = New-Object OpcRcw.Da.OpcServer
$servers = $local.GetOPCServers("localhost")
foreach ($s in $servers) { Write-Host "  $s" }

Write-Host ""
Write-Host "=== 远程 OPC 服务器 (172.23.9.23) ==="
try {
    $remote = $local.GetOPCServers("172.23.9.23")
    foreach ($s in $remote) { Write-Host "  $s" }
} catch { Write-Host "  (DCOM 拒绝 — 需配置 DCOM 权限)" }

Write-Host ""
Write-Host "=== RSLinx 尝试 ==="
try {
    $local.Connect("RSLinx OPC Server", "172.23.9.23")
    $tags = $local.GetItemID(0)
    Write-Host "  标签数: $($tags.Count)"
    foreach ($t in $tags[0..9]) { Write-Host "    $t" }
} catch { Write-Host "  连接失败: $_" }
