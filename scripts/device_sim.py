#!/usr/bin/env python3
"""Device Simulator - uses synced ontology to generate realistic telemetry"""
import paho.mqtt.client as mqtt
import json, time, random, math, sys

HOST, PORT = "127.0.0.1", 1883
TENANT, GW, CH = "default", "gw_131", "ch_edge_hub"

# Device definitions from synced ontology
devices = {
    "CY1C8K-001": ("prod_oil_well_pump", [
        ("oil_pressure", 2.35, 0.3, 2, "MPa"),
        ("temperature", 48.2, 5.0, 1, "degC"),
        ("motor_current", 22.1, 3.0, 1, "A"),
        ("motor_power", 12.5, 2.0, 1, "kW"),
    ]),
    "CY1C8K-002": ("prod_oil_well_pump", [
        ("oil_pressure", 2.41, 0.25, 2, "MPa"),
        ("temperature", 47.8, 4.5, 1, "degC"),
        ("motor_current", 23.5, 2.8, 1, "A"),
    ]),
    "COMP-01": ("prod_compressor", [
        ("vibration", 0.8, 0.3, 2, "mm/s"),
        ("temperature", 72, 8, 1, "degC"),
    ]),
    "RTU-112": ("prod_rtu", [
        ("signal", -65, 10, 0, "dBm"),
    ]),
    "RELAY-DSL-01": ("prod_relay_dsl31a", [
        ("Ia", 120, 15, 1, "A"),
        ("Ib", 118, 14, 1, "A"),
        ("Ic", 122, 16, 1, "A"),
    ]),
    "WATER-001": ("prod_water_inj", [
        ("water_pressure", 5.5, 0.8, 1, "MPa"),
        ("flow_rate", 32, 5, 1, "m3/h"),
    ]),
    "SCREW-01": ("prod_oil_well_screw", [
        ("oil_pressure", 2.1, 0.2, 2, "MPa"),
        ("rotor_speed", 180, 20, 0, "rpm"),
    ]),
}

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="device_sim")
    client.connect(HOST, PORT, 60)
    client.loop_start()
    time.sleep(0.5)

    print(f"Simulating {len(devices)} devices... (Ctrl+C to stop)")
    t0 = time.time()
    count = 0
    try:
        while True:
            t = int(time.time() * 1000)
            for dev_id, (prod_id, points) in devices.items():
                for pt_id, base, amp, prec, unit in points:
                    val = round(base + amp * math.sin(t/10000.0 + hash(dev_id+pt_id)%100), prec)
                    client.publish(
                        f"dgiot/{TENANT}/{GW}/{CH}/{dev_id}/{pt_id}",
                        json.dumps({"ts": t, "value": val, "unit": unit, "quality": 192}), qos=1)
                    count += 1

                # Shadow report
                client.publish(f"$dg/things/{dev_id}/shadow/reported",
                    json.dumps({"reported": {
                        pt_id: round(base + amp * math.sin(t/10000.0 + hash(dev_id+pt_id)%100), prec)
                        for pt_id, base, amp, prec, _ in points
                    }, "version": int(time.time() - t0)}), qos=1)
                count += 1

            elapsed = int(time.time() - t0)
            sys.stdout.write(f"\r[{elapsed}s] {count} msgs ({count/max(elapsed,1):.1f}/s)  ")
            sys.stdout.flush()
            time.sleep(2)

    except KeyboardInterrupt:
        print(f"\nStopped. {count} msgs sent.")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()
