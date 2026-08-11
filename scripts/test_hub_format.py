#!/usr/bin/env python3
"""Push in hub format: $dg/thing/{pid}/{dev}/properties/report"""
import json, time, sys
import paho.mqtt.client as mqtt

MQTT_HOST = "127.0.0.1"
MQTT_PORT = 1883
stats = {"pub": 0}

def on_connect(client, userdata, flags, rc, props=None):
    print(f"[OK] rc={rc}")

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=f"hubfmt_{int(time.time())}")
client.on_connect = on_connect
client.connect(MQTT_HOST, MQTT_PORT, 60)
client.loop_start()
time.sleep(0.5)

print("=== Hub Format Push ===")
for i in range(3):
    t = int(time.time() * 1000)
    for pid, dev in [("prod_oil_well_pump", "CY1C8K-001"), ("prod_oil_well_pump", "CY1C8K-002")]:
        topic = f"$dg/thing/{pid}/{dev}/properties/report"
        payload = json.dumps({"ts": t, "properties": {"oil_pressure": {"value": round(2.2+0.1*i, 2), "time": t}}})
        client.publish(topic, payload, qos=1)
        stats["pub"] += 1
    time.sleep(1)
    sys.stdout.write(f"\r  pub={stats['pub']}")

client.loop_stop()
client.disconnect()
print(f"\nDone: {stats['pub']} msg via $dg/thing/*")
