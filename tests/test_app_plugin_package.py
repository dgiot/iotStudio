"""A 层应用插件样板包的形制判据 (examples/app_plugin_demo)。

与 tests/test_driver_plugins.py 里的 B 层样板判据并列 —— 两个样板 = 两种形制。
本文件验的是**样板包自身合不合形制**, 不是底座代码 (底座那侧在 test_driver_plugins)。
"""
import importlib
import sys
try:
    import tomllib                      # Python 3.11+
except ModuleNotFoundError:             # Python 3.10：stdlib 没有 tomllib
    import tomli as tomllib             # requirements.txt: tomli; python_version < "3.11"
from pathlib import Path

import pytest

from src import plugin_registry as pr
from src.plugin_runtime import CAPABILITY_TYPES

DEMO_DIR = Path(__file__).parent.parent / "examples" / "app_plugin_demo"


@pytest.fixture(scope="module")
def demo_module():
    monkey = pytest.MonkeyPatch()
    monkey.syspath_prepend(str(DEMO_DIR))
    try:
        yield importlib.import_module("iotstudio_demo_app.plugin")
    finally:
        monkey.undo()
        sys.modules.pop("iotstudio_demo_app.plugin", None)
        sys.modules.pop("iotstudio_demo_app", None)


def _pyproject() -> dict:
    return tomllib.loads((DEMO_DIR / "pyproject.toml").read_text(encoding="utf-8"))


# ── 形制 ────────────────────────────────────────────────────

def test_entry_point_points_at_the_module(demo_module):
    """A 层约定: entry point 指向**模块**, 不是类 —— 且那个模块真能被 import。"""
    ep = _pyproject()["project"]["entry-points"]["iotstudio.apps"]["demo_app"]
    assert ep == "iotstudio_demo_app.plugin"
    assert isinstance(demo_module.PLUGIN_MANIFEST, dict)


def test_entry_point_group_is_the_app_group():
    """group 名是 A 层的契约面 —— 改了它等于换了形制, 应当是一条显式的红。"""
    from src.plugin_registry import APP_ENTRY_GROUP
    assert APP_ENTRY_GROUP in _pyproject()["project"]["entry-points"]


def test_manifest_has_the_required_keys(demo_module):
    m = demo_module.PLUGIN_MANIFEST
    assert m["name"] and isinstance(m["name"], str)
    assert m["version"]
    assert isinstance(m["capabilities"], list) and m["capabilities"]


def test_capabilities_are_all_known(demo_module):
    """声明了底座不认识的 capability ⇒ 装载期会被判 degraded (不是报错)。
    在样板里就把它挡住, 免得样板教人写一个注定降级的清单。"""
    unknown = set(demo_module.PLUGIN_MANIFEST["capabilities"]) - CAPABILITY_TYPES
    assert not unknown, f"未知 capability: {unknown}"


# ── 版本: 只有一个来源 ──────────────────────────────────────

def test_version_is_not_written_twice(demo_module):
    """★ pyproject 里那个版本字面量, **不许**再出现在 plugin.py 里。

    这是「同一事实两处」的判据形态: 手抄的第二份不会跟着包升级走,
    而两个值长得一模一样 ⇒ 漂了也看不出来。这里让它根本写不下来。
    """
    literal = _pyproject()["project"]["version"]
    src = (DEMO_DIR / "iotstudio_demo_app" / "plugin.py").read_text(encoding="utf-8")
    assert literal not in src, (
        f"plugin.py 里出现了 pyproject 的版本字面量 {literal!r} —— "
        f"版本应从 importlib.metadata 读回, 不手写第二份")


def test_manifest_version_is_the_read_back_one(demo_module):
    """清单里的 version 必须**就是**模块 __version__ (同一个值), 不是另抄一份。"""
    assert demo_module.PLUGIN_MANIFEST["version"] == demo_module.__version__


def test_uninstalled_falls_back_to_a_visible_sentinel(demo_module, monkeypatch):
    """未 pip install 时回落值必须**看得出来**, 不是像真值的 "1.0"。

    ⚠️ 这里**打桩**, 不靠「环境里恰好没装」: `pip install --no-build-isolation
    <本地目录>` 会在源码树里留下 `.egg-info/`, 而 importlib.metadata 扫的是
    sys.path 上的 dist-info/egg-info、不是「这个模块从哪 import 来的」——
    于是「我以为没装」也可能读出真版本, 判据就成了靠 `or` 侥幸通过。

    (这不是假想: 写这条时本仓 examples/ 下正好有一个安装残留,
     未设 PYTHONPATH 却读出了真版本 —— 断言当时写的是 `A or B`, 还是绿的。)
    """
    from importlib.metadata import PackageNotFoundError

    monkeypatch.setattr(demo_module, "_dist_version",
                        _raise(PackageNotFoundError("iotstudio-demo-app")))
    v = demo_module._resolve_version()
    assert v.endswith("+src"), f"未装的回落值 {v!r} 看不出「这不是真版本」"
    assert v != "1.0"


def test_installed_reads_the_version_back_from_the_dist(demo_module, monkeypatch):
    """正控 —— 打桩那条只证明「抛异常时回落」, 不证明「正常时读得到」。

    没有它, 一个恒返回 "0.0.0+src" 的实现能让上面那条一直绿。
    """
    monkeypatch.setattr(demo_module, "_dist_version",
                        lambda _name: _pyproject()["project"]["version"])
    assert demo_module._resolve_version() == _pyproject()["project"]["version"]


def _raise(exc):
    def _f(*_a, **_k):
        raise exc
    return _f


# ── apply(ctx) 真的登记了东西 ───────────────────────────────

class _RecordingCtx:
    """最小 ctx 替身 —— 只记下被调了什么, 不碰真 manager。"""

    def __init__(self):
        self.tools, self.routes = {}, []

    def register_tool(self, name, fn=None, *, description=""):
        self.tools[name] = (fn, description)

    def route(self, method, path, handler, *, description=""):
        self.routes.append((method, path, handler, description))
        return lambda: None


def test_apply_registers_a_tool_and_a_route(demo_module):
    ctx = _RecordingCtx()
    disposers = demo_module.apply(ctx)
    assert isinstance(disposers, list)
    assert "demo_echo" in ctx.tools
    assert [r[:2] for r in ctx.routes] == [("GET", "/health")]


def test_registered_tool_actually_works(demo_module):
    """登记了一个名字但 fn 是坏的, 与没登记在 /api/plugins 上长得一样 ——
    所以这里**真调一次**。"""
    ctx = _RecordingCtx()
    demo_module.apply(ctx)
    fn, _desc = ctx.tools["demo_echo"]
    out = fn("hello")
    assert out["echo"] == "hello"
    assert out["version"] == demo_module.__version__


def test_route_handler_is_callable_with_the_host_req_shape(demo_module):
    """req 的形制来自底座 (`{method,path,pkg,query,body}`) —— 样板得能吃下它。"""
    ctx = _RecordingCtx()
    demo_module.apply(ctx)
    handler = ctx.routes[0][2]
    assert handler({"method": "GET", "path": "/health", "pkg": "demo_app",
                    "query": {}, "body": None})["ok"] is True


# ── 与发现路径接上 ──────────────────────────────────────────

def test_discovery_finds_the_demo_module(demo_module, monkeypatch):
    """把真模块挂到一个假 entry point 上, 走真发现函数 —— 样板与底座接口对得上。"""
    class _Dist:
        version = _pyproject()["project"]["version"]

    class _EP:
        name, value = "demo_app", "iotstudio_demo_app.plugin"
        dist = _Dist()
        load = staticmethod(lambda: demo_module)

    class _EPS:
        def select(self, group):
            assert group == pr.APP_ENTRY_GROUP
            return [_EP()]

    monkeypatch.setattr(pr, "entry_points", lambda: _EPS())
    report = pr.discover_app_entry_points()
    assert report["loaded"] == ["demo_app"], report
    assert pr.get("demo_app")["category"] == "app"
