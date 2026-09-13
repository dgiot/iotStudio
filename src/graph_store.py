# ============================================================
# 统一图库 (PR-G) — 插件本体共用一个图库, 领域端点随之退场
# ============================================================
"""
设计语汇对标 DSH Cordis 的 storage 子系统 (docs/subsystems/storage.zh.md):

  · **hub 不做 IO** —— GraphStore 只做「按名注册 / 按名取用」, 自己不碰磁盘。
    介质归**提供方**所有: 内存 dict / JSON 文件 / PG / Parse 类都行。
  · **按名注册, 重名抛错** —— register(name, provider) 返回 disposer,
    卸载 = 跑那个 disposer。注册是可逆副作用, 与 Cordis 的 ctx.effect() 同形。
  · **换提供方不改消费方** —— 插件只写 ctx.register_graph(...),
    查询侧只认 GraphProvider 这一份契约; 换后端不动这两头任何一行。
  · **本体挂到 hub 上, 而不是各起一个服务** —— 于是「端口统一」是自然结果:
    插件不再需要自己的 HTTP 服务, 领域端点随之退场,
    反查改由底座的通用图查询 /api/graph/* 承担 (见 src/web/graph_api.py)。

命名空间 (namespace) = 插件名。一个插件一份本体, 互不覆盖。

为什么另起一份而不是复用 parse_lite:
  parse_lite 的 /api/classes 是**通用对象存储**且当前无鉴权 (parse_router.py
  全部 handler 无 Depends), 把本体放进去等于公开可写 —— 详见 CHANGELOG。
  这里的内存提供方介质是**插件包里的数据文件**, 只读、进程内、重启重建,
  与那条面分开是刻意的。
"""
from __future__ import annotations

import logging
import threading
from typing import Any, Callable, Dict, List, Optional

log = logging.getLogger("graph.store")


class GraphProvider:
    """图库提供方契约 (Service Definition) —— 消费方只认这一份。

    实现方**自己拥有介质**, 下面这些方法怎么落地由它决定。
    """

    name = "abstract"

    # ── 装载 ────────────────────────────────────────────────
    def load(self, ns: str, ontology: dict, *, meta: dict = None) -> None:
        """把一个命名空间的本体载入 (同 ns 重复载入 = 替换)"""
        raise NotImplementedError

    def unload(self, ns: str) -> None:
        """摘除一个命名空间 —— 跑 disposer 时调用"""
        raise NotImplementedError

    def namespaces(self) -> Dict[str, dict]:
        """ns → {name, version, nodes, edges, categories, ...}"""
        raise NotImplementedError

    # ── 查询 ────────────────────────────────────────────────
    def nodes(self, ns: str, *, category: str = None, q: str = None,
              limit: int = None) -> List[dict]:
        raise NotImplementedError

    def node(self, ns: str, nid: str) -> Optional[dict]:
        raise NotImplementedError

    def edges(self, ns: str, *, source: str = None, target: str = None,
              relation: str = None) -> List[dict]:
        raise NotImplementedError

    def neighbors(self, ns: str, nid: str, *, direction: str = "both",
                  relation: str = None) -> List[dict]:
        """一跳邻居 —— 每条结果都带上「对面那个节点」, 不然调用方还得再查一次"""
        raise NotImplementedError

    def search(self, q: str, *, ns: str = None, limit: int = 50) -> List[dict]:
        raise NotImplementedError

    def categories(self, ns: str) -> List[dict]:
        """类别表 (含配色) —— 图视图按类别上色要用, 少了它页面只能自己编色"""
        raise NotImplementedError

    def bundle(self, ns: str) -> dict:
        """**整份**命名空间 (name/version/categories/nodes/edges) —— 一次取全。

        给「图视图」这种要一次性渲染整张图的消费方用: 逐条 /nodes 拉 86 次
        再逐条 /neighbors 拉, 那不是通用, 那是把 N+1 查询写进协议里。
        """
        raise NotImplementedError

    def stats(self, ns: str = None) -> dict:
        raise NotImplementedError


class MemoryGraphProvider(GraphProvider):
    """默认提供方 —— 介质是进程内存, 数据源是插件包里的本体文件。

    索引在 load() 时一次建好 (本体是只读的, 载入后不再变):
      nodes: id → node      cats: id → category
      out:   id → [edge]    in_:  id → [edge]      rel: relation → [edge]
    """

    name = "memory"

    def __init__(self):
        self._ns: Dict[str, dict] = {}
        self._lock = threading.RLock()

    # ── 装载 ────────────────────────────────────────────────
    def load(self, ns: str, ontology: dict, *, meta: dict = None) -> None:
        if not isinstance(ontology, dict):
            raise TypeError(f"本体必须是 dict, 收到 {type(ontology).__name__}")
        nodes = ontology.get("nodes") or []
        edges = ontology.get("edges") or []
        if not isinstance(nodes, list) or not isinstance(edges, list):
            raise TypeError("本体的 nodes/edges 必须是 list")

        by_id: Dict[str, dict] = {}
        for n in nodes:
            nid = n.get("id")
            if not nid:
                raise ValueError("本体节点缺 id")
            if nid in by_id:
                # 重名节点会让所有按 id 的查询静默指向其中一个 —— 宁可载入失败
                raise ValueError(f"节点 id 重复: {nid}")
            by_id[nid] = n

        out: Dict[str, List[dict]] = {k: [] for k in by_id}
        in_: Dict[str, List[dict]] = {k: [] for k in by_id}
        rel: Dict[str, List[dict]] = {}
        dangling = []
        for e in edges:
            s, t = e.get("source"), e.get("target")
            if s not in by_id or t not in by_id:
                dangling.append(e.get("id") or f"{s}->{t}")
                continue
            out[s].append(e)
            in_[t].append(e)
            if e.get("relation"):
                rel.setdefault(e["relation"], []).append(e)

        cats = {c.get("id"): c for c in (ontology.get("categories") or []) if c.get("id")}
        with self._lock:
            self._ns[ns] = {
                "meta": dict(meta or {}),
                "name": ontology.get("name", ns),
                "version": ontology.get("version", ""),
                "data_kind": ontology.get("data_kind", ""),
                "note": ontology.get("note", ""),
                "nodes": by_id, "cats": cats,
                "out": out, "in": in_, "rel": rel,
                "edges": edges,
                "dangling": dangling,
            }
        if dangling:
            # 不抛错但必须出声: 悬空边会被所有遍历静默跳过
            log.warning(f"[graph] {ns} 有 {len(dangling)} 条悬空边(端点不存在): {dangling[:5]}")

    def unload(self, ns: str) -> None:
        with self._lock:
            self._ns.pop(ns, None)

    def namespaces(self) -> Dict[str, dict]:
        with self._lock:
            return {
                ns: {
                    "name": d["name"], "version": d["version"],
                    "data_kind": d["data_kind"], "note": d["note"],
                    "nodes": len(d["nodes"]), "edges": len(d["edges"]),
                    "category_count": len(d["cats"]), "relation_count": len(d["rel"]),
                    "dangling": len(d["dangling"]),
                    **d["meta"],
                }
                for ns, d in self._ns.items()
            }

    # ── 内部 ────────────────────────────────────────────────
    def _get(self, ns: str) -> dict:
        d = self._ns.get(ns)
        if d is None:
            # 明确抛错, 不返回空集 —— 「命名空间不存在」与「这个命名空间里没有」
            # 长得一模一样, 前者必须是错误, 否则查询侧会把笔误读成空结果
            raise KeyError(f"图库中没有命名空间 {ns!r}; 现有: {sorted(self._ns)}")
        return d

    @staticmethod
    def _brief(n: dict) -> dict:
        return {"id": n.get("id"), "label": n.get("label"),
                "category": n.get("category"), "level": n.get("level")}

    # ── 查询 ────────────────────────────────────────────────
    def nodes(self, ns, *, category=None, q=None, limit=None) -> List[dict]:
        d = self._get(ns)
        out = list(d["nodes"].values())
        if category:
            out = [n for n in out if n.get("category") == category]
        if q:
            ql = q.lower()
            out = [n for n in out
                   if ql in str(n.get("id", "")).lower()
                   or ql in str(n.get("label", "")).lower()]
        out.sort(key=lambda n: (n.get("category") or "", n.get("id") or ""))
        return out[:limit] if limit else out

    def node(self, ns, nid) -> Optional[dict]:
        d = self._get(ns)
        n = d["nodes"].get(nid)
        if n is None:
            return None
        # 顺带把度数带上 —— 反查页要显示「这个节点挂在哪儿」
        return {**n, "in_degree": len(d["in"].get(nid, [])),
                "out_degree": len(d["out"].get(nid, [])),
                "category_label": (d["cats"].get(n.get("category")) or {}).get("label", "")}

    def edges(self, ns, *, source=None, target=None, relation=None) -> List[dict]:
        d = self._get(ns)
        out = d["edges"]
        if source:
            out = [e for e in out if e.get("source") == source]
        if target:
            out = [e for e in out if e.get("target") == target]
        if relation:
            out = [e for e in out if e.get("relation") == relation]
        return out

    def neighbors(self, ns, nid, *, direction="both", relation=None) -> List[dict]:
        d = self._get(ns)
        if nid not in d["nodes"]:
            raise KeyError(f"{ns} 中没有节点 {nid!r}")
        rows: List[dict] = []
        if direction in ("out", "both"):
            for e in d["out"].get(nid, []):
                if relation and e.get("relation") != relation:
                    continue
                rows.append({"direction": "out", "relation": e.get("relation"),
                             "label": e.get("label"), "edge": e.get("id"),
                             "node": self._brief(d["nodes"][e["target"]])})
        if direction in ("in", "both"):
            for e in d["in"].get(nid, []):
                if relation and e.get("relation") != relation:
                    continue
                rows.append({"direction": "in", "relation": e.get("relation"),
                             "label": e.get("label"), "edge": e.get("id"),
                             "node": self._brief(d["nodes"][e["source"]])})
        return rows

    def search(self, q, *, ns=None, limit=50) -> List[dict]:
        ql = (q or "").lower()
        if not ql:
            return []
        targets = [ns] if ns else list(self._ns)
        hits: List[dict] = []
        for name in targets:
            d = self._ns.get(name)
            if not d:
                continue
            for n in d["nodes"].values():
                if (ql in str(n.get("id", "")).lower()
                        or ql in str(n.get("label", "")).lower()
                        or ql in str(n.get("description", "")).lower()):
                    hits.append({"namespace": name,
                                 "category_label": (d["cats"].get(n.get("category")) or {}).get("label", ""),
                                 **self._brief(n)})
                    if len(hits) >= limit:
                        return hits
        return hits

    def categories(self, ns) -> List[dict]:
        d = self._get(ns)
        # 按节点数排序: 页面图例的稳定顺序不该随 dict 插入序变化
        cnt: Dict[str, int] = {}
        for n in d["nodes"].values():
            cnt[n.get("category")] = cnt.get(n.get("category"), 0) + 1
        rows = [{**c, "count": cnt.get(cid, 0)} for cid, c in d["cats"].items()]
        rows.sort(key=lambda c: (-c["count"], c["id"]))
        return rows

    def bundle(self, ns) -> dict:
        d = self._get(ns)
        return {"namespace": ns, "name": d["name"], "version": d["version"],
                "data_kind": d["data_kind"], "note": d["note"],
                "categories": self.categories(ns),
                "nodes": list(d["nodes"].values()),
                "edges": list(d["edges"])}

    def stats(self, ns=None) -> dict:
        if ns:
            d = self._get(ns)
            orphans = [nid for nid in d["nodes"]
                       if not d["in"].get(nid) and not d["out"].get(nid)]
            cats = self.categories(ns)
            return {"namespace": ns, "name": d["name"], "version": d["version"],
                    "data_kind": d["data_kind"],
                    "nodes": len(d["nodes"]), "edges": len(d["edges"]),
                    # ⚠️ `categories` 在本 API 里**只有一种语义: 那个数组**。
                    #    初版这里放的是类别**个数**, 与 categories(ns) 同名不同义 ——
                    #    消费方写 s.categories.map(...) 会在数字上炸, 而
                    #    `s.categories.length` 这种写法还会**静默**给出错误答案。
                    #    个数改叫 category_count。
                    "category_count": len(d["cats"]),
                    "relation_count": len(d["rel"]),
                    "categories": cats,
                    "by_category": {c["id"]: c["count"] for c in cats},
                    "orphans": len(orphans), "dangling": len(d["dangling"]),
                    "relations_used": sorted(d["rel"])}
        allns = self.namespaces()
        return {"namespaces": len(allns),
                "nodes": sum(v["nodes"] for v in allns.values()),
                "edges": sum(v["edges"] for v in allns.values()),
                "detail": allns}


class GraphStore:
    """统一图库 hub —— **不做 IO**, 只做按名注册与取用。

    对应 Cordis 的 ctx.storage: 提供方插件调 register() 把自己挂上来,
    消费方只问 provider() 拿一份契约, 谁在下面干活与它无关。
    """

    def __init__(self):
        self._providers: Dict[str, GraphProvider] = {}
        self._default: Optional[str] = None
        self._lock = threading.RLock()

    def register(self, name: str, provider: GraphProvider, *,
                 default: bool = False) -> Callable[[], None]:
        """按名注册提供方 —— 返回 disposer。**重名抛错**, 不静默覆盖。

        静默覆盖是这类注册表最坏的失效: 后挂上来的把先挂的顶掉,
        消费方名字没变、行为变了, 而且没有任何一处会报错。
        """
        if not isinstance(provider, GraphProvider):
            raise TypeError(f"提供方必须实现 GraphProvider, 收到 {type(provider).__name__}")
        with self._lock:
            if name in self._providers:
                raise ValueError(f"图库提供方 {name!r} 已注册 (现有: {sorted(self._providers)})")
            self._providers[name] = provider
            if default or self._default is None:
                self._default = name
        log.info(f"[graph] 提供方注册: {name} ({provider.__class__.__name__})")

        def _undo():
            with self._lock:
                self._providers.pop(name, None)
                if self._default == name:
                    self._default = next(iter(self._providers), None)
        return _undo

    def provider(self, name: str = None) -> GraphProvider:
        with self._lock:
            key = name or self._default
            if key is None:
                raise RuntimeError("图库没有任何提供方")
            p = self._providers.get(key)
        if p is None:
            raise KeyError(f"图库没有提供方 {key!r}; 现有: {sorted(self._providers)}")
        return p

    def names(self) -> dict:
        with self._lock:
            return {"providers": sorted(self._providers), "default": self._default}

    # ── 消费面糖: 插件与 API 都走这几个, 不直接碰提供方 ──────────
    def load(self, ns: str, ontology: dict, *, meta: dict = None,
             provider: str = None) -> None:
        self.provider(provider).load(ns, ontology, meta=meta)

    def unload(self, ns: str, *, provider: str = None) -> None:
        self.provider(provider).unload(ns)

    def namespaces(self, *, provider: str = None) -> dict:
        return self.provider(provider).namespaces()

    def stats(self, ns: str = None, *, provider: str = None) -> dict:
        return self.provider(provider).stats(ns)

    def node(self, ns: str, nid: str, *, provider: str = None):
        return self.provider(provider).node(ns, nid)

    def nodes(self, ns: str, **kw):
        return self.provider(kw.pop("provider", None)).nodes(ns, **kw)

    def edges(self, ns: str, **kw):
        return self.provider(kw.pop("provider", None)).edges(ns, **kw)

    def neighbors(self, ns: str, nid: str, **kw):
        return self.provider(kw.pop("provider", None)).neighbors(ns, nid, **kw)

    def search(self, q: str, **kw):
        return self.provider(kw.pop("provider", None)).search(q, **kw)

    def categories(self, ns: str, *, provider: str = None):
        return self.provider(provider).categories(ns)

    def bundle(self, ns: str, *, provider: str = None):
        return self.provider(provider).bundle(ns)

    def trace(self, ns: str, nid: str, *, depth: int = 2,
              direction: str = "both", limit: int = 400) -> dict:
        """通用反查 —— 多跳展开成一棵树。

        这是**领域端点的替代品**: 原来每个包各有若干个「协议→数据项」
        「台区→诊断→指标」式端点, 那是把同一件事(按关系走图)写了十几遍,
        且每包一套字段名 (memory: 跨包一致性)。走这里就只有一种形状。
        """
        p = self.provider()
        root = p.node(ns, nid)
        if root is None:
            raise KeyError(f"{ns} 中没有节点 {nid!r}")
        seen = {nid}
        frontier = [(nid, 0)]
        links: List[dict] = []
        truncated = False
        while frontier:
            cur, d = frontier.pop(0)
            if d >= depth:
                continue
            for row in p.neighbors(ns, cur, direction=direction):
                other = row["node"]["id"]
                links.append({"from": cur, "to": other,
                              "relation": row["relation"], "label": row["label"],
                              "direction": row["direction"], "hop": d + 1,
                              "node": row["node"]})
                if other not in seen:
                    seen.add(other)
                    frontier.append((other, d + 1))
                    if len(seen) >= limit:
                        truncated = True
                        frontier = []
                        break
        return {"namespace": ns, "root": root, "depth": depth,
                "direction": direction, "visited": len(seen),
                "links": links, "truncated": truncated}


# 模块级单例 —— 提供方注册与 API 查询共用同一个 hub
graph_store = GraphStore()
graph_store.register("memory", MemoryGraphProvider(), default=True)
