import json
import sys
import time

import paho.mqtt.client as mqtt

HOST = "172.17.52.221"
PORT = 1883
TOPIC = "dgiot/smoke/roundtrip"

got = {}


def on_connect(c, u, f, rc, props=None):
    print("connect rc:", rc)
    c.subscribe("dgiot/#", qos=0)


def on_message(c, u, m):
    got[m.topic] = m.payload.decode("utf-8", "replace")
    print("recv:", m.topic, got[m.topic][:80])


def main():
    c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2 if hasattr(mqtt, "CallbackAPIVersion") else None)
    c.on_connect = on_connect
    c.on_message = on_message
    c.connect(HOST, PORT, keepalive=30)
    c.loop_start()
    time.sleep(1.5)
    payload = json.dumps({"devaddr": "smoke_dev_001", "ts": int(time.time() * 1000),
                          "data": {"temperature": 26.5, "pressure": 101.3}})
    info = c.publish(TOPIC, payload, qos=0)
    info.wait_for_publish(timeout=5)
    print("published to", TOPIC)
    deadline = time.time() + 6
    while time.time() < deadline and TOPIC not in got:
        time.sleep(0.3)
    c.loop_stop()
    c.disconnect()
    if TOPIC in got:
        print("SMOKE-OK: hub transport roundtrip verified")
        return 0
    print("SMOKE-FAIL: no echo received")
    return 1


if __name__ == "__main__":
    sys.exit(main())
