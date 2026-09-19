# -*- coding: utf-8 -*-
"""EventBus 的 key 是精确匹配 —— 通配 key 注册了也永不触发

`EventBus.emit()` 是 `self._hooks.get(key, [])` 的字典查找，**没有通配符匹配**。
但 `on()` 从不校验 key，于是 `bus.on("device.*.saved", ...)` 会安静地注册到
字面量 key `"device.*.saved"` 上，而 emit 侧发的是 `"device.saved"` ——
段数都对不上，回调永远不会被调用。

这是最难查的一类 bug：注册成功、没有报错、进程正常，只有"这个功能怎么没反应"。
`ch_edge_hub` 通道就踩在里面：它 4 个订阅里 3 个是通配
（`device.*.saved` / `device.*.telemetry` / `pipeline.*`），只剩
`alarm.triggered` 一个精确的能走 —— 而那个精确的又发到中枢不认的主题上，
于是整个通道在列表里显示 running 却什么也不做。该文件已于 2026-09-12 删除。

这里把语义钉住。哪天给 EventBus 加了通配支持，这些测试会红 —— 那正是
需要重新审视所有调用方的时刻，不是顺手改测试的时刻。
"""
import logging

import pytest

from src.eventbus import EventBus


@pytest.fixture
def bus():
    return EventBus()


# ── 精确匹配语义 ──

def test_emit_is_exact_match(bus):
    hits = []
    bus.on("device.saved", lambda **kw: hits.append(1))
    bus.emit("device.saved")
    assert hits == [1]


def test_glob_key_never_fires(bus):
    """核心回归锁：通配 key 收不到任何东西"""
    hits = []
    bus.on("device.*.saved", lambda **kw: hits.append(1))
    for evt in ("device.saved", "device.ch1.saved", "device.*.saved"):
        bus.emit(evt)
    # 只有把通配符本身当事件名发（现实中没人这么干）才命中
    assert hits == [1], "通配 key 的行为变了 —— EventBus 加通配支持了？"


def test_pipeline_glob_does_not_match_concrete_event(bus):
    hits = []
    bus.on("pipeline.*", lambda **kw: hits.append(1))
    bus.emit("pipeline.point_written")
    bus.emit("pipeline.stats")
    assert hits == []


def test_glob_key_registration_is_reported(caplog):
    """注册期就要喊 —— 别让它安静地躺在那儿"""
    b = EventBus()
    with caplog.at_level(logging.ERROR):
        b.on("device.*.telemetry", lambda **kw: None)
    assert "通配符" in caplog.text
    assert "device.*.telemetry" in caplog.text


def test_exact_key_registration_is_silent(caplog):
    b = EventBus()
    with caplog.at_level(logging.ERROR):
        b.on("device.saved", lambda **kw: None)
    assert caplog.text == ""


# ── 真实注册点复核 ──

#: 全仓现存通配注册的**完整清单** —— 只有这些，新增一个就得表态
#
# 2026-09-12 清空：原先的三条（device.*.saved / device.*.telemetry / pipeline.*）
# 全落在 `src/protocols/edge_hub_channel.py` 一个文件里，全都永不触发。该文件
# 已整体删除（它 4 个订阅里唯一能走的 alarm.triggered 恰好是已裁决要删掉的
# MQTT 出口，留下的壳只会显示 running 而什么都不做）。
#
# 清单空着不等于这条锁退休 —— 空集让守卫更严：**任何**新增通配注册立刻变红。
KNOWN_DEAD_GLOBS: set = set()


def test_glob_registrations_are_an_inventory_that_cannot_grow_silently():
    """通配注册是一份**清单**，不是随手能加的写法

    锁住这个集合，是为了让"再加一条通配订阅"变成必须改测试的动作 ——
    改的时候就会看见这里的说明：EventBus 不会帮你匹配，它永不触发。
    """
    import pathlib
    import re
    root = pathlib.Path(__file__).resolve().parents[1]
    found = {}
    for base in ("src", "plugins"):
        for p in (root / base).rglob("*.py"):
            txt = p.read_text(encoding="utf-8")
            for k in re.findall(r'\.on\(\s*["\']([^"\']*\*[^"\']*)["\']', txt):
                found.setdefault(k, []).append(
                    p.relative_to(root).as_posix())

    assert set(found) == KNOWN_DEAD_GLOBS, (
        f"通配注册清单变了。\n"
        f"  新增: {sorted(set(found) - KNOWN_DEAD_GLOBS)}（它们不会触发，请改成完整事件名）\n"
        f"  消失: {sorted(KNOWN_DEAD_GLOBS - set(found))}（收口了？请更新本清单）\n"
        f"  位置: { {k: v for k, v in found.items()} }")
