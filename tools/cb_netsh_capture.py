#!/usr/bin/env python3
"""netsh trace 全量抓包, 然后导出 CSV 搜索 Modbus 报文"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session(
    'http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=120)

ETL = r'C:\Users\Administrator\cb_full2.etl'
CSV = r'C:\Users\Administrator\cb_full2.csv'

print('=== netsh trace 全量抓包 60秒 (不过滤端口) ===')
r = s.run_cmd(f'netsh trace start capture=yes tracefile={ETL} maxsize=300')
print(r.std_out.decode('gbk', errors='ignore').strip())

print('等待 60 秒...')
time.sleep(65)

r = s.run_cmd('netsh trace stop')
print(r.std_out.decode('gbk', errors='ignore').strip())

print('\n=== 导出 CSV ===')
r = s.run_cmd(f'netsh trace convert input={ETL} dump=csv')
print(r.std_out.decode('gbk', errors='ignore').strip())

# 检查文件大小
r = s.run_ps(f'(Get-Item "{ETL}").Length')
size = r.std_out.decode('gbk', errors='ignore').strip()
print(f'ETL 文件大小: {int(size)/1024/1024:.1f} MB' if size.isdigit() else f'Size: {size}')

# 搜索 CSV 中 53001 的流量
print('\n=== 搜索 53001 端口流量 ===')
r = s.run_cmd(f'findstr /C:"53001" {CSV}')
result = r.std_out.decode('gbk', errors='ignore').strip()
lines = result.split('\n') if result else []
print(f'  找到 {len(lines)} 行含 53001')

if lines:
    print(f'  前10行:')
    for line in lines[:10]:
        print(f'    {line[:200]}')

# 搜索 Modbus 特征 (01 03, 01 04 十六进制)
print('\n=== 搜索 Modbus 特征 ===')
for pattern in ['0103', '0104', '0101', '0106', '0010']:
    r = s.run_cmd(f'findstr /C:"{pattern}" {CSV}')
    result = r.std_out.decode('gbk', errors='ignore').strip()
    cnt = len(result.split('\n')) if result else 0
    if cnt > 0:
        print(f'  {pattern}: {cnt} 行')
        # 只显示前3行
        for line in result.split('\n')[:3]:
            print(f'    {line[:200]}')

# 如果没有53001流量，看看CSV包含哪些端口
if not lines:
    print('\n=== CSV 前20行 (看有哪些端口) ===')
    r = s.run_cmd(f'findstr /N "." {CSV}')
    result = r.std_out.decode('gbk', errors='ignore')
    for line in result.split('\n')[:20]:
        print(f'  {line[:250]}')

print('\n=== 尝试 ETW TCP Provider ===')
# 尝试另一套抓包方法
r = s.run_cmd(r'netsh trace start provider=Microsoft-Windows-TCPIP level=5 tracefile=C:\Users\Administrator\cb_tcp.etl')
print(r.std_out.decode('gbk', errors='ignore').strip()[:300])
