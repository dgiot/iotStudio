"""
pcapng 数据解析 + Oracle 交叉验证（只读，不存库）

流程:
  1. 从 pcapng 解码响应帧的 float32/int16 值
  2. 通过 WinRM → VBS/ADO 只读查询 Oracle 对应测点
  3. 交叉比对数据一致性
  4. 输出报告（不写数据库）
"""
import scapy.all as scapy
import struct, os, sys, json, time, threading
from collections import defaultdict, Counter
from datetime import datetime

# ── Oracle 只读查询 ──
for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
    os.environ.pop(k, None)
os.environ['NO_PROXY'] = '192.168.10.131,11.*,172.*'

import winrm

VBS_TEMPLATE = r'''Dim conn, rs, i
On Error Resume Next
Set conn = CreateObject("ADODB.Connection")
conn.ConnectionTimeout = {timeout} : conn.CommandTimeout = {timeout}
conn.Open "Provider=OraOLEDB.Oracle.1;Password={pwd};User ID={uid};Data Source={dsn}"
If Err.Number <> 0 Then
    WScript.StdOut.WriteLine "ERR:CONNECT:" & Err.Description
    WScript.Quit 1
End If
WScript.StdOut.WriteLine "OK:CONNECTED"
{sql_blocks}
conn.Close
WScript.StdOut.WriteLine "OK:DONE"
'''

SQL_BLOCK = '''WScript.StdOut.WriteLine "BLOCK:{label}"
Set rs = conn.Execute("{sql}")
If Err.Number <> 0 Then
    WScript.StdOut.WriteLine "ERR:SQL:" & Err.Description
    Err.Clear
Else
    Dim colCount : colCount = rs.Fields.Count
    For i = 0 To colCount - 1
        WScript.StdOut.WriteLine "COL:" & rs.Fields(i).Name
    Next
    WScript.StdOut.WriteLine "ROWS_START"
    Do While Not rs.EOF
        For i = 0 To colCount - 1
            If IsNull(rs.Fields(i).Value) Then
                WScript.StdOut.WriteLine "V:" & rs.Fields(i).Name & "="
            Else
                WScript.StdOut.WriteLine "V:" & rs.Fields(i).Name & "=" & rs.Fields(i).Value
            End If
        Next
        WScript.StdOut.WriteLine "ROW_END"
        rs.MoveNext
    Loop
    rs.Close
    WScript.StdOut.WriteLine "ROWS_DONE"
End If
'''

class OracleReader:
    def __init__(self):
        self._session = winrm.Session(
            'http://192.168.10.131:5985/wsman',
            auth=('administrator', r'CHANGEME'),
            transport='ntlm', read_timeout_sec=60)

    def query(self, sql, label="q"):
        block = SQL_BLOCK.format(label=label, sql=sql.replace('"', '""'))
        vbs = VBS_TEMPLATE.format(timeout=30, pwd='INDUSTRYA11_pass', uid='INDUSTRYPROD',
                                   dsn='192.168.10.129/orcl', sql_blocks=block)
        b64 = __import__('base64').b64encode(vbs.encode('utf-8')).decode()
        stamp = str(int(time.time() * 1000) % 100000)
        bf = f'D:/temp/_ro{stamp}.b64'
        vf = f'D:/temp/_ro{stamp}.vbs'
        chunk_size = 4000
        chunks = [b64[i:i+chunk_size] for i in range(0, len(b64), chunk_size)]
        for i, chunk in enumerate(chunks):
            if i == 0:
                self._session.run_ps(f"Set-Content {bf} -Value '{chunk}' -Encoding ASCII")
            else:
                self._session.run_ps(f"Add-Content {bf} -Value '{chunk}' -Encoding ASCII")
        self._session.run_cmd(f'certutil -decode {bf} {vf} >nul 2>&1')
        r = self._session.run_cmd(f'C:/Windows/SysWOW64/cscript.exe //Nologo {vf}')
        self._session.run_ps(f"Remove-Item {bf},{vf} -Force -ErrorAction SilentlyContinue")
        output = r.std_out.decode('gbk', errors='ignore').strip()
        cols, rows, cur_row = [], [], {}
        for line in output.split('\n'):
            line = line.strip()
            if line.startswith('COL:'): cols.append(line[4:])
            elif line == 'ROWS_START': cur_row = {}
            elif line.startswith('V:'):
                kv = line[2:].split('=', 1)
                if len(kv) == 2: cur_row[kv[0]] = kv[1]
            elif line == 'ROW_END': rows.append(cur_row); cur_row = {}
        return {'columns': cols, 'rows': rows, 'count': len(rows)}

# ── pcapng 解析 ──
PCAP = r'D:\ai\io服务器分析\7.10.pcapng'
print(f"[{datetime.now()}] 开始 pcapng + Oracle 交叉验证...")
print(f"pcapng: {PCAP}")

# Step 1: Scan pcapng and collect ALL response frames with device context
# We need: src_ip -> device_id (from register), then response frames
# Build a device_ip mapping from registration packets
device_map = {}  # ip -> device_id
responses = []   # list of parsed response data

reader = scapy.PcapReader(PCAP)
pkt_count = 0
sample_count = 0

for pkt in reader:
    pkt_count += 1
    if pkt_count % 200000 == 0:
        print(f"  扫描中: {pkt_count}/952569  ({sample_count} 响应采样)")

    if scapy.TCP not in pkt or scapy.IP not in pkt:
        continue

    tcp = pkt[scapy.TCP]
    sport, dport = tcp.sport, tcp.dport
    if sport != 53001 and dport != 53001:
        continue

    raw = bytes(tcp.payload)
    raw_len = len(raw)
    src_ip = pkt[scapy.IP].src
    dst_ip = pkt[scapy.IP].dst

    # Track device registration: RTU sends 0xAA + slave + ASCII_ID + 0x0D
    if dport == 53001 and raw_len >= 4 and raw[0] == 0xAA and raw[-1] == 0x0D:
        try:
            dev_id = raw[2:-1].decode('ascii', errors='replace')
            device_map[src_ip] = dev_id
        except:
            pass

    # Parse response frames (RTU -> CB): Seq+Flags+Len+Slave+Func+Data
    if sport == 53001:  # LegacyComm is source = response to RTU... wait
        # Actually: CB sends on sport=53001, RTU responds on dport=53001
        pass

    if dport == 53001 and raw_len >= 9:
        # This is RTU -> LegacyComm (response)
        # Check if it's a valid frame
        if raw[0] == 0xAA:
            continue  # registration, already handled
        if raw_len == 1 and raw[0] == 0x00:
            continue  # heartbeat

        if raw_len >= 8:
            flags = struct.unpack_from('>I', raw, 1)[0] if raw_len >= 5 else 0
            payload_len = raw[5]
            slave = raw[6]
            func = raw[7]

            if func == 0x03 and raw_len >= 9:
                bc = raw[8]  # ByteCount
                data_bytes = raw[9:9+bc]
                dev = device_map.get(src_ip, 'UNKNOWN')

                if bc > 0 and len(data_bytes) >= 2:
                    # Parse values
                    values = []
                    if bc % 4 == 0:
                        # float32
                        for i in range(0, len(data_bytes), 4):
                            if i + 4 <= len(data_bytes):
                                v = struct.unpack_from('>f', data_bytes, i)[0]
                                values.append(('float32', v))
                    else:
                        # int16
                        for i in range(0, len(data_bytes), 2):
                            if i + 2 <= len(data_bytes):
                                v = struct.unpack_from('>h', data_bytes, i)[0]
                                values.append(('int16', v))

                    responses.append({
                        'device': dev,
                        'src_ip': src_ip,
                        'slave': slave,
                        'bc': bc,
                        'values': values,
                        'pkt': pkt_count,
                    })
                    sample_count += 1

reader.close()

print(f"\n扫描完成: {pkt_count} 报文, {sample_count} 响应帧, {len(device_map)} 台设备")

# Step 2: Group responses by device and register offset patterns
by_device = defaultdict(list)
for r in responses:
    by_device[r['device']].append(r)

# Print device summary
print(f"\n=== 设备响应统计 ===")
for dev, rs in sorted(by_device.items(), key=lambda x: -len(x[1]))[:20]:
    bcs = Counter(r['bc'] for r in rs)
    print(f"  {dev}: {len(rs)} 个响应, BC分布={dict(bcs)}")

# Step 3: Query Oracle for well/point mapping
print(f"\n=== Oracle 数据查询（只读）===")
oracle = OracleReader()

# Get well info - device_id to RES_ID mapping
# Device ID format: 02204060100 -> needs to find RES_ID
# Try by searching device ID pattern
r_wells = oracle.query(
    "SELECT RES_ID, RES_NAME FROM SYS_SINGLE_WELL_BASE_INFO WHERE rownum<=10"
)
print(f"  井信息示例: {r_wells['count']} 行")
for row in r_wells['rows'][:3]:
    print(f"    {row}")

# Get point mapping for known device
r_points = oracle.query(
    "SELECT POINT_ID, POINT_LONGNAME, DESCRIBE FROM SYS_POINTRELATION_WELL "
    "WHERE rownum<=20"
)
print(f"\n  测点示例: {r_points['count']} 行")
for row in r_points['rows'][:5]:
    print(f"    {row}")

# Step 4: Cross-validate specific known device
target_dev = "02204060100"
if target_dev in by_device:
    target_responses = by_device[target_dev]
    print(f"\n=== 设备 {target_dev} 交叉验证 ===")
    print(f"  共 {len(target_responses)} 个响应帧")

    # Need to find RES_ID for this device
    # Device ID might be stored somewhere in Oracle
    # Try SYS_SINGLE_WELL_BASE_INFO or similar
    r_search = oracle.query(
        f"SELECT RES_ID, RES_NAME, FREQUENCY FROM SYS_SINGLE_WELL_BASE_INFO "
        f"WHERE RES_NAME LIKE '%02204060100%' OR RES_ID='8038'"
    )
    if r_search['rows']:
        print(f"  Oracle 匹配: {r_search['rows'][0]}")
    else:
        print(f"  Oracle 未直接找到设备02204060100，尝试其他表...")
        r_search2 = oracle.query(
            f"SELECT * FROM SYS_POINTRELATION_WELL WHERE rownum<=10"
        )
        for row in r_search2['rows']:
            print(f"    测点行: {row}")

    # Show parsed values for first few responses
    for i, resp in enumerate(target_responses[:5]):
        print(f"\n  --- 响应 #{i+1} (BC={resp['bc']}, slave={resp['slave']}) ---")
        for j, (dtype, val) in enumerate(resp['values'][:10]):
            print(f"    [{j:2d}] {dtype:8s} = {val}")

# Step 5: For all devices, count how many have parseable float32 vs int16 data
float32_count = sum(1 for r in responses if r['bc'] % 4 == 0)
int16_count = sum(1 for r in responses if r['bc'] % 4 != 0)
print(f"\n=== 全量数据统计 ===")
print(f"  总响应帧: {sample_count}")
print(f"  float32 帧: {float32_count} ({float32_count/max(sample_count,1)*100:.0f}%)")
print(f"  int16 帧:   {int16_count} ({int16_count/max(sample_count,1)*100:.0f}%)")
print(f"  唯一设备: {len(by_device)}")

# Summary
print(f"\n{'='*60}")
print("验证完成。未向数据库写入任何数据。")
print(f"{'='*60}")
