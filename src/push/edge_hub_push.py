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
  location /api/ { proxy_pass http://10.0.0.1:8000/api/; }
  → WSL → Windows iotStudio :8000
"""
import json, time, logging
from typing import Optional

log = logging.getLogger("edge_hub")


class EdgeHubPusher:
    """边缘中枢 MQTT 推送器 — 对标 DG-IoT EdgeHub

    两种构造路径:
      - 直连注入: EdgeHubPusher(mqtt_client=<paho client>, tenant=...)
      - PushEngine 插件工厂: EdgeHubPusher(<config dict>) — config:
        {host, port, username, password, tenant, gateway}
        连接惰性建立 (首次推送时), 失败静默降级
    """

    def __init__(self, mqtt_client=None, tenant: str = "default", gateway: str = "gw_131"):
        if isinstance(mqtt_client, dict):
            cfg = mqtt_client
            tenant = cfg.get("tenant", tenant)
            gateway = cfg.get("gateway", gateway)
            self._conn = {"host": cfg.get("host", "127.0.0.1"),
                          "port": int(cfg.get("port", 1883)),
                          "username": cfg.get("username") or None,
                          "password": cfg.get("password") or None}
            mqtt_client = None
        else:
            self._conn = None
        self._mqtt = mqtt_client
        self._tenant = tenant
        self._gateway_id = gateway
        self._stats = {"pushed": 0, "failed": 0, "last": None}

    def set_mqtt(self, client):
        self._mqtt = client

    def _ensure_client(self):
        """config-dict 路径: 首次推送时惰性建立 MQTT 连接"""
        if self._mqtt or not self._conn:
            return self._mqtt
        try:
            import paho.mqtt.client as mqtt
            c = mqtt.Client(client_id=f"edge_hub_push_{self._gateway_id}")
            if self._conn.get("username"):
                c.username_pw_set(self._conn["username"], self._conn.get("password") or "")
            c.connect_async(self._conn["host"], self._conn["port"])
            c.loop_start()
            log.info(f"[edge_hub] MQTT connecting {self._conn['host']}:{self._conn['port']}")
            self._mqtt = c
        except Exception as e:
            log.warning(f"[edge_hub] MQTT 连接失败, 静默降级: {e}")
        return self._mqtt

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

    # ── 统一 push(message) 协议 — PushEngine 兼容适配层 ──

    async def push(self, message: dict) -> bool:
        """统一消息协议: telemetry/device/alarm/stats → 对应推送方法"""
        mtype = message.get("type", "telemetry")
        if mtype == "telemetry":
            ts = message.get("timestamp")
            if isinstance(ts, str) and ts:
                try:
                    from datetime import datetime
                    ts = datetime.fromisoformat(ts).timestamp()
                except ValueError:
                    ts = None
            else:
                ts = None
            ok = True
            for pt in message.get("data") or []:
                ok = self.push_telemetry(
                    message.get("device_id", "?"), pt.get("point_id", "?"),
                    pt.get("value", 0), pt.get("unit", ""), ts=ts) and ok
            return ok
        if mtype == "device":
            return self.push_device(message.get("data") or {})
        if mtype == "alarm":
            return self.push_alarm(message.get("data") or {})
        if mtype == "stats":
            return self.push_stats(message.get("data") or {})
        log.warning(f"[edge_hub] 未知消息类型 '{mtype}', 丢弃")
        return False

    # ── 内部 ──

    def _publish(self, topic: str, payload: dict) -> bool:
        if not self._ensure_client():
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
