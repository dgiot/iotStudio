# Scan ForceControl / IoMonitor / OPC configuration on 131
$out = ""

$out += "=== PROCESSES ===`n"
$out += (tasklist /v /fo csv 2>$null | Select-String -Pattern "force|opc|rslinx|iomonitor|Factory" -CaseSensitive:$false | Out-String)
$out += "`n"

$out += "=== D: DRIVE ===`n"
$out += (cmd /c "dir /b D:\ 2>nul" | Out-String)
$out += "`n"

$out += "=== C: Program Files ===`n"
$out += (cmd /c 'dir /ad /b "C:\Program Files\" 2>nul | findstr /i force' | Out-String)
$out += (cmd /c 'dir /ad /b "C:\Program Files (x86)\" 2>nul | findstr /i force' | Out-String)
$out += "`n"

$out += "=== DCOM OPC AppID ===`n"
$out += (Get-ItemProperty -Path "HKLM:\SOFTWARE\Classes\AppID\*" -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -like "*OPC*" -or $_ -like "*OPC*" } | Select PSChildName | Out-String)
$out += "`n"

$out += "=== OPC ProgIDs in Registry ===`n"
$out += (Get-ChildItem "HKLM:\SOFTWARE\Classes" -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -like "OPC.*" } | Select -First 20 PSChildName | Out-String)
$out += "`n"

$out += "=== Installed Software (OPC/Force) ===`n"
$out += (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -match "OPC|Force|RSLinx|Factory" } | Select DisplayName, InstallLocation | Out-String)
$out += (Get-ItemProperty "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -match "OPC|Force|RSLinx|Factory" } | Select DisplayName, InstallLocation | Out-String)
$out += "`n"

$out += "=== RSLinx Services ===`n"
$out += (Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "RSLinx|RSL|Factory|OPC" } | Select Name, Status | Out-String)
$out += "`n"

# Write output
$out | Out-File -FilePath "D:\temp\scan_result.txt" -Encoding UTF8
Write-Host "Done. Result at D:\temp\scan_result.txt"
Write-Host $out
