#!/usr/bin/env python3
"""P2 ABAC live test against the running hub (1883) via the PDP-backed ACL.

phase1 (baseline, siteB=restricted):
  - operator 'operator-1': siteA granted, siteB refused (0x80)  [acceptance 1]
  - device 'dev-siteA-d1': own-topic publish delivered to edge-hub;
    cross-site and foreign-device publishes dropped by PDP
phase2 (after policy flip siteB=public via hot reload, NO broker restart):
  - fresh operator 'operator-2': siteB subscription now GRANTED
  - 'dev-siteB-d2' publishes own siteB topic -> operator-2 receives it

KNOWN STATE - phase1 fails one line against a hub that has already run phase2
---------------------------------------------------------------------------
The two phases chained: phase2's whole point is to flip siteB, and it is the
last thing that touches the policy. So a hub that has run phase2 carries
markings.sites.siteB = "public", while phase1's precondition is
siteB = "restricted". Running phase1 against such a hub reports:

    [FAIL] operator siteB refused (got 1)

That is a state mismatch, not a defect - the PDP granted exactly what the
deployed policy says to grant. The seed (hub_abac/abac_policies.seed.json) is
still the phase1 policy; only the deployed copy has drifted. The other four
phase1 lines pass either way.

To re-run phase1, restore the policy first: re-run the installer in
hub_abac/, or set markings.sites.siteB back to "restricted" on the hub and let
the PDP hot-reload it (no broker restart - that is the point of phase2).

Deliberately NOT "fixed" here. Flipping the deployed policy back would make
phase1 green but would silently undo a phase2 acceptance run that was already
performed and logged. A test that rewrites the system under test to make
itself pass is worse than one that reports honestly. Do not add a "reset to
seed" step to this file without deciding, out loud, that the deployed state
is disposable.
"""
import sys
import threading
import time

import paho.mqtt.client as mqtt

HOST, PORT = "127.0.0.1", 1883


class Client:
    def __init__(self, cid):
        self.cid = cid
        self.messages = []
        self.subacks = {}
        self._ev = threading.Event()
        c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, client_id=cid,
                        clean_session=True)
        c.username_pw_set("anonymous", "lab")
        c.on_message = lambda _c, _u, m: self._on_msg(m)
        c.on_subscribe = lambda _c, _u, mid, qos: self._on_sub(mid, qos)
        self.c = c
        c.connect(HOST, PORT, keepalive=30)
        c.loop_start()

    def _on_msg(self, m):
        self.messages.append((m.topic, m.payload.decode(errors="replace")))
        self._ev.set()

    def _on_sub(self, mid, qos_list):
        # mid->topics recorded in subscribe(); granted qos 128 = refused
        for t, q in zip(self._mids.get(mid, []), qos_list):
            self.subacks[t] = q
        self._ev.set()

    _mids = {}

    def subscribe(self, topics):
        self._mids = {}
        for t in topics:
            _r, mid = self.c.subscribe(t, qos=1)
            self._mids[mid] = [t]

    def wait_subacks(self, topics, timeout=10):
        deadline = time.time() + timeout
        while time.time() < deadline and not all(t in self.subacks for t in topics):
            time.sleep(0.1)
        return {t: self.subacks.get(t) for t in topics}

    def publish(self, topic, payload):
        self.c.publish(topic, payload, qos=1).wait_for_publish(timeout=5)

    def wait_messages(self, pred=None, timeout=5.0):
        self._ev.wait(timeout)
        self._ev.clear()
        return [m for m in self.messages
                if pred is None or pred(m[0])]

    def stop(self):
        self.c.disconnect()
        self.c.loop_stop()


def phase1():
    ok = True
    edge = Client("edge-hub-1")
    edge.subscribe(["dgiot/#"])
    time.sleep(0.8)

    op = Client("operator-1")
    op.subscribe(["dgiot/siteA/#", "dgiot/siteB/#"])
    g = op.wait_subacks(["dgiot/siteA/#", "dgiot/siteB/#"])
    a, b = g["dgiot/siteA/#"], g["dgiot/siteB/#"]
    print(f"[{'PASS' if a == 1 else 'FAIL'}] operator siteA granted (qos={a})")
    print(f"[{'PASS' if b == 128 else 'FAIL'}] operator siteB refused "
          f"(got {b}) - marking restricted > clearance internal")
    ok &= (a == 1 and b == 128)
    op.stop()

    dev = Client("dev-siteA-d1")
    time.sleep(0.5)
    n0 = len([1 for t, _ in edge.messages if "siteA/gw1/dev-siteA-d1" in t])
    dev.publish("dgiot/siteA/gw1/dev-siteA-d1/pt1/data", '{"v":1}')
    time.sleep(2.0)
    n1 = len([1 for t, _ in edge.messages if "siteA/gw1/dev-siteA-d1" in t])
    print(f"[{'PASS' if n1 > n0 else 'FAIL'}] device own-topic publish delivered")
    ok &= n1 > n0

    dev.publish("dgiot/siteB/gw9/dev-siteA-d1/pt1/data", '{"v":2}')
    time.sleep(2.0)
    n2 = len([1 for t, _ in edge.messages if "siteB/gw9/dev-siteA-d1" in t])
    print(f"[{'PASS' if n2 == 0 else 'FAIL'}] cross-site publish dropped")
    ok &= n2 == 0

    dev.publish("dgiot/siteA/gw1/dev-siteA-d2/pt1/data", '{"v":3}')
    time.sleep(2.0)
    n3 = len([1 for t, _ in edge.messages if "dev-siteA-d2" in t])
    print(f"[{'PASS' if n3 == 0 else 'FAIL'}] foreign-device publish dropped")
    ok &= n3 == 0

    dev.stop()
    edge.stop()
    print("PHASE1", "PASS" if ok else "FAIL")
    return 0 if ok else 1


def phase2():
    ok = True
    op = Client("operator-2")
    op.subscribe(["dgiot/siteB/#"])
    g = op.wait_subacks(["dgiot/siteB/#"])
    b = g["dgiot/siteB/#"]
    print(f"[{'PASS' if b == 1 else 'FAIL'}] operator siteB now GRANTED "
          f"(got {b}) - policy hot-reload, broker untouched")
    ok &= (b == 1)

    dev = Client("dev-siteB-d2")
    time.sleep(0.5)
    dev.publish("dgiot/siteB/gw9/dev-siteB-d2/pt1/data", '{"v":9}')
    got = op.wait_messages(lambda t: "dev-siteB-d2" in t, timeout=5.0)
    print(f"[{'PASS' if got else 'FAIL'}] siteB message delivered to "
          f"re-granted operator")
    ok &= bool(got)

    dev.stop()
    op.stop()
    print("PHASE2", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(phase1() if "phase2" not in sys.argv else phase2())
