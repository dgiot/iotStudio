#!/usr/bin/env python3
"""206台 RTU Modbus TCP 模拟器 — 完整设备数据库 + 持续数据推送仪表盘"""
import struct, socket, threading, time, random, json, urllib.request, re

PORT = 53001
DASHBOARD = 'http://localhost:8765'

# === 1. 从设备清单加载 206 台 RTU ===
RTU_DB = {}
try:
    with open('../dgiot_collector/docs/03_数据配置/设备清单_Modbus_OPC.md', 'r', encoding='utf-8') as f:
        content = f.read()
except:
    content = ''

# 解析 Markdown 表格
for line in content.split('\n'):
    parts = [p.strip() for p in line.split('|') if p.strip()]
    if len(parts) >= 6:
        try:
            num = int(parts[0]); ip = parts[1]; slave = int(parts[2])
            rx_hex = parts[5].strip('`').strip()
            if rx_hex and len(rx_hex) > 16:
                raw = bytes.fromhex(rx_hex.replace(' ', ''))
                if len(raw) >= 9 and raw[7] == 3 and len(raw) >= 10:
                    byte_cnt = raw[8]
                    vals = []
                    for i in range(0, min(byte_cnt, 100), 2):
                        if 9+i+2 <= len(raw):
                            vals.append(int.from_bytes(raw[9+i:11+i], 'big'))
                    if vals:
                        RTU_DB[ip] = {'num': num, 'slave': slave, 'regs': vals[:20]}
        except: pass

print(f'[Sim] Loaded {len(RTU_DB)} RTU devices from device list')

# === 2. Modbus TCP 服务器 ===
def handle_client(conn, addr):
    client_ip = addr[0]
    rtu = RTU_DB.get(client_ip)
    if rtu is None:
        # 用第一个设备作为默认响应
        rtu = list(RTU_DB.values())[0] if RTU_DB else {'slave': 1, 'regs': [0,0,0,0]}

    slave = rtu['slave']
    regs = list(rtu['regs'])
    base_regs = list(rtu['regs'])

    try:
        conn.settimeout(10)
        while True:
            data = conn.recv(4096)
            if not data: break
            if len(data) < 8: continue

            tid = int.from_bytes(data[0:2], 'big')
            pid = int.from_bytes(data[2:4], 'big')
            uid = data[6]
            fc = data[7]
            if pid != 0 or uid > 247 or fc not in (3, 16):
                continue

            if fc == 3:
                addr = int.from_bytes(data[8:10], 'big')
                count = min(int.from_bytes(data[10:12], 'big'), 125)

                # 模拟数据漂移
                for i in range(len(regs)):
                    drift = random.randint(-3, 3)
                    regs[i] = min(65535, max(0, base_regs[i % len(base_regs)] + drift + random.randint(-5, 5)))

                # 拼接响应
                resp = struct.pack('>HHHBBB', tid, 0, 3 + count*2, slave, 3, count * 2)
                for i in range(count):
                    v = regs[i % len(regs)]
                    resp += struct.pack('>H', v & 0xFFFF)
                conn.sendall(resp)

                # 推仪表盘
                data_json = json.dumps({
                    "hex": resp.hex(' '), "dir": "RX",
                    "src": f"{addr[0]}:502", "dst": "131:53001"
                }).encode()
                try:
                    req = urllib.request.urlopen(urllib.request.Request(DASHBOARD + '/api/inject', data=data_json,
                        headers={'Content-Type': 'application/json'})
                    urllib.request.urlopen(req, timeout=1)
                except: pass

    except: pass
    finally:
        conn.close()

def start_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('0.0.0.0', PORT))
    sock.listen(50)
    print(f'[Sim] Listening on :{PORT}')
    print(f'[Sim] {len(RTU_DB)} RTU devices ready')

    while True:
        conn, addr = sock.accept()
        threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()

if __name__ == '__main__':
    if not RTU_DB:
        print('[Sim] No devices loaded, adding fallback data...')
        for i in range(1, 207):
            ip = f'11.248.{(i%255)+1}.{(i//255)+1}'
            RTU_DB[ip] = {'num': i, 'slave': 1 if i%10 else 2, 'regs': [i*100, i*10, i, 0]}
        print(f'[Sim] Generated {len(RTU_DB)} fallback devices')

    # 后台推送线程
    def pusher():
        while True:
            for ip, rtu in list(RTU_DB.items())[:10]:  # 每轮推 10 台
                regs = rtu['regs']
                slave = rtu['slave']
                tid = random.randint(1, 65535)
                # TX: 查询
                tx = struct.pack('>HHHBBHH', tid, 0, 6, slave, 3, 299, min(4, len(regs)))
                data_json = json.dumps({
                    "hex": tx.hex(' '), "dir": "TX",
                    "src": "131:53001", "dst": f"{ip}:502"
                }).encode()
                try:
                    urllib.request.urlopen(urllib.request.Request(DASHBOARD + '/api/inject', data=data_json,
                        headers={'Content-Type': 'application/json'})
                except: pass
                time.sleep(0.1)
            time.sleep(5)

    threading.Thread(target=pusher, daemon=True).start()
    start_server()
