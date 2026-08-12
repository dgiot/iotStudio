#!/usr/bin/env python3
"""
抓本地 OPC Modbus TCP 交互报文
==============================
启动 mock 服务 + 采集器，同时在中间代理抓包，看清每一帧。
"""
import socket, struct, time, json, sys, threading
from datetime import datetime
from pathlib import Path

LOG = []
def log_pkt(direction, data, note=""):
    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    record = {"ts": ts, "dir": direction, "hex": data.hex(), "len": len(data), "note": note}
    LOG.append(record)
    # 格式化输出
    hex_str = " ".join(data[i:i+2].hex() for i in range(0, min(len(data), 32), 2))
    if len(data) > 32:
        hex_str += f" ... (+{len(data)-32}B)"
    print(f"  [{ts}] {direction:5s} | {hex_str}")

def parse_modbus(data):
    """解析 Modbus TCP 帧"""
    if len(data) < 8:
        return ""
    txn = struct.unpack(">H", data[0:2])[0]
    proto = struct.unpack(">H", data[2:4])[0]
    length = struct.unpack(">H", data[4:6])[0]
    unit = data[6]
    func = data[7]
    func_names = {1:"ReadCoils", 2:"ReadDI", 3:"ReadHR", 4:"ReadIR",
                  5:"WriteCoil", 6:"WriteHR", 15:"WriteCoils", 16:"WriteHRs"}
    fn = func_names.get(func, f"Func{func}")
    if func in (1,2,3,4) and len(data) >= 12:
        start = struct.unpack(">H", data[8:10])[0]
        count = struct.unpack(">H", data[10:12])[0]
        return f"Txn={txn} {fn} Unit={unit} Start={start} Count={count}"
    elif func in (3,4) and len(data) >= 9 and data[8] > 0:
        byte_cnt = data[8]
        vals = []
        for i in range(min(byte_cnt//2, 4)):
            vals.append(struct.unpack(">H", data[9+i*2:11+i*2])[0])
        return f"Txn={txn} {fn} Unit={unit} Bytes={byte_cnt} Vals={vals}"
    return f"Txn={txn} {fn} Unit={unit}"

def proxy_thread(target_host, target_port, listen_port):
    """TCP 代理 — 在中间抓包"""
    listen_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listen_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listen_sock.bind(("127.0.0.1", listen_port))
    listen_sock.listen(5)
    listen_sock.settimeout(30)
    print(f"[PROXY] Listening on :{listen_port} → {target_host}:{target_port}\n")

    try:
        conn, addr = listen_sock.accept()
        print(f"[PROXY] Client connected: {addr}\n")

        # 连目标
        target = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        target.connect((target_host, target_port))

        def forward(src, dst, label):
            """双向转发 + 抓包"""
            buf = b""
            while True:
                try:
                    data = src.recv(4096)
                    if not data:
                        break
                    note = parse_modbus(data)
                    log_pkt(label, data, note)
                    dst.send(data)
                except:
                    break

        # 启动双向转发
        t1 = threading.Thread(target=forward, args=(conn, target, "C2S->"), daemon=True)
        t2 = threading.Thread(target=forward, args=(target, conn, "<-S2C"), daemon=True)
        t1.start()
        t2.start()

        t1.join(timeout=30)
        t2.join(timeout=30)

    except socket.timeout:
        pass
    finally:
        listen_sock.close()

def main():
    import subprocess, os
    print("=" * 60)
    print("OPC Modbus TCP 抓包分析")
    print("=" * 60)
    print()

    # Step 1: 启动 mock 服务在 :1502
    print("[1] Starting mock OPC server on :1502...")
    mock = subprocess.Popen(
        [sys.executable, "-c", """
import socket, struct, time, random, math

# Mini mock server
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(("127.0.0.1", 1502))
sock.listen(1)
sock.settimeout(10)

BASE = [5.0, 0.5, 220.0, 1000.0, 0.95, 50.0, 0, 220.0, 25.0, 0]
COEFF = [170/8192, 8.5/8192, 170/8192, 1, 1/8192, 2/8192, 1, 1, 1, 1]

try:
    conn, addr = sock.accept()
    while True:
        data = conn.recv(256)
        if not data: break
        if len(data) >= 12:
            txn = data[0:2]
            proto = data[2:4]
            unit = data[6]
            func = data[7]
            start = struct.unpack(">H", data[8:10])[0]
            count = struct.unpack(">H", data[10:12])[0]
            if func == 3:
                ch = start // 4
                vals = []
                for i in range(count):
                    base = BASE[(ch+i) % 10]
                    coef = COEFF[(ch+i) % 10]
                    drift = math.sin(time.time()/60 + ch + i) * 0.03
                    noise = random.gauss(0, 0.01)
                    phys = base * (1 + drift + noise)
                    raw = max(0, min(65535, int(phys / coef)))
                    vals.append(raw)
                byte_cnt = count * 2
                resp = txn + proto + struct.pack(">H", 3+byte_cnt) + bytes([unit, func, byte_cnt])
                for v in vals:
                    resp += struct.pack(">H", v)
                conn.send(resp)
except: pass
finally:
    sock.close()
"""],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(1.5)
    print("   Mock server PID:", mock.pid)

    # Step 2: 启动代理 (抓包中间人) :502 → :1502
    print("[2] Starting proxy :502 -> :1502...")
    proxy = threading.Thread(target=proxy_thread, args=("127.0.0.1", 1502, 502), daemon=True)
    proxy.start()
    time.sleep(1)

    # Step 3: 采集器连代理，发 Modbus 请求
    print("\n[3] Collector -> Proxy -> Mock Server")
    print("-" * 60)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)
    sock.connect(("127.0.0.1", 502))

    for cycle in range(2):
        print(f"\n  -- Cycle {cycle+1} --")
        for dev_unit in [1, 2, 3]:
            for ch in range(2):
                txn_id = cycle * 6 + ch * 2 + dev_unit
                req = struct.pack(">H", txn_id) + b"\x00\x00\x00\x06"
                req += bytes([dev_unit, 0x03])  # unit, ReadHR
                req += struct.pack(">HH", ch * 4, 1)  # start, count
                sock.send(req)
                resp = sock.recv(256)
        time.sleep(0.3)

    sock.close()
    print("\n" + "-" * 60)

    # Step 4: 报文分析
    print(f"\n[4] Analysis: {len(LOG)} packets captured\n")
    print(f"{'Time':<14} {'Dir':<6} {'Type':<12} {'Details'}")
    print("-" * 80)
    for pkt in LOG:
        note = pkt["note"] if pkt["note"] else "(raw)"
        ptype = ""
        if "ReadHR" in note:
            ptype = "MODBUS REQ"
        elif "Vals=" in note:
            ptype = "MODBUS RESP"
        print(f"{pkt['ts']:<14} {pkt['dir']:<6} {ptype:<12} {note}")

    print(f"\n[5] Full hex log saved to logs/cap_opc_local.jsonl")

    mock.terminate()
    mock.wait()

    # Save
    Path("logs").mkdir(exist_ok=True)
    with open("logs/cap_opc_local.jsonl", "w") as f:
        for pkt in LOG:
            f.write(json.dumps(pkt) + "\n")

if __name__ == "__main__":
    main()
