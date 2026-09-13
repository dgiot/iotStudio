# ============================================================
# 统一图库查询面 (PR-G) — 插件本体的通用反查
# ============================================================
"""
插件不再各起一个 HTTP 服务、不再各写一套领域端点。本体挂进统一图库
(src/graph_store.py), 反查走这里这一套**通用**查询。

**全部要求登录** (dependencies=[Depends(get_current_user)])。这与底座的
/api/classes 不同 —— 那条通用对象存储面当前**一个 Depends 都没有**
(parse_router.py 全部 handler), 把本体放进去等于公开可读写。
这条面从第一天就带鉴权, 是刻意的分野, 不是漏了。

命名空间 (ns) = 插件名。
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from ..auth import get_current_user
from ..graph_store import graph_store

router = APIRouter(prefix="/api/graph", tags=["Unified Graph"],
                   dependencies=[Depends(get_current_user)])


def _fail(e: Exception, what: str):
    """KeyError = 命名空间/节点不存在 → 404; 其余 → 500 (带类型, 便于定位)"""
    if isinstance(e, KeyError):
        raise HTTPException(404, str(e).strip("'\""))
    raise HTTPException(500, f"{what}: {type(e).__name__}: {e}")


@router.get("/providers")
async def providers():
    """图库挂了哪些提供方、哪个是默认 —— 换提供方不改消费方那条契约的可见面"""
    return graph_store.names()


@router.get("/namespaces")
async def namespaces():
    """各命名空间(插件本体)的概况清单"""
    try:
        ns = graph_store.namespaces()
    except Exception as e:
        _fail(e, "取命名空间失败")
    return {"results": [{"namespace": k, **v} for k, v in sorted(ns.items())],
            "count": len(ns)}


@router.get("/stats")
async def stats(ns: Optional[str] = None):
    """整体概况; 给 ns 就只报那一个"""
    try:
        return graph_store.stats(ns)
    except Exception as e:
        _fail(e, "取概况失败")


@router.get("/bundle/{ns}")
async def bundle(ns: str):
    """**整份**命名空间一次取全 —— 图视图渲染用。

    与逐条查的关系: 遍历用 /nodes + /neighbors, 整图渲染用这个。
    少了它, 页面只能拉 1 次节点再拉 N 次邻居 —— N+1 查询写进协议里。
    """
    try:
        return graph_store.bundle(ns)
    except Exception as e:
        _fail(e, "取整份本体失败")


@router.get("/categories/{ns}")
async def categories(ns: str):
    """类别表 (含配色) + 每类节点数"""
    try:
        rows = graph_store.categories(ns)
    except Exception as e:
        _fail(e, "取类别失败")
    return {"namespace": ns, "count": len(rows), "results": rows}


@router.get("/nodes")
async def nodes(ns: str, category: Optional[str] = None,
                q: Optional[str] = None,
                limit: int = Query(500, ge=1, le=5000)):
    try:
        rows = graph_store.nodes(ns, category=category, q=q, limit=limit)
    except Exception as e:
        _fail(e, "查节点失败")
    return {"namespace": ns, "count": len(rows), "results": rows}


@router.get("/node/{ns}/{nid}")
async def node(ns: str, nid: str):
    try:
        n = graph_store.node(ns, nid)
    except Exception as e:
        _fail(e, "查节点失败")
    if n is None:
        raise HTTPException(404, f"{ns} 中没有节点 {nid!r}")
    return n


@router.get("/edges")
async def edges(ns: str, source: Optional[str] = None, target: Optional[str] = None,
                relation: Optional[str] = None):
    try:
        rows = graph_store.edges(ns, source=source, target=target, relation=relation)
    except Exception as e:
        _fail(e, "查边失败")
    return {"namespace": ns, "count": len(rows), "results": rows}


@router.get("/neighbors/{ns}/{nid}")
async def neighbors(ns: str, nid: str, direction: str = Query("both", pattern="^(in|out|both)$"),
                    relation: Optional[str] = None):
    """一跳邻居 —— 每条结果带上对面那个节点, 调用方不必再查一次"""
    try:
        rows = graph_store.neighbors(ns, nid, direction=direction, relation=relation)
    except Exception as e:
        _fail(e, "查邻居失败")
    return {"namespace": ns, "node": nid, "direction": direction,
            "count": len(rows), "results": rows}


@router.get("/search")
async def search(q: str, ns: Optional[str] = None,
                 limit: int = Query(50, ge=1, le=500)):
    """跨命名空间搜节点 (id / label / description)"""
    try:
        rows = graph_store.search(q, ns=ns, limit=limit)
    except Exception as e:
        _fail(e, "搜索失败")
    return {"q": q, "count": len(rows), "results": rows}


@router.get("/trace/{ns}/{nid}")
async def trace(ns: str, nid: str, depth: int = Query(2, ge=1, le=4),
                direction: str = Query("both", pattern="^(in|out|both)$")):
    """通用反查 —— 多跳展开成一棵树。

    这是**领域端点的替代品**: 「协议→数据项(寻址)」「台区→诊断→指标→标准」
    「停电→处置」那几条链本包各自写了一个端点, 其实是同一件事走了十几遍。
    走这里就只有一种形状, 也就没有跨包字段名漂移可言。
    """
    try:
        return graph_store.trace(ns, nid, depth=depth, direction=direction)
    except Exception as e:
        _fail(e, "反查失败")
