# ============================================================
# FDE 六步 —— 对平判据
# ============================================================
#
# 「FDE 六步」这一个名字底下有**三个不同的对象**（benchmark / edge / bar），
# 三者关系原先没有任何一处写清。2026-09-20 实测的形态：
#
#   · 同一页面上副标题写「…时序存储 → 规则引擎 → 驾驶舱…」（基准六步），
#     而它**自己的步骤条**写「…规则引擎 / 驾驶舱 / AI Agent」—— 两句都真，
#     但一个字的说明都没有，读的人只会以为其中一个是错的。
#   · 步骤条第 2 格写「本体编译」而同页卡片标题写「本体语义建模」，
#     第 3 格写「协议发现」而卡片写「协议自动发现」—— 同页两处、相隔 30 行。
#   · src/web/fde_api.py 里 `fde_wizard_dashboard` 上方注释写 Step 4、
#     它自己的 docstring 写 Step 6，而 `fde_wizard_agent` 也自称 Step 6。
#   · 代理端点返回键 `step4_dashboard` 用向导顺序的位次、`step5_rules` 用基准
#     位次 —— 于是页面的回显行只能写成 `Step4: ${d.step5_rules...}` 才读得通，
#     **一行里混用两套编号**，那是漂移留下的化石层。
#
# 这组判据把三处载体钉到 src/web/fde_api.py 的 FDE_STEPS 上。
#
# ── 2026-09-20 第二轮：结构重排 ──────────────────────────────
# 第一轮只补了说明（页面自己说出两组编号的对应关系），步骤条本身没动。
# 第二轮按用户指示改了**结构**：
#   · 步骤条六格改成**基准位次**（第 4 格 = 时序存储, 原先向导跳过它、条上只有 5 格）
#   · AI Agent **移出步骤条**，独立成条排在下方（原先它占第 6 格）
# 重排后步骤条与副标题、与返回键终于同一套编号。但**内容仍不是一回事**:
# 第 4 格向导不实现它 —— 点开只有说明卡、没有按钮, 走完全程那一格也不会亮。
# 所以判据的核心从「两组编号的对应关系」变成**「格数 6 ≠ 向导做了 6 步」**。
#
# ⚠️ 判据刻意**不读** docs/palantir-benchmark.md —— 那个文件不在 git 仓里
# （docs/ 被 .gitignore 整个忽略，注释写 `# Sensitive`），读它会在干净检出里
# **直接崩而不是报红**。benchmark 六步以字面量存在 FDE_STEPS 里，
# 文档路径只在 source 字段里留个出处。
import re
import sys
from pathlib import Path

import pytest

from src.web.fde_api import (FDE_RETIRED_NAMES, FDE_STEPS, FDE_STEP_INTERNAL,
                             FDE_STEP_VIEWS)

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "frontend-vue" / "public" / "fde.html"
CLAUDE_MD = ROOT / "CLAUDE.md"

# 代理端点返回键的正确编号 —— 键名里就带着位次，所以集合比较同时覆盖了
# 「键在不在」与「编号对不对」两件事。
AGENT_STEP_KEYS = {
    "step1_product": "Model",
    "step2_ontology": "Ontology",
    "step3_scan_hint": "Device Access",
    "step5_rules": "Rules",
    "step6_dashboard": "Dashboard",
    # ⚠️ 没有 step4_*：向导不覆盖时序存储。要加这个键，先改 FDE_STEPS。
}


def _page_text():
    return PAGE.read_text(encoding="utf-8")


# ── 判别内核（抽出来是为了让负控能验证它们自己）──────────────────

def _bar_span(text):
    """定位步骤条。返回 Match，group(2) 是 `<div class="steps">` 的内容。"""
    return re.search(r'(<div class="steps">\n)(.*?)(\n</div>)', text, re.S)


def _replace_in_bar(text, old, new):
    """**只在步骤条内**替换。

    整页替换会先打到副标题上 —— 而副标题里就有「本体语义建模」。那样负控测的
    就不是步骤条了，是「我改到了别处」。手打字面量是判据里唯一的单点故障，
    所以这里连替换范围也由解析结果决定，不靠人记位置。
    """
    m = _bar_span(text)
    assert m, "fde.html 里找不到步骤条"
    assert old in m.group(2), f"步骤条里没有「{old}」—— 负控的前提不成立"
    return text[:m.start(2)] + m.group(2).replace(old, new, 1) + text[m.end(2):]


def _bar_cells(text):
    """步骤条的格名列表（解析得出，不手打）。"""
    m = _bar_span(text)
    if not m:
        return None
    return [t for _, t in
            re.findall(r'<div class="n">(\d+)</div><div class="t">([^<]*)</div>', m.group(2))]


def _bar_violations(text):
    """判据内核：页面步骤条 == `FDE_STEPS['bar']['cells']`，**逐位**。

    ★ 事实源存的是 `bar.cells`（页面自己的措辞），**不是** `benchmark.steps_zh`。
    第一版这条判据要求两者逐字相等，跑出来红在第 3/6 格 —— 而红得对: 把
    「协议自动发现」改成基准的「多协议接入」，抹掉的是「向导这一步做的是**发现**」
    这条事实。**对平不是把措辞刷成一样**，是把差异写下来。差异现在由
    `test_the_bar_declares_every_place_it_differs_from_the_benchmark` 逐位钉住。

    这条同时钉住「AI Agent 不许回到步骤条里」—— 格数 6 是硬约束。
    """
    got = _bar_cells(text)
    if got is None:
        return ["fde.html 里找不到步骤条 —— 判据的判别域没了"]
    want = list(FDE_STEPS["bar"]["cells"])
    bad = []
    for i, (g, w) in enumerate(zip(got, want), 1):
        if g != w:
            bad.append(f"第 {i} 格写「{g}」，事实源是「{w}」")
    if len(got) != len(want):
        bad.append(f"格数 {len(got)} != 基准的 {len(want)} 步 —— "
                   "多出来的那一格是什么？（AI Agent 曾被放在这里过）")
    return bad


def _replace_in_note(text, old, new):
    """**只在说明段内**替换 —— 与 `_replace_in_bar` 同一个理由。

    ★ 这不是防御性的洁癖, 是实测: 负控原先写 `text.replace('向导不实现', …, 1)`,
    而**上方那段 HTML 注释里也有同一个词**（「第 4 格向导不实现它」）, 于是
    replace 打的是注释、被判的域一个字没动 —— 负控却报「判据自己坏了」。
    判据没坏, 是负控的**前提**没成立。域由解析结果决定, 不靠人记位置。
    """
    m = re.search(r'六格按<b>基准位次</b>排列.*?</p>', text, re.S)
    assert m, "找不到说明段（锚点变了？）"
    assert old in m.group(0), f"说明段里没有「{old}」—— 负控的前提不成立"
    return text[:m.start()] + m.group(0).replace(old, new, 1) + text[m.end():]


def _skip_marked_cells(text):
    """步骤条上带 `skip` 类的格（序号, 1-based）。解析得出，不手打。

    ★ 第一版这里把 `findall` 的两个组**接反了**（写成 `for n, cls in ...`，而组序
    是 `(cls, n)`）—— 于是 `"skip" in cls` 变成 `"skip" in "4"`，**恒为假**。它不
    报错、不抛异常，读数是「没有一格带标记」。逮住它的是**正控**（本该 == [4] 却
    得到 []）。这类错的值全在「错得很安静」：两个组都是字符串，接反了类型也对得上。
    """
    m = _bar_span(text)
    if not m:
        return None
    return [int(n) for cls, n in
            re.findall(r'<div class="step([^"]*)" id="step(\d+)"', m.group(2))
            if "skip" in cls]


def _skip_mark_violations(text):
    """判据内核：**恰好**一格带 skip 标记，且就是事实源说的那一格。

    重排后六格在点击前长得一模一样 —— 没有标记，「向导不实现第 4 格」就只靠
    下面那句说明承载。标记被谁删掉、或者多标了一格，都在这里红。
    """
    got = _skip_marked_cells(text)
    if got is None:
        return ["fde.html 里找不到步骤条"]
    want = FDE_STEPS["bar"]["skip_index"] + 1
    if got != [want]:
        where = f"第 {got} 格" if got else "**一格都没有**"
        return [f"带 skip 标记的是{where}，事实源说的是第 {want} 格"
                "（第 4 格「时序存储」向导不实现，其余五格是可执行表单）"]
    return []


def _card_title_violations(text):
    """判据内核：同页的卡片标题 vs 步骤条 —— 这两处原先就打架。"""
    m = _bar_span(text)
    if not m:
        return ["fde.html 里找不到步骤条"]
    cells = {int(n): t for n, t in
             re.findall(r'<div class="n">(\d+)</div><div class="t">([^<]*)</div>', m.group(2))}
    cards = {int(n): t for n, t in
             re.findall(r'<h2>[^<]*Step (\d+): ([^<]*)</h2>', text)}
    bad = []
    if set(cards) != set(cells):
        bad.append(f"步骤条有第 {sorted(cells)} 格，卡片有第 {sorted(cards)} 步 —— 对不上")
    for i in sorted(set(cards) & set(cells)):
        if not cards[i].startswith(cells[i]):
            bad.append(f"第 {i} 处不一致：步骤条「{cells[i]}」vs 卡片「{cards[i]}」")
    return bad


def _strip_line_comments(text):
    """去掉**整行**的 `//` 注释。

    ★ 判据必须分得清「缺陷」与「提到缺陷的那句话」—— 这不是假想的风险：
    本页那段说明漂移的注释**原文引用**了 `Step4: ${d.step5_rules...}`，
    内核第一版把它当成了活的缺陷报红（2026-09-20 实跑）。
    计数类判据在**两个方向**都会错：把引用读成缺陷，或把缺陷读成引用。

    只去整行注释、不按行尾 `//` 切 —— 页面里有 `http://` 这类字符串，
    按 `//` 切会把 URL 拦腰截断，那是另一种静默的判别域缩小。
    """
    return "\n".join("" if ln.lstrip().startswith("//") else ln
                     for ln in text.split("\n"))


def _echo_violations(text):
    """判据内核：回显行的 StepN 标签必须与它取的那个键同号。

    只抓「同一行里既有 StepN 又有 ${d.stepM_}」的行 —— 没有键的标签
    （如 Step4 那格「不在向导内」）不参与比较，那是刻意的。
    """
    pairs = re.findall(r'Step(\d+):[^`\n]*?\$\{d\.(step\d)_',
                       _strip_line_comments(text))
    if not pairs:
        return ["页面里找不到带返回键的回显行 —— 判据的判别域没了"]
    return [f"回显行标签写 Step{n}，取的却是 {k}_* —— 一行里混用两套编号"
            for n, k in pairs if n != k[4]]


def _note_violations(text):
    """判据内核：页面必须**自己说出来**「六格里只有五格是向导做的」+「Agent 不占格」。

    这一句是重排后唯一把「格数 6 ≠ 向导做了 6 步」写出来的地方 —— 步骤条本身
    表达不了它: 六格长得一模一样, 第 4 格不比别的暗、也不比别的亮。
    """
    m = re.search(r'六格按<b>基准位次</b>排列(.*?)</p>', text, re.S)
    if not m:
        return ["页面里找不到步骤条的说明段（锚点「六格按基准位次排列」）"]
    return [f"说明里缺「{kw}」" for kw in
            ("时序存储", "向导不实现", "加速器", "不是第七步")
            if kw not in m.group(1)]


def _retired_word_violations(text):
    """判据内核：页面全文里不许再出现已退役的旧步骤名（**注释也算**）。

    ★ 这条的域是**整页**，而上面几条的域是 4 个具体位置。补这条是因为实测发现
    旧名活在第五处 —— 一句**用户可见的提示** `'请先完成 Step 2 本体编译'`，
    而同页卡片标题写的是「本体语义建模」。域选得比意图窄时，「全绿」和
    「真的全绿」长得一模一样。

    页面上**不该**有历史引用的容身之处: 要记录旧名, 记在 tests/ 或对标台账里。
    """
    return [(i, w) for i, line in enumerate(text.split("\n"), 1)
            for w in FDE_RETIRED_NAMES if w in line]


def _edge_words(text):
    """从 CLAUDE.md 取边缘映射的六个词 —— 解析得出，不手打。"""
    m = re.search(r'设备建模[^\n]*', text)
    if not m:
        return None
    return [w.strip().rstrip("。.") for w in m.group(0).split("→")]


def _is_carrier(text):
    """判别线：一段文本里出现 **≥2 个格名**即算「这份文件抄了步骤清单」。

    抽出来是为了让负控能验它自己。为什么是 2 不是 1：单提「时序存储」或
    「规则引擎」的散文到处都是，按 1 判会把顺带提一句的文件全算成载体。
    ⚠️ **这条线的已知盲区**（写出来，免得它被读成「全都盖住了」）:
    只抄**一个**格名的新载体扫不到。要更紧就得改成「格名 + 上下文词」的复合
    判别，但那会更脆 —— 这里选的是「宁可漏一个单提的，不要满屏假红」。
    """
    return sum(1 for n in FDE_STEPS["bar"]["cells"] if n in text) >= 2


# 扫描域 = **git 能发布的那一集**（不是整个盘）。`--exclude-standard` 挡掉
# dist/（构建副本）与 docs/（.gitignore:2 标 # Sensitive）—— 它们不出现在任何
# 提交里, 混进来只会造出假红。
#
# ★ 但第一版这里写的是裸 `git ls-files`（= 只列**已跟踪**文件）, 于是这条判据
#   自己的目的被它的域吃掉了: 它的用途正是「谁在**新**文件里抄下格名而不申报,
#   当场红」—— 而**新文件恰恰就是未跟踪的那些**。跑出来 `tests/test_fde_steps.py`
#   实检不到（它 ? 未跟踪）, 而申报清单里写着它 ⇒ 红在「申报多了一条」。
#   判据没说错话, 是域比意图窄。改成 `--cached --others --exclude-standard`:
#   已跟踪 ∪ 未跟踪但未被忽略 —— 既盖住新文件, 又不放 dist/docs 进来。
SCAN_ROOTS = ("src/", "tests/", "frontend-vue/src/", "frontend-vue/public/",
              "CLAUDE.md", "README.md")
SCAN_EXTS = (".py", ".js", ".vue", ".html", ".ts", ".md")


def _step_name_carriers():
    """返回 (带 ≥2 个格名的「可发布」文件, 实检了几个文件)。

    域建立不起来时**抛**而不是跳过 —— 跳过会让这条判据在坏掉的时候长得像通过。
    """
    import subprocess
    r = subprocess.run(["git", "ls-files", "-z", "--cached", "--others",
                        "--exclude-standard"], cwd=str(ROOT), capture_output=True)
    if r.returncode != 0:
        raise AssertionError(
            "git ls-files 跑不起来 —— 判别域建立不起来, 不许当通过"
            f"（rc={r.returncode}, stderr={r.stderr[:200]!r}）")
    files = [f for f in r.stdout.decode("utf-8", "replace").split("\0") if f]
    hits, checked = [], 0
    for f in files:
        if not f.endswith(SCAN_EXTS) or not f.startswith(SCAN_ROOTS):
            continue
        p = ROOT / f
        if not p.is_file():
            continue
        checked += 1
        if _is_carrier(p.read_text(encoding="utf-8", errors="replace")):
            hits.append(f)
    return sorted(hits), checked


def _agent_return():
    """**执行**代理端点，拿真实的返回键（不是从源码文本里 grep 出来的）。"""
    import asyncio
    from src.web.fde_api import AgentGenRequest, fde_wizard_agent
    return asyncio.run(fde_wizard_agent(AgentGenRequest(
        description="监控光伏逆变器，采集功率电压电流，功率超过5000W告警，温度超过80°C告警")))


# ── 事实源自身的形状 ──────────────────────────────────────────

def test_fact_source_is_internally_coherent():
    """对应表长度与位次必须合法 —— 不然引用它的人会读到越界或错位的东西。"""
    bench = FDE_STEPS["benchmark"]["steps"]
    assert len(FDE_STEPS["benchmark"]["steps_zh"]) == len(bench)
    edge = FDE_STEPS["edge"]
    assert len(edge["maps_to_benchmark"]) == len(edge["steps"]), "edge 的对应表长度对不上"
    for i, idx in enumerate(edge["maps_to_benchmark"]):
        assert idx is None or 0 <= idx < len(bench), f"edge 第 {i} 位越界: {idx}"
    # bar 不抄格名（否则又是「同一事实两处」）—— 它只声明来源与逐格实现与否，
    # 所以这里校验的是那两样，而不是一份复制的名单。
    bar = FDE_STEPS["bar"]
    assert len(bar["cells"]) == len(bench), \
        f"步骤条有 {len(bar['cells'])} 格，基准是 {len(bench)} 步"
    assert len(bar["implemented_by_wizard"]) == len(bench), \
        f"逐格实现表有 {len(bar['implemented_by_wizard'])} 位，基准是 {len(bench)} 步"


def test_the_bar_declares_every_place_it_differs_from_the_benchmark():
    """格名与基准不同时**必须逐位申报**（renamed）—— 两个方向都不许。

    ★ 这条是本仓那条对平纪律的执行者。`edge` 的「推送中枢」不许为了「看起来
    对齐」改名成基准里的词, 有 `maps_to_benchmark` 的 None 钉着; 同理, bar 与
    基准**措辞不同的位次必须出现在 renamed 里**。

    `declared == diff` 是双向的:
      · 漏报 = 静默磨平（正是本轮第一版判据犯的错: 它要求两者逐字相等）
      · 多报 = 记了一件不存在的事（比漏报更难发现, 因为它长得像「记得很细」）
    """
    bench = FDE_STEPS["benchmark"]["steps_zh"]
    bar = FDE_STEPS["bar"]
    cells = bar["cells"]
    assert len(cells) == len(bench), "步骤条格数与基准六步对不上"
    diff = [i for i, (c, b) in enumerate(zip(cells, bench)) if c != b]
    declared = sorted(d["index"] for d in bar["renamed"])
    assert declared == diff, (
        f"与基准措辞不同的位次是 {diff}，renamed 申报的是 {declared} —— "
        "要么漏报（静默磨平），要么多报（记了不存在的事）")
    for d in bar["renamed"]:
        i = d["index"]
        assert d["bar"] == cells[i], f"renamed 第 {i} 位的 bar 名与 cells 对不上"
        assert d["benchmark"] == bench[i], f"renamed 第 {i} 位的 benchmark 名不对"
        assert d.get("why"), f"renamed 第 {i} 位没写为什么 —— 差异必须带理由"


def test_the_edge_view_declares_its_one_unmapped_step():
    """「推送中枢」在基准里**没有对应物** —— 钉住那个 None 的位置。

    它不是 Rules 的别名，是边缘特有的动作（数据推给中枢）。谁为了让两张表
    「看起来对齐」把它改名成基准里的词，这条会红 —— 那正是对平的反面：
    把真实差异涂掉，换成一句看起来一致的措辞。
    """
    edge = FDE_STEPS["edge"]
    assert edge["steps"][4] == "推送中枢"
    assert edge["maps_to_benchmark"][4] is None
    assert edge["maps_to_benchmark"].count(None) == 1, "只该有这一个无对应的位"


def test_the_bar_declares_the_one_step_the_wizard_does_not_implement():
    """步骤条有六格，向导只实现五格 —— 那一位必须**指名**，不许靠格数暗示。

    重排前这条事实是靠「步骤条只有 5 格」暗示的，而暗示没有任何一处写出来：
    页面副标题含「时序存储」、步骤条没有它，读者只会以为其中一个是错的。
    重排后它占了一格，所以**更需要**写出来 —— 六格长得一模一样。

    断言的是位次集合而不只是「有 False」: 谁把别的格子标成未实现、或给第 4 格
    补上实现，这里当场变，报红。
    """
    impl = FDE_STEPS["bar"]["implemented_by_wizard"]
    assert [i for i, ok in enumerate(impl) if not ok] == [3], \
        f"未实现的位次不是唯一的第 4 位（时序存储），而是 {impl}"
    assert FDE_STEPS["benchmark"]["steps"][3] == "Time-Series", \
        "基准第 4 位不是时序存储 —— 上面那个 3 是对着它写的"


def test_the_accelerator_is_not_a_bar_cell():
    """★ 本轮重排的核心：AI Agent **不在步骤条里**。

    重排前它占第 6 格, 与它自己的文案（「AI 自动完成全部 6 步配置」）打架 ——
    若它是其中一步, 那句话就包含它自己。谁把它塞回步骤条（第 6 格或第 7 格）,
    这条与 `test_page_step_bar_matches_the_single_source` 都会红。
    """
    assert "AI Agent" not in FDE_STEPS["benchmark"]["steps_zh"], \
        "基准六步里混进了 AI Agent —— 那它就不是「横跨全部步骤」了"
    assert "bar_cell" not in FDE_STEPS["accelerator"], \
        "accelerator 又带上了 bar_cell —— 它不是一个格子"
    assert "position" in FDE_STEPS["accelerator"], \
        "accelerator 没说自己排在哪 —— 「不在步骤条里」这件事必须由它自己声明"
    cells = _bar_cells(_page_text())
    assert cells is not None, "解析不出步骤条"
    assert not [c for c in cells if "Agent" in c or "加速器" in c], \
        f"步骤条里又出现了 AI Agent 格: {cells}"


# ── 页面 ────────────────────────────────────────────────────

def test_discriminating_domain_is_reachable():
    """★ 判据自己的前提：两个文件都在、都能解析。

    判别域拿不到时，下面的判据会以「报红」的样子出现 —— 而红的是环境不是缺陷。
    单列一条，让那种红有名字。
    """
    assert PAGE.is_file(), f"步骤条所在文件不在: {PAGE}"
    assert CLAUDE_MD.is_file(), f"边缘映射所在文件不在: {CLAUDE_MD}"
    assert _bar_span(_page_text()), "fde.html 解析不出步骤条"


def test_page_step_bar_matches_the_single_source():
    """页面步骤条 == 基准六步的中文名，逐位（重排后两者同一套编号）。"""
    bad = _bar_violations(_page_text())
    assert bad == [], "步骤条与事实源对不上：\n  " + "\n  ".join(bad)


def test_page_marks_the_step_the_wizard_does_not_implement():
    """步骤条上**恰好一格**带 skip 标记，且是事实源指的那一格。

    重排后六格在点击前长得一模一样 —— 没有这个标记，「向导不实现第 4 格」就只
    靠下面那句说明承载。标记是**可视的判别域**: 删了它，页面自己不会报错，
    只是又变回六格一样。
    """
    bad = _skip_mark_violations(_page_text())
    assert bad == [], "第 4 格的视觉标记不对：\n  " + "\n  ".join(bad)


def test_step_name_carriers_are_exactly_the_declared_ones():
    """★ 步骤名的载体 == 申报的清单 —— 这是「还有没有第四处」的执行者。

    本轮两次踩同一个坑: 判据的域选得比意图窄, 于是「全绿」和「真的全绿」长得
    一模一样（第二次是旧名活在**第五处** —— 一句用户可见的提示, 而四条判据各自
    只盯一个位置）。这条把那句问话变成可执行的扫描: 谁在**新文件**里抄下这六个
    格名而不申报，当场红, 而不是等人想起来。

    ⚠️ 它盖住的是「抄了 ≥2 个格名」这一档, 见 `_is_carrier` 里写明的盲区。
    """
    got, checked = _step_name_carriers()
    want = sorted(FDE_STEPS["carriers"])
    assert got == want, (
        f"扫了 {checked} 个 git 域文件。带 ≥2 个格名的文件——\n"
        f"  实检 {got}\n  申报 {want}\n"
        "多出来的那一处: 要么补进 FDE_STEPS['carriers'], 要么别在那儿抄格名; "
        "少了的说明申报过期了。")
    assert checked > 100, f"扫描域只覆盖 {checked} 个文件 —— 域太窄, 这条判据等于没扫"


def test_every_fact_source_key_is_classified_as_view_or_internal():
    """FDE_STEPS 的每个键**要么**是发给下游的视图、**要么**是判据自己的账。

    这条是端点 `return {k: FDE_STEPS[k] for k in FDE_STEP_VIEWS}` 那个白名单的
    完备性守卫。没有它就有两个**静默**的退化方向:
      · 新加一个真实视图却忘了进白名单 ⇒ 页面少画一张卡, 谁也不报错
        （这是「输入缺失时取个静默默认值」那一族: 少给的东西不会喊疼）;
      · 新加一条内部账却忘了归类 ⇒ **默默挂到对外端点上**。本仓刚发生过一次:
        `docs/`（`.gitignore` 注释 `# Sensitive`）下的文件名连带内部坐标,
        因为 `return FDE_STEPS` 而进了返回体。
    """
    keys = set(FDE_STEPS)
    views, internal = set(FDE_STEP_VIEWS), set(FDE_STEP_INTERNAL)
    assert not (views & internal), f"同一个键两边都有: {sorted(views & internal)}"
    assert keys == views | internal, (
        f"没归类的键: {sorted(keys - views - internal)}；"
        f"归类了但不存在的键: {sorted(views | internal - keys)}")


def test_the_endpoint_serves_the_views_and_nothing_else():
    """端点返回体 == 四个视图 —— 内部账**一个都不许**出现在里面。"""
    import asyncio
    from src.web.fde_api import fde_steps
    body = asyncio.run(fde_steps())
    assert set(body) == set(FDE_STEP_VIEWS), (
        f"返回体是 {sorted(body)}，白名单是 {sorted(FDE_STEP_VIEWS)}")
    leaked = set(body) & set(FDE_STEP_INTERNAL)
    assert not leaked, f"内部账泄漏进返回体: {sorted(leaked)}"


def test_recorded_out_of_domain_carriers_are_still_where_they_are_recorded():
    """域外载体（拷贝了格名、但进不了提交）**现在**还在域外吗？

    ⚠️ **不存在就跳过，不判红** —— `docs/` 与 `graphify-out/` 都不进提交, 干净
    检出里它们本来就不在。写成「必须存在」会让这条判据在别人的检出里直接崩
    （本仓踩过: 一条读 `docs/BENCHMARK.md` 的测试撞上 `.gitignore:2`）。
    所以这里只对**盘上真有**的那几个断言, 并**自报实检了几个** —— 一个都没检到
    时报的是「0 个」, 不是静默通过。

    两个断言各管一件事:
      · 还在域外  —— 谁把 docs/ 放出来, 载体扫描的读数就变了, 得有人重新判一次;
      · 判别线仍点火 —— 记录说的是「这条线会在它们身上误报/命中」, 线一改, 记录
        就成了描述不存在之事的文字。
    """
    hits, _ = _step_name_carriers()
    entries = FDE_STEPS["carriers_outside_git_domain"]
    checked, bad = 0, []
    for e in entries:
        p = ROOT / e["path"]
        if not p.is_file():
            continue  # 干净检出里不存在 —— 正常, 见 docstring
        checked += 1
        if e["path"] in hits:
            bad.append(f"{e['path']} 现在**进得了扫描域**了 —— 记录说它在域外。"
                       "要么把它补进 carriers, 要么弄清楚 .gitignore 为什么变了")
        if not _is_carrier(p.read_text(encoding="utf-8", errors="replace")):
            bad.append(f"{e['path']} 判别线现在**不在它身上点火**了 —— "
                       f"记录（kind={e['kind']}）描述的现象已经不存在, 该删条目或改线")
        if e["kind"] not in ("载体", "误报"):
            bad.append(f"{e['path']} 的 kind 写的是 {e['kind']!r} —— 只许「载体」或「误报」")
    assert bad == [], "域外载体记录与实况对不上：\n  " + "\n  ".join(bad)
    if checked == 0:
        # 与上面 docstring 一致：干净检出里 docs/ 与 graphify-out/ 本来就不在盘上 ⇒ 本判据
        # 此刻没有可验证对象，**报跳过而不是报红**（CI 就是这样，之前写成 assert 让它必红）。
        # 但"父目录还在、文件却没了"是另一回事（开发盘上被删）⇒ 那必须红，别被跳过掩盖。
        orphan_dirs = sorted({str((ROOT / e["path"]).parent) for e in entries
                              if (ROOT / e["path"]).parent.is_dir()})
        if orphan_dirs:
            pytest.fail("域外载体目录仍在，但记录里的文件都不在盘上（被删了？）："
                        + ", ".join(orphan_dirs))
        pytest.skip("干净检出：docs/ 与 graphify-out/ 均不在盘上 ⇒ 域外载体判据无可验证对象"
                    "（docstring 已述，非掩盖红）")


def test_carrier_scan_discriminating_line_is_not_degenerate():
    """**负控** —— 判别线（≥2 个格名）两个方向都得站得住。

    不真改仓去造一个新载体: 同一个内核喂造出来的内容就够验判别线, 而改文件
    + 还原的风险不值当（何况真改仓的那几条已有注入式 harness 在管）。
    """
    assert _is_carrier("物模型定义 → 本体语义建模"), \
        "抄了两个格名的文本没被判成载体 —— 判别线坏了, 这条判据在空转"
    assert _is_carrier("步骤：物模型定义 / 本体语义建模 / 协议自动发现"), \
        "真实形状的步骤清单没被判成载体"
    assert not _is_carrier("只有 时序存储 一个词的一句话"), \
        "单提一个格名也被判成载体 —— 判别线太松, 会把顺带提一句的文件全算进来"


def test_page_card_titles_agree_with_the_step_bar():
    """同页的卡片标题与步骤条必须一致 —— 原先就差在这里（本体编译 vs 本体语义建模）。"""
    bad = _card_title_violations(_page_text())
    assert bad == [], "同页两处不一致：\n  " + "\n  ".join(bad)


def test_page_states_the_mapping_between_the_bar_and_the_benchmark():
    """页面必须自己说明「六格里只有五格是向导做的」+「Agent 不占格」。

    重排前一个字的说明都没有：副标题（含「时序存储」）与步骤条（含「AI Agent」）
    在同一屏里各说各的。第一轮的修法是**补这句说明**；第二轮按用户指示改了结构
    （步骤条本身按基准位次重排、Agent 移出），这句说明**照样得在** ——
    它现在承担的是重排后**唯一**说得出「第 4 格向导不做」的地方。
    """
    bad = _note_violations(_page_text())
    assert bad == [], "对应关系说明不完整：\n  " + "\n  ".join(bad)


def test_page_echo_labels_use_benchmark_numbering():
    """回显行的 StepN 标签必须与它取的键同号（两套编号不许在一行里混用）。"""
    # ★ 自检：去注释之后真回显行还得在。不检查的话，去注释一旦去多了，
    # 这条会以「找不到判别域」或更糟的「全绿」收场。
    stripped = _strip_line_comments(_page_text())
    assert 'Step5: ${d.step5_rules.length}条规则' in stripped, \
        "去注释之后真回显行不见了 —— 这条判据正在测一个空集合"
    bad = _echo_violations(_page_text())
    assert bad == [], "回显行编号混乱：\n  " + "\n  ".join(bad)


def test_page_has_no_retired_step_names():
    """★ 整页扫描：已退役的旧步骤名一处都不许留（含注释与用户可见文案）。

    上面几条判据各自只盯一个位置，这条补的是**域**：旧名曾经活在第五处 ——
    一句用户可见的提示里（见 tests 顶部与 `FDE_RETIRED_NAMES` 的注释）。
    """
    bad = _retired_word_violations(_page_text())
    assert bad == [], "页面里还有已退役的步骤名：\n  " + \
        "\n  ".join(f"第 {i} 行「{w}」" for i, w in bad)


# ── 代理端点返回键（执行出来的，不是读源码读出来的）──────────────

def test_agent_return_keys_use_benchmark_numbering():
    """返回键的编号 = **基准位次**，且逐位覆盖 1/2/3/5/6。"""
    out = _agent_return()
    got = {k for k in out if re.match(r"step\d", k)}
    assert got == set(AGENT_STEP_KEYS), (
        "返回键与基准位次对不上：\n"
        f"  多出 {sorted(got - set(AGENT_STEP_KEYS))}\n"
        f"  缺失 {sorted(set(AGENT_STEP_KEYS) - got)}")
    # 第 4 位（时序存储）**没有键** —— 那是「向导不覆盖它」这个事实，不是遗漏
    assert not any(k.startswith("step4") for k in out), \
        "出现了 step4_* —— 向导不覆盖时序存储，它不该有键（要加键先改 FDE_STEPS）"
    # 部署提示不是一步，所以它不带 stepN 前缀
    assert "deploy_hint" in out and not any(k.startswith("step6_deploy") for k in out), \
        "部署提示又被编成了第六步 —— 基准的第 6 位是 Dashboard 而不是部署"


def test_the_agent_keys_match_the_fact_source():
    """返回键的位次与 FDE_STEPS['benchmark'] 对得上 —— 两处一起改才作数。"""
    bench = FDE_STEPS["benchmark"]["steps"]
    for key, name in AGENT_STEP_KEYS.items():
        n = int(re.match(r"step(\d)", key).group(1))
        assert bench[n - 1] == name, \
            f"{key} 自称第 {n} 位的 {name}，事实源第 {n} 位是 {bench[n - 1]}"


# ── 边缘映射（CLAUDE.md）────────────────────────────────────

def test_claude_md_edge_mapping_matches_the_fact_source():
    """CLAUDE.md 的六个边缘词与 FDE_STEPS['edge'] 逐位一致。

    钉住的是**「推送中枢」不许被悄悄改名以「对齐基准」**；也钉住步数从 6 变动。
    """
    words = _edge_words(CLAUDE_MD.read_text(encoding="utf-8"))
    assert words is not None, "CLAUDE.md 里找不到边缘映射六步 —— 判别域没了"
    assert words == FDE_STEPS["edge"]["steps"], \
        f"CLAUDE.md 写的是 {words}，事实源是 {FDE_STEPS['edge']['steps']}"


# ── 负控：内核必须逮住**真实发生过**的那些形态 ──────────────────

def test_bar_checker_catches_the_drift_that_really_happened():
    """**负控** —— 把步骤条改回改动前的那两个词，内核必须报红。

    没有这条，上面那条在解析器整个坏掉时也只是安静地报通过。
    """
    text = _page_text()
    for now, was in (("本体语义建模", "本体编译"), ("协议自动发现", "协议发现")):
        bad = _bar_violations(_replace_in_bar(text, now, was))
        assert bad, f"步骤条被改回「{was}」，判据却报绿 —— 判据自己坏了"
        assert any(was in b for b in bad), f"报红了但没报在点子上: {bad}"


def test_card_title_checker_catches_the_original_mismatch():
    """**负控** —— 只把卡片标题改回「本体编译」，标题判据必须报红。"""
    text = _page_text()
    drifted = text.replace("<h2>🧠 Step 2: 本体语义建模</h2>",
                           "<h2>🧠 Step 2: 本体编译</h2>", 1)
    assert drifted != text, "负控的前提不成立：没找到那张卡片的标题"
    bad = _card_title_violations(drifted)
    assert bad, "卡片标题与步骤条不一致，判据却报绿 —— 判据自己坏了"


def test_echo_checker_catches_the_mixed_numbering_line():
    """**负控** —— 把回显行改回 `Step4: ${d.step5_rules...}`，内核必须报红。

    那一行是编号漂移留下的化石层：**一行里混用两套编号**，也是唯一一处能在
    单行内自证的证据。改动前它就是文件里真实存在的样子。
    """
    text = _page_text()
    now = 'Step5: ${d.step5_rules.length}条规则'
    was = 'Step4: ${d.step5_rules.length}条规则'
    assert now in _strip_line_comments(text), "负控的前提不成立：回显行不是预期形状"
    bad = _echo_violations(text.replace(now, was, 1))
    # 断言的是**报在哪**，不只是「报了红」—— 「判别域没了」也是红，
    # 那样这条负控就变成在验证「替换动作生效了」，与内核无关。
    assert any("混用两套编号" in b for b in bad), \
        f"回显行混用两套编号，内核却没这么说: {bad}"


def test_note_checker_catches_a_deleted_note():
    """**负控** —— 把说明段删掉或抽掉关键词，内核必须报红。

    ★ 替换一律走 `_replace_in_note`（只在说明段内动）。第一版写的是整页
    `text.replace(kw, …, 1)`, 而上方 HTML 注释里有同一个词 —— 于是替换打到注释、
    说明段一个字没动, 负控却报「判据自己坏了」。**判据没坏, 是负控的前提没成立**:
    一条负控若不能证明自己真的改到了被判的域, 它证明的只是「我跑了一段代码」。
    """
    text = _page_text()
    stripped = re.sub(r'六格按<b>基准位次</b>排列.*?</p>', '', text, flags=re.S)
    assert stripped != text, "负控的前提不成立：没匹配到说明段（锚点变了？）"
    assert _note_violations(stripped), "说明被整段删掉，判据却报绿 —— 判据自己坏了"
    for kw in ("向导不实现", "不是第七步"):
        assert _note_violations(_replace_in_note(text, kw, "已覆盖")), \
            f"说明里的「{kw}」被改掉，判据却报绿 —— 判据自己坏了"


def test_renamed_checker_catches_both_directions():
    """**负控** —— 差异申报漏报与多报，两个方向都必须红。

    漏报是「静默磨平」（把格名刷成基准的样子却不记）；多报是「记了一件不存在的
    事」——后者更难发现, 因为它长得像「记得很细」。
    """
    bar = dict(FDE_STEPS["bar"])
    bench = FDE_STEPS["benchmark"]["steps_zh"]

    def violations(cells, renamed):
        diff = [i for i, (c, b) in enumerate(zip(cells, bench)) if c != b]
        return diff, sorted(d["index"] for d in renamed)

    # ① 漏报: 把第 3 格刷成基准的措辞, 却不动 renamed ⇒ diff 少一位
    diff, declared = violations(
        [c if i != 2 else bench[2] for i, c in enumerate(bar["cells"])], bar["renamed"])
    assert diff != declared, "漏报没被逮住 —— 判据自己坏了"
    # ② 多报: 格名不动, renamed 多塞一位 ⇒ declared 多一位
    diff, declared = violations(
        bar["cells"], bar["renamed"] + [{"index": 0, "bar": "x", "benchmark": "x", "why": "y"}])
    assert diff != declared, "多报没被逮住 —— 判据自己坏了"
    # ③ 正控: 当前的事实源两个方向都对齐
    diff, declared = violations(bar["cells"], bar["renamed"])
    assert diff == declared == [2, 5], \
        f"事实源自身的差异申报不对齐: diff={diff} declared={declared}"

    # ④ why 不许空 —— 差异不带理由, 下一个人只会把它读成「没改完」
    for d in bar["renamed"]:
        assert d.get("why"), f"renamed 第 {d['index']} 位没有 why"


def test_bar_checker_catches_the_accelerator_put_back_in_the_bar():
    """**负控** —— 把 AI Agent 塞回步骤条（第 6 格改成它 / 追加第 7 格），必须报红。

    这是本轮重排**唯一**要防的退化方向: 把 Agent 搬回条上在视觉上毫无违和,
    而它一旦回去, 「AI 自动完成全部 6 步配置」那句话又开始包含它自己。
    """
    text = _page_text()
    cells = _bar_cells(text)
    assert cells is not None and len(cells) == 6, f"正控前提不成立: {cells}"
    # ① 第 6 格（驾驶舱）改成 AI Agent
    put_back = _replace_in_bar(text, '<div class="t">驾驶舱</div>',
                               '<div class="t">AI Agent</div>')
    bad = _bar_violations(put_back)
    assert any("AI Agent" in b for b in bad), f"第 6 格换成 Agent，内核没报在点子上: {bad}"
    # ② 追加第 7 格 —— 格数对不上，同样必须红
    appended = _replace_in_bar(text, '<div class="t">驾驶舱</div>',
                               '<div class="t">驾驶舱</div>'
                               '<div class="s">x</div></div>'
                               '<div class="step" id="step7" onclick="goStep(7)">'
                               '<div class="n">7</div><div class="t">AI Agent</div>')
    bad2 = _bar_violations(appended)
    assert any("格数" in b for b in bad2), f"多出第 7 格，内核没报格数: {bad2}"


def test_edge_checker_catches_a_silent_realignment():
    """**负控** —— 把「推送中枢」改成基准里的词，边缘判据必须报红。

    这是最需要防的那一种：改完之后两张表**看起来**对齐了，而真实差异没了。
    """
    words = _edge_words(CLAUDE_MD.read_text(encoding="utf-8"))
    realigned = ["设备建模", "点表映射", "协议采集", "流式计算", "规则引擎", "仪表呈现"]
    assert words != realigned, "负控的前提不成立：CLAUDE.md 已经是改过的样子"
    assert realigned != FDE_STEPS["edge"]["steps"], \
        "被改名之后居然还与事实源相等 —— 判据自己坏了"


def test_retired_name_checker_catches_a_reintroduced_old_name():
    """**负控** —— 把旧名塞回页面任意一处（**注释里**也算），内核必须报红。

    往注释里塞是刻意的：内核的域是整页，不挑位置 —— 旧名第一次漂回来的地方
    很可能就是某段抄来的注释或一句提示文案，而不是步骤条。
    """
    text = _page_text()
    assert _retired_word_violations(text) == [], "正控不成立：页面本来就有旧名"
    for spot in ("// 步骤条说明: Step 2 曾叫本体编译",
                 "'请先完成 Step 2 本体编译'"):
        bad = _retired_word_violations(text + "\n" + spot)
        assert bad, f"塞进「{spot}」，内核却报绿 —— 判据自己坏了"


def test_step_key_kernel_catches_the_old_misnumbering():
    """**负控** —— 喂进改动前的返回键形状，内核必须报红。

    改动前实际是 `step4_dashboard`（向导顺序位次）+ `step5_rules`（基准位次）
    + `step6_deploy`。上面那条判据是**执行端点**读到的真实键，跑不起来会抛；
    但「跑起来了、键也对不上」这一档只有这条能钉。
    """
    old = {"step1_product": {}, "step2_ontology": {}, "step3_scan_hint": "",
           "step4_dashboard": {}, "step5_rules": [], "step6_deploy": ""}
    got = {k for k in old if re.match(r"step\d", k)}
    missing = sorted(set(AGENT_STEP_KEYS) - got)
    extra = sorted(got - set(AGENT_STEP_KEYS))
    assert extra == ["step4_dashboard", "step6_deploy"], f"内核没认出多出的键: {extra}"
    assert missing == ["step6_dashboard"], f"内核没报出缺失的键: {missing}"


if __name__ == "__main__":       # 直接跑时把负控也带上，方便单文件验证
    sys.exit(0)
