"""iotStudio — AIP 安全改造测试 (P0: 鉴权接线 + Action 审计 + Console 沙箱)"""
import sqlite3

from src.auth import get_current_user, require_admin
from src.web.graphrag_api import (
    _action_db_path,
    _record_action,
    router,
    sandbox_exec,
)


class TestSandbox:
    """Code Console 沙箱 — 三层防线"""

    def test_dunder_rejected(self):
        """防线1: 双下划线源码预检 (阻断 __import__/__class__ 逃逸链)"""
        r = sandbox_exec("x = (1).__class__")
        assert r["ok"] is False
        assert "双下划线" in r["error"]

    def test_import_blocked(self):
        """防线2: 空 builtins — import 语句不可用"""
        r = sandbox_exec("import os")
        assert r["ok"] is False
        assert r["error"]

    def test_open_unavailable(self):
        """防线2: open 不在白名单"""
        r = sandbox_exec("open('secret.txt')")
        assert r["ok"] is False

    def test_benign_code_runs(self):
        """白名单内建 + 受控 print + 变量回传"""
        r = sandbox_exec("print('hello'); y = 1 + 2")
        assert r["ok"] is True
        assert "hello" in r["stdout"]
        assert r["result"].get("y") == "3"

    def test_builtin_whitelist_usable(self):
        r = sandbox_exec("z = len([1, 2, 3])")
        assert r["ok"] is True
        assert r["result"].get("z") == "3"

    def test_preset_engine_injected(self):
        """预置变量 engine 存在且类型正确 (测试代码自身不得含 dunder, 与沙箱预检一致)"""
        r = sandbox_exec("has_engine = 'OntologyEngine' in str(type(engine))")
        assert r["ok"] is True
        assert r["result"].get("has_engine") == "True"


class TestActionAudit:
    """Action Framework — 审计落库"""

    def test_record_and_readback(self):
        receipt = _record_action(
            "acknowledge_alarm", "pt_test_1", {"k": "v"},
            "tester", "admin", "executed",
            {"status": "acknowledged"}, "dgiot/test/cmd",
        )
        assert receipt["objectId"]
        assert receipt["createdAt"]

        db = sqlite3.connect(_action_db_path())
        try:
            row = db.execute(
                "SELECT action, actor, status, mqtt_topic FROM action_log WHERE objectId=?",
                (receipt["objectId"],),
            ).fetchone()
        finally:
            db.close()
        assert row == ("acknowledge_alarm", "tester", "executed", "dgiot/test/cmd")

    def test_denial_recorded(self):
        receipt = _record_action(
            "command_down", "dev_x", {}, "op", "operator",
            "denied", {"reason": "仅管理员可下发设备指令"},
        )
        assert receipt["objectId"]


class TestAuthWiring:
    """AIP 路由鉴权接线 — 路由器级登录 + 写端点 admin"""

    @staticmethod
    def _route(path, method):
        for r in router.routes:
            if getattr(r, "path", "") == path and method in getattr(r, "methods", set()):
                return r
        return None

    def test_router_requires_login(self):
        """所有 /api/graphrag/* 路由器级挂 get_current_user"""
        assert len(router.dependencies) == 1
        assert router.dependencies[0].dependency is get_current_user

    def test_admin_only_endpoints(self):
        admin_endpoints = {
            ("POST", "/api/graphrag/aip/objects/create"),
            ("PUT", "/api/graphrag/aip/objects/{entity_id}"),
            ("DELETE", "/api/graphrag/aip/objects/{entity_id}"),
            ("POST", "/api/graphrag/aip/objects/sync"),
            ("POST", "/api/graphrag/aip/objects/import"),
            ("POST", "/api/graphrag/aip/console"),
            ("POST", "/api/graphrag/live/seed"),
        }
        for method, path in admin_endpoints:
            route = self._route(path, method)
            assert route is not None, f"路由不存在: {method} {path}"
            deps = [d.dependency for d in route.dependencies]
            assert require_admin in deps, f"缺少 admin 依赖: {method} {path}"

    def test_read_endpoints_not_admin(self):
        """读端点只要求登录, 不要求 admin"""
        for method, path in [
            ("GET", "/api/graphrag/aip/dashboard"),
            ("GET", "/api/graphrag/aip/objects"),
            ("POST", "/api/graphrag/aip/actions/execute"),
        ]:
            route = self._route(path, method)
            assert route is not None, f"路由不存在: {method} {path}"
            deps = [d.dependency for d in route.dependencies]
            assert require_admin not in deps, f"读端点不应要求 admin: {method} {path}"
