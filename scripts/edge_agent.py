#!/usr/bin/env python3
"""Edge Agent - 24/7 telemetry to Hub"""
import paho.mqtt.client as mqtt
import json, time, random, math, sys, os

HOST = os.getenv("MQTT_HOST", "127.0.0.1")
PORT = int(os.getenv("MQTT_PORT", "1883"))
INTERVAL = float(os.getenv("INTERVAL", "2"))
TENANT = "default"
GATEWAY = "gw_131"
CHANNEL = "ch_edge_hub"

devices = [
    ("CY1C8K-001", "prod_oil_well_pump", [
        ("oil_pressure", 2.35, 0.3, "MPa"),
        ("temperature", 48.2, 5.0, "degC"),
        ("motor_current", 22.1, 3.0, "A"),
    ]),
    ("CY1C8K-002", "prod_oil_well_pump", [
        ("oil_pressure", 2.41, 0.25, "MPa"),
        ("temperature", 47.8, 4.5, "degC"),
        ("motor_current", 23.5, 2.8, "A"),
    ]),
    ("B1V361V631", "prod_oil_well_pump", [
        ("motor_current", 18.5, 2.0, "A"),
        ("vibration", 0.8, 0.3, "mm/s"),
    ]),
    ("RTU-112", "prod_rtu", [
        ("signal_strength", -65, 10, "dBm"),
        ("battery", 85, 5, "%"),
    ]),
]

stats = {"edge_pub": 0, "hub_recv": 0, "start": time.time()}

def on_connect(client, userdata, flags, rc, props=None):
    print(f"[EDGE] Connected to {HOST}:{PORT}")
    client.subscribe(f"dgiot/{TENANT}/{GATEWAY}/+/+/command")
    client.subscribe("$dg/things/+/shadow/desired")
    client.subscribe("$dg/things/+/shadow/delta")

def on_message(client, userdata, msg):
    stats["hub_recv"] += 1
    payload = msg.payload.decode(errors="replace")[:80]
    print(f"[HUB] {msg.topic} -> {payload}")

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(HOST, PORT, 60)
    except Exception as e:
        print(f"[FATAL] {e}")
        return 1

    client.loop_start()
    time.sleep(1)

    print(f"[EDGE] Publishing {len(devices)} devices every {INTERVAL}s...")
    t0 = time.time()

    try:
        while True:
            t = int(time.time() * 1000)
            for dev_id, prod_id, points in devices:
                for pt_id, base, amp, unit in points:
                    val = round(base + amp * math.sin(t/10000 + hash(dev_id+pt_id)%100), 2)

                    # Edge telemetry
                    client.publish(
                        f"dgiot/{TENANT}/{GATEWAY}/{CHANNEL}/{dev_id}/{pt_id}",
                        json.dumps({"ts": t, "value": val, "unit": unit, "quality": 192}),
                        qos=1)
                    stats["edge_pub"] += 1

                    # Hub thing-model
                    client.publish(
                        f"$dg/thing/{prod_id}/{dev_id}/properties/report",
                        json.dumps({"ts": t, "properties": {pt_id: {"value": val, "time": t}}}),
                        qos=1)
                    stats["edge_pub"] += 1

                # Shadow reported
                client.publish(
                    f"$dg/things/{dev_id}/shadow/reported",
                    json.dumps({"reported": {pt_id: round(base, 2) for pt_id, base, _, _ in points},
                               "version": int(time.time() - t0)}),
                    qos=1)
                stats["edge_pub"] += 1

            elapsed = int(time.time() - stats["start"])
            rate = stats["edge_pub"] / max(elapsed, 1)
            sys.stdout.write(f"\r[{elapsed}s] pub={stats['edge_pub']} ({rate:.1f}/s) recv={stats['hub_recv']}  ")
            sys.stdout.flush()
            time.sleep(INTERVAL)

    except KeyboardInterrupt:
        pass
    finally:
        client.loop_stop()
        client.disconnect()

    elapsed = int(time.time() - stats["start"])
    print(f"\n\n[EDGE] Stopped. {stats['edge_pub']} msgs in {elapsed}s")
    return 0

if __name__ == "__main__":
    sys.exit(main())
