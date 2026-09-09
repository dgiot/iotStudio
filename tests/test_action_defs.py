# ============================================================
# R2 动作类型化 + Reconciliation 单元测试
# ============================================================
import sqlite3

import pytest

from src.action_defs import (ActionDefinition, check_submit_criteria, get,
                             list_defs, register, role_allowed, seed_builtin,
                             unregister, validate_params)
from src.ontology import build_131_ontology


# ── 类型注册表 ──

def test_builtin_registry_five_defs():
    seed_builtin()
    names = {d["name"] for d in list_defs()}
    assert {"acknowledge_alarm", "command_down", "diagnose",
            "trend_check", "health_check"} <= names
    ack = get("acknowledge_alarm")
    assert ack.external_side_effect is True
    assert ack.builtin is True
    cmd = get("command_down")
    assert "admin" in cmd.allowed_roles


def test_register_name_and_criteria_validation():
    with pytest.raises(ValueError):
        register(ActionDefinition(name="Bad-Name"))
    with pytest.raises(ValueError):
        register(ActionDefinition(name="x"))                    # 太短
    with pytest.raises(ValueError):
        register(ActionDefinition(name="ok_name", submit_criteria=["magic:x"]))
    with pytest.raises(ValueError):
        register(ActionDefinition(name="ok_name", submit_criteria=["enum:p"]))  # 缺选项
    with pytest.raises(ValueError):
        register(ActionDefinition(name="ok_name", submit_criteria=["value_range:p:1"]))  # 缺上限


def test_register_duplicate_and_overwrite():
    d = ActionDefinition(name="dup_test")
    register(d)
    with pytest.raises(ValueError):
        register(ActionDefinition(name="dup_test"))
    register(ActionDefinition(name="dup_test", title="v2"), overwrite=True)
    assert get("dup_test").title == "v2"
    unregister("dup_test")


# ── 参数 schema 校验 ──

def test_validate_params_required_type_strict():
    d = ActionDefinition(name="p1", params_schema={
        "hours": {"type": "float", "required": True}})
    assert validate_params(d, {}) == ["缺少必填参数 'hours'"]
    assert validate_params(d, {"hours": "abc"}) == ["参数 'hours' 应为 float, 实为 str"]
    assert validate_params(d, {"hours": 5}) == []
    assert "未知参数 'extra'" in validate_params(d, {"hours": 5, "extra": 1})[0]


def test_validate_params_non_strict_allows_passthrough():
    d = ActionDefinition(name="p2", strict_params=False,
                         params_schema={"topic": {"type": "str", "required": False}})
    assert validate_params(d, {"topic": None, "anything": {"k": 1}}) == []


# ── 提交规则 (声明式) ──

def test_criteria_target_exists():
    engine = build_131_ontology()
    cmd = get("command_down")
    assert check_submit_criteria(cmd, engine, "dev_well_DEV_A", {}) == []
    assert "target_exists" in check_submit_criteria(cmd, engine, "ghost_entity", {})
    assert "target_exists" in check_submit_criteria(cmd, engine, "", {})   # 空 target


def test_criteria_enum_and_value_range():
    engine = build_131_ontology()
    d = ActionDefinition(name="crit1",
                         submit_criteria=["enum:cmd:stop|start",
                                          "value_range:hours:0.1:168"])
    register(d)
    assert check_submit_criteria(d, engine, None, {"cmd": "start", "hours": 2}) == []
    assert "enum:cmd:stop|start" in check_submit_criteria(d, engine, None, {"cmd": "kick"})
    # 缺参 = 交给执行器默认值, 规则不拦截
    assert check_submit_criteria(d, engine, None, {}) == []
    assert "value_range:hours:0.1:168" in check_submit_criteria(
        d, engine, None, {"hours": 999})
    assert "value_range:hours:0.1:168" in check_submit_criteria(
        d, engine, None, {"hours": "abc"})                  # 非数值
    unregister("crit1")


# ── 角色门 ──

def test_role_allowed_admin_bypass_and_operator():
    ack = get("acknowledge_alarm")           # allowed_roles=[operator]
    assert role_allowed(ack, "admin") is True
    assert role_allowed(ack, "operator") is True
    assert role_allowed(ack, "user") is False
    cmd = get("command_down")                # allowed_roles=[admin]
    assert role_allowed(cmd, "operator") is False
    assert role_allowed(cmd, "admin") is True


def test_unregister_builtin_forbidden():
    assert unregister("acknowledge_alarm") is False      # builtin 不可删
    assert get("acknowledge_alarm") is not None


# ── 审计库: 迁移 + 对账状态机 (隔离 tmp db) ──

@pytest.fixture()
def action_db(tmp_path, monkeypatch):
    from src.web import graphrag_api as gapi
    path = tmp_path / "aip_actions.db"
    monkeypatch.setattr(gapi, "_ACTION_DB_PATH", str(path))
    return gapi


def _old_schema_db(path):
    db = sqlite3.connect(path)
    db.execute("""CREATE TABLE action_log (
        objectId TEXT PRIMARY KEY, action TEXT, target_id TEXT,
        params TEXT, actor TEXT, role TEXT, status TEXT,
        result TEXT, mqtt_topic TEXT, createdAt TEXT)""")
    db.execute("INSERT INTO action_log VALUES ('old1','acknowledge_alarm','t','{}',"
               "'u','operator','executed','{}','topic','2025-01-01')")
    db.commit()
    return db


def test_record_action_new_db_columns(action_db):
    receipt = action_db._record_action("acknowledge_alarm", "dev_a", {"k": 1},
                                       "tester", "admin", "executed",
                                       {"ok": True}, "t/1", def_id="acknowledge_alarm",
                                       reconciliation="succeeded")
    row = action_db._fetch_action(receipt["objectId"])
    assert row["def_id"] == "acknowledge_alarm"
    assert row["reconciliation"] == "succeeded"
    assert row["params"] == {"k": 1}


def test_record_action_positional_signature_compat(action_db):
    # test_graphrag_security 的调用形态: 8 个位置参数必须继续可用
    r = action_db._record_action("acknowledge_alarm", "t", {}, "u", "operator",
                                 "executed", {}, "topic")
    assert r["objectId"]


def test_record_action_migrates_legacy_db(action_db, tmp_path):
    _old_schema_db(action_db._ACTION_DB_PATH).close()
    r = action_db._record_action("command_down", "t", {}, "u", "admin",
                                 "executed", {}, def_id="command_down",
                                 reconciliation="not_run")
    assert r["objectId"]
    old = action_db._fetch_action("old1")
    assert old["action"] == "acknowledge_alarm"
    assert old["reconciliation"] == ""                   # 老行新列默认空
    new = action_db._fetch_action(r["objectId"])
    assert new["reconciliation"] == "not_run"


def test_reconcile_state_machine(action_db):
    r = action_db._record_action("command_down", "t", {}, "u", "admin",
                                 "unknown_outcome", {}, def_id="command_down",
                                 reconciliation="pending")
    oid = r["objectId"]
    res = action_db._set_reconciliation(oid, "succeeded", "admin1", note="现场确认已下发")
    assert res["reconciliation"] == "succeeded" and res["reconciled_by"] == "admin1"
    with pytest.raises(ValueError):                       # 非 pending 不可再对账
        action_db._set_reconciliation(oid, "retry", "admin2")
    with pytest.raises(ValueError):                       # 非法结论
        action_db._set_reconciliation(r["objectId"], "auto_replay", "admin1")
    assert action_db._set_reconciliation("nope", "succeeded", "a") is None


def test_list_actions_filter_by_reconciliation(action_db):
    action_db._record_action("command_down", "t", {}, "u", "admin", "unknown_outcome",
                             {}, def_id="command_down", reconciliation="pending")
    action_db._record_action("diagnose", "t", {}, "u", "operator", "executed",
                             {}, def_id="diagnose", reconciliation="not_run")
    pend = action_db._list_actions(reconciliation="pending")
    assert len(pend) == 1 and pend[0]["action"] == "command_down"
    nr = action_db._list_actions(reconciliation="not_run")
    assert len(nr) == 1 and nr[0]["def_id"] == "diagnose"


# ── 执行器绑定完整性 ──

def test_builtin_defs_all_have_executors():
    from src.web import graphrag_api as gapi
    for d in list_defs():
        if d["builtin"]:
            assert d["name"] in gapi._ACTION_EXECUTORS, f"{d['name']} 缺执行器"
