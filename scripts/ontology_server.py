# -*- coding: utf-8 -*-
"""DGAIOT 本体图谱 v3.0 底座服务（端口 48765 · dsh 家族冷僻段 · 仅本机回环）

本体技能包升级版（qwen2.5:7b 全本地语义提取 · 92 节点 59 边）对外统一入口。
只暴露本体图谱视图与数据两个端点，不托管整个 tools 目录（避免涉密文件暴露）。
仅绑定 127.0.0.1（本机工具服务纪律，不对外网暴露）。

用法:  python ontology_server.py          # 或由 start_services.bat 启动（独立窗口）
路由:  GET /        本体图谱视图（ECharts force 图，内嵌 v3 JSON）
       GET /graph   本体图数据 ontology_graph_v3.json
       GET /health  健康检查
"""
import sys, os, json
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
PORT = 48765
HERE = os.path.dirname(os.path.abspath(__file__))
VIEW = os.path.join(HERE, 'ontology_view.html')
# 图数据默认取插件同目录（本地构建产物，不入库）；可通过环境变量指定
GRAPH = os.environ.get('ONTOLOGY_GRAPH', os.path.join(HERE, 'ontology_graph_v3.json'))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # 静默访问日志
        pass

    def _send(self, body, ctype):
        self.send_response(200)
        self.send_header('Content-Type', ctype + '; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = self.path.split('?')[0]
        if p in ('/', '/index.html'):
            if os.path.isfile(VIEW):
                self._send(open(VIEW, 'rb').read(), 'text/html')
            else:
                self.send_response(404); self.end_headers()
        elif p == '/graph':
            if os.path.isfile(GRAPH):
                self._send(open(GRAPH, 'rb').read(), 'application/json')
            else:
                self.send_response(404); self.end_headers()
        elif p == '/health':
            self._send(b'ok', 'text/plain')
        else:
            self.send_response(404); self.end_headers()


class Server(ThreadingMixIn, HTTPServer):
    daemon_threads = True


if __name__ == '__main__':
    print(f'DGAIOT 本体图谱 v3.0 底座服务 → http://localhost:{PORT}')
    print(f'  视图: /  数据: /graph  健康: /health')
    Server(('127.0.0.1', PORT), Handler).serve_forever()
