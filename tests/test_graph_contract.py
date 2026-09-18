# ============================================================
# 图库接缝的契约 —— 带内容的夹具
# ============================================================
"""这一组补的是**一个从没有过一次真实载荷的接缝**。

实测 (2026-09-17): `register_graph(` 在本仓**零调用点** —— 只有定义与两处
文档注释; `plugins/` 下**没有一个文件**含 `"label"`; 连 `plugin_runtime.py`
的用法范例都是个裸变量 `ctx.register_graph(ontology)`, 而 `ontology` 的
形状**没有任何地方定义过**。`test_graph_store.py` 测的是 data_kind 推导,
它全部本体都是 `{"nodes": [], "edges": []}`, 唯一非空的一处是个只有 id、
没有 label/category 的节点。

后果不是「测试覆盖不足」那么轻: **契约只能靠读消费者源码发现**。第一个
真生产者 (仓外的 `presale` 包) 首版按本体字段名 `name`/`layer` 发载荷,
`load()` 一个都不查 ⇒ **装载成功、报错为零**, 但每个节点在页面上都是空标签、
`nodes(category=)` 恒空。它自己加了回归护栏, 但**契约的定义处应该在底座**,
否则每个包各写一遍 —— 正是 `graph_store.load()` 里那段注释在骂的
「一个事实四处各写一遍」。

所以本文件是**契约的唯一定义处**, 夹具用的是真实字段名:

    节点   id(必需) / label / category / description
    边     id / source / target / relation / label
    类别   id(必需) / label / color
    约束   节点的 category 必须命中 categories[].id (或留空 —— 空是合法的)

判据写法遵循本仓纪律: **正控与负控同时在场** —— 每条「必须报」都配一条
「不许报」, 否则「永远报」也能让前者通过。
"""
import logging

from src.graph_store import MemoryGraphProvider

NS = "ns_contract"

# ── 带内容的夹具: 每个字段都有值, 且值彼此可区分 ──
# 不用占位符 (a/b/c): 字段名写错时, 有内容的夹具才会露馅 —— 空夹具对
# 「label 取不到」与「label 本来就是空」是盲的。
CONTRACT_ONTOLOGY = {
    "name": "契约夹具",
    "version": "1",
    "data_kind": "合成演示本体",          # 不标注就会被推成「未标注」, 但要显式写成演示件
    "categories": [
        {"id": "device", "label": "设备",   "color": "#8a6f4e"},
        {"id": "point",  "label": "数据项", "color": "#4e7a6f"},
    ],
    "nodes": [
        {"id": "d1", "label": "1#变压器", "category": "device", "description": "容量 800kVA"},
        {"id": "d2", "label": "2#变压器", "category": "device", "description": "容量 630kVA"},
        {"id": "p1", "label": "油温",     "category": "point",  "description": "绕组温度"},
        {"id": "p2", "label": "负载率",   "category": "point",  "description": "额定负载百分比"},
    ],
    "edges": [
        {"id": "e1", "source": "d1", "target": "p1",
         "relation": "has_point", "label": "测点"},
        {"id": "e2", "source": "d2", "target": "p2",
         "relation": "has_point", "label": "测点"},
    ],
}

# ── 负控夹具: 生产者的字段名与契约不一致 (本体字段 name/layer) ──
# 这是仓外第一个真生产者首版的实际形态, 保留下来当回归。
WRONG_FIELD_ONTOLOGY = {
    "name": "字段名写错的夹具",
    "data_kind": "合成演示本体",
    "categories": [{"id": "device", "label": "设备", "color": "#8a6f4e"}],
    "nodes": [
        {"id": "d1", "name": "1#变压器", "layer": "device"},
        {"id": "d2", "name": "2#变压器", "layer": "device"},
    ],
    "edges": [{"id": "e1", "source": "d1", "target": "d2",
               "relation": "feeds", "name": "供电"}],
}


def _load(ont, ns=NS):
    p = MemoryGraphProvider()
    p.load(ns, ont)
    return p


def _warned(caplog, needle):
    return [r.getMessage() for r in caplog.records if needle in r.getMessage()]


# ═══════════════════════════════════════════════════════════════
# ① 夹具自己得不是空的 —— 少了这条, 下面全部正控在空夹具上也成立
# ═══════════════════════════════════════════════════════════════

def test_fixture_actually_has_content():
    """夹具自证有内容。**空夹具对「字段取不到」与「本来就是空」是盲的。**"""
    p = _load(CONTRACT_ONTOLOGY)
    st = p.stats(NS)
    assert st["nodes"] == 4, "夹具的节点数变了 —— 下面所有正控的分母跟着变"
    assert st["edges"] == 2
    assert st["category_count"] == 2
    assert st["dangling"] == 0, "夹具里不该有悬空边"
    assert st["orphans"] == 0, "夹具里不该有孤立节点"


# ═══════════════════════════════════════════════════════════════
# ② 正控 —— 契约字段全部出得来 (这一组就是契约本身)
# ═══════════════════════════════════════════════════════════════

def test_node_fields_survive_the_round_trip():
    """节点透传: 生产者写什么, 查询侧就取得到什么。

    底座**不做字段归一化** (`by_id[nid] = n` 原样存), 所以这里断言的
    不是「底座会转换」, 而是「契约字段在链路上没有中间商」。
    """
    p = _load(CONTRACT_ONTOLOGY)
    rows = {n["id"]: n for n in p.nodes(NS)}
    assert set(rows) == {"d1", "d2", "p1", "p2"}
    for nid, n in rows.items():
        assert n.get("label"), f"{nid} 的 label 取不到 —— 页面上就是空标签"
        assert n.get("category"), f"{nid} 的 category 取不到 —— 按类别查会漏掉它"
        assert n.get("description") is not None, f"{nid} 的 description 取不到"


def test_category_filter_is_not_vacuous():
    """`nodes(category=)` 必须**真的过滤**, 不是恒空也不是恒满。

    三个断言缺一不可: 命中 2 个 (对) / 不是 4 个 (没过滤) / 不是 0 个 (恒空)。
    仓外第一个真生产者首版就栽在第三态上 —— 装载成功、报错为零, 而它恒空。
    """
    p = _load(CONTRACT_ONTOLOGY)
    got = [n["id"] for n in p.nodes(NS, category="device")]
    assert sorted(got) == ["d1", "d2"], f"device 类应恰好 2 个, 实得 {got}"


def test_categories_carry_label_and_color():
    """类别表是页面图例的来源 —— 缺 label 图例没字, 缺 color 图例没色。"""
    p = _load(CONTRACT_ONTOLOGY)
    cats = {c["id"]: c for c in p.categories(NS)}
    assert set(cats) == {"device", "point"}
    for cid, c in cats.items():
        assert c.get("label"), f"类别 {cid} 没有 label"
        assert c.get("color"), f"类别 {cid} 没有 color"
    # 每类节点数: 图例要显示「设备 2」
    assert {cid: c["count"] for cid, c in cats.items()} == {"device": 2, "point": 2}


def test_edge_label_survives():
    p = _load(CONTRACT_ONTOLOGY)
    for e in p.edges(NS):
        assert e.get("label"), f"边 {e.get('id')} 没有 label —— 线上没有文字"


# ═══════════════════════════════════════════════════════════════
# ③ 负控 —— 字段名写错时, 底座**不报错**, 但必须**出声**
# ═══════════════════════════════════════════════════════════════

def test_wrong_field_names_load_silently_but_do_warn(caplog):
    """把「静默失效」钉成可执行的证据, 同时钉住**它现在会出声**。

    前半段 (装载不抛错 + 契约字段确实取不到) 记录的是**缺陷形态**, 不是
    期望行为 —— 它存在的意义是让后面那句「所以必须出声」有对象。
    后半段才是判据: 全缺 label 是「字段名与契约不一致」的指纹, 必须报。
    """
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        p = _load(WRONG_FIELD_ONTOLOGY)          # 不抛错 —— 这就是问题所在

    rows = p.nodes(NS)
    assert [n.get("label") for n in rows] == [None, None], \
        "字段名写错却取到了 label —— 底座的透传契约变了, 这条负控要重写"
    assert p.nodes(NS, category="device") == [], \
        "按 category 过滤出东西了 —— 那么同伴踩的坑已不复现, 本条应改红"

    hits = _warned(caplog, "一个都没有 label")
    assert hits, ("字段名整体写错必须出声 —— 否则装载成功、报错为零, "
                  "查的人只会怀疑数据少, 不会怀疑字段名")
    assert "label" in hits[0] and "category" in hits[0], \
        f"出声时必须把契约写出来, 实得: {hits[0]}"


# ═══════════════════════════════════════════════════════════════
# ④ 悬空类别 —— 正控 (必须报) 与三条负控 (不许报)
# ═══════════════════════════════════════════════════════════════

def test_unresolved_category_warns_and_is_counted(caplog):
    """正控: category 有值、但 categories 里没声明 ⇒ 报, 且计数可查。"""
    ont = {
        "data_kind": "合成演示本体",
        "categories": [{"id": "device", "label": "设备", "color": "#8a6f4e"}],
        "nodes": [{"id": "d1", "label": "变1", "category": "device"},
                  {"id": "d2", "label": "变2", "category": "devcie"}],   # 打错一个字母
        "edges": [],
    }
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        p = _load(ont)

    assert _warned(caplog, "没在 categories 里声明"), "悬空类别必须出声"
    assert p.stats(NS)["unresolved_categories"] == 1
    assert p.stats(NS)["unresolved_categories"] == p.namespaces()[NS]["unresolved_categories"], \
        "两个出口口径必须一致 (一个事实一个源)"


def test_legal_categories_do_not_warn(caplog):
    """负控: 全部命中 ⇒ 不许报。缺这条, 「永远报」也能让上面那条通过。"""
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        p = _load(CONTRACT_ONTOLOGY)
    assert not _warned(caplog, "没在 categories 里声明")
    assert p.stats(NS)["unresolved_categories"] == 0


def test_empty_category_is_legal_and_silent(caplog):
    """负控: **类别为空是合法的** (节点可以不分类) —— 报它就是假阳性,
    而正常本体一律挨报的判据等于没有判据。"""
    ont = {
        "data_kind": "合成演示本体",
        "categories": [{"id": "device", "label": "设备", "color": "#8a6f4e"}],
        "nodes": [{"id": "d1", "label": "变1", "category": "device"},
                  {"id": "x1", "label": "游离节点"}],          # 没有 category 键
        "edges": [],
    }
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        p = _load(ont)
    assert not _warned(caplog, "没在 categories 里声明"), \
        "缺 category 是合法的, 不许报成悬空类别"
    assert p.stats(NS)["unresolved_categories"] == 0


def test_no_categories_declared_at_all_is_not_a_warning(caplog):
    """负控的边界: 本体压根没声明 categories, 且节点也都没写 category
    ⇒ 不是缺口, 是一个「没有分类维度」的合法本体。"""
    ont = {"data_kind": "合成演示本体",
           "nodes": [{"id": "d1", "label": "变1"}], "edges": []}
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        p = _load(ont)
    assert not _warned(caplog, "没在 categories 里声明")
    assert p.stats(NS)["unresolved_categories"] == 0


# ═══════════════════════════════════════════════════════════════
# ⑤ 缺 label —— 正控 (全缺才报) 与负控 (差一个就不报)
# ═══════════════════════════════════════════════════════════════

def test_all_nodes_missing_label_warns(caplog):
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        _load(WRONG_FIELD_ONTOLOGY)
    assert _warned(caplog, "一个都没有 label")


def test_one_labelled_node_among_many_silences_it(caplog):
    """负控: 只在**一个都不剩**时出声。

    部分缺 label 可能是刻意的 (骨架节点), 报它假阳性高于收益 ——
    而一个「每次装载都报」的判据会被读成噪声, 然后被无视。
    """
    ont = dict(CONTRACT_ONTOLOGY)
    ont["nodes"] = [dict(n) for n in CONTRACT_ONTOLOGY["nodes"]]
    ont["nodes"][0] = {"id": "d1", "label": "1#变压器", "category": "device"}
    ont["nodes"][1] = {"id": "d2", "category": "device"}        # 这一个没有 label
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        p = _load(ont)
    assert not _warned(caplog, "一个都没有 label"), \
        "只要还有一个节点带 label 就不该报 —— 否则这条判据会变成噪声"
    assert p.stats(NS)["unlabeled_nodes"] == 1, \
        "不出声不等于不计数: 差几个是可查的"


def test_empty_graph_does_not_warn_about_labels(caplog):
    """负控: **空本体不许报**。`unlabeled == len(nodes)` 在 0 == 0 时恒真 ——
    少了 `by_id and` 这个前提, 每个空图库装载时都会挨一句无意义的告警。"""
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        _load({"nodes": [], "edges": []})
    assert not _warned(caplog, "一个都没有 label"), \
        "空图库报「一个都没有 label」是 0==0 恒真的假阳性"
