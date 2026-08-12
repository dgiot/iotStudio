#!/usr/bin/env python3
"""解析 netsh trace ETL/CSV 中的网络包，提取 53001 端口 Modbus 流量"""
import os, sys, struct

csv_path = sys.argv[1] if len(sys.argv) > 1 else None
if not csv_path:
    print("用法: python parse_etl_packets.py <csv文件>")
    print("先从 131 下载 CSV 到本地")
    sys.exit(1)

def parse_ethernet(data, offset=0):
    """解析 Ethernet + IPv4 + TCP, 返回 (src_ip, dst_ip, src_port, dst_port, tcp_payload)"""
    if offset + 14 > len(data):
        return None
    dst_mac = data[offset:offset+6].hex(':')
    src_mac = data[offset+6:offset+12].hex(':')
    ethertype = struct.unpack('!H', data[offset+12:offset+14])[0]
    if ethertype != 0x0800:  ***REMOVED***v4
        return None

    ip_start = offset + 14
    if ip_start + 20 > len(data):
        return None
    ip_ver_ihl = data[ip_start]
    ihl = (ip_ver_ihl & 0x0F) * 4
    total_len = struct.unpack('!H', data[ip_start+2:ip_start+4])[0]
    protocol = data[ip_start+9]
    if protocol != 6:  # TCP
        return None
    src_ip = '.'.join(str(b) for b in data[ip_start+12:ip_start+16])
    dst_ip = '.'.join(str(b) for b in data[ip_start+16:ip_start+20])

    tcp_start = ip_start + ihl
    if tcp_start + 20 > len(data):
        return None
    src_port = struct.unpack('!H', data[tcp_start:tcp_start+2])[0]
    dst_port = struct.unpack('!H', data[tcp_start+2:tcp_start+4])[0]
    data_offset = ((data[tcp_start+12] >> 4) & 0x0F) * 4

    payload_start = tcp_start + data_offset
    payload = data[payload_start:]
    return (src_ip, dst_ip, src_port, dst_port, src_mac, dst_mac, payload)


with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

print(f'总行数: {len(lines)}')
print(f'CSV header: {lines[0][:200]}')

packets_53001 = []
packets_all = []

for i, line in enumerate(lines[1:], 1):  # skip header
    if 'NDIS-PacketCapture' not in line:
        continue
    # 提取 hex payload (最后一列，以 0x 开头的最长hex串)
    parts = line.split(',')
    for part in reversed(parts):
        part = part.strip()
        if part.startswith('0x') and len(part) > 50:
            hexstr = part[2:]  # 去掉 0x 前缀
            try:
                data = bytes.fromhex(hexstr)
            except:
                continue
            result = parse_ethernet(data)
            if result:
                src_ip, dst_ip, src_port, dst_port, src_mac, dst_mac, payload = result
                packets_all.append((i, src_ip, dst_ip, src_port, dst_port, payload))

                if src_port == 53001 or dst_port == 53001:
                    packets_53001.append((i, src_ip, dst_ip, src_port, dst_port, payload))
            break

print(f'\n全部 TCP 包: {len(packets_all)}')
print(f'53001 端口包: {len(packets_53001)}')

# 显示 53001 端口包详情
for idx, (line_no, src_ip, dst_ip, src_port, dst_port, payload) in enumerate(packets_53001[:30]):
    direction = 'OUT' if src_port == 53001 else 'IN'
    print(f'\n--- 包{idx+1} 行{line_no} {direction} {src_ip}:{src_port} -> {dst_ip}:{dst_port} [{len(payload)}B payload] ---')

    if len(payload) > 0:
        # 显示完整hex
        hexdump = payload.hex(' ')
        print(f'  HEX: {hexdump[:200]}')
        if len(payload) > 100:
            print(f'  ... ({len(payload)}B total)')

        # 分析内容
        # 1. 检查是否是 Modbus RTU (addr+func直接开头)
        if len(payload) >= 2:
            addr = payload[0]
            func = payload[1]
            if func in (0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x0F, 0x10):
                print(f'  ✅ Modbus: slave={addr}, func={func} ({func_name(func)})')
                if func in (0x03, 0x04) and len(payload) >= 8:
                    reg = struct.unpack('!H', payload[2:4])[0]
                    cnt = struct.unpack('!H', payload[4:6])[0]
                    crc = struct.unpack('<H', payload[6:8])[0]
                    print(f'     addr={reg}, count={cnt}, CRC=0x{crc:04X}')
                elif func == 0x01 and len(payload) >= 8:
                    reg = struct.unpack('!H', payload[2:4])[0]
                    cnt = struct.unpack('!H', payload[4:6])[0]
                    crc = struct.unpack('<H', payload[6:8])[0]
                    print(f'     addr={reg}, count={cnt}, CRC=0x{crc:04X}')
            else:
                print(f'  ❓ 非标准Modbus: addr={addr}, func={func}')
                # 尝试显示ASCII
                try:
                    ascii_text = payload[:100].decode('ascii', errors='replace')
                    if any(c.isprintable() for c in ascii_text):
                        print(f'  ASCII: {repr(ascii_text[:100])}')
                except:
                    pass
        # 2. 检查结尾是否有特殊标记
        if len(payload) >= 4:
            tail = payload[-4:]
            tail_hex = tail.hex(' ')
            print(f'  尾部4B: {tail_hex}')
            if tail == b'\r\n\r\n':
                print(f'  📋 尾部是 CRLF CRLF (HTTP风格)')
            if tail.endswith(b'\r\n'):
                print(f'  📋 结尾是 CRLF')
            if b'----' in tail or b'Boundary' in payload[-20:]:
                print(f'  📋 尾部含 MIME Boundary标记')

    # 显示关键特征
    # 检查是否有已知协议特征
    if payload.startswith(b'\x01\x03'):
        print(f'  🔵 标准Modbus RTU Read Holding Registers')
    elif payload.startswith(b'\x01\x04'):
        print(f'  🔵 标准Modbus RTU Read Input Registers')
    elif payload.startswith(b'\x01\x01'):
        print(f'  🔵 标准Modbus RTU Read Coils')
    elif payload.startswith(b'\x00\x00'):
        print(f'  🔵 可能是Modbus TCP (MBAP头)')
    elif len(payload) > 0 and 0x48 <= payload[0] <= 0x7A:  # ASCII range
        print(f'  🟡 疑似ASCII文本协议')
    elif len(payload) == 0:
        print(f'  ⚪ 空payload (ACK?)')

def func_name(fc):
    names = {1:'读线圈', 2:'读离散输入', 3:'读保持寄存器', 4:'读输入寄存器',
             5:'写单线圈', 6:'写单寄存器', 15:'写多线圈', 16:'写多寄存器'}
    return names.get(fc, f'未知(0x{fc:02X})')


# === 汇总统计数据 ===
print('\n' + '='*70)
print('53001 端口流量统计汇总')
print('='*70)

if packets_53001:
    directions = {}
    payload_sizes = []
    first_bytes = {}
    ips = {}
    for _, src_ip, dst_ip, src_port, dst_port, payload in packets_53001:
        direction = 'OUT(LegacyComm→RTU)' if src_port == 53001 else 'IN(RTU→LegacyComm)'
        directions[direction] = directions.get(direction, 0) + 1
        payload_sizes.append(len(payload))
        if src_port == 53001:
            ips[dst_ip] = ips.get(dst_ip, 0) + 1
        else:
            ips[src_ip] = ips.get(src_ip, 0) + 1
        if len(payload) > 0:
            fb = payload[0]
            first_bytes[fb] = first_bytes.get(fb, 0) + 1

    print(f'方向分布: {directions}')
    print(f'Payload 大小分布: min={min(payload_sizes)}, max={max(payload_sizes)}, avg={sum(payload_sizes)/len(payload_sizes):.0f}')
    print(f'首字节分布 (Top10): {sorted(first_bytes.items(), key=lambda x:-x[1])[:10]}')
    print(f'关联IP数: {len(ips)}')
    print(f'Top10 IP:')
    for ip, cnt in sorted(ips.items(), key=lambda x:-x[1])[:10]:
        print(f'  {ip}: {cnt}包')
else:
    print('❌ 未找到 53001 端口流量!')
    print(f'\n所有端口:')
    ports = set()
    for _, src_ip, dst_ip, src_port, dst_port, payload in packets_all:
        ports.add((src_port, dst_port))
    for sp, dp in sorted(ports, key=lambda x: x[0]):
        print(f'  {sp} -> {dp}')
