# ============================================================
# SPARQL 端点 + RDF 图统计 — 对平测试
#
# 这组用例钉三件事，每件都对应页面上曾经写错的一个数：
#   1. 非法 SPARQL 必须抛，不许静默返空列表
#   2. 统计数必须与 export_owl()/turtle/jsonld 导出的那张图一致（同一张图，三个出口）
#   3. 报出来的数必须与图对得上；图上没有的（isa95: / iof:）不许被报出来
# ============================================================
import json

import pytest

from src.ontology import build_engine


@pytest.fixture(scope="module")
def eng():
    return build_engine()


# ── 1. 正控：真查询返回预期结果 ──

def test_sparql_count_matches_triple_count(eng):
    """查询数出来的三元组数，必须等于 len(graph)"""
    rows = eng.sparql("SELECT (COUNT(*) AS ?n) WHERE { ?s ?p ?o }")
    assert len(rows) == 1
    assert int(rows[0]["n"]) == eng.triple_count()


def test_sparql_returns_rows_with_named_bindings(eng):
    rows = eng.sparql(
        "SELECT ?c WHERE { ?c a <http://www.w3.org/2002/07/owl#Class> }")
    # 七个实体类 + 根类 Entity。根类是为 GB/T 48000.3 附录A 表A.1 的「父类」
    # 描述项加的（七类都 subClassOf Entity），横切关系词的 rdfs:domain 也落在它上面。
    # 计数与成员**两个都断**：只断计数分不清「多了个对的」与「多了个错的」，
    # 只断成员则少一个类不报 —— 两个方向的缺陷各由一条兜住。
    assert len(rows) == 8
    assert {r["c"].rsplit("#", 1)[-1] for r in rows} == {
        "Entity", "Site", "Gateway", "Channel",
        "Device", "Point", "Constraint", "DataSource"}
    assert all(set(r) == {"c"} for r in rows)
    assert all(isinstance(v, str) for r in rows for v in r.values())


def test_sparql_result_is_json_serializable(eng):
    """端点直接把结果塞进 JSON —— 里面不许有 rdflib 对象"""
    rows = eng.sparql("SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 5")
    assert len(rows) == 5
    assert json.loads(json.dumps(rows))


def test_sparql_empty_result_is_empty_list_and_does_not_raise(eng):
    """查询合法但图上无匹配 ⇒ 空列表。这是『查不到』，不是错"""
    rows = eng.sparql(
        "SELECT ?c WHERE { ?c a <http://www.w3.org/2002/07/owl#Class> ;"
        " <http://www.w3.org/2000/01/rdf-schema#label> 'NoSuchClassAtAll' }")
    assert rows == []


# ── 2. 负控：非法查询必须抛 ──

@pytest.mark.parametrize("bad", [
    "SELECT ?s WHERE { ?s ?p",                # 花括号不闭合
    "NOT SPARQL AT ALL",                      # 根本不是查询
    "",                                       # 空串
])
def test_sparql_invalid_query_raises(eng, bad):
    """★ 负控：语法错的查询必须抛异常。

    谁要是把它改成 `except: return []`，这条会红 ——
    「查不到」与「查询写错了」在结果上必须长得不一样，
    否则前端会把语法错误读成"这个本体里没有数据"。
    """
    with pytest.raises(Exception):
        eng.sparql(bad)


# ── 3. 两个出口必须一致：界面上那个数 == 下载的 .owl 里数出来的数 ──

def test_triple_count_equals_reparsed_owl(eng):
    from rdflib import Graph
    reparsed = Graph().parse(data=eng.export_owl(), format="xml")
    assert eng.triple_count() == len(reparsed)


def test_triple_count_equals_reparsed_turtle(eng):
    from rdflib import Graph
    reparsed = Graph().parse(data=eng.export_turtle(), format="turtle")
    assert eng.triple_count() == len(reparsed)


def test_triple_count_equals_reparsed_jsonld(eng):
    """JSON-LD 是第三种序列化（GB/T 48000.3 §5.3 点名 Turtle、JSON-LD）——
    三个出口必须序列化**同一张图**, 不然页面上那个数只在其中两个格式下成立。"""
    from rdflib import Graph
    reparsed = Graph().parse(data=eng.export_jsonld(), format="json-ld")
    assert eng.triple_count() == len(reparsed)


def test_sparql_runs_on_the_same_graph_as_export(eng):
    """端点上跑查询的那张图，就是下载到的那张图 —— 不是另一张长得像的"""
    n = eng.sparql("SELECT (COUNT(*) AS ?n) WHERE { ?s ?p ?o }")[0]["n"]
    from rdflib import Graph
    assert int(n) == len(Graph().parse(data=eng.export_owl(), format="xml"))


# ── 4. 统计数每一个都能在图上复算 ──

def test_rdf_stats_agrees_with_graph(eng):
    from rdflib import RDF, OWL
    g = eng._rdf_graph()
    s = eng.rdf_stats()
    assert s["triples"] == len(g)
    assert s["classes"] == len(set(g.subjects(RDF.type, OWL.Class)))
    assert s["object_properties"] == len(set(g.subjects(RDF.type, OWL.ObjectProperty)))
    assert s["datatype_properties"] == len(set(g.subjects(RDF.type, OWL.DatatypeProperty)))


def test_rdf_stats_is_json_serializable(eng):
    assert json.loads(json.dumps(eng.rdf_stats()))


# ── 5. 钉住「图上没有的东西」—— 正是页面曾经写错的那三个数 ──

def test_datatype_properties_match_declared_spec(eng):
    """数据属性必须与 DATA_PROP_SPEC 声明的**逐一对上**（成员与计数都断）。

    这条原为 `assert ... == 0`，钉的是「页面曾写 Data Properties 22，而导出器
    压根不产生 DatatypeProperty」。2026-09-20 按 GB/T 48000.3 §5.2（本体含对象
    属性与数据属性两类）加了数据属性，0 不再成立 —— 但原意必须守住：**报出来的
    数不许是图上没有的**。改成与声明表对账而非钉死 16：只钉数字的话，加第 17 个
    属性时同样会红，却看不出是"该同步这里"还是"真出错了"。
    """
    from rdflib import RDF, OWL
    from src.ontology import DATA_PROP_SPEC
    got = {str(s).rsplit("#", 1)[-1]
           for s in eng._rdf_graph().subjects(RDF.type, OWL.DatatypeProperty)}
    assert got == set(DATA_PROP_SPEC)          # 多了、少了、换名字都报
    assert eng.rdf_stats()["datatype_properties"] == len(DATA_PROP_SPEC)


def test_namespaces_exclude_unimplemented_ones(eng):
    """页面曾写「命名空间: dgiot:, isa95:, iof:, rdf:, rdfs:」—— 后两个没有实现"""
    ns = eng.rdf_stats()["namespaces"]
    assert "dgiot" in ns
    assert "isa95" not in ns
    assert "iof" not in ns


def test_reported_namespaces_are_actually_bound(eng):
    """报出去的前缀必须在图上真的绑定了 —— 不许报一个没绑的"""
    bound = {p for p, _ in eng._rdf_graph().namespaces()}
    assert set(eng.rdf_stats()["namespaces"]) <= bound


# ── 6. 端点级：HTTP 状态码必须能区分「查不到」与「查询写错了」 ──
#
# ⚠️ 这一节只做「端点与自己一致」的比较，不拿本文件的 eng 去比。
# 原因（实测）：`build_engine()` 是**两个数据源二选一** ——
#     load_from_parse() 有数据就用库里的，库空才退回 build_edge_ontology() 种子。
# 所以同一进程里前后两次 build_engine() 可以给出不同的图（实测 395 vs 367），
# 三元组数**不是常数**。判据只能是「同一引擎的两个出口互相对得上」。
# 这也正是页面上那个数必须现算、不许手写的根本原因。

@pytest.fixture(scope="module")
def client():
    """只装 graphrag 路由的最小 app（房内惯例，见 test_tenant_scope._client）

    不导 src.main —— 那会顺带注册全部插件，给别的用例留状态。
    """
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.auth import get_current_user
    from src.web import graphrag_api

    app = FastAPI()
    app.include_router(graphrag_api.router)
    app.dependency_overrides[get_current_user] = lambda: {"id": "t", "role": "admin"}
    return TestClient(app)


def test_endpoint_sparql_ok(client):
    r = client.post("/api/graphrag/sparql",
                    json={"query": "SELECT (COUNT(*) AS ?n) WHERE { ?s ?p ?o }"})
    assert r.status_code == 200
    assert int(r.json()["results"][0]["n"]) > 0


def test_endpoint_sparql_count_matches_endpoint_stats(client):
    """端点自报的 triples == 在端点本身上跑 COUNT(*) —— 同一引擎，两个出口"""
    stats = client.get("/api/graphrag/rdf/stats").json()
    n = client.post("/api/graphrag/sparql",
                    json={"query": "SELECT (COUNT(*) AS ?n) WHERE { ?s ?p ?o }"}).json()
    assert int(n["results"][0]["n"]) == stats["triples"]


def test_endpoint_sparql_bad_query_is_400_not_200(client):
    """★ 负控（端点级）：语法错的查询必须 400。

    不许 200 + `results: []` —— 那样前端一个语法错误与"查询成功但没数据"长得一样。
    """
    r = client.post("/api/graphrag/sparql", json={"query": "SELECT ?s WHERE { ?s ?p"})
    assert r.status_code == 400
    assert "detail" in r.json()


def test_endpoint_sparql_empty_query_is_rejected_not_answered(client):
    """空串被 pydantic 的 min_length=1 拦成 422 —— 也是错误，不是 200"""
    r = client.post("/api/graphrag/sparql", json={"query": ""})
    assert r.status_code == 422


def test_endpoint_rdf_stats_agrees_with_downloaded_owl(client):
    """端点自报的三元组数 == 从 /ontology.owl 下载下来数出来的数"""
    from rdflib import Graph
    s = client.get("/api/graphrag/rdf/stats")
    assert s.status_code == 200
    owl = client.get("/api/graphrag/ontology.owl")
    assert owl.status_code == 200
    assert s.json()["triples"] == len(Graph().parse(data=owl.text, format="xml"))


def test_endpoint_rdf_stats_has_no_unimplemented_namespace(client):
    ns = client.get("/api/graphrag/rdf/stats").json()["namespaces"]
    assert "isa95" not in ns and "iof" not in ns
