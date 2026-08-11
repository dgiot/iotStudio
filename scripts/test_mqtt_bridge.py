#!/usr/bin/env python3
"""Edge Agent <-> Hub MQTT Integration Test"""
import json, time, sys, os

try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("pip install paho-mqtt first")
    sys.exit(1)

MQTT_HOST = os.getenv("MQTT_HOST", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
TENANT = "default"
GATEWAY = "gw_131"
stats = {"pub": 0, "recv": 0}

def on_connect(client, userdata, flags, rc, properties=None):
    print(f"[OK] Connected to {MQTT_HOST}:{MQTT_PORT} rc={rc}")
    client.subscribe(f"dgiot/{TENANT}/{GATEWAY}/+/+/command")
    client.subscribe("$dg/things/+/shadow/desired")

def on_message(client, userdata, msg):
    stats["recv"] += 1
    print(f"[RECV] {msg.topic}: {msg.payload.decode(errors='replace')[:100]}")

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=f"edge_test_{int(time.time())}")
    client.on_connect = on_connect
    client.on_message = on_message

    print(f"=== Edge-Hub MQTT Test ===")
    print(f"Target: {MQTT_HOST}:{MQTT_PORT}")

    try:
        client.connect(MQTT_HOST, MQTT_PORT, 60)
    except Exception as e:
        print(f"[FAIL] Connect error: {e}")
        return 1

    client.loop_start()
    time.sleep(1)

    devices = [
        ("CY1C8K-001", "oil_pressure", 2.35, "MPa"),
        ("CY1C8K-001", "temperature", 48.2, "degC"),
        ("CY1C8K-001", "motor_current", 22.1, "A"),
        ("RTU-112", "signal_strength", -65, "dBm"),
    ]

    print("Publishing... (Ctrl+C to stop)")
    try:
        for i in range(20):
            t = time.time()
            for dev, point, base, unit in devices:
                value = round(base + (0.1 * (i % 5)), 2)
                client.publish(
                    f"dgiot/{TENANT}/{GATEWAY}/ch_edge_hub/{dev}/{point}",
                    json.dumps({"ts": t, "value": value, "unit": unit, "quality": 192}),
                    qos=1)
                stats["pub"] += 1

            client.publish(
                f"dgiot/{TENANT}/{GATEWAY}/ch_edge_hub/CY1C8K-001/meta",
                json.dumps({"type": "device_saved", "devaddr": "CY1C8K-001", "status": "online"}),
                qos=1)
            stats["pub"] += 1

            client.publish(
                "$dg/things/CY1C8K-001/shadow/reported",
                json.dumps({"reported": {"oil_pressure": 2.35, "temperature": 48.2, "status": "online"}, "version": i+1}),
                qos=1)
            stats["pub"] += 1

            sys.stdout.write(f"\r  pub={stats['pub']} recv={stats['recv']}")
            sys.stdout.flush()
            time.sleep(2)
    except KeyboardInterrupt:
        pass
    finally:
        client.loop_stop()
        client.disconnect()

    print(f"\n\nResult: pub={stats['pub']} recv={stats['recv']}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
