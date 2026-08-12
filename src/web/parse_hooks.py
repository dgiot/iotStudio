"""
Parse Cloud Hooks — 数据生命周期钩子 (对标 DG-IoT beforeSave/afterSave)
==================================================================
设计思想:
  - 每个 Class 可有 beforeSave/afterSave/beforeDelete 钩子
  - 钩子可修改数据、拒绝操作、触发副作用
  - 对标 Parse.Cloud.beforeSave / Parse.Cloud.afterSave

用法:
  @hook("Device", "beforeSave")
  async def device_before_save(obj, user, is_new):
      if not obj.get("devaddr"):
          raise HookError("devaddr required")
      return obj

  @hook("Device", "afterSave")
  async def device_after_save(obj, user, is_new):
      # 推送到 MQTT / EventBus / 边缘中枢
      pass
"""
from typing import Dict, Optional, Any, Callable, List
from dataclasses import dataclass
import logging

log = logging.getLogger("hooks")

# ═══════════════════════════════════════════════════════════
# Hook 注册表
# ═══════════════════════════════════════════════════════════

class HookError(Exception):
    """钩子拒绝操作"""
    def __init__(self, message: str, code: int = 400):
        self.message = message
        self.code = code

@dataclass
class HookContext:
    """钩子上下文 — 对标 Parse Cloud trigger"""
    user: Optional[Any] = None
    master: bool = False
    ip: str = ""

HOOKS: Dict[str, Dict[str, List[Callable]]] = {}


def hook(class_name: str, trigger: str):
    """装饰器: 注册数据钩子
    trigger: beforeSave | afterSave | beforeDelete | afterDelete | beforeFind
    """
    def deco(fn):
        HOOKS.setdefault(class_name, {}).setdefault(trigger, []).append(fn)
        log.info(f"[hooks] registered {trigger}@{class_name} -> {fn.__name__}")
        return fn
    return deco


async def run_hooks(class_name: str, trigger: str, obj: Dict,
                    user: Any = None, is_new: bool = False) -> Dict:
    """运行指定 Class 的指定 trigger 钩子链"""
    triggers = HOOKS.get(class_name, {}).get(trigger, [])
    if not triggers:
        return obj

    ctx = HookContext(user=user, master=user is None, ip="")
    for fn in triggers:
        try:
            result = fn(obj, ctx, is_new)
            if result is not None:
                obj = result
        except HookError as e:
            log.warning(f"[hooks] {trigger}@{class_name} rejected: {e.message}")
            raise
        except Exception as e:
            log.error(f"[hooks] {trigger}@{class_name} error: {e}")
    return obj


# ═══════════════════════════════════════════════════════════
# 内置钩子 — 对标 parse-server cloud/hook/
# ═══════════════════════════════════════════════════════════

@hook("Device", "beforeSave")
def device_before_save(obj: Dict, ctx: HookContext, is_new: bool) -> Dict:
    """设备保存前校验 + 自动填充"""
    # 必填字段
    if not obj.get("devaddr") and not obj.get("device_id"):
        raise HookError("devaddr or device_id required")
    if not obj.get("name") and not obj.get("device_name"):
        raise HookError("name required")

    # 自动设置 devaddr
    if not obj.get("devaddr"):
        obj["devaddr"] = obj.get("device_id", obj.get("objectId", ""))

    # 默认值
    obj.setdefault("status", "offline")
    obj.setdefault("isEnable", True)
    obj.setdefault("device_type", "device")

    return obj


@hook("Device", "afterSave")
def device_after_save(obj: Dict, ctx: HookContext, is_new: bool):
    """设备保存后: 推送 EventBus → MQTT → 边缘中枢"""
    import json
    payload = {"type":"device_saved","devaddr":obj.get("devaddr"),
               "is_new":is_new,"timestamp":__import__('time').time()}
    try:
        from ..eventbus import bus
        bus.emit("device.saved", **payload)
    except: pass
    # 直推MQTT (绕过通道, 确保送达)
    try:
        import paho.mqtt.client as mqtt
        c = mqtt.Client(client_id="hook_device_save")
        c.connect("127.0.0.1", 1883)
        c.publish(f"dgiot/default/gw_131/ch_edge_hub/{obj.get('devaddr','?')}/meta",
                  json.dumps(payload, ensure_ascii=False), qos=1)
        c.disconnect()
    except Exception as e:
        pass


@hook("Alarm", "beforeSave")
def alarm_before_save(obj: Dict, ctx: HookContext, is_new: bool) -> Dict:
    """告警保存前: 自动填充时间"""
    import time
    if is_new and not obj.get("createdAt"):
        obj["createdAt"] = time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime())
    obj.setdefault("status", "active")
    return obj


@hook("Alarm", "afterSave")
def alarm_after_save(obj: Dict, ctx: HookContext, is_new: bool):
    """告警保存后: 推送到 MQTT 告警频道"""
    try:
        from ..eventbus import bus
        bus.emit("alarm.triggered",
                 alarm_id=obj.get("objectId", ""),
                 title=obj.get("title", ""),
                 severity=obj.get("severity", "warning"),
                 is_new=is_new)
    except: pass


@hook("Channel", "beforeSave")
def channel_before_save(obj: Dict, ctx: HookContext, is_new: bool) -> Dict:
    """通道保存前: 校验协议类型"""
    protocol = obj.get("protocol", "")
    valid = ["modbus_tcp", "modbus_rtu", "opc_da", "opc_ua", "a11", "mqtt", "http"]
    if protocol and protocol not in valid:
        raise HookError(f"Unknown protocol: {protocol}")
    obj.setdefault("status", "stopped")
    return obj
