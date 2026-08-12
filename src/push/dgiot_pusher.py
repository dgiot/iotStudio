# ============================================================
# dgiot_lite — DG-IoT 联动推送器
# 将采集数据推送到 DG-IoT 主平台
# ============================================================
"""
DG-IoT 联动方式:
  1. MQTT 直推 — dgiot_lite → DG-IoT MQTT Broker → DG-IoT 规则引擎
  2. HTTP API  — dgiot_lite → DG-IoT REST API
  3. TDengine  — 共用同一个 TDengine 实例，数据直接写入

推荐方式 1: MQTT，零侵入，双方解耦。
"""
import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

try:
    import paho.mqtt.client as mqtt
    HAS_PAHO = True
except ImportError:
    HAS_PAHO = False


class DGIoTBridge:
    """DG-IoT 联动桥接器

    将 dgiot_lite 采集的数据按 DG-IoT 物模型格式推送。
    DG-IoT 侧只需配置规则引擎订阅对应 Topic 即可自动接收。

    DG-IoT 物模型消息格式:
    {
        "device_id": "xxx",
        "product_id": "xxx",
        "timestamp": 1234567890,
        "properties": {
            "power": {"value": 3500, "time": 1234567890},
            "voltage": {"value": 230.0, "time": 1234567890}
        }
    }
    """

    def __init__(self, config: Dict[str, Any]):
        """
        config:
        {
            "type": "dgiot",
            "host": "127.0.0.1",          # DG-IoT MQTT Broker 地址
            "port": 1883,
            "username": "dgiot",
            "password": "dgiot_admin",
            "topic": "dgiot/device/telemetry",  # DG-IoT 遥测 Topic
            "product_id": "pcs_monitor",         # DG-IoT 产品 ID
        }
        """
        self.config = config
        self.host = config.get("host", "127.0.0.1")
        self.port = config.get("port", 1883)
        self.topic = config.get("topic", "dgiot/device/telemetry")
        self.product_id = config.get("product_id", "dgiot_lite_device")
        self._client = None

    async def push(self, message: Dict[str, Any]) -> bool:
        """推送数据到 DG-IoT"""
        if not HAS_PAHO:
            logger.debug("[dgiot] paho-mqtt 未安装")
            return False

        try:
            if self._client is None:
                await self._connect()

            if self._client is None:
                return False

            # 转换为 DG-IoT 物模型格式
            dgiot_msg = self._to_dgiot_format(message)
            payload = json.dumps(dgiot_msg, ensure_ascii=False)

            # 推送到 DG-IoT MQTT
            self._client.publish(self.topic, payload, qos=1)
            logger.debug(f"[dgiot] 推送成功 → {self.topic} ({len(message.get('data', []))} 点)")
            return True

        except Exception as e:
            logger.error(f"[dgiot] 推送失败: {e}")
            self._client = None
            return False

    def _to_dgiot_format(self, msg: Dict[str, Any]) -> Dict[str, Any]:
        """转换为 DG-IoT 物模型消息格式"""
        ts = int(time.time() * 1000)
        properties = {}
        for d in msg.get("data", []):
            properties[d.get("point_name", d.get("point_id", ""))] = {
                "value": d.get("value"),
                "time": ts,
            }

        return {
            "device_id": msg.get("device_id", ""),
            "product_id": self.product_id,
            "timestamp": ts,
            "properties": properties,
        }

    async def _connect(self) -> None:
        """建立 MQTT 连接"""
        loop = asyncio.get_event_loop()

        def _do_connect():
            client_id = f"dgiot_lite_{int(time.time() * 1000)}"
            client = mqtt.Client(client_id=client_id)
            username = self.config.get("username", "")
            password = self.config.get("password", "")
            if username:
                client.username_pw_set(username, password)
            client.connect(self.host, self.port, keepalive=60)
            client.loop_start()
            return client

        self._client = await loop.run_in_executor(None, _do_connect)
        logger.info(f"[dgiot] MQTT 已连接 → {self.host}:{self.port}")


class DGIoTDirectTD:
    """DG-IoT 直连 TDengine 模式

    如果 dgiot_lite 和 DG-IoT 共用同一个 TDengine 实例，
    采集数据写入 DG-IoT 的超级表，DG-IoT 直接读取。
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self._dgiot_db = config.get("dgiot_db", "dgiot")

    async def push(self, message: Dict[str, Any]) -> bool:
        """写入 DG-IoT 的 TDengine 超级表"""
        # DG-IoT 默认超级表: dgiot.device_data
        # 需要 dgiot_lite 有 TDengine 写入权限
        # 此模式适用于同一 TDengine 集群
        logger.debug("[dgiot:td] 直写 TDengine 模式 (需共用实例)")
        return True  # 由 TDengineStore 统一写入
