"""plugin_ledger 的判据测试 —— 每条都配成对的控制组。

台账是**只读视图**（删掉它四套机制照常工作），所以它的全部价值在「报得对」。
而「报得对」只有成对控制组能证明：

  · 正控  构造一个真缺口，断言被逮住
  · 负控  构造一个非缺口，断言**不**被误报
  · 反控  把判据自己弄坏，断言它报「台账过期」而不是报绿

反控这条是本文件的重点：台账里 probe 扫不到有两种可能 ——
「这个能力确实没消费方」与「台账记的消费点搬走了」。两者**必须分开报**，
否则消费点一搬，台账就静默变成一纸空文，而它看上去仍然全绿。
"""
from pathlib import Path

import pytest

from src import plugin_ledger as pl
from src import plugin_registry as pr


@pytest.fixture(autouse=True)
def clean_registry():
    pr.clear_for_tests()
    yield
    pr.clear_for_tests()


def _kinds(gaps, kind):
    return [g for g in gaps if g["kind"] == kind]


def _decl(**kw):
    """造一条声明，只填关心的字段 —— 别的用默认，避免测试里手抄整张表。"""
    base = dict(id="t", layer="driver", kind="driver")
    base.update(kw)
    return pl.PluginDecl(**base)


# ═══════════════════════════════════════════════════════════
# ① driver 型：fallback 为空即缺口（成对）
# ═══════════════════════════════════════════════════════════

def test_missing_fallback_is_caught():
    """正控：driver 型没有回退 ⇒ 必须报 no_fallback。"""
    hits = _kinds(pl.gaps([_decl(id="orphan", kind="driver", fallback=None)]),
                  "no_fallback")
    assert [h["id"] for h in hits] == ["orphan"], \
        "driver 型缺席无回退，这是 driver 插槽的必备项，漏报等于台账失职"


def test_present_fallback_is_not_flagged():
    """负控：同一形状但**有**回退 ⇒ 不许报。缺了这条，
    「永远报 no_fallback」也能让上一条测试通过。"""
    assert _kinds(pl.gaps([_decl(id="ok", kind="driver", fallback="config_schema")]),
                  "no_fallback") == []


def test_non_driver_kinds_do_not_need_fallback():
    """负控的边界：capability / module 型本来就不要求一对一回退，
    拿 driver 的判据去套它们会长出假缺口。"""
    for kind in ("capability", "module"):
        assert _kinds(pl.gaps([_decl(id=f"x_{kind}", kind=kind, fallback=None)]),
                      "no_fallback") == [], f"{kind} 型不该按 driver 的必备项判"


# ═══════════════════════════════════════════════════════════
# ② B 层的镜像过滤 —— 修过一次假阳性，这里钉住
# ═══════════════════════════════════════════════════════════

def test_driver_reader_filters_mirrors_and_channels():
    """正控+负控同体：注册表里混进 A 层镜像与 C 层通道时，
    只留原生驱动 —— 且**必须仍留得下原生驱动**。

    少了后半句，一个「把所有东西都滤掉」的实现也能让前半句通过，
    而那会让台账报出「B 层 0 个插件」这个同样错误但更难发现的答案。
    """
    pr.register("native_p", category="protocol", adapter=None,
                _module="src.protocols.modbus_collector", config={"port": 502})
    pr.register("mirror_p", category="edge_app", adapter=None,
                _module="src.plugin_runtime")           # A 层镜像
    pr.register("chan_p", category="channel", adapter=None,
                _module="src.channel_registry")        # C 层通道

    decls, domain = pl._read_drivers()
    ids = [d.id for d in decls]

    assert ids == ["native_p"], f"A 层镜像与 C 层通道必须被滤掉，实得 {ids}"
    # 判别域自述要**把滤掉了什么报出来** —— 否则读的人不知道 7 是怎么来的
    assert "1 个 A 层镜像" in domain, domain
    assert "1 个 C 层通道" in domain, domain
    assert "1 个原生" in domain, domain


def test_mirror_filter_does_not_fire_on_a_genuine_driver():
    """负控：一个模组名恰好**不是** plugin_runtime 的驱动不许被误滤。
    过滤条件是 endswith 而非 contains —— 这条钉住它别写成 contains。"""
    pr.register("edge_svc", category="service", adapter=None,
                _module="src.services.some_plugin_runtime_wrapper")
    ids = [d.id for d in pl._read_drivers()[0]]
    assert ids == ["edge_svc"], \
        "过滤用的是 endswith('plugin_runtime')；写成 contains 会误杀这个模块名"


# ═══════════════════════════════════════════════════════════
# ③ probe 零命中 ⇒ 报「台账过期」，不是报「无消费方」（反控）
# ═══════════════════════════════════════════════════════════

def test_probe_zero_hit_reports_broken_not_no_consumer(monkeypatch):
    """反控：把某条 probe 换成永不命中的正则 —— 判据坏了。

    期望它报 probe_broken（红），**绝不是** no_consumer（那读起来像
    「这个能力确实没人用」，是个看起来成功的错答案）。
    """
    real = pl.CONSUMERS["pusher"]
    broken = dict(real, probe=r"ZZZ_DELIBERATELY_NO_MATCH_ZZZ")
    monkeypatch.setitem(pl.CONSUMERS, "pusher", broken)

    row = next(r for r in pl.consumer_report() if r["capability"] == "pusher")
    assert row["state"] == "probe_broken", \
        f"probe 零命中说明台账的落点记录过期了，不是没消费方；实得 {row['state']}"
    assert row["line"] is None

    # 走 collect() 的成品报告，而不是拿 declarations 去喂 gaps()：
    # 前者已经算好（且 declarations 是 as_dict() 后的字典，不是 PluginDecl）
    report = pl.collect()
    assert [x["id"] for x in _kinds(report["gaps"], "probe_broken")] == ["capability:pusher"]
    assert _kinds(report["gaps"], "no_consumer") != [], \
        "别的能力该报 no_consumer 还得报 —— 一条 probe 坏了不该污染整张表"


def test_real_probe_hits_and_reports_wired(monkeypatch):
    """负控：真 probe 必须命中并报 wired。缺了这条，上一条「报红」
    可能只是因为它对**所有** probe 都报红。"""
    row = next(r for r in pl.consumer_report() if r["capability"] == "pusher")
    assert row["state"] == "wired", row
    assert isinstance(row["line"], int) and row["line"] > 0


def test_consumer_report_covers_every_declared_capability():
    """没有能力被静默漏掉 —— 报表的构成项必须闭合。"""
    got = {r["capability"] for r in pl.consumer_report()}
    assert got == set(pl.CONSUMERS), f"少了 {set(pl.CONSUMERS) - got}"


# ═══════════════════════════════════════════════════════════
# ④ 早退分支必须与正常分支同形（修过一次 KeyError）
# ═══════════════════════════════════════════════════════════

def test_frontend_wiring_both_branches_have_same_keys(monkeypatch):
    """「域不存在」这条早退路径只在目录缺失时才走到，平时永远测不出来 ——
    而它的键名一旦与正常分支不一致，render() 会 KeyError。
    两分支的键集合必须相等。"""
    normal = pl.frontend_wiring()
    monkeypatch.setattr(pl, "_FRONTEND_SRC", Path("Z:/definitely/not/here"))
    early = pl.frontend_wiring()

    assert set(early) == set(normal), \
        f"早退分支键 {set(early)} 与正常分支 {set(normal)} 不同形"
    assert early["external_files"] == 0
    assert early["sites"] == []


def test_frontend_wiring_counts_files_and_keeps_all_lines():
    """计数口径是**文件数**，且一个文件里的命中行要全留下。

    router/index.js 同时 import 了 loader 与 index 两处；只记首个命中
    会把它渲染成「1 处」并只显示 :225，226 静默消失。
    """
    fw = pl.frontend_wiring()
    for s in fw["sites"]:
        assert set(s) == {"file", "lines"}, s
        assert isinstance(s["lines"], list) and s["lines"], s
    assert fw["external_files"] == len(fw["sites"])


# ═══════════════════════════════════════════════════════════
# ⑤ render 在两种域形态下都不能抛
# ═══════════════════════════════════════════════════════════

def test_render_survives_missing_frontend_dir(monkeypatch):
    monkeypatch.setattr(pl, "_FRONTEND_SRC", Path("Z:/definitely/not/here"))
    out = pl.render(pl.collect())
    assert "前端接线状态" in out
    assert "frontend-vue/src 不存在" in out
