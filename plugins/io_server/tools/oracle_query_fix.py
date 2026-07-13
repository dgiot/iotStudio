"""Fix Oracle query with correct TNS from SqlFilSet.ini"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=25, operation_timeout_sec=20)

# Correct Oracle connection from SqlFilSet.ini:
# Provider=OraOLEDB.Oracle.1;Password=dqyta11_PASS;User ID=DQYTPROD;Data Source=orcl
CONN = r"Provider=OraOLEDB.Oracle.1;Password=dqyta11_PASS;Persist Security Info=True;User ID=DQYTPROD;Data Source=orcl"

# Query tables
vbs = f'''Set conn = CreateObject("ADODB.Connection")
conn.Open "{CONN}"
Set rs = conn.Execute("SELECT table_name FROM user_tables WHERE table_name LIKE '%OPC%' OR table_name LIKE '%IODATA%' OR table_name LIKE '%PROJECT%' OR table_name LIKE '%TAGPAR%' OR table_name LIKE '%POINTRELATION%' ORDER BY table_name")
Do While Not rs.EOF
    WScript.Echo rs.Fields(0).Value
    rs.MoveNext
Loop
conn.Close'''
b64 = base64.b64encode(vbs.encode()).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\oracle6.vbs', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.3)
r = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\oracle6.vbs 2>&1')
out = r.std_out.decode('gbk', errors='ignore').strip()
if out and 'ORA-' not in out:
    tables = [l.strip() for l in out.splitlines() if l.strip()]
    print(f"Tables: {tables}")

    # Query key tables
    for tbl in tables[:5]:
        print(f"\n=== {tbl} (first 3 rows) ===")
        vbs2 = f'''Set conn = CreateObject("ADODB.Connection")
conn.Open "{CONN}"
Set rs = conn.Execute("SELECT * FROM (SELECT * FROM {tbl} WHERE ROWNUM <= 3)")
For i = 0 To rs.Fields.Count - 1
    WScript.Echo rs.Fields(i).Name
Next
Do While Not rs.EOF
    Dim row: row = ""
    For i = 0 To rs.Fields.Count - 1
        row = row & rs.Fields(i).Value
        If i < rs.Fields.Count - 1 Then row = row & " | "
    Next
    WScript.Echo row
    rs.MoveNext
Loop
conn.Close'''
        b64_2 = base64.b64encode(vbs2.encode()).decode()
        s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\oracle7.vbs', [Convert]::FromBase64String('{b64_2}'))")
        time.sleep(0.3)
        r2 = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\oracle7.vbs 2>&1')
        print(r2.std_out.decode('gbk', errors='ignore').strip()[:800])
else:
    print(f"Oracle Error: {out[:300]}")
