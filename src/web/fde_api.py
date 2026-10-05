"""
FDE 六步工作法 API — 不写代码构建工业智能体
============================================
Step 1: 物模型定义     Step 4: 时序存储 (已有)
Step 2: 本体语义建模   Step 5: 规则引擎
Step 3: 多协议接入     Step 6: 驾驶舱可视化

以上是**基准位次**（Palantir FDE 交付方法论, 逐字不动）。⚠️ 它**不是**向导的
步骤序 —— 向导不覆盖 Step 4（平台 TDengine 已有）, 而 AI Agent **不是第 6 步**
（它横跨全部步骤; 页面自述「AI 自动完成全部 6 步配置」）。三者的对应关系与各自
出处见下方 **FDE_STEPS**（唯一事实源, 出口 `GET /api/fde/steps`,
判据 tests/test_fde_steps.py）。
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import json

router = APIRouter(prefix="/api/fde", tags=["FDE Wizard"])

# ═══════════════════════════════════════════
# FDE 六步 —— 三个视图的唯一事实源
# ═══════════════════════════════════════════
#
# 「FDE 六步」这一个名字底下有**三个不同的东西**, 各自都合法。原先没有一处写清
# 它们的关系, 于是页面、API、项目说明各按自己那套措辞, 逐字对不上 —— 其中
# frontend-vue/public/fde.html 的副标题与它**自己的步骤条**就是其中两套。
#
#   benchmark  Palantir FDE 交付方法论 —— 对标的**基准**, 逐字不动
#   edge       iotStudio 的边缘映射 —— 同一方法论的边缘视角（CLAUDE.md 自称「映射」）
#   bar        页面步骤条 —— 六格**按基准位次**排列, 但第 4 格向导不实现它
#
# ⚠️ 三处**不是**编号漂移, 是三个不同的对象; 强行统一会把真实信息抹掉:
#   · edge 第 5 步「推送中枢」在 benchmark 里**没有对应** —— 那是边缘特有的动作
#     （数据推给中枢）, 不是 Rules 的别名。它的 maps_to_benchmark 是 None 不是 4。
#   · bar 的第 4 格「时序存储」**向导不实现** —— 平台 TDengine 超表已有。2026-09-20
#     重排后它在步骤条上占一格（按基准位次）, 但点开只有说明卡、没有按钮; 重排前
#     则是靠「步骤条只有 5 格」暗示的, 而那个暗示没有任何一处写出来。
#     这一条原先只写在模块 docstring 的一个括号「(已有)」里。
#   · AI Agent **不是任何一步**: 它横跨全部步骤（/wizard/agent 一次做完 1/2 并
#     给出 6）, 页面自己那句「AI 自动完成全部 6 步配置」就是这个意思 ——
#     若它是第 6 步, 「全部 6 步」就包含它自己。2026-09-20 起它**不在步骤条里**,
#     独立成条排在步骤条下方（重排前它占着第 6 格）。
#
# 载体各自指过来, 别再各写一份:
#   · 页面步骤条与回显行   frontend-vue/public/fde.html
#   · 判据                 tests/test_fde_steps.py
#
# ⚠️ benchmark 的六步在这里是**字面量**, 不是从文档读的 —— 那份对标文档
# （docs/palantir-benchmark.md）**不在 git 仓里**（docs/ 被 .gitignore 整个忽略）,
# 判据去读它会在干净检出里直接崩, 而不是报红。文档路径只作 source 里的出处。
FDE_STEPS: Dict[str, Any] = {
    "benchmark": {
        "label": "Palantir FDE 交付方法论（对标基准, 逐字不动）",
        "source": "docs/palantir-benchmark.md「FDE 六步不动」—— ⚠️ 该文件不在 git 仓",
        "steps": ["Model", "Ontology", "Device Access",
                  "Time-Series", "Rules", "Dashboard"],
        "steps_zh": ["物模型定义", "本体语义建模", "多协议接入",
                     "时序存储", "规则引擎", "驾驶舱可视化"],
    },
    "edge": {
        "label": "iotStudio 边缘映射（同一方法论的边缘视角, 不是第二个版本）",
        "source": "CLAUDE.md「核心哲学（六步 FDE 工作流的边缘映射）」",
        "steps": ["设备建模", "点表映射", "协议采集",
                  "流式计算", "推送中枢", "仪表呈现"],
        # 逐位对应 benchmark 的位次（0-based）; None = 该位在基准里**确实没有**对应物
        "maps_to_benchmark": [0, 1, 2, 3, None, 5],
    },
    "bar": {
        "label": "页面步骤条 —— 六格**按基准位次**排列"
                 "（2026-09-20 重排前它是向导的点击顺序, 与基准只在前三步重合）",
        "source": "frontend-vue/public/fde.html 步骤条",
        # 格名是**页面自己的措辞**, 位次取基准 —— 两者**不逐字相等**, 差在 2 处。
        # 差异不磨平: 与基准措辞不同的位次必须在 renamed 里逐位申报, 判据要求
        # declared == diff（漏报=静默磨平, 多报=记了不存在的事, 两个方向都红）。
        "cells": ["物模型定义", "本体语义建模", "协议自动发现",
                  "时序存储", "规则引擎", "驾驶舱"],
        "renamed": [
            {"index": 2, "bar": "协议自动发现", "benchmark": "多协议接入",
             "why": "两个词各指一件事: 向导这一步的动作是**扫描发现**（卡片里的表单是"
                    "目标IP/端口/从站范围）, 基准那一步的名字指的是**接入能力**。"
                    "把格名改成基准的措辞, 抹掉的是「向导做的是发现」这条事实 —— "
                    "与 edge 的「推送中枢」不许改名成基准词是同一条纪律。"},
            {"index": 5, "bar": "驾驶舱", "benchmark": "驾驶舱可视化",
             "why": "只差后缀, 页面求短。差异真实但无信息量, 记下来是为了让"
                    "「declared == diff」这条判据有完整的输入。"},
        ],
        # 逐格: 向导**有没有**实现它。第 4 格是唯一的 False。
        "implemented_by_wizard": [True, True, True, False, True, True],
        # 未实现的那一格在页面上带 `skip` 类（虚线框 + 数字圈虚线 + 副标题缀
        # 「平台承担」）。**视觉标记也要有事实源**: 六格在点击前长得一模一样,
        # 光靠下面那句说明承载不住「这一格向导不做」; 标记被谁删掉, 判据要红。
        "skip_index": 3,
        "note": "第 4 格「时序存储」向导不实现它 —— 点开只有说明卡、没有按钮。"
                "重排前这一步只活在模块 docstring 的一个括号「(已有)」里, 靠"
                "「步骤条只有 5 格」暗示; 现在它**占一格却不带动作**, 谁按格数"
                "读成「六步全做了」都读得通, 所以这条必须写出来。",
    },
    "accelerator": {
        "label": "AI Agent —— 横跨全部步骤, 不是其中一步",
        "endpoint": "/api/fde/wizard/agent",
        "position": "**不在步骤条里**（2026-09-20 重排后独立成条, 排在步骤条下方）。"
                    "放进步骤条会让它看起来是第七格或「第 6 步」, 而它自己的文案写"
                    "「AI 自动完成全部 6 步配置」: 若它是其中一步, 那句话就包含它自己。",
        "why": "一次调用做完 Step 1/2 并给出 Step 6",
    },
    # ── 步骤名的载体清单 ─────────────────────────────────────
    # **哪些文件里写着这六个格名**（判据扫「git 能发布的那一集」, 多一处就红；
    # 域 = 已跟踪 ∪ 未跟踪但未被忽略 —— **必须含未跟踪**, 否则「新文件抄了格名」
    # 这件事恰恰落在域外, 而那是这条判据全部的用途）。
    # 为什么要有它: 本轮两次踩「判别域选窄了」—— 旧名活在第五处（一句**用户可见
    # 的提示**）而四条判据各自只盯一个位置, 全绿。清单把「还有没有别处」这句
    # 问话变成**执行者**: 新写一处不带申报, 判据当场红, 而不是等人想起来。
    "carriers": [
        "src/web/fde_api.py",
        "frontend-vue/public/fde.html",
        "tests/test_fde_steps.py",
    ],
    # 只带**方法名**、不带格名的五处（上面那条扫描看不见它们, 但都已核过 ——
    # 记坐标是为了让下一个人不必把这个问句重新问一遍）。
    "name_only_carriers": [
        {"at": "frontend-vue/public/fde.html:5", "text": "<title>FDE 六步工作法 — …"},
        {"at": "frontend-vue/public/fde.html:54", "text": "顶栏 <h1>⚙️ FDE 六步工作法"},
        {"at": "frontend-vue/src/router/index.js:66", "text": "菜单标题 FDE 六步工作法"},
        {"at": "frontend-vue/public/audit.html:50",
         "text": "FDE向导 | 六步工作法 (不写代码构建智能体)"},
        {"at": "frontend-vue/public/audit.html:69", "text": "链接标签 🪄 FDE六步工作法"},
    ],
    "name_only_carriers_why":
        "「六步工作法」是**方法论的名字**, 五处一模一样地用它, 它不是向导覆盖面的"
        "声称 —— 所以**没改**: 五个一模一样的标签里单改一处, 造出的不一致比它修掉"
        "的还多。⚠️ 但它会**被读成计数**: audit.html:50 与同一张卡片的「8大功能面板 /"
        "8视图」同形, 而「FDE向导」这个键名又把主语锁在向导上。要动就得五处同动,"
        "且先想清楚这个名字还要不要留。",
    # ── 域外载体：拷贝了格名, 但进不了任何提交 ────────────────
    # 上面的扫描域是「git 能发布的那一集」。这四个文件在**盘域**里也抄了格名,
    # 但被 .gitignore 挡在提交之外（docs/ 见 `.gitignore:2`, 注释写 `# Sensitive`;
    # graphify-out/ 见 `:192`）—— **域外不等于不存在**, 记下来是为了让下一个人
    # 不必重新问一遍「还有没有别处」, 也免得把「扫描全绿」读成「全仓只有三处」。
    # ⚠️ kind 是**人判的**, 不是判据判的: 判据只验「它还在不在域外」+「判别线在
    #    它身上还点不点火」, 分不出载体与误报 —— 那正是 kind 这一栏存在的理由。
    "carriers_outside_git_domain": [
        {"path": "docs/BENCHMARK.md", "kind": "载体",
         "why": "真讨论步骤清单（「FDE 六步 —— 三个视图的对平」那一节）。"
                "在本仓纪律下它**本来就不该进提交**, 所以域外是**对**的, 不是漏扫。"},
        {"path": "docs/palantir-benchmark.md", "kind": "载体",
         "why": "同上 —— `:80-81` 逐条写着步骤条的现状与两处改名。"},
        {"path": "docs/ARCHITECTURE-TOP-LEVEL.md", "kind": "误报",
         "why": "「时序存储」「规则引擎」在这份顶层架构里是**通用工程词**"
                "（「吸收为时序存储件」「规则引擎/通道」）, 不是步骤清单。"
                "≥2 这条线把它算了进来 —— **这条线有假阳性的一面**, 见下。"},
        {"path": "graphify-out/GRAPH_REPORT.md", "kind": "误报",
         "why": "codegraph 生成的图报告, 格名全部来自**代码符号描述**"
                "（RulesEngine 的 docstring 等）。它连代码都是生成的, 更不该进提交。"},
    ],
    "carriers_outside_git_domain_why":
        "★ 这四个说明 `_is_carrier` 那条「≥2 个格名」的线**两个方向都不干净**: "
        "窄的一面（只抄一个格名的载体扫不到）已写在内核 docstring 里; 这里是宽的"
        "那一面 —— **通用工程词撞格名会造成假阳性**（「规则引擎」「时序存储」在"
        "工业软件里就是普通词）。当下无害: 四个都在域外。**但它是潜在的雷**: 谁把"
        "docs/ 或 graphify-out/ 从 .gitignore 里放出来, 上面那条判据会当场红在"
        "两个**误报**上 —— 那时要调的是 `_is_carrier` 的判别线（比如要求格名与"
        "上下文词共现）, 不是把误报补进 carriers。判据里那条断言就是为了让这一刻"
        "**自己亮**, 而不是等人去猜为什么红。",
}

# ── FDE_STEPS 里哪些键**发给下游**、哪些是**判据自己的账** ────────────
# 两集互补且不相交 —— 判据 `test_every_fact_source_key_is_classified_as_view_or_internal`
# 断言二者之并 == FDE_STEPS 的全部键。新加一个键而没归类 ⇒ 当场红,
# 而不是**悄悄**多返回一个内部字段、或少画一张卡。
FDE_STEP_VIEWS = ("benchmark", "edge", "bar", "accelerator")
FDE_STEP_INTERNAL = (
    "carriers",                        # 步骤名的载体清单（判据扫描的比对基准）
    "name_only_carriers",              # 只带方法名、不带格名的坐标
    "name_only_carriers_why",
    "carriers_outside_git_domain",     # 拷贝了格名但进不了提交的
    "carriers_outside_git_domain_why",
)

# 已退役的旧步骤名 —— 先后面与 API 里**不许再出现**（判据扫页面全文, 注释也算）。
#
# ⚠️ 旧名不删、只标: 记在这里是为了让**下一次漂回来**能被逮住, 而不是靠人记得。
# 为什么单列一个常量而不塞进 FDE_STEPS: FDE_STEPS 是 GET /api/fde/steps 的返回体,
# 那是给下游读的**视图对应关系**; 退役名单是判据的输入, 两件事不同一个域。
#
# 实测的第五处（2026-09-20）: 判据的判别域原先是 4 个**具体位置**（步骤条 /
# 卡片标题 / 回显行 / 说明段）, 而旧名还活在别处 —— 第 5 处是**用户可见的一句
# 提示**: `'请先完成 Step 2 本体编译'`, 同页卡片标题却写「本体语义建模」。
# 判据的域选得比意图窄时, 报「全绿」和「真的全绿」长得一模一样。
FDE_RETIRED_NAMES = ("本体编译", "协议发现")


@router.get("/steps")
async def fde_steps():
    """FDE 六步的**唯一事实源**出口 —— 四个视图 + 逐步对应关系。

    ⚠️ 这里返回的是**四个不同对象**的并排, 不是一个「正确的六步」加三个错的。
    引用前先读每项的 label 与 maps_to_benchmark:
      · `edge` 的「推送中枢」在 maps_to_benchmark 里是 **None** —— 基准里没有对应物。
      · `bar` 的 implemented_by_wizard 第 4 位是 **False** —— 步骤条上那一格
        （时序存储）向导不实现, 点开只有说明卡。**格数 6 ≠ 向导做了 6 步。**
      · `accelerator` 有 position 字段 —— 它**不在步骤条里**。
    别把 None 读成「缺失」—— 它是「此处确实没有对应物」, 与「忘了写」是两回事。

    ★ **只返回 FDE_STEP_VIEWS 里的键**, 不 `return FDE_STEPS`。
      2026-09-20 本文件 `:170-171` 刚写下「FDE_STEPS 是 `/api/fde/steps` 的返回体,
      所以判据的输入另立常量」—— 然后同一轮就把五个**判据自用的账**
      （载体清单 / 域外载体 / 方法名载体）塞进了 FDE_STEPS, 于是它们**当场进了
      返回体**: `docs/`（`.gitignore` 注释写着 `# Sensitive`）下的文件名与内部
      坐标就这样挂到了一个对外端点上。纪律写下来不等于有执行者, 这一条就是那个
      执行者: 返回体由白名单决定, 白名单的完备性由
      `test_every_fact_source_key_is_classified_as_view_or_internal` 管。
    """
    # 白名单缺项不许静默 —— 少返回一个视图, 页面那边只会少画一张卡, 不报错。
    missing = [k for k in FDE_STEP_VIEWS if k not in FDE_STEPS]
    assert not missing, f"事实源里少了视图 {missing} —— 白名单比 FDE_STEPS 宽"
    return {k: FDE_STEPS[k] for k in FDE_STEP_VIEWS}


# ═══════════════════════════════════════════
# Step 1: 物模型向导
# ═══════════════════════════════════════════

class ProductWizardRequest(BaseModel):
    name: str = Field(..., description="产品名称")
    devType: str = Field(..., description="设备类型标识")
    category: str = Field("energy", description="分类: energy/meter/sensor/industrial")
    protocol: str = Field("modbus_tcp", description="协议")
    points: List[Dict] = Field(default_factory=list, description="测点列表")


@router.post("/wizard/product")
async def fde_wizard_product(body: ProductWizardRequest):
    """Step 1: 物模型向导 — 一键创建产品+物模型

    输入: 产品名称 + 设备类型 + 测点列表
    输出: 产品定义 JSON + 物模型 TSL
    """
    from ..models.thing_model import THING_MODEL

    # 构建物模型
    points_def = {}
    for pt in body.points:
        pid = pt.get("point_id", pt.get("name", ""))
        points_def[pid] = {
            "name": pt.get("name", pid),
            "unit": pt.get("unit", ""),
            "type": pt.get("data_type", "float32"),
            "category": pt.get("category", "electrical"),
            "min": pt.get("min_val", 0),
            "max": pt.get("max_val", 9999),
            "register_addr": pt.get("register_addr", ""),
            "alarm_low": pt.get("alarm_low"),
            "alarm_high": pt.get("alarm_high"),
        }

    model = {
        "product_name": body.name,
        "points": points_def,
    }
    # 注册到 THING_MODEL
    THING_MODEL[body.devType] = model

    # 生成 TSL
    tsl = {
        "schema": "TSL/v1",
        "product": body.devType,
        "label": body.name,
        "protocol": body.protocol,
        "category": body.category,
        "properties": [
            {"identifier": k, "name": v["name"], "dataType": v["type"],
             "unit": v["unit"], "min": v["min"], "max": v["max"],
             "alarm_low": v.get("alarm_low"), "alarm_high": v.get("alarm_high"),
             "register_addr": v.get("register_addr", "")}
            for k, v in points_def.items()
        ],
    }

    return {"status": "created", "devType": body.devType, "point_count": len(points_def), "tsl": tsl}


# ═══════════════════════════════════════════
# Step 2: 本体语义建模 (物模型 → 本体)
# ═══════════════════════════════════════════

class CompileOntologyRequest(BaseModel):
    devType: str = Field(..., description="产品类型")
    site_id: str = Field("default", description="站点ID")
    gateway_id: str = Field("gw_default", description="网关ID")
    channel_id: str = Field("ch_default", description="通道ID")


@router.post("/wizard/compile")
async def fde_wizard_compile(body: CompileOntologyRequest):
    """Step 2&5: 物模型 → 本体自动编译

    从物模型自动生成: Site/Gateway/Channel/Device/Point/Constraint 实体
    """
    from ..models.thing_model import get_product_model
    from ..ontology import OntologyEngine, Site, Gateway, Channel, Device, Point, Constraint

    model = get_product_model(body.devType)
    if not model:
        raise HTTPException(404, f"产品类型 {body.devType} 未找到")

    engine = OntologyEngine()

    # Site
    engine.register(Site(id=body.site_id, name="默认站点", type="industrial"))

    # Gateway
    engine.register(Gateway(id=body.gateway_id, ip="127.0.0.1", site=body.site_id,
                            hostname="edge-gw-01", status="online"))

    # Channel
    engine.register(Channel(id=body.channel_id, gateway=body.gateway_id,
                            name=f"{body.devType} 通道", protocol="modbus_tcp",
                            endpoint="127.0.0.1:502", status="running"))

    # Device
    device_id = f"dev_{body.devType}_001"
    engine.register(Device(id=device_id, channel=body.channel_id,
                           name=model.get("product_name", body.devType),
                           type=body.devType, protocol="modbus_tcp", status="online"))

    # Points + Constraints
    points = model.get("points", {})
    for pid, pt_def in points.items():
        pt_id = f"pt_{body.devType}_{pid}"
        alarm = {}
        if pt_def.get("alarm_high"):
            alarm["high"] = pt_def["alarm_high"]
        if pt_def.get("alarm_low"):
            alarm["low"] = pt_def["alarm_low"]
        engine.register(Point(id=pt_id, device=device_id, name=pt_def.get("name", pid),
                              unit=pt_def.get("unit", ""), category=pt_def.get("category", "遥测"),
                              register={"address": pt_def.get("register_addr", "0"), "type": pt_def.get("type", "float32")},
                              alarm=alarm))

    # 自动生成约束规则
    for pid, pt_def in points.items():
        if pt_def.get("alarm_high") or pt_def.get("alarm_low"):
            cid = f"c_{body.devType}_{pid}"
            rule_parts = []
            if pt_def.get("alarm_high"):
                rule_parts.append(f"{pt_def['name']} > {pt_def['alarm_high']}")
            if pt_def.get("alarm_low"):
                rule_parts.append(f"{pt_def['name']} < {pt_def['alarm_low']}")
            engine.register(Constraint(
                id=cid, name=f"{pt_def['name']} 阈值告警",
                rule=" OR ".join(rule_parts) + " → alarm",
                entity=f"pt_{body.devType}_{pid}",
                severity="warning",
                source="物模型自动生成",
                action=f"触发 {pt_def['name']} 告警通知",
            ))

    counts = engine.health()["counts"]
    return {
        "status": "compiled",
        "devType": body.devType,
        "ontology": counts,
        "entities": {
            "site": body.site_id,
            "gateway": body.gateway_id,
            "channel": body.channel_id,
            "device": device_id,
            "points": [f"pt_{body.devType}_{pid}" for pid in points],
            "constraints": [f"c_{body.devType}_{pid}" for pid in points if points[pid].get("alarm_high") or points[pid].get("alarm_low")],
        },
    }


# ═══════════════════════════════════════════
# Step 3: 协议自动发现
# ═══════════════════════════════════════════

class ScanRequest(BaseModel):
    host: str = Field("127.0.0.1", description="目标IP")
    port: int = Field(502, description="端口")
    start_addr: int = Field(1, ge=1, le=247, description="起始从站地址")
    end_addr: int = Field(10, ge=1, le=247, description="结束从站地址")
    scan_points: bool = Field(True, description="是否扫描点位")


@router.post("/wizard/scan")
async def fde_wizard_scan(body: ScanRequest):
    """Step 3: 协议自动发现 — Modbus 网络扫描 + 点位发现

    扫描指定 IP 的 Modbus 从站，发现活跃设备 + 可读取的寄存器点位。
    """
    import socket, struct

    results = {"host": body.host, "port": body.port, "slaves": [], "error": None}

    for slave_id in range(body.start_addr, body.end_addr + 1):
        slave_info = {"slave_id": slave_id, "active": False, "registers": []}
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1.0)
            sock.connect((body.host, body.port))

            # Modbus TCP: 读保持寄存器 (FC3)
            mbap = struct.pack(">HHHB", 0, 0, 6, slave_id)
            pdu = struct.pack(">BHH", 3, 0, 1)  # FC3, addr=0, count=1
            sock.sendall(mbap + pdu)
            resp = sock.recv(1024)
            if len(resp) >= 9 and resp[7] == 3:  # FC3 response
                slave_info["active"] = True
                if body.scan_points:
                    # 扫描前 30 个寄存器
                    for addr in range(0, 30, 2):
                        try:
                            sock2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                            sock2.settimeout(0.3)
                            sock2.connect((body.host, body.port))
                            mbap2 = struct.pack(">HHHB", 0, 0, 6, slave_id)
                            pdu2 = struct.pack(">BHH", 3, addr, 2)
                            sock2.sendall(mbap2 + pdu2)
                            resp2 = sock2.recv(1024)
                            if len(resp2) >= 9:
                                val = struct.unpack(">HH", resp2[9:13])
                                slave_info["registers"].append({
                                    "address": addr,
                                    "value": val[0],
                                    "hex": f"0x{val[0]:04X}",
                                })
                            sock2.close()
                        except:
                            break
            sock.close()
        except Exception as e:
            if slave_info["active"]:
                slave_info["error"] = str(e)[:100]
        results["slaves"].append(slave_info)

    active = [s for s in results["slaves"] if s["active"]]
    results["summary"] = f"发现 {len(active)} 个活跃从站"
    return results


# ═══════════════════════════════════════════
# Step 6: 驾驶舱一键生成（基准位次 —— 见上方 FDE_STEPS）
# ═══════════════════════════════════════════

class DashboardGenRequest(BaseModel):
    devType: str = Field(..., description="产品类型")
    device_id: str = Field("", description="设备ID (可选)")


@router.post("/wizard/dashboard")
async def fde_wizard_dashboard(body: DashboardGenRequest):
    """Step 6: 驾驶舱一键生成

    根据物模型自动生成 Dashboard JSON 配置:
      - KPI 卡片 (分类聚合)
      - 趋势图 (electrical/temperature 类测点)
      - 状态表 (status 类测点)
      - 告警面板
    """
    from ..models.thing_model import get_product_model
    model = get_product_model(body.devType)
    if not model:
        raise HTTPException(404, f"产品类型 {body.devType} 未找到")

    points = model.get("points", {})
    cards = []
    trend_points = []
    status_points = []
    alarm_points = []

    for pid, pt in points.items():
        cat = pt.get("category", "electrical")
        if cat in ("electrical", "battery"):
            trend_points.append({"id": pid, "name": pt["name"], "unit": pt.get("unit", ""), "color": "#4fc3f7"})
        elif cat in ("temperature", "environment"):
            trend_points.append({"id": pid, "name": pt["name"], "unit": pt.get("unit", ""), "color": "#ffa726"})
        elif cat == "status":
            status_points.append({"id": pid, "name": pt["name"], "unit": pt.get("unit", "")})
        if pt.get("alarm_high") or pt.get("alarm_low"):
            alarm_points.append({"id": pid, "name": pt["name"], "high": pt.get("alarm_high"), "low": pt.get("alarm_low")})

    # KPI 卡片
    kpi_groups = {}
    for pid, pt in points.items():
        cat = pt.get("category", "electrical")
        kpi_groups[cat] = kpi_groups.get(cat, 0) + 1
    for cat, cnt in kpi_groups.items():
        cat_names = {"electrical": "电气参数", "battery": "电池状态", "temperature": "温度",
                     "energy": "电量", "status": "运行状态", "environment": "环境"}
        cards.append({"label": cat_names.get(cat, cat), "value": cnt, "unit": "测点",
                      "color": {"electrical": "#4fc3f7", "battery": "#66bb6a", "temperature": "#ffa726",
                                "energy": "#ffc107", "status": "#ab47bc"}.get(cat, "#c0d5e8")})

    dashboard = {
        "product": body.devType,
        "product_name": model.get("product_name", body.devType),
        "device_id": body.device_id,
        "cards": cards,
        "trend_chart": {
            "title": "实时趋势",
            "points": trend_points[:6],
            "refresh_seconds": 5,
        },
        "status_panel": {
            "title": "运行状态",
            "points": status_points,
        },
        "alarm_panel": {
            "title": "告警阈值",
            "points": alarm_points,
        },
    }
    return {"status": "generated", "dashboard": dashboard}


# ═══════════════════════════════════════════
# AI Agent 加速器 (NL → 全量配置) —— 横跨全部步骤, 不是其中一步
# ═══════════════════════════════════════════

class AgentGenRequest(BaseModel):
    description: str = Field(..., description="自然语言描述: '我需要监控一台光伏逆变器，采集功率电压电流，超过5000W告警'")


@router.post("/wizard/agent")
async def fde_wizard_agent(body: AgentGenRequest):
    """AI Agent 加速器 — NL 描述 → 自动配置全流程

    解析自然语言 → 推断设备类型/测点/告警规则 → 一次做完 Step 1/2 并给出 Step 6。

    ⚠️ 它**不是第六步, 也不在步骤条里**。原先这里写「Step 6: Agent 自动生成」,
    而同一个文件里 `fde_wizard_dashboard` 也自称 Step 6 —— 两个不同的东西共用
    一个编号, 而 FDE_STEPS['benchmark'] 的第 6 位只有一个东西。页面自己那句
    「AI 自动完成全部 6 步配置」就是这个意思: 若它是第 6 步, 「全部 6 步」就
    包含它自己。
    2026-09-20 页面上它已**移出步骤条**、独立成条（见 FDE_STEPS['accelerator']
    的 position 字段）; 返回键仍是基准位次那五个, 一个没变。
    """
    desc = body.description.lower()

    # 关键词匹配推断
    device_type = "inverter"
    if any(w in desc for w in ["储能", "pcs", "电池"]):
        device_type = "pcs"
    elif any(w in desc for w in ["充电桩", "charger", "充电"]):
        device_type = "charger"
    elif any(w in desc for w in ["变压器", "箱变"]):
        device_type = "box_transformer"
    elif any(w in desc for w in ["电表", "meter", "计量"]):
        device_type = "meter"

    # 推断测点
    points = []
    if any(w in desc for w in ["功率"]):
        points.append({"name": "有功功率", "unit": "W", "category": "electrical", "data_type": "float32", "register_addr": "0"})
    if any(w in desc for w in ["电压"]):
        points.append({"name": "A相电压", "unit": "V", "category": "electrical", "data_type": "float32", "register_addr": "2"})
    if any(w in desc for w in ["电流"]):
        points.append({"name": "A相电流", "unit": "A", "category": "electrical", "data_type": "float32", "register_addr": "4"})
    if any(w in desc for w in ["温度"]):
        points.append({"name": "温度", "unit": "°C", "category": "temperature", "data_type": "float32", "register_addr": "6"})
    if any(w in desc for w in ["频率"]):
        points.append({"name": "频率", "unit": "Hz", "category": "electrical", "data_type": "float32", "register_addr": "8"})

    # 推断告警阈值
    for pt in points:
        if pt["name"] == "有功功率" and any(w in desc for w in ["5000", "5kw"]):
            pt["alarm_high"] = 5000
        if pt["name"] == "A相电压":
            pt["alarm_high"] = 260
            pt["alarm_low"] = 200
        if pt["name"] == "温度":
            pt["alarm_high"] = 80

    if not points:
        points = [
            {"name": "有功功率", "unit": "W", "category": "electrical", "data_type": "float32", "register_addr": "0"},
            {"name": "A相电压", "unit": "V", "category": "electrical", "data_type": "float32", "register_addr": "2"},
            {"name": "A相电流", "unit": "A", "category": "electrical", "data_type": "float32", "register_addr": "4"},
        ]

    # 执行全流程
    from ..models.thing_model import THING_MODEL
    devType = device_type

    # Step 1: 物模型
    pts_for_model = []
    for i, pt in enumerate(points):
        pts_for_model.append({
            "point_id": f"{devType}_{pt['name'].replace(' ','_')}",
            "name": pt["name"], "unit": pt["unit"],
            "data_type": pt.get("data_type", "float32"),
            "category": pt["category"],
            "register_addr": pt.get("register_addr", str(i * 2)),
            "min_val": 0, "max_val": 9999,
            "alarm_low": pt.get("alarm_low"),
            "alarm_high": pt.get("alarm_high"),
        })

    product_name = {"inverter": "光伏逆变器", "pcs": "储能PCS", "charger": "充电桩",
                    "meter": "智能电表", "box_transformer": "箱变"}.get(devType, devType)

    model = {
        "product_name": product_name,
        "points": {p["point_id"]: {
            "name": p["name"], "unit": p["unit"],
            "type": p["data_type"], "category": p["category"],
            "min": p["min_val"], "max": p["max_val"],
            "register_addr": p["register_addr"],
            "alarm_low": p.get("alarm_low"), "alarm_high": p.get("alarm_high"),
        } for p in pts_for_model}
    }
    THING_MODEL[devType] = model

    # Step 2: 编译本体
    from ..ontology import OntologyEngine, Site, Gateway, Channel, Device, Point, Constraint
    engine = OntologyEngine()
    engine.register(Site(id="fde_site", name="FDE自动站点", type="industrial"))
    engine.register(Gateway(id="fde_gw", ip="127.0.0.1", site="fde_site", hostname="fde-edge", status="online"))
    engine.register(Channel(id="fde_ch", gateway="fde_gw", name=f"{product_name}通道", protocol="modbus_tcp", endpoint="127.0.0.1:502", status="running"))
    device_id = f"fde_{devType}_001"
    engine.register(Device(id=device_id, channel="fde_ch", name=product_name, type=devType, protocol="modbus_tcp", status="online"))

    for p in pts_for_model:
        pt_id = p["point_id"]
        alarm = {}
        if p.get("alarm_high"): alarm["high"] = p["alarm_high"]
        if p.get("alarm_low"): alarm["low"] = p["alarm_low"]
        engine.register(Point(id=pt_id, device=device_id, name=p["name"], unit=p["unit"],
                              category=p["category"], alarm=alarm))
        if alarm:
            engine.register(Constraint(id=f"c_{pt_id}", name=f"{p['name']}告警",
                                       rule=f"{p['name']}超阈值 → 告警", entity=pt_id,
                                       severity="warning", source="FDE Agent", action=f"推送{p['name']}告警"))

    # Step 6: 驾驶舱
    dashboard = {
        "product": devType, "product_name": product_name, "device_id": device_id,
        "cards": [{"label": "电气参数", "value": len(points), "unit": "测点", "color": "#4fc3f7"}],
        "trend_chart": {"points": [{"id": p["point_id"], "name": p["name"], "unit": p["unit"]} for p in pts_for_model]},
    }

    return {
        "description": body.description,
        "inferred": {"device_type": devType, "product_name": product_name, "points": len(points)},
        # 键里的编号是 **benchmark 位次**（FDE_STEPS['benchmark']）, 不是向导的点击
        # 顺序 —— 这两套只在前三步重合。原先 `step4_dashboard` 用的是向导顺序的位次、
        # 而 `step5_rules` 用的是基准位次, 于是一行里混着两套编号, 页面的回显行
        # 只能写成 `Step4: ${d.step5_rules...}` 才读得通。
        # 第 4 位（时序存储）**没有键** —— 向导不覆盖它, 那是事实不是遗漏。
        "step1_product": {"devType": devType, "point_count": len(pts_for_model)},
        "step2_ontology": engine.health()["counts"],
        "step3_scan_hint": f"python -m src.protocols.modbus_scanner {body.description.split('，')[0] if '，' in body.description else '127.0.0.1'}",
        "step5_rules": [f"c_{p['point_id']}" for p in pts_for_model if p.get("alarm_high") or p.get("alarm_low")],
        "step6_dashboard": dashboard,
        # 部署提示**不是一步** —— 不带 stepN 前缀, 免得又多出一个第六步。
        "deploy_hint": f"python run.py → http://localhost:8000/#/dashboard",
    }
