# OPC DA Browse via COM — 从 Kepware 拉全量 tag tree
param($host_ip="172.23.9.3")

$KEPWARE_PROGID = "Kepware.KEPServerEx.V4"
$OPC_DA_CLSID = "6E6170F0-FF2D-11D2-8087-00105AA8F840"

Write-Host "=== OPC DA Browse: $host_ip ==="

# 方法1: 用 ProgID + DCOM 远程
try {
    $opc = New-Object -ComObject $KEPWARE_PROGID
    Write-Host "ProgID OK"
} catch {
    Write-Host "ProgID failed: $_"
}

# 方法2: 用 OPCServer 对象
try {
    $opcServer = New-Object -ComObject "OPC.Automation.1"
    Write-Host "OPC.Automation OK"
    $opcServer.Connect($KEPWARE_PROGID, $host_ip)
    Write-Host "Connected to $KEPWARE_PROGID at $host_ip"

    # Browse root
    $browser = $opcServer.CreateBrowser()
    $browser.MoveToRoot()
    $browser.ShowLeafs($true)
    $browser.ShowBranches($true)

    Write-Host "Root items: $($browser.Count)"
    for ($i = 1; $i -le [Math]::Min($browser.Count, 20); $i++) {
        try { Write-Host "  [$i] $($browser.Item($i))" } catch {}
    }

    # Recurse into branches
    $browser.ShowBranches($true)
    for ($i = 1; $i -le [Math]::Min($browser.Count, 10); $i++) {
        try {
            $branch = $browser.Item($i)
            $browser.MoveDown($branch)
            Write-Host "  Branch: $branch ($($browser.Count) leaves)"
            for ($j = 1; $j -le [Math]::Min($browser.Count, 5); $j++) {
                try { Write-Host "    [$j] $($browser.Item($j))" } catch {}
            }
            $browser.MoveUp()
        } catch {}
    }

} catch {
    Write-Host "OPC.Automation failed: $_"
}

Write-Host "DONE"
