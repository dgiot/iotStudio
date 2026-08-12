#!/usr/bin/env python3
"""最后一次尝试抓 LegacyComm 报文 — 使用多种方法"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm, base64

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120)

# 方法1: netsh trace scenario=NetConnection
print('=== Method 1: NetConnection scenario ===')
r = s.run_cmd('netsh trace start scenario=NetConnection capture=yes tracefile=C:\\Users\\Administrator\\cb_netconn.etl maxsize=300')
print(r.std_out.decode('gbk', errors='ignore').strip())
print('Waiting 60s...')
time.sleep(65)
r = s.run_cmd('netsh trace stop')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 导出
r = s.run_cmd('netsh trace convert input=C:\\Users\\Administrator\\cb_netconn.etl dump=csv')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 检查53001
r = s.run_cmd('findstr /C:"53001" C:\\Users\\Administrator\\cb_netconn.csv')
lines = r.std_out.decode('gbk', errors='ignore').strip().split('\n')
print(f'53001 port lines: {len(lines) if lines[0] else 0}')
for line in lines[:5]:
    if len(line) > 10:
        print(f'  {line[:200]}')

# 方法2: netsh trace provider=Microsoft-Windows-TCPIP
print('\n=== Method 2: TCPIP provider ===')
r = s.run_cmd('netsh trace start provider=Microsoft-Windows-TCPIP level=0x5 tracefile=C:\\Users\\Administrator\\cb_tcpip.etl maxsize=100')
print(r.std_out.decode('gbk', errors='ignore').strip())
print('Waiting 30s...')
time.sleep(35)
r = s.run_cmd('netsh trace stop')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 检查转换
r = s.run_cmd('netsh trace convert input=C:\\Users\\Administrator\\cb_tcpip.etl dump=csv')
out = r.std_out.decode('gbk', errors='ignore').strip()
print(out[:500])

# 方法3: 列出所有providers，找网络相关的
print('\n=== Available network providers ===')
r = s.run_cmd('netsh trace show providers | findstr /C:"icrosoft" | findstr /V "Windows"')
out = r.std_out.decode('gbk', errors='ignore').strip()
# 只看含网络关键词的
for line in out.split('\n'):
    line_upper = line.upper()
    if any(kw in line_upper for kw in ['TCP', 'UDP', 'SOCK', 'WINSOCK', 'WFP', 'NDIS', 'NETIO']):
        print(f'  {line.strip()[:100]}')
