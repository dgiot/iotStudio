# ============================================================
# R1 关系显式化 单元测试 — Link 层 + 缺失方法补齐 + OWL 导出
# ============================================================
import sqlite3

import pytest

from src.ontology import (LINK_RELATIONS, Constraint, Gateway, Link, OntologyEngine,
                          Site, build_edge_ontology, build_engine)


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


# ── GB/T 48000.3 §8.2 a)2) 全局唯一标识规则 —— 执行者 ──
#
# 引擎只有**一个** id 空间（entity_type() 就是它的证据: id → 恰好一个类型）,
# 分表只是对它的分区。撞车时 entity_type() 遍历表返回**第一个**命中,
# 只会静默答一个类型 —— 冲突本身看不见。

def test_validate_rejects_cross_table_id_collision():
    """★ 一个 id 只能落进一张实体表, 撞车必须被 validate() 报出来。

    ★ 这条检查原先**不存在**, 证据是注入式实测（叶子实体, 不打断任何已有引用,
    所以唯一的变量就是撞车本身）: 撞车后 validate() 的 issues **一条不增**、
    valid 不变, 而图上那个 IRI 的 rdf:type 已经是 ['Gateway','Site']。
    谁删掉 validate() 开头那段检查, 这条会红。
    """
    e = OntologyEngine()
    e.register(Site(id="dup", name="站点"))
    e.register(Gateway(id="dup", ip="127.0.0.1", site="dup"))
    hit = [i for i in e.validate()["issues"] if "dup" in i and "两张实体表" in i]
    assert len(hit) == 1, "跨表同 id 未被报出: %s" % e.validate()["issues"]

    # 差分校: 不撞车时这条**不许**出现 —— 否则它只是在无差别报红
    e2 = OntologyEngine()
    e2.register(Site(id="dup", name="站点"))
    e2.register(Gateway(id="other", ip="127.0.0.1", site="dup"))
    assert [i for i in e2.validate()["issues"] if "两张实体表" in i] == []


def test_seeded_engines_have_no_id_collision():
    """正控: 出厂/库里的数据必须**零撞车**（实测 8 张表合计 0 处）。

    不然后面那条检查一上线就报红, 而红的是**数据**不是判据 —— 那种红会被
    当成噪音略过, 等真撞车时也没人看。
    """
    for name, e in (("build_edge_ontology", build_edge_ontology()),
                    ("build_engine", build_engine())):
        bad = [i for i in e.validate()["issues"] if "两张实体表" in i]
        assert bad == [], "%s 的出厂数据有跨表 id 撞车: %s" % (name, bad)


def test_validate_reports_collision_where_link_is_one_side():
    """★ link 表在同一个 id 空间里（entity_type() 覆盖 8 张表）, 但它**不产个体**
    （图上 0 个 rdf:type）⇒ 撞车的后果**不同**: 不合并, 只是 entity_type() 答错。

    这条钉住那个分支, 并且断言消息**不许 overclaim** —— 说 link 会「在图上合并」
    就是把 Site/Gateway 那半的理由原样搬到没有它的地方。只测前一条的话,
    这个分支写没写、写对没写对, 没有任何判据会亮。
    """
    e = OntologyEngine()
    e.register(Site(id="dup", name="站点"))
    e.register(Link("dup", "a", "b", "relates_to"))
    hit = [i for i in e.validate()["issues"] if "dup" in i and "两张实体表" in i]
    assert len(hit) == 1, "link 侧撞车未被报出: %s" % e.validate()["issues"]
    assert "合并" not in hit[0], "link 不产个体, 消息不许声称会合并: %s" % hit[0]


def test_cross_table_collision_really_merges_in_the_graph():
    """钉住上面那条检查的**理由**还在 —— 撞车确实在图上合并成一个个体。

    个体的 IRI 是 `DG[id]`、**与表无关**, 所以 [Site, Gateway] 同 id 时那个 IRI
    会同时挂上两个互斥的 rdf:type, 与本文件导出的 owl:disjointWith 直接矛盾 ——
    下载到的 .owl 自己打自己。

    哪天 IRI 改成按表加前缀（`DG["site/dup"]`）, 合并就不发生了, 这条会红:
    提醒回去改上面那条检查的措辞, 而不是让一条理由已消失的检查继续以
    「防合并」的名义挂着。
    """
    from rdflib import RDF, Namespace
    DG = Namespace("http://dgiot.cloud/ontology#")
    e = OntologyEngine()
    e.register(Site(id="dup", name="站点"))
    e.register(Gateway(id="dup", ip="127.0.0.1", site="dup"))
    g = e._rdf_graph()
    types = {str(o).rsplit("#", 1)[-1] for o in g.objects(DG["dup"], RDF.type)}
    assert types == {"Site", "Gateway"}, \
        "撞车没在图上合并（实测 %s）—— 上面那条检查的理由可能已失效" % types


def test_constraint_rule_kind_default():
    c = Constraint(id="c1", name="n", rule="r")
    assert c.rule_kind == "validation"


def test_build_edge_seeds_full_vocabulary():
    e = build_edge_ontology()
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


def test_build_edge_rule_kind_all_classified():
    e = build_edge_ontology()
    kinds = {c.rule_kind for c in e.constraints.values()}
    assert kinds <= {"mapping", "validation", "state", "inference", "automation"}
    assert kinds == {"mapping", "validation", "state", "inference", "automation"}  # 五类都有


def test_subgraph_from_relay_depth2():
    e = build_edge_ontology()
    sg = e.subgraph("dev_relay_00", depth=2)
    ids = {n["id"] for n in sg["nodes"]}
    # 上行两层: dev_relay_00 → ch_a11_rtu → gw_edge01
    assert "ch_a11_rtu" in ids and "gw_edge01" in ids
    # 关系边带入: monitors/powered_by 对端
    assert "dev_well_DEV_A" in ids
    link_edges = [e2 for e2 in sg["edges"] if e2["kind"] == "link"]
    assert any(e2["relation"] == "monitors" for e2 in link_edges)
    assert any(e2["relation"] == "powered_by" for e2 in link_edges)
    assert sg["node_count"] == len(sg["nodes"])
    assert sg["edge_count"] == len(sg["edges"])


def test_subgraph_unknown_entity_raises():
    with pytest.raises(KeyError):
        build_edge_ontology().subgraph("ghost_entity")


def test_local_context_relay():
    e = build_edge_ontology()
    ctx = e.local_context("dev_relay_00")
    assert ctx["type"] == "device"
    assert ctx["parent"] == "ch_a11_rtu"
    assert ctx["text_context"].startswith("[device] dev_relay_00")
    assert any(l["relation"] == "monitors" for l in ctx["links"])


def test_community_summary_site_level():
    e = build_edge_ontology()
    result = e.community_summary("site")
    assert result["level"] == "site"
    assert any(g["id"] == "site_demo" for g in result["groups"]) or result["groups"]
    assert "节点" in result["text"]


def test_export_owl_object_properties():
    pytest.importorskip("rdflib")
    e = build_edge_ontology()
    xml = e.export_owl()
    assert "ObjectProperty" in xml
    for rel in ("powered_by", "maps_to", "has_issue"):
        assert rel in xml, f"词表关系 {rel} 未进 OWL"
    assert "dev_relay_00" in xml


def test_rdf_roundtrip_link_triple():
    pytest.importorskip("rdflib")
    from rdflib import Graph, Namespace
    e = build_edge_ontology()
    g = Graph().parse(data=e.export_owl(), format="xml")
    DG = Namespace("http://dgiot.cloud/ontology#")
    triple = (DG["dev_well_DEV_A"], DG["powered_by"], DG["dev_relay_00"])
    assert triple in g                                   # 关系断言真实入图


def test_export_turtle_prefixes():
    pytest.importorskip("rdflib")
    ttl = build_edge_ontology().export_turtle()
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
    e = build_edge_ontology()
    h = e.health()
    assert h["version"] == "2.1"
    assert h["counts"]["links"] == len(e.links)
    assert "links" in e.to_dict()


def _unreachable_dg_types(g):
    """判据内核：返回 [(个体, 原有类型, 推不出来的新增类型)]。

    抽成独立函数是为了让**负控能验证它自己** —— 内核整个坏掉时，
    包在外面的测试只会安静地报「通过」。
    """
    import owlrl
    from rdflib import Namespace, RDF, RDFS

    DG = Namespace("http://dgiot.cloud/ontology#")

    def dg_types(s):
        return {o for o in g.objects(s, RDF.type) if str(o).startswith(str(DG))}

    mine = [s for s in set(g.subjects(RDF.type, None)) if str(s).startswith(str(DG))]
    before = {s: dg_types(s) for s in mine}

    owlrl.DeductiveClosure(owlrl.RDFS_OWLRL_Semantics,
                           rdfs_closure=True, axiomatic_triples=False).expand(g)

    def reachable(cls):
        """沿 rdfs:subClassOf 上溯（含自身）—— 允许的类型不是白名单，是「推得出来的」。"""
        seen, stack = {cls}, [cls]
        while stack:
            for sup in g.objects(stack.pop(), RDFS.subClassOf):
                if str(sup).startswith(str(DG)) and sup not in seen:
                    seen.add(sup)
                    stack.append(sup)
        return seen

    bad = []
    for s, was in before.items():
        added = dg_types(s) - was
        if not added:
            continue
        allowed = set()
        for t in was:
            allowed |= reachable(t)
        for t in sorted(added - allowed, key=str):
            bad.append((s.split("#")[-1],
                        sorted(x.split("#")[-1] for x in was) or ["(无)"],
                        t.split("#")[-1]))
    return bad


def test_no_individual_gets_an_unreachable_dg_type():
    """推理器不许把任何个体推成**两个互不可推**的 dg 类型。

    2026-09-20 实测的形态：`hasConstraint` 曾声明 domain=Device（被当成
    Site→Gateway→Channel→Device→Point 那条链的第五环），而实际有 Channel/Gateway
    在挂约束 ⇒ 跑 OWL-RL 后 4 个个体同时是 Channel 和 Device，**推理器一声不吭**
    （图里零 owl:disjointWith，矛盾没有触发点）。下游按类型查，它们会同时出现在
    两个类的结果里 —— 不报错，只是答错。

    **只看 dg 命名空间**：rdfs:Resource / owl:Thing / rdf:Property 是平凡闭包，
    每个个体都会被推出来（实测不滤掉它们，112 个个体「全中」），不构成信号。
    """
    pytest.importorskip("rdflib")
    pytest.importorskip("owlrl")
    from rdflib import Graph

    g = Graph().parse(data=build_edge_ontology().export_owl(), format="xml")
    bad = _unreachable_dg_types(g)
    assert bad == [], (
        "推理器长出了推不出来的 dg 类型 —— 某条 domain/range 声明与实际的用法不一致：\n  "
        + "\n  ".join(f"{s}: 原有 {was} → 多出 {add}" for s, was, add in bad)
    )


def test_the_checker_catches_an_injected_bad_domain():
    """**负控** —— 往图里塞一条错的 domain，内核必须报红。

    没有这条，上面那条在「内核整个坏掉」时也只是安静地报通过：
    `hasPoint` 的主语是 Device，把它声明成 domain=Channel，Device 就会被推成 Channel。
    """
    pytest.importorskip("rdflib")
    pytest.importorskip("owlrl")
    from rdflib import Graph, Namespace, RDFS

    DG = Namespace("http://dgiot.cloud/ontology#")
    g = Graph().parse(data=build_edge_ontology().export_owl(), format="xml")
    g.add((DG["hasPoint"], RDFS.domain, DG["Channel"]))      # 故意写错的声明

    bad = _unreachable_dg_types(g)
    assert bad, "注入了一条错 domain，内核却报绿 —— 判据自己坏了"
    assert any("Channel" in add for _, _, add in bad), f"报红了但没报在点子上: {bad}"
