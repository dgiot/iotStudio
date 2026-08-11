# ============================================================
# PluginRegistry — 协议插件注册中心
# 对标 dgiot dgiot_bridge 的协议适配器注册机制
# ============================================================
from typing import Callable, Dict, List, Optional
from protocols.base import BaseProtocolAdapter, ProtocolConfig


class PluginRegistry:
    """全局协议插件注册中心

    用法:
        @registry.register("modbus_tcp", "Modbus TCP", factory=create_modbus_tcp)
        或
        registry.register("a11", "A11专有", factory=create_a11)
    """
    _plugins: Dict[str, dict] = {}

    @classmethod
    def register(cls, ctype: str, name: str, *,
                 factory: Callable[[ProtocolConfig], BaseProtocolAdapter],
                 default_port: int = 0,
                 category: str = "protocol",
                 description: str = ""):
        """注册一个协议插件

        ctype: 协议类型标识, 如 modbus_tcp / opcda / a11 / iec104 / mqtt
        name: 中文显示名
        factory: 工厂函数 (ProtocolConfig) -> BaseProtocolAdapter
        category: protocol / td / task / vendor
        """
        cls._plugins[ctype] = {
            "ctype": ctype, "name": name, "factory": factory,
            "default_port": default_port, "category": category,
            "description": description
        }

    @classmethod
    def get(cls, ctype: str) -> Optional[dict]:
        return cls._plugins.get(ctype)

    @classmethod
    def create(cls, ctype: str, config: ProtocolConfig) -> Optional[BaseProtocolAdapter]:
        p = cls._plugins.get(ctype)
        if p and p["factory"]:
            return p["factory"](config)
        return None

    @classmethod
    def list_all(cls) -> List[dict]:
        return [{"ctype": k, "name": v["name"], "category": v["category"],
                 "port": v["default_port"], "desc": v["description"]}
                for k, v in cls._plugins.items()]

    @classmethod
    def list_by_category(cls, category: str) -> List[dict]:
        return [p for p in cls.list_all() if p["category"] == category]

    @classmethod
    def ctype_names(cls) -> Dict[str, str]:
        return {k: v["name"] for k, v in cls._plugins.items()}


# 全局单例
registry = PluginRegistry
