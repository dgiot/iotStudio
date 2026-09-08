# ============================================================
# 内置插件: actions_core — 动作定义 (action)
# ============================================================
# AIP Action Framework 的声明式元数据 (R2 类型化的前置):
#   PR0 只登记【定义】(最低角色 / 参数 schema / 是否外部副作用),
#   执行逻辑仍留在 graphrag_api.aip_execute_action (行为零变更)。
#   R2 落地时, ActionDefinition + Reconciliation 由此插件承接执行。
PLUGIN_MANIFEST = {
    "name": "actions_core",
    "version": "1.0.0",
    "capabilities": ["action"],
    "permissions": {"action": "admin"},
    "description": "AIP 运维动作定义 — 确认告警 / 设备下行 / 只读诊断",
}


def apply(ctx):
    ctx.register_action(
        "acknowledge_alarm", min_role="operator", external_side_effect=True,
        params_schema={"target_id": "str"},
        description="确认告警 — 审计落库 + MQTT cmd topic 通知 (operator 日常职责)")

    ctx.register_action(
        "command_down", min_role="admin", external_side_effect=True,
        params_schema={"topic": "str (可选, 缺省用实体 cmd topic)", "payload": "object"},
        description="设备下行指令 — 仅管理员, params 作为 payload 发布到 dgiot/.../cmd")

    ctx.register_action(
        "diagnose", min_role="operator", external_side_effect=False,
        description="只读诊断 — GraphRAG analyze_alarm")

    ctx.register_action(
        "trend_check", min_role="operator", external_side_effect=False,
        description="只读趋势检查 — rag.trend(hours)")

    ctx.register_action(
        "health_check", min_role="operator", external_side_effect=False,
        description="只读健康检查 — live_context 状态与文本上下文")
    return []
