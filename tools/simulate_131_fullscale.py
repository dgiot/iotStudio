#!/usr/bin/env python3
"""
131 全量设备 1:1 模拟
======================
从 131 wmic 提取的真实设备 ID × Device.ini 通道配置

IOMan#1 (Modbus, type=1): 10 devices
IOMan#2 (OPC, type=0):    10 devices
CommBridge RTU:            ~20 devices (from Event.txt)
其他配电站设备:            更多...

每台设备按 Device.ini 中对应类型配置通道数和转换系数
"""
import socket, struct, threading, time, random, math, json, sys
from datetime import datetime
from pathlib import Path

LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# ═══════════════════════════════════════════════
# Device.ini 完整设备类型定义 (12种)
# ═══════════════════════════════════════════════
DEVICE_TYPES = {
    0x00: {"name": "DSL-31A 线路断路器", "channels": 20,
           "coeff_map": [1,1,1,2,2,2,  2,2,2,3,  3,4,5,0,0,  0,1,2,2,2],
           "event_strs": ["速断动作","延时速断动作","过流动作","过流加速动作",
                          "零序过流动作","重合闸动作","重合闸动作","重合闸动作",
                          "速断加速动作","延时速断加速动作","过流加速动作"],
           "base_vals": [5.0,0.5,0.5,12.0,12.0,12.0, 12.0,12.0,12.0,35.0, 35.0,100.0,150.0,0,0, 0,5.0,12.0,12.0,12.0]},
    0x10: {"name": "DST-31A 变压器差动", "channels": 15,
           "coeff_map": [1,1,1,1,1,1,  1,1,1,1,  1,1,1,1,1],
           "base_vals": [3.2,3.2,3.2,3.2,3.2,3.2,  3.2,3.2,3.2,3.2,  3.2,3.2,3.2,3.2,3.2]},
    0x20: {"name": "DBPA-31A 备用电源自投", "channels": 13,
           "coeff_map": [0,0,0,2,2,1,  1,2,2,2,  2,2,2],
           "base_vals": [2.0,1.0,0.8,100.0,100.0,380.0, 380.0,100.0,100.0,100.0, 100.0,100.0,100.0]},
    0x30: {"name": "DSB-31A 变压器后备", "channels": 20,
           "coeff_map": [1,1,2,2,2,2,  2,2,3,3,  4,5,0,0,0,  1,0,0,2,2],
           "base_vals": [4.5,0.4,380.0,380.0,380.0,380.0, 380.0,380.0,50.0,50.0, 100.0,150.0,0,0,0, 4.5,0,0,380.0,380.0]},
    0x40: {"name": "电动机保护", "channels": 19,
           "coeff_map": [1,1,1,2,2,2,  2,2,2,3,  3,4,5,0,0,  0,1,2,2],
           "base_vals": [8.5,8.5,8.5,6.3,6.3,6.3, 6.3,6.3,6.3,100.0, 100.0,200.0,300.0,0,0, 0,8.5,6.3,6.3]},
    0x50: {"name": "DST-22D 变压器差动", "channels": 20,
           "coeff_map": [1,1,1,2,2,2,  2,2,2,3,  3,4,5,0,0,  0,1,2,2,2],
           "base_vals": [3.0,0.3,0.3,35.0,35.0,35.0, 35.0,35.0,35.0,40.0, 40.0,120.0,150.0,0,0, 0,3.0,35.0,35.0,35.0]},
    0x60: {"name": "DSB-22D 变压器后备", "channels": 20,
           "coeff_map": [1,1,1,2,2,2,  2,2,2,3,  3,4,5,0,0,  0,1,2,2,2],
           "base_vals": [4.0,0.35,0.35,35.0,35.0,35.0, 35.0,35.0,35.0,50.0, 50.0,100.0,150.0,0,0, 0,4.0,35.0,35.0,35.0]},
    0x70: {"name": "DSL-24D 断路器", "channels": 20,
           "coeff_map": [1,1,1,2,2,2,  2,2,2,3,  3,4,5,0,0,  0,1,2,2,2],
           "base_vals": [5.5,0.5,0.5,10.5,10.5,10.5, 10.5,10.5,10.5,35.0, 35.0,100.0,150.0,0,0, 0,5.5,10.5,10.5,10.5]},
    0x80: {"name": "DGP-11 变压器差动保护", "channels": 21,
           "coeff_map": [5,0,0,0,0,0,  0,0,0,0,  0,0,0,0,  1,1,1,1,1,1,1],
           "base_vals": [50.0,0,0,0,0,0, 0,0,0,0, 0,0,0,0, 3.0,3.0,3.0,3.0,3.0,3.0,3.0]},
    0x90: {"name": "DGP-12 变压器后备保护", "channels": 24,
           "coeff_map": [5,0,0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,2,2,2,2,2,3,4,4],
           "base_vals": [50.0,0,0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,380.0,380.0,380.0,380.0,380.0,50.0,100.0,100.0]},
    0xA0: {"name": "DGP-13 接地保护", "channels": 22,
           "coeff_map": [5,2,2,2,2,2,  2,2,4,4,  3,1,0,0,0,  0,3,3,3,  7,6,6],
           "base_vals": [50.0,0.5,0.5,0.3,0.3,0.3, 0.3,0.3,10.0,10.0, 0.08,0,0,0,0, 0,0.08,0.08,0.08, 5.0,10.0,10.0]},
    0xB0: {"name": "DMP-31A 电动机保护", "channels": 19,
           "coeff_map": [1,1,1,0,0,0,  0,0,0,3,  3,4,5,0,0,  0,1,0,0],
           "base_vals": [8.0,8.0,8.0,6.0,6.0,6.0, 6.0,6.0,6.0,100.0, 100.0,200.0,300.0,0,0, 0,8.0,0,0]},
}

COEFFICIENTS = [
    170/8192,        # 0: 电流/电压 Y*170/8192
    8.5/8192,        # 1: 接地电流 Y*8.5/8192
    170/8192,        # 2: 相电压 Y*170/8192
    170*8.5/8192,    # 3: 有功功率 Y*170*8.5/8192
    1/8192,          # 4: 功率因数 Y/8192
    2/8192,          # 5: 频率 F=50+Y*2/8192
    1, 1, 1, 1,      # 6-9: 直通
    0.1, 0.01,       # extra
]

# ═══════════════════════════════════════════════
# 从 131 IOMan 实例提取的真实设备列表
# ═══════════════════════════════════════════════
REAL_DEVICES = {
    # IOMan#1: Modbus 设备 (type=1)
    "02012170058": 0x00,  # DSL-31A 线路断路器
    "02105100097": 0x10,  # DST-31A 变压器差动
    "02105110008": 0x10,
    "02106290043": 0x30,  # DSB-31A 变压器后备
    "02106290052": 0x30,
    "02106290085": 0x30,
    "02107010048": 0x40,  # 电动机保护
    "02107030091": 0x40,
    "02107190091": 0x40,
    "02110080020": 0xA0,  # DGP-13 接地保护

    # IOMan#2: OPC 设备 (type=0)
    "02110080028": 0x00,
    "02110110045": 0x10,
    "02110120089": 0x20,
    "02110150030": 0x30,
    "02110150041": 0x30,
    "02110150046": 0x30,
    "02110160086": 0x40,
    "02111260034": 0x20,
    "02111270046": 0x20,
    "02111270058": 0x20,
}

# CommBridge RTU 设备 (从 Event.txt 和 pcap 提取)
COMMBRIDGE_RTUS = [
    ("02204060100", 0x00),
    ("02204060111", 0x10),
    ("02204060200", 0x40),
    ("02204060300", 0x30),
    ("02204060400", 0x20),
    ("02204060500", 0x50),
    ("02204060600", 0x60),
    ("02204060700", 0x70),
    ("02204060800", 0x80),
    ("02204060900", 0x90),
]

# 额外配电设备 (补满到 36 台模拟 IOMan×36 的规模)
EXTRA_DEVICES = [
    (f"0220406{i:03d}00", (0x00 + i) % 12) for i in range(10, 36)
]

ALL_DEVICES = {}
for d, (dev_id, dtype) in enumerate(
    list(REAL_DEVICES.items()) +
    COMMBRIDGE_RTUS +
    EXTRA_DEVICES
):
    if isinstance(dtype, tuple):
        dev_id, dtype = dtype
    ALL_DEVICES[dev_id] = DEVICE_TYPES.get(dtype, DEVICE_TYPES[0x00])
    ALL_DEVICES[dev_id]['_type_id'] = dtype

print(f"总计: {len(ALL_DEVICES)} devices loaded")

ALL_PACKETS = []
PKT_LOCK = threading.Lock()

def pkt(layer, direction, data, note=""):
    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    h = " ".join(data[i:i+2].hex() for i in range(0, min(len(data), 40), 2))
    if len(data) > 40:
        h += f" (+{len(data)-40}B)"
    line = f"[{ts}] {layer:8s} {direction:4s} | {h}"
    if note:
        line += f"  | {note}"
    # 节制输出 — 只打印关键帧
    if "REG" in note or "POLL" in note or "PUSH" in note or "RECV" in note:
        if random.random() < 0.1:  # 10% 采样
            print(f"  {line}")
    with PKT_LOCK:
        ALL_PACKETS.append({"ts": ts, "layer": layer, "dir": direction,
                           "hex": data.hex(), "note": note})

# ═══════════════════════════════════════════════
# 数据源 — 按真实设备类型生成遥测值
# ═══════════════════════════════════════════════
class DataEngine:
    def __init__(self, devices):
        self.devices = devices
        self._cache = {}

    def read_raw(self, dev_id, count=10):
        cfg = self.devices.get(dev_id, DEVICE_TYPES[0x00])
        base = cfg['base_vals']
        coeff_map = cfg['coeff_map']
        raws = []
        for i in range(min(count, len(base))):
            phys_base = base[i % len(base)]
            drift = math.sin(time.time() / 30 + hash(dev_id + str(i)) % 100) * 0.02
            noise = random.gauss(0, 0.003)
            phys = phys_base * (1 + drift + noise)
            ci = coeff_map[i % len(coeff_map)] if i < len(coeff_map) else 0
            coef = COEFFICIENTS[ci] if ci < len(COEFFICIENTS) else 1.0
            raw = max(0, min(65535, int(phys / coef if coef > 0 else phys)))
            raws.append(raw)
        return raws

    def read_physical(self, dev_id, count=10):
        cfg = self.devices.get(dev_id, DEVICE_TYPES[0x00])
        base = cfg['base_vals']
        vals = []
        for i in range(min(count, len(base))):
            phys_base = base[i % len(base)]
            drift = math.sin(time.time() / 30 + hash(dev_id + str(i)) % 100) * 0.02
            noise = random.gauss(0, 0.003)
            vals.append(round(phys_base * (1 + drift + noise), 4))
        return vals

ENGINE = DataEngine(ALL_DEVICES)

# ═══════════════════════════════════════════════
# 全量 DTU/RTU 模拟器
# ═══════════════════════════════════════════════
class FullScaleRTU:
    """大规模 RTU 模拟 — 每个连上 CommBridge，注册，响应查询"""
    def __init__(self, dev_id, dev_type_id, slave_id):
        self.dev_id = dev_id
        self.dev_type_id = dev_type_id
        self.slave_id = slave_id
        self.cfg = ALL_DEVICES.get(dev_id, DEVICE_TYPES[0x00])

    def run(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(30)
            sock.connect(("127.0.0.1", 53002))

            reg = bytes([0xAA, self.slave_id]) + self.dev_id.encode() + bytes([0x0D])
            sock.send(reg)
            pkt("RTU", "SEND", reg, f"REG {self.dev_id} [{self.cfg['name']}]")

            while True:
                data = sock.recv(256)
                if not data:
                    break
                if len(data) == 1 and data[0] == 0x00:
                    sock.send(b"\x00")
                    continue

                if len(data) >= 8:
                    seq = data[0]
                    func = data[7]
                    payload = data[8:]
                    if func == 0x03 and len(payload) >= 4:
                        start = struct.unpack(">H", payload[0:2])[0]
                        qty = struct.unpack(">H", payload[2:4])[0]
                        raws = ENGINE.read_raw(self.dev_id, qty)
                        bc = qty * 2
                        resp_data = bytes([bc])
                        for r in raws[:qty]:
                            resp_data += struct.pack(">H", r)
                        resp = struct.pack(">BIBBB", seq, 0, 2+len(resp_data),
                                          self.slave_id, func) + resp_data
                        sock.send(resp)
                        pkt("RTU", "SEND", resp, f"RESP {self.dev_id}")

        except Exception as e:
            pass
        finally:
            sock.close()

# ═══════════════════════════════════════════════
# 全量 CommBridge
# ═══════════════════════════════════════════════
class FullScaleCommBridge:
    def __init__(self, port=53002):
        self.port = port
        self.rtus = {}
        self.running = True
        self._stats = {"polls": 0, "errors": 0}

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("0.0.0.0", self.port))
        self.sock.listen(100)
        self.sock.settimeout(1.0)
        print(f"  [CommBridge] :{self.port} (max 100 connections)")

        while self.running:
            try:
                conn, addr = self.sock.accept()
                t = threading.Thread(target=self._handle, args=(conn, addr), daemon=True)
                t.start()
            except socket.timeout:
                continue
            except:
                break

    def _handle(self, conn, addr):
        dtu_id = f"rtu_{addr[1]}"
        slave_id = addr[1] % 247 + 1
        seq = 0
        try:
            reg = conn.recv(64)
            if len(reg) >= 4 and reg[0] == 0xAA and reg[-1] == 0x0D:
                slave_id = reg[1]
                dtu_id = reg[2:-1].decode('ascii', errors='ignore').strip()
                cfg = ALL_DEVICES.get(dtu_id, DEVICE_TYPES[0x00])
                pkt("CB", "RECV", reg, f"REG {dtu_id} slave={slave_id} [{cfg['name']}]")
                self.rtus[dtu_id] = True

            conn.settimeout(5)
            ch_count = ALL_DEVICES.get(dtu_id, DEVICE_TYPES[0x00])['channels']

            while self.running:
                time.sleep(2)
                seq = (seq + 1) & 0xFF
                qdata = struct.pack(">HH", 0, min(ch_count, 30))
                plen = 1 + 1 + len(qdata)
                query = struct.pack(">BIBBB", seq, 0, plen, slave_id, 0x03) + qdata
                conn.send(query)
                self._stats["polls"] += 1
                pkt("CB", "SEND", query, f"POLL {dtu_id}")

                try:
                    resp = conn.recv(512)
                    if not resp:
                        break
                    pkt("CB", "RECV", resp, f"DATA {dtu_id}")
                    self._push(dtu_id, slave_id, resp)
                except socket.timeout:
                    self._stats["errors"] += 1
        except:
            pass
        finally:
            conn.close()
            self.rtus.pop(dtu_id, None)

    def _push(self, dtu_id, slave_id, frame):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            s.connect(("127.0.0.1", 9002))
            s.send(json.dumps({"dtu_id": dtu_id, "slave": slave_id,
                               "frame": frame.hex()[:64], "ts": time.time()}).encode())
            s.close()
            pkt("CB", "PUSH", b"", f"->IoMonitor {dtu_id}")
        except:
            pass

# ═══════════════════════════════════════════════
# 完整模拟入口
# ═══════════════════════════════════════════════
def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--full", action="store_true", help="全量 36 设备")
    ap.add_argument("--sample", type=int, default=10, help="采样设备数")
    args = ap.parse_args()

    device_count = len(ALL_DEVICES) if args.full else min(args.sample, len(ALL_DEVICES))
    device_ids = list(ALL_DEVICES.keys())[:device_count]

    print("=" * 60)
    print(f"  131 全量设备 1:1 模拟 — {device_count} 设备")
    print("=" * 60)
    print()

    # 启动基础服务
    servers = {
        "IoMonitor (:9002)": None,
        "IoCommit (:9003)": None,
        "CommBridge (:53002)": None,
    }

    # IoMonitor
    io_mon = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    io_mon.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    io_mon.bind(("127.0.0.1", 9002))
    io_mon.listen(50)
    io_mon.settimeout(1.0)
    print("  [IoMonitor] :9002")

    def io_mon_loop():
        records = 0
        while True:
            try:
                conn, addr = io_mon.accept()
                data = conn.recv(4096)
                if data:
                    records += 1
                    # Forward to IoCommit
                    try:
                        cs = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        cs.settimeout(0.5)
                        cs.connect(("127.0.0.1", 9003))
                        cs.send(data)
                        cs.close()
                    except:
                        pass
                conn.close()
            except socket.timeout:
                continue
            except:
                break
    threading.Thread(target=io_mon_loop, daemon=True).start()

    # IoCommit
    io_com = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    io_com.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    io_com.bind(("127.0.0.1", 9003))
    io_com.listen(50)
    io_com.settimeout(1.0)
    records = [0]
    print("  [IoCommit] :9003")
    def io_com_loop():
        while True:
            try:
                conn, addr = io_com.accept()
                data = conn.recv(4096)
                if data:
                    records[0] += 1
                conn.close()
            except socket.timeout:
                continue
            except:
                break
    threading.Thread(target=io_com_loop, daemon=True).start()

    # CommBridge
    cb = FullScaleCommBridge(53002)
    threading.Thread(target=cb.start, daemon=True).start()

    # 启动 RTU 设备
    print(f"\n  启动 {device_count} 台 RTU 设备...")
    time.sleep(1)
    for i, dev_id in enumerate(device_ids):
        cfg = ALL_DEVICES[dev_id]
        dtype = cfg.get('_type_id', 0)
        rtu = FullScaleRTU(dev_id, dtype, slave_id=(i % 247) + 1)
        t = threading.Thread(target=rtu.run, daemon=True)
        t.start()
        if i % 10 == 9:
            time.sleep(0.3)
    time.sleep(2)

    print(f"\n  设备类型分布:")
    type_counts = {}
    for dev_id in device_ids:
        cfg = ALL_DEVICES[dev_id]
        name = cfg['name']
        type_counts[name] = type_counts.get(name, 0) + 1
    for name, count in sorted(type_counts.items()):
        bar = "█" * count
        print(f"    {name:<20s} {bar} ×{count}")

    # 观察运行
    print(f"\n  --- 运行观察 (15s) ---")
    for t in range(3):
        time.sleep(5)
        print(f"  [{t*5+5:2d}s] CB polls={cb._stats['polls']} errs={cb._stats['errors']} "
              f"RTUs={len(cb.rtus)} IoMon records={records[0]}")

    print(f"\n  --- 完成 ---")
    print(f"  RTU注册: {len(cb.rtus)}/{device_count}")
    print(f"  CB轮询: {cb._stats['polls']} 次")
    print(f"  IoMon记录: {records[0]} 条")
    print(f"  抓包总数: {len(ALL_PACKETS)}")

    with open(LOG_DIR / "131_fullscale_packets.jsonl", "w") as f:
        for p in ALL_PACKETS[:5000]:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    print(f"  日志: logs/131_fullscale_packets.jsonl")

    # 等待清理
    time.sleep(1)

if __name__ == "__main__":
    main()
