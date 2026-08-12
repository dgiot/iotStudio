Write-Host "Restarting FastAPI..."
$pid = (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess
if ($pid) { Stop-Process -Id $pid -Force; Write-Host "Killed PID $pid" }
Start-Sleep -Seconds 2
Set-Location D:\ai\dgiot_lite
Start-Process python -ArgumentList '-m','uvicorn','src.main:app','--host','0.0.0.0','--port','8000' -NoNewWindow
Start-Sleep -Seconds 4
$r = Invoke-WebRequest -Uri http://127.0.0.1:8000/api/tenants/my -UseBasicParsing
Write-Host "Status:" $r.StatusCode
Write-Host "Response:" $r.Content
