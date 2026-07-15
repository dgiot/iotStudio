#!/usr/bin/env python3
"""
持续数据注入器 — 从本地模拟器读取数据，注入到平台遥测 API

用法:
    python tools/continuous_injector.py              # 默认连续注入
    python tools/continuous_injector.py --once        # 只注入一批
    python tools/continuous_injector.py --interval 2  # 每2秒注入一批
"""
import struct, socket, json, urllib.request, time, sys

API = "http://127.0.0.1:8000"
MODBUS_HOST = "127.0.0.1"
MODBUS_PORT = 502
OPC_HOST = "127.0.0.1"
OPC_PORT = 13500

# 模拟设备列表 (与 dev_env.py 中的 REAL_DEVICES 对应)
REAL_DEVICES = [
    "02012170058", "02105100097", "02106290043",
    "02107010048", "02107030091", "02107190091",
    "02110080028", "02110120089", "02110150030",
    "02110150041", "02111260034", "02111270058",
]

def read_modbus(host, port, unit=1):
    """读取 Modbus TCP 设备"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3)
        s.connect((host, port))
        # Modbus TCP Read Holding Registers (func 0x03), start=0, count=10
        req = struct.pack(">HHHBBHH", 0, 0, 6, unit, 3, 0, 10)
        s.send(req)
        resp = s.recv(256)
        s.close()
        if len(resp) >= 9:
            bc = resp[8]
            vals = []
            for i in range(bc // 2):
                val = struct.unpack(">H", resp[9+i*2:11+i*2])[0]
                vals.append(val)
            return vals
    except Exception as e:
        return None

def push_telemetry(device_id, point, value, ts=None):
    """推送遥测到平台 API"""
    data = {
        "device": device_id,
        "point": point,
        "value": value,
        "unit": "",
        "ts": ts or time.time(),
    }
    try:
        req = urllib.request.Request(
            f"{API}/api/telemetry",
            data=json.dumps(data).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        resp = urllib.request.urlopen(req, timeout=3)
        return resp.status == 200
    except:
        return False

def main():
    interval = float(sys.argv[sys.argv.index("--interval")+1]) if "--interval" in sys.argv else 2.0
    once = "--once" in sys.argv

    print(f"持续数据注入器 (间隔={interval}s)")
    print(f"  Modbus 模拟器: {MODBUS_HOST}:{MODBUS_PORT}")
    print(f"  OPC DA 模拟器: {OPC_HOST}:{OPC_PORT}")
    print(f"  平台 API: {API}")
    print()

    count = 0
    while True:
        # 1. 读 Modbus 模拟器
        vals = read_modbus(MODBUS_HOST, MODBUS_PORT, 1)
        if vals:
            points = ["Ia", "Ib", "Ic", "Ua", "Ub", "Uc", "P", "Q", "F", "cos"]
            for i in range(min(len(vals), len(points))):
                val = vals[i] * 170.0 / 8192.0 if i < 3 else vals[i] * 0.01
                # 推送到多个模拟设备
                for dev in REAL_DEVICES[:3]:
                    ok = push_telemetry(dev, points[i], round(val, 4))
                    if ok: count += 1

        # 2. 在读到的设备上标记活跃
        pushed = count
        sys.stdout.write(f"  [{time.strftime('%H:%M:%S')}] 已推送 {pushed} 条遥测\n")
        sys.stdout.flush()

        if once:
            break
        time.sleep(interval)

if __name__ == "__main__":
    main()
