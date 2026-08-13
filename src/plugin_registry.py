"""
iotStudio 后端插件注册中心

每个协议/服务插件 = Python 模块 + 标准接口:
  {name, version, adapter_class, config_schema, on_start(), on_stop()}

启动时自动发现 src/protocols/ 和 src/services/ 下的插件
部署时通过 config.yaml 控制启用/禁用
"""
import os, importlib, logging
from typing import Dict, Any, Optional

log = logging.getLogger("plugin")

_registry: Dict[str, dict] = {}


def register(name: str, **kwargs):
    """注册插件"""
    if name in _registry:
        log.warning(f"Plugin '{name}' already registered, skipping")
        return
    _registry[name] = {
        "name": name,
        "version": kwargs.get("version", "1.0"),
        "category": kwargs.get("category", "protocol"),  # protocol | service | storage | push
        "adapter": kwargs.get("adapter"),           # 适配器类或工厂函数
        "config_schema": kwargs.get("config", {}),
        "enabled": kwargs.get("enabled", True),
        "depends": kwargs.get("depends", []),       # 依赖的其他插件
        "metadata": kwargs,
    }
    log.info(f"[plugin] {name} v{_registry[name]['version']} registered ({_registry[name]['category']})")


def discover(directory: str, prefix: str = "src"):
    """自动发现目录下的 Python 模块并导入"""
    path = os.path.join(os.path.dirname(__file__), "..", directory)
    if not os.path.isdir(path):
        return
    for f in sorted(os.listdir(path)):
        if f.endswith(".py") and not f.startswith("_"):
            mod_name = f[:-3]
            try:
                importlib.import_module(f"{prefix}.{mod_name}")
            except Exception as e:
                log.warning(f"[plugin] Failed to load {directory}/{f}: {e}")


def get(name: str) -> Optional[dict]:
    return _registry.get(name)


def list_all(category: str = None) -> list:
    if category:
        return [p for p in _registry.values() if p["category"] == category]
    return list(_registry.values())


def list_enabled(category: str = None) -> list:
    return [p for p in list_all(category) if p["enabled"]]


def enable(name: str):
    if name in _registry:
        _registry[name]["enabled"] = True


def disable(name: str):
    if name in _registry:
        _registry[name]["enabled"] = False


def health() -> dict:
    cats = {}
    for p in _registry.values():
        c = p["category"]
        if c not in cats:
            cats[c] = {"total": 0, "enabled": 0}
        cats[c]["total"] += 1
        if p["enabled"]:
            cats[c]["enabled"] += 1
    return {"plugins": len(_registry), "categories": cats}
