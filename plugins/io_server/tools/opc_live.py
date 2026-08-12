#!/usr/bin/env python3
"""OPC DA 实时采集 — netsh trace 循环 + DCE/RPC 解析"""
import json, struct, time, socket, urllib.request, threading, subprocess, os
from collections import deque

CAPTURE_API = 'http://localhost:8765'
HOST = '192.168.10.131'

class OPCLiveCollector:
    def __init__(self):
        self.data = deque(maxlen=10000)
        self.stats = {'cycles': 0, 'values': 0, 'errors': 0}

    def run_capture_cycle(self):
        """一个抓包周期: 开始→等待→停止→解析"""
        self.stats['cycles'] += 1

        try:
            from winrm.protocol import Protocol
            p = Protocol(
                endpoint=f'http://{HOST}:5985/wsman',
                transport='ntlm',
                username='administrator',
                password=r'CHANGEME'
            )
            shell = p.open_shell()

            def run(cmd):
                cid = p.run_command(shell, cmd)
                out, _, _ = p.get_command_output(shell, cid)
                return out.decode('gbk', errors='ignore').strip()

            # Clean + start trace
            run(r'del C:\Users\Administrator\opc_live.etl /Q 2>&1')
            r = run(r'netsh trace start capture=yes tracefile=C:\Users\Administrator\opc_live.etl maxsize=50 persistent=no 2>&1')

            if 'Running' not in r:
                self.stats['errors'] += 1
                p.close_shell(shell)
                return

            time.sleep(20)  # Capture 20s

            run('netsh trace stop 2>&1')

            # Convert to CSV
            run(r'tracerpt C:\Users\Administrator\opc_live.etl -o C:\Users\Administrator\opc_live.csv -of CSV 2>&1')

            # Read CSV and extract OPC data
            r = run(r'powershell -c "(Get-Content C:\Users\Administrator\opc_live.csv | Select-String 192.168.10.23 | Measure-Object -Line).Lines" 2>&1')

            p.close_shell(shell)

            # Inject summary to dashboard
            data = json.dumps({
                "hex": f"OPC live cycle {self.stats['cycles']}: DCS-A events={r.strip()}",
                "dir": "RX",
                "src": "192.168.10.23",
                "dst": "192.168.10.131"
            }).encode()

            try:
                req = urllib.request.Request(
                    f'{CAPTURE_API}/api/inject',
                    data=data,
                    headers={'Content-Type': 'application/json'}
                )
                urllib.request.urlopen(req, timeout=3)
            except:
                pass

            print(f'Cycle {self.stats["cycles"]}: events={r.strip()}')

        except Exception as e:
            print(f'Cycle error: {e}')
            self.stats['errors'] += 1

    def start(self, interval=30):
        """启动定时采集"""
        print(f'OPC Live Collector starting (interval={interval}s)')

        def loop():
            while True:
                self.run_capture_cycle()
                time.sleep(interval - 20)  # 20s capture + wait

        threading.Thread(target=loop, daemon=True).start()

if __name__ == '__main__':
    collector = OPCLiveCollector()
    collector.start(interval=30)

    # Keep running
    try:
        while True:
            time.sleep(5)
            print(f'  [{collector.stats["cycles"]}] cycles, {collector.stats["values"]} values')
    except KeyboardInterrupt:
        print('Stopped')
