"""
FDE 六步工作法 API — 不写代码构建工业智能体
============================================
Step 1: 物模型定义     Step 4: 时序存储 (已有)
Step 2: 本体语义建模   Step 5: 规则引擎
Step 3: 多协议接入     Step 6: 驾驶舱可视化
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import json

router = APIRouter(prefix="/api/fde", tags=["FDE Wizard"])

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
# Step 2: 本体语义建模 (物模型→本体编译)
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
# Step 4: 驾驶舱一键生成
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
# Step 6: Agent 自动生成 (NL → 全量配置)
# ═══════════════════════════════════════════

class AgentGenRequest(BaseModel):
    description: str = Field(..., description="自然语言描述: '我需要监控一台光伏逆变器，采集功率电压电流，超过5000W告警'")


@router.post("/wizard/agent")
async def fde_wizard_agent(body: AgentGenRequest):
    """Step 6: Agent 自动生成 — NL 描述 → 自动配置全流程

    解析自然语言 → 推断设备类型/测点/告警规则 → 调用 Step1-5
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
        "step1_product": {"devType": devType, "point_count": len(pts_for_model)},
        "step2_ontology": engine.health()["counts"],
        "step3_scan_hint": f"python -m src.protocols.modbus_scanner {body.description.split('，')[0] if '，' in body.description else '127.0.0.1'}",
        "step4_dashboard": dashboard,
        "step5_rules": [f"c_{p['point_id']}" for p in pts_for_model if p.get("alarm_high") or p.get("alarm_low")],
        "step6_deploy": f"python run.py → http://localhost:8000/#/dashboard",
    }
