# ============================================================
# 统一插件运行时 (PR0) 单元测试 — 纯 pytest, 无 TestClient
# ============================================================
import json
import textwrap
from pathlib import Path

import pytest

from src.plugin_runtime import CAPABILITY_TYPES, PluginContext, PluginManager


def _write_plugin(pdir: Path, body: str):
    pdir.mkdir(parents=True, exist_ok=True)
    (pdir / "plugin.py").write_text(textwrap.dedent(body), encoding="utf-8")


def _make_manager(tmp_path: Path) -> PluginManager:
    return PluginManager(plugins_dir=tmp_path / "plugins",
                         state_path=tmp_path / "data" / "plugins_state.json")


GOOD_PLUGIN = """
    PLUGIN_MANIFEST = {"name": "good", "version": "1.0.0",
                       "capabilities": ["action", "tool"],
                       "description": "测试插件"}
    def apply(ctx):
        ctx.register_action("demo_action", params_schema={"x": "int"})
        ctx.register_tool("demo_tool", description="demo")
        return [lambda: None]
"""


def test_capability_types_eight():
    # "一切皆插件" — 动作执行器 (executor) 也是一等 capability
    assert CAPABILITY_TYPES == {"channel", "pusher", "action", "tool",
                                "profile", "hook", "connector", "executor"}


def test_missing_manifest_fails_isolated(tmp_path):
    mgr = _make_manager(tmp_path)
    _write_plugin(mgr.plugins_dir / "broken", "x = 1")  # 无 PLUGIN_MANIFEST
    _write_plugin(mgr.plugins_dir / "good", GOOD_PLUGIN)
    health = mgr.load_all()
    assert health["plugins"] == 2
    assert health["failed"] == 1 and health["loaded"] == 1
    names = {e["name"]: e["status"] for e in mgr.summary()}
    assert names["broken"] == "failed" and names["good"] == "loaded"


def test_unknown_capability_declaration_rejected(tmp_path):
    mgr = _make_manager(tmp_path)
    _write_plugin(mgr.plugins_dir / "bad_decl", """
        PLUGIN_MANIFEST = {"name": "bad_decl", "capabilities": ["marketplace"]}
        def apply(ctx):
            return []
    """)
    mgr.load_all()
    entry = [e for e in mgr.summary() if e["name"] == "bad_decl"][0]
    assert entry["status"] == "failed"
    assert "未知 capability" in (entry["error"] or "")


def test_action_tool_default_admin_role(tmp_path):
    mgr = _make_manager(tmp_path)
    _write_plugin(mgr.plugins_dir / "good", GOOD_PLUGIN)
    mgr.load_all()
    actions = mgr.actions()
    # 未声明 min_role 的 action/tool 默认 admin (能力绑角色规则)
    assert actions["demo_action"]["min_role"] == "admin"
    assert actions["demo_action"]["external_side_effect"] is False
    assert "demo_tool" in mgr.tools()


def test_degraded_when_declaration_mismatch(tmp_path):
    mgr = _make_manager(tmp_path)
    _write_plugin(mgr.plugins_dir / "partial", """
        PLUGIN_MANIFEST = {"name": "partial", "capabilities": ["tool", "profile"]}
        def apply(ctx):
            ctx.register_tool("only_tool")
            return []
    """)
    mgr.load_all()
    entry = [e for e in mgr.summary() if e["name"] == "partial"][0]
    assert entry["status"] == "loaded" and entry["degraded"] is True


def test_disable_enable_persistence_roundtrip(tmp_path):
    mgr = _make_manager(tmp_path)
    marker = tmp_path / "marker.txt"
    _write_plugin(mgr.plugins_dir / "lifecycle", f"""
        from pathlib import Path
        PLUGIN_MANIFEST = {{"name": "lifecycle", "capabilities": ["profile"]}}
        MARKER = Path(r"{marker}")
        def apply(ctx):
            MARKER.write_text("applied", encoding="utf-8")
            def _dispose():
                MARKER.unlink(missing_ok=True)
            return [_dispose]
    """)
    mgr.load_all()
    assert marker.exists()                       # 初次装载已 apply

    assert mgr.disable("lifecycle") is True
    assert not marker.exists()                   # disable 跑 disposers
    assert mgr._state["backend"]["lifecycle"] is False
    assert json.loads(mgr.state_path.read_text(encoding="utf-8")
                      )["backend"]["lifecycle"] is False   # 状态持久化

    mgr2 = _make_manager(tmp_path)               # 新实例模拟重启
    mgr2.load_all()
    entry = [e for e in mgr2.summary() if e["name"] == "lifecycle"][0]
    assert entry["status"] == "disabled" and not marker.exists()

    assert mgr2.enable("lifecycle") is True      # 重新 apply
    assert marker.exists()


def test_frontend_modules_roundtrip(tmp_path):
    mgr = _make_manager(tmp_path)
    assert mgr.frontend_modules() == {}          # 未记录默认启用
    mgr.set_frontend("hmi", False)
    mgr.set_frontend("device", True)
    assert mgr.frontend_modules()["hmi"] is False
    assert json.loads(mgr.state_path.read_text(encoding="utf-8")
                      )["frontend"]["hmi"] is False


def test_context_rejects_unknown_capability():
    class _FakeMgr:
        _loaded = {"p": {"capabilities": {}}}

    ctx = PluginContext("p", _FakeMgr())
    with pytest.raises(ValueError):
        ctx.register_capability("marketplace", "x", {})


# ── 内置四插件 (真实仓库 plugins/ 目录) ──────────────────────────
def test_builtin_plugins_load(tmp_path):
    mgr = PluginManager(state_path=tmp_path / "state.json")   # 默认 plugins 目录
    mgr.load_all()
    summary = {e["name"]: e for e in mgr.summary()}

    for name in ("ontology_demo", "actions_core", "graphrag_tools", "pushers",
                 "actions_pipeline"):
        assert name in summary, f"内置插件缺失: {name}"
        assert summary[name]["status"] == "loaded", f"{name}: {summary[name]}"

    # actions_core: 声明式动作定义 (R2 前置)
    actions = mgr.actions()
    assert actions["command_down"]["min_role"] == "admin"
    assert actions["command_down"]["external_side_effect"] is True
    assert actions["acknowledge_alarm"]["min_role"] == "operator"

    # graphrag_tools: 与 sandbox 预置变量对应; actions_pipeline 另贡献三个工具
    assert {"search", "ask", "ctx", "summary"} <= set(mgr.tools())
    assert {"action_submit", "action_dispatch", "action_authorize"} <= set(mgr.tools())

    # pushers: 四出口工厂 (类名已核实)
    assert set(mgr.pushers()) == {"mqtt", "http", "dgiot", "edge_hub"}

    # ontology_131: profile 构建器可调用 (不实际构建, 只验声明)
    profile = mgr.profiles()["iot-studio-demo-131"]
    assert callable(profile["builder"])


def test_ontology_singleton_cached(tmp_path):
    mgr = PluginManager(state_path=tmp_path / "state.json")
    eng1 = mgr.get_ontology()
    eng2 = mgr.get_ontology()
    assert eng1 is eng2     # 惰性构建 + 缓存单例
