"""
pcapng 全量帧结构自动化校验
- 读取 7.10.pcapng (612MB, 952,569 packets)
- 仅做帧结构校验，不做数值解析，不写数据库
- 输出统计报告
"""
import scapy.all as scapy
import struct, os, sys, json
from collections import Counter, defaultdict
from datetime import datetime

PCAP_PATH = r'D:\ai\io服务器分析\7.10.pcapng'
REPORT_PATH = r'D:\ai\dgiot_lite\docs\tex\output\pcap_validation.json'
TXT_REPORT = r'D:\ai\dgiot_lite\docs\tex\output\pcap_validation.txt'

# ---- Statistics collectors ----
stats = {
    'total_packets': 0,
    'total_53001': 0,
    'dir_cb_to_rtu': 0,   # CommBridge -> RTU (src:53001)
    'dir_rtu_to_cb': 0,   # RTU -> CommBridge (dst:53001)
    'by_direction': Counter(),
    'by_func_code': Counter(),
    'by_slave_id': Counter(),
    'by_seq': Counter(),
    'by_frame_type': Counter(),  # query / response / register / heartbeat / unknown
    'by_device_id_len': Counter(),
    'by_bytecount': Counter(),
    'by_data_len': Counter(),
    'flags_nonzero': 0,
    'seq_gaps': [],        # track seq continuity per {src_ip:port}
    'anomalies': [],
    'device_ids': set(),
    'rtu_ips': set(),
    'query_register_ranges': Counter(),
    'response_bytecounts': [],
    'heartbeat_count': 0,
    'register_count': 0,
    'compressed_queries': [],
}

# Track sequence per connection
seq_tracker = defaultdict(lambda: {'last_seq': -1, 'gaps': 0, 'count': 0, 'seqs': []})

print(f"[{datetime.now()}] Starting pcap validation...")
print(f"File: {PCAP_PATH}")
print(f"Size: {os.path.getsize(PCAP_PATH) / 1e6:.0f} MB")
print()

reader = scapy.PcapReader(PCAP_PATH)
pkt_count = 0

for pkt in reader:
    pkt_count += 1
    if pkt_count % 100000 == 0:
        print(f"  Progress: {pkt_count}/952569 packets ({pkt_count/952569*100:.0f}%)  53001={stats['total_53001']}")

    # Skip non-TCP
    if scapy.TCP not in pkt:
        continue

    tcp = pkt[scapy.TCP]
    sport = tcp.sport
    dport = tcp.dport

    # Filter for port 53001
    if sport != 53001 and dport != 53001:
        continue

    stats['total_53001'] += 1
    raw = bytes(tcp.payload)
    raw_len = len(raw)

    # Determine direction
    if sport == 53001:
        direction = 'CB->RTU'
        stats['dir_cb_to_rtu'] += 1
    else:
        direction = 'RTU->CB'
        stats['dir_rtu_to_cb'] += 1

    src_ip = pkt[scapy.IP].src if scapy.IP in pkt else '?'
    dst_ip = pkt[scapy.IP].dst if scapy.IP in pkt else '?'

    # Track unique RTU IPs
    if sport == 53001:
        stats['rtu_ips'].add(dst_ip)
    else:
        stats['rtu_ips'].add(src_ip)

    # Connection key for seq tracking
    conn_key = f"{src_ip}:{sport}->{dst_ip}:{dport}"

    # ---- Frame type analysis ----
    if raw_len == 0:
        # TCP ACK-only, no payload
        continue

    stats['total_53001'] += 1  # recount excluding ACKs

    # Classify frame type
    first_byte = raw[0]

    # Heartbeat: 0x00
    if raw_len == 1 and first_byte == 0x00:
        stats['by_frame_type']['heartbeat'] += 1
        stats['heartbeat_count'] += 1
        continue

    # Registration: 0xAA + Slave + ASCII_ID + 0x0D
    if first_byte == 0xAA and raw_len >= 4 and raw[-1] == 0x0D:
        stats['by_frame_type']['register'] += 1
        stats['register_count'] += 1
        slave = raw[1]
        stats['by_slave_id'][slave] += 1
        # Extract device ID
        dev_id_bytes = raw[2:-1]
        try:
            dev_id = dev_id_bytes.decode('ascii', errors='replace')
            stats['device_ids'].add(dev_id)
            stats['by_device_id_len'][len(dev_id)] += 1
        except:
            pass
        continue

    # Standard query/response: Seq(1) + Flags(4) + Len(1) + Slave(1) + Func(1) + Data(N)
    # Minimum length: 8 bytes
    if raw_len >= 8:
        seq = raw[0]
        flags = struct.unpack_from('>I', raw, 1)[0] if raw_len >= 5 else 0
        payload_len = raw[5]
        slave = raw[6]
        func = raw[7]

        # Validate Len field
        expected_len = payload_len
        actual_len = raw_len - 6  # after Seq+Flags

        stats['by_seq'][seq] += 1
        stats['by_slave_id'][slave] += 1
        stats['by_func_code'][func] += 1
        stats['by_data_len'][actual_len] += 1

        if flags != 0:
            stats['flags_nonzero'] += 1

        # Track sequence gaps
        st = seq_tracker[conn_key]
        if st['last_seq'] >= 0:
            expected = (st['last_seq'] + 1) & 0xFF
            if seq != expected:
                gap = (seq - expected) & 0xFF
                st['gaps'] += 1
                if gap > 1 and len(st['seqs']) < 100:
                    stats['seq_gaps'].append({'conn': conn_key, 'from': st['last_seq'], 'to': seq, 'gap': gap})
        st['last_seq'] = seq
        st['count'] += 1
        if len(st['seqs']) < 50:
            st['seqs'].append(seq)

        # Direction-based classification
        if direction == 'CB->RTU':
            # Query from server
            if func == 0x03 and raw_len >= 12:
                addr = struct.unpack_from('>H', raw, 8)[0]
                qty = struct.unpack_from('>H', raw, 10)[0]
                stats['query_register_ranges'][f'{addr}:{qty}'] += 1
                stats['by_frame_type']['query_03'] += 1
            elif func in (0x06, 0x10):
                stats['by_frame_type'][f'query_{func:02x}'] += 1
            else:
                stats['by_frame_type'][f'query_{func:02x}'] += 1

                # Check if Len field matches actual data
            if expected_len != actual_len:
                stats['anomalies'].append({
                    'pkt': pkt_count,
                    'conn': conn_key,
                    'type': 'len_mismatch',
                    'expected': expected_len,
                    'actual': actual_len
                })

        else:
            # Response from RTU
            if func == 0x03 and raw_len >= 9:
                bc = raw[8]  # ByteCount
                stats['by_bytecount'][bc] += 1
                stats['response_bytecounts'].append(bc)
                stats['by_frame_type']['response_03'] += 1
            else:
                stats['by_frame_type'][f'response_{func:02x}'] += 1

    else:
        # Very short payload - anomaly
        stats['by_frame_type']['short_frame'] += 1
        stats['anomalies'].append({
            'pkt': pkt_count,
            'conn': conn_key,
            'type': 'short_frame',
            'len': raw_len,
            'hex': raw.hex()
        })

reader.close()

# ---- Generate report ----
print(f"\n[{datetime.now()}] Scan complete. Generating report...")
print(f"Total packets scanned: {pkt_count}")
print(f"Total 53001 packets: {stats['total_53001']}")

# Report text
lines = []
lines.append("=" * 70)
lines.append("pcapng 全量帧结构自动化校验报告")
lines.append(f"文件: {PCAP_PATH}")
lines.append(f"扫描时间: {datetime.now()}")
lines.append(f"总报文数: {pkt_count}")
lines.append("=" * 70)

lines.append(f"\n=== 53001 端口流量统计 ===")
lines.append(f"总53001报文: {stats['total_53001']}")
lines.append(f"  CommBridge -> RTU (src:53001): {stats['dir_cb_to_rtu']}")
lines.append(f"  RTU -> CommBridge (dst:53001): {stats['dir_rtu_to_cb']}")
lines.append(f"  唯一RTU IP数: {len(stats['rtu_ips'])}")

lines.append(f"\n=== 帧类型分布 ===")
for ftype, count in stats['by_frame_type'].most_common(20):
    pct = count / max(stats['total_53001'], 1) * 100
    lines.append(f"  {ftype:20s}: {count:6d} ({pct:5.1f}%)")

lines.append(f"\n=== 功能码分布 ===")
for fc, count in sorted(stats['by_func_code'].items()):
    pct = count / max(stats['total_53001'], 1) * 100
    lines.append(f"  0x{fc:02X}: {count:6d} ({pct:5.1f}%)")

lines.append(f"\n=== 从站地址分布 ===")
for sid, count in stats['by_slave_id'].most_common(20):
    lines.append(f"  Slave {sid:3d} (0x{sid:02X}): {count}")

lines.append(f"\n=== 序列号分布 ===")
seq_vals = list(stats['by_seq'].keys())
if seq_vals:
    lines.append(f"  使用到的序列号值: {min(seq_vals)}-{max(seq_vals)} (共{len(seq_vals)}个不同值)")
    lines.append(f"  序列号分布: {dict(sorted(stats['by_seq'].items()))}")

lines.append(f"\n=== 连接级序列号连续性 ===")
total_conns = len(seq_tracker)
conns_with_gaps = sum(1 for st in seq_tracker.values() if st['gaps'] > 0)
total_gaps = sum(st['gaps'] for st in seq_tracker.values())
lines.append(f"  总连接数: {total_conns}")
lines.append(f"  有序列号间隙的连接: {conns_with_gaps}")
lines.append(f"  总间隙数: {total_gaps}")

if stats['flags_nonzero'] > 0:
    lines.append(f"\n  *** Flags非零异常: {stats['flags_nonzero']} 个 ***")

lines.append(f"\n=== 设备ID统计 ===")
lines.append(f"  发现的设备ID: {len(stats['device_ids'])}")
for did in sorted(list(stats['device_ids'])[:30]):
    lines.append(f"    {did}")
if len(stats['device_ids']) > 30:
    lines.append(f"    ... 还有 {len(stats['device_ids']) - 30} 个")

lines.append(f"\n=== 设备ID长度分布 ===")
for length, count in stats['by_device_id_len'].most_common():
    lines.append(f"  长度 {length}: {count}")

lines.append(f"\n=== 寄存器查询范围分布 ===")
for range_str, count in stats['query_register_ranges'].most_common(20):
    lines.append(f"  {range_str}: {count}")

lines.append(f"\n=== ByteCount(响应数据长度)分布 ===")
for bc, count in stats['by_bytecount'].most_common(20):
    is_float32 = bc % 4 == 0
    lines.append(f"  BC={bc:3d}: {count:5d} ({'float32' if is_float32 else 'int16' if bc%2==0 else '未知'})")

lines.append(f"\n=== 异常统计 ===")
lines.append(f"  异常总数: {len(stats['anomalies'])}")
for i, anom in enumerate(stats['anomalies'][:20]):
    lines.append(f"  #{i+1}: {json.dumps(anom)}")
if len(stats['anomalies']) > 20:
    lines.append(f"  ... 还有 {len(stats['anomalies']) - 20} 个")

# Summary
lines.append(f"\n{'=' * 70}")
lines.append("校验结论")
lines.append(f"{'=' * 70}")

# Check for common patterns
all_funcs = set(stats['by_func_code'].keys())
expected_funcs = {0x03, 0x06, 0x10}  # Read, Write Single, Write Multiple
missing_funcs = expected_funcs - all_funcs

lines.append(f"\n帧头格式 (Seq+Flags+Len+Slave+Func) 校验: ",)
if len(stats['anomalies']) < 10:
    lines.append(f"  [通过] 异常帧仅 {len(stats['anomalies'])} 个 (<10)")
else:
    lines.append(f"  [注意] 异常帧 {len(stats['anomalies'])} 个")

lines.append(f"\n功能码使用: {', '.join(f'0x{fc:02X}' for fc in sorted(all_funcs))}")
if missing_funcs:
    lines.append(f"  预期但未发现的功能码: {', '.join(f'0x{fc:02X}' for fc in missing_funcs)}")
else:
    lines.append(f"  所有预期功能码均已出现")

seq_span = max(seq_vals) - min(seq_vals) + 1 if seq_vals else 0
lines.append(f"\n序列号范围: 0x{min(seq_vals):02X}-0x{max(seq_vals):02X} (跨度{seq_span})" if seq_vals else "序列号范围: 无数据")

# Flag check
fnz = stats['flags_nonzero']
lines.append(f"\nFlags字段: {'所有帧均为0' if fnz == 0 else str(fnz) + '个非零'}")

# Registration
lines.append(f"\n注册包格式 (0xAA+Slave+ASCII_ID+0x0D) 校验:")
if stats['register_count'] > 0:
    id_lens = [len(d) for d in stats['device_ids']]
    lines.append(f"  [通过] 共 {stats['register_count']} 个注册包，{len(stats['device_ids'])} 种设备ID")
    lines.append(f"  设备ID长度范围: {min(id_lens)}-{max(id_lens)} 字符")
else:
    lines.append(f"  [未发现] 无注册包")

# Heartbeat
lines.append(f"\n心跳帧 (0x00) 统计: {stats['heartbeat_count']} 个")

# Data type distribution
lines.append(f"\n数据类型分布:")
float32_count = sum(c for bc, c in stats['by_bytecount'].items() if bc % 4 == 0)
int16_count = sum(c for bc, c in stats['by_bytecount'].items() if bc % 4 != 0 and bc % 2 == 0)
unknown_count = sum(c for bc, c in stats['by_bytecount'].items() if bc % 2 != 0)
lines.append(f"  float32 (BC%4==0): {float32_count} ({float32_count/max(sum(stats['by_bytecount'].values()),1)*100:.0f}%)")
lines.append(f"  int16   (BC%2==0): {int16_count} ({int16_count/max(sum(stats['by_bytecount'].values()),1)*100:.0f}%)")
if unknown_count:
    lines.append(f"  未知类型: {unknown_count}")

# Write report
report_txt = '\n'.join(lines)
with open(TXT_REPORT, 'w', encoding='utf-8') as f:
    f.write(report_txt)

# JSON report
json_stats = dict(stats)
json_stats['device_ids'] = list(json_stats['device_ids'])
json_stats['rtu_ips'] = list(json_stats['rtu_ips'])
json_stats['by_frame_type'] = dict(json_stats['by_frame_type'])
json_stats['by_func_code'] = dict(json_stats['by_func_code'])
json_stats['by_slave_id'] = dict(json_stats['by_slave_id'])
json_stats['by_seq'] = dict(json_stats['by_seq'])
json_stats['by_bytecount'] = dict(json_stats['by_bytecount'])
json_stats['by_data_len'] = dict(json_stats['by_data_len'])
json_stats['query_register_ranges'] = dict(json_stats['query_register_ranges'])
json_stats['seq_gaps'] = json_stats['seq_gaps'][:100]

with open(REPORT_PATH, 'w', encoding='utf-8') as f:
    json.dump(json_stats, f, ensure_ascii=False, indent=2, default=str)

print()
print(report_txt)
print(f"\n报告已保存:")
print(f"  TXT: {TXT_REPORT}")
print(f"  JSON: {REPORT_PATH}")
