# -*- coding: utf-8 -*-
"""EventBus 的接线图 —— 谁在发、谁在收，对不上的地方要显形

`src/eventbus.py` 的模块文档写着「层间解耦的核心机制。所有跨层通信通过
EventBus 而非直接调用」。实际盘下来不是这样：真正在跑的跨层通信走的是
直接回调（`collector.on_data(...)`），EventBus 上大部分事件是**单边**的 ——
有发没收，或有收没发。

单边不是错，是**没人知道**才危险：`dtu.raw_frame` 有发射点没订阅者，
于是 modbus RTU 那条 `EventBus → decoder → $dg/thing/{pid}/{devaddr}/properties/report`
的上行链整条不走，而链路上每段代码看起来都好好的。

这里只做一件事：**把接线图钉成数据**。新增/删掉一条边就得改这张表，
改的时候自然会问"另一边呢"。
"""
import pathlib
import re

import pytest

#: 有订阅者的事件 → 谁注册的（发射点见 EMIT_ONLY）
SUBSCRIBE_ONLY = {
    "pipeline.point_written": ["src/main.py"],
    "device.shadow_change":   ["src/main.py"],
    # rules_engine 在 start 时才注册；谁也没发过 telemetry.received。
    # 真正在跑的告警判定走的是 main.py 的直接回调 collector.on_data(alarm_engine.evaluate)，
    # 不是这条 —— 所以它一直没症状。
    "telemetry.received":     ["src/services/rules_engine.py"],
}

#: 有发射点的事件 → 谁发的（订阅者见 SUBSCRIBE_ONLY）
EMIT_ONLY = {
    "device.saved":              ["plugins/parse_hooks/plugin.py"],
    "dtu.device_registered":     ["src/protocols/modbus_rtu_server.py"],
    "dtu.raw_frame":             ["src/protocols/modbus_rtu_server.py"],
    "task.channel_report":       ["src/protocols/modbus_rtu_server.py"],
    "dtu.device_disconnected":   ["src/protocols/modbus_rtu_server.py"],
    "opcda.stats":               ["src/services/opcda_point_stats.py"],
    # 2026-09-12 从 CONNECTED 降级到这里：唯一的订阅者
    # `src/protocols/edge_hub_channel.py` 已删除（它把 alarm 发到
    # `dgiot/.../ch_edge_hub/alarms`，正是已裁决要删掉的那个 MQTT 出口）。
    # 两个发射点都还在（parse_hooks 的 alarm_after_save、rules_engine），
    # emit 本身是接口不是 bug —— 但今天确实没人接。
    "alarm.triggered":           ["plugins/parse_hooks/plugin.py",
                                  "src/services/rules_engine.py"],
}

#: 真的接上了的（发→收）
#
# 2026-09-12 **清空**：唯一那条 `alarm.triggered: rules_engine / parse_hooks →
# edge_hub_channel` 随 edge_hub_channel 的删除而消失，见上面 EMIT_ONLY 的说明。
# 空着不等于这条判据退休 —— 一旦往这里加一条，两端就必须真的都在。
CONNECTED: dict = {}


_TRIPLE = re.compile(r'"""(?:.|\n)*?"""|\'\'\'(?:.|\n)*?\'\'\'', re.S)


def _strip(text: str) -> str:
    """剥掉注释与文档串，只留可执行代码

    不剥的话，一段解释"以前这里写的是 `EventBus()`"的注释就会被当成代码 ——
    本文件自己的断言已经栽过一次。散落的裸行注释也要去（`# ` 到行尾），
    但字符串里的 `#` 得留着（主题里就有）。
    """
    text = _TRIPLE.sub("", text)
    out = []
    for line in text.splitlines():
        in_str = False
        quote = ""
        for i, ch in enumerate(line):
            if in_str:
                if ch == quote and line[i - 1] != "\\":
                    in_str = False
            elif ch in "\"'":
                in_str, quote = True, ch
            elif ch == "#":
                line = line[:i]
                break
        out.append(line)
    return "\n".join(out)


def _scan(pattern: str) -> dict:
    """扫出 {事件名: [文件]}"""
    root = pathlib.Path(__file__).resolve().parents[1]
    rx = re.compile(pattern)
    found: dict = {}
    for base in ("src", "plugins"):
        for p in (root / base).rglob("*.py"):
            rel = p.relative_to(root).as_posix()
            for name in rx.findall(_strip(p.read_text(encoding="utf-8"))):
                found.setdefault(name, set()).add(rel)
    return {k: sorted(v) for k, v in found.items()}


def _subscribed() -> dict:
    """所有字面量 on() 的 key（含通配）"""
    return _scan(r'\.on\(\s*["\']([^"\']+)["\']')


def _emitted() -> dict:
    """所有字面量 emit() 的事件名（排除通配符与动态拼串）"""
    return _scan(r'\.emit\(\s*["\']([^"\'*]+)["\']')


def test_emit_only_inventory():
    """有发没收的，一个不多一个不少

    这些不是 bug —— 是**接口**：EventBus 允许先埋钩子后接人。但数量必须显式，
    否则"我发了怎么没人应"会反复出现。新增一条就改这里。
    """
    got = {k: v for k, v in _emitted().items() if k not in CONNECTED}
    assert got == EMIT_ONLY, (
        f"有发没收的清单变了。\n"
        f"  新增: {sorted(set(got) - set(EMIT_ONLY))}\n"
        f"  消失: {sorted(set(EMIT_ONLY) - set(got))}\n"
        f"  实际: {got}")


def test_subscribe_only_inventory():
    """有收没发的，同样锁住"""
    subs = {k: v for k, v in _subscribed().items()
            if "*" not in k and k not in CONNECTED}
    assert subs == SUBSCRIBE_ONLY, (
        f"有收没发的清单变了。\n"
        f"  新增: {sorted(set(subs) - set(SUBSCRIBE_ONLY))}\n"
        f"  消失: {sorted(set(SUBSCRIBE_ONLY) - set(subs))}\n"
        f"  实际: {subs}")


def test_connected_events_really_have_both_ends():
    """标成"接上了"的事件，两端都必须存在 —— 别把单边错标成双边

    CONNECTED 目前是空的，所以这条现在空转。留着是因为它仍然守着
    "往 CONNECTED 里加条目"这个动作 —— 而不是让人以为"没红就是没问题"。
    """
    subs, emits = _subscribed(), _emitted()
    for evt in CONNECTED:
        assert evt in subs, f"{evt} 标了 CONNECTED 但没有订阅者"
        assert evt in emits, f"{evt} 标了 CONNECTED 但没有发射点"
    # 反向核对：EMIT_ONLY 与 SUBSCRIBE_ONLY 不该有交集 —— 两边都占的事件
    # 应该标进 CONNECTED，否则上面两条清单的语义就糊了
    overlap = (set(EMIT_ONLY) & set(SUBSCRIBE_ONLY)) - set(CONNECTED)
    assert not overlap, f"这些事件两边都有，应标进 CONNECTED: {sorted(overlap)}"


def test_modbus_rtu_uplink_is_dead_at_the_eventbus_hop():
    """那条 dlink 正确的上行链，死在 EventBus 这一跳

    `src/protocols/modbus_rtu_server.py` 的模块文档写着
    `EventBus("dtu.raw_frame") → modbus_rtu decoder → $dg/thing/{product}/{devaddr}/...`
    但全仓没人 `on("dtu.raw_frame")` —— 上半段（发）在，下半段（收）不在。
    这条断言就是那个"断点"，收口时把它当待办清单的一行。
    """
    assert "dtu.raw_frame" in _emitted(), "发射点没了？那这条注释该删"
    assert "dtu.raw_frame" not in _subscribed(), (
        "有人接上 dtu.raw_frame 了 —— 那条上行链通了，请更新本文件的清单")


# ── 桥接必须用单例 bus ──

def test_mqtt_bridge_uses_the_singleton_bus():
    """`ch_mqtt_bridge` 曾经 `EventBus()` 新建实例再 emit —— 投进空表

    那个实例的 _hooks 永远是空的（钩子都注册在 `src/eventbus.py` 的 `bus`
    单例上），所以桥接把每条消息解码、emit、丢掉，全程无错无日志。
    变量名还叫 `bus`，读代码时看不出任何异常。
    """
    root = pathlib.Path(__file__).resolve().parents[1]
    src = (root / "src" / "channel_bootstrap.py").read_text(encoding="utf-8")
    body = _strip(src.split("def on_msg", 1)[1].split("client.on_message", 1)[0])
    assert "= EventBus()" not in body, "又新建实例了 —— 应该用 eventbus.bus 单例"
    assert "from .eventbus import bus" in body, "没导入单例 bus"


def test_main_bridge_uses_the_singleton_bus():
    """main.py 的另一个同款桥接也走单例"""
    root = pathlib.Path(__file__).resolve().parents[1]
    src = (root / "src" / "main.py").read_text(encoding="utf-8")
    body = _strip(src.split("def _setup_mqtt_eventbus_bridge", 1)[1]
                  .split("def stop_mqtt_eventbus_bridge", 1)[0])
    assert "from .eventbus import bus" in body
    assert "= EventBus()" not in body


def test_there_are_two_mqtt_to_eventbus_bridges():
    """**两个**同款桥接并存，订阅同一个 `dgiot/#`，发同样的事件名

    这条不是断言"应该有两个"，是把重复这件事记下来：两边都往 `mqtt.<末段>`
    发，订阅者一出现就会收到双份。收口时二选一。
    """
    root = pathlib.Path(__file__).resolve().parents[1]
    subs = []
    for rel in ("src/main.py", "src/channel_bootstrap.py"):
        txt = (root / rel).read_text(encoding="utf-8")
        if re.search(r'\.subscribe\(\s*["\']dgiot/#["\']', txt):
            subs.append(rel)
    assert subs == ["src/main.py", "src/channel_bootstrap.py"], (
        f"订阅 dgiot/# 的位置变了: {subs} —— 桥接去重了？请更新本文件")
