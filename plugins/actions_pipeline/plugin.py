# ============================================================
# 内置插件: actions_pipeline — 动作世界 (一切皆插件的执行面)
# ============================================================
# 分工:
#   类型   → src/action_defs.py (ActionDefinition, actions_core 播种)
#   管线   → src/action_pipeline.py (三段式: 校验→审批门→执行+对账)
#   执行器 → 本插件注册 (executor capability): 运输实现与动作类型解耦
#   并行   → ActionPipeline.submit_many (平行世界: 项间隔离, 单项失败
#            不拖垮批次; 共享一份审计日志)
# 铁律: external_side_effect=True 绝不自动执行 (R2 机制化, 管线保证);
#       未知结果 reconciliation=pending, 人工对账。
PLUGIN_MANIFEST = {
    "name": "actions_pipeline",
    "version": "1.0.0",
    # 原为 ["action", "tool", "executor"] —— 去掉 action 是**如实**，不是降级。
    # manifest 的 capabilities 在装载期是按**承诺**校验的
    # (plugin_runtime.py:411-414: set(caps_declared) - set(capabilities.keys()))，
    # 而本插件从不调 ctx.register_action —— 动作类型由 actions_core 播种
    # (见本文件头部「分工」: 类型 → src/action_defs.py)。声明一个自己不注册的
    # 能力域，等于声明一件不提供的东西：装载成功、报错为零，只在 summary()
    # 的 degraded 字段里留个 True —— 而那个字段不在 health() 里，没人看得见。
    # 「我属于动作世界」是**语义**，「我注册了动作名」是**承诺**，两者挤一个字段
    # 时，校验方只会读后者。
    "capabilities": ["tool", "executor"],
    "permissions": {"action": "admin"},
    "description": "ActionContract 三段式管线 — 执行器插件点 + 并行批量派发 + 人工审批门",
}

# 动作 → 执行器绑定 (插件世界约定: 运输选择是配置, 不是硬编码)
_BINDINGS = {"command_down": "mqtt", "acknowledge_alarm": "log"}
_EXECUTORS = {}          # name -> fn(defn, target_id, params) -> dict
_PIPELINE = None
# 引擎注入点 — API 层启动后有 engine 时调用, 未注入则 criteria 视为不可过
_engine_box = {"engine": None}


class _NullEngine:
    def entity_type(self, entity_id):
        return _engine_box["engine"].entity_type(entity_id) if _engine_box["engine"] else None


def set_engine(engine) -> None:
    """注入本体引擎 (graphrag_api 启动时调用一次)"""
    _engine_box["engine"] = engine


def _get_pipeline():
    global _PIPELINE
    if _PIPELINE is None:
        from src.action_pipeline import ActionPipeline
        _PIPELINE = ActionPipeline(engine=_NullEngine(), executor=_dispatch)
    return _PIPELINE


def _dispatch(defn, target_id, params):
    name = _BINDINGS.get(defn.name, "log")
    fn = _EXECUTORS.get(name)
    if fn is None:
        return {"ok": False, "error": f"执行器 '{name}' 未注册"}
    return fn(defn, target_id, params)


def apply(ctx):
    try:
        from src.action_pipeline import ActionPipeline  # noqa: F401  可用性探测
    except Exception:
        return ["action_pipeline module unavailable; skipped"]

    # ── 执行器插件点: 每个运输世界一个 executor ──
    def log_executor(defn, target_id, params):
        ctx.logger().info("action %s target=%s (log executor)", defn.name, target_id)
        return {"ok": True, "ack": "logged", "executor": "log"}

    def mqtt_executor(defn, target_id, params):
        """MQTT 下行执行器 — 只发 dlink 下行主题

        中枢的下行闭集只有一个形态：`$dg/device/{productId}/{devaddr}/properties`
        （dgiot_mqtt_message.erl:90、dgiot_task_dao.erl:100）。这里原先在没给
        topic 时兜底拼 `dgiot/cmd/{target_id}` —— 那个串中枢不认，发布出去是
        **静默丢弃**，调用方却拿到 ack="published"。兜底比报错更坏，删掉。

        本插件的 engine 是 _NullEngine，拿不到 target_id → devaddr/productId
        的映射（那需要本体），所以身份只能由 params 显式给：直给 topic，
        或给 product_id + devaddr 由 dgiot_ids 拼。两样都没有就 ok=False ——
        发不出去要说出来。
        """
        p = params or {}
        topic = p.get("topic")
        addressing = ("topic",)
        if not topic:
            pid, devaddr = p.get("product_id"), p.get("devaddr")
            if not (pid and devaddr):
                return {"ok": False, "executor": "mqtt",
                        "error": "缺 topic 或 product_id+devaddr，拼不出 dlink 下行主题"}
            from src.models.dgiot_ids import dlink_down_topic
            topic = dlink_down_topic(pid, devaddr, "properties")
            addressing = ("topic", "product_id", "devaddr")
        payload = {k: v for k, v in p.items() if k not in addressing}
        ack = ctx.mqtt_publish(topic, payload)
        return {"ok": True, "ack": ack or "published", "executor": "mqtt", "topic": topic}

    _EXECUTORS["log"] = log_executor
    _EXECUTORS["mqtt"] = mqtt_executor
    ctx.register_executor("log", log_executor,
                          description="审计型执行器 — 只留痕, 不出网")
    ctx.register_executor("mqtt", mqtt_executor,
                          description="MQTT 下行执行器 — 发布到 dlink 下行主题 "
                                      "$dg/device/{productId}/{devaddr}/properties")

    # ── 工具面: 单发 / 并行批发 / 人工审批门 ──
    def tool_submit(action: str, params=None, role: str = "admin",
                    target_id: str = "", auth_id: str = "") -> dict:
        return _get_pipeline().submit(action, params=params, role=role,
                                      target_id=target_id, auth_id=auth_id)

    def tool_dispatch(submissions: list, max_workers: int = 4) -> list:
        return _get_pipeline().submit_many(submissions, max_workers=max_workers)

    def tool_authorize(auth_id: str, decision: str, by: str) -> dict:
        auth = _get_pipeline().authorizer
        if decision == "approve":
            return auth.approve(auth_id, by=by)
        return auth.reject(auth_id, by=by)

    ctx.register_tool("action_submit", tool_submit,
                      description="动作单发 — 三段式: 校验→审批门→执行+对账")
    ctx.register_tool("action_dispatch", tool_dispatch,
                      description="动作并行批发 — 世界是平行的, 项间隔离")
    ctx.register_tool("action_authorize", tool_authorize,
                      description="人工审批门 — approve/reject 一次性授权凭证")
    return []
