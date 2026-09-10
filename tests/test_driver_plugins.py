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


def test_discover_entry_points_registers_adapters(monkeypatch):
    class EpAdapter(BaseProtocolAdapter):
        pass

    class FakeEP:
        name = "ep_driver"
        value = "fake_mod:EpAdapter"
        version = "0.2.0"

        @staticmethod
        def load():
            return EpAdapter

    class FakeBadEP:
        name = "ep_bad"
        value = "fake_mod:Broken"

        @staticmethod
        def load():
            raise ImportError("module gone")

    class FakeEPS:
        def __init__(self, eps):
            self._eps = eps

        def select(self, group):
            return self._eps

    monkeypatch.setattr(pr, "entry_points",
                        lambda: FakeEPS([FakeEP(), FakeBadEP()]))
    report = pr.discover_entry_points("iotstudio.drivers")
    assert report["loaded"] == ["ep_driver"]
    assert any("ep_bad" in k for k in report["failed"])
    plugin = pr.get("ep_driver")
    assert plugin["adapter"] is EpAdapter
    assert plugin["metadata"]["source"] == "entry_points"
    assert plugin["version"] == "0.2.0"


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
