# -*- coding: utf-8 -*-
"""通道收尾 (on_stop) 的契约

起因：`ch_dgiot_push` 的 on_stop 写成了
`lambda: _channels_state.pop('dgiot_bridge', None)`，
lambda 把弹出的 DGIoTBridge 对象当了返回值，而 ChannelManager.stop 只会
`await ch._on_stop()` —— 于是每次关闭都记一条
`'DGIoTBridge' object can't be awaited`。

真正麻烦的不是那一行，是**它在收尾阶段报错**：进程都在退了，没人盯日志，
错误就那么一直挂着，而连接线程照样泄漏。所以这里把契约钉住：
on_stop 同步/异步都收，返回值一律忽略。
"""
import asyncio

import pytest

from src.channel_registry import ChannelManager, CType, make_channel


@pytest.fixture(autouse=True)
def _clean_registry():
    saved = dict(ChannelManager._instances)
    ChannelManager._instances.clear()
    yield
    ChannelManager._instances.clear()
    ChannelManager._instances.update(saved)


@pytest.mark.asyncio
async def test_sync_on_stop_returning_value_is_not_awaited():
    """回归锁：同步 on_stop 返回非 None 时不能抛 can't be awaited"""
    make_channel("t1", CType.AGENT, "测试通道",
                 on_start=_noop, on_stop=lambda: {"popped": "object"})
    await ChannelManager.start("t1")          # 不 start 的话 status 已是 stopped，stop() 会短路
    assert await ChannelManager.stop("t1") is True
    assert ChannelManager._instances["t1"].status == "stopped"


@pytest.mark.asyncio
async def test_async_on_stop_still_awaited():
    calls = []

    async def stop_it():
        calls.append(1)

    make_channel("t2", CType.AGENT, "测试通道", on_start=_noop, on_stop=stop_it)
    await ChannelManager.start("t2")
    assert await ChannelManager.stop("t2") is True
    assert calls == [1]


@pytest.mark.asyncio
async def test_sync_on_stop_with_no_return_works():
    calls = []
    make_channel("t3", CType.AGENT, "测试通道",
                 on_start=_noop, on_stop=lambda: calls.append(1))
    await ChannelManager.start("t3")
    assert await ChannelManager.stop("t3") is True
    assert calls == [1]


@pytest.mark.asyncio
async def test_on_stop_exception_is_still_reported():
    """放宽契约不等于吞异常 —— 收尾真的失败还是要记 error_msg"""
    def boom():
        raise RuntimeError("收尾炸了")

    make_channel("t4", CType.AGENT, "测试通道", on_start=_noop, on_stop=boom)
    await ChannelManager.start("t4")
    assert await ChannelManager.stop("t4") is False
    assert "收尾炸了" in (ChannelManager._instances["t4"].error_msg or "")


@pytest.mark.asyncio
async def test_stop_without_on_stop_is_ok():
    make_channel("t5", CType.AGENT, "测试通道", on_start=_noop)
    await ChannelManager.start("t5")
    assert await ChannelManager.stop("t5") is True


async def _noop():
    return None
