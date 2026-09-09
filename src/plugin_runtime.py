# ============================================================
# iotStudio 统一插件运行时 (PR0) — 一切皆插件
# ============================================================
"""
在既有 plugin_registry (内存注册表) 与 channel_registry (通道插件) 之上,
提供统一插件契约:

  plugins/<name>/plugin.py:
    PLUGIN_MANIFEST = {"name": ..., "version": ..., "capabilities": [...],
                       "permissions": {...}, "description": ...}
    def apply(ctx) -> list  # 返回 disposer 列表 (可逆停用)

  七类 capability:
    channel(存量, 见 channel_registry) / pusher / action / tool
    / profile(本体档案) / hook / connector

运行时规则 (设计语汇对标 DSH Cordis):
  1. 失败隔离 — 单插件 apply 抛错只标记 failed, 不影响宿主与其它插件
  2. 能力绑角色 — permissions 声明最低角色; action/tool 未声明时默认 admin
  3. 生命周期可逆 — disable = 跑 disposers; enable = 重新 apply
  4. 声明即校验 — manifest.capabilities 与实际注册不符 → 标记 degraded
  5. 状态持久化 — data/plugins_state.json, 重启保留 enable/disable 选择

P2 之前刻意不做: 热重载、插件市场、版本指针/回滚 (边缘重启成本低)。
"""
from __future__ import annotations

import importlib.util
import json
import logging
import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

log = logging.getLogger("plugin.runtime")

# 七类 capability 与角色缺省 ("一切皆插件": 动作执行器也是插件能力)
CAPABILITY_TYPES = {"channel", "pusher", "action", "tool", "profile", "hook", "connector", "executor"}
DEFAULT_CAP_ROLE = {"action": "admin", "tool": "admin", "connector": "admin"}

_REPO_ROOT = Path(__file__).resolve().parent.parent


class PluginContext:
    """插件服务面 — 插件只通过 ctx 注册能力/取服务, 不触达 core 内部"""

    def __init__(self, plugin_name: str, manager: "PluginManager"):
        self.plugin = plugin_name
        self._manager = manager
        self._disposers: List[Callable] = []

    # ── 能力注册 (通用入口 + 糖) ─────────────────────────────
    def register_capability(self, cap: str, name: str, payload: dict) -> None:
        if cap not in CAPABILITY_TYPES:
            raise ValueError(f"未知 capability 类型: {cap}")
        entry = {"plugin": self.plugin, "name": name, **payload}
        caps = self._manager._loaded[self.plugin].setdefault("capabilities", {})
        caps.setdefault(cap, {})[name] = entry

    def register_action(self, name: str, *, min_role: str = None,
                        params_schema: dict = None, description: str = "",
                        external_side_effect: bool = False) -> None:
        self.register_capability("action", name, {
            "min_role": min_role or DEFAULT_CAP_ROLE["action"],
            "params_schema": params_schema or {},
            "description": description,
            "external_side_effect": external_side_effect,
        })

    def register_tool(self, name: str, fn: Callable = None, *, description: str = "") -> None:
        self.register_capability("tool", name, {"fn": fn, "description": description})

    def register_profile(self, name: str, builder: Callable = None, *,
                         description: str = "", **meta) -> None:
        self.register_capability("profile", name,
                                 {"builder": builder, "description": description, **meta})

    def register_pusher(self, name: str, factory: Callable = None, *, description: str = "") -> None:
        self.register_capability("pusher", name, {"factory": factory, "description": description})

    def register_hook(self, name: str, fn: Callable = None, *, stage: str = "parse",
                      description: str = "") -> None:
        self.register_capability("hook", name,
                                 {"fn": fn, "stage": stage, "description": description})

    def register_connector(self, name: str, factory: Callable = None, *, description: str = "") -> None:
        self.register_capability("connector", name, {"factory": factory, "description": description})

    def register_executor(self, name: str, fn: Callable = None, *, description: str = "",
                          external_side_effect: bool = True) -> None:
        """动作执行器插件点 — 运输实现 (MQTT/HTTP/日志...) 与动作类型解耦"""
        self.register_capability("executor", name, {"fn": fn, "description": description,
                                                    "external_side_effect": external_side_effect})

    # ── 服务面 ───────────────────────────────────────────────
    @property
    def cfg(self):
        from .config import cfg
        return cfg

    def logger(self, name: str = "") -> logging.Logger:
        return logging.getLogger(f"plugin.{self.plugin}" + (f".{name}" if name else ""))

    def mqtt_publish(self, topic: str, payload: dict) -> str:
        """短连接 MQTT 发布 (qos=1) — 与 graphrag_api._mqtt_publish 同款模式"""
        try:
            import json as _json
            import paho.mqtt.client as mqtt
            c = mqtt.Client(client_id=f"plugin_{self.plugin}_{id(self)}")
            c.connect(self.cfg.mqtt.host, self.cfg.mqtt.port, keepalive=10)
            c.publish(topic, _json.dumps(payload, ensure_ascii=False), qos=1)
            c.disconnect()
            return topic
        except Exception as e:
            self.logger().warning(f"MQTT 发布失败 ({topic}): {e}")
            return ""

    def ontology(self):
        """131 示例站本体引擎 (惰性, 缓存单例)"""
        return self._manager.get_ontology()

    def on_shutdown(self, fn: Callable) -> Callable:
        """登记 disposer — disable/关停时逐个调用"""
        self._disposers.append(fn)
        return fn


class PluginManager:
    """统一插件运行时 — 发现/装载/隔离/启停/持久化"""

    def __init__(self, plugins_dir: Path = None, state_path: Path = None):
        self.plugins_dir = Path(plugins_dir) if plugins_dir else _REPO_ROOT / "plugins"
        self.state_path = Path(state_path) if state_path else _REPO_ROOT / "data" / "plugins_state.json"
        self._loaded: Dict[str, dict] = {}      # name → {manifest, status, error, capabilities, disposers}
        self._state: dict = {"backend": {}, "frontend": {}}   # 持久化启停选择
        self._ontology = None

    # ── 状态持久化 ───────────────────────────────────────────
    def load_state(self) -> None:
        try:
            if self.state_path.exists():
                self._state = json.loads(self.state_path.read_text(encoding="utf-8"))
                self._state.setdefault("backend", {})
                self._state.setdefault("frontend", {})
        except Exception as e:
            log.warning(f"[runtime] 状态文件读取失败, 使用默认: {e}")

    def save_state(self) -> None:
        try:
            self.state_path.parent.mkdir(parents=True, exist_ok=True)
            self.state_path.write_text(
                json.dumps(self._state, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception as e:
            log.warning(f"[runtime] 状态文件写入失败: {e}")

    def is_enabled(self, name: str) -> bool:
        return self._state["backend"].get(name, True)

    # ── 发现与装载 ───────────────────────────────────────────
    def _plugin_dirs(self) -> List[Path]:
        if not self.plugins_dir.is_dir():
            return []
        return sorted(d for d in self.plugins_dir.iterdir()
                      if d.is_dir() and (d / "plugin.py").exists())

    def _import_plugin(self, path: Path):
        mod_name = f"iotstudio_plugin_{path.parent.name}"
        spec = importlib.util.spec_from_file_location(mod_name, path)
        module = importlib.util.module_from_spec(spec)
        sys.modules[mod_name] = module
        spec.loader.exec_module(module)
        return module

    def _sync_registry(self, name: str, manifest: dict, enabled: bool) -> None:
        """同步到既有 plugin_registry — 让现有 GET /api/plugins 可见"""
        try:
            from . import plugin_registry as _pr
            caps = manifest.get("capabilities") or []
            _pr.register(name, version=manifest.get("version", "1.0"),
                         category=(caps[0] if caps else "service"),
                         enabled=enabled,
                         description=manifest.get("description", ""))
            (_pr.enable if enabled else _pr.disable)(name)
        except Exception as e:  # 注册表不可用不阻断运行时
            log.debug(f"[runtime] plugin_registry 同步跳过 ({name}): {e}")

    def _load_one(self, pdir: Path) -> None:
        name = pdir.name
        if not self.is_enabled(name):
            self._loaded[name] = {"manifest": {"name": name, "capabilities": []},
                                  "status": "disabled", "capabilities": {}}
            self._sync_registry(name, {"capabilities": []}, enabled=False)
            return
        try:
            module = self._import_plugin(pdir / "plugin.py")
            manifest = getattr(module, "PLUGIN_MANIFEST", None)
            if not isinstance(manifest, dict) or not manifest.get("name"):
                raise ValueError("缺少 PLUGIN_MANIFEST 或 manifest.name")
            if manifest["name"] != pdir.name:
                raise ValueError(f"manifest.name ({manifest['name']}) 必须与插件目录名一致")
            caps_declared = manifest.get("capabilities", [])
            bad = [c for c in caps_declared if c not in CAPABILITY_TYPES]
            if bad:
                raise ValueError(f"未知 capability 声明: {bad}")

            ctx = PluginContext(manifest["name"], self)
            self._loaded[manifest["name"]] = {"manifest": manifest, "status": "loading",
                                              "capabilities": {}, "ctx": ctx,
                                              "dir": str(pdir)}
            disposers = module.apply(ctx) or []
            self._loaded[manifest["name"]]["disposers"] = list(disposers)

            # 声明即校验
            caps_registered = set(self._loaded[manifest["name"]]["capabilities"].keys())
            missing = set(caps_declared) - caps_registered
            self._loaded[manifest["name"]]["status"] = "loaded"
            self._loaded[manifest["name"]]["degraded"] = bool(missing)
            if missing:
                log.warning(f"[runtime] {name} 声明了未注册的 capability: {sorted(missing)}")
            self._sync_registry(name, manifest, enabled=True)
            log.info(f"[runtime] {name} v{manifest.get('version', '?')} loaded "
                     f"({', '.join(sorted(caps_registered)) or 'no caps'})")
        except Exception as e:
            # 失败隔离: 标记 failed, 不影响其它插件与宿主
            self._loaded[name] = {"manifest": {"name": name, "capabilities": []},
                                  "status": "failed", "error": str(e), "capabilities": {}}
            self._sync_registry(name, {"capabilities": []}, enabled=False)
            log.error(f"[runtime] {name} 装载失败 (隔离): {e}")

    def load_all(self) -> dict:
        """启动时装载全部插件 (每个独立 try/except → 失败隔离)"""
        self.load_state()
        self._loaded = {}
        for pdir in self._plugin_dirs():
            self._load_one(pdir)
        return self.health()

    # ── 启停 (生命周期可逆) ──────────────────────────────────
    def enable(self, name: str) -> bool:
        self._state["backend"][name] = True
        self.save_state()
        pdir = self._loaded.get(name, {}).get("dir") or (self.plugins_dir / name)
        if Path(pdir).exists():
            self._loaded.pop(name, None)
            self._load_one(Path(pdir))    # 重新 apply
        return True

    def disable(self, name: str) -> bool:
        self._state["backend"][name] = False
        self.save_state()
        entry = self._loaded.get(name)
        if entry:
            for fn in entry.get("disposers", []):
                try:
                    fn()
                except Exception as e:
                    log.warning(f"[runtime] {name} disposer 异常: {e}")
            entry["status"] = "disabled"
            entry["capabilities"] = {}
        return True

    def shutdown(self) -> None:
        """宿主关停 — 逐个跑全部插件 disposers (生命周期可逆的收口)"""
        for name, entry in self._loaded.items():
            for fn in entry.get("disposers", []):
                try:
                    fn()
                except Exception as e:
                    log.warning(f"[runtime] {name} disposer 异常: {e}")

    # ── 前端动态 manifest ────────────────────────────────────
    def frontend_modules(self) -> dict:
        """前端模块开关 (loader.js 数据源); 未记录的模块默认启用"""
        return dict(self._state.get("frontend", {}))

    def set_frontend(self, name: str, enabled: bool) -> bool:
        self._state["frontend"][name] = bool(enabled)
        self.save_state()
        return True

    # ── 能力视图 (graphrag_api 等消费) ───────────────────────
    def _caps(self, cap: str) -> Dict[str, dict]:
        out: Dict[str, dict] = {}
        for entry in self._loaded.values():
            if entry.get("status") != "loaded":
                continue
            out.update(entry.get("capabilities", {}).get(cap, {}))
        return out

    def actions(self) -> Dict[str, dict]:
        return self._caps("action")

    def tools(self) -> Dict[str, dict]:
        return self._caps("tool")

    def profiles(self) -> Dict[str, dict]:
        return self._caps("profile")

    def pushers(self) -> Dict[str, dict]:
        return self._caps("pusher")

    def get_ontology(self):
        if self._ontology is None:
            try:
                from .ontology import build_131_ontology
            except ImportError:
                from ontology import build_131_ontology
            self._ontology = build_131_ontology()
        return self._ontology

    # ── 视图/健康 ────────────────────────────────────────────
    def summary(self) -> list:
        return [{"name": n,
                 "version": e.get("manifest", {}).get("version", "?"),
                 "status": e.get("status"),
                 "degraded": e.get("degraded", False),
                 "capabilities": {c: list(v.keys())
                                  for c, v in e.get("capabilities", {}).items()},
                 "description": e.get("manifest", {}).get("description", ""),
                 "error": e.get("error")}
                for n, e in sorted(self._loaded.items())]

    def health(self) -> dict:
        stats = {"loaded": 0, "failed": 0, "disabled": 0}
        for e in self._loaded.values():
            s = e.get("status")
            if s in stats:
                stats[s] += 1
        return {"plugins": len(self._loaded), **stats}


# 模块级单例 — main.py 与各 API 消费
runtime = PluginManager()
