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
#   AAS      → Site/Shell · Gateway·Channel·Device·DataSource/Submodel
#              Point/Property · Link/RelationshipElement · Constraint/Operation
#              (IEC 63278 / IDTA v3.0 — 见 export_aas())
#   PROV-O   → 测点/通道/数据源/设备/网关/站点的血缘链 (见 export_prov())
# 全部纯函数: 不修改 engine, 可安全反复调用 (测试断言幂等)。
import re
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


# ── AAS (IEC 63278 / IDTA AAS v3.0) — 资产管理壳 ────────────────────────────
#
# 与上面三个导出器共用的**一道脱敏门**（不是遗漏，别"补"回来）：
#   · 不导 `Gateway.ip` —— 内网地址即网络拓扑。
#   · 不导 `Channel.endpoint` / `DataSource.connection` —— 形制是
#     "host:port or connection string"，connection string 里可能带凭据。
#   · 不导 `Constraint.source` / `Constraint.action` —— 前者是现场配置文件名与
#     设备型号，后者出现过主机地址（`198.51.100.102`，虽是 RFC5737 保留段）。
#     导出器**不做**"这个 IP 算不算真地址"的判断：判据越细越容易漏，一律不带
#     才是可辩护的规则。这三处与「敏感配置永不进 git 历史」同源。
#   ⇒ 需要这些字段的消费方走运行时 API，不走对外标准导出物。

_AAS_ID_SHORT_BAD = re.compile(r"[^A-Za-z0-9_]")


def _aas_id_short(raw: str) -> str:
    """AAS 规范: idShort 须匹配 [a-zA-Z][a-zA-Z0-9_]*

    本体 id 含 `.` / `-` / 空格时不能直接放进 AAS —— 换掉并把首字符顶成字母，
    否则摄入侧（BaSyx / AASX 工具链）会拒收整个模型，而报错不会指到这一行。
    """
    s = _AAS_ID_SHORT_BAD.sub("_", str(raw))
    if not s or not s[0].isalpha():
        s = "x_" + s
    return s


def _aas_ref(iri: str) -> dict:
    """AAS Reference — 元素级引用统一走 ModelReference/GlobalReference"""
    return {"type": "ModelReference",
            "keys": [{"type": "GlobalReference", "value": iri}]}


def _aas_sm_ref(sm_id: str) -> dict:
    """Submodel 引用 —— AAS v3 里 Submodel 引用用 "Submodel" key，不是 GlobalReference"""
    return {"type": "ModelReference",
            "keys": [{"type": "Submodel", "value": sm_id}]}


def _aas_ml(text: str) -> List[dict]:
    """AAS MultiLanguageTextType"""
    return [{"language": "zh", "text": text}]


def _aas_xsd(value) -> str:
    """值 → XSD 类型名（AAS 的 valueType 取 XSD 内置类型）"""
    if isinstance(value, bool):
        return "xs:boolean"
    if isinstance(value, int):
        return "xs:int"
    if isinstance(value, float):
        return "xs:double"
    return "xs:string"


def _aas_prop(id_short: str, value, display: str = "") -> dict:
    """AAS Property —— 空串归 null（AAS 里 "" 与 null 语义不同：null = 无值）"""
    return {"modelType": "Property",
            "idShort": _aas_id_short(id_short),
            "valueType": _aas_xsd(value),
            "value": None if value == "" else value,
            "displayName": _aas_ml(display or id_short)}


def export_aas(engine) -> dict:
    """导出 AAS 资产管理壳 (IEC 63278 / IDTA AAS v3.0)

    类级映射依 docs/BENCHMARK.md 词汇映射表:
      Site       → AssetAdministrationShell (assetKind=Instance; 一站点一外壳)
      Gateway    → Submodel
      Device     → Submodel
      Point      → SubmodelElement: Property (挂在其 Device 的 Submodel 下)
      Link       → SubmodelElement: RelationshipElement (first/second 双引用)
      Constraint → SubmodelElement: Operation (挂在其 entity 所属 Submodel 下)

    两处**超出**映射表的补充（表中未列，为引用闭合与 AAS 惯例）:
      · Channel → Submodel —— 同 Gateway/Device 形制；Device 的归属链经它，
        不导出则 Submodel 之间的层级在 AAS 侧断开。
      · 实体标识字段（manufacturer/model/type/status…）→ Property ——
        AAS 的 Submodel 本就以 SubmodelElement 承载属性（铭牌语义）。

    挂不上 Submodel 的 Link（如 source 是 Point）计入 meta.orphans，
    **不静默丢弃** —— 「报总数前先拆成构成项」。

    纯函数: 只读 engine, 不落任何状态。
    """
    # 实体 → 所属 Site.id（Shell 分组用）
    def _gw_site(gid: str) -> str:
        return getattr(engine.gateways.get(gid), "site", "")

    def _ch_gw(cid: str) -> str:
        return getattr(engine.channels.get(cid), "gateway", "")

    def _dev_ch(did: str) -> str:
        return getattr(engine.devices.get(did), "channel", "")

    def _site_of(kind: str, oid: str) -> str:
        if kind == "site":
            return oid
        if kind == "gateway":
            return _gw_site(oid)
        if kind == "channel":
            return _gw_site(_ch_gw(oid))
        if kind == "device":
            return _gw_site(_ch_gw(_dev_ch(oid)))
        if kind == "datasource":
            return _gw_site(getattr(engine.datasources.get(oid), "gateway", ""))
        return ""

    submodels: List[dict] = []
    sm_by_entity: Dict[str, dict] = {}
    sm_site: Dict[str, str] = {}
    n_prop = 0
    n_point_prop = 0

    def _add_submodel(kind: str, oid: str, display: str, props: List[dict]) -> None:
        nonlocal n_prop
        n_prop += len(props)
        sm = {"modelType": "Submodel",
              "idShort": _aas_id_short(f"{kind}_{oid}"),
              "id": f"{DG_NS}sm_{oid}",
              "semanticId": _aas_ref(f"{DG_NS}Submodel/{kind}"),
              "displayName": _aas_ml(display),
              "submodelElements": list(props)}
        submodels.append(sm)
        sm_by_entity[oid] = sm
        sm_site[oid] = _site_of(kind, oid)

    for gid, g in sorted(engine.gateways.items()):
        _add_submodel("gateway", gid, g.hostname or gid, [
            _aas_prop("hostname", g.hostname), _aas_prop("os", g.os),
            _aas_prop("status", g.status)])

    for cid, c in sorted(engine.channels.items()):
        _add_submodel("channel", cid, c.name, [
            _aas_prop("protocol", c.protocol), _aas_prop("status", c.status)])

    for did, d in sorted(engine.devices.items()):
        props = [_aas_prop("type", d.type), _aas_prop("manufacturer", d.manufacturer),
                 _aas_prop("model", d.model), _aas_prop("devaddr", d.devaddr),
                 _aas_prop("product", d.product), _aas_prop("status", d.status)]
        for p in sorted(engine.points.values(), key=lambda x: x.id):
            if p.device != did:
                continue
            props.append({"modelType": "Property",
                          "idShort": _aas_id_short(p.id),
                          "valueType": "xs:double",
                          "value": None,
                          "displayName": _aas_ml(p.name),
                          "description": _aas_ml(
                              " ".join(x for x in (p.category, p.unit) if x) or p.id)})
            n_point_prop += 1
        _add_submodel("device", did, d.name, props)

    for dsid, ds in sorted(engine.datasources.items()):
        _add_submodel("datasource", dsid, ds.type or dsid, [
            _aas_prop("type", ds.type), _aas_prop("tag_count", ds.tag_count),
            _aas_prop("status", ds.status)])

    # Link → RelationshipElement，挂在**源实体**的 Submodel 下
    n_rel, orphan_links = 0, []
    for l in sorted(engine.links.values(), key=lambda x: x.id):
        sm = sm_by_entity.get(l.source)
        if sm is None:
            orphan_links.append(l.id)
            continue
        sm["submodelElements"].append({
            "modelType": "RelationshipElement",
            "idShort": _aas_id_short(l.id),
            "semanticId": _aas_ref(f"{DG_NS}{l.relation}"),
            "first": _aas_ref(f"{DG_NS}{l.source}"),
            "second": _aas_ref(f"{DG_NS}{l.target}"),
            "displayName": _aas_ml(l.relation)})
        n_rel += 1

    # Constraint → Operation（规则为输入、严重度为判定输出）
    n_op, orphan_cons = 0, []
    for cid, c in sorted(engine.constraints.items()):
        sm = sm_by_entity.get(c.entity)
        if sm is None:
            orphan_cons.append(cid)
            continue
        sm["submodelElements"].append({
            "modelType": "Operation",
            "idShort": _aas_id_short(cid),
            "semanticId": _aas_ref(f"{DG_NS}Constraint/{c.rule_kind}"),
            "displayName": _aas_ml(c.name),
            "description": _aas_ml(c.rule),
            "inputVariables": [{"value": _aas_prop("rule", c.rule)}],
            "outputVariables": [{"value": _aas_prop("severity", c.severity)}]})
        n_op += 1

    shells = []
    for sid, s in sorted(engine.sites.items()):
        shells.append({
            "modelType": "AssetAdministrationShell",
            "idShort": _aas_id_short(sid),
            "id": f"{DG_NS}aas_{sid}",
            "displayName": _aas_ml(s.name),
            "description": _aas_ml(f"{s.type} 站点"),
            "assetInformation": {"assetKind": "Instance",
                                 "globalAssetId": f"{DG_NS}{sid}",
                                 "assetType": _aas_ref(f"{DG_NS}Site/{s.type}")},
            "submodels": [_aas_sm_ref(sm["id"]) for oid, sm in sm_by_entity.items()
                          if sm_site.get(oid) == sid]})

    return {"shells": shells, "submodels": submodels,
            "meta": {"shells": len(shells), "submodels": len(submodels),
                     # 拆开报：333 这一个数会被读成「333 个测点」，
                     # 而其中只有 10 个是测点，其余是实体标识字段。
                     "properties": {"points": n_point_prop,
                                    "entity_fields": n_prop - n_point_prop,
                                    "total": n_prop},
                     "relationships": n_rel,
                     "operations": n_op,
                     "orphans": {"links": orphan_links, "constraints": orphan_cons},
                     "entity_counts": engine.health()["counts"],
                     "note": "实例层导出 (assetKind=Instance)；测点 value 为 null "
                             "—— 实时值走运行时 API, 不进标准导出物"}}
