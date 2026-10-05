# ============================================================
# GraphRAG 实体索引新鲜度 —— 刚建完的对象必须立刻可搜、可问
#
# 回归: 索引只在 `GraphRAG.__init__` 里建过**一次**，写路径从不重建它。
# 后果: 经 `/aip/objects/*` 建的对象，在 `/search`(默认 semantic) 与 `/ask`(auto)
# 里**查不到，直到进程重启** —— 落库成功、界面正常，只是问答看不见。静默。
# 与 `load_from_parse` 修掉的那个失败形同族（同一份数据的第二个载体）。
#
# 测试自带前件: 断言「索引**先于**对象建好」成立。不写它的话，将来次序一变
# （比如谁把建索引挪到写之后），这条测试会**恒真**而不是变红。
# ============================================================
import sqlite3

import pytest

PT = "pt_fresh_01"
BARE = "pt_fresh_bare"
DEV = "dev_fresh_01"
ALARM = {"hh": 8.0, "high": 6.0, "low": 0.5, "ll": 0.2}
VALUE = 7.25      # 越上限 6.0、未及高高限 8.0 ⇒ status "high" / margin 1.25


class _DDLOnlyBackend:
    """只干一件事: 把 parse_lite **自己的**建表语句落到临时库 —— DDL 不手抄一份。

    手抄的 DDL 与生产 DDL 一旦分叉，测试就在测一个不存在的表结构。
    """

    placeholder = "?"

    def __init__(self, conn):
        self._conn = conn

    def create_table(self, name, cols):
        self._conn.execute("CREATE TABLE IF NOT EXISTS %s (%s)" % (name, cols))
        self._conn.commit()


@pytest.fixture()
def world(tmp_path, monkeypatch):
    """临时 parse 库 + 临时遥测库 + 关 LLM + 假用户 —— 不连 PG、不绑端口。"""
    import src.parse_lite as pl

    parse_db = str(tmp_path / "parse.db")
    tele_db = str(tmp_path / "telemetry.db")

    monkeypatch.setattr(pl, "get_db", lambda: sqlite3.connect(parse_db))
    monkeypatch.setattr(pl, "get_backend",
                        lambda: _DDLOnlyBackend(sqlite3.connect(parse_db)))
    monkeypatch.setattr(pl, "now_iso", lambda: "2026-09-23T00:00:00")
    pl._do_init_db()          # 建表语句的唯一来源: parse_lite 自己

    conn = sqlite3.connect(tele_db)
    conn.execute("CREATE TABLE telemetry (ts TEXT, device_id TEXT, point_id TEXT, "
                 "point_name TEXT, value REAL, unit TEXT, quality TEXT)")
    conn.execute("INSERT INTO telemetry VALUES (?,?,?,?,?,?,?)",
                 ("2026-09-23T10:00:00", DEV, PT, "闭环验证套压", VALUE, "MPa", "good"))
    conn.commit()
    conn.close()

    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.auth import get_current_user
    from src.web import graphrag_api as gapi

    # 答复走 _format_local_answer（本地模式），别让环境变量里的 key 建出真调用器
    monkeypatch.setattr(gapi, "_llm_kwargs", lambda: {"telemetry_db": tele_db})
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    saved = (gapi._graphrag, gapi._engine)
    gapi._graphrag = None     # 本测试内强制重建，别吃别的测试留下的实例
    gapi._engine = None

    app = FastAPI()
    app.include_router(gapi.router)
    app.dependency_overrides[get_current_user] = lambda: {"id": "t", "role": "admin"}
    client = TestClient(app)

    yield gapi, client

    gapi._graphrag, gapi._engine = saved


def _model_the_chain(client):
    """走真路由建一条 site→gateway→channel→device→point，再给测点设阈值。"""
    for layer, oid, name, props in (
            ("site", "site_fresh", "闭环验证站", {}),
            ("gateway", "gw_fresh", "HX-GW-01", {"ip": "192.0.2.77", "site": "site_fresh"}),
            ("channel", "ch_fresh", "HX-A11通道",
             {"gateway": "gw_fresh", "protocol": "modbus_tcp"}),
            ("device", DEV, "HX-RTU-01", {"channel": "ch_fresh", "type": "rtu"}),
            ("point", PT, "闭环验证套压",
             {"device": DEV, "unit": "MPa", "category": "遥测"})):
        r = client.post("/api/graphrag/aip/objects/create",
                        json={"layer": layer, "id": oid, "name": name, "props": props})
        assert r.status_code == 200, r.text
        assert r.json()["persisted"] is True, r.text

    r = client.put("/api/graphrag/aip/objects/%s" % PT, json={"alarm": ALARM})
    assert r.status_code == 200, r.text


# ── 那座回归 ──
def test_object_created_after_index_build_is_searchable_and_answerable(world):
    gapi, client = world
    rag, _engine = gapi._get_rag()

    # 前件: 索引**先于**对象建好 —— 这正是要测的那个次序
    assert PT not in rag._index._docs, "前件不成立: 建对象之前索引里就已经有它了"
    n_before = len(rag._index)

    _model_the_chain(client)

    assert PT in rag._index._docs, \
        "写路径没有重建索引 —— 新建的对象在 /search 与 /ask 里查不到，直到重启"
    assert len(rag._index) == n_before + 5, (len(rag._index), n_before)

    # 默认 semantic 路（走索引）
    r = client.get("/api/graphrag/search", params={"q": "闭环验证套压"})
    assert r.status_code == 200, r.text
    assert PT in [h["id"] for h in r.json()["results"]], r.json()

    # /ask auto 路（整句自然语言）
    r = client.post("/api/graphrag/ask", json={"question": "闭环验证套压 现在安全吗？"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert (body.get("entity") or {}).get("id") == PT, body
    assert (body.get("verdict") or {}).get("status") == "high", body
    assert (body.get("verdict") or {}).get("margin") == 1.25, body


# ── 阈值穿过落库往返，且两个引擎给出同一个判定 ──
def test_verdict_survives_the_persist_roundtrip(world):
    gapi, client = world
    _rag, engine = gapi._get_rag()
    _model_the_chain(client)

    # 负控: 没有阈值/量程的测点必须答 unknown，不是一个假的安全
    r = client.post("/api/graphrag/aip/objects/create",
                    json={"layer": "point", "id": BARE, "name": "闭环验证裸测点",
                          "props": {"device": DEV, "unit": "MPa"}})
    assert r.status_code == 200, r.text

    v_over = engine.judge_point(PT, VALUE)
    assert v_over["status"] == "high" and v_over["safe"] is False, v_over
    assert v_over["limit"] == 6.0 and v_over["margin"] == 1.25, v_over

    v_ok = engine.judge_point(PT, 5.0)
    assert v_ok["status"] == "ok" and v_ok["safe"] is True, v_ok
    assert v_ok["margin"] == 1.0, v_ok

    v_none = engine.judge_point(BARE, VALUE)
    assert v_none["status"] == "unknown" and v_none["safe"] is None, v_none

    # 回读: 库里非空 ⇒ build_engine 走 load_from_parse，不回退硬编码种子
    from src.ontology import build_engine
    eng2 = build_engine()
    assert PT in eng2.points, "回读后测点没了"
    assert eng2.points[PT].alarm == ALARM, eng2.points[PT].alarm
    assert eng2.judge_point(PT, VALUE) == v_over, "两个引擎对同一个值给出了不同判定"
