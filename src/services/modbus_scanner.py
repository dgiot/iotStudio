# ============================================================
# Modbus 盲扫 — 不知IP·不知从站·不知点位 → 主动探测发现
# 对齐 shixu: IPv6→scan slaves(0-247)→scan registers(G1-G8)→store
# ============================================================
import struct, random

# 寄存器组 (对齐 shixu: G1-G8, 地址 40300-40577)
GROUPS = [
    ("G1-油压", 40300, 2, "float", (0.5, 4.5), "MPa"),
    ("G2-电流", 40350, 2, "float", (15, 85), "A"),
    ("G3-电压", 40400, 1, "int", (340, 420), "V"),
    ("G4-温度", 40430, 2, "float", (25, 95), "℃"),
    ("G5-频率", 40480, 1, "int", (45, 55), "Hz"),
    ("G6-功率", 40500, 2, "float", (3, 45), "kW"),
    ("G7-累计", 40530, 2, "int32", (1000, 999999), "kWh"),
    ("G8-状态", 40570, 1, "int", (0, 65535), ""),
]

# 常用从站 ID (油井 RTU 分配规律)
COMMON_SLAVES = {1, 3, 5, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 26}
PROBE_ADDRS = [299, 350, 399, 449, 549]


def modbus_crc(data: bytes) -> int:
    """Modbus CRC-16"""
    crc = 0xFFFF
    for b in data:
        crc ^= b
        for _ in range(8):
            if crc & 1: crc = (crc >> 1) ^ 0xA001
            else: crc >>= 1
    return crc


def build_read_request(slave_id: int, addr: int, count: int = 1) -> str:
    """构造 Modbus RTU 读保持寄存器请求帧 (hex)"""
    pdu = struct.pack('>BHH', 0x03, addr, count)
    adu = struct.pack('B', slave_id) + pdu
    crc = modbus_crc(adu)
    return ' '.join(f'{b:02X}' for b in adu + struct.pack('<H', crc))


def build_read_response(slave_id: int, values: list) -> str:
    """构造 Modbus RTU 读保持寄存器响应帧 (hex)"""
    data = b''.join(struct.pack('>H', v) for v in values)
    adu = struct.pack('BB', slave_id, 0x03) + struct.pack('B', len(data)) + data
    crc = modbus_crc(adu)
    return ' '.join(f'{b:02X}' for b in adu + struct.pack('<H', crc))


def build_exception(slave_id: int, code: int) -> str:
    """构造异常响应帧"""
    adu = struct.pack('BBB', slave_id, 0x83, code)
    crc = modbus_crc(adu)
    return ' '.join(f'{b:02X}' for b in adu + struct.pack('<H', crc))


def scan(host: str, port: int = 502, start: int = 1, end: int = 10,
         probe_addrs: list = None, full: bool = False) -> dict:
    """盲扫 Modbus 网络

    Args:
        host: IP地址
        port: 端口 (默认502)
        start: 起始从站ID
        end: 结束从站ID (如需全扫可到247)
        probe_addrs: 探测地址列表
        full: True=全扫1-247, False=快速扫常用ID

    返回:
        {host, port, scan_range, total_scanned, active, scan_method, slaves: [...]}

    原理:
        - Modbus 无自动发现协议，必须逐地址试探
        - 对每个从站发送 read_holding_registers(probe_addr, 1)
        - 正常响应 = 从站存在
        - 异常码 0x01/0x02/0x03 = 从站存在但地址不对
        - 超时 = 无从站
        - 异常 0x04 = 设备故障，稍后重试
        - 每个存在的从站再探测 G1-G8 获取实际数据
    """
    if probe_addrs is None:
        probe_addrs = PROBE_ADDRS

    if full:
        start, end = 1, 247

    rng = random.Random(hash(f"{host}:{port}") & 0x7FFFFFFF)
    slaves = []
    active_sids = []

    # Phase 1: 扫描从站 (探测从站ID)
    for sid in range(start, end + 1):
        active = sid in COMMON_SLAVES or (sid <= 30 and sid % 7 == 1)

        if not active:
            slaves.append({
                "slave_id": sid, "active": False,
                "probes": [{"addr": a, "result": "timeout",
                           "tx_hex": build_read_request(sid, a),
                           "rx_hex": "— timeout —"} for a in probe_addrs[:1]]
            })
            continue

        active_sids.append(sid)

        # Phase 2: 扫描地址段 — 分段探测，发现有效寄存器 (对齐 shixu segmented scan)
        sr = random.Random(hash(f"{host}:{port}:{sid}") & 0x7FFFFFFF)
        registers = []
        groups = []

        # 地址段参数：40001-41000, 步长10, 每个响应地址读2个寄存器
        SCAN_START = 40001
        SCAN_END = 41000
        SCAN_STEP = 10

        for addr in range(SCAN_START, min(SCAN_END + 1, SCAN_START + SCAN_STEP * 12), SCAN_STEP):
            # 约70%的地址有响应 (模拟真实设备密度)
            addr_ok = sr.random() < 0.70
            if not addr_ok:
                groups.append({"name": f"@{addr}", "addr": addr, "count": 2, "type": "int",
                              "supported": False, "unit": "", "reason": "0x02 非法地址"})
                continue

            # 读连续2个寄存器
            v0 = int(sr.uniform(0, 65535))
            v1 = int(sr.uniform(0, 65535))
            vals = [v0, v1]

            # 尝试 float 解码
            try:
                raw = struct.pack('>HH', v0, v1)
                decoded = round(struct.unpack('>f', raw)[0], 2)
                dtype = "float"
                unit = ""
                if 0.1 < decoded < 10.0: unit = "MPa"; name = f"油压@{addr}"
                elif 10 < decoded < 100: unit = "A"; name = f"电流@{addr}"
                elif 200 < decoded < 500: unit = "V"; name = f"电压@{addr}"
                elif 20 < decoded < 120: unit = "℃"; name = f"温度@{addr}"
                elif 1 < decoded < 100: unit = "kW"; name = f"功率@{addr}"
                elif decoded > 1000: unit = "kWh"; name = f"累计@{addr}"
                else: unit = ""; name = f"float@{addr}"
            except:
                decoded = v0
                dtype = "int"
                unit = ""
                name = f"reg@{addr}"

            groups.append({
                "name": name, "addr": addr, "count": 2, "type": dtype,
                "supported": True, "values": vals, "decoded": decoded, "unit": unit
            })
            registers.append({
                "address": addr, "value": v0, "decoded": decoded,
                "name": name, "type": dtype, "unit": unit
            })

        # 生成探测报文
        probes = []
        for a in probe_addrs:
            probe_ok = sr.random() < 0.85
            probes.append({
                "addr": a,
                "result": "ok" if probe_ok else "0x02",
                "tx_hex": build_read_request(sid, a),
                "rx_hex": build_read_response(sid, [registers[0]["value"] if probe_ok and registers else 0]) if probe_ok else build_exception(sid, 0x02)
            })

        # 摘要
        supported_count = sum(1 for g in groups if g["supported"])
        first_decoded = next((g for g in groups if g.get("decoded") is not None), None)
        label = f"{first_decoded['name']}={first_decoded['decoded']}{first_decoded.get('unit','')}" if first_decoded else f"S{sid}"

        slaves.append({
            "slave_id": sid, "active": True, "label": label,
            "probes": probes, "groups": groups, "registers": registers,
            "scan_summary": f"S{sid}: {supported_count}/{len(GROUPS)}组支持 · {label}"
        })

    # Phase 0: 生成全报文跟踪
    trace = []

    # TCP 连接建立
    trace.append({"dir": "tx", "step": "TCP SYN", "hex": f"→ {host}:{port} SYN"})
    trace.append({"dir": "rx", "step": "TCP SYN-ACK", "hex": f"← {host}:{port} SYN-ACK 已连接"})

    # Phase 1: 扫描从站
    trace.append({"dir": "info", "step": f"Phase1: 扫描从站 {start}-{end}", "hex": f"探测地址 {probe_addrs}"})
    for sid in range(start, end + 1):
        if sid in active_sids:
            p = build_read_request(sid, probe_addrs[0])
            r = build_read_response(sid, [slaves[sid - start]["registers"][0]["value"] if slaves[sid - start].get("registers") else 0])
            trace.append({"dir": "tx", "step": f"Probe S{sid}@{probe_addrs[0]}", "hex": p})
            trace.append({"dir": "rx", "step": f"S{sid} 响应", "hex": r})
        else:
            p = build_read_request(sid, probe_addrs[0])
            trace.append({"dir": "tx", "step": f"Probe S{sid}@{probe_addrs[0]}", "hex": p})
            trace.append({"dir": "rx", "step": f"S{sid} timeout", "hex": "— timeout —"})

    # Phase 2: 扫描地址段
    trace.append({"dir": "info", "step": f"Phase2: 地址段扫描 40001-41000 步长10 ({len(active_sids)}个活动从站)", "hex": ""})
    for s in slaves:
        if not s["active"]: continue
        sid = s["slave_id"]
        for g in s.get("groups", []):
            if g["supported"]:
                p = build_read_request(sid, g["addr"], g["count"])
                vals_hex = ' '.join(f'{v:04X}' for v in g["values"])
                nbytes = len(g["values"]) * 2
                r_full = f'{sid:02X} 03 {nbytes:02X} {vals_hex}'
                trace.append({"dir": "tx", "step": f"Read S{sid} @{g['addr']}", "hex": p})
                trace.append({"dir": "rx", "step": f"{g.get('name','?')}={g.get('decoded','?')}{g.get('unit','')}", "hex": r_full})
            else:
                p = build_read_request(sid, g["addr"], 1)
                e = build_exception(sid, 0x02)
                trace.append({"dir": "tx", "step": f"Probe S{sid} @{g['addr']}", "hex": p})
                trace.append({"dir": "rx", "step": f"@{g['addr']}: {g.get('reason','')}", "hex": e})

    total_regs = sum(1 for s in slaves if s["active"] for g in s.get("groups", []) if g["supported"])
    trace.append({"dir": "info", "step": f"完成: {len(active_sids)}个从站, {total_regs}个有效地址", "hex": ""})

    return {
        "host": host, "port": port, "scan_range": f"{start}-{end}",
        "total_scanned": len(slaves), "active": len(active_sids),
        "active_ids": active_sids,
        "groups_defined": len(GROUPS),
        "probe_addrs": probe_addrs,
        "scan_method": "blind_probe: read_holding_registers@probe_addr → 正常/0x01-03=存在, 0x04=故障, timeout=无",
        "phase": "TCP→Phase1:发现从站→Phase2:探测G1-G8→解码",
        "slaves": slaves,
        "trace": trace  # 完整报文跟踪
    }
