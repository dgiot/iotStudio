#!/usr/bin/env python3
"""dgiot_lite -> dgaiot MQTT Bridge v2

Topic:  dgiot/{site}/{gateway}/{device}/{point}/data
Payload: {ts, v, q}
"""
import json, time, random, sqlite3, threading, sys, os

try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("pip install paho-mqtt")
    sys.exit(1)

# ── Config ──
MQTT_HOST = "127.0.0.1"
MQTT_PORT = 1883
TOPIC_FMT = "dgiot/{site}/{gateway}/{device}/{point}/data"

# ── dgaiot 4-layer ontology ──
SITE = "oil_field_01"
GATEWAY = "gw_131"

# ── IO server devices (from io_ontology.json) ──
DEVICES = [
    {"device": "DEVICE_ID_PLACEHOLDER_WELL-01", "points": [
        {"id": "max_load",    "value": 86.07, "unit": "kN"},
        {"id": "min_load",    "value": 17.30, "unit": "kN"},
    ]},
    {"device": "DEVICE_ID_PLACEHOLDER2_WELL-02", "points": [
        {"id": "max_down_current", "value": 15.28, "unit": "A"},
        {"id": "max_up_current",   "value": 10.69, "unit": "A"},
        {"id": "max_load",         "value": 41.31, "unit": "kN"},
    ]},
    {"device": "well_A1", "points": [
        {"id": "load",    "value": 86.0, "unit": "kN"},
        {"id": "current", "value": 12.0, "unit": "A"},
    ]},
    {"device": "well_B3", "points": [
        {"id": "load",    "value": 75.0, "unit": "kN"},
        {"id": "current", "value": 9.0,  "unit": "A"},
    ]},
    {"device": "well_C7", "points": [
        {"id": "load",    "value": 93.0, "unit": "kN"},
        {"id": "current", "value": 18.0, "unit": "A"},
    ]},
]

# ── MQTT Client ──
client = mqtt.Client(client_id="dgiot_lite_bridge", protocol=mqtt.MQTTv311)
client.connect(MQTT_HOST, MQTT_PORT, 60)
client.loop_start()

def push_point(point_id, device_id, value, quality=192):
    """Push single point via MQTT"""
    topic = TOPIC_FMT.format(site=SITE, gateway=GATEWAY, device=device_id, point=point_id)
    payload = json.dumps({"ts": int(time.time() * 1000), "v": round(value, 2), "q": quality})
    client.publish(topic, payload)
    return topic, payload

def realtime_pusher():
    """Real-time device data push"""
    print(f"[bridge v2] MQTT -> {MQTT_HOST}:{MQTT_PORT}")
    print(f"[bridge v2] Topic: {TOPIC_FMT}")
    print()

    count = 0
    while True:
        for dev in random.sample(DEVICES, min(3, len(DEVICES))):
            for pt in dev["points"]:
                val = round(pt["value"] + random.uniform(-5, 5), 2)
                q = random.choice([192, 192, 192, 192, 0])  # 80% good quality
                topic, _ = push_point(pt["id"], dev["device"], val, q)
                count += 1
                print(f"  [{count:04d}] {topic} -> v={val}{pt['unit']} q={q}")
        time.sleep(5)

def db_pusher():
    """Push from io_server.db events"""
    db_path = os.path.join(os.path.dirname(__file__), "io_server.db")
    if not os.path.exists(db_path):
        print("[bridge] no io_server.db, skip")
        return
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    events = db.execute("SELECT * FROM events").fetchall()
    for e in events:
        push_point(e["parameter"], e["device_id"], e["value"])
    print(f"[bridge] DB push: {len(events)} events")
    db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("  dgiot_lite -> dgaiot MQTT Bridge v2")
    print("=" * 50)
    print(f"  Site: {SITE}  Gateway: {GATEWAY}")
    print()

    db_pusher()
    threading.Thread(target=realtime_pusher, daemon=True).start()

    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n  Bridge stopped")
        client.loop_stop()
        client.disconnect()
