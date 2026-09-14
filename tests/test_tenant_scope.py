# -*- coding: utf-8 -*-
"""多租户接线门禁 —— 身份 / View 面 / 图库面

**为什么需要这一道。** 底座有三套权限机制：

  · `check_clp`（parse_lite.py:109）—— 有执行者，但类的 CLP 定义全空 ⇒ 恒真
  · `check_acl`（parse_lite.py:133）—— 只在 parse_get 里被调，ACL 全空 ⇒ 恒真
  · `tenant_id` 注入（parse_lite.py 读侧/写侧）—— **连执行者都没有**：
    `user` 是第 3 个位置参数，全仓 0 个调用点传它

于是「权限层是好的」与「权限层从没跑过」在报告里长得一模一样。本文件是执行者。

本仓既有纪律，逐条照办：
  · 端点集合从 `router.routes` **数出来**，不手写清单 —— 手写的清单会单向腐烂
    （memory: criterion-must-have-an-executor / decompose-reported-numbers）
  · 门禁要**自证**：喂必失败的输入，看它真的会红
    （只会变绿的检查等于没有检查）
  · 自证与用例**整条跑在临时库里**，不碰 data/parse.db
    （一个会破坏状态的自证，比没有自证更糟）
"""
import json

import pytest

import src.parse_db as parse_db
import src.parse_lite as parse_lite
from src.parse_lite import (
    _TENANT_EXEMPT,
    _tenant_visible,
    parse_create,
    parse_get,
    parse_query,
)


# ══════════════════════════════════════════════════════════════════
#  夹具：临时 parse 库（**绝不**碰 data/parse.db）
# ══════════════════════════════════════════════════════════════════

@pytest.fixture
def tmp_parse_db(tmp_path, monkeypatch):
    """把 parse_lite 的底层后端换成临时 SQLite，并建出完整的表与种子角色。

    parse_lite.get_db() → parse_db.get_backend() → 模块全局 `_backend`，
    所以换掉那个全局就够了，不必改任何被测代码。

    ⚠️ **换库还不够，必须连 SCHEMA_CACHE 一起换。** 它是 parse_lite 的模块级全局，
    `ensure_table` 靠它短路（`if class_name in SCHEMA_CACHE: return`）——
    不清它，第二个用例起新库上根本没建过表，报 `no such table: View`。
    第一版就是这样：**首个用例通过、其余全红，而根因在夹具不在被测代码** ——
    这种「一半绿」最容易把人骗去改被测代码。
    """
    be = parse_db.SQLiteBackend(str(tmp_path / "parse.db"))
    be.connect()
    monkeypatch.setattr(parse_db, "_backend", be)
    monkeypatch.setattr(parse_lite, "SCHEMA_CACHE", {})
    # 建表 + 种子（_Role default/oil-monitor、_User admin）。
    # 用 _do_init_db 不走 init_db 的 try/except —— 建表失败要当场看见，不能被吞。
    parse_lite._do_init_db()
    try:
        yield be
    finally:
        be.close()


def _user(tenant_id, **kw):
    """最小可用的 user dict —— 形状对齐 auth.get_current_user 的产出"""
    return {"sub": "u_" + str(tenant_id), "role": "user",
            "objectId": "o_" + str(tenant_id), "tenant_id": tenant_id, **kw}


# ══════════════════════════════════════════════════════════════════
#  甲 · 读侧租户判据的语义（纯函数，先钉死语义再钉调用点）
# ══════════════════════════════════════════════════════════════════

class TestTenantVisible:
    """`_tenant_visible` 是读侧租户判据的**唯一**实现。

    语义与 parse_query 的注入式判据逐字一致：**空 = 共享**。
    两个入口（parse_query / parse_get）共用它，所以它错了两边一起错 ——
    这正是要把它钉死成纯函数、单独测的理由。
    """

    def test_无租户的行对所有人可见(self):
        """行的 tenant_id 空 = 共享。存量数据全部如此，这条决定它们是否还看得见"""
        assert _tenant_visible(None, _user("t_a")) is True
        assert _tenant_visible("", _user("t_a")) is True

    def test_同租户可见(self):
        assert _tenant_visible("t_a", _user("t_a")) is True

    def test_跨租户不可见(self):
        assert _tenant_visible("t_b", _user("t_a")) is False

    def test_不传user一律可见(self):
        """未接线路径行为一字不变 —— 这条保证改造是可选、可逆的。

        若哪天有人把它改成 fail-closed，48 个 /api/classes 调用点会当场全空，
        而本用例会先红。
        """
        assert _tenant_visible("t_b", None) is True
        assert _tenant_visible("t_b", {}) is True
        assert _tenant_visible("t_b", {"sub": "x"}) is True

    def test_豁免类清单是共享的(self):
        """身份与模式不属于任何租户。这份清单必须只有一份 —— 两份就会漂"""
        assert "_User" in _TENANT_EXEMPT and "_Role" in _TENANT_EXEMPT
        assert "_Session" in _TENANT_EXEMPT and "_SCHEMA" in _TENANT_EXEMPT


# ══════════════════════════════════════════════════════════════════
#  乙 · View 面：写侧盖章 + 读侧过滤（parse_get 原先**没有任何租户过滤**）
# ══════════════════════════════════════════════════════════════════

class TestViewTenantScope:

    def test_写侧盖章(self, tmp_parse_db):
        """parse_create 传了 user 就自动盖章 —— 新建的 View 必须带 tenant_id"""
        r = parse_create("View", {"name": "A 的组态", "type": "scada"}, user=_user("t_a"))
        row = parse_get("View", r["objectId"])
        assert row is not None
        assert row.get("tenant_id") == "t_a"

    def test_读侧按id也过滤(self, tmp_parse_db):
        """**这是原先最大的洞。** parse_get 只查 objectId + 走一个恒真的 ACL，
        所以 /api/views/{id} 的越权读、越权删全靠「没人知道 id」。
        """
        oid = parse_create("View", {"name": "A 的组态"}, user=_user("t_a"))["objectId"]

        assert parse_get("View", oid, user=_user("t_a")) is not None, "同租户应当取得到"
        assert parse_get("View", oid, user=_user("t_b")) is None, "跨租户必须取不到"

    def test_不传user时行为不变(self, tmp_parse_db):
        """兼容：48 个 /api/classes 调用点都不传 user，不能因这次改动变空"""
        oid = parse_create("View", {"name": "A 的组态"}, user=_user("t_a"))["objectId"]
        assert parse_get("View", oid) is not None

    def test_存量无租户的行是共享的(self, tmp_parse_db):
        """不带 user 建出来的行没有 tenant_id —— 它必须仍然对所有租户可见，
        否则这次改造一上线，所有历史数据当场看不见。
        """
        oid = parse_create("View", {"name": "存量"})["objectId"]
        assert parse_get("View", oid, user=_user("t_a")) is not None
        assert parse_get("View", oid, user=_user("t_b")) is not None

    def test_列表也按租户筛(self, tmp_parse_db):
        parse_create("View", {"name": "A 的"}, user=_user("t_a"))
        parse_create("View", {"name": "B 的"}, user=_user("t_b"))

        names_a = {r["name"] for r in parse_query("View", {"limit": 100}, user=_user("t_a"))["results"]}
        assert "A 的" in names_a and "B 的" not in names_a

    def test_身份类不参与租户过滤(self, tmp_parse_db):
        """_Role 是租户表自己 —— 给它加过滤会把租户解析本身锁死"""
        parse_create("_Role", {"name": "一些角色"})
        r = parse_query("_Role", {"limit": 100}, user=_user("t_a"))
        assert any(x.get("name") == "一些角色" for x in r["results"])


# ══════════════════════════════════════════════════════════════════
#  丙 · 身份：JWT 与会话两条路必须给出同一个租户
# ══════════════════════════════════════════════════════════════════

def _request_with_token(token):
    from starlette.requests import Request
    return Request({"type": "http", "method": "GET", "path": "/",
                    "headers": [(b"sessiontoken", token.encode())]})


class TestIdentityCarriesTenant:
    """不修这一层的后果：前端把 JWT 塞在 sessionToken 头里，verify_token 直接成功
    ⇒ `_user_from_session`（唯一带 tenant_id 的分支）**对前端永不触发** ⇒
    前端请求里 user.tenant_id 恒为 None ⇒ 下面那层过滤拿不到输入，等于没接。
    """

    def test_jwt往返带租户(self):
        from src.auth import create_token, verify_token
        t = create_token("alice", "admin", "t_a")
        assert verify_token(t).get("tenant_id") == "t_a"

    def test_不传租户时不写该字段(self):
        """向后兼容：老调用方签名不变"""
        from src.auth import create_token, verify_token
        assert "tenant_id" not in verify_token(create_token("alice", "admin"))

    def test_老token经get_current_user补齐到真实租户(self, tmp_parse_db):
        """签发时没带租户的老令牌，取用时补齐成**真实租户**。

        补它的理由不是兼容，是**同形** —— 同一个人的 JWT 与会话两条路
        必须给出同一个租户，否则换种登录方式就看到不同数据。
        """
        import asyncio
        from src.auth import create_token, get_current_user
        from src.parse_lite import parse_create_user, parse_assign_role
        uid = parse_create_user({"username": "alice", "password": "x"})["objectId"]
        parse_assign_role(uid, "oil-monitor")          # 种子角色之一

        old = create_token("alice", "user")            # 老形制：payload 里没有 tenant_id
        u = asyncio.get_event_loop().run_until_complete(
            get_current_user(_request_with_token(old)))
        assert u["tenant_id"] == "oil-monitor", "必须补出这个用户真正的角色/租户"

    def test_无角色用户落到default(self, tmp_parse_db):
        import asyncio
        from src.auth import create_token, get_current_user
        from src.parse_lite import parse_create_user
        parse_create_user({"username": "bob", "password": "x"})   # 不分配角色

        old = create_token("bob", "user")
        u = asyncio.get_event_loop().run_until_complete(
            get_current_user(_request_with_token(old)))
        assert u["tenant_id"] == "default"

    def test_解析失败不静默放行(self, monkeypatch):
        """**这条是自证。** `_resolve_tenant` 曾经在异常时返回空串 ——
        而空串在 `_tenant_visible` 里正好读作「不传租户 = 不过滤」，
        于是「查角色表出错」静默变成「放行全部」：一次数据库抖动就等于关掉隔离。

        喂一个必炸的解析（表不存在）进去，它必须**回落成 default**、不许回空。
        """
        import src.auth as auth

        def _boom(_username):
            raise RuntimeError("模拟角色表不可用")
        monkeypatch.setattr(parse_lite, "parse_tenants_of_username", _boom)

        got = auth._resolve_tenant("whoever")
        assert got, "解析失败绝不能返回假值 —— 假值在消费侧等于取消过滤"
        assert got == "default"

    def test_解析租户只有一份实现(self):
        """两个租户来源正是这次的病根之一。钉住：auth 不自己查 _Role 表。"""
        import inspect
        import src.auth as auth
        src = inspect.getsource(auth._resolve_tenant)
        assert "parse_tenants_of_username" in src, "必须复用 parse_lite 的那份查询"
        assert "_Join_users_Role" not in src, "不许在 auth 里另写一份角色查询"


# ══════════════════════════════════════════════════════════════════
#  丁 · 覆盖面自查：接线是「每处都接」，不是「接了几处」
# ══════════════════════════════════════════════════════════════════

def _calls_carrying_user(src_text, class_name):
    """按 AST 找出 parse_*(class_name, ...) 调用，报出每处有没有 user=。

    **为什么不用正则**：第一版正则在 `_json.dumps({"type": vtype})` 的**第一个**
    `)` 就收尾，把两处已经接好的报成未接；第二版把 `node.keywords` 取出的
    `{"user"}` 拿去和 `"user=user"` 比，12 处全报未接。
    —— 判据自己也会烂，所以它必须能自证（见 test_判据自证）。
    """
    import ast
    out = []
    for node in ast.walk(ast.parse(src_text)):
        if not isinstance(node, ast.Call):
            continue
        f = node.func
        if not isinstance(f, ast.Name) or not f.id.startswith("parse_"):
            continue
        if not node.args:
            continue
        a0 = node.args[0]
        if not (isinstance(a0, ast.Constant) and a0.value == class_name):
            continue
        out.append((node.lineno, f.id, "user" in {k.arg for k in node.keywords}))
    return sorted(out)


class TestViewApiCoverage:
    """view_api.py 是一个整体：漏一处 = 那一个端点仍可越权。

    漏的后果不是「少一层防护」，是**具体某个洞还开着** —— `parse_get` 漏了就是
    `/api/views/{id}` 越权读，`parse_delete` 漏了就是任何人可删任何视图。
    所以这条必须按「每一处」判，不能按「有没有做过这件事」判。
    （memory: assertion-granularity-decides-detection）
    """

    def test_判据自证(self):
        """喂必成功与必失败两个输入 —— 只会变绿的检查等于没有检查"""
        assert _calls_carrying_user('parse_get("View", x, user=user)\n', "View")[0][2] is True
        assert _calls_carrying_user('parse_get("View", x)\n', "View")[0][2] is False

    def test_每一处View调用都带user(self):
        import pathlib
        p = pathlib.Path(__file__).resolve().parent.parent / "src" / "web" / "view_api.py"
        calls = _calls_carrying_user(p.read_text(encoding="utf-8"), "View")
        assert calls, "一处都没找到 —— 说明解析出来的清单是空的，这条判据不可判"
        missing = [(ln, fn) for ln, fn, ok in calls if not ok]
        assert not missing, f"这些 parse_lite 调用没带 user，对应端点仍可越权: {missing}"

    def test_摘要回出归属(self):
        """「不绑租户 = 共享」这件事必须**看得见**，不能靠默认值假装它不存在"""
        from src.web.view_api import _summarize
        assert _summarize({"tenant_id": "t_a"})["tenant"] == "t_a"
        assert _summarize({})["tenant"] == "", "存量无租户的行要显式回成空串"


# ══════════════════════════════════════════════════════════════════
#  戊 · 图库面：作用域依赖 + 逐端点 404 + 不取 ns 的端点不漏
# ══════════════════════════════════════════════════════════════════

def _ont(label):
    return {"name": label, "version": "1",
            "categories": [{"id": "c1", "label": "类一"}],
            "nodes": [{"id": f"n_{label}", "label": label, "category": "c1"}],
            "edges": []}


_NODE_OF_B = "n_乙家的本体"


@pytest.fixture
def graph_env(monkeypatch):
    """一份**独立**的图库 —— 两个租户各一个命名空间, 外加一个无主。

    ⚠️ 绝不碰模块级单例 `graph_store`：门禁跑完不能留下任何痕迹，
    否则下一个起真底座的进程会看到一个带着测试命名空间的图库。
    （memory: 一个会破坏状态的自证，比没有自证更糟）
    """
    from src.graph_store import GraphStore, MemoryGraphProvider
    from src.web import graph_api

    store = GraphStore()
    store.register("memory", MemoryGraphProvider(), default=True)
    store.load("ns_a", _ont("甲家的本体"), tenant="t_a")
    store.load("ns_b", _ont("乙家的本体"), tenant="t_b")
    store.load("ns_free", _ont("无主的本体"), tenant=None)
    monkeypatch.setattr(graph_api, "graph_store", store)
    return store


def _client(user, overrides=None):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.auth import get_current_user
    from src.web import graph_api

    app = FastAPI()
    app.include_router(graph_api.router)
    app.dependency_overrides[get_current_user] = lambda: user
    for k, v in (overrides or {}).items():
        app.dependency_overrides[k] = v
    return TestClient(app)


def _flatten_deps(dep):
    """把 dependant 树摊平成 {call} —— 挂在哪一层都算数, 不靠读源码文本"""
    seen, stack = set(), [dep]
    while stack:
        d = stack.pop()
        if d.call is not None:
            seen.add(d.call)
        stack.extend(d.dependencies)
    return seen


def _routes_with_ns_in_path():
    """吃 `{ns}` 路径参数的路由 —— 从 router.routes **数出来**, 不手写清单。

    手写清单单向腐烂：今天加了第 12 个端点，清单还是 11 条，而它对应的那条
    越权路径**从此没有任何东西在查**。
    （memory: criterion-must-have-an-executor / decompose-reported-numbers）
    """
    from src.web import graph_api
    return [r for r in graph_api.router.routes if "{ns}" in r.path]


def _routes_with_ns_query():
    """把 ns 当**查询参数**收的路由 —— 另一条进路, 同样数出来"""
    from src.web import graph_api
    return [r for r in graph_api.router.routes
            if any(getattr(f, "name", None) == "ns" for f in r.dependant.query_params)]


def _url(route, ns, nid):
    """按路由对象把 URL 拼出来 —— 缺哪个必填参数补哪个, 不手写路径

    ⚠️ 这里**故意不写** `getattr(f, "required", False)`。FastAPI 0.136 起
    `ModelField.required` 已经不存在了，那个默认值会把「属性没了」静默吞成
    「不必填」—— 于是必填的 `q` 没补上，端点回 422，而报错长成「没挡住」。
    第一版就是这么红的：**一个防御性的默认值，把 API 变更变成了一个错误答案。**
    写死当前正确的 API，它再变就当场 AttributeError。
    """
    from urllib.parse import urlencode
    path = route.path.replace("{ns}", ns).replace("{nid}", nid)
    qs = []
    for f in route.dependant.query_params:
        if f.name == "ns":
            qs.append(("ns", ns))
        elif f.field_info.is_required():
            qs.append((f.name, "1" if "int" in str(f.field_info.annotation) else "x"))
    return path + ("?" + urlencode(qs) if qs else "")


class TestGraphScopeWiring:
    """图库面是「每处都接」而不是「接了几处」：漏一处 = 那一个端点仍可越权。"""

    def test_每条路由都挂了作用域依赖(self):
        """从 dependant 树里找 —— 挂着就算, 不看它写在文件的哪一行"""
        from src.web import graph_api
        routes = list(graph_api.router.routes)
        assert routes, "一条路由都没有 —— 这条判据不可判"
        missing = [r.path for r in routes
                   if graph_api.graph_scope not in _flatten_deps(r.dependant)]
        assert not missing, f"这些路由没挂作用域依赖, 命名空间对所有人可见: {missing}"

    def test_吃了ns的端点一个都不许漏(self, graph_env):
        """租户甲的账号打**每一个**吃 ns 的端点去取乙家的东西，全部必须 404。

        404 而不是 403 是刻意的：403 等于确认「这个命名空间存在」，
        那是个存在性预言机 —— 换个名字试一遍就能探出别家装了哪几个插件。
        """
        c = _client(_user("t_a"))
        routes = _routes_with_ns_in_path()
        assert routes, "一个吃 {ns} 的路由都没数出来 —— 判据不可判, 不是通过"
        bad = []
        for r in routes:
            resp = c.get(_url(r, "ns_b", _NODE_OF_B))
            if resp.status_code != 404:
                bad.append((r.path, resp.status_code))
        assert not bad, f"这些端点对别家命名空间没挡住: {bad}"

    def test_查询参数那条进路也挡住(self, graph_env):
        """/stats?ns= 走的是同一个 _get, 必须同样 404 ——

        只查路径参数会漏掉这条：两条进路进的是同一个函数，
        但**在测试里长得完全不一样**。
        """
        c = _client(_user("t_a"))
        routes = _routes_with_ns_query()
        assert routes, "一个把 ns 当查询参数收的路由都没数出来 —— 判据不可判"
        bad = []
        for r in routes:
            resp = c.get(_url(r, "ns_b", _NODE_OF_B))
            # /search 对看不见的 ns 回空结果(与「ns 不存在」同一个出口, 那条也回空);
            # 其余走 _get 的必须 404
            ok = resp.status_code == 404 or (r.path.endswith("/search") and resp.json().get("count") == 0)
            if not ok:
                bad.append((r.path, resp.status_code, resp.text[:120]))
        assert not bad, f"这些端点对别家命名空间没挡住: {bad}"

    def test_同租户与无主照常可取(self, graph_env):
        """改造不能误伤：自家的、无主的都必须还看得见。

        少了这条，一个「把所有人都挡住」的实现也能让上面两条全绿 ——
        而那正好是把演示环境整个打瞎。
        """
        c = _client(_user("t_a"))
        assert c.get("/api/graph/bundle/ns_a").status_code == 200
        assert c.get("/api/graph/bundle/ns_free").status_code == 200
        assert c.get("/api/graph/bundle/ns_b").status_code == 404

    def test_不取ns的三个端点不漏别家(self, graph_env):
        """这三个不走 _get, 路由依赖挡不住 —— 必须各自传 only="""
        c = _client(_user("t_a"))
        names = {x["namespace"] for x in c.get("/api/graph/namespaces").json()["results"]}
        assert {"ns_a", "ns_free"} <= names, "自家的和无主的必须还在"
        assert "ns_b" not in names, "/namespaces 漏了别家的命名空间名"

        s = c.get("/api/graph/stats").json()
        assert s["namespaces"] == 2, f"总数也按作用域算 —— 别家不该计入: {s['namespaces']}"
        assert "ns_b" not in json.dumps(s, ensure_ascii=False), "/stats 的 detail 漏了别家"

        h = c.get("/api/graph/search", params={"q": "乙家"}).json()
        assert h["count"] == 0, f"/search 搜到了别家的节点: {h['results']}"

    def test_拒绝与不存在回同一句话(self, graph_env):
        """两句话不一样 = 存在性预言机: 换个名字试一遍就知道哪家装了哪个包。

        ⚠️ **回显被查的那个名字不算泄露** —— 那是调用者自己发过来的。
        第一版断言写的是「消息里不许出现 ns_b」, 于是把回显判成了泄露:
        一个把用户输入原样回给用户的消息, 被自己写的判据当成了漏洞。
        要证的是两件事, 都不是「不许提名字」:
          ① 两者的措辞**除名字外逐字相同** —— 换名字试是试不出来的
          ② 「可见」清单里只列调用者看得见的那几个
        """
        import re
        c = _client(_user("t_a"))
        forbidden = c.get("/api/graph/bundle/ns_b")
        absent = c.get("/api/graph/bundle/ns_根本不存在的")
        assert forbidden.status_code == absent.status_code == 404

        def shape(text, queried):
            return text.replace(queried, "<NS>")

        assert shape(forbidden.text, "ns_b") == shape(absent.text, "ns_根本不存在的"), \
            f"措辞可区分 = 存在性预言机:\n  拒: {forbidden.text}\n  无: {absent.text}"

        def visible_list(text):
            m = re.search(r"可见: \[(.*?)\]", text)
            assert m, f"消息里没有可见清单, 这条判据不可判: {text}"
            return m.group(1)

        assert "ns_b" not in visible_list(forbidden.text), "可见清单里列了别家的 ns"
        assert "ns_b" not in visible_list(absent.text), \
            "可见清单也无条件列出全部 ns —— 猜一个不存在的名字照样拿到全名单"
        assert "ns_free" in visible_list(absent.text), "自家的与无主的应当在清单里"

    def test_providers不吐租户名(self, graph_env):
        """「这台机器上装了哪几家」本身是跨租户情报。

        策略可见 (运维要知道无主怎么处置)、名单不可见。
        """
        c = _client(_user("t_a"))
        body = json.dumps(c.get("/api/graph/providers").json(), ensure_ascii=False)
        assert "t_a" not in body and "t_b" not in body, f"providers 吐了租户名: {body}"
        assert "multi_tenant" in body, "策略本身要看得见"

    def test_判据自证_放开作用域必须变红(self, graph_env):
        """**这条是自证。** 上面那个 404 可能来自任何别的原因 ——
        路由写错、ns 拼错、图库是空的、TestClient 根本没连上。

        喂一个「作用域放开」的必失败输入进去：同一个断言必须当场变成 200。
        变不红，就说明上面那条 404 是碰巧来的，不是在证明接线。
        """
        from src.web import graph_api
        c = _client(_user("t_a"),
                    overrides={graph_api.graph_scope: lambda: {"ns_a", "ns_b", "ns_free"}})
        assert c.get("/api/graph/bundle/ns_b").status_code == 200, \
            "放开作用域后仍然取不到 —— 说明 404 不是作用域造成的, 上面那条判据不成立"


# ══════════════════════════════════════════════════════════════════
#  己 · 装载层：多租户部署不允许无主
# ══════════════════════════════════════════════════════════════════

class TestLoadLayerOwnership:
    """「无主」是两句话：查询层管「无主 = 共享」，装载层管「多租户不许无主」。

    只有查询层那一句是不够的 —— 双租户部署里一个漏登记的插件就是全租户可见，
    而「漏登记」在下一次装载之前不会有任何东西报出来。
    """

    def test_单租户部署里无主即共享(self, monkeypatch):
        """演示 / POC 一件插件都不必登记归属，行为与今天一字不变"""
        monkeypatch.setenv("IOTSTUDIO_NS_TENANT", "")
        from src.tenant_scope import tenant_of
        assert tenant_of("charging") is None

    def test_只声明了一个租户时无主仍然共享(self, monkeypatch):
        monkeypatch.setenv("IOTSTUDIO_NS_TENANT", "charging=t_a")
        from src.tenant_scope import tenant_of
        assert tenant_of("charging") == "t_a"
        assert tenant_of("忘了登记的包") is None, "只有 1 个租户 → 按部署规模判定 = 共享"

    def test_双租户部署里未声明的ns装载即抛错(self, monkeypatch):
        """**响，且早。** 抛错由 _load_one 既有的失败隔离接住 →
        插件标记 failed 并带上原因，宿主与其它插件不受影响。
        """
        monkeypatch.setenv("IOTSTUDIO_NS_TENANT", "charging=t_a,pump_test=t_b")
        from src.tenant_scope import tenant_of
        assert tenant_of("charging") == "t_a"
        with pytest.raises(ValueError) as ei:
            tenant_of("漏登记的包")
        msg = str(ei.value)
        assert "漏登记的包" in msg, f"报错得说清是哪个 ns: {msg}"
        assert "IOTSTUDIO_NS_TENANT" in msg and "t_a" in msg, \
            f"报错要给可照抄的修法, 否则运维只能猜: {msg}"

    def test_缺等号的条目出声跳过(self, monkeypatch, caplog):
        """空项与打错是两回事：前者是分隔符的产物(静默)，后者是写漏了(必须出声)"""
        monkeypatch.setenv("IOTSTUDIO_NS_TENANT", "charging,,pump_test=t_b")
        from src.tenant_scope import deployment_tenants
        import logging
        with caplog.at_level(logging.WARNING, logger="tenant.scope"):
            deployment_tenants()
        assert any("charging" in r.message for r in caplog.records), \
            "写了 ns 没写租户 = 打错了, 静默丢掉会让运维以为登记成功了"

    def test_describe把策略变成值(self, monkeypatch):
        """「按部署规模判定」写成值才是查出来的；写成注释得先找到那段注释"""
        from src import tenant_scope as ts
        monkeypatch.setenv("IOTSTUDIO_NS_TENANT", "a=t1,b=t2")
        assert ts.describe()["unowned_policy"] == "raise"
        assert ts.describe()["multi_tenant"] is True
        monkeypatch.setenv("IOTSTUDIO_NS_TENANT", "a=t1")
        assert ts.describe()["unowned_policy"] == "shared"
        assert ts.describe()["multi_tenant"] is False

    def test_装载层真的接在图库上(self, graph_env, monkeypatch):
        """判据必须指到执行它的那行代码 —— 上面测的是 tenant_of 自己，
        这条证明 plugin_runtime.register_graph 真的在调它。"""
        import inspect
        from src.plugin_runtime import PluginContext
        src = inspect.getsource(PluginContext.register_graph)
        assert "tenant_of(" in src, "装载层没调 tenant_of, 上面几条全是空转"
        assert "tenant=" in src, "算了归属却没传给图库"


# ══════════════════════════════════════════════════════════════════
#  庚 · 覆盖面自查：src/web/ 下每一处图库调用都得带 only=
# ══════════════════════════════════════════════════════════════════

_GRAPH_CONSUMING = {"namespaces", "stats", "nodes", "node", "edges",
                    "neighbors", "search", "categories", "bundle"}

# 免检：`graph_scope` 自己 —— 它**就是**在算这个集合，必须看得见全部。
# 按**函数名**给豁免而不是按行号：行号豁免会随着上面加一行注释就失效，
# 而失效的豁免是「静默少查一处」还是「静默多查一处」看不出来。
_SCOPE_EXEMPT_FUNCS = {"graph_scope"}


def _graph_calls_without_only(src_text):
    """AST 找出 `graph_store.<消费方法>(...)` 里没带 only= 的，带上所在函数名。

    与丁组同一套理由：正则在这类嵌套调用上会截错位置，而**判据自己也会烂**，
    所以它必须能自证（见 test_判据自证）。
    """
    import ast
    tree = ast.parse(src_text)
    out = []

    def walk(node, fn):
        for child in ast.iter_child_nodes(node):
            name = child.name if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)) else fn
            if isinstance(child, ast.Call):
                f = child.func
                if (isinstance(f, ast.Attribute) and f.attr in _GRAPH_CONSUMING
                        and isinstance(f.value, ast.Name) and f.value.id == "graph_store"
                        and "only" not in {k.arg for k in child.keywords}):
                    out.append((child.lineno, fn, f.attr))
            walk(child, name)

    walk(tree, "<module>")
    return sorted(out)


class TestGraphApiCoverage:

    def test_判据自证(self):
        """喂必成功与必失败两个输入 —— 只会变绿的检查等于没有检查"""
        assert _graph_calls_without_only("graph_store.bundle(ns, only=scope)\n") == []
        assert _graph_calls_without_only("graph_store.bundle(ns)\n") == [(1, "<module>", "bundle")]

    def test_豁免表不许腐烂(self):
        """免检项必须真实存在 —— 函数改名了而豁免表没跟着改，这条要红。

        同 scan_ontology.py 的豁免表纪律：豁免比判据更容易悄悄失效。
        """
        import ast
        import pathlib
        src = (pathlib.Path(__file__).resolve().parent.parent
               / "src" / "web" / "graph_api.py").read_text(encoding="utf-8")
        funcs = {n.name for n in ast.walk(ast.parse(src))
                 if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))}
        stale = _SCOPE_EXEMPT_FUNCS - funcs
        assert not stale, f"豁免表里的 {stale} 在 graph_api.py 里已不存在 —— 别让豁免静默失效"

    def test_每一处图库调用都带only(self):
        import pathlib
        web = pathlib.Path(__file__).resolve().parent.parent / "src" / "web"
        scanned, missing = 0, []
        for p in sorted(web.glob("*.py")):
            for ln, fn, meth in _graph_calls_without_only(p.read_text(encoding="utf-8")):
                scanned += 1
                if fn in _SCOPE_EXEMPT_FUNCS:
                    continue
                missing.append((p.name, ln, fn, meth))
        assert scanned, "一处图库调用都没扫到 —— 判据不可判, 不是通过"
        assert not missing, f"这些图库调用没带 only=, 对应端点仍可越权: {missing}"
