#!/usr/bin/env python3
"""dgiot hub device simulator - two topic styles (edge side).

style=dlink (default): dgiot product credentials path. Connects to the
DG-IoT hub MQTT (1883) with (username=ProductId, clientid=DevAddr,
password=productSecret) and reports on the native dlink topic
$dg/thing/{ProductId}/{DevAddr}/properties/report.

style=doctrine: the Level-3 decoupled doctrine chain. Connects as an
anonymous lab device whose clientid carries the doctrine identity
(dev-{site}-{device}), and publishes on the doctrine grammar
dgiot/{site}/{gateway}/{device}/{point}/data - governed by the P2 ABAC
PDP on the broker's client.check_acl face.

Usage:
  python simulators/dgiot_hub_sim.py --product 1893e1feb3 \
      --devaddr 192.168.100.23_1234 --secret TTYxNTE3 \
      --count 3 --interval 1.0 [--host 127.0.0.1] [--port 1883]
  python simulators/dgiot_hub_sim.py --style doctrine \
      --site siteA --gateway gw1 --device dev-siteA-d1 --point pt1 \
      --count 5 --interval 0.5

Payload carries deterministic values so TDengine rows can be verified.
"""
import argparse
import json
import time

import paho.mqtt.client as mqtt


def _connect(c, a):
    """Blocking connect; returns CONNACK rc (None on timeout)."""
    auth = {"rc": None}

    def on_connect(_c, _u, _f, rc, _p=None):
        auth["rc"] = rc

    c.on_connect = on_connect
    c.connect(a.host, a.port, keepalive=30)
    c.loop_start()
    for _ in range(50):
        if auth["rc"] is not None:
            break
        time.sleep(0.1)
    return auth["rc"]


def run_dlink(a):
    c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1,
                    client_id=a.devaddr, clean_session=True)
    c.username_pw_set(a.product, a.secret)
    rc = _connect(c, a)
    print(f"[sim] connect rc={rc} (0=accepted)", flush=True)
    if rc != 0:
        return 1

    topic = f"$dg/thing/{a.product}/{a.devaddr}/properties/report"
    for i in range(a.count):
        # flat payload: dgiot parse_payload maps dis keys literally
        # (nested_map does NOT resolve dotted paths)
        payload = {
            "sim_counter": i + 1,
            "sim_value": round(20.0 + i * 0.5, 2),
        }
        info = c.publish(topic, json.dumps(payload), qos=1)
        info.wait_for_publish(timeout=5)
        print(f"[sim] report {i + 1}/{a.count} -> {topic} rc={info.rc}",
              flush=True)
        time.sleep(a.interval)

    c.loop_stop()
    c.disconnect()
    print("[sim] done", flush=True)
    return 0


def run_doctrine(a):
    cid = a.device or f"dev-{a.site}-{a.gateway}"
    c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1,
                    client_id=cid, clean_session=True)
    c.username_pw_set("anonymous", "lab")
    rc = _connect(c, a)
    print(f"[sim] connect rc={rc} (0=accepted)", flush=True)
    if rc != 0:
        return 1

    topic = f"dgiot/{a.site}/{a.gateway}/{cid}/{a.point}/data"
    ok = 0
    for i in range(a.count):
        payload = {"v": round(20.0 + i * 0.5, 2),
                   "seq": i + 1, "ts": int(time.time() * 1000)}
        info = c.publish(topic, json.dumps(payload), qos=1)
        info.wait_for_publish(timeout=5)
        ok += info.rc == 0
        print(f"[sim] report {i + 1}/{a.count} -> {topic} rc={info.rc}",
              flush=True)
        time.sleep(a.interval)

    c.loop_stop()
    c.disconnect()
    print(f"[sim] done ({ok}/{a.count} pubacked)", flush=True)
    return 0 if ok == a.count else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=1883)
    ap.add_argument("--style", choices=["dlink", "doctrine"], default="dlink")
    ap.add_argument("--product", default=None, help="ProductId (10-char)")
    ap.add_argument("--devaddr", default=None)
    ap.add_argument("--secret", default=None, help="productSecret")
    ap.add_argument("--site", default="siteA")
    ap.add_argument("--gateway", default="gw1")
    ap.add_argument("--device", default=None,
                    help="doctrine device id (clientid; default "
                         "dev-{site}-{gateway})")
    ap.add_argument("--point", default="pt1")
    ap.add_argument("--count", type=int, default=3)
    ap.add_argument("--interval", type=float, default=1.0)
    a = ap.parse_args()
    if a.style == "doctrine":
        return run_doctrine(a)
    if not (a.product and a.devaddr and a.secret):
        print("[sim] dlink style needs --product --devaddr --secret")
        return 2
    return run_dlink(a)


if __name__ == "__main__":
    raise SystemExit(main())
