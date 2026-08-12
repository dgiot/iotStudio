"""
边缘中枢数据推送 — MQTT 通道 (对齐 DG-IoT 标准管线)
========================================================
真正集成链路:
  iotStudio Parse 写入 → afterSave Hook → MQTT → EdgeHubPusher → 边缘中枢
  iotStudio afterSave Hook → EventBus → MQTT broker (:1883)

推送格式 (DG-IoT 标准 JSON):
  topic: dgiot/{tenant}/gw_{gateway}/ch_{channel}/{device}/{point}
  payload: {"ts":"...", "value":123.4, "unit":"A", "quality":192}

API 代理 (Nginx):
  location /api/ { proxy_pass http://192.168.10.1:8000/api/; }
  → WSL → Windows iotStudio :8000
"""
import json, time, logging
from typing import Optional

log = logging.getLogger("edge_hub")


class EdgeHubPusher:
    """边缘中枢 MQTT 推送器 — 对标 DG-IoT EdgeHub"""

    def __init__(self, mqtt_client=None, tenant: str = "default"):
        self._mqtt = mqtt_client
        self._tenant = tenant
        self._stats = {"pushed": 0, "failed": 0, "last": None}
        self._gateway_id = "gw_131"

    def set_mqtt(self, client):
        self._mqtt = client

    # ── MQTT Topic 构建 ──

    def _topic(self, channel: str, device: str, point: str = "") -> str:
        """构建 DG-IoT 标准 topic"""
        return f"dgiot/{self._tenant}/{self._gateway_id}/ch_{channel}/{device}/{point}"

    # ── 推送方法 ──

    def push_device(self, device: dict, channel: str = "oracle_pipe") -> bool:
        """推送设备 — afterSave Hook 触发"""
        return self._publish(self._topic(channel, device.get("devaddr", "?"), "meta"),
                            {"type": "device", "data": device})

    def push_telemetry(self, device_id: str, point_id: str, value: float,
                       unit: str = "", ts: float = None, channel: str = "oracle_pipe") -> bool:
        """推送遥测数据"""
        return self._publish(
            self._topic(channel, device_id, point_id),
            {"ts": ts or time.time(), "value": value, "unit": unit, "quality": 192})

    def push_alarm(self, alarm: dict, channel: str = "alarm_ch") -> bool:
        """推送告警"""
        return self._publish(
            self._topic(channel, alarm.get("device_id", "?"), "alarm"),
            {"type": "alarm", "data": alarm})

    def push_stats(self, stats: dict) -> bool:
        """推送统计"""
        return self._publish(f"dgiot/{self._tenant}/{self._gateway_id}/stats",
                            {"type": "stats", "data": stats})

    # ── 内部 ──

    def _publish(self, topic: str, payload: dict) -> bool:
        if not self._mqtt:
            log.debug(f"[edge_hub] MQTT not connected, skip: {topic}")
            self._stats["failed"] += 1
            return False
        try:
            msg = json.dumps(payload, ensure_ascii=False, default=str)
            self._mqtt.publish(topic, msg, qos=1)
            self._stats["pushed"] += 1
            self._stats["last"] = time.time()
            return True
        except Exception as e:
            self._stats["failed"] += 1
            log.error(f"[edge_hub] MQTT push failed: {e}")
            return False

    def status(self) -> dict:
        return {"gateway": self._gateway_id, "tenant": self._tenant, **self._stats}


# 全局单例
_edge_pusher: Optional[EdgeHubPusher] = None


def get_edge_pusher(tenant: str = "default") -> EdgeHubPusher:
    global _edge_pusher
    if not _edge_pusher:
        _edge_pusher = EdgeHubPusher(tenant=tenant)
    return _edge_pusher
