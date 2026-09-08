# ============================================================
# 内置插件: ontology_demo — 本体档案 (profile)
# ============================================================
# 示例站本体种子 (Site→GW→CH→Dev→Pt 五层 + Constraint + DataSource,
# 即 build_131_ontology 的 131 站微电网样例) 以 profile 能力注册;
# graphrag_api 现有懒加载路径保持不变 (Strangler 第一步)。
# 注: 目录名刻意不含 "131" (遵守 .gitignore *131* 守卫), 语义留在内容层。
PLUGIN_MANIFEST = {
    "name": "ontology_demo",
    "version": "1.0.0",
    "capabilities": ["profile"],
    "description": "示例站本体档案 — 五层实体 + 约束 + 数据源种子 (R1 关系词表将在此扩展)",
}


def apply(ctx):
    def _builder():
        try:
            from src.ontology import build_131_ontology
        except ImportError:
            from ontology import build_131_ontology
        return build_131_ontology()

    ctx.register_profile(
        "iot-studio-demo-131",
        _builder,
        description="光储充微电网示例站: 131 设备五层本体 + 约束 + 数据源",
        entity_layers="Site,Gateway,Channel,Device,Point",
        planned_vocabulary="maps_to, relates_to, has_defect, has_issue, "
                           "feeds_into, monitors, controls, powered_by",
    )
    return []
