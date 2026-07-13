"""Test OPC DA COM from 131 using 32-bit PowerShell."""
import os
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
os.environ['no_proxy'] = '11.66.12.131,11.*,172.*'
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)

import winrm
s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=90)

def ps32(script):
    """Run PowerShell script using 32-bit powershell.exe"""
    try:
        r = s.run_cmd(
            'C:\\Windows\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe '
            '-ExecutionPolicy Bypass -NoProfile -Command "{}"'.format(
                script.replace('"', '\\"'))
        )
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:5000]
    except Exception as e:
        return f'ERR: {e}'

def cmd(command):
    try:
        r = s.run_cmd(command)
        out = r.std_out.decode('gbk', errors='ignore').strip()
        err = r.std_err.decode('gbk', errors='ignore').strip()
        return (out + '\n' + err).strip()[:5000]
    except Exception as e:
        return f'ERR: {e}'

print("=== 1. Test 32-bit OPC.Automation COM ===")
print(ps32("""
$ErrorActionPreference = 'Continue'
try {
    $opc = New-Object -ComObject 'OPC.Automation.1'
    Write-Host 'SUCCESS: OPC.Automation.1 created!'
    Write-Host ('Type: ' + $opc.GetType().FullName)
} catch {
    Write-Host ('FAIL: ' + $_.Exception.Message)
}
"""))
print()

print("=== 2. List OPC Servers on localhost ===")
print(ps32("""
try {
    $list = New-Object -ComObject 'OPC.ServerList.1'
    $servers = $list.List()
    Write-Host ('Servers on localhost: ' + $servers)
} catch {
    Write-Host ('FAIL: ' + $_.Exception.Message)
}
"""))
print()

print("=== 3. List OPC Servers on 172.23.9.23 ===")
print(ps32("""
try {
    $list = New-Object -ComObject 'OPC.ServerList.1'
    $servers = $list.List('172.23.9.23')
    Write-Host ('Servers on 172.23.9.23: ' + $servers)
} catch {
    Write-Host ('FAIL: ' + $_.Exception.Message)
}
"""))
print()

print("=== 4. Try connect RSLinx OPC Server ===")
print(ps32("""
try {
    $srv = New-Object -ComObject 'OPC.Automation.1'
    $srv.Connect('RSLinx OPC Server', '172.23.9.23')
    Write-Host 'Connected to RSLinx OPC Server!'

    $browser = $srv.CreateBrowser()
    $browser.ShowLeafs()
    $count = 0
    foreach($tag in $browser) {
        if($count++ -ge 10) { break }
        try {
            $v = $srv.Read($tag)
            Write-Host ('  TAG: ' + $tag + ' = ' + $v.Value + ' (' + $v.Quality + ')')
        } catch {
            Write-Host ('  TAG: ' + $tag + ' (read ERR)')
        }
    }
    Write-Host ('Total tags displayed: ' + $count)
    $srv.Disconnect()
} catch {
    Write-Host ('FAIL: ' + $_.Exception.Message)
}
"""))
print()

print("=== 5. Try connect with node param ===")
print(ps32("""
try {
    $srv = New-Object -ComObject 'OPC.Automation.1'
    # OPC.Automation Connect(node, server)
    $srv.Connect('RSLinx OPC Server', '172.23.9.23')
    Write-Host 'Method 2: Connected!'

    $groups = $srv.OPCGroups
    $group = $groups.Add('test_group')
    Write-Host ('Groups collection OK, added test_group')

    $srv.Disconnect()
} catch {
    Write-Host ('FAIL: ' + $_.Exception.Message)
}
"""))
print()

print("=== 6. Check DCOM permissions ===")
print(ps32("""
try {
    # Try all 4 known OPC servers
    $servers = @(
        @{Name='RSLinx OPC Server'; Host='172.23.9.23'},
        @{Name='RSLinx OPC Server'; Host='172.23.9.3'},
        @{Name='RSLinx OPC Server'; Host='172.23.18.194'},
        @{Name='RSLinx OPC Server'; Host='172.26.6.3'}
    )
    foreach($s in $servers) {
        try {
            $opc = New-Object -ComObject 'OPC.Automation.1'
            $opc.Connect($s.Name, $s.Host)
            Write-Host ('  OK: ' + $s.Host + ' -> ' + $s.Name)
            $opc.Disconnect()
        } catch {
            Write-Host ('  FAIL: ' + $s.Host + ' -> ' + $_.Exception.Message.Substring(0, [Math]::Min(100, $_.Exception.Message.Length)))
        }
    }
} catch {
    Write-Host ('OUTER FAIL: ' + $_.Exception.Message)
}
"""))

print()
print("=== DONE ===")
