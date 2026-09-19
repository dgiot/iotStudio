"""
菜单管理 API — 菜单展示层的覆写
================================
设计取向：**静态路由定「有哪些页面」，本接口定「怎么展示」**。

  · 页面本身由 frontend-vue/src/router/index.js 定义 —— 没有组件就没有页面，
    这一点不该被数据驱动绕过（否则菜单点进去是白屏）。
  · 这里按 path 存**覆写**：标题 / 图标 / 分组 / 排序 / 显隐 / 外链。
    前端 Sidebar 拿静态路由做底，再把覆写盖上去。
  · `external` 非空即渲染成外链，此时不需要对应组件 ——
    所以「加一个菜单指向外部系统」这件事，改数据就能做到。
    两种落点：默认**新窗口**；`embed=true` 则**底座内嵌**（iframe，
    见 views/PluginFrameView.vue），侧栏顶栏保留。
  · `embed` 型是「加一个插件 = 多一个应用」这条路的接缝：插件自己服务前端、
    自己发版，底座只认一条菜单覆写，**不需要改底座代码**。
  · 删掉一条覆写 = 还原成静态路由的原始样子，不是删页面。

存储：parse_lite 的 Menu 类，字段全在 data JSON 里。

端点（全部要求 admin）:
  GET    /api/admin/menus            覆写列表
  PUT    /api/admin/menus            新增/更新一条（按 path 键匹配）
  DELETE /api/admin/menus/{path}     删除覆写（还原默认）
  POST   /api/admin/menus/reset      清空全部覆写
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import json
import logging

from ..auth import require_admin, get_current_user

log = logging.getLogger("menu_mgr")

# ⚠️ 只有**写**要 admin，**读**只要登录。
#    侧边栏每次渲染都要读菜单覆写，如果 GET 也要 admin，普通用户一进来就 401；
#    前端 axios 拦截器遇 401 会清 token 并跳登录页 —— 等于普通账号根本进不去系统。
router = APIRouter(prefix="/api/admin/menus", tags=["Menu Management"])

# 分组白名单 —— 与前端 utils/constants.js 的 MENU_GROUPS 对齐。
# 前端那边加组时这里也要加，否则新组的覆写存不进来。
VALID_GROUPS = ["monitor", "device", "hmi", "data", "graph", "network", "base", "system"]

# 路径长度上限：够长能表达层级，又能挡住把整个 JSON 塞进 path 的用法
MAX_PATH = 200


class MenuItem(BaseModel):
    path: str
    title: str = ""
    icon: str = ""
    group: str = ""
    order: float = 99
    visible: bool = True
    external: Optional[str] = None
    # embed=True ⇒ 底座**内嵌**打开（iframe，见 PluginFrameView），而非新窗口。
    # 配合约定 path `/plugin/<包名>`（router 有 `/plugin/:name` 通用路由）。
    embed: bool = False
    note: str = ""


def _find_by_path(path: str):
    """按 path 找覆写行 —— path 是业务键，同一 path 只允许一条。

    ⚠️ 要试两个写法：路由 `/{path:path}` 的转换器会把**前导斜杠吃掉**，
    `DELETE /api/admin/menus/devices` 取到的是 `devices`，而菜单键存的是
    `/devices` —— 只按原样查会永远 404，表现成「删不掉自己的覆写」。
    外链菜单的键（如 `ext-grafana`）本来就没斜杠，所以不能反过来无脑补斜杠，
    只能两种都试。
    """
    from ..parse_lite import parse_query
    for cand in (path, "/" + path.lstrip("/")):
        r = parse_query("Menu", {"where": json.dumps({"path": cand}), "limit": 1})
        row = (r.get("results") or [None])[0]
        if row:
            return row
    return None


@router.get("", dependencies=[Depends(get_current_user)])
async def list_menus():
    """全部菜单覆写（登录即可读 —— 侧边栏渲染要用）"""
    from ..parse_lite import parse_query
    r = parse_query("Menu", {"limit": 500, "order": "order"})
    rows = r.get("results", [])
    return {"results": rows, "count": len(rows), "groups": VALID_GROUPS}


@router.put("", dependencies=[Depends(require_admin)])
async def upsert_menu(body: MenuItem, user: dict = Depends(require_admin)):
    """新增或更新一条菜单覆写（按 path 匹配，存在则改、不存在则建）"""
    from ..parse_lite import parse_create, parse_update
    path = (body.path or "").strip()
    if not path:
        raise HTTPException(400, "path 不能为空")
    if len(path) > MAX_PATH:
        raise HTTPException(400, f"path 过长（>{MAX_PATH}）")
    if body.group and body.group not in VALID_GROUPS:
        raise HTTPException(400, f"未知分组 {body.group}（可选 {VALID_GROUPS}）")

    # ⚠️ 协议白名单，**对所有 external 生效**（不只是 embed 型）：
    #    非 embed 时它是 `<a href>`，embed 时它是 iframe 的 src ——
    #    `javascript:` 走前者是 XSS，`data:` 走后者能伪装任意站点。
    #    在**写入口**挡住，比在渲染处挡更可靠：渲染有好几处（Sidebar / FrameView）。
    ext = (body.external or "").strip()
    if ext and not ext.lower().startswith(("http://", "https://")):
        raise HTTPException(400, "external 只允许 http:// 或 https:// 开头")

    payload = {
        "path": path,
        "title": body.title, "icon": body.icon, "group": body.group,
        "order": body.order, "visible": body.visible,
        "external": ext, "embed": body.embed, "note": body.note,
        "updatedBy": user.get("sub", ""),
    }
    existing = _find_by_path(path)
    if existing and existing.get("objectId"):
        parse_update("Menu", existing["objectId"], payload)
        return {"status": "updated", "path": path, "objectId": existing["objectId"]}
    payload["createdBy"] = user.get("sub", "")
    r = parse_create("Menu", payload)
    return {"status": "created", "path": path, **r}


@router.delete("/{path:path}", dependencies=[Depends(require_admin)])
async def delete_menu(path: str):
    """删除覆写 —— 还原成静态路由的原始展示，页面本身不受影响"""
    from ..parse_lite import parse_delete
    row = _find_by_path(path)
    if not row:
        raise HTTPException(404, f"没有 {path} 的覆写")
    parse_delete("Menu", row["objectId"])
    return {"status": "reverted", "path": path}


@router.post("/reset", dependencies=[Depends(require_admin)])
async def reset_menus():
    """清空全部覆写"""
    from ..parse_lite import parse_query, parse_delete
    r = parse_query("Menu", {"limit": 500})
    n = 0
    for row in r.get("results", []):
        try:
            parse_delete("Menu", row["objectId"])
            n += 1
        except Exception as e:
            log.warning("删除菜单覆写失败 %s: %s", row.get("objectId"), e)
    return {"status": "ok", "deleted": n}
