# -*- coding: utf-8 -*-
"""上行出口的「装没装」必须看得见

两条缺陷同源，都是**发出去之后一切正常，只有接收侧什么都没有**：

1. `DGIoTBridge` 默认 topic 是 `dgiot/device/telemetry`。这个主题在中枢两条线
   （github 的 dgiot-github、gitee 的 tools/dgiot）的 Erlang 源码里**零命中**，
   本仓也没有任何订阅方。配置漏了 topic 时，publish 返回成功、日志照打，
   数据直接进空气。

2. `ch_dgiot_push` 通道 on_start 里 new 一个 DGIoTBridge 存起来就完事 ——
   不连接、不推送，通道列表照样显示 running。判断"链路通没通"的那个页面，
   恰好是唯一看不到真相的地方。

所以这里钉的是**可观测性**：装了就报装了，没装就报错，不许静默成功。
"""
import pathlib
import re

import pytest

from src.channel_bootstrap import _push_outlets, _register_fallback_channels
from src.channel_registry import ChannelManager, CType
from src.push.dgiot_pusher import DGIoTBridge
from src.services.push_engine import PushEngine


@pytest.fixture(autouse=True)
def _clean_registry():
    saved = dict(ChannelManager._instances)
    ChannelManager._instances.clear()
    yield
    ChannelManager._instances.clear()
    ChannelManager._instances.update(saved)


@pytest.fixture(autouse=True)
def _no_plugin_registry(monkeypatch):
    """通道注册会顺带登记插件 —— 测试里不碰全局插件表"""
    import src.plugin_registry as pr
    monkeypatch.setattr(pr, "register", lambda *a, **kw: None, raising=False)


# ── 1. DGIoTBridge 不许再发进空气 ──

@pytest.mark.asyncio
async def test_missing_topic_refuses_instead_of_publishing_into_the_void(caplog):
    """没配 topic 就拒发 —— 而且连都别连，省得日志里出现一条成功的连接"""
    b = DGIoTBridge({"host": "127.0.0.1", "port": 1883})
    assert b.topic == "", "又给 topic 长出兜底默认值了"

    connected = []

    async def _fake_connect():
        connected.append(1)

    b._connect = _fake_connect
    with caplog.at_level("ERROR"):
        assert await b.push({"data": [{"point_id": "p", "value": 1}]}) is False
    assert connected == [], "拒发时不该建连接"
    assert "edge_hub" in caplog.text, "报错要指出正确的出口是哪条"
    assert "$dg/thing/" in caplog.text, "报错要给出正确的主题形状"


@pytest.mark.asyncio
async def test_explicit_topic_still_publishes():
    """拒的是"没配置"，不是"这个类不能用了"—— 显式配了就照旧发"""
    b = DGIoTBridge({"host": "127.0.0.1", "port": 1883,
                     "topic": "$dg/thing/152224c5ee/DTU001/properties/report"})
    sent = []

    class _Stub:
        def publish(self, topic, payload, qos=1):
            sent.append((topic, payload))

    async def _fake_connect():
        b._client = _Stub()

    b._connect = _fake_connect
    assert await b.push({"device_id": "d", "data": [{"point_id": "p", "value": 1}]}) is True
    assert sent and sent[0][0] == "$dg/thing/152224c5ee/DTU001/properties/report"


def test_fabricated_topic_is_not_a_default_anywhere():
    """结构性锁：那个自造主题不许再作为**默认值**出现在 src/ 下

    只查 `get("topic", "...")` 这种赋值形态，不查裸字符串 —— 类文档里
    留着一句"老代码默认发过 XXX"是给后来人看的历史，不算违规。
    """
    root = pathlib.Path(__file__).resolve().parents[1] / "src"
    pat = re.compile(r'get\(\s*"topic"\s*,\s*"dgiot/device/telemetry"')
    hits = [str(p.relative_to(root)) for p in root.rglob("*.py")
            if pat.search(p.read_text(encoding="utf-8"))]
    assert hits == [], f"又拿自造主题当默认值了: {hits}"


# ── 2. outlets() 是通道侧唯一的真相来源 ──

def test_outlets_lists_assembled_pushers_by_class_name():
    class _A:
        async def push(self, m): ...

    class _B:
        async def push(self, m): ...

    e = PushEngine(pg_store=None)
    e._pushers = {"t1": _A(), "t2": _B()}
    assert e.outlets() == {"t1": "_A", "t2": "_B"}


def test_outlets_is_empty_before_start():
    assert PushEngine(pg_store=None).outlets() == {}


# ── 3. 通道如实反映装配结果 ──

@pytest.mark.asyncio
async def test_channel_reports_error_when_no_dlink_outlet(monkeypatch):
    """没装 edge_hub 出口 → 通道报 error，不许显示 running"""
    monkeypatch.setattr("src.channel_bootstrap._push_outlets", lambda: {"t1": "MQTTPusher"})
    _register_fallback_channels()
    assert await ChannelManager.start("ch_dgiot_push") is False
    ch = ChannelManager.get("ch_dgiot_push")
    assert ch.status == "error"
    assert "edge_hub" in ch.error_msg and "$dg/thing/" in ch.error_msg


@pytest.mark.asyncio
async def test_channel_runs_when_dlink_outlet_present(monkeypatch):
    monkeypatch.setattr("src.channel_bootstrap._push_outlets",
                        lambda: {"t1": "EdgeHubPusher", "t2": "MQTTPusher"})
    _register_fallback_channels()
    assert await ChannelManager.start("ch_dgiot_push") is True
    assert ChannelManager.get("ch_dgiot_push").status == "running"
    # 收尾仍然干净：on_stop 是 async 且返回 None
    assert await ChannelManager.stop("ch_dgiot_push") is True


@pytest.mark.asyncio
async def test_channel_does_not_fabricate_a_bridge_anymore(monkeypatch):
    """以前 on_start 会 new 一个 DGIoTBridge 塞进 _channels_state —— 那个对象
    没有任何生命周期，取出来也没有用。现在通道状态里只留装配结果。"""
    import src.channel_bootstrap as cb
    monkeypatch.setattr(cb, "_push_outlets", lambda: {"t1": "EdgeHubPusher"})
    _register_fallback_channels()
    await ChannelManager.start("ch_dgiot_push")
    assert "dgiot_bridge" not in cb._channels_state
    assert cb._channels_state.get("edge_hub_targets") == ["t1"]


def test_outlet_lookup_failure_does_not_raise(monkeypatch, caplog):
    """取不到出口清单时返回空表并记一条 warning —— 通道启动的失败原因
    应该是"没装出口"，不是"清单没取到"这种含糊的报错。

    用 sys.modules 塞一个 push_engine 属性会抛的假 main，而不是拦 __import__：
    后者要猜相对导入传进来的模块名，猜错了会**空过**（真实 outlets 在测试里
    本来就是空表，断言照样成立）。这里必须确保异常真的被触发过。
    """
    import sys
    import types

    # 不要 import src.main —— 它是整个 app 的装配模块（模块级建服务、连 MQTT），
    # 为了一个属性访问把整套依赖拖进单元测试不值得。sys.modules 里放个假的就够。
    fake = types.ModuleType("src.main")

    class _Boom:
        def __getattr__(self, name):
            raise RuntimeError("模拟 push_engine 尚未就绪")

    fake.push_engine = _Boom()
    monkeypatch.setitem(sys.modules, "src.main", fake)
    with caplog.at_level("WARNING"):
        assert _push_outlets() == {}
    assert "取推送出口清单失败" in caplog.text
