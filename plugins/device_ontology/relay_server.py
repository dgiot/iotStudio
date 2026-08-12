#!/usr/bin/env python3
"""实时报文中继 — 从主站定时抓包 → 注入仪表盘 → 循环"""
import subprocess, json, time, urllib.request, threading, sys, os
from collections import deque

# ===== 配置 =====
CAPTURE_API = 'http://localhost:8765'
RELAY_PORT = 9876
INTERVAL = 30  # 抓包间隔（秒）

# 主站 netsh trace 配置
HOST = '192.168.10.131'
TARGET_PORTS = [8889, 502, 2404]
ETL_PATH = r'C:\Users\Administrator\relay.etl'

recent = deque(maxlen=50)
stats = {'cycles': 0, 'packets': 0, 'last_cycle': 0, 'errors': 0}

# ===== 1. WinRM 抓包循环 =====
def capture_cycle():
    """在主站运行 netsh trace，拉回结果注入仪表盘"""
    global stats
    stats['cycles'] += 1
    t0 = time.time()

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

        # 清理旧文件
        run(r'del C:\Users\Administrator\relay.etl /Q 2>&1')

        # 抓包
        r = run(r'netsh trace start capture=yes tracefile=C:\Users\Administrator\relay.etl maxsize=100 persistent=no 2>&1')
        if 'Running' not in r:
            stats['errors'] += 1
            p.close_shell(shell)
            return []

        time.sleep(INTERVAL)
        run('netsh trace stop 2>&1')

        # 转换
        run(r'tracerpt C:\Users\Administrator\relay.etl -o C:\Users\Administrator\relay.csv -of CSV 2>&1')

        # 读取 CSV 提取报文摘要
        result = run(r'powershell -c "(Get-Content C:\Users\Administrator\relay.csv -Encoding UTF8 -TotalCount 200).Length" 2>&1')

        p.close_shell(shell)
        stats['last_cycle'] = time.time() - t0
        return []  # ETL 解析复杂，先返回框架就绪信号
    except Exception as e:
        stats['errors'] += 1
        return []

# ===== 2. Scapy 本地实时抓包 =====
def live_sniffer():
    """本地网卡实时嗅探，直接注入仪表盘"""
    try:
        from scapy.all import sniff, Raw, TCP, IP
        from capture_server import parse_mbap_plus

        def handle(pkt):
            if not pkt.haslayer(TCP) or not pkt.haslayer(Raw):
                return
            sp, dp = pkt[TCP].sport, pkt[TCP].dport
            if sp not in TARGET_PORTS and dp not in TARGET_PORTS:
                return

            raw = bytes(pkt[Raw].load)
            if len(raw) < 4: return

            parsed = parse_mbap_plus(raw)
            src = f'{pkt[IP].src}:{sp}'
            dst = f'{pkt[IP].dst}:{dp}'
            direction = 'RX' if dp in TARGET_PORTS else 'TX'

            frame_hex = raw[:80].hex(' ') if len(raw) > 80 else raw.hex(' ')
            data = json.dumps({
                'hex': frame_hex, 'dir': direction, 'src': src, 'dst': dst
            }).encode()

            try:
                req = urllib.request.Request(
                    f'{CAPTURE_API}/api/inject',
                    data=data,
                    headers={'Content-Type': 'application/json'}
                )
                urllib.request.urlopen(req, timeout=2)
                stats['packets'] += 1
            except:
                pass

        print(f'[sniffer] Live capture on ports {TARGET_PORTS}')
        sniff(filter=' or '.join(f'tcp port {p}' for p in TARGET_PORTS),
              prn=handle, store=False)
    except Exception as e:
        print(f'[sniffer] {e} (may need admin)')

# ===== 3. HTTP API =====
from http.server import HTTPServer, BaseHTTPRequestHandler

class RelayHandler(BaseHTTPRequestHandler):
    def _json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/api/status':
            self._json(stats)
        elif self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(f'''<html><body style="font-family:sans-serif;padding:20px;background:#141520;color:#c0c4cc">
<h2>📡 报文中继服务</h2>
<p>抓包间隔: {INTERVAL}s | 周期: {stats["cycles"]} | 报文: {stats["packets"]} | 错误: {stats["errors"]}</p>
<p>目标端口: {TARGET_PORTS} | 主站: {HOST}:5985</p>
<a href="/api/status" style="color:#67c23a">API status</a>
</body></html>'''.encode())
        else:
            self._json({'error': 'not found'}, 404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, *a): pass

def start_relay_api():
    print(f'[relay] API on :{RELAY_PORT}')
    HTTPServer(('0.0.0.0', RELAY_PORT), RelayHandler).serve_forever()

# ===== 4. 启动 =====
if __name__ == '__main__':
    print(f'=== 报文中继服务 ===')
    print(f'  主站: {HOST}:5985')
    print(f'  目标端口: {TARGET_PORTS}')
    print(f'  抓包间隔: {INTERVAL}s')
    print(f'  仪表盘: {CAPTURE_API}')

    # 本地抓包线程
    threading.Thread(target=live_sniffer, daemon=True).start()

    # WinRM 定时抓包线程
    def remote_loop():
        while True:
            capture_cycle()
            time.sleep(INTERVAL)
    threading.Thread(target=remote_loop, daemon=True).start()

    # HTTP API
    start_relay_api()
