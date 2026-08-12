#!/usr/bin/env python3
"""最后一搏抓 LegacyComm:53001 报文 — 多种 ETW provider 组合"""
import os, sys, time, base64, struct
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '127.0.0.1,11.*,172.*'
import winrm

s = winrm.Session(
    'http://127.0.0.1:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120, operation_timeout_sec=100)

ETL = r'C:\Users\Administrator\cb_final.etl'
CSV = r'C:\Users\Administrator\cb_final.csv'

# 方法: scenario=NetConnection + maxsize
print('=== Scenario=NetConnection, 60s capture ===')
r = s.run_cmd(f'netsh trace start scenario=NetConnection capture=yes tracefile={ETL} maxsize=500')
print(r.std_out.decode('gbk', errors='ignore').strip())
print('Waiting 60s...')
time.sleep(65)
r = s.run_cmd('netsh trace stop')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 导出
r = s.run_cmd(f'netsh trace convert input={ETL} dump=csv')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 检查文件大小
r = s.run_cmd(f'dir {ETL}')
print(r.std_out.decode('gbk', errors='ignore').strip()[:300])

# 搜索 53001 端口的数据事件
print('\n=== 搜索 53001 数据包 ===')
r = s.run_cmd(f'findstr /C:"53001" {CSV}')
lines = r.std_out.decode('gbk', errors='ignore').strip().split('\n')
print(f'总行数含53001: {len(lines)}')

# 分类事件类型
events = {}
for line in lines:
    if len(line) < 50:
        continue
    parts = line.split(',')
    event_id = parts[2].strip() if len(parts) > 2 else '?'
    events[event_id] = events.get(event_id, 0) + 1
print('事件类型分布:')
for k, v in sorted(events.items(), key=lambda x: -x[1]):
    print(f'  Event {k}: {v}')

# 检查是否有payload
for line in lines:
    parts = line.split(',')
    # 找 hex 数据 (最后几列)
    for part in reversed(parts):
        part = part.strip()
        if part.startswith('0x') and len(part) > 40:
            hexstr = part[2:]
            try:
                raw = bytes.fromhex(hexstr)
                # 解析为 Ethernet 帧
                if len(raw) >= 14:
                    ethtype = struct.unpack('!H', raw[12:14])[0]
                    if ethtype == 0x0800:  ***REMOVED***v4
                        ip_start = 14
                        ihl = (raw[ip_start] & 0x0F) * 4
                        proto = raw[ip_start + 9]
                        if proto == 6:  # TCP
                            src_ip = '.'.join(str(b) for b in raw[ip_start+12:ip_start+16])
                            dst_ip = '.'.join(str(b) for b in raw[ip_start+16:ip_start+20])
                            tcp_start = ip_start + ihl
                            sp = struct.unpack('!H', raw[tcp_start:tcp_start+2])[0]
                            dp = struct.unpack('!H', raw[tcp_start+2:tcp_start+4])[0]
                            if sp == 53001 or dp == 53001:
                                data_offset = ((raw[tcp_start+12] >> 4) & 0x0F) * 4
                                payload = raw[tcp_start+data_offset:]
                                if len(payload) > 0:
                                    print(f'\n  [{src_ip}:{sp} -> {dst_ip}:{dp}] {len(payload)}B')
                                    print(f'  HEX: {payload.hex(" ")[:200]}')
                                    # Try ASCII
                                    try:
                                        ascii_text = payload.decode('ascii', errors='replace')
                                        if any(c.isprintable() for c in ascii_text[:50]):
                                            print(f'  ASCII: {repr(ascii_text[:100])}')
                                    except:
                                        pass
            except Exception as e:
                pass
            break

# 如果TCPIP provider只有metadata, 试试导出为XML看完整数据
print('\n=== 检查ETL文件大小和内容 ===')
r = s.run_cmd(f'dir {ETL}')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 尝试用netsh trace convert输出为xml
r = s.run_cmd(f'netsh trace convert input={ETL} dump=xml')
print(r.std_out.decode('gbk', errors='ignore').strip()[:500])

# 最终: 如果还是没payload, 尝试WPR (Windows Performance Recorder)
print('\n=== Try WPR ===')
r = s.run_cmd('wpr -start CPU -start Network -filemode')
print(r.std_out.decode('gbk', errors='ignore').strip())
if 'error' not in r.std_out.decode('gbk', errors='ignore').lower():
    print('WPR started, waiting 30s...')
    time.sleep(35)
    r = s.run_cmd(r'wpr -stop C:\Users\Administrator\cb_wpr.etl')
    print(r.std_out.decode('gbk', errors='ignore').strip())
