"""
EventBus — Hook 系统 (对标 DG-IoT dgiot_hook)
================================================
层间解耦的核心机制。所有跨层通信通过 EventBus 而非直接调用。

模式:
  - one_for_one: 单回调, 后注册的覆盖前者
  - one_for_more: 多回调链, 按注册顺序依次执行

用法:
  bus = EventBus()
  bus.on("device.connected", handle_connect, mode="one_for_more")
  bus.emit("device.connected", device_id="rtu_001", ip="192.168.1.1")

命名规范:
  {domain}.{event}  例: device.connected, data.received, alarm.triggered
"""
import logging
from collections import defaultdict
from typing import Any, Callable, Dict, List, Optional

log = logging.getLogger("eventbus")


class EventBus:
    """发布订阅事件总线 — 层间解耦"""

    def __init__(self):
        self._hooks: Dict[str, List[dict]] = defaultdict(list)

    # ── 注册 ──

    def on(self, key: str, callback: Callable, mode: str = "one_for_more"):
        """注册 Hook
        Args:
            key: 事件名, 如 "device.connected"
            callback: 回调函数 fn(**kwargs) -> Optional[Any]
            mode: one_for_one (单回调) 或 one_for_more (多回调链)
        """
        if mode == "one_for_one":
            self._hooks[key] = [{"fn": callback, "mode": mode}]
        else:
            self._hooks[key].append({"fn": callback, "mode": mode})
        log.debug(f"[eventbus] on {key} ({mode})")

    def off(self, key: str, callback: Optional[Callable] = None):
        """移除 Hook"""
        if callback is None:
            self._hooks.pop(key, None)
        else:
            self._hooks[key] = [h for h in self._hooks[key] if h["fn"] is not callback]

    # ── 触发 ──

    def emit(self, key: str, **kwargs) -> List[Any]:
        """触发事件, 返回所有回调的返回值列表"""
        results = []
        for hook in self._hooks.get(key, []):
            try:
                result = hook["fn"](**kwargs)
                if result is not None:
                    results.append(result)
            except Exception as e:
                log.error(f"[eventbus] {key} hook error: {e}")
        return results

    def emit_chain(self, key: str, initial_value: Any, **kwargs) -> Any:
        """链式触发: 每个回调的返回值作为下一个回调的输入"""
        value = initial_value
        for hook in self._hooks.get(key, []):
            try:
                value = hook["fn"](value, **kwargs)
            except Exception as e:
                log.error(f"[eventbus] {key} chain error: {e}")
        return value

    # ── 查询 ──

    def hooks(self, key: str = None) -> dict:
        """列出已注册的 Hook"""
        if key:
            return {key: len(self._hooks.get(key, []))}
        return {k: len(v) for k, v in self._hooks.items()}

    def clear(self):
        self._hooks.clear()


# ── 全局单例 ──
bus = EventBus()
