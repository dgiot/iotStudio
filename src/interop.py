# ============================================================
# P1: 标准互操作 — DTDL v3 / SSN-SOSA 导出 + 关系基数评估
# ============================================================
# 词汇映射 (与 docs/BENCHMARK.md 对标表及 OWL 导出器一致):
#   Site     → DTDL Interface Site          | sosa:Platform
#   Gateway  → DTDL Interface Gateway       | sosa:Platform (hosting)
#   Channel  → DTDL Interface Channel       | ssn:System (协议采集系统)
#   Device   → DTDL Interface Device        | sosa:Sensor (带测点) / ssn:System (其余)
#   Point    → DTDL Telemetry (per 类目)    | sosa:ObservableProperty
#   Link     → DTDL Relationship (词表)     | 实例间 dg:{relation} 属性
#   约束基数  → DTDL relationship min/maxMultiplicity (Foundry Link Type 同语义)
# 全部纯函数: 不修改 engine, 可安全反复调用 (测试断言幂等)。
from typing import Dict, List, Optional

try:
    from .ontology import LINK_RELATIONS
except ImportError:
    from ontology import LINK_RELATIONS

DG_NS = "http://dgiot.cloud/ontology#"
DTMI_PREFIX = "dtmi:dgiot"

# 基数声明 (工艺合理性默认, 可按站点覆盖):
#   src_max = 单一源实例允许的最大出边数; tgt_max = 单一目标实例允许的最大入边数
#   None = 该关系不声明基数 (只观测不判罚)
CARDINALITY_RULES: Dict[str, Dict[str, Optional[int]]] = {
    "maps_to":    {"src_max": 1, "tgt_max": 4},   # 一通道映射一数据源
    "powered_by": {"src_max": 2, "tgt_max": 8},   # 设备双路供电上限 / 一继电器供电 8 台
    "feeds_into": {"src_max": 4, "tgt_max": 4},
    "monitors":   {"src_max": 8, "tgt_max": 4},
    "controls":   {"src_max": 8, "tgt_max": 8},
    "relates_to": {"src_max": None, "tgt_max": None},
    "has_defect": {"src_max": None, "tgt_max": None},
    "has_issue":  {"src_max": None, "tgt_max": None},
}


def _observe(engine) -> Dict[str, dict]:
    """按关系词观测出度/入度分布 (只读)"""
    out_c: Dict[str, Dict[str, int]] = {}
    in_c: Dict[str, Dict[str, int]] = {}
    for l in engine.links.values():
        out_c.setdefault(l.relation, {}).setdefault(l.source, 0)
        out_c[l.relation][l.source] += 1
        in_c.setdefault(l.relation, {}).setdefault(l.target, 0)
        in_c[l.relation][l.target] += 1
    return {"out": out_c, "in": in_c}


def _dist(counter: Dict[str, int]) -> dict:
    vals = list(counter.values()) or [0]
    return {"nodes": len(counter), "min": min(vals),
            "avg": round(sum(vals) / len(vals), 2), "max": max(vals)}


def evaluate_cardinality(engine) -> dict:
    """关系基数评估 — 声明 (CARDINALITY_RULES) vs 实测出/入度分布 + 违规清单

    对标 Foundry Link Type / DTDL Relationship 的 min/maxMultiplicity 语义;
    输出可直接回写为 DTDL relationship 的 min/maxMultiplicity。
    """
    obs = _observe(engine)
    per_relation, violations = {}, []
    for rel in sorted(LINK_RELATIONS):
        rule = CARDINALITY_RULES.get(rel, {})
        out_d = _dist(obs["out"].get(rel, {}))
        in_d = _dist(obs["in"].get(rel, {}))
        rel_violations = []
        for side, counter, cap_key in (("src", obs["out"].get(rel, {}), "src_max"),
                                       ("tgt", obs["in"].get(rel, {}), "tgt_max")):
            cap = rule.get(cap_key)
            if not cap:
                continue
            for entity, count in counter.items():
                if count > cap:
                    rel_violations.append({
                        "entity": entity, "side": side, "count": count, "cap": cap,
                        "message": f"{entity} 的 {rel} {side} 侧 {count} 条, 超过声明上限 {cap}"})
        violations.extend(rel_violations)
        per_relation[rel] = {"declared": rule,
                             "observed_out": out_d, "observed_in": in_d,
                             "violations": rel_violations}
    return {"links_checked": len(engine.links),
            "total_violations": len(violations), "violations": violations,
            "per_relation": per_relation}


def _dtdl_iface(name: str, display: str, contents: List[dict]) -> dict:
    return {"@type": "Interface",
            "@id": f"{DTMI_PREFIX}:{name.lower()};1",
            "displayName": display,
            "contents": contents}


def export_dtdl(engine) -> dict:
    """导出 DTDL v3 模型 (Azure Digital Twins / DTDL 生态可摄入)

    模型层导出: 5 层各一个 Interface; 测点聚合为 Device 上的 Telemetry (按类目);
    观测到的关系词生成 Relationship 定义, 基数取自 CARDINALITY_RULES。
    """
    iface_for = {"site": "Site", "gateway": "Gateway", "channel": "Channel",
                 "device": "Device", "datasource": "DataSource"}

    # 观测 (src_type, relation, tgt_type) 组合 → Relationship 放到源接口上
    rel_pairs = set()
    for l in engine.links.values():
        st = engine.entity_type(l.source)
        tt = engine.entity_type(l.target)
        if st in iface_for and tt in iface_for:
            rel_pairs.add((st, l.relation, tt))

    interfaces = []
    for layer, name in iface_for.items():
        contents: List[dict] = []
        if layer == "device":
            cats = sorted({p.category or "telemetry" for p in engine.points.values()})
            for cat in cats:
                contents.append({"@type": "Telemetry", "name": cat,
                                 "displayName": f"测点类目 {cat}",
                                 "schema": "double"})
        if layer == "site":
            contents.append({"@type": "Property", "name": "location",
                             "schema": "string"})
        for (st, rel, tt) in sorted(rel_pairs):
            if st != layer:
                continue
            rule = CARDINALITY_RULES.get(rel, {})
            rel_contents = {"@type": "Relationship", "name": rel,
                            "target": f"{DTMI_PREFIX}:{iface_for[tt].lower()};1",
                            "displayName": f"关系 {rel}"}
            if rule.get("src_max") is not None:
                rel_contents["maxMultiplicity"] = rule["src_max"]
                rel_contents["minMultiplicity"] = 0
            contents.append(rel_contents)
        interfaces.append(_dtdl_iface(layer, name, contents))

    return {
        "@context": "dtmi:dtdl:context;3",
        "@type": "Model",
        "models": interfaces,
        "meta": {
            "interfaces": len(interfaces),
            "entity_counts": engine.health()["counts"],
            "note": "模型层导出 (类级); 实例数据经 dtdl 实例清单另行同步",
        },
    }


def export_ssn(engine) -> dict:
    """导出 SSN/SOSA JSON-LD (W3C 语义传感器网络本体)

    Site/Gateway → sosa:Platform; Channel → ssn:System;
    Device → sosa:Sensor (带测点) 或 ssn:System; Point → sosa:ObservableProperty;
    Link → dg:{relation} 有向属性 (与 OWL 导出器同一词表命名空间)。
    """
    graph: List[dict] = []
    site_nodes = []
    for sid, s in engine.sites.items():
        site_nodes.append({"@id": f"{DG_NS}{sid}", "@type": "sosa:Platform",
                           "label": s.name})
    graph.extend(site_nodes)
    for gid, g in engine.gateways.items():
        node = {"@id": f"{DG_NS}{gid}", "@type": "sosa:Platform",
                "label": g.hostname or gid,
                "ssn:hostedBy": {"@id": f"{DG_NS}{g.site}"}}
        graph.append(node)
    for cid, c in engine.channels.items():
        graph.append({"@id": f"{DG_NS}{cid}", "@type": "ssn:System",
                      "label": c.name, "dg:protocol": c.protocol,
                      "ssn:hasSubSystem": {"@id": f"{DG_NS}{c.gateway}"}})
    for did, d in engine.devices.items():
        pts = [p.id for p in engine.points.values() if p.device == did]
        dtype = "sosa:Sensor" if pts else "ssn:System"
        node = {"@id": f"{DG_NS}{did}", "@type": dtype, "label": d.name,
                "dg:deviceType": d.type,
                "ssn:hasSubSystem": {"@id": f"{DG_NS}{d.channel}"}}
        if pts:
            node["sosa:observes"] = [{"@id": f"{DG_NS}{pid}"} for pid in pts]
        graph.append(node)
    for pid, p in engine.points.items():
        graph.append({"@id": f"{DG_NS}{pid}",
                      "@type": "sosa:ObservableProperty",
                      "label": p.name, "dg:category": p.category or "",
                      **({"ssn:forProperty": p.unit} if p.unit else {})})
    for dsid, ds in engine.datasources.items():
        graph.append({"@id": f"{DG_NS}{dsid}", "@type": "dg:DataSource",
                      "label": ds.type or dsid,
                      "ssn:hasSubSystem": {"@id": f"{DG_NS}{ds.gateway}"}})
    for l in engine.links.values():
        graph.append({"@id": f"{DG_NS}{l.id}",
                      "@type": "dg:RelationStatement",
                      f"dg:{l.relation}": {"@id": f"{DG_NS}{l.target}"},
                      "ssn:hasSubSystem": {"@id": f"{DG_NS}{l.source}"}})
    return {
        "@context": {
            "sosa": "http://www.w3.org/ns/sosa/",
            "ssn": "http://www.w3.org/ns/ssn/",
            "dg": DG_NS,
            "label": "http://www.w3.org/2000/01/rdf-schema#label",
        },
        "@graph": graph,
        "meta": {"nodes": len(graph), "entity_counts": engine.health()["counts"]},
    }


def export_prov(engine, fmt: str = "turtle") -> str:
    """导出 W3C PROV-O 数据血缘 (rdflib; 与 OWL 导出器同一依赖)

    映射:
      Point (数据流) → prov:Entity, prov:wasGeneratedBy 通道采集活动
      Channel        → prov:Activity, prov:used 设备
      DataSource     → prov:Entity, prov:wasGeneratedBy 映射通道;
                       feeds_into 链 → prov:wasDerivedFrom 派生关系
      Device         → prov:Entity, prov:wasAttributedTo 网关
      Gateway        → prov:SoftwareAgent, prov:actedOnBehalfOf 站点
      Site           → prov:Organization
    纯函数: 只读 engine, 不落任何状态。
    """
    from rdflib import Graph, Namespace, RDF, URIRef

    PROV = Namespace("http://www.w3.org/ns/prov#")
    DG = Namespace(DG_NS)
    g = Graph()
    g.bind("prov", PROV)
    g.bind("dg", DG)

    def U(x: str) -> URIRef:
        return DG[x]

    # 站点 = 组织 Agent; 网关 = 软件 Agent
    for sid, s in engine.sites.items():
        g.add((U(sid), RDF.type, PROV.Organization))
        g.add((U(sid), RDF.type, PROV.Agent))
    for gid, gw in engine.gateways.items():
        g.add((U(gid), RDF.type, PROV.SoftwareAgent))
        g.add((U(gid), RDF.type, PROV.Agent))
        g.add((U(gid), PROV.actedOnBehalfOf, U(gw.site)))

    # 设备 = Entity (被观测对象), 归属网关
    for did, d in engine.devices.items():
        g.add((U(did), RDF.type, PROV.Entity))
        g.add((U(did), PROV.wasAttributedTo, U(d.channel)))  # 通道即其接入面
        ch = engine.channels.get(d.channel)
        if ch:
            g.add((U(did), PROV.wasAttributedTo, U(ch.gateway)))

    # 通道 = 采集活动
    for cid, c in engine.channels.items():
        g.add((U(cid), RDF.type, PROV.Activity))

    # 测点 = Entity, 由通道活动生成
    for pid, p in engine.points.items():
        g.add((U(pid), RDF.type, PROV.Entity))
        dev = engine.devices.get(p.device)
        if dev:
            g.add((U(pid), PROV.wasGeneratedBy, U(p.device)))
            g.add((U(dev.id), PROV.used, U(pid)))
        ch = engine.channels.get(dev.channel) if dev else None
        if ch:
            g.add((U(pid), PROV.wasGeneratedBy, U(ch.id)))

    # 数据源 = Entity, 由映射通道生成 (maps_to); feeds_into → 派生链
    for dsid, ds in engine.datasources.items():
        g.add((U(dsid), RDF.type, PROV.Entity))
    for l in engine.links.values():
        if l.relation == "maps_to":
            ch = l.source if l.source in engine.channels else l.target
            ds = l.target if l.source == ch else l.source
            if ch in engine.channels and ds in engine.datasources:
                g.add((U(ds), PROV.wasGeneratedBy, U(ch)))
        elif l.relation == "feeds_into":
            g.add((U(l.target), PROV.wasDerivedFrom, U(l.source)))

    if fmt == "xml":
        return g.serialize(format="xml")
    return g.serialize(format="turtle")
