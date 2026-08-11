"""
油田作业区场站 DLAS 本体 — FastAPI 后端
数据来源: 实体清单.xlsx + 关系矩阵.xlsx + 约束规则库.xlsx + 全貌文档 + pSpace CSV
"""

import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="油田作业区场站本体 API", version="2.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = Path(__file__).resolve().parent.parent.parent

# ─── 加载所有数据 ────────────────────────────────────

with open(BASE / "oilfield_ontology.json", "r", encoding="utf-8") as f:
    ONTOLOGY = json.load(f)

with open(BASE / "force_graph_data.json", "r", encoding="utf-8") as f:
    GRAPH_DATA = json.load(f)

with open(BASE / "ontology_report.md", "r", encoding="utf-8") as f:
    REPORT_MD = f.read()

# Excel 导出的 JSON
with open(BASE / "excel_entities.json", "r", encoding="utf-8") as f:
    EXCEL_ENTITIES = json.load(f)

with open(BASE / "excel_relations.json", "r", encoding="utf-8") as f:
    EXCEL_RELATIONS = json.load(f)

with open(BASE / "excel_constraints.json", "r", encoding="utf-8") as f:
    EXCEL_CONSTRAINTS = json.load(f)


# ─── 工具函数 ────────────────────────────────────────

def _flat_entities():
    """扁平化实体列表（Excel 数据 + 本体数据合并）"""
    result = []

    # 优先用 Excel 数据
    sheet = EXCEL_ENTITIES.get("实体清单", {})
    for row in sheet.get("rows", []):
        result.append({
            "layer": row.get("层", ""),
            "category": row.get("类别", ""),
            "name": row.get("实体名称", ""),
            "identifier": row.get("数量/标识", ""),
            "description": row.get("属性/说明", ""),
            "source": row.get("数据源", ""),
            "_origin": "excel"
        })

    # 补充本体 JSON 中的额外实体
    excel_names = {r["name"] for r in result}
    data_layer = ONTOLOGY.get("Data", {})
    for cat, items in data_layer.items():
        if isinstance(items, list):
            for item in items:
                name = item.get("name", "")
                if name and name not in excel_names:
                    result.append({
                        "layer": "Data",
                        "category": cat,
                        "name": name,
                        "identifier": item.get("ip") or item.get("code") or item.get("count") or item.get("port") or "",
                        "description": item.get("role") or item.get("function") or item.get("desc") or "",
                        "source": "ontology_json",
                        "_origin": "ontology"
                    })
        elif isinstance(items, dict):
            result.append({
                "layer": "Data",
                "category": cat,
                "name": cat,
                "identifier": str(items.get("total", "")),
                "description": str(items)[:200],
                "source": "ontology_json",
                "_origin": "ontology"
            })

    return result


def _flat_relations():
    """从 Excel 关系矩阵获取"""
    sheet = EXCEL_RELATIONS.get("关系矩阵", {})
    result = []
    for row in sheet.get("rows", []):
        result.append({
            "source": row.get("源实体", ""),
            "relation": row.get("关系类型", ""),
            "target": row.get("目标实体", ""),
            "mechanism": row.get("协议/机制", ""),
            "direction": row.get("方向", ""),
            "description": row.get("说明", ""),
        })
    return result


def _flat_constraints():
    """从 Excel 约束规则库获取"""
    sheet = EXCEL_CONSTRAINTS.get("约束规则库", {})
    result = []
    for row in sheet.get("rows", []):
        result.append({
            "layer": row.get("层级", ""),
            "name": row.get("规则名称", ""),
            "condition": row.get("阈值/条件", ""),
            "severity": row.get("严重度", ""),
            "action": row.get("执行动作", ""),
            "source": row.get("出处", ""),
        })
    return result


# ─── API ─────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "2.1"}


# ── 实体（优先 Excel） ──
@app.get("/api/entities")
def get_entities():
    entities = _flat_entities()
    return {"total": len(entities), "entities": entities}


@app.get("/api/entities/excel")
def get_entities_excel():
    """原始 Excel 实体数据"""
    sheet = EXCEL_ENTITIES.get("实体清单", {})
    return {
        "headers": sheet.get("headers", []),
        "rows": sheet.get("rows", []),
        "total": sheet.get("count", 0)
    }


@app.get("/api/entities/layers")
def get_entity_layers():
    """按 DLAS 层分组统计"""
    entities = _flat_entities()
    layers = {}
    for e in entities:
        layer = e["layer"]
        if layer not in layers:
            layers[layer] = {"count": 0, "categories": {}}
        layers[layer]["count"] += 1
        cat = e["category"]
        layers[layer]["categories"][cat] = layers[layer]["categories"].get(cat, 0) + 1
    return layers


# ── 关系（Excel 优先） ──
@app.get("/api/relations")
def get_relations():
    relations = _flat_relations()
    return {"total": len(relations), "relations": relations}


@app.get("/api/relations/excel")
def get_relations_excel():
    """原始 Excel 关系数据"""
    sheet = EXCEL_RELATIONS.get("关系矩阵", {})
    return {
        "headers": sheet.get("headers", []),
        "rows": sheet.get("rows", []),
        "total": sheet.get("count", 0)
    }


# ── 约束（Excel 优先） ──
@app.get("/api/constraints")
def get_constraints():
    rules = _flat_constraints()
    return {"total": len(rules), "rules": rules}


@app.get("/api/constraints/excel")
def get_constraints_excel():
    """原始 Excel 约束数据"""
    sheet = EXCEL_CONSTRAINTS.get("约束规则库", {})
    return {
        "headers": sheet.get("headers", []),
        "rows": sheet.get("rows", []),
        "total": sheet.get("count", 0)
    }


@app.get("/api/constraints/groups")
def get_constraint_groups():
    """按层级+严重度分组"""
    rules = _flat_constraints()
    groups = {}
    for r in rules:
        key = f"{r['layer']}|{r['severity']}"
        if key not in groups:
            groups[key] = []
        groups[key].append(r["name"])
    return groups


# ── 本体全量 ──
@app.get("/api/ontology/full")
def get_full_ontology():
    """完整 DLAS 本体 + Excel 数据"""
    return {
        "meta": ONTOLOGY.get("meta", {}),
        "Data": ONTOLOGY.get("Data", {}),
        "Logic": ONTOLOGY.get("Logic", {}),
        "Action": ONTOLOGY.get("Action", {}),
        "Security": ONTOLOGY.get("Security", {}),
        "_excel": {
            "entities": {
                "headers": EXCEL_ENTITIES.get("实体清单", {}).get("headers", []),
                "total": EXCEL_ENTITIES.get("实体清单", {}).get("count", 0)
            },
            "relations": {
                "headers": EXCEL_RELATIONS.get("关系矩阵", {}).get("headers", []),
                "total": EXCEL_RELATIONS.get("关系矩阵", {}).get("count", 0)
            },
            "constraints": {
                "headers": EXCEL_CONSTRAINTS.get("约束规则库", {}).get("headers", []),
                "total": EXCEL_CONSTRAINTS.get("约束规则库", {}).get("count", 0)
            }
        }
    }


@app.get("/api/ontology/layer/{layer}")
def get_layer(layer: str):
    if layer in ONTOLOGY:
        return {layer: ONTOLOGY[layer]}
    return {"error": f"layer '{layer}' not found"}


@app.get("/api/ontology/stats")
def get_stats():
    entities = _flat_entities()
    relations = _flat_relations()
    rules = _flat_constraints()

    elayers = {}
    for e in entities:
        elayers[e["layer"]] = elayers.get(e["layer"], 0) + 1

    return {
        "name": ONTOLOGY["meta"]["name"],
        "version": "2.1",
        "entities_total": len(entities),
        "entities_by_layer": elayers,
        "relations_total": len(relations),
        "constraints_total": len(rules),
        "excel_entities": EXCEL_ENTITIES.get("实体清单", {}).get("count", 0),
        "excel_relations": EXCEL_RELATIONS.get("关系矩阵", {}).get("count", 0),
        "excel_constraints": EXCEL_CONSTRAINTS.get("约束规则库", {}).get("count", 0),
    }


# ── 力导图 ──
@app.get("/api/graph/data")
def get_graph_data():
    return GRAPH_DATA


@app.get("/api/graph/excel-graph")
def get_excel_graph():
    """从 Excel 关系矩阵生成力导图"""
    rels = _flat_relations()
    nodes_set = {}
    links = []
    for r in rels:
        src = r["source"]
        tgt = r["target"]
        if src not in nodes_set:
            nodes_set[src] = {"name": src, "symbolSize": 30, "category": 0}
        if tgt not in nodes_set:
            nodes_set[tgt] = {"name": tgt, "symbolSize": 30, "category": 0}
        links.append({
            "source": src,
            "target": tgt,
            "label": r["relation"],
        })

    # 分配分类
    entity_layer_map = {}
    for e in _flat_entities():
        entity_layer_map[e["name"]] = e["layer"]

    layer_colors = {"Data": "#409EFF", "Logic": "#67C23A", "Action": "#E6A23C", "Security": "#F56C6C"}
    categories = [
        {"name": "Data", "itemStyle": {"color": "#409EFF"}},
        {"name": "Logic", "itemStyle": {"color": "#67C23A"}},
        {"name": "Action", "itemStyle": {"color": "#E6A23C"}},
        {"name": "Security", "itemStyle": {"color": "#F56C6C"}},
    ]
    cat_map = {"Data": 0, "Logic": 1, "Action": 2, "Security": 3}

    for name in nodes_set:
        layer = entity_layer_map.get(name, "Data")
        nodes_set[name]["category"] = cat_map.get(layer, 0)

    return {
        "nodes": list(nodes_set.values()),
        "links": links,
        "categories": categories
    }


# ── 报告 ──
@app.get("/api/report")
def get_report():
    return {"report": REPORT_MD}


# ── pSpace 标签数据 (CSV) ──
import csv
from collections import Counter

TAGS_CACHE = None

def _load_tags():
    global TAGS_CACHE
    if TAGS_CACHE is None:
        TAGS_CACHE = []
        csv_path = BASE / "pSpace_tags.csv"
        with open(csv_path, "r", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                TAGS_CACHE.append(row)
    return TAGS_CACHE


@app.get("/api/tags/stats")
def get_tags_stats():
    """pSpace 标签总体统计"""
    tags = _load_tags()
    stations = Counter(r["站点"] for r in tags)
    ptypes = Counter(r["测点类型"] for r in tags)
    meters = Counter(r["计量间"] for r in tags)
    wells = set(r["井号"] for r in tags)

    return {
        "total": len(tags),
        "stations": dict(stations),
        "well_count": len(wells),
        "point_types": dict(ptypes),
        "point_type_count": len(ptypes),
        "metering_stations": dict(meters),
        "metering_station_count": len(meters),
        "source": dict(Counter(r["来源"] for r in tags)),
    }


@app.get("/api/tags/point-types")
def get_tags_point_types():
    """测点类型列表及含义"""
    type_map = {
        "ADL": "A相电流下限", "ADY": "A相电压下限", "BDL": "B相电流下限", "BDY": "B相电压下限",
        "CDL": "C相电流下限", "CDY": "C相电压下限", "CHC": "通道状态", "CPV": "控制电压",
        "CZT": "冲程状态", "DCV": "直流电压", "DWL": "动液面", "EGT": "引擎温度",
        "GYS": "供液状态", "HGT": "回压管温", "RCV": "接收电压", "SLV": "送出电压",
        "TGP": "套压", "TGT": "套管温度", "UCV": "交流电压", "UWL": "上液面",
        "ZHL": "载荷", "ZWG": "位移", "ZYG": "增益",
        "SAQ": "安全状态", "MFQ": "密封状态", "PDL": "P相电流", "PDY": "P相电压",
        "BPP": "泵频", "BPS": "泵速", "JRH": "进液汇管", "ROT": "旋转", "WLV": "液位",
        "ZWG2": "位移2", "TGP2": "套压2", "ADY2": "电压下限2", "CZT5": "冲程状态5",
    }
    tags = _load_tags()
    ptypes = Counter(r["测点类型"] for r in tags)
    return [
        {"code": k, "name": type_map.get(k, k), "count": v}
        for k, v in ptypes.most_common()
    ]


@app.get("/api/tags/wells")
def get_tags_wells(station: str = "", search: str = "", limit: int = 100, offset: int = 0):
    """井号列表（含每口井的测点数）"""
    tags = _load_tags()
    well_counts = Counter(r["井号"] for r in tags)
    well_station = {}
    for r in tags:
        wid = r["井号"]
        if wid not in well_station:
            well_station[wid] = r["站点"]

    result = []
    for wid, cnt in well_counts.most_common():
        if station and well_station.get(wid) != station:
            continue
        if search and search.lower() not in wid.lower():
            continue
        result.append({"well_id": wid, "station": well_station.get(wid, ""), "tag_count": cnt})

    total = len(result)
    return {"total": total, "wells": result[offset:offset + limit]}


@app.get("/api/tags/metering-stations")
def get_tags_metering(well_id: str = ""):
    """计量间列表，可按井号筛选"""
    tags = _load_tags()
    if well_id:
        tags = [r for r in tags if r["井号"] == well_id]
    meters = Counter(r["计量间"] for r in tags)
    return [{"metering_station": k, "count": v} for k, v in meters.most_common()]


@app.get("/api/tags/query")
def query_tags(
    station: str = "", well_id: str = "", point_type: str = "",
    metering: str = "", search: str = "", limit: int = 200, offset: int = 0
):
    """查询标签（支持多条件组合）"""
    tags = _load_tags()
    result = []
    for r in tags:
        if station and r["站点"] != station: continue
        if well_id and r["井号"] != well_id: continue
        if point_type and r["测点类型"] != point_type: continue
        if metering and r["计量间"] != metering: continue
        if search:
            q = search.lower()
            if not any(q in str(v).lower() for v in r.values()):
                continue
        result.append(r)

    total = len(result)
    return {
        "total": total,
        "tags": result[offset:offset + limit],
        "limit": limit,
        "offset": offset
    }


# ─── 启动 ────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8766)
