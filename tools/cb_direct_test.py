#!/usr/bin/env python3
"""直连 CommBridge 探测协议 — 解决 IP 和转义问题"""
import os, sys, base64, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'

import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=60)


def ps_test(name, b64data):
    """通过 certutil + bat 脚本执行 TCP 测试"""
    # 1. 把二进制数据写入文件 (base64 -> certutil decode)
    b64file = r'C:\Users\Administrator\cb_req.b64'
    binfile = r'C:\Users\Administrator\cb_req.bin'

    # 写入 base64 文件
    ps_script = f'''
$b64 = '{b64data}'
[System.IO.File]::WriteAllText('{b64file}', $b64)
certutil -decode '{b64file}' '{binfile}' | Out-Null
'''
    r = s.run_ps(ps_script)
    if r.std_err:
        err = r.std_err.decode('gbk', errors='ignore').strip()
        if err:
            print(f'  [WARN] certutil: {err[:200]}')

    # 2. 用 PowerShell 脚本文件做 TCP 测试 (避免转义)
    ps_script2 = r'''
$bin = [System.IO.File]::ReadAllBytes('C:\Users\Administrator\cb_req.bin')
try {
    $c = New-Object System.Net.Sockets.TcpClient
    $c.Connect('11.66.12.131', 53001)
    $st = $c.GetStream()
    $st.Write($bin, 0, $bin.Length)
    Start-Sleep -Milliseconds 1000
    if ($st.DataAvailable) {
        $buf = New-Object byte[] 4096
        $n = $st.Read($buf, 0, 4096)
        $hex = [BitConverter]::ToString($buf, 0, $n) -replace '-',' '
        Write-Host "GOT $n bytes: $hex"
    } else {
        Write-Host "NO_DATA"
    }
    $st.Close()
    $c.Close()
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
'''
    # 写入 PS1 文件
    ps1file = r'C:\Users\Administrator\cb_test.ps1'
    s.run_ps(f"Set-Content -Path '{ps1file}' -Value @'\n{ps_script2}\n'@ -Encoding UTF8")
    time.sleep(0.5)

    # 执行 PS1
    r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\cb_test.ps1')
    out = r.std_out.decode('gbk', errors='ignore').strip()
    print(f'  [{name}]')
    print(f'    {out}')


# 测试帧
tests = [
    ('Modbus RTU 03读10个保持寄存器(slave=1 addr=0)', '01030000000AC5CD'),
    ('Modbus RTU 03读1个保持寄存器(slave=1 addr=0)', '010300000001840A'),
    ('Modbus RTU 01读线圈(slave=1 addr=0,1个)', '010100000001FDCA'),
    ('Modbus RTU 04读输入(slave=1 addr=0,1个)', '01040000000131CA'),
    ('Modbus TCP MBAP 03读10个', '00000000000601030000000A'),
    ('Modbus TCP MBAP 03读1个', '000100000006010300000001'),
]

print('=== 从131直连 11.66.12.131:53001 探测协议 ===')
for name, hexdata in tests:
    ps_test(name, base64.b64encode(bytes.fromhex(hexdata)).decode())
    time.sleep(0.3)  # 避免太快
