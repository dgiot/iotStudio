# ============================================================
# pythonIot — OPC UA 协议客户端
# ============================================================
"""
OPC UA Client 适配器

依赖: asyncua (pip install asyncua)

支持:
  - 连接 OPC UA Server（匿名 / 用户名密码）
  - Browse 地址空间
  - 订阅 (Subscription) 模式
  - 轮询 (Read) 模式
  - 写入 (Write)
"""
import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from asyncua import Client, ua

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)


class OPCUAClient(BaseProtocolAdapter):
    """OPC UA Client 适配器

    config.extra:
    {
        "endpoint": "opc.tcp://192.168.1.100:4840",
        "username": null,
        "password": null,
        "security_policy": "None",   # None / Basic256Sha256
        "read_mode": "subscribe",    # subscribe / poll
    }
    """

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self.client: Optional[Client] = None
        self._subscription = None
        self._sub_handle_map: Dict[int, str] = {}  # handle → point_id
        self._data_queue: asyncio.Queue = asyncio.Queue()
        self._node_cache: Dict[str, ua.Node] = {}

    async def connect(self) -> bool:
        endpoint = self.config.extra.get("endpoint", "opc.tcp://127.0.0.1:4840")
        try:
            self.client = Client(url=endpoint, timeout=self.config.timeout)

            # 安全策略
            policy = self.config.extra.get("security_policy", "None")
            if policy != "None":
                self.client.set_security_string(f"Basic256Sha256,SignAndEncrypt,cert.pem,key.pem")

            await self.client.connect()

            # 认证
            username = self.config.extra.get("username")
            password = self.config.extra.get("password")
            if username:
                self.client.set_user(username)
                self.client.set_password(password)

            self._connected = True
            logger.info(f"[opcua] {self.device_id} 连接成功 endpoint={endpoint}")
            return True
        except Exception as e:
            logger.error(f"[opcua] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if self._subscription:
            try:
                await self._subscription.delete()
            except Exception:
                pass
        if self.client:
            try:
                await self.client.disconnect()
            except Exception:
                pass
        self._connected = False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """读取点位（订阅模式从队列取，轮询模式直接读）"""
        mode = self.config.extra.get("read_mode", "subscribe")

        if mode == "subscribe":
            results = []
            while not self._data_queue.empty():
                try:
                    pv = self._data_queue.get_nowait()
                    results.append(pv)
                except asyncio.QueueEmpty:
                    break
            return results
        else:
            # 轮询模式: 批量 Read
            return await self._poll_read(points)

    async def _poll_read(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """轮询读取"""
        if not self.client or not self._connected:
            return []

        results = []
        for pt in points:
            node_id_str = pt.get("protocol_addr", "")
            if not node_id_str:
                continue
            try:
                node = self.client.get_node(node_id_str)
                val = await node.read_value()
                results.append(PointValue(
                    device_id=self.device_id,
                    point_id=pt.get("point_id", ""),
                    point_name=pt.get("point_name", ""),
                    value=val,
                    data_type=pt.get("data_type", "float32"),
                    unit=pt.get("unit"),
                    timestamp=datetime.now(timezone.utc),
                ))
            except Exception as e:
                logger.debug(f"[opcua] 读取 {node_id_str} 失败: {e}")

        return results

    async def setup_subscription(self, points: List[Dict[str, Any]], interval_ms: int = 1000) -> bool:
        """建立订阅

        Args:
            points: 点位列表，protocol_addr 为 NodeId 字符串
            interval_ms: 订阅间隔(毫秒)
        """
        if not self.client or not self._connected:
            return False

        try:
            # 删除旧订阅
            if self._subscription:
                await self._subscription.delete()

            self._subscription = await self.client.create_subscription(interval_ms, self._sub_handler)
            self._sub_handle_map.clear()

            for pt in points:
                node_id_str = pt.get("protocol_addr", "")
                if not node_id_str:
                    continue
                try:
                    node = self.client.get_node(node_id_str)
                    handle = await self._subscription.subscribe_data_change(node)
                    self._sub_handle_map[handle] = pt.get("point_id", "")
                    logger.info(f"[opcua] 订阅 {node_id_str} → {pt.get('point_name', '')}")
                except Exception as e:
                    logger.warning(f"[opcua] 订阅 {node_id_str} 失败: {e}")

            logger.info(f"[opcua] {self.device_id} 订阅完成, {len(self._sub_handle_map)} 个点位")
            return True
        except Exception as e:
            logger.error(f"[opcua] 建立订阅失败: {e}")
            return False

    async def _sub_handler(self, handle: int, data: Any, _) -> None:
        """订阅数据回调"""
        point_id = self._sub_handle_map.get(handle, "")
        await self._data_queue.put(PointValue(
            device_id=self.device_id,
            point_id=point_id,
            point_name="",
            value=data.Value.Value if hasattr(data, 'Value') else data,
            data_type="auto",
            timestamp=datetime.now(timezone.utc),
        ))

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """写入 OPC UA 节点"""
        if not self.client or not self._connected:
            return False
        try:
            node_id_str = point.get("protocol_addr", "")
            node = self.client.get_node(node_id_str)
            variant_type = self._map_type(point.get("data_type", "float32"))
            dv = ua.DataValue(ua.Variant(value, variant_type))
            await node.write_value(dv)
            return True
        except Exception as e:
            logger.error(f"[opcua] 写入失败: {e}")
            return False

    async def browse_nodes(self, node_id: str = "ns=0;i=84") -> List[Dict[str, Any]]:
        """浏览地址空间"""
        if not self.client:
            return []
        nodes = []
        try:
            root = self.client.get_node(node_id)
            for child in await root.get_children():
                display = (await child.read_display_name()).Text
                node_class = await child.read_node_class()
                nodes.append({
                    "node_id": child.nodeid.to_string(),
                    "display_name": display,
                    "node_class": str(node_class),
                })
        except Exception as e:
            logger.error(f"[opcua] browse 失败: {e}")
        return nodes

    @staticmethod
    def _map_type(dtype: str) -> ua.VariantType:
        return {
            "bool": ua.VariantType.Boolean,
            "int16": ua.VariantType.Int16,
            "uint16": ua.VariantType.UInt16,
            "int32": ua.VariantType.Int32,
            "uint32": ua.VariantType.UInt32,
            "float32": ua.VariantType.Float,
            "float64": ua.VariantType.Double,
            "string": ua.VariantType.String,
        }.get(dtype, ua.VariantType.Variant)
