#!/usr/bin/env python3
"""方案C部署测试: 开发机运行Server, 131做转发, RTU从131连接测试"""
import asyncio, sys, os, time, struct
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from src.protocols.commbridge_server import CommBridgeServer, crc16

for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

# ═══════ 1. 后台启动 CommBridgeServer ═══════

class LiveMonitor:
    events = []
    def emit(self, key, **kw):
        self.events.append((key, kw))
        dt = kw.get('dtu_id', '?')
        vs = kw.get('values', {})
        vs_str = ', '.join(f'{k}={v:.2f}' for k,v in list(vs.items())[:4])
        print(f'  [SRV] {key.split(".")[-1]:20s} | {dt:16s} | {vs_str}')

monitor = LiveMonitor()

async def run_server():
    srv = CommBridgeServer(event_bus=monitor, port=53002, host='0.0.0.0')
    await srv.start()
    print('[SRV] Server READY on :53002\n')
    await asyncio.sleep(60)
    await srv.stop()
    return len(monitor.events)

# ═══════ 2. 131 RTU 模拟器 PS 脚本 ═══════

RTU_SIM_PS = r'''
$hash = 12345; $devType = 0; $channels = 10; $slave = 1

$crcTable = @(0x0000,0xC0C1,0xC181,0x0140,0xC301,0x03C0,0x0280,0xC241,0xC601,0x06C0,0x0780,0xC741,0x0500,0xC5C1,0xC481,0x0440,0xCC01,0x0CC0,0x0D80,0xCD41,0x0F00,0xCFC1,0xCE81,0x0E40,0x0A00,0xCAC1,0xCB81,0x0B40,0xC901,0x09C0,0x0880,0xC841,0xD801,0x18C0,0x1980,0xD941,0x1B00,0xDBC1,0xDA81,0x1A40,0x1E00,0xDEC1,0xDF81,0x1F40,0xDD01,0x1DC0,0x1C80,0xDC41,0x1400,0xD4C1,0xD581,0x1540,0xD701,0x17C0,0x1680,0xD641,0xD201,0x12C0,0x1380,0xD341,0x1100,0xD1C1,0xD081,0x1040,0xF001,0x30C0,0x3180,0xF141,0x3300,0xF3C1,0xF281,0x3240,0x3600,0xF6C1,0xF781,0x3740,0xF501,0x35C0,0x3480,0xF441,0x3C00,0xFCC1,0xFD81,0x3D40,0xFF01,0x3FC0,0x3E80,0xFE41,0xFA01,0x3AC0,0x3B80,0xFB41,0x3900,0xF9C1,0xF881,0x3840,0x2800,0xE8C1,0xE981,0x2940,0xEB01,0x2BC0,0x2A80,0xEA41,0xEE01,0x2EC0,0x2F80,0xEF41,0x2D00,0xEDC1,0xEC81,0x2C40,0xE401,0x24C0,0x2580,0xE541,0x2700,0xE7C1,0xE681,0x2640,0x2200,0xE2C1,0xE381,0x2340,0xE101,0x21C0,0x2080,0xE041,0xA001,0x60C0,0x6180,0xA141,0x6300,0xA3C1,0xA281,0x6240,0x6600,0xA6C1,0xA781,0x6740,0xA501,0x65C0,0x6480,0xA441,0x6C00,0xACC1,0xAD81,0x6D40,0xAF01,0x6FC0,0x6E80,0xAE41,0xAA01,0x6AC0,0x6B80,0xAB41,0x6900,0xA9C1,0xA881,0x6840,0x7800,0xB8C1,0xB981,0x7940,0xBB01,0x7BC0,0x7A80,0xBA41,0xBE01,0x7EC0,0x7F80,0xBF41,0x7D00,0xBDC1,0xBC81,0x7C40,0xB401,0x74C0,0x7580,0xB541,0x7700,0xB7C1,0xB681,0x7640,0x7200,0xB2C1,0xB381,0x7340,0xB101,0x71C0,0x7080,0xB041,0x5000,0x90C1,0x9181,0x5140,0x9301,0x53C0,0x5280,0x9241,0x9601,0x56C0,0x5780,0x9741,0x5500,0x95C1,0x9481,0x5440,0x9C01,0x5CC0,0x5D80,0x9D41,0x5F00,0x9FC1,0x9E81,0x5E40,0x5A00,0x9AC1,0x9B81,0x5B40,0x9901,0x59C0,0x5880,0x9841,0x8801,0x48C0,0x4980,0x8941,0x4B00,0x8BC1,0x8A81,0x4A40,0x4E00,0x8EC1,0x8F81,0x4F40,0x8D01,0x4DC0,0x4C80,0x8C41,0x4400,0x84C1,0x8581,0x4540,0x8701,0x47C0,0x4680,0x8641,0x8201,0x42C0,0x4380,0x8341,0x4100,0x81C1,0x8081,0x4040)

function Get-CRC16($data) {
    $crc = 0xFFFF
    foreach ($b in $data) {
        $crc = (($crc -shr 8) -bxor $crcTable[($crc -bxor $b) -band 0xFF])
    }
    return $crc
}

try {
    $c = New-Object System.Net.Sockets.TcpClient
    $c.Connect('11.66.12.131', 53002)
    $st = $c.GetStream()
    Write-Host "CONNECTED to 131:53002 (forwarded to dev machine)"

    $reg = [byte[]]@(($hash -shr 8) -band 0xFF, $hash -band 0xFF, $devType, $channels)
    $st.Write($reg, 0, $reg.Length)
    Write-Host "REGISTERED: hash=$hash dev=$devType channels=$channels"

    for ($round = 1; $round -le 5; $round++) {
        $buf = New-Object byte[] 256
        Start-Sleep -Milliseconds 1200
        if ($st.DataAvailable) {
            $n = $st.Read($buf, 0, 256)
            if ($n -ge 8) {
                $reqHex = [BitConverter]::ToString($buf, 0, 8) -replace '-',' '
                Write-Host "QUERY #$round $n bytes: $reqHex"

                $resp = New-Object System.Collections.ArrayList
                [void]$resp.Add($slave); [void]$resp.Add(3)
                [void]$resp.Add($channels * 2)
                for ($i=0; $i -lt $channels; $i++) {
                    $v = 4096 + ($i * 100) + ($round * 10)
                    [void]$resp.Add(($v -shr 8) -band 0xFF)
                    [void]$resp.Add($v -band 0xFF)
                }
                $respBytes = [byte[]]$resp.ToArray()
                $crc = Get-CRC16 $respBytes
                $crcLow = $crc -band 0xFF
                $crcHigh = ($crc -shr 8) -band 0xFF
                $final = $respBytes + [byte[]]@($crcLow, $crcHigh)
                $st.Write($final, 0, $final.Length)
                Write-Host "  RESPONSE: 10 regs, CRC=0x$('{0:X4}' -f $crc)"
            }
        } else {
            Write-Host "NO_DATA round $round"
        }
    }
    $st.Close(); $c.Close()
    Write-Host "DONE: 5 rounds completed successfully"
} catch {
    Write-Host "ERR: $($_.Exception.Message)"
}
'''

# ═══════ 主流程 ═══════

async def main():
    print("=" * 70)
    print("  方案C: 开发机 11.66.191.155:53002 ← 131端口转发 ← RTU")
    print("=" * 70)

    # 启动 Server
    srv_task = asyncio.create_task(run_server())
    await asyncio.sleep(2)

    # 从 WinRM 在 131 上运行 RTU 模拟器
    print("[WINRM] Uploading RTU simulator to 131...")
    s = winrm.Session(
        'http://11.66.12.131:5985/wsman',
        auth=('administrator', r'GKYWB-5991792$1c8k'),
        transport='ntlm', read_timeout_sec=30, operation_timeout_sec=20)

    ps1_path = r'C:\Users\Administrator\rtu_field_sim.ps1'
    s.run_ps(f"Set-Content -Path '{ps1_path}' -Value @'\n{RTU_SIM_PS}\n'@ -Encoding UTF8")
    time.sleep(0.5)

    print("[WINRM] Running RTU simulator on 131...")
    r = s.run_cmd(r'powershell -ExecutionPolicy Bypass -File C:\Users\Administrator\rtu_field_sim.ps1')
    out = r.std_out.decode('gbk', errors='ignore').strip()
    print(out)

    await asyncio.sleep(3)

    # 统计结果
    data_events = [e for e in monitor.events if 'data.received' in e[0]]
    connect_events = [e for e in monitor.events if 'connected' in e[0] or 'registered' in e[0]]
    disconnect_events = [e for e in monitor.events if 'disconnected' in e[0]]

    print(f"\n{'='*70}")
    print(f"  方案C 测试结果")
    print(f"{'='*70}")
    print(f"  Server事件: {len(monitor.events)} 条")
    print(f"  RTU连接:    {len(connect_events)} 条")
    print(f"  遥测数据: {len(data_events)} 条")
    print(f"  RTU断开:    {len(disconnect_events)} 条")

    if data_events:
        latest = data_events[-1][1]
        vals = latest.get('values', {})
        print(f"\n  最新遥测 [{latest.get('device_name','?')}]:")
        for k, v in list(vals.items())[:5]:
            print(f"    {k}: {v:.4f}")

    # 清理 - 移除 portproxy
    print(f"\n  清理端口转发...")
    s.run_cmd('netsh interface portproxy delete v4tov4 listenport=53002 listenaddress=11.66.12.131')

    srv_task.cancel()
    print(f"  方案C测试完成!")

asyncio.run(main())
