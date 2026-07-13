#!/usr/bin/env python3
"""
CommBridge 桥接测试器 — 从 131 直连现场 RTU
===========================================
CommBridge.exe (PID 19240) 是 Modbus TCP 网关，运行在 131:53001。
RTU 主动连到 53001，CommBridge 再通过这个连接发送 Modbus 读命令。

本工具通过 WinRM 在 131 上扫描 RTU 并读取寄存器。

用法: python commbridge_tester.py
"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
os.environ['no_proxy'] = '11.66.12.131,11.*,172.*'

import winrm


def winrm_session():
    return winrm.Session(
        'http://11.66.12.131:5985/wsman',
        auth=('administrator', r'GKYWB-5991792$1c8k'),
        transport='ntlm', read_timeout_sec=60)


def ps(cmd):
    return winrm_session().run_ps(cmd).std_out.decode('gbk', errors='ignore').strip()


# ═══════════════════ 1. 状态 ═══════════════════
def check_status():
    print("=== CommBridge 进程状态 ===")
    r = ps("Get-Process -Name 'CommBridge*' -ErrorAction SilentlyContinue | Select Id,StartTime,WorkingSet | Format-List")
    print(r[:500] if r else "CommBridge 未运行")
    r = winrm_session().run_cmd('netstat -ano | findstr "19240" | find /c "ESTABLISHED"')
    cnt = r.std_out.decode('gbk', errors='ignore').strip()
    print(f"活跃连接: {cnt}")


# ═══════════════════ 2. 扫描 ═══════════════════
def scan_rtus(limit=20):
    """从 131 快速扫描 RTU"""
    print(f"\n=== 从 131 扫描 RTU (最多{limit}台) ===")
    # 只扫 11.249.34-38 段 (从 netstat 看这 5 个段有连接)
    result = ps('''
    $found=@()
    foreach($d in 34..38){foreach($e in 1..254){
        try{$s=New-Object System.Net.Sockets.TcpClient
            $r=$s.BeginConnect("11.249.$d.$e",502,$null,$null)
            if($r.AsyncWaitHandle.WaitOne(200)){$s.Close();Write-Host "11.249.$d.$e"}
            if($found.Count -ge ''' + str(limit) + '''){break}
        }catch{}
    }}
    ''')
    ips = [l.strip() for l in result.split('\n') if l.startswith('11.249')]
    print(f"找到 {len(ips)} 台 RTU")
    return ips


# ═══════════════════ 3. 读取 ═══════════════════
def read_rtu(ip, slave_id=1):
    """从 131 读取单台 RTU"""
    r = ps(f'''$s=New-Object System.Net.Sockets.TcpClient
try{{$s.Connect("{ip}",502);$st=$s.GetStream()
$req=[byte[]]@(0,0,0,0,0,6,{slave_id},3,0,0,0,10);$st.Write($req,0,$req.Length)
Start-Sleep -Milliseconds 300;$b=New-Object byte[] 256
if($st.DataAvailable){{$n=$st.Read($b,0,256);$h=[BitConverter]::ToString($b,0,[Math]::Min(80,$n))
Write-Host "OK $ip slave={slave_id}: $n bytes $h"}}else{{Write-Host "NO_DATA $ip"}}
$st.Close();$s.Close()}}catch{{Write-Host "ERR $ip: $($_.Exception.Message)"}}''')
    print(f"  {r}")


# ═══════════════════ 4. 全流程 ═══════════════════
def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    if cmd == "status":
        check_status()

    elif cmd == "scan":
        ips = scan_rtus()
        print(f"\n找到 {len(ips)} 台 RTU (502端口开放)")

    elif cmd == "read":
        ips = scan_rtus()
        print(f"\n=== 读取前 {min(count, len(ips))} 台 ===")
        for ip in ips[:count]:
            read_rtu(ip)
            time.sleep(0.3)

    elif cmd == "all":
        check_status()
        ips = scan_rtus()
        print(f"\n=== 读取全部 {len(ips)} 台 ===")
        for ip in ips:
            read_rtu(ip)
            time.sleep(0.3)


if __name__ == "__main__":
    main()
