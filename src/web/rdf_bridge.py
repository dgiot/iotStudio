# -*- coding: utf-8 -*-
"""统一图库 → RDF/SPARQL 桥（2026-10-05）

背景（业务插件的"最后一段白挂"）：
  插件用 `ctx.register_graph(...)` 把本体挂进**统一图库**之后, `/api/graph/*`
  立刻能反查、能搜、能 trace ✓ —— 但 `/api/graphrag/ontology.*`、`/api/graphrag/sparql`、
  `/api/graphrag/rdf/stats` 走的是**引擎自己那股**（`engine.export_turtle()`，
  只含底座 IoT 模型），业务命名空间在**语义/推理/导出**这一侧等于没挂。

本模块把两者并成**同一张 rdflib 图**：引擎的 Turtle ∪ 图库各命名空间的节点/边。
于是 `ontology.owl` / `ontology.ttl` / `ontology.jsonld` / `sparql` / `rdf/stats`
全部同源 —— 这也保住了既有判据：
  tests/test_ontology_sparql.py —— "triples 必须等于把 /ontology.owl 重新 parse
  出来的三元组数"（三个出口都改走 merged() 后，该不变式依旧成立）。

刻意不做的事：不改 `engine`（它那份是"底座自己的模型"，语义上仍独立）；本桥是**只读并集**。
"""
from __future__ import annotations

import logging

log = logging.getLogger("rdf.bridge")

# 业务命名空间的 IRI 前缀：{prefix}{ns}#{node_id}
BRIDGE_IRI = "https://dgiotcloud.cn/graph/"
_IN_NS = BRIDGE_IRI + "inNamespace"

# 节点上的**通用溯源键**（白名单）：投影成 {域}#{键} 谓词。
# 只这三个：多一个就变成"谓词集合由数据决定"，那是另一种漂移。
ATTR_KEYS = ("src", "src_grade", "description")


def hub_namespaces() -> dict:
    """统一图库里的命名空间表；读不到就返回空（不炸掉本体出口）。"""
    try:
        from ..plugin_runtime import runtime
        return runtime.graph.namespaces() or {}
    except Exception as e:  # noqa: BLE001
        log.warning("读取统一图库命名空间失败（本体出口将只含引擎模型）：%s", e)
        return {}


def merged(engine):
    """返回 (rdflib.Graph, info)。

    info = {"engine_triples": n, "namespaces": [{"ns","nodes","edges","triples"}...]}
    —— 数字全部现算，供 /rdf/stats 显示，别处不许手抄。
    """
    from rdflib import OWL, Graph, Literal, Namespace, RDF, RDFS, URIRef

    g = Graph()
    engine_ttl = engine.export_turtle()
    g.parse(data=engine_ttl, format="turtle")
    engine_triples = len(g)

    info = {"engine_triples": engine_triples, "namespaces": []}
    try:
        from ..plugin_runtime import runtime
        hub = runtime.graph
    except Exception as e:  # noqa: BLE001
        log.warning("拿不到统一图库句柄：%s", e)
        info["total_triples"] = len(g)
        return g, info

    for ns in sorted(hub_namespaces()):
        info["namespaces"].append(_add_namespace(g, hub, ns))
    info["total_triples"] = len(g)
    return g, info


def _add_namespace(g, hub, ns):
    """把某个命名空间的节点/类/关系词/边写进 g —— **唯一的构造处**。

    merged() 与 namespace_graph() 都走这里：免得"同一段三元组规则"出现两份，
    一处改了另一处不改（本仓最忌讳的漂移）。返回该命名空间的规模摘要。
    """
    from rdflib import Literal, Namespace, OWL, RDF, RDFS, URIRef

    # 个体按**命名空间**分；类与关系词属「**域**」，只有一份身份。
    # 未声明域就退回命名空间 —— 向后兼容，既有插件一字不改。
    try:
        dom = hub.domain(ns) or ns
    except Exception:  # noqa: BLE001
        dom = ns
    nsf = Namespace(BRIDGE_IRI + str(ns) + "#")
    dsf = Namespace(BRIDGE_IRI + str(dom) + "#")
    before = len(g)
    try:
        # 必须用**未精简**的节点：nodes() 只给展示字段，溯源字段（src/src_grade）会被丢掉
        nodes = hub.raw_nodes(ns) or []
        edges = hub.edges(ns) or []
    except Exception as e:  # noqa: BLE001
        log.warning("命名空间 %s 读取失败：%s", ns, e)
        return {"ns": ns, "error": str(e)}
    for n in nodes:
        nid = n.get("id")
        if not nid:
            continue
        s = nsf[str(nid)]
        cat = str(n.get("category") or n.get("type") or "Node")
        g.add((s, RDF.type, dsf[cat]))
        if n.get("label"):
            g.add((s, RDFS.label, Literal(str(n["label"]), lang="zh")))
        g.add((s, URIRef(_IN_NS), Literal(str(ns))))
        # 通用溯源投影（白名单）：任何域都可能需要标"这条从哪来、可信到什么程度"。
        # 刻意只投影这三个键 —— 不把节点上任意键都变成谓词（那会让谓词集合由数据决定）。
        # 语言标签按语义分：src / src_grade 是**机器码**（引用串、8 档闭集）⇒ 普通字面量，
        # 否则 SHACL 的 sh:in 精确比较会对不上（2026-10-05 实测：带 @zh 时正常数据全数判否）；
        # description 是给人看的散文 ⇒ @zh。
        for key in ATTR_KEYS:
            val = n.get(key)
            if val not in (None, ""):
                if key == "description":
                    g.add((s, dsf[key], Literal(str(val), lang="zh")))
                else:
                    g.add((s, dsf[key], Literal(str(val))))
    for e in edges:
        s_id, t_id = e.get("source"), e.get("target")
        if not s_id or not t_id:
            continue
        rel = str(e.get("relation") or e.get("type") or "related")
        g.add((nsf[str(s_id)], dsf[rel], nsf[str(t_id)]))
    # 类层：命名空间的 category → owl:Class（否则 SPARQL 里按类查不到，
    # SHACL 也没有类可指）。标签取 category 的 label。
    try:
        cats = hub.categories(ns) or []
    except Exception:  # noqa: BLE001
        cats = []
    for c in cats:
        cid = c.get("id")
        if not cid:
            continue
        cls = dsf[str(cid)]
        g.add((cls, RDF.type, OWL.Class))
        g.add((cls, RDFS.label, Literal(str(c.get("label") or cid), lang="zh")))
        g.add((cls, URIRef(_IN_NS), Literal(str(ns))))
    # 关系词 → owl:ObjectProperty（关系词是闭集，词表本身也是本体的一部分）
    rels = sorted({str(e.get("relation") or e.get("type")) for e in edges
                   if (e.get("relation") or e.get("type"))})
    for r in rels:
        g.add((dsf[r], RDF.type, OWL.ObjectProperty))
        g.add((dsf[r], RDFS.label, Literal(r, lang="zh")))
    return {"ns": ns, "nodes": len(nodes), "edges": len(edges),
            "categories": len(cats), "relations": len(rels), "triples": len(g) - before}


def namespace_graph(ns):
    """只含某个命名空间的 RDF 图（词汇与 merged() 完全一致，同一构造处）。"""
    from rdflib import Graph

    g = Graph()
    try:
        from ..plugin_runtime import runtime
        hub = runtime.graph
    except Exception as e:  # noqa: BLE001
        log.warning("拿不到统一图库句柄：%s", e)
        return g, {"ns": str(ns), "error": str(e)}
    return g, _add_namespace(g, hub, ns)


def shapes_for(ns):
    """某个命名空间携带的形状（Turtle 原文）；没携带返回空串（不是错误）。"""
    return hub_namespaces_shapes().get(str(ns), "")


def hub_namespaces_shapes() -> dict:
    """统一图库里各命名空间携带的 SHACL 形状（Turtle 原文）。"""
    try:
        from ..plugin_runtime import runtime
        return runtime.graph.shapes() or {}
    except Exception as e:  # noqa: BLE001
        log.warning("读取统一图库形状失败：%s", e)
        return {}


def merged_shapes(engine):
    """形状图：引擎的形状 ∪ 统一图库里各业务命名空间携带的形状。

    返回 (turtle_text, info)。形状是「什么算合规」—— 底座有 pyshacl（能力）与导出出口，
    但**结论由各域自跑**（业务插件自带形状与结论）。
    单个命名空间的形状坏了就出声并跳过它，**不静默**、也不拖垮其余导出。
    """
    from rdflib import Graph

    engine_shapes = engine.export_shacl()
    g = Graph()
    try:
        g.parse(data=engine_shapes, format="turtle")
    except Exception as e:  # noqa: BLE001
        log.warning("引擎形状解析失败（仍按原文返回）：%s", e)
        return engine_shapes, {"engine_parse_ok": False, "namespaces": []}
    info = {"engine_parse_ok": True, "engine_shape_triples": len(g), "namespaces": []}
    for ns, txt in sorted(hub_namespaces_shapes().items()):
        before = len(g)
        try:
            g.parse(data=txt, format="turtle")
        except Exception as e:  # noqa: BLE001
            log.warning("命名空间 %s 的形状解析失败，已跳过：%s", ns, e)
            info["namespaces"].append({"ns": ns, "ok": False, "error": str(e)})
            continue
        info["namespaces"].append({"ns": ns, "ok": True, "triples": len(g) - before})
    return g.serialize(format="turtle"), info


def stats(engine):
    """与引擎 `rdf_stats()` 同形状的计数（界面显示的三元组/类/属性一律取这里）。"""
    from rdflib import OWL, RDF
    g, info = merged(engine)
    classes = set(g.subjects(RDF.type, OWL.Class))
    obj_props = set(g.subjects(RDF.type, OWL.ObjectProperty))
    dt_props = set(g.subjects(RDF.type, OWL.DatatypeProperty))
    prefixes = sorted({str(p) for p in g.namespaces()})
    return {
        "triples": len(g),
        "classes": len(classes),
        "object_properties": len(obj_props),
        "datatype_properties": len(dt_props),
        "namespaces": prefixes,
        "graph_hub": {"engine_triples": info["engine_triples"],
                      "business_namespaces": info["namespaces"]},
    }
