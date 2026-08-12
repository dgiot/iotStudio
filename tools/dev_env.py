#!/usr/bin/env python3
"""
131 模拟开发环境 — 一键启动
===========================
完全离线 · 纯 Python · 可调测

双击 dev_env.bat 或 python dev_env.py

端口:
  :1334   parse_lite (Parse REST API)
  :8000   FastAPI (应用层)
  :21883  内置 MQTT Broker
  :1502   Modbus 储能模拟器
  :2502   Modbus 充电桩模拟器
  :2404   IEC104 模拟器
"""
import os, sys, time, subprocess, socket, logging, threading
from pathlib import Path

ROOT = Path(__file__).parent
os.chdir(str(ROOT))
sys.path.insert(0, str(ROOT / 'src'))

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)s] %(message)s')
log = logging.getLogger('dev_env')

def port_alive(port, timeout=0.5):
    try:
        s = socket.create_connection(('127.0.0.1', port), timeout=timeout); s.close()
        return True
    except: return False

def run_bg(name, port, desc, script_path):
    if port_alive(port):
        log.info(f'[{name}] :{port} already running')
        return None
    log.info(f'[{name}] :{port} start — {desc}')
    args = [sys.executable, script_path]
    return subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, cwd=str(ROOT))

def seed():
    """预置模拟数据"""
    try:
        os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:CHANGEME@127.0.0.1:7432/parse'
        from src.parse_lite import parse_create, ensure_table
        devices = [
            ('pcs_001', '储能PCS-1', 'pcs'), ('charger_001', '充电桩-1', 'charger'),
            ('meter_001', '智能电表-1', 'meter'), ('oilwell_131', '131模拟井', 'oilwell'),
        ]
        ensure_table('Device')
        for did, name, dt in devices:
            try: parse_create('Device', {'objectId': did, 'name': name, 'deviceType': dt, 'status': 'online', 'devaddr': did, 'tenant_id': 'default'})
            except: pass
        log.info(f'[seed] {len(devices)} devices')
    except Exception as e:
        log.warning(f'[seed] skip: {e}')


def start_parse_lite():
    """内嵌 parse_lite :1334 — 纯 Python http.server"""
    if port_alive(1334):
        log.info('[parse_lite] :1334 already running')
        return None

    os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:CHANGEME@127.0.0.1:7432/parse'

    def run_server():
        from http.server import HTTPServer, BaseHTTPRequestHandler
        from urllib.parse import urlparse, parse_qs
        from src.parse_lite import (parse_query, parse_get, parse_create, parse_update,
                                     parse_delete, parse_batch, parse_login, parse_logout,
                                     parse_get_schemas, call_function)
        import json as _json

        class H(BaseHTTPRequestHandler):
            def _p(self): p=urlparse(self.path);return p.path.rstrip('/'),{k:v[0] for k,v in parse_qs(p.query).items()}
            def _b(self):
                try:
                    l=int(self.headers.get('Content-Length',0))
                    return _json.loads(self.rfile.read(l)) if l else {}
                except: return {}
            def _j(self,d,s=200):
                b=_json.dumps(d,ensure_ascii=False).encode()
                self.send_response(s);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(b)));self.end_headers();self.wfile.write(b)
            def _split(self,p):
                r=p.replace('/parse/classes/','');p=r.split('/');return p[0],p[1] if len(p)>1 else None
            def do_GET(self):
                p,q=self._p()
                try:
                    if p=='/parse/health':return self._j({'status':'ok','server':'parse_lite','db':'PG'})
                    if p=='/parse/schemas':return self._j(parse_get_schemas())
                    if p=='/parse/login':return self._j(parse_login(q.get('username',''),q.get('password','')))
                    if p.startswith('/parse/classes/'):
                        cn,oid=self._split(p)
                        if oid: return self._j(parse_get(cn,oid))
                        return self._j(parse_query(cn,q))
                    self._j({'error':'not found'},404)
                except Exception as e:self._j({'error':str(e)},500)
            def do_POST(self):
                p,q=self._p();b=self._b()
                try:
                    if p=='/parse/batch':return self._j(parse_batch(b.get('requests',[])))
                    if p=='/parse/logout':parse_logout(b.get('sessionToken',''));return self._j({})
                    if p.startswith('/parse/classes/'):
                        cn,_=self._split(p);return self._j(parse_create(cn,b))
                    if p.startswith('/parse/functions/'):
                        return self._j(call_function(p.rsplit('/',1)[-1],b))
                    self._j({'error':'not found'},404)
                except Exception as e:self._j({'error':str(e)},500)
            def do_PUT(self):
                p,q=self._p();b=self._b()
                try:
                    cn,oid=self._split(p)
                    if oid:return self._j(parse_update(cn,oid,b))
                except Exception as e:self._j({'error':str(e)},500)
            def do_DELETE(self):
                p,q=self._p()
                try:
                    cn,oid=self._split(p)
                    if oid:return self._j(parse_delete(cn,oid))
                except Exception as e:self._j({'error':str(e)},500)
            def log_message(self,f,*a):pass

        log.info('[parse_lite] :1334 started')
        HTTPServer(('0.0.0.0',1334),H).serve_forever()

    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(1)
    return t


def main():
    print(r'''
+=====================================================+
|  131 DEV ENV — DG-IoT Offline Dev                   |
+=====================================================+
|  parse_lite   :1334   Parse REST API                |
|  FastAPI      :8000   App + Admin                   |
|  MQTT Broker  :21883  Built-in Broker               |
|  Modbus PCS   :1502   Energy Storage Sim            |
|  Modbus Charg :2502   Charger Sim                   |
|  IEC 104      :2404   Station Control Sim           |
|                                                     |
|  Admin: http://localhost:8000/admin                 |
+=====================================================+
''')
    # Seed data
    seed()

    # Start parse_lite inline
    start_parse_lite()

    # Start other services
    procs = []
    svc_list = [
        ('fastapi', 8000, 'FastAPI App', str(ROOT / 'src' / 'main.py')),
        ('pcs_sim', 1502, 'Modbus PCS', str(ROOT / 'simulators' / 'modbus_tcp_server.py')),
        ('charger_sim', 2502, 'Modbus Charger', str(ROOT / 'simulators' / 'modbus_tcp_server.py')),
        ('iec104', 2404, 'IEC104 Server', str(ROOT / 'simulators' / 'iec104_server.py')),
    ]
    for name, port, desc, path in svc_list:
        p = run_bg(name, port, desc, path)
        if p: procs.append((name, p))
        time.sleep(0.3)

    # MQTT broker
    if not port_alive(21883):
        try:
            import asyncio as _a
            from src.services.mqtt_broker import start_builtin_broker
            _a.get_event_loop().run_until_complete(start_builtin_broker("0.0.0.0", 21883))
        except: pass

    time.sleep(2)
    print()
    for name, port in [('parse_lite',1334),('fastapi',8000),('mqtt',21883),('pcs',1502),('charger',2502),('iec104',2404)]:
        s = 'OK' if port_alive(port) else 'OFF'
        print(f'  [{s}] {name:12s} :{port}')
    print('\nCtrl+C to stop all\n')

    try:
        while True: time.sleep(1)
    except KeyboardInterrupt:
        for name, proc in procs:
            try: proc.terminate(); proc.wait(3)
            except: proc.kill()
        print('All stopped')


if __name__ == '__main__':
    main()
