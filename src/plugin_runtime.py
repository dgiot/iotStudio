# ============================================================
# iotStudio 统一插件运行时 (PR0) — 一切皆插件
# ============================================================
"""
在既有 plugin_registry (内存注册表) 与 channel_registry (通道插件) 之上,
提供统一插件契约:

  plugins/<name>/plugin.json:            # 清单 (数据, 不执行代码即可读)
    {"name": ..., "version": ..., "host_api": ..., "capabilities": [...],
     "permissions": {...}, "entry": {...}, "description": ...}
  plugins/<name>/plugin.py:
    PLUGIN_MANIFEST = {...}              # 兼容存量; plugin.json 存在时以数据为准
    def apply(ctx) -> list  # 返回 disposer 列表 (可逆停用)

  插件根: 本仓 plugins/ → 显式 extra_roots → 环境变量 IOTSTUDIO_PLUGIN_PATH
          (os.pathsep 分隔)。同名首个胜出并告警 —— 业务插件可住底座仓之外。

  九类 capability:
    channel(存量, 见 channel_registry) / pusher / action / tool
    / profile(本体档案) / hook / connector / executor(动作执行器)
    / graph(本体挂进统一图库)

  本段自述历来比 CAPABILITY_TYPES 少一项（曾写「八类」而集合实为九）：
  集合本身由 :85 的 `cap not in CAPABILITY_TYPES` 校验，**代码是自洽的**，
  漂的只是这段文字。改这里时请对齐 :52 的集合，别改集合来迁就文字。

  两条统一接缝 (PR-G, 「端口统一 + 数据库统一」):
    ctx.register_graph(ontology)  本体挂进统一图库, 反查走底座 /api/graph/*
                                  —— 插件不再各写一套领域端点
    ctx.route(method, path, fn)   插件端点由**底座**发, 落在
                                  /api/plugin/<插件名><path> —— 插件不再各起服务

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
import os
import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from .tenant_scope import tenant_of

log = logging.getLogger("plugin.runtime")

# 九类 capability 与角色缺省 ("一切皆插件": 动作执行器也是插件能力)
CAPABILITY_TYPES = {"channel", "pusher", "action", "tool", "profile", "hook",
                    "connector", "executor", "graph"}
DEFAULT_CAP_ROLE = {"action": "admin", "tool": "admin", "connector": "admin"}

_REPO_ROOT = Path(__file__).resolve().parent.parent

# 插件根：仓内 plugins/ 之后追加仓外根 —— 业务插件不必住进底座仓
_PLUGIN_PATH_ENV = "IOTSTUDIO_PLUGIN_PATH"


def _env_plugin_roots() -> List[Path]:
    """IOTSTUDIO_PLUGIN_PATH 里的仓外插件根 (os.pathsep 分隔)"""
    raw = os.environ.get(_PLUGIN_PATH_ENV, "")
    out = []
    for part in raw.split(os.pathsep):
        part = part.strip()
        if part:
            p = Path(part)
            if p not in out:
                out.append(p)
    return out


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

    # ── 统一接缝 (PR-G) ──────────────────────────────────────
    @property
    def graph(self):
        """统一图库 hub —— 插件把本体挂进来, 反查由底座 /api/graph/* 提供"""
        return self._manager.graph

    def register_graph(self, ontology: dict, *, namespace: str = None,
                       meta: dict = None) -> Callable:
        """把本插件的本体挂进统一图库 —— 返回 disposer (跑它就摘除)。

        **这是「插件的领域端点全废」的落点**: 本体进了统一图库之后,
        「协议→数据项」「台区→诊断→指标」那类反查不再需要各自写端点,
        走 /api/graph/trace/<ns>/<节点> 一套通用查询即可 ——
        也就没有了跨包字段名漂移可言 (每包一套字段名 = 客户端静默断)。
        """
        ns = namespace or self.plugin
        # 归属由**部署**声明, 不由包自报 —— 同一个包卖给第二家公司时,
        # 包内写死的归属当场就是错的, 而它错得安静 (见 src/tenant_scope.py)。
        #
        # 多租户部署里未声明归属的 ns 在这里抛错, 由 _load_one 既有的失败隔离
        # 接住 → 插件标记 failed 并带上原因, 宿主与其它插件不受影响。
        # **响, 且早**: 漏登记的包根本装载不上, 而不是安静地对全部租户可见。
        # 单租户部署里 tenant_of 恒返回 None, 这一行不改变任何既有行为。
        self.graph.load(ns, ontology, meta=meta, tenant=tenant_of(ns))
        self.register_capability("graph", ns, {
            "namespace": ns,
            "nodes": len(ontology.get("nodes") or []),
            "edges": len(ontology.get("edges") or []),
            "description": (meta or {}).get("description", ""),
        })

        def _undo():
            self.graph.unload(ns)
        self._disposers.append(_undo)
        return _undo

    def route(self, method: str, path: str, handler: Callable, *,
              description: str = "") -> Callable:
        """注册一个 HTTP 端点 —— 由**底座**发, 插件不起自己的服务。

        path 是**相对本插件命名空间**的 (`/selftest`), 底座补上前缀,
        最终落在 `/api/plugin/<插件名>/selftest`。前缀归底座所有:
        命名空间就成了注册期强制的, 而不是「请大家自觉加前缀」的约定。

        handler(req) -> 可 JSON 序列化的对象, 或 (status, obj);
        req = {"method", "path", "pkg", "query", "body"} —— `pkg` 是本插件名,
        实传见 `src/web/plugin_host.py` 的 `_dispatch`。**不要求插件 import 任何
        web 框架** —— 插件住在底座仓之外, 不该被底座的框架版本绑住。
        """
        d = self._manager.register_route(self.plugin, method, path, handler,
                                         description=description)
        self._disposers.append(d)
        return d

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
        """示例站本体引擎 (惰性, 缓存单例)"""
        return self._manager.get_ontology()

    def on_shutdown(self, fn: Callable) -> Callable:
        """登记 disposer — disable/关停时逐个调用"""
        self._disposers.append(fn)
        return fn


class PluginManager:
    """统一插件运行时 — 发现/装载/隔离/启停/持久化"""

    def __init__(self, plugins_dir: Path = None, state_path: Path = None,
                 extra_roots: List[Path] = None):
        self.plugins_dir = Path(plugins_dir) if plugins_dir else _REPO_ROOT / "plugins"
        # 发现顺序 = 本仓 → 显式 extra_roots → 环境变量。同名首个胜出 (见 _plugin_dirs)
        roots = [self.plugins_dir]
        for r in list(extra_roots or []) + _env_plugin_roots():
            p = Path(r)
            if p not in roots:
                roots.append(p)
        self.plugin_roots = roots
        self.state_path = Path(state_path) if state_path else _REPO_ROOT / "data" / "plugins_state.json"
        self._loaded: Dict[str, dict] = {}      # name → {manifest, status, error, capabilities, disposers}
        self._state: dict = {"backend": {}, "frontend": {}}   # 持久化启停选择
        self._ontology = None
        self._engine = None                     # 已交付给插件的本体引擎 (见 deliver_engine)
        # 统一图库 hub (数据库统一) —— 插件本体挂这儿, 不在各包各存一份
        from .graph_store import graph_store
        self.graph = graph_store
        # 插件端点表 (端口统一) —— (METHOD, 全路径) → {plugin, handler}
        # 插件不再各起 HTTP 服务; 由 src/web/plugin_host.py 一处分发。
        self._routes: Dict[tuple, dict] = {}

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
        """遍历所有插件根；同名**首个胜出**并告警，绝不静默覆盖。"""
        found: Dict[str, Path] = {}
        for root in self.plugin_roots:
            if not root.is_dir():
                continue
            for d in sorted(root.iterdir()):
                if not (d.is_dir() and (d / "plugin.py").exists()):
                    continue
                if d.name in found:
                    log.warning(f"[runtime] 插件名冲突 {d.name}: "
                                f"{found[d.name]} 胜出, 忽略 {d}")
                    continue
                found[d.name] = d
        return [found[k] for k in sorted(found)]

    def _resolve_dir(self, name: str) -> Optional[Path]:
        """按名回查插件目录 (跨全部根) —— enable 时用。"""
        hit = self._loaded.get(name, {}).get("dir")
        if hit and Path(hit).exists():
            return Path(hit)
        for root in self.plugin_roots:
            cand = root / name
            if (cand / "plugin.py").exists():
                return cand
        return None

    def plugin_dir(self, name: str) -> Optional[str]:
        """按名回查插件目录的**公开**入口 (plugin_host 托管页面要用)"""
        d = self._resolve_dir(name)
        return str(d) if d else None

    def plugin_module(self, name: str):
        """按名取**装载期那一个**插件模块对象 —— 调模块级钩子用 (如 set_engine)。

        必须是装载期那一个: `_import_plugin` 走 `spec_from_file_location`,
        **再次导入同一文件会得到另一个 module 对象**, 它的模块级状态
        (如 actions_pipeline 的 _engine_box) 与已注册的执行器/工具**不共享** ——
        拿副本去 set_engine, 设的是个没有读者的变量, 而且不报错。
        装载失败或被停用的包返回 None (它们本就没有模块对象)。
        """
        return self._loaded.get(name, {}).get("module")

    def _inject_engine(self, name: str, engine) -> bool:
        """对单个插件交付引擎 —— 无 set_engine 的包返回 False (不是错, 是不需要)"""
        fn = getattr(self.plugin_module(name), "set_engine", None)
        if not callable(fn):
            return False
        try:
            fn(engine)
        except Exception as e:
            # 注入失败不拖垮启动, 但**必须留痕**: 它的后果是「动作提交恒被拒」,
            # 与压根没接线长得一模一样, 静默的话两种病因永远分不开。
            log.error(f"[runtime] {name} 引擎注入失败: {e}")
            return False
        return True

    def deliver_engine(self, engine) -> list:
        """把本体引擎交给声明了注入点的插件 —— 返回收到的插件名 (已排序)。

        注入点协议: 插件模块级有可调用的 `set_engine(engine)` = 「我需要本体」。
        没有这个函数的包被跳过, 且**不算错** —— 多数插件不需要本体。

        交付过的引擎记在 self._engine 上, **之后**才装载的插件在 _load_one
        末尾补交 —— 否则「谁先醒谁拿到引擎」, 而装载顺序不该决定这件事。

        ⚠️ 本仓有两个 `build_engine()` 落点 (本文件的 get_ontology 与
        `src/web/graphrag_api.py` 的 _get_rag), 它们是**两个独立的本体对象**。
        真正在跑的 web 入口是 _get_rag(), 交付也在那里; get_ontology() 眼下
        没有调用者 —— **将来若启用它, 这次交付要一并接过去**。
        """
        self._engine = engine
        got = [n for n in sorted(self._loaded) if self._inject_engine(n, engine)]
        if got:
            log.info(f"[runtime] 引擎已交付: {got}")
        return got

    # ── 插件端点表 (端口统一) ────────────────────────────────
    ROUTE_PREFIX = "/api/plugin"

    def register_route(self, plugin: str, method: str, path: str,
                       handler: Callable, *, description: str = "") -> Callable:
        """登记一个插件端点 —— 返回 disposer。**重名(同方法同路径)抛错**。

        前缀由底座补, 插件只给相对路径。这样两个插件的同名端点
        (`/selftest`) 天然落在各自命名空间下, 撞不上。
        """
        method = (method or "GET").upper()
        rel = "/" + (path or "").lstrip("/")
        full = f"{self.ROUTE_PREFIX}/{plugin}{rel}"
        key = (method, full)
        if key in self._routes:
            raise ValueError(f"端点 {method} {full} 已被插件 "
                             f"{self._routes[key]['plugin']!r} 注册")
        self._routes[key] = {"plugin": plugin, "handler": handler,
                             "description": description}
        log.info(f"[runtime] {plugin} 注册端点 {method} {full}")

        def _undo():
            self._routes.pop(key, None)
        return _undo

    def match_route(self, method: str, path: str) -> Optional[dict]:
        """按 (方法, 全路径) 精确查 —— 查不到返回 None, 由调用方出 404"""
        return self._routes.get(((method or "GET").upper(), path.rstrip("/") or path))

    def routes(self) -> Dict[str, list]:
        """端点清单 (按插件归拢) —— 给诊断面看「谁挂了什么」"""
        out: Dict[str, list] = {}
        for (m, p), v in sorted(self._routes.items()):
            out.setdefault(v["plugin"], []).append({"method": m, "path": p,
                                                    "description": v["description"]})
        return out

    @staticmethod
    def _read_manifest(pdir: Path, module) -> Optional[dict]:
        """清单源：plugin.json (数据) 优先, 回退模块内 PLUGIN_MANIFEST (存量插件)。

        清单当数据读, 才谈得上「装了什么、哪个版本」的账 ——
        .py 里的 dict 不执行代码读不出来。
        """
        pj = pdir / "plugin.json"
        if pj.is_file():
            try:
                m = json.loads(pj.read_text(encoding="utf-8"))
                if isinstance(m, dict) and m.get("name"):
                    return m
                log.warning(f"[runtime] {pdir.name}/plugin.json 缺 name, 回退模块常量")
            except Exception as e:
                log.warning(f"[runtime] {pdir.name}/plugin.json 不可解析 ({e}), 回退模块常量")
        return getattr(module, "PLUGIN_MANIFEST", None)

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
            manifest = self._read_manifest(pdir, module)
            if not isinstance(manifest, dict) or not manifest.get("name"):
                raise ValueError("缺少 plugin.json 与 PLUGIN_MANIFEST (或 manifest.name)")
            if manifest["name"] != pdir.name:
                raise ValueError(f"manifest.name ({manifest['name']}) 必须与插件目录名一致")
            caps_declared = manifest.get("capabilities", [])
            bad = [c for c in caps_declared if c not in CAPABILITY_TYPES]
            if bad:
                raise ValueError(f"未知 capability 声明: {bad}")

            ctx = PluginContext(manifest["name"], self)
            self._loaded[manifest["name"]] = {"manifest": manifest, "status": "loading",
                                              "capabilities": {}, "ctx": ctx,
                                              "dir": str(pdir), "module": module}
            disposers = module.apply(ctx) or []
            # ⚠️ 这里原来是 `= list(disposers)`, **整体覆盖** ——
            #    ctx.on_shutdown() 登记的、以及 register_graph/route 自动挂的,
            #    全被冲掉, 于是 disable 之后端点还活着、本体还挂在图库里,
            #    「生命周期可逆」这条规则就只剩个说法。
            #    必须合并: ① apply 的返回 ② ctx 自己收的。
            #    合并要**去重**: 现有插件普遍写 `return [ctx.on_shutdown(f)]`,
            #    而 on_shutdown 自己也 append 了一次 —— 不去重就会跑两遍。
            seen, merged = set(), []
            for fn in list(disposers) + list(ctx._disposers):
                if id(fn) in seen:
                    continue
                seen.add(id(fn))
                merged.append(fn)
            self._loaded[manifest["name"]]["disposers"] = merged

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
            # 引擎先到、插件后到: 补交一次 (见 deliver_engine)
            if self._engine is not None:
                self._inject_engine(manifest["name"], self._engine)
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
        pdir = self._resolve_dir(name)
        if pdir and Path(pdir).exists():
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
                from .ontology import build_engine
            except ImportError:
                from ontology import build_engine
            self._ontology = build_engine()
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
        """启动自检的唯一出口 —— 降级必须在这里可见, 否则「声明即校验」白做。

        `degraded` 是 :410-414 那条规则的产物 (manifest 声明的 capability
        与实际注册的对不上), 但此前只有 summary() **逐插件**给, health()
        一个字不提 ⇒ 读 health() 的人 (或 `h.get("degraded", 0)`) 拿到的是
        **缺省值 0, 不是测量值**: 状态数比表达位数多一个时, 多出来的那个
        吸附到绿灯。已实际造成过一次跨会话误报 (报「degraded: 0」, 真值 ≥1)。

        **带名字, 不只报个数**: 只给计数的话, 看到 1 的人还得自己翻 summary()
        去查是谁 —— 而那正是没人会去翻的原因。
        **不按 status 过滤**: disable() 只清 capabilities、不重算 degraded,
        按 status 过滤会让「停用一个降级包」把它从名单里静默抹掉, 但它并没有
        被修好。
        """
        stats = {"loaded": 0, "failed": 0, "disabled": 0}
        for e in self._loaded.values():
            s = e.get("status")
            if s in stats:
                stats[s] += 1
        degraded = sorted(n for n, e in self._loaded.items() if e.get("degraded"))
        return {"plugins": len(self._loaded), **stats,
                "degraded": len(degraded), "degraded_plugins": degraded}


# 模块级单例 — main.py 与各 API 消费
runtime = PluginManager()
