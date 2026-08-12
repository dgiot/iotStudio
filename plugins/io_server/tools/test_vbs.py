import os, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']: os.environ.pop(k,None)
os.environ['NO_PROXY']='192.168.10.131,11.*,172.*'
os.environ['no_proxy']='192.168.10.131,11.*,172.*'
import winrm
s = winrm.Session('http://192.168.10.131:5985/wsman', auth=('administrator',r'CHANGEME'), transport='ntlm', read_timeout_sec=60)

# Simple test VBS
vbs = 'Dim conn,rs\r\nOn Error Resume Next\r\n'
vbs += 'Set conn = CreateObject("ADODB.Connection")\r\n'
vbs += 'conn.ConnectionTimeout = 30 : conn.CommandTimeout = 30\r\n'
vbs += 'conn.Open "Provider=OraOLEDB.Oracle.1;Password=INDUSTRYA11_pass;User ID=INDUSTRYPROD;Data Source=192.168.10.129/orcl"\r\n'
vbs += 'If Err.Number <> 0 Then WScript.StdOut.WriteLine "ERR:" & Err.Description : WScript.Quit 1\r\n'
vbs += 'Set rs = conn.Execute("SELECT count(*) AS CNT FROM SYS_SINGLE_WELL_BASE_INFO")\r\n'
vbs += 'WScript.StdOut.WriteLine "CNT=" & rs.Fields(0).Value\r\n'
vbs += 'rs.Close : conn.Close\r\n'

b64 = base64.b64encode(vbs.encode('utf-8')).decode()
print(f"B64 len: {len(b64)}")

# Upload
s.run_ps(f"[System.IO.File]::WriteAllText('D:/temp/_x.b64', '{b64}')")
result = s.run_cmd('certutil -decode D:/temp/_x.b64 D:/temp/_x.vbs')
print("Decode:", result.std_out.decode('gbk', errors='ignore').strip()[:200])

# Run
result = s.run_cmd('C:/Windows/SysWOW64/cscript.exe //Nologo D:/temp/_x.vbs')
out = result.std_out.decode('gbk', errors='ignore').strip()
print("Output:", out)
