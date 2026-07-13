"""
通道实例管理器 — 对标 边缘中枢 dlink 9 种接入模式
==================================================
每个网络连接都是一个 Channel 实例，统一生命周期管理。

cType (9 种 dlink 模式):
  CONNECT   — 主动 TCP 连接 (Modbus TCP, OPC UA)
  LISTEN    — 监听端口 (内置 MQTT Broker, HTTP Server)
  BRIDGE    — 双向桥接 (MQTT ↔ EventBus, Oracle ↔ TDengine)
  AGENT     — 子设备代理 (边缘代理 → 中枢)
  SERIAL    — 串口 (COM 端口)
  POLL      — 定时轮询 (HTTP REST API, Oracle)
  SUBSCRIBE — 消息订阅 (MQTT Topic)
  CUSTOM    — 自定义协议 (CommBridge)
  DTU       — 无线终端 (GPRS/CDMA)
"""
from __future__ import annotations
import asyncio, logging, time
from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, Optional, Any, Callable, Awaitable

log = logging.getLogger("channel.registry")

# ═══════════════════════════════════════════
# 枚举 & 模型
# ═══════════════════════════════════════════

class CType(str, Enum):
    CONNECT   = "connect"
    LISTEN    = "listen"
    BRIDGE    = "bridge"
    AGENT     = "agent"
    SERIAL    = "serial"
    POLL      = "poll"
    SUBSCRIBE = "subscribe"
    CUSTOM    = "custom"
    DTU       = "dtu"

@dataclass
class ChannelInstance:
    """通道实例 — 对标 dlink Channel 运行时"""
    channel_id: str
    cType: CType
    name: str
    config: dict = field(default_factory=dict)
    status: str = "stopped"              # stopped → starting → running → error
    started_at: float = 0.0
    error_msg: str = ""
    metadata: dict = field(default_factory=dict)  # 类型特定元数据

    # 生命周期钩子 (由具体实现注入)
    _on_start: Optional[Callable[[], Awaitable[None]]] = field(default=None, repr=False)
    _on_stop:  Optional[Callable[[], Awaitable[None]]] = field(default=None, repr=False)
    _on_health: Optional[Callable[[], Awaitable[dict]]] = field(default=None, repr=False)

    @property
    def uptime(self) -> float:
        return time.time() - self.started_at if self.started_at else 0

    def snapshot(self) -> dict:
        return {
            "channel_id": self.channel_id,
            "cType": self.cType.value,
            "name": self.name,
            "status": self.status,
            "uptime": round(self.uptime, 1),
            "config_keys": list(self.config.keys()),
            "error": self.error_msg,
            **self.metadata,
        }

# ═══════════════════════════════════════════
# 通道实例注册表
# ═══════════════════════════════════════════

class ChannelManager:
    """通道实例管理器 — 对标 dgiot_dlink 通道调度"""
    _instances: Dict[str, ChannelInstance] = {}

    @classmethod
    def register(cls, channel: ChannelInstance):
        cls._instances[channel.channel_id] = channel
        log.info(f"[channel] registered {channel.channel_id} ({channel.cType.value})")

    @classmethod
    def get(cls, channel_id: str) -> Optional[ChannelInstance]:
        return cls._instances.get(channel_id)

    @classmethod
    def list_all(cls) -> list:
        return [ch.snapshot() for ch in cls._instances.values()]

    @classmethod
    def list_by_type(cls, cType: CType) -> list:
        return [ch.snapshot() for ch in cls._instances.values() if ch.cType == cType]

    @classmethod
    async def start(cls, channel_id: str) -> bool:
        ch = cls._instances.get(channel_id)
        if not ch:
            log.warning(f"[channel] {channel_id} not found")
            return False
        if ch.status == "running":
            return True
        try:
            ch.status = "starting"
            ch.error_msg = ""
            if ch._on_start:
                await ch._on_start()
            ch.status = "running"
            ch.started_at = time.time()
            log.info(f"[channel] {channel_id} started")
            return True
        except Exception as e:
            ch.status = "error"
            ch.error_msg = str(e)
            log.error(f"[channel] {channel_id} start failed: {e}")
            return False

    @classmethod
    async def stop(cls, channel_id: str) -> bool:
        ch = cls._instances.get(channel_id)
        if not ch or ch.status == "stopped":
            return True
        try:
            if ch._on_stop:
                await ch._on_stop()
            ch.status = "stopped"
            ch.started_at = 0
            log.info(f"[channel] {channel_id} stopped")
            return True
        except Exception as e:
            ch.error_msg = str(e)
            log.error(f"[channel] {channel_id} stop failed: {e}")
            return False

    @classmethod
    async def start_all(cls) -> Dict[str, bool]:
        results = {}
        for cid in cls._instances:
            results[cid] = await cls.start(cid)
        return results

    @classmethod
    async def stop_all(cls) -> Dict[str, bool]:
        results = {}
        for cid in cls._instances:
            results[cid] = await cls.stop(cid)
        return results

    @classmethod
    def health(cls) -> dict:
        total = len(cls._instances)
        running = sum(1 for ch in cls._instances.values() if ch.status == "running")
        errors  = sum(1 for ch in cls._instances.values() if ch.status == "error")
        return {
            "total": total,
            "running": running,
            "stopped": total - running - errors,
            "errors": errors,
            "channels": cls.list_all(),
        }

# ═══════════════════════════════════════════
# 通道插件注册 (一个通道 = 一个插件)
# ═══════════════════════════════════════════

def register_channel_plugin(
    channel_id: str,
    cType: CType,
    name: str,
    *,
    version: str = "1.0",
    config: dict = None,
    license_key: str = "",
    price: str = "",
    description: str = "",
    on_start: Callable = None,
    on_stop: Callable = None,
    on_health: Callable = None,
    **metadata,
) -> ChannelInstance:
    """注册通道插件 — 同时在 plugin_registry + ChannelManager 注册

    一个通道 = 一个插件 = 一个可售卖/可授权单元

    Args:
        channel_id:  唯一标识 (e.g. "ch_dtu_server")
        cType:       dlink 接入模式
        name:        显示名称
        version:     版本号
        config:      默认配置
        license_key: 授权密钥 (空=免费)
        price:       定价描述
        description: 功能描述
        on_start:    启动回调
        on_stop:     停止回调
        on_health:   健康检查回调
    """
    cfg = config or {}

    # 1. 注册到插件系统 (plugin_registry)
    try:
        from .plugin_registry import register as register_plugin
        register_plugin(
            channel_id,
            version=version,
            category="channel",
            cType=cType.value,
            config=cfg,
            license=license_key,
            price=price,
            description=description,
            enabled=cfg.get("isEnable", True),
            depends=cfg.get("depends", []),
        )
    except ImportError:
        log.warning(f"[channel] plugin_registry not available, skip plugin register for {channel_id}")

    # 2. 注册到通道系统 (ChannelManager)
    ch = ChannelInstance(
        channel_id=channel_id,
        cType=cType,
        name=name,
        config=cfg,
        metadata={**metadata, "version": version, "license": license_key, "price": price},
    )
    ch._on_start = on_start
    ch._on_stop = on_stop
    ch._on_health = on_health
    ChannelManager.register(ch)
    return ch


def make_channel(channel_id: str, cType: CType, name: str,
                 config: dict = None,
                 on_start: Callable = None,
                 on_stop: Callable = None,
                 on_health: Callable = None,
                 **metadata) -> ChannelInstance:
    """创建通道实例并注册 (简化版, 向后兼容)"""
    return register_channel_plugin(
        channel_id=channel_id, cType=cType, name=name,
        config=config, on_start=on_start, on_stop=on_stop,
        on_health=on_health, **metadata,
    )


def init_channels_from_plugins():
    """从已注册插件中初始化通道 (启动时调用)
    只初始化 enabled=True + category='channel' 的插件
    """
    try:
        from .plugin_registry import list_all
        plugins = list_all("channel")
        count = 0
        for p in plugins:
            if not p.get("enabled", True):
                log.info(f"[channel] plugin {p['name']} disabled, skip")
                continue
            # 已注册的不重复
            if p["name"] in ChannelManager._instances:
                continue
            # 需要插件提供 make_channel 的元数据
            meta = p.get("metadata", {})
            make_channel(
                channel_id=p["name"],
                cType=CType(p.get("cType", "custom")),
                name=meta.get("name", p["name"]),
                config=p.get("config_schema", {}),
                on_start=meta.get("on_start"),
                on_stop=meta.get("on_stop"),
                on_health=meta.get("on_health"),
                license=p.get("license", ""),
                price=p.get("price", ""),
            )
            count += 1
        if count:
            log.info(f"[channel] {count} channels loaded from plugins")
    except ImportError:
        pass
