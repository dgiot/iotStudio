# ============================================================
# 内置插件: parse_hooks — 数据生命周期钩子 (对标 Parse Cloud triggers)
# ============================================================
# P1 折叠: 钩子定义从 src/web/parse_hooks.py 核心收编入插件;
# 引擎 (HOOKS 注册表 + run_hooks) 留在核心 — parse_router 消费路径不变。
# 插件负责: ① 经引擎装饰器注册进单一真源 HOOKS;
#           ② 经 ctx.register_hook 登记能力面 (可见/可禁用)。
PLUGIN_MANIFEST = {
    "name": "parse_hooks",
    "version": "1.0.0",
    "capabilities": ["hook"],
    "description": "数据生命周期钩子 — Device/Alarm/Channel beforeSave·afterSave",
}


def apply(ctx):
    try:
        from src.web.parse_hooks import hook, HookError
    except ImportError:
        from web.parse_hooks import hook, HookError

    # ── Device ──

    @hook("Device", "beforeSave")
    def device_before_save(obj: dict, hctx, is_new: bool) -> dict:
        """设备保存前校验 + 自动填充"""
        if not obj.get("devaddr") and not obj.get("device_id"):
            raise HookError("devaddr or device_id required")
        if not obj.get("name") and not obj.get("device_name"):
            raise HookError("name required")
        if not obj.get("devaddr"):
            obj["devaddr"] = obj.get("device_id", obj.get("objectId", ""))
        obj.setdefault("status", "offline")
        obj.setdefault("isEnable", True)
        obj.setdefault("device_type", "device")
        return obj

    @hook("Device", "afterSave")
    def device_after_save(obj: dict, hctx, is_new: bool):
        """设备保存后: EventBus → MQTT (经插件运行时配置化通道)"""
        import time
        payload = {"type": "device_saved", "devaddr": obj.get("devaddr"),
                   "is_new": is_new, "timestamp": time.time()}
        try:
            from src.eventbus import bus
        except ImportError:
            from eventbus import bus
        try:
            bus.emit("device.saved", **payload)
        except Exception:
            pass
        ctx.mqtt_publish(
            f"dgiot/default/gw_131/ch_edge_hub/{obj.get('devaddr', '?')}/meta", payload)

    # ── Alarm ──

    @hook("Alarm", "beforeSave")
    def alarm_before_save(obj: dict, hctx, is_new: bool) -> dict:
        """告警保存前: 自动填充时间"""
        import time
        if is_new and not obj.get("createdAt"):
            obj["createdAt"] = time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())
        obj.setdefault("status", "active")
        return obj

    @hook("Alarm", "afterSave")
    def alarm_after_save(obj: dict, hctx, is_new: bool):
        """告警保存后: 推送 EventBus 告警频道"""
        try:
            from src.eventbus import bus
        except ImportError:
            from eventbus import bus
        try:
            bus.emit("alarm.triggered",
                     alarm_id=obj.get("objectId", ""),
                     title=obj.get("title", ""),
                     severity=obj.get("severity", "warning"),
                     is_new=is_new)
        except Exception:
            pass

    # ── Channel ──

    @hook("Channel", "beforeSave")
    def channel_before_save(obj: dict, hctx, is_new: bool) -> dict:
        """通道保存前: 校验协议类型"""
        protocol = obj.get("protocol", "")
        valid = ["modbus_tcp", "modbus_rtu", "opc_da", "opc_ua", "a11", "mqtt", "http"]
        if protocol and protocol not in valid:
            raise HookError(f"Unknown protocol: {protocol}")
        obj.setdefault("status", "stopped")
        return obj

    # ── 能力面登记 (可见/可禁用; 引擎注册表仍是执行真源) ──
    for name, fn, desc in [
        ("Device.beforeSave", device_before_save, "设备保存校验+自动填充"),
        ("Device.afterSave", device_after_save, "设备保存事件外发"),
        ("Alarm.beforeSave", alarm_before_save, "告警时间自动填充"),
        ("Alarm.afterSave", alarm_after_save, "告警事件外发"),
        ("Channel.beforeSave", channel_before_save, "通道协议校验"),
    ]:
        ctx.register_hook(name, fn, stage="parse", description=desc)

    return []
