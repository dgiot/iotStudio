#!/usr/bin/env python3
"""端到端验证：模拟采集 → 边缘代理 → 入库 → MQTT → 边缘中枢"""
import socket, struct, time, json, urllib.request, sqlite3

print("=" * 55)
print("  全链路验证")
print("=" * 55)

pushed = 0

# 1. Modbus 采集 + push 边缘代理
print("\n[1] Modbus → 边缘代理 :8000")
for cycle in range(2):
    s = socket.socket(); s.settimeout(3); s.connect(('127.0.0.1', 502))
    s.send(struct.pack('>HHH', cycle+1, 0, 6) + bytes([1, 3, 0, 0, 0, 4]))
    resp = s.recv(256); s.close()
    vals = [struct.unpack('>H', resp[9+i*2:11+i*2])[0] for i in range(4)]
    for i, tag in enumerate(['Ia','Ib','Ua','P']):
        body = json.dumps({"device":"test_modbus","point":tag,
            "value":round(vals[i]*(170/8192 if i<3 else 1),4),
            "unit":["A","A","V","W"][i],"ts":time.time()}).encode()
        try:
            urllib.request.urlopen(urllib.request.Request(
                "http://127.0.0.1:8000/api/telemetry", data=body,
                headers={"Content-Type":"application/json"}, method="POST"), timeout=3)
            pushed += 1
        except: pass
print(f"  Pushed: {pushed} telemetry points")

# 2. 检查入库
print("\n[2] telemetry.db")
try:
    db = sqlite3.connect('D:/ai/dgiot_lite/data/telemetry.db')
    cnt = db.execute("SELECT COUNT(*) FROM telemetry").fetchone()[0]
    rows = db.execute("SELECT device_id,point_name,value,ts FROM telemetry ORDER BY ts DESC LIMIT 3").fetchall()
    print(f"  Total: {cnt} rows")
    for r in rows: print(f"    {r[0]}/{r[1]} = {r[2]} @ {r[3]}")
    db.close()
except Exception as e:
    print(f"  {e}")

# 3. MQTT → 边缘中枢
print("\n[3] MQTT → 边缘中枢")
try:
    import paho.mqtt.client as mqtt
    c = mqtt.Client(client_id='sim'); c.connect('127.0.0.1', 1883, 10)
    topic = "dgiot/default/gw_131/ch_edge_hub/test_modbus/Ia"
    payload = json.dumps({"value": 62.7, "unit": "A", "ts": time.time()})
    c.publish(topic, payload); c.disconnect()
    print(f"  Published: {topic}")
except ImportError:
    print("  paho-mqtt 未安装")
except Exception as e:
    print(f"  MQTT: {e}")

# 4. OPC 采集 + push
print("\n[4] OPC DA → 边缘代理")
for dev_id in ['02204060100', '02105100097']:
    s = socket.socket(); s.settimeout(3); s.connect(('127.0.0.1', 13500))
    items = f'{dev_id}.Ia;{dev_id}.Ua'
    s.send(struct.pack('>HH', len(items)+4, 0x0001) + items.encode())
    resp = s.recv(512); s.close()
    for pair in resp[4:].decode().split(';'):
        if '=' in pair:
            k, v = pair.split('=')
            body = json.dumps({"device":dev_id,"point":k.split('.')[-1],
                "value":float(v),"ts":time.time()}).encode()
            try:
                urllib.request.urlopen(urllib.request.Request(
                    "http://127.0.0.1:8000/api/telemetry", data=body,
                    headers={"Content-Type":"application/json"}, method="POST"), timeout=3)
            except: pass
print(f"  Pushed: OPC data")

print(f"\n{'='*55}")
print(f"  全链路: 模拟器 → 边缘代理 :8000 → telemetry.db → MQTT")
print(f"  http://localhost:8000 — 前端查看设备")
print(f"{'='*55}")
