#!/usr/bin/env python3
"""ABAC PDP server - stdlib only, runs next to the broker (WSL loopback).

POST /mqtt/acl  {username, clientid, topic, action} -> text/plain allow|deny|ignore
GET  /health    -> ok

Env: ABAC_POLICIES_PATH (hot-reloaded on mtime change), ABAC_PDP_PORT (default 8383).
The Erlang side (dgiot_pdp_acl) consults this endpoint on the client.check_acl
hook for every dgiot/... doctrine topic; policy edits never restart the broker.
"""
import json
import os
import pathlib
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer  # noqa: E402

from src import abac  # noqa: E402


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[pdp] " + fmt % args, flush=True)

    def do_GET(self):
        if self.path == "/health":
            return self._text(200, "ok")
        self._text(404, "not found")

    def do_POST(self):
        if self.path != "/mqtt/acl":
            return self._text(404, "not found")
        try:
            n = int(self.headers.get("Content-Length") or 0)
            body = json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            return self._text(200, "ignore")
        r = abac.decide(username=str(body.get("username") or ""),
                        clientid=str(body.get("clientid") or ""),
                        action=str(body.get("action") or ""),
                        topic=str(body.get("topic") or ""))
        print("[pdp] decide %s %s user=%r client=%r -> %s (%s)"
              % (body.get("action"), body.get("topic"), body.get("username"),
                 body.get("clientid"), r["decision"], r["reason"]), flush=True)
        self._text(200, r["decision"])

    def _text(self, code, s):
        b = s.encode()
        self.send_response(code)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)


if __name__ == "__main__":
    port = int(os.environ.get("ABAC_PDP_PORT", "8383"))
    print("[pdp] ABAC PDP listening :%d (policies hot-reload on, path=%s)"
          % (port, abac._policies_path()), flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
