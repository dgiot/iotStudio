# ============================================================
# R1 关系显式化 单元测试 — Link 层 + 缺失方法补齐 + OWL 导出
# ============================================================
import sqlite3

import pytest

from src.ontology import (LINK_RELATIONS, Constraint, Link, OntologyEngine,
                          build_131_ontology)


def test_link_register_and_bidirectional_get_links():
    e = OntologyEngine()
    e.register(Link("L1", "dev_a", "dev_relay_00", "monitors", "A 监测继电器"))
    e.register(Link("L2", "dev_relay_00", "dev_b", "powered_by", "继电器供电 B"))
    assert len(e.get_links("dev_relay_00")) == 2          # 出边 + 入边
    assert len(e.get_links("dev_a")) == 1
    assert len(e.get_links("dev_relay_00", relation="monitors")) == 1
    assert e.entity_type("dev_relay_00") is None          # 引用完整性由 validate 管


def test_validate_dangling_endpoint_and_selfloop():
    e = OntologyEngine()
    e.register(Link("L1", "ghost", "dev_relay_00", "monitors"))
    e.register(Link("L2", "x", "x", "relates_to"))
    issues = e.validate()["issues"]
    assert any("L1" in i and "ghost" in i for i in issues)
    assert any("L2" in i and "自环" in i for i in issues)


def test_validate_unknown_relation():
    e = OntologyEngine()
    e.register(Link("L1", "a", "b", "loves"))
    issues = e.validate()["issues"]
    assert any("未知关系词" in i and "loves" in i for i in issues)


def test_validate_bad_rule_kind():
    e = OntologyEngine()
    e.register(Constraint(id="c1", name="n", rule="r", rule_kind="magic"))
    issues = e.validate()["issues"]
    assert any("c1" in i and "rule_kind" in i for i in issues)


def test_constraint_rule_kind_default():
    c = Constraint(id="c1", name="n", rule="r")
    assert c.rule_kind == "validation"


def test_build131_seeds_full_vocabulary():
    e = build_131_ontology()
    relations = {l.relation for l in e.links.values()}
    assert relations == LINK_RELATIONS                    # 八词表全覆盖
    assert len(e.links) >= 15
    # 所有端点可解析
    for l in e.links.values():
        for end in (l.source, l.target):
            assert e.entity_type(end) is not None, f"{l.id} 端点 {end} 未注册"
    # validate 无 Link/rule_kind 类问题
    issues = [i for i in e.validate()["issues"]
              if i.startswith("Link") or "rule_kind" in i]
    assert issues == []


def test_build131_rule_kind_all_classified():
    e = build_131_ontology()
    kinds = {c.rule_kind for c in e.constraints.values()}
    assert kinds <= {"mapping", "validation", "state", "inference", "automation"}
    assert kinds == {"mapping", "validation", "state", "inference", "automation"}  # 五类都有


def test_subgraph_from_relay_depth2():
    e = build_131_ontology()
    sg = e.subgraph("dev_relay_00", depth=2)
    ids = {n["id"] for n in sg["nodes"]}
    # 上行两层: dev_relay_00 → ch_a11_rtu → gw_131
    assert "ch_a11_rtu" in ids and "gw_131" in ids
    # 关系边带入: monitors/powered_by 对端
    assert "dev_well_DEV_A" in ids
    link_edges = [e2 for e2 in sg["edges"] if e2["kind"] == "link"]
    assert any(e2["relation"] == "monitors" for e2 in link_edges)
    assert any(e2["relation"] == "powered_by" for e2 in link_edges)
    assert sg["node_count"] == len(sg["nodes"])
    assert sg["edge_count"] == len(sg["edges"])


def test_subgraph_unknown_entity_raises():
    with pytest.raises(KeyError):
        build_131_ontology().subgraph("ghost_entity")


def test_local_context_relay():
    e = build_131_ontology()
    ctx = e.local_context("dev_relay_00")
    assert ctx["type"] == "device"
    assert ctx["parent"] == "ch_a11_rtu"
    assert ctx["text_context"].startswith("[device] dev_relay_00")
    assert any(l["relation"] == "monitors" for l in ctx["links"])


def test_community_summary_site_level():
    e = build_131_ontology()
    result = e.community_summary("site")
    assert result["level"] == "site"
    assert any(g["id"] == "site_131" for g in result["groups"]) or result["groups"]
    assert "节点" in result["text"]


def test_export_owl_object_properties():
    pytest.importorskip("rdflib")
    e = build_131_ontology()
    xml = e.export_owl()
    assert "ObjectProperty" in xml
    for rel in ("powered_by", "maps_to", "has_issue"):
        assert rel in xml, f"词表关系 {rel} 未进 OWL"
    assert "dev_relay_00" in xml


def test_rdf_roundtrip_link_triple():
    pytest.importorskip("rdflib")
    from rdflib import Graph, Namespace
    e = build_131_ontology()
    g = Graph().parse(data=e.export_owl(), format="xml")
    DG = Namespace("http://dgiot.cloud/ontology#")
    triple = (DG["dev_well_DEV_A"], DG["powered_by"], DG["dev_relay_00"])
    assert triple in g                                   # 关系断言真实入图


def test_export_turtle_prefixes():
    pytest.importorskip("rdflib")
    ttl = build_131_ontology().export_turtle()
    assert "@prefix" in ttl and "dgiot" in ttl


def test_sync_link_row(tmp_path, monkeypatch):
    import src.parse_lite as pl
    db_path = tmp_path / "parse.db"
    conn = sqlite3.connect(db_path)
    conn.execute("CREATE TABLE ontology_link (objectId TEXT PRIMARY KEY, "
                 "source_id TEXT, target_id TEXT, relation TEXT, "
                 "description TEXT, data TEXT DEFAULT '{}', "
                 "createdAt TEXT, updatedAt TEXT)")
    conn.commit()
    monkeypatch.setattr(pl, "get_db", lambda: conn)

    e = OntologyEngine()
    e.register(Link("L1", "dev_a", "dev_relay_00", "monitors", "测试边"))
    result = e.sync_to_parse()
    assert result["status"] == "synced"
    conn.close()

    check = sqlite3.connect(db_path)
    row = check.execute("SELECT source_id, target_id, relation FROM ontology_link "
                        "WHERE objectId='L1'").fetchone()
    check.close()
    assert row == ("dev_a", "dev_relay_00", "monitors")


def test_health_counts_links():
    e = build_131_ontology()
    h = e.health()
    assert h["version"] == "2.1"
    assert h["counts"]["links"] == len(e.links)
    assert "links" in e.to_dict()
