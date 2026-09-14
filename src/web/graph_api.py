# ============================================================
# 统一图库查询面 (PR-G) — 插件本体的通用反查
# ============================================================
"""
插件不再各起一个 HTTP 服务、不再各写一套领域端点。本体挂进统一图库
(src/graph_store.py), 反查走这里这一套**通用**查询。

**全部要求登录**, 且**按命名空间鉴权** (router 上挂 `graph_scope`,
每个 handler 把 `only=scope` 透传给图库)。这与底座的 /api/classes 不同 ——
那条通用对象存储面当前**一个 Depends 都没有** (parse_router.py 全部 handler),
把本体放进去等于公开可读写。这条面从第一天就带鉴权, 是刻意的分野, 不是漏了。

命名空间 (ns) = 插件名。归属租户由**部署**声明 (src/tenant_scope.py 的
IOTSTUDIO_NS_TENANT), 不由插件自报 —— 同一个包卖给第二家公司时, 包内写死的
归属当场就是错的。

鉴权判据只有一句话, 与 parse_lite 的读侧判据逐字同义:

  · 该 ns 没声明归属 (无主) → **共享**, 谁都能看
  · 该 ns 归属 == 调用者租户  → 能看
  · 其余                     → 看不见, 且**与「不存在」回同一句话**

用 404 不用 403 是刻意的: 403 等于确认「这个命名空间存在」, 那是个存在性预言机
—— 换个名字试一遍就能探出别家装了哪几个插件。

审慎提醒 (2026-09-14 读 dgiot 源码所得): dgiot 那边有一段形状完全相同的收口
(`dgiot_parse_rest.erl:132-171` 的 get_newwhere, 用 `$relatedTo _Role.views`
约束 View 查询), 但它**从没执行过** —— 它取 session 用的 header 键是
`<<"sessiontoken">>`, 而调用方传的是 `"X-Parse-Session-Token"`, 恒 undefined,
直接落到兜底分支。所以本文件的判据不靠「写了就算」, 而由
tests/test_tenant_scope.py 逐端点证明它真的会红。
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Set

from ..auth import get_current_user
from ..graph_store import graph_store
from .. import tenant_scope

async def graph_scope(user: dict = Depends(get_current_user)) -> Set[str]:
    """当前调用者**看得见**的命名空间集合 —— 本面唯一的鉴权判据。

    判据读的是**装载时记下的**归属 (graph_store 里存着的那一份), 不是现去解
    一次环境变量。理由: 装载那一刻真正生效的是哪个租户, 查询时就必须是哪个。
    两处各解一次的话, 「改环境变量没重启」会让装载与查询按两套规则走 ——
    而两套在报告里长得一模一样。

    多租户部署里不会出现无主命名空间 (装载层就抛错了, 见 tenant_scope.tenant_of),
    所以这里的「无主 = 共享」实际只在单租户部署生效, 与今天行为一字不变。
    """
    me = (user or {}).get("tenant_id") or ""
    out: Set[str] = set()
    for ns, info in graph_store.namespaces().items():
        owner = info.get("tenant") or ""
        if not owner or not me or owner == me:
            out.add(ns)
    return out


# 路由级挂载 —— 新加的端点自动继承作用域, 不可能「忘了挂」。
# 它同时要求 handler 自己声明 `Depends(graph_scope)` 才能拿到 scope 值;
# FastAPI 对同一依赖按调用对象缓存, 挂两次只算一次。
# 另三个**不取 ns** 的端点 (/namespaces /stats /search) 不走 _get,
# 单靠路由依赖挡不住, 必须 handler 显式传 only= (已逐个接上, 有门禁逐条查)。
router = APIRouter(prefix="/api/graph", tags=["Unified Graph"],
                   dependencies=[Depends(graph_scope)])


def _fail(e: Exception, what: str):
    """KeyError = 命名空间/节点不存在(或看不见) → 404; 其余 → 500 (带类型, 便于定位)"""
    if isinstance(e, KeyError):
        raise HTTPException(404, str(e).strip("'\""))
    raise HTTPException(500, f"{what}: {type(e).__name__}: {e}")


@router.get("/providers")
async def providers():
    """图库挂了哪些提供方、哪个是默认 —— 换提供方不改消费方那条契约的可见面。

    另附**部署级**的作用域策略 (是不是多租户、无主怎么处置)。**不含租户名**:
    「这台机器上装了哪几家」本身是跨租户情报, 不该给任何登录用户看;
    完整的自述 (含租户名单) 打在启动日志里, 那里本来就是运维在看。
    """
    d = tenant_scope.describe()
    return {**graph_store.names(),
            "scope": {"multi_tenant": d["multi_tenant"],
                      "unowned_policy": d["unowned_policy"]}}


@router.get("/namespaces")
async def namespaces(scope: Set[str] = Depends(graph_scope)):
    """各命名空间(插件本体)的概况清单"""
    try:
        ns = graph_store.namespaces(only=scope)
    except Exception as e:
        _fail(e, "取命名空间失败")
    return {"results": [{"namespace": k, **v} for k, v in sorted(ns.items())],
            "count": len(ns)}


@router.get("/stats")
async def stats(ns: Optional[str] = None, scope: Set[str] = Depends(graph_scope)):
    """整体概况; 给 ns 就只报那一个"""
    try:
        return graph_store.stats(ns, only=scope)
    except Exception as e:
        _fail(e, "取概况失败")


@router.get("/bundle/{ns}")
async def bundle(ns: str, scope: Set[str] = Depends(graph_scope)):
    """**整份**命名空间一次取全 —— 图视图渲染用。

    与逐条查的关系: 遍历用 /nodes + /neighbors, 整图渲染用这个。
    少了它, 页面只能拉 1 次节点再拉 N 次邻居 —— N+1 查询写进协议里。
    """
    try:
        return graph_store.bundle(ns, only=scope)
    except Exception as e:
        _fail(e, "取整份本体失败")


@router.get("/categories/{ns}")
async def categories(ns: str, scope: Set[str] = Depends(graph_scope)):
    """类别表 (含配色) + 每类节点数"""
    try:
        rows = graph_store.categories(ns, only=scope)
    except Exception as e:
        _fail(e, "取类别失败")
    return {"namespace": ns, "count": len(rows), "results": rows}


@router.get("/nodes")
async def nodes(ns: str, category: Optional[str] = None,
                q: Optional[str] = None,
                limit: int = Query(500, ge=1, le=5000),
                scope: Set[str] = Depends(graph_scope)):
    try:
        rows = graph_store.nodes(ns, category=category, q=q, limit=limit, only=scope)
    except Exception as e:
        _fail(e, "查节点失败")
    return {"namespace": ns, "count": len(rows), "results": rows}


@router.get("/node/{ns}/{nid}")
async def node(ns: str, nid: str, scope: Set[str] = Depends(graph_scope)):
    try:
        n = graph_store.node(ns, nid, only=scope)
    except Exception as e:
        _fail(e, "查节点失败")
    if n is None:
        raise HTTPException(404, f"{ns} 中没有节点 {nid!r}")
    return n


@router.get("/edges")
async def edges(ns: str, source: Optional[str] = None, target: Optional[str] = None,
                relation: Optional[str] = None,
                scope: Set[str] = Depends(graph_scope)):
    try:
        rows = graph_store.edges(ns, source=source, target=target,
                                 relation=relation, only=scope)
    except Exception as e:
        _fail(e, "查边失败")
    return {"namespace": ns, "count": len(rows), "results": rows}


@router.get("/neighbors/{ns}/{nid}")
async def neighbors(ns: str, nid: str, direction: str = Query("both", pattern="^(in|out|both)$"),
                    relation: Optional[str] = None,
                    scope: Set[str] = Depends(graph_scope)):
    """一跳邻居 —— 每条结果带上对面那个节点, 调用方不必再查一次"""
    try:
        rows = graph_store.neighbors(ns, nid, direction=direction,
                                     relation=relation, only=scope)
    except Exception as e:
        _fail(e, "查邻居失败")
    return {"namespace": ns, "node": nid, "direction": direction,
            "count": len(rows), "results": rows}


@router.get("/search")
async def search(q: str, ns: Optional[str] = None,
                 limit: int = Query(50, ge=1, le=500),
                 scope: Set[str] = Depends(graph_scope)):
    """跨命名空间搜节点 (id / label / description)

    目标集合在**遍历前**按 scope 收窄, 不是查完再筛 —— 否则看不见的命名空间
    会把 limit 的名额占掉, 看得见的反被截断。
    """
    try:
        rows = graph_store.search(q, ns=ns, limit=limit, only=scope)
    except Exception as e:
        _fail(e, "搜索失败")
    return {"q": q, "count": len(rows), "results": rows}


@router.get("/trace/{ns}/{nid}")
async def trace(ns: str, nid: str, depth: int = Query(2, ge=1, le=4),
                direction: str = Query("both", pattern="^(in|out|both)$"),
                scope: Set[str] = Depends(graph_scope)):
    """通用反查 —— 多跳展开成一棵树。

    这是**领域端点的替代品**: 「协议→数据项(寻址)」「台区→诊断→指标→标准」
    「停电→处置」那几条链本包各自写了一个端点, 其实是同一件事走了十几遍。
    走这里就只有一种形状, 也就没有跨包字段名漂移可言。
    """
    try:
        return graph_store.trace(ns, nid, depth=depth, direction=direction, only=scope)
    except Exception as e:
        _fail(e, "反查失败")
