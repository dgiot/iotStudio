#!/usr/bin/env python3
"""IO 接管服务 — 替换原 11.66.12.130:8889 A11 IO Server"""
import socket, struct, threading, time, sqlite3, os, json
from collections import defaultdict

PORT = 8889  # 可改为 18889 测试
DATA_DIR = "./data"
DB_PATH = os.path.join(DATA_DIR, "io_takeover.db")
MAGIC = b'\x5a\x5a'  # A11 帧头

# ===== 统计 =====
stats = {"connections": 0, "frames_rx": 0, "frames_tx": 0, "bytes_rx": 0, "bytes_tx": 0}
flows = defaultdict(lambda: {"packets": 0, "bytes": 0, "msg_types": defaultdict(int)})
frame_log = []  # 最近 500 帧

def init_db():
    os.makedirs(DATA_DIR, exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.execute('''CREATE TABLE IF NOT EXISTS io_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts REAL, src TEXT, dst TEXT, direction TEXT,
        frame_len INTEGER, msg_type TEXT, flags TEXT,
        payload TEXT, parsed TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    db.execute('''CREATE TABLE IF NOT EXISTS io_stats (
        key TEXT PRIMARY KEY, value TEXT
    )''')
    db.commit(); db.close()

def log_frame(src, dst, direction, frame, parsed):
    """记录帧到内存+DB"""
    global stats, frame_log
    entry = {"ts": time.time(), "src": src, "dst": dst, "dir": direction,
             "len": len(frame), "parsed": parsed}
    frame_log.append(entry)
    if len(frame_log) > 500: frame_log[:] = frame_log[-300:]
    # 流统计
    flow_key = f"{src}->{dst}" if direction == "RX" else f"{dst}->{src}"
    flows[flow_key]["packets"] += 1; flows[flow_key]["bytes"] += len(frame)
    flows[flow_key]["msg_types"][parsed.get("msg_type", "?")] += 1
    stats["frames_rx" if direction == "RX" else "frames_tx"] += 1
    stats["bytes_rx" if direction == "RX" else "bytes_tx"] += len(frame)
    # DB
    try:
        db = sqlite3.connect(DB_PATH)
        db.execute("INSERT INTO io_data (ts,src,dst,direction,frame_len,msg_type,flags,payload,parsed) VALUES (?,?,?,?,?,?,?,?,?)",
            [entry["ts"], src, dst, direction, len(frame), parsed.get("msg_type","?"),
             parsed.get("flags",""), frame[:200].hex(' '), json.dumps(parsed)])
        db.commit(); db.close()
    except: pass

def parse_a11_frame(data):
    """解析 5a5a A11 帧"""
    if len(data) < 6 or data[0:2] != MAGIC:
        return {"proto": "unknown", "len": len(data)}
    flen = int.from_bytes(data[2:4], 'little')
    p = {"proto": "A11", "len": len(data), "frame_len": flen}
    if len(data) >= 10:
        p["flags"] = data[4:8].hex(' ')
        p["msg_type"] = f'0x{int.from_bytes(data[8:10],"little"):04X}'
    if len(data) > 10:
        p["payload_len"] = len(data) - 10
        # 尝试解析 payload 中的数值
        if p["payload_len"] >= 4:
            try: p["sample_val"] = round(struct.unpack('<f', data[10:14])[0], 3)
            except: pass
    return p

def build_response(rx_frame, parsed):
    """根据收到的帧生成 A11 响应帧"""
    msg_type = parsed.get('msg_type', '0x0000')
    flags = rx_frame[4:8] if len(rx_frame) >= 8 else b'\x00\x00\x00\x00'

    # 查询帧 (0xF050, 0xF062) → 返回数据
    if msg_type in ('0xF050', '0xF062', '0x3666'):
        # 构造一条模拟数据: 5a5a + len + flags + 0x3667 + 8B 模拟值
        payload = struct.pack('<f', 230.5) + struct.pack('<f', 45.2)  # 电压, 电流
        pdu = struct.pack('<H', 0x3667) + b'\x00\x00' + payload
        frame_len = len(pdu) + 6  # 不含 2B 头
        resp = MAGIC + struct.pack('<H', frame_len) + flags + pdu
        return resp

    # 心跳帧 (0x87B3) → 回声确认
    if msg_type == '0x87B3':
        return rx_frame

    # 设备注册 (0x0506) → ACK
    if msg_type == '0x0506':
        ack = MAGIC + struct.pack('<H', 8) + flags + struct.pack('<H', 0x0507) + b'\x00\x00'
        return ack

    # 默认: 原样回声
    return rx_frame

def handle_client(conn, addr):
    """处理单个 TCP 连接"""
    stats["connections"] += 1
    buf = b''
    src = f"{addr[0]}:{addr[1]}"
    dst = f"local:{PORT}"
    try:
        while True:
            data = conn.recv(65535)
            if not data: break
            buf += data
            while len(buf) >= 6:
                pos = buf.find(MAGIC)
                if pos < 0: buf = buf[-4:]; break
                if pos > 0: buf = buf[pos:]
                flen = int.from_bytes(buf[2:4], 'little')
                total = flen + 2
                if total > len(buf): break
                frame = buf[:total]; buf = buf[total:]
                parsed = parse_a11_frame(frame)
                log_frame(src, dst, "RX", frame, parsed)
                resp = build_response(frame, parsed)
                try: conn.sendall(resp)
                except: break
                log_frame(dst, src, "TX", resp, parse_a11_frame(resp))
    except Exception as e:
        print(f"[io] {addr} error: {e}")
    finally:
        conn.close()

def start_io_server(port=PORT):
    """启动 IO 接管服务"""
    init_db()
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('0.0.0.0', port))
    sock.listen(50)
    print(f"[io_takeover] A11 IO Server listening on :{port}")
    print(f"  DB: {DB_PATH}")
    print(f"  Replace: 11.66.12.130:8889")
    while True:
        conn, addr = sock.accept()
        t = threading.Thread(target=handle_client, args=(conn, addr), daemon=True)
        t.start()

# ===== HTTP API =====
from http.server import HTTPServer, BaseHTTPRequestHandler
class APIHandler(BaseHTTPRequestHandler):
    def _json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Content-Length',str(len(body))); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/api/stats': self._json(stats)
        elif path == '/api/flows': self._json({"flows": dict(flows)})
        elif path == '/api/frames': self._json({"frames": frame_log[-50:]})
        elif path == '/api/db':
            db = sqlite3.connect(DB_PATH)
            db.row_factory = sqlite3.Row
            rows = db.execute("SELECT * FROM io_data ORDER BY id DESC LIMIT 50").fetchall()
            self._json({"total": db.execute("SELECT COUNT(*) FROM io_data").fetchone()[0], "rows": [dict(r) for r in rows]})
            db.close()
        elif path == '/':
            self.send_response(200); self.send_header('Content-Type','text/html'); self.end_headers()
            self.wfile.write(b'<h2>IO Takeover Server</h2><a href="/api/stats">stats</a> | <a href="/api/frames">frames</a> | <a href="/api/db">db</a>')
        else: self._json({"error":"not found"},404)
    def log_message(self, *a): pass

if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    print(f"port={port}")
    # IO 服务线程
    threading.Thread(target=start_io_server, args=(port,), daemon=True).start()
    # HTTP API 线程
    api_port = port + 1000  # 8889→9889, 18889→19889
    HTTPServer(('0.0.0.0', api_port), APIHandler).serve_forever()
