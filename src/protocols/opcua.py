"""OPC UA 协议适配器插件 — 统一架构工业通信"""
import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional

log = logging.getLogger("opcua")


@dataclass
class OpcUaConfig:
    """OPC UA 协议配置

    Attributes:
        endpoint_url: OPC UA 服务器端点 (opc.tcp://host:port)
        security_policy: 安全策略 (None / Basic256Sha256)
        username: 用户名 (可选, 匿名时留空)
        password: 密码 (可选)
        timeout: 连接超时 (秒)
        retry: 重试次数
    """
    endpoint_url: str = "opc.tcp://127.0.0.1:4840"
    security_policy: str = "None"
    username: str = ""
    password: str = ""
    timeout: int = 10
    retry: int = 3


class OpcUaAdapter:
    """OPC UA 协议适配器 — 统一架构工业通信

    对接 Siemens/Rockwell/KEPServerEX 等支持 OPC UA 的服务器。
    支持浏览地址空间、读取节点值、订阅数据变化。
    完整协议实现见 opcua_client.py (基于 asyncua + BaseProtocolAdapter)，
    本插件提供符合 plugin_registry 标准的接入接口。
    """

    def __init__(self, config: OpcUaConfig):
        self.config = config
        self._client: Optional[Any] = None
        self._connected = False

    async def connect(self) -> bool:
        """建立 OPC UA 会话连接

        支持匿名和用户名/密码认证两种方式。
        根据 security_policy 配置选择安全策略。
        """
        try:
            from asyncua import Client as OPCUAClient

            self._client = OPCUAClient(url=self.config.endpoint_url, timeout=self.config.timeout)

            if self.config.security_policy != "None":
                self._client.set_security_string(
                    f"{self.config.security_policy},SignAndEncrypt,cert.pem,key.pem"
                )

            await self._client.connect()

            if self.config.username:
                self._client.set_user(self.config.username)
                self._client.set_password(self.config.password)

            self._connected = True
            log.info(f"[opcua] 连接成功 {self.config.endpoint_url}")
            return True
        except ImportError:
            log.error("[opcua] asyncua 未安装, pip install asyncua")
            self._connected = False
            return False
        except Exception as e:
            log.error(f"[opcua] 连接失败 {self.config.endpoint_url}: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        """断开 OPC UA 会话"""
        if self._client:
            try:
                await self._client.disconnect()
            except Exception:
                pass
        self._connected = False
        log.info(f"[opcua] 已断开 {self.config.endpoint_url}")

    async def browse(self, node_id: str = "ns=0;i=84") -> List[Dict[str, Any]]:
        """浏览 OPC UA 地址空间

        Args:
            node_id: 起始节点 ID (默认 Objects 根节点)

        Returns:
            [{"node_id": str, "display_name": str, "node_class": str}, ...]
        """
        if not self._client or not self._connected:
            return []
        try:
            root = self._client.get_node(node_id)
            nodes = []
            for child in await root.get_children():
                display = (await child.read_display_name()).Text
                node_class = await child.read_node_class()
                nodes.append({
                    "node_id": child.nodeid.to_string(),
                    "display_name": display or "",
                    "node_class": str(node_class),
                })
            return nodes
        except Exception as e:
            log.error(f"[opcua] browse 失败 node_id={node_id}: {e}")
            return []

    async def read_node(self, node_id: str) -> Optional[Dict[str, Any]]:
        """读取单个 OPC UA 节点值

        Args:
            node_id: 节点标识符 (如 ns=2;i=1234)

        Returns:
            {"node_id": str, "value": Any, "data_type": str, "quality": str} 或 None
        """
        if not self._client or not self._connected:
            return None
        try:
            from asyncua import ua

            node = self._client.get_node(node_id)
            val = await node.read_value()
            dtype = await node.read_data_type_as_variant_type()
            return {
                "node_id": node_id,
                "value": val,
                "data_type": str(dtype) if dtype else "auto",
                "quality": "good",
            }
        except Exception as e:
            log.error(f"[opcua] read_node 失败 node_id={node_id}: {e}")
            return None

    async def subscribe(self, node_ids: List[str], callback: Optional[Callable] = None, interval_ms: int = 1000) -> bool:
        """订阅 OPC UA 节点数据变化

        Args:
            node_ids: 待订阅的节点 ID 列表
            callback: 回调函数 (node_id, value) -> None，为 None 时使用日志输出
            interval_ms: 订阅发布间隔 (毫秒)

        Returns:
            是否成功建立订阅
        """
        if not self._client or not self._connected:
            return False
        try:
            handler = _SubHandler(callback)
            subscription = await self._client.create_subscription(interval_ms, handler)
            for nid in node_ids:
                node = self._client.get_node(nid)
                await subscription.subscribe_data_change(node)
                log.info(f"[opcua] 订阅 {nid}")
            log.info(f"[opcua] 订阅完成, {len(node_ids)} 个节点")
            return True
        except Exception as e:
            log.error(f"[opcua] 订阅失败: {e}")
            return False

    async def health(self) -> Dict[str, Any]:
        """健康检查 — 测试服务器连接"""
        if self._connected:
            return {"ok": True, "msg": "已连接"}
        try:
            ok = await self.connect()
            return {"ok": ok, "msg": "已连接" if ok else "重连失败"}
        except Exception as e:
            return {"ok": False, "msg": str(e)}


class _SubHandler:
    """订阅回调包装器 — 将 asyncua 回调转发到用户回调或日志"""

    def __init__(self, callback: Optional[Callable] = None):
        self.callback = callback

    def datachange_notification(self, node, val, data):
        node_id = node.nodeid.to_string() if hasattr(node, 'nodeid') else str(node)
        if self.callback:
            try:
                self.callback(node_id, val)
            except Exception as e:
                log.warning(f"[opcua] 订阅回调异常: {e}")
        else:
            log.debug(f"[opcua] 数据变更 {node_id} = {val}")


# -- plugin registration --
try:
    from plugin_registry import register
    register("opcua", version="1.0", category="protocol",
             adapter="OpcUaAdapter",
             config={
                 "endpoint_url": "opc.tcp://127.0.0.1:4840",
                 "security_policy": "None",
                 "username": "",
                 "password": "",
             })
except ImportError:
    pass
