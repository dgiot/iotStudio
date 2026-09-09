# P1 ActionContract 管线测试 — 三段式: 校验→审批门→执行+对账
import pytest

from src.action_pipeline import ActionPipeline, MemoryAuthorizer
from src.action_defs import ActionDefinition, register


class StubEngine:
    """entity_type 查表桩 — target_exists 规则用"""
    def __init__(self, entities=None):
        self._entities = entities or {}

    def entity_type(self, entity_id):
        return self._entities.get(entity_id)


@pytest.fixture()
def pipe(tmp_path):
    register(ActionDefinition(
        name="pipeline_read", title="只读", params_schema={},
        submit_criteria=["target_exists"], allowed_roles=["operator"],
        target_layer="any", external_side_effect=False, builtin=True),
        overwrite=True)
    register(ActionDefinition(
        name="pipeline_down", title="下行", params_schema={"val": {"type": "int"}},
        submit_criteria=["target_exists"], allowed_roles=["admin"],
        target_layer="any", external_side_effect=True, builtin=True),
        overwrite=True)
    audit = str(tmp_path / "audit.jsonl")
    return ActionPipeline(engine=StubEngine({"pt_1": "point"}),
                          audit_path=audit), audit


def _reader(defn, target_id, params):
    return {"ok": True, "echo": target_id}


# ── Stage 1: 校验拒绝 ──
def test_reject_unknown_action(pipe):
    p, _ = pipe
    r = p.submit("no_such_action", {}, role="admin")
    assert r["state"] == "rejected" and "未注册" in r["errors"][0]


def test_reject_bad_param_type(pipe):
    p, _ = pipe
    r = p.submit("pipeline_down", {"val": "not_int"}, role="admin", target_id="pt_1",
                 auth_id="x")
    assert r["state"] == "rejected" and any("int" in e for e in r["errors"])


def test_reject_criteria_and_role(pipe):
    p, _ = pipe
    r = p.submit("pipeline_read", {}, role="operator", target_id="ghost")
    assert r["state"] == "rejected" and any("target_exists" in e for e in r["errors"])
    r2 = p.submit("pipeline_down", {"val": 1}, role="operator", target_id="pt_1",
                  auth_id="x")
    assert r2["state"] == "rejected" and any("角色" in e for e in r2["errors"])


# ── 只读动作: 无审批门直达 ──
def test_readonly_executes_directly(pipe):
    p, _ = pipe
    p.executor = _reader
    r = p.submit("pipeline_read", {}, role="operator", target_id="pt_1")
    assert r["state"] == "executed" and r["decided_by"] == "auto:readonly"
    assert r["reconciliation"] == ""


# ── Stage 2: R2 铁律 — 外部副作用绝不自动执行 ──
def test_external_never_auto_executes(pipe):
    p, _ = pipe
    p.executor = _reader  # 即使 executor 在场, 无授权也绝不执行
    r = p.submit("pipeline_down", {"val": 1}, role="admin", target_id="pt_1")
    assert r["state"] == "awaiting_approval" and r["auth_id"]


def test_gate_pending_and_mismatch(pipe):
    p, _ = pipe
    from src.action_pipeline import _params_fingerprint
    auth = MemoryAuthorizer()
    p.authorizer = auth
    aid = auth.request("pipeline_down", "wrong_fp", "admin")
    r = p.submit("pipeline_down", {"val": 1}, role="admin", target_id="pt_1",
                 auth_id=aid)
    assert r["state"] == "gate_denied"
    # 正确指纹但 pending → 待审批
    aid2 = auth.request("pipeline_down",
                        _params_fingerprint({"val": 1}), "admin")
    r2 = p.submit("pipeline_down", {"val": 1}, role="admin", target_id="pt_1",
                  auth_id=aid2)
    assert r2["state"] == "gate_denied" and "待审批" in r2["reason"]


def test_approve_then_execute_once(pipe):
    p, _ = pipe
    auth = p.authorizer
    r0 = p.submit("pipeline_down", {"val": 7}, role="admin", target_id="pt_1")
    assert r0["state"] == "awaiting_approval"
    auth.approve(r0["auth_id"], by="human_admin")
    p.executor = _reader
    r1 = p.submit("pipeline_down", {"val": 7}, role="admin", target_id="pt_1",
                  auth_id=r0["auth_id"])
    assert r1["state"] == "executed" and r1["decided_by"] == "human_admin"
    # 一次性授权: 重放被拒
    r2 = p.submit("pipeline_down", {"val": 7}, role="admin", target_id="pt_1",
                  auth_id=r0["auth_id"])
    assert r2["state"] == "gate_denied" and "已使用" in r2["reason"]


def test_rejected_auth_blocks(pipe):
    p, _ = pipe
    r0 = p.submit("pipeline_down", {"val": 9}, role="admin", target_id="pt_1")
    p.authorizer.reject(r0["auth_id"], by="human_admin")
    p.executor = _reader
    r1 = p.submit("pipeline_down", {"val": 9}, role="admin", target_id="pt_1",
                  auth_id=r0["auth_id"])
    assert r1["state"] == "gate_denied" and "拒绝" in r1["reason"]


# ── Stage 3: 对账语义 ──
def test_reconciliation_pending_on_unknown(pipe):
    p, _ = pipe
    r0 = p.submit("pipeline_down", {"val": 3}, role="admin", target_id="pt_1")
    p.authorizer.approve(r0["auth_id"], by="human_admin")
    p.executor = lambda d, t, prm: {"sent": True}  # 无 ok → 结果不明
    r1 = p.submit("pipeline_down", {"val": 3}, role="admin", target_id="pt_1",
                  auth_id=r0["auth_id"])
    assert r1["reconciliation"] == "pending"


def test_reconciliation_succeeded_on_ok(pipe):
    p, _ = pipe
    r0 = p.submit("pipeline_down", {"val": 4}, role="admin", target_id="pt_1")
    p.authorizer.approve(r0["auth_id"], by="human_admin")
    p.executor = lambda d, t, prm: {"ok": True, "ack": "emqx"}
    r1 = p.submit("pipeline_down", {"val": 4}, role="admin", target_id="pt_1",
                  auth_id=r0["auth_id"])
    assert r1["reconciliation"] == "succeeded"


def test_executor_missing_blocks(pipe):
    p, _ = pipe
    r0 = p.submit("pipeline_down", {"val": 5}, role="admin", target_id="pt_1")
    p.authorizer.approve(r0["auth_id"], by="human_admin")
    r1 = p.submit("pipeline_down", {"val": 5}, role="admin", target_id="pt_1",
                  auth_id=r0["auth_id"])
    assert r1["state"] == "blocked"


# ── 审计留痕 ──
def test_audit_journal_written(pipe):
    p, audit = pipe
    p.executor = _reader
    p.submit("pipeline_read", {}, role="operator", target_id="pt_1")
    p.submit("pipeline_down", {"val": 1}, role="admin", target_id="pt_1")
    import json
    events = [json.loads(line) for line in open(audit, encoding="utf-8")]
    kinds = [e["event"] for e in events]
    assert "executed" in kinds and "awaiting_approval" in kinds
    # 原始 params 不落盘 (只有指纹)
    assert all("params" not in e for e in events)
