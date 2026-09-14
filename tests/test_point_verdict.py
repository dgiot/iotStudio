# -*- coding: utf-8 -*-
"""测点阈值判定 — 「XX 安全吗」的可复现答案

背景：用户问「DEV_A 井的套压安全吗？」，改动前返回的是
「📍 POINT: 套压 TGP / 同级节点: 3个」—— 把能查到的都列了一遍，唯独没回答
问题。判据（pt_tgp.alarm={"high":25.0}）和当前值（TDengine 里有）其实都在，
只是从没被拿来判过。

所以这里的测试重点不是"算得对"，是**判据只有一处**：judge_point 一个出口，
`/ask`、`/live`、SSE 三条路径都走它。两处判据各自演化，是这类功能最常见的
烂法 —— 改了一头，同一个值在两个页面给出不同结论。
"""
import pathlib
import re

import pytest

from src.ontology import Channel, Device, Gateway, OntologyEngine, Point, Site


def _engine(points):
    e = OntologyEngine()
    e.register(Site(id="s1", name="站"))
    e.register(Gateway(id="g1", ip="198.51.100.1", site="s1"))
    e.register(Channel(id="c1", gateway="g1", name="通道", protocol="modbus_tcp"))
    e.register(Device(id="d1", channel="c1", name="设备"))
    for p in points:
        e.register(p)
    return e


def _pt(pid, **kw):
    return Point(id=pid, device="d1", name=kw.pop("name", pid), **kw)


# ── 判定语义 ──

def test_within_limits_is_safe_with_margin():
    e = _engine([_pt("p1", name="套压", unit="MPa", alarm={"high": 25.0})])
    v = e.judge_point("p1", 21.19)
    assert v["status"] == "ok" and v["safe"] is True
    assert v["margin"] == 3.81
    assert v["unit"] == "MPa" and v["value"] == 21.19


def test_over_high_is_unsafe():
    e = _engine([_pt("p1", name="套压", unit="MPa", alarm={"high": 25.0})])
    v = e.judge_point("p1", 27.1)
    assert v["status"] == "high" and v["safe"] is False
    assert v["limit"] == 25.0 and v["margin"] == 2.1


def test_boundary_value_is_safe():
    """等于限值算安全（判据是 ≤ 上限，不是 <）—— 边界语义要钉死，
    否则"正好 25.0"这种值在不同实现里会两头跑。"""
    e = _engine([_pt("p1", name="套压", unit="MPa", alarm={"high": 25.0})])
    v = e.judge_point("p1", 25.0)
    assert v["safe"] is True and v["margin"] == 0.0


def test_hh_takes_precedence_over_high():
    """越限取**最严**的一档：27 同时越 high=25 和 hh=26，应报 hh"""
    e = _engine([_pt("p1", name="温度", unit="℃", alarm={"high": 25.0, "hh": 26.0})])
    assert e.judge_point("p1", 24.0)["status"] == "ok"
    assert e.judge_point("p1", 25.5)["status"] == "high"
    assert e.judge_point("p1", 26.5)["status"] == "hh"


def test_low_side_takes_strictest():
    e = _engine([_pt("p1", name="频率", unit="Hz",
                     alarm={"low": 49.5, "ll": 49.0})])
    assert e.judge_point("p1", 49.8)["status"] == "ok"
    assert e.judge_point("p1", 49.2)["status"] == "low"
    assert e.judge_point("p1", 48.5)["status"] == "ll"


def test_range_fallback_when_no_alarm():
    """没报警阈值就用 range 兜底 —— 但 status 要区分得出来"""
    e = _engine([_pt("p1", name="量程点", unit="A", range=[0.0, 10.0])])
    assert e.judge_point("p1", 5.0)["safe"] is True
    oob = e.judge_point("p1", 12.0)
    assert oob["safe"] is False and oob["status"] == "out_of_range"


def test_no_criterion_is_unknown_never_safe():
    """⚠️ 没有判据时**不许说安全**

    这是最容易写错的一条：`alarm` 为空、`range` 也为空时，返回 safe=True
    会让"未定义阈值"伪装成"通过检查"。宁可答"无判据可依"。
    """
    e = _engine([_pt("p1", name="有功功率", unit="W")])
    v = e.judge_point("p1", 1234.0)
    assert v["safe"] is None and v["status"] == "unknown"
    assert "无判据" in v["reason"]


def test_missing_point_and_none_value_are_unknown():
    e = _engine([_pt("p1", alarm={"high": 1.0})])
    assert e.judge_point("nope", 1.0)["safe"] is None
    assert e.judge_point("p1", None)["safe"] is None


def test_has_no_criterion_gate_on_alarm_truthiness():
    """alarm={} 与 alarm 缺失等价 —— 别让空 dict 被当成"有判据且全部通过\""""
    for kw in ({}, {"alarm": {}}):
        e = _engine([_pt("p1", **kw)])
        assert e.judge_point("p1", 999.0)["status"] == "unknown"


# ── 结构锁：判据只能有一处 ──

def test_verdict_status_map_covers_every_status_judge_point_returns():
    """judge_point 新增一个 status 而映射表没跟上 → 静默降级成 unknown

    这条不去枚举"应该有哪几个"（那样加了新状态还得同步改测试，改成走过场），
    而是**从源码里把 status 的实际取值扫出来**，和映射表对。谁加了新状态
    谁就得决定它映射成什么 —— 不允许悄悄落进 default。
    """
    from src.graphrag import _VERDICT_TO_STATUS
    src = pathlib.Path(__file__).resolve().parents[1] / "src" / "ontology.py"
    text = src.read_text(encoding="utf-8")
    body = text.split("def judge_point", 1)[1].split("\n    def ", 1)[0]
    produced = set(re.findall(r'"status":\s*"([a-z_]+)"', body))
    assert produced, "没扫到任何 status —— judge_point 的写法变了？"
    assert produced <= set(_VERDICT_TO_STATUS), (
        f"judge_point 产出了映射表里没有的 status: {produced - set(_VERDICT_TO_STATUS)}")


def test_enhance_context_delegates_to_judge_point():
    """enhance_context 里的阈值判定必须是转调，不能是第二套实现

    早先那里是独立的 if/elif 链（hh>high>ll>low 各判一次）。两套并存的
    典型症状：/ask 说"安全"、/live 说"high"，同一个值。
    """
    src = pathlib.Path(__file__).resolve().parents[1] / "src" / "graphrag.py"
    text = src.read_text(encoding="utf-8")
    body = text.split("def enhance_context", 1)[1].split("\n    def ", 1)[0]
    assert "judge_point(" in body, "enhance_context 不再转调 judge_point"
    assert 'v > alarm["hh"]' not in body, "enhance_context 里又长出了第二套比较链"


def test_live_path_agrees_with_judge_point():
    """同一条链上：judge_point 的结论 == enhance_context 报出的状态"""
    from src.graphrag import _VERDICT_TO_STATUS
    e = _engine([_pt("p1", name="套压", unit="MPa", alarm={"high": 25.0})])
    for val in (21.19, 27.1):
        direct = e.judge_point("p1", val)
        assert _VERDICT_TO_STATUS[direct["status"]] == (
            "normal" if direct["safe"] else "high")


# ── 答案渲染 ──

def test_local_answer_renders_criterion_and_verdict():
    """模板化回答必须把判据和结论放前面 —— 不能只堆"同级节点 N 个\""""
    from src.graphrag import GraphRAG
    # 同设备再挂一个测点，这样才有"同级节点"这行可比排序
    e = _engine([_pt("p1", name="套压 TGP", unit="MPa", alarm={"high": 25.0}),
                 _pt("p2", name="回压")])
    ctx = e.local_context("p1")
    verdict = e.judge_point("p1", 21.19)
    text = GraphRAG._format_local_answer(ctx, "套压安全吗", verdict)
    assert "安全判据" in text and "上限 25.0MPa" in text
    assert "✅ 安全" in text
    # 结论要排在兄弟节点这类装饰性信息之前
    assert text.index("判定:") < text.index("同级")


def test_local_answer_without_verdict_still_renders_criterion():
    """取不到实时值时给判据不给结论 —— 让人知道判据是什么"""
    from src.graphrag import GraphRAG
    e = _engine([_pt("p1", name="套压", unit="MPa", alarm={"high": 25.0})])
    text = GraphRAG._format_local_answer(e.local_context("p1"), "套压安全吗")
    assert "上限 25.0MPa" in text
    assert "判定:" not in text          # 结尾标记里有"判定"二字，按行首比


def test_local_answer_unknown_verdict_says_so():
    from src.graphrag import GraphRAG
    e = _engine([_pt("p1", name="有功功率", unit="W")])
    v = e.judge_point("p1", 10.0)
    text = GraphRAG._format_local_answer(e.local_context("p1"), "安全吗", v)
    assert "无法判定" in text and "无判据" in text
