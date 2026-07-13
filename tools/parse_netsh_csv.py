#!/usr/bin/env python3
"""解析 netsh trace 导出的 CSV，提取 Modbus 帧"""
import os, sys, re, csv

csv_path = sys.argv[1] if len(sys.argv) > 1 else None
if not csv_path:
    print("用法: python parse_netsh_csv.py <csv文件路径>")
    print("先从131下载 CSV: certutil + base64 传过来")
    sys.exit(1)

with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

lines = content.strip().split('\n')
print(f'总行数: {len(lines)}')

# NDIS PacketCapture 格式:
# ProviderName, EventId, ..., ..., ..., ..., ..., flags, srcPort, dstPort, payloadSize, ..., ..., payloadHex

# 找含 hex payload 的行（最后几个字段是长 hex 字符串）
modbus_frames = []
for i, line in enumerate(lines):
    # 找含有 Modbus 特征的行
    if '53001' in line or re.search(r'0103[0-9A-Fa-f]{4}', line):
        # 提取最后的 hex payload
        parts = line.split(',')
        # hex payload 是最后一个字段，至少 20 个 hex 字符
        for part in reversed(parts):
            part = part.strip()
            if re.match(r'^[0-9A-Fa-f]{20,}$', part):
                modbus_frames.append((i, part))
                break

print(f'含 hex payload 的 Modbus 相关行: {len(modbus_frames)}')

# 解析 hex payload
for idx, (line_no, hexstr) in enumerate(modbus_frames[:30]):  # 先看前30个
    try:
        data = bytes.fromhex(hexstr)
        # 找 Modbus 帧
        # 可能的帧格式:
        # 1. 标准 Modbus TCP (MBAP头 6字节): 00 00 00 00 00 06 01 03 ...
        # 2. Modbus RTU over TCP: 01 03 00 00 00 0A C5 CD ...

        # 搜索 01 03 (slave=1, read holding registers)
        pos = data.find(b'\x01\x03')
        if pos >= 0:
            # 前面可能是 MBAP 头或直接是帧
            prefix = data[:pos]
            frame = data[pos:pos+8]  # Modbus RTU 请求最小8字节 (addr+func+start+count+crc)

            # 如果是 Modbus TCP (MBAP)
            if len(prefix) == 6 and prefix[0:2] == b'\x00\x00':
                tcp_frame = data[pos-6:pos+8]
                print(f'\n[行{line_no}] Modbus TCP @ offset {pos-6}: {tcp_frame.hex(" ")}')
                print(f'  MBAP: {prefix.hex(" ")}')
                print(f'  帧: {frame.hex(" ")}')
            else:
                # 可能是 RTU over TCP
                rtu_frame = data[pos:pos+8]  # 8字节包含 CRC
                crc = data[pos+6:pos+8]
                print(f'\n[行{line_no}] Modbus RTU @ offset {pos}: {rtu_frame.hex(" ")} CRC: {crc.hex(" ")}')

            # 显示前后文
            start = max(0, pos-10)
            end = min(len(data), pos+20)
            context = data[start:end]
            print(f'  上下文 [{start}:{end}]: {context.hex(" ")}')

        elif b'\x01\x04' in data:
            pos = data.find(b'\x01\x04')
            print(f'\n[行{line_no}] Read Input @ offset {pos}: {data[pos:pos+8].hex(" ")}')

        elif b'\x01\x01' in data:
            pos = data.find(b'\x01\x01')
            print(f'\n[行{line_no}] Read Coils @ offset {pos}: {data[pos:pos+8].hex(" ")}')

        elif b'\x01\x06' in data:
            pos = data.find(b'\x01\x06')
            print(f'\n[行{line_no}] Write Register @ offset {pos}: {data[pos:pos+8].hex(" ")}')

        else:
            # 显示原始数据
            print(f'\n[行{line_no}] 未识别的hex数据 ({len(data)} bytes): {data[:40].hex(" ")}')

    except Exception as e:
        print(f'\n[行{line_no}] 解析错误: {e}')

# 统计分析
print('\n' + '='*60)
print('协议统计')
print('='*60)

slave_ids = set()
func_codes = set()
for _, hexstr in modbus_frames:
    try:
        data = bytes.fromhex(hexstr)
        for pattern in [b'\x01\x03', b'\x01\x04', b'\x01\x01', b'\x01\x06',
                       b'\x02\x03', b'\x03\x03', b'\x04\x03']:
            pos = data.find(pattern)
            if pos >= 0 and pos + 7 < len(data):
                slave_ids.add(data[pos])
                func_codes.add(data[pos+1])
    except:
        pass

print(f'从站地址 (Slave ID): {sorted(slave_ids)}')
print(f'功能码: {sorted(func_codes)}')
