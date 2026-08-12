"""
Channel 行为基类 + @protocol 装饰器 (对标 DG-IoT channel_type/behaviour)
======================================================================
每个协议通道继承 BaseChannel, 用 @protocol 装饰器自动注册。

用法:
  @protocol("modbus_tcp", version="1.0")
  class ModbusChannel(BaseChannel):
      async def init(self, config): ...
      async def handle_message(self, msg): ...
      async def handle_event(self, event): ...
      async def stop(self): ...

自动注册:
  import src.protocols.my_protocol  # 导入时自动注册
  ChannelRegistry.list()            # 列出所有已注册通道
"""
from __future__ import annotations
import logging
from abc import ABC, abstractmethod
from typing import Dict, Type, Optional, Any

log = logging.getLogger("channel")


class BaseChannel(ABC):
    """协议通道抽象基类 — 对标 DG-IoT dgiot_channelx behaviour"""

    def __init__(self, channel_id: str, config: dict = None):
        self.channel_id = channel_id
        self.config = config or {}
        self.status = "stopped"

    @abstractmethod
    async def init(self, **kwargs):
        """初始化通道 — 建立连接/注册回调"""
        ...

    @abstractmethod
    async def handle_message(self, message: Any) -> Optional[dict]:
        """处理协议消息 — 解码/转换/路由"""
        ...

    @abstractmethod
    async def handle_event(self, event: str, **payload) -> Optional[dict]:
        """处理事件 — 状态变更/配置更新/外部触发"""
        ...

    @abstractmethod
    async def stop(self):
        """停止通道 — 关闭连接/清理资源"""
        ...

    def snapshot(self) -> dict:
        return {"channel_id": self.channel_id, "status": self.status,
                "config": str(self.config)[:100]}


# ═══════════════════════════════════════════════════════════
# 协议装饰器 + 注册表
# ═══════════════════════════════════════════════════════════

class ChannelRegistry:
    """通道注册表 — 对标 DG-IoT dgiot_plugin"""
    _registry: Dict[str, dict] = {}

    @classmethod
    def register(cls, protocol: str, channel_class: Type[BaseChannel],
                 version: str = "1.0", category: str = "protocol", **meta):
        """注册通道类型"""
        cls._registry[protocol] = {
            "class": channel_class,
            "version": version,
            "category": category,
            "meta": meta,
        }
        log.info(f"[channel] registered {protocol} v{version} → {channel_class.__name__}")

    @classmethod
    def get(cls, protocol: str) -> Optional[Type[BaseChannel]]:
        entry = cls._registry.get(protocol)
        return entry["class"] if entry else None

    @classmethod
    def list(cls) -> list:
        return [{"protocol": k, **{kk: vv for kk, vv in v.items() if kk != "class"}}
                for k, v in cls._registry.items()]

    @classmethod
    def create(cls, protocol: str, channel_id: str, config: dict = None) -> Optional[BaseChannel]:
        """工厂: 根据协议名实例化通道"""
        entry = cls._registry.get(protocol)
        if not entry:
            log.warning(f"[channel] unknown protocol: {protocol}")
            return None
        return entry["class"](channel_id, config)


def protocol(name: str, version: str = "1.0", category: str = "protocol", **meta):
    """装饰器: 标记一个类为协议通道, 自动注册到 ChannelRegistry"""
    def decorator(cls):
        ChannelRegistry.register(name, cls, version=version, category=category, **meta)
        return cls
    return decorator
