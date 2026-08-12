#!/usr/bin/env python3
"""
131 三层采集拓扑 — 本机全模拟
================================
用 Python socket 在本机复现 131 的完整采集架构:

  层1: DTU 透传 (:15301) — 模拟 LegacyComm + RTU
  层2: OPC DA (:13500)  — 模拟 Kepware OPC Server
  层3: RTDB  (:18889) — 模拟GENERIC_VENDOR IO Server
  层4: Modbus TCP (:502) — 已有点表轮询

每个 mock 服务记录完整交互报文。
采集器同时连四层，统一输出。
"""
import socket, struct, threading, time, random, math, json, sys
from datetime import datetime
from pathlib import Path

LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

packets = []  # 全局报文日志

def pkt(direction, data, note=""):
    """记录并打印报文"""
    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    hex_short = " ".join(data[i:i+2].hex() for i in range(0, min(len(data), 40), 2))
    if len(data) > 40:
        hex_short += f" (+{len(data)-40}B)"
    line = f"[{ts}] {direction:6s} | {hex_short}"
    if note:
        line += f"  | {note}"
    print(f"  {line}")
    packets.append({"ts": ts, "dir": direction, "hex": data.hex(), "len": len(data), "note": note})

# ═══════════════════════════════════════════════════════════
# 共享数据源 — 模拟井下保护测控装置
# ═══════════════════════════════════════════════════════════
DEVICE_DB = {
    "02012170058": {"name": "线路保护#58",  "Ia": 4.8,  "Ua": 10.2, "P": 48.0},
    "02105100097": {"name": "变压器差动#97", "Ia": 3.2,  "Ua": 35.0, "P": 112.0},
    "02106290043": {"name": "电动机保护#43", "Ia": 8.5,  "Ua": 6.3,  "P": 53.0},
    "02107010048": {"name": "备自投#48",     "Ia": 1.2,  "Ua": 10.5, "P": 12.0},
    "02110080020": {"name": "接地保护#20",   "Ia": 0.08, "Ua": 0.5,  "P": 0.04},
    "02204060100": {"name": "线路保护A1",    "Ia": 5.0,  "Ua": 220.0,"P": 1100.0},
    "02204060111": {"name": "变压器保护B3",  "Ia": 3.2,  "Ua": 380.0,"P": 1216.0},
    "02204060200": {"name": "电动机保护M2",  "Ia": 8.5,  "Ua": 6.3,  "P": 53.0},
}

def tick_value(dev_id, tag):
    """生成带漂移的遥测值"""
    dev = DEVICE_DB.get(dev_id, {"Ia": 1.0, "Ua": 220.0, "P": 220.0})
    base = dev.get(tag, 1.0)
    drift = math.sin(time.time() / 30 + hash(dev_id + tag) % 100) * 0.02
    noise = random.gauss(0, 0.005)
    return round(base * (1 + drift + noise), 4)

# ═══════════════════════════════════════════════════════════
# 层1: DTU 透传 — 模拟 LegacyComm :15301
# ═══════════════════════════════════════════════════════════
class MockDTUServer:
    """模拟 LegacyComm:
       RTU 主动连上来 → 注册握手 → 透传 Modbus RTU"""
    def __init__(self, port=15301):
        self.port = port
        self.sock = None

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        print(f"  [DTU] :{self.port} — LegacyComm 模拟")

        while True:
            try:
                conn, addr = self.sock.accept()
                t = threading.Thread(target=self._handle, args=(conn, addr), daemon=True)
                t.start()
            except:
                break

    def _handle(self, conn, addr):
        buf = b""
        dev_id = f"020121700{random.randint(50,60):02d}"
        try:
            # Phase 1: DTU 注册
            reg_msg = bytes([0xAA, 0x01]) + dev_id.encode() + bytes([0x0D])
            conn.send(reg_msg)
            pkt(f"DTU->", reg_msg, f"REGISTER {dev_id}")
            ack = conn.recv(64)
            if ack:
                pkt(f"<-DTU", ack, "REG_ACK")

            # Phase 2: 周期性发送 Modbus RTU 帧 (模拟 RTU 主动上报)
            while True:
                time.sleep(2 + random.random())
                func = random.choice([0x03, 0x04])
                start = random.randint(0, 39) * 2
                count = random.randint(1, 8)
                # Modbus RTU over TCP (no MBAP header — transparent)
                rtu_frame = bytes([random.randint(1, 247), func])
                rtu_frame += struct.pack(">HH", start, count)
                # CRC16 placeholder
                rtu_frame += bytes([0x00, 0x00])
                conn.send(rtu_frame)
                pkt(f"DTU->", rtu_frame, f"ModbusRTU Dev={dev_id} Fn={func}")

                # 收响应
                try:
                    resp = conn.recv(256)
                    if resp:
                        pkt(f"<-DTU", resp, "ModbusRTU_RESP")
                except socket.timeout:
                    pass
        except Exception as e:
            print(f"  [DTU] {addr} disconnected: {e}")
        finally:
            conn.close()

# ═══════════════════════════════════════════════════════════
# 层2: OPC DA — 模拟 Kepware OPC Server :13500
# ═══════════════════════════════════════════════════════════
class MockOPCDAServer:
    """模拟 OPC DA Server (简化版):
       接受 OPC Read 请求 → 返回遥测值列表"""
    def __init__(self, port=13500):
        self.port = port
        self.items = {}  # ItemID → (value, timestamp, quality)
        for dev_id, dev in DEVICE_DB.items():
            for tag in ["Ia", "Ua", "P"]:
                self.items[f"{dev_id}.{tag}"] = dev[tag]
        self._update_thread = None

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        print(f"  [OPC] :{self.port} — Kepware OPC DA 模拟 ({len(self.items)} items)")

        while True:
            try:
                conn, addr = self.sock.accept()
                t = threading.Thread(target=self._handle, args=(conn, addr), daemon=True)
                t.start()
            except:
                break

    def _handle(self, conn, addr):
        buf = b""
        try:
            while True:
                data = conn.recv(4096)
                if not data:
                    break
                buf += data

                # 解析 OPC-like 请求
                while len(buf) >= 4:
                    # 简单协议: [2B len] [2B cmd] [payload]
                    total_len = struct.unpack(">H", buf[0:2])[0]
                    if len(buf) < total_len:
                        break
                    frame = buf[:total_len]
                    buf = buf[total_len:]

                    cmd = struct.unpack(">H", frame[2:4])[0]
                    pkt(f"OPC->", frame, f"CMD=0x{cmd:04X}")

                    if cmd == 0x0001:  # Read
                        # 解析 item IDs
                        payload = frame[4:].decode('ascii', errors='ignore')
                        item_ids = payload.split(';')
                        values = []
                        for iid in item_ids:
                            if not iid:
                                continue
                            val = tick_value(iid.split('.')[0] if '.' in iid else "02204060100",
                                            iid.split('.')[1] if '.' in iid else "Ia")
                            values.append(f"{iid}={val}")
                        resp = ";".join(values).encode()
                        resp_frame = struct.pack(">HH", len(resp)+4, 0x8001) + resp
                        conn.send(resp_frame)
                        pkt(f"<-OPC", resp_frame, f"READ_RESP {len(values)} items")

                    elif cmd == 0x0002:  # Browse
                        item_list = ";".join(list(self.items.keys())[:20])
                        resp = item_list.encode()
                        resp_frame = struct.pack(">HH", len(resp)+4, 0x8002) + resp
                        conn.send(resp_frame)
                        pkt(f"<-OPC", resp_frame, "BROWSE_RESP")

        except Exception as e:
            print(f"  [OPC] {addr} error: {e}")
        finally:
            conn.close()

# ═══════════════════════════════════════════════════════════
# 层3: RTDB — 模拟GENERIC_VENDOR IO Server :18889
# ═══════════════════════════════════════════════════════════
class MockPSpaceServer:
    """模拟 RTDB IO Server:
       接受 psAPI 连接 → 响应标签订阅/读取"""
    def __init__(self, port=18889):
        self.port = port
        self.sessions = {}  # session_id → subscribed_tags

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        print(f"  [RTDB] :{self.port} — IO Server 模拟")

        # 启动主动推送线程
        t = threading.Thread(target=self._push_loop, daemon=True)
        t.start()

        while True:
            try:
                conn, addr = self.sock.accept()
                t = threading.Thread(target=self._handle, args=(conn, addr), daemon=True)
                t.start()
            except:
                break

    def _handle(self, conn, addr):
        buf = b""
        session_id = random.randint(0x1000, 0xFFFF)
        self.sessions[session_id] = []
        try:
            while True:
                data = conn.recv(4096)
                if not data:
                    break
                buf += data
                pkt(f"RTDB->", data)

                # 解析 psAPI-like 帧
                while len(buf) >= 8:
                    # 推测格式: [4B len] [4B cmd]
                    frame_len = struct.unpack("<I", buf[0:4])[0]
                    if len(buf) < frame_len:
                        break
                    frame = buf[:frame_len]
                    buf = buf[frame_len:]

                    cmd = struct.unpack("<I", frame[4:8])[0]
                    if cmd == 0x01:  # Connect/Login
                        resp = struct.pack("<II", 12, 0x8001) + struct.pack("<I", session_id)
                        conn.send(resp)
                        pkt(f"<-RTDB", resp, f"LOGIN_OK sid=0x{session_id:04X}")

                    elif cmd == 0x03:  # Subscribe
                        tag_count = struct.unpack("<I", frame[8:12])[0]
                        tags = frame[12:].decode('ascii', errors='ignore').strip('\x00')
                        self.sessions[session_id] = tags.split(';')
                        resp = struct.pack("<II", 12, 0x8003) + struct.pack("<I", tag_count)
                        conn.send(resp)
                        pkt(f"<-RTDB", resp, f"SUBSCRIBE_OK {tag_count} tags")

                    elif cmd == 0x05:  # Read
                        # 即时读取
                        values = []
                        for tag in ["02204060100.Ia", "02204060100.Ua"]:
                            dev_id, t = tag.split('.')
                            val = tick_value(dev_id, t)
                            values.append(struct.pack("<f", val))
                        data = b"".join(values)
                        resp = struct.pack("<II", 8 + len(data), 0x8005) + data
                        conn.send(resp)
                        pkt(f"<-RTDB", resp, f"READ {len(values)} floats")
        except Exception as e:
            print(f"  [RTDB] {addr} error: {e}")
        finally:
            self.sessions.pop(session_id, None)
            conn.close()

    def _push_loop(self):
        """主动推送实时数据"""
        while True:
            time.sleep(3)
            for sid, tags in list(self.sessions.items()):
                if not tags:
                    continue
                # 打包推送数据
                data = b""
                for tag in tags[:5]:
                    if '.' in tag:
                        dev_id, t = tag.split('.')
                        val = tick_value(dev_id, t)
                        data += struct.pack("<f", val)
                if data:
                    # 尝试找到对应连接推送（简化：广播到所有）
                    pass  # 实际需要追踪 conn

# ═══════════════════════════════════════════════════════════
# 层4: Modbus TCP — 已有 mock_opc_server.py :502
# ═══════════════════════════════════════════════════════════
class MockModbusServer:
    """Modbus TCP 模拟 — 精简版"""
    def __init__(self, port=502):
        self.port = port

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(10)
        self.sock.settimeout(1.0)
        print(f"  [Modbus] :{self.port} — Modbus TCP 模拟")

        while True:
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
            while True:
                data = conn.recv(4096)
                if not data:
                    break
                buf += data

                while len(buf) >= 8:
                    if len(buf) < 6:
                        break
                    mlen = struct.unpack(">H", buf[4:6])[0]
                    total = 6 + mlen
                    if len(buf) < total:
                        break
                    req = buf[:total]
                    buf = buf[total:]

                    txn = req[0:2]
                    unit = req[6]
                    func = req[7]
                    pkt(f"MB->", req, f"Unit={unit} Fn={func}")

                    if func == 0x03 and len(req) >= 12:
                        start = struct.unpack(">H", req[8:10])[0]
                        count = struct.unpack(">H", req[10:12])[0]
                        devs = list(DEVICE_DB.keys())
                        dev_id = devs[(unit - 1) % len(devs)]
                        vals = []
                        for i in range(count):
                            ch = (start // 2 + i) % 3
                            tag = ["Ia", "Ua", "P"][ch]
                            phys = tick_value(dev_id, tag)
                            raw = int(phys * 100)
                            vals.append(struct.pack(">H", raw & 0xFFFF))
                        bc = count * 2
                        resp = txn + b"\x00\x00" + struct.pack(">H", 3+bc)
                        resp += bytes([unit, func, bc]) + b"".join(vals)
                        conn.send(resp)
                        pkt(f"<-MB", resp, f"READ {count} regs")
        except:
            pass
        finally:
            conn.close()

# ═══════════════════════════════════════════════════════════
# 统一采集器 — 同时轮询四层
# ═══════════════════════════════════════════════════════════
def run_collector():
    """同时连接四层 mock 服务，轮询采集"""
    print("\n" + "=" * 60)
    print("Collector — 四层同时采集")
    print("=" * 60)

    # Modbus TCP
    try:
        mb = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        mb.settimeout(3)
        mb.connect(("127.0.0.1", 502))
        print("  [MB] Connected :502")
    except:
        mb = None
        print("  [MB] :502 NOT AVAILABLE")

    # OPC DA
    try:
        opc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        opc.settimeout(3)
        opc.connect(("127.0.0.1", 13500))
        print("  [OPC] Connected :13500")
    except:
        opc = None
        print("  [OPC] :13500 NOT AVAILABLE")

    # RTDB
    try:
        ps = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        ps.settimeout(3)
        ps.connect(("127.0.0.1", 18889))
        print("  [RTDB] Connected :18889")
    except:
        ps = None
        print("  [RTDB] :18889 NOT AVAILABLE")

    # DTU
    try:
        dtu = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        dtu.settimeout(3)
        dtu.connect(("127.0.0.1", 15301))
        print("  [DTU] Connected :15301")
    except:
        dtu = None
        print("  [DTU] :15301 NOT AVAILABLE")

    print()

    for cycle in range(3):
        print(f"--- Cycle {cycle+1} ---")

        # Modbus TCP
        if mb:
            try:
                req = struct.pack(">HHH", cycle+1, 0, 6) + bytes([1, 3, 0, 0, 0, 2])
                mb.send(req)
                resp = mb.recv(256)
                if len(resp) >= 11:
                    val = struct.unpack(">H", resp[9:11])[0]
                    print(f"  MB:    raw={val} -> Ia={val*170/8192:.2f}A")
            except: pass

        # OPC DA
        if opc:
            try:
                item = "02204060100.Ia"
                payload = item.encode()
                req = struct.pack(">HH", len(payload)+4, 0x0001) + payload
                opc.send(req)
                resp = opc.recv(512)
                pkt(f"OPC->", req, f"READ {item}")
                pkt(f"<-OPC", resp, "RESP")
            except: pass

        # RTDB
        if ps:
            try:
                # Subscribe
                sub = struct.pack("<III", 16, 0x03, 1) + b"02204060100.Ia\x00"
                ps.send(sub)
                pkt(f"RTDB->", sub, "SUBSCRIBE")
                resp = ps.recv(256)
                pkt(f"<-RTDB", resp, "SUB_RESP")
            except: pass

        # DTU
        if dtu:
            try:
                ack = dtu.recv(256)
                pkt(f"<-DTU", ack, "PUSH_DATA")
            except socket.timeout:
                pass

        time.sleep(2)

    # Cleanup
    for s in [mb, opc, ps, dtu]:
        if s:
            try: s.close()
            except: pass

    print(f"\nDone. {len(packets)} packets captured")
    with open(LOG_DIR / "131_topology_packets.jsonl", "w") as f:
        for p in packets:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    print(f"Log: {LOG_DIR / '131_topology_packets.jsonl'}")

# ═══════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("131 三层采集拓扑 — 本机全模拟")
    print("=" * 60)
    print()
    print("层1: DTU透传 :15301 (LegacyComm)")
    print("层2: OPC DA  :13500 (Kepware)")
    print("层3: RTDB  :18889 (IO Server)")
    print("层4: Modbus  :502   (直连)")
    print()

    # 启动所有 mock 服务
    servers = [
        ("DTU", MockDTUServer, 15301),
        ("OPC", MockOPCDAServer, 13500),
        ("RTDB", MockPSpaceServer, 18889),
        ("Modbus", MockModbusServer, 502),
    ]

    threads = []
    for name, cls, port in servers:
        srv = cls(port)
        t = threading.Thread(target=srv.start, daemon=True)
        t.start()
        threads.append(t)
        time.sleep(0.3)

    print("\n所有 mock 服务已启动\n")
    time.sleep(1)

    # 启动采集器
    run_collector()

    print("\n模拟完成。查看日志:")
    print(f"  logs/131_topology_packets.jsonl")

if __name__ == "__main__":
    main()
