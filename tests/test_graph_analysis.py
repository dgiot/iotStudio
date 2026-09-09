# ============================================================
# R3 图分析测试 — 路径 / 影响半径 / 中心性
# ============================================================
import pytest

from src.ontology import build_131_ontology


@pytest.fixture(scope="module")
def engine():
    return build_131_ontology()


# ── 影响半径 (blast-radius) ──

def test_impact_relay_power_chain(engine):
    """验收口径: 保护继电器失电 → 供电油井受击 (powered_by 反向遍历)"""
    r = engine.graph_impact("dev_relay_00")
    by_id = {a["id"]: a for a in r["affected"]}
    for well in ("dev_well_DEV_A", "dev_well_DEV_B"):
        assert well in by_id, f"{well} 不在断电打击面"
        a = by_id[well]
        assert a["severity"] == "critical" and a["confidence"] == 1.0
        assert a["hops"] == 1
        assert a["path"][0]["relation"] == "powered_by"
        assert a["path"][0]["kind"] == "link"


def test_impact_direct_victims_not_decayed(engine):
    """第 1 跳不吃衰减: 直接受害者置信 = 边权本身"""
    r = engine.graph_impact("dev_relay_00", decay=0.5)
    assert max(a["confidence"] for a in r["affected"]) == 1.0


def test_impact_hierarchy_containment(engine):
    """包容失效下行: 继电器挂掉, 其下测点全 critical (层级边)"""
    r = engine.graph_impact("dev_relay_00")
    by_id = {a["id"]: a for a in r["affected"]}
    for pt in ("pt_ia", "pt_ib", "pt_ic", "pt_p", "pt_f"):
        assert by_id[pt]["severity"] == "critical"
        assert by_id[pt]["path"][0]["kind"] == "hierarchy"


def test_impact_data_chain_no_attribution_edges(engine):
    """数据链传播 + has_defect/has_issue 静态归属绝不入传播路径"""
    r = engine.graph_impact("ch_modbus_tcp")
    by_id = {a["id"]: a for a in r["affected"]}
    assert "ch_oracle" in by_id          # feeds_into 下游
    assert "ds_oracle" in by_id          # 经由链路可达
    for a in r["affected"]:
        for hop in a["path"]:
            assert hop["relation"] not in ("has_defect", "has_issue")


def test_impact_decay_parameter(engine):
    """decay 越小 → 远端实体跌出半径 / 置信更低"""
    wide = engine.graph_impact("dev_relay_00", decay=0.7)
    narrow = engine.graph_impact("dev_relay_00", decay=0.2)
    assert narrow["count"] <= wide["count"]
    wide_max = max(a["hops"] for a in wide["affected"])
    assert max(a["hops"] for a in narrow["affected"]) <= wide_max
    # 低 decay 下 2 跳以外的置信应低于高 decay 同跳数
    narrow_by_h2 = [a["confidence"] for a in narrow["affected"] if a["hops"] >= 2]
    wide_by_h2 = [a["confidence"] for a in wide["affected"] if a["hops"] >= 2]
    if narrow_by_h2 and wide_by_h2:
        assert max(narrow_by_h2) < max(wide_by_h2)


def test_impact_summary_bands(engine):
    r = engine.graph_impact("dev_relay_00")
    assert r["count"] == sum(r["summary"].values()) > 0
    assert set(r["summary"]) == {"critical", "high", "medium", "low"}


def test_impact_unknown_entity(engine):
    with pytest.raises(KeyError):
        engine.graph_impact("ghost_entity")


def test_impact_sorted_by_confidence(engine):
    r = engine.graph_impact("gw_131")
    confs = [a["confidence"] for a in r["affected"]]
    assert confs == sorted(confs, reverse=True)


# ── 最短路径 ──

def test_path_well_to_oracle_multikind(engine):
    """验收口径: 井口 → Oracle 数据源, 层级+关系边混合寻路"""
    r = engine.graph_path("dev_well_DEV_A", "ds_oracle")
    assert r["found"] is True and r["length"] == 3
    assert len(r["paths"]) >= 2                       # 多条等长路径
    assert "gw_131" in r["nodes"]
    assert r["paths"][0][0]["from"] == "dev_well_DEV_A"


def test_path_link_shortcut(engine):
    """关系边捷径: 两继电器经 relates_to 1 跳直连 (层级需 2 跳)"""
    r = engine.graph_path("dev_relay_00", "dev_relay_10")
    assert r["length"] == 1
    assert r["paths"][0][0]["relation"] == "relates_to"


def test_path_same_entity(engine):
    r = engine.graph_path("dev_well_DEV_A", "dev_well_DEV_A")
    assert r["length"] == 0 and r["paths"] == [[]]


def test_path_disconnected_pair(engine):
    """约束节点不在功能邻接图中 → 不连通 (非异常)"""
    r = engine.graph_path("dev_well_DEV_A", "c_overcurrent")
    assert r["found"] is False and r["paths"] == []


def test_path_unknown_entity_raises(engine):
    with pytest.raises(KeyError):
        engine.graph_path("ghost", "dev_well_DEV_A")
    with pytest.raises(KeyError):
        engine.graph_path("dev_well_DEV_A", "ghost")


# ── 中心性 (GDS 式) ──

def test_centrality_degree_hub(engine):
    r = engine.graph_centrality("degree", top=5)
    top_ids = [t["id"] for t in r["top"]]
    assert "gw_131" in top_ids[:3]                    # 网关 = 全站枢纽
    assert r["graph_nodes"] > 50


def test_centrality_betweenness_hub(engine):
    r = engine.graph_centrality("betweenness", top=5)
    assert r["top"][0]["id"] == "gw_131"
    assert r["top"][0]["score"] > 0                   # Brandes 修正后非零


def test_centrality_bad_mode(engine):
    with pytest.raises(ValueError):
        engine.graph_centrality("eigenvector")
