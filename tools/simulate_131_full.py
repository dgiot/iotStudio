#!/usr/bin/env python3
"""
131 及周边服务 — 本机全模拟
=============================
独立运行，零依赖 dgiot_lite 内部模块。

模拟清单:
  主站 131:
    IoProject    :9001  — 进程编排器 (启动/停止采集器)
    IoMonitor    :9002  — 监控窗口 (接收 WM_COPYDATA → 转 TCP)
    CommBridge   :53002 — DTU/RTU 桥接
    IOMan        ×2    — 设备采集 (1×OPC + 1×Modbus)
    IoCommit     ×2    — 数据库写入
    IOFileServer :7001  — 配置文件服务

  外围:
    IO Server    :18889 — pSpace 数据源 (11.66.12.130)
    OPC Server   :13500 — Kepware OPC DA
    DTU/RTU      ×5    — 现场保护测控装置

协议:
  Modbus TCP  :502
  DTU 透传    :53002 (0xAA + SlaveID + ASCII_ID + 0x0D)
  OPC DA      :13500 (简化的 Read/Browse)
  内部 IPC    :9001-9002 (JSON over TCP)
"""
import socket, struct, threading, time, random, math, json, sys
from datetime import datetime
from pathlib import Path

LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

ALL_PACKETS = []
PKT_LOCK = threading.Lock()

def pkt(layer, direction, data, note=""):
    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    h = " ".join(data[i:i+2].hex() for i in range(0, min(len(data), 56), 2))
    if len(data) > 56:
        h += f" (+{len(data)-56}B)"
    line = f"[{ts}] {layer:8s} {direction:4s} | {h}"
    if note:
        line += f"  | {note}"
    print(f"  {line}")
    with PKT_LOCK:
        ALL_PACKETS.append({"ts": ts, "layer": layer, "dir": direction,
                           "hex": data.hex(), "note": note})

# ═══════════════════════════════════════════════════
# 共享数据源
# ═══════════════════════════════════════════════════
class DataSource:
    def __init__(self):
        self._base = {
            "02012170058": (5.0, 0.5, 10.2, 48.0, 0.95, 50.0),
            "02105100097": (3.2, 0.3, 35.0, 112.0, 0.92, 50.1),
            "02106290043": (8.5, 0.8, 6.3, 53.0, 0.88, 49.9),
            "02204060100": (4.8, 0.4, 220.0, 1100.0, 0.94, 50.0),
            "02204060111": (3.1, 0.3, 380.0, 1216.0, 0.91, 49.8),
            "02204060200": (8.3, 0.7, 6.3, 51.0, 0.87, 50.0),
        }
        self._tags = ["Ia", "Iac", "Ua", "P", "cosA", "F"]

    def read(self, dev_id, tag_idx=None):
        if dev_id not in self._base:
            dev_id = list(self._base.keys())[hash(dev_id) % len(self._base)]
        base = self._base[dev_id]
        vals = []
        indices = [tag_idx] if tag_idx is not None else range(len(base))
        for i in indices:
            v = base[i]
            drift = math.sin(time.time()/30 + hash(dev_id + str(i))%100) * 0.02
            noise = random.gauss(0, 0.005)
            vals.append(round(v * (1 + drift + noise), 4))
        return vals[0] if tag_idx is not None else vals

    def raw_modbus(self, dev_id, start_reg, count):
        phys = self.read(dev_id)
        COEFF = [170/8192, 8.5/8192, 170/8192, 1, 1/8192, 2/8192]
        raws = []
        for i in range(count):
            p = phys[(start_reg + i) % len(phys)] if i < len(phys) else 1.0
            c = COEFF[(start_reg + i) % len(COEFF)]
            raws.append(max(0, min(65535, int(p / c))))
        return raws

DS = DataSource()

# ═══════════════════════════════════════════════════
# 1. DTU/RTU 设备 (:随机端口 → :53002)
# ═══════════════════════════════════════════════════
class MockRTUDevice:
    """模拟井下保护测控装置 (DTU透传Modbus)"""
    def __init__(self, dev_id, slave_id=1):
        self.dev_id = dev_id
        self.slave_id = slave_id
        self.running = True

    def run(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(30)
            sock.connect(("127.0.0.1", 53002))

            # DTU 注册
            reg = bytes([0xAA, self.slave_id]) + self.dev_id.encode() + bytes([0x0D])
            sock.send(reg)
            pkt("RTU", "SEND", reg, f"REGISTER {self.dev_id}")

            seq = 0
            while self.running:
                try:
                    data = sock.recv(256)
                    if not data:
                        break

                    # 心跳
                    if len(data) == 1 and data[0] == 0x00:
                        pkt("RTU", "RECV", data, "HEARTBEAT")
                        sock.send(b"\x00")
                        continue

                    pkt("RTU", "RECV", data, f"QUERY len={len(data)}")

                    # 解析 CommBridge 协议帧: Seq+Flags+Len+Slave+Func+Data
                    if len(data) >= 8:
                        seq = data[0]
                        dlen = data[5]
                        slave = data[6]
                        func = data[7]
                        payload = data[8:]

                        if func == 0x03 and len(payload) >= 4:
                            start = struct.unpack(">H", payload[0:2])[0]
                            qty = struct.unpack(">H", payload[2:4])[0]
                            raws = DS.raw_modbus(self.dev_id, start // 2, qty)
                            bc = qty * 2
                            resp_data = bytes([bc])
                            for r in raws:
                                resp_data += struct.pack(">H", r)

                            resp = struct.pack(">BIBB", seq, 0, 2+len(resp_data), self.slave_id)
                            resp += bytes([func]) + resp_data
                            sock.send(resp)
                            pkt("RTU", "SEND", resp, f"RESP Qty={qty} Raw={raws[:3]}...")

                except socket.timeout:
                    continue

        except Exception as e:
            print(f"  [RTU:{self.dev_id}] {e}")
        finally:
            sock.close()
            print(f"  [RTU:{self.dev_id}] Offline")

# ═══════════════════════════════════════════════════
# 2. CommBridge Server (:53002)
# ═══════════════════════════════════════════════════
class MockCommBridge:
    """DTU/RTU 桥接服务器"""
    def __init__(self, port=53002):
        self.port = port
        self.rtus = {}
        self.running = True

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("0.0.0.0", self.port))
        self.sock.listen(20)
        self.sock.settimeout(1.0)
        print(f"  [CommBridge] :{self.port} started")

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
        buf = b""
        dtu_id = f"rtu_{addr[0]}"
        slave_id = 1
        seq = 0

        try:
            # DTU 注册
            reg = conn.recv(64)
            if len(reg) >= 4 and reg[0] == 0xAA and reg[-1] == 0x0D:
                slave_id = reg[1]
                dtu_id = reg[2:-1].decode('ascii', errors='ignore').strip()
                pkt("CommBr", "RECV", reg, f"REG {dtu_id} slave={slave_id}")
                self.rtus[dtu_id] = addr

            conn.settimeout(5)

            # 轮询
            while self.running:
                time.sleep(2)
                seq = (seq + 1) & 0xFF
                query_data = struct.pack(">HH", 0, 10)  # start=0, count=10 regs
                plen = 1 + 1 + len(query_data)
                query = struct.pack(">BIBBB", seq, 0, plen, slave_id, 0x03) + query_data
                conn.send(query)
                pkt("CommBr", "SEND", query, f"POLL {dtu_id} seq={seq}")

                try:
                    resp = conn.recv(512)
                    if not resp:
                        break
                    pkt("CommBr", "RECV", resp, f"DATA {dtu_id} len={len(resp)}")

                    # 解析并推送
                    if len(resp) >= 9:
                        self._push_to_pipeline(dtu_id, slave_id, resp)
                except socket.timeout:
                    pkt("CommBr", "---", b"", f"TIMEOUT {dtu_id}")
        except Exception as e:
            print(f"  [CommBridge] {dtu_id}: {e}")
        finally:
            conn.close()
            self.rtus.pop(dtu_id, None)

    def _push_to_pipeline(self, dtu_id, slave_id, frame):
        """推送数据到 IoMonitor"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect(("127.0.0.1", 9002))
            msg = json.dumps({"type": "telemetry", "dtu_id": dtu_id,
                              "slave": slave_id, "frame": frame.hex(),
                              "ts": time.time()}).encode()
            s.send(msg)
            s.close()
            pkt("CommBr", "PUSH", msg, f"->IoMonitor {dtu_id}")
        except:
            pass

# ═══════════════════════════════════════════════════
# 3. IoProject (:9001) — 进程编排器
# ═══════════════════════════════════════════════════
class MockIoProject:
    """模拟 IoProject: 管理采集器生命周期"""
    def __init__(self, port=9001):
        self.port = port
        self.collectors = {}  # name → status
        self.running = True

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        self.sock.settimeout(1.0)
        print(f"  [IoProject] :{self.port} started")

        while self.running:
            try:
                conn, addr = self.sock.accept()
                data = conn.recv(4096)
                if data:
                    try:
                        cmd = json.loads(data.decode())
                        resp = self._handle_cmd(cmd)
                        conn.send(json.dumps(resp).encode())
                        pkt("IoProj", "RECV", data, f"CMD {cmd.get('action')}")
                        pkt("IoProj", "SEND", json.dumps(resp).encode(), "RESP")
                    except:
                        pass
                conn.close()
            except socket.timeout:
                continue
            except:
                break

    def _handle_cmd(self, cmd):
        action = cmd.get("action", "")
        if action == "list_collectors":
            return {"collectors": list(self.collectors.keys())}
        elif action == "start_collector":
            name = cmd.get("name", "unknown")
            self.collectors[name] = "running"
            return {"status": "started", "name": name}
        elif action == "status":
            return {"status": "running", "collectors": self.collectors}
        return {"error": f"unknown action: {action}"}

# ═══════════════════════════════════════════════════
# 4. IoMonitor (:9002) — 监控/数据汇聚
# ═══════════════════════════════════════════════════
class MockIoMonitor:
    """模拟 IoMonitor: 接收 WM_COPYDATA → TCP 汇聚"""
    def __init__(self, port=9002):
        self.port = port
        self.data_count = 0
        self.running = True

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(20)
        self.sock.settimeout(1.0)
        print(f"  [IoMonitor] :{self.port} started")

        while self.running:
            try:
                conn, addr = self.sock.accept()
                data = conn.recv(4096)
                if data:
                    self.data_count += 1
                    pkt("IoMon", "RECV", data, f"#{self.data_count} from {addr}")
                    # 转发到 IoCommit
                    try:
                        cs = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        cs.settimeout(1)
                        cs.connect(("127.0.0.1", 9003))
                        cs.send(data)
                        cs.close()
                    except:
                        pass
                    conn.send(b"OK")
                conn.close()
            except socket.timeout:
                continue
            except:
                break

# ═══════════════════════════════════════════════════
# 5. IoCommit (:9003) — 数据库写入
# ═══════════════════════════════════════════════════
class MockIoCommit:
    """模拟 IoCommit: 接收数据并写入 (内存/SQLite)"""
    def __init__(self, port=9003, db_name="IOCommitDB0"):
        self.port = port
        self.db_name = db_name
        self.records = []
        self.running = True

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        self.sock.settimeout(1.0)
        print(f"  [IoCommit:{self.db_name}] :{self.port} started")

        while self.running:
            try:
                conn, addr = self.sock.accept()
                data = conn.recv(8192)
                if data:
                    self.records.append({"ts": time.time(), "data": data.hex(), "len": len(data)})
                    pkt("IoCommit", "RECV", data, f"WRITE #{len(self.records)} ({len(data)}B)")
                    conn.send(b"COMMITTED")
                conn.close()
            except socket.timeout:
                continue
            except:
                break

# ═══════════════════════════════════════════════════
# 6. IO Server / pSpace (:18889)
# ═══════════════════════════════════════════════════
class MockIOServer:
    """模拟 IO Server (11.66.12.130:8889)"""
    def __init__(self, port=18889):
        self.port = port
        self.running = True

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        self.sock.settimeout(1.0)
        print(f"  [IO-Srv] :{self.port} started (pSpace)")

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
        buf = b""
        try:
            while self.running:
                data = conn.recv(4096)
                if not data:
                    break
                pkt("IO-Srv", "RECV", data, f"from {addr}")

                # pSpace protocol: [4B len LE] [4B cmd LE] [payload]
                if len(data) >= 8:
                    flen = struct.unpack("<I", data[0:4])[0]
                    cmd = struct.unpack("<I", data[4:8])[0]

                    if cmd == 0x01:  # Connect
                        sid = random.randint(0x1000, 0xFFFF)
                        resp = struct.pack("<III", 12, 0x8001, sid)
                        conn.send(resp)
                        pkt("IO-Srv", "SEND", resp, f"CONNECT_OK sid=0x{sid:04X}")

                    elif cmd == 0x03:  # Subscribe
                        resp = struct.pack("<II", 8, 0x8003)
                        conn.send(resp)
                        pkt("IO-Srv", "SEND", resp, "SUBSCRIBE_OK")

                    elif cmd == 0x05:  # Read
                        vals = DS.read("02204060100")
                        fdata = b""
                        for v in vals:
                            fdata += struct.pack("<f", v)
                        resp = struct.pack("<II", 8 + len(fdata), 0x8005) + fdata
                        conn.send(resp)
                        pkt("IO-Srv", "SEND", resp, f"READ {len(vals)} floats")

        except Exception as e:
            print(f"  [IO-Srv] {addr}: {e}")
        finally:
            conn.close()

# ═══════════════════════════════════════════════════
# 7. OPC DA Server (:13500)
# ═══════════════════════════════════════════════════
class MockOPCServer:
    """模拟 OPC DA Server (Kepware)"""
    def __init__(self, port=13500):
        self.port = port
        self.running = True

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        self.sock.settimeout(1.0)
        print(f"  [OPC-DA] :{self.port} started")

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
        buf = b""
        try:
            while self.running:
                data = conn.recv(4096)
                if not data:
                    break
                pkt("OPC-DA", "RECV", data, f"from {addr}")

                if len(data) >= 4:
                    flen = struct.unpack(">H", data[0:2])[0]
                    cmd = struct.unpack(">H", data[2:4])[0]

                    if cmd == 0x0001:  # Read
                        items = data[4:].decode('ascii', errors='ignore').split(';')
                        resp_parts = []
                        for item in items:
                            if not item or '.' not in item:
                                continue
                            dev_id, tag = item.split('.', 1)
                            val = DS.read(dev_id, 0 if 'Ia' in tag else 2 if 'Ua' in tag else 3)
                            resp_parts.append(f"{item}={val}")
                        resp_body = ";".join(resp_parts).encode()
                        resp = struct.pack(">HH", len(resp_body)+4, 0x8001) + resp_body
                        conn.send(resp)
                        pkt("OPC-DA", "SEND", resp, f"READ_RESP {len(resp_parts)} items")

                    elif cmd == 0x0002:  # Browse
                        items = [f"{d}.{t}" for d in list(DS._base.keys())[:3]
                                for t in ["Ia", "Ua"]]
                        resp_body = ";".join(items).encode()
                        resp = struct.pack(">HH", len(resp_body)+4, 0x8002) + resp_body
                        conn.send(resp)
                        pkt("OPC-DA", "SEND", resp, "BROWSE_RESP")

        except Exception as e:
            print(f"  [OPC-DA] {addr}: {e}")
        finally:
            conn.close()

# ═══════════════════════════════════════════════════
# 8. 统一采集器 — 对接所有层
# ═══════════════════════════════════════════════════
def run_unified_collector(cycles=3):
    """同时从四层采集数据"""
    print("\n" + "=" * 60)
    print("Unified Collector — 四层同时采集")
    print("=" * 60)

    for cycle in range(cycles):
        print(f"\n--- Cycle {cycle+1} ---")

        # Modbus TCP
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect(("127.0.0.1", 502))
            req = struct.pack(">HHH", cycle+1, 0, 6) + bytes([1, 3, 0, 0, 0, 4])
            s.send(req)
            pkt("COLL-MB", "SEND", req, "ReadHR Unit=1")
            resp = s.recv(256)
            pkt("COLL-MB", "RECV", resp, f"RESP")
            s.close()
        except Exception as e:
            print(f"  [MB] :502 not available: {e}")

        # OPC DA
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect(("127.0.0.1", 13500))
            items = "02204060100.Ia;02204060100.Ua"
            req = struct.pack(">HH", len(items)+4, 0x0001) + items.encode()
            s.send(req)
            pkt("COLL-OPC", "SEND", req, "Read OPC")
            resp = s.recv(512)
            pkt("COLL-OPC", "RECV", resp, "RESP")
            s.close()
        except Exception as e:
            print(f"  [OPC] :13500 not available: {e}")

        # pSpace
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect(("127.0.0.1", 18889))
            sub = struct.pack("<III", 16, 0x03, 1) + b"02204060100.Ia\x00"
            s.send(sub)
            pkt("COLL-PS", "SEND", sub, "Subscribe")
            resp = s.recv(256)
            pkt("COLL-PS", "RECV", resp, "RESP")
            s.close()
        except Exception as e:
            print(f"  [pSpace] :18889 not available: {e}")

        # 查 IoProject 状态
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2)
            s.connect(("127.0.0.1", 9001))
            s.send(json.dumps({"action": "list_collectors"}).encode())
            resp = s.recv(256)
            pkt("COLL-IP", "RECV", resp, "IoProject status")
            s.close()
        except:
            pass

        time.sleep(2)

# ═══════════════════════════════════════════════════
# Main — 启动一切
# ═══════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("  131 及周边服务 — 本机全模拟")
    print("=" * 60)
    print()
    print("  主站 131:                外围:")
    print("    IoProject   :9001       IO Server :18889")
    print("    IoMonitor   :9002       OPC DA    :13500")
    print("    IoCommit    :9003       DTU/RTU   :53002→")
    print("    CommBridge  :53002      Modbus    :502")
    print("    Modbus      :502 (另)")
    print()

    # 启动所有服务
    services = [
        ("IoProject",  MockIoProject,  []),
        ("IoMonitor",  MockIoMonitor,  []),
        ("IoCommit",   MockIoCommit,   []),
        ("CommBridge", MockCommBridge, []),
        ("IO-Srv",     MockIOServer,   []),
        ("OPC-DA",     MockOPCServer,  []),
    ]

    threads = []
    for name, cls, args in services:
        srv = cls(*args)
        t = threading.Thread(target=srv.start, daemon=True)
        t.start()
        threads.append(t)
        time.sleep(0.2)

    # 启动 RTU 设备 (连 CommBridge)
    rtu_devices = ["02012170058", "02105100097", "02106290043",
                   "02204060100", "02204060111"]
    rtu_threads = []
    for i, dev_id in enumerate(rtu_devices):
        rtu = MockRTUDevice(dev_id, slave_id=i+1)
        t = threading.Thread(target=rtu.run, daemon=True)
        t.start()
        rtu_threads.append(t)

    time.sleep(2)
    print(f"\n  所有 {len(services)} 服务 + {len(rtu_devices)} RTU 已启动\n")

    # 等 Modbus 服务 (单独启动或用已有的)
    print("  提示: 如需 Modbus :502, 请先运行 mock_opc_server.py")
    print()

    # 运行采集器
    time.sleep(1)
    run_unified_collector(cycles=3)

    # 汇总
    print(f"\n{'='*60}")
    print(f"  总计: {len(ALL_PACKETS)} 个报文")
    print(f"  日志: logs/131_full_simulation.jsonl")

    with open(LOG_DIR / "131_full_simulation.jsonl", "w") as f:
        for p in ALL_PACKETS:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    print(f"\n  架构总览:")
    print(f"""
    ┌──────────────────────────────────────────────────┐
    │              127.0.0.1 (本机模拟)                 │
    │                                                   │
    │  [RTU×5] ──DTU──→ [CommBridge:53002]              │
    │                       │                           │
    │                       ├──→ [IoMonitor:9002]        │
    │                       │       │                   │
    │                       │       └──→ [IoCommit:9003] │
    │                       │                           │
    │  [Collector] ──OPC──→ [OPC-DA:13500]              │
    │       │                                           │
    │       ├─────psAPI──→ [IO-Srv:18889]               │
    │       │                                           │
    │       └───Modbus──→ [:502]                        │
    │                                                   │
    │  [IoProject:9001] — 进程编排                      │
    └──────────────────────────────────────────────────┘
    """)

if __name__ == "__main__":
    main()
