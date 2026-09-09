# ============================================================
# R2: 动作类型化 (ActionDefinition) — 对标 Palantir Foundry Action Type
# ============================================================
# 五要素: params_schema / submit_criteria / allowed_roles / target_layer
#         + reconciliation (回执对账, Foundry 没有 — Ontexus 范式)
# 铁律: external_side_effect=True 的动作, 外部副作用结果不明时
#       reconciliation="pending", 必须人工对账, 绝不自动重放。
# 本模块零内部依赖 (engine 以参数传入), 可被 graphrag_api / 插件 / 测试安全导入。
import re
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional

_NAME_RE = re.compile(r"^[a-z][a-z0-9_]{2,40}$")
_CRITERIA_KINDS = {"target_exists", "enum", "value_range"}
_RECON_STATES = {"", "pending", "succeeded", "not_run", "retry"}
_PARAM_TYPES = {"str": str, "int": int, "float": (int, float), "bool": bool, "object": dict}


@dataclass
class ActionDefinition:
    """声明式动作类型 — Palantir Actions 的边缘对应物"""
    name: str
    title: str = ""
    description: str = ""
    params_schema: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    #   {"param": {"type": "str|int|float|bool|object", "required": bool, "description": str}}
    submit_criteria: List[str] = field(default_factory=list)
    #   "target_exists" | "enum:<param>:v1|v2|..." | "value_range:<param>:min:max"
    allowed_roles: List[str] = field(default_factory=list)   # admin 恒通过; 其余按列表
    target_layer: str = "any"          # point|device|channel|gateway|site|constraint|any|none
    external_side_effect: bool = False  # True → 未知结果必须人工对账
    strict_params: bool = True          # False → 允许 params 携带 schema 外键 (透传类动作)
    builtin: bool = False               # 内建定义不可删除/覆盖

    def to_dict(self) -> dict:
        return asdict(self)


# ── 注册表 (模块级; 内建于 import 时播种, 自定义定义进程内有效) ──
_REGISTRY: Dict[str, ActionDefinition] = {}


def register(defn: ActionDefinition, overwrite: bool = False) -> None:
    if not isinstance(defn.name, str) or not _NAME_RE.match(defn.name):
        raise ValueError(f"动作名不合法 (须匹配 {_NAME_RE.pattern}): {defn.name!r}")
    for crit in defn.submit_criteria:
        kind = crit.split(":")[0]
        if kind not in _CRITERIA_KINDS:
            raise ValueError(f"未知提交规则 '{crit}' (支持: {sorted(_CRITERIA_KINDS)})")
        if kind == "enum" and crit.count(":") < 2:
            raise ValueError(f"enum 规则格式错误: {crit} (应为 enum:<param>:v1|v2)")
        if kind == "value_range" and crit.count(":") < 3:
            raise ValueError(f"value_range 规则格式错误: {crit} (应为 value_range:<param>:min:max)")
    if not overwrite and defn.name in _REGISTRY:
        raise ValueError(f"动作 {defn.name} 已注册")
    _REGISTRY[defn.name] = defn


def get(name: str) -> Optional[ActionDefinition]:
    return _REGISTRY.get(name)


def list_defs() -> List[dict]:
    return [d.to_dict() for d in _REGISTRY.values()]


def unregister(name: str) -> bool:
    """仅可移除非内建定义"""
    d = _REGISTRY.get(name)
    if d is None or d.builtin:
        return False
    return _REGISTRY.pop(name) is not None


# ── 参数校验 ──
def validate_params(defn: ActionDefinition, params: Dict[str, Any]) -> List[str]:
    """schema 校验 — 返回错误列表 (空 = 通过)"""
    errors = []
    schema = defn.params_schema or {}
    for key, spec in schema.items():
        spec = spec if isinstance(spec, dict) else {"type": str(spec)}
        if spec.get("required") and params.get(key) in (None, ""):
            errors.append(f"缺少必填参数 '{key}'")
            continue
        val = params.get(key)
        if val is None:
            continue
        ptype = spec.get("type", "str")
        pytype = _PARAM_TYPES.get(ptype)
        if pytype and not isinstance(val, pytype):
            errors.append(f"参数 '{key}' 应为 {ptype}, 实为 {type(val).__name__}")
    if defn.strict_params:
        for key in params:
            if key not in schema:
                errors.append(f"未知参数 '{key}' (动作 {defn.name} 为严格参数模式)")
    return errors


# ── 提交规则 (声明式, 引擎以参数传入) ──
def check_submit_criteria(defn: ActionDefinition, engine, target_id: str,
                          params: Dict[str, Any]) -> List[str]:
    """校验 submit_criteria — 返回未通过的规则原文 (空 = 通过)"""
    failed = []
    for crit in defn.submit_criteria:
        parts = crit.split(":")
        kind = parts[0]
        if kind == "target_exists":
            if not target_id or engine.entity_type(target_id) is None:
                failed.append(crit)
        elif kind == "enum":
            val = params.get(parts[1])
            if val is None:
                continue  # 缺参由 params_schema.required 把关; 规则只校验已提供值
            if str(val) not in parts[2].split("|"):
                failed.append(crit)
        elif kind == "value_range":
            val = params.get(parts[1])
            if val is None:
                continue  # 同上: 缺参交给执行器默认值
            try:
                if not (float(parts[2]) <= float(val) <= float(parts[3])):
                    failed.append(crit)
            except (TypeError, ValueError):
                failed.append(crit)
    return failed


# ── 角色门 (admin 恒通过, 其余按 allowed_roles) ──
def role_allowed(defn: ActionDefinition, role: str) -> bool:
    if role == "admin":
        return True
    return role in (defn.allowed_roles or [])


# ── 内建定义 (与 P0 五动作对齐; allowed_roles 不含 admin — admin 恒通过) ──
def seed_builtin() -> None:
    register(ActionDefinition(
        name="acknowledge_alarm", title="确认告警",
        description="确认告警 — 审计落库为准, MQTT cmd 通知尽力而为; operator 日常职责",
        params_schema={}, submit_criteria=[],
        allowed_roles=["operator"], target_layer="none",
        external_side_effect=True, builtin=True), overwrite=True)
    register(ActionDefinition(
        name="command_down", title="设备下行指令",
        description="设备下行 — params 经 MQTT 发布到实体 cmd topic; 仅 admin",
        params_schema={"topic": {"type": "str", "required": False,
                                 "description": "覆盖缺省 cmd topic"}},
        submit_criteria=["target_exists"],
        allowed_roles=["admin"], target_layer="any",
        external_side_effect=True, strict_params=False, builtin=True), overwrite=True)
    register(ActionDefinition(
        name="diagnose", title="只读诊断",
        description="只读诊断 — GraphRAG analyze_alarm",
        params_schema={}, submit_criteria=["target_exists"],
        allowed_roles=["operator"], target_layer="any",
        external_side_effect=False, builtin=True), overwrite=True)
    register(ActionDefinition(
        name="trend_check", title="只读趋势检查",
        description="只读趋势 — rag.trend(hours); params.hours ∈ [0.1, 168]",
        params_schema={"hours": {"type": "float", "required": False,
                                 "description": "回看小时数"}},
        submit_criteria=["target_exists", "value_range:hours:0.1:168"],
        allowed_roles=["operator"], target_layer="point",
        external_side_effect=False, builtin=True), overwrite=True)
    register(ActionDefinition(
        name="health_check", title="只读健康检查",
        description="只读健康 — live_context 状态与文本上下文",
        params_schema={}, submit_criteria=["target_exists"],
        allowed_roles=["operator"], target_layer="any",
        external_side_effect=False, builtin=True), overwrite=True)


seed_builtin()
