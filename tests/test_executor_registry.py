# ============================================================
# executor 消费点 —— 从「注册了没人取」到真派发
# ============================================================
# ★ 这组断言有一个天然陷阱, 全篇写法都为它服务:
#   注册表路与兜底路返回的 fn **本来就都对** —— 注册表里那份就是本包注册的。
#   于是「派发成功」对两条路是**同一个值**, 表绿证明不了新分支被走到过
#   (同族形态: 「齐整的 0」到底是干净还是桶空)。
# ⇒ 必须造一个【只有走注册表才会赢】的场景: 让另一个插件注册同名 executor。
#   两侧读数取到**不同的 marker**, 断言才有区分力。
#
# 消费者: plugins/actions_pipeline/plugin.py::_dispatch
# 取用口: src/plugin_runtime.py::PluginManager.executors()
# ============================================================
import shutil
import sys
import textwrap
from pathlib import Path

import pytest

import src.plugin_runtime as pr
from src.plugin_runtime import PluginManager

REPO = Path(__file__).resolve().parent.parent
_PLUGIN_SRC = REPO / "plugins" / "actions_pipeline"

# 外部运输实现: 与 actions_pipeline 注册**同名**的 "log"。
# 名字以 zz_ 开头是刻意的 —— _plugin_dirs() 按字母序返回、_caps 按装载序
# update(后载者胜); 换个名字就可能排在前面, 断言会静默失效成「两边同一份」。
HIJACK_PLUGIN = """
    PLUGIN_MANIFEST = {"name": "zz_hijack", "version": "1.0.0",
                       "capabilities": ["executor"], "description": "外部运输实现"}
    def apply(ctx):
        def log_executor(defn, target_id, params):
            return {"ok": True, "marker": "HIJACK", "executor": "log"}
        ctx.register_executor("log", log_executor, description="外部替换的 log")
        return []
"""

# 两个文本插件, 只为验底座语义(不依赖 actions_pipeline 的真包)
DUP_A = """
    PLUGIN_MANIFEST = {"name": "aa_first", "version": "1.0.0",
                       "capabilities": ["executor"], "description": "先载"}
    def apply(ctx):
        ctx.register_executor("dup", lambda *a, **k: {"who": "aa_first"})
        return []
"""
DUP_B = """
    PLUGIN_MANIFEST = {"name": "bb_second", "version": "1.0.0",
                       "capabilities": ["executor"], "description": "后载"}
    def apply(ctx):
        ctx.register_executor("dup", lambda *a, **k: {"who": "bb_second"})
        return []
"""

# _BINDINGS 把这两个动作名绑到 log / mqtt
LOG_ACTION, MQTT_ACTION = "acknowledge_alarm", "command_down"


class _Defn:
    def __init__(self, name):
        self.name = name


def _write_plugin(pdir: Path, body: str):
    pdir.mkdir(parents=True, exist_ok=True)
    (pdir / "plugin.py").write_text(textwrap.dedent(body), encoding="utf-8")


def _mgr(tmp_path, name="plugins"):
    return PluginManager(plugins_dir=tmp_path / name,
                         state_path=tmp_path / "data" / "plugins_state.json")


def _stage(tmp_path, with_hijack=False):
    """临时根里只放 actions_pipeline(真包) —— 本仓 plugins/ 有 6 个包,
    全装一遍又慢又会污染 parse_hooks 之类的模块级状态。"""
    root = tmp_path / "plugins"
    shutil.copytree(_PLUGIN_SRC, root / "actions_pipeline")
    if with_hijack:
        _write_plugin(root / "zz_hijack", HIJACK_PLUGIN)
    mgr = PluginManager(plugins_dir=root,
                        state_path=tmp_path / "data" / "plugins_state.json")
    mgr.load_all()
    return mgr


# ── 取用口本身 ──────────────────────────────────────────────
def test_executors_accessor_exposes_registered(tmp_path):
    """九类里最后补上的一行取用口 —— 此前 _caps 通用、四个薄封装却独缺它。"""
    mgr = _stage(tmp_path)
    caps = mgr.executors()
    assert {"log", "mqtt"} <= set(caps), f"executors() 没取到注册项: {sorted(caps)}"
    assert callable(caps["log"]["fn"])


def test_later_plugin_wins_on_same_name(tmp_path):
    """「运输实现可换」的**机制**本身: 同名后者胜, 且不报错。

    这条也是给下面几条断言的**前提**做背书 —— 若字母序或 update 语义变了,
    是这里先红, 而不是下游那些断言变成「两边同一份」的假绿。
    """
    mgr = _mgr(tmp_path)
    _write_plugin(mgr.plugins_dir / "aa_first", DUP_A)
    _write_plugin(mgr.plugins_dir / "bb_second", DUP_B)
    mgr.load_all()
    got = mgr.executors()["dup"]["fn"](None, None, None)
    assert got == {"who": "bb_second"}, f"后载的没胜出: {got}"


# ── ★ 消费点: 注册表优先 ────────────────────────────────────
def test_dispatch_prefers_registry(tmp_path, monkeypatch):
    """★ 阳性对照 —— **只有走注册表才会赢**。

    单例指向这个 mgr(生产情形) 时, 派发必须落到外部那份上。
    这条绿 + 下面那条绿, 两条**读数不同**才证明新分支真被走到过。
    """
    mgr = _stage(tmp_path, with_hijack=True)
    mod = mgr.plugin_module("actions_pipeline")
    assert mod is not None, "actions_pipeline 没装载 —— 前提就不成立"
    monkeypatch.setattr(pr, "runtime", mgr)

    r = mod._dispatch(_Defn(LOG_ACTION), "t1", {})
    assert r.get("marker") == "HIJACK", f"没走注册表, 取到的是本包那份: {r}"


def test_dispatch_falls_back_when_registry_has_no_entry(tmp_path, monkeypatch):
    """兜底 —— 注册表里**没有这个名字**时落回本包。

    刻意把单例指到一个**空** manager(而不是「不指」): 不指的话, 结果取决于
    「本进程里有没有人 load 过单例」, 测试会变成顺序相关的。空 manager 让
    「注册表查不到」成为**构造出来的**条件, 与进程状态无关。
    """
    mgr = _stage(tmp_path, with_hijack=True)
    mod = mgr.plugin_module("actions_pipeline")
    monkeypatch.setattr(pr, "runtime", _mgr(tmp_path, name="empty_plugins"))

    r = mod._dispatch(_Defn(LOG_ACTION), "t1", {})
    assert r.get("ack") == "logged", f"没落回本包 log 执行器: {r}"


def test_dispatch_same_result_with_and_without_registry(tmp_path, monkeypatch):
    """行为中性 —— 只有本包注册时, 两条路读数**逐字段相同**。

    这是「今天上线的派发结果不变」那条承诺的判据。缺了它, 上面两条只能
    证明新分支可达, 不能证明它没改变既有行为。
    """
    mgr = _stage(tmp_path)
    mod = mgr.plugin_module("actions_pipeline")

    monkeypatch.setattr(pr, "runtime", _mgr(tmp_path, name="empty_plugins"))
    via_fallback = mod._dispatch(_Defn(LOG_ACTION), "t1", {})
    monkeypatch.setattr(pr, "runtime", mgr)
    via_registry = mod._dispatch(_Defn(LOG_ACTION), "t1", {})

    assert via_fallback == via_registry, \
        f"两条路读数不同: {via_fallback} vs {via_registry}"
    assert via_fallback.get("ack") == "logged", f"解析到的不是本包 log: {via_fallback}"


def test_untouched_name_resolves_to_own_mqtt(tmp_path, monkeypatch):
    """负控 —— 只劫持 log 时 mqtt 不该被一刀切。

    没有这条, 一个「无论名字一律返回第一个 executor」的实现也能让上面全绿。
    """
    mgr = _stage(tmp_path, with_hijack=True)
    mod = mgr.plugin_module("actions_pipeline")
    monkeypatch.setattr(pr, "runtime", mgr)

    r = mod._dispatch(_Defn(MQTT_ACTION), "t1", {})
    # 缺 topic/product_id 时 mqtt_executor 自己报 ok=False —— 关键是它**是本包的**
    assert r.get("executor") == "mqtt" and "marker" not in r, \
        f"未劫持的名字取到了别处: {r}"


def test_disable_restores_own_executor(tmp_path, monkeypatch):
    """反向对照 —— 停用外部覆盖后必须回落, disposer 链才成立。"""
    mgr = _stage(tmp_path, with_hijack=True)
    mod = mgr.plugin_module("actions_pipeline")
    monkeypatch.setattr(pr, "runtime", mgr)
    assert mod._dispatch(_Defn(LOG_ACTION), "t1", {}).get("marker") == "HIJACK"

    mgr.disable("zz_hijack")
    r = mod._dispatch(_Defn(LOG_ACTION), "t1", {})
    assert r.get("ack") == "logged", f"停用后没回落: {r}"


# ── 失败模式: 该响的响、该默的默 ────────────────────────────
def test_registry_accessor_gone_is_loud(tmp_path, monkeypatch):
    """取用口没了必须**响**, 不许静默回落。

    这条锁的是行为本身, 不是「当时的意图」: 注册表取用口坏掉是**接线故障**,
    静默回落会让「新实现换了没生效」与「压根没有注册表」长得一模一样 ——
    本工程的头号形态就是静默失败。谁要把它改成默, 先来改这条断言并说明理由。
    """
    mgr = _stage(tmp_path)
    mod = mgr.plugin_module("actions_pipeline")

    class _NoAccessor:          # 有装载/注册, 但没有 executors()
        pass

    monkeypatch.setattr(pr, "runtime", _NoAccessor())
    with pytest.raises(AttributeError):
        mod._dispatch(_Defn(LOG_ACTION), "t1", {})


def test_missing_runtime_module_falls_back(tmp_path, monkeypatch):
    """底座模块**导不进来**时必须回落 —— 假 ctx 那批用例的真实处境。

    这是 `try: from src.plugin_runtime import runtime / except: return None`
    那一跳的判据。没有它, 插件就对底座产生了一条**硬依赖**:
    `src.plugin_runtime` 不在 sys.modules 时整个插件跟着崩。
    """
    mgr = _stage(tmp_path)
    mod = mgr.plugin_module("actions_pipeline")
    monkeypatch.setitem(sys.modules, "src.plugin_runtime", None)  # import 必抛

    r = mod._dispatch(_Defn(LOG_ACTION), "t1", {})
    assert r.get("ack") == "logged", f"底座不可用时没回落: {r}"


# ── 判据自身: probe 不许指向自己 ────────────────────────────
def test_every_probe_hits_code_not_prose():
    """台账的 probe 是**逐行搜、取首个命中** —— 于是散文里写一次取用口的
    字面名, 落点就从真调用抢到注释上: 此后**把调用整个删掉, 台账仍报「接通」**。

    这不是假想 —— 2026-10-02 本文件诞生当天就撞上: `_registry_executor` 的
    docstring 里写了一次取用口名, 台账落点立刻由 `plugin.py:79` 漂到 `:70`
    (注释行)。修法是**改散文不改判据** —— 判据宽是对的, 它该在消费点搬走时红。

    用 tokenize 判「**命中的那个位置**是否落在 STRING/COMMENT 里」——
    注意是**位置**, 不是**行**: 判到行一级会假红, 因为
    `return (runtime.executors().get(name) or {}).get("fn")` 这一行里
    **既有代码也有字符串字面量** `"fn"`, 整行会被判成散文。
    (本判据第一版就是这么写的, 当场把真调用报成了散文 ——
     「判据域 ≠ 目标域」在这条测试自己身上又犯了一次。)
    覆盖 CONSUMERS 里**全部**有 path 的能力, 不只 executor。
    """
    import io
    import re
    import tokenize

    from src.plugin_ledger import CONSUMERS

    checked, bad = 0, []
    for cap, spec in sorted(CONSUMERS.items()):
        if not spec.get("path"):
            continue
        checked += 1
        src = (REPO / spec["path"]).read_text(encoding="utf-8")
        prose = []
        for tok in tokenize.generate_tokens(io.StringIO(src).readline):
            if tok.type in (tokenize.STRING, tokenize.COMMENT):
                prose.append((tok.start, tok.end))     # (row, col), 1-based row
        lines = src.splitlines()
        hits = [i for i, ln in enumerate(lines, 1) if re.search(spec["probe"], ln)]
        if not hits:
            bad.append(f"{cap}: probe {spec['probe']!r} 在 {spec['path']} 零命中")
            continue
        first = hits[0]
        m = re.search(spec["probe"], lines[first - 1])
        pos = (first, m.start())
        if any(s <= pos < e for s, e in prose):
            bad.append(f"{cap}: 首命中落在注释/docstring 第 {first} 行 —— "
                       f"{lines[first - 1].strip()[:70]}")

    # 判别域守卫: 一个「零命中」的循环也会全绿, 先钉住射程
    assert checked >= 6, f"只扫到 {checked} 个 probe, 判别域比预期小"
    assert not bad, "probe 指向了散文(届时删掉调用也报接通):\n  " + "\n  ".join(bad)

