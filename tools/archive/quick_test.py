import winrm, os, sys
os.environ['NO_PROXY']='11.66.12.131,11.*,172.*'
s=winrm.Session('http://11.66.12.131:5985/wsman',auth=('administrator','GKYWB-5991792$1c8k'),transport='ntlm',read_timeout_sec=60)
r=s.run_ps('$ErrorActionPreference = \"SilentlyContinue\"; $T = \"11.66.12.131\"; $P = 53001; try { $c = New-Object System.Net.Sockets.TcpClient; Write-Host \"Connecting to $T`:$P ...\"; $c.Connect($T, $P); Write-Host \"Connected: $($c.Connected)\"; Write-Host \"Local: $($c.Client.LocalEndPoint)\"; $c.Close(); Write-Host \"Closed\" } catch { Write-Host \"Error: $_\" }; exit 0')
if r:
    sys.stdout.buffer.write(r.std_out if r.std_out else b"no output\n")
    sys.stdout.buffer.flush()
