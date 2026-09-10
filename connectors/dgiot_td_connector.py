#!/usr/bin/env python3
"""Doctrine-chain connector (Level-3 decoupling): dgiot/# MQTT -> TDengine REST.

The broker-agnostic half of the doctrine main chain:

    device --(dgiot/{site}/{gateway}/{device}/{point}/data)--> EMQX
        --(PDP-governed ACL)--> this connector --REST--> TDengine

Runs inside WSL next to the hub broker (:1883) and TDengine taosadapter
(:6041). Subscribes the whole doctrine namespace, writes one TDengine
child table per (site, device, point) under a single stable. Payload is
stored as a numeric value when it carries one, plus the raw JSON for
auditability. Malformed topics are counted, never crash the loop.

Env:
  CONN_MQTT_HOST (127.0.0.1)  CONN_MQTT_PORT (1883)
  CONN_TD_URL    (http://127.0.0.1:6041)
  CONN_TD_DB     (iotstudio)  CONN_TD_USER (root)  CONN_TD_PASS (taosdata)
  CONN_CLIENT_ID (edge-hub-td - matches the edge-hub* PDP subject glob)
  CONN_LOG       (log file path when run under nohup)
"""
import json
import os
import re
import sys
import time
import urllib.request
import base64

import paho.mqtt.client as mqtt

MQTT_HOST = os.environ.get("CONN_MQTT_HOST", "127.0.0.1")
MQTT_PORT = int(os.environ.get("CONN_MQTT_PORT", "1883"))
TD_URL = os.environ.get("CONN_TD_URL", "http://127.0.0.1:6041").rstrip("/")
TD_DB = os.environ.get("CONN_TD_DB", "iotstudio")
TD_USER = os.environ.get("CONN_TD_USER", "root")
TD_PASS = os.environ.get("CONN_TD_PASS", "taosdata")
CLIENT_ID = os.environ.get("CONN_CLIENT_ID", "edge-hub-td")

TOPIC_RE = re.compile(r"^dgiot/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/"
                      r"([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/data$")
SAFE = re.compile(r"[^A-Za-z0-9_]")

stats = {"ok": 0, "bad_topic": 0, "td_fail": 0, "reconnects": 0}


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def td_sql(sql):
    """One TDengine REST statement, single retry on transient failure."""
    req = urllib.request.Request(
        f"{TD_URL}/rest/sql", data=sql.encode("utf-8"), method="POST")
    token = base64.b64encode(f"{TD_USER}:{TD_PASS}".encode()).decode()
    req.add_header("Authorization", f"Basic {token}")
    last = None
    for _ in range(2):
        try:
            with urllib.request.urlopen(req, timeout=4) as r:
                body = json.loads(r.read().decode("utf-8"))
                if body.get("code") == 0:
                    return body
                last = body
        except Exception as e:  # noqa: BLE001 - connector must survive all
            last = {"code": -1, "desc": str(e)}
        time.sleep(0.4)
    raise RuntimeError(f"tdengine sql failed: {last}")


def ensure_schema():
    td_sql(f"CREATE DATABASE IF NOT EXISTS {TD_DB}")
    td_sql(
        f"CREATE STABLE IF NOT EXISTS {TD_DB}.data "
        f"(ts TIMESTAMP, val DOUBLE, raw NCHAR(400)) "
        f"TAGS (site BINARY(32), gateway BINARY(32), "
        f"device BINARY(32), point BINARY(32))")
    log(f"schema ok: db={TD_DB} stable=data")


def on_connect(_c, _u, _f, rc, _props=None):
    stats["reconnects"] += 1
    log(f"connect rc={rc}, subscribing dgiot/#")
    _c.subscribe("dgiot/#", qos=1)


def _val(payload):
    """Numeric value: payload.v or payload.value when numeric, else 0.0."""
    val = payload.get("v", payload.get("value"))
    return float(val) if isinstance(val, (int, float)) else 0.0


def on_message(_c, _u, m):
    mm = TOPIC_RE.match(m.topic)
    if not mm:
        stats["bad_topic"] += 1
        return
    site, gateway, device, point = (SAFE.sub("_", g)[:30] for g in mm.groups())
    try:
        payload = json.loads(m.payload.decode("utf-8", errors="replace"))
    except ValueError:
        payload = {"raw": m.payload.decode("utf-8", errors="replace")[:200]}
    val = _val(payload)
    ts = payload.get("ts")
    ts_ms = int(ts) if isinstance(ts, (int, float)) else int(time.time() * 1000)
    raw = json.dumps(payload, ensure_ascii=False)[:390].replace("'", "\\'")
    table = f"d_{site}_{device}_{point}"
    sql = (f"INSERT INTO {TD_DB}.{table} USING {TD_DB}.data "
           f"TAGS ('{site}', '{gateway}', '{device}', '{point}') "
           f"VALUES ({ts_ms}, {val}, '{raw}')")
    try:
        td_sql(sql)
        stats["ok"] += 1
    except RuntimeError as e:
        stats["td_fail"] += 1
        log(f"write fail {m.topic}: {e}")
    if stats["ok"] % 20 == 0:
        log(f"stats {stats}")


def main():
    ensure_schema()
    c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1,
                    client_id=CLIENT_ID, clean_session=False)
    c.username_pw_set("anonymous", "connector")
    c.on_connect = on_connect
    c.on_message = on_message
    # reconnect loop is built into paho; loop_forever retries forever
    c.connect(MQTT_HOST, MQTT_PORT, keepalive=30)
    log(f"connector up: {MQTT_HOST}:{MQTT_PORT} -> {TD_URL} db={TD_DB}")
    c.loop_forever(retry_first_connection=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
