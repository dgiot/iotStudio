"""
iotStudio 后端插件注册中心

每个协议/服务插件 = Python 模块 + 标准接口:
  {name, version, adapter_class, config_schema, on_start(), on_stop()}

发现路径:
  - discover(directory): 导入内置目录 (src/protocols 等), 模块自行 register
  - discover_entry_points(group): 外部 pip 包经 setuptools entry_points 注册

铁律 (源自中枢 TD 链排障):
  - 契约先于插件: category="protocol" 的 adapter 必须是 BaseProtocolAdapter 子类
  - 失败必须响: 重复注册/坏契约直接 raise; 目录加载失败进 ERROR 日志 + 报告
  - 生命周期可观测: health() 携带最近一次发现报告
"""
import os, importlib, inspect, logging
from importlib.metadata import entry_points
from typing import Dict, Any, Optional

log = logging.getLogger("plugin")

_registry: Dict[str, dict] = {}
_last_report: Dict[str, Any] = {"loaded": [], "failed": {}}


def _base_adapter_cls():
    """BaseProtocolAdapter, dual import safe (flat 'plugin_registry' or
    package 'src.plugin_registry' must both work)."""
    try:
        from .protocols.base import BaseProtocolAdapter
    except ImportError:
        from protocols.base import BaseProtocolAdapter
    return BaseProtocolAdapter


def _validate_adapter(name: str, category: str, adapter) -> None:
    """契约校验: 协议类插件必须实现 BaseProtocolAdapter (fail loud)。

    类 → 立即校验; 字符串 → 延迟到 resolve_adapter 时校验 (懒绑定惯例,
    规避 import 环), 但注册时记录调用方模块以便解析。
    """
    if category != "protocol" or adapter is None:
        return
    if isinstance(adapter, str):
        return
    BaseProtocolAdapter = _base_adapter_cls()
    if not (isinstance(adapter, type) and issubclass(adapter, BaseProtocolAdapter)):
        raise TypeError(
            f"plugin '{name}': category=protocol requires a "
            f"BaseProtocolAdapter subclass, got {adapter!r}")


def resolve_adapter(name: str):
    """解析插件适配器: 类直接返回; 字符串按注册时模块懒解析并严格校验。"""
    plugin = _registry.get(name)
    if plugin is None:
        raise KeyError(f"plugin '{name}' not registered")
    adapter = plugin["adapter"]
    if not isinstance(adapter, str):
        return adapter
    module_name = plugin["metadata"].get("_module")
    if not module_name:
        raise TypeError(f"plugin '{name}': string adapter {adapter!r} has "
                        "no source module recorded")
    module = importlib.import_module(module_name)
    cls = getattr(module, adapter, None)
    BaseProtocolAdapter = _base_adapter_cls()
    if not (isinstance(cls, type) and issubclass(cls, BaseProtocolAdapter)):
        raise TypeError(
            f"plugin '{name}': {module_name}.{adapter} is not a "
            f"BaseProtocolAdapter subclass")
    return cls


def register(name: str, **kwargs):
    """注册插件。

    双导入现实 (flat protocols.X 与 src.protocols.X 都会执行模块级注册):
    同名同身份 → 幂等跳过; 同名异身份 (换适配器) → raise, 程序错误必须响。
    """
    adapter = kwargs.get("adapter")
    category = kwargs.get("category", "protocol")
    _validate_adapter(name, category, adapter)
    existing = _registry.get(name)
    if existing is not None:
        if existing["category"] == category and existing["adapter"] == adapter:
            log.info("[plugin] %s re-registered identically (dual import), "
                     "keeping first", name)
            return
        raise ValueError(
            f"plugin '{name}' already registered as "
            f"category={existing['category']} adapter={existing['adapter']!r}; "
            f"refusing conflicting re-registration with "
            f"category={category} adapter={adapter!r}")
    # 记录调用方模块: 字符串适配器延迟解析的锚点 (fail loud at resolve time)
    if "_module" not in kwargs:
        caller = inspect.stack()[1].frame
        kwargs["_module"] = caller.f_globals.get("__name__", "?")
    _registry[name] = {
        "name": name,
        "version": kwargs.get("version", "1.0"),
        "category": category,  # protocol | channel | service | storage | push
        "adapter": adapter,           # 适配器类或工厂函数
        "config_schema": kwargs.get("config", {}),
        "enabled": kwargs.get("enabled", True),
        "depends": kwargs.get("depends", []),       # 依赖的其他插件
        "metadata": kwargs,
    }
    log.info(f"[plugin] {name} v{_registry[name]['version']} registered ({category})")


def discover(directory: str, prefix: str = "src") -> Dict[str, Any]:
    """导入目录下全部模块 (模块自行 register), 返回响亮的加载报告。

    单个模块失败不阻断启动, 但必须进 ERROR 日志与报告, 不得静默。
    """
    path = os.path.join(os.path.dirname(__file__), "..", directory)
    report = {"loaded": [], "failed": {}}
    if not os.path.isdir(path):
        _last_report.clear()
        _last_report.update(report)
        return report
    for f in sorted(os.listdir(path)):
        if f.endswith(".py") and not f.startswith("_"):
            mod_name = f[:-3]
            try:
                mod_ref = f"{prefix}.{mod_name}" if prefix else mod_name
                importlib.import_module(mod_ref)
                report["loaded"].append(mod_name)
            except Exception as e:
                report["failed"][f"{directory}/{f}"] = repr(e)
                log.error("[plugin] load failed %s/%s: %s",
                          directory, f, e, exc_info=True)
    _remember_report(report)
    return report


def discover_entry_points(group: str = "iotstudio.drivers") -> Dict[str, Any]:
    """发现经 setuptools entry_points 注册的外部驱动包。

    约定: entry point 指向一个 BaseProtocolAdapter 子类 (驱动即插件)。
    """
    report = {"loaded": [], "failed": {}}
    try:
        eps = entry_points()
        group_eps = eps.select(group=group) if hasattr(eps, "select") else \
            [e for e in eps.get(group, [])]
    except Exception as e:
        report["failed"][f"entry_points:{group}"] = repr(e)
        _remember_report(report)
        return report
    for ep in group_eps:
        try:
            adapter = ep.load()
            _validate_adapter(ep.name, "protocol", adapter)
            register(ep.name, adapter=adapter, category="protocol",
                     version=str(getattr(ep, "version", "") or "1.0"),
                     source="entry_points", _module=ep.value)
            report["loaded"].append(ep.name)
        except Exception as e:
            report["failed"][f"entry_points:{ep.name}"] = repr(e)
            log.error("[plugin] entry point %s failed: %s", ep.name, e,
                      exc_info=True)
    _remember_report(report)
    return report


def _remember_report(report: Dict[str, Any]) -> None:
    _last_report.clear()
    _last_report.update(report)


def last_report() -> Dict[str, Any]:
    return dict(_last_report)


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


def clear_for_tests() -> None:
    """测试隔离用: 清空注册表与报告 (生产路径禁止调用)。"""
    _registry.clear()
    _last_report.clear()


def health() -> dict:
    cats = {}
    for p in _registry.values():
        c = p["category"]
        if c not in cats:
            cats[c] = {"total": 0, "enabled": 0}
        cats[c]["total"] += 1
        if p["enabled"]:
            cats[c]["enabled"] += 1
    failed = _last_report.get("failed", {})
    return {"plugins": len(_registry), "categories": cats,
            "last_discovery": {"loaded": len(_last_report.get("loaded", [])),
                               "failed": sorted(failed)}}
