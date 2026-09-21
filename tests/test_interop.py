# ============================================================
# P1 标准互操作测试 — DTDL v3 / SSN-SOSA 导出 + 关系基数评估
# ============================================================
import pytest

from src.interop import (CARDINALITY_RULES, evaluate_cardinality, export_aas,
                         export_dtdl, export_prov, export_ssn)
from src.ontology import Constraint, Link, build_edge_ontology


@pytest.fixture(scope="module")
def engine():
    return build_edge_ontology()


def _counts(engine):
    return engine.health()["counts"]


# ── DTDL v3 ──

def test_dtdl_structure(engine):
    m = export_dtdl(engine)
    assert m["@context"] == "dtmi:dtdl:context;3" and m["@type"] == "Model"
    ids = {i["@id"] for i in m["models"]}
    assert {"dtmi:dgiot:site;1", "dtmi:dgiot:gateway;1", "dtmi:dgiot:channel;1",
            "dtmi:dgiot:device;1"} <= ids


def test_dtdl_relationships_with_multiplicity(engine):
    m = export_dtdl(engine)
    rels = [c for i in m["models"] for c in i["contents"]
            if c["@type"] == "Relationship"]
    names = {r["name"] for r in rels}
    assert {"powered_by", "maps_to"} <= names            # 种子里已观测
    for r in rels:
        if r["name"] in ("maps_to", "powered_by"):
            assert isinstance(r["maxMultiplicity"], int)


def test_dtdl_telemetry_from_points(engine):
    m = export_dtdl(engine)
    dev = next(i for i in m["models"] if i["@id"] == "dtmi:dgiot:device;1")
    telem = [c for c in dev["contents"] if c["@type"] == "Telemetry"]
    assert telem and all(c["schema"] == "double" for c in telem)


def test_dtdl_pure_and_idempotent(engine):
    before = _counts(engine)
    a, b = export_dtdl(engine), export_dtdl(engine)
    assert a == b                                        # 幂等
    assert _counts(engine) == before                     # 无副作用


# ── SSN/SOSA ──

def test_ssn_structure_and_types(engine):
    g = export_ssn(engine)
    assert "http://www.w3.org/ns/sosa/" in g["@context"]["sosa"]
    nodes = g["@graph"]
    types = {}
    for n in nodes:
        for t in ([n["@type"]] if isinstance(n["@type"], str) else n.get("@type", [])):
            types.setdefault(t, []).append(n)
    assert any(n["@id"].endswith("industry_c1") for n in types["sosa:Platform"])
    assert types["sosa:Sensor"]                          # 带测点设备 → Sensor
    assert types["sosa:ObservableProperty"]              # 测点 → ObservableProperty
    assert types["ssn:System"]                           # 无测点设备/通道 → System
    assert types["dg:DataSource"]


def test_ssn_device_observes_points(engine):
    g = export_ssn(engine)
    dev = next(n for n in g["@graph"] if n["@id"].endswith("dev_well_DEV_A"))
    assert dev["@type"] == "sosa:Sensor"
    observed = {o["@id"] for o in dev["sosa:observes"]}
    assert any(x.endswith("pt_tgp") for x in observed)


def test_ssn_relations_use_dg_vocabulary(engine):
    """关系具体化节点(Link)整体用 dg 本地词表 —— 关系边不该硬塞标准词。

    2026-09-16 改: 源端原先是 ssn:hasSubSystem, 但 dg:RelationStatement 不是
    ssn:System, 用标准属性既没有依据、又会触发推理污染(见 alignment.json)。
    现在源端是 dg:source。断言改成「整个节点不许出现 ssn:/sosa: 前缀」——
    那才是本测试的意图; 写死某个具体词名会把「换了个自造词」误判成回归。
    """
    g = export_ssn(engine)
    pw = [n for n in g["@graph"] if "dg:powered_by" in n]
    assert pw                                            # 断电边进 SSN 图
    for n in pw:
        assert n["dg:source"]["@id"].startswith("http")  # 源端是 IRI
        std = [k for k in n if k.split(":")[0] in ("ssn", "sosa")]
        assert not std, f"关系节点上出现了标准属性 {std} —— Link 是自造类, 不该冒充标准"


def test_ssn_pure_and_idempotent(engine):
    before = _counts(engine)
    assert export_ssn(engine) == export_ssn(engine)
    assert _counts(engine) == before


# ── 关系基数评估 ──

def test_cardinality_seed_clean(engine):
    r = evaluate_cardinality(engine)
    assert r["links_checked"] == _counts(engine)["links"]
    assert r["total_violations"] == 0                    # 种子本体健康
    for rel, info in r["per_relation"].items():
        assert set(info) >= {"declared", "observed_out", "observed_in", "violations"}


def test_cardinality_violation_detected(engine):
    """继电器超载: 一台继电器给 3 台设备供电 (声明 src_max=2)"""
    for well in ("dev_well_DEV_B", "dev_pump_01", "dev_relay_10"):
        engine.register(Link(id=f"lnk_pb_over_{well}", source="dev_relay_00",
                             target=well, relation="powered_by"))
    r = evaluate_cardinality(engine)
    assert r["total_violations"] >= 1
    v = next(x for x in r["violations"]
             if x["entity"] == "dev_relay_00" and x["side"] == "src")
    assert v["count"] > CARDINALITY_RULES["powered_by"]["src_max"]


def test_cardinality_undeclared_relation_not_penalized(engine):
    """relates_to 无声明 → 只观测不判罚"""
    engine.register(Link(id="lnk_rel_extra", source="dev_well_DEV_A",
                         target="dev_relay_10", relation="relates_to"))
    r = evaluate_cardinality(engine)
    assert all(x["entity"] != "dev_well_DEV_A" for x in r["violations"])


def test_cardinality_declared_metadata_exposed(engine):
    """声明可回写为 DTDL relationship 的 min/maxMultiplicity"""
    r = evaluate_cardinality(engine)
    mt = r["per_relation"]["maps_to"]["declared"]
    assert mt == {"src_max": 1, "tgt_max": 4}


# ── PROV-O 数据血缘 ──

def _prov_graph(engine):
    import rdflib
    return rdflib.Graph().parse(data=export_prov(engine), format="turtle")


def test_prov_structure_classes(engine):
    from rdflib import Namespace, RDF
    PROV = Namespace("http://www.w3.org/ns/prov#")
    g = _prov_graph(engine)
    assert len(list(g.subjects(RDF.type, PROV.Activity))) >= 10    # 通道
    assert len(list(g.subjects(RDF.type, PROV.SoftwareAgent))) >= 1  # 网关
    assert len(list(g.subjects(RDF.type, PROV.Entity))) >= 50      # 设备+测点+数据源


def test_prov_generation_chain(engine):
    """测点 wasGeneratedBy 通道活动; 活动 used 设备"""
    from rdflib import Namespace, URIRef
    PROV = Namespace("http://www.w3.org/ns/prov#")
    DG = Namespace("http://dgiot.cloud/ontology#")
    g = _prov_graph(engine)
    gen_by = {str(o) for s, _, o in g.triples((None, PROV.wasGeneratedBy, None))}
    assert any(x.endswith("ch_modbus_tcp") for x in gen_by)
    used = {str(o) for s, _, o in g.triples((None, PROV.used, None))}
    assert any(x.endswith("dev_well_DEV_A") or x.endswith("pt_tgp") for x in used)


def test_prov_derivation_via_feeds_into(engine):
    """feeds_into 链 → wasDerivedFrom (数据派生)"""
    from rdflib import Namespace
    PROV = Namespace("http://www.w3.org/ns/prov#")
    g = _prov_graph(engine)
    derived = {str(o) for s, _, o in g.triples((None, PROV.wasDerivedFrom, None))}
    assert any(x.endswith("ch_modbus_tcp") for x in derived)


def test_prov_attribution(engine):
    """网关 actedOnBehalfOf 站点"""
    from rdflib import Namespace
    PROV = Namespace("http://www.w3.org/ns/prov#")
    g = _prov_graph(engine)
    behalf = {str(o) for s, _, o in g.triples((None, PROV.actedOnBehalfOf, None))}
    assert any(x.endswith("industry_c1") for x in behalf)


def test_prov_pure_and_idempotent(engine):
    before = _counts(engine)
    a, b = export_prov(engine), export_prov(engine)
    assert a == b
    assert _counts(engine) == before


# ── AAS (IEC 63278 / IDTA v3.0) ──

def test_aas_shell_per_site(engine):
    a = export_aas(engine)
    assert a["meta"]["shells"] == _counts(engine)["sites"]
    assert a["shells"], "0 个 Shell —— 后面的断言都会变成空过"
    for s in a["shells"]:
        assert s["modelType"] == "AssetAdministrationShell"
        assert s["assetInformation"]["assetKind"] == "Instance"


def test_aas_submodel_per_entity(engine):
    a = export_aas(engine)
    ids = {s["id"] for s in a["submodels"]}
    assert any(x.endswith("sm_gw_edge01") for x in ids)            # Gateway → Submodel
    assert any(x.endswith("sm_ch_modbus_tcp") for x in ids)     # Channel → Submodel
    assert any(x.endswith("sm_dev_well_DEV_A") for x in ids)    # Device  → Submodel


def test_aas_every_submodel_referenced_by_exactly_one_shell(engine):
    """站点归属不能串：每个 Submodel 恰好被一个 Shell 引用"""
    a = export_aas(engine)
    ref = {}
    for sh in a["shells"]:
        for r in sh["submodels"]:
            ref.setdefault(r["keys"][0]["value"], []).append(sh["id"])
    assert len(ref) == len(a["submodels"])
    assert all(len(v) == 1 for v in ref.values())


def test_aas_point_becomes_property(engine):
    a = export_aas(engine)
    dev = next(s for s in a["submodels"] if s["id"].endswith("sm_dev_well_DEV_A"))
    props = [e for e in dev["submodelElements"] if e["modelType"] == "Property"]
    tgp = next((e for e in props if e["idShort"] == "pt_tgp"), None)
    assert tgp is not None
    assert tgp["valueType"] == "xs:double" and tgp["value"] is None
    # 总数必须拆得开：points 单独数，且与实体计数对得上
    m = a["meta"]["properties"]
    assert m["points"] == _counts(engine)["points"]
    assert m["total"] == m["points"] + m["entity_fields"]


def test_aas_link_becomes_relationship_element(engine):
    a = export_aas(engine)
    rels = [e for s in a["submodels"] for e in s["submodelElements"]
            if e["modelType"] == "RelationshipElement"]
    assert rels
    # Link 八词表 → semanticId（BENCHMARK 映射表的 "Link 八词表 → Relationship"）
    assert any(e["semanticId"]["keys"][0]["value"].endswith("powered_by") for e in rels)
    for e in rels:
        assert e["first"]["keys"][0]["value"].startswith("http")
        assert e["second"]["keys"][0]["value"].startswith("http")


def test_aas_constraint_becomes_operation(engine):
    a = export_aas(engine)
    ops = [e for s in a["submodels"] for e in s["submodelElements"]
           if e["modelType"] == "Operation"]
    assert ops
    assert any(e["idShort"] == "c_overcurrent" for e in ops)
    assert all(e["inputVariables"][0]["value"]["idShort"] == "rule" for e in ops)


def test_aas_orphans_are_counted_not_dropped(engine):
    """挂不上 Submodel 的边必须进 orphans —— 静默丢弃是本仓反复栽的坑。

    断言形式是「已挂 + 孤儿 == 总数」而非写死条数：总数由 agent 自己数，
    以后加种子边不用回来改测试（写死的条数会单向腐烂）。
    """
    a = export_aas(engine)
    m, c = a["meta"], _counts(engine)
    assert m["relationships"] + len(m["orphans"]["links"]) == c["links"]
    assert m["operations"] + len(m["orphans"]["constraints"]) == c["constraints"]
    assert m["relationships"] > 0, "一条都没挂上 —— 上面的等式会退化成 0+0"


def test_aas_orphan_branches_are_actually_exercised():
    """两条 orphans 分支必须被**真的走过** —— 否则上面的记账判据无法被验证。

    自证（破坏 orphan_cons.append 那行）暴露过：种子本体里 15 个 Constraint
    全部挂得上，Constraint 侧的空分支**从未执行**，把记账删掉判据也不会红。
    Link 侧之所以有效，只是 `lnk_map_tgp` 的 source 恰好是 Point —— 偶然，
    且靠种子数据维持。这里各造一条挂不上的，把分支逼出来。
    """
    e = build_edge_ontology()                      # 独立 engine，不污染 module fixture
    e.links["lnk_no_home"] = Link(id="lnk_no_home", source="pt_tgp",
                                  target="dev_relay_00", relation="relates_to")
    e.constraints["c_no_home"] = Constraint(id="c_no_home", name="无主约束",
                                            entity="ghost_entity", rule="r")
    m = export_aas(e)["meta"]
    c = e.health()["counts"]
    assert "lnk_no_home" in m["orphans"]["links"]
    assert "c_no_home" in m["orphans"]["constraints"]
    assert m["relationships"] + len(m["orphans"]["links"]) == c["links"]
    assert m["operations"] + len(m["orphans"]["constraints"]) == c["constraints"]


def test_aas_id_short_is_spec_conformant(engine):
    """AAS 规范: idShort 须匹配 [a-zA-Z][a-zA-Z0-9_]*（不合规摄入侧拒收整个模型）"""
    import re
    pat = re.compile(r"^[a-zA-Z][A-Za-z0-9_]*$")
    a = export_aas(engine)
    for s in a["shells"]:
        assert pat.match(s["idShort"]), s["idShort"]
    for s in a["submodels"]:
        assert pat.match(s["idShort"]), s["idShort"]
        for e in s["submodelElements"]:
            assert pat.match(e["idShort"]), e["idShort"]


def test_aas_export_omits_network_and_credential_fields(engine):
    """脱敏门：导出物不得含内网地址 / 连接串 / 现场配置出处

    两类断言缺一不可 —— 只断言「不含 X」时，导出物为空同样通过（基线为空＝空过）。
    """
    import json
    blob = json.dumps(export_aas(engine), ensure_ascii=False)
    assert "dev_well_DEV_A" in blob and "ch_modbus_tcp" in blob   # 正对照
    for banned in ("endpoint", "connection", "GENERIC_HMI.ini", "Device.ini",
                   "198.51.100.102"):
        assert banned not in blob, banned


def test_aas_pure_and_idempotent(engine):
    before = _counts(engine)
    a, b = export_aas(engine), export_aas(engine)
    assert a == b
    assert _counts(engine) == before
