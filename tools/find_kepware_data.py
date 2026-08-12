"""三路并行: Oracle表名 + 共享内存 + DCOM执行用户"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=25)

# === PATH 1: Oracle table names ===
print("=== PATH 1: Oracle Tables ===")
vbs = r'''
Set conn = CreateObject("ADODB.Connection")
conn.Open "Provider=OraOLEDB.Oracle;Data Source=INDUSTRYPROD;User ID=industrya11;Password=INDUSTRYA11_pass;"
Set rs = conn.Execute("SELECT table_name FROM user_tables WHERE table_name LIKE '%OPC%' OR table_name LIKE '%IOMAN%' OR table_name LIKE '%IODATA%' OR table_name LIKE '%TAG%' OR table_name LIKE '%POINT%' OR table_name LIKE '%PROJECT%' ORDER BY table_name")
Do While Not rs.EOF
    WScript.Echo rs.Fields(0).Value
    rs.MoveNext
Loop
conn.Close
'''
b64 = base64.b64encode(vbs.encode()).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\find_opc.vbs', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.3)
r = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\find_opc.vbs 2>&1')
tables = [l.strip() for l in r.std_out.decode('gbk', errors='ignore').splitlines() if l.strip()]
print(f"Found {len(tables)} tables:")
for t in tables:
    print(f"  {t}")

# === PATH 2: DCOM IOMan process user ===
print("\n=== PATH 2: IOMan Process Users ===")
r = s.run_cmd('tasklist /FI "IMAGENAME eq IOMan.exe" /FO CSV /V 2>nul | findstr /V "Image"')
for line in r.std_out.decode('gbk', errors='ignore').splitlines()[:5]:
    parts = line.split('","')
    if len(parts) >= 7:
        print(f"  PID={parts[1]}: User={parts[6]}")

# === PATH 3: Check if we can run as SYSTEM ===
print("\n=== PATH 3: Check PsExec availability ===")
r = s.run_cmd('where psexec 2>nul & dir C:\\Users\\Administrator\\PsExec.exe 2>nul')
print(r.std_out.decode('gbk', errors='ignore').strip() or "PsExec NOT FOUND")

# Also check DCOM security via registry
print("\n=== PATH 3b: DCOM Security ===")
r = s.run_cmd('reg query "HKCR\\AppID\\{6E6170F0-FF2D-11D2-8087-00105AA8F840}" /s 2>nul & reg query "HKCR\\CLSID\\{6E6170F0-FF2D-11D2-8087-00105AA8F840}\\AppID" 2>nul')
print(r.std_out.decode('gbk', errors='ignore').strip()[:500])
