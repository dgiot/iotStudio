#!/usr/bin/env python3
"""P4 acceptance demo: ten lines from import to live device data.

Run against a live hub (lab defaults shown; override via env):
    python3 sdk/examples/ten_lines.py

Catalog read needs the hub-side role seed once (scripts/hub_bridge/
seed_roles.py); the MQTT half works on any hub.
"""
import os

from iotstudio_sdk import IotStudio, Subscriber

base = os.environ.get("STUDIO_URL", "http://127.0.0.1:5080")
c = IotStudio(base_url=base,
              username=os.environ.get("STUDIO_USER", "admin"),
              password=os.environ.get("STUDIO_PASS", ""))
s = Subscriber(host=os.environ.get("MQTT_HOST", "127.0.0.1"))
s.subscribe("dgiot/#", lambda t, m: print("[live]", t, m))
s.start()
cat = c.products(limit=3, keys=["name", "objectId"])["results"]
print("[catalog]", [p["name"] for p in cat])
print("[devices]", len(c.devices(limit=5, keys=["name"])["results"]), "rows")
s.wait()
