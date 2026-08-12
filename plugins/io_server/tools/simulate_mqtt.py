#!/usr/bin/env python3
"""MQTT 全模拟 — Python Broker + Client + 边缘代理推送"""
import socket, struct, threading, time, json

# ===== 1. 极简 MQTT Broker =====
class MiniMQTTBroker:
    def __init__(self, host='127.0.0.1', port=21883):
        self.host = host; self.port = port
        self.subscribers = {}  # topic -> [socket]
        self.srv = None

    def start(self):
        self.srv = socket.socket()
        self.srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.srv.bind((self.host, self.port)); self.srv.listen(10)
        print(f'[MQTT Broker] :{self.port}')
        def accept():
            while True:
                c, a = self.srv.accept()
                threading.Thread(target=self._handle, args=(c,), daemon=True).start()
        threading.Thread(target=accept, daemon=True).start()

    def _handle(self, client):
        try:
            data = client.recv(65535)
            if not data: return
            # 解析 CONNECT
            if len(data) < 12: return
            # CONNECT: 0x10 + remaining_len + "MQTT" + version(4) + flags + keepalive(2)
            proto_start = 2 + (1 if (data[1] & 0x80) == 0 else 2)  # skip remaining length
            if data[proto_start:proto_start+4] != b'MQTT': return
            mqtt_version = data[proto_start+4]
            mqtt_flags = data[proto_start+5]
            keep_alive = struct.unpack('>H', data[proto_start+6:proto_start+8])[0]
            client_id_start = proto_start + 8
            client_id_len = struct.unpack('>H', data[client_id_start:client_id_start+2])[0]
            client_id = data[client_id_start+2:client_id_start+2+client_id_len].decode()

            # CONNACK
            connack = b'\x20\x02\x00\x00'  # connection accepted
            client.sendall(connack)
            print(f'  [MQTT] {client_id} connected')

            # 处理 PUBLISH / SUBSCRIBE
            while True:
                data = client.recv(65535)
                if not data: break
                cmd = data[0] >> 4
                if cmd == 0x03:  # PUBLISH
                    self._publish(data, client_id)
                elif cmd == 0x08:  # SUBSCRIBE
                    self._subscribe(data, client)
                elif cmd == 0x0E:  # DISCONNECT
                    break
        except: pass
        # 清理订阅
        for topic in list(self.subscribers):
            self.subscribers[topic] = [s for s in self.subscribers[topic] if s is not client]
        try: client.close()
        except: pass

    def _publish(self, data, client_id):
        idx = 1; rem = 0
        while True:
            byte = data[idx]; rem += byte & 0x7F; idx += 1
            if byte & 0x80 == 0: break
        topic_len = struct.unpack('>H', data[idx:idx+2])[0]; idx += 2
        topic = data[idx:idx+topic_len].decode()
        payload = data[idx+topic_len:idx+topic_len+rem-topic_len-2]
        print(f'  [MQTT] PUB topic={topic} payload={len(payload)}B from {client_id}')
        # 转发给订阅者
        if topic in self.subscribers:
            for sub in self.subscribers[topic]:
                try: sub.sendall(data)
                except: pass

    def _subscribe(self, data, client):
        pkt_id = struct.unpack('>H', data[2:4])[0]
        idx = 4
        while idx < len(data):
            topic_len = struct.unpack('>H', data[idx:idx+2])[0]; idx += 2
            topic = data[idx:idx+topic_len].decode(); idx += topic_len
            qos = data[idx]; idx += 1
            if topic not in self.subscribers:
                self.subscribers[topic] = []
            self.subscribers[topic].append(client)
            # SUBACK
            suback = b'\x90' + struct.pack('>H', 2 + 1)[1:] + struct.pack('>H', pkt_id) + bytes([qos])
            client.sendall(suback)
            print(f'  [MQTT] SUB topic={topic} qos={qos}')

    def stop(self):
        if self.srv: self.srv.close()

# ===== 2. MQTT Client (集成到边缘代理) =====
class MQTTPublisher:
    def __init__(self, host='127.0.0.1', port=21883, client_id='edge_proxy'):
        self.host = host; self.port = port; self.client_id = client_id
        self.sock = None

    def connect(self):
        try:
            self.sock = socket.socket(); self.sock.settimeout(3)
            self.sock.connect((self.host, self.port))
            # CONNECT packet
            payload = b'MQTT' + b'\x04\x02\x00\x3c'  # v3.1.1, clean session, keepalive 60s
            cid = self.client_id.encode()
            payload += struct.pack('>H', len(cid)) + cid
            rem_len = len(payload)
            # encode remaining length
            if rem_len < 128:
                header = b'\x10' + bytes([rem_len])
            else:
                header = b'\x10' + bytes([rem_len % 128, rem_len // 128])
            self.sock.sendall(header + payload)
            resp = self.sock.recv(4)  # CONNACK
            return resp[3] == 0  # 0 = accepted
        except Exception as e:
            print(f'  [MQTT Pub] connect fail: {e}')
            return False

    def publish(self, topic, payload):
        if not self.sock: return False
        try:
            # PUBLISH: 0x30 + flags + remaining_len + topic + payload
            pub = struct.pack('>H', len(topic)) + topic.encode() + (payload if isinstance(payload, bytes) else str(payload).encode())
            rem_len = len(pub)
            header = b'\x30' + bytes([rem_len])  # QoS 0
            self.sock.sendall(header + pub)
            return True
        except: return False

    def disconnect(self):
        try: self.sock.sendall(b'\xe0\x00')
        except: pass
        try: self.sock.close()
        except: pass

# ===== 3. 全模拟测试 =====
if __name__ == '__main__':
    print('=' * 55)
    print('  MQTT 全模拟 — Broker + Publisher + Subscriber')
    print('=' * 55)

    # 启动 Broker
    broker = MiniMQTTBroker()
    broker.start()
    time.sleep(0.3)

    # 启动 Subscriber
    received = []
    def subscriber():
        sub = socket.socket(); sub.settimeout(3)
        sub.connect(('127.0.0.1', 1883))
        # CONNECT
        cid = b'sub_client'
        payload = b'MQTT\x04\x02\x00\x3c' + struct.pack('>H', len(cid)) + cid
        sub.sendall(b'\x10' + bytes([len(payload)]) + payload)
        sub.recv(4)  # CONNACK
        # SUBSCRIBE to a11/data
        sub_pkt = struct.pack('>H', 1) + struct.pack('>H', 8) + b'a11/data' + b'\x00'
        sub.sendall(b'\x82' + bytes([len(sub_pkt)]) + sub_pkt)
        sub.recv(5)  # SUBACK
        print('[MQTT Sub] subscribed to a11/data')
        # Listen for PUBLISH
        while True:
            try:
                buf = sub.recv(65535)
                if not buf: break
                if buf[0] >> 4 == 0x03:
                    idx = 2; tl = struct.unpack('>H', buf[2:4])[0]
                    topic = buf[4:4+tl].decode()
                    payload = buf[4+tl:]
                    print(f'  [MQTT Sub] RECV topic={topic} payload={len(payload)}B')
                    received.append({'topic': topic, 'len': len(payload)})
            except socket.timeout: break
        sub.close()
    threading.Thread(target=subscriber, daemon=True).start()
    time.sleep(0.3)

    # 启动 Publisher (模拟边缘代理)
    print('\n[MQTT Pub] Publishing test data...')
    publisher = MQTTPublisher()
    if publisher.connect():
        for i in range(3):
            frame = bytes.fromhex(f'5a5a130000000a00f0502f000900000a00')  # A11 frame
            topic = 'a11/data'
            publisher.publish(topic, frame)
            print(f'  [MQTT Pub] #{i} topic={topic} {len(frame)}B')
            time.sleep(0.3)
        publisher.disconnect()

    time.sleep(1)
    print(f'\n  结果: {len(received)} msgs received')
    print('  PASS!' if len(received) >= 1 else '  FAIL')
    broker.stop()
