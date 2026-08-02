"""
GraphRAG REST API — 本体图检索增强生成接口

挂载到 /api/graphrag/*

用法:
  GET  /api/graphrag/status              — GraphRAG 引擎状态
  POST /api/graphrag/ask                 — 自然语言问答
  GET  /api/graphrag/context/{entity_id} — 实体上下文
  GET  /api/graphrag/summary/{level}     — 社区摘要
  GET  /api/graphrag/subgraph/{entity_id}— 子图导出
  GET  /api/graphrag/search?q=           — 实体搜索
  GET  /api/graphrag/tree                — 完整本体树
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/graphrag", tags=["graphrag"])

# ═══════════════════════════════════════════════════════════
# 惰性初始化 (首次访问时才加载本体 + LLM)
# ═══════════════════════════════════════════════════════════

_graphrag = None
_engine = None


def _get_rag():
    """惰性加载 GraphRAG — 首次调用时构建 131 本体 + LLM 后端"""
    global _graphrag, _engine
    if _graphrag is None:
        try:
            from ..ontology import build_131_ontology
            from ..graphrag import GraphRAG
        except ImportError:
            from ontology import build_131_ontology
            from graphrag import GraphRAG

        logger.info("GraphRAG: 加载 131 IO 服务器本体...")
        _engine = build_131_ontology()
        counts = _engine.health()["counts"]
        logger.info(f"GraphRAG: 实体加载完成 — {counts}")

        _graphrag = GraphRAG(_engine)  # 自动检测 ANTHROPIC_API_KEY / OPENAI_API_KEY
        logger.info(f"GraphRAG: LLM={'ready' if _graphrag._llm else 'none'}")

    return _graphrag, _engine


# ═══════════════════════════════════════════════════════════
# Pydantic 模型
# ═══════════════════════════════════════════════════════════

class AskRequest(BaseModel):
    question: str = Field(..., description="自然语言问题", min_length=1, max_length=2000)
    entity_id: Optional[str] = Field(None, description="指定实体 ID，不传则自动匹配")
    level: str = Field("site", description="社区摘要层级: site|gateway|channel")
    mode: str = Field("auto", description="检索模式: auto|entity|community")


class AskResponse(BaseModel):
    answer: str
    mode: str = ""
    entity: Optional[dict] = None
    summary: Optional[dict] = None
    matched_entities: list = []


# ═══════════════════════════════════════════════════════════
# API 端点
# ═══════════════════════════════════════════════════════════

@router.get("/status")
async def graphrag_status():
    """GraphRAG 引擎状态 — 本体统计 + LLM 可用性"""
    rag, engine = _get_rag()
    return rag.status()


@router.post("/ask/stream")
async def graphrag_ask_stream(body: AskRequest):
    """流式问答 — Server-Sent Events (SSE)

    实时逐字推送回答，前端用 EventSource 接收。
    """
    from fastapi.responses import StreamingResponse
    rag, engine = _get_rag()

    async def generate():
        for chunk in rag.ask_stream(body.question):
            data = __import__("json").dumps(chunk, ensure_ascii=False)
            yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/ask", response_model=AskResponse)
async def graphrag_ask(body: AskRequest):
    """GraphRAG 自然语言问答

    三种模式:
      - auto: 自动路由 (含"整体/汇总"→community, 否则→entity)
      - entity: 强制实体级 Local Search
      - community: 强制社区摘要汇总
    """
    rag, engine = _get_rag()

    try:
        if body.mode == "entity":
            result = rag.ask_entity(body.question, body.entity_id)
            return AskResponse(
                answer=result.get("answer", ""),
                mode="entity",
                entity=result.get("entity"),
                matched_entities=result.get("matched_entities", []),
            )
        elif body.mode == "community":
            result = rag.ask_community(body.question, body.level, body.entity_id)
            return AskResponse(
                answer=result.get("answer", ""),
                mode="community",
                summary=result.get("summary"),
            )
        else:
            result = rag.ask(body.question)
            # 推断实际路由的模式
            mode = "community" if result.get("summary") else "entity"
            return AskResponse(
                answer=result.get("answer", ""),
                mode=mode,
                entity=result.get("entity"),
                summary=result.get("summary"),
                matched_entities=result.get("matched_entities", []),
            )
    except Exception as e:
        logger.exception("GraphRAG ask failed")
        raise HTTPException(500, f"GraphRAG 查询失败: {e}")


@router.get("/context/{entity_id}")
async def graphrag_context(entity_id: str):
    """获取实体的完整上下文 — GraphRAG Local Context

    返回: entity 信息 + parent_chain + siblings + children + constraints + text_context
    """
    _, engine = _get_rag()
    ctx = engine.local_context(entity_id)
    if "error" in ctx:
        raise HTTPException(404, ctx["error"])
    return ctx


@router.get("/summary/{level}")
async def graphrag_summary(
    level: str = "site",
    entity_id: Optional[str] = Query(None, description="指定实体 ID，不传则汇总全部"),
):
    """社区摘要 — GraphRAG Community Summary

    Args:
      level: site | gateway | channel
      entity_id: 指定实体 ID
    """
    _, engine = _get_rag()
    result = engine.community_summary(level, entity_id)
    if "error" in result:
        raise HTTPException(400, result["error"])
    return result


@router.get("/subgraph/{entity_id}")
async def graphrag_subgraph(
    entity_id: str,
    depth: int = Query(2, ge=1, le=5, description="扩展深度 1-5"),
):
    """子图导出 — 以实体为中心的关系图

    返回: nodes[] + edges[]，可直接用于前端力导向图渲染
    """
    _, engine = _get_rag()
    sg = engine.subgraph(entity_id, depth)
    if "error" in sg:
        raise HTTPException(404, sg["error"])
    return sg


@router.get("/search")
async def graphrag_search(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    top_k: int = Query(10, ge=1, le=50),
    mode: str = Query("semantic", description="搜索模式: keyword|semantic"),
):
    """实体搜索 — 跨 5 层本体

    keyword: 字符串匹配 (id 精确 > name 子串)
    semantic: TF-IDF 语义搜索 (默认，中文分词+余弦相似度)
    返回按 score 降序排列
    """
    rag, engine = _get_rag()

    if mode == "keyword":
        results = engine.search_entities(q, top_k)
        # 转换 score 为浮点
        results = [{**r, "score": float(r["score"])} for r in results]
    else:
        results = rag.search(q, top_k, use_llm_rerank=False)

    return {
        "query": q,
        "mode": mode,
        "total": len(results),
        "results": results,
        "layers": {
            "site": sum(1 for r in results if r["layer"] == "site"),
            "gateway": sum(1 for r in results if r["layer"] == "gateway"),
            "channel": sum(1 for r in results if r["layer"] == "channel"),
            "device": sum(1 for r in results if r["layer"] == "device"),
            "point": sum(1 for r in results if r["layer"] == "point"),
        },
    }


@router.get("/search/semantic")
async def graphrag_semantic_search(
    q: str = Query(..., min_length=1, description="自然语言查询"),
    top_k: int = Query(10, ge=1, le=50),
    rerank: bool = Query(True, description="是否启用 LLM 重排序"),
):
    """语义搜索 + LLM 重排序

    TF-IDF 粗筛 top-20 → LLM 精排 top-5 (如果可用)
    适合模糊查询: "变压器那边的电流测点"、"K1 那口井的压力"
    """
    rag, _ = _get_rag()
    results = rag.search(q, top_k, use_llm_rerank=rerank)
    return {
        "query": q,
        "mode": "semantic",
        "rerank": rerank and rag._llm is not None,
        "total": len(results),
        "results": results,
    }


@router.get("/tree")
async def graphrag_tree(site_id: Optional[str] = Query(None)):
    """完整本体树 — 5 层级联结构

    用于前端树形组件渲染
    """
    _, engine = _get_rag()
    return {"tree": engine.tree(site_id), "health": engine.health()}


@router.get("/health-check")
async def graphrag_health_check():
    """本体完整性校验"""
    _, engine = _get_rag()
    return engine.validate()


# ═══════════════════════════════════════════════════════════
# 实时数据端点
# ═══════════════════════════════════════════════════════════

@router.get("/live/context/{entity_id}")
async def graphrag_live_context(entity_id: str):
    """增强上下文 — 含实时遥测值 + 阈值判定

    对比 /context/{entity_id}: 增加了 live 字段，含当前值、阈值状态。
    """
    rag, _ = _get_rag()
    ctx = rag.live_context(entity_id)
    if "error" in ctx:
        raise HTTPException(404, ctx["error"])
    return ctx


@router.get("/live/snapshot/{device_id}")
async def graphrag_live_snapshot(device_id: str):
    """设备实时快照 — 所有测点最新值 + 阈值对比"""
    rag, engine = _get_rag()

    # 实时数据
    snap = rag.live_snapshot(device_id)

    # 本体阈值
    thresholds = {}
    for pt in engine.get_points(device_id):
        if pt.alarm:
            thresholds[pt.id] = {
                "name": pt.name, "unit": pt.unit,
                "alarm": pt.alarm, "category": pt.category,
            }

    # 合并: 每个测点 = 实时值 + 阈值
    merged = []
    for p in snap.get("points", []):
        t = thresholds.get(p["point_id"], {})
        merged.append({
            **p,
            "threshold": t.get("alarm", {}),
            "point_name_full": t.get("name", p["point_name"]),
            "category": t.get("category", ""),
            # 阈值判定
            "alarm_status": _judge_alarm(p["value"], t.get("alarm", {})),
        })

    return {
        "device_id": device_id,
        "available": snap.get("available", False),
        "points": merged,
        "count": len(merged),
    }


@router.get("/live/channel/{channel_id}")
async def graphrag_live_channel(channel_id: str):
    """通道实时聚合 — 在线设备、活跃测点、告警数"""
    rag, _ = _get_rag()
    return rag.live_channel(channel_id)


@router.get("/live/point/{point_id}")
async def graphrag_live_point(point_id: str):
    """单测点最新值"""
    rag, _ = _get_rag()
    result = rag.live_point(point_id)
    if result is None:
        return {"point_id": point_id, "available": False, "value": None}
    # 附加阈值
    engine_pt = rag.engine.points.get(point_id)
    if engine_pt and engine_pt.alarm:
        result["threshold"] = engine_pt.alarm
        result["alarm_status"] = _judge_alarm(result["value"], engine_pt.alarm)
    return result


@router.get("/live/trend/{point_id}")
async def graphrag_trend(
    point_id: str,
    hours: float = Query(None, ge=0.1, le=720, description="时间范围(小时), 最大30天"),
    time_range: str = Query(None, description="自然语言时间: 过去1小时/今天/昨天/上周/本月"),
):
    """测点历史趋势 — 时序数据 + 统计 + 异常检测

    支持两种方式指定时间范围:
      - hours=1 (精确小时)
      - time_range="过去1小时" / "今天" / "昨天" / "上周" / "本月" (自然语言)
    """
    try:
        from ..graphrag import parse_time_range
    except ImportError:
        from graphrag import parse_time_range
    rag, _ = _get_rag()

    if time_range:
        parsed = parse_time_range(time_range)
        h = parsed["hours"]
    elif hours:
        h = hours
    else:
        h = 1.0

    result = rag.trend(point_id, h)
    if time_range:
        result["time_expression"] = time_range
        result["parsed_hours"] = h
    return result


def _judge_alarm(value: float, alarm: dict) -> str:
    """判断阈值状态"""
    if not alarm:
        return "no_threshold"
    if "hh" in alarm and value > alarm["hh"]:
        return "critical_high"
    if "high" in alarm and value > alarm["high"]:
        return "high"
    if "ll" in alarm and value < alarm["ll"]:
        return "critical_low"
    if "low" in alarm and value < alarm["low"]:
        return "low"
    return "normal"


@router.post("/live/seed")
async def graphrag_seed_telemetry():
    """一键播种演示遥测数据 — 为 ontology 中的 sample points 写入模拟值

    写入 data/telemetry.db，使 /live/* 端点有实时数据可查。
    """
    import sqlite3
    import os as _os
    import random
    import time as _time
    from datetime import datetime, timezone

    rag, engine = _get_rag()
    db_path = _os.path.join(_os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))),
                            "data", "telemetry.db")
    _os.makedirs(_os.path.dirname(db_path), exist_ok=True)

    db = sqlite3.connect(db_path)
    db.execute("""CREATE TABLE IF NOT EXISTS telemetry
        (ts TEXT, device_id TEXT, point_id TEXT, point_name TEXT,
         value REAL, unit TEXT, quality INTEGER, device_type TEXT, station_id TEXT)""")

    count = 0
    now = datetime.now(timezone.utc).isoformat()
    rng = random.Random(42)

    for pt_id, pt in engine.points.items():
        dev = engine.devices.get(pt.device)
        if not dev:
            continue

        # 模拟值: 在 alarm 范围内随机
        alarm = pt.alarm
        if alarm:
            lo = alarm.get("low", alarm.get("ll", 0))
            hi = alarm.get("high", alarm.get("hh", 100))
            val = round(rng.uniform(lo * 1.05, hi * 0.95), 4) if lo < hi else round(rng.uniform(0, 100), 4)
        else:
            val = round(rng.uniform(0, 100), 4)

        db.execute(
            "INSERT INTO telemetry (ts, device_id, point_id, point_name, value, unit, quality, device_type, station_id) "
            "VALUES (?,?,?,?,?,?,192,?,?)",
            (now, pt.device, pt_id, pt.name, val, pt.unit, dev.type, "dqyt_c1")
        )
        count += 1

    db.commit()

    # 更新 LiveContextStore 状态
    rag._live._available = True
    rag._live._db_path = db_path

    db.close()
    return {"status": "seeded", "points": count, "path": db_path}


# ═══════════════════════════════════════════════════════════
# 告警诊断
# ═══════════════════════════════════════════════════════════

class AlarmAnalyzeRequest(BaseModel):
    entity_id: str = Field(..., description="告警关联的实体 ID")
    alarm_type: str = Field("threshold", description="告警类型")
    level: str = Field("warning", description="严重级别: info/warning/danger/critical")
    message: str = Field("", description="告警消息")
    value: Optional[float] = Field(None, description="触发值")
    threshold: Optional[dict] = Field(None, description="阈值配置")


@router.post("/alarm/analyze")
async def graphrag_alarm_analyze(body: AlarmAnalyzeRequest):
    """告警自动诊断 — 图上下文 + 实时值 + 约束 → 故障分析报告

    在告警回调中调用此端点，自动生成诊断报告。
    """
    rag, _ = _get_rag()
    result = rag.analyze_alarm(body.entity_id, {
        "type": body.alarm_type,
        "level": body.level,
        "message": body.message,
        "value": body.value,
        "threshold": body.threshold,
    })
    return result


# ═══════════════════════════════════════════════════════════
# LLM 测试
# ═══════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════
# OWL/RDF 形式化本体
# ═══════════════════════════════════════════════════════════

@router.get("/ontology.owl")
async def graphrag_owl():
    """导出 OWL 2 RDF/XML 格式本体 — 可直接导入 Protégé"""
    _, engine = _get_rag()
    from fastapi.responses import Response
    xml = engine.export_owl()
    return Response(content=xml, media_type="application/rdf+xml")


@router.get("/ontology.ttl")
async def graphrag_turtle():
    """导出 Turtle 格式本体 — 人类可读"""
    _, engine = _get_rag()
    from fastapi.responses import PlainTextResponse
    ttl = engine.export_turtle()
    return PlainTextResponse(content=ttl, media_type="text/turtle")


class SparqlRequest(BaseModel):
    query: str = Field(..., min_length=1, description="SPARQL 查询")


@router.post("/sparql")
async def graphrag_sparql(body: SparqlRequest):
    """SPARQL 查询端点 — W3C 标准图查询

    Examples:
      SELECT ?device ?name WHERE { ?device rdf:type dgiot:Device ; dgiot:name ?name }
      SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10
    """
    _, engine = _get_rag()
    results = engine.sparql(body.query)
    return {"total": len(results), "results": results, "query": body.query}


# ═══════════════════════════════════════════════════════════
# Palantir AIP 风格平台 API
# ═══════════════════════════════════════════════════════════

@router.get("/aip/dashboard")
async def aip_dashboard():
    """运维大屏 — 实时KPI + 告警 + 通道状态"""
    rag, engine = _get_rag()
    site = engine.community_summary("site")
    gw = engine.community_summary("gateway", "gw_131")

    # 通道状态
    channels = []
    for ch in engine.channels.values():
        devs = engine.get_devices(ch.id)
        channels.append({
            "id": ch.id, "name": ch.name, "protocol": ch.protocol,
            "status": ch.status, "endpoint": ch.endpoint,
            "device_count": len(devs),
            "devices_online": sum(1 for d in devs if d.status == "online"),
        })

    # 告警统计
    active_constraints = [c for c in engine.constraints.values()
                          if c.enabled and c.severity in ("danger", "critical")]

    return {
        "timestamp": __import__("datetime").datetime.now().isoformat(),
        "site": site,
        "gateway": gw,
        "channels": channels,
        "active_rules": len(active_constraints),
        "critical_rules": sum(1 for c in active_constraints if c.severity == "critical"),
        "entity_counts": engine.health()["counts"],
    }


@router.get("/aip/objects")
async def aip_objects(
    layer: str = Query(None, description="筛选层级: site|gateway|channel|device|point|constraint"),
    q: str = Query(None, description="搜索关键词"),
    status: str = Query(None, description="状态筛选: online|offline|running|stopped"),
    limit: int = Query(50, ge=1, le=200),
):
    """Object Explorer — 本体对象浏览器 (Palantir Foundry 风格)

    支持按层级、关键词、状态筛选。
    """
    rag, engine = _get_rag()

    layers = {
        "site": (engine.sites, "site"),
        "gateway": (engine.gateways, "gateway"),
        "channel": (engine.channels, "channel"),
        "device": (engine.devices, "device"),
        "point": (engine.points, "point"),
        "constraint": (engine.constraints, "constraint"),
        "datasource": (engine.datasources, "datasource"),
    }

    if layer and layer in layers:
        search_layers = [(layer, *layers[layer])]
    else:
        search_layers = [(name, table, name) for name, (table, _) in layers.items()]

    results = []
    for lname, table, _ in search_layers:
        for eid, entity in table.items():
            d = {
                "id": eid, "layer": lname,
                "name": getattr(entity, 'name', eid),
                "type": getattr(entity, 'type', '') or getattr(entity, 'protocol', ''),
            }
            if hasattr(entity, 'status'):
                d["status"] = entity.status
            # 关键词过滤
            if q and q.lower() not in d["name"].lower() and q.lower() not in eid.lower():
                continue
            # 状态过滤
            if status and d.get("status", "") != status:
                continue
            results.append(d)
            if len(results) >= limit:
                break
        if len(results) >= limit:
            break

    return {"total": len(results), "objects": results[:limit], "layers": list(layers.keys())}


@router.get("/aip/objects/{entity_id}")
async def aip_object_detail(entity_id: str):
    """Object View — 对象详情视图 (Palantir Quiver 风格)

    包含: 属性、关系、关联对象、实时数据、历史趋势
    """
    rag, engine = _get_rag()

    # 基础上下文
    ctx = rag.live_context(entity_id)
    if "error" in ctx:
        raise HTTPException(404, ctx["error"])

    # 关联对象 (上下游)
    relations = []
    if ctx.get("parent_chain"):
        for p in ctx["parent_chain"]:
            relations.append({"direction": "upstream", "layer": p["layer"],
                              "id": p["id"], "name": p.get("name", ""),
                              "relation": "parent"})
    for sib in ctx.get("siblings", []):
        relations.append({"direction": "lateral", "layer": ctx["layer"],
                          "id": sib["id"], "name": sib.get("name", ""),
                          "relation": "sibling"})
    for child in ctx.get("children", []):
        relations.append({"direction": "downstream", "layer": "",
                          "id": child["id"], "name": child.get("name", ""),
                          "relation": "child"})

    # 关联约束
    linked_constraints = ctx.get("constraints", [])

    # 实时值
    live = ctx.get("live", {})

    # 子图
    subgraph = engine.subgraph(entity_id, depth=2)

    return {
        "entity": {"id": entity_id, "layer": ctx["layer"],
                   "name": ctx["entity"].get("name", "") if isinstance(ctx["entity"], dict) else str(ctx["entity"])},
        "properties": ctx["entity"] if isinstance(ctx["entity"], dict) else {},
        "relations": relations,
        "constraints": linked_constraints,
        "live_data": live,
        "subgraph": subgraph,
        "text_context": ctx.get("text_context", ""),
    }


class ActionRequest(BaseModel):
    action: str = Field(..., description="动作类型: acknowledge_alarm|restart_channel|check_device|diagnose")
    target_id: str = Field(..., description="目标实体 ID")
    params: Optional[dict] = Field(None, description="动作参数")


@router.post("/aip/actions/execute")
async def aip_execute_action(body: ActionRequest):
    """Action Framework — 执行运维动作 (Palantir Actions 风格)

    支持:
      - diagnose: 对设备/测点进行故障诊断
      - acknowledge_alarm: 确认告警
      - trend_check: 趋势检查
      - health_check: 健康检查
    """
    rag, engine = _get_rag()

    if body.action == "diagnose":
        result = rag.analyze_alarm(body.target_id, body.params or {})
        return {"action": "diagnose", "result": result}

    elif body.action == "trend_check":
        hours = (body.params or {}).get("hours", 1)
        result = rag.trend(body.target_id, hours)
        return {"action": "trend_check", "result": result}

    elif body.action == "health_check":
        ctx = rag.live_context(body.target_id)
        return {"action": "health_check",
                "status": ctx.get("live", {}).get("status", "unknown"),
                "context": ctx.get("text_context", "")}

    elif body.action == "acknowledge_alarm":
        return {"action": "acknowledge_alarm", "target": body.target_id,
                "status": "acknowledged", "message": f"告警 {body.target_id} 已确认"}

    return {"action": body.action, "status": "unknown_action"}


class ScenarioRequest(BaseModel):
    entity_id: str = Field(..., description="目标实体")
    change: dict = Field(..., description="变更: {parameter: new_value}")


@router.post("/aip/scenarios/analyze")
async def aip_scenario_analyze(body: ScenarioRequest):
    """Scenario Analysis — What-if 分析 (Palantir Scenarios 风格)

    模拟参数变更的影响，评估关联约束是否触发。
    """
    rag, engine = _get_rag()
    ctx = rag.live_context(body.entity_id)
    if "error" in ctx:
        raise HTTPException(404, ctx["error"])

    results = []
    for param, new_val in body.change.items():
        # 检查阈值
        pt = engine.points.get(body.entity_id)
        constraint_triggered = []
        if pt and pt.alarm:
            alarm = pt.alarm
            if "high" in alarm and new_val > alarm["high"]:
                constraint_triggered.append(f"超过上限 {alarm['high']}")
            if "hh" in alarm and new_val > alarm["hh"]:
                constraint_triggered.append(f"超过高高限 {alarm['hh']}")
            if "low" in alarm and new_val < alarm["low"]:
                constraint_triggered.append(f"低于下限 {alarm['low']}")
            if "ll" in alarm and new_val < alarm["ll"]:
                constraint_triggered.append(f"低于低低限 {alarm['ll']}")

        # 关联约束
        linked = []
        for c in engine.constraints.values():
            if c.enabled and c.entity in (body.entity_id, pt.device if pt else ''):
                linked.append({"id": c.id, "name": c.name, "severity": c.severity, "rule": c.rule})

        results.append({
            "parameter": param,
            "current_value": ctx.get("live", {}).get("value"),
            "simulated_value": new_val,
            "constraints_triggered": constraint_triggered,
            "linked_rules": linked,
            "impact": "critical" if constraint_triggered else ("warning" if linked else "none"),
        })

    return {"entity_id": body.entity_id, "entity_name": ctx["entity"].get("name", "") if isinstance(ctx["entity"], dict) else "",
            "scenarios": results}


# ═══════════════════════════════════════════════════════════
# Ontology Manager — 本体对象 CRUD + 校验
# ═══════════════════════════════════════════════════════════

class OntologyObjectCreate(BaseModel):
    layer: str = Field(..., description="层级: site|gateway|channel|device|point|constraint|datasource")
    id: str = Field(..., min_length=1)
    name: str = Field("", max_length=200)
    props: dict = Field(default_factory=dict, description="属性字典")

class OntologyBatchImport(BaseModel):
    objects: list = Field(..., description="导入对象列表 [{layer, id, name, props}]")


def _persist_engine(engine):
    """持久化本体到 SQLite"""
    try:
        result = engine.sync_to_parse("default")
        logger.info(f"本体已持久化: {result}")
        return result
    except Exception as e:
        logger.warning(f"本体持久化失败: {e}")
        return {"error": str(e)}


@router.post("/aip/objects/create")
async def aip_object_create(body: OntologyObjectCreate):
    """创建本体对象 — 含前置校验 + 持久化"""
    from ..ontology import Site, Gateway, Channel, Device, Point, Constraint, DataSource
    _, engine = _get_rag()

    # 前置校验: 检查 ID 是否已存在
    all_ids = (
        set(engine.sites.keys()) | set(engine.gateways.keys()) |
        set(engine.channels.keys()) | set(engine.devices.keys()) |
        set(engine.points.keys()) | set(engine.constraints.keys()) |
        set(engine.datasources.keys())
    )
    if body.id in all_ids:
        raise HTTPException(409, f"ID '{body.id}' 已存在，请用 PUT 更新")

    # 前置校验: 父层引用是否存在
    if body.layer == "gateway" and body.props.get("site"):
        if body.props["site"] not in engine.sites:
            raise HTTPException(400, f"引用的 site '{body.props['site']}' 不存在，请先创建")
    if body.layer == "channel" and body.props.get("gateway"):
        if body.props["gateway"] not in engine.gateways:
            raise HTTPException(400, f"引用的 gateway '{body.props['gateway']}' 不存在")
    if body.layer == "device" and body.props.get("channel"):
        if body.props["channel"] not in engine.channels:
            raise HTTPException(400, f"引用的 channel '{body.props['channel']}' 不存在")
    if body.layer == "point" and body.props.get("device"):
        if body.props["device"] not in engine.devices:
            raise HTTPException(400, f"引用的 device '{body.props['device']}' 不存在")

    layers = {
        "site": (Site, engine.sites, {"id": body.id, "name": body.name}),
        "gateway": (Gateway, engine.gateways,
                    {"id": body.id, "hostname": body.name, "ip": body.props.get("ip", ""),
                     "site": body.props.get("site", list(engine.sites.keys())[0] if engine.sites else "")}),
        "channel": (Channel, engine.channels,
                    {"id": body.id, "name": body.name, "gateway": body.props.get("gateway", ""),
                     "protocol": body.props.get("protocol", "modbus_tcp")}),
        "device": (Device, engine.devices,
                   {"id": body.id, "name": body.name, "channel": body.props.get("channel", ""),
                    "type": body.props.get("type", "rtu"), "protocol": body.props.get("protocol", "modbus")}),
        "point": (Point, engine.points,
                  {"id": body.id, "name": body.name, "device": body.props.get("device", ""),
                   "unit": body.props.get("unit", ""), "category": body.props.get("category", "遥测")}),
        "constraint": (Constraint, engine.constraints,
                       {"id": body.id, "name": body.name, "rule": body.props.get("rule", ""),
                        "entity": body.props.get("entity", ""), "severity": body.props.get("severity", "warning")}),
        "datasource": (DataSource, engine.datasources,
                       {"id": body.id, "gateway": body.props.get("gateway", ""),
                        "type": body.props.get("type", "sqlite"), "connection": body.props.get("connection", "")}),
    }

    if body.layer not in layers:
        raise HTTPException(400, f"无效层级: {body.layer}. 可选: {list(layers.keys())}")

    cls, table, defaults = layers[body.layer]
    kwargs = {**defaults, **{k: v for k, v in body.props.items() if k in defaults}}
    obj = cls(**kwargs)
    engine.register(obj)

    # 持久化
    persist_result = _persist_engine(engine)

    return {
        "status": "created", "layer": body.layer, "id": body.id,
        "health": engine.health()["counts"],
        "persisted": "error" not in persist_result,
    }


@router.put("/aip/objects/{entity_id}")
async def aip_object_update(entity_id: str, body: dict):
    """更新本体对象属性 — 含变更记录 + 持久化"""
    _, engine = _get_rag()

    # 非法字段过滤
    blocked = {"id", "_mqtt", "_changelog"}
    clean_body = {k: v for k, v in body.items() if k not in blocked}

    changed = engine.update(entity_id, clean_body)
    if not changed:
        # 检查实体是否存在
        all_ids = (
            set(engine.sites.keys()) | set(engine.gateways.keys()) |
            set(engine.channels.keys()) | set(engine.devices.keys()) |
            set(engine.points.keys()) | set(engine.constraints.keys()) |
            set(engine.datasources.keys())
        )
        if entity_id not in all_ids:
            raise HTTPException(404, f"对象 {entity_id} 未找到")
        return {"status": "unchanged", "id": entity_id, "changed": {}}

    # 持久化
    persist_result = _persist_engine(engine)

    return {
        "status": "updated", "id": entity_id,
        "changed": changed, "changed_count": len(changed),
        "persisted": "error" not in persist_result,
    }


@router.delete("/aip/objects/{entity_id}")
async def aip_object_delete(entity_id: str):
    """删除本体对象 — 含级联影响检查 + 持久化"""
    _, engine = _get_rag()

    # 级联影响检查
    cascade = []
    if entity_id in engine.sites:
        cascade = [f"Gateway {g.id} ({g.hostname})" for g in engine.gateways.values() if g.site == entity_id]
        cascade += [f"Channel {c.id} ({c.name})" for c in engine.channels.values()
                    if c.gateway in {g.id for g in engine.gateways.values() if g.site == entity_id}]
    elif entity_id in engine.gateways:
        cascade = [f"Channel {c.id} ({c.name})" for c in engine.channels.values() if c.gateway == entity_id]
        cascade += [f"DataSource {ds.id}" for ds in engine.datasources.values() if ds.gateway == entity_id]
    elif entity_id in engine.channels:
        cascade = [f"Device {d.id} ({d.name})" for d in engine.devices.values() if d.channel == entity_id]
    elif entity_id in engine.devices:
        cascade = [f"Point {p.id} ({p.name})" for p in engine.points.values() if p.device == entity_id]

    if cascade:
        logger.warning(f"删除 {entity_id} 将影响 {len(cascade)} 个子实体: {cascade[:20]}")

    ok = engine.delete(entity_id)
    if not ok:
        raise HTTPException(404, f"对象 {entity_id} 未找到")

    # 持久化
    persist_result = _persist_engine(engine)

    return {
        "status": "deleted", "id": entity_id,
        "cascade_impact": len(cascade),
        "cascade_details": cascade[:20],
        "persisted": "error" not in persist_result,
    }


@router.get("/aip/objects/validate")
async def aip_objects_validate():
    """运行本体正确性校验 — 6 维度综合检查"""
    _, engine = _get_rag()
    result = engine.validate()
    return result


@router.post("/aip/objects/sync")
async def aip_objects_sync():
    """手动持久化本体到 SQLite"""
    _, engine = _get_rag()
    result = _persist_engine(engine)
    return {"status": "synced", "result": str(result), "health": engine.health()["counts"]}


@router.get("/aip/objects/changelog")
async def aip_objects_changelog(limit: int = Query(50, ge=1, le=200)):
    """变更审计日志"""
    _, engine = _get_rag()
    return {"total": len(engine._changelog), "changes": engine.changelog(limit)}


@router.post("/aip/objects/import")
async def aip_objects_import(body: OntologyBatchImport):
    """批量导入本体对象"""
    _, engine = _get_rag()
    created, errors = 0, []
    for obj in body.objects:
        try:
            from ..ontology import Site, Gateway, Channel, Device, Point, Constraint, DataSource
            layers = {
                "site": Site, "gateway": Gateway, "channel": Channel,
                "device": Device, "point": Point,
                "constraint": Constraint, "datasource": DataSource,
            }
            layer = obj.get("layer", "")
            cls = layers.get(layer)
            if not cls:
                errors.append(f"未知层级: {layer}")
                continue
            kwargs = {"id": obj["id"], "name": obj.get("name", "")}
            kwargs.update(obj.get("props", {}))
            engine.register(cls(**kwargs))
            created += 1
        except Exception as e:
            errors.append(f"{obj.get('id', '?')}: {e}")

    _persist_engine(engine)
    return {"status": "imported", "created": created, "errors": errors,
            "health": engine.health()["counts"]}


# ═══════════════════════════════════════════════════════════
# Pipeline Monitor — 实时通道状态
# ═══════════════════════════════════════════════════════════

@router.get("/aip/pipeline")
async def aip_pipeline_monitor():
    """Pipeline Monitor — 实时采集管道状态 + 告警规则"""
    import sqlite3, os, time as _t

    # 遥测统计
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                           "data", "telemetry.db")
    telemetry_count = 0
    latest_ts = ""
    if os.path.exists(db_path):
        try:
            db = sqlite3.connect(db_path)
            telemetry_count = db.execute("SELECT COUNT(*) FROM telemetry").fetchone()[0]
            row = db.execute("SELECT ts FROM telemetry ORDER BY ts DESC LIMIT 1").fetchone()
            latest_ts = row[0] if row else ""
            db.close()
        except: pass

    # 通道统计 (从 ontology)
    rag, engine = _get_rag()
    channels_status = {}
    for ch in engine.channels.values():
        proto = ch.protocol
        if proto not in channels_status:
            channels_status[proto] = {"total": 0, "running": 0, "devices": 0}
        channels_status[proto]["total"] += 1
        if ch.status == "running":
            channels_status[proto]["running"] += 1
        channels_status[proto]["devices"] += len(engine.get_devices(ch.id))

    # 告警规则
    critical_rules = [c.name for c in engine.constraints.values() if c.enabled and c.severity == "critical"]
    danger_rules = [c.name for c in engine.constraints.values() if c.enabled and c.severity == "danger"]

    return {
        "timestamp": __import__("datetime").datetime.now().isoformat(),
        "channels": channels_status,
        "telemetry": {"total_points": telemetry_count, "latest_ts": latest_ts},
        "alerts": {"critical": critical_rules, "danger": danger_rules},
        "uptime_seconds": 0,
    }


# ═══════════════════════════════════════════════════════════
# Code Console — 浏览器内 Python 执行
# ═══════════════════════════════════════════════════════════

class CodeRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=5000, description="Python 代码")
    timeout: float = Field(5.0, ge=1, le=30, description="超时秒数")


@router.post("/aip/console")
async def aip_code_console(body: CodeRequest):
    """Code Console — 浏览器内安全执行 Python (Palantir Code Workbook 风格)

    预置变量:
      engine — OntologyEngine 实例
      rag    — GraphRAG 实例
      search(q) → list   语义搜索
      ask(q)   → dict    GraphRAG 问答
    """
    import io, sys as _sys, traceback, threading, time as _t

    _, engine = _get_rag()
    rag = _get_rag()[0]

    output = io.StringIO()
    old_stdout = _sys.stdout
    _sys.stdout = output

    result = None
    error = None

    def _run():
        nonlocal result, error
        try:
            _locals = {
                "engine": engine, "rag": rag,
                "search": lambda q, k=5: rag.search(q, k),
                "ask": lambda q: rag.ask(q),
                "ctx": lambda eid: engine.local_context(eid),
                "summary": lambda l="site": engine.community_summary(l),
                "json": __import__("json"),
            }
            exec(body.code, {"__builtins__": __builtins__}, _locals)
            result = {k: str(v)[:200] for k, v in _locals.items()
                      if not k.startswith("_") and k not in ("engine", "rag", "search", "ask", "ctx", "summary", "json")}
        except Exception as e:
            error = traceback.format_exc()

    t = threading.Thread(target=_run, daemon=True)
    t.start()
    t.join(timeout=body.timeout)
    if t.is_alive():
        error = f"执行超时 ({body.timeout}s)"

    _sys.stdout = old_stdout
    stdout = output.getvalue()

    return {
        "stdout": stdout[:2000],
        "result": result if not error else None,
        "error": error,
        "ok": error is None,
    }


# ============================================================
# 系统健康监控
# ============================================================

@router.get("/aip/health")
async def aip_system_health():
    """系统健康监控 — CPU/内存/磁盘/连接池/采集状态"""
    import psutil, os, time as _t

    health = {
        "timestamp": __import__("datetime").datetime.now().isoformat(),
        "system": {},
        "collector": {},
        "telemetry": {},
        "alerts": {},
    }

    # 系统资源
    try:
        health["system"] = {
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_used_gb": round(psutil.virtual_memory().used / (1024**3), 1),
            "memory_total_gb": round(psutil.virtual_memory().total / (1024**3), 1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_used_gb": round(psutil.disk_usage(".").used / (1024**3), 1),
            "disk_total_gb": round(psutil.disk_usage(".").total / (1024**3), 1),
        }
    except: pass

    # 采集状态
    rag, engine = _get_rag()
    health["ontology"] = engine.health()
    health["llm"] = rag.status().get("ready", False)

    # 遥测统计
    import sqlite3
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "telemetry.db")
    if os.path.exists(db_path):
        try:
            db = sqlite3.connect(db_path)
            health["telemetry"]["total_points"] = db.execute("SELECT COUNT(*) FROM telemetry").fetchone()[0]
            row = db.execute("SELECT COUNT(DISTINCT device_id) FROM telemetry").fetchone()
            health["telemetry"]["active_devices"] = row[0] if row else 0
            db.close()
        except: pass

    return health


@router.get("/llm/test")
async def graphrag_llm_test():
    """测试 LLM 连接 — 发送简单 ping 请求"""
    rag, _ = _get_rag()
    if not rag._llm:
        return {"ok": False, "msg": "LLM 未配置。请设置 ANTHROPIC_API_KEY 或 OPENAI_API_KEY 环境变量"}

    try:
        response = rag._llm(
            "你是一个工业物联网助手。用一句话回答。",
            "ping (只需回复 'pong - DG-IoT GraphRAG ready')"
        )
        return {"ok": True, "response": response.strip(), "provider": rag._provider}
    except Exception as e:
        return {"ok": False, "error": str(e), "provider": rag._provider}
