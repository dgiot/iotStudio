# ============================================================
# 内置 MQTT Broker 测试 — 标准通配匹配 / relay 投递 (冒烟发现的
# dgiot/# 静默丢消息 bug 的回归锁)
# ============================================================
import asyncio
import json

import pytest

from src.services.mqtt_broker import MiniMqttBroker


# ── _match: MQTT 标准通配语义 ──

@pytest.mark.parametrize("filt,topic,expect", [
    ("dgiot/#", "dgiot/smoke/echo", True),
    ("dgiot/#", "dgiot/default/gw_131/ch/dev/meta", True),
    ("dgiot/#", "dgiot", True),              # '#' 匹配父级本身
    ("dgiot/#", "other/x", False),
    ("#", "any/deep/path", True),
    ("dgiot/+/meta", "dgiot/gw1/meta", True),
    ("dgiot/+/meta", "dgiot/gw1/extra/meta", False),
    ("dgiot/+/meta", "dgiot/meta", False),   # '+' 恰好一层
    ("a/b/c", "a/b/c", True),
    ("a/b/c", "a/b/x", False),
    ("a/b", "a/b/c", False),                 # 过滤器短于主题不匹配
])
def test_match(filt, topic, expect):
    assert MiniMqttBroker._match(filt, topic) is expect


# ── relay: dgiot/# 订阅者必须收到发布 ──

class _FakeWriter:
    """记录 write 调用的最小 writer 桩"""

    def __init__(self):
        self.frames = []

    def write(self, data):
        self.frames.append(bytes(data))

    async def drain(self):
        pass


def _parse_publish(frame: bytes):
    assert (frame[0] >> 4) == 3, f"非 PUBLISH 帧: {frame.hex()}"
    # 剩余长度 varint
    rlen = 0; mult = 1; off = 1
    while True:
        b = frame[off]; off += 1
        rlen += (b & 0x7F) * mult; mult *= 128
        if not b & 0x80:
            break
    body = frame[off:off + rlen]
    tlen = int.from_bytes(body[0:2], "big")
    return body[2:2 + tlen].decode(), body[2 + tlen:]


@pytest.mark.asyncio
async def test_relay_delivers_to_hash_wildcard_subscriber():
    broker = MiniMqttBroker()
    sub = _FakeWriter()
    broker._subs["dgiot/#"] = {sub}
    sender = _FakeWriter()   # 发布者自身不应收到

    payload = json.dumps({"ping": 1}).encode()
    await broker._relay("dgiot/smoke/echo", payload, sender)

    assert len(sub.frames) == 1, "dgiot/# 订阅者未收到消息 (通配投递失效)"
    topic, got = _parse_publish(sub.frames[0])
    assert topic == "dgiot/smoke/echo"
    assert json.loads(got) == {"ping": 1}
    assert sender.frames == []


@pytest.mark.asyncio
async def test_relay_single_level_plus_and_no_self_echo():
    broker = MiniMqttBroker()
    a = _FakeWriter()
    b = _FakeWriter()
    c = _FakeWriter()
    broker._subs["dgiot/+/meta"] = {c}
    broker._subs["other/#"] = {b}

    await broker._relay("dgiot/gw9/meta", b'{"v":2}', a)   # a 是发布者

    assert len(a.frames) == 0              # 不自环
    assert len(b.frames) == 0              # other/# 不命中
    topic, got = _parse_publish(c.frames[0])
    assert topic == "dgiot/gw9/meta"       # +' 单层命中
    assert json.loads(got) == {"v": 2}
