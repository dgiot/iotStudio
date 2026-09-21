# ============================================================
# P1: 标准互操作 — DTDL v3 / SSN-SOSA 导出 + 关系基数评估
# ============================================================
# 词汇映射的**事实源是 vocab/alignment.json**, 不是本注释块。
#   (2026-09-16 之前正是「映射写在注释里、没有执行者」, 于是三处错静默通过:
#    ssn:hostedBy 词表里不存在 / ssn:forProperty 接字面量 / ssn:hasSubSystem 指向 Platform。
#    现在每条映射由 tests/test_ontology_alignment.py 拿去 vocab/*.ttl 逐条核。)
# 下表只为速览, 与 alignment.json 不符时以 alignment.json 为准:
#   Site     → DTDL Interface Site          | sosa:Platform
#   Gateway  → DTDL Interface Gateway       | sosa:Platform
#   Channel  → DTDL Interface Channel       | ssn:System (协议采集系统)
#   Device   → DTDL Interface Device        | sosa:Sensor (带测点) / ssn:System (其余)
#   Point    → DTDL Telemetry (per 类目)    | sosa:ObservableProperty
#   Link     → DTDL Relationship (词表)     | 实例间 dg:{relation} 属性
#   DataSource → DTDL Interface DataSource  | **无对应** — 保持 dg:DataSource
#   Constraint → DTDL/…                      | **无对应** — SSN/SOSA 不做约束表达
# SSN/SOSA 属性映射 (主体在词表公理下受不受限, 是选词的决定性依据):
#   sosa:isHostedBy   Channel/Device → 所属 Gateway  (两者都 ⊑ ssn:System ⇒ 客体须 sosa:Platform, Gateway 正是)
#   ssn:hasSubSystem  Device → Channel               (主体须是 System — Channel 是; DataSource/Link 不是, 故不用)
#   sosa:observes     Device → Point                 (sosa:Sensor ⊑ ∀sosa:observes.ObservableProperty)
#   ssn:implements    Device → sosa:Procedure (按 protocol 去重)  (值域在 sosa 侧 — ssn.ttl:353)
#   dg:site           Gateway → Site                 (自造 — isHostedBy 会推出 Gateway 是 ssn:System)
#   dg:unit           Point → 单位字面量              (自造 — SSN 无单位位置, 那是 QUDT/OM 的域)
#   dg:gateway / dg:source / dg:category / dg:protocol / dg:deviceType   自造
#   AAS      → Site/Shell · Gateway·Channel·Device·DataSource/Submodel
#              Point/Property · Link/RelationshipElement · Constraint/Operation
#              (IEC 63278 / IDTA v3.0 — 见 export_aas())
#   PROV-O   → 测点/通道/数据源/设备/网关/站点的血缘链 (见 export_prov())
# 全部纯函数: 不修改 engine, 可安全反复调用 (测试断言幂等)。
import re
from typing import Dict, List, Optional

try:
    from .ontology import ENTITY_CLASSES, HIER_PROPS, LINK_RELATIONS
except ImportError:
    from ontology import ENTITY_CLASSES, HIER_PROPS, LINK_RELATIONS

DG_NS = "http://dgiot.cloud/ontology#"
DTMI_PREFIX = "dtmi:dgiot"

# 基数声明 (工艺合理性默认, 可按站点覆盖):
#   src_max = 单一源实例允许的最大出边数; tgt_max = 单一目标实例允许的最大入边数
#   None = 该关系不声明基数 (只观测不判罚)
# ⚠️ 本表**只有上界, 没有下界字段** —— 没有任何一个键表达「至少几条」。
# 所以「未声明下界」与「下界为 0」在本表里是同一个样子; 下游要区分必须自己带上默认值语义
# （DTDL 侧原本正是靠硬写 minMultiplicity: 0 把这个区分抹平的, 见 export_dtdl()）。
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

    对标 Foundry Link Type / DTDL Relationship 的**上界**语义 (maxMultiplicity):
    输出里 per_relation[rel]["declared"] 就是 CARDINALITY_RULES 那一条, 可直接回写为
    DTDL relationship 的 maxMultiplicity。

    ⚠️ 原文写的是「min/maxMultiplicity」—— **声明超出实现**: CARDINALITY_RULES 没有下界
    字段, 本函数的 violations 也只可能由 `count > cap` 产生, 一句 min 都不判。
    保留这句订正而不是把 min 补上, 是因为「本域没有工艺上的下界依据」是事实,
    补一个 `src_min: 0` 只是把默认值写成声明值, 反而抹掉「未声明」与「声明为 0」的区别。
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
            # 只写**声明了的**那个界。原先这里在 max 之外硬写 `minMultiplicity: 0` ——
            # 那个 0 不是声明值, 是「这个键 DTDL 里有」的产物: CARDINALITY_RULES 根本没有
            # 下界字段（见该表上方的注）, 却因此把「未声明」输出成了「声明为 0」。
            # DTDL 侧不写 minMultiplicity 时默认就是 0 ⇒ 删掉它对消费者**等价**,
            # 但从此「未声明」与「声明为 0」在下发的文件里长得不一样。
            # 判据侧的证据: tests/test_interop.py 只钉了 maxMultiplicity,
            # 这个 0 从来没有判据要过 —— 它错了也没人亮。
            if rule.get("src_max") is not None:
                rel_contents["maxMultiplicity"] = rule["src_max"]
            contents.append(rel_contents)
        interfaces.append(_dtdl_iface(layer, name, contents))

    # ── 本导出**不含什么** —— 现算, 不手写 ──────────────────────────────
    # 与 shacl_shapes() 往形状图根节点写 report["unformatted"] 同一个手法:
    # 导出的东西不自述自己缺什么, 下游就会把这份文件当成完整件用。
    # 每一句都从上面那几张表**现算** —— 手写的缺口清单会随实现漂移, 而且没人会亮。
    emitted = {c["name"] for i in interfaces for c in i["contents"]}
    missing_classes = sorted(c for c in ENTITY_CLASSES.values()
                             if c.lower() not in {n.lower() for n in iface_for.values()})
    hier_absent = sorted(p for p, _d, _r, _x in HIER_PROPS if p not in emitted)
    std_keys = {"@type", "name", "target", "displayName",
                "maxMultiplicity", "minMultiplicity"}
    extra_keys = sorted({k for i in interfaces for c in i["contents"]
                         if c["@type"] == "Relationship" for k in c} - std_keys)
    coverage = {
        "classes_without_interface": missing_classes,
        "hierarchy_properties_absent": hier_absent,
        "relations_without_declared_lower_bound": sorted(
            rel for rel, rule in CARDINALITY_RULES.items() if not any("min" in k for k in rule)),
        "relationship_extra_keys": extra_keys,
        "why": [
            "DTDL Relationship 是**类级**定义, 而 Link 的 id/description/props 是**实例级**的; "
            "本导出不产出任何实例 ⇒ 边上的属性在这里无处安放（%s）。"
            % ("当前无额外键" if not extra_keys else "当前有额外键: " + ", ".join(extra_keys)),
            "层级在本导出里**没有载体** —— Interface 之间既没有 extends, 也没有层级 Relationship。",
            "minMultiplicity 只在 CARDINALITY_RULES **声明了**下界时才写; 该表没有下界字段, "
            "所以一个都不写。**这是「未声明」, 不是「下界为 0」** —— 要区分得读这里, 别读键的缺席。",
            "缺 Interface 的类: %s。" % (", ".join(missing_classes) or "无"),
        ],
    }

    return {
        "@context": "dtmi:dtdl:context;3",
        "@type": "Model",
        "models": interfaces,
        "meta": {
            "interfaces": len(interfaces),
            "entity_counts": engine.health()["counts"],
            "note": "模型层导出 (类级); 实例数据经 dtdl 实例清单另行同步",
            "coverage": coverage,
        },
    }


def _iri_safe(text: str) -> str:
    """把任意文本压成可拼进 IRI 的片段 (protocol 里有空格与斜杠, 直接拼会破坏 IRI)。"""
    return re.sub(r"[^A-Za-z0-9_.-]", "_", text).strip("_")


def export_ssn(engine) -> dict:
    """导出 SSN/SOSA JSON-LD (W3C 语义传感器网络本体)

    Site/Gateway → sosa:Platform; Channel → ssn:System;
    Device → sosa:Sensor (带测点) 或 ssn:System; Point → sosa:ObservableProperty;
    Link → dg:{relation} 有向属性 (与 OWL 导出器同一词表命名空间)。

    映射逐条记在 vocab/alignment.json, 由 tests/test_ontology_alignment.py 核。
    选词的硬约束是**主体在词表公理下受不受限**:
      ssn:System ⊑ ∀ssn:hasSubSystem.ssn:System   ⇒ 非 System 主体不许用它
      ssn:System ⊑ ∀sosa:isHostedBy.sosa:Platform ⇒ 主体是 System 时客体必须是 Platform
      sosa:Sensor ⊑ (ssn:implements min 1)        ⇒ 标了 Sensor 就必须给规程
    主体不在约束内的, 一律用小写 dg: 本地词, 不冒充标准。
    """
    graph: List[dict] = []
    for sid, s in engine.sites.items():
        graph.append({"@id": f"{DG_NS}{sid}", "@type": "sosa:Platform",
                      "label": s.name})
    for gid, g in engine.gateways.items():
        # 站点归属用 dg:site 而非 sosa:isHostedBy —— 不是偷懒, 是那条断言在 SSN 下不成立:
        #   Gateway isHostedBy Site  --(sosa:hosts owl:inverseOf sosa:isHostedBy)-->
        #   Site hosts Gateway       --(Site 是 sosa:Platform)-->
        #   sosa:Platform ⊑ ∀sosa:hosts.ssn:System  ⟹  Gateway 是 ssn:System
        # 而 Gateway 声明的是 sosa:Platform, 且 Platform 并不是 System 的子类
        # ⇒ 推理器会追加一个我们没有依据的类型。Gateway 到底算不算 System 我们不知道,
        #   不许按猜测填一个像样的标准词顶上。关系不丢, 但不声称它对齐了。
        graph.append({"@id": f"{DG_NS}{gid}", "@type": "sosa:Platform",
                      "label": g.hostname or gid,
                      "dg:site": {"@id": f"{DG_NS}{g.site}"}})
    for cid, c in engine.channels.items():
        # Channel 是 ssn:System ⇒ 受约束, 客体 Gateway 正是 sosa:Platform ⇒ 满足
        graph.append({"@id": f"{DG_NS}{cid}", "@type": "ssn:System",
                      "label": c.name, "dg:protocol": c.protocol,
                      "sosa:isHostedBy": {"@id": f"{DG_NS}{c.gateway}"}})

    # 采集规程按 protocol 去重生成; protocol 为空也建一个, 诚实表达
    # 「有这个规程、但不知道是哪个」—— 缺了它 Sensor 的 min 1 基数会凭空造个体。
    # 类型是 sosa:Procedure 而非 ssn:Procedure: ssn.ttl:353 写死了
    #   ssn:System ⊑ ∀ssn:implements.sosa:Procedure
    # 值域在 sosa 侧 —— 声明成 ssn:Procedure 会被推理器追加 sosa:Procedure。
    procs: Dict[str, str] = {}
    for c in engine.channels.values():
        key = (c.protocol or "").strip()
        procs.setdefault(key, f"proc_{_iri_safe(key) or 'unspecified'}")
    for key, pid in procs.items():
        graph.append({"@id": f"{DG_NS}{pid}", "@type": "sosa:Procedure",
                      "label": f"{key} 采集规程" if key else "未指明规程 (protocol 为空)"})

    for did, d in engine.devices.items():
        pts = [p.id for p in engine.points.values() if p.device == did]
        dtype = "sosa:Sensor" if pts else "ssn:System"
        ch = engine.channels.get(d.channel)
        node = {"@id": f"{DG_NS}{did}", "@type": dtype, "label": d.name,
                "dg:deviceType": d.type,
                "ssn:hasSubSystem": {"@id": f"{DG_NS}{d.channel}"}}
        if ch is not None:
            node["sosa:isHostedBy"] = {"@id": f"{DG_NS}{ch.gateway}"}
        if pts:
            node["sosa:observes"] = [{"@id": f"{DG_NS}{pid}"} for pid in pts]
        if dtype == "sosa:Sensor":   # min 1 基数只挂在 sosa:Sensor 上
            node["ssn:implements"] = {"@id": f"{DG_NS}{procs[(ch.protocol or '').strip() if ch else '']}"}
        graph.append(node)
    for pid, p in engine.points.items():
        # 单位是 QUDT/OM 的域, SSN 里没有位置 —— dg:unit 是自造, 不冒充标准
        graph.append({"@id": f"{DG_NS}{pid}",
                      "@type": "sosa:ObservableProperty",
                      "label": p.name, "dg:category": p.category or "",
                      **({"dg:unit": p.unit} if p.unit else {})})
    for dsid, ds in engine.datasources.items():
        # 主体是 dg:DataSource, 不是 ssn:System ⇒ 用标准词无依据
        graph.append({"@id": f"{DG_NS}{dsid}", "@type": "dg:DataSource",
                      "label": ds.type or dsid,
                      "dg:gateway": {"@id": f"{DG_NS}{ds.gateway}"}})
    for l in engine.links.values():
        # dg:RelationStatement 完全自造, 更不该用标准属性
        graph.append({"@id": f"{DG_NS}{l.id}",
                      "@type": "dg:RelationStatement",
                      f"dg:{l.relation}": {"@id": f"{DG_NS}{l.target}"},
                      "dg:source": {"@id": f"{DG_NS}{l.source}"}})

    # 产物自己要说清它没对齐什么 —— 否则下游分不出哪些是标准类、哪些是我们自造的
    unmapped = sorted({n["@type"] for n in graph
                       if isinstance(n.get("@type"), str) and n["@type"].startswith("dg:")})
    return {
        "@context": {
            "sosa": "http://www.w3.org/ns/sosa/",
            "ssn": "http://www.w3.org/ns/ssn/",
            "dg": DG_NS,
            "label": "http://www.w3.org/2000/01/rdf-schema#label",
        },
        "@graph": graph,
        "meta": {
            "nodes": len(graph),
            "entity_counts": engine.health()["counts"],
            "unmapped": unmapped,
            "unmapped_note": ("这些类型在 SSN/SOSA 里没有对应, 保持 dg: 本地词; "
                              "另: Constraint 不参与 SSN 导出。逐条见 vocab/alignment.json"),
        },
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
