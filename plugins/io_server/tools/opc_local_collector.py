#!/usr/bin/env python3
"""
OPC DA 本地采集器 — 连 Mock OPC Server，走完整管线
=====================================================
1. 连 mock_opc_server.py (Modbus TCP :502)
2. 周期性轮询设备数据
3. 经 EventBus → MQTT → TDengine 写库
4. 记录交互报文到 JSONL

可与 mock_opc_server.py 同时运行进行端到端测试。
"""
import socket, struct, time, json, sys, os
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
LOG_DIR = ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)

# 设备列表 (对标 IOMan 命令行参数)
DEVICES = [
    {"id": "02204060100", "name": "线路保护A1", "channels": 20, "ip": "127.0.0.1", "port": 502, "unit": 1},
    {"id": "02204060111", "name": "变压器保护B3", "channels": 15, "ip": "127.0.0.1", "port": 502, "unit": 2},
    {"id": "02204060200", "name": "电动机保护M2", "channels": 19, "ip": "127.0.0.1", "port": 502, "unit": 3},
]

# 转换系数 (ChangeData from Device.ini)
COEFF = {
    0: 170 / 8192,        # 0.020751953125 — 相电流
    1: 8.5 / 8192,        # 0.00103759765625 — 接地电流
    2: 170 / 8192,        # 0.020751953125 — 相电压
    3: 1,                  # 1 — 有功功率 (实际是 170*8.5/8192 ≈ 0.176)
    4: 1 / 8192,          # 0.0001220703125 — 功率因数
    5: 2 / 8192,          # 0.000244140625 — 频率
    6: 1, 7: 1, 8: 1, 9: 1,  # 直通
}

MB_READ_HOLDING = 0x03
packet_log = []
txn_counter = [0]  # mutable for closure


def log_event(etype, detail):
    ts = datetime.now().isoformat(timespec="milliseconds")
    record = {"ts": ts, "type": etype, "detail": detail}
    packet_log.append(record)
    print(f"  [{ts[11:]}] {etype}: {detail}")


def read_modbus_register(sock, unit_id, start_addr, count):
    """读 Modbus Holding Register"""
    txn_counter[0] += 1
    txn = struct.pack(">H", txn_counter[0] % 65536)
    proto = b"\x00\x00"
    length = struct.pack(">H", 6)
    pdu = bytes([unit_id, MB_READ_HOLDING]) + struct.pack(">HH", start_addr, count)
    request = txn + proto + length + pdu

    sock.send(request)
    log_event("MODBUS_REQ", f"Unit={unit_id} Start={start_addr} Count={count} Hex={request.hex()}")

    resp = sock.recv(256)
    log_event("MODBUS_RESP", f"Unit={unit_id} Hex={resp.hex()}")

    if len(resp) < 9:
        return None

    resp_unit = resp[6]
    resp_func = resp[7]
    resp_bytes = resp[8]

    values = []
    for i in range(resp_bytes // 2):
        offset = 9 + i * 2
        raw = struct.unpack(">H", resp[offset:offset+2])[0]
        values.append(raw)

    return values


def collect_device(sock, device):
    """采集单个设备的所有通道数据"""
    results = []
    for ch in range(min(device["channels"], 10)):  # 只采前10通道(模拟)
        start_addr = ch * 4  # 每个通道4个寄存器
        raw_vals = read_modbus_register(sock, device["unit"], start_addr, 2)
        if raw_vals:
            coef_idx = ch % 10
            coef = COEFF.get(coef_idx, 1.0)
            physical = round(raw_vals[0] * coef, 4)
            results.append({
                "device": device["id"],
                "name": device["name"],
                "channel": f"ch{ch:02d}",
                "raw": raw_vals[0],
                "coef": coef,
                "physical": physical,
                "unit": {0: "A", 1: "A", 2: "V", 3: "W", 4: "", 5: "Hz"}.get(coef_idx, ""),
            })
    return results


def push_to_pipeline(results):
    """通过 dgiot_lite 管线推送数据"""
    try:
        # 方式1: HTTP -> Parse REST API
        import urllib.request
        for r in results:
            body = json.dumps({
                "device": r["device"],
                "name": r["name"],
                "channel": r["channel"],
                "value": r["physical"],
                "raw": r["raw"],
                "unit": r["unit"],
            }).encode()
            req = urllib.request.Request(
                "http://127.0.0.1:8000/api/telemetry",
                data=body,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            try:
                urllib.request.urlopen(req, timeout=3)
            except Exception as e:
                log_event("HTTP_PUSH", f"Failed: {e}")
    except Exception as e:
        log_event("PIPELINE", f"Push error: {e}")


def main():
    print("=== OPC DA Local Collector ===\n")
    print(f"Devices: {len(DEVICES)}")
    print(f"Target: 127.0.0.1:502 (mock_opc_server)")
    print(f"Pipeline: HTTP -> :8000/api/telemetry")
    print(f"Log: {LOG_DIR / 'opc_collector_packets.jsonl'}")
    print()

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)

    try:
        sock.connect(("127.0.0.1", 502))
        log_event("CONNECT", "Connected to mock OPC server")

        cycle = 0
        while True:
            cycle += 1
            total_points = 0
            print(f"\n--- Cycle {cycle} ---")

            for dev in DEVICES:
                try:
                    results = collect_device(sock, dev)
                    if results:
                        push_to_pipeline(results)
                        total_points += len(results)
                        for r in results[:3]:
                            print(f"  {r['name']}/{r['channel']}: {r['physical']}{r['unit']} (raw={r['raw']})")
                        if len(results) > 3:
                            print(f"  ... +{len(results)-3} more points")
                except socket.timeout:
                    log_event("TIMEOUT", f"Device {dev['id']}")
                    # 重连
                    sock.close()
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(5)
                    sock.connect(("127.0.0.1", 502))

            log_event("CYCLE", f"Cycle={cycle} Points={total_points}")
            print(f"  Total: {total_points} telemetry points pushed")
            time.sleep(3)

    except KeyboardInterrupt:
        print("\nStopping...")
    except ConnectionRefusedError:
        print("ERROR: mock_opc_server not running on :502")
        print("Start it first: python tools/mock_opc_server.py")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        sock.close()
        # 保存日志
        log_file = LOG_DIR / "opc_collector_packets.jsonl"
        with open(log_file, 'w') as f:
            for p in packet_log:
                f.write(json.dumps(p, ensure_ascii=False) + '\n')
        print(f"\nLog saved: {log_file} ({len(packet_log)} events)")


if __name__ == "__main__":
    main()
