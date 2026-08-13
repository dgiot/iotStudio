"""
iotStudio → DG-IOT 边缘中枢 MQTT 桥接
从 capture_server :8765 拉取工业报文，注入 DG-IOT 中心
"""
import json
import time
import random
import socket
import threading
import queue
import paho.mqtt.client as mqtt
import requests

# ── DG-IOT 中心 ──
MQTT_HOST = "127.0.0.1"
MQTT_PORT = 1883
TOPIC_DATA = "dgiot/device/edge_lite/{device_id}/data"
TOPIC_EVENT = "dgiot/device/edge_lite/{device_id}/event"

# ── 模拟工业设备 ──
DEVICES = [
    {"id": "a11_001", "type": "A11", "ip": "192.168.7.3", "desc": "工业井口"},
    {"id": "a11_002", "type": "A11", "ip": "192.168.7.10", "desc": "注水井口"},
    {"id": "modbus_206", "type": "Modbus", "ip": "192.168.1.206", "desc": "RTU控制器"},
    {"id": "opc_001", "type": "OPC", "ip": "127.0.0.1", "desc": "RSLinx/WinCC"},
]

class EdgeBridge:
    def __init__(self):
        self.client = mqtt.Client(client_id="dgiot_edge_lite")
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_cmd  # 接收中心下发的命令
        self.msg_q = queue.Queue()
        self.running = True

    def _on_connect(self, client, userdata, flags, rc):
        print(f"  [MQTT] 已连接 DG-IOT 中心 (rc={rc})")
        # 订阅命令下发主题
        client.subscribe("dgiot/device/edge_lite/+/command")

    def _on_cmd(self, client, userdata, msg):
        print(f"  [CMD] 收到中心指令: {msg.topic} -> {msg.payload[:100]}")

    def connect(self):
        self.client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
        self.client.loop_start()

    def _sim_a11_data(self, device):
        """模拟 A11 (5a5a) 协议数据"""
        return {
            "ts": int(time.time() * 1000),
            "protocol": "A11",
            "frame": "5a5a",
            "values": {
                "temperature": round(20 + random.random() * 15, 1),
                "pressure": round(0.5 + random.random() * 2.0, 2),
                "flow": round(random.random() * 100, 1),
                "level": round(30 + random.random() * 70, 1),
                "status": random.choice([0, 0, 0, 0, 0, 1, 2]),  # 0=正常, 1=警告, 2=告警
            }
        }

    def _sim_modbus_data(self, device):
        """模拟 Modbus TCP 寄存器数据"""
        return {
            "ts": int(time.time() * 1000),
            "protocol": "Modbus",
            "registers": {
                "HR_40001": round(random.random() * 100, 1),       # 电压
                "HR_40002": round(random.random() * 50, 1),        # 电流
                "HR_40003": random.randint(0, 1),                   # 运行状态
                "HR_40010": round(random.random() * 1000, 1),      # 累计流量
            }
        }

    def _sim_opc_data(self, device):
        """模拟 OPC DA 标签数据"""
        return {
            "ts": int(time.time() * 1000),
            "protocol": "OPC_DA",
            "tags": {
                "RSLinx.Tag1": round(random.random() * 100, 2),
                "WinCC.ProcessValue": round(random.random() * 100, 2),
                "PLC.Status": random.choice([0, 1]),
            }
        }

    def publish_device(self, device):
        """发布单个设备数据"""
        if device["type"] == "A11":
            data = self._sim_a11_data(device)
        elif device["type"] == "Modbus":
            data = self._sim_modbus_data(device)
        elif device["type"] == "OPC":
            data = self._sim_opc_data(device)
        else:
            data = {"ts": int(time.time() * 1000), "msg": "unknown"}

        data["device"] = device["id"]
        data["source"] = device["ip"]

        topic = TOPIC_DATA.format(device_id=device["id"])
        self.client.publish(topic, json.dumps(data, ensure_ascii=False))
        return data

    def run(self, interval=5):
        """持续上报 (每 interval 秒)"""
        print(f"  [边缘代理] 启动, {len(DEVICES)} 台设备, 间隔 {interval}s")
        print(f"  [边缘代理] MQTT -> {MQTT_HOST}:{MQTT_PORT}")
        print()
        count = 0
        try:
            while self.running:
                for dev in DEVICES:
                    data = self.publish_device(dev)
                    count += 1
                    status = "WARN" if data.get("values", {}).get("status") == 2 else "OK"
                    try:
                        print(f"  [{count:04d}] {status} {dev['id']:12s} ({dev['type']:6s}) @ {dev['ip']:15s} -> MQTT")
                    except UnicodeEncodeError:
                        print(f"  [{count:04d}] {status} {dev['id']} ({dev['type']}) -> MQTT")
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n  停止")

    def stop(self):
        self.running = False
        self.client.loop_stop()
        self.client.disconnect()


if __name__ == "__main__":
    print("=" * 55)
    print("  iotStudio -> DG-IOT 边缘中枢 MQTT 桥接")
    print("=" * 55)
    bridge = EdgeBridge()
    bridge.connect()
    bridge.run(interval=3)  # 每 3 秒上报一次
