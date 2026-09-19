# ============================================================
# 内置插件: pushers — 推送出口 (pusher)
# ============================================================
# 把 src/push/ 四个推送器登记为 pusher 能力 (PR0 只登记工厂与描述;
# PushEngine 现有装配路径不变, P1 分批收编为运行时托管)。
PLUGIN_MANIFEST = {
    "name": "pushers",
    "version": "1.0.0",
    "capabilities": ["pusher"],
    "description": "推送出口注册表 — MQTT / HTTP Webhook / DG-IoT 中枢 / 边缘中枢",
}


def _load_pusher(module_name: str, class_name: str):
    """惰性工厂 — 引用真实推送器类, 不在装载期建立连接"""
    def _factory(push_config: dict):
        import importlib
        mod = importlib.import_module(f"src.push.{module_name}")
        return getattr(mod, class_name)(push_config)
    return _factory


def apply(ctx):
    ctx.register_pusher("mqtt",
                        _load_pusher("mqtt_pusher", "MQTTPusher"),
                        description="MQTT Broker 遥测推送 (paho, qos=1)")
    ctx.register_pusher("http",
                        _load_pusher("http_pusher", "HTTPPusher"),
                        description="HTTP Webhook 推送")
    ctx.register_pusher("dgiot",
                        _load_pusher("dgiot_pusher", "DGIoTBridge"),
                        description="DG-IoT 中枢桥接推送 (dgiot_pusher.DGIoTBridge)")
    ctx.register_pusher("edge_hub",
                        _load_pusher("edge_hub_push", "EdgeHubPusher"),
                        description="边缘中枢桥接推送")
    return []
