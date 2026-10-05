# -*- coding: utf-8 -*-
"""DGAIOT 本体图谱 v3.0 底座服务（端口 48765 · dsh 家族冷僻段 · 仅本机回环）

本体技能包升级版（本地模型 全本地语义提取）对外统一入口。
只暴露本体图谱视图与数据两个端点，不托管整个 tools 目录（避免涉密文件暴露）。
仅绑定 127.0.0.1（本机工具服务纪律，不对外网暴露）。

用法:  python ontology_server.py          # 或由 start_services.bat 启动（独立窗口）
路由:  GET /        本体图谱视图（ECharts force 图，内嵌 v3 JSON）
       GET /graph   本体图数据 ontology_graph_v3.json
       GET /health  健康检查 + 图规模

⚠️ 本文件**不写死节点/边数**：规模随视图漂移，写在这里就是又一份手抄本。
   要数字问 `/health`（从视图内嵌 JSON 现算），或看 `G.meta`（唯一事实源）。
   历史教训：有一次订正规模数字，文档改了、本文件这一处漏了，
   于是同一事实在两处长期不一致。此处改为**不再声称**，只指向源。
   判据: tests/test_ontology_graph_artifact.py
"""
import sys, os, json
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

PORT = 48765
HERE = os.path.dirname(os.path.abspath(__file__))
VIEW = os.path.join(HERE, 'ontology_view.html')
# 视图回退：合并版视图在 frontend-vue/public/ontology_graph.html（同源），无本地视图时复用
# 2026-10-05: 允许用 ONTOLOGY_VIEW 指定外部视图（与 ONTOLOGY_GRAPH 对称；私料视图勿入本仓）
VIEW = os.environ.get('ONTOLOGY_VIEW') or VIEW
if not os.path.isfile(VIEW):
    _alt_view = os.path.join(HERE, '..', 'frontend-vue', 'public', 'ontology_graph.html')
    if os.path.isfile(_alt_view):
        VIEW = _alt_view
# 图数据默认取插件同目录（本地构建产物，不入库）；可通过环境变量指定
GRAPH = os.environ.get('ONTOLOGY_GRAPH', os.path.join(HERE, 'ontology_graph_v3.json'))


def view_scale(view_path=None):
    """从视图内嵌的 `const G = {...}` 现算图规模 —— 唯一的源，别处不许再手抄。

    返回 {'nodes': n, 'edges': m}；视图没有内嵌 JSON（如本地 ontology_view.html）
    时返回 None，**不猜、不兜底成某个数字**（兜底值比证据强是上一次的教训）。
    """
    import re
    path = view_path or VIEW
    try:
        html = open(path, encoding='utf-8').read()
    except OSError:
        return None
    m = re.search(r'^const G = (\{.*\});\s*$', html, re.M)
    if not m:
        return None
    try:
        g = json.loads(m.group(1))
    except ValueError:
        return None
    nodes, edges = g.get('nodes'), g.get('edges')
    if not isinstance(nodes, list) or not isinstance(edges, list):
        return None
    return {'nodes': len(nodes), 'edges': len(edges)}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # 静默访问日志
        pass

    def _send(self, body, ctype):
        self.send_response(200)
        self.send_header('Content-Type', ctype + '; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _static(self, rel):
        """外部视图（ONTOLOGY_VIEW）的相对资源：只放行**视图所在目录内**的文件，防目录穿越。

        2026-10-05 新增：底座的查看器原先只路由 `/`、`/graph`、`/health`，
        外部视图引用 `./vendor/echarts.min.js` 会 404 ⇒ 图表起不来。
        这里把视图同级目录作为静态根，业务插件即可自带离线资源（底座不搬私料）。
        """
        base = os.path.dirname(os.path.abspath(VIEW))
        target = os.path.abspath(os.path.join(base, rel.lstrip('/')))
        if not target.startswith(base + os.sep) or not os.path.isfile(target):
            self.send_response(404); self.end_headers(); return
        ext = os.path.splitext(target)[1].lower()
        ctype = {'.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
                 '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon'}.get(
                     ext, 'application/octet-stream')
        self._send(open(target, 'rb').read(), ctype)

    def do_GET(self):
        p = self.path.split('?')[0]
        if p.startswith('/vendor/') or p.startswith('/assets/'):
            self._static(p)
        elif p in ('/', '/index.html'):
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
            scale = view_scale()
            # 算不出来就直说 "scale":"unknown"，不填一个看起来合理的数
            body = json.dumps({'status': 'ok', 'view': VIEW,
                               'scale': scale or 'unknown'},
                              ensure_ascii=False).encode('utf-8')
            self._send(body, 'application/json')
        else:
            self.send_response(404); self.end_headers()


class Server(ThreadingMixIn, HTTPServer):
    daemon_threads = True


if __name__ == '__main__':
    # 只在真正起服务时改 stdout —— import 本模块（判据要 import）不该动全局状态
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    print(f'DGAIOT 本体图谱 v3.0 底座服务 → http://localhost:{PORT}')
    print(f'  视图: /  数据: /graph  健康: /health')
    Server(('127.0.0.1', PORT), Handler).serve_forever()
