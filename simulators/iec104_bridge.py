#!/usr/bin/env python3
# ============================================================
# dgiot_lite — IEC 104 桥接器 (Python 3.11)
# c104 client → 读取 c104 服务器 → HTTP POST 到 dgiot_lite
# 运行: py -3.11 iec104_bridge.py
# ============================================================
import c104
import time
import json
import urllib.request

DGIT_API = "http://localhost:8000/api"
POLL_INTERVAL = 5  # 秒

# IOA → (point_id, point_name) 映射
IOA_MAP = {
    100: ("iec104_soc", "SOC"),
    101: ("iec104_soh", "SOH"),
    102: ("iec104_power", "有功功率"),
    103: ("iec104_voltage", "交流电压"),
    104: ("iec104_current", "交流电流"),
    105: ("iec104_temp", "电芯温度"),
}


def main():
    print("IEC104 Bridge starting...")
    print(f"  Server: 127.0.0.1:2404")
    print(f"  DG-IoT API: {DGIT_API}")
    print(f"  Poll: {POLL_INTERVAL}s")

    client = c104.Client(tick_rate_ms=1000, command_timeout_ms=5000)
    conn = client.add_connection(ip="127.0.0.1", port=2404, init=c104.Init.INTERROGATION)
    station = conn.add_station(common_address=1)

    points = {}
    for ioa, (pid, name) in IOA_MAP.items():
        pt = station.add_point(io_address=ioa, type=c104.Type.M_ME_NC_1)
        points[ioa] = (pid, name, pt)

    client.start()
    print("Connected! Polling...")

    try:
        while True:
            time.sleep(POLL_INTERVAL)
            for ioa, (pid, name, pt) in points.items():
                val = pt.value
                if val is not None:
                    data = [{"point_id": pid, "point_name": name,
                             "value": round(val, 4), "unit": "",
                             "quality": 0, "data_type": "float32"}]
                    try:
                        req = urllib.request.Request(
                            f"{DGIT_API}/bridge/telemetry",
                            data=json.dumps({
                                "device_id": "pcs_iec104",
                                "points": data,
                            }).encode(),
                            headers={"Content-Type": "application/json"},
                            method="POST",
                        )
                        urllib.request.urlopen(req, timeout=5)
                    except Exception as e:
                        pass  # 静默跳过
            print(f"  [{time.strftime('%H:%M:%S')}] Synced {len(points)} points")
    except KeyboardInterrupt:
        client.stop()
        print("Bridge stopped")


if __name__ == "__main__":
    main()
