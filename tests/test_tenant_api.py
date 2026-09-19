# -*- coding: utf-8 -*-
"""租户端点门禁 —— 收敛到 `_Role` 之后

**为什么需要这一道。** 2026-09-17 之前，`web/tenant_api.py` 的 6 个端点读的是
`local.db` 的 `tenants` / `user_roles` 两张表，而数据面（`auth._resolve_tenant`
→ JWT → 各处租户过滤）读的是 Parse 的 `_Role`。实测：

    local.db `tenants`    = 0 行   ← 端点在读
    local.db `user_roles` = 0 行   ← 全仓无人读
    Parse   `_Role`       = 6 行   ← 系统照常按这 6 个租户隔离

⇒ 端点恒返空列表。而**「端点返回 200」与「端点在读真数据」在报告里长得一模一样**
（[[criterion-must-report-what-it-checked]] 第十五层：域选窄了照样打绿灯）。
本文件就是执行者：正控（建 → 看得见 → **数据面认它**）+ 负控（该拒的必须拒）。

⚠️ 全部跑在临时库上（`tmp_parse_db`），不碰 `data/parse.db`。
"""
import json

import pytest
from fastapi import HTTPException

import src.parse_db as parse_db
import src.parse_lite as parse_lite
import src.web.tenant_api as tenant_api


# ══════════════════════════════════════════════════════════════════
#  夹具：临时 parse 库（与 test_tenant_scope.py 同款，**绝不**碰 data/parse.db）
# ══════════════════════════════════════════════════════════════════

@pytest.fixture
def tmp_parse_db(tmp_path, monkeypatch):
    """换掉 parse_db 的模块全局后端 + 清 SCHEMA_CACHE，再 `_do_init_db()` 建表种子。

    ⚠️ 换库还不够，必须连 `SCHEMA_CACHE` 一起清 —— `ensure_table` 靠它短路，
    不清它第二个用例起在新库上根本没建过表，报 `no such table`，
    而**首个用例通过、其余全红**这种「一半绿」最容易把人骗去改被测代码。
    """
    be = parse_db.SQLiteBackend(str(tmp_path / "parse.db"))
    be.connect()
    monkeypatch.setattr(parse_db, "_backend", be)
    monkeypatch.setattr(parse_lite, "SCHEMA_CACHE", {})
    parse_lite._do_init_db()
    try:
        yield be
    finally:
        be.close()


def _mk_user(name: str) -> str:
    return parse_lite.parse_create_user({"username": name, "password": "x"})["objectId"]


# ══════════════════════════════════════════════════════════════════
#  甲 · 端点清单从路由数出来（不手写 —— 手写的清单单向腐烂）
# ══════════════════════════════════════════════════════════════════

def test_端点集合从路由数出来():
    """这批端点用户裁为「对外承诺过」⇒ 承诺面先钉死。

    手写清单会单向腐烂；从 `router.routes` 数出来的清单与实现对同源。
    """
    paths = {r.path for r in tenant_api.router.routes}
    assert paths == {"/api/tenants", "/api/tenants/{tenant_id}",
                     "/api/roles", "/api/roleuser"}, paths


# ══════════════════════════════════════════════════════════════════
#  乙 · 正控：看得见真数据、建得出来、数据面认它
# ══════════════════════════════════════════════════════════════════

class TestReadsRealRoles:

    def test_列出真实租户而不是空列表(self, tmp_parse_db):
        """★ 这是「空列表」那个 bug 的直接反证。"""
        slugs = {t["slug"] for t in tenant_api.list_tenants()["tenants"]}
        assert {"default", "oil-monitor"} <= slugs, "必须看得见 _Role 里的种子租户"

    def test_返回字段名一个不少(self, tmp_parse_db):
        """**字段名一个不减** —— 对外承诺过的端点最容易被静默改窄的地方。

        抄的是退役的 `tenants` 表列名 + `parent_name`（唯一一个不在 `_Role` 列里的
        返回字段，最难注意到、最容易在改写时丢掉）。
        """
        承诺 = {"id", "tenant_id", "name", "slug", "parent_id", "contact",
                "phone", "status", "max_devices", "max_users", "created_at",
                "parent_name"}
        got = set(tenant_api.list_tenants()["tenants"][0])
        assert 承诺 <= got, f"缺字段: {承诺 - got}"

    def test_父租户名带得出来(self, tmp_parse_db):
        """原实现是 LEFT JOIN 自表取 `parent_name`，改写后容易变成恒 None。"""
        items = {t["tenant_id"]: t for t in tenant_api.list_tenants()["tenants"]}
        assert items["oil-monitor"]["parent_name"] == "默认租户"

    def test_roles_键名逐字保持(self, tmp_parse_db):
        r = tenant_api.list_roles()["roles"][0]
        assert set(r) == {"objectId", "name", "slug", "parent"}


class TestRoundTrip:

    def test_建出来的租户当场被数据面认(self, tmp_parse_db):
        """★★ 这条是本次合一的**目的**，不是附带检查。

        改之前 `POST /api/tenants` 造出来的租户只落在那张没人读的 `tenants` 表里
        ⇒ 用户被分配到它之后 `_resolve_tenant` 依然解析不到
        ⇒「创建成功但什么都看不到」。
        """
        tenant_api.create_tenant({"tenant_id": "t_new", "name": "新租户", "slug": "t-new"})
        uid = _mk_user("u_new")
        parse_lite.parse_assign_role(uid, "t_new")
        assert parse_lite.parse_tenants_of_username("u_new")["tenant_id"] == "t_new"

    def test_改租户不抹掉_data_里别的键(self, tmp_parse_db):
        """★ `data` 里**已经有内容**（实测种子里是 `desc` / `department`）。

        更新必须**合并**。整体覆盖的写法在这条上必红，而它跑起来一切正常
        —— 只有精确到键的断言逮得住。
        """
        # 先按真实形态给种子里那行补上内容（`_do_init_db` 建的是空 data）
        db = parse_lite.get_db()
        db.execute("UPDATE _Role SET data = ? WHERE objectId = ?",
                   (json.dumps({"desc": "设备完整性监测", "department": True}), "oil-monitor"))
        db.commit(); db.close()

        tenant_api.update_tenant("oil-monitor", {"status": "disabled"})

        data = json.loads(parse_lite.parse_get_role("oil-monitor")["data"])
        assert data["department"] is True, "整体覆盖会把它抹掉"
        assert data["desc"] == "设备完整性监测", "整体覆盖会把它抹掉"
        assert data["status"] == "disabled"

    def test_slug_落在_alias_列且不另存一份(self, tmp_parse_db):
        """slug ≡ `_Role.alias`（实测 6 行的 alias 逐行等于 objectId）。

        另存一份进 `data` 就是「同一事实两处」—— 本仓最警惕的形态。
        """
        tenant_api.update_tenant("oil-monitor", {"slug": "oil-x"})
        row = parse_lite.parse_get_role("oil-monitor")
        assert row["alias"] == "oil-x"
        assert "slug" not in json.loads(row["data"]), "不许在 data 里另存一份"

    def test_删除连带清掉用户关联(self, tmp_parse_db):
        """★ 孤儿关联行会让租户解析指向一个**已经不存在的角色**。"""
        uid = _mk_user("u_del")
        parse_lite.parse_assign_role(uid, "oil-monitor")
        assert parse_lite.parse_tenants_of_username("u_del")["tenant_id"] == "oil-monitor"

        tenant_api.delete_tenant("oil-monitor")

        assert parse_lite.parse_get_role("oil-monitor") is None
        assert parse_lite.parse_tenants_of_username("u_del")["tenant_id"] == "default", \
            "关联行没清 ⇒ 解析到已删除的角色"


# ══════════════════════════════════════════════════════════════════
#  丙 · 负控（「只会变绿的检查等于没有检查」）
# ══════════════════════════════════════════════════════════════════

class TestNegativeControls:

    def test_不许删默认租户_且拒了之后它还在(self, tmp_parse_db):
        """只断言 400 不够 —— 还要断言**拒绝之后角色没被删掉**。

        否则一个「先删再抛 400」的实现也会绿。
        """
        with pytest.raises(HTTPException) as ei:
            tenant_api.delete_tenant("default")
        assert ei.value.status_code == 400
        assert parse_lite.parse_get_role("default") is not None, "拒绝之后必须还在"

    def test_roleuser_传不存在的用户必须报错(self, tmp_parse_db):
        """★ 改之前往一张没人读的表里写，写什么都不会被发现；现在写的是**鉴权取数处**。

        静默写一行永远读不到的记录 + 返 `{"status":"assigned"}`，
        就是把一次失败报成成功。
        """
        with pytest.raises(HTTPException) as ei:
            tenant_api.assign_user_role({"user_id": "no-such-user", "tenant_id": "default"})
        assert ei.value.status_code == 400

    def test_roleuser_传不存在的租户必须报错(self, tmp_parse_db):
        with pytest.raises(HTTPException) as ei:
            tenant_api.assign_user_role({"user_id": _mk_user("u3"), "tenant_id": "no-such-role"})
        assert ei.value.status_code == 400

    def test_roleuser_缺字段必须报错而不是写空行(self, tmp_parse_db):
        """`body.get("user_id")` 为 None 时原先会往表里插一行 NULL 关联。"""
        with pytest.raises(HTTPException) as ei:
            tenant_api.assign_user_role({})
        assert ei.value.status_code == 400

    def test_roleuser_重复分配不堆重复行(self, tmp_parse_db):
        """重复行会让 `_tenant_bundle` 对一个其实只有一个角色的用户报「多角色」。

        假警报稀释真警报 —— 而 `_tenant_bundle` 那条警告是本仓唯一能让人**看见**
        多归属的地方，被稀释掉就等于关掉。
        """
        uid = _mk_user("u_dup")
        tenant_api.assign_user_role({"user_id": uid, "tenant_id": "default"})
        tenant_api.assign_user_role({"user_id": uid, "tenant_id": "default"})

        db = parse_lite.get_db()
        n = db.execute("SELECT count(*) AS n FROM _Join_users_Role WHERE userId = ?",
                       (uid,)).fetchone()["n"]
        db.close()
        assert n == 1, f"重复分配堆了 {n} 行"

    def test_重名租户返400而不是500(self, tmp_parse_db):
        """`_Role.name` 有 UNIQUE 约束（退役的 `tenants.name` 没有）——
        不先拦就是约束错 → 500。"""
        with pytest.raises(HTTPException) as ei:
            tenant_api.create_tenant({"tenant_id": "t_x", "name": "默认租户"})
        assert ei.value.status_code == 400

    def test_短标识撞车返400(self, tmp_parse_db):
        with pytest.raises(HTTPException) as ei:
            tenant_api.create_tenant({"tenant_id": "t_y", "name": "另一个", "slug": "default"})
        assert ei.value.status_code == 400

    def test_改短标识撞车返400(self, tmp_parse_db):
        """`alias` 在表上没有唯一约束 ⇒ 唯一性只能在这里守。不守就是静默变歧义。"""
        with pytest.raises(HTTPException) as ei:
            tenant_api.update_tenant("oil-monitor", {"slug": "default"})
        assert ei.value.status_code == 400

    def test_改不存在的租户返404(self, tmp_parse_db):
        with pytest.raises(HTTPException) as ei:
            tenant_api.update_tenant("no-such-role", {"name": "x"})
        assert ei.value.status_code == 404

    def test_不存在的租户加撞车短标识仍返404(self, tmp_parse_db):
        """★ **存在性先于一切** —— 这条是拿顺序当被测对象，不是拿结果。

        上一条（只传 `name`）**逮不住顺序错**：slug 撞车检查根本不会触发。
        必须让**两个条件同时成立**才分辨得出来 —— 同一个撞车输入，
        租户存在 ⇒ 400（见上一条 `test_改短标识撞车返400`），
        租户不存在 ⇒ **必须 404**。

        反过来的话返 400，而 400 在讲一件与调用方意图无关的事
        （「这个短标识被别人占了」）—— 调用方连租户都指错了，
        却收到一条让他去改短标识的提示。
        """
        with pytest.raises(HTTPException) as ei:
            tenant_api.update_tenant("no-such-role", {"slug": "default"})
        assert ei.value.status_code == 404, "存在性必须排在撞车检查之前"

    def test_parent_id_不许指向自己(self, tmp_parse_db):
        with pytest.raises(HTTPException) as ei:
            tenant_api.update_tenant("oil-monitor", {"parent_id": "oil-monitor"})
        assert ei.value.status_code == 400

    def test_roles_不列非_active(self, tmp_parse_db):
        """原实现是 `WHERE status='active'` —— 别在改写时把这层过滤丢掉。"""
        assert "oil-monitor" in {r["objectId"] for r in tenant_api.list_roles()["roles"]}
        tenant_api.update_tenant("oil-monitor", {"status": "disabled"})
        assert "oil-monitor" not in {r["objectId"] for r in tenant_api.list_roles()["roles"]}


# ══════════════════════════════════════════════════════════════════
#  丁 · 判据自己坏了要报红：坏输入不许静默变成「正常数据」
# ══════════════════════════════════════════════════════════════════

class TestBadInputNotSilent:

    def test_data_列坏掉时不炸也不编(self, tmp_parse_db):
        """`data` 不是合法 JSON 时返空 dict —— 既不抛，也不**编出内容**。

        照 [[missing-input-takes-a-silent-default]] A 族：取缺省值可以，
        但要能看出它是缺省值（`status` 的 "active" 来自**列默认**，不是这里编的）。
        """
        db = parse_lite.get_db()
        db.execute("UPDATE _Role SET data = ? WHERE objectId = ?", ("{不是 JSON", "oil-monitor"))
        db.commit(); db.close()

        item = {t["tenant_id"]: t for t in tenant_api.list_tenants()["tenants"]}["oil-monitor"]
        assert item["slug"] == "oil-monitor", "alias 是独立列，不受 data 坏掉影响"
        assert item["status"] == "active", "缺省来自列默认，与退役表的列默认一致"

    def test_data_是_dict_时也吃(self, tmp_parse_db, monkeypatch):
        """**跨后端**：SQLite 返 str、PG 的 jsonb 可能返 dict。

        把 `_row_get` 造出来一个 dict 型 data 喂进去 —— 不处理的话这条会炸在
        `json.loads(dict)` 上，而**只在 PG 上发生**，本机走 SQLite 永远看不到。
        """
        monkeypatch.setattr(tenant_api, "_all_roles",
                            lambda: [{"objectId": "z", "name": "Z", "alias": "z",
                                      "parent_id": None, "createdAt": "2026-01-01",
                                      "data": {"status": "frozen", "max_users": 7}}])
        item = tenant_api.list_tenants()["tenants"][0]
        assert item["status"] == "frozen"
        assert item["max_users"] == 7
