#!/usr/bin/env python3
"""
RTU 桥接采集器 — 通过 WinRM 从 131 直连现场 RTU
==============================================
不依赖 LegacyComm，直接用 WinRM 在 131 上发 Modbus TCP 读寄存器。

架构: 本机 → WinRM(131) → TCP → 现场 RTU(11.248/11.249:502)
对比: 本机 → Oracle(129) 间接读 (已有 oracle_reader.py)

用法:
  python rtu_bridge.py scan        # 扫描可达 RTU
  python rtu_bridge.py read 5      # 读取前5台 RTU 寄存器
  python rtu_bridge.py all         # 扫描 + 读取全部
"""
import os, sys, time, json
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
os.environ['no_proxy'] = '192.168.10.131,11.*,172.*'

import winrm

WINRM_CFG = dict(host='192.168.10.131', port=5985,
                 username='administrator', password=r'CHANGEME')

RANGES = [
    ('11.248', range(195, 206), range(1, 255)),  # 八矿
    ('11.249', range(34, 62), range(1, 255)),     # 七矿
]


def winrm_session():
    return winrm.Session(f'http://{WINRM_CFG["host"]}:{WINRM_CFG["port"]}/wsman',
                         auth=(WINRM_CFG["username"], WINRM_CFG["password"]),
                         transport='ntlm', read_timeout_sec=60)


def scan_rtus(sample=100):
    """扫描 RTU (采样模式，每段扫100个IP)"""
    s = winrm_session()
    print(f"扫描 RTU (采样模式)...")

    all_open = []
    for subnet, drange, erange in RANGES:
        # 采样: 每个 D 段随机取几个
        for d in drange:
            count = 0
            for e in erange:
                ip = f"{subnet}.{d}.{e}"
                try:
                    import socket
                    sock = socket.socket(); sock.settimeout(0.3)
                    if sock.connect_ex((ip, 502)) == 0:
                        all_open.append(ip)
                        print(f"  {ip}:502 OPEN")
                        if len(all_open) >= 20:
                            sock.close()
                            break
                    sock.close()
                except:
                    pass
                count += 1
                if count >= sample:
                    break

    print(f"\n找到 {len(all_open)} 台 RTU")
    return all_open


def read_rtu(ip, slave_id=1):
    """从 131 读取单台 RTU 的 Modbus 寄存器"""
    s = winrm_session()
    ps = f'''
    $sock = New-Object System.Net.Sockets.TcpClient
    try {{
        $sock.Connect("{ip}", 502)
        $stream = $sock.GetStream()
        $req = [byte[]]@(0,0,0,0,0,6,{slave_id},3,0,0,0,20)
        $stream.Write($req, 0, $req.Length)
        Start-Sleep -Milliseconds 300
        $buf = New-Object byte[] 512
        if($stream.DataAvailable) {{
            $n = $stream.Read($buf, 0, 512)
            $hex = [BitConverter]::ToString($buf, 0, [Math]::Min(120, $n))
            Write-Host "OK:$n:$hex"
            $stream.Close(); $sock.Close()
        }} else {{ Write-Host "NO_DATA" }}
    }} catch {{ Write-Host "ERR:$($_.Exception.Message)" }}
    '''
    r = s.run_ps(ps)
    out = r.std_out.decode('gbk', errors='ignore').strip()
    return out


def read_rtus(ips, count=5):
    """批量读取 RTU"""
    print(f"读取 {min(count, len(ips))} 台 RTU...")
    results = {}
    for ip in ips[:count]:
        result = read_rtu(ip)
        print(f"  {ip}: {result}")
        results[ip] = result
        time.sleep(0.5)  # 避免并发过高
    return results


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "scan"
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    if cmd == "scan":
        ips = scan_rtus()
        with open("rtu_list.json", "w") as f:
            json.dump(ips, f)
        print(f"已保存 {len(ips)} 个 IP 到 rtu_list.json")

    elif cmd == "read":
        try:
            with open("rtu_list.json") as f:
                ips = json.load(f)
        except:
            ips = scan_rtus()
        read_rtus(ips, count)

    elif cmd == "all":
        ips = scan_rtus()
        read_rtus(ips, count)


if __name__ == "__main__":
    main()
