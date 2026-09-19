# P1 第三刀: 管线接入 audit 提案流 + graphrag_api 管线端点 — 隔离单测
import pytest

from src.action_defs import ActionDefinition, register
from src.action_pipeline import ActionPipeline, SqliteProposalAuthorizer


class StubEngine:
    def __init__(self, entities=None):
        self._e = entities or {}

    def entity_type(self, entity_id):
        return self._e.get(entity_id)


@pytest.fixture()
def world(tmp_path, monkeypatch):
    from src.web import graphrag_api as gapi
    monkeypatch.setenv("ACTION_AUDIT_PATH", str(tmp_path / "audit.jsonl"))
    monkeypatch.setattr("src.agent_audit._AGENT_DB_PATH", str(tmp_path / "agent.db"))
    register(ActionDefinition(
        name="pipeline_read", title="只读", params_schema={},
        submit_criteria=["target_exists"], allowed_roles=["operator"],
        target_layer="any", external_side_effect=False, builtin=True), overwrite=True)
    register(ActionDefinition(
        name="pipeline_down", title="下行", params_schema={"val": {"type": "int"}},
        submit_criteria=["target_exists"], allowed_roles=["admin"],
        target_layer="any", external_side_effect=True, builtin=True), overwrite=True)

    calls = []

    def exec_fn(defn, target_id, params):
        calls.append((defn.name, target_id, params))
        if target_id == "boom_pt":
            raise RuntimeError("executor exploded")
        return {"ok": True, "ack": "exec", "reconciliation": "succeeded"}

    gapi._PIPELINE = ActionPipeline(
        engine=StubEngine({"pt_1": "point", "dev_9": "device", "boom_pt": "point"}),
        executor=exec_fn, authorizer=SqliteProposalAuthorizer())
    yield gapi, calls
    gapi._PIPELINE = None  # 还原惰性构建


# ── 单发: 状态机 + 审批门 ──
async def test_submit_readonly_direct(world):
    gapi, calls = world
    r = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_read", target_id="pt_1"),
        user={"sub": "tester", "role": "operator"})
    assert r["state"] == "executed" and r["decided_by"] == "auto:readonly"


async def test_submit_external_requires_approval_token(world):
    gapi, calls = world
    r = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 1},
                                   target_id="dev_9"),
        user={"sub": "tester", "role": "admin"})
    assert r["state"] == "awaiting_approval" and r["auth_id"].startswith("prp_")
    assert calls == []  # 未授权绝不触碰执行器


async def test_authorize_approve_then_execute_once(world):
    gapi, calls = world
    r0 = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 1},
                                   target_id="dev_9"),
        user={"sub": "tester", "role": "admin"})
    rec = await gapi.aip_pipeline_authorize(
        gapi.PipelineAuthorizeRequest(auth_id=r0["auth_id"], decision="approve"),
        user={"sub": "chief", "role": "admin"})
    assert rec["status"] == "approved" and rec["decided_by"] == "chief"
    r1 = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 1},
                                   target_id="dev_9", auth_id=r0["auth_id"]),
        user={"sub": "tester", "role": "admin"})
    assert r1["state"] == "executed"
    r2 = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 1},
                                   target_id="dev_9", auth_id=r0["auth_id"]),
        user={"sub": "tester", "role": "admin"})
    assert r2["state"] == "gate_denied" and "已使用" in r2["reason"]


async def test_authorize_reject_blocks(world):
    gapi, calls = world
    r0 = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 2},
                                   target_id="dev_9"),
        user={"sub": "tester", "role": "admin"})
    await gapi.aip_pipeline_authorize(
        gapi.PipelineAuthorizeRequest(auth_id=r0["auth_id"], decision="reject"),
        user={"sub": "chief", "role": "admin"})
    r1 = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 2},
                                   target_id="dev_9", auth_id=r0["auth_id"]),
        user={"sub": "tester", "role": "admin"})
    assert r1["state"] == "gate_denied" and "拒绝" in r1["reason"]
    assert calls == []


async def test_auths_list_shows_action_auth(world):
    gapi, _ = world
    await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 3},
                                   target_id="dev_9"),
        user={"sub": "tester", "role": "admin"})
    out = await gapi.aip_pipeline_auths(user={"sub": "chief", "role": "admin"})
    assert len(out["auths"]) == 1
    assert out["auths"][0]["payload"]["action"] == "pipeline_down"


# ── 批发: 并行 + 项间隔离 ──
async def test_dispatch_mixed_batch(world):
    gapi, calls = world
    out = await gapi.aip_pipeline_dispatch(
        gapi.PipelineDispatchRequest(submissions=[
            {"action": "pipeline_read", "target_id": "pt_1", "role": "operator"},
            {"action": "pipeline_down", "params": {"val": 1}, "target_id": "dev_9"},
            {"action": "no_such"},
        ], max_workers=3),
        user={"sub": "tester", "role": "admin"})
    rs = out["results"]
    assert [r["state"] for r in rs] == ["executed", "awaiting_approval", "rejected"]


async def test_dispatch_isolates_exploding_executor(world):
    gapi, calls = world
    out = await gapi.aip_pipeline_dispatch(
        gapi.PipelineDispatchRequest(submissions=[
            {"action": "pipeline_read", "target_id": "boom_pt", "role": "operator"},
            {"action": "pipeline_read", "target_id": "pt_1", "role": "operator"},
        ], max_workers=2),
        user={"sub": "tester", "role": "admin"})
    rs = out["results"]
    assert rs[0]["state"] == "error" and "exploded" in rs[0]["error"]
    assert rs[1]["state"] == "executed"  # 邻项不受牵连


async def test_dispatch_wrong_fingerprint_gated(world):
    gapi, _ = world
    r0 = await gapi.aip_pipeline_submit(
        gapi.PipelineSubmitRequest(action="pipeline_down", params={"val": 1},
                                   target_id="dev_9"),
        user={"sub": "tester", "role": "admin"})
    await gapi.aip_pipeline_authorize(
        gapi.PipelineAuthorizeRequest(auth_id=r0["auth_id"], decision="approve"),
        user={"sub": "chief", "role": "admin"})
    out = await gapi.aip_pipeline_dispatch(
        gapi.PipelineDispatchRequest(submissions=[
            {"action": "pipeline_down", "params": {"val": 999},  # 参数漂移
             "target_id": "dev_9", "auth_id": r0["auth_id"]},
        ]),
        user={"sub": "tester", "role": "admin"})
    assert out["results"][0]["state"] == "gate_denied" and "不匹配" in out["results"][0]["reason"]
