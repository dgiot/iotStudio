#!/usr/bin/env python3
"""scapy 包注入器 — 构造真实 IP/TCP/Modbus 包注入本地模拟器，206台RTU"""
import time, struct, random, json, threading, urllib.request
from collections import defaultdict

try:
    from scapy.all import IP, TCP, Raw, send
    SCAPY = True
except ImportError:
    SCAPY = False
    print("[!] scapy not installed, using raw socket fallback")
    import socket

CAPTURE_API = 'http://localhost:8765'
TARGET = '127.0.0.1'  # 注入到本地模拟器
DST_PORT = 53001
SRC_IP_BASE = '11.248'  # 伪装源 IP 网段

# === 加载 206 RTU 数据 ===
RTU_DB = {}
try:
    with open('../dgiot_collector/docs/03_数据配置/设备清单_Modbus_OPC.md', 'r', encoding='utf-8') as f:
        content = f.read()
    for line in content.split('\n'):
        parts = [p.strip() for p in line.split('|') if p.strip()]
        if len(parts) >= 6:
            try:
                num = int(parts[0]); ip = parts[1]; slave = int(parts[2])
                rx_hex = parts[5].strip('`').strip()
                if rx_hex and len(rx_hex) > 16:
                    raw = bytes.fromhex(rx_hex.replace(' ', ''))
                    if len(raw) >= 9 and raw[7] == 3 and len(raw) > 9:
                        byte_cnt = raw[8]
                        vals = [int.from_bytes(raw[9+i:11+i], 'big') for i in range(0, min(byte_cnt, 100), 2) if 9+i+2 <= len(raw)]
                        if vals:
                            RTU_DB[ip] = {'num': num, 'slave': slave, 'regs': vals[:20]}
            except: pass
except: pass

if not RTU_DB:
    for i in range(1, 207):
        ip = f'11.248.{i%255+1}.{i//255+1}'
        RTU_DB[ip] = {'num': i, 'slave': 1 if i%10 else 2, 'regs': [i*100+i*10+i, i*50, i*2, 0]}
print(f'[Injector] {len(RTU_DB)} RTU devices loaded')

def build_modbus_packet(src_ip, slave, tid, regs, addr=299, count=None):
    """构造完整的 IP/TCP/Modbus 响应包"""
    if count is None:
        count = min(4, len(regs))

    # Modbus TCP 响应帧
    byte_count = count * 2
    modbus = struct.pack('>HHHBBB', tid, 0, 3 + byte_count, slave, 3, byte_count)
    for i in range(count):
        v = regs[i % len(regs)]
        modbus += struct.pack('>H', v & 0xFFFF)

    # 随机源端口 (502 或高位)
    src_port = random.choice([502, 41324, 7581, 57598, 25991])

    if SCAPY:
        pkt = (
            IP(src=src_ip, dst=TARGET) /
            TCP(sport=src_port, dport=DST_PORT, flags='PA', seq=random.randint(1, 0x7FFFFFFF)) /
            Raw(load=modbus)
        )
        return pkt
    else:
        return modbus  # raw socket

def inject_scapy(pkt):
    """scapy 注入到网卡"""
    try:
        send(pkt, verbose=False)
    except:
        pass

def inject_raw(modbus_data):
    """原始 socket 发送"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1)
        s.connect((TARGET, DST_PORT))
        s.sendall(modbus_data)
        s.close()
    except:
        pass

def push_dashboard(src_ip, modbus_data):
    """推送到仪表盘"""
    data = json.dumps({
        "hex": modbus_data.hex(' '),
        "dir": "RX",
        "src": f"{src_ip}:502",
        "dst": f"131:{DST_PORT}"
    }).encode()
    try:
        urllib.request.urlopen(urllib.request.Request(
            CAPTURE_API + '/api/inject', data=data,
            headers={'Content-Type': 'application/json'}), timeout=1)
    except: pass

def injector_loop():
    """持续注入循环"""
    rtu_list = list(RTU_DB.items())
    tid = 1000
    stats = {'injected': 0}

    print(f'[Injector] Starting, target={TARGET}:{DST_PORT}')
    print(f'[Injector] Rate: 10 RTU/sec')

    while True:
        for ip, rtu in random.sample(rtu_list, min(10, len(rtu_list))):
            slave = rtu['slave']
            regs = rtu['regs']

            # 模拟数据漂移
            regs = [max(0, min(65535, v + random.randint(-10, 10))) for v in regs]
            RTU_DB[ip]['regs'] = regs
            tid = (tid + 1) % 65535

            modbus_data = build_modbus_packet(ip, slave, tid, regs)

            if SCAPY:
                inject_scapy(modbus_data)
            else:
                inject_raw(modbus_data)

            push_dashboard(ip, modbus_data if isinstance(modbus_data, bytes) else bytes(modbus_data[Raw]))

            stats['injected'] += 1
            time.sleep(0.1)

        time.sleep(3)  # 每轮间隔

if __name__ == '__main__':
    threading.Thread(target=injector_loop, daemon=True).start()
    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print('\nStopped')
