"""Driver pluginization tests: contract validation, loud discovery,
entry-point registration (mocked), demo driver conformance."""
import asyncio
import importlib
import sys
import textwrap
from pathlib import Path

import pytest

from src import plugin_registry as pr


@pytest.fixture(autouse=True)
def clean_registry():
    pr.clear_for_tests()
    yield
    pr.clear_for_tests()


class GoodAdapter:
    """Minimal stand-in subclassing the real contract."""

    def __init__(self, config):
        self.config = config


# make it a real BaseProtocolAdapter subclass for validation tests
from src.protocols.base import BaseProtocolAdapter  # noqa: E402


class GoodAdapter(BaseProtocolAdapter):
    pass


def test_register_rejects_non_adapter_class():
    with pytest.raises(TypeError, match="BaseProtocolAdapter"):
        pr.register("bad", category="protocol", adapter=dict)


def test_register_conflicting_reassignment_raises():
    class OtherAdapter(BaseProtocolAdapter):
        pass
    pr.register("dup", category="protocol", adapter=GoodAdapter)
    with pytest.raises(ValueError, match="conflicting"):
        pr.register("dup", category="protocol", adapter=OtherAdapter)


def test_register_identical_reregistration_is_idempotent():
    # 双导入现实: flat 与 src.* 模块路径都会执行注册, 同身份必须幂等
    pr.register("dup", category="protocol", adapter=GoodAdapter)
    pr.register("dup", category="protocol", adapter=GoodAdapter,
                _module="some.other.module")
    assert pr.get("dup")["adapter"] is GoodAdapter


def test_register_accepts_contract_class():
    pr.register("good", category="protocol", adapter=GoodAdapter)
    assert pr.get("good")["adapter"] is GoodAdapter


def test_string_adapter_deferred_resolution_roundtrip():
    pr.register("lazy", category="protocol", adapter="GoodAdapter")
    # current module records as source; class is defined here
    cls = pr.resolve_adapter("lazy")
    assert cls is GoodAdapter


def test_string_adapter_resolution_fails_loud():
    pr.register("lazy_bad", category="protocol", adapter="NoSuchAdapter")
    with pytest.raises(TypeError, match="NoSuchAdapter"):
        pr.resolve_adapter("lazy_bad")


def test_resolve_unknown_plugin():
    with pytest.raises(KeyError):
        pr.resolve_adapter("ghost")


def test_discover_reports_failures_loudly(tmp_path, monkeypatch):
    good = tmp_path / "plug_ok.py"
    good.write_text(textwrap.dedent("""
        from src.protocols.base import BaseProtocolAdapter
        class TmpPlug(BaseProtocolAdapter):
            pass
        from src import plugin_registry as pr
        pr.register("tmp_plug", category="protocol", adapter=TmpPlug)
    """), encoding="utf-8")
    bad = tmp_path / "plug_broken.py"
    bad.write_text("raise RuntimeError('boom')\n", encoding="utf-8")
    monkeypatch.syspath_prepend(str(tmp_path))
    report = pr.discover(str(tmp_path), prefix="")
    assert "plug_ok" in report["loaded"]
    assert any("plug_broken" in k for k in report["failed"])
    assert "tmp_plug" in {p["name"] for p in pr.list_all()}
    # report is retained for observability
    assert "plug_broken" in str(pr.last_report()["failed"])


class _FakeEPS:
    def __init__(self, eps):
        self._eps = eps

    def select(self, group):
        return self._eps


def _fake_ep(name, value, obj, version="0.2.0"):
    """造一个**长得像真 EntryPoint** 的假对象: 只给 dist, 不给 version。

    ⚠️ 本测试此前给假对象手写了一个 `version = "0.2.0"` 类属性 —— 而真实的
    `importlib.metadata.EntryPoint` **没有这个属性**。于是这段测试验的是
    「代码能读到那个手写的值」, 而生产上每一次装载都恒定拿到兜底版本:
    **测试把这个 bug 供起来了**, 判据的判别域是假对象, 永远看不见死读。
    """
    class _Dist:
        pass

    d = _Dist()
    d.version = version

    class _EP:
        pass

    ep = _EP()
    ep.name = name
    ep.value = value
    ep.dist = d
    ep.load = staticmethod(lambda: obj) if not isinstance(obj, Exception) \
        else staticmethod(_raiser(obj))
    return ep


def _raiser(exc):
    def _load():
        raise exc
    return _load


def test_real_entrypoint_has_no_version_attribute():
    """锚住上面那条注释依据的事实: 真类型没有 .version, 版本在 .dist.version。

    这条测的是标准库不是本仓代码 —— 但它正是 `_ep_dist_version` 存在的理由,
    将来某个 Python 给 EntryPoint 加上 .version 时, 这里会先红。
    """
    from importlib.metadata import EntryPoint
    ep = EntryPoint(name="x", value="m:a", group="g")
    assert not hasattr(ep, "version")
    assert hasattr(ep, "dist")


def test_discover_entry_points_registers_adapters(monkeypatch):
    class EpAdapter(BaseProtocolAdapter):
        pass

    monkeypatch.setattr(pr, "entry_points", lambda: _FakeEPS([
        _fake_ep("ep_driver", "fake_mod:EpAdapter", EpAdapter),
        _fake_ep("ep_bad", "fake_mod:Broken", ImportError("module gone")),
    ]))
    report = pr.discover_entry_points("iotstudio.drivers")
    assert report["loaded"] == ["ep_driver"]
    assert any("ep_bad" in k for k in report["failed"])
    plugin = pr.get("ep_driver")
    assert plugin["adapter"] is EpAdapter
    assert plugin["metadata"]["source"] == "entry_points"
    assert plugin["version"] == "0.2.0"


def test_entry_point_version_falls_back_to_a_visible_sentinel(monkeypatch):
    """负控: 取不到发行版版本时, 必须是**看得出来**的哨兵, 不是像真值的 "1.0"。

    没有这条,「版本没取到」与「版本真的是 1.0」给出同一个观测 ——
    而那正是这个 bug 藏了这么久的原因。
    """

    class EpAdapter(BaseProtocolAdapter):
        pass

    class _NoDistEP:
        name, value = "ep_nodist", "fake_mod:EpAdapter"

        class _BadDist:
            @property
            def version(self):
                raise RuntimeError("no metadata")

        dist = _BadDist()
        load = staticmethod(lambda: EpAdapter)

    monkeypatch.setattr(pr, "entry_points",
                        lambda: _FakeEPS([_NoDistEP()]))
    assert pr.discover_entry_points("iotstudio.drivers")["loaded"] == ["ep_nodist"]
    assert pr.get("ep_nodist")["version"] == "0.0.0+unknown"


def test_discover_app_entry_points_accepts_a_manifest_module(monkeypatch):
    """A 层: entry point 指向**模块**, 清单取自模块常量。"""

    class FakeModule:
        PLUGIN_MANIFEST = {"name": "my_app", "capabilities": ["tool"],
                           "version": "9.9.9"}

    monkeypatch.setattr(pr, "entry_points", lambda: _FakeEPS([
        _fake_ep("my_app", "iotstudio_my_app.plugin", FakeModule()),
    ]))
    assert pr.discover_app_entry_points()["loaded"] == ["my_app"]
    assert pr.get("my_app")["category"] == "app"


def test_app_entry_point_without_manifest_fails_loud(monkeypatch):
    """负控: A 层缺 PLUGIN_MANIFEST 必须**报失败**, 不许静默跳过 ——
    否则「装了个没清单的包」与「没装」在报告里长得一样。"""

    class NoManifestModule:
        pass

    monkeypatch.setattr(pr, "entry_points", lambda: _FakeEPS([
        _fake_ep("bare", "iotstudio_bare.plugin", NoManifestModule()),
    ]))
    report = pr.discover_app_entry_points()
    assert report["loaded"] == []
    assert any("bare" in k for k in report["failed"])


def test_health_includes_last_discovery():
    pr.discover("/nonexistent_dir_xyz", prefix="")
    h = pr.health()
    assert "last_discovery" in h
    assert h["last_discovery"]["failed"] == []


def test_demo_driver_package_conformance():
    demo_dir = Path(__file__).parent.parent / "examples" / "driver_plugin_demo"
    monkey = pytest.MonkeyPatch()
    monkey.syspath_prepend(str(demo_dir))
    try:
        mod = importlib.import_module("iotstudio_demo_driver")
        assert issubclass(mod.DemoSimDriver, BaseProtocolAdapter)

        from src.protocols.base import ProtocolConfig
        drv = mod.DemoSimDriver(ProtocolConfig(
            protocol_type="demo_sim", device_id="dev-1"))
        assert asyncio.run(drv.connect()) is True
        vals = asyncio.run(drv.read_points(
            [{"point_id": "pt1", "point_name": "温度"}]))
        assert len(vals) == 1
        assert vals[0].device_id == "dev-1"
        assert isinstance(vals[0].value, float)
        assert asyncio.run(drv.write_point({"point_id": "pt1"}, 42)) is True
        assert drv.config.extra["written"] == [{"pt1": 42}]
    finally:
        monkey.undo()
        sys.modules.pop("iotstudio_demo_driver", None)
        sys.modules.pop("iotstudio_demo_driver.driver", None)
