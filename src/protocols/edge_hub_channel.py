"""
边缘中枢通道 — ch_edge_hub (dgiot_lite Channel 插件)
=====================================================
注册为通道插件, 对标 ch_mqtt_bridge / ch_oracle_pipe

链路:
  Parse afterSave Hook → EventBus → ch_edge_hub → MQTT topic
  MQTT topic: dgiot/{tenant}/gw_{gateway}/ch_edge_hub/{device}/{point}

注册: @channel 装饰器自动注册, 开机自启
"""
from __future__ import annotations
import asyncio, json, time, logging
from typing import Dict, Optional

log = logging.getLogger("edge_hub")


class EdgeHubChannel:
    """边缘中枢通道 — MQTT 推送"""

    def __init__(self, config: dict = None):
        self.config = config or {}
        self._mqtt = None
        self._running = False
        self._tenant = self.config.get("tenant", "default")
        self._gateway = self.config.get("gateway", "gw_131")
        self._stats = {"pushed": 0, "failed": 0, "started_at": None}

    # ── 通道生命周期 ──

    async def start(self):
        self._running = True
        self._stats["started_at"] = time.time()
        log.info(f"[edge_hub] 通道启动 tenant={self._tenant} gateway={self._gateway}")

        # 连接 MQTT
        try:
            import paho.mqtt.client as mqtt
            self._mqtt = mqtt.Client(client_id=f"ch_edge_hub_{self._gateway}")
            self._mqtt.connect_async("127.0.0.1", 1883)
            self._mqtt.loop_start()
            log.info("[edge_hub] MQTT connected to :1883")
        except Exception as e:
            log.warning(f"[edge_hub] MQTT连接失败, 静默运行: {e}")

        # 订阅 EventBus
        self._subscribe_bus()
        return True

    async def stop(self):
        self._running = False
        if self._mqtt:
            self._mqtt.loop_stop()
            self._mqtt.disconnect()
        log.info(f"[edge_hub] 通道停止 stats={self._stats}")

    def _subscribe_bus(self):
        """订阅 EventBus 事件 → 转发到 MQTT"""
        try:
            from ..eventbus import bus
            # 设备变更
            bus.on("device.*.saved", self._on_device_saved, mode="one_for_more")
            bus.on("device.*.telemetry", self._on_telemetry, mode="one_for_more")
            bus.on("alarm.triggered", self._on_alarm, mode="one_for_more")
            bus.on("pipeline.*", self._on_pipeline, mode="one_for_more")
            log.info("[edge_hub] EventBus 订阅完成")
        except Exception as e:
            log.warning(f"[edge_hub] EventBus 订阅失败: {e}")

    # ── EventBus 回调 ──

    def _on_device_saved(self, **kw):
        devaddr = kw.get("devaddr", kw.get("device_id", "?"))
        self._publish(f"dgiot/{self._tenant}/{self._gateway}/ch_edge_hub/{devaddr}/meta",
                      {"type": "device_saved", "data": kw})

    def _on_telemetry(self, **kw):
        dtu = kw.get("dtu_id", kw.get("device_id", "?"))
        vals = kw.get("values", {})
        for pt, val in vals.items():
            self._publish(f"dgiot/{self._tenant}/{self._gateway}/ch_edge_hub/{dtu}/{pt}",
                          {"ts": kw.get("timestamp", time.time()), "value": val, "quality": 192})

    def _on_alarm(self, **kw):
        self._publish(f"dgiot/{self._tenant}/{self._gateway}/ch_edge_hub/alarms",
                      {"type": "alarm", "data": kw})

    def _on_pipeline(self, **kw):
        self._publish(f"dgiot/{self._tenant}/{self._gateway}/stats",
                      {"type": "pipeline", "data": kw})

    # ── MQTT 推送 ──

    def _publish(self, topic: str, payload: dict) -> bool:
        if not self._mqtt:
            self._stats["failed"] += 1
            return False
        try:
            msg = json.dumps(payload, ensure_ascii=False, default=str)
            self._mqtt.publish(topic, msg, qos=1)
            self._stats["pushed"] += 1
            return True
        except Exception as e:
            self._stats["failed"] += 1
            log.error(f"[edge_hub] publish failed: {e}")
            return False

    # ── 状态 ──

    def status(self) -> dict:
        return {
            "running": self._running,
            "tenant": self._tenant,
            "gateway": self._gateway,
            "mqtt_connected": self._mqtt is not None,
            **self._stats,
        }


# ═══════════════════════════════════════════════════════════
# 注册为通道插件
# ═══════════════════════════════════════════════════════════

def _register():
    try:
        from src.channel_registry import register_channel_plugin, CType

        async def _start(config: dict = None):
            ch = EdgeHubChannel(config or {})
            await ch.start()
            return ch

        register_channel_plugin(
            name="ch_edge_hub",
            ctype=CType.PUSH if "CType" in dir() else "push",
            version="1.0",
            start=_start,
            description="边缘中枢MQTT通道 — afterSave→EventBus→MQTT→中枢",
        )
        log.info("[edge_hub] 插件注册: ch_edge_hub v1.0")
    except Exception as e:
        log.warning(f"[edge_hub] 插件注册失败: {e}")


_register()
