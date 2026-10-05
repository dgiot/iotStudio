# ============================================================
# SHACL 形状 — GB/T 48000.3 §5.3 第三句「应支持基于 SHACL 的约束验证」
#
# 这组用例钉的是**形状活着**, 不是「验证通过」:
#   1. 结构: 7 个 NodeShape, 每个 targetClass 在真实图上都有落点
#      （形状对着一个空类 = 什么都查不到 = 与「没问题」长得一模一样）
#   2. 逐类负控: 每一类约束各踩响一次, 且必须报**对应的约束组件名**
#      —— 只断言 conforms=False 不够: 别的形状顺带报红也能让它变 False
#   3. 覆盖报告必须非空, 且写进下载到的那份形状文件里（空报告也要报, 不许静默）
#   4. pyshacl 缺失时**抛**, 不许返回「通过」—— 「验不了」与「验过了没问题」
#      必须长得不一样
# ============================================================
import pytest

from rdflib import Graph, Literal, Namespace, RDF, URIRef
from rdflib.namespace import RDFS, SH

from src.ontology import (
    build_engine, DATA_PROP_SPEC, ENTITY_CLASSES, FIELD_ENUMS,
    HIER_PROPS, PARENT_REF,
)

# pyshacl 声明在 requirements.txt 的**测试依赖**段（不在运行依赖里 —— 服务本身不做验证）。
#
# ⚠️ 这里**不用模块级 pytest.importorskip**: 那样没装 pyshacl 时整批跳过, 而被跳掉的
# 里有两拨不该跳的 ——
#   · 结构性用例（形状长什么样、枚举表有没有咬到真实数据）只需要 rdflib, 那是**运行**依赖;
#   · test_validate_without_pyshacl_raises_instead_of_passing 的全部意义就是
#     「在缺依赖的机器上不许报通过」—— 而那台机器上它恰恰**不会跑**。
# 判据在自己最该生效的场合被关掉, 与「通过」长得一模一样。改成逐条标记。
try:
    import pyshacl  # noqa: F401
    _HAS_PYSHACL = True
except ImportError:      # pragma: no cover - 取决于环境
    _HAS_PYSHACL = False

requires_pyshacl = pytest.mark.skipif(
    not _HAS_PYSHACL,
    reason="需要 pyshacl（在 requirements.txt 测试依赖段）—— 本组只有真跑验证的用例需要它")

DG = Namespace("http://dgiot.cloud/ontology#")


@pytest.fixture(scope="module")
def eng():
    return build_engine()


@pytest.fixture(scope="module")
def shapes(eng):
    return eng.shacl_shapes()[0]


@pytest.fixture(scope="module")
def report(eng):
    return eng.shacl_shapes()[1]


def _run(data, shapes_graph):
    from pyshacl import validate
    return validate(data, shacl_graph=shapes_graph)


def _chain():
    """最小合规链: Site → Gateway → Channel → Device → Point

    刻意**不用 build_engine() 的真实图**做「合规」断言: 那个引擎是两个数据源
    二选一（load_from_parse 有数据就用库里的）, 库里有悬空引用的设备时
    conforms 本就该是 False —— 拿它断言 True 会把「验证器正确工作」判成失败。
    真实图另有一条注入式负控（见 test_negative_control_on_the_real_graph）。
    """
    g = Graph()
    for eid, cls in (("s1", "Site"), ("g1", "Gateway"), ("c1", "Channel"),
                     ("d1", "Device"), ("p1", "Point")):
        g.add((DG[eid], RDF.type, DG[cls]))
    for s, p, o in (("s1", "hasGateway", "g1"), ("g1", "hasChannel", "c1"),
                    ("c1", "hasDevice", "d1"), ("d1", "hasPoint", "p1")):
        g.add((DG[s], DG[p], DG[o]))
    return g


# ── 1. 结构 ──

def test_one_node_shape_per_entity_class(shapes):
    node_shapes = set(shapes.subjects(RDF.type, SH.NodeShape))
    assert len(node_shapes) == len(ENTITY_CLASSES)
    targets = {str(o).rsplit("#", 1)[-1] for o in shapes.objects(None, SH.targetClass)}
    assert targets == set(ENTITY_CLASSES.values())   # 多了、少了、换名字都报


def test_every_shape_targets_real_individuals(shapes, eng):
    """★ 形状对着一个空类 ⇒ 它什么都查不到, 而结果与「没问题」长得一样。

    这是本库的老账形状（「空真」）: 不报错, 只是答了一个别的问题。
    """
    data = eng._rdf_graph()
    empty = [str(t) for t in set(shapes.objects(None, SH.targetClass))
             if not list(data.subjects(RDF.type, t))]
    assert empty == [], "这些形状的目标类在真实图上一个个体都没有: %s" % empty


def test_hierarchy_shapes_use_inverse_path_and_both_cardinalities(shapes):
    """§8.2 c)1) 功能性 + c)3) 层次结构 —— 基数**两条都要**。

    只有 minCount = 只查「有没有父」; 只有 maxCount = 只查「父多不多」。
    缺任一条, 另一半要求就没人执行。
    """
    by_child = {rng: p for p, _dom, rng, _d in HIER_PROPS}
    for child_cls, prop in by_child.items():
        back = list(shapes.subjects(SH.inversePath, DG[prop]))
        assert back, "%s 没有 sh:inversePath %s 形状" % (child_cls, prop)
        ps = list(shapes.objects(next(shapes.subjects(SH.targetClass, DG[child_cls])),
                                 SH.property))
        hit = [p for p in ps if (p, SH.path, back[0]) in shapes]
        assert len(hit) == 1, "%s 的层级属性形状不唯一" % child_cls
        assert (hit[0], SH.minCount, Literal(1)) in shapes
        assert (hit[0], SH.maxCount, Literal(1)) in shapes


def test_parent_ref_and_hier_props_agree():
    """PARENT_REF 说「哪几层要约束」, HIER_PROPS 说「边叫什么」—— 两个事实源。

    shacl_shapes() 里也有一次对账（对不上会抛）, 但那时报错发生在下游;
    这条把它钉在源头。同一事实两处是高发区, 两处各配一条判据。
    """
    by_child = {rng: (p, dom) for p, dom, rng, _d in HIER_PROPS}
    for child_tbl, (fld, _ptbl) in PARENT_REF.items():
        cls = ENTITY_CLASSES[child_tbl]
        prop, dom = by_child[cls]
        assert prop == "has" + cls
        assert dom == ENTITY_CLASSES[fld]


# ── 2. 正控: 最小合规链必须过（不然所有负控都只证明「它总在报错」）──

@requires_pyshacl
def test_minimal_conforming_chain_passes(shapes):
    ok, _g, text = _run(_chain(), shapes)
    assert ok, "最小合规链被判不合规:\n%s" % text


# ── 3. 逐类负控 —— 每条必须报**对应的约束组件**, 不是随便报个红 ──

@requires_pyshacl
def test_negative_control_enum_violation(shapes):
    g = _chain()
    g.add((DG["c1"], DG["channelProtocol"], Literal("BOGUS_PROTO")))
    ok, _g, text = _run(g, shapes)
    assert not ok
    assert "InConstraintComponent" in text


@requires_pyshacl
def test_negative_control_missing_parent(shapes):
    """去掉 hasChannel 反向边 ⇒ minCount 1 违规（§8.2 c)3) 层次结构）"""
    g = _chain()
    g.remove((DG["g1"], DG["hasChannel"], DG["c1"]))
    ok, _g, text = _run(g, shapes)
    assert not ok
    assert "MinCountConstraintComponent" in text


@requires_pyshacl
def test_negative_control_two_parents(shapes):
    """一个设备挂两个通道 ⇒ maxCount 1 违规（§8.2 c)1) 功能性）

    ★ 这条单独存在, 是为了让 c)1) 那半**自己**被踩响一次 ——
    只测 minCount 的话, maxCount 写没写、写对没写对, 没有任何判据会亮。
    """
    g = _chain()
    g.add((DG["g1"], RDF.type, DG["Gateway"]))
    g.add((DG["g1"], DG["hasChannel"], DG["c1"]))
    g.add((DG["g0"], RDF.type, DG["Gateway"]))
    g.add((DG["g0"], DG["hasChannel"], DG["c1"]))
    ok, _g, text = _run(g, shapes)
    assert not ok
    assert "MaxCountConstraintComponent" in text


@requires_pyshacl
def test_negative_control_wrong_datatype(shapes):
    """slaveId 填字符串 ⇒ sh:datatype 违规（§8.2 b)4) 取值约束）"""
    g = _chain()
    g.add((DG["d1"], DG["slaveId"], Literal("abc")))
    ok, _g, text = _run(g, shapes)
    assert not ok
    assert "DatatypeConstraintComponent" in text


@requires_pyshacl
def test_negative_control_below_min_inclusive(shapes):
    """slaveId 填 -5 ⇒ sh:minInclusive 0 违规（§8.2 b)4)）"""
    g = _chain()
    g.add((DG["d1"], DG["slaveId"], Literal(-5)))
    ok, _g, text = _run(g, shapes)
    assert not ok
    assert "MinInclusiveConstraintComponent" in text


@requires_pyshacl
def test_negative_control_on_the_real_graph(shapes, eng):
    """★ 形状必须绑在**真实图**上, 不是只绑住上面那条玩具链。

    对象**从图里取**, 不手打: 实测教训 —— 第一次把 channelProtocol 注入到一个
    Device 上, conforms 照样 True, 而那是**正确**行为（那条形状的 targetClass 是
    Channel）。判据不报错, 只是答了一个别的问题; 手打的对象是判据里唯一的单点故障。
    """
    data = eng._rdf_graph()
    ch = next(data.subjects(RDF.type, DG["Channel"]), None)
    assert ch is not None, "图上没有 Channel ⇒ 本判据没有对象, 这不叫通过"
    g = Graph()
    for t in data:
        g.add(t)
    g.add((ch, DG["channelProtocol"], Literal("BOGUS_PROTO")))
    ok, _g, text = _run(g, shapes)
    assert not ok and "InConstraintComponent" in text


# ── 4. 「没形式化的条文」必须报出来, 且写进图里 ──

def test_unformatted_report_is_not_empty(report):
    """★ 空报告也要报 —— 不许静默。

    这份报告是「本形状没覆盖哪些标准条文」的唯一载体。它变空只有两种可能:
    真全形式化了（那是好事, 但该有人确认）, 或者它停止工作了（那是坏事）。
    两种都得有人看一眼, 所以这条红。
    """
    assert report["unformatted"], "unformatted 为空 —— 报告可能已停止工作"
    for item in report["unformatted"]:
        assert item["clause"].startswith("§8.2"), item
        assert item["requirement"].strip(), item
        assert item["why"].strip(), item


def test_unformatted_list_is_written_into_the_shapes_file(shapes, report):
    """报告不能只活在内存里 —— 下载到的那份形状文件必须自带这份说明。

    否则下游拿到的是一份「没说清自己缺了什么」的形状文件, 会当成完整件用。
    （同一个手法见 check_desc_items.py 的「覆盖面前提」三行。）
    """
    comments = list(shapes.objects(DG["Shapes"], RDFS.comment))
    assert len(comments) == 1, "根节点的 rdfs:comment 应当恰好一条"
    text = str(comments[0])
    assert "未覆盖" in text
    for item in report["unformatted"]:
        assert item["clause"] in text, "报告里有、文件里没有: %s" % item["clause"]


def test_formatted_report_shapes_count_matches_the_graph(shapes, report):
    """report 里报的形状数必须与图上数出来的一致 —— 报出来的数不许是图上没有的。"""
    assert report["node_shapes"] == len(set(shapes.subjects(RDF.type, SH.NodeShape)))
    assert report["property_shapes"] == len(set(shapes.objects(None, SH.property)))


# ── 5. 枚举表不许咬到真实数据 ──

def test_field_enums_cover_actual_values(eng):
    """★ FIELD_ENUMS 必须覆盖图上所有实测值（实测表外 0 处）。

    红了两个方向都要人看: 要么枚举表漏了合法值（形状会误伤真实数据）,
    要么数据里混进了非法值（形状正确地逮到了）。判据分不清这两种, 所以不许自动放行。
    """
    g = eng._rdf_graph()
    outside = {}
    for pname, allowed in FIELD_ENUMS.items():
        got = {str(o) for o in g.objects(None, DG[pname])}
        extra = got - set(allowed)
        if extra:
            outside[pname] = sorted(extra)
    assert outside == {}, "枚举表外的实测值: %s" % outside


def test_field_enums_only_names_declared_properties():
    """枚举表里的每个属性名都必须是 DATA_PROP_SPEC 声明过的 —— 否则形状指向一个
    图上不存在的属性: 不报错, 只是永远不生效（又一个空真）。"""
    assert set(FIELD_ENUMS) <= set(DATA_PROP_SPEC)


def test_datatype_shapes_follow_data_prop_spec(shapes):
    """§8.2 b)4) 类型约束 —— 值域与 OWL 侧 rdfs:range **同源**（DATA_PROP_SPEC），
    两处必须一致; 不一致时推理器与验证器会得出相反的结论。

    ⚠️ sh:datatype 的主语是**属性形状那个 BNode**, 不是属性 URI ——
    要拿 sh:path 反查属性名（第一版这条就写错了域, 断言拿 BNode 名去比属性名）。
    """
    xsds = {}
    for pname, (_dom, rng, _d) in DATA_PROP_SPEC.items():
        xsds[pname] = URIRef("http://www.w3.org/2001/XMLSchema#" + rng.split(":", 1)[1])
    got = {}
    for ps, dt in shapes.subject_objects(SH.datatype):
        path = shapes.value(ps, SH.path)
        assert path is not None, "带 sh:datatype 的属性形状没有 sh:path"
        got[str(path).rsplit("#", 1)[-1]] = dt
    assert got == xsds          # 每个属性都要有, 且类型一致


# ── 6. 「验不了」必须与「验过了没问题」长得不一样 ──

def test_validate_without_pyshacl_raises_instead_of_passing(eng, monkeypatch):
    """★ 负控: 把 pyshacl 从 import 里拿掉, validate_shacl() 必须**抛**。

    谁要是把它改成 `except ImportError: return True, "", g`, 这条会红 ——
    那等于在缺依赖的机器上对外报「SHACL 验证通过」。
    """
    import builtins
    real_import = builtins.__import__

    def fake_import(name, *args, **kwargs):
        if name == "pyshacl":
            raise ImportError("simulated missing pyshacl")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", fake_import)
    with pytest.raises(RuntimeError) as ei:
        eng.validate_shacl()
    assert "pyshacl" in str(ei.value)


@requires_pyshacl
def test_validate_shacl_returns_a_real_verdict(eng):
    """装上 pyshacl 时它必须真跑, 且报告文本非空 —— 空报告 = 没跑。"""
    conforms, text, shapes_graph = eng.validate_shacl()
    assert isinstance(conforms, bool)
    assert text.strip(), "验证报告为空 ⇒ 它没在验"
    assert len(shapes_graph) > 0


# ── 7. 导出出口 ──

def test_export_shacl_is_the_same_graph(eng):
    assert len(Graph().parse(data=eng.export_shacl(), format="turtle")) \
        == len(eng.shacl_shapes()[0])


def test_export_shacl_roundtrips_with_shapes_terms_intact(eng):
    """往返后 sh:in / sh:inversePath 这些**结构**必须还在 ——
    只比三元组数的话, 列表被压成字符串也照样相等。"""
    back = Graph().parse(data=eng.export_shacl(), format="turtle")
    from rdflib.collection import Collection
    ins = list(back.objects(None, SH["in"]))
    assert len(ins) == len(FIELD_ENUMS)
    for lst in ins:
        assert len(Collection(back, lst)) >= 1
    assert len(list(back.objects(None, SH.inversePath))) == len(HIER_PROPS)


# ── 8. 端点级 ──

@pytest.fixture(scope="module")
def client():
    """只装 graphrag 路由的最小 app（房内惯例，见 test_ontology_sparql._client）"""
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.auth import get_current_user
    from src.web import graphrag_api

    app = FastAPI()
    app.include_router(graphrag_api.router)
    app.dependency_overrides[get_current_user] = lambda: {"id": "t", "role": "admin"}
    return TestClient(app)


def test_endpoint_jsonld_media_type_and_roundtrip(client):
    r = client.get("/api/graphrag/ontology.jsonld")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("application/ld+json")
    assert len(Graph().parse(data=r.text, format="json-ld")) > 0


def test_endpoint_shacl_shapes_media_type_and_roundtrip(client):
    r = client.get("/api/graphrag/ontology.shacl.ttl")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/turtle")
    g = Graph().parse(data=r.text, format="turtle")
    assert len(set(g.subjects(RDF.type, SH.NodeShape))) == len(ENTITY_CLASSES)


# ── 9. 文档里手写的数字也要有判据 ──

def test_benchmark_doc_shacl_numbers_match_reality(shapes, report):
    """BENCHMARK.md 三次订正里手写的形状数, 必须与实跑一致。

    「文档里手写的数字没有判据」是本库已登记的一类缺陷 —— 它会腐烂, 而腐烂时
    没有任何东西会亮。这条把那些数字接到代码上: 改形状不改文档, 这里红。

    ⚠️ **射程**: `docs/` 被 `.gitignore:2` 整个忽略（那里注释写 `# Sensitive`）⇒
    `BENCHMARK.md` **不在本仓**, 干净检出里没有它。文件不在时这条**跳过**
    （计入 pytest 的 skip 数, 不静默）; 在留着 docs/ 的工作区里它是实的。
    也就是说这条只在**本地工作区**生效, 防的是「改了形状忘同步文档」。
    """
    from pathlib import Path
    doc = Path(__file__).resolve().parents[1] / "docs" / "BENCHMARK.md"
    if not doc.exists():
        pytest.skip("docs/BENCHMARK.md 不在本检出（docs/ 被 .gitignore:2 忽略, 非本仓文件）")
    text = doc.read_text(encoding="utf-8")
    n_in = len(list(shapes.objects(None, SH["in"])))
    n_dt = len(list(shapes.objects(None, SH.datatype)))
    n_min = len(list(shapes.objects(None, SH.minInclusive)))
    expect = [
        "%d 个实体类" % len(ENTITY_CLASSES),
        "%d 条枚举" % n_in,
        "%d 条类型" % n_dt,
        "%d 条下限" % n_min,
        "%d 条）" % len(report["unformatted"]),
    ]
    missing = [e for e in expect if e not in text]
    assert missing == [], "BENCHMARK.md 里的形状数与实跑对不上, 缺: %s" % missing
    assert n_in == len(FIELD_ENUMS)
    assert n_dt == len(DATA_PROP_SPEC)


# ── 10. 依赖声明本身也要有判据 ──

def test_requirements_declares_pyshacl():
    """★ 「支持基于 SHACL 的约束验证」（GB/T 48000.3 §5.3 第三句）必须**装得上**。

    pyshacl 不在**运行**依赖里是本服务的刻意选择（服务只导出形状, 不做验证）,
    但它必须在**测试依赖**段里 —— 否则全新环境跑不起本组用例, 那句话在别的
    机器上就是一句空话, 而且没有任何东西会亮。

    ⚠️ 这条**不需要** pyshacl, 所以刻意不挂 requires_pyshacl: 依赖缺失时它
    恰恰是唯一会亮的那盏灯。谁把 pyshacl 从 requirements.txt 删掉, 这条会红。
    """
    from pathlib import Path
    text = (Path(__file__).resolve().parents[1] / "requirements.txt").read_text(
        encoding="utf-8")
    head, sep, dev = text.partition("# ── 测试依赖 ──")
    assert sep, "requirements.txt 里找不到「# ── 测试依赖 ──」分节 —— 判据的判别域没了"
    assert "pyshacl" in dev, "pyshacl 不在 requirements.txt 的测试依赖段 ⇒ 新环境跑不起本组用例"
    assert "pyshacl" not in head, \
        "pyshacl 出现在运行依赖段 —— 服务本身不做验证, 那是刻意不装的"
