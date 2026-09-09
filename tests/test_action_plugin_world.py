# 一切皆插件 + 平行世界 — actions_pipeline 插件契约 / 并行派发隔离 测试
import importlib.util
import json
import os
from pathlib import Path

import pytest

from src.action_defs import ActionDefinition, register
from src.action_pipeline import ActionPipeline

_PLUGIN_PATH = Path(__file__).resolve().parent.parent / "plugins" / "actions_pipeline" / "plugin.py"


class StubEngine:
    def __init__(self, entities=None):
        self._e = entities or {}

    def entity_type(self, entity_id):
        return self._e.get(entity_id)


class FakeCtx:
    """plugin_runtime.PluginContext 最小面 — 只记录注册调用"""
    def __init__(self):
        self.executors, self.tools, self.caps = {}, {}, []
        self.published = []

    def register_executor(self, name, fn, *, description="", external_side_effect=True):
        self.executors[name] = {"fn": fn, "description": description}
        self.caps.append(("executor", name))

    def register_tool(self, name, fn, *, description=""):
        self.tools[name] = {"fn": fn, "description": description}
        self.caps.append(("tool", name))

    def register_capability(self, cap, name, payload):
        self.caps.append((cap, name))

    def register_action(self, *a, **k):
        self.caps.append(("action", a[0] if a else None))

    def logger(self, name=""):
        import logging
        return logging.getLogger("test.actions_pipeline")

    def mqtt_publish(self, topic, payload):
        self.published.append((topic, payload))
        return "ok(qos1)"


@pytest.fixture()
def world(tmp_path, monkeypatch):
    monkeypatch.setenv("ACTION_AUDIT_PATH", str(tmp_path / "audit.jsonl"))
    register(ActionDefinition(
        name="pipeline_read", title="只读", params_schema={},
        submit_criteria=["target_exists"], allowed_roles=["operator"],
        target_layer="any", external_side_effect=False, builtin=True), overwrite=True)
    register(ActionDefinition(
        name="pipeline_down", title="下行", params_schema={"val": {"type": "int"}},
        submit_criteria=["target_exists"], allowed_roles=["admin"],
        target_layer="any", external_side_effect=True, builtin=True), overwrite=True)
    spec = importlib.util.spec_from_file_location("plugin_actions_pipeline", _PLUGIN_PATH)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod._PIPELINE = None  # 每测试全新管线
    mod.set_engine(StubEngine({"pt_1": "point", "dev_9": "device"}))
    ctx = FakeCtx()
    mod.apply(ctx)
    return mod, ctx, str(tmp_path / "audit.jsonl")


def _audit_events(path):
    return [json.loads(l) for l in open(path, encoding="utf-8")]


# ── 插件契约: 执行器与工具就位 ──
def test_plugin_registers_world(world):
    mod, ctx, _ = world
    assert {"log", "mqtt"} <= set(ctx.executors)
    assert {"action_submit", "action_dispatch", "action_authorize"} <= set(ctx.tools)
    assert ("executor", "mqtt") in ctx.caps


def test_binding_mqtt_executor_publishes(world):
    mod, ctx, _ = world
    mod._BINDINGS["pipeline_down"] = "mqtt"  # 绑定即配置: 动作→执行器可换
    p = mod._get_pipeline()
    r0 = p.submit("pipeline_down", {"val": 1}, role="admin", target_id="dev_9")
    assert r0["state"] == "awaiting_approval"
    mod._get_pipeline().authorizer.approve(r0["auth_id"], by="human")
    r1 = mod._get_pipeline().submit("pipeline_down", {"val": 1}, role="admin",
                                    target_id="dev_9", auth_id=r0["auth_id"])
    assert r1["state"] == "executed" and r1["result"]["executor"] == "mqtt"
    assert ctx.published and ctx.published[0][0] == "dgiot/cmd/dev_9"


def test_log_executor_default_binding(world):
    mod, ctx, _ = world
    r = ctx.tools["action_submit"]["fn"]("pipeline_read", {}, role="operator",
                                         target_id="pt_1")
    assert r["state"] == "executed" and r["result"]["executor"] == "log"


# ── 平行世界: submit_many 项间隔离 ──
def test_dispatch_mixed_batch_states(world):
    mod, ctx, _ = world
    dispatch = ctx.tools["action_dispatch"]["fn"]
    batch = [
        {"action": "pipeline_read", "params": {}, "role": "operator", "target_id": "pt_1"},
        {"action": "pipeline_down", "params": {"val": 2}, "role": "admin", "target_id": "dev_9"},  # awaiting
        {"action": "no_such", "params": {}, "role": "admin"},                                       # rejected
    ]
    results = dispatch(batch, max_workers=3)
    assert [r["state"] for r in results] == ["executed", "awaiting_approval", "rejected"]


def test_dispatch_isolates_exploding_executor(world):
    mod, ctx, _ = world
    mod._EXECUTORS["log"] = lambda d, t, p: (_ for _ in ()).throw(RuntimeError("boom"))
    p = mod._get_pipeline()
    batch = [
        {"action": "pipeline_read", "params": {}, "role": "operator", "target_id": "pt_1"},
        {"action": "pipeline_read", "params": {}, "role": "operator", "target_id": "pt_1"},
    ]
    results = p.submit_many(batch, max_workers=2)
    assert results[0]["state"] == "error" and "boom" in results[0]["error"]
    assert results[1]["state"] == "error"  # 两项都炸, 但互不越权
    ev = [e["event"] for e in _audit_events(world[2])]
    assert ev.count("error") == 2


def test_dispatch_preserves_order_under_parallelism(world):
    mod, ctx, _ = world
    mod.set_engine(StubEngine({f"pt_{i}": "point" for i in range(8)}))
    batch = [{"action": "pipeline_read", "params": {}, "role": "operator",
              "target_id": f"pt_{i}"} for i in range(8)]
    results = ctx.tools["action_dispatch"]["fn"](batch, max_workers=8)
    assert len(results) == 8 and all(r["state"] == "executed" for r in results)


def test_authorize_gate_via_tool(world):
    mod, ctx, _ = world
    submit, authorize = ctx.tools["action_submit"]["fn"], ctx.tools["action_authorize"]["fn"]
    r0 = submit("pipeline_down", {"val": 5}, role="admin", target_id="dev_9")
    assert r0["state"] == "awaiting_approval"
    rec = authorize(r0["auth_id"], "approve", by="human_admin")
    assert rec["status"] == "approved" and rec["decided_by"] == "human_admin"
    r1 = submit("pipeline_down", {"val": 5}, role="admin", target_id="dev_9",
                auth_id=r0["auth_id"])
    assert r1["state"] == "executed"
