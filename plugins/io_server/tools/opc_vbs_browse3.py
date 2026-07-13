"""OPC Browse with correct ProgID"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=35)

# Try multiple ProgIDs
vbs = r'''
On Error Resume Next
Dim hosts, progs, h, p, opc, b, i

hosts = Array("172.23.9.3", "172.23.9.23", "172.26.6.3", "172.28.5.200")
progs = Array("KEPware.KEPServerEx.V4", _
              "Kepware.KEPServerEx.V4", _
              "KEPWARE.KEPServerEx.V4", _
              "KEPServerEx.V4")

For Each h In hosts
    For Each p In progs
        Err.Clear
        Set opc = CreateObject("OPC.Automation.1")
        If Err.Number <> 0 Then
            WScript.Echo h & "/" & p & ": CreateObject FAILED"
        Else
            opc.Connect p, h
            If Err.Number = 0 Then
                WScript.Echo h & "/" & p & ": CONNECTED!"
                Set b = opc.CreateBrowser()
                b.MoveToRoot
                b.ShowLeafs True
                b.ShowBranches True
                WScript.Echo "  Root: " & b.Count & " items"
                For i = 1 To b.Count
                    If i <= 20 Then WScript.Echo "    " & b.Item(i)
                Next
                opc.Disconnect
                Set opc = Nothing
                Exit For
            Else
                WScript.Echo h & "/" & p & ": Connect failed (0x" & Hex(Err.Number) & ")"
            End If
        End If
        Set opc = Nothing
    Next
Next
WScript.Echo "DONE"
'''

b64 = base64.b64encode(vbs.encode()).decode()
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_br3.vbs', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

r = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\opc_br3.vbs 2>&1')
print(r.std_out.decode('gbk', errors='ignore').strip())
