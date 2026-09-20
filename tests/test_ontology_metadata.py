# ============================================================
# 描述项 — GB/T 48000.3 附录A(规范性) 表A.1 八项 / 表A.2 七项
# ============================================================
"""`vocab/desc_ledger.tsv` 与导出图，凭什么是同一件事？

**没有本文件，那份台账就是一份「我声称」。**

表A.1 的 8 个描述项里，3 个 OWL 装不下（名称 / 属性集 / 子类）——
它们落在台账里，于是台账成了**第二个事实源**。第二个事实源唯一的活法，
是有一个东西每轮都把它和第一个（图）对一遍。**本文件就是那个东西。**

判据分五组：

  ① 图侧齐备 —— 8 类 / 29 属性里 OWL 有原生槽位的那几项
  ② 硬约束 —— xsd 值域必须落在表A.3 的 5 类里；对象侧四谓词 + `子类` 格的主语侧必须是本图的类
  ③ 台账与图说同一件事 —— 逐格比对（**台账漂移必须被逮住**）
  ④ 负控 —— 注入缺陷，确认上面几组真的会报红（逮不到 = 判据本身不可信）
  ⑤ 盘口自报 —— 防「判据坏了反而报通过」

**判别域**：本文件覆盖 OWL 有原生槽位的项 + 台账三项的**一致性**。
它**不**证明那三项本身对不对 —— 属性集/子类都由 rdfs:domain / rdfs:subClassOf
派生，图怎么写它就怎么记；图本身的正确性是别的判据的事。
**唯一的例外**是「谁能进台账」这两条边界（都是 `gen_desc_ledger.py` 安全注记的执行者）：
  · **对象侧** —— 域/值域/父类/等价类 的**对象**必须是本图声明过的类；
  · **主语侧** —— 带 `rdfs:subClassOf` 的**主语**必须是本图声明过的类。这一条不能省：
    `子类(表1-7)` 那一格取的是 `g.subjects(RDFS.subClassOf, c)`（**主语**），
    而 `父类(表1-6)` 取的是对象 —— 两者取法相反，对象侧的判据对它一格都不管。
两条都不是「图对不对」，而是「哪些节点有资格进公开仓的台账」。
**`Label` / `Definition` 两格装的是字面量：本文件与生成器都不管它们的取值**（没有执行者）。
"""
import importlib.util
from pathlib import Path

import pytest
from rdflib import Graph, Literal, RDF, RDFS, URIRef, OWL

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "vocab" / "desc_ledger.tsv"
GEN = ROOT / "scripts" / "gen_desc_ledger.py"


def _load_gen():
    """把生成器当模块加载 —— 派生逻辑只许有一份，不在测试里再写一遍。"""
    assert GEN.exists(), f"{GEN} 不存在 —— 事实源没了，后面全是空过"
    spec = importlib.util.spec_from_file_location("gen_desc_ledger", GEN)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture(scope="module")
def gen():
    return _load_gen()


@pytest.fixture(scope="module")
def graph(gen):
    return gen.graph_of()


@pytest.fixture(scope="module")
def derived(gen, graph):
    return gen.derive(graph)


# ── 判据函数（正控与负控调同一份）──

def _class_gaps(gen, g):
    """表A.1 里 OWL 有原生槽位的项：IRI / 名称 / 标签 / 定义 / 父类。"""
    miss = []
    for c in sorted(g.subjects(RDF.type, OWL.Class), key=str):
        name = gen.local(c)
        if name == "Thing":
            continue
        if not str(c).startswith("http"):
            miss.append(f"{name}: 缺 IRI(表A.1 #1)")
        if not name[:1].isupper():
            miss.append(f"{name}: 名称首字母应大写(表A.1 #2)")
        if not list(g.objects(c, RDFS.label)):
            miss.append(f"{name}: 缺 标签(表A.1 #3)")
        if not list(g.objects(c, RDFS.comment)):
            miss.append(f"{name}: 缺 定义(表A.1 #4)")
        if name != "Entity" and not list(g.objects(c, RDFS.subClassOf)):
            miss.append(f"{name}: 缺 父类(表A.1 #6)")
    return miss


def _prop_gaps(gen, g):
    """表A.2 七项里 OWL 有原生槽位的：IRI / 名称 / 标签 / 定义 / 定义域 / 值域 / 属性类型。

    列了七项、只查六项 —— **不是漏写**：「属性类型」在这里**恒真**，因为本函数
    的 props 就是**从** owl:ObjectProperty ∪ owl:DatatypeProperty 取的。
    真正该查的是另一件事：**被用了却没声明类型**的谓语（p 出现在三元组里，
    而 (p, rdf:type, owl:*Property) 不在图里）。它的判别域不同，由仓外检查器
    `check_desc_items.py` 的「属性类型(未声明——该谓语被用了 N 次…)」守着。
    这里**不再写第二份** —— 两份「什么算本体谓语」的定义必然分叉。
    """
    miss = []
    props = sorted(set(g.subjects(RDF.type, OWL.ObjectProperty)) |
                   set(g.subjects(RDF.type, OWL.DatatypeProperty)), key=str)
    for p in props:
        name = gen.local(p)
        if not str(p).startswith("http"):
            miss.append(f"{name}: 缺 IRI(表A.2 #1)")
        if not name[:1].islower():
            miss.append(f"{name}: 名称首字母应小写(表A.2 #2)")
        if not list(g.objects(p, RDFS.label)):
            miss.append(f"{name}: 缺 标签(表A.2 #3)")
        if not list(g.objects(p, RDFS.comment)):
            miss.append(f"{name}: 缺 定义(表A.2 #4)")
        if not list(g.objects(p, RDFS.domain)):
            miss.append(f"{name}: 缺 定义域(表A.2 #5)")
        if not list(g.objects(p, RDFS.range)):
            miss.append(f"{name}: 缺 值域(表A.2 #6)")
    return miss


def _range_gaps(gen, g):
    """表A.3 硬约束：xsd 值域必须落在 5 类里。"""
    miss = []
    for p, _, r in g.triples((None, RDFS.range, None)):
        if "XMLSchema#" not in str(r):
            continue
        pref = "xsd:" + gen.local(r)
        if pref not in gen.ALLOWED_RANGES:
            miss.append(f"{gen.local(p)}: 值域 {pref} 不在表A.3 的 5 类里")
    return miss


# 对象侧的四个谓词 —— 它们的**对象**会进台账的这**四格**（见 gen_desc_ledger.derive）：
# 域(表2-5) / 值域(表2-6) / 父类(表1-6) / 等价类(表1-8)。
# ※ **子类(表1-7) 不在这一组** —— 那一格取 `g.subjects(RDFS.subClassOf, c)`，装的是**主语**，
#   由 `_subject_side_gaps` 守。（把五格一起读成「装对象」正是 N1。）
# 末项 = 负控注入时拿哪一类节点当**主语**（对象属性 / 类），与上面那个「主语」不是一件事。
_OBJ_SIDE_PREDS = (
    (RDFS.range, "值域(表2-6)", "对象属性"),
    (RDFS.domain, "域(表2-5)", "对象属性"),
    (RDFS.subClassOf, "父类(表1-6)", "类"),
    (OWL.equivalentClass, "等价类(表1-8)", "类"),
)


def _object_side_gaps(gen, g):
    """对象侧硬约束：非 xsd 的 域/值域/父类/等价类 对象，必须是**本图声明过的类**。

    为什么需要这一条（`gen_desc_ledger.py` 的安全注记指向这里）：`derive()` 除了主语，
    还**读取值** —— 台账的 域(表2-5)/值域(表2-6)/父类(表1-6)/等价类(表1-8) **四格**
    装的就是这四个谓词的**对象**，而对象可以是**任何节点**（包括个体）。
    `_range_gaps` 只挑 `XMLSchema#` 的载体 ⇒ 一条指向**个体**的 `rdfs:range`
    （例如把某条 ObjectProperty 的值域写成一个现场实体的 IRI）会让那个 id 落进
    公开仓的台账，而**全部既有判据为绿**。

    ※ 第五格 `子类(表1-7)` **不在这里** —— 那一格装的是**主语**，见 `_subject_side_gaps`。
    """
    declared = set(g.subjects(RDF.type, OWL.Class))
    miss = []
    for pred, col, _ in _OBJ_SIDE_PREDS:
        for s, _, o in g.triples((None, pred, None)):
            if "XMLSchema#" in str(o):      # xsd 载体由 _range_gaps 管（表A.3 五类）
                continue
            if o not in declared:
                miss.append(f"{gen.local(s)}: {col} 指向 {gen.local(o)}"
                            "（局部名）—— 它不是本图声明过的类")
    return miss


def _subject_side_gaps(gen, g):
    """`子类(表1-7)` 那一格的执行者：**主语**侧硬约束。

    `derive()`（`gen_desc_ledger.py:109-110`）里这两格的取法是**相反**的：

        "父类(表1-6)": ... g.objects(c, RDFS.subClassOf)     ← 对象
        "子类(表1-7)": ... g.subjects(RDFS.subClassOf, c)    ← 主语

    ⇒ 对象侧那条判据（`_object_side_gaps`）对 `子类(表1-7)` **一格都不管**。
    凡带 `rdfs:subClassOf` 的**主语**，必须是本图声明过的类（与对象侧同口径）：
    否则一个个体（例如某现场实体的 IRI）只要声明 `X rdfs:subClassOf 某个类`，
    它的**局部名**就落进公开仓台账的 `子类(表1-7)` 格，而对象侧与 xsd 侧**全绿**。
    """
    declared = set(g.subjects(RDF.type, OWL.Class))
    miss = []
    for s in sorted(set(g.subjects(RDFS.subClassOf, None)), key=str):
        if s not in declared:
            miss.append(f"{gen.local(s)}: 带 rdfs:subClassOf 却不是本图声明过的类"
                        " —— 子类(表1-7) 装的是**主语**，这就是它落进公开台账的那条路")
    return miss


def _ledger_gaps(gen, derived, onfile):
    """台账与图必须说同一件事。逐格比对，含行数。"""
    return gen.diff(derived, onfile)


def _clone(g):
    c = Graph()
    for t in g:
        c.add(t)
    return c


def test_表A1_每个类都带齐_OWL_有槽位的描述项(gen, graph):
    gaps = _class_gaps(gen, graph)
    assert not gaps, "表A.1 缺口:\n" + "\n".join(gaps)


def test_表A2_每个属性都带齐_OWL_有槽位的描述项(gen, graph):
    gaps = _prop_gaps(gen, graph)
    assert not gaps, "表A.2 缺口:\n" + "\n".join(gaps)


def test_值域必须落在表A3的五类里(gen, graph):
    gaps = _range_gaps(gen, graph)
    assert not gaps, "表A.3 硬约束违规:\n" + "\n".join(gaps)


def test_非xsd的域_值域_父类_等价类必须指向本图的类(gen, graph):
    """对象侧硬约束 —— 见 `_object_side_gaps` 的说明。

    台账那五格装的是**取值**，不是主语：只挡住「遍历哪类主语」挡不住
    「把现场个体写成 `rdfs:range` 的对象」。这条判据是 `gen_desc_ledger.py`
    安全注记的执行者（注记在 scripts/gen_desc_ledger.py:19-23）。
    """
    gaps = _object_side_gaps(gen, graph)
    assert not gaps, "对象侧指向了不是类的节点:\n" + "\n".join(gaps)


def test_带rdfs_subClassOf的主语必须是本图的类(gen, graph):
    """`子类(表1-7)` 那一格的执行者 —— 见 `_subject_side_gaps` 的说明。

    这一格**不是**对象侧的第五个谓词：`derive()` 取的是主语（`父类` 取对象）。
    没有它，「谁把某个现场实体写成某类的子类」就没有任何判据挡着 ——
    而那个**局部名**会直接落进公开仓的台账。
    """
    gaps = _subject_side_gaps(gen, graph)
    assert not gaps, "带 rdfs:subClassOf 的主语里有不是类的节点:\n" + "\n".join(gaps)


def test_负控_删掉定义必须被逮到(gen, graph):
    g = _clone(graph)
    victim = [c for c in sorted(g.subjects(RDF.type, OWL.Class), key=str)
              if gen.local(c) != "Thing"][0]
    g.remove((victim, RDFS.comment, None))
    gaps = _class_gaps(gen, g)
    assert any(gen.local(victim) in m and "定义" in m for m in gaps), \
        f"删掉 {gen.local(victim)} 的定义后判据没反应 —— 这条判据是空过的"


def test_负控_删掉定义域必须被逮到(gen, graph):
    g = _clone(graph)
    victim = sorted(g.subjects(RDF.type, OWL.DatatypeProperty), key=str)[0]
    g.remove((victim, RDFS.domain, None))
    gaps = _prop_gaps(gen, g)
    assert any(gen.local(victim) in m and "定义域" in m for m in gaps), \
        f"删掉 {gen.local(victim)} 的定义域后判据没反应 —— 这条判据是空过的"


def test_负控_超出五类的值域必须被逮到(gen, graph):
    from rdflib.namespace import XSD
    g = _clone(graph)
    victim = sorted(g.subjects(RDF.type, OWL.DatatypeProperty), key=str)[0]
    # ↓ 前置自检：注入前必须干净。没有它，负控失效时报出的信号（gaps 恰为空）
    #   与「判据不敏感」长得一模一样，而两者该采取的行动相反。
    assert not _range_gaps(gen, g), "注入前本就有违规 —— 这条负控证明不了什么"
    g.remove((victim, RDFS.range, None))
    g.add((victim, RDFS.range, XSD.dateTime))     # 表A.3 里没有 dateTime
    gaps = _range_gaps(gen, g)
    # 断言必须**绑住 victim**：若只要求「有反应」，**别处**的违规也能让它变绿 ——
    # 那这条负控就没在测它自己注入的那个东西。（原来的 `any("超出" in m or …)`
    # 还带一个死分支：_range_gaps 从不说「超出」。）
    assert any(gen.local(victim) in m and "不在表A.3" in m for m in gaps), \
        f"把 {gen.local(victim)} 的值域换成 xsd:dateTime 后判据没反应 —— 空过的"


_OUTSIDERS = {
    "uri": URIRef("http://dgiot.cloud/ontology#a_node_that_is_not_a_class"),
    "literal": Literal("a_literal_node"),
}


def _sample_subject(g, gen, kind):
    """负控的注入对象，取排序后第一个（可复现）。

    `对象属性` 而不是「任一属性」：指派在 ObjectProperty 上的 `rdfs:range`
    只可能是类或个体，说它是 xsd 载体说不通 —— 这正是要注入的那条违规。
    """
    if kind == "对象属性":
        pool = set(g.subjects(RDF.type, OWL.ObjectProperty))
    else:
        pool = {c for c in g.subjects(RDF.type, OWL.Class) if gen.local(c) != "Thing"}
    assert pool, f"图里没有一个可注入的{kind} —— 这条负控没有样本"
    return sorted(pool, key=str)[0]


@pytest.mark.parametrize("pred,col,victim_kind,outsider_kind", [
    (RDFS.range, "值域(表2-6)", "对象属性", "uri"),
    (RDFS.domain, "域(表2-5)", "对象属性", "uri"),
    (RDFS.subClassOf, "父类(表1-6)", "类", "uri"),
    # ★ `owl:equivalentClass` 今天**一条三元组都没有** —— 没有样本的分支就是没有正控
    #   的分支，跟没写一样。判据覆盖了它，就必须证明它真的会响。
    (OWL.equivalentClass, "等价类(表1-8)", "类", "uri"),
    # 对象也可以是字面量（同样会把值带进台账），一起测。
    (RDFS.range, "值域(表2-6)", "对象属性", "literal"),
])
def test_负控_对象侧指向非类节点必须被逮到(gen, graph, pred, col, victim_kind, outsider_kind):
    """给一条属性/类挂一个指向**非类节点**的 域/值域/父类/等价类。

    注入在**内存副本**上做（`_clone`），**不落盘、不改 src/ontology.py、不改仓里数据**。
    """
    g = _clone(graph)
    victim = _sample_subject(g, gen, victim_kind)
    outsider = _OUTSIDERS[outsider_kind]
    # ↓ 前置自检：注入前必须干净，且注入物确实不是类 —— 没有它，负控失效时报出的
    #   信号（gaps 恰为空）与「判据不敏感」长得一模一样，而两者该采取的行动相反。
    assert not _object_side_gaps(gen, g), "注入前本就有违规 —— 这条负控证明不了什么"
    assert outsider not in set(g.subjects(RDF.type, OWL.Class)), \
        f"注入物 {outsider} 本身就是类 —— 这条负控什么都没注入"
    g.remove((victim, pred, None))
    g.add((victim, pred, outsider))
    gaps = _object_side_gaps(gen, g)
    # 断言必须**绑住 victim 与那一列**：只要求「有反应」的话，别处的违规也能让它变绿。
    assert any(gen.local(victim) in m and col in m for m in gaps), \
        f"把 {gen.local(victim)} 的{col}指向非类节点 {outsider} 后判据没反应 —— 空过的:\n" \
        + "\n".join(gaps)
    # ★ 撤掉注入必须回绿：判据认的是「对象是不是类」，不能因为图被碰过就一律报红。
    g.remove((victim, pred, outsider))
    assert not _object_side_gaps(gen, g), \
        "撤掉注入后没回绿 —— 判据报的不是注入的那一处:\n" + "\n".join(_object_side_gaps(gen, g))


def test_负控_子类那格的主语不是类必须被逮到(gen, graph):
    """只注入**主语侧**违例：`(非类节点) rdfs:subClassOf 某个声明过的类`。

    ★ 要能**独立击中**：这一支报红时，对象侧四支与 xsd 侧都**不许跟着动** ——
    注入的谓词对象是个**声明过的类**，只有主语不是。（把这一支写成对象侧那个循环的
    改名片，就分不出到底是哪一侧出的问题。）
    注入在**内存副本**上做，不落盘、不改 src/ontology.py、不改仓里数据。
    """
    g = _clone(graph)
    parent = _sample_subject(g, gen, "类")
    outsider = _OUTSIDERS["uri"]
    # ↓ 前置自检：注入前两侧都必须干净，且注入物不是类、谓词对象是类 ——
    #   没有它，这一支报红也证明不了是「主语侧」被逮到。
    assert not _subject_side_gaps(gen, g), "注入前主语侧就不干净 —— 这条负控证明不了什么"
    assert not _object_side_gaps(gen, g), "注入前对象侧就不干净 —— 这条负控分不清是哪一侧"
    assert outsider not in set(g.subjects(RDF.type, OWL.Class)), \
        f"注入物 {outsider} 本身就是类 —— 这条负控什么都没注入"
    g.add((outsider, RDFS.subClassOf, parent))
    gaps = _subject_side_gaps(gen, g)
    assert any(gen.local(outsider) in m for m in gaps), \
        f"把 {gen.local(outsider)} 写成 {gen.local(parent)} 的子类后判据没反应 —— 空过的:\n" \
        + "\n".join(gaps)
    # ★ 同一注入下，**其余各支必须不动** —— 这就是「独立击中」的读数。
    assert not _object_side_gaps(gen, g), \
        "对象侧跟着报红了 —— 这一支没有独立击中:\n" + "\n".join(_object_side_gaps(gen, g))
    assert not _range_gaps(gen, g), "xsd 侧跟着报红了 —— 这一支没有独立击中"
    # ★ 撤掉注入必须回绿。
    g.remove((outsider, RDFS.subClassOf, parent))
    assert not _subject_side_gaps(gen, g), \
        "撤掉注入后没回绿 —— 判据报的不是注入的那一处:\n" + "\n".join(_subject_side_gaps(gen, g))


def test_台账与图说同一件事(gen, derived):
    assert LEDGER.exists(), \
        f"{LEDGER} 不存在 —— 台账没了，表A.1 第 5/7/8 项就没有载体，本判据无从谈起"
    onfile = gen.read(LEDGER)
    gaps = _ledger_gaps(gen, derived, onfile)
    assert not gaps, ("台账与图不一致（台账漂移）:\n" + "\n".join(gaps) +
                      "\n\n修法：python scripts/gen_desc_ledger.py 重新派生。"
                      "**不要手改台账** —— 它是派生件，手改会被下一轮打回。")


def test_负控_台账被改一格必须被逮到(gen, derived):
    """★ 改的是**内存副本**，不是盘上的文件。

    写盘再比对就成了「判据的动作改变了判据的对象」—— 那种判据在真实故障下
    会把文件改回去然后报绿。
    """
    victim = next(r for r in derived if r["种类"] == "类")
    # ↓ 前置自检：确认**确实有东西被改掉**。没有它，负控失效时报出的信号
    #   （gaps 为空）与「判据不敏感」长得一模一样，而两者该采取的行动相反。
    assert not victim["属性集(表1-5)"].startswith("（"), \
        f"{victim['Name']} 的属性集本来就是空的 —— 这条负控什么都没注入"
    tampered = [dict(r) for r in derived]
    for r in tampered:
        if r["Name"] == victim["Name"]:
            r["属性集(表1-5)"] = "（无）"
    assert tampered != derived, "篡改后与原件相同 —— 这条负控什么都没注入"
    gaps = _ledger_gaps(gen, derived, tampered)
    assert gaps, f"台账里 {victim['Name']} 的属性集被改错了，判据没反应 —— 空过的"
    # ★ 这条只能绑 victim 名，**不能**写成 `any("属性集(表1-5)" in m for m in gaps)`：
    #   `gen.diff()` 的消息格式是「第N行 <种类>.<Name>: <列>: 图=… 台账=…」，
    #   **列名不在消息里** ⇒ 那种写法对任何输入都为假（永不通过的断言 = 假红，
    #   与「判据坏了报通过」同族、方向相反）。绑 victim 名才对得上。
    assert any(victim["Name"] in m for m in gaps), \
        f"gaps 里没有一条提到 {victim['Name']} —— 改的是它，报的却是别处：{gaps}"


def test_负控_台账漏一个属性必须被逮到(gen, derived):
    onfile = [r for r in derived if r["种类"] == "类"]      # 只留类行，29 条属性行全丢
    gaps = _ledger_gaps(gen, derived, onfile)
    assert any("行数不同" in m for m in gaps), \
        "台账里 29 条属性行全没了，判据没反应 —— 它只在对得上号的行里比，漏行看不见"


def test_盘口自报_判据实检了几个(gen, graph):
    """正控全绿也可能是「一个都没查」。

    图解析失败、命名空间写错、断言写反 —— 都会让上面几条**空过**。
    「非空」太弱：缺失与污染都能绕过。所以这里把盘口钉住，且**钉两侧**。
    """
    cls = {gen.local(s) for s in graph.subjects(RDF.type, OWL.Class)
           if gen.local(s) != "Thing"}
    props = {gen.local(p) for p in
             set(graph.subjects(RDF.type, OWL.ObjectProperty)) |
             set(graph.subjects(RDF.type, OWL.DatatypeProperty))}
    xsd_ranges = [r for _, _, r in graph.triples((None, RDFS.range, None))
                  if "XMLSchema#" in str(r)]

    # ★ 类这一侧不在这里用「只查到 N 个」那种下限 —— 下限抓不住缩水、也抓不住
    #   多出来的东西。真正钉类的是下面 `cls == spec_cls`（两侧都钉）。
    assert len(props) >= 2, f"只查到 {len(props)} 个属性 —— 判据的域是空的"
    # 值域侧钉**配对**而不是「非空」：`assert xsd_ranges` 在 0 == 0 那种情形下
    # 会空过，而多值 range / 张冠李戴的 range 它更是一概看不见。
    dt_props = set(graph.subjects(RDF.type, OWL.DatatypeProperty))
    assert dt_props and len(xsd_ranges) == len(dt_props), (
        f"xsd 值域 {len(xsd_ranges)} 条 / DatatypeProperty {len(dt_props)} 条 —— "
        "每条数据属性恰有一个 xsd 载体；对不上就是有人丢了或加错了 rdfs:range")

    # ★ 对象侧（域/值域/父类/等价类）那条判据的样本，也要自报一次：三个谓词今天各有
    #   多条 —— 少了就是「没有样本的分支」，而那与「判据通过」长得一样。
    #   `owl:equivalentClass` **今天一条三元组都没有**，所以它**不进这个下限** ——
    #   它的样本只能由负控注入（见 test_负控_对象侧指向非类节点必须被逮到）。
    for pred, col, _ in _OBJ_SIDE_PREDS:
        if pred == OWL.equivalentClass:
            continue
        n = len([o for o in graph.objects(None, pred) if "XMLSchema#" not in str(o)])
        assert n > 0, f"{col} 一个非 xsd 对象都没有 —— 对象侧判据在这一支上是空过的"
    # ★ 主语侧那一支（子类(表1-7)）的样本同样要自报：带 rdfs:subClassOf 的主语今天有 7 个，
    #   0 个就是「没有样本的分支」—— 与「判据通过」长得一样。
    n_sub = len(set(graph.subjects(RDFS.subClassOf, None)))
    assert n_sub > 0, "没有一个主语带 rdfs:subClassOf —— 主语侧判据在这一支上是空过的"

    from src.ontology import LINK_REL_SPEC, HIER_PROPS, DATA_PROP_SPEC, ENTITY_CLASSES
    # hasConstraint 是三张规格表之外的第 29 条，写死在 src/ontology.py 的 _rdf_graph() 里。
    # 它出现在这里当字面量，是**记录一个缺口**，不是把规格抄第二遍。
    declared = (set(LINK_REL_SPEC) | {p for p, _, _, _ in HIER_PROPS} |
                set(DATA_PROP_SPEC) | {"hasConstraint"})
    assert declared <= props, f"规格里声明了但图里没有: {sorted(declared - props)}"
    assert props <= declared, \
        f"图里有但规格里没有（新属性要在规格表里显式登记）: {sorted(props - declared)}"
    # ★ 类这一侧必须**两侧都钉**：单侧 `<=` 抓不住「图里多出一个类」，也抓不住
    #   8→3 那种缩水（规格与图同时少，单侧照样绿）。第 8 个类是根类 `Entity`，
    #   它在 `_rdf_graph()` 里以**字面量**添加，**不在 ENTITY_CLASSES 里** ——
    #   所以规格集要显式并入它。它在这里当字面量，与上面 hasConstraint 同一
    #   性质：**记录一个缺口**，不是把规格抄第二遍。
    spec_cls = set(ENTITY_CLASSES.values()) | {"Entity"}
    assert cls == spec_cls, (
        "图里的类与规格对不上：\n"
        f"  规格有而图里没有: {sorted(spec_cls - cls)}\n"
        f"  图里有而规格没有（新类要在规格表里显式登记）: {sorted(cls - spec_cls)}")


def test_属性集是全部属性按定义域的一次划分(gen, graph):
    """钉形态，不钉总数。

    「属性数 == 29」这种判据可以被对冲（少两个多两个都能凑）；而
    「每个属性恰好被一个类认领」是**结构**，破坏它只有一种方式：
    有属性没写 rdfs:domain（谁都不管），或有两个类认领同一条。
    后者正是「多少够用」那个没写的除法。
    （第三种：带 `rdfs:domain` 却**不是**声明过的属性 —— 那说明「属性集」不再是
    「全部属性」了，单独由 `extra` 报出来；它不进 `owner`。）
    """
    prop_uris = (set(graph.subjects(RDF.type, OWL.ObjectProperty)) |
                 set(graph.subjects(RDF.type, OWL.DatatypeProperty)))
    props = {gen.local(p) for p in prop_uris}
    owner, extra = {}, {}
    for c in graph.subjects(RDF.type, OWL.Class):
        name = gen.local(c)
        if name == "Thing":
            continue
        for p in graph.subjects(RDFS.domain, c):
            pn = gen.local(p)
            # ★ 取样域**显式收窄到 props**：`owner` 只装声明过的属性；
            #   带 rdfs:domain 却不属于属性集的主语收进 `extra`（下面单独报）——
            #   收窄不等于放行，放行就成了静默少扫一类主语。
            if p not in prop_uris:
                extra[pn] = name
                continue
            assert pn not in owner, \
                f"{pn} 同时属于 {owner.get(pn)} 与 {name} 的定义域 —— 属性集不再是划分"
            owner[pn] = name
    # 消息**两侧都打**。原来只打一侧（`props - set(owner)`）：当 `owner ⊃ props`
    # （多进了一条不该进来的主语）时，打出来的正好是空列表 —— 方向报反了，
    # 维护者会去查「谁的定义域丢了」，而真实原因是多了一条。
    assert set(owner) == props and not extra, (
        "属性集不再是全部属性按定义域的一次划分：\n"
        f"  有定义域但不属于属性集（多出来的主语）: {sorted(extra)}\n"
        f"  属于属性集但没人认领（缺 rdfs:domain）: {sorted(props - set(owner))}")
