# ============================================================
# P1 标准互操作测试 — DTDL v3 / SSN-SOSA 导出 + 关系基数评估
# ============================================================
import pytest

from src.interop import (CARDINALITY_RULES, evaluate_cardinality, export_dtdl,
                         export_ssn)
from src.ontology import Link, build_131_ontology


@pytest.fixture(scope="module")
def engine():
    return build_131_ontology()


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
    g = export_ssn(engine)
    pw = [n for n in g["@graph"] if "dg:powered_by" in n]
    assert pw                                            # 断电边进 SSN 图
    assert all(n["ssn:hasSubSystem"]["@id"].startswith("http") for n in pw)


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
