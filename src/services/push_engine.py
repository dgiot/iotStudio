# ============================================================
# pythonIot — 数据推送引擎
# ============================================================
import asyncio
import json
import logging
from typing import Any, Dict, List

from ..protocols.base import PointValue
from ..storage.postgres import PostgresStore
from ..push.mqtt_pusher import MQTTPusher
from ..push.http_pusher import HTTPPusher

logger = logging.getLogger(__name__)


class PushEngine:
    """数据推送引擎

    接收采集数据，按推送目标配置转发到 MQTT / HTTP。
    """

    def __init__(self, pg_store: PostgresStore):
        self.pg = pg_store
        self._mqtt: Dict[str, MQTTPusher] = {}
        self._http: Dict[str, HTTPPusher] = {}
        self._initialized = False

    async def start(self) -> None:
        """加载推送目标并初始化"""
        targets = await self.pg.list_push_targets()
        for t in targets:
            if t.target_type == "mqtt":
                self._mqtt[t.target_id] = MQTTPusher(t.config or {})
            elif t.target_type == "http":
                self._http[t.target_id] = HTTPPusher(t.config or {})
        self._initialized = True
        logger.info(f"[push] 启动完成, MQTT×{len(self._mqtt)} HTTP×{len(self._http)}")

    async def push(self, device_id: str, points: List[PointValue]) -> None:
        """推送数据"""
        if not self._initialized:
            return

        # 构造推送消息体
        message = self._build_message(device_id, points)

        # 并行推送到所有目标
        tasks = []
        for pusher in self._mqtt.values():
            tasks.append(pusher.push(message))
        for pusher in self._http.values():
            tasks.append(pusher.push(message))

        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for r in results:
                if isinstance(r, Exception):
                    logger.warning(f"[push] 推送失败: {r}")

    def _build_message(self, device_id: str, points: List[PointValue]) -> Dict[str, Any]:
        """构造推送消息"""
        return {
            "type": "telemetry",
            "device_id": device_id,
            "timestamp": points[0].timestamp.isoformat() if points else "",
            "data": [
                {
                    "point_id": pv.point_id,
                    "point_name": pv.point_name,
                    "value": pv.value,
                    "unit": pv.unit or "",
                    "quality": pv.quality,
                }
                for pv in points
            ],
        }
