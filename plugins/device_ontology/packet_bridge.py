#!/usr/bin/env python3
"""报文桥接 — dgiot_lite → EMQX → 边缘中枢"""
import paho.mqtt.client as mqtt
import json, time, sys, urllib.request, threading, random

BROKER = '127.0.0.1'
PORT = 1883
TOPIC = 'dgiot/device/dgiot_lite/edge01/data'
CAPTURE_API = 'http://localhost:8765'

# ===== 真实报文库 =====
PCAP_PACKETS = [
    # A11 帧
    {"proto":"A11","dir":"TX","src":"131:62535","dst":"130:8889","sz":1204,"msg":"0xF062","hex":"5a5ab2040100260062f02f000900000a0024060000230000005c43593143384b...","desc":"设备列表查询 — 含ASCII设备路径"},
    {"proto":"A11","dir":"RX","src":"130:8889","dst":"131:62531","sz":25,"msg":"0x87B2","hex":"5a5a170000003900b28735000500800a00000000006a6a","desc":"心跳保活应答"},
    {"proto":"A11","dir":"TX","src":"131:62530","dst":"130:8889","sz":217,"msg":"0xF050","hex":"5a5ad9000000390050f033000400000a00090000002f0f00000d0f00006a6a5a5a06050300...","desc":"单井数据查询 — 含jjZZ子帧"},
    {"proto":"A11","dir":"RX","src":"130:8889","dst":"131:58646","sz":117,"msg":"0x0000","hex":"5a5a730000003e0000000000020000000004000000340000008719000007bd6950...","desc":"CommBridge二次封装"},
    # Modbus 帧
    {"proto":"Modbus","dir":"TX","src":"131:53001","dst":"11.249.61.243:502","sz":12,"msg":"FC3","hex":"df05000000060103012b0004","desc":"读保持寄存器 — 从站1, 地址299, 4个"},
    {"proto":"Modbus","dir":"RX","src":"11.249.61.243:502","dst":"131:53001","sz":17,"msg":"FC3","hex":"df050000000b0103083eda20fbc61c3c00","desc":"响应: Ia=330A, Iac=175A"},
    {"proto":"Modbus","dir":"TX","src":"131:53001","dst":"11.248.198.45:502","sz":12,"msg":"FC3","hex":"3b0000000006010303d40066","desc":"读保持寄存器 — 从站1, 地址980, 102个"},
    {"proto":"Modbus","dir":"TX","src":"131:53001","dst":"11.248.203.74:502","sz":12,"msg":"FC3","hex":"7400000000060203012b0004","desc":"读保持寄存器 — 从站2, 地址299"},
    # OPC DA 帧
    {"proto":"OPC-DA","dir":"RX","src":"172.23.9.3:58648","dst":"131:49778","sz":1460,"msg":"DCOM","hex":"05000003100000008c080000b8760200640800000100030002ac...","desc":"RSLinx OPC DA Request"},
    {"proto":"OPC-DA","dir":"RX","src":"172.23.18.194:3514","dst":"131:135","sz":120,"msg":"Bind","hex":"05000b03100000007800280066020000d016d016...","desc":"DCOM对象绑定 — RSLinx"},
]

# ===== 设备数据 =====
DEVICE_EVENTS = [
    {"device":"02110120089_B1V25VE33","point":"最大载荷","value":86.07,"unit":"kN"},
    {"device":"02110150041_B1V51VSFK01","point":"最大下行电流","value":15.28,"unit":"A"},
    {"device":"02110150041_B1V51VSFK01","point":"最小载荷","value":33.53,"unit":"kN"},
    {"device":"02110150041_B1V51VSFK01","point":"最大上行电流","value":10.69,"unit":"A"},
    {"device":"02110150041_B1V51VSFK01","point":"最大载荷","value":41.31,"unit":"kN"},
]

def publish(client, data):
    msg = json.dumps(data, ensure_ascii=False)
    client.publish(TOPIC, msg)
    sys.stdout.write(f'[{data.get("type","?")}] {msg[:100]}...\n'); sys.stdout.flush()

def packet_pusher(client):
    """推送报文"""
    for pkt in PCAP_PACKETS:
        publish(client, {
            "ts": int(time.time()), "agent": "dgiot_lite", "type": "packet",
            "proto": pkt["proto"], "dir": pkt["dir"],
            "src": pkt["src"], "dst": pkt["dst"],
            "size": pkt["sz"], "msg_type": pkt["msg"],
            "hex": pkt["hex"][:80], "desc": pkt["desc"],
        })
        time.sleep(0.3)

def event_pusher(client):
    """推送设备事件"""
    for evt in DEVICE_EVENTS:
        publish(client, {
            "ts": int(time.time()), "agent": "dgiot_lite", "type": "event",
            "device": evt["device"], "point": evt["point"],
            "value": evt["value"], "unit": evt["unit"],
        })
        time.sleep(0.3)

def status_pusher(client):
    """推送系统状态"""
    publish(client, {
        "ts": int(time.time()), "agent": "dgiot_lite", "type": "status",
        "io_server": "11.66.12.131",
        "processes": {"IoProject":1,"IOMan":36,"IoMonitor":1,"CommBridge":1,"IoCommit":7},
        "data_sources": 9,
        "rtu_devices": 206, "dcs_endpoints": 5, "wireless_terminals": 31,
        "protocols": {
            "A11": {"port":8889,"frames":93913,"status":"已逆向"},
            "ModbusTCP": {"port":53001,"frames":21255,"status":"已解析"},
            "OPC_DA": {"port":"135+","frames":72923,"status":"协议可识"},
        }
    })

def realtime_loop(client):
    """持续推送模拟实时数据"""
    while True:
        for evt in random.sample(DEVICE_EVENTS, min(3, len(DEVICE_EVENTS))):
            val = round(evt["value"] + random.uniform(-3, 3), 2)
            publish(client, {
                "ts": int(time.time()), "agent": "dgiot_lite", "type": "realtime",
                "device": evt["device"], "point": evt["point"],
                "value": val, "unit": evt["unit"],
            })
        time.sleep(5)

def capture_pusher(client):
    """从 capture_server 获取实时抓包"""
    while True:
        try:
            r = urllib.request.urlopen(CAPTURE_API + "/api/status", timeout=3)
            status = json.loads(r.read())
            if status.get("packets", 0) > 0:
                r2 = urllib.request.urlopen(CAPTURE_API + "/api/packets?limit=5", timeout=3)
                pkts = json.loads(r2.read()).get("packets", [])
                for p in pkts:
                    publish(client, {
                        "ts": int(time.time()), "agent": "dgiot_lite", "type": "capture",
                        "proto": p.get("proto","?"),
                        "dir": p.get("dir","?"), "src": p.get("src","?"), "dst": p.get("dst","?"),
                        "size": p.get("len",0), "hex": p.get("hex","")[:80],
                    })
        except: pass
        time.sleep(10)

if __name__ == "__main__":
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.connect(BROKER, PORT, 60)
    print(f"Packet Bridge: {BROKER}:{PORT} -> {TOPIC}")
    print(f"Agent: dgiot_lite | IO Server: 11.66.12.131")

    # 初始推送
    status_pusher(client)
    time.sleep(0.5)
    packet_pusher(client)
    time.sleep(0.5)
    event_pusher(client)

    # 后台实时推送
    threading.Thread(target=realtime_loop, args=(client,), daemon=True).start()
    threading.Thread(target=capture_pusher, args=(client,), daemon=True).start()

    print("\nBridge running. Ctrl+C to stop.")
    try:
        while True: time.sleep(30)
    except KeyboardInterrupt:
        client.disconnect()
        print("Stopped")
