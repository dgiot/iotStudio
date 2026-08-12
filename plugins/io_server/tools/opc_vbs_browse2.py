"""用 OPC.ServerList 枚举 Kepware 服务器"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=35)

# First: get OPC server list from 192.168.10.23
vbs = r'''
On Error Resume Next

' Method 1: OPC.ServerList to enumerate remote servers
Set sl = CreateObject("OPC.ServerList.1")
WScript.Echo "OPC.ServerList OK"
servers = sl.List "192.168.10.23"
WScript.Echo "Servers on 192.168.10.23: " & Join(servers, " | ")

' Method 2: OPC.Automation with discovered ProgID
If IsArray(servers) And UBound(servers) >= 0 Then
    Dim srv
    srv = servers(0)
    WScript.Echo "Trying: " & srv
    Set opc = CreateObject("OPC.Automation.1")
    opc.Connect srv, "192.168.10.23"
    WScript.Echo "Connected!"

    Set b = opc.CreateBrowser()
    b.MoveToRoot
    b.ShowLeafs True
    b.ShowBranches True
    WScript.Echo "Root items: " & b.Count
    For i = 1 To b.Count
        If i <= 30 Then
            WScript.Echo "  [" & i & "] " & b.Item(i)
        End If
    Next
End If

WScript.Echo "DONE"
'''

b64 = base64.b64encode(vbs.encode()).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_br2.vbs', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

r = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\opc_br2.vbs 2>&1')
print(r.std_out.decode('gbk', errors='ignore').strip())
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if err.strip(): print('STDERR:', err[:500])
