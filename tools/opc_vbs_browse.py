"""用 32-bit VBScript 在 131 上浏览 OPC tag tree"""
import os, time, base64
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session('http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=35)

# VBScript that browses OPC tags via the standard OPC Automation COM interface
# Run with 32-bit cscript to access 32-bit COM registrations
vbs = r'''
Set opc = CreateObject("OPC.Automation.1")
opc.Connect "Kepware.KEPServerEx.V4", "192.168.10.23"
WScript.Echo "Connected to Kepware"

Set b = opc.CreateBrowser()
b.MoveToRoot
b.ShowLeafs True
b.ShowBranches True
c = b.Count
WScript.Echo "Root items: " & c
For i = 1 To c
    If i <= 50 Then
        On Error Resume Next
        WScript.Echo "  [" & i & "] " & b.Item(i)
        On Error GoTo 0
    End If
Next

' Browse first 5 branches deeper
b.ShowBranches True
For i = 1 To c
    If i <= 5 Then
        On Error Resume Next
        branch = b.Item(i)
        b.MoveDown branch
        b.ShowLeafs True
        cc = b.Count
        WScript.Echo "Branch: " & branch & " (" & cc & " leaves)"
        For j = 1 To cc
            If j <= 10 Then
                On Error Resume Next
                WScript.Echo "    " & b.Item(j)
                On Error GoTo 0
            End If
        Next
        b.MoveUp
        On Error GoTo 0
    End If
Next

WScript.Echo "DONE"
'''

b64 = base64.b64encode(vbs.encode()).decode()
print(f"VBS: {len(vbs)} bytes")

# Write VBS to 131
s.run_ps(f"[IO.File]::WriteAllBytes('C:\\Users\\Administrator\\opc_br.vbs', [Convert]::FromBase64String('{b64}'))")
time.sleep(0.5)

# Verify
r = s.run_cmd('cmd /c dir C:\\Users\\Administrator\\opc_br.vbs 2>nul')
if 'opc_br.vbs' not in r.std_out.decode('gbk','ignore'):
    print("VBS UPLOAD FAILED")
    raise SystemExit(1)

# Run with 32-bit cscript (SysWOW64)
r = s.run_cmd('C:\\Windows\\SysWOW64\\cscript.exe //Nologo C:\\Users\\Administrator\\opc_br.vbs 2>&1')
out = r.std_out.decode('gbk', errors='ignore').strip()
print(out[:3000] if out else "(empty output)")
if r.std_err:
    err = r.std_err.decode('gbk', errors='ignore')
    if err.strip():
        print('STDERR:', err[:500])
