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
# 引擎到此为止 — 内置钩子定义已折叠入 plugins/parse_hooks/plugin.py
# (P1 插件化: 装载时经上方 hook() 装饰器填充 HOOKS, 本文件不再自带定义)
# ═══════════════════════════════════════════════════════════
