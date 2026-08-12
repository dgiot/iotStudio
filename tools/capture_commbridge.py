#!/usr/bin/env python3
"""抓取 LegacyComm 报文 — 多种方案并行"""
import os, sys, base64, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'

import winrm

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120)


def ps(cmd, timeout=120):
    r = s.run_ps(cmd)
    return r.std_out.decode('gbk', errors='ignore').strip()


def cmd(cmd, timeout=120):
    r = s.run_cmd(cmd)
    return r.std_out.decode('gbk', errors='ignore').strip()


# ═══════════════════════════════════════════
# 方案1: netsh trace 全量抓包 (不限端口)
# ═══════════════════════════════════════════
def method1_netsh_full():
    print('=== 方案1: netsh trace 全量 (60s) ===')
    ps('netsh trace start capture=yes tracefile=C:\\Users\\Administrator\\full_cap.etl maxsize=200')
    time.sleep(10)  # 等采集跑起来
    print('  抓了60秒...')
    time.sleep(50)
    ps('netsh trace stop')
    print('  完成: C:\\Users\\Administrator\\full_cap.etl')

    # 导出为文本看看有没有 53001
    r = ps('netsh trace convert input=C:\\Users\\Administrator\\full_cap.etl output=C:\\Users\\Administrator\\full_cap dump=json')
    print(r[:1000])


# ═══════════════════════════════════════════
# 方案2: PowerShell 直接连 LegacyComm 读数据
# ═══════════════════════════════════════════
def method2_connect_commbridge():
    print('\n=== 方案2: 直连 LegacyComm 探测协议 ===')
    # 尝试用各种格式连 127.0.0.1:53001 (LegacyComm 本地端口)
    tests = [
        # (名称, hex请求)
        ('Modbus RTU 03 读保持寄存器(10个)', '01030000000AC5CD'),
        ('Modbus RTU 03 读保持寄存器(1个)',  '010300000001840A'),
        ('Modbus RTU 01 读线圈',            '010100000001FDCA'),
        ('Modbus RTU 04 读输入寄存器',       '01040000000131CA'),
        ('Modbus TCP 03 读保持寄存器',       '00000000000601030000000A'),
        ('Modbus TCP 03 读保持寄存器(1个)',  '000000000006010300000001'),
        ('纯文本 hello',                     '68656C6C6F'),
        ('DTU 注册包 (IMEI 15位)',          '383638373130303030303030303031'),  # 868710000000001
    ]

    for name, hexdata in tests:
        data = bytes.fromhex(hexdata)
        b64 = base64.b64encode(data).decode()
        r = ps(f'''try{{
$c=New-Object System.Net.Sockets.TcpClient
$c.Connect('127.0.0.1',53001)
$st=$c.GetStream()
$req=[Convert]::FromBase64String('{b64}')
$st.Write($req,0,$req.Length)
Start-Sleep -Milliseconds 500
if($st.DataAvailable){{
    $buf=New-Object byte[] 4096
    $n=$st.Read($buf,0,4096)
    $resp=[BitConverter]::ToString($buf,0,$n)
    Write-Host 'OK: {len}' -f @{{len=$n}}
    Write-Host "HEX: $resp"
    $ascii=[System.Text.Encoding]::ASCII.GetString($buf,0,[Math]::Min(200,$n))
    Write-Host "ASCII: $ascii"
}}else{{Write-Host 'TIMEOUT'}}
$st.Close();$c.Close()
}}catch{{Write-Host "ERR: $($_.Exception.Message)"}}''')
        print(f'  [{name}]')
        print(f'    {r[:300]}')
        print()


# ═══════════════════════════════════════════
# 方案3: 查看 LegacyComm 进程的网络 IO 统计
# ═══════════════════════════════════════════
def method3_process_stats():
    print('\n=== 方案3: LegacyComm 进程网络统计 ===')
    pid = ps('(Get-Process LegacyComm -ErrorAction SilentlyContinue | Select -First 1).Id')
    if pid and pid.isdigit():
        # 看这个进程的活跃连接
        r = cmd(f'netstat -ano | findstr "{pid}" | find /c "ESTABLISHED"')
        print(f'  活跃连接数: {r}')

        # 看有没有53001在监听
        r = cmd(f'netstat -ano | findstr "{pid}" | findstr "53001" | findstr "LISTENING"')
        print(f'  监听53001: {r[:200]}')

        # 看进程IO
        r = ps(f'Get-Process -Id {pid} | Select Id,HandleCount,Threads,WorkingSet64,StartTime | Format-List')
        print(f'  进程信息: {r[:500]}')

        # 采样几条连接
        r = cmd(f'netstat -ano | findstr "{pid}" | findstr "ESTABLISHED"')
        lines = r.split('\n')[:10]
        for line in lines:
            print(f'    {line.strip()}')


# ═══════════════════════════════════════════
# 方案4: 查找 LegacyComm 配置和日志文件
# ═══════════════════════════════════════════
def method4_find_configs():
    print('\n=== 方案4: 查找配置和日志 ===')
    # 找 LegacyComm 所在目录
    r = ps('(Get-Process LegacyComm -ErrorAction SilentlyContinue | Select -First 1).Path')
    commbridge_path = r.strip()
    print(f'  LegacyComm 路径: {commbridge_path}')
    if commbridge_path:
        import ntpath
        d = ntpath.dirname(commbridge_path)
        # 列出目录
        r = ps(f'Get-ChildItem "{d}" -File | Select Name,Length,LastWriteTime | Format-Table -AutoSize')
        print(f'  目录内容:\n{r[:2000]}')

        # 找配置文件
        r = ps(f'Get-ChildItem "{d}" -Recurse -Include *.ini,*.cfg,*.xml,*.config,*.txt,*.log -ErrorAction SilentlyContinue | Select FullName,Length | Format-Table -AutoSize')
        print(f'  配置文件:\n{r[:2000]}')

        # 找日志
        r = ps('Get-ChildItem C:\\ -Recurse -Include LegacyComm*.log,LegacyComm*.txt,IoMonitor*.log,IoMonitor*.txt -ErrorAction SilentlyContinue -Depth 3 | Select FullName,Length,LastWriteTime | Format-Table -AutoSize')
        print(f'  日志文件:\n{r[:2000]}')


# ═══════════════════════════════════════════
# 方案5: 下载 LegacyComm.exe 和 PDB 到本地分析
# ═══════════════════════════════════════════
def method5_download_binary():
    print('\n=== 方案5: 下载 LegacyComm 二进制 ===')
    r = ps('(Get-Process LegacyComm -ErrorAction SilentlyContinue | Select -First 1).Path')
    path = r.strip()
    if not path:
        print('  LegacyComm 未运行!')
        return

    # 获取文件大小
    r = ps(f'(Get-Item "{path}").Length')
    size = int(r.strip()) if r.strip().isdigit() else 0
    print(f'  LegacyComm.exe: {size/1024:.0f} KB')

    # 找 PDB
    import ntpath
    d = ntpath.dirname(path)
    r = ps(f"Get-ChildItem '{d}' -Filter *.pdb -ErrorAction SilentlyContinue | Select Name,Length | Format-List")
    print(f'  PDB 文件:\n{r[:500]}')

    # 找 DLL
    r = ps(f"Get-ChildItem '{d}' -Filter *.dll -ErrorAction SilentlyContinue | Select Name,Length | Format-Table -AutoSize")
    print(f'  DLL 文件:\n{r[:500]}')

    # 将文件分块 base64 传到本地
    local_dir = r'D:\ai\dgiot_lite\reverse\commbridge'
    os.makedirs(local_dir, exist_ok=True)

    # 先用 certutil 转 base64
    ps(f"certutil -encode '{path}' C:\\Users\\Administrator\\commbridge.b64")
    # 下载 base64
    r = ps('Get-Content C:\\Users\\Administrator\\commbridge.b64 -Raw')
    if r:
        b64content = r.strip()
        # 移除 certutil 的 BEGIN/END 标记
        for line in b64content.split('\n'):
            line = line.strip()
            if line and not line.startswith('---'):
                pass  # base64 content
        content = base64.b64decode(''.join(b64content.split('\n')[1:-1]))
        with open(os.path.join(local_dir, 'LegacyComm.exe'), 'wb') as f:
            f.write(content)
        print(f'  已下载 LegacyComm.exe ({len(content)} bytes) 到 {local_dir}')

    # 同样下载 PDB
    r = ps(f"Get-ChildItem '{d}' -Filter *.pdb -ErrorAction SilentlyContinue | Select -First 1 -ExpandProperty Name")
    pdb_name = r.strip()
    if pdb_name:
        pdb_path = f'{d}\\{pdb_name}'
        ps(f"certutil -encode '{pdb_path}' C:\\Users\\Administrator\\commbridge_pdb.b64")
        r = ps('Get-Content C:\\Users\\Administrator\\commbridge_pdb.b64 -Raw')
        if r:
            content = base64.b64decode(''.join(r.split('\n')[1:-1]))
            with open(os.path.join(local_dir, pdb_name), 'wb') as f:
                f.write(content)
            print(f'  已下载 {pdb_name} ({len(content)} bytes)')


if __name__ == '__main__':
    cmd_arg = sys.argv[1] if len(sys.argv) > 1 else 'all'

    if cmd_arg == '1' or cmd_arg == 'all':
        method2_connect_commbridge()  # 先做探测,最快
    if cmd_arg == '2' or cmd_arg == 'all':
        method4_find_configs()
    if cmd_arg == '3' or cmd_arg == 'all':
        method3_process_stats()
    if cmd_arg == '4' or cmd_arg == 'all':
        method1_netsh_full()  # 全量抓包放最后,耗时最长
    if cmd_arg == '5' or cmd_arg == 'all':
        method5_download_binary()
