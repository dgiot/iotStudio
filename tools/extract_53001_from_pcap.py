#!/usr/bin/env python3
"""从 pcapng 提取 LegacyComm :53001 真实报文 + 重放到 :53002 测试"""
import sys, os
from scapy.all import rdpcap, TCP, IP, Raw
from collections import defaultdict

PCAP = r'D:\ai\io服务器分析\7.10.pcapng'

print(f'Loading {PCAP} ({os.path.getsize(PCAP)/1024/1024:.0f} MB)...')
print('This may take a minute...')

# 读取并过滤 53001 端口包
packets = rdpcap(PCAP)
print(f'Total packets: {len(packets)}')

# 过滤 TCP 53001
p53001 = []
for pkt in packets:
    if TCP in pkt and IP in pkt:
        if pkt[TCP].sport == 53001 or pkt[TCP].dport == 53001:
            if Raw in pkt:
                payload = bytes(pkt[Raw])
                if len(payload) > 0:
                    p53001.append((pkt, payload))

print(f'53001 packets with payload: {len(p53001)}')

if len(p53001) == 0:
    print('No 53001 payload found in this capture!')
    # 看看有哪些端口
    ports = defaultdict(int)
    for pkt in packets:
        if TCP in pkt and pkt[TCP].sport > 50000 or pkt[TCP].dport > 50000:
            pass  # skip high ports
        if TCP in pkt and Raw in pkt:
            sp = pkt[TCP].sport
            dp = pkt[TCP].dport
            ports[(sp, dp)] += 1
    print(f'\nTop 20 port pairs with payload:')
    for (sp, dp), cnt in sorted(ports.items(), key=lambda x: -x[1])[:20]:
        print(f'  {sp} -> {dp}: {cnt} packets')
    sys.exit(1)

# 按方向分类
outbound = [(p, pl) for p, pl in p53001 if p[TCP].sport == 53001]  # LegacyComm → RTU
inbound = [(p, pl) for p, pl in p53001 if p[TCP].dport == 53001]   # RTU → LegacyComm

print(f'\nLegacyComm→RTU (outbound): {len(outbound)} packets')
print(f'RTU→LegacyComm (inbound):  {len(inbound)} packets')

# 按 IP 分组
ip_groups = defaultdict(list)
for pkt, payload in inbound:
    src_ip = pkt[IP].src
    ip_groups[src_ip].append((pkt, payload))

print(f'\nUnique RTU IPs: {len(ip_groups)}')
for ip, pkts in sorted(ip_groups.items(), key=lambda x: -len(x[1]))[:10]:
    print(f'  {ip}: {len(pkts)} packets')

# 显示每个RTU的第一个包 (注册包!)
print('\n' + '='*70)
print(' FIRST PACKETS FROM EACH RTU (likely registration messages)')
print('='*70)

sample_count = 0
for ip, pkts in sorted(ip_groups.items(), key=lambda x: -len(x[1])):
    if sample_count >= 5:
        break
    pkt, payload = pkts[0]
    src_port = pkt[TCP].sport
    print(f'\n--- RTU {ip}:{src_port} ---')
    print(f'  Payload: {len(payload)} bytes')
    print(f'  HEX: {payload.hex(" ")[:200]}')

    # 尝试解析
    if len(payload) >= 2:
        b0, b1 = payload[0], payload[1]
        print(f'  Byte[0]={b0:02X}({b0}) Byte[1]={b1:02X}({b1})')

        # 检查是否是 Modbus RTU
        if b1 in (1, 2, 3, 4, 5, 6, 15, 16):
            fn = {1:'读线圈',2:'读离散',3:'读保持',4:'读输入',5:'写线圈',6:'写寄存器',15:'写多线圈',16:'写多寄存器'}.get(b1,'?')
            print(f'  --> Modbus RTU: slave={b0} func={b1}({fn})')
            if len(payload) >= 8 and b1 in (3, 4):
                import struct
                addr = struct.unpack('>H', payload[2:4])[0]
                qty = struct.unpack('>H', payload[4:6])[0]
                crc = struct.unpack('<H', payload[6:8])[0]
                print(f'  --> addr={addr} qty={qty} CRC=0x{crc:04X}')

        # ASCII
        try:
            text = payload.decode('ascii', errors='replace')
            printable = ''.join(c if 0x20 <= ord(c) < 0x7F else '.' for c in text)
            if any(c.isalpha() for c in printable[:20]):
                print(f'  ASCII: {printable[:100]}')
        except:
            pass

    # 显示前几个包作为样本
    for j, (p2, pl2) in enumerate(pkts[1:4], 1):
        print(f'  Pkt#{j+1}: {len(pl2)}B HEX: {pl2[:40].hex(" ")}')
        if len(pl2) >= 2:
            b0, b1 = pl2[0], pl2[1]
            if b1 in range(1, 17):
                print(f'          Modbus: slave={b0} func={b1}')

    sample_count += 1

# 显示 LegacyComm 发出的查询
print(f'\n' + '='*70)
print(f' LegacyComm QUERIES (outbound, first 5)')
print('='*70)
for i, (pkt, payload) in enumerate(outbound[:5]):
    dst_ip = pkt[IP].dst
    dst_port = pkt[TCP].dport
    print(f'\n  LegacyComm→{dst_ip}:{dst_port} [{len(payload)}B]')
    print(f'  HEX: {payload.hex(" ")[:100]}')
    if len(payload) >= 2:
        b0, b1 = payload[0], payload[1]
        if b1 in (1,2,3,4,5,6,15,16):
            fn = {1:'读线圈',2:'读离散',3:'读保持',4:'读输入'}.get(b1,'?')
            print(f'  Modbus: slave={b0} func={b1}({fn})')

# 保存提取的报文供重放
print(f'\n' + '='*70)
print(f' Saving extracted payloads for replay...')
print('='*70)

replay_dir = r'D:\ai\dgiot_lite\data\captured_packets'
os.makedirs(replay_dir, exist_ok=True)

# 保存每个RTU的首个注册包
with open(os.path.join(replay_dir, 'rtu_first_packets.txt'), 'w') as f:
    for ip, pkts in sorted(ip_groups.items(), key=lambda x: -len(x[1])):
        pkt, payload = pkts[0]
        f.write(f'IP={ip} LEN={len(payload)} HEX={payload.hex()}\n')

# 保存前10个RTU的所有报文
for i, (ip, pkts) in enumerate(sorted(ip_groups.items(), key=lambda x: -len(x[1]))[:10]):
    with open(os.path.join(replay_dir, f'rtu_{i}_{ip.replace(".","_")}.bin'), 'wb') as f:
        for pkt, payload in pkts[:50]:  # max 50 packets per RTU
            f.write(struct.pack('>I', len(payload)))
            f.write(payload)

print(f'Saved to {replay_dir}')
print('Ready for replay to 127.0.0.1:53002!')
