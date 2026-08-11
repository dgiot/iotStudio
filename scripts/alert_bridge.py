#!/usr/bin/env python3
"""MQTT Alert → Cloud Alarm DB bridge. Subscribes to hub alerts, POSTs to cloud API."""
import paho.mqtt.client as mqtt
import json, time, requests, sys, os

MQTT_HOST = os.getenv("MQTT_HOST", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
CLOUD_API = os.getenv("CLOUD_API", "http://dev.dgiotcloud.cn:5180/api")
ALERT_TOPIC = "dgiot/default/gw_131/ch_edge_hub/alarms"

count = 0

def on_connect(client, userdata, flags, rc, props=None):
    print(f"[BRIDGE] Connected to EMQX, subscribing {ALERT_TOPIC}")
    client.subscribe(ALERT_TOPIC)
    client.subscribe("dgiot/+/+/+/alarms")

def on_message(client, userdata, msg):
    global count
    try:
        data = json.loads(msg.payload)
        device_id = data.get("device", "unknown")
        point = data.get("point", "unknown")
        value = data.get("value", 0)
        msg_text = data.get("msg", f"{point} alert")

        # POST to cloud alarm API
        alarm = {
            "objectId": f"alarm_mqtt_{int(time.time())}_{count}",
            "alarm_id": f"mqtt_{int(time.time())}_{count}",
            "device_id": device_id,
            "severity": "warning",
            "alarm_msg": f"{msg_text}: {value}",
            "message": msg_text,
            "status": "active",
            "alarm_type": point,
        }

        try:
            r = requests.post(f"{CLOUD_API}/classes/Alarm", json=alarm, timeout=3)
            if r.status_code in (200, 201):
                count += 1
                print(f"[BRIDGE] Alarm #{count}: {device_id} {msg_text}={value}")
            else:
                print(f"[BRIDGE] API error: {r.status_code}")
        except requests.exceptions.RequestException:
            print(f"[BRIDGE] Cloud unreachable, skipping post")
    except Exception as e:
        print(f"[BRIDGE] Error: {e}")

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="alert_bridge")
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(MQTT_HOST, MQTT_PORT, 60)
    except Exception as e:
        print(f"[FATAL] {e}")
        return 1

    client.loop_start()
    print(f"[BRIDGE] Forwarding MQTT alerts → {CLOUD_API}")
    print("[BRIDGE] Ctrl+C to stop")

    try:
        while True:
            time.sleep(10)
            sys.stdout.write(f"\r[BRIDGE] {count} alerts forwarded  ")
            sys.stdout.flush()
    except KeyboardInterrupt:
        pass
    finally:
        client.loop_stop()
        client.disconnect()
        print(f"\n[BRIDGE] Stopped. {count} alerts forwarded.")

if __name__ == "__main__":
    main()
