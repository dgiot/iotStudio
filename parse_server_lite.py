#!/usr/bin/env python3
"""
parse_lite 独立服务 :1334 — Python 3.7 兼容 (无外部依赖)
=========================================================
对标 Node.js Parse Server REST API
使用内置 http.server + 手动路由, 无需 FastAPI/uvicorn
"""
import os, sys, json, time
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, BaseHTTPRequestHandler

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))
os.environ['PARSE_PG_DSN'] = 'postgresql://dgiot:YOUR_PG_PASSWORD@127.0.0.1:7432/parse'

# Direct import (not relative)
import importlib.util
_lite_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'parse_lite.py')
_spec = importlib.util.spec_from_file_location('parse_lite', _lite_path)
parse_lite = importlib.util.module_from_spec(_spec)
_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'parse_db.py')
_spec_db = importlib.util.spec_from_file_location('parse_db', _db_path)
parse_db = importlib.util.module_from_spec(_spec_db)
sys.modules['parse_db'] = parse_db
_spec_db.loader.exec_module(parse_db)
sys.modules['parse_lite'] = parse_lite
_spec.loader.exec_module(parse_lite)

# Import all names from parse_lite
for _name in dir(parse_lite):
    if not _name.startswith('_'):
        globals()[_name] = getattr(parse_lite, _name)

class ParseHandler(BaseHTTPRequestHandler):
    """Parse REST API Handler — 手动路由"""

    def do_GET(self):
        p = urlparse(self.path)
        path = p.path.rstrip('/')
        params = {k: v[0] for k, v in parse_qs(p.query).items()}
        try:
            result = self._route_get(path, params)
            self._json(result or {})
        except Exception as e:
            self._json({"error": str(e)}, 500)

    def do_POST(self):
        p = urlparse(self.path)
        path = p.path.rstrip('/')
        body = self._read_body()
        try:
            result = self._route_post(path, body)
            self._json(result or {})
        except Exception as e:
            self._json({"error": str(e)}, 500)

    def do_PUT(self):
        p = urlparse(self.path)
        path = p.path.rstrip('/')
        body = self._read_body()
        try:
            result = parse_update(*self._parse_class_oid(path), body)
            self._json(result or {})
        except Exception as e:
            self._json({"error": str(e)}, 500)

    def do_DELETE(self):
        p = urlparse(self.path)
        path = p.path.rstrip('/')
        try:
            result = parse_delete(*self._parse_class_oid(path))
            self._json(result or {})
        except Exception as e:
            self._json({"error": str(e)}, 500)

    # ── Routing ──
    def _route_get(self, path, params):
        parts = path.split('/')
        if path == '/parse/health':
            return {"status": "ok", "server": "parse_lite", "db": "PG", "port": 1334}
        if path == '/parse/schemas':
            return parse_get_schemas()
        if path == '/parse/login':
            return parse_login(params.get('username', ''), params.get('password', ''))
        if path.startswith('/parse/classes/'):
            cn, oid = self._parse_class_oid(path)
            if oid:
                return parse_get(cn, oid)
            return parse_query(cn, params)
        if path.startswith('/parse/aggregate/'):
            cn = parts[-1] if len(parts) > 3 else ''
            pipeline = json.loads(params.get('pipeline', '[]'))
            return parse_aggregate(cn, pipeline)
        return {"error": "Not found", "path": path}

    def _route_post(self, path, body):
        if path == '/parse/batch':
            return parse_batch(body.get('requests', []))
        if path == '/parse/logout':
            parse_logout(body.get('sessionToken', ''))
            return {}
        if path.startswith('/parse/classes/'):
            cn, _ = self._parse_class_oid(path)
            return parse_create(cn, body)
        if path.startswith('/parse/functions/'):
            parts = path.split('/')
            fn_name = parts[-1] if len(parts) > 3 else ''
            return call_function(fn_name, body)
        if path.startswith('/parse/aggregate/'):
            parts = path.split('/')
            cn = parts[-1] if len(parts) > 3 else ''
            return parse_aggregate(cn, body.get('pipeline', []))
        return {"error": "Not found", "path": path}

    # ── Helpers ──
    def _parse_class_oid(self, path):
        """ /parse/classes/ClassName → (ClassName, None)
            /parse/classes/ClassName/oid → (ClassName, oid)"""
        prefix = '/parse/classes/'
        if not path.startswith(prefix):
            return ('', None)
        rest = path[len(prefix):]
        parts = rest.split('/')
        return (parts[0], parts[1] if len(parts) > 1 else None)

    def _read_body(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length:
                return json.loads(self.rfile.read(length).decode())
        except:
            pass
        return {}

    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass  # 静默


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 1334
    server = HTTPServer(('0.0.0.0', port), ParseHandler)
    print(f'parse_lite :{port} — PG: 127.0.0.1:7432/parse (Node.js Parse Server :1337)')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
