# ============================================================
# 本体图谱视图 — 规模数字与样例边界的执行者
# ============================================================
"""这份页面的两个数字，原先手抄在四处，**没有一处有执行者**。

2026-09-16 起本页的定位变了：**它不再承载真实图谱**。
原先内嵌的是一份**真实项目/客户关系盘（客情）**，
按 `D:\\ai\\CLAUDE.md` 硬纪律第 5 条「客情（关系线/评分/盘）只存刘守信/，
案例（可展示成果）才进对外材料」，它不该出现在公开仓。
真身已移入私仓：`刘守信/10资产/dgiot_team_system/evidence/ontology_graph_v3.json`
（三个版本的出处与 md5 见同目录 `README_本体图谱v3.md`）。
公开面留下的是**行业占位样例**（16 节点 / 13 边，项目与客户标签一律「示例 ·」前缀）。

⚠️ 本注**刻意不写原图的节点数/项目数/客户数**：那是私料的形状，
写上就等于把刚移走的东西的摘要留在明处（本仓在「解释为什么不能说 X」那句上翻过车）。

于是本文件的判据只对样例负责，分两类：

  ① 样例自洽 —— 防止有人手改样例把渲染改坏
     · `G.meta` ↔ 数组实际长度（自报与实际上对不上，页面就在讲两个规模）
     · 副标题 ↔ `G.meta`（**同一文件里的第二份副本**，改一处不动另一处）
     · 边不悬空、五种节点类型都真被用上
  ② 对外一致
     · `BASE_PLUGINS.md` / `BASE_PLUGINS_EN.md` 的规模数字 = 实测（对外数字必须可追溯）
     · 服务的 `view_scale()` 现算 —— **正对照**，算得出且与实测一致
     · 服务源码里不许再出现手抄的规模 —— **结构断言**，后门关着

⚠️ **随数据一起删掉的两条**（原 `KNOWN_ISOLATED_BY_TYPE` 与「分类维整层零连线」）：
它们断言的是**真实图谱的建模形态**（17 个 category 全部零连线、product/tech 各 2 个孤立）——
那是私料的形状，留在公开仓等于把私料的一块摆在明处；而它们对样例毫无意义
（样例是人写的，不存在「缺口」这一说）。
记录已随数据移入私仓 README，**此处不重建**：判据得指到它该管的那份数据，
指向样例就是一条永远绿灯的装饰。

写法遵循本仓纪律：**跳过必计入 unchecked 并报红**（这里没有 skip —— 文件不在就是失败），
且**正对照与负断言同时在场**（只断言「文档里有数」的话，写成任意数都能通过）。
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
# 就等于给「12 节点 34 边」「12 节点，34 边」开了后门 —— 判别域收窄的代价是
# 域外的同类事实天然免检（报绿是真的，只是管不着）。
ZH_SCALE = re.compile(r"(\d+)\s*节点\s*[·/]?\s*(\d+)\s*边")
EN_SCALE = re.compile(r"(\d+)\s*nodes?\s*[·/]?\s*(\d+)\s*edges?")

# 规模数字的另外两处落点（对外文档）
DOC_ZH = ROOT / "BASE_PLUGINS.md"
DOC_EN = ROOT / "BASE_PLUGINS_EN.md"


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
    """**同一个文件里的第二份副本** —— 手写副标题，没有任何 JS 覆写它。

    它和 `G.meta` 是同一事实的两处落点，改一处不会动另一处。
    """
    html = VIEW.read_text(encoding="utf-8")
    m = ZH_SCALE.search(html)
    assert m, "副标题没匹配上 —— 先核字形，再判断是不是被删了"
    g = _graph()
    assert (int(m.group(1)), int(m.group(2))) == _scale(g), \
        f"副标题写 {m.group(1)}/{m.group(2)}，meta 说 {_scale(g)}"


def test_no_dangling_edges():
    """边指向不存在的节点 = 图坏了。本条同时是后面统计的前提。"""
    g = _graph()
    ids = {x["id"] for x in g["nodes"]}
    dangling = [e for e in g["edges"] if e["from"] not in ids or e["to"] not in ids]
    assert not dangling, f"{len(dangling)} 条悬空边: {dangling[:3]}"


def test_every_node_type_is_actually_used():
    """节点类型不许空挂 —— 声明了一类却 0 个实例，是建模层的死代码。"""
    from collections import Counter
    g = _graph()
    c = Counter(x.get("type") for x in g["nodes"])
    assert all(n > 0 for n in c.values()), c
    assert None not in c, "有节点没写 type"


# ── 样例边界（防复发）──

def test_meta_declares_this_is_sample_data():
    """**公开面这份必须是样例，不是真实图谱的导出。**

    私仓的导出管道产出的 `method` 是「语义提取」，样例写的是「示例数据（占位…）」。
    把真实图谱贴回公开仓 —— 无论有意还是复制粘贴 —— 本条会红。

    这是本文件里唯一一条**为「别再贴回来」而设**的判据：
    上面那些自洽判据对一份真实的项目/客户图谱**照样全绿**，
    所以「测试全过」证明不了「这份是样例」。
    """
    method = _graph()["meta"].get("method", "")
    assert "示例" in method or "占位" in method, (
        f"meta.method = {method!r} —— 公开仓这份应当是行业示例数据。\n"
        f"若确要从私仓导入真实图谱：那不是改这一行的事，"
        f"先回看 `D:\\ai\\CLAUDE.md` 硬纪律第 5 条（客情只存刘守信/）。"
    )


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
