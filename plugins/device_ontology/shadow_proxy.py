#!/usr/bin/env python3
"""IO接管影子代理 — TCP 透明中继 + 旁路记录 + MQTT 推送"""
import socket, struct, threading, time, sqlite3, os, sys, json, select

LISTEN_PORT = 8889
TARGET_HOST = '192.168.10.130'
TARGET_PORT = 8889
MQTT_HOST = '127.0.0.1'
MQTT_PORT = 1883
MQTT_TOPIC = 'a11/data'
DB = "./data/shadow.db"

# MQTT Publisher (lazy init)
mqtt_client = None
def get_mqtt():
    global mqtt_client
    if mqtt_client is not None:
        return mqtt_client
    try:
        import paho.mqtt.client as mqtt
        mqtt_client = mqtt.Client(client_id=f'edge_proxy_{os.getpid()}')
        mqtt_client.connect(MQTT_HOST, MQTT_PORT)
        mqtt_client.loop_start()
        print(f'[mqtt] connected to {MQTT_HOST}:{MQTT_PORT}')
        return mqtt_client
    except Exception as e:
        print(f'[mqtt] init fail: {e}, MQTT disabled')
        mqtt_client = False
        return None

def mqtt_publish(topic, payload):
    client = get_mqtt()
    if client:
        try: client.publish(topic, payload)
        except: pass

os.makedirs("./data", exist_ok=True)
db = sqlite3.connect(DB, check_same_thread=False)
db.execute('''CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, src TEXT, dst TEXT, started REAL,
    rx INTEGER DEFAULT 0, tx INTEGER DEFAULT 0,
    rxb INTEGER DEFAULT 0, txb INTEGER DEFAULT 0, status TEXT DEFAULT 'active')''')
db.execute('''CREATE TABLE IF NOT EXISTS frames (
    id INTEGER PRIMARY KEY AUTOINCREMENT, sid INTEGER, ts REAL,
    dir TEXT, len INTEGER, parsed TEXT, hex TEXT)''')
db.commit()

def parse_frame(data):
    if len(data) < 6: return None
    # A11: 5a5a 帧头
    if data[0:2] == b'\x5a\x5a':
        flen = struct.unpack('<H', data[2:4])[0]
        mt = f'0x{struct.unpack("<H",data[8:10])[0]:04X}' if len(data)>=10 else "?"
        return {"proto": "A11", "len": flen, "msg_type": mt}
    # IEC 104: 0x68 启动字符 (必须在Modbus之前检测)
    if data[0] == 0x68 and len(data) >= 6:
        apdu_len = data[1]
        ctrl = data[2:6]
        is_iframe = (ctrl[0] & 1) == 0
        is_sframe = (ctrl[0] & 3) == 2
        frame_type = 'I-frame' if is_iframe else ('S-frame' if is_sframe else 'U-frame')
        result = {"proto": "IEC104", "len": apdu_len + 2, "apdu_len": apdu_len,
                  "ctrl": ctrl.hex(' '), "frame_type": frame_type}
        # ASDU 解析 (I-frame 才有)
        if is_iframe and len(data) >= 12:
            asdu = data[6:6+apdu_len]
            type_id = asdu[0]
            vsq = asdu[1]
            sq = (vsq >> 7) & 1
            obj_count = vsq & 0x7F
            cot = struct.unpack('<H', asdu[2:4])[0]
            com_addr = struct.unpack('<H', asdu[4:6])[0]
            result.update({"type_id": type_id, "sq": sq, "obj_count": obj_count,
                "cot": cot, "com_addr": com_addr})
            type_names = {1:'单点遥信',3:'双点遥信',9:'归一化遥测',11:'标度化遥测',13:'短浮点遥测',
                30:'单点遥信+CP56',45:'单点遥控',100:'总召唤',103:'时钟同步'}
            result["type_name"] = type_names.get(type_id, f'Type{type_id}')
            if type_id == 13 and obj_count > 0:
                values = []
                for i in range(min(obj_count, 8)):
                    off = 6 + i * 7  # ASDU头6B + 每点7B(IOA 3B + 值 4B)
                    if off + 5 <= len(asdu):
                        addr = int.from_bytes(asdu[off:off+3], 'little')
                        val = round(struct.unpack('<f', asdu[off+3:off+7])[0], 2)
                        values.append({"addr": addr, "val": val})
                if values:
                    result["values"] = values
        return result
    # Modbus TCP: MBAP header (IEC104之后检测，避免误判)
    if len(data) >= 7:
        fc = data[7] if len(data) > 7 else 0
        if fc in (1,2,3,4,5,6,15,16):
            tid = struct.unpack('>H', data[0:2])[0]
            uid = data[6]
            fc_names = {1:'ReadCoils',2:'ReadDI',3:'ReadHR',4:'ReadIR',5:'WriteCoil',6:'WriteReg',15:'WriteCoils',16:'WriteRegs'}
            return {"proto": "Modbus", "len": len(data), "tid": tid, "slave": uid, "fc": fc, "fc_name": fc_names.get(fc, f'FC{fc:02X}')}
    # OPC UA: HEL/OPN/CLO/MSG 帧头
    if len(data) >= 8 and data[0:4] in (b'HEL\x00', b'OPN\x00', b'CLO\x00', b'MSG\x00'):
        return {"proto": "OPC_UA", "len": len(data), "msg_type": data[0:3].decode()}
    # GE Fanuc EGD: 签名 0x0002
    if len(data) >= 8 and data[0:2] == b'\x00\x02':
        return {"proto": "GE_EGD", "len": len(data)}
    # 其他TCP数据
    return {"proto": "TCP", "len": len(data)}

def log_frames(sid, direction, data):
    buf = data
    while len(buf) >= 6:
        pos = buf.find(b'\x5a\x5a')
        if pos < 0: break
        flen = struct.unpack('<H', buf[pos+2:pos+4])[0] + 2
        if flen > len(buf): break
        frame = buf[pos:pos+flen]; buf = buf[pos+flen:]
        p = parse_frame(frame) or {}
        col_rx = 'rx' if direction == 'RX' else 'tx'
        col_b = 'rxb' if direction == 'RX' else 'txb'
        db.execute(f'UPDATE sessions SET {col_rx}={col_rx}+1, {col_b}={col_b}+? WHERE id=?',
            [len(frame), sid])
        db.execute('INSERT INTO frames (sid,ts,dir,len,parsed,hex) VALUES (?,?,?,?,?,?)',
            [sid, time.time(), direction, len(frame), str(p), frame[:80].hex()])
    db.commit()
    # 下行解析完成后推 MQTT
    mqtt_publish(MQTT_TOPIC, data)

def relay(client, addr):
    backend = socket.socket()
    try:
        backend.settimeout(3)
        backend.connect((TARGET_HOST, TARGET_PORT))
    except:
        # 降级: 只记录
        db.execute('INSERT INTO sessions (src,dst,started,rx,tx,status) VALUES (?,?,?,0,0,?)',
            [f'{addr[0]}:{addr[1]}', f'{TARGET_HOST}:{TARGET_PORT}', time.time(), 'io_down'])
        db.commit()
        sid = db.execute('SELECT last_insert_rowid()').fetchone()[0]
        while True:
            try:
                d = client.recv(65535)
                if not d: break
                log_frames(sid, 'RX', d)
            except: break
        client.close(); return

    sid = db.execute('INSERT INTO sessions (src,dst,started) VALUES (?,?,?)',
        [f'{addr[0]}:{addr[1]}', f'{TARGET_HOST}:{TARGET_PORT}', time.time()]).lastrowid
    db.commit()

    sockets = [client, backend]
    try:
        while True:
            r, _, _ = select.select(sockets, [], [], 30)
            if not r: break
            for sock in r:
                data = sock.recv(65535)
                if not data:
                    sockets.remove(sock)
                    other = sockets[0] if sockets else None
                    if other: other.close()
                    db.execute('UPDATE sessions SET status=? WHERE id=?', ['closed', sid])
                    db.commit()
                    return
                if sock is client:
                    # RX (上行): IoCommit → IO出口, 透传
                    backend.sendall(data)
                    db.execute('UPDATE sessions SET rx=rx+1, rxb=rxb+? WHERE id=?',
                        [len(data), sid])
                    db.commit()
                else:
                    # TX (下行): IO出口 → IoCommit, 解析 + 推送 MQTT
                    client.sendall(data)
                    log_frames(sid, 'TX', data)
    except:
        pass
    finally:
        try: client.close()
        except: pass
        try: backend.close()
        except: pass
        db.execute('UPDATE sessions SET status=? WHERE id=?', ['closed', sid])
        db.commit()

def serve(port):
    sock = socket.socket()
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('0.0.0.0', port))
    sock.listen(50)
    print(f'[proxy] :{port} -> {TARGET_HOST}:{TARGET_PORT}')
    while True:
        c, a = sock.accept()
        threading.Thread(target=relay, args=(c, a), daemon=True).start()

# HTTP
from http.server import HTTPServer, BaseHTTPRequestHandler
class H(BaseHTTPRequestHandler):
    def _json(self, d, c=200):
        b=json.dumps(d,ensure_ascii=False).encode()
        self.send_response(c); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Content-Length',str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        if '/api/stats' in self.path:
            a = db.execute("SELECT COUNT(*) FROM sessions WHERE status='active'").fetchone()[0]
            t = db.execute('SELECT COUNT(*),SUM(rx),SUM(tx),SUM(rxb),SUM(txb) FROM sessions').fetchone()
            self._json({"active":a,"total_sessions":t[0],"total_rx":t[1]or 0,"total_tx":t[2]or 0,"total_rx_b":t[3]or 0,"total_tx_b":t[4]or 0})
        elif '/api/sessions' in self.path:
            rows = db.execute('SELECT * FROM sessions ORDER BY started DESC LIMIT 20').fetchall()
            self._json({"sessions": [{"id":r[0],"src":r[1],"dst":r[2],"rx":r[4],"tx":r[5],"status":r[8]} for r in rows]})
        elif '/api/frames' in self.path:
            rows = db.execute('SELECT * FROM frames ORDER BY ts DESC LIMIT 50').fetchall()
            self._json({"frames": [{"sid":r[1],"ts":r[2],"dir":r[3],"len":r[4],"parsed":r[5],"hex":r[6]} for r in rows]})
        else:
            s = db.execute("SELECT COUNT(*),SUM(rx),SUM(tx) FROM sessions WHERE status='active'").fetchone()
            ses = ''.join(f'<tr><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[4]}</td><td>{r[5]}</td><td>{r[8]}</td></tr>'
                for r in db.execute('SELECT * FROM sessions ORDER BY started DESC LIMIT 15').fetchall())
            html = f'<html><head><meta charset=utf-8><meta http-equiv=refresh content=5><title>IO Proxy</title>'
            html += '<style>body{{font:14px sans-serif;background:#0d1c30;color:#c0d5e8;margin:20px}} table{{width:100%;border-collapse:collapse}} th,td{{padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.1)}} th{{color:#8aa0b4}} .active{{color:#66bb6a}} .io_down{{color:#ef5350}}</style>'
            html += f'</head><body><h1>IO Proxy</h1><p>Active:{s[0]} RX:{s[1]or 0} TX:{s[2]or 0}</p><table><tr><th>ID</th><th>Src</th><th>Dst</th><th>RX</th><th>TX</th><th>Status</th></tr>{ses}</table></body></html>'
            self.send_response(200); self.send_header('Content-Type','text/html;charset=utf-8'); self.send_header('Content-Length',str(len(html.encode()))); self.end_headers(); self.wfile.write(html.encode())
    def log_message(self,*a): pass

if __name__ == '__main__':
    port = LISTEN_PORT; target_host = TARGET_HOST; target_port = TARGET_PORT
    mqtt_host = MQTT_HOST; mqtt_port = MQTT_PORT; mqtt_topic = MQTT_TOPIC
    args = sys.argv[1:]; i = 0
    while i < len(args):
        if args[i] == '--target' and i+1 < len(args):
            t = args[i+1].split(':'); target_host = t[0]; target_port = int(t[1]) if len(t) > 1 else TARGET_PORT; i += 2
        elif args[i] == '--mqtt' and i+1 < len(args):
            t = args[i+1].split(':'); mqtt_host = t[0]; mqtt_port = int(t[1]) if len(t) > 1 else MQTT_PORT
            if len(t) > 2: mqtt_topic = t[2]
            i += 2
        elif args[i].isdigit(): port = int(args[i]); i += 1
        else: i += 1
    TARGET_HOST = target_host; TARGET_PORT = target_port
    MQTT_HOST = mqtt_host; MQTT_PORT = mqtt_port; MQTT_TOPIC = mqtt_topic
    print(f'[proxy] listen :{port} -> {TARGET_HOST}:{TARGET_PORT}')
    print(f'[proxy] mqtt   {MQTT_HOST}:{MQTT_PORT} topic={MQTT_TOPIC}')
    threading.Thread(target=serve, args=(port,), daemon=True).start()
    api_port = port + 10000
    print(f'[proxy] dashboard http://localhost:{api_port}')
    HTTPServer(('0.0.0.0', api_port), H).serve_forever()
