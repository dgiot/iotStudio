# ============================================================
# 本体对齐 — 映射表 ↔ SSN/SOSA 词表 的一致性执行者
# ============================================================
"""`vocab/alignment.json` 里那些映射，凭什么是真的？

**没有本文件，它就是一份「我声称」。**

原先这份映射写在 `src/interop.py:4-16` 的注释块里 —— 没有出处、没有执行者。
2026-09-16 拿权威词表一比，三处错**静默通过了全部既有检查**：

    ssn:hostedBy        SSN 词表里根本没有这个词（正确写法 sosa:isHostedBy）
    ssn:forProperty     它是 owl:ObjectProperty，我们却接了字符串字面量
                        ⇒ OWL 2 DL 语法级错误
    ssn:hasSubSystem    指向 sosa:Platform，而 ssn:System ⊑ ∀ssn:hasSubSystem.ssn:System
                        ⇒ 推理器反推出一批我们从未声明的类型

三条都不是「写错一个字母」，是**没有一个东西知道正确的词长什么样**。
所以本文件的第一件事是把词表读进来（`vocab/sosa.ttl` / `vocab/ssn.ttl`，
原样 vendor，sha256 见下），让它当那个「东西」。

## 判据分四组

  ① 词表完整性 —— vendor 的文件没被改过（sha256）
  ② 映射的每条 term 在词表里**真的存在**（正控）+ **编造的 term 必须被逮住**（负控）
  ③ 表必须**覆盖全部本地类**，且**未对齐的类必须出现在导出产物里** ——
     「没说清自己没对齐什么」的文件，下游会当它已经对齐了
  ④ **推理器不许长出我们没声明的类型** —— 这是最强的一条：
     它不依赖我手工列举任何一个 term，而是让推理器自己说话

## 这套判据的判别域止于 SSN/SOSA

`relation` 全是 `null`（零类级关系声明）是**记录在案的缺口**，不是本文件漏判 ——
`test_reports_that_no_class_relation_is_declared` 专门把它报出来。
DTDL / AAS / PROV-O 三个导出器的映射不在本表，另表。
"""
import hashlib
import json
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
VOCAB = ROOT / "vocab"
ALIGNMENT = VOCAB / "alignment.json"

# term 前缀 → 命名空间 IRI。判据靠它把 "sosa:Platform" 拼成可查的 IRI。
NS_IRI = {
    "sosa": "http://www.w3.org/ns/sosa/",
    "ssn": "http://www.w3.org/ns/ssn/",
}

# 本地类的权威清单来源（与 alignment.json 的 meta.local_classes_source 同源）
LOCAL_CLASS_SOURCE = ROOT / "src" / "ontology.py"


# ── 事实源 ──

def _alignment() -> dict:
    assert ALIGNMENT.exists(), \
        f"{ALIGNMENT} 不存在 —— 事实源没了，本文件后面全是空过"
    return json.loads(ALIGNMENT.read_text(encoding="utf-8"))


def _vocab_file(name: str) -> Path:
    f = VOCAB / f"{name}.ttl"
    assert f.exists(), f"词表 {f} 不见了 —— 判据没有可比对的对象"
    return f


def _defined_terms(name: str) -> set:
    """词表里**被定义**的 term（作为主语出现过）。

    用 rdflib 解析而不是正则扫文本：正则会被注释里的 `ssn:hostedBy` 之类
    反例骗到 —— 那正是本次要抓的那类错。
    """
    rdflib = pytest.importorskip("rdflib", reason="读词表要 rdflib")
    g = rdflib.Graph()
    g.parse(str(_vocab_file(name)), format="turtle")
    ns = NS_IRI[name]
    return {str(s)[len(ns):] for s in set(g.subjects(None, None))
            if str(s).startswith(ns)}


# ── ① 词表完整性 ──

@pytest.mark.parametrize("name", ["sosa", "ssn"])
def test_vendored_vocabulary_is_byte_identical(name):
    """vendor 的词表必须与抓取时逐字节一致。

    `vocab/README.md` 写着「不许手改」。没有这条判据，那句话就只是句话 ——
    而**被人「顺手修一下」的词表，与没被改过的词表长得一模一样**，
    判据从这里开始就全体失效（拿一份被改过的尺子量东西）。
    """
    want = _alignment()["meta"]["vocabularies"][name]["sha256"]
    got = hashlib.sha256(_vocab_file(name).read_bytes()).hexdigest()
    assert got == want, (
        f"{name}.ttl 的 sha256 变了\n  期望 {want}\n  实际 {got}\n"
        f"重新抓一份、或更新 alignment.json —— 但先想清楚为什么要在本地改它。"
    )


# ── ② 每条映射的 term 必须真实存在 ──

def _standard_mappings():
    """表里所有**声称对齐到标准**的行（自带 dg: 前缀的除外）。"""
    for m in _alignment()["mappings"]:
        ext = m.get("external")
        if ext and not ext.startswith("dg:"):
            yield m


def test_every_mapped_term_exists_in_its_vocabulary():
    """**正控** —— 表里每条 external 都要能在 vendor 的词表里查到。

    查的是「作为主语被定义过」，不是「文本里出现过」：SSN 词表里
    恰好有反例注释提到别的写法，拿文本搜会给出假阳性。
    """
    defined = {n: _defined_terms(n) for n in NS_IRI}
    bad = []
    for m in _standard_mappings():
        pfx, local = m["external"].split(":", 1)
        assert pfx in NS_IRI, f"{m['external']} 的前缀不在已知词表里"
        if local not in defined[pfx]:
            bad.append(f"{m['external']}（{m['local']}.{m.get('property', '')}）")
    assert not bad, (
        f"这些 term 在词表里不存在：{bad}\n"
        f"它们会静默变成一个自造 IRI —— 不报错、不失效，只是不是标准。"
    )


def test_the_criterion_catches_a_fabricated_term():
    """**负控** —— 喂一个编造的 term，上面那条判据必须当场逮住它。

    没有这条，「全绿」可能只说明判据没在检查（本仓的记录里，
    判据自己坏掉时报的是「通过」不是「没检查」）。
    用的是真事：`ssn:hostedBy` 曾经就在 `src/interop.py:170` 上，
    而 SSN 词表里正确的写法是 `sosa:isHostedBy`。
    """
    defined = _defined_terms("ssn")
    assert "hostedBy" not in defined, "SSN 词表里居然有 hostedBy 了？先回源核一遍"
    # 阳性对照：同一套查法对真词必须给 True
    assert "hasSubSystem" in defined, "同一套查法对真词查不到 ⇒ 是查法坏了，不是词不存在"


# ── ③ 覆盖性与缺口 ──

def _local_classes_from_code() -> set:
    """本地类的权威清单 —— 从 `OntologyEngine.__init__` 的容器读，不手抄。

    手抄一份清单就等于又造了一处会腐烂的副本。
    """
    import sys as _sys
    if str(ROOT) not in _sys.path:
        _sys.path.insert(0, str(ROOT))
    from src.ontology import build_edge_ontology
    eng = build_edge_ontology()
    containers = {k: v for k, v in vars(eng).items() if isinstance(v, dict)}
    # sites→Site, datasources→DataSource, …
    known = {"sites": "Site", "gateways": "Gateway", "channels": "Channel",
             "devices": "Device", "points": "Point", "datasources": "DataSource",
             "links": "Link", "constraints": "Constraint"}
    assert set(containers) == set(known), (
        f"引擎的容器变了：多了 {set(containers) - set(known)} / "
        f"少了 {set(known) - set(containers)} —— 先确认这是有意的，再更新本判据")
    return set(known.values())


def test_table_covers_every_local_class():
    """表必须**逐条覆盖**本地类。少一条，那个类就是「没说清自己没对齐什么」。

    它不会报错 —— 一份漏了三个类的对齐表，和一份完整的对齐表长得一样。
    """
    declared = {m["local"] for m in _alignment()["mappings"] if m["kind"] == "class"}
    actual = _local_classes_from_code()
    missing = actual - declared
    assert not missing, (
        f"这些本地类没进对齐表：{sorted(missing)}\n"
        f"不知道对齐什么就写 external=null + status=待核 —— 但**不许不写**。"
    )
    assert not (declared - actual), f"表里有代码里不存在的本地类：{sorted(declared - actual)}"


def test_self_invented_terms_are_marked_as_such():
    """`自造` 的行必须真的带 `dg:` 前缀；非 `dg:` 的必须真的是标准词。

    防的是「含糊」：一个既不在标准里、又没标自造的 term，
    下游会把它当标准词读。
    """
    for m in _alignment()["mappings"]:
        ext = m.get("external")
        if m["status"] == "自造":
            assert ext and ext.startswith("dg:"), \
                f"{m['local']}.{m.get('property','')} 标了自造，external 却是 {ext!r}"
        elif ext:
            assert not ext.startswith("dg:"), \
                f"{m['local']}.{m.get('property','')} 用了 dg: 前缀却没标自造"


def test_reports_that_no_class_relation_is_declared():
    """**把缺口报出来** —— 零条类级关系，是记录在案的缺口，不是漏判。

    我们只在实例上贴了标准类型标签，**没有一条** `subClassOf` / `closeMatch` /
    `equivalentClass`。这是《知识图谱互联互通白皮书》§9 点名「决定互联互通
    可行性」的知识结构对齐那一步 —— 导出器齐全 ≠ 已经对齐。

    这条判据现在**通过**（因为缺口是记录过的）。它会在有人补上第一条类级
    关系时提醒：补了之后 `alignment.json` 的 meta.gap 要跟着改。
    """
    rels = [m for m in _alignment()["mappings"] if m.get("relation")]
    gap = _alignment()["meta"].get("gap", "")
    if not rels:
        assert "没有任何一条类级关系" in gap, \
            "零类级关系是当前的事实 —— meta.gap 必须写明它，不许静默"
    else:
        assert "没有任何一条类级关系" not in gap, \
            f"已经声明了 {len(rels)} 条类级关系，meta.gap 还写着「没有任何一条」"


# ── ④ 导出产物：贴了的类型要真的贴上，没对齐的要真的报出来 ──

@pytest.fixture(scope="module")
def exported():
    import sys as _sys
    if str(ROOT) not in _sys.path:
        _sys.path.insert(0, str(ROOT))
    from rdflib import Graph
    from src.interop import export_ssn
    from src.ontology import build_edge_ontology

    doc = export_ssn(build_edge_ontology())
    g = Graph()
    g.parse(data=json.dumps(doc), format="json-ld")
    return doc, g


def test_declared_types_actually_appear_in_the_export(exported):
    """**正控** —— 表里说 `Site → sosa:Platform`，导出图里就得真有。

    这条比「检查源码第几行」强：行号会腐烂，而这条判的是**产物**。
    没有它，表可以和一塌糊涂的导出器同时「全绿」。
    """
    from rdflib import RDF, URIRef
    doc, g = exported
    used_types = {str(o) for o in g.objects(None, RDF.type)}
    used_preds = {str(p) for p in set(g.predicates(None, None))}
    missing = []
    for m in _alignment()["mappings"]:
        ext = m.get("external")
        if not ext or m["status"] == "自造" or not m.get("instance_asserted"):
            continue
        pfx, local = ext.split(":", 1)
        iri = NS_IRI[pfx] + local
        pool = used_types if m["kind"] == "class" else used_preds
        if iri not in pool:
            kind = "类型" if m["kind"] == "class" else "谓词"
            missing.append(f"{m['local']}.{m.get('property','')} → {ext}（该{kind}未出现）")
    assert not missing, f"表里声明了、导出图里却没有：{missing}"


def test_unmapped_classes_are_declared_in_the_export(exported):
    """**导出的产物自己要说清它没对齐什么。**

    一份「没说清自己缺了什么」的文件，下游会当它完整。
    所以 `meta.unmapped` 是产物的一部分，不是可选的注释。
    """
    doc, _ = exported
    meta = doc.get("meta", {})
    assert "unmapped" in meta, (
        "export_ssn() 的 meta 里没有 unmapped —— 下游拿到这份 JSON-LD，"
        "分不出哪些节点是标准类、哪些是我们自造的"
    )
    assert isinstance(meta["unmapped"], list) and meta["unmapped"], \
        "unmapped 是空的？至少 dg:DataSource / dg:RelationStatement 在 SSN 里没有对应"


def test_reasoning_adds_no_undeclared_types(exported):
    """**最强的一条** —— 让推理器自己说有没有长出我们没声明的类型。

    规则：推理后新增的标准类型，必须是该实体**已声明类型的祖先**
    （沿 `rdfs:subClassOf` 上溯，含自身）。

      · `sosa:Sensor → ssn:System`      通过 —— 词表公理 Sensor ⊑ System
      · `sosa:ObservableProperty → ssn:Property`  通过 —— 同上
      · `sosa:Platform → ssn:System`    **报红** —— Platform 不是 System 的子类
      · 自造类 → `ssn:System`            **报红** —— 它压根没有标准祖先

    修前实测：36 个实体长出新类型，其中 23 个是这个意义上的污染
    （来源是 `ssn:System ⊑ ∀ssn:hasSubSystem.ssn:System` 从 Channel 反推）。

    选「祖先」而不是硬编码一份白名单：白名单要人维护，而 ancestor 判据
    随着词表升级自动跟着走。
    """
    try:
        import owlrl
    except ImportError:
        pytest.fail(
            "owlrl 未安装 —— 这条判据是「推理后不许长出未声明类型」的唯一执行者。\n"
            "跳过它 = 那 23 个污染重新变成无人看守。pip install owlrl"
        )

    from rdflib import Graph, Namespace, RDF, RDFS, URIRef

    doc, g = exported
    SOSA = Namespace(NS_IRI["sosa"])
    SSN = Namespace(NS_IRI["ssn"])
    DG = Namespace("http://dgiot.cloud/ontology#")

    # 把权威词表并进来，推理器才知道公理在哪
    for n in NS_IRI:
        g.parse(str(_vocab_file(n)), format="turtle")

    def std(o):
        s = str(o)
        return s.startswith(NS_IRI["sosa"]) or s.startswith(NS_IRI["ssn"])

    def std_types(subj):
        return {str(o) for o in g.objects(subj, RDF.type) if std(o)}

    mine = [s for s in set(g.subjects(RDF.type, None)) if str(s).startswith(str(DG))]
    before = {s: std_types(s) for s in mine}

    owlrl.DeductiveClosure(owlrl.RDFS_OWLRL_Semantics,
                           rdfs_closure=True, axiomatic_triples=False).expand(g)

    def ancestors(cls):
        """沿 rdfs:subClassOf 上溯（含自身），只看词表内部的边。"""
        seen, stack = {cls}, [cls]
        while stack:
            cur = stack.pop()
            for sup in g.objects(cur, RDFS.subClassOf):
                if std(sup) and sup not in seen:
                    seen.add(sup)
                    stack.append(sup)
        return seen

    bad = []
    for subj, was in before.items():
        added = std_types(subj) - was
        if not added:
            continue
        allowed = set()
        for t in was:
            allowed |= ancestors(URIRef(t))
        for t in added:
            if URIRef(t) not in allowed:
                bad.append(f"{subj} —— 已声明 {sorted(was) or '(无标准类型)'}，"
                           f"却长出了 {t}")
    assert not bad, (
        f"{len(bad)} 个实体被推理器追加了它们没有依据的类型：\n  "
        + "\n  ".join(bad[:6])
        + "\n\n这多半是因为某个标准属性被用在了它不适用的主体上"
          "（如 ssn:System ⊑ ∀ssn:hasSubSystem.ssn:System 被非 System 主体触发）。"
    )
