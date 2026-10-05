# ============================================================
# 出口自述 —— OWL/TTL/JSON-LD 与 DTDL 两个出口必须说清「自己不含什么」
#
# 背景: 本仓三条对平缺口（docs/BENCHMARK.md「本体建模层」§三）的共同点不是
# 「能力没有」, 而是**导出的东西不自述自己缺什么**。SHACL 出口已经做对了
# （形状图根节点带 report["unformatted"]）, 这个文件把同一把尺子架到另两个出口上。
#
# ★ 判据设计要点（本仓纪律, 见 D:\ai\docs\ai-verification-design.md）:
#   1. 只验「自述在场」是**便宜的绿** —— 一份写死的假自述也能通过。
#      所以每条都要**注入式负控**: 改动被测对象, 读数必须**跟着变**。
#   2. 不许把「已知缺口」写成断言（如 `assert link 不在图里`）—— 那样**有人修好时
#      反而变红**, 惩罚修复。这里一律只断言**读数与实测自洽**, 缺口被填上后依然成立。
# ============================================================
import copy

import pytest

from src.interop import CARDINALITY_RULES, export_dtdl
from src.ontology import ENTITY_CLASSES, HIER_PROPS, Link, build_edge_ontology

DG_ROOT = "http://dgiot.cloud/ontology#"


@pytest.fixture()
def engine():
    return build_edge_ontology()


def _root_comment(engine):
    """OWL 导出里挂在本体 IRI 上的那段自述 —— 没有就返 None（不兜底填空串）。"""
    from rdflib import Graph, URIRef
    from rdflib.namespace import RDFS
    g = Graph().parse(data=engine.export_owl(), format="xml")
    notes = [str(o) for o in g.objects(URIRef(DG_ROOT), RDFS.comment)]
    return notes[0] if notes else None


def _duplicate_links(engine):
    """同一 (source, relation, target) 的重复组数 —— 独立现算, 不读被测对象自报的数。"""
    srt = {(l.source, l.relation, l.target) for l in engine.links.values()}
    return len(engine.links) - len(srt)


# ── OWL / Turtle / JSON-LD 出口 ──

def test_owl_export_carries_a_self_description(engine):
    """正控: 本体 IRI 上必须有一段自述（缺失即红 —— 不许静默无话）。"""
    note = _root_comment(engine)
    assert note, "OWL 导出的本体根节点上没有自述, 下游会把它当成完整件"
    plain = note.replace("**", "")
    # 自述必须点到那条最容易被误读的缺口, 不能只是一句「详见文档」。
    assert "Link" in plain and "完整载体" in plain and "不可区分" in plain


def test_owl_self_description_reports_the_measured_duplicate_count(engine):
    """★★ 自述里那个重复数必须是**算出来的**, 不是写死的。

    注入前 0 组、注入后 1 组 —— 读数跟着变才叫判据。一个恒真的实现
    （永远报 0, 或报一个漂亮但无关的数）在这里会被逮住。
    """
    before = _duplicate_links(engine)
    note_before = _root_comment(engine)
    assert "重复有 %d 组" % before in note_before

    # 注入: 与某条已有边同 (source, relation, target) 的第二条 Link, 只有 id 不同
    src_link = next(iter(engine.links.values()))
    engine.register(Link(id="lnk_dup_probe", source=src_link.source,
                         target=src_link.target, relation=src_link.relation))
    after = _duplicate_links(engine)
    note_after = _root_comment(engine)

    assert after == before + 1, "注入没生效, 这条判据没在测东西"
    assert "重复有 %d 组" % after in note_after
    assert note_after != note_before, "读数没跟着注入变 —— 那段自述是写死的"


def test_owl_self_description_states_the_link_count(engine):
    """自述里的 Link 条数也要现算 —— 同族注入: 加一条 link, 数要动。"""
    note_before = _root_comment(engine)
    n = len(engine.links)
    assert "（%d 条, 各带 id/props/description）" % n in note_before

    engine.register(Link(id="lnk_count_probe", source="dev_well_DEV_A",
                         target="dev_relay_10", relation="relates_to"))
    assert "（%d 条, 各带 id/props/description）" % (n + 1) in _root_comment(engine)


# ── DTDL 出口 ──

def _dtdl_relationships(model):
    return [c for i in model["models"] for c in i["contents"]
            if c["@type"] == "Relationship"]


def _has_declared_lower_bound(relation):
    """本仓此刻**: 没有** 下界字段。写成函数而不是内联 False ——
    将来加了 src_min, 只改这里一处, 判据的含义不变。"""
    rule = CARDINALITY_RULES.get(relation, {})
    return any("min" in k for k in rule)


def test_no_relationship_claims_an_undeclared_lower_bound(engine):
    """DTDL 出口不许把「未声明下界」输出成「下界为 0」。

    这条在**修好之后依然成立**（那时 _has_declared_lower_bound 为真, 断言自然通过）,
    所以它不是「已知缺口的断言」, 而是「声明与实现必须一致」的判据。
    """
    for r in _dtdl_relationships(export_dtdl(engine)):
        if "minMultiplicity" in r:
            assert _has_declared_lower_bound(r["name"]), (
                "%s 输出了 minMultiplicity=%r, 但 CARDINALITY_RULES 里没有下界声明"
                % (r["name"], r["minMultiplicity"]))


def test_that_check_actually_catches_an_injected_lower_bound(engine):
    """★ 上一条的注入式负控: 往模型里塞一个凭空的下界, 同一个检查必须报红。

    没有这一条, 上一条可能是**恒真**的（键从不出现 ⇒ 循环体一次都不进）。
    """
    model = copy.deepcopy(export_dtdl(engine))
    rels = [c for i in model["models"] for c in i["contents"]
            if c["@type"] == "Relationship"]
    assert rels, "DTDL 里一条 Relationship 都没有, 负控没东西可注入"
    rels[0]["minMultiplicity"] = 0                      # 凭空的下界

    caught = []
    for r in _dtdl_relationships(model):
        if "minMultiplicity" in r and not _has_declared_lower_bound(r["name"]):
            caught.append(r["name"])
    assert caught, "注入的凭空下界没被逮住 —— 上一条判据是恒真的"


def test_dtdl_coverage_declares_the_classes_it_omits(engine):
    """coverage 里缺 Interface 的类 == 独立算出的差集（注入式: 两边都要跟着动）。"""
    model = export_dtdl(engine)
    have = {i["@id"].rsplit(":", 1)[1].rsplit(";", 1)[0] for i in model["models"]}
    expected = sorted(c for c in ENTITY_CLASSES.values() if c.lower() not in have)
    got = model["meta"]["coverage"]["classes_without_interface"]
    assert got == expected
    assert got, "差集为空 ⇒ 这条断言退化成恒真, 说明五层已经覆盖了全部类"


def test_dtdl_coverage_declares_the_hierarchy_it_omits(engine):
    """层级属性缺席清单 == 实测缺席集（从**产出的内容**里查, 不是从常量里抄）。"""
    model = export_dtdl(engine)
    emitted = {c["name"] for i in model["models"] for c in i["contents"]}
    expected = sorted(p for p, _d, _r, _x in HIER_PROPS if p not in emitted)
    assert model["meta"]["coverage"]["hierarchy_properties_absent"] == expected
    assert expected == sorted(p for p, _d, _r, _x in HIER_PROPS), (
        "层级属性居然全在 DTDL 里 —— 那 coverage 的这句就过期了, 该改的是它")


def test_dtdl_coverage_is_measured_not_hardcoded(engine):
    """★ 注入: 改 CARDINALITY_RULES 的**下界**, 自述的对应清单必须跟着少一项。

    （改的是模块级字典, 用完还原 —— 同 test_dtdl_pure_and_idempotent 的洁癖。）
    """
    before = export_dtdl(engine)["meta"]["coverage"]["relations_without_declared_lower_bound"]
    assert before, "清单为空 ⇒ 这条判据没在测东西"
    victim = before[0]
    CARDINALITY_RULES[victim] = dict(CARDINALITY_RULES[victim], src_min=1)
    try:
        after = export_dtdl(engine)["meta"]["coverage"]["relations_without_declared_lower_bound"]
        assert victim not in after and len(after) == len(before) - 1
    finally:
        CARDINALITY_RULES[victim].pop("src_min")


def test_both_exports_point_at_each_other(engine):
    """两个出口的自述里都写了「另一个出口的自述在哪」—— 免得下游以为只有这一份。"""
    note = _root_comment(engine)
    assert "shacl_shapes" in note and "export_dtdl" in note
    why = " ".join(export_dtdl(engine)["meta"]["coverage"]["why"])
    assert why
