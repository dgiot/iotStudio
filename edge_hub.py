#!/usr/bin/env python3
"""
dgiot_lite 边缘中枢 — 参考 MindScope Edge Hub 架构
TCP :9100 接收设备数据 | API :9101 管理面 | 规则引擎 | 流处理
"""
import asyncio, json, time, struct, threading, logging, sqlite3
from http.server import HTTPServer, BaseHTTPRequestHandler
from collections import defaultdict, deque
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("edge-hub")

# ===== 数据层 =====
class HubDB:
    def __init__(self, path="edge_hub.db"):
        self.db = sqlite3.connect(path, check_same_thread=False)
        self.db.execute("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, ts REAL, agent TEXT, device TEXT, point TEXT, value REAL, unit TEXT)")
        self.db.execute("CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, ts REAL, agent TEXT, rule TEXT, severity TEXT, msg TEXT, ack INTEGER DEFAULT 0)")
        self.db.execute("CREATE TABLE IF NOT EXISTS agents (id TEXT PRIMARY KEY, last_seen REAL, status TEXT, meta TEXT)")
        self.db.commit()

    def add_event(self, agent, device, point, value, unit=""):
        self.db.execute("INSERT INTO events VALUES (NULL,?,?,?,?,?,?)", [time.time(), agent, device, point, value, unit])
        self.db.commit()

    def add_alert(self, agent, rule, severity, msg):
        self.db.execute("INSERT INTO alerts VALUES (NULL,?,?,?,?,?,0)", [time.time(), agent, rule, severity, msg])
        self.db.commit()

    def agent_heartbeat(self, agent_id, meta="{}"):
        self.db.execute("INSERT OR REPLACE INTO agents VALUES (?,?,?,?)", [agent_id, time.time(), "online", meta])
        self.db.commit()

    def get_agents(self):
        return [dict(r) for r in self.db.execute("SELECT * FROM agents ORDER BY last_seen DESC").fetchall()]

    def get_alerts(self, limit=50):
        return [dict(r) for r in self.db.execute("SELECT * FROM alerts ORDER BY ts DESC LIMIT ?", [limit]).fetchall()]

    def get_events(self, limit=100):
        return [dict(r) for r in self.db.execute("SELECT * FROM events ORDER BY ts DESC LIMIT ?", [limit]).fetchall()]

# ===== 规则引擎 =====
class RuleEngine:
    def __init__(self, db: HubDB):
        self.db = db
        self.rules = [
            {"id":"R1","name":"载荷超限","check":lambda v: v>100,"severity":"warning","msg":"载荷超标: {value}"},
            {"id":"R2","name":"电流异常","check":lambda v: v>20,"severity":"danger","msg":"电流过大: {value}A"},
            {"id":"R3","name":"离线检测","check":lambda v: v==0,"severity":"error","msg":"设备离线"},
        ]

    def evaluate(self, agent, device, point, value):
        for rule in self.rules:
            try:
                if rule["check"](value):
                    msg = rule["msg"].format(value=value)
                    self.db.add_alert(agent, rule["name"], rule["severity"], msg)
                    logger.warning(f"[ALERT] {rule['severity']}: {msg}")
            except: pass

# ===== 流处理引擎 =====
class StreamEngine:
    def __init__(self, window_sec=30):
        self.window = deque()
        self.window_sec = window_sec

    def push(self, data):
        self.window.append((time.time(), data))
        while self.window and time.time() - self.window[0][0] > self.window_sec:
            self.window.popleft()

    def stats(self):
        now = time.time()
        recent = [d for t,d in self.window if now - t <= self.window_sec]
        return {"window_sec": self.window_sec, "events": len(recent), "rate": len(recent)/max(self.window_sec,1)}

# ===== 管理 API (:9101) =====
class HubAPI(BaseHTTPRequestHandler):
    db: HubDB = None
    stream: StreamEngine = None
    rule: RuleEngine = None

    def _json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code); self.send_header("Content-Type","application/json")
        self.send_header("Access-Control-Allow-Origin","*"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)

    def do_GET(self):
        p = self.path.split("?")[0]
        if p == "/api/hub/health": self._json({"status":"ok","time":time.time()})
        elif p == "/api/hub/agents": self._json({"agents":HubAPI.db.get_agents()})
        elif p == "/api/hub/alerts": self._json({"alerts":HubAPI.db.get_alerts()})
        elif p == "/api/hub/events": self._json({"events":HubAPI.db.get_events()})
        elif p == "/api/hub/stream": self._json(HubAPI.stream.stats())
        elif p == "/api/hub/rules": self._json({"rules":HubAPI.rule.rules})
        elif p == "/": self._json({"name":"dgiot_lite Edge Hub","version":"1.0","endpoints":["/api/hub/health","/api/hub/agents","/api/hub/alerts","/api/hub/events","/api/hub/stream","/api/hub/rules"]})
        else: self._json({"error":"not found"},404)

    def do_POST(self):
        p = self.path.split("?")[0]
        if p == "/api/hub/data":
            try:
                length = int(self.headers.get("Content-Length",0))
                body = json.loads(self.rfile.read(length))
                agent = body.get("agent","unknown")
                HubAPI.db.agent_heartbeat(agent, json.dumps(body.get("meta",{})))
                for pt in body.get("points",[]):
                    device = pt.get("device",""); point = pt.get("point","")
                    value = pt.get("value",0); unit = pt.get("unit","")
                    HubAPI.db.add_event(agent, device, point, value, unit)
                    HubAPI.stream.push({"agent":agent,"device":device,"point":point,"value":value})
                    HubAPI.rule.evaluate(agent, device, point, value)
                self._json({"status":"ok","count":len(body.get("points",[]))})
            except Exception as e:
                self._json({"status":"error","msg":str(e)},400)
        elif p == "/api/hub/alerts/ack":
            try:
                length = int(self.headers.get("Content-Length",0))
                body = json.loads(self.rfile.read(length))
                aid = body.get("id")
                HubAPI.db.db.execute("UPDATE alerts SET ack=1 WHERE id=?",[aid]); HubAPI.db.db.commit()
                self._json({"status":"acked","id":aid})
            except: self._json({"error":"invalid"},400)
        else: self._json({"error":"not found"},404)

    def do_OPTIONS(self):
        self.send_response(200); self.send_header("Access-Control-Allow-Origin","*"); self.send_header("Access-Control-Allow-Methods","GET,POST,OPTIONS"); self.send_header("Access-Control-Allow-Headers","Content-Type"); self.end_headers()

    def log_message(self, *a): pass

# ===== 启动 =====
def start_edge_hub(tcp_port=9100, api_port=9101):
    """启动边缘中枢"""
    db = HubDB()
    stream = StreamEngine(window_sec=30)
    rule = RuleEngine(db)

    # 注入到 API handler
    HubAPI.db = db; HubAPI.stream = stream; HubAPI.rule = rule

    # 启动 API 服务
    def run_api():
        HTTPServer(("0.0.0.0", api_port), HubAPI).serve_forever()
    threading.Thread(target=run_api, daemon=True).start()
    logger.info(f"Edge Hub API: http://0.0.0.0:{api_port}")

    # 模拟 Modbus 设备数据推送
    def simulate_devices():
        import random
        devices = [("油井-A1","载荷",50,120),("油井-B3","电流",5,25),("油井-C7","载荷",30,90)]
        while True:
            for device,point,lo,hi in random.sample(devices,min(3,len(devices))):
                value = round(random.uniform(lo,hi),2)
                data = {"agent":"sim-modbus","points":[{"device":device,"point":point,"value":value,"unit":""}]}
                try:
                    req = __import__('urllib').request.Request(f"http://127.0.0.1:{api_port}/api/hub/data",
                        data=json.dumps(data).encode(),headers={"Content-Type":"application/json"})
                    __import__('urllib').request.urlopen(req,timeout=2)
                    logger.info(f"[data] {device}.{point}={value}")
                except: pass
            time.sleep(5)

    threading.Thread(target=simulate_devices, daemon=True).start()
    logger.info(f"Edge Hub ready — TCP:{tcp_port} API:{api_port}")
    logger.info("http://localhost:9101/api/hub/health")

    try:
        while True: time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Hub stopped")

if __name__ == "__main__":
    import sys
    api_port = int(sys.argv[1]) if len(sys.argv) > 1 else 9101
    start_edge_hub(api_port=api_port)
