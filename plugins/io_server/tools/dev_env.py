#!/usr/bin/env python3
"""
131 离线开发环境 — 一键启动全栈模拟
=====================================
用法:
  python tools/dev_env.py              # 启动全部服务 + 交互控制台
  python tools/dev_env.py --no-collector # 只启动服务，不启动采集器
  python tools/dev_env.py --scale 100    # 模拟100台设备

服务:
  CommBridge   :53002   DTU/RTU 桥接
  IoMonitor    :9002   数据汇聚
  IoCommit     :9003   数据写入
  IoProject    :9001   进程编排
  IO-Srv       :18889  pSpace 数据源
  OPC-DA       :13500  OPC 数据源
  Modbus       :502    Modbus TCP

交互命令 (控制台):
  status          查看各服务状态
  devices         列出在线设备
  packets [N]     最近N个报文
  inject <dev_id> 注入一台新设备
  perf            性能统计
  help            帮助
  quit            退出
"""
import socket, struct, threading, time, random, math, json, sys, os
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOG_DIR = ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)

# ═══════════════════════════════════════
# 数据引擎
# ═══════════════════════════════════════
DEVICE_TYPES = {
    0x00: {"name": "DSL-31A 断路器", "ch": 20, "coeff": [1,1,1,2,2,2,2,2,2,3,3,4,5,0,0,0,1,2,2,2],
           "base": [5.0,0.5,0.5,12,12,12,12,12,12,35,35,100,150,0,0,0,5,12,12,12]},
    0x10: {"name": "DST-31A 变压器差动", "ch": 15, "coeff": [1]*15,
           "base": [3.2]*15},
    0x20: {"name": "DBPA-31A 备自投", "ch": 13, "coeff": [0,0,0,2,2,1,1,2,2,2,2,2,2],
           "base": [2.0,1.0,0.8,100,100,380,380,100,100,100,100,100,100]},
    0x30: {"name": "DSB-31A 变压器后备", "ch": 20, "coeff": [1,1,2,2,2,2,2,2,3,3,4,5,0,0,0,1,0,0,2,2],
           "base": [4.5,0.4,380,380,380,380,380,380,50,50,100,150,0,0,0,4.5,0,0,380,380]},
    0x40: {"name": "电动机保护", "ch": 19, "coeff": [1,1,1,2,2,2,2,2,2,3,3,4,5,0,0,0,1,2,2],
           "base": [8.5,8.5,8.5,6.3,6.3,6.3,6.3,6.3,6.3,100,100,200,300,0,0,0,8.5,6.3,6.3]},
}
COEFF = [170/8192, 8.5/8192, 170/8192, 1, 1/8192, 2/8192, 1,1,1,1, 0.1, 0.01]

# 20台真实设备ID (从 IOMan 提取)
REAL_DEVICES = {
    "02012170058": 0x00, "02105100097": 0x10, "02105110008": 0x10,
    "02106290043": 0x30, "02106290052": 0x30, "02106290085": 0x30,
    "02107010048": 0x40, "02107030091": 0x40, "02107190091": 0x40,
    "02110080020": 0x00, "02110080028": 0x00, "02110110045": 0x10,
    "02110120089": 0x20, "02110150030": 0x30, "02110150041": 0x30,
    "02110150046": 0x30, "02110160086": 0x40, "02111260034": 0x20,
    "02111270046": 0x20, "02111270058": 0x20,
}

class DataEngine:
    def __init__(self):
        self._t = time.time()
    def read_raw(self, dev_id, count=10):
        dtype = REAL_DEVICES.get(dev_id, 0x00)
        cfg = DEVICE_TYPES.get(dtype, DEVICE_TYPES[0x00])
        raws = []
        for i in range(min(count, len(cfg['base']))):
            phys = cfg['base'][i] * (1 + math.sin(time.time()/30 + hash(dev_id+str(i))%100)*0.02 + random.gauss(0,0.003))
            ci = cfg['coeff'][i] if i < len(cfg['coeff']) else 0
            c = COEFF[ci] if ci < len(COEFF) else 1.0
            raws.append(max(0, min(65535, int(phys / c if c > 0 else phys))))
        return raws
    def status(self):
        return {"devices": len(REAL_DEVICES), "types": len(DEVICE_TYPES)}

ENGINE = DataEngine()

# ═══════════════════════════════════════
# 共享状态
# ═══════════════════════════════════════
STATE = {"starts": 0, "packets": 0, "records": 0, "conns": 0, "running": True}
RTU_STATE = {}  # dev_id -> {"online": bool, "polls": int}
LOCK = threading.Lock()

def tick(stat):
    with LOCK: STATE[stat] = STATE.get(stat, 0) + 1

# ═══════════════════════════════════════
# TCP Server 基类
# ═══════════════════════════════════════
class TCPServer:
    def __init__(self, name, port):
        self.name = name
        self.port = port
        self.sock = None
    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(50)
        self.sock.settimeout(1.0)
        print(f"  [{self.name}] :{self.port}")
        while STATE["running"]:
            try:
                conn, addr = self.sock.accept()
                tick("conns")
                threading.Thread(target=self.handle, args=(conn, addr), daemon=True).start()
            except socket.timeout:
                continue
            except: break
    def handle(self, conn, addr):
        pass

# ═══════════════════════════════════════
# CommBridge :53002
# ═══════════════════════════════════════
class CommBridge(TCPServer):
    def __init__(self): super().__init__("CB", 53002)
    def handle(self, conn, addr):
        dtu_id = f"rtu_{addr[1]}"
        slave = addr[1] % 247 + 1
        seq = 0
        try:
            reg = conn.recv(64)
            if len(reg) >= 4 and reg[0] == 0xAA and reg[-1] == 0x0D:
                slave = reg[1]
                dtu_id = reg[2:-1].decode('ascii', errors='ignore')
                with LOCK: RTU_STATE[dtu_id] = {"online": True, "polls": 0, "addr": str(addr)}
                tick("packets")

            conn.settimeout(5)
            ch_count = DEVICE_TYPES.get(REAL_DEVICES.get(dtu_id, 0x00), DEVICE_TYPES[0x00])['ch']

            while STATE["running"]:
                time.sleep(2)
                seq = (seq + 1) & 0xFF
                qdata = struct.pack(">HH", 0, min(ch_count, 30))
                query = struct.pack(">BIBBB", seq, 0, 1+1+len(qdata), slave, 0x03) + qdata
                conn.send(query)
                tick("packets")
                try:
                    resp = conn.recv(512)
                    if not resp: break
                    tick("packets")
                    with LOCK:
                        if dtu_id in RTU_STATE:
                            RTU_STATE[dtu_id]["polls"] += 1
                    # Push to IoMonitor
                    try:
                        js = json.dumps({"dtu": dtu_id, "slave": slave, "ts": time.time()}).encode()
                        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        s.settimeout(0.5); s.connect(("127.0.0.1", 9002)); s.send(js); s.close()
                    except: pass
                except socket.timeout:
                    pass
        except: pass
        finally:
            with LOCK:
                if dtu_id in RTU_STATE: RTU_STATE[dtu_id]["online"] = False
            conn.close()

# ═══════════════════════════════════════
# IoMonitor :9002
# ═══════════════════════════════════════
class IoMonitor(TCPServer):
    def __init__(self): super().__init__("IoMon", 9002)
    def handle(self, conn, addr):
        try:
            data = conn.recv(4096)
            if data:
                tick("records")
                tick("packets")
                # Forward to IoCommit
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.settimeout(0.5); s.connect(("127.0.0.1", 9003)); s.send(data); s.close()
                except: pass
            conn.close()
        except: pass

# ═══════════════════════════════════════
# IoCommit :9003
# ═══════════════════════════════════════
class IoCommit(TCPServer):
    def __init__(self): super().__init__("IoCom", 9003)
    def handle(self, conn, addr):
        try:
            data = conn.recv(8192)
            if data: conn.send(b"COMMITTED")
            conn.close()
        except: pass

# ═══════════════════════════════════════
# IoProject :9001
# ═══════════════════════════════════════
class IoProject(TCPServer):
    def __init__(self): super().__init__("IoProj", 9001)
    def handle(self, conn, addr):
        try:
            data = conn.recv(4096)
            if data:
                try:
                    cmd = json.loads(data.decode())
                    resp = {"status": "ok"}
                    if cmd.get("action") == "status":
                        resp.update(STATE)
                    elif cmd.get("action") == "devices":
                        resp["devices"] = {k: v for k, v in RTU_STATE.items() if v.get("online")}
                    conn.send(json.dumps(resp).encode())
                except: conn.send(b'{"error":"parse"}')
            conn.close()
        except: pass

# ═══════════════════════════════════════
# IO-Srv (pSpace) :18889
# ═══════════════════════════════════════
class IOServer(TCPServer):
    def __init__(self): super().__init__("IO-Srv", 18889)
    def handle(self, conn, addr):
        buf = b""
        try:
            while STATE["running"]:
                data = conn.recv(4096)
                if not data: break
                buf += data
                tick("packets")
                while len(buf) >= 8:
                    flen = struct.unpack("<I", buf[0:4])[0]
                    if len(buf) < flen: break
                    frame = buf[:flen]; buf = buf[flen:]
                    cmd = struct.unpack("<I", frame[4:8])[0]
                    if cmd == 0x01:
                        sid = random.randint(0x1000, 0xFFFF)
                        conn.send(struct.pack("<IIII", 16, 0x8001, sid, 1))
                    elif cmd == 0x03:
                        conn.send(struct.pack("<II", 8, 0x8003))
                    elif cmd == 0x05:
                        # Read snapshot
                        devs = list(REAL_DEVICES.keys())
                        vals = b"".join(struct.pack("<f", ENGINE.read_raw(devs[i%len(devs)], 1)[0]) for i in range(5))
                        conn.send(struct.pack("<II", 8+len(vals), 0x8005) + vals)
                    elif cmd == 0x99: break
                    else:
                        conn.send(struct.pack("<III", 12, 0x8FFF, cmd))
        except: pass
        finally: conn.close()

# ═══════════════════════════════════════
# OPC-DA :13500
# ═══════════════════════════════════════
class OPCServer(TCPServer):
    def __init__(self): super().__init__("OPC", 13500)
    def handle(self, conn, addr):
        buf = b""
        try:
            while STATE["running"]:
                data = conn.recv(4096)
                if not data: break
                buf += data
                tick("packets")
                while len(buf) >= 4:
                    flen = struct.unpack(">H", buf[0:2])[0]
                    if len(buf) < flen: break
                    frame = buf[:flen]; buf = buf[flen:]
                    cmd = struct.unpack(">H", frame[2:4])[0]
                    if cmd == 0x0001:  # Read
                        items = frame[4:].decode('ascii', errors='ignore').split(';')
                        parts = []
                        for item in items:
                            if '.' in item:
                                did, tag = item.split('.', 1)
                                idx = 0 if 'Ia' in tag else 2 if 'Ua' in tag else 3
                                val = ENGINE.read_raw(did, idx+1)[idx] * COEFF[0]
                                parts.append(f"{item}={round(val,4)}")
                        body = ";".join(parts).encode()
                        conn.send(struct.pack(">HH", len(body)+4, 0x8001) + body)
                    elif cmd == 0x0002:  # Browse
                        items = ";".join(f"{d}.Ia;{d}.Ua" for d in list(REAL_DEVICES.keys())[:10])
                        conn.send(struct.pack(">HH", len(items)+4, 0x8002) + items.encode())
        except: pass
        finally: conn.close()

# ═══════════════════════════════════════
# Modbus TCP :502
# ═══════════════════════════════════════
class ModbusServer(TCPServer):
    def __init__(self): super().__init__("MB", 502)
    def handle(self, conn, addr):
        buf = b""
        try:
            while STATE["running"]:
                data = conn.recv(4096)
                if not data: break
                buf += data
                tick("packets")
                while len(buf) >= 8:
                    mlen = struct.unpack(">H", buf[4:6])[0]
                    total = 6 + mlen
                    if len(buf) < total: break
                    req = buf[:total]; buf = buf[total:]
                    if req[7] == 0x03 and len(req) >= 12:
                        unit = req[6]
                        start = struct.unpack(">H", req[8:10])[0]
                        count = struct.unpack(">H", req[10:12])[0]
                        devs = list(REAL_DEVICES.keys())
                        raws = ENGINE.read_raw(devs[unit % len(devs)], count)
                        bc = count * 2
                        vals = b"".join(struct.pack(">H", r) for r in raws[:count])
                        resp = req[0:2] + b"\x00\x00" + struct.pack(">H", 3+bc) + bytes([unit, 3, bc]) + vals
                        conn.send(resp)
                        tick("packets")
        except: pass
        finally: conn.close()

# ═══════════════════════════════════════
# RTU 模拟器
# ═══════════════════════════════════════
def run_rtu(dev_id, slave_id):
    while STATE["running"]:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(30)
            s.connect(("127.0.0.1", 53002))
            s.send(bytes([0xAA, slave_id]) + dev_id.encode() + bytes([0x0D]))
            while STATE["running"]:
                data = s.recv(256)
                if not data: break
                if len(data) == 1 and data[0] == 0x00:
                    s.send(b"\x00"); continue
                if len(data) >= 8 and data[7] == 0x03:
                    payload = data[8:]
                    if len(payload) >= 4:
                        qty = struct.unpack(">H", payload[2:4])[0]
                        raws = ENGINE.read_raw(dev_id, qty)
                        bc = qty * 2
                        rd = bytes([bc]) + b"".join(struct.pack(">H", r) for r in raws[:qty])
                        resp = struct.pack(">BIBBB", data[0], 0, 2+len(rd), slave_id, 0x03) + rd
                        s.send(resp)
        except:
            time.sleep(5)  # reconnect delay
        finally:
            try: s.close()
            except: pass

# ═══════════════════════════════════════
# 交互控制台
# ═══════════════════════════════════════
def console():
    print("\n" + "=" * 55)
    print("  离线开发环境已就绪 — 输入 help 查看命令")
    print("=" * 55)
    while STATE["running"]:
        try:
            cmd = input("\n> ").strip().lower()
            if not cmd: continue

            if cmd == "help":
                print("  status  - 服务运行状态")
                print("  devices - 在线设备列表")
                print("  perf    - 性能统计")
                print("  inject <dev_id> <type> - 注入设备 (type: 00-40)")
                print("  quit    - 退出")

            elif cmd == "status":
                print(f"  CommBridge :53002  RTU={sum(1 for v in RTU_STATE.values() if v.get('online'))}")
                print(f"  IoMonitor  :9002  records={STATE['records']}")
                print(f"  IoCommit   :9003")
                print(f"  IoProject  :9001")
                print(f"  IO-Srv     :18889 (pSpace)")
                print(f"  OPC-DA     :13500")
                print(f"  Modbus     :502")
                print(f"  Devices: {len(REAL_DEVICES)} configured")
                print(f"  Packets: {STATE['packets']}")

            elif cmd == "devices":
                online = {k: v for k, v in RTU_STATE.items() if v.get("online")}
                offline = {k: v for k, v in RTU_STATE.items() if not v.get("online")}
                dtype = REAL_DEVICES.get(list(online.keys())[0] if online else "", 0x00)
                cfg = DEVICE_TYPES.get(dtype, DEVICE_TYPES[0x00])
                print(f"  Online: {len(online)}/{len(REAL_DEVICES)}")
                for did, info in list(online.items())[:5]:
                    print(f"    {did}  [{cfg['name']}] polls={info.get('polls',0)}")
                if len(online) > 5: print(f"    ... +{len(online)-5} more")
                if offline:
                    print(f"  Offline: {len(offline)} (waiting for reconnect)")

            elif cmd == "perf":
                elapsed = time.time() - STATE.get("_start", time.time())
                pps = STATE["packets"] / max(elapsed, 1)
                rps = STATE["records"] / max(elapsed, 1)
                print(f"  Uptime: {elapsed:.0f}s")
                print(f"  Packets: {STATE['packets']} ({pps:.1f}/s)")
                print(f"  Records: {STATE['records']} ({rps:.1f}/s)")
                print(f"  Connections: {STATE['conns']}")

            elif cmd.startswith("inject"):
                parts = cmd.split()
                if len(parts) >= 2:
                    new_id = parts[1]
                    new_type = int(parts[2], 16) if len(parts) >= 3 else 0x00
                    REAL_DEVICES[new_id] = new_type
                    t = threading.Thread(target=run_rtu, args=(new_id, (len(REAL_DEVICES)+1)%247+1), daemon=True)
                    t.start()
                    print(f"  Injected: {new_id} type=0x{new_type:02X} [{DEVICE_TYPES[new_type]['name']}]")

            elif cmd == "quit":
                STATE["running"] = False
                print("  Shutting down...")
                break

        except (EOFError, KeyboardInterrupt):
            STATE["running"] = False
            print("\n  Shutting down...")
            break

# ═══════════════════════════════════════
# Main
# ═══════════════════════════════════════
def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-collector", action="store_true")
    ap.add_argument("--scale", type=int, default=20)
    args = ap.parse_args()

    STATE["_start"] = time.time()

    print("=" * 55)
    print("  DG-IoT 离线开发环境")
    print("  131 全栈模拟 — 一键启动")
    print("=" * 55)
    print(f"  Devices: {min(args.scale, len(REAL_DEVICES))}")
    print()

    # 添加更多设备 (scale up)
    for i in range(len(REAL_DEVICES), args.scale):
        did = f"0220406{i:03d}00"
        REAL_DEVICES[did] = (0x00 + i) % 0xB0

    # 启动服务
    services = [CommBridge, IoMonitor, IoCommit, IoProject, IOServer, OPCServer, ModbusServer]
    for svc_cls in services:
        svc = svc_cls()
        threading.Thread(target=svc.start, daemon=True).start()
        time.sleep(0.15)

    time.sleep(0.5)

    # 启动 RTU 设备
    device_ids = list(REAL_DEVICES.keys())[:args.scale]
    print(f"\n  启动 {len(device_ids)} 台 RTU...")
    for i, did in enumerate(device_ids):
        threading.Thread(target=run_rtu, args=(did, (i % 247) + 1), daemon=True).start()
        if i % 10 == 9: time.sleep(0.2)

    time.sleep(2)

    # 快速验证
    print(f"\n  验证连通性...")
    for name, port in [("CB", 53002), ("IoMon", 9002), ("IoCom", 9003),
                        ("IO-Srv", 18889), ("OPC", 13500), ("MB", 502)]:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            s.connect(("127.0.0.1", port))
            s.close()
            print(f"    {name}:{port} OK")
        except:
            print(f"    {name}:{port} FAIL")

    online = sum(1 for v in RTU_STATE.values() if v.get("online"))
    print(f"\n  RTU 在线: {online}/{len(device_ids)}")

    # 交互控制台
    console()

    # 保存日志
    print(f"\n  最终统计:")
    print(f"    Packets: {STATE['packets']}")
    print(f"    Records: {STATE['records']}")
    print(f"  开发环境已关闭")

if __name__ == "__main__":
    main()
