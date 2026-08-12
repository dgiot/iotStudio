#!/usr/bin/env python3
"""尝试各种文本协议格式连 LegacyComm (发现 "BYE" "PASS" "PORT" 等文本标记)"""
import os, sys, base64, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session(
    'http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120)

# 各种可能的文本格式注册消息
DTU_REG_MESSAGES = [
    # 常见 GPRS DTU 文本协议
    (b'ID:123456789012345\r\n', 'ID:IMEI'),
    (b'REG:123456789012345\r\n', 'REG:IMEI'),
    (b'LOGIN:123456789012345\r\n', 'LOGIN:IMEI'),
    (b'#123456789012345\r\n', '#IMEI'),
    (b'868710000000001\r\n', '纯IMEI'),
    (b'ID=123456789012345\r\n', 'ID=IMEI'),
    # PORT/PASS 格式 (基于anycomm.dll的PASS/PORT字符串)
    (b'PORT:53001\r\n', 'PORT:53001'),
    (b'PASS:admin\r\n', 'PASS:admin'),
    (b'PASS:1234\r\n', 'PASS:1234'),
    (b'PORT:53001\r\nPASS:admin\r\n', 'PORT+PASS组合'),
    (b'PORT:53001\r\nID:123456789012345\r\n', 'PORT+ID'),
    # BYE 断开
    (b'BYE\r\n', 'BYE'),
    # 某工业基地可能的定制格式
    (b'INDUSTRY:001\r\n', 'INDUSTRY:001'),
    (b'DQ:001\r\n', 'DQ:001'),
    # 特殊格式
    (b'\x00\x00\x00\x00', '4零字节'),
    (b'\x01\x02\x03\x04', '递增字节'),
    # 心跳 (SUNWAY DTU 可能格式)
    (b'$DTUHEART\r\n', 'DTUHEART'),
    (b'$HEART\r\n', 'HEART'),
    # 宏电格式
    (b'@HLKT:123456789012345\r\n', '宏电@HLKT'),
]

# 写 PS1 脚本 - 对每个消息测试
for idx, (data, desc) in enumerate(DTU_REG_MESSAGES):
    b64 = base64.b64encode(data).decode()

    ps_script = f'''
$data = [Convert]::FromBase64String('{b64}')
try {{
    $c = New-Object System.Net.Sockets.TcpClient
    $c.Connect('127.0.0.1', 53001)
    $st = $c.GetStream()
    $st.Write($data, 0, $data.Length)
    Start-Sleep -Milliseconds 1500
    if ($st.DataAvailable) {{
        $buf = New-Object byte[] 4096
        $n = $st.Read($buf, 0, 4096)
        $hex = [BitConverter]::ToString($buf, 0, [Math]::Min(100, $n)) -replace '-',' '
        $ascii = [System.Text.Encoding]::ASCII.GetString($buf, 0, [Math]::Min(200, $n))
        Write-Host "GOT:$n bytes HEX:$hex ASCII:$ascii"
    }} else {{
        Write-Host "NO_DATA"
    }}
    $st.Close()
    $c.Close()
}} catch {{
    Write-Host "ERR: $($_.Exception.Message)"
}}
'''
    s.run_ps(f"Set-Content -Path 'C:\\Users\\Administrator\\cb_text_test.ps1' -Value @'\n{ps_script}\n'@ -Encoding UTF8")
    time.sleep(0.3)

    r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\cb_text_test.ps1')
    out = r.std_out.decode('gbk', errors='ignore').strip()
    print(f'[{desc}] {out}')
