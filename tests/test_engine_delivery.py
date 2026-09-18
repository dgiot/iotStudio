# ============================================================
# 引擎交付 + 降级可见性 —— 两条都是「静默失败」的出口
# ============================================================
# 各配正控与负控:
#   ① `set_engine` 零生产调用者 => 含 target_exists 判据的动作提交**恒被拒**,
#      而症状只是「提交失败」: 不报错、不指向接线、与「实体不存在」同形;
#   ② `health()` 没有 degraded 键 => `h.get("degraded", 0)` 拿到的是缺省值
#      而不是测量值, 已实际造成过一次跨会话误报 (报 0, 真值 >=1)。
# ============================================================
import importlib.util
import shutil
import textwrap
from pathlib import Path

from src.plugin_runtime import PluginManager

REPO = Path(__file__).resolve().parent.parent
_PLUGIN_SRC = REPO / "plugins" / "actions_pipeline"


class StubEngine:
    def __init__(self, entities=None):
        self._e = entities or {}

    def entity_type(self, entity_id):
        return self._e.get(entity_id)


def _write_plugin(pdir: Path, body: str):
    pdir.mkdir(parents=True, exist_ok=True)
    (pdir / "plugin.py").write_text(textwrap.dedent(body), encoding="utf-8")


def _mgr(tmp_path: Path) -> PluginManager:
    return PluginManager(plugins_dir=tmp_path / "plugins",
                         state_path=tmp_path / "data" / "plugins_state.json")


# 声明了注入点 / 没声明注入点 —— 一对。用来把「交付给要的人」与
# 「交付给所有人」分开: 只有前者才是接线, 后者是撒网。
NEEDS_ENGINE = """
    PLUGIN_MANIFEST = {"name": "needs_engine", "version": "1.0.0",
                       "capabilities": ["tool"], "description": "需要本体"}
    received = []
    def set_engine(engine):
        received.append(engine)
    def apply(ctx):
        ctx.register_tool("probe", description="probe")
        return []
"""

NO_ENGINE = """
    PLUGIN_MANIFEST = {"name": "no_engine", "version": "1.0.0",
                       "capabilities": ["tool"], "description": "不需要本体"}
    def apply(ctx):
        ctx.register_tool("probe", description="probe")
        return []
"""

# 声明两个 capability 却只注册一个 —— 「声明即校验」的靶子
DEGRADED_ONE = """
    PLUGIN_MANIFEST = {"name": "degraded_one", "version": "1.0.0",
                       "capabilities": ["tool", "graph"],
                       "description": "声明了 graph 但从不注册"}
    def apply(ctx):
        ctx.register_tool("probe", description="probe")
        return []
"""


# ── 引擎交付 ────────────────────────────────────────────────
def test_deliver_reaches_only_plugins_that_ask(tmp_path):
    """正控 + 负控: 声明了 set_engine 的收到, 没声明的**不在名单里**。"""
    mgr = _mgr(tmp_path)
    _write_plugin(mgr.plugins_dir / "needs_engine", NEEDS_ENGINE)
    _write_plugin(mgr.plugins_dir / "no_engine", NO_ENGINE)
    mgr.load_all()

    eng = StubEngine()
    got = mgr.deliver_engine(eng)

    assert got == ["needs_engine"], f"交付名单不对: {got}"
    # 正控要落在「收到了那一个对象」上 —— 只断言「被调用过」的话,
    # 交付一个错的对象(别的引擎、None)也照样绿。
    assert mgr.plugin_module("needs_engine").received == [eng]
    # 负控: 没声明注入点的包连属性都不该有 —— 它不该被碰
    assert not hasattr(mgr.plugin_module("no_engine"), "set_engine")


def test_plugin_module_is_the_loaded_object_not_a_reimport(tmp_path):
    """`plugin_module` 必须给**装载期那一个** —— 重新 import 会得到另一个 module。

    不是洁癖: 副本的模块级状态 (_engine_box 之类) 与已注册的执行器/工具
    **不共享**, 拿副本去 set_engine 设的是个没有读者的变量, 而且不报错。
    本测试先把「副本确实不同」证出来, 否则下面的断言可能只是在描述一个巧合。
    """
    mgr = _mgr(tmp_path)
    _write_plugin(mgr.plugins_dir / "needs_engine", NEEDS_ENGINE)
    mgr.load_all()
    loaded = mgr.plugin_module("needs_engine")
    assert loaded is not None

    spec = importlib.util.spec_from_file_location(
        "needs_engine_reimport", mgr.plugins_dir / "needs_engine" / "plugin.py")
    copies = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(copies)
    assert copies is not loaded, "重新 import 竟是同一个对象 —— 那条注释的前提不成立了"

    mgr.deliver_engine(StubEngine())
    assert len(loaded.received) == 1, "引擎没交到装载期那个模块上"
    assert copies.received == [], "引擎交到了副本上 —— 副本没有读者, 等于没接"


def test_engine_delivered_before_plugin_load_still_arrives(tmp_path):
    """引擎先到、插件后到 —— 装载顺序不该决定插件看不看得见本体。"""
    mgr = _mgr(tmp_path)
    eng = StubEngine()
    assert mgr.deliver_engine(eng) == []       # 此刻一个插件都还没装载
    _write_plugin(mgr.plugins_dir / "needs_engine", NEEDS_ENGINE)
    mgr.load_all()
    assert mgr.plugin_module("needs_engine").received == [eng], \
        "装载发生在交付之后, 插件就没拿到引擎 —— 变成「谁先醒谁赢」"


def test_real_actions_pipeline_target_exists_flips_on_delivery(tmp_path, monkeypatch):
    """端到端 —— 这次接线的**目的**本身: 交付前恒拒, 交付后能过。

    只搬 actions_pipeline 一个包进临时根: 本仓 plugins/ 有 6 个包,
    全装一遍又慢又会污染 parse_hooks 之类的模块级状态。
    """
    monkeypatch.setenv("ACTION_AUDIT_PATH", str(tmp_path / "audit.jsonl"))
    root = tmp_path / "plugins"
    shutil.copytree(_PLUGIN_SRC, root / "actions_pipeline")
    mgr = PluginManager(plugins_dir=root,
                        state_path=tmp_path / "data" / "plugins_state.json")
    mgr.load_all()
    mod = mgr.plugin_module("actions_pipeline")
    assert mod is not None, "actions_pipeline 没装载 —— 端到端的前提就不成立"

    from src.action_defs import ActionDefinition, register
    register(ActionDefinition(
        name="delivery_probe", title="交付探针", params_schema={},
        submit_criteria=["target_exists"], allowed_roles=["operator"],
        target_layer="any", external_side_effect=False, builtin=True), overwrite=True)
    mod._PIPELINE = None                       # 每测试全新管线

    submit = mod._get_pipeline().submit
    # 负控: 引擎未交付 —— 必须过不去。这条是「拒」的那一半, 没有它,
    # 下面那条 executed 可能只是「判据压根没在跑」。
    r0 = submit("delivery_probe", params={}, role="operator", target_id="pt_1")
    assert r0["state"] != "executed", f"引擎还没接, 提交却过了: {r0}"

    mgr.deliver_engine(StubEngine({"pt_1": "point"}))
    # 正控: 交付后同一个提交必须能过。_NullEngine 是**活代理** (读 _engine_box),
    # 所以已经建好的管线也该立刻看到新引擎。
    r1 = submit("delivery_probe", params={}, role="operator", target_id="pt_1")
    assert r1["state"] == "executed", f"引擎接了, 提交却还是没过: {r1}"


# ── 降级可见性 ──────────────────────────────────────────────
def test_health_reports_degraded_by_name(tmp_path):
    """正控: 真降级的包必须**带名字**出现在 health() 里。"""
    mgr = _mgr(tmp_path)
    _write_plugin(mgr.plugins_dir / "degraded_one", DEGRADED_ONE)
    _write_plugin(mgr.plugins_dir / "no_engine", NO_ENGINE)
    h = mgr.load_all()

    assert h["degraded"] == 1, f"降级计数不对: {h}"
    assert h["degraded_plugins"] == ["degraded_one"], h
    # 负控: 正常装载的包不许出现在名单里
    assert "no_engine" not in h["degraded_plugins"]
    # 这份名单与逐插件 summary() 必须是**同一个事实** ——
    # 两处打架比缺一处更坏: 读数的人不知道该信哪个。
    assert h["degraded_plugins"] == sorted(
        e["name"] for e in mgr.summary() if e["degraded"])


def test_health_degraded_survives_disable(tmp_path):
    """停用不修复降级 —— 按 status 过滤会把降级包从名单里静默抹掉。"""
    mgr = _mgr(tmp_path)
    _write_plugin(mgr.plugins_dir / "degraded_one", DEGRADED_ONE)
    mgr.load_all()
    assert mgr.health()["degraded_plugins"] == ["degraded_one"]

    mgr.disable("degraded_one")
    h = mgr.health()
    assert h["disabled"] == 1
    assert h["degraded_plugins"] == ["degraded_one"], \
        "disable 之后降级包从名单里消失了 —— 可它并没有被修好"


def test_health_degraded_is_empty_when_nothing_is_degraded(tmp_path):
    """负控的负控: 全好的时候名单必须是空的**且字段在** ——
    不许用「字段不存在」冒充「没有降级」(那正是改之前那个坑的形状)。"""
    mgr = _mgr(tmp_path)
    _write_plugin(mgr.plugins_dir / "needs_engine", NEEDS_ENGINE)
    _write_plugin(mgr.plugins_dir / "no_engine", NO_ENGINE)
    h = mgr.load_all()

    assert "degraded" in h and "degraded_plugins" in h
    assert h["degraded"] == 0 and h["degraded_plugins"] == []
