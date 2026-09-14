# -*- coding: utf-8 -*-
"""设备接入身份表 — devaddr → productId/deviceSecret

这层存在的唯一理由是同步/异步形状对不上（pusher 同步查身份，ParseStore 全
async）。所以测试重点在**边界**：缺字段、错格式、刷新失败、分页 —— 而不是
"happy path 能查到"。查不到的后果是拒发，比发错轻，但也别静默。
"""
from types import SimpleNamespace

import pytest

from src.services.device_identity import DeviceIdentityRegistry


def _dev(devaddr, product_id, secret="s"):
    """构造一条 Parse 形态的设备行 —— product 是 Pointer"""
    return SimpleNamespace(devaddr=devaddr, device_name=f"dev-{devaddr}",
                           deviceSecret=secret,
                           product={"__type": "Pointer", "className": "Product",
                                    "objectId": product_id})


class FakeStore:
    def __init__(self, rows):
        self.rows = rows
        self.calls = 0
        self.fail = False

    async def list_devices(self, station_id=None, device_type=None,
                           page=1, page_size=20):
        self.calls += 1
        if self.fail:
            raise RuntimeError("parse server 502")
        start = (page - 1) * page_size
        return self.rows[start:start + page_size], len(self.rows)


@pytest.mark.asyncio
async def test_load_builds_devaddr_index():
    store = FakeStore([_dev("DTU001", "152224c5ee", "sec1"),
                       _dev("DTU002", "152224c5ee", "sec2")])
    reg = DeviceIdentityRegistry(store)
    assert await reg.load() == 2
    assert reg("DTU001") == {"product_id": "152224c5ee", "device_secret": "sec1"}
    assert reg("DTU002")["device_secret"] == "sec2"
    assert reg("NOPE") is None


@pytest.mark.asyncio
async def test_readable_object_id_is_skipped():
    """种子数据用 "inverter"/"pcs" 这类可读串当 objectId —— 中枢不认

    放行它们等于拼出一个"发得出去、中枢收下但记到别处"的主题。
    宁可在这里挡掉并计数。
    """
    store = FakeStore([_dev("D1", "inverter"), _dev("D2", "152224c5ee")])
    reg = DeviceIdentityRegistry(store)
    assert await reg.load() == 1
    assert reg("D1") is None
    assert reg("D2") is not None


@pytest.mark.asyncio
async def test_twenty_char_object_id_is_skipped():
    """⚠️ 真实数据形态：本仓 parse_lite 的 `_oid()` = secrets.token_hex(10) → **20 位**

    中枢是 `to_md5(...)[:10]` → 10 位。两套 id 体系不同源，同一个产品在
    这边是 `b509fbe508995774fa60`、按中枢公式算是 `6bafdf1516`，毫无关系。
    20 位 productId 拼出的 clientid 过不了 ACL 的
    `<<ProductID:10/binary, "_", DeviceAddr/binary>>`（第 11 字节是 9 不是 _），
    broker 静默 deny。所以必须在本地拦下并计数。

    这条钉的是"长度即协议"——哪天有人把 is_object_id 放宽成"是 hex 就行"，
    它就会红。
    """
    store = FakeStore([_dev("pv_001", "b509fbe508995774fa60")])
    reg = DeviceIdentityRegistry(store)
    assert await reg.load() == 0
    assert reg("pv_001") is None


@pytest.mark.asyncio
async def test_missing_and_malformed_rows_skipped():
    """缺 devaddr / 缺 product / product 取不出 objectId —— 一条都不该进表"""
    rows = [
        SimpleNamespace(devaddr="", product={"objectId": "152224c5ee"}),
        SimpleNamespace(devaddr="D3", product=None),
        SimpleNamespace(devaddr="D4", product={"className": "Product"}),   # 无 objectId
        SimpleNamespace(devaddr="D5", product={"objectId": "152224C5EE"}),  # 大写
        _dev("D6", "152224c5ee"),
    ]
    reg = DeviceIdentityRegistry(FakeStore(rows))
    assert await reg.load() == 1
    assert reg("D6") is not None
    for d in ("D3", "D4", "D5"):
        assert reg(d) is None


@pytest.mark.asyncio
async def test_product_as_plain_string_also_accepted():
    """老数据里 product 直接存字符串 —— 认，别为格式差异把设备判死"""
    rows = [SimpleNamespace(devaddr="D1", product="152224c5ee", deviceSecret="x")]
    reg = DeviceIdentityRegistry(FakeStore(rows))
    assert await reg.load() == 1
    assert reg("D1")["product_id"] == "152224c5ee"


@pytest.mark.asyncio
async def test_snake_case_secret_alias():
    """ORM 路径给的是 device_secret，Parse 路径给的是 deviceSecret"""
    rows = [SimpleNamespace(devaddr="D1", product="152224c5ee", device_secret="snake")]
    reg = DeviceIdentityRegistry(FakeStore(rows))
    await reg.load()
    assert reg("D1")["device_secret"] == "snake"


@pytest.mark.asyncio
async def test_refresh_failure_keeps_old_snapshot():
    """一次网络抖动不能让边缘侧突然全体推不出去 —— 沿用旧表但记下错误"""
    store = FakeStore([_dev("DTU001", "152224c5ee")])
    reg = DeviceIdentityRegistry(store)
    await reg.load()
    store.fail = True
    assert await reg.load() == 1                    # 仍是旧快照的条数
    assert reg("DTU001") is not None
    assert "502" in reg.status()["error"]


@pytest.mark.asyncio
async def test_refresh_replaces_snapshot_wholesale():
    """中枢删掉的设备必须跟着消失 —— 半新半旧的表比全旧更难排查"""
    store = FakeStore([_dev("D1", "152224c5ee"), _dev("D2", "152224c5ee")])
    reg = DeviceIdentityRegistry(store)
    await reg.load()
    store.fail = False
    store.rows = [_dev("D2", "152224c5ee")]
    await reg.load()
    assert reg("D1") is None and reg("D2") is not None
    assert reg.status()["devices"] == 1


@pytest.mark.asyncio
async def test_paging_pulls_everything():
    """>1 页时必须翻完 —— 少拉一页 = 一批设备静默推不出去"""
    store = FakeStore([_dev(f"D{i:04d}", "152224c5ee") for i in range(1200)])
    reg = DeviceIdentityRegistry(store)
    assert await reg.load() == 1200
    assert reg("D1199") is not None
    assert store.calls == 3                          # 500 + 500 + 200


@pytest.mark.asyncio
async def test_ttl_and_interval_are_bounded():
    """刷新周期给 0 会变成忙循环 —— 兜底到 30s"""
    reg = DeviceIdentityRegistry(FakeStore([]), refresh_interval=0)
    assert reg.status()["refresh_interval"] == 30


@pytest.mark.asyncio
async def test_stop_without_start_is_safe():
    """shutdown 路径不该因为没启动过就抛"""
    reg = DeviceIdentityRegistry(FakeStore([]))
    await reg.stop()
    await reg.stop()


# ── 与 Pusher 的接线 ──

@pytest.mark.asyncio
async def test_push_engine_injects_resolver():
    """PushEngine 装载时把 resolver 注入 pusher —— 凭据不进消息体"""
    from src.services.push_engine import PushEngine

    class Target:
        target_id = "t1"
        target_type = "edge_hub"
        config = {"host": "127.0.0.1"}

    class Store:
        async def list_push_targets(self):
            return [Target()]

    injected = {}

    class Pusher:
        def set_resolver(self, r):
            injected["r"] = r

        async def push(self, message):
            return True

    eng = PushEngine(Store(), registry=_Reg({"edge_hub": {"factory": lambda c: Pusher()}}),
                     resolver="RESOLVER")
    await eng.start()
    assert injected["r"] == "RESOLVER"


@pytest.mark.asyncio
async def test_push_engine_without_resolver_still_starts():
    """没配 resolver 时不该炸 —— 只是那些出口拿不到身份、自己拒发"""
    from src.services.push_engine import PushEngine

    class Target:
        target_id = "t1"
        target_type = "edge_hub"
        config = {}

    class Store:
        async def list_push_targets(self):
            return [Target()]

    class Pusher:
        async def push(self, message):
            return True

    eng = PushEngine(Store(), registry=_Reg({"edge_hub": {"factory": lambda c: Pusher()}}))
    await eng.start()
    assert "t1" in eng._pushers


class _Reg:
    def __init__(self, caps):
        self._caps = caps

    def pushers(self):
        return self._caps


@pytest.mark.asyncio
async def test_end_to_end_row_to_topic(monkeypatch):
    """闭环: Parse 设备行 → 注册表 → resolver → EdgeHubPusher → 中枢主题

    单测各自绿不代表接起来对 —— 这条把整条链拉通，钉住最终那一串。
    中间任何一层把 productId 弄错（当成产品名、当成 20 位 id、当成 deviceId），
    最后拼出来的主题都会变，这里就会红。
    """
    import json as _json
    from src.push.edge_hub_push import EdgeHubPusher
    from src.services.push_engine import PushEngine

    published = []

    class Client:
        def __init__(self, client_id=None, **kw):
            self.client_id = client_id
            self.username = None
            self.password = None

        def username_pw_set(self, u, p=None):
            self.username, self.password = u, p

        def connect_async(self, *a, **kw): pass
        def loop_start(self): pass
        def loop_stop(self): pass
        def disconnect(self): pass

        def publish(self, topic, msg, qos=1):
            published.append((topic, _json.loads(msg)))
            return True

    import paho.mqtt.client as mqtt
    monkeypatch.setattr(mqtt, "Client", Client)

    store = FakeStore([_dev("DTU001", "152224c5ee", "s3cret")])
    registry = DeviceIdentityRegistry(store)
    await registry.load()

    class Target:
        target_id = "hub"
        target_type = "edge_hub"
        config = {"host": "127.0.0.1", "port": 1883, "identity_mode": "device"}

    class TargetStore(FakeStore):
        async def list_push_targets(self):
            return [Target()]

    eng = PushEngine(TargetStore(store.rows), registry=_Reg({
        "edge_hub": {"factory": lambda c: EdgeHubPusher(c)}}),
        resolver=registry)
    await eng.start()

    pusher = eng._pushers["hub"]
    pusher._conn = {"host": "127.0.0.1", "port": 1883}
    assert pusher.push_telemetry("DTU001", "pt1", 42.0, "A") is True

    topic, payload = published[0]
    assert topic == "$dg/thing/152224c5ee/DTU001/properties/report"
    assert payload["value"] == 42.0
    # 身份也走通了: clientid / username / password 三者都对上 ACL
    client = next(iter(pusher._clients.values()))
    assert client.client_id == "152224c5ee_DTU001"
    assert client.username == "152224c5ee"
    assert client.password == "s3cret"


@pytest.mark.asyncio
async def test_end_to_end_refuses_unresolvable_device(monkeypatch):
    """查不到身份的设备走完整条链也**不发布** —— 这是防串账的最后一道"""
    from src.push.edge_hub_push import EdgeHubPusher

    published = []

    class Client:
        def __init__(self, **kw): pass
        def username_pw_set(self, *a): pass
        def connect_async(self, *a, **kw): pass
        def loop_start(self): pass
        def publish(self, topic, msg, qos=1):
            published.append(topic)
            return True

    import paho.mqtt.client as mqtt
    monkeypatch.setattr(mqtt, "Client", Client)

    registry = DeviceIdentityRegistry(FakeStore([]))
    await registry.load()
    p = EdgeHubPusher({"host": "127.0.0.1", "port": 1883}, resolver=registry)
    p._conn = {"host": "127.0.0.1", "port": 1883}
    assert p.push_telemetry("pv_001", "pt1", 1.0) is False
    assert published == []
    assert p._stats["rejected"] == 1
    assert p._stats["pushed"] == 0
