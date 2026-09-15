# ============================================================
# 本体形态 — 数据来源闭集与脱敏事实
# ============================================================
"""这一组补的是一个**从来没有判据**的推导。

`data_kind` 的推导原先散在四处（底座 `graph_store.py`、包的 `plugin.py`、
包的 `service.py`、包的页面），四份兜底互不相同，其中一份写成
`data_kind or '现场真值'` —— 没有标注的本体被渲染成**最强的那个结论**。
四处都没有测试，所以这个错在 CHANGELOG 声称「已修」之后继续存在了很久。

本文件钉住两件事：

  1. **闭集** —— 出口只有四个值，消费方不再各自映射；
  2. **缺证据 → 「未标注」，绝不 → 「现场真值」** —— 安全性质，配正对照。

判据写法遵循本仓纪律：**正对照与负断言同时在场**，否则「不含 X」在空产物上
恒真（`基线为空 = 空过`）。
"""
import logging

import pytest

from src.graph_store import (DATA_KIND_FIELD, DATA_KIND_SANITIZED,
                             DATA_KIND_SYNTHETIC, DATA_KIND_UNMARKED,
                             DATA_KINDS, MemoryGraphProvider, derive_data_kind,
                             derive_sanitized)


def _provider(ontology, ns="ns_test"):
    p = MemoryGraphProvider()
    p.load(ns, ontology)
    return p


# ── 闭集 ──

def test_data_kinds_is_a_closed_set():
    """出口只能是这四个 —— 页面**直接渲染**这个值，多一个写法就多一种页面要认的形态"""
    assert set(DATA_KINDS) == {DATA_KIND_FIELD, DATA_KIND_SANITIZED,
                               DATA_KIND_SYNTHETIC, DATA_KIND_UNMARKED}


@pytest.mark.parametrize("ont", [
    {"nodes": [], "edges": []},                                    # 什么都没标
    {"nodes": [], "edges": [], "data_kind": "synthetic-demo"},     # 历史写法
    {"nodes": [], "edges": [], "data_kind": "合成演示本体"},
    {"nodes": [], "edges": [], "data_kind": "现场真值"},
    {"nodes": [], "edges": [], "data_kind": "从没见过的写法"},
    {"nodes": [], "edges": [], "_synthetic": True},
    {"nodes": [], "edges": [], "_sanitized": True},
    {"nodes": [], "edges": [], "_sanitized": {"sanitized": True, "source": "s"}},
])
def test_derive_always_lands_in_the_closed_set(ont):
    assert derive_data_kind(ont) in DATA_KINDS


# ── 核心安全性质（这一组存在的理由）──

@pytest.mark.parametrize("ont", [
    {"nodes": [], "edges": []},                    # 无标记
    {"nodes": [], "edges": [], "data_kind": ""},   # 空串
    {"nodes": [], "edges": [], "data_kind": "   "},
    {"nodes": [], "edges": [], "data_kind": None},
    {"nodes": [], "edges": [], "data_kind": "未识别的值"},
])
def test_missing_evidence_never_yields_field_truth(ont):
    """缺证据**不得**推导出「现场真值」。

    收敛前各包的 service.py 各自兜底成 `data_kind or '现场真值'`，
    于是没有标注的本体在页面上被标成现场真值 —— 合成数据标成现场真值，
    是**对外材料上的失实**，真出过的错。
    """
    got = derive_data_kind(ont)
    assert got != DATA_KIND_FIELD, f"缺证据推出了最强结论: {ont}"
    assert got == DATA_KIND_UNMARKED, f"缺证据应记「未标注」: {ont} → {got}"


def test_explicit_field_truth_does_get_through():
    """**正对照** —— 否则上面那条「永不返回现场真值」会把合法路径一并堵死，
    判据就变成了「这个值永远不出现」，而它本该是「这个值只能由人写出来」。"""
    assert derive_data_kind({"data_kind": "现场真值"}) == DATA_KIND_FIELD


def test_no_alias_points_at_field_truth():
    """别名表里不许有指向「现场真值」的项。

    结构断言 —— 上面那条测的是「这组输入不会推出它」，这条测的是
    「**任何**输入的后门都关着」。少一条，以后往别名表里加一项就绕过去了。
    """
    from src.graph_store import _DATA_KIND_ALIASES
    assert DATA_KIND_FIELD not in _DATA_KIND_ALIASES.values()


# ── 收敛前的三种键都要认得（收敛 ≠ 把老包判成「未标注」）──

@pytest.mark.parametrize("ont,expect", [
    ({"data_kind": "合成演示本体"},            DATA_KIND_SYNTHETIC),
    ({"data_kind": "synthetic-demo"},         DATA_KIND_SYNTHETIC),
    ({"data_kind": "synthetic"},              DATA_KIND_SYNTHETIC),
    ({"_synthetic": True},                    DATA_KIND_SYNTHETIC),
    ({"_sanitized": True},                    DATA_KIND_SANITIZED),
    ({"_sanitized": {"sanitized": True}},     DATA_KIND_SANITIZED),
    ({"data_kind": "现场真值"},                DATA_KIND_FIELD),
    ({},                                      DATA_KIND_UNMARKED),
])
def test_three_key_forms_all_still_derive(ont, expect):
    assert derive_data_kind(ont) == expect


# ── 脱敏事实不再被吞（收敛前它挤在同一条 if/elif 里）──

def test_synthetic_and_sanitized_both_survive():
    """既标合成、又标脱敏的包，**两个事实都要出得来**。

    实测形态：有三个包同时写了
    `data_kind: 'synthetic-demo'` 与 `_sanitized: True`。收敛前字面键优先，
    `_sanitized` 被**静默吞掉** —— 页面上只看得到「合成」，看不到「脱敏副本」。
    """
    ont = {"data_kind": "synthetic-demo", "_sanitized": True}
    assert derive_data_kind(ont) == DATA_KIND_SYNTHETIC     # 正对照：确实认出来了
    assert derive_sanitized(ont) == {"applied": True}       # 且没把另一个事实吃掉


def test_sanitized_one_key_two_shapes():
    """`_sanitized` 一键两型：多数包写 `True`，少数包写带元数据的 dict。
    统一成结构 —— 元数据不再被 `bool()` 丢掉。"""
    assert derive_sanitized({"_sanitized": True}) == {"applied": True}
    assert derive_sanitized({}) == {"applied": False}
    assert derive_sanitized({"_sanitized": False}) == {"applied": False}
    rich = derive_sanitized({"_sanitized": {
        "sanitized": True, "source": "工程本体（研发线）",
        "method": "地址映射至 RFC2544 保留段", "note": "脱敏演示副本"}})
    assert rich["applied"] is True
    assert rich["source"] == "工程本体（研发线）"
    assert rich["method"] == "地址映射至 RFC2544 保留段"
    assert rich["note"] == "脱敏演示副本"


# ── 三个出口都要带（漏一个，消费方就还得自己推导）──

def test_all_three_outputs_carry_both_facts():
    """`namespaces` / `bundle` / `stats` 是本体对外的全部出口。

    只挂一个 = 消费方换条路取数据就又得自己推导一次，
    等于把这个刚刚收掉的「四处各写一遍」再开回来。
    出口集合从**实际方法**上数，不写死清单 —— 清单会单向腐烂。
    """
    p = _provider({"data_kind": "synthetic-demo", "_sanitized": True,
                   "nodes": [{"id": "n1"}], "edges": []})
    for name, out in (("namespaces", p.namespaces()["ns_test"]),
                      ("bundle", p.bundle("ns_test")),
                      ("stats", p.stats("ns_test"))):
        assert out["data_kind"] == DATA_KIND_SYNTHETIC, name
        assert out["sanitized"] == {"applied": True}, name


# ── 非闭集写法不静默 ──

def test_non_closed_value_normalizes_and_warns(caplog):
    """归一化的同时**出声**。

    静默归一等于：下一个人写了自己的写法、跑出来是别的值，而他不知道被换了
    （本仓纪律：判据的跳过必计入 unchecked 并报红，不许静默通过）。
    """
    with caplog.at_level(logging.WARNING, logger="graph.store"):
        got = derive_data_kind({"data_kind": "synthetic-demo"})
    assert got == DATA_KIND_SYNTHETIC
    assert any("不在闭集内" in r.getMessage() for r in caplog.records), \
        "归一化了却没出声"


# ── 真实形态回归：10 个案例包的标记分布 ──

REAL_MARKS = {          # 2026-09-15 对十个案例包实测所得的标记分布
                        # （包名已中性化 —— 它们是仓外独立仓的名字，不进公开仓。
                        #   标记值保持实测原值：这条测的是「标记组合能否落进闭集」，
                        #   与包叫什么无关。）
    "pkg_01": {"data_kind": "合成演示本体"},
    "pkg_02": {"_synthetic": True},
    "pkg_03": {"data_kind": "synthetic-demo", "_sanitized": True},
    "pkg_04": {"data_kind": "synthetic-demo", "_sanitized": True},
    "pkg_05": {"_synthetic": True},
    "pkg_06": {"data_kind": "synthetic"},
    "pkg_07": {"data_kind": "合成演示本体"},
    "pkg_08": {"_sanitized": {"sanitized": True, "source": "工程本体"}},
    "pkg_09": {"_synthetic": True},
    "pkg_10": {"data_kind": "synthetic-demo", "_sanitized": True},
}


def test_real_package_marks_all_land_in_closed_set():
    """把**实测的十包标记**喂进来，逐个断言。

    这条测的不是「函数会不会用」——是「**收敛有没有把信息弄丢**」：
      · 一个都不许变成「未标注」（那说明收敛把认得出来的标成不认识了）；
      · 一个都不许是「现场真值」（十个包都是演示件或脱敏副本，没有现场真值）。

    写死这份标记是**刻意**的：它记录的是仓外十个独立仓的历史形态，
    不是本仓会变的东西；哪天真接现场数据，这条应当改红，由人来改。
    """
    for pkg, marks in REAL_MARKS.items():
        got = derive_data_kind(marks)
        assert got in DATA_KINDS, (pkg, got)
        assert got != DATA_KIND_UNMARKED, \
            f"{pkg} 收敛后成了「未标注」—— 收敛把信息弄丢了"
        assert got != DATA_KIND_FIELD, \
            f"{pkg} 被推导成「现场真值」—— 最强的结论，它不配"
