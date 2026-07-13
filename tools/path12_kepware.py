"""Paths 1+2: Oracle query + shared memory search"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=25, operation_timeout_sec=20)

# PATH 1: Oracle with Easy Connect
print("=== PATH 1: Oracle Easy Connect ===")
vbs = r'''Set conn = CreateObject("ADODB.Connection")
conn.Open "Provider=OraOLEDB.Oracle;Data Source=11.66.12.129:1521/DQYTPROD;User ID=dqyta11;Password=DQYTA11_pass;"
Set rs = conn.Execute("SELECT table_name FROM user_tables WHERE table_name LIKE '%OPC%' OR table_name LIKE '%IODATA%' OR table_name LIKE '%PROJECT%' OR table_name LIKE '%POINT%' OR table_name LIKE '%TAG%' ORDER BY table_name")
Do While Not rs.EOF
    WScript.Echo rs.Fields(0).Value
    rs.MoveNext
Loop
conn.Close'''
b64 = base64.b64encode(vbs.encode()).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\oracle3.vbs', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.3)
r = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\oracle3.vbs 2>&1')
out = r.std_out.decode('gbk', errors='ignore').strip()
if out and 'ORA-' not in out:
    tables = [l.strip() for l in out.splitlines() if l.strip()]
    print(f"Found {len(tables)} tables:")
    for t in tables: print(f"  {t}")
else:
    print(f"Error: {out[:300]}")

# PATH 2: Shared memory created by DCOM IOMan PIDs
print("\n=== PATH 2: IOMan Process Memory ===")
# Check if IOMan processes have open handles to shared memory
# Use handle.exe from Sysinternals if available, or check via PowerShell
r = s.run_ps(r'''
$dcom_pids = @(13852,8320,13776,18044,7616)
foreach ($pid in $dcom_pids) {
    try {
        $proc = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "PID $pid : $($proc.ProcessName) modules=$($proc.Modules.Count)"
    } catch {
        Write-Host "PID $pid : not running"
    }
}
''')
print(r.std_out.decode('gbk', errors='ignore').strip()[:500])

# PATH 2b: Use PSAPI to enumerate named objects per process
print("\n=== PATH 2b: Sysinternals Handle ===")
r = s.run_cmd('cmd /c dir C:\\Users\\Administrator\\handle*.exe 2>nul & where handle 2>nul')
out = r.std_out.decode('gbk', errors='ignore').strip()
if 'handle' in out.lower():
    print("Handle.exe found!")
    # Check handles of a DCOM IOMan
    r = s.run_cmd(r'C:\Users\Administrator\handle.exe -a -p 13852 2>nul | findstr "Section\|FileMap\|Mutant\|Event"')
    print(r.std_out.decode('gbk', errors='ignore').strip()[:1000])
else:
    print("Handle.exe not available")
    # Alternative: Use PowerShell to check process modules
    r = s.run_ps(r'''
    $p = Get-Process -Id 13852
    $p.Modules | Where-Object { $_.ModuleName -like "*iomem*" -or $_.ModuleName -like "*psAPI*" } | ForEach-Object { Write-Host $_.ModuleName }
    ''')
    print(r.std_out.decode('gbk', errors='ignore').strip()[:500])
