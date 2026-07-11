#!/usr/bin/env python3
"""dgiot_lite → 边缘中枢 桥接器 — 推送真实设备数据到 Edge Hub :9101"""
import json, time, random, urllib.request, sqlite3, threading, sys

HUB = "http://127.0.0.1:9101/api/hub/data"
AGENT = "dgiot-lite-io-server"

def push_data(points):
    """推送数据到边缘中枢"""
    data = json.dumps({"agent": AGENT, "meta": {"source":"io_server","version":"1.0"}, "points": points}).encode()
    try:
        req = urllib.request.Request(HUB, data=data, headers={"Content-Type": "application/json"})
        r = urllib.request.urlopen(req, timeout=3)
        resp = json.loads(r.read())
        return resp
    except Exception as e:
        return {"error": str(e)}

def realtime_pusher():
    """实时推送 — 模拟油井数据到边缘中枢"""
    devices = [
        {"device":"02110120089_B1V25VE33","points":[{"point":"最大载荷","value":86.07,"unit":"kN"},{"point":"最小载荷","value":17.30,"unit":"kN"}]},
        {"device":"02110150041_B1V51VSFK01","points":[{"point":"最大下行电流","value":15.28,"unit":"A"},{"point":"最大上行电流","value":10.69,"unit":"A"},{"point":"最大载荷","value":41.31,"unit":"kN"}]},
        {"device":"油井-A1","points":[{"point":"载荷","value":86,"unit":"kN"},{"point":"电流","value":12,"unit":"A"}]},
        {"device":"油井-B3","points":[{"point":"载荷","value":75,"unit":"kN"},{"point":"电流","value":9,"unit":"A"}]},
        {"device":"油井-C7","points":[{"point":"载荷","value":93,"unit":"kN"},{"point":"电流","value":18,"unit":"A"}]},
    ]
    print(f"[bridge] Push to {HUB}")
    while True:
        for dev in random.sample(devices, min(3, len(devices))):
            pts = []
            for pt in dev["points"]:
                val = round(pt["value"] + random.uniform(-5, 5), 2)
                pts.append({"device": dev["device"], "point": pt["point"], "value": val, "unit": pt.get("unit","")})
            r = push_data(pts)
            status = r.get("status","err")
            print(f"  {dev['device']}: {pts[0]['point']}={pts[0]['value']} -> {status}")
        time.sleep(5)

def db_pusher():
    """从 io_server.db 读取事件推送到边缘中枢"""
    db = sqlite3.connect("io_server.db")
    db.row_factory = sqlite3.Row
    events = db.execute("SELECT * FROM events").fetchall()
    points = []
    for e in events:
        points.append({"device": e["device_id"], "point": e["parameter"], "value": e["value"], "unit": e["unit"]})
    if points:
        r = push_data(points)
        print(f"[bridge] DB push: {len(points)} events -> {r.get('status','err')}")
    db.close()

def status_pusher():
    """推送 IO 服务器状态"""
    import socket
    db = sqlite3.connect("io_server.db")
    srv = db.execute("SELECT * FROM servers WHERE id=1").fetchone()
    procs = db.execute("SELECT COUNT(*) as cnt FROM processes").fetchone()["cnt"]
    db.close()

    pts = [
        {"device": "IO-Server-131", "point": "status", "value": 1, "unit": ""},
        {"device": "IO-Server-131", "point": "processes", "value": procs, "unit": "count"},
        {"device": "Net-53001", "point": "port_status", "value": 1, "unit": ""},
    ]
    r = push_data(pts)
    print(f"[bridge] Status push: {r.get('status','err')}")

if __name__ == "__main__":
    print("=== dgiot_lite → Edge Hub Bridge ===")
    print(f"Hub: {HUB}")
    print(f"Agent: {AGENT}")

    # 先推一次数据库事件和状态
    db_pusher()
    status_pusher()

    # 启动实时推送
    threading.Thread(target=realtime_pusher, daemon=True).start()

    # 验证
    time.sleep(2)
    try:
        health = json.loads(urllib.request.urlopen("http://127.0.0.1:9101/api/hub/health").read())
        agents = json.loads(urllib.request.urlopen("http://127.0.0.1:9101/api/hub/agents").read())
        alerts = json.loads(urllib.request.urlopen("http://127.0.0.1:9101/api/hub/alerts").read())
        print(f"\nHub Status: {health}")
        print(f"Agents: {len(agents.get('agents',[]))}")
        print(f"Alerts: {len(alerts.get('alerts',[]))}")
        print("\nBridge running. Ctrl+C to stop.")
    except Exception as e:
        print(f"Hub check error: {e}")

    try:
        while True: time.sleep(10)
    except KeyboardInterrupt:
        print("Bridge stopped")
