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
from typing import Any, Callable, Dict, List, Optional, Set

log = logging.getLogger("graph.store")

# 作用域参数的语义, 全类共用一句话:
#
#   only = None        —— **不筛**。内部路径(装载、自检、运维)走这条, 行为一字不变。
#   only = set(...)    —— 调用者**看得见**的命名空间上界。
#
# 形状照 dgiot: 它收口 View 查询时算的是 `$relatedTo _Role.views`
# (apps/dgiot_parse/src/dgiot_parse_rest.erl:132-171) —— 「先算出这个调用者被允许的
# id 集合, 再拿它约束查询」。这里只是把那句话从 Erlang 搬到 Python, 骨架没换。
#
# ⚠️ 但 dgiot 那段**实际不生效**: 它查 header 用的键是 `<<"sessiontoken">>`,
#    而调用方传的是 `"X-Parse-Session-Token"`, 恒 undefined 落到兜底分支 ——
#    整段过滤器从没执行过。所以本文件不照抄它的代码, 只照抄它的**骨架**,
#    并且必须有一条门禁证明这里真的会红 (tests/test_tenant_scope.py)。


# ── 数据来源: 一个概念一个源、一个闭集 ────────────────────────
# 收敛前的形态是**三种键** (`data_kind` / `_synthetic` / `_sanitized`) ×
# **四种写法** (`'合成演示本体'` 中文 / `'synthetic-demo'` / `'synthetic'` / 无),
# 底下是一条 if/elif —— 于是「既标合成、又标脱敏」的那几个包里
# `_sanitized` 被**静默吞掉**: 页面上只看得到
# 「合成」, 看不到「脱敏副本」, 而这两个事实都该显示。
# (本仓老坑: 一个位置挤两个事实, 不报错只是少显示。)
#
# 另一条硬性质: **缺证据不得推导出「现场真值」**。
# 各包的 service.py 曾各自兜底成 `or '现场真值'`, 于是没标注的本体在页面上
# 被渲染成最强的那个结论 —— 「合成数据被标成现场真值」是真出过的对外失实。
# 所以这里只可能**显式**匹配到「现场真值」, 推导一律朝弱的一侧走。
DATA_KIND_FIELD = "现场真值"
DATA_KIND_SANITIZED = "脱敏副本"
DATA_KIND_SYNTHETIC = "合成演示本体"
DATA_KIND_UNMARKED = "未标注"

# 闭集 —— 页面**直接渲染这个值**, 不各自再映射一次。
# 用中文而非英文键: 十个案例包各有各的页面, 英文键意味着十张映射表,
# 那就又把「一个事实」散回十处了。
DATA_KINDS = (DATA_KIND_FIELD, DATA_KIND_SANITIZED,
              DATA_KIND_SYNTHETIC, DATA_KIND_UNMARKED)

# 历史写法 → 闭集。**只往弱的一侧归**: 不设任何指向「现场真值」的别名 ——
# 那是最强的结论, 只能由显式标注承担。
_DATA_KIND_ALIASES = {
    "synthetic": DATA_KIND_SYNTHETIC, "synthetic-demo": DATA_KIND_SYNTHETIC,
    "合成演示": DATA_KIND_SYNTHETIC, "演示本体": DATA_KIND_SYNTHETIC,
    "sanitized": DATA_KIND_SANITIZED, "sanitized-demo": DATA_KIND_SANITIZED,
    "脱敏": DATA_KIND_SANITIZED,
}


def derive_data_kind(ontology: dict) -> str:
    """本体 → 数据来源 (闭集)。缺证据返回「未标注」, **不会**返回「现场真值」。"""
    raw = str(ontology.get("data_kind") or "").strip()
    if raw in DATA_KINDS:
        return raw                        # 显式标注优先; 「现场真值」只能这样进来
    if raw:
        norm = _DATA_KIND_ALIASES.get(raw.lower())
        # 非闭集写法**不静默**: 归一化的同时出声。静默归一等于下一个人
        # 不知道自己写的值被换掉了 (本仓纪律: 跳过必计入 unchecked 并报红)。
        log.warning(f"[graph] data_kind {raw!r} 不在闭集内, "
                    f"归一化为 {norm or DATA_KIND_UNMARKED!r}")
        return norm or DATA_KIND_UNMARKED
    if ontology.get("_synthetic"):
        return DATA_KIND_SYNTHETIC
    if ontology.get("_sanitized"):
        return DATA_KIND_SANITIZED
    return DATA_KIND_UNMARKED


def derive_sanitized(ontology: dict) -> dict:
    """脱敏处理的事实 —— 与 data_kind **正交**, 不挤同一个键。

    `_sanitized` 一键两型: 多数包写 `True`, 少数包写
    `{sanitized, source, method, note}`。统一成结构, 元数据不再被 `bool()` 丢掉
    —— 「这份数据从哪来、怎么脱的敏」正是页面要给人看的东西。
    """
    s = ontology.get("_sanitized")
    if isinstance(s, dict):
        out: Dict[str, Any] = {"applied": bool(s.get("sanitized", True))}
        for k in ("source", "method", "note"):
            if s.get(k):
                out[k] = s[k]
        return out
    return {"applied": bool(s)}


class GraphProvider:
    """图库提供方契约 (Service Definition) —— 消费方只认这一份。

    实现方**自己拥有介质**, 下面这些方法怎么落地由它决定。
    """

    name = "abstract"

    # ── 装载 ────────────────────────────────────────────────
    def load(self, ns: str, ontology: dict, *, meta: dict = None,
             tenant: str = None) -> None:
        """把一个命名空间的本体载入 (同 ns 重复载入 = 替换)。

        `tenant` 是**归属租户**, 由部署声明 (src/tenant_scope.py), 不由插件自报 ——
        同一个包卖给第二家公司时, 包内写死的归属当场就是错的。
        `None` = 无主 = 各租户共享 (单租户部署的全部情形)。
        """
        raise NotImplementedError

    def unload(self, ns: str) -> None:
        """摘除一个命名空间 —— 跑 disposer 时调用"""
        raise NotImplementedError

    def namespaces(self, *, only: Set[str] = None) -> Dict[str, dict]:
        """ns → {name, version, tenant, nodes, edges, categories, ...}"""
        raise NotImplementedError

    # ── 查询 ────────────────────────────────────────────────
    def nodes(self, ns: str, *, category: str = None, q: str = None,
              limit: int = None, only: Set[str] = None) -> List[dict]:
        raise NotImplementedError

    def node(self, ns: str, nid: str, *, only: Set[str] = None) -> Optional[dict]:
        raise NotImplementedError

    def edges(self, ns: str, *, source: str = None, target: str = None,
              relation: str = None, only: Set[str] = None) -> List[dict]:
        raise NotImplementedError

    def neighbors(self, ns: str, nid: str, *, direction: str = "both",
                  relation: str = None, only: Set[str] = None) -> List[dict]:
        """一跳邻居 —— 每条结果都带上「对面那个节点」, 不然调用方还得再查一次"""
        raise NotImplementedError

    def search(self, q: str, *, ns: str = None, limit: int = 50,
               only: Set[str] = None) -> List[dict]:
        raise NotImplementedError

    def categories(self, ns: str, *, only: Set[str] = None) -> List[dict]:
        """类别表 (含配色) —— 图视图按类别上色要用, 少了它页面只能自己编色"""
        raise NotImplementedError

    def bundle(self, ns: str, *, only: Set[str] = None) -> dict:
        """**整份**命名空间 (name/version/categories/nodes/edges) —— 一次取全。

        给「图视图」这种要一次性渲染整张图的消费方用: 逐条 /nodes 拉 86 次
        再逐条 /neighbors 拉, 那不是通用, 那是把 N+1 查询写进协议里。
        """
        raise NotImplementedError

    def stats(self, ns: str = None, *, only: Set[str] = None) -> dict:
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
    def load(self, ns: str, ontology: dict, *, meta: dict = None,
             tenant: str = None) -> None:
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
        # 数据来源与脱敏事实都收口到上面的 derive_* —— 这两样原来在本文件、
        # 包的 plugin.py、包的 service.py、包的页面里**各推导一遍**, 四份的
        # 兜底互不相同 (其中一份兜底成「现场真值」)。一个事实一个源:
        # 这里推导, 消费方只显示。
        data_kind = derive_data_kind(ontology)
        sanitized = derive_sanitized(ontology)

        # 节点引用了 categories 里没有的类别 —— 与悬空边同族, **不抛错但必须出声**。
        # `nodes(category=...)` 是**等值**过滤: 类别名错一个字符, 这些节点在每一个
        # 按类别的查询里全部消失, 而装载成功、报错为零。页面上表现为「图例里有这类,
        # 点进去是空的」—— 查的人只会怀疑数据少, 不会怀疑自己写错了字段名。
        # **类别为空是合法的**(节点可以不分类), 不在此列 —— 否则正常本体一律挨报。
        unresolved = sorted({n.get("category") for n in by_id.values()
                             if n.get("category") and n.get("category") not in cats})
        # `label` 是**显示必需**字段 (页面拿它当节点文字), `category` 是可选分组,
        # 所以两者不同待遇: 前者全缺 = 满屏空标签, 是**生产者字段名与契约不一致**
        # 的指纹 (真出过: 按本体字段 name/layer 发载荷, 装载成功、报错为零,
        # 每个节点在页面上都是空标签)。只在**一个都不剩**时出声 —— 部分缺 label
        # 可能是刻意的, 报它假阳性高于收益。
        unlabeled = sum(1 for n in by_id.values() if not n.get("label"))

        # 可选：业务插件随图载荷带来的 SHACL 形状（Turtle 原文）。
        # 形状是「什么算合规」，只有垂直领域能回答；底座只负责**收下 → 并进导出 → 交给 pyshacl**。
        # 这里只做一次可解析性检查并出声 —— 形状坏不该拦住图本身（图独立可用）。
        shapes = ontology.get("shapes") or ""
        if shapes:
            try:
                from rdflib import Graph as _RG
                _RG().parse(data=shapes, format="turtle")
            except Exception as e:  # noqa: BLE001
                log.warning(f"[graph] {ns} 携带的 shapes 无法按 Turtle 解析（仍按原文收下）: {e}")

        # 可选：本体的**域**（domain）。类与关系词属"域"，只有一份身份；实例按命名空间分。
        # 不声明就退回命名空间（向后兼容，既有插件不受影响）。
        # 2026-10-05 由"多命名空间冒烟"逼出：两个业务命名空间各写一套类 IRI ⇒ 同一个类
        # 在图上有两个身份，classes 计数虚高，SPARQL 里按类查只命中一半。
        domain = ontology.get("domain") or ""

        with self._lock:
            self._ns[ns] = {
                "meta": dict(meta or {}),
                "domain": domain,
                "shapes": shapes,
                # 归属租户 —— 部署声明的事实, 与 meta 分开存。
                # 混进 meta 就会被插件自报的同名字段盖掉 (见下方 namespaces 的注释):
                # 「这个包是谁家的」不该由包自己说。
                "tenant": tenant or "",
                "name": ontology.get("name", ns),
                "version": ontology.get("version", ""),
                "data_kind": data_kind,
                # 脱敏是**另一个事实**, 与 data_kind 正交 —— 收敛前它挤在
                # 同一条 if/elif 里, 于是「既合成又脱敏」的包只显示得出一个。
                "sanitized": sanitized,
                "note": ontology.get("note", ""),
                "nodes": by_id, "cats": cats,
                "out": out, "in": in_, "rel": rel,
                "edges": edges,
                "dangling": dangling,
                "unresolved": unresolved,
                "unlabeled": unlabeled,
            }
        if dangling:
            # 不抛错但必须出声: 悬空边会被所有遍历静默跳过
            log.warning(f"[graph] {ns} 有 {len(dangling)} 条悬空边(端点不存在): {dangling[:5]}")
        if unresolved:
            # 同上: 悬空类别会被所有按类别的查询静默漏掉
            log.warning(f"[graph] {ns} 有 {len(unresolved)} 个类别没在 categories 里声明, "
                        f"引用它们的节点按类别查不到: {unresolved[:5]}")
        if by_id and unlabeled == len(by_id):
            # 出声的同时把契约写出来 —— 没有证据时, 这句就是生产者唯一的线索
            log.warning(f"[graph] {ns} 的 {unlabeled} 个节点一个都没有 label, 页面上会是"
                        f"满屏空标签 —— 多半是字段名与契约不一致(契约: 节点 "
                        f"label/category/description, 边 label, 类别 label+color)")

    def unload(self, ns: str) -> None:
        with self._lock:
            self._ns.pop(ns, None)

    def raw_nodes(self, ns: str) -> list:
        """**未精简**的节点字典（装载时收下的原样）—— 供桥/校验等需要完整字段的消费方。

        `nodes()` 会 _brief 成 id/label/category 等展示字段（页面够用），但溯源类字段
        （src / src_grade / description）会被丢掉 ⇒ 走那条路的话，图谱里"每条记录能回源"
        这条纪律根本到不了 RDF/SHACL 层（2026-10-05 实测：正常数据也被判否，因为档位没投影出来）。
        """
        with self._lock:
            return list((self._ns.get(ns) or {}).get("nodes", {}).values())

    def domain(self, ns: str) -> str:
        """某命名空间声明的域（类/关系词的身份域）；未声明返回空串（调用方退回命名空间）。"""
        with self._lock:
            d = self._ns.get(ns) or {}
            return d.get("domain") or ""

    def shapes(self) -> Dict[str, str]:
        """各命名空间携带的 SHACL 形状（Turtle 原文）；没携带的命名空间不出现。"""
        with self._lock:
            return {ns: d["shapes"] for ns, d in self._ns.items() if d.get("shapes")}

    def namespaces(self, *, only: Set[str] = None) -> Dict[str, dict]:
        with self._lock:
            return {
                ns: {
                    # 插件自报的 meta 先铺，**统计出来的数放最后** ——
                    # 否则插件在 meta 里写一个同名字段就能盖掉这里数出来的数
                    # （真出过：meta 里一个空的 data_kind 盖掉了推导出来的
                    #  「合成演示本体」，到页面上就成了「现场真值」）。
                    # 自报的可以补充，不能覆盖数出来的。
                    # `tenant` 同属「数出来的」这一侧：它由部署声明，
                    # 插件不该能靠写一个 meta.tenant 把自己改挂到别家名下。
                    **d["meta"],
                    "name": d["name"], "version": d["version"],
                    "tenant": d["tenant"],
                    "data_kind": d["data_kind"], "sanitized": d["sanitized"],
                    "note": d["note"],
                    "nodes": len(d["nodes"]), "edges": len(d["edges"]),
                    "category_count": len(d["cats"]), "relation_count": len(d["rel"]),
                    "dangling": len(d["dangling"]),
                    # 悬空**类别**与缺 label 的节点数 —— 名字避开既有的
                    # `dangling`(悬空边) 与 `orphans`(孤立节点), 同名不同义
                    # 会让消费方算出看起来合理的错答案 (见 stats 里 categories 那段)。
                    "unresolved_categories": len(d["unresolved"]),
                    "unlabeled_nodes": d["unlabeled"],
                }
                for ns, d in self._ns.items()
                if only is None or ns in only
            }

    # ── 内部 ────────────────────────────────────────────────
    def _get(self, ns: str, only: Set[str] = None) -> dict:
        """取命名空间, 带作用域。

        **拒绝与不存在走同一个出口、同一句话。** 403 等于确认「这个命名空间存在」——
        那是个存在性预言机: 换个名字试一遍, 就能探出别家装了哪几个插件。
        所以拒绝时不许有任何可区分的措辞, 连「可见」那份清单也只列调用者看得见的
        (原先这里无条件列出全部 ns, 任何登录用户猜一个不存在的名字就能拿到全名单)。
        """
        d = self._ns.get(ns)
        if d is None or (only is not None and ns not in only):
            # 明确抛错, 不返回空集 —— 「命名空间不存在」与「这个命名空间里没有」
            # 长得一模一样, 前者必须是错误, 否则查询侧会把笔误读成空结果
            visible = sorted(n for n in self._ns if only is None or n in only)
            raise KeyError(f"图库中没有命名空间 {ns!r}; 可见: {visible}")
        return d

    @staticmethod
    def _brief(n: dict) -> dict:
        return {"id": n.get("id"), "label": n.get("label"),
                "category": n.get("category"), "level": n.get("level")}

    # ── 查询 ────────────────────────────────────────────────
    def nodes(self, ns, *, category=None, q=None, limit=None, only=None) -> List[dict]:
        d = self._get(ns, only)
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

    def node(self, ns, nid, *, only=None) -> Optional[dict]:
        d = self._get(ns, only)
        n = d["nodes"].get(nid)
        if n is None:
            return None
        # 顺带把度数带上 —— 反查页要显示「这个节点挂在哪儿」
        return {**n, "in_degree": len(d["in"].get(nid, [])),
                "out_degree": len(d["out"].get(nid, [])),
                "category_label": (d["cats"].get(n.get("category")) or {}).get("label", "")}

    def edges(self, ns, *, source=None, target=None, relation=None, only=None) -> List[dict]:
        d = self._get(ns, only)
        out = d["edges"]
        if source:
            out = [e for e in out if e.get("source") == source]
        if target:
            out = [e for e in out if e.get("target") == target]
        if relation:
            out = [e for e in out if e.get("relation") == relation]
        return out

    def neighbors(self, ns, nid, *, direction="both", relation=None, only=None) -> List[dict]:
        d = self._get(ns, only)
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

    def search(self, q, *, ns=None, limit=50, only=None) -> List[dict]:
        ql = (q or "").lower()
        if not ql:
            return []
        # 目标集合是 only 的**子集**, 在遍历**前**收窄 —— 不能查完再筛,
        # 否则看不见的命名空间会把 limit 的名额占掉, 看得见的反被截断。
        # ns 给了但看不见 → 空结果, 与「这个 ns 不存在」同一个出口 (那条也返回 [])。
        if ns:
            targets = [ns] if (only is None or ns in only) else []
        else:
            targets = [n for n in self._ns if only is None or n in only]
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

    def categories(self, ns, *, only=None) -> List[dict]:
        d = self._get(ns, only)
        # 按节点数排序: 页面图例的稳定顺序不该随 dict 插入序变化
        cnt: Dict[str, int] = {}
        for n in d["nodes"].values():
            cnt[n.get("category")] = cnt.get(n.get("category"), 0) + 1
        rows = [{**c, "count": cnt.get(cid, 0)} for cid, c in d["cats"].items()]
        rows.sort(key=lambda c: (-c["count"], c["id"]))
        return rows

    def bundle(self, ns, *, only=None) -> dict:
        d = self._get(ns, only)
        return {"namespace": ns, "name": d["name"], "version": d["version"],
                "data_kind": d["data_kind"], "sanitized": d["sanitized"],
                "note": d["note"],
                "categories": self.categories(ns, only=only),
                "nodes": list(d["nodes"].values()),
                "edges": list(d["edges"])}

    def stats(self, ns=None, *, only=None) -> dict:
        if ns:
            d = self._get(ns, only)
            orphans = [nid for nid in d["nodes"]
                       if not d["in"].get(nid) and not d["out"].get(nid)]
            cats = self.categories(ns, only=only)
            return {"namespace": ns, "name": d["name"], "version": d["version"],
                    "data_kind": d["data_kind"], "sanitized": d["sanitized"],
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
                    "unresolved_categories": len(d["unresolved"]),
                    "unlabeled_nodes": d["unlabeled"],
                    "relations_used": sorted(d["rel"])}
        # 整体概况也按作用域收窄 —— 「一共 6 个命名空间」在多租户下本身就是
        # 一条别家装了什么的情报, 与 /namespaces 那条口径必须一致
        allns = self.namespaces(only=only)
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
    # `only` 一路透传, 在糖这层不解释、不默认 —— 默认值只该有一个地方定义
    def load(self, ns: str, ontology: dict, *, meta: dict = None,
             provider: str = None, tenant: str = None) -> None:
        self.provider(provider).load(ns, ontology, meta=meta, tenant=tenant)

    def unload(self, ns: str, *, provider: str = None) -> None:
        self.provider(provider).unload(ns)

    def raw_nodes(self, ns: str, *, provider: str = None) -> list:
        """某命名空间未精简的节点字典列表（含溯源字段）。"""
        return self.provider(provider).raw_nodes(ns)

    def domain(self, ns: str, *, provider: str = None) -> str:
        """统一图库里某命名空间声明的域（类/关系词身份域）。"""
        return self.provider(provider).domain(ns)

    def shapes(self, *, provider: str = None) -> Dict[str, str]:
        """统一图库里各命名空间携带的 SHACL 形状（Turtle 原文）。"""
        return self.provider(provider).shapes()

    def namespaces(self, *, provider: str = None, only: Set[str] = None) -> dict:
        return self.provider(provider).namespaces(only=only)

    def stats(self, ns: str = None, *, provider: str = None,
              only: Set[str] = None) -> dict:
        return self.provider(provider).stats(ns, only=only)

    def node(self, ns: str, nid: str, *, provider: str = None,
             only: Set[str] = None):
        return self.provider(provider).node(ns, nid, only=only)

    def nodes(self, ns: str, **kw):
        return self.provider(kw.pop("provider", None)).nodes(ns, **kw)

    def edges(self, ns: str, **kw):
        return self.provider(kw.pop("provider", None)).edges(ns, **kw)

    def neighbors(self, ns: str, nid: str, **kw):
        return self.provider(kw.pop("provider", None)).neighbors(ns, nid, **kw)

    def search(self, q: str, **kw):
        return self.provider(kw.pop("provider", None)).search(q, **kw)

    def categories(self, ns: str, *, provider: str = None,
                   only: Set[str] = None):
        return self.provider(provider).categories(ns, only=only)

    def bundle(self, ns: str, *, provider: str = None, only: Set[str] = None):
        return self.provider(provider).bundle(ns, only=only)

    def trace(self, ns: str, nid: str, *, depth: int = 2,
              direction: str = "both", limit: int = 400,
              only: Set[str] = None) -> dict:
        """通用反查 —— 多跳展开成一棵树。

        这是**领域端点的替代品**: 原来每个包各有若干个「协议→数据项」
        「台区→诊断→指标」式端点, 那是把同一件事(按关系走图)写了十几遍,
        且每包一套字段名 (memory: 跨包一致性)。走这里就只有一种形状。
        """
        p = self.provider()
        root = p.node(ns, nid, only=only)
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
            for row in p.neighbors(ns, cur, direction=direction, only=only):
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
