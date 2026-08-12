"""分析 RTDB 协议抓包"""
import os, time
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'
import winrm

s = winrm.Session('http://192.168.10.131:5985/wsman',
    auth=('administrator', r'CHANGEME'),
    transport='ntlm', read_timeout_sec=30, operation_timeout_sec=25)

# Convert ETL to text
print("=== Converting ETL to text ===")
r = s.run_cmd(r'netsh trace convert C:\Users\Administrator\rtdb_cap2.etl dump=txt 2>&1')
print(r.std_out.decode('gbk', errors='ignore').strip()[:300])

# Read the text dump — look for data frames
print("\n=== Extracting RTDB frames ===")
r = s.run_cmd(r'type C:\Users\Administrator\rtdb_cap2.txt 2>nul')
lines = r.std_out.decode('gbk', errors='ignore').splitlines()

total = len(lines)
frame_lines = []
for i, line in enumerate(lines):
    if any(kw in line for kw in ['Payload', 'Length', 'Frame', '8889', 'TCP', 'Send', 'Recv', 'Data']):
        frame_lines.append((i, line.strip()[:200]))

print(f"Total lines: {total}")
print(f"Relevant lines: {len(frame_lines)}")

# Show first 40 relevant lines
for i, (lineno, text) in enumerate(frame_lines[:40]):
    print(f"  [{lineno}] {text}")
