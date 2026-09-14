"""Hub reachability smoke -- broker-level roundtrip only.

This script does NOT test the hub's dlink dispatcher. What it proves is
narrow and worth stating exactly: a client can connect to the broker and
get its own message echoed back through a `dgiot/#` subscription made on
that same broker. That is a transport check.

Why the caveat: `dgiot/smoke/roundtrip` is not a topic the hub routes.
dgiot_mqtt_message.erl has a publish hook with NO topic pattern --
it matches any publish whose CONNECT carried a username header, and
re:replace/4 raises badarg when the clientid or username it substitutes
on is `undefined`. So a probe like this can come back "ok" while the
dispatcher logged an error, and it can log an error while the transport
is perfectly healthy. Read the node's log alongside this result.

Usage:
    DG_HUB_HOST=<host> [DG_HUB_PORT=1883] python scripts/hub_smoke.py

DG_HUB_HOST has no default -- pass it explicitly. It used to be a
hardcoded internal address, which meant this file leaked a site address
into a public repo and only worked on one machine.

ASCII comments only (hub-environment script).
"""
import json
import os
import sys
import time

import paho.mqtt.client as mqtt

HOST = os.environ.get("DG_HUB_HOST", "")
PORT = int(os.environ.get("DG_HUB_PORT", "1883"))
TOPIC = "dgiot/smoke/roundtrip"

got = {}


def _client():
    """Build a client across paho 1.x / 2.x.

    The two majors disagree on the first positional argument
    (client_id in 1.x, callback_api_version in 2.x), so the old
    `Client(VERSION2 if hasattr(...) else None)` trick passed the wrong
    thing to whichever major it was not written for. Pass nothing
    positionally and set callbacks by attribute -- that works on both.
    """
    try:                      # paho 2.x
        return mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
    except AttributeError:    # paho 1.x
        return mqtt.Client()


def on_connect(c, u, f, rc, props=None):
    print("connect rc:", rc)
    c.subscribe("dgiot/#", qos=0)


def on_message(c, u, m):
    got[m.topic] = m.payload.decode("utf-8", "replace")
    print("recv:", m.topic, got[m.topic][:80])


def main():
    if not HOST:
        print("SMOKE-SKIP: DG_HUB_HOST not set")
        print("  e.g.  DG_HUB_HOST=<hub-host> python scripts/hub_smoke.py")
        return 2
    c = _client()
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
        print("SMOKE-OK: broker reached and echoed on our own dgiot/# subscription")
        print("  (transport only -- says nothing about whether the hub routed it)")
        return 0
    print("SMOKE-FAIL: no echo received")
    return 1


if __name__ == "__main__":
    sys.exit(main())
