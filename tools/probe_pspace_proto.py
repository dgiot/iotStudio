#!/usr/bin/env python3
"""探测 pSpace IO Server 协议 + 本地 1:1 模拟"""
import socket, struct, time, threading, json, random, math
from datetime import datetime
from pathlib import Path

LOG = []

def pkt(tag, data, note=""):
    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    h = " ".join(data[i:i+2].hex() for i in range(0, min(len(data), 48), 2))
    if len(data) > 48: h += f" (+{len(data)-48}B)"
    print(f"  [{ts}] {tag:8s} | {h}" + (f"  | {note}" if note else ""))
    LOG.append({"ts": ts, "tag": tag, "hex": data.hex(), "note": note})

# ═══════════════════════════════════════
# Phase 1: 探测真实 130 pSpace 协议
# ═══════════════════════════════════════
def probe_real_server():
    print("=" * 55)
    print("Phase 1: 探测 11.66.12.130:8889 pSpace 协议")
    print("=" * 55)

    host, port = "11.66.12.130", 8889

    # 尝试不同的握手帧格式
    probes = [
        # 格式A: 简单 len+cmd [4B LE len][4B LE cmd]
        (struct.pack("<II", 8, 0x01), "Connect (simple)"),
        # 格式B: len+cmd+data [5B header]
        (struct.pack("<BII", 0x01, 0, 0), "Connect (byte cmd)"),
        # 格式C: 反转字节序
        (struct.pack(">II", 8, 0x01), "Connect (BE)"),
        # 格式D: 可能带版本号
        (struct.pack("<III", 12, 0x01, 0x06010009), "Connect (version 6.1.0.9)"),
        # 格式E: 看 IOMan 的 push 序列 0x0A,0x05,0x56 → port=8889? timeout=5000?
        (struct.pack("<IIIII", 20, 0x01, 8889, 5000, 0), "Connect (port+timeout)"),
        # 格式F: 空探测
        (b"", "Empty"),
    ]

    for data, desc in probes:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(3)
            s.connect((host, port))
            if data:
                s.send(data)
                pkt("PROBE", data, f"SEND {desc}")
            time.sleep(0.5)
            try:
                resp = s.recv(256)
                if resp:
                    pkt("RESP", resp, f"REPLY len={len(resp)} to '{desc}'")
                    # 尝试解析
                    if len(resp) >= 8:
                        le_len = struct.unpack("<I", resp[0:4])[0]
                        le_cmd = struct.unpack("<I", resp[4:8])[0]
                        be_len = struct.unpack(">I", resp[0:4])[0]
                        be_cmd = struct.unpack(">I", resp[4:8])[0]
                        print(f"         LE: len={le_len} cmd=0x{le_cmd:08X}   BE: len={be_len} cmd=0x{be_cmd:08X}")
                else:
                    print(f"         (no response)")
            except socket.timeout:
                print(f"         (timeout)")
            s.close()
        except Exception as e:
            print(f"  {desc}: {e}")

# ═══════════════════════════════════════
# Phase 2: 本地 1:1 IO Server 模拟
# ═══════════════════════════════════════
DEVICE_TAGS = {
    # 真实设备ID -> (标签名, 基准值, 单位, 量程)
    "02012170058": [("Ua", 10.2, "kV", (9, 11)), ("Ub", 10.1, "kV", (9, 11)),
                     ("Uc", 10.3, "kV", (9, 11)), ("Ia", 120, "A", (0, 600)),
                     ("Ib", 118, "A", (0, 600)), ("Ic", 122, "A", (0, 600)),
                     ("P", 2000, "kW", (0, 6000)), ("Q", 500, "kVar", (0, 2000)),
                     ("cos", 0.92, "", (0.5, 1)), ("F", 50.01, "Hz", (49, 51))],
    "02105100097": [("Ua", 35.0, "kV", (30, 40)), ("Ub", 35.1, "kV", (30, 40)),
                     ("Uc", 34.9, "kV", (30, 40)), ("Ia", 80, "A", (0, 400)),
                     ("Ib", 78, "A", (0, 400)), ("Ic", 82, "A", (0, 400)),
                     ("P", 4500, "kW", (0, 10000)), ("Q", 800, "kVar", (0, 3000)),
                     ("cos", 0.90, "", (0.5, 1)), ("F", 49.98, "Hz", (49, 51))],
    "02106290043": [("Ua", 6.3, "kV", (5, 8)), ("Ub", 6.35, "kV", (5, 8)),
                     ("Uc", 6.28, "kV", (5, 8)), ("Ia", 200, "A", (0, 1000)),
                     ("Ib", 195, "A", (0, 1000)), ("Ic", 205, "A", (0, 1000)),
                     ("P", 2100, "kW", (0, 5000)), ("Q", 400, "kVar", (0, 1500)),
                     ("cos", 0.88, "", (0.5, 1)), ("F", 50.02, "Hz", (49, 51))],
}

# 补充完整20台设备 (来自 IOMan 实例)
for extra_id in ["02105110008", "02106290052", "02106290085", "02107010048",
                 "02107030091", "02107190091", "02110080020", "02110080028",
                 "02110110045", "02110120089", "02110150030", "02110150041",
                 "02110150046", "02110160086", "02111260034", "02111270046",
                 "02111270058"]:
    base_dev = list(DEVICE_TAGS.keys())[hash(extra_id) % 3]
    DEVICE_TAGS[extra_id] = DEVICE_TAGS[base_dev]

print(f"\nTotal: {len(DEVICE_TAGS)} devices, {sum(len(v) for v in DEVICE_TAGS.values())} tags")

def tick_tag(dev_id, tag_idx):
    tags = DEVICE_TAGS.get(dev_id, list(DEVICE_TAGS.values())[0])
    name, base, unit, (lo, hi) = tags[tag_idx % len(tags)]
    drift = math.sin(time.time()/30 + hash(dev_id+name)%100) * 0.02
    noise = random.gauss(0, 0.003)
    val = round(base * (1 + drift + noise), 4)
    return name, val, unit, int(time.time() * 1000)

class IOServerSimulator:
    """1:1 模拟 11.66.12.130 IO Server (pSpace protocol)"""

    def __init__(self, port=8889):
        self.port = port
        self.sessions = {}
        self.running = True
        self._conn_count = 0

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("0.0.0.0", self.port))
        self.sock.listen(50)
        self.sock.settimeout(1.0)
        print(f"\n[IO-Srv] :{self.port} — 1:1 simulation ({len(DEVICE_TAGS)} devices)")

        while self.running:
            try:
                conn, addr = self.sock.accept()
                self._conn_count += 1
                print(f"\n[IO-Srv] Connection #{self._conn_count} from {addr}")
                t = threading.Thread(target=self._handle, args=(conn, addr), daemon=True)
                t.start()
            except socket.timeout:
                continue
            except:
                break

    def _handle(self, conn, addr):
        buf = b""
        sid = random.randint(0x1000, 0xFFFF)
        subscribed = []  # list of (dev_id, tag_idx)

        try:
            while self.running:
                data = conn.recv(4096)
                if not data:
                    break
                buf += data
                pkt("IO-SRV", data, f"RECV {len(data)}B")

                while len(buf) >= 8:
                    # pSpace 协议: [4B len LE] [4B cmd LE] [payload]
                    frame_len = struct.unpack("<I", buf[0:4])[0]
                    if len(buf) < frame_len:
                        break
                    frame = buf[:frame_len]
                    buf = buf[frame_len:]
                    cmd = struct.unpack("<I", frame[4:8])[0]

                    if cmd == 0x01:  # Connect / Login
                        resp = struct.pack("<III", 16, 0x8001, sid)
                        # + server version info
                        resp += struct.pack("<HHHH", 6, 0, 1, 9)  # v6.0.1.9
                        conn.send(resp)
                        pkt("IO-SRV", resp, f"CONNECT_OK sid={sid:04X} v6.0.1.9")

                    elif cmd == 0x02:  # Browse / List devices
                        payload = frame[8:].decode('ascii', errors='ignore').strip('\x00')
                        dev_list = ";".join(list(DEVICE_TAGS.keys()))
                        resp = struct.pack("<II", 8 + len(dev_list), 0x8002) + dev_list.encode()
                        conn.send(resp)
                        pkt("IO-SRV", resp, f"BROWSE {len(DEVICE_TAGS)} devices")

                    elif cmd == 0x03:  # Subscribe tags
                        # payload: [4B count] [tags as ASCII]
                        if len(frame) >= 12:
                            tag_count = struct.unpack("<I", frame[8:12])[0]
                            tags_str = frame[12:].decode('ascii', errors='ignore')
                            subscribed = []
                            for t in tags_str.split(';'):
                                if '.' in t:
                                    dev_id, tag_name = t.split('.', 1)
                                    dev_tags = DEVICE_TAGS.get(dev_id, list(DEVICE_TAGS.values())[0])
                                    for i, (n, _, _, _) in enumerate(dev_tags):
                                        if n == tag_name:
                                            subscribed.append((dev_id, i))
                                            break
                            resp = struct.pack("<III", 12, 0x8003, len(subscribed))
                            conn.send(resp)
                            pkt("IO-SRV", resp, f"SUB_OK {len(subscribed)}/{tag_count} tags")

                    elif cmd == 0x04:  # Start push (data streaming)
                        resp = struct.pack("<II", 8, 0x8004)
                        conn.send(resp)
                        pkt("IO-SRV", resp, "PUSH_START")
                        # 启动推送线程
                        if subscribed:
                            push_thread = threading.Thread(
                                target=self._push_loop, args=(conn, sid, subscribed), daemon=True)
                            push_thread.start()

                    elif cmd == 0x05:  # Read snapshot
                        # payload: [4B count] [tag IDs]
                        count = struct.unpack("<I", frame[8:12])[0] if len(frame) >= 12 else 0
                        values = []
                        for i in range(count):
                            dev_id = list(DEVICE_TAGS.keys())[i % len(DEVICE_TAGS)]
                            name, val, unit, ts = tick_tag(dev_id, i % 10)
                            values.append(struct.pack("<f", val))
                            values.append(struct.pack("<Q", ts))  # timestamp
                        data_block = b"".join(values)
                        resp = struct.pack("<II", 8 + len(data_block), 0x8005) + data_block
                        conn.send(resp)
                        pkt("IO-SRV", resp, f"READ {len(values)//2} floats")

                    elif cmd == 0x99:  # Disconnect
                        resp = struct.pack("<II", 8, 0x8099)
                        conn.send(resp)
                        pkt("IO-SRV", resp, "BYE")
                        break

                    else:
                        # Unknown → echo back with error
                        resp = struct.pack("<III", 12, 0x8FFF, cmd)
                        conn.send(resp)
                        pkt("IO-SRV", resp, f"UNKNOWN_CMD 0x{cmd:04X}")

        except Exception as e:
            print(f"  [IO-Srv] {addr} error: {e}")
        finally:
            self.sessions.pop(sid, None)
            conn.close()

    def _push_loop(self, conn, sid, subscribed, interval=2.0):
        """周期性推送实时数据"""
        seq = 0
        try:
            while self.running and subscribed:
                time.sleep(interval)
                seq += 1
                # 打包推送帧: [4B seq] [4B count] [(4B tag_id + 4B float val + 8B ts)]
                data_block = b""
                for dev_id, tag_idx in subscribed:
                    name, val, unit, ts = tick_tag(dev_id, tag_idx)
                    tag_id = hash(dev_id + name) & 0xFFFFFFFF
                    data_block += struct.pack("<IfQ", tag_id, val, ts)

                push_frame = struct.pack("<IIII", 8 + 8 + len(data_block), 0x8006, seq, len(subscribed))
                push_frame += data_block
                try:
                    conn.send(push_frame)
                    if seq % 5 == 0:
                        pkt("IO-SRV", push_frame[:32] + b"...",
                            f"PUSH seq={seq} tags={len(subscribed)}")
                except:
                    break
        except:
            pass

# ═══════════════════════════════════════
# Phase 3: 采集器测试
# ═══════════════════════════════════════
def test_collector(port=8889):
    print(f"\n{'='*55}")
    print(f"Phase 3: 采集器测试 localhost:{port}")
    print(f"{'='*55}")

    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        s.connect(("127.0.0.1", port))

        # Login
        s.send(struct.pack("<II", 8, 0x01))
        resp = s.recv(256)
        pkt("COLL", resp, "LOGIN_RESP")
        if len(resp) >= 12:
            sid = struct.unpack("<I", resp[8:12])[0]
            print(f"  Session: 0x{sid:04X}")

        # Subscribe
        tags = "02012170058.Ua;02012170058.Ia;02105100097.Ua;02106290043.P"
        sub = struct.pack("<II", 8 + len(tags), 0x03) + struct.pack("<I", 4) + tags.encode()
        s.send(sub)
        resp = s.recv(256)
        pkt("COLL", resp, "SUB_RESP")

        # Start push
        s.send(struct.pack("<II", 8, 0x04))
        resp = s.recv(256)
        pkt("COLL", resp, "PUSH_START_RESP")

        # Receive pushed data
        print("\n  --- Receiving push data ---")
        for _ in range(6):
            try:
                data = s.recv(1024)
                if data:
                    pkt("COLL", data[:48] + (b"..." if len(data)>48 else b""), "PUSH_DATA")
            except socket.timeout:
                break
            time.sleep(1)

        # Snapshot read
        s.send(struct.pack("<IIII", 16, 0x05, 3, 0))
        resp = s.recv(256)
        pkt("COLL", resp, "READ_RESP")

        s.close()
    except Exception as e:
        print(f"  Error: {e}")

# ═══════════════════════════════════════
# Main
# ═══════════════════════════════════════
def main():
    # Phase 1: 探测真实服务
    probe_real_server()

    # Phase 2: 启动本地模拟
    print(f"\n{'='*55}")
    print("Phase 2: 启动本地 1:1 IO Server 模拟")
    print(f"{'='*55}")
    io_srv = IOServerSimulator(port=18889)
    t = threading.Thread(target=io_srv.start, daemon=True)
    t.start()
    time.sleep(1)

    # Phase 3: 采集器测试
    test_collector(port=18889)
    time.sleep(3)

    io_srv.running = False
    print(f"\nDone. {len(LOG)} events logged.")

if __name__ == "__main__":
    main()
