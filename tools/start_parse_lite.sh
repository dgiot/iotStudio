#!/bin/bash
# Start parse_lite standalone on edge-dmz :1334
# Run: bash /mnt/d/ai/dgiot_lite/start_parse_lite.sh
export PARSE_PG_DSN="postgresql://dgiot:CHANGEME@127.0.0.1:7432/parse"
cd /mnt/d/ai/dgiot_lite
PYTHONPATH=/mnt/d/ai/dgiot_lite/src python3 -c "
import os, sys, json
from parse_lite import *
from parse_db import get_backend, get_db_compat
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, BaseHTTPRequestHandler

class ParseHandler(BaseHTTPRequestHandler):
    def _params(self):
        p = urlparse(self.path)
        return {k: v[0] for k, v in parse_qs(p.query).items()}
    def _body(self):
        try:
            l = int(self.headers.get('Content-Length', 0))
            return json.loads(self.rfile.read(l).decode()) if l else {}
        except: return {}
    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def _split(self, path):
        p = path.replace('/parse/classes/', '')
        parts = p.split('/')
        return parts[0], parts[1] if len(parts) > 1 else None
    def do_GET(self):
        p = urlparse(self.path).path.rstrip('/')
        q = self._params()
        try:
            if p == '/parse/health':
                return self._json({'status':'ok','server':'parse_lite','db':'PG'})
            if p == '/parse/schemas':
                return self._json(parse_get_schemas())
            if p == '/parse/login':
                return self._json(parse_login(q.get('username',''), q.get('password','')))
            if p.startswith('/parse/classes/'):
                cn, oid = self._split(p)
                if oid: return self._json(parse_get(cn, oid))
                return self._json(parse_query(cn, q))
            self._json({'error':'not found'}, 404)
        except Exception as e:
            self._json({'error': str(e)}, 500)
    def do_POST(self):
        p = urlparse(self.path).path.rstrip('/')
        b = self._body()
        try:
            if p == '/parse/batch':
                return self._json(parse_batch(b.get('requests',[])))
            if p == '/parse/logout':
                parse_logout(b.get('sessionToken',''))
                return self._json({})
            if p.startswith('/parse/classes/'):
                cn, _ = self._split(p)
                return self._json(parse_create(cn, b))
            if p.startswith('/parse/functions/'):
                fn = p.rsplit('/',1)[-1]
                return self._json(call_function(fn, b))
            self._json({'error':'not found'}, 404)
        except Exception as e:
            self._json({'error': str(e)}, 500)
    def do_PUT(self):
        p = urlparse(self.path).path.rstrip('/')
        b = self._body()
        try:
            cn, oid = self._split(p)
            if oid: return self._json(parse_update(cn, oid, b))
        except Exception as e:
            self._json({'error': str(e)}, 500)
    def do_DELETE(self):
        p = urlparse(self.path).path.rstrip('/')
        try:
            cn, oid = self._split(p)
            if oid: return self._json(parse_delete(cn, oid))
        except Exception as e:
            self._json({'error': str(e)}, 500)
    def log_message(self, fmt, *args): pass

port = 1334
print(f'parse_lite :{port} — PG:127.0.0.1:7432 (Parse Server :1337)')
HTTPServer(('0.0.0.0', port), ParseHandler).serve_forever()
"