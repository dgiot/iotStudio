# ============================================================
# R4 质量审计 Agent 测试 — 六维检查 / 提案闭环 / LLM 增强层
# ============================================================
import pytest

from src.agent_audit import (AuditAgent, _get_proposal, _list_proposals,
                             _save_proposal)
from src.ontology import Device, Link, build_131_ontology


@pytest.fixture()
def agent_db(tmp_path, monkeypatch):
    import src.agent_audit as aa
    monkeypatch.setattr(aa, "_AGENT_DB_PATH", str(tmp_path / "agent.db"))
    return aa


@pytest.fixture()
def engine():
    return build_131_ontology()


@pytest.fixture()
def agent(engine, agent_db):
    receipts = []
    return AuditAgent(engine, rag=None,
                      receipt_fn=lambda a, t, p, s, r: receipts.append(
                          {"action": a, "target": t, "status": s}) or {"ok": True})


# ── 六维检查 (干净种子) ──

def test_clean_build_scores_high(engine, agent):
    report = agent.run_audit()
    assert report["score"] >= 75            # 种子本体不完美但健康
    assert report["grade"] in ("A", "B")
    assert len(report["trace"]) == 6        # 六步 ReAct trace
    tools = {s["tool"] for s in report["trace"]}
    assert tools == {"integrity_check", "isolation_check", "mapping_check",
                     "constraint_check", "coverage_check", "naming_check"}


def test_report_shape_and_persistence(engine, agent, agent_db):
    report = agent.run_audit()
    assert {"run_id", "score", "grade", "findings", "proposals",
            "summary", "trace"} <= set(report)
    runs = agent_db.list_runs()
    assert len(runs) == 1 and runs[0]["id"] == report["run_id"]


# ── 孤立实体 / 断引用 / 约束接线 ──

def test_isolated_device_detected(engine, agent):
    # 父引用悬空 → 既进 integrity (high) 也进 isolation (medium)
    engine.register(Device(id="dev_floating", channel="ch_ghost",
                           name="悬浮设备"))
    report = agent.run_audit()
    f = [x for x in report["findings"] if x["kind"] == "isolated"
         and x["target"] == "dev_floating"]
    assert f and f[0]["severity"] == "medium"


def test_broken_link_generates_delete_proposal(engine, agent):
    engine.register(Link(id="lnk_broken", source="dev_well_DEV_A",
                         target="ghost_entity", relation="relates_to"))
    report = agent.run_audit()
    kinds = [f["kind"] for f in report["findings"]]
    assert "broken_ref" in kinds
    assert any(p["kind"] == "delete_link" and
               p["payload"]["link_id"] == "lnk_broken" for p in report["proposals"])


def test_self_loop_generates_proposal(engine, agent):
    engine.register(Link(id="lnk_loop", source="dev_well_DEV_A",
                         target="dev_well_DEV_A", relation="relates_to"))
    report = agent.run_audit()
    assert any(p["kind"] == "delete_link" and
               p["payload"]["link_id"] == "lnk_loop" for p in report["proposals"])


def test_unwired_and_dangling_constraint(engine, agent):
    from src.ontology import Constraint
    engine.register(Constraint(id="c_dangling", name="悬空约束",
                               rule="x > 1", entity="ghost_entity"))
    engine.register(Constraint(id="c_unwired", name="未接线约束",
                               rule="y > 2", entity=""))          # 种子全接线, 自造空接线样例
    report = agent.run_audit()
    kinds = {f["kind"] for f in report["findings"]}
    assert "broken_constraint_ref" in kinds            # 悬空 → high
    assert "unwired_constraint" in kinds               # 空接线 → low


# ── 提案闭环: 保存 → 审批执行 / 驳回 ──

def test_proposal_approve_executes_delete(engine, agent, agent_db):
    engine.register(Link(id="lnk_bad", source="dev_well_DEV_A",
                         target="ghost", relation="relates_to"))
    report = agent.run_audit()
    prp = next(p for p in report["proposals"] if p["payload"].get("link_id") == "lnk_bad")
    assert prp["status"] == "pending"
    result = agent.execute_proposal(prp["id"], by="admin1")
    assert result["status"] == "approved"
    assert "lnk_bad" not in engine.links               # 引用被真实清除
    row = _get_proposal(prp["id"])
    assert row["status"] == "approved" and row["decided_by"] == "admin1"
    assert row["receipt"] is not None                  # 执行回执已落


def test_proposal_dismiss_then_approve_rejected(engine, agent):
    engine.register(Link(id="lnk_bad2", source="dev_well_DEV_A",
                         target="ghost", relation="relates_to"))
    report = agent.run_audit()
    prp = report["proposals"][0]
    from src.agent_audit import _decide_proposal
    _decide_proposal(prp["id"], "dismissed", "admin2", {"note": "误报"})
    with pytest.raises(ValueError):
        agent.execute_proposal(prp["id"], by="admin1")   # 已驳回不可执行
    with pytest.raises(ValueError):
        _decide_proposal(prp["id"], "approved", "admin3")  # 不可改判


def test_proposal_status_filter(engine, agent):
    _save_proposal("delete_link", {"link_id": "x"}, "测试")
    _save_proposal("add_link", {"source": "a", "target": "b"}, "测试")
    pend = _list_proposals("pending")
    assert len(pend) == 2 and all(p["status"] == "pending" for p in pend)


def test_execute_unknown_or_nonpending(engine, agent):
    with pytest.raises(LookupError):
        agent.execute_proposal("prp_nope", by="admin")


# ── LLM 增强层 (可插拔, 垃圾输出安全丢弃) ──

class _FakeRag:
    def __init__(self, reply):
        self._llm = lambda system, user: reply


def test_llm_valid_add_link_proposal_adopted(engine, agent_db):
    engine.register(Device(id="dev_new", channel="ch_modbus_tcp", name="新井"))
    # dev_new 无关系边 → 孤立/覆盖缺口; LLM 提案把它供电链挂上
    reply = ('{"analysis":"新设备缺供电关系", "proposals":[{"kind":"add_link",'
             '"payload":{"source":"dev_relay_00","target":"dev_new",'
             '"relation":"powered_by"},"rationale":"接入断电链"}]}')
    ag = AuditAgent(engine, rag=_FakeRag(reply))
    report = ag.run_audit(with_llm=True)
    add = [p for p in report["proposals"] if p["kind"] == "add_link"]
    assert len(add) == 1 and add[0]["payload"]["target"] == "dev_new"
    assert report["with_llm"] is True


def test_llm_garbage_safely_dropped(engine, agent_db):
    ag = AuditAgent(engine, rag=_FakeRag("这不是 JSON{{{"))
    report = ag.run_audit(with_llm=True)
    assert all(p["kind"] != "add_link" for p in report["proposals"])
    assert report["with_llm"] is False                  # 降级标记
    assert "unavailable" in report["llm_note"]


def test_llm_invalid_endpoints_rejected(engine, agent_db):
    reply = ('{"proposals":[{"kind":"add_link","payload":'
             '{"source":"ghost_a","target":"ghost_b","relation":"maps_to"}}]}')
    ag = AuditAgent(engine, rag=_FakeRag(reply))
    report = ag.run_audit(with_llm=True)
    assert all(p["kind"] != "add_link" for p in report["proposals"])


def test_no_llm_mode_add_link_absent(engine, agent):
    report = agent.run_audit(with_llm=False)
    assert all(p["kind"] == "delete_link" for p in report["proposals"])


# ── 评分单调性 ──

def test_score_drops_with_more_findings(engine, agent_db):
    clean = AuditAgent(engine, rag=None).run_audit()
    engine.register(Link(id="lnk_b1", source="dev_well_DEV_A", target="g1",
                         relation="relates_to"))
    engine.register(Link(id="lnk_b2", source="dev_well_DEV_A", target="g2",
                         relation="relates_to"))
    dirty = AuditAgent(engine, rag=None).run_audit()
    assert dirty["score"] < clean["score"]
