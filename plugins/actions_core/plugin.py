# ============================================================
# 内置插件: actions_core — 动作定义 (action)
# ============================================================
# R2 落地后分工:
#   类型  → src/action_defs.py (ActionDefinition + 词表 + 校验, 本插件启动时播种)
#   执行  → graphrag_api._ACTION_EXECUTORS (绑定 engine/rag/mqtt, 集中管理)
#   运行时视图 → 下方 ctx.register_action (保持 min_role/external_side_effect 元数据,
#                /api/plugins 与 plugin_runtime.actions() 视图依赖它)
# 铁律: external_side_effect=True 的动作结果不明时 reconciliation=pending,
#       必须人工对账 (POST /aip/actions/{id}/reconcile), 绝不自动重放。
PLUGIN_MANIFEST = {
    "name": "actions_core",
    "version": "1.1.0",
    "capabilities": ["action"],
    "permissions": {"action": "admin"},
    "description": "AIP 运维动作 — 类型化定义 (R2) + 确认告警 / 设备下行 / 只读诊断",
}


def apply(ctx):
    try:
        from src.action_defs import seed_builtin
        seed_builtin()
    except ImportError:
        try:
            from action_defs import seed_builtin
            seed_builtin()
        except Exception:
            pass  # 失败隔离: 类型播种失败不阻塞插件登记

    ctx.register_action(
        "acknowledge_alarm", min_role="operator", external_side_effect=True,
        params_schema={"target_id": "str"},
        description="确认告警 — 审计落库为准 + MQTT cmd 通知尽力而为 (operator 日常职责)")

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
