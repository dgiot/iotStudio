#!/usr/bin/env python3
"""下载并分析 131 上的关键抓包文件"""
import os, sys, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=40, operation_timeout_sec=30)

FILES = [
    r"C:\Users\Administrator\rtdb_proto.etl",
    r"C:\Users\Administrator\opc_cap.etl",
    r"C:\Users\Administrator\opc2.etl",
]

LOCAL = r"D:\ai\dgiot_lite\logs"

for f in FILES:
    fname = os.path.basename(f).replace('.etl', '')
    print(f"\n=== {fname} ===")

    # 1. File size
    r = s.run_cmd(f'dir "{f}" 2>nul')
    for line in r.std_out.decode('gbk', errors='ignore').splitlines():
        if any(x in line for x in ['/202', 'File(s)', 'bytes']):
            print(f"  {line.strip()}")

    # 2. Convert to text summary
    txt_path = f"C:\\Users\\Administrator\\{fname}.txt"
    print(f"  Converting to {txt_path}...")
    r = s.run_cmd(f'netsh trace convert "{f}" dump=txt 2>&1')
    conv_out = r.std_out.decode('gbk', errors='ignore')
    print(f"  Convert: {conv_out.strip()[:200]}")

    # 3. Read first 80 relevant lines
    print(f"  Reading summary...")
    r = s.run_cmd(f'type "{txt_path}" 2>nul')
    lines = r.std_out.decode('gbk', errors='ignore').splitlines()
    relevant = []
    for line in lines:
        lr = line.strip()
        if any(kw in lr for kw in ['Tcp', 'TCP', 'Modbus', 'Length', 'Src', 'Dst',
                                     'Payload', 'Frame', 'SeqNumber', 'Port',
                                     '502', '8889', '53001', 'ESTAB', 'SYN', 'ACK']):
            relevant.append(lr[:160])
            if len(relevant) >= 60:
                break

    print(f"  Total lines: {len(lines)}, Relevant: {len(relevant)}")
    for rl in relevant[:60]:
        print(f"    {rl}")

    # Save summary locally
    local_summary = os.path.join(LOCAL, f"{fname}_summary.txt")
    with open(local_summary, 'w', encoding='utf-8') as lf:
        for rl in relevant:
            lf.write(rl + '\n')
    print(f"  Saved: {local_summary}")

print("\nDone")
