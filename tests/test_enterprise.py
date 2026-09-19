"""P1 企业连接器测试 — httpx.MockTransport 注入, 零真实网络

覆盖: PULL 注册本体对象 (创建/更新/幂等/形状宽容) + PUSH 快照上报
(载荷断言/凭证 env 引用/无凭证不发头) + 安全边界 (scheme/URL 凭证/连接失败结果化)
"""
import httpx
import pytest

from src.enterprise import EnterpriseConnector
from src.ontology import OntologyEngine, DataSource

_OBJECTS = {
    "objects": [
        {"id": "erp_line_01", "layer": "device", "name": "ERP 1 号产线",
         "props": {"type": "assembly_line"}},
        {"id": "erp_gate_01", "layer": "gateway", "name": "ERP 网关"},
    ]
}


def _engine_with_http_ds():
    eng = OntologyEngine()
    eng.register(DataSource(id="ds_erp", gateway="gw_x", type="rest",
                            connection="http://erp.internal"))
    return eng


def _client(handler) -> httpx.AsyncClient:
    return httpx.AsyncClient(transport=httpx.MockTransport(handler), follow_redirects=False)


# ── PULL ──

async def test_pull_registers_objects():
    eng = _engine_with_http_ds()

    async def h(request):
        return httpx.Response(200, json=_OBJECTS)

    c = EnterpriseConnector(eng, client=_client(h))
    r = await c.pull_metadata("ds_erp")
    await c.dispose()
    assert r["status"] == "ok"
    assert r["created"] == 2 and r["updated"] == 0 and r["errors"] == 0
    assert "erp_line_01" in eng.devices and "erp_gate_01" in eng.gateways
    assert eng.datasources["ds_erp"].status == "connected"
    assert eng.datasources["ds_erp"].tag_count == 2


async def test_pull_idempotent_second_run():
    eng = _engine_with_http_ds()

    async def h(request):
        return httpx.Response(200, json=_OBJECTS)

    c = EnterpriseConnector(eng, client=_client(h))
    await c.pull_metadata("ds_erp")
    r2 = await c.pull_metadata("ds_erp")
    await c.dispose()
    assert r2["created"] == 0 and r2["updated"] == 2


async def test_pull_accepts_bare_list():
    eng = _engine_with_http_ds()

    async def h(request):
        return httpx.Response(200, json=[{"id": "d1", "layer": "device", "name": "x"}])

    c = EnterpriseConnector(eng, client=_client(h))
    r = await c.pull_metadata("ds_erp")
    await c.dispose()
    assert r["created"] == 1 and "d1" in eng.devices


async def test_pull_http_error_resultized():
    eng = _engine_with_http_ds()

    async def h(request):
        return httpx.Response(503)

    c = EnterpriseConnector(eng, client=_client(h))
    r = await c.pull_metadata("ds_erp")
    await c.dispose()
    assert r["status"] == "error" and "503" in r["detail"]
    assert eng.datasources["ds_erp"].status == "error"


async def test_pull_connect_failure_resultized():
    eng = _engine_with_http_ds()

    def h(request):
        raise httpx.ConnectError("connection refused")

    c = EnterpriseConnector(eng, client=_client(h))
    r = await c.pull_metadata("ds_erp")
    await c.dispose()
    assert r["status"] == "error" and "ConnectError" in r["detail"]


async def test_pull_rejects_non_http_scheme():
    eng = OntologyEngine()
    eng.register(DataSource(id="ds_db", gateway="g", type="oracle",
                            connection="oracle://db1"))
    with pytest.raises(ValueError, match="http/https"):
        await EnterpriseConnector(eng).pull_metadata("ds_db")


async def test_pull_rejects_embedded_credentials():
    eng = OntologyEngine()
    eng.register(DataSource(id="ds_bad", gateway="g", type="rest",
                            connection="http://user:pass@erp.internal"))
    with pytest.raises(ValueError, match="凭证"):
        await EnterpriseConnector(eng).pull_metadata("ds_bad")


async def test_pull_missing_datasource():
    with pytest.raises(ValueError, match="未找到"):
        await EnterpriseConnector(OntologyEngine()).pull_metadata("nope")


# ── PUSH ──

async def test_push_posts_snapshot(monkeypatch):
    eng = _engine_with_http_ds()
    seen = {}

    async def h(request):
        seen["url"] = str(request.url)
        seen["body"] = (await request.aread()).decode()
        seen["auth"] = request.headers.get("Authorization")
        return httpx.Response(200, json={"ok": True})

    monkeypatch.setenv("HUB_TOKEN", "tok-123")
    c = EnterpriseConnector(eng, client=_client(h))
    r = await c.push_metadata("ds_erp", "http://hub.internal/ingest", token_env="HUB_TOKEN")
    await c.dispose()
    assert r["status"] == "ok" and seen["url"] == "http://hub.internal/ingest"
    assert '"source": "ds_erp"' in seen["body"].replace(", ", ", ") or "ds_erp" in seen["body"]
    assert seen["auth"] == "Bearer tok-123"
    assert r["sent_objects"] >= 1


async def test_push_without_token_env_sends_no_auth(monkeypatch):
    eng = _engine_with_http_ds()
    seen = {}

    async def h(request):
        seen["auth"] = request.headers.get("Authorization")
        return httpx.Response(202)

    monkeypatch.delenv("HUB_TOKEN", raising=False)
    c = EnterpriseConnector(eng, client=_client(h))
    r = await c.push_metadata("ds_erp", "http://hub.internal/ingest", token_env="HUB_TOKEN")
    await c.dispose()
    assert r["status"] == "ok" and seen["auth"] is None


async def test_push_rejects_bad_hub_url():
    eng = _engine_with_http_ds()
    with pytest.raises(ValueError, match="http/https"):
        await EnterpriseConnector(eng).push_metadata("ds_erp", "gopher://hub")
