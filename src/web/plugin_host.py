# ============================================================
# 插件托管 (PR-G) — 端口统一的第二半
# ============================================================
"""
插件的**页面与端点都由底座发**, 插件不再自己起 HTTP 服务。
「加一个插件 = 多一个应用」于此不再需要每个包各占一个端口。

一切都落在**同一个前缀** `/api/plugin/<包名>/` 之下:

  /api/plugin/ami_metering/          → 包内 web/index.html (页面壳)
  /api/plugin/ami_metering/app.js    → 包内 web/app.js
  /api/plugin/ami_metering/selftest  → 插件用 ctx.route() 注册的处理器

查找顺序是**先注册端点、后静态文件** —— 同名的处理器的意图更明确。

前缀必须在 `/api/` 之下, 这是硬约束不是偏好:
底座有一条 `@app.get("/{full_path:path}")` 的 SPA 兜底 (main.py:2158),
它对任何**非 api 开头**的未命中路径都返回 base 的 index.html ——
插件页挂在别的前缀下会被兜成底座首页, 表现成「点进去是本系统的首页」,
而且不报任何错。

三条边界, 都是有意的:

1. **只放 `web/` 一个子目录**, 包根绝不外露。包根下有 `data/`
   (可能被环境变量指到现场真值)、有 `.git`、有 `plugin.py`。
   把包根挂出去等于把「数据外置」这条纪律反过来做。
2. **页面壳公开, 数据不公开**。iframe 是浏览器直接导航, 不带 sessionToken
   请求头 —— 页面壳要鉴权就没法内嵌。所以壳公开、数据走带鉴权的
   /api/graph/*, 页内 JS 从同源 localStorage 取会话令牌。
   这与底座自己的做法一致: index.html 公开, 数据不公开。
   **推论: `web/` 里不许放数据, 放了就是公开的。**
3. **路径穿越挡住**。resolve 之后必须仍在 `web/` 之下。
"""
from __future__ import annotations

import inspect
import json
import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from starlette.responses import Response

log = logging.getLogger("plugin.host")

router = APIRouter(prefix="/api/plugin", tags=["Plugin Host"])

# 与 main.py 的 _MIME_MAP 同款 (Windows 上 mimetypes 认不对 .js/.mjs)。
# 不 import 那一份: main.py 在 include_router 之后才定义它, 且反向 import 会成环。
_MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".ico": "image/x-icon", ".webp": "image/webp",
    ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8", ".map": "application/json",
}


def _web_root(pkg: str) -> Optional[Path]:
    """插件 pkg 的 web/ 目录 —— 不存在就 None (不抛, 让调用方出 404)"""
    from ..plugin_runtime import runtime
    pdir = runtime.plugin_dir(pkg)
    if not pdir:
        return None
    root = Path(pdir) / "web"
    return root if root.is_dir() else None


def _static(pkg: str, rel: str) -> Response:
    root = _web_root(pkg)
    if root is None:
        raise HTTPException(404, f"没有插件 {pkg!r} 的 web/ 目录")
    rel = (rel or "").lstrip("/")
    if not rel or rel.endswith("/"):
        rel += "index.html"
    # ⚠️ 穿越守卫: 先 resolve 再比前缀。`..%2f` 之类在 Starlette 解码之后
    #    就变成了真的 `..`, 只做字符串检查会漏。
    base = root.resolve()
    target = (base / rel).resolve()
    if target != base and not target.is_relative_to(base):
        log.warning(f"[plugin] 拦下越界访问 {pkg}: {rel}")
        raise HTTPException(400, "非法路径")
    if not target.is_file():
        raise HTTPException(404, f"{pkg}/web/{rel} 不存在")
    ext = target.suffix.lower()
    headers = {"Cache-Control": "no-store"} if ext in (".html", ".js", ".mjs", ".css") else {}
    return Response(content=target.read_bytes(),
                    media_type=_MIME.get(ext, "application/octet-stream"), headers=headers)


async def _dispatch(req: Request, pkg: str, rel: str):
    """先查注册端点, 没有再落静态文件 —— 查找顺序就是这两句的先后"""
    from ..plugin_runtime import runtime
    full = "/api/plugin/%s/%s" % (pkg, rel.strip("/"))
    hit = runtime.match_route(req.method, full) or runtime.match_route(req.method, full.rstrip("/"))
    if hit and hit["plugin"] == pkg:
        body = None
        if req.method in ("POST", "PUT", "PATCH"):
            raw = await req.body()
            if raw:
                try:
                    body = json.loads(raw.decode("utf-8"))
                except Exception:
                    body = raw.decode("utf-8", "replace")
        arg = {"method": req.method, "path": rel, "pkg": pkg,
               "query": dict(req.query_params), "body": body}
        try:
            out = hit["handler"](arg)
            if inspect.isawaitable(out):
                out = await out
        except Exception as e:
            # 失败隔离: 一个插件端点出错不该把整个底座带走
            log.error(f"[plugin] {pkg} 端点 {full} 异常: {e}")
            raise HTTPException(500, f"{pkg} 端点异常: {type(e).__name__}: {e}")
        status = 200
        if isinstance(out, tuple) and len(out) == 2:
            status, out = out
        if isinstance(out, Response):
            return out
        return Response(content=json.dumps(out, ensure_ascii=False, default=str),
                        media_type="application/json; charset=utf-8", status_code=status)
    return _static(pkg, rel)


# ⚠️ 注册顺序在这份文件里是有意义的: `{rel:path}` 会吃掉 `{pkg}` 能匹配的一切,
#    所以「首页」这条必须写在它**前面**。跨文件则是 main.py 里 plugin_host_router
#    的 include_router 位置 (必须在 SPA 兜底 main.py:2158 之前)。
@router.get("/{pkg}")
async def plugin_index(pkg: str):
    """插件应用首页 —— 内嵌时这就是 iframe 的 src (/api/plugin/<包名>/)"""
    return _static(pkg, "")


@router.api_route("/{pkg}/{rel:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def plugin_any(req: Request, pkg: str, rel: str):
    return await _dispatch(req, pkg, rel)
