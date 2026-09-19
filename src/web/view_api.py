"""
视图管理 API — 组态/拓扑画布存档
================================
背景：ScadaView / TopologyView 原先把画布写进 localStorage（`scada_canvas` /
`topo_layout`），只存在**那一台浏览器**里 —— 换机器没了、清缓存没了、别人看不到，
三个视图（数据报表 / 2D组态 / 设备拓扑）甚至根本没挂路由，等于白写。

这一层把画布变成后端的正式对象：可命名、可多份、可设默认、可删。

存储：parse_lite 的 View 类（objectId + data JSON），字段全在 data 里：
  name / type / canvas / desc / isDefault / site / createdBy

端点（均要求登录）:
  GET    /api/views                 列表（不含画布本体，避免一次拉几百 KB）
  GET    /api/views/{id}            单个（含画布）
  POST   /api/views                 新建
  PUT    /api/views/{id}            改（改名 / 存画布 / 改描述）
  DELETE /api/views/{id}            删
  PUT    /api/views/{id}/default    设为该类型的默认视图
  GET    /api/views/default/{type}  取该类型默认视图（页面打开时加载用）
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Any, Optional

from ..auth import get_current_user

router = APIRouter(prefix="/api/views", tags=["View Management"])

# 允许的视图类型 —— 与前端三个孤儿视图一一对应
VALID_TYPES = {"scada": "2D 组态", "topology": "设备拓扑", "report": "数据报表"}

# 画布 JSON 上限（字符）。画布是坐标+连线，正常几 KB；超过这个量级说明前端出问题了
MAX_CANVAS_CHARS = 4 * 1024 * 1024


def _summarize(row: dict) -> dict:
    """列表用摘要 —— 去掉画布本体，只留元信息 + 一个尺寸提示"""
    canvas = row.get("canvas")
    canvas_size = len(canvas) if isinstance(canvas, str) else (
        len(str(canvas)) if canvas else 0)
    return {
        "objectId": row.get("objectId"),
        "name": row.get("name") or "(未命名)",
        "type": row.get("type") or "scada",
        "type_name": VALID_TYPES.get(row.get("type", ""), row.get("type", "")),
        "desc": row.get("desc", ""),
        "isDefault": bool(row.get("isDefault")),
        "site": row.get("site", ""),
        "createdBy": row.get("createdBy", ""),
        # 归属租户。空串 = 不绑租户（存量行都长这样）= 各租户共享。
        # 显式回出来，是为了「共享」这件事**看得见** —— 靠默认值假装它不存在，
        # 是这类隔离改造最常见的漏法。
        "tenant": row.get("tenant_id") or "",
        "canvas_size": canvas_size,
        "node_count": row.get("node_count", 0),
        "createdAt": row.get("createdAt", ""),
        "updatedAt": row.get("updatedAt", ""),
        # 前端保存时要原样带回，用于并发检查
        "version": row.get("version", 0) or 0,
    }


@router.get("")
async def list_views(type: str = "", user: dict = Depends(get_current_user)):
    """视图列表（默认全部类型；?type=scada 过滤）"""
    from ..parse_lite import parse_query
    params = {"limit": 200, "order": "-updatedAt"}
    if type:
        import json as _json
        params["where"] = _json.dumps({"type": type})
    r = parse_query("View", params, user=user)
    items = [_summarize(row) for row in r.get("results", [])]
    return {"results": items, "count": len(items), "types": VALID_TYPES}


@router.get("/default/{vtype}")
async def get_default(vtype: str, site: Optional[str] = None,
                      user: dict = Depends(get_current_user)):
    """取某类型的默认视图（含画布）—— 页面打开时用

    没有默认视图时返回 canvas=None，前端据此走内置示例画布，不算错误。

    site 三态（默认视图的判据里带了站点，取的时候必须能对上）：
      · 不传     —— 不按站点过滤，全部里挑（老调用方行为不变）
      · site=""  —— 只看不绑站点的那些
      · site=x   —— 只看 x 站的；x 站没设默认则回退到「不绑站点」的那份，
                    这样全局共用一份组态时不必每个站各存一遍
    """
    import json as _json
    from ..parse_lite import parse_query
    if vtype not in VALID_TYPES:
        raise HTTPException(400, f"未知视图类型: {vtype}（可选 {list(VALID_TYPES)}）")
    r = parse_query("View", {"where": _json.dumps({"type": vtype}), "limit": 100,
                             "order": "-updatedAt"}, user=user)
    rows = r.get("results", [])

    def pick(cands):
        return next((x for x in cands if x.get("isDefault")), cands[0] if cands else None)

    if site is None:
        default = pick(rows)
    else:
        default = pick([x for x in rows if (x.get("site", "") or "") == site])
        if not default and site != "":
            # 站点没设默认 → 回退到不绑站点的那份（全局共用组态）
            default = pick([x for x in rows if not (x.get("site", "") or "")])
    if not default:
        return {"canvas": None, "view": None, "count": 0}
    return {"canvas": default.get("canvas"), "view": _summarize(default),
            "count": len(rows)}


@router.get("/{view_id}")
async def get_view(view_id: str, user: dict = Depends(get_current_user)):
    """单个视图（含画布）"""
    from ..parse_lite import parse_get
    row = parse_get("View", view_id, user=user)
    if not row:
        raise HTTPException(404, "视图不存在")
    return row


class ViewBody(BaseModel):
    name: str = ""
    type: str = "scada"
    canvas: Optional[Any] = None
    desc: str = ""
    site: str = ""
    node_count: int = 0
    isDefault: bool = False
    # 乐观锁版本号。None = 不做并发检查（兼容老调用方）；
    # 给了就必须和库里的一致，否则 409 —— 见 update_view。
    version: Optional[int] = None


def _check_canvas(canvas) -> None:
    if canvas is None:
        return
    n = len(canvas) if isinstance(canvas, str) else len(str(canvas))
    if n > MAX_CANVAS_CHARS:
        raise HTTPException(413, f"画布过大（{n} 字符 > 上限 {MAX_CANVAS_CHARS}）")


@router.post("")
async def create_view(body: ViewBody, user: dict = Depends(get_current_user)):
    """新建视图"""
    from ..parse_lite import parse_create
    if body.type not in VALID_TYPES:
        raise HTTPException(400, f"未知视图类型: {body.type}")
    _check_canvas(body.canvas)
    name = (body.name or "").strip() or "未命名视图"
    payload = {
        "name": name, "type": body.type, "canvas": body.canvas,
        "desc": body.desc, "site": body.site,
        "node_count": body.node_count, "isDefault": False,
        "createdBy": user.get("sub", ""),
        "version": 0,
    }
    r = parse_create("View", payload, user=user)
    if body.isDefault and r.get("objectId"):
        await set_default(r["objectId"], user=user)
    return r


@router.put("/{view_id}")
async def update_view(view_id: str, body: ViewBody, user: dict = Depends(get_current_user)):
    """更新视图（改名 / 存画布 / 改描述）—— **只改本次真的传了的字段**

    「没传」不等于「传了空值」：组态页存画布时只带 canvas + version，
    描述和站点根本没打算动。要是照 ViewBody 的默认值一律写回，
    desc 会被 "" 冲掉 —— 在「视图管理」里写的说明，回组态页一存就没了。
    所以按 model_fields_set 取客户端**显式传过**的字段（pydantic v2 语义），
    而不是按模型默认值。这也让 canvas=None 的「本次不动画布」从特例变成通则。

    **并发**：body.version 给了就做乐观锁。组态画布是整块 JSON，两个人同时
    在画布上拖元件时后保存的那个会把前一个整块盖掉，且没有任何提示 ——
    这类丢失比报错难查得多。带上版本号，不一致就 409，让前端提示重载。
    不传 version 的调用方（脚本、老前端）行为不变。
    """
    from ..parse_lite import parse_get, parse_update
    row = parse_get("View", view_id, user=user)
    if not row:
        raise HTTPException(404, "视图不存在")

    cur = row.get("version", 0) or 0
    if body.version is not None and int(body.version) != cur:
        raise HTTPException(
            409, f"视图已被他人修改（当前版本 {cur}，你手上是 {body.version}），请重新加载后再改")

    _check_canvas(body.canvas)
    sent = body.model_fields_set
    patch = {"version": cur + 1}
    for f in ("desc", "site", "node_count"):
        if f in sent:
            patch[f] = getattr(body, f)
    # 空名字不是有效名字（create 那边也会兜成「未命名视图」）——
    # 传空串当「不改名」，免得把名字洗成空白
    if (body.name or "").strip():
        patch["name"] = body.name.strip()
    if body.type in VALID_TYPES:
        patch["type"] = body.type
    if body.canvas is not None:
        patch["canvas"] = body.canvas
    r = parse_update("View", view_id, patch, user=user)
    if body.isDefault:
        await set_default(view_id, user=user)
    # 把新版本号回给前端，它接着用这个号存下一次，不然第二次必 409
    if isinstance(r, dict):
        r["version"] = cur + 1
    return r


@router.delete("/{view_id}")
async def delete_view(view_id: str, user: dict = Depends(get_current_user)):
    """删除视图"""
    from ..parse_lite import parse_get, parse_delete
    row = parse_get("View", view_id, user=user)
    if not row:
        raise HTTPException(404, "视图不存在")
    parse_delete("View", view_id, user=user)
    return {"status": "deleted", "objectId": view_id, "name": row.get("name", "")}


@router.put("/{view_id}/default")
async def set_default(view_id: str, user: dict = Depends(get_current_user)):
    """设为默认视图 —— 同 **(site, type)** 其它视图的 isDefault 一并清掉

    ⚠️ 判据里必须带上 site。默认视图回答的是「**这个站点**打开组态页时显示哪一份」，
    只按 type 清的话多站点会互相抢位：A 站刚把组态设为默认，B 站的默认就没了，
    而 B 站的人从头到尾没碰过任何设置。

    site 为空的视图（不绑站点）自成一组，不与任何具体站点互抢。
    """
    import json as _json
    from ..parse_lite import parse_get, parse_update, parse_query
    row = parse_get("View", view_id, user=user)
    if not row:
        raise HTTPException(404, "视图不存在")
    vtype = row.get("type", "")
    vsite = row.get("site", "") or ""
    peers = parse_query("View", {"where": _json.dumps({"type": vtype}), "limit": 200},
                        user=user)
    for p in peers.get("results", []):
        pid = p.get("objectId")
        same_site = (p.get("site", "") or "") == vsite
        if pid and pid != view_id and p.get("isDefault") and same_site:
            parse_update("View", pid, {"isDefault": False}, user=user)
    parse_update("View", view_id, {"isDefault": True}, user=user)
    return {"status": "ok", "objectId": view_id, "type": vtype, "site": vsite}
