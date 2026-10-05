# ============================================================
# 本体持久化往返测试 — sync_to_parse / load_from_parse 必须成对
#
# 这是回归测试: 修之前引擎只从硬编码种子构建, 用户落库的对象
# 在服务重启后再没人读回来 —— 落库成功、界面正常、然后静默消失。
# ============================================================
import json
import sqlite3

import pytest

from src.ontology import (Channel, Constraint, DataSource, Device, Gateway,
                          Link, OntologyEngine, Point, Site)

# 与 parse_lite.ensure_schema 里的建表语句同形
SCHEMA = {
    "ontology_site": "objectId TEXT PRIMARY KEY, name TEXT, type TEXT, "
                     "location TEXT, description TEXT, data TEXT DEFAULT '{}', "
                     "createdAt TEXT, updatedAt TEXT",
    "ontology_gateway": "objectId TEXT PRIMARY KEY, name TEXT, ip TEXT, "
                        "site_id TEXT, hostname TEXT, os TEXT, status TEXT, "
                        "installed TEXT, channels TEXT, notes TEXT, "
                        "data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT",
    "ontology_channel": "objectId TEXT PRIMARY KEY, name TEXT, gateway_id TEXT, "
                        "protocol TEXT, endpoint TEXT, status TEXT, config TEXT, "
                        "devices TEXT, data TEXT DEFAULT '{}', createdAt TEXT, "
                        "updatedAt TEXT",
    "ontology_device": "objectId TEXT PRIMARY KEY, name TEXT, channel_id TEXT, "
                       "type TEXT, protocol TEXT, slave_id INTEGER DEFAULT 1, "
                       "manufacturer TEXT, model TEXT, status TEXT, points TEXT, "
                       "data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT",
    "ontology_point": "objectId TEXT PRIMARY KEY, name TEXT, device_id TEXT, "
                      "unit TEXT, description TEXT, register TEXT, alarm TEXT, "
                      "range_min REAL, range_max REAL, category TEXT, "
                      "data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT",
    "ontology_constraint": "objectId TEXT PRIMARY KEY, name TEXT, rule TEXT, "
                           "entity TEXT, severity TEXT, source TEXT, action TEXT, "
                           "enabled INTEGER DEFAULT 1, data TEXT DEFAULT '{}', "
                           "createdAt TEXT, updatedAt TEXT",
    "ontology_datasource": "objectId TEXT PRIMARY KEY, gateway_id TEXT, type TEXT, "
                           "connection TEXT, status TEXT, tag_count INTEGER DEFAULT 0, "
                           "data TEXT DEFAULT '{}', createdAt TEXT, updatedAt TEXT",
    "ontology_link": "objectId TEXT PRIMARY KEY, source_id TEXT, target_id TEXT, "
                     "relation TEXT, description TEXT, data TEXT DEFAULT '{}', "
                     "createdAt TEXT, updatedAt TEXT",
}


def _make_db(path, tables=SCHEMA.keys()):
    conn = sqlite3.connect(path)
    for name in tables:
        conn.execute(f"CREATE TABLE {name} ({SCHEMA[name]})")
    conn.commit()
    conn.close()


@pytest.fixture
def db_path(tmp_path, monkeypatch):
    """每个 get_db() 调用发一条新连接 —— sync_to_parse 会 close() 掉它"""
    path = tmp_path / "parse.db"
    _make_db(path)
    import src.parse_lite as pl
    monkeypatch.setattr(pl, "get_db", lambda: sqlite3.connect(path))
    return path


def _populated_engine() -> OntologyEngine:
    e = OntologyEngine()
    e.register(Site("site1", "示范油田", "oil_field", "某地", "测试站点"))
    e.register(Gateway("gw1", "192.0.2.10", "site1", hostname="GW-01",
                       os="Windows Server 2016", status="online"))
    e.register(Channel("ch1", "gw1", "A11 通道", "a11_tcp", "192.0.2.10:9000",
                       status="running"))
    e.register(Device("dev1", "ch1", "1# 抽油机", type="rtu", slaveid=3,
                      devaddr="868375049863751", product="a1b2c3d4e5"))
    e.register(Point("pt1", "dev1", "油压", unit="MPa",
                     register={"address": 40300, "type": "float32_AB"},
                     alarm={"high": 3.0}, range=[0.0, 6.0], category="遥测"))
    e.register(Constraint("c1", "油压上限", "oil>3.0 → alarm", entity="pt1",
                          rule_kind="validation"))
    e.register(DataSource("ds1", "gw1", "tdengine", "taos://192.0.2.10:6030",
                          tag_count=42, tables=["t_oil"]))
    e.register(Link("L1", "dev1", "gw1", "monitored_by", "设备归属网关",
                    props={"src": "manual"}))
    return e


# ── 核心往返 ──
def test_roundtrip_restores_all_layers(db_path):
    """落库再回读到新引擎 —— 八层都要回来

    这是那个 bug 的正面: 修之前第二次读回来的东西是空的(种子除外)。
    """
    src = _populated_engine()
    src.sync_to_parse()

    dst = OntologyEngine()
    r = dst.load_from_parse()

    assert r["loaded"] == 8, r
    assert r["skipped"] == 0, r
    assert set(dst.sites) == {"site1"}
    assert set(dst.gateways) == {"gw1"}
    assert set(dst.channels) == {"ch1"}
    assert set(dst.devices) == {"dev1"}
    assert set(dst.points) == {"pt1"}
    assert set(dst.constraints) == {"c1"}
    assert set(dst.datasources) == {"ds1"}
    assert set(dst.links) == {"L1"}
    assert dst.sites["site1"].name == "示范油田"
    assert dst.points["pt1"].register["address"] == 40300
    assert dst.links["L1"].relation == "monitored_by"


def test_roundtrip_preserves_fields_absent_from_expanded_columns(db_path):
    """只存在于 data 列里的字段必须活下来

    Device.devaddr / Device.product / Point.range / Constraint.rule_kind /
    DataSource.tables / Link.props 都**没有**对应的展开列。如果有人图省事
    改成照展开列重建, 这条会红 —— 而 devaddr/product 一丢, 这条设备的
    数据就发不到中枢, 且是静默的(见 Device docstring)。
    """
    src = _populated_engine()
    src.sync_to_parse()

    dst = OntologyEngine()
    dst.load_from_parse()

    assert dst.devices["dev1"].devaddr == "868375049863751"
    assert dst.devices["dev1"].product == "a1b2c3d4e5"
    assert dst.points["pt1"].range == [0.0, 6.0]
    assert dst.constraints["c1"].rule_kind == "validation"
    assert dst.datasources["ds1"].tables == ["t_oil"]
    assert dst.links["L1"].props == {"src": "manual"}


def test_roundtrip_survives_second_generation(db_path):
    """连做两轮 sync/load, 内容不衰减 —— 确认不是一次性巧合"""
    src = _populated_engine()
    src.sync_to_parse()
    mid = OntologyEngine(); mid.load_from_parse()
    mid.sync_to_parse()
    dst = OntologyEngine(); dst.load_from_parse()
    assert dst.to_dict()["devices"]["dev1"]["devaddr"] == "868375049863751"
    assert dst.to_dict()["points"]["pt1"]["range"] == [0.0, 6.0]


# ── 空库与坏数据 ──
def test_empty_db_loads_nothing(db_path):
    """一条都没有 → loaded=0, 调用方据此退回示例种子"""
    r = OntologyEngine().load_from_parse()
    assert r["loaded"] == 0 and r["skipped"] == 0


def test_bad_row_skipped_not_fatal(db_path):
    """一行坏数据只跳过 —— 不该让整个本体加载失败"""
    good = _populated_engine()
    good.sync_to_parse()
    conn = sqlite3.connect(db_path)
    conn.execute("INSERT INTO ontology_site (objectId, data) VALUES (?,?)",
                 ("broken", "{这不是 JSON"))
    conn.execute("INSERT INTO ontology_site (objectId, data) VALUES (?,?)",
                 ("nulled", None))
    conn.commit(); conn.close()

    dst = OntologyEngine()
    r = dst.load_from_parse()
    assert dst.sites["site1"].name == "示范油田"      # 好的还在
    assert "broken" not in dst.sites and "nulled" not in dst.sites
    assert r["skipped"] == 2, r


def test_row_without_id_is_skipped(db_path):
    """data 里没 id 且 objectId 为空 → 跳过, 不用空串当键"""
    conn = sqlite3.connect(db_path)
    conn.execute("INSERT INTO ontology_site (objectId, data) VALUES (?,?)",
                 ("", json.dumps({"name": "孤儿"})))
    conn.commit(); conn.close()
    dst = OntologyEngine()
    r = dst.load_from_parse()
    assert r["loaded"] == 0 and r["skipped"] == 1, r
    assert dst.sites == {}


# ── 与旧版本行的兼容 ──
def test_unknown_key_in_old_row_does_not_crash(db_path):
    """老行里留着已删除字段 → 丢掉该键, 不让 cls(**payload) 炸

    类会改, 行是旧代码写的。一次改名就足以让整个本体加载不出来 ——
    那正是这个函数要防的那类失败。
    """
    conn = sqlite3.connect(db_path)
    conn.execute("INSERT INTO ontology_site (objectId, data) VALUES (?,?)",
                 ("site1", json.dumps({"id": "site1", "name": "老站点",
                                       "legacy_field": "早就删了"})))
    conn.commit(); conn.close()
    dst = OntologyEngine()
    r = dst.load_from_parse()
    assert r["loaded"] == 1 and r["skipped"] == 0, r
    assert dst.sites["site1"].name == "老站点"


def test_missing_key_in_old_row_uses_default(db_path):
    """老行缺新字段 → 落回默认值, 不报错"""
    conn = sqlite3.connect(db_path)
    conn.execute("INSERT INTO ontology_site (objectId, data) VALUES (?,?)",
                 ("site1", json.dumps({"id": "site1", "name": "老站点"})))
    conn.commit(); conn.close()
    dst = OntologyEngine()
    dst.load_from_parse()
    assert dst.sites["site1"].type == "oil_field"      # 数据类默认值


def test_read_failure_keeps_existing_layer(tmp_path, monkeypatch):
    """表读不到时保留该层现有内容, 不清空

    "读失败" 和 "本来就没有" 是两回事: 后者在全新部署下与现有(空)等价,
    前者若也清空, 就把还在内存里的东西误伤了。
    """
    import src.parse_lite as pl
    empty = tmp_path / "no_tables.db"
    sqlite3.connect(empty).close()          # 一个表都没有
    monkeypatch.setattr(pl, "get_db", lambda: sqlite3.connect(empty))

    e = OntologyEngine()
    e.register(Site("site1", "内存里的站点"))
    r = e.load_from_parse()
    assert r["loaded"] == 0
    assert set(e.sites) == {"site1"}        # 没被清空


# ── 生产取值路径 (sqlite3.Row) ──
def test_load_works_with_row_factory(tmp_path, monkeypatch):
    """生产走 DBWrapper(sqlite3.Row), 测试里常给裸连接(tuple) —— 两条都要能读

    取值只认按键的话, 裸连接下会静默读成空: 不报错, 只是什么都没有。
    """
    path = tmp_path / "parse.db"
    _make_db(path)
    src = _populated_engine()
    import src.parse_lite as pl
    monkeypatch.setattr(pl, "get_db", lambda: sqlite3.connect(path))
    src.sync_to_parse()

    def _row_conn():
        c = sqlite3.connect(path)
        c.row_factory = sqlite3.Row
        return c
    monkeypatch.setattr(pl, "get_db", _row_conn)

    dst = OntologyEngine()
    r = dst.load_from_parse()
    assert r["loaded"] == 8, r
    assert dst.devices["dev1"].devaddr == "868375049863751"


# ── 启动决策: 回读优先, 库空才播种 ──
# 下面两条钉的就是原来那个 bug 的所在地 —— 不是 load_from_parse 写错了,
# 而是**从来没有人调用它**。只测 load_from_parse 的话, 把这行调用删掉
# 测试照样全绿。

def test_build_engine_prefers_persisted_over_seed(db_path):
    """库里有数据 → 用库里的, 且不是种子

    种子是演示数据(build_edge_ontology), 若它混进来, 这里会看到种子站点。
    """
    from src.ontology import build_engine

    _populated_engine().sync_to_parse()
    eng = build_engine()

    assert set(eng.sites) == {"site1"}, f"库里只有 site1, 实际 {set(eng.sites)}"
    assert set(eng.devices) == {"dev1"}
    assert eng.devices["dev1"].devaddr == "868375049863751"
    assert eng.sites["site1"].name == "示范油田"


def test_build_engine_falls_back_to_seed_when_db_empty(db_path):
    """全新部署(库空) → 退回示例种子, 保持原有开箱行为"""
    from src.ontology import build_engine

    eng = build_engine()
    counts = eng.health()["counts"]
    assert sum(counts.values()) > 0, "库空时应当有示例种子, 不该是空引擎"
    assert set(eng.sites) != {"site1"}


def test_plugin_runtime_ontology_reads_persisted(db_path):
    """插件拿到的本体必须是**落库的那份**, 不是种子

    这条钉的是第三处入口: PluginManager 原先自己 build_edge_ontology(),
    于是"插件看见的本体"和"API 服务的本体"是两个不同实例 —— 通过 API
    建的对象, 插件永远看不见。两个实例还各自演化, 更难查。
    """
    from src.plugin_runtime import PluginManager

    _populated_engine().sync_to_parse()
    eng = PluginManager().get_ontology()
    assert set(eng.sites) == {"site1"}, f"插件拿到的是 {set(eng.sites)}"
    assert eng.devices["dev1"].devaddr == "868375049863751"
