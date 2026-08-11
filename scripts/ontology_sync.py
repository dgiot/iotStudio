#!/usr/bin/env python3
"""Product Ontology → MQTT Sync. Frontend products → Erlang hub."""
import paho.mqtt.client as mqtt
import json, time, sys

HOST = "127.0.0.1"
PORT = 1883

# Products from frontend (11 types)
products = [
    ("prod_oil_well_pump", "抽油机井", "oil_well", [
        ("oil_pressure","oil_pressure","float","MPa"), ("temperature","temperature","float","degC"),
        ("motor_current","motor_current","float","A"), ("motor_power","motor_power","float","kW"),
        ("flow_rate","flow_rate","float","m3/d"), ("vibration","vibration","float","mm/s"),
        ("runtime","runtime","int32","h"), ("efficiency","efficiency","float","%"),
    ]),
    ("prod_oil_well_screw", "螺杆泵井", "oil_well", [
        ("oil_pressure","oil_pressure","float","MPa"), ("rotor_speed","rotor_speed","float","rpm"),
    ]),
    ("prod_oil_well_esp", "电泵井", "oil_well", [
        ("oil_pressure","oil_pressure","float","MPa"), ("motor_current","motor_current","float","A"),
    ]),
    ("prod_water_inj", "注水井", "water_injection", [
        ("water_pressure","water_pressure","float","MPa"), ("flow_rate","flow_rate","float","m3/h"),
    ]),
    ("prod_rtu", "RTU终端", "rtu", [("signal", "signal", "int16", "dBm")]),
    ("prod_dcs", "DCS控制站", "dcs", [("status", "status", "int16", "")]),
    ("prod_relay_dsl31a", "DSL-31A 断路器", "relay", [
        ("Ia","Ia","float","A"), ("Ib","Ib","float","A"), ("Ic","Ic","float","A"),
    ]),
    ("prod_relay_dst31a", "DST-31A 变压器差动", "relay", [
        ("diff_current","diff_current","float","A"),
    ]),
    ("prod_compressor", "压缩机", "compressor", [
        ("vibration","vibration","float","mm/s"), ("temperature","temperature","float","degC"),
    ]),
    ("prod_pipeline", "集输管线", "pipeline", [
        ("pressure","pressure","float","MPa"), ("flow_rate","flow_rate","float","m3/d"),
    ]),
    ("prod_dewater", "脱水站", "dewater", [("water_content","water_content","float","%")]),
]

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="ontology_sync")
    client.connect(HOST, PORT, 60)
    client.loop_start()
    time.sleep(0.5)

    t = int(time.time())
    for pid, name, devtype, points in products:
        # Product registration
        client.publish(f"dgiot/default/gw_131/ch_edge_hub/{pid}/meta",
            json.dumps({"type": "product_registered", "objectId": pid, "name": name,
                        "devType": devtype, "pointCount": len(points), "ts": t}), qos=1)

        # Ontology: Site→Gateway→Channel→Device→Point
        site = "oil_field_01"
        gw = "gw_131"
        ch = f"ch_{devtype}_01"

        ontology = {
            "type": "ontology_sync",
            "site": site, "gateway": gw, "channel": ch,
            "product_id": pid, "device_type": devtype,
            "points": [{"id": f"pt_{pid}_{ptid}", "name": n, "dataType": dt, "unit": u}
                       for ptid, n, dt, u in points],
            "ts": t
        }
        client.publish(f"dgiot/{site}/{gw}/{ch}/{pid}/ontology",
            json.dumps(ontology), qos=1)
        print(f"[SYNC] {pid}: {name} ({devtype}) - {len(points)} points")

    client.loop_stop()
    client.disconnect()
    print(f"\n[OK] {len(products)} products synced to hub via MQTT")

if __name__ == "__main__":
    main()
