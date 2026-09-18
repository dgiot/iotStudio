# ============================================================
# iotStudio 插件台账 —— 四套插件机制的归一化声明视图
# ============================================================
"""
存在的理由
----------
本仓并行长出了四套「插件」机制，各有各的清单、各有各的装载路径：

  A 边缘应用插件   plugins/*/plugin.py              PluginManager (src/plugin_runtime.py)
  B 协议驱动插件   src/protocols|services|push      plugin_registry.discover()
  C 通道插件       src/channel_registry.py          ChannelManager
  D 前端模块插件   frontend-vue/src/plugins/        loader.js

四套机制**不该合并** —— 运行时差异是真实的 (importlib / setuptools
entry_points / asyncio 通道生命周期 / 浏览器动态 import())。硬合并等于取三者
最差特性的交集。但它们的**声明**可以归一到同一组字段上，于是
「哪个插件属于哪一套、哪一套没有消费方」从一句口号变成一次查询。

本模块是**只读视图，不是第五套机制**：
  - 不注册任何东西，不启动任何东西，不改任何状态
  - 不参与任何装载路径 —— 删掉本文件，四套机制照常工作
  - 判据（谁有消费方、谁缺回退）写在**这里且只有一份**。
    判据一旦做成插件，换插件就改了验收标准，且 diff 里看不见。

字段
----
  id / layer / kind / provides / requires / constraints / fallback / version

  前八个是统一声明面。另有两位是**台账自己**的诚实性字段：
  source   这条记录从哪读出来的（机制 + 落点）—— 判别域不报出来，
           同一个问题在四套机制里会有四个答案，且都不报错
  status   loaded / failed / disabled / declared / unwired

两条不变量
----------
  ① `provides` 是**观测值**，不是清单自称。清单说声明了 3 类、实际注册了 2 类，
     台账报 2 并把它记进 gaps —— 这不是台账的判断，是本仓既有的
     「声明即校验」(plugin_runtime.py:405-411) 的口径。
  ② 每个 capability 的消费点带一条 probe (file + 正则)，**每次报告时现扫**。
     扫不到 ⇒ 报红，因为那意味着消费点搬走了而台账没跟着搬 ——
     硬编码一张消费点表而不验证它，就是「手抄副本」，本仓已因此翻过车。
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

log = logging.getLogger("plugin.ledger")

_REPO_ROOT = Path(__file__).resolve().parent.parent
_FRONTEND_PLUGINS = _REPO_ROOT / "frontend-vue" / "src" / "plugins"
_FRONTEND_SRC = _REPO_ROOT / "frontend-vue" / "src"


# ═══════════════════════════════════════════════════════════
# 层 —— 哪一套机制
# ═══════════════════════════════════════════════════════════

LAYERS: Dict[str, str] = {
    "edge_app": "A · 边缘应用插件 (plugins/*/plugin.py)",
    "driver":   "B · 协议驱动插件 (src/protocols|services|push)",
    "channel":  "C · 通道插件 (ChannelManager)",
    "frontend": "D · 前端模块插件 (frontend-vue/src/plugins)",
}


# ═══════════════════════════════════════════════════════════
# 档 —— 按插槽语义分，不按语言/仓/进程分
# ═══════════════════════════════════════════════════════════

KINDS: Dict[str, str] = {
    "driver":     "一对一插槽 —— 缺席必须有回退 (fallback 为空即缺口)",
    "capability": "可叠加插槽 —— 空集合须与失败可区分",
    "module":     "可组合插槽 —— 有依赖序，拒绝启动须报缺失项",
}


# ═══════════════════════════════════════════════════════════
# capability 消费点 —— 声明 + 可执行的 probe
# ═══════════════════════════════════════════════════════════
#
# `path`   : 真实消费点落在这个文件
# `probe`  : 在该文件里现扫这个正则；扫不到 ⇒ 台账报红 (消费点搬走了)
# `shadow` : True = 这个类型的真注册走的是**另一套注册表**，
#            ctx.register_* 只是能力面登记 (可见/可禁用)。这不是缺陷，
#            是分层事实 —— 但必须写出来，否则「9 类 capability」会被读成
#            「9 条都接通了」。

CONSUMERS: Dict[str, dict] = {
    "pusher": {
        "path": "src/services/push_engine.py",
        "probe": r"pushers\(\)",
        "note": "真实路径：runtime.pushers() → PushEngine 装配推送出口",
        "shadow": False,
    },
    "graph": {
        "path": "src/graph_store.py",
        "probe": r"def\s+(load|unload)\b",
        "note": "真实路径：ctx.register_graph → graph_store，反查走 /api/graph/*",
        "shadow": False,
    },
    "hook": {
        "path": "src/web/parse_hooks.py",
        "probe": r"def\s+run_hooks\b",
        "note": "影子：真注册走 parse_hooks.hook()，ctx 侧只登记能力面",
        "shadow": True,
    },
    "action": {
        "path": "src/action_defs.py",
        "probe": r"def\s+seed_builtin\b",
        "note": "影子：真注册走 action_defs.seed_builtin()，ctx 侧只带 min_role 元数据",
        "shadow": True,
    },
    "channel": {
        "path": "src/channel_registry.py",
        "probe": r"class\s+ChannelManager\b",
        "note": "真实路径：ChannelManager（通道自己就是注册表）",
        "shadow": False,
    },
    # 以下四类：**没有任何消费点**。台账照报，不补默认值 ——
    # 缺省值 (0) 冒充测量值是本仓已记录过的翻车形态。
    "tool":      {"path": None, "probe": None, "note": "无消费方", "shadow": False},
    "profile":   {"path": None, "probe": None, "note": "无消费方", "shadow": False},
    "connector": {"path": None, "probe": None, "note": "无消费方", "shadow": False},
    "executor":  {"path": None, "probe": None, "note": "无消费方", "shadow": False},
}


# ═══════════════════════════════════════════════════════════
# 声明条目
# ═══════════════════════════════════════════════════════════

@dataclass
class PluginDecl:
    """一条归一化声明 —— 八个统一字段 + 两个台账自己的诚实性字段"""

    id: str
    layer: str
    kind: str
    provides: List[str] = field(default_factory=list)
    requires: List[str] = field(default_factory=list)
    constraints: Dict[str, Any] = field(default_factory=dict)
    fallback: Optional[str] = None
    version: str = "?"
    # 台账字段
    source: str = ""
    status: str = "declared"

    def as_dict(self) -> dict:
        d = {
            "id": self.id, "layer": self.layer, "kind": self.kind,
            "provides": self.provides, "requires": self.requires,
            "constraints": self.constraints, "fallback": self.fallback,
            "version": self.version,
        }
        d["source"] = self.source
        d["status"] = self.status
        return d


# ═══════════════════════════════════════════════════════════
# 采集 —— 四层各一个 reader，各自报自己的判别域
# ═══════════════════════════════════════════════════════════

def _read_edge_apps() -> Tuple[List[PluginDecl], str]:
    """A 层：PluginManager 已装载的插件 (观测值来自 runtime._loaded)"""
    import sys
    mod = sys.modules.get("src.plugin_runtime") or sys.modules.get("plugin_runtime")
    if mod is None or not hasattr(mod, "runtime"):
        # 宿主未启动 —— 如实说，不去替它启动 (启动会执行插件代码)
        return [], "未读 —— 宿主未启动 (src.plugin_runtime 未 import)"
    rt = mod.runtime
    out: List[PluginDecl] = []
    for name, entry in sorted(rt._loaded.items()):
        man = entry.get("manifest") or {}
        caps = entry.get("capabilities") or {}
        declared = list(man.get("capabilities") or [])
        observed = sorted(caps.keys())
        out.append(PluginDecl(
            id=name,
            layer="edge_app",
            kind="capability",
            provides=observed,
            requires=list(man.get("requires") or []),
            constraints={
                # 缺省角色是运行时的既有约定 (plugin_runtime.py:54)
                "min_role": {c: (caps.get(c) or {}).get("min_role")
                             for c in observed if c in ("action", "tool", "connector")},
                "declared_but_unregistered": sorted(set(declared) - set(observed)),
            },
            fallback=man.get("fallback"),
            version=str(man.get("version", "?")),
            source=f"plugins/{name}/plugin.py",
            status=entry.get("status", "?"),
        ))
    return out, f"runtime._loaded ({len(out)} 个)"


def _read_drivers() -> Tuple[List[PluginDecl], str]:
    """B 层：plugin_registry 里注册的驱动/服务 (观测值来自 _registry)

    ★ 这个注册表**不是 B 层独占的** —— 另两层都往里写：
      · PluginManager._sync_registry() 把每个 A 层插件镜像进来 (plugin_runtime.py:353)
      · register_channel_plugin() 把每个 C 层通道也注册进来 (channel_registry.py:249)
    不过滤的话，同一份台账里会出现「actions_core 既是 edge_app 又是 driver」，
    而 driver 型要查 fallback 缺失 —— 于是凭空长出 6 条假缺口。
    假阳性与真缺口长得一样，所以这里**过滤并把滤掉了什么报出来**。
    """
    import sys
    mod = sys.modules.get("src.plugin_registry") or sys.modules.get("plugin_registry")
    if mod is None:
        try:
            from . import plugin_registry as mod  # type: ignore
        except ImportError:
            return [], "未读 —— plugin_registry 不可 import"
    out: List[PluginDecl] = []
    mirrors, chans = [], []
    for p in mod.list_all():
        meta = p.get("metadata") or {}
        modname = meta.get("_module") or ""
        # A 层镜像：_sync_registry 从 plugin_runtime 里调的 register()
        if modname.endswith("plugin_runtime"):
            mirrors.append(p["name"])
            continue
        # C 层通道：channel_registry 注册的，账算在 C 层
        if p.get("category") == "channel":
            chans.append(p["name"])
            continue
        out.append(PluginDecl(
            id=p["name"],
            layer="driver",
            kind="driver",
            provides=[p.get("category", "protocol")],
            requires=list(p.get("depends") or []),
            constraints={"enabled": p.get("enabled", True)},
            # 驱动的回退 = 它的 config_schema 是不是空 (空 = 没有可回退的缺省)
            fallback=("config_schema" if p.get("config_schema") else None),
            version=str(p.get("version", "?")),
            source=f"{meta.get('_module', '?')} (category={p.get('category')})",
            status="loaded" if p.get("enabled", True) else "disabled",
        ))
    return out, (f"plugin_registry._registry ({len(out)} 个原生；"
                 f"滤掉 {len(mirrors)} 个 A 层镜像、{len(chans)} 个 C 层通道)")


def _read_channels() -> Tuple[List[PluginDecl], str]:
    """C 层：ChannelManager 里的通道实例"""
    import sys
    mod = sys.modules.get("src.channel_registry") or sys.modules.get("channel_registry")
    if mod is None:
        try:
            from . import channel_registry as mod  # type: ignore
        except ImportError:
            return [], "未读 —— channel_registry 不可 import"
    out: List[PluginDecl] = []
    for cid, ch in sorted(mod.ChannelManager._instances.items()):
        meta = ch.metadata or {}
        out.append(PluginDecl(
            id=cid,
            layer="channel",
            kind="driver",
            provides=[ch.cType.value],
            requires=[],
            constraints={"endpoint": meta.get("endpoint")},
            # 通道的回退 = 有没有 on_start；没有就是「注册了但起不来」
            fallback=("on_start" if ch._on_start else None),
            version=str(meta.get("version", "?")),
            source=f"ChannelManager._instances[{cid!r}]",
            status=ch.status,
        ))
    return out, f"ChannelManager._instances ({len(out)} 个)"


# D 层：前端插件是 .js，从源码文本里取声明 —— 这里刻意用最窄的正则，
# 取不到的字段**留空**而不是猜 (取不到就报取不到)。
_RE_NAME = re.compile(r"^\s*name:\s*'([^']+)'", re.M)
_RE_VERSION = re.compile(r"^\s*version:\s*'([^']+)'", re.M)
_RE_PATH = re.compile(r"path:\s*'([^']+)'")
_RE_IMPORT = re.compile(r"import\('(\.\./[^']+)'\)")


def _block_after(txt: str, key: str) -> str:
    """取 `key: [ ... ]` 里这一对方括号之间的原文 (配平扫描，不靠行尾猜)。

    为什么要配平: 菜单项的 `path:` 与路由的 `path:` 字形完全相同
    (base-plugin 的 4 条路由与 4 条菜单项路径逐字一致)。直接用
    `path:` 全匹配会把菜单算成路由 —— 报「声明了 8 条路由」而实际是 4 条。
    只在 routes 数组里数，才是那个数。
    """
    i = txt.find(f"{key}:")
    if i < 0:
        return ""
    j = txt.find("[", i)
    if j < 0:
        return ""
    depth = 0
    for k in range(j, len(txt)):
        if txt[k] == "[":
            depth += 1
        elif txt[k] == "]":
            depth -= 1
            if depth == 0:
                return txt[j:k + 1]
    return txt[j:]


def _read_frontend() -> Tuple[List[PluginDecl], str]:
    """D 层：frontend-vue/src/plugins/*.js 的声明"""
    if not _FRONTEND_PLUGINS.is_dir():
        return [], "未读 —— frontend-vue/src/plugins 不存在"

    # 构建期清单 (manifest.js) —— 决定默认开关
    manifest_txt = (_FRONTEND_PLUGINS / "manifest.js").read_text(encoding="utf-8")
    enabled = {m for m in re.findall(r"^\s*(\w+):\s*true", manifest_txt, re.M)}

    # loader.js 的模块表 —— **没有它，MANIFEST 里写 true 也加载不了**。
    # 这份表是 loader 自己的白名单；插件文件存在 ≠ 它能被加载。
    loader_txt = (_FRONTEND_PLUGINS / "loader.js").read_text(encoding="utf-8")
    m = re.search(r"PLUGIN_MODULES\s*=\s*\{(.*?)\n\}", loader_txt, re.S)
    registered = set(re.findall(r"^\s*(\w+):\s*\(\)", m.group(1), re.M)) if m else set()

    out: List[PluginDecl] = []
    for js in sorted(_FRONTEND_PLUGINS.glob("*-plugin.js")):
        txt = js.read_text(encoding="utf-8")
        names = _RE_NAME.findall(txt)
        if not names:
            continue
        paths = _RE_PATH.findall(_block_after(txt, "routes"))
        # 组件资产核对 —— 声明了路径但文件不在 ⇒ 导航时才炸，且是静默的
        missing = []
        for rel in _RE_IMPORT.findall(_block_after(txt, "routes")):
            target = (_FRONTEND_PLUGINS / rel).resolve()
            if not target.exists():
                missing.append(rel.replace("../", ""))
        vers = _RE_VERSION.findall(txt)
        out.append(PluginDecl(
            id=names[0],
            layer="frontend",
            kind="module",
            provides=[p for p in paths],
            requires=[],
            constraints={"routes_declared": len(paths),
                         "missing_assets": sorted(set(missing)),
                         "in_loader": names[0] in registered},
            fallback=None,  # 前端的回退 = 保留静态路由，见 router/index.js
            version=vers[0] if vers else "?",
            source=f"frontend-vue/src/plugins/{js.name}",
            status=("unreachable" if names[0] not in registered
                    else "declared" if names[0] in enabled else "disabled"),
        ))
    miss = [d.id for d in out if not d.constraints["in_loader"]]
    return out, (f"frontend-vue/src/plugins/*-plugin.js ({len(out)} 个；"
                 f"loader 白名单 {len(registered)} 项"
                 + (f"，{len(miss)} 个不在表里: {miss}" if miss else "") + ")")


# ═══════════════════════════════════════════════════════════
# 消费点 probe —— 现扫，扫不到就报红
# ═══════════════════════════════════════════════════════════

def consumer_report() -> List[dict]:
    """每个 capability 的消费点 + probe 结果。

    probe 扫不到**不是**「无消费方」，是「台账的消费点记录过期了」——
    两种情形必须分开报，否则消费点搬走后台账会静默变成一纸空文。
    """
    rows: List[dict] = []
    for cap, spec in sorted(CONSUMERS.items()):
        path = spec.get("path")
        if not path:
            rows.append({"capability": cap, "path": None, "line": None,
                         "state": "no_consumer", "note": spec["note"],
                         "shadow": spec["shadow"]})
            continue
        f = _REPO_ROOT / path
        if not f.is_file():
            rows.append({"capability": cap, "path": path, "line": None,
                         "state": "probe_broken",
                         "note": f"台账记的落点不存在: {path}", "shadow": spec["shadow"]})
            continue
        hits = [i + 1 for i, ln in enumerate(f.read_text(encoding="utf-8").splitlines())
                if re.search(spec["probe"], ln)]
        rows.append({
            "capability": cap, "path": path,
            "line": hits[0] if hits else None,
            "state": "wired" if hits else "probe_broken",
            "note": spec["note"] if hits else f"正则 {spec['probe']!r} 在 {path} 零命中",
            "shadow": spec["shadow"],
        })
    return rows


# ═══════════════════════════════════════════════════════════
# 装配状态 —— D 层是否已接线
# ═══════════════════════════════════════════════════════════

def frontend_wiring() -> dict:
    """D 层的接线状态：plugins/ 目录**之外**有几处引用它。

    这是「说明书是现成的、从未执行」的可执行判据 —— 0 处 = 零接线。
    """
    if not _FRONTEND_SRC.is_dir():
        # 键名必须与正常分支**同形** —— 早退路径少一个键 = 调用侧 KeyError，
        # 而这条路径只在目录缺失时才走到，平时永远测不出来。
        return {"external_files": 0, "sites": [], "domain": "frontend-vue/src 不存在"}
    ref_re = re.compile(r"(\.\./plugins|\./plugins|plugins/loader|plugins/registry)")
    sites: List[str] = []
    scanned = 0
    for f in sorted(_FRONTEND_SRC.rglob("*")):
        if f.suffix not in (".js", ".vue", ".ts"):
            continue
        if _FRONTEND_PLUGINS in f.parents or f.parent == _FRONTEND_PLUGINS:
            continue  # 插件目录内部互引不算外部接线
        scanned += 1
        txt = f.read_text(encoding="utf-8", errors="replace")
        # 一个文件里的**每一行**都收：只记首个命中会让「1 个文件 2 处引用」
        # 渲染成「1 处」，而 router/index.js 正是这种（它同时 import loader 与 index）。
        # 计数口径随之明确为「文件数」—— 与 sites 的条数一致，不再含糊。
        hits = [i for i, ln in enumerate(txt.splitlines(), 1) if ref_re.search(ln)]
        if hits:
            rel = f.relative_to(_REPO_ROOT).as_posix()
            sites.append({"file": rel, "lines": hits})
    return {"external_files": len(sites), "sites": sites,
            "domain": f"frontend-vue/src 下 {scanned} 个 .js/.vue (排除 plugins/ 自身)"}


# ═══════════════════════════════════════════════════════════
# 缺口 —— 台账的全部价值在这里
# ═══════════════════════════════════════════════════════════

def gaps(decls: List[PluginDecl]) -> List[dict]:
    """按三档插槽语义各查各的必备项。**空的类别也要出现**，不静默省掉。"""
    out: List[dict] = []

    # ① driver 型：fallback 为空即缺口（一对一插槽，缺席没有替代品）
    for d in decls:
        if d.kind == "driver" and not d.fallback:
            out.append({"kind": "no_fallback", "id": d.id, "layer": d.layer,
                        "detail": "driver 型插槽缺席无回退"})

    # ② capability 型：声明了但没注册出来的 (声明即校验的缺口面)
    for d in decls:
        miss = d.constraints.get("declared_but_unregistered") or []
        if miss:
            out.append({"kind": "declared_unregistered", "id": d.id, "layer": d.layer,
                        "detail": f"清单声明但未注册: {miss}"})

    # ③ 装载失败 / 通道 error —— 必须响
    for d in decls:
        if d.status == "failed":
            out.append({"kind": "load_failed", "id": d.id, "layer": d.layer,
                        "detail": "装载失败 (失败隔离住了，但账上要看得到)"})
        if d.status == "error":
            out.append({"kind": "channel_error", "id": d.id, "layer": d.layer,
                        "detail": "通道处于 error 态"})

    # ④ 前端声明了路由但组件文件不存在 —— 只会在导航时才炸
    for d in decls:
        miss = d.constraints.get("missing_assets") or []
        if miss:
            out.append({"kind": "missing_asset", "id": d.id, "layer": "frontend",
                        "detail": f"路由指向不存在的组件: {miss}"})

    # ④b 前端插件不在 loader 白名单里 —— 文件写好了、路由也声明了，
    #     但没有任何路径能加载它。这是「建成未接线」在文件级的表现。
    for d in decls:
        if d.layer == "frontend" and d.constraints.get("in_loader") is False:
            out.append({"kind": "unreachable", "id": d.id, "layer": "frontend",
                        "detail": f"不在 loader.js 的 PLUGIN_MODULES 表里 —— "
                                  f"声明的 {d.constraints.get('routes_declared', 0)} 条路由永远不会生效"})

    # ⑤ 零消费方的 capability —— 建了面、没有消费
    for row in consumer_report():
        if row["state"] == "no_consumer":
            out.append({"kind": "no_consumer", "id": f"capability:{row['capability']}",
                        "layer": "-", "detail": row["note"]})
        elif row["state"] == "probe_broken":
            out.append({"kind": "probe_broken", "id": f"capability:{row['capability']}",
                        "layer": "-", "detail": row["note"]})

    return out


# ═══════════════════════════════════════════════════════════
# 对外：一次采集
# ═══════════════════════════════════════════════════════════

def collect() -> dict:
    """读四层，返回归一化声明 + 消费点 + 缺口。

    只读。不 import 任何会执行插件代码的东西 —— 主机没启动时 A 层如实报
    「未读」，而不是替它启动。要连 A 层一起看，用 scripts/plugin_ledger.py。
    """
    decls: List[PluginDecl] = []
    domains: Dict[str, str] = {}
    for layer, reader in (("edge_app", _read_edge_apps), ("driver", _read_drivers),
                          ("channel", _read_channels), ("frontend", _read_frontend)):
        try:
            got, domain = reader()
        except Exception as e:  # 单层读失败不该让整份台账出不来
            got, domain = [], f"读取抛错: {e!r}"
            log.warning(f"[ledger] {layer} 层读取失败: {e!r}")
        decls.extend(got)
        domains[layer] = domain

    return {
        "declarations": [d.as_dict() for d in decls],
        "counts": {lyr: sum(1 for d in decls if d.layer == lyr) for lyr in LAYERS},
        "domains": domains,
        "consumers": consumer_report(),
        "frontend_wiring": frontend_wiring(),
        "gaps": gaps(decls),
    }


# ═══════════════════════════════════════════════════════════
# 渲染 —— 给人看的表
# ═══════════════════════════════════════════════════════════

def render(report: dict = None) -> str:
    """把 collect() 的结果排成表。**表格里的每个数都是现算的**，不手抄。"""
    r = report or collect()
    L: List[str] = []
    L.append("iotStudio 插件台账 —— 四套机制归一化视图")
    L.append("=" * 78)

    L.append("")
    L.append("① 判别域（每条声明从哪读出来的 —— 不报判别域的账本没法对质）")
    L.append("-" * 78)
    for lyr, desc in LAYERS.items():
        L.append(f"  {desc:<44} {r['domains'].get(lyr, '?')}")

    L.append("")
    L.append("② 归一化声明（id · layer · kind · provides · fallback · status）")
    L.append("-" * 78)
    L.append(f"  {'id':<22} {'layer':<10} {'kind':<11} {'provides':<26} {'fallback':<12} {'status'}")
    by_layer = {lyr: [] for lyr in LAYERS}
    for d in r["declarations"]:
        by_layer.setdefault(d["layer"], []).append(d)
    for lyr in LAYERS:
        for d in sorted(by_layer.get(lyr, []), key=lambda x: x["id"]):
            prov = ",".join(str(p) for p in d["provides"])
            if len(prov) > 25:
                prov = prov[:22] + "..."
            fb = d["fallback"] or "—"
            L.append(f"  {d['id']:<22} {d['layer']:<10} {d['kind']:<11} "
                     f"{prov:<26} {str(fb):<12} {d['status']}")

    L.append("")
    L.append("③ capability 消费点（probe 每次现扫；零命中=台账自己过期，不是「无消费方」）")
    L.append("-" * 78)
    marks = {"wired": "接通", "no_consumer": "无消费方", "probe_broken": "★probe坏"}
    for row in r["consumers"]:
        shadow = " [影子]" if row["shadow"] else ""
        loc = f"{row['path']}:{row['line']}" if row["line"] else (row["path"] or "—")
        L.append(f"  {row['capability']:<11} {marks.get(row['state'], row['state']):<10} "
                 f"{loc:<34} {row['note']}{shadow}")

    fw = r["frontend_wiring"]
    L.append("")
    L.append("④ 前端接线状态（plugins/ 目录之外的引用）")
    L.append("-" * 78)
    L.append(f"  外部引用: {fw['external_files']} 个文件   判别域: {fw['domain']}")
    for s in fw["sites"]:
        L.append(f"    · {s['file']}  行 {', '.join(map(str, s['lines']))}")

    L.append("")
    L.append(f"⑤ 缺口（{len(r['gaps'])} 条）")
    L.append("-" * 78)
    if not r["gaps"]:
        L.append("  无")
    for g in r["gaps"]:
        L.append(f"  [{g['kind']:<21}] {g['id']:<28} {g['detail']}")

    return "\n".join(L)


if __name__ == "__main__":  # pragma: no cover - 便利入口，正门是 scripts/plugin_ledger.py
    print(render())
