#!/usr/bin/env python3
"""下载 NetConnection trace CSV 并解析 53001 端口数据"""
import os, sys, base64, struct
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=120)

CSV_REMOTE = r'C:\Users\Administrator\cb_netconn.csv'
OUT_B64 = r'C:\Users\Administrator\cb_netconn.b64'

# 编码下载
print('Encoding CSV to base64...')
r = s.run_cmd(f'certutil -encode "{CSV_REMOTE}" {OUT_B64}')
print(r.std_out.decode('gbk', errors='ignore').strip())

print('Downloading...')
r = s.run_ps(f'Get-Content {OUT_B64} -Raw')
b64 = r.std_out.decode('gbk', errors='ignore')
lines_b64 = [l for l in b64.split('\n') if l.strip() and not l.strip().startswith('---')]
data = base64.b64decode(''.join(lines_b64))
text = data.decode('utf-8', errors='ignore')
print(f'Downloaded: {len(data)} bytes, {text.count(chr(10))} lines')

# 保存原始
local_csv = r'D:\ai\dgiot_lite\data\cb_netconn.csv'
with open(local_csv, 'wb') as f:
    f.write(data)

# 分析 53001 相关行
lines = text.split('\n')
print(f'\n=== 分析 53001 端口事件 ===')
header = lines[0]
print(f'Header: {header[:200]}')

count_53001 = 0
events = {}
for line in lines[1:]:
    if '53001' in line:
        count_53001 += 1
        # 解析事件类型
        parts = line.split(',')
        if len(parts) >= 2:
            event_type = parts[1].strip()
            events[event_type] = events.get(event_type, 0) + 1

print(f'53001 事件总数: {count_53001}')
print(f'事件类型分布:')
for k, v in sorted(events.items(), key=lambda x: -x[1]):
    print(f'  {k}: {v}')

# 显示前10行53001事件的完整内容
print(f'\n=== 前10行 53001 事件 ===')
n = 0
for line in lines[1:]:
    if '53001' in line and n < 10:
        print(f'\n  [{n+1}] {line[:500]}')
        n += 1

# 检查是否有 payload 数据
print(f'\n=== 搜索潜在的 hex payload ===')
for i, line in enumerate(lines[1:], 1):
    if '53001' in line:
        parts = line.split(',')
        for part in reversed(parts):
            part = part.strip()
            # 找长 hex 字符串
            if len(part) > 40 and part.startswith('0x'):
                hexstr = part[2:]
                try:
                    raw = bytes.fromhex(hexstr)
                    print(f'  行{i}: hex payload {len(raw)}B: {raw[:50].hex(" ")}')
                    # 解析
                    if len(raw) >= 14:
                        # 尝试解析为 Ethernet 帧
                        ethtype = struct.unpack('!H', raw[12:14])[0]
                        if ethtype == 0x0800:
                            ip_start = 14
                            ihl = (raw[ip_start] & 0x0F) * 4
                            proto = raw[ip_start+9]
                            src_ip = '.'.join(str(b) for b in raw[ip_start+12:ip_start+16])
                            dst_ip = '.'.join(str(b) for b in raw[ip_start+16:ip_start+20])
                            if proto == 6:
                                tcp_start = ip_start + ihl
                                sp = struct.unpack('!H', raw[tcp_start:tcp_start+2])[0]
                                dp = struct.unpack('!H', raw[tcp_start+2:tcp_start+4])[0]
                                print(f'    TCP: {src_ip}:{sp} -> {dst_ip}:{dp}')
                                data_offset = ((raw[tcp_start+12] >> 4) & 0x0F) * 4
                                payload = raw[tcp_start+data_offset:]
                                if len(payload) > 0:
                                    print(f'    PAYLOAD [{len(payload)}B]: {payload[:60].hex(" ")}')
                                    # Modbus分析
                                    if len(payload) >= 2:
                                        addr, func = payload[0], payload[1]
                                        if func in (1,2,3,4,5,6,15,16):
                                            fn = {1:'读线圈',2:'读离散',3:'读保持',4:'读输入',5:'写线圈',6:'写寄存器',15:'写多线圈',16:'写多寄存器'}.get(func,'?')
                                            print(f'    MODBUS: slave={addr}, func={func}({fn})')
                except Exception as e:
                    pass
                break  # 每行只处理最后一个hex
