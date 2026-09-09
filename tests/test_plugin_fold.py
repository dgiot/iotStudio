# ============================================================
# P1 插件化折叠测试 — pushers 运行时托管 + parse_hooks 定义收编
# 纯 pytest, 无 TestClient, 零真实网络 (stub pusher / HOOKS 内存注册表)
# ============================================================
import textwrap
from pathlib import Path
from types import SimpleNamespace

import pytest

from src.plugin_runtime import PluginManager
from src.services.push_engine import PushEngine


def _make_manager(tmp_path: Path) -> PluginManager:
    return PluginManager(plugins_dir=tmp_path / "plugins",
                         state_path=tmp_path / "data" / "plugins_state.json")


# ── parse_hooks 折叠: 钩子定义归插件, 引擎真源在核心 ──

def _load_real_parse_hooks_plugin(tmp_path: Path) -> PluginManager:
    src = Path(__file__).resolve().parent.parent / "plugins" / "parse_hooks" / "plugin.py"
    mgr = _make_manager(tmp_path)
    pdir = mgr.plugins_dir / "parse_hooks"
    pdir.mkdir(parents=True, exist_ok=True)
    (pdir / "plugin.py").write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
    return mgr


@pytest.fixture()
def hooks_loaded(tmp_path, monkeypatch):
    from src.web import parse_hooks
    parse_hooks.HOOKS.clear()          # 隔离其他测试污染
    mgr = _load_real_parse_hooks_plugin(tmp_path)
    health = mgr.load_all()
    yield parse_hooks, mgr
    parse_hooks.HOOKS.clear()


def test_parse_hooks_plugin_loads_and_populates_engine(hooks_loaded):
    parse_hooks, mgr = hooks_loaded
    assert health_ok(mgr)
    assert set(parse_hooks.HOOKS) == {"Device", "Alarm", "Channel"}
    assert "beforeSave" in parse_hooks.HOOKS["Device"]
    assert "afterSave" in parse_hooks.HOOKS["Alarm"]
    # 能力面可见
    caps = [e for e in mgr.summary() if e["name"] == "parse_hooks"][0]
    assert "hook" in caps["capabilities"]
    assert len(caps["capabilities"]["hook"]) == 5


def test_device_before_save_validates_and_fills(hooks_loaded):
    parse_hooks, _ = hooks_loaded
    import asyncio
    with pytest.raises(parse_hooks.HookError):
        asyncio.run(parse_hooks.run_hooks("Device", "beforeSave", {}))
    obj = asyncio.run(parse_hooks.run_hooks(
        "Device", "beforeSave", {"device_id": "D1", "name": "n"}))
    assert obj["devaddr"] == "D1" and obj["status"] == "offline" and obj["isEnable"] is True


def test_channel_before_save_rejects_unknown_protocol(hooks_loaded):
    parse_hooks, _ = hooks_loaded
    import asyncio
    with pytest.raises(parse_hooks.HookError):
        asyncio.run(parse_hooks.run_hooks(
            "Channel", "beforeSave", {"protocol": "can_bus"}))


def test_core_module_no_longer_ships_builtin_definitions(hooks_loaded):
    """折叠铁证: 引擎文件源码不再包含钩子定义"""
    from src.web import parse_hooks
    assert not hasattr(parse_hooks, "device_before_save")
    assert not hasattr(parse_hooks, "alarm_after_save")


def health_ok(mgr) -> bool:
    h = mgr.health()
    return h["loaded"] == 1 and h["failed"] == 0


# ── pushers 运行时托管: PushEngine 经注册表解析推送器 ──

STUB_PUSHER_PLUGIN = """
    PLUGIN_MANIFEST = {"name": "stub_pushers", "version": "1.0.0",
                       "capabilities": ["pusher"], "description": "stub"}
    class StubPusher:
        def __init__(self, config):
            self.config = config
            self.messages = []
        async def push(self, message):
            self.messages.append(message)
            return True
    _INSTANCE = None
    def apply(ctx):
        def factory(config):
            global _INSTANCE
            if _INSTANCE is None:
                _INSTANCE = StubPusher(config)
            return _INSTANCE
        ctx.register_pusher("http", factory, description="stub http")
        ctx.register_pusher("broken", lambda cfg: object(), description="无 push 协议")
        return []
"""


class FakePg:
    def __init__(self, targets):
        self._targets = targets

    async def list_push_targets(self):
        return self._targets


@pytest.fixture()
def stub_manager(tmp_path):
    mgr = _make_manager(tmp_path)
    pdir = mgr.plugins_dir / "stub_pushers"
    pdir.mkdir(parents=True, exist_ok=True)
    (pdir / "plugin.py").write_text(textwrap.dedent(STUB_PUSHER_PLUGIN), encoding="utf-8")
    mgr.load_all()
    return mgr


def _target(tid, ttype, config=None):
    return SimpleNamespace(target_id=tid, target_type=ttype, config=config or {})


def test_push_engine_resolves_via_plugin_registry(stub_manager):
    import asyncio
    eng = PushEngine(FakePg([_target("t1", "http", {"url": "x"})]),
                     registry=stub_manager)
    asyncio.run(eng.start())
    assert "t1" in eng._pushers
    stub = eng._pushers["t1"]
    # 通过 PushEngine.push 走全链
    pv = SimpleNamespace(point_id="p1", point_name="P1", value=1.0,
                         unit="", quality="good",
                         timestamp=__import__("datetime").datetime.now())
    asyncio.run(eng.push("dev1", [pv]))
    assert stub.messages and stub.messages[0]["device_id"] == "dev1"


def test_push_engine_skips_incompatible_and_unknown(stub_manager):
    import asyncio
    eng = PushEngine(FakePg([_target("b1", "broken"),      # 无 push 协议
                             _target("u1", "can_bus")]),   # 未知类型
                     registry=stub_manager)
    asyncio.run(eng.start())
    assert eng._pushers == {}
    assert eng._initialized


def test_push_engine_falls_back_to_hardcoded_when_registry_empty(tmp_path):
    """插件未装载 → 回落硬编码路径 (mqtt 推送器 init 惰性, 不连网)"""
    import asyncio
    eng = PushEngine(FakePg([_target("m1", "mqtt", {}),
                             _target("u1", "edge_hub", {})]),
                     registry=_make_manager(tmp_path))
    asyncio.run(eng.start())
    from src.push.mqtt_pusher import MQTTPusher
    assert isinstance(eng._pushers["m1"], MQTTPusher)
    assert "u1" not in eng._pushers  # stub 注册表无 edge_hub, legacy 回落表亦无 (插件路径已收编)
