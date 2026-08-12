#!/usr/bin/env python3
"""模拟边缘中枢 — MQTT 订阅 + 数据展示"""
import time, struct
import paho.mqtt.client as mqtt

received = {"A11": 0, "IEC104": 0, "Modbus": 0, "other": 0}

def on_connect(client, userdata, flags, reason_code, properties=None):
    if reason_code == 0:
        client.subscribe('a11/data')
        print(f'[DMZ Hub] connected, subscribed a11/data')
    else:
        print(f'[DMZ Hub] connect fail: code={reason_code}')

def on_message(client, userdata, msg):
    data = msg.payload
    if len(data) >= 2 and data[0:2] == b'\x5a\x5a':
        flen = struct.unpack('<H', data[2:4])[0]
        mt = struct.unpack('<H', data[8:10])[0] if len(data) >= 10 else 0
        received["A11"] += 1
        print(f'[DMZ Hub] A11 len={flen} msg=0x{mt:04X} ({len(data)}B)')
    elif len(data) >= 1 and data[0] == 0x68:
        received["IEC104"] += 1
        print(f'[DMZ Hub] IEC104 ({len(data)}B)')
    elif len(data) >= 8 and data[7] in (1,2,3,4,5,6,15,16):
        received["Modbus"] += 1
        print(f'[DMZ Hub] Modbus FC{data[7]:02X} ({len(data)}B)')
    else:
        received["other"] += 1
        print(f'[DMZ Hub] RAW ({len(data)}B)')

if __name__ == '__main__':
    client = mqtt.Client(client_id='dmz_hub_sim', protocol=mqtt.MQTTv311)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect('127.0.0.1', 1883, 60)
    print('[DMZ Hub] connecting to MQTT 127.0.0.1:1883...')
    try:
        client.loop_forever()
    except KeyboardInterrupt:
        client.loop_stop()
        print(f'\n[DMZ Hub] stopped. Received: {received}')
