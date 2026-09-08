# ============================================================
# 内置插件: graphrag_tools — AI 工具集 (tool)
# ============================================================
# ReAct 工具箱声明 (R4 Agent Runtime 的前置):
#   PR0 登记工具名与描述 (与 sandbox_exec 预置变量一一对应);
#   R4 把 validate() 六维度升级为 LLM 串联检查时, 工具经此插件注册/发现。
PLUGIN_MANIFEST = {
    "name": "graphrag_tools",
    "version": "1.0.0",
    "capabilities": ["tool"],
    "permissions": {"tool": "admin"},
    "description": "GraphRAG ReAct 工具集 — search / ask / ctx / summary",
}


def apply(ctx):
    ctx.register_tool("search",
                      description="混合检索: TF-IDF 关键词 + 图遍历扩展 (rag.search)")
    ctx.register_tool("ask",
                      description="三层检索问答: 关键词→图遍历→LLM (rag.ask)")
    ctx.register_tool("ctx",
                      description="实体本地上下文 — 邻居/约束/最近遥测 (engine.local_context)")
    ctx.register_tool("summary",
                      description="层级社区摘要 (engine.community_summary)")
    return []
