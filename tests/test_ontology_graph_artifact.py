# ============================================================
# 本体图谱产物 — 规模数字的执行者
# ============================================================
"""这份图的两个数字，原先手抄在四处，**没有一处有执行者**。

`frontend-vue/public/ontology_graph.html` 是唯一入 git 的事实源（内嵌 `const G = {...}`），
但「90 节点 / 56 边」这句话另外还写在三处：`BASE_PLUGINS.md`、`BASE_PLUGINS_EN.md`、
`scripts/ontology_server.py` 的 docstring。2026-09-14 订正规模数字时改了前两处、
漏了第三处 —— 手抄的数字没有任何东西会报红，所以它能一直错下去。

本文件给**每一处落点各配一个执行者**：

  · 文件内自洽      —— `G.meta` ↔ 数组实际长度
  · 同文件两处副本  —— 手写副标题 ↔ `G.meta`（同一文件里也在各自漂移）
  · 对外文档        —— 两份 .md ↔ 实测（对外数字必须可追溯）
  · 服务的推导      —— **正对照**：服务现算的数与实测一致，否则它也是个装饰
  · 结构断言        —— 服务不再手抄规模（改了源，抄本必然腐烂）

写法遵循本仓纪律：**跳过必计入 unchecked 并报红**（这里没有 skip —— 文件不在就是失败），
且**正对照与负断言同时在场**（只断言「文档里有数」的话，写成任意数都能通过）。

末尾「已知结构缺口」那两条另说：它们是**记录形态，不是提要求**（要不要把分类维接上
是建模决策，不归判据管）。正因为只记录，粒度就更要挑对 —— 断言的是
「**分类维整层零连线**」这个事实，而不是孤立节点的总数。总数守着的是记账：
接上 1 个 category、再添 1 个没接边的 category，总数分毫不动，
而本判据存在的理由恰好被反转（缺口没缩小，反而扩大）—— 报绿是真的，只是管不着。
"""
import json
import re
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
VIEW = ROOT / "frontend-vue" / "public" / "ontology_graph.html"

# 中文用「·」或「/」分隔，英文同理；字形已逐一回源核过（空格与全角/半角差异会让 0 命中
# 冒充「内容丢失」，本仓为此连撞过四次）。
#
# 分隔符写成**可选**：手抄的人不会照着同一个格式抄。要求必须有分隔符，
# 就等于给「90 节点 56 边」「90 节点，56 边」开了后门 —— 判别域收窄的代价是
# 域外的同类事实天然免检（报绿是真的，只是管不着）。
ZH_SCALE = re.compile(r"(\d+)\s*节点\s*[·/]?\s*(\d+)\s*边")
EN_SCALE = re.compile(r"(\d+)\s*nodes?\s*[·/]?\s*(\d+)\s*edges?")

# 规模数字的另外两处落点（对外文档）
DOC_ZH = ROOT / "BASE_PLUGINS.md"
DOC_EN = ROOT / "BASE_PLUGINS_EN.md"

# ── 已知结构缺口（**实测值，不是要求**）──
# 分类维挂在图上却不与任何实体相连：17 个 category 节点全部零连线，
# 按本体方法论属「Step 2 连线成网未完成」。这里记录的是**当前形态** ——
# 哪天真把类别接上，判据应当变红，由人来改。
#
# ⚠️ 上一版这里只钉了一个总数（`KNOWN_ISOLATED = 21`），**数对不等于形态对**：
#    接上 1 个 category、再添 1 个没接边的 category —— 总数仍是 21，
#    而本判据存在的理由恰好被反转了（缺口没缩小，反而扩大）。报绿是真的，只是管不着。
#    粒度决定能反查出多细的缺口，所以拆成「按类型分布」+「分类维整层零连线」两条事实。
KNOWN_ISOLATED_BY_TYPE = {"category": 17, "product": 2, "tech": 2}


def _graph():
    m = re.search(r"^const G = (\{.*\});\s*$", VIEW.read_text(encoding="utf-8"), re.M)
    assert m, f"{VIEW.name} 里没找到 `const G = {{...}}` —— 事实源没了，后面全是空过"
    return json.loads(m.group(1))


def _scale(g):
    return len(g["nodes"]), len(g["edges"])


# ── 事实源自洽 ──

def test_meta_agrees_with_the_arrays():
    """`G.meta` 是自报，数组是实际。自报与实际上对不上，页面就在讲两个规模。"""
    g = _graph()
    n, e = _scale(g)
    assert g["meta"]["nodes"] == n, f"meta 自报 {g['meta']['nodes']} 节点，实际 {n}"
    assert g["meta"]["edges"] == e, f"meta 自报 {g['meta']['edges']} 边，实际 {e}"


def test_subtitle_agrees_with_meta():
    """**同一个文件里的第二份副本** —— 第 17 行的手写副标题，没有任何 JS 覆写它。

    它和 `G.meta` 是同一事实的两处落点，改一处不会动另一处。
    """
    html = VIEW.read_text(encoding="utf-8")
    m = ZH_SCALE.search(html)
    assert m, "副标题没匹配上 —— 先核字形，再判断是不是被删了"
    g = _graph()
    assert (int(m.group(1)), int(m.group(2))) == _scale(g), \
        f"副标题写 {m.group(1)}/{m.group(2)}，meta 说 {_scale(g)}"


def test_no_dangling_edges():
    """边指向不存在的节点 = 图坏了。本条同时是后面连通性统计的前提。"""
    g = _graph()
    ids = {x["id"] for x in g["nodes"]}
    dangling = [e for e in g["edges"] if e["from"] not in ids or e["to"] not in ids]
    assert not dangling, f"{len(dangling)} 条悬空边: {dangling[:3]}"


# ── 对外文档 ──

@pytest.mark.parametrize("path,pat,label", [
    (DOC_ZH, ZH_SCALE, "BASE_PLUGINS.md"),
    (DOC_EN, EN_SCALE, "BASE_PLUGINS_EN.md"),
])
def test_docs_state_the_measured_scale(path, pat, label):
    """对外材料里的数字必须可追溯。

    负断言单独写（`assert m`）不够 —— 所以同时断言**它等于实测**，
    否则文档里写 12/3 也照样通过。
    """
    m = pat.search(path.read_text(encoding="utf-8"))
    assert m, f"{label} 里没找到规模数字 —— 核字形，别把「改写」读成「删除」"
    g = _graph()
    assert (int(m.group(1)), int(m.group(2))) == _scale(g), \
        f"{label} 写 {m.group(1)}/{m.group(2)}，图谱实测 {_scale(g)}"


# ── 服务的推导（正对照）──

def _server():
    if str(ROOT / "scripts") not in sys.path:
        sys.path.insert(0, str(ROOT / "scripts"))
    import ontology_server
    return ontology_server


def test_server_derives_the_same_scale():
    """**正对照** —— 服务的 `view_scale()` 必须算得出数，且与实测一致。

    没有这条，上面那句「要数字问 /health」就只是句承诺：
    服务返回一个和事实源无关的数（或干脆 always None）也没人知道。
    """
    srv = _server()
    assert srv.view_scale(VIEW) == {"nodes": _scale(_graph())[0],
                                    "edges": _scale(_graph())[1]}, \
        "服务推导的规模与事实源不一致"


def test_view_scale_says_unknown_rather_than_guessing(tmp_path):
    """**负对照** —— 不认识的视图要说 `None`，**不许兜底成某个数字**。

    「兜底值比证据强」是上一次的教训：没有证据时返回一个看起来合理的数，
    比明说「不知道」危险得多。
    """
    srv = _server()
    blank = tmp_path / "no_embedded_json.html"
    blank.write_text("<html><body>没有内嵌 G</body></html>", encoding="utf-8")
    assert srv.view_scale(blank) is None
    assert srv.view_scale(tmp_path / "does_not_exist.html") is None


def test_server_does_not_hand_copy_the_scale():
    """**结构断言** —— 服务源码里不许再出现手抄的规模数字。

    上面那条测的是「这一次数对得上」；这条测的是「**后门关着**」：
    下次有人把数字抄回 docstring，就又多一份会腐烂的副本。
    """
    src = (ROOT / "scripts" / "ontology_server.py").read_text(encoding="utf-8")
    hits = ZH_SCALE.findall(src) + EN_SCALE.findall(src)
    assert not hits, f"服务里又出现了手抄的规模: {hits} —— 删除，改为从视图现算"


# ── 已知结构缺口 ──

def _isolated_by_type():
    """孤立 = 零连线，从边的两端数出来，**不读任何自报字段**。"""
    from collections import Counter
    g = _graph()
    deg = Counter()
    for e in g["edges"]:
        deg[e["from"]] += 1
        deg[e["to"]] += 1
    return Counter(x.get("type", "<无>") for x in g["nodes"] if deg[x["id"]] == 0)


def test_category_dimension_is_disconnected_as_a_whole():
    """**断言的是事实本身，不是它的计数** —— 分类维整层零连线。

    17 个类别在图上是一块飞地：看得见、连不上、查不到。按本体方法论这是
    「Step 2 连线成网」未完成。但「要不要接上」属建模决策，不归本判据管。

    为什么不用总数：总数守着的是**记账**，不是这个事实。接上 1 个 category
    再添 1 个没接边的 category，总数分毫不动，而缺口其实扩大了。

    这条写成「整层零连线」则两个方向都守得住：
      · 新增一个没接边的 category → 仍通过（事实没变，还是同一处缺口）
      · 接上任何一个 category     → 变红（缺口被动了，人来看）
    """
    g = _graph()
    cats = [x for x in g["nodes"] if x.get("type") == "category"]
    # 全是零连线时 `all()` 对空列表为真 —— 分类维被删光也会"通过"，故先挡住空集
    assert cats, "一个 category 节点都没有了 —— 分类维被删？空集会让下面那句空过"
    iso = _isolated_by_type()
    assert iso["category"] == len(cats), (
        f"分类维 {len(cats)} 个节点，其中 {iso['category']} 个零连线"
        f"（记录形态是**整层**零连线）。缺口形态变了，由人决定怎么记这一笔。"
    )


def test_isolated_nodes_match_the_recorded_shape():
    """category 以外各层的孤立**分布**与记录一致（是记录，不是提要求）。

    钉分布而非总数，是为了让「接上一个、再添一个」这种总数不变的改动也报红。
    主干层（project / client）若有节点掉进这里，说明建模漏了 Step 2 —— 同样报红。
    """
    got = {k: v for k, v in sorted(_isolated_by_type().items()) if k != "category"}
    want = {k: v for k, v in sorted(KNOWN_ISOLATED_BY_TYPE.items()) if k != "category"}
    assert got == want, (
        f"category 以外的孤立分布变了：记录 {want}，实测 {got}。\n"
        f"变少 = 有人把图上接起来了（好事，改 KNOWN_ISOLATED_BY_TYPE 记这一笔）；\n"
        f"变多 = 新增的实体没接边，回去补 Step 2。"
    )


def test_every_node_type_is_actually_used():
    """节点类型不许空挂 —— 声明了一类却 0 个实例，是建模层的死代码。"""
    from collections import Counter
    g = _graph()
    c = Counter(x.get("type") for x in g["nodes"])
    assert all(n > 0 for n in c.values()), c
    assert None not in c, "有节点没写 type"
