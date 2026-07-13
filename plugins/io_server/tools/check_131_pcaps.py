#!/usr/bin/env python3
"""检查 131 上的抓包文件和活跃的网络流量"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
import winrm

s = winrm.Session('http://11.66.12.131:5985/wsman',
    auth=('administrator', r'GKYWB-5991792$1c8k'),
    transport='ntlm', read_timeout_sec=15, operation_timeout_sec=10)

# 1. Existing captures
print("=== [1] Existing capture files ===")
r = s.run_cmd(r'dir /s /b C:\Users\Administrator\*.etl C:\Users\Administrator\*.pcap C:\Users\Administrator\*.pcapng C:\Users\Administrator\*.cab 2>nul')
out = r.std_out.decode('gbk', errors='ignore').strip()
print(out if out else "(none)")

# 2. Active connections on key ports
print("\n=== [2] Active connections (OPC/Modbus/pSpace) ===")
for port in [502, 53001, 53002, 8889, 7001, 6582, 6000, 6001]:
    r = s.run_cmd(f'netstat -ano | findstr ":{port}" | findstr "ESTABLISHED LISTENING"')
    out = r.std_out.decode('gbk', errors='ignore').strip()
    if out:
        for line in out.splitlines()[:5]:
            print(f"  :{port} -> {line.strip()}")

# 3. IoProject process details
print("\n=== [3] IoProject IOMan instances ===")
r = s.run_cmd('wmic process where "name like \'%IOMan%\' or name like \'%IoProject%\' or name like \'%IoMonitor%\'" get ProcessId,Name,CommandLine /format:csv 2>nul')
out = r.std_out.decode('gbk', errors='ignore').strip()
for line in out.splitlines()[:10]:
    if line.strip():
        print(f"  {line.strip()}")

# 4. Quick live sniffer — 3 seconds on port 502
print("\n=== [4] Quick live sniff (:502, 3s) ===")
# Use netsh trace with minimal duration
r = s.run_cmd(r'typeperf "\Network Interface(*)\Bytes Total/sec" -sc 2 2>nul & echo --- & netstat -ano | findstr ":502"')
print(r.std_out.decode('gbk', errors='ignore').strip())

print("\nDone")
