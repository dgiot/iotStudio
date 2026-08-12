#!/usr/bin/env python3
"""从131下载netsh trace CSV, 解析53001端口Modbus报文"""
import os, sys, base64, struct
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120)

CSV = r'C:\Users\Administrator\cb_full2.csv'
OUT_TXT = r'C:\Users\Administrator\cb_53001_lines.txt'
OUT_B64 = r'C:\Users\Administrator\cb_53001.b64'

# Step 1: 提取含 NDIS-PacketCapture 且含 53001 的行
print('Step 1: 提取 53001 行...')
r = s.run_cmd(f'findstr /C:"NDIS-PacketCapture" "{CSV}" | findstr /C:"53001" > "{OUT_TXT}"')
print(r.std_out.decode('gbk', errors='ignore').strip()[:200])

# 检查行数
r = s.run_cmd(f'find /c /v "" "{OUT_TXT}"')
print('行数:', r.std_out.decode('gbk', errors='ignore').strip())

# Step 2: 下载
print('Step 2: base64 编码...')
r = s.run_cmd(f'certutil -encode "{OUT_TXT}" "{OUT_B64}"')
print(r.std_out.decode('gbk', errors='ignore').strip()[:200])

print('Step 3: 下载...')
r = s.run_ps(f'Get-Content "{OUT_B64}" -Raw')
b64 = r.std_out.decode('gbk', errors='ignore')
lines_b64 = [l for l in b64.split('\n') if l.strip() and not l.strip().startswith('---')]
data = base64.b64decode(''.join(lines_b64))
print(f'下载了 {len(data)} 字节, {data.count(b"\n")} 行')

# Step 4: 解析每一行
print('\n=== 解析以太网帧 ===')

def parse_ethernet(data, offset=0):
    """解析 Ethernet + IP + TCP"""
    if offset + 14 > len(data):
        return None
    ethertype = struct.unpack('!H', data[offset+12:offset+14])[0]
    if ethertype != 0x0800:
        return None
    ip_start = offset + 14
    if ip_start + 20 > len(data):
        return None
    ihl = (data[ip_start] & 0x0F) * 4
    protocol = data[ip_start+9]
    if protocol != 6:
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
    return (src_ip, dst_ip, src_port, dst_port, payload)

count = 0
p53001 = []
for line in data.decode('utf-8', errors='ignore').split('\n'):
    if 'NDIS-PacketCapture' not in line:
        continue
    parts = line.split(',')
    for part in reversed(parts):
        part = part.strip()
        if part.startswith('0x') and len(part) > 50:
            hexstr = part[2:]
            try:
                raw = bytes.fromhex(hexstr)
            except:
                continue
            result = parse_ethernet(raw)
            if result:
                src_ip, dst_ip, src_port, dst_port, payload = result
                count += 1
                if src_port == 53001 or dst_port == 53001:
                    p53001.append((src_ip, dst_ip, src_port, dst_port, payload))
            break

print(f'解析出 {count} 个TCP包, 其中 {len(p53001)} 个53001端口包')

# 显示53001包
for idx, (src_ip, dst_ip, src_port, dst_port, payload) in enumerate(p53001[:20]):
    direction = 'OUT(LegacyComm→RTU)' if src_port == 53001 else 'IN(RTU→LegacyComm)'
    remote_ip = dst_ip if src_port == 53001 else src_ip
    print(f'\n--- 53001包#{idx+1} {direction} {remote_ip} [{len(payload)}B] ---')

    if len(payload) > 0:
        print(f'  HEX: {payload.hex(" ")[:200]}')
        # Modbus 分析
        if len(payload) >= 2:
            addr, func = payload[0], payload[1]
            func_names = {1:'读线圈',2:'读离散',3:'读保持',4:'读输入',5:'写线圈',6:'写寄存器',15:'写多线圈',16:'写多寄存器'}
            fn = func_names.get(func, f'未知')
            print(f'  Modbus: slave={addr}, func={func}({fn})')
            if func in (0x03, 0x04) and len(payload) >= 8:
                reg = struct.unpack('!H', payload[2:4])[0]
                cnt = struct.unpack('!H', payload[4:6])[0]
                print(f'    起始地址={reg}, 数量={cnt}')
            if len(payload) >= 8:
                crc = struct.unpack('<H', payload[6:8])[0]
                print(f'    CRC=0x{crc:04X}')
    else:
        print(f'  (空)')

if not p53001:
    print('\n⚠️ 没找到53001端口包！可能53001仅在column字段中作为NDIS元数据出现')
    print('检查非53001端口的包:')
    samples = []
    for src_ip, dst_ip, src_port, dst_port, payload in count_list[:10] if 'count_list' in dir() else []:
        pass
