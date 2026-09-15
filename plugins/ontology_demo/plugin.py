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
    # 原句尾括号写着「R1 关系词表将在此扩展」—— 未来时, 而 R1 早已落地
    # (LINK_RELATIONS 8 词 / 19 条边, 判据断言全覆盖), 且词表从来没进过这个插件。
    # 这句经 runtime.summary() 进 /api/plugins 的响应, 是**会被看见**的陈旧记录。
    "description": "示例站本体档案 — 五层实体 + 约束 + 数据源种子",
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
        # 关系词表**不在此处手抄**。唯一的源是 src/ontology.py:135 的 LINK_RELATIONS,
        # 线上要读它走 GET /aip/links (src/web/graphrag_api.py:1302 直接返回词表)。
        #
        # 这里原先写着 planned_vocabulary="maps_to, relates_to, ..." 共 8 词, 三处都陈旧:
        #   · 措辞是**未来时**, 而 8 个词早已全部落地 —— 19 条 Link 边零未登记零空挂,
        #     tests/test_ontology_relations.py:53 断言词表全覆盖;
        #   · 它是**手抄的**, 源一变这里不会动;
        #   · 它**零消费方、零暴露** (register_profile 收进 **meta → capability payload,
        #     而 runtime.summary() 只吐 profile 名字) —— 没有任何东西会报红, 只会安静腐烂。
        # 于是它唯一的作用就是误导读代码的人。删掉, 改为指向源。
    )
    return []
