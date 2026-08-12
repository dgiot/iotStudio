# ============================================================
# pythonIot — MQTT 推送器
# ============================================================
import json
import logging
import time
from typing import Any, Dict

from ..config import cfg

logger = logging.getLogger(__name__)

try:
    import paho.mqtt.client as mqtt
    HAS_PAHO = True
except ImportError:
    HAS_PAHO = False


class MQTTPusher:
    """MQTT 数据推送器"""

    def __init__(self, push_config: Dict[str, Any]):
        self.config = push_config
        self.topic = push_config.get("topic", f"iot/{cfg.title}/telemetry")
        self.qos = push_config.get("qos", 1)
        self._client = None

    async def push(self, message: Dict[str, Any]) -> bool:
        """推送消息到 MQTT Broker"""
        if not HAS_PAHO:
            logger.debug("[mqtt] paho-mqtt 未安装，跳过推送")
            return False

        try:
            if self._client is None:
                await self._connect()
            if self._client is None:
                return False

            payload = json.dumps(message, ensure_ascii=False)
            self._client.publish(self.topic, payload, qos=self.qos)
            return True
        except Exception as e:
            logger.error(f"[mqtt] 推送失败: {e}")
            self._client = None
            return False

    async def _connect(self) -> None:
        """建立 MQTT 连接（同步包装为异步）"""
        import asyncio
        loop = asyncio.get_event_loop()

        def _do_connect():
            client = mqtt.Client(client_id=cfg.mqtt.client_id + f"_{int(time.time()*1000)}")
            if cfg.mqtt.username:
                client.username_pw_set(cfg.mqtt.username, cfg.mqtt.password)
            client.connect(
                self.config.get("host", cfg.mqtt.host),
                self.config.get("port", cfg.mqtt.port),
                keepalive=60,
            )
            client.loop_start()
            return client

        self._client = await loop.run_in_executor(None, _do_connect)
