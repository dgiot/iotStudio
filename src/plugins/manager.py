# ============================================================
# ChannelManager — 通道生命周期管理器
# 对标 dgiot dgiot_channel 的通道管理行为
# ============================================================
import asyncio, logging
from typing import Dict, List, Optional
from .channel import PluginChannel, ChannelStatus
from .registry import registry

log = logging.getLogger("plugin.manager")

class ChannelManager:
    """管理所有插件通道的创建·启动·停止·状态

    Product 创建 → auto_create_channels(product_id, ctypes)
    通道自动生成: Channel + TDChannel + TaskChannel
    """
    _channels: Dict[str, PluginChannel] = {}

    @classmethod
    def create_channel(cls, channel_id: str, ctype: str, *,
                       name: str = "", host: str = "", port: int = 0,
                       interval: int = 5, config: dict = None,
                       product_id: str = "", device_ids: List[str] = None) -> Optional[PluginChannel]:
        """创建一个通道实例"""
        plugin = registry.get(ctype)
        if not plugin:
            log.warning(f"Plugin not registered: {ctype}")
            return None
        ch = PluginChannel(
            channel_id=channel_id, name=name or plugin["name"],
            cType=ctype, protocol=plugin["name"],
            host=host, port=port or plugin["default_port"],
            interval=interval, config=config or {},
            product_id=product_id, device_ids=device_ids or [],
            _factory=plugin["factory"]
        )
        cls._channels[channel_id] = ch
        return ch

    @classmethod
    def auto_create_channels(cls, product_id: str, ctypes: List[str], **kwargs):
        """Product 创建时自动生成采集/时序/任务三通道"""
        channels = []
        for ct in ctypes:
            ch = cls.create_channel(f"ch_{ct}_{product_id}", ct, product_id=product_id, **kwargs)
            if ch: channels.append(ch)
        # TDChannel (时序通道) — 自动创建
        td = PluginChannel(
            channel_id=f"td_{product_id}", name=f"TDChannel-{product_id}",
            cType="tdengine", protocol="TDengine", product_id=product_id, interval=10
        )
        cls._channels[td.channel_id] = td; channels.append(td)
        # TaskChannel (任务队列) — 自动创建
        tk = PluginChannel(
            channel_id=f"task_{product_id}", name=f"TaskChannel-{product_id}",
            cType="task", protocol="Task", product_id=product_id, interval=0
        )
        cls._channels[tk.channel_id] = tk; channels.append(tk)
        return channels

    @classmethod
    async def start_all(cls) -> Dict[str, bool]:
        """启动全部通道"""
        results = {}
        for cid, ch in cls._channels.items():
            results[cid] = await ch.start()
        return results

    @classmethod
    async def stop_all(cls):
        for ch in cls._channels.values():
            await ch.stop()

    @classmethod
    async def start_one(cls, channel_id: str) -> bool:
        ch = cls._channels.get(channel_id)
        if ch: return await ch.start()
        return False

    @classmethod
    async def stop_one(cls, channel_id: str):
        ch = cls._channels.get(channel_id)
        if ch: await ch.stop()

    @classmethod
    def get(cls, channel_id: str) -> Optional[PluginChannel]:
        return cls._channels.get(channel_id)

    @classmethod
    def list_all(cls) -> List[dict]:
        return [ch.to_dict() for ch in cls._channels.values()]

    @classmethod
    def list_by_ctype(cls, ctype: str) -> List[dict]:
        return [ch.to_dict() for ch in cls._channels.values() if ch.cType == ctype]

    @classmethod
    def status_summary(cls) -> dict:
        chs = list(cls._channels.values())
        return {
            "total": len(chs),
            "online": sum(1 for c in chs if c.status == ChannelStatus.online),
            "offline": sum(1 for c in chs if c.status == ChannelStatus.offline),
            "error": sum(1 for c in chs if c.status == ChannelStatus.error),
            "by_type": {
                ct: sum(1 for c in chs if c.cType == ct)
                for ct in sorted(set(c.cType for c in chs))
            }
        }

    @classmethod
    def export_config(cls) -> dict:
        """导出全部通道配置，用于备份/迁移"""
        return {
            cid: {
                "ctype": ch.cType, "name": ch.name, "host": ch.host,
                "port": ch.port, "interval": ch.interval,
                "config": ch.config, "product_id": ch.product_id
            }
            for cid, ch in cls._channels.items()
        }

    @classmethod
    def import_config(cls, data: dict):
        """从配置恢复通道"""
        for cid, cfg in data.items():
            cls.create_channel(cid, cfg["ctype"], name=cfg["name"],
                host=cfg["host"], port=cfg["port"], interval=cfg["interval"],
                config=cfg["config"], product_id=cfg["product_id"])
