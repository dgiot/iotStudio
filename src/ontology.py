"""
iotStudio 本体论引擎 — 4 层模型
与 Erlang dgiot_ontology.erl 对齐

层1 Site    工业厂/井场/场站 (human-readable name)
层2 Channel 协议通道 (MD5: get_channelid)
层3 Device  RTU/传感器 (MD5: get_deviceid, Gateway = Device type=gateway)
层4 Point   测点 (thing_model identifier, 产品内唯一)

MQTT Topic: $dg/thing/{product_id}/{product_id}_{devaddr}/properties/report (dlink standard)
"""
import json
import logging
from dataclasses import dataclass, field, asdict, fields
from datetime import datetime
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════
# 五层实体模型
# ═══════════════════════════════════════════════════════════

@dataclass
class Site:
    """层1: 物理站点 — 工业厂/井场/变电站"""
    id: str
    name: str
    type: str = "oil_field"          # oil_field, substation, factory
    location: Optional[str] = None   # 地理位置
    description: str = ""


@dataclass
class Gateway:
    """层2: IO网关 / 边缘网关 — 物理或虚拟主机"""
    id: str
    ip: str
    site: str                         # Site.id
    hostname: str = ""
    os: str = ""                      # Windows Server 2016 / Linux ...
    status: str = "unknown"           # online, offline, degraded
    installed: Dict[str, str] = field(default_factory=dict)   # {"GENERIC_HMI":"7.x","Oracle":"11.2.0"}
    channels: List[str] = field(default_factory=list)          # Channel.id[]
    notes: str = ""


@dataclass
class Channel:
    """层3: 协议通道 — 物理世界与数字世界的桥梁"""
    id: str
    gateway: str                      # Gateway.id
    name: str
    protocol: str                     # opc_da, a11_tcp, modbus_tcp, oracle_sql, http_rest
    endpoint: str = ""                # host:port or connection string
    status: str = "unknown"           # running, stopped, error
    config: Dict[str, Any] = field(default_factory=dict)
    devices: List[str] = field(default_factory=list)  # Device.id[]


@dataclass
class Device:
    """层4: 设备 — RTU / PLC / 传感器 / 保护继电器

    `id` 是本体的内部标识（`dev1` 这种），只在本体里有效。中枢（Erlang）
    不认它 —— 中枢认的是 `(product, devaddr)` 推出来的 deviceId。所以这两个
    平台侧字段必须跟着设备一起存：**少了它们，这条设备的数据发不到中枢**，
    而且是在"主题拼不出来"和"发出去被静默丢弃"之间二选一，两种都很难查。
    """
    id: str
    channel: str                      # Channel.id
    name: str
    type: str = "rtu"                 # rtu, relay, plc, sensor, meter
    protocol: str = "modbus"
    slaveid: int = 1
    manufacturer: str = ""
    model: str = ""
    status: str = "unknown"
    points: List[str] = field(default_factory=list)  # Point.id[]
    devaddr: str = ""                 # 平台设备地址（中枢按它 + product 定位设备）
    product: str = ""                 # 平台 productId（10 位 objectId，不是产品名）


@dataclass
class Point:
    """层5: 测点 — 最小的数据单元"""
    id: str
    device: str                       # Device.id
    name: str
    unit: str = ""
    description: str = ""
    register: Dict[str, Any] = field(default_factory=dict)  # {"address":40300,"type":"float32_AB","protocol":"modbus"}
    alarm: Dict[str, float] = field(default_factory=dict)   # {"high":3.0,"low":0.1,"hh":5.0,"ll":0.01}
    range: List[float] = field(default_factory=list)        # [min, max]
    category: str = ""                # 遥测/遥信/遥脉/遥调


# ═══════════════════════════════════════════════════════════
# 约束与规则 (Logic 层)
# ═══════════════════════════════════════════════════════════

@dataclass
class Constraint:
    """安全/业务判据 —— **说明性文本，不是可执行表达式**

    ⚠️ `rule` 是**自由文本**，全仓没有任何地方解析或执行它：
      · `evaluate()` / `judge_point()` 判的是**测点自带**的 `alarm`/`range` 阈值，
        约束在这里只提供"这一条归哪个实体"的归属关系；
      · `rule` 的读取点全部是**展示或搬运** —— OWL 的 `rdfs:comment`（`_rdf_graph()`）、
        AAS 的 `description`/`inputVariables`（`interop.py`）、数据库列、页面文本。
    原先这里写「SWRL 规则」、字段注释写「SWRL-like」，而本仓既无 SWRL 解析器
    也无推理机 —— 不但声称了没实现的东西，还会让人以为**判据逻辑在 `rule` 里**，
    而它其实在 `Point.alarm`。
    """
    id: str
    name: str
    rule: str                         # 人读的规则说明（如 "temperature>85 → alarm L1"）；不参与执行
    entity: str = ""                  # 适用的实体 ID
    severity: str = "warning"         # info, warning, danger, critical
    source: str = ""                  # 规则出处 (操作手册/工艺规范/合规文件)
    action: str = ""                  # 触发动作描述
    enabled: bool = True
    rule_kind: str = "validation"     # R1 五分类: mapping|validation|state|inference|automation


@dataclass
class DataSource:
    """数据出口 — 持久化目标"""
    id: str
    gateway: str
    type: str                         # oracle, tdengine, realtime_db, eforcecon, sqlite
    connection: str = ""              # connection string
    status: str = "unknown"
    tag_count: int = 0
    tables: List[str] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════
# 显式关系 (R1: Link 层 — 对齐 Ontexus 四要素的 Relation)
# ═══════════════════════════════════════════════════════════

# 关系词表 — 与 DGAIOT 生态对齐 (repo-skeleton 已入库 34 条种子:
# has_defect/has_issue/maps_to/relates_to), 加边缘域扩展四词
LINK_RELATIONS = {
    "maps_to",       # 映射: 测点→协议路径, 数据出口→通道
    "relates_to",    # 泛关联: 相邻保护/联动实体
    "has_defect",    # 缺陷归属: 实体→已知缺陷 (props.constraint 引约束)
    "has_issue",     # 问题归属: 实体→已知问题/故障模式
    "feeds_into",    # 数据/能量流入: 通道→出口通道, 电源→负载
    "monitors",      # 监测: 保护/传感器→被监测设备 (跨通道)
    "controls",      # 控制: 网关→通道启停/策略
    "powered_by",    # 供电: 设备→上级供电实体
}

# R1 关系词的 OWL 侧元数据 —— GB/T 48000.3 附录A(规范性) 表A.2 要求属性带
# Definition / 定义域 / 值域。
#
# ⚠️ 单独一张表, **不动 LINK_RELATIONS 的形状**: 那是个 set, 有 6 处调用方
# (agent_audit / interop / graphrag_api / ontology 自身) 按集合成员判断,
# 改成 dict 会静默改掉它们的语义。
#
# 定义域/值域怎么定的（两种来源, 都不凭空写）:
#   · 语义明确 且 实测一致 ⇒ 写具体类（controls / monitors / powered_by）
#   · 实测跨多类 或 注释里举了非本类的例子 ⇒ 写 Entity（最宽泛的类）
# **为什么横切的一律写 Entity, 而不是"实测里出现最多的那个类"**:
# rdfs:domain 是公理不是注释 —— 写窄了推理器会把主语推成那个窄类, 而图里
# 没有 disjointWith 兜底, 一个个体两个互不可推的类时推理器不报错。
# hasConstraint 就栽在这上面（见下方导出处那段注释）。
# 宽只是少推一点, 窄会推错 —— 不确定时宽的那边是安全侧。
LINK_REL_SPEC = {
    # 关系词:        (定义域,     值域,       Definition ← 取自 LINK_RELATIONS 的行注释)
    "maps_to":     ("Entity",  "Channel", "映射: 测点→协议路径, 数据出口→通道"),
    "relates_to":  ("Entity",  "Entity",  "泛关联: 相邻保护/联动实体"),
    "has_defect":  ("Entity",  "Entity",  "缺陷归属: 实体→已知缺陷"),
    "has_issue":   ("Entity",  "Entity",  "问题归属: 实体→已知问题/故障模式"),
    "feeds_into":  ("Entity",  "Entity",  "数据/能量流入: 通道→出口通道, 电源→负载"),
    "monitors":    ("Device",  "Device",  "监测: 保护/传感器→被监测设备 (跨通道)"),
    "controls":    ("Gateway", "Channel", "控制: 网关→通道启停/策略"),
    "powered_by":  ("Device",  "Entity",  "供电: 设备→上级供电实体"),
}

# ── 数据属性（GB/T 48000.3 §5.2 要求本体含对象属性与数据属性两类；§8.2 b) 四条全落在数据属性上）──
#
# **白名单是脱敏决策, 不是技术选择**：只导出「枚举/类型/计数」型字段,
# 不导出「标识/连接/名称」型字段。排除项与理由:
#   Gateway.ip / hostname / os · Channel.endpoint · DataSource.connection
#       —— 现场地址与连接串（endpoint 形如 host:port 或整条连接串）
#   Site.location —— 可能是真实经纬度或地名
#   所有 name / notes / description / Constraint.rule —— 自由文本, 现场信息就藏在里面
#   Device.manufacturer / model / devaddr / product —— 设备指纹与平台标识
# 判据是**字段语义**而非"当前数据看着干净"：build_engine() 是两个数据源二选一
# （库空才用演示种子, 现场跑加载的是 load_from_parse() 的真实数据）, 白名单必须
# 在两种情况下都成立, 不能依赖跑在哪儿。
#
# 每个属性的 domain 只写**一个**类, 即使语义相近也不复用 —— 复用时 sh:in 只能取并集,
# 而并集比任何一边都松（channelProtocol 有 oracle_sql, deviceProtocol 有 force_hls_sim,
# 合并后两边都合法的值会变多）。§9.2 说扩展"可在已有约束条件基础上进一步限定",
# 方向是更严, 不是更松。
DATA_PROP_SPEC = {
    # 属性名:              (定义域,       值域,            Definition)
    "siteType":          ("Site",       "xsd:string",  "站点类型 — 工业厂/井场/变电站"),
    "gatewayStatus":     ("Gateway",    "xsd:string",  "网关运行状态"),
    "channelProtocol":   ("Channel",    "xsd:string",  "通道协议类型"),
    "channelStatus":     ("Channel",    "xsd:string",  "通道运行状态"),
    "deviceType":        ("Device",     "xsd:string",  "设备类型"),
    "deviceProtocol":    ("Device",     "xsd:string",  "设备通信协议"),
    "slaveId":           ("Device",     "xsd:integer", "从站地址 — Modbus 等主从协议里的站号"),
    "deviceStatus":      ("Device",     "xsd:string",  "设备运行状态"),
    "unit":              ("Point",      "xsd:string",  "工程单位"),
    "category":          ("Point",      "xsd:string",  "测点类别 — 遥测/遥信/遥脉/遥调"),
    "severity":          ("Constraint", "xsd:string",  "约束严重级"),
    "ruleKind":          ("Constraint", "xsd:string",  "约束五分类 — mapping/validation/state/inference/automation"),
    "enabled":           ("Constraint", "xsd:boolean", "约束是否启用"),
    "dataSourceType":    ("DataSource", "xsd:string",  "数据出口类型"),
    "dataSourceStatus":  ("DataSource", "xsd:string",  "数据出口状态"),
    "tagCount":          ("DataSource", "xsd:integer", "出口位号数"),
}

# 数据属性的取值闭集 —— **唯一事实源**, SHACL 的 sh:in 直接读这张表。
# 取自「dataclass 行内注释（设计意图）∪ 实测已用值」。两者都要, 且**都不足以单独成立**:
#   · 只抄注释会错 —— 实测 deviceType 有 simulator/oil_well/opc_device 三种注释里没有的值,
#     注释是旧的（plc/sensor/meter 一个都没出现过）; channelProtocol 注释 5 种、实测 13 种。
#   · 只抄实测会漏 —— 注释里有而当前数据没用的值（如 siteType 的 substation/factory）
#     仍应合法, 否则一加数据就报违规。
# 冻结当前已知集, 新值一律判违规 —— 那不是在说"新值错了", 是逼人显式决定
# 「是数据写错了, 还是枚举该扩」。§8.2 b)3) 要的正是这个（取值限定在预定义的枚举范围内）。
FIELD_ENUMS = {
    "siteType":         ["oil_field", "substation", "factory"],
    "gatewayStatus":    ["online", "offline", "degraded", "unknown"],
    "channelProtocol":  ["opc_da", "a11_tcp", "modbus_tcp", "oracle_sql", "http_rest",
                         "realtime_db", "eforcecon", "redundancy", "dtu_multi",
                         "s7comm", "mitsubishi", "twincat_ads", "omron", "ge_snp"],
    "channelStatus":    ["running", "stopped", "error", "unknown"],
    "deviceType":       ["rtu", "relay", "plc", "sensor", "meter", "oil_well",
                         "opc_device", "simulator"],
    "deviceProtocol":   ["modbus", "modbus_tcp", "a11_tcp", "opc_da", "force_hls_sim"],
    "deviceStatus":     ["online", "offline", "unknown"],
    "category":         ["遥测", "遥信", "遥脉", "遥调"],
    "severity":         ["info", "warning", "danger", "critical"],
    "ruleKind":         ["mapping", "validation", "state", "inference", "automation"],
    "dataSourceType":   ["oracle", "tdengine", "realtime_db", "eforcecon", "sqlite",
                         "redundancy", "sync"],
    "dataSourceStatus": ["online", "offline", "running", "stopped", "unknown"],
    # unit 刻意**不在**表里: 工程单位是开放集（A/kV/MPa/t/d…）, 闭集会天天误报。
    # slaveId / tagCount / enabled 同理走类型与范围约束, 不走枚举。
}

# 实体表名 → 本体类名。**唯一事实源** —— _rdf_graph() 建类、shacl_shapes() 挂形状
# 都读它。此前这份映射只写在 _rdf_graph() 里当局部变量, 加 SHACL 时若各写一份,
# 就会出现「OWL 里叫 A、SHACL 里约束 B」这种谁也查不出来的漂移（本库的老账）。
ENTITY_CLASSES = {
    "site": "Site", "gateway": "Gateway", "channel": "Channel",
    "device": "Device", "point": "Point",
    "constraint": "Constraint", "datasource": "DataSource",
}

XSD_NS = "http://www.w3.org/2001/XMLSchema#"

# 层级属性 —— (边名, 定义域, 值域, Definition)。
# 与 PARENT_REF 是同一件事的两个方向：PARENT_REF 是「子找父」（子实体的字段名 + 父表，
# 被 engine.validate() 当悬空引用的唯一事实源），本表是「父找子」的边名。
# **两处必须一致**（边名 == 'has' + 父类名），判据在 tests 里；shacl_shapes() 直接读
# 本表取边名而不拼字符串 —— 拼字符串就等于把同一个事实写第二遍。
HIER_PROPS = [
    ("hasGateway", "Site", "Gateway", "层级归属 — 站点下属的网关"),
    ("hasChannel", "Gateway", "Channel", "层级归属 — 网关下属的协议通道"),
    ("hasDevice", "Channel", "Device", "层级归属 — 通道下属的设备"),
    ("hasPoint", "Device", "Point", "层级归属 — 设备下属的测点"),
]


@dataclass
class Link:
    """显式业务关系边 — 跨层级连线, 与隐式层级父子互补"""
    id: str
    source: str                       # 源实体 ID
    target: str                       # 目标实体 ID
    relation: str                     # LINK_RELATIONS 之一 (validate 校验)
    description: str = ""
    props: Dict[str, Any] = field(default_factory=dict)   # 约束引用/路径等附加语义


# ═══════════════════════════════════════════════════════════
# 本体引擎
# ═══════════════════════════════════════════════════════════

# 层级 → (指向父层的字段名, 父层表名)。**「什么算悬空引用」的唯一事实源** ——
# engine.validate() 与 enterprise.register_objects() 都读这张表。
# 以前两处各写各的四段 if，加一层就得改两个文件，漏一个就出现
# 「单条 create 拦、批量导入放过」这类口径分叉。
#
# 只列单条 create 也会校验的四层：constraint.entity / datasource.gateway
# 那边本来就不拦, 这里也不列, 免得再岔开一次。
PARENT_REF = {
    "gateway": ("site", "sites"),
    "channel": ("gateway", "gateways"),
    "device": ("channel", "channels"),
    "point": ("device", "devices"),
}


def _row_get(row, key: str, pos: int):
    """行列取值 — sqlite3.Row/dict 按键取, 朴素 tuple 连接按位置取

    两条路都得能读: 生产走 DBWrapper(sqlite3.Row), 而测试里 monkeypatch
    get_db 常直接塞一个裸 sqlite3 连接(tuple 行)。只认按键会在后者静默
    读成空 —— 正好重演「只写不读」这个函数要修的毛病。
    """
    try:
        return row[key]
    except (KeyError, IndexError, TypeError):
        pass
    try:
        return row[pos]
    except (KeyError, IndexError, TypeError):
        return None


def _decode_data_column(raw) -> Optional[dict]:
    """data 列 → dict; 空值或坏 JSON 返回 None (调用方计一次 skipped)"""
    if not raw:
        return None
    try:
        payload = json.loads(raw)
    except (TypeError, ValueError):
        return None
    return payload if isinstance(payload, dict) else None


def _filter_fields(cls, payload: dict) -> dict:
    """只留数据类认得的键

    行是**旧版本代码**写的, 而类会改。删掉的字段会在老行里留下多余键,
    cls(**payload) 直接 TypeError —— 一次改名就足以让整个本体加载不出来。
    加过的字段老行没有, 正好落回默认值。所以两个方向的兼容都得要:
    多余的丢掉, 缺的不管。
    """
    names = {f.name for f in fields(cls)}
    return {k: v for k, v in payload.items() if k in names}


class OntologyEngine:
    """5层本体论引擎 — 与 Erlang dgiot_ontology 接口对齐

    新增能力 (v2.0):
      - 5层模型 (Site·Gateway·Channel·Device·Point)
      - 约束规则库 (Constraint)
      - 数据出口注册 (DataSource)
      - 从发现导出 (from_discovery)
      - 完整性校验 (validate)
    """

    def __init__(self, mqtt_client=None):
        self.sites: Dict[str, Site] = {}
        self.gateways: Dict[str, Gateway] = {}
        self.channels: Dict[str, Channel] = {}
        self.devices: Dict[str, Device] = {}
        self.points: Dict[str, Point] = {}
        self.constraints: Dict[str, Constraint] = {}
        self.datasources: Dict[str, DataSource] = {}
        self.links: Dict[str, Link] = {}
        self._mqtt = mqtt_client
        self._changelog: List[Dict] = []   # 属性变更审计日志 (update 落账)

    # ── 属性更新 + 变更审计 (PUT /aip/objects/{id} 与 wire_constraint 共用) ──
    def update(self, entity_id: str, changes: dict) -> dict:
        """更新实体属性 (只接受该层数据类已有字段; id 不可改)

        返回实际变更 {field: {"old": ..., "new": ...}} —
        实体不存在或无实际变化时返回 {}。
        """
        tables = (self.sites, self.gateways, self.channels, self.devices,
                  self.points, self.constraints, self.datasources)
        obj = None
        for table in tables:
            if entity_id in table:
                obj = table[entity_id]
                break
        if obj is None:
            return {}

        changed: Dict[str, Dict] = {}
        for key, new in (changes or {}).items():
            if key == "id" or not hasattr(obj, key):
                continue
            old = getattr(obj, key)
            if old != new:
                setattr(obj, key, new)
                changed[key] = {"old": old, "new": new}
        if changed:
            self._changelog.append({
                "ts": datetime.now().isoformat(),
                "entity_id": entity_id,
                "entity_type": self.entity_type(entity_id) or "",
                "changed": changed,
            })
        return changed

    def changelog(self, limit: int = 50) -> List[Dict]:
        """变更审计日志 (最新在前)"""
        return list(reversed(self._changelog))[:limit]

    # ── register ──
    def register(self, node) -> str:
        """注册任意层节点 — 返回测点的**本体内部路径**, 非测点返回自身 id

        ⚠️ 返回的是 get_path() 的本体路径（site/gateway/channel/device/point），
        **不是 MQTT 主题**。要发中枢用 dlink_topic()。返回值目前所有调用方
        都丢弃，改形状不影响谁；留着只为诊断时看得见链路。

        ⚠️ 测点的路径解析是**尽力而为**：节点上面那两行已经把它塞进表里了，
        不能因为父层 (device/channel/gateway/site) 此刻还没注册，就把这次注册
        整个判成失败。批量导入的载荷顺序不保证父在前 —— get_path 直接抛的话，
        register_objects 会把它记进 errors，于是同一个测点既算 created 又算 errors，
        而父层随后到位后它其实好端端躺在表里（计数和实况两边都不对）。

        get_path() 本身仍然抛 —— 真要拼路径时链路不全就是不该拼，
        这个区分是故意的：注册与拼路径是两件事，别让后者否决前者。
        """
        table = {
            Site: self.sites, Gateway: self.gateways,
            Channel: self.channels, Device: self.devices,
            Point: self.points, Constraint: self.constraints,
            DataSource: self.datasources, Link: self.links
        }
        t = type(node)
        if t in table:
            table[t][node.id] = node
        if isinstance(node, Point):
            try:
                return self.get_path(node.id)
            except KeyError:
                return node.id
        return node.id

    def delete(self, entity_id: str) -> bool:
        """删除任意层节点 —— 只删自己，**不做级联**。

        级联交给调用方决定：/aip/objects/{id} 的 DELETE 会先算出 cascade 清单
        写进审计日志，让「删了站点会带走多少东西」这件事有据可查，
        而不是引擎默默连坐。找不到就返回 False，由调用方转 404。

        Link 两端指向被删实体的一并清掉 —— 悬空的边没有意义，
        留着还会让 subgraph / 影响半径算出一堆幽灵节点。
        """
        table = {
            "site": self.sites, "gateway": self.gateways,
            "channel": self.channels, "device": self.devices,
            "point": self.points, "constraint": self.constraints,
            "datasource": self.datasources, "link": self.links,
        }
        t = self.entity_type(entity_id)
        if t is None:
            return False
        old_name = self.entity_name(entity_id)   # 必须在 pop 之前取，否则只剩 id
        table[t].pop(entity_id, None)

        if t != "link":
            for lid in [l.id for l in list(self.links.values())
                        if l.source == entity_id or l.target == entity_id]:
                self.links.pop(lid, None)

        # 变更记录 —— 字段名与 update() 对齐（entity_type / changed），
        # 让 AIP 变更页用同一套渲染逻辑就能显示删除。
        try:
            self._changelog.append({
                "ts": datetime.now().isoformat(),
                "entity_id": entity_id,
                "entity_type": t,
                "changed": {"__deleted__": {"old": old_name, "new": None}},
            })
        except Exception:
            pass  # 审计是尽力而为，不该因为它记不上就删不掉
        return True

    # ── get_path (5层, 本体内部路径) ──
    def get_path(self, point_id: str) -> str:
        """本体内部路径: {site}/{gateway}/{channel}/{device}/{point}（5 层全 id）

        **这不是 MQTT 主题。** 早先这里返回的是 `dgiot/{site}/{gateway}/{channel}/{device}/{point}`，
        前缀看着像主题，其实是"自造变体"：四段里没有一段是中枢认的
        （site/gateway/channel 是中枢根本没有的概念，device 段是本体的 `dev1` 而不是 devaddr），
        仓库里三处 `TOPIC_RE` 也全都不收它 —— 谁都没消费过，它只是长得像。

        要发数据到中枢请用 `dlink_topic()`；要发到边缘内部（TD 存储那面）
        请显式写 `dgiot/...` 的全串。留这个方法只做本体自己的寻径（注册回执、
        关系展示、图谱分层），调用方别再拿它当主题的原料。
        """
        point = self.points.get(point_id)
        if not point: raise KeyError(f"Point {point_id} not found")
        device = self.devices.get(point.device)
        if not device: raise KeyError(f"Device {point.device} not found")
        channel = self.channels.get(device.channel)
        if not channel: raise KeyError(f"Channel {device.channel} not found")
        gateway = self.gateways.get(channel.gateway)
        if not gateway: raise KeyError(f"Gateway {channel.gateway} not found")
        site = self.sites.get(gateway.site)
        if not site: raise KeyError(f"Site {gateway.site} not found")

        return f"{site.id}/{gateway.id}/{channel.id}/{device.id}/{point.id}"

    # ── dlink_topic (中枢上行) ──
    def dlink_topic(self, point_id: str) -> str:
        """中枢上行主题: `$dg/thing/{product}/{devaddr}/properties/report`

        中枢只认 `(product, devaddr)` 这一对。注意用的是 **device 的 devaddr
        而不是 device.id**，product 也必须是 10 位 objectId —— 这两条都在
        `models/dgiot_ids.py` 里连同 Erlang 出处钉死了。

        链路缺字段时抛 KeyError（与 get_path 一致）：宁可拼不出来报错，
        也不要拼一个能发出去但中枢会静默丢弃的主题 —— 后者没有任何症状。
        """
        from .models.dgiot_ids import dlink_topic
        point = self.points.get(point_id)
        if not point: raise KeyError(f"Point {point_id} not found")
        device = self.devices.get(point.device)
        if not device: raise KeyError(f"Device {point.device} not found")
        if not device.devaddr:
            raise KeyError(f"Device {device.id} 缺 devaddr，拼不出中枢主题")
        if not device.product:
            raise KeyError(f"Device {device.id} 缺 product，拼不出中枢主题")

        return dlink_topic(device.product, device.devaddr, "properties", "report")

    # ── 快捷查询 ──
    def get_points(self, device_id: str) -> List[Point]:
        return [p for p in self.points.values() if p.device == device_id]

    def get_devices(self, channel_id: str) -> List[Device]:
        return [d for d in self.devices.values() if d.channel == channel_id]

    def get_channels(self, gateway_id: str) -> List[Channel]:
        return [c for c in self.channels.values() if c.gateway == gateway_id]

    # ── 关系层 (R1) ──
    def _entity_tables(self) -> Dict[str, dict]:
        return {"site": self.sites, "gateway": self.gateways, "channel": self.channels,
                "device": self.devices, "point": self.points,
                "constraint": self.constraints, "datasource": self.datasources,
                "link": self.links}

    def entity_type(self, entity_id: str) -> Optional[str]:
        """实体类型 (site/gateway/channel/device/point/constraint/datasource/link)"""
        for tname, table in self._entity_tables().items():
            if entity_id in table:
                return tname
        return None

    def entity_name(self, entity_id: str) -> str:
        for table in (self.sites, self.gateways, self.channels, self.devices, self.points,
                      self.constraints, self.datasources):
            if entity_id in table:
                e = table[entity_id]
                return getattr(e, "name", None) or getattr(e, "hostname", None) or entity_id
        return entity_id

    def search_entities(self, query: str, top_k: int = 10) -> List[Dict[str, Any]]:
        """跨层关键词检索 —— **返回形状与 EntityIndex.search 完全一致**:
        [{id, score, layer, name, type}] 按 score 降序

        GraphRAG 那条链有两个消费方共用这个形状（`search()` 在 TF-IDF 没候选时
        兜底、`ask()` 里做关键词精确融合），两条路的返回值混在同一个列表里排序，
        形状或量纲不一致就会在排序那一步悄悄错掉。

        **分数是 0-100 量纲，不是 0-1** —— 调用方拿 `>= 60` 当「关键词强命中」的
        门槛（graphrag.py 里 boost 那几行），返回 0-1 的话门槛恒不成立，
        融合逻辑会一声不响地全不触发。凡是按「id/name 实打实对上」给的分数
        才过 60；协议名/类型这种弱命中给 40，够上榜但不当强命中。

        纯字符串匹配，不碰索引 —— 本体刚改完、索引还没重建时也答得上来。
        层数与 EntityIndex 对齐（site/gateway/channel/device/point 五层），
        constraint/datasource/link 不进 —— 索引里没有它们，两条路得回答同一批实体。
        """
        q = (query or "").strip().lower()
        if not q:
            return []
        scored: List[Dict[str, Any]] = []
        for layer in ("site", "gateway", "channel", "device", "point"):
            for eid, ent in getattr(self, layer + "s").items():
                eid_l = str(eid).lower()
                name = getattr(ent, "name", "") or ""
                name_l = name.lower()
                etype = getattr(ent, "type", "") or getattr(ent, "protocol", "") or ""
                if eid_l == q:
                    score = 100
                elif name_l and name_l == q:
                    score = 95
                elif q in eid_l:
                    score = 80
                elif name_l and q in name_l:
                    score = 70
                elif q in etype.lower():
                    score = 40
                else:
                    continue
                scored.append({"id": eid, "score": score, "layer": layer,
                               "name": name or eid, "type": etype})
        # 同分时按 id 排 —— 不排序的话结果跟着 dict 插入顺序走，
        # 同样的查询两次跑出来的 top_k 可能不是同一批
        scored.sort(key=lambda r: (-r["score"], r["id"]))
        return scored[:top_k]

    def _parent_id(self, entity_id: str) -> Optional[str]:
        """隐式层级父实体 (由外键字段推导, 不依赖缓存列表)"""
        p = self.points.get(entity_id)
        if p: return p.device
        d = self.devices.get(entity_id)
        if d: return d.channel
        c = self.channels.get(entity_id)
        if c: return c.gateway
        g = self.gateways.get(entity_id)
        if g: return g.site
        ds = self.datasources.get(entity_id)
        if ds: return ds.gateway
        return None

    def _child_ids(self, entity_id: str) -> List[str]:
        if entity_id in self.sites:
            return [g.id for g in self.gateways.values() if g.site == entity_id]
        if entity_id in self.gateways:
            return [c.id for c in self.channels.values() if c.gateway == entity_id]
        if entity_id in self.channels:
            return [d.id for d in self.devices.values() if d.channel == entity_id]
        if entity_id in self.devices:
            return [p.id for p in self.points.values() if p.device == entity_id]
        return []

    def get_links(self, entity_id: str, relation: str = None) -> List[Link]:
        """实体的全部关系边 (出边+入边), 可按关系词过滤"""
        return [l for l in self.links.values()
                if entity_id in (l.source, l.target)
                and (relation is None or l.relation == relation)]

    # ── 子图 / 上下文 / 社区摘要 (graphrag_api 与 CLI 依赖) ──
    def subgraph(self, entity_id: str, depth: int = 2) -> dict:
        """BFS 子图 — 隐式层级边 + Link 显式关系边 (Graph 视图数据源)"""
        if self.entity_type(entity_id) is None:
            raise KeyError(f"Entity {entity_id} not found")
        nodes: Dict[str, dict] = {}
        edge_keys = set()
        edges: List[dict] = []

        def add_node(eid: str):
            if eid in nodes: return
            nodes[eid] = {"id": eid, "type": self.entity_type(eid),
                          "name": self.entity_name(eid)}

        def add_edge(src: str, dst: str, kind: str, relation: str = ""):
            key = (kind, relation, src, dst)
            if key in edge_keys: return
            edge_keys.add(key)
            edges.append({"source": src, "target": dst, "kind": kind, "relation": relation})

        add_node(entity_id)
        frontier = [entity_id]
        for _ in range(max(0, depth)):
            next_frontier = []
            for eid in frontier:
                pid = self._parent_id(eid)
                if pid and self.entity_type(pid):
                    add_node(pid); add_edge(eid, pid, "hierarchy")
                    next_frontier.append(pid)
                for cid in self._child_ids(eid):
                    add_node(cid); add_edge(eid, cid, "hierarchy")
                    next_frontier.append(cid)
                for l in self.get_links(eid):
                    add_node(l.source); add_node(l.target)
                    add_edge(l.source, l.target, "link", l.relation)
                    next_frontier.append(l.target if l.source == eid else l.source)
            frontier = next_frontier
        return {"root": entity_id, "nodes": list(nodes.values()), "edges": edges,
                "node_count": len(nodes), "edge_count": len(edges)}

    def local_context(self, entity_id: str) -> dict:
        """实体本地上下文 — 父/子/同级 + 约束 + 关系边 + 可读文本"""
        t = self.entity_type(entity_id)
        if t is None:
            raise KeyError(f"Entity {entity_id} not found")
        entity = self._entity_tables()[t][entity_id]
        pid = self._parent_id(entity_id)
        children = self._child_ids(entity_id)
        siblings = [s for s in (self._child_ids(pid) if pid else []) if s != entity_id]
        constraints = [c for c in self.constraints.values() if c.entity == entity_id]
        links = self.get_links(entity_id)

        lines = [f"[{t}] {entity_id} — {self.entity_name(entity_id)}"]
        if pid:
            lines.append(f"  上级: [{self.entity_type(pid)}] {pid} ({self.entity_name(pid)})")
        for cid in children:
            lines.append(f"  下级: [{self.entity_type(cid)}] {cid} ({self.entity_name(cid)})")
        for sid in siblings:
            lines.append(f"  同级: [{self.entity_type(sid)}] {sid} ({self.entity_name(sid)})")
        for l in links:
            extra = f" — {l.description}" if l.description else ""
            lines.append(f"  关系: {l.source} -[{l.relation}]-> {l.target}{extra}")
        for c in constraints:
            lines.append(f"  约束: {c.name} ({c.severity}/{c.rule_kind}) {c.rule}")
        # "layer" 与 "type" 并列给出：本函数自家叫 type，但上层消费方
        # （graphrag.enhance_context 的 ctx["layer"]、AIP 对象接口）一律按 layer 读，
        # 只给 type 会让它们 KeyError —— 与其在每处调用点补 or，不如这里一次给全。
        return {"entity_id": entity_id, "type": t, "layer": t, "entity": asdict(entity),
                "parent": pid, "children": children, "siblings": siblings,
                "constraints": [asdict(c) for c in constraints],
                "links": [asdict(l) for l in links],
                "text_context": "\n".join(lines)}

    def community_summary(self, level: str = "site", entity_id: str = None) -> dict:
        """层级社区摘要 — site/gateway/channel 聚合 (rag.ask_community 数据源)"""
        if entity_id:
            sub = self.subgraph(entity_id, depth=2)
            return {"level": level, "entity_id": entity_id, "groups": [{
                "id": entity_id, "name": self.entity_name(entity_id),
                "node_count": sub["node_count"], "edge_count": sub["edge_count"],
                "links": sum(1 for e in sub["edges"] if e["kind"] == "link"),
                "text": f"{entity_id}: {sub['node_count']} 节点 / {sub['edge_count']} 边",
            }], "text": f"{entity_id}: {sub['node_count']} 节点 / {sub['edge_count']} 边"}
        roots = {"site": self.sites, "gateway": self.gateways, "channel": self.channels}.get(level)
        if roots is None:
            raise ValueError(f"未知层级: {level} (可选 site/gateway/channel)")
        depth = {"site": 3, "gateway": 2, "channel": 1}[level]
        groups = []
        for r in roots.values():
            sub = self.subgraph(r.id, depth=depth)
            cons = [c for c in self.constraints.values() if c.entity == r.id]
            groups.append({"id": r.id, "name": self.entity_name(r.id), "type": level,
                           "node_count": sub["node_count"], "edge_count": sub["edge_count"],
                           "links": sum(1 for l in self.links.values()
                                        if r.id in (l.source, l.target)),
                           "constraints": len(cons)})
        text = "\n".join(f"- [{g['type']}] {g['id']} {g['name']}: "
                         f"{g['node_count']} 节点 / {g['edge_count']} 边 / "
                         f"{g['links']} 关系 / {g['constraints']} 约束" for g in groups)
        return {"level": level, "groups": groups, "text": text}

    # ── OWL/RDF 导出 (rdflib; ObjectProperty = R1 关系词表) ──
    def _rdf_graph(self):
        try:
            from rdflib import Graph, Namespace, RDF, RDFS, OWL, Literal, URIRef
        except ImportError as e:
            raise RuntimeError("OWL 导出需要 rdflib (pip install rdflib)") from e
        DG = Namespace("http://dgiot.cloud/ontology#")
        g = Graph()
        g.bind("dgiot", DG); g.bind("owl", OWL); g.bind("rdfs", RDFS)
        g.add((DG[""], RDF.type, OWL.Ontology))
        classes = ENTITY_CLASSES
        # Definition 取自各类 dataclass 的 docstring 首句 —— 不凭空写。
        # GB/T 48000.3 附录A(规范性) 表A.1 要求类带 Definition 与父类；
        # 建根类还有第二个作用：横切关系词的 rdfs:domain 要落到「最宽泛的类」上，
        # 而 domain 是公理不是注释 —— 写窄了推理器会推错类型（hasConstraint 的旧账）。
        class_defs = {
            "Site": "层1 物理站点 — 工业厂/井场/变电站",
            "Gateway": "层2 IO网关/边缘网关 — 物理或虚拟主机",
            "Channel": "层3 协议通道 — 物理世界与数字世界的桥梁",
            "Device": "层4 设备 — RTU/PLC/传感器/保护继电器",
            "Point": "层5 测点 — 最小的数据单元",
            "Constraint": "安全/业务判据 — 说明性文本, 非可执行表达式",
            "DataSource": "数据出口 — 持久化目标",
        }
        g.add((DG["Entity"], RDF.type, OWL.Class))
        g.add((DG["Entity"], RDFS.label, Literal("Entity")))
        g.add((DG["Entity"], RDFS.comment,
               Literal("本体根类 — 七类实体类型的共同上位")))
        for cls in classes.values():
            g.add((DG[cls], RDF.type, OWL.Class))
            g.add((DG[cls], RDFS.label, Literal(cls)))
            g.add((DG[cls], RDFS.comment, Literal(class_defs[cls])))
            g.add((DG[cls], RDFS.subClassOf, DG["Entity"]))
        # GB/T 48000.3 §8.2 a)1) 实体类型互斥性 —— 同一实体不应同时属于两个互斥类别。
        # 依据是**结构性的**: 七类各占一张实体表(_entity_tables), entity_type() 按表查。
        # ⚠️ 「一个 id 只会落进一张」不是自明的 —— 它是**不变量**, 而它的执行者是
        # validate() 开头那段跨表同 id 检查（§8.2 a)2)）。这句话原先只写在这里当
        # **前提**用, 却没有任何东西在保证它: 注入式实测（叶子实体, 不打断任何引用）
        # 撞车后图上 rdf:type 就是 ['Gateway','Site'] —— 两个互斥类同时成立,
        # 而 validate() 的 issues 一条不增。
        # 之所以必须显式声明: 不声明时推理器能把同一个个体推成两类而**不报错** ——
        # hasConstraint 那条旧账正是这个形状（domain 写成 Device ⇒ 挂约束的 Channel
        # 也成了 Device）。那时图里没有 disjointWith, 所以它悄悄成立了。
        cls_names = sorted(classes.values())
        for i, a in enumerate(cls_names):
            for b in cls_names[i + 1:]:
                g.add((DG[a], OWL.disjointWith, DG[b]))
        # 层级属性 —— GB/T 48000.3 附录A 表A.2: 属性也要 Label / Definition / 定义域 / 值域。
        # Definition 说的是这条边把哪两层接起来, 与类 Definition 同源（都是本文件自己的结构), 不凭空写。
        for prop, dom, rng, definition in HIER_PROPS:
            g.add((DG[prop], RDF.type, OWL.ObjectProperty))
            g.add((DG[prop], RDFS.label, Literal(prop)))
            g.add((DG[prop], RDFS.comment, Literal(definition)))
            g.add((DG[prop], RDFS.domain, DG[dom]))
            g.add((DG[prop], RDFS.range, DG[rng]))
        # hasConstraint 不在这条链上 —— 任意实体都能挂约束（见下方写边处用的 c.entity）。
        # 它曾被写成链的第五环（domain=Device），推理器就把挂约束的 Channel/Gateway
        # 也推成 Device：一个个体两个互不可推的类，而推理器不报错（图里没有 disjointWith）。
        g.add((DG["hasConstraint"], RDF.type, OWL.ObjectProperty))
        g.add((DG["hasConstraint"], RDFS.label, Literal("hasConstraint")))
        g.add((DG["hasConstraint"], RDFS.comment,
               Literal("约束归属 — 任意实体 → 挂在该实体上的约束")))
        # 定义域写最宽泛的类, 而不是"实测里主语最多的那个类" —— 理由见表 LINK_REL_SPEC 上方。
        g.add((DG["hasConstraint"], RDFS.domain, DG["Entity"]))
        g.add((DG["hasConstraint"], RDFS.range, DG["Constraint"]))
        for rel in sorted(LINK_RELATIONS):
            dom, rng, definition = LINK_REL_SPEC[rel]
            g.add((DG[rel], RDF.type, OWL.ObjectProperty))
            g.add((DG[rel], RDFS.label, Literal(rel)))
            g.add((DG[rel], RDFS.comment, Literal(definition)))
            g.add((DG[rel], RDFS.domain, DG[dom]))
            g.add((DG[rel], RDFS.range, DG[rng]))
        # 数据属性 —— 表A.2 七项齐: IRI / Name / Label / Definition / 定义域 / 值域 / 属性类型。
        # 属性名 → (实体表, dataclass 字段)。表在这里而不在 DATA_PROP_SPEC 里, 是为了让
        # 规格表只谈"图上长什么样", 与"从哪个字段取"分开 —— 后者是本文件的内部结构。
        data_src = {
            "siteType": ("sites", "type"), "gatewayStatus": ("gateways", "status"),
            "channelProtocol": ("channels", "protocol"), "channelStatus": ("channels", "status"),
            "deviceType": ("devices", "type"), "deviceProtocol": ("devices", "protocol"),
            "slaveId": ("devices", "slaveid"), "deviceStatus": ("devices", "status"),
            "unit": ("points", "unit"), "category": ("points", "category"),
            "severity": ("constraints", "severity"), "ruleKind": ("constraints", "rule_kind"),
            "enabled": ("constraints", "enabled"),
            "dataSourceType": ("datasources", "type"), "dataSourceStatus": ("datasources", "status"),
            "tagCount": ("datasources", "tag_count"),
        }
        for pname in sorted(DATA_PROP_SPEC):
            dom, rng, definition = DATA_PROP_SPEC[pname]
            g.add((DG[pname], RDF.type, OWL.DatatypeProperty))
            g.add((DG[pname], RDFS.label, Literal(pname)))
            g.add((DG[pname], RDFS.comment, Literal(definition)))
            g.add((DG[pname], RDFS.domain, DG[dom]))
            g.add((DG[pname], RDFS.range, URIRef(XSD_NS + rng.split(":", 1)[1])))
        # 读 ENTITY_CLASSES（本文件顶部的唯一事实源）—— 这里原先另有一份 individuals
        # 局部变量, 是那次抽取没抽干净的残留。现在 validate() 也要用「哪几张表产个体」
        # 这个事实（跨表同 id 会不会在图上合并取决于它）, 两处再各写一份必然漂移。
        tables = self._entity_tables()
        for tbl, cls in ENTITY_CLASSES.items():
            for eid in tables[tbl]:
                g.add((DG[eid], RDF.type, DG[cls]))
                g.add((DG[eid], RDFS.label, Literal(self.entity_name(eid))))
        for gw in self.gateways.values():
            g.add((DG[gw.site], DG["hasGateway"], DG[gw.id]))
        for c in self.channels.values():
            g.add((DG[c.gateway], DG["hasChannel"], DG[c.id]))
        for d in self.devices.values():
            g.add((DG[d.channel], DG["hasDevice"], DG[d.id]))
        for p in self.points.values():
            g.add((DG[p.device], DG["hasPoint"], DG[p.id]))
        for c in self.constraints.values():
            if c.entity and self.entity_type(c.entity) not in (None, "link"):
                g.add((DG[c.entity], DG["hasConstraint"], DG[c.id]))
                g.add((DG[c.id], RDFS.comment, Literal(f"{c.rule} [{c.rule_kind}]")))
        for l in self.links.values():
            g.add((DG[l.source], DG[l.relation], DG[l.target]))
            if l.description:
                g.add((DG[l.source], RDFS.comment,
                       Literal(f"-[{l.relation}]-> {l.target}: {l.description}")))
        # ── 本图自述「不含什么」────────────────────────────────────────────
        # 同一个手法见 shacl_shapes(): 形状图根节点带 report["unformatted"] 那几行。
        # 上面那个循环**知道** Link 只画成一条边, 但下载到 .owl/.ttl/.jsonld 的人
        # 看不到这句话 —— 一句都不写, 拿到文件的人就会把本图当成关系体的完整载体。
        # 下面每个数都**现算**, 不手写（手写的数字没有判据守着, 会腐烂）。
        _srt = {(l.source, l.relation, l.target) for l in self.links.values()}
        _coverage = [
            "⚠️ 本图**不是**关系（Link）的完整载体 —— 关系体在本文件里是一等的"
            "（%d 条, 各带 id/props/description）, 到了本图只剩 (source, relation, target) 一条边:"
            % len(self.links),
            "  · Link.id 与 Link.props **一个都不出现**; 边上的描述退化成挂在 source 节点上的"
            " rdfs:comment（不是挂在边上 —— RDF 的边没有身份, 挂不上去）。",
            "  · 同一个 (source, relation, target) 写多条 Link, 在本图里**合并成一条边、不可区分**"
            "（当前种子里这样的重复有 %d 组）。要按边挂属性/证据, 请从引擎取, 别从本图取。"
            % (len(self.links) - len(_srt)),
            "  · 关系的语义类别（结构包含 / 功能关联 / 静态归属）与传播权重只活在 Python 里"
            "（RELATION_IMPACT）; 本图 %d 个关系属性同型, 没有 owl:FunctionalProperty。"
            % len(LINK_RELATIONS),
            "  · 层级边（%s）是**从结构派生**的, 不是存储的 Link; 本图分不出哪条边是存量、哪条是派生。"
            % " / ".join(p for p, _d, _r, _x in HIER_PROPS),
            "  · 约束（Constraint）在本图里是**带 rdfs:comment 的个体**, 不是公理 —— "
            "本文件对它的类定义已写明「说明性文本, 非可执行表达式」。",
            "本节由 _rdf_graph() 生成。SHACL 出口有同形的自述, 写在 shacl_shapes() 的形状图根节点上; "
            "DTDL 出口写在 export_dtdl() 的 meta.coverage 里。",
        ]
        g.add((DG[""], RDFS.comment, Literal("\n".join(_coverage))))
        # 个体的数据属性断言 —— 空值不写边: 空串与"这个字段没有值"在图上不该长成同一个样子,
        # 否则 sh:in 之类的约束会把"没填"当成"填了个非法值"。
        for pname in sorted(data_src):
            tbl_name, fld = data_src[pname]
            for eid, e in getattr(self, tbl_name).items():
                v = getattr(e, fld, None)
                if v is None or (isinstance(v, str) and not v.strip()):
                    continue
                g.add((DG[eid], DG[pname], Literal(v)))
        return g

    def export_owl(self, path: str = None) -> str:
        """导出 OWL/RDF(XML) — 含 R1 关系词表的 ObjectProperty"""
        xml = self._rdf_graph().serialize(format="xml")
        if path:
            from pathlib import Path as _P
            _P(path).write_text(xml, encoding="utf-8")
        return xml

    def export_turtle(self, path: str = None) -> str:
        """导出 Turtle — 同一张 RDF 图的 TTL 序列化"""
        ttl = self._rdf_graph().serialize(format="turtle")
        if path:
            from pathlib import Path as _P
            _P(path).write_text(ttl, encoding="utf-8")
        return ttl

    def export_jsonld(self, path: str = None) -> str:
        """导出 JSON-LD — 同一张 RDF 图的 JSON-LD 序列化

        GB/T 48000.3 §5.3 第二句要求本体「应使用标准化的序列化格式（如 Turtle、JSON-LD 等）」。
        Turtle 早就有（export_turtle），JSON-LD 是这次补的 —— 两个出口与 export_owl()
        序列化的是**同一张图**，判据见 tests/test_ontology_sparql.py 的往返用例。
        """
        js = self._rdf_graph().serialize(format="json-ld", indent=2)
        if path:
            from pathlib import Path as _P
            _P(path).write_text(js, encoding="utf-8")
        return js

    # ── SHACL 形状 (GB/T 48000.3 §5.3 第三句「应支持基于 SHACL 的约束验证」) ──

    def shacl_shapes(self):
        """生成 SHACL 形状图 + 「形式化了哪些 / 没形式化哪些」的报告。

        GB/T 48000.3 §5.3 三句: ① 用 W3C 推荐的本体描述语言(OWL) ② 用标准化序列化
        格式(Turtle/JSON-LD) ③ **应支持基于 SHACL 的约束验证**。本方法给第三句。

        返回 (Graph, report)。report 两栏:
            formatted   —— 已形式化, 逐条给 §8.2 条款号 + 形状数
            unformatted —— 标准要求了、**本域还没有载体**的条文
        后者同时以 rdfs:comment 写进形状图根节点: 不写的话, 下游拿到的是一份
        「没说清自己缺了什么」的形状文件, 会当成完整件用 —— 同一个手法见
        _ontology/projects/dlas_align_20260920/check_desc_items.py 的「覆盖面前提」三行。

        ⚠️ 本方法只**生成形状**。「支持基于 SHACL 的约束验证」这句话要成立, 得真跑
        一次 validate_shacl()（需 pyshacl）—— 两件事分开, 是为了不把
        「导出了形状文件」读成「验证过了」。没有 pyshacl 就说「导出 SHACL 形状」。
        """
        from rdflib import Graph, Namespace, RDF, RDFS, Literal, BNode, URIRef
        from rdflib.collection import Collection
        from rdflib.namespace import SH

        DG = Namespace("http://dgiot.cloud/ontology#")
        g = Graph()
        g.bind("dgiot", DG); g.bind("sh", SH); g.bind("rdfs", RDFS)
        root = DG["Shapes"]
        # sh:ShapesGraph 是 SHACL 词表里的真词, 但不在 rdflib 的 DefinedNamespace 表里
        # ⇒ 只能拼完整 IRI。（SH["..."] 对表外的词是 fail-loud, 属特性: 拼错的 SHACL 词
        # 会在生成期就报, 而不是产出一份带错词、pyshacl 静默忽略的形状。）
        g.add((root, RDF.type, URIRef(str(SH) + "ShapesGraph")))
        g.add((root, RDFS.label, Literal("iotStudio 边缘本体 SHACL 形状")))

        # 一个类一个 NodeShape —— 层级约束与属性约束都挂在**同一个**形状下。
        # 拆成两个 targetClass 相同的形状, 下游拿到的是"同一个类有两份定义",
        # 而 SHACL 没说两份怎么合。node_shapes 与 OWL 侧同源(ENTITY_CLASSES)。
        node_shapes = {cls: DG[cls + "Shape"] for cls in ENTITY_CLASSES.values()}
        for cls, ns_ in node_shapes.items():
            g.add((ns_, RDF.type, SH.NodeShape))
            g.add((ns_, SH.targetClass, DG[cls]))
            g.add((ns_, RDFS.label, Literal(cls + " 的形状")))

        def prop_shape(node_shape, path, **kw):
            """挂一条属性形状。kw 的键是 SHACL 局部名（minCount / datatype / in …）。

            `in` 是 Python 关键字, 属性写法用不了, 所以统一走 SH[...] 取值。
            """
            b = BNode()
            g.add((node_shape, SH.property, b))
            g.add((b, SH.path, path))
            for name, val in kw.items():
                g.add((b, SH[name], val))
            return b

        C_B3 = "§8.2 b)3) 枚举值约束"
        C_B4 = "§8.2 b)4) 取值约束"

        # (类名, 属性名) → ({约束}, {条款})。同一个 (类, 属性) 的约束**合在一条形状里**:
        # 拆成"枚举一条 + 类型一条"下发, 就是同一条路径两份定义, 合并规则没人规定。
        prop_spec: Dict[Any, Any] = {}

        def want(cls, pname, clause, **kw):
            kwd, clauses = prop_spec.setdefault((cls, pname), ({}, set()))
            kwd.update(kw)
            clauses.add(clause)

        # §8.2 b)3) 枚举值约束 —— FIELD_ENUMS 是**设计意图(字段注释) ∪ 实测已用值**。
        # 两者都要: 只取注释会把实测里合法的值判违规（实测 Device.type 注释写
        # rtu/relay/plc/sensor/meter, 而库里跑着 simulator/oil_well/opc_device,
        # 注释里一个都没有 ⇒ 35 个合法个体会被判违规）; 只取实测则等于把"现在长这样"
        # 固化成"只能这样"。表外值实测 0 处, 判据在 tests 里（红了要人看, 不许自动放行）。
        n_enum = 0
        for pname in sorted(FIELD_ENUMS):
            dom = DATA_PROP_SPEC[pname][0]
            lst = BNode()
            Collection(g, lst, [Literal(v) for v in FIELD_ENUMS[pname]])
            want(dom, pname, C_B3, **{"in": lst})
            n_enum += 1

        # §8.2 b)4) 取值约束（类型与下限）—— 值域读 DATA_PROP_SPEC, 与 OWL 侧
        # rdfs:range **同源**, 不许两处各写一份（写窄了推理器推错类型的旧账）。
        n_range = 0
        n_min = 0
        for pname in sorted(DATA_PROP_SPEC):
            dom, rng, _defn = DATA_PROP_SPEC[pname]
            want(dom, pname, C_B4, datatype=URIRef(XSD_NS + rng.split(":", 1)[1]))
            n_range += 1
            if rng == "xsd:integer":
                want(dom, pname, C_B4, minInclusive=Literal(0))
                n_min += 1

        for (cls, pname), (kwd, clauses) in sorted(prop_spec.items()):
            prop_shape(node_shapes[cls], DG[pname],
                       name=Literal(pname),
                       description=Literal(" / ".join(sorted(clauses))),
                       **kwd)

        # §8.2 c)1) 功能性 + c)3) 层次结构 —— 一个子实体**恰好**有一个父实体。
        # 两条落在同一组形状上:
        #   maxCount 1 ← c)1)「每个标准只能由一个机构发布」那类功能性约束
        #   minCount 1 ← c)3)「章可包含零个或多个条」反过来问"这条属于哪一章"
        # 路径走 sh:inversePath: 图上写的是父→子的边（Site hasGateway Gateway）,
        # 而约束问的是"这个网关属于哪个站点" ⇒ 反向走。
        # 边名读 HIER_PROPS, **不拼字符串** —— 拼字符串就是把同一个事实写第二遍。
        by_child = {rng: (p, dom) for p, dom, rng, _d in HIER_PROPS}
        n_hier = 0
        for child_tbl, (fld, _ptbl) in sorted(PARENT_REF.items()):
            child_cls = ENTITY_CLASSES[child_tbl]
            prop_name, parent_cls = by_child.get(child_cls, (None, None))
            # 对账: PARENT_REF 说「哪几层要约束」, HIER_PROPS 说「边叫什么」。
            # 两个事实源在这里合一次; 合不上当场抛, 不等下游拿形状去咬数据。
            if prop_name != "has" + child_cls or parent_cls != ENTITY_CLASSES[fld]:
                raise ValueError(
                    "层级事实源漂移: PARENT_REF[%r]→%s 与 HIER_PROPS 的 %r 对不上"
                    % (child_tbl, child_cls, by_child.get(child_cls)))
            back = BNode()
            g.add((back, SH.inversePath, DG[prop_name]))
            prop_shape(node_shapes[child_cls], back,
                       minCount=Literal(1), maxCount=Literal(1), nodeKind=SH.IRI,
                       name=Literal("%s 必须恰好属于一个 %s" % (child_cls, parent_cls)),
                       description=Literal("§8.2 c)1) 功能性 + c)3) 层次结构 — 基数依据 PARENT_REF"))
            n_hier += 1

        # ── 没形式化的条文: 必须报出来, 且写进图里 ──
        unformatted = [
            ("§8.2 a)2) 全局唯一标识规则",
             "信息单元需要具有全局唯一的标识符",
             "由 IRI 承担（个体 IRI = 命名空间#id）—— RDF 里 IRI **语法上必然唯一**, "
             "形状既不需要也表达不了它。真正的风险在上游: 两个实体映到同一个 IRI 时"
             "图上会**合并成一个**个体、挂上两个互斥类型（实测 ['Gateway','Site']）。"
             "那是引擎的**数据不变量**, 执行者 = src/ontology.py 的 validate() 开头"
             "那段跨表同 id 检查, 判据在 tests/test_ontology_relations.py"),
            ("§8.2 b)1) 属性唯一性约束",
             "标准编号需要保持唯一性",
             "本域字段白名单里没有『需要保持唯一值的属性』—— 现场标识类字段"
             "（设备编号/位号）未纳入公开白名单, 是脱敏决策不是遗漏"),
            ("§8.2 b)2) 日期有效性验证",
             "实施日期应晚于或等于发布日期",
             "图上没有任何日期属性 —— 边缘本体的字段里不含日期"),
            ("§8.2 b)4) 取值约束（部分未形式化）",
             "约束类型的取值应限定为强制性或推荐性",
             "量程与报警限（Point.range / Point.alarm）未纳入字段白名单 ⇒ "
             "这一类取值范围没有载体, 本形状只覆盖到「类型 + 下限」"),
            ("§8.2 c)2) 版本替代关系",
             "废止标准必须指向替代标准或标明废止日期",
             "本域没有版本/废止概念 —— 记『本域不适用』, 不硬造"),
        ]
        # 数现算, 不手写 —— 手写的数字没有判据, 会腐烂。
        pairs = len(ENTITY_CLASSES) * (len(ENTITY_CLASSES) - 1) // 2
        formatted = [
            ("§8.2 a)1) 实体类型互斥性", "同一信息单元不能同时属于两个互斥的类别",
             "%d 对 owl:disjointWith（OWL 侧, 不在 SHACL 形状里）" % pairs),
            ("§8.2 c)1) 功能性属性约束 + c)3) 层次结构约束",
             "每个标准只能由一个机构发布 / 章可包含零个或多个条",
             "%d 条 sh:inversePath + sh:minCount 1 + sh:maxCount 1" % n_hier),
            ("§8.2 b)3) 枚举值约束", "标准状态的取值应限定在预定义的枚举范围内",
             "%d 条 sh:in" % n_enum),
            ("§8.2 b)4) 取值约束", "约束类型的取值应限定为强制性或推荐性",
             "%d 条 sh:datatype（值域与 OWL 侧 rdfs:range 同源）+ %d 条 sh:minInclusive 0"
             % (n_range, n_min)),
            ("§8.2 c)4) 引用关系区分规则",
             "标准间引用与条款引用需要通过不同的属性来实现",
             "OWL 侧: %d 个关系词各是独立属性 + hasConstraint（不在 SHACL 形状里）"
             % len(LINK_RELATIONS)),
        ]
        note = ["⚠️ 本形状图**未覆盖**的 GB/T 48000.3 §8.2 条文（不写出来会被下游当成已覆盖）:",
                "  ⚠️ 「形状未覆盖」≠「没人管」—— 每条的 why 里写了执行者落在哪：",
                "     落在引擎的（如 a)2 的唯一性 = validate() 的跨表同 id 检查）与",
                "     确实没做的（如 b)2 图上没有日期属性）在这个列表里长得一样，",
                "     引用前逐条读 why，别按条数读成「缺 5 项」。"]
        for clause, req, why in unformatted:
            note.append("  · %s —「%s」: %s" % (clause, req, why))
        note.append("本节由 shacl_shapes() 生成, 与它返回的 report['unformatted'] 同源。")
        g.add((root, RDFS.comment, Literal("\n".join(note))))

        report = {
            "node_shapes": len(node_shapes),
            "property_shapes": n_hier + len(prop_spec),
            "formatted": [{"clause": c, "requirement": r, "how": h}
                          for c, r, h in formatted],
            "unformatted": [{"clause": c, "requirement": r, "why": w}
                            for c, r, w in unformatted],
        }
        return g, report

    def export_shacl(self, path: str = None) -> str:
        """导出 SHACL 形状（Turtle）—— 与 export_owl / export_turtle / export_jsonld 并列的出口。

        ⚠️ 导出的是**形状**, 不是验证结论。要结论得跑 validate_shacl()。
        """
        ttl = self.shacl_shapes()[0].serialize(format="turtle")
        if path:
            from pathlib import Path as _P
            _P(path).write_text(ttl, encoding="utf-8")
        return ttl

    def validate_shacl(self):
        """拿 pyshacl 真跑一次验证 —— 返回 (conforms, 报告文本, 形状图)。

        GB/T 48000.3 §5.3 第三句是「**应支持基于 SHACL 的约束验证**」, 只导出形状
        不算支持。pyshacl 缺失时**抛**, 不返回 conforms=True ——
        「验不了」与「验过了没问题」必须长得不一样（同一个手法见 sparql() 那条:
        非法查询抛异常而不是返空列表）。
        """
        try:
            from pyshacl import validate
        except ImportError as e:
            raise RuntimeError(
                "SHACL 验证需要 pyshacl —— 它声明在 requirements.txt 的**测试依赖**段"
                "（不在运行依赖里, 生产环境不装）; 没有它只能导出形状, "
                "不能说『支持基于 SHACL 的约束验证』") from e
        shapes, _report = self.shacl_shapes()
        conforms, _results_graph, text = validate(self._rdf_graph(), shacl_graph=shapes)
        return bool(conforms), text, shapes

    # ── SPARQL / 图统计 (与上面两个导出器同一张图) ──
    def sparql(self, query: str) -> List[Dict[str, Any]]:
        """SPARQL 查询 — 跑在 _rdf_graph() 上，与 export_owl/export_turtle 同一张图。

        非法查询**抛异常，不返回空列表**：「查不到」与「查询写错了」
        在结果上必须长得不一样，否则前端会把语法错误读成"没有数据"。
        """
        rows: List[Dict[str, Any]] = []
        for row in self._rdf_graph().query(query):
            rows.append({str(k): (None if v is None else str(v))
                         for k, v in zip(row.labels, row)})
        return rows

    def triple_count(self) -> int:
        """图上三元组数 — 与 export_owl()/export_turtle() 同一张图。

        判据 (tests/test_ontology_sparql.py)：
            triple_count() == len(Graph().parse(data=export_owl(), format="xml"))
        即「界面显示的那个数」必须等于「你下载到的 .owl 里数出来的数」。
        """
        return len(self._rdf_graph())

    def rdf_stats(self) -> Dict[str, Any]:
        """图上各类构件计数 — 全部现算；界面上的这些数一律取这里，不许手写。"""
        g = self._rdf_graph()          # 先调用：rdflib 缺失时给出中文报错
        from rdflib import RDF, OWL
        # 前缀只列图上真正用到的 —— 否则会把 rdflib 默认绑的一堆无关前缀也报出去
        terms = ({str(t) for t in g.subjects()} | {str(t) for t in g.predicates()}
                 | {str(t) for t in g.objects()})
        return {
            "triples": len(g),
            "classes": len(set(g.subjects(RDF.type, OWL.Class))),
            "object_properties": len(set(g.subjects(RDF.type, OWL.ObjectProperty))),
            "datatype_properties": len(set(g.subjects(RDF.type, OWL.DatatypeProperty))),
            "namespaces": sorted(p for p, u in g.namespaces()
                                 if p and any(t.startswith(str(u)) for t in terms)),
        }

    # ── R3: 图分析 (AEGIS 两项移植 + GDS 式中心性; 只借算法思想) ──
    # 关系影响语义: (传播方向, 权重); has_defect/has_issue 是静态归属, 不传播
    RELATION_IMPACT = {
        "powered_by": ("reverse", 1.0),   # 供电方失效 → 供电对象受击 (断电链: t→s 遍历)
        "feeds_into": ("forward", 0.9),   # 上游失效 → 下游断流 (s→t)
        "controls":   ("forward", 0.8),   # 控制方失效 → 被控对象失管
        "monitors":   ("forward", 0.5),   # 监测方失效 → 被监测对象失监
        "maps_to":    ("both", 0.3),      # 映射一致性破坏, 双向弱传播
        "relates_to": ("forward", 0.3),   # 泛关联, 弱传播
        "has_defect": None,
        "has_issue": None,
    }
    _HIER_DOWN_W = 1.0   # 包容失效下行: 父挂子随
    _HIER_UP_W = 0.2     # 上行仅"上级感知降级"

    def _directed_adjacency(self) -> Dict[str, List[dict]]:
        """带权有向邻接 — 影响传播视角 (层级按方向定权; Link 按关系语义定向; has_* 不入图)"""
        adj: Dict[str, List[dict]] = {}

        def add(a: str, b: str, kind: str, relation: str, weight: float):
            adj.setdefault(a, []).append({"to": b, "kind": kind,
                                          "relation": relation, "weight": weight})

        for g in self.gateways.values():
            add(g.site, g.id, "hierarchy", "", self._HIER_DOWN_W)
            add(g.id, g.site, "hierarchy", "", self._HIER_UP_W)
        for c in self.channels.values():
            add(c.gateway, c.id, "hierarchy", "", self._HIER_DOWN_W)
            add(c.id, c.gateway, "hierarchy", "", self._HIER_UP_W)
        for d in self.devices.values():
            add(d.channel, d.id, "hierarchy", "", self._HIER_DOWN_W)
            add(d.id, d.channel, "hierarchy", "", self._HIER_UP_W)
        for p in self.points.values():
            add(p.device, p.id, "hierarchy", "", self._HIER_DOWN_W)
            add(p.id, p.device, "hierarchy", "", self._HIER_UP_W)
        for ds in self.datasources.values():
            add(ds.gateway, ds.id, "hierarchy", "", self._HIER_DOWN_W)
            add(ds.id, ds.gateway, "hierarchy", "", self._HIER_UP_W)
        for l in self.links.values():
            spec = self.RELATION_IMPACT.get(l.relation)
            if not spec:
                continue  # 静态归属不传播
            direction, w = spec
            if direction in ("forward", "both"):
                add(l.source, l.target, "link", l.relation, w)
            if direction in ("reverse", "both"):
                add(l.target, l.source, "link", l.relation, w)
        return adj

    def _undirected_adjacency(self) -> Dict[str, List[dict]]:
        """无向邻接 — 路径发现视角 (功能连通性; has_defect/has_issue 归属边不计入路径)"""
        adj: Dict[str, List[dict]] = {}

        def add(a: str, b: str, kind: str, relation: str = ""):
            adj.setdefault(a, []).append({"to": b, "kind": kind, "relation": relation})

        for gid, g in self.gateways.items():
            add(g.site, gid, "hierarchy"); add(gid, g.site, "hierarchy")
        for cid, c in self.channels.items():
            add(c.gateway, cid, "hierarchy"); add(cid, c.gateway, "hierarchy")
        for did, d in self.devices.items():
            add(d.channel, did, "hierarchy"); add(did, d.channel, "hierarchy")
        for pid, p in self.points.items():
            add(p.device, pid, "hierarchy"); add(pid, p.device, "hierarchy")
        for ds in self.datasources.values():
            add(ds.gateway, ds.id, "hierarchy"); add(ds.id, ds.gateway, "hierarchy")
        for l in self.links.values():
            if l.relation in ("has_defect", "has_issue"):
                continue
            add(l.source, l.target, "link", l.relation)
            add(l.target, l.source, "link", l.relation)
        return adj

    def graph_path(self, from_id: str, to_id: str, max_paths: int = 10) -> dict:
        """全部最短路径 (BFS 层级 + 功能关系边; AEGIS allShortestPaths 思路)"""
        if self.entity_type(from_id) is None:
            raise KeyError(f"Entity {from_id} not found")
        if self.entity_type(to_id) is None:
            raise KeyError(f"Entity {to_id} not found")
        if from_id == to_id:
            return {"found": True, "from": from_id, "to": to_id, "length": 0,
                    "paths": [[]], "nodes": [from_id]}
        adj = self._undirected_adjacency()
        dist = {from_id: 0}
        frontier = [from_id]
        while frontier:
            nxt = []
            for cur in frontier:
                for e in adj.get(cur, []):
                    if e["to"] not in dist:
                        dist[e["to"]] = dist[cur] + 1
                        nxt.append(e["to"])
            frontier = nxt
        if to_id not in dist:
            return {"found": False, "from": from_id, "to": to_id,
                    "length": None, "paths": [], "nodes": [],
                    "message": "两实体在当前功能图中不连通"}
        paths: List[List[dict]] = []

        def backwalk(node: str, acc: List[dict]):
            if len(paths) >= max_paths:
                return
            if node == from_id:
                paths.append(list(reversed(acc)))
                return
            for e in adj.get(node, []):
                if dist.get(e["to"], -1) == dist[node] - 1:
                    backwalk(e["to"], acc + [{"from": e["to"], "to": node,
                                              "kind": e["kind"], "relation": e["relation"]}])

        backwalk(to_id, [])
        first = paths[0] if paths else []
        nodes = [from_id] + [hop["to"] for hop in first]
        return {"found": True, "from": from_id, "to": to_id,
                "length": dist[to_id], "paths": paths, "nodes": nodes}

    def graph_impact(self, entity_id: str, decay: float = 0.5,
                     max_radius: int = 4, min_confidence: float = 0.05) -> dict:
        """风险传播 blast-radius — 加权传播 + 指数衰减

        语义: 该实体失效时谁受影响、置信多高。
        置信 = 沿最优路径边权连乘 × decay^跳数 (max-confidence 松弛)。
        """
        if self.entity_type(entity_id) is None:
            raise KeyError(f"Entity {entity_id} not found")
        adj = self._directed_adjacency()
        conf = {entity_id: 1.0}
        best_edge: Dict[str, dict] = {}
        parent: Dict[str, str] = {}
        frontier = [entity_id]
        for hop in range(1, max_radius + 1):
            nxt = []
            for cur in frontier:
                for e in adj.get(cur, []):
                    # 衰减从第 2 跳起算: 直接受害者不吃传播不确定性
                    cand = conf[cur] * e["weight"] * (decay ** (hop - 1))
                    if cand >= min_confidence and cand > conf.get(e["to"], 0.0):
                        conf[e["to"]] = cand
                        best_edge[e["to"]] = {"from": cur, "to": e["to"],
                                              "kind": e["kind"], "relation": e["relation"]}
                        parent[e["to"]] = cur
                        nxt.append(e["to"])
            frontier = nxt
        affected = []
        for eid, c in conf.items():
            if eid == entity_id:
                continue
            chain, node = [], eid
            while node != entity_id and node in parent:
                chain.append(best_edge[node])
                node = parent[node]
            severity = ("critical" if c >= 0.7 else "high" if c >= 0.4
                        else "medium" if c >= 0.2 else "low")
            affected.append({"id": eid, "type": self.entity_type(eid),
                             "name": self.entity_name(eid),
                             "confidence": round(c, 4), "severity": severity,
                             "hops": len(chain), "path": list(reversed(chain))})
        affected.sort(key=lambda x: -x["confidence"])
        summary = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        for a in affected:
            summary[a["severity"]] += 1
        return {"root": entity_id, "decay": decay, "max_radius": max_radius,
                "min_confidence": min_confidence, "count": len(affected),
                "summary": summary, "affected": affected}

    def graph_centrality(self, mode: str = "degree", top: int = 10) -> dict:
        """GDS 式中心性 (百级节点纯 Python 足够) — degree | betweenness"""
        adj = self._undirected_adjacency()
        nodes = list(dict.fromkeys(
            list(self.sites) + list(self.gateways) + list(self.channels)
            + list(self.devices) + list(self.points)
            + list(self.constraints) + list(self.datasources) + list(self.links)))
        if mode == "degree":
            scores = {n: float(len(adj.get(n, []))) for n in nodes}
        elif mode == "betweenness":
            scores = {n: 0.0 for n in nodes}
            neighbors = {n: [e["to"] for e in adj.get(n, [])] for n in nodes}
            for s in nodes:                      # Brandes 算法
                stack, order = [], []
                sigma = {s: 1}
                d = {s: 0}
                queue = [s]
                while queue:
                    v = queue.pop(0)
                    order.append(v); stack.append(v)
                    for w in neighbors.get(v, []):
                        if w not in d:
                            d[w] = d[v] + 1
                            sigma[w] = 0
                            queue.append(w)
                        if d[w] == d[v] + 1:
                            sigma[w] += sigma[v]
                delta = {w: 0.0 for w in order}
                for w in reversed(order):
                    if sigma.get(w):
                        coeff = (1 + delta[w]) / sigma[w]
                        for v in neighbors.get(w, []):
                            if d.get(v) == d.get(w, -1) - 1 and sigma.get(v):
                                delta[v] += sigma[v] * coeff    # 后继汇入前驱
                    if w != s:
                        scores[w] += delta[w]
            scores = {n: v / 2 for n, v in scores.items()}   # 无向图折半
        else:
            raise ValueError(f"未知中心性模式: {mode} (可选 degree|betweenness)")
        ranked = sorted(scores.items(), key=lambda kv: -kv[1])[:max(1, top)]
        return {"mode": mode, "graph_nodes": len(nodes),
                "top": [{"id": n, "type": self.entity_type(n),
                         "name": self.entity_name(n), "score": round(v, 4)}
                        for n, v in ranked]}

    # ── 树形导出 ──
    def tree(self, site_id: str = None) -> dict:
        """导出完整本体树，用于前端渲染"""
        sites = [self.sites[site_id]] if site_id else list(self.sites.values())
        result = []
        for site in sites:
            s = {**asdict(site), "gateways": []}
            for gw in self.gateways.values():
                if gw.site != site.id: continue
                g = {**asdict(gw), "channels": []}
                for ch in self.channels.values():
                    if ch.gateway != gw.id: continue
                    c = {**asdict(ch), "devices": []}
                    for dev in self.devices.values():
                        if dev.channel != ch.id: continue
                        d = {**asdict(dev), "points": []}
                        d["points"] = [asdict(p) for p in self.points.values() if p.device == dev.id]
                        c["devices"].append(d)
                    g["channels"].append(c)
                s["gateways"].append(g)
            result.append(s)
        return result

    # ── push_point ──
    def push_point(self, point_id: str, value: float, quality: int = 192):
        """推一个测点值到中枢。主题走 dlink 形态，不是本体路径。"""
        topic = self.dlink_topic(point_id)
        payload = json.dumps({
            "ts": int(__import__("time").time() * 1000),
            "v": value, "q": quality
        })
        if self._mqtt:
            self._mqtt.publish(topic, payload)
        return topic, payload

    # ── evaluate ──
    def evaluate(self, point_id: str, value: float) -> List[Constraint]:
        """评估某个测点值是否触发约束"""
        triggered = []
        point = self.points.get(point_id)
        if not point: return triggered
        for c in self.constraints.values():
            if not c.enabled: continue
            if c.entity and c.entity not in (point_id, point.device): continue
            # 简单阈值检查
            if point.alarm:
                alarm = point.alarm
                if "high" in alarm and value > alarm["high"]:
                    triggered.append(c)
                elif "hh" in alarm and value > alarm["hh"]:
                    triggered.append(c)
                elif "low" in alarm and value < alarm["low"]:
                    triggered.append(c)
                elif "ll" in alarm and value < alarm["ll"]:
                    triggered.append(c)
        return triggered

    # ── judge_point ──
    def judge_point(self, point_id: str, value: float) -> Dict[str, Any]:
        """按**测点自带阈值**判定一个值是否安全 —— 唯一的判据出口

        为什么单拎出来、而不是复用上面的 evaluate():
          1. **阈值属于测点，不属于约束。** evaluate 遍历 constraints 再拿
             point.alarm 去比，于是把每一条 entity 匹配的约束都算成"触发" ——
             问"套压安全吗"会答出「实时提交延迟≤300ms」这种无关条目。
          2. evaluate 的 contract 是"返回被触发的约束"，它没有"未触发"的表达，
             也就没法回答"安全"—— 而安全问句要的正是这个。

        判定次序 hh > high > low > ll，同侧取已越过的**最严**一档。
        `alarm` 为空时回落到 `range`；两者都没有就返回 unknown ——
        **没有判据就不说安全**，宁可答"无判据"也不要给一个假的安全结论。
        """
        point = self.points.get(point_id)
        if not point:
            return {"status": "unknown", "safe": None, "reason": f"测点 {point_id} 不存在"}
        if value is None:
            return {"status": "unknown", "safe": None, "unit": point.unit,
                    "reason": "无当前值，无法判定"}

        a = point.alarm or {}
        v = float(value)
        out = {"value": v, "unit": point.unit, "name": point.name}

        # 越上限：hh 比 high 严，先判 hh
        for key, level in (("hh", "hh"), ("high", "high")):
            if key in a and v > a[key]:
                return {**out, "status": level, "safe": False, "limit": a[key],
                        "margin": round(v - a[key], 4),
                        "reason": f"{point.name} {v}{point.unit} 超上限 "
                                  f"{a[key]}{point.unit}（超 {round(v - a[key], 4)}）"}
        # 越下限：ll 比 low 严
        for key, level in (("ll", "ll"), ("low", "low")):
            if key in a and v < a[key]:
                return {**out, "status": level, "safe": False, "limit": a[key],
                        "margin": round(a[key] - v, 4),
                        "reason": f"{point.name} {v}{point.unit} 低于下限 "
                                  f"{a[key]}{point.unit}（低 {round(a[key] - v, 4)}）"}

        if a:
            # 未越限：报出离得最近的那条边界，让"安全"带上余量而不只是一个字
            hi = min([a[k] for k in ("high", "hh") if k in a], default=None)
            lo = max([a[k] for k in ("low", "ll") if k in a], default=None)
            margins = []
            if hi is not None:
                margins.append(hi - v)
            if lo is not None:
                margins.append(v - lo)
            return {**out, "status": "ok", "safe": True,
                    "limit": hi if hi is not None else lo,
                    "margin": round(min(margins), 4) if margins else None,
                    "reason": f"{point.name} {v}{point.unit} 在判据内"
                              + (f"（最近边界余量 {round(min(margins), 4)}）" if margins else "")}

        rng = point.range or []
        if len(rng) == 2:
            lo, hi = rng
            if v < lo or v > hi:
                return {**out, "status": "out_of_range", "safe": False,
                        "limit": hi if v > hi else lo,
                        "margin": round(abs(v - (hi if v > hi else lo)), 4),
                        "reason": f"{point.name} {v}{point.unit} 超出量程 [{lo}, {hi}]"}
            return {**out, "status": "ok", "safe": True, "limit": hi,
                    "margin": round(min(hi - v, v - lo), 4),
                    "reason": f"{point.name} {v}{point.unit} 在量程 [{lo}, {hi}] 内"}

        return {**out, "status": "unknown", "safe": None,
                "reason": f"{point.name} 未定义报警阈值/量程，无判据可依"}

    # ── 序列化 ──
    def to_dict(self) -> dict:
        return {
            "sites": {k: asdict(v) for k, v in self.sites.items()},
            "gateways": {k: asdict(v) for k, v in self.gateways.items()},
            "channels": {k: asdict(v) for k, v in self.channels.items()},
            "devices": {k: asdict(v) for k, v in self.devices.items()},
            "points": {k: asdict(v) for k, v in self.points.items()},
            "constraints": {k: asdict(v) for k, v in self.constraints.items()},
            "datasources": {k: asdict(v) for k, v in self.datasources.items()},
            "links": {k: asdict(v) for k, v in self.links.items()},
        }

    # ── load from Parse ──
    def load_from_parse(self) -> dict:
        """从 SQLite 回读本体实体 — sync_to_parse 的逆操作

        没有它, sync_to_parse 就是**只写不读**: 用户在本体管理页建的对象落库
        成功、界面正常, 服务一重启引擎却只从硬编码种子重建, 那些对象就没了
        (数据还在库里, 只是再没人把它读回来)。这种失败不报错也不报警。

        ⚠️ 只认 `data` 列, 不认那些展开的列。展开列是给 SQL 查询用的副本,
        它们比数据类**少**字段: Device.devaddr / Device.product / Point.range /
        Constraint.rule_kind / DataSource.tables / Link.props 都只在 data 里。
        照展开列重建会把这些丢成默认值 —— 而 devaddr/product 一丢, 这条设备的
        数据就发不到中枢(见 Device docstring), 且同样是静默的。

        单行坏数据只跳过、不抛: 一行读不回来不该让整个本体加载失败。
        某张表读不到时**保留该层现有内容**, 不清空 —— 读失败和"本来就没有"
        是两回事, 后者在全新部署下与现有内容(空)等价, 前者不该误伤。
        """
        try:
            from .parse_lite import get_db
        except ImportError:
            from parse_lite import get_db

        plan = (
            ("sites", "ontology_site", Site),
            ("gateways", "ontology_gateway", Gateway),
            ("channels", "ontology_channel", Channel),
            ("devices", "ontology_device", Device),
            ("points", "ontology_point", Point),
            ("constraints", "ontology_constraint", Constraint),
            ("datasources", "ontology_datasource", DataSource),
            ("links", "ontology_link", Link),
        )
        db = get_db()
        fresh: Dict[str, Dict[str, Any]] = {}
        loaded = skipped = 0
        try:
            for attr, table, cls in plan:
                try:
                    rows = db.execute(
                        f"SELECT objectId, data FROM {table}").fetchall()
                except Exception:
                    continue          # 表不存在或读失败: 保留该层现有内容
                bucket: Dict[str, Any] = {}
                for row in rows:
                    payload = _decode_data_column(_row_get(row, "data", 1))
                    if payload is None:
                        skipped += 1
                        continue
                    payload.setdefault("id", _row_get(row, "objectId", 0) or "")
                    try:
                        node = cls(**_filter_fields(cls, payload))
                    except (TypeError, ValueError):
                        skipped += 1
                        continue
                    if not getattr(node, "id", ""):
                        skipped += 1
                        continue
                    bucket[node.id] = node
                    loaded += 1
                fresh[attr] = bucket
        finally:
            db.close()

        # 全部读完了才换 —— 中途出错时不留下一个被清空一半的引擎
        for attr, bucket in fresh.items():
            setattr(self, attr, bucket)
        return {"loaded": loaded, "skipped": skipped,
                "counts": self.health()["counts"]}

    # ── sync to Parse ──
    def sync_to_parse(self, tenant_id: str = "default"):
        """将本体实体同步到 SQLite"""
        try:
            from .parse_lite import get_db, now_iso
        except ImportError:
            from parse_lite import get_db, now_iso

        db = get_db(); now = now_iso()

        for s in self.sites.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_site (objectId,name,type,location,description,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)",
                (s.id, s.name, s.type, s.location or "", s.description, json.dumps(asdict(s)), now, now))

        for g in self.gateways.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_gateway (objectId,name,ip,site_id,hostname,os,status,installed,channels,notes,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (g.id, g.hostname or g.id, g.ip, g.site, g.hostname, g.os, g.status,
                 json.dumps(g.installed), json.dumps(g.channels), g.notes, json.dumps(asdict(g)), now, now))

        for ch in self.channels.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_channel (objectId,name,gateway_id,protocol,endpoint,status,config,devices,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (ch.id, ch.name, ch.gateway, ch.protocol, ch.endpoint, ch.status,
                 json.dumps(ch.config), json.dumps(ch.devices), json.dumps(asdict(ch)), now, now))

        for d in self.devices.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_device (objectId,name,channel_id,type,protocol,slave_id,manufacturer,model,status,points,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (d.id, d.name, d.channel, d.type, d.protocol, d.slaveid, d.manufacturer,
                 d.model, d.status, json.dumps(d.points), json.dumps(asdict(d)), now, now))

        for p in self.points.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_point (objectId,name,device_id,unit,description,register,alarm,range_min,range_max,category,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (p.id, p.name, p.device, p.unit, p.description,
                 json.dumps(p.register), json.dumps(p.alarm),
                 p.range[0] if len(p.range) > 0 else None,
                 p.range[1] if len(p.range) > 1 else None,
                 p.category, json.dumps(asdict(p)), now, now))

        for c in self.constraints.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_constraint (objectId,name,rule,entity,severity,source,action,enabled,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (c.id, c.name, c.rule, c.entity, c.severity, c.source, c.action,
                 1 if c.enabled else 0, json.dumps(asdict(c)), now, now))

        for ds in self.datasources.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_datasource (objectId,gateway_id,type,connection,status,tag_count,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)",
                (ds.id, ds.gateway, ds.type, ds.connection, ds.status,
                 ds.tag_count, json.dumps(asdict(ds)), now, now))

        for l in self.links.values():
            db.execute(
                "INSERT OR REPLACE INTO ontology_link (objectId,source_id,target_id,relation,description,data,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?)",
                (l.id, l.source, l.target, l.relation, l.description,
                 json.dumps(asdict(l)), now, now))

        db.commit(); db.close()
        return {"status": "synced", "counts": self.health()["counts"]}

    # ── validate ──
    def validate(self) -> dict:
        """完整性校验 — 检查实体间引用完整性、必要字段"""
        issues = []
        # GB/T 48000.3 §8.2 a)2) 全局唯一标识规则 —— 一个 id 只能落进**一张**实体表。
        # 引擎只有**一个** id 空间: entity_type() 就是它的证据（id → 恰好一个类型）,
        # 分表只是对它的分区。撞车的后果按「是否产个体」分两种, 不能混着说:
        #   · 两张都在 ENTITY_CLASSES 里(前 7 张): 个体的 IRI 是 `DG[id]`、**与表无关**
        #     ⇒ 图上把它们**合并成一个个体**、挂上两个互斥的 rdf:type —— 与本文件
        #     自己声明的 owl:disjointWith 直接矛盾, 下载到的 .owl 自己打自己。
        #   · 涉及 link 表: link 不产个体（图上 0 个 rdf:type）, 不合并; 但
        #     entity_type() 遍历表返回**第一个**命中 ⇒ 它**静默答一个类型**, 不报冲突。
        # ★ 本条原先只是 _rdf_graph() 上方的一句注释前提（"一个 id 只会落进一张"）,
        # 没有任何执行者。注入式实测（叶子实体, 不打断任何引用）: 撞车后
        # issues **一条不增**、valid 不变, 而图上 rdf:type 已是 ['Gateway','Site']。
        # 放在最前: id 有歧义时, 下面每一条检查读到的都可能是**另一个**实体。
        seen_id: Dict[str, str] = {}
        for tname, table in self._entity_tables().items():
            for eid in table:
                if eid not in seen_id:
                    seen_id[eid] = tname
                    continue
                both_individual = tname in ENTITY_CLASSES and seen_id[eid] in ENTITY_CLASSES
                issues.append(
                    f"id '{eid}': {seen_id[eid]} 与 {tname} 两张实体表同时占用"
                    + ("（个体 IRI 相同 ⇒ 图上会合并成一个、挂两个互斥的类型）"
                       if both_individual else
                       "（entity_type() 只报先查到的 %s, 冲突本身看不见）" % seen_id[eid]))
        # 检查 dangling references —— 表驱动, 与 enterprise.register_objects 共用 PARENT_REF。
        # 注意: 这里**空引用也报** ("site '' not found") —— 对完整性体检来说
        # 「没挂父层」本身就是缺陷。register_objects 那边对空引用是放过的
        # (与单条 create 一致, 空的留给必填兜底)。两边策略不同, 但「哪些字段
        # 指向哪层」这件事只有一份定义, 不会再各改各的。
        for layer, (field, ptable) in PARENT_REF.items():
            parent = getattr(self, ptable)
            for ent in getattr(self, layer + "s").values():
                ref = getattr(ent, field, "")
                if ref not in parent:
                    issues.append(
                        f"{layer.capitalize()} {ent.id}: {field} '{ref}' not found")
        for l in self.links.values():
            for end in (l.source, l.target):
                if self.entity_type(end) is None:
                    issues.append(f"Link {l.id}: endpoint '{end}' not found")
            if l.source == l.target:
                issues.append(f"Link {l.id}: 自环边")
            if l.relation not in LINK_RELATIONS:
                issues.append(f"Link {l.id}: 未知关系词 '{l.relation}' (词表: {sorted(LINK_RELATIONS)})")
        for c in self.constraints.values():
            if c.rule_kind not in ("mapping", "validation", "state", "inference", "automation"):
                issues.append(f"Constraint {c.id}: 未知 rule_kind '{c.rule_kind}'")
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "counts": self.health()["counts"]
        }

    def health(self) -> dict:
        return {
            "ontology": "5-layer: Site > Gateway > Channel > Device > Point + Link",
            # 边缘内部文法 —— 与 CLAUDE.md 的『规范』和 abac.TOPIC_RE 三方对齐。
            # 这里原先多写了一个 {channel} 段（6 段），是本仓唯一这么写的字符串：
            # TOPIC_RE 强制 5 段、abac_live_test 用的也是 5 段，于是 health()
            # 自述了一个本机 ACL 会直接 deny 的文法。channel 在 5 段式里不进主题，
            # 它是本体第 3 层，只用于寻径（见 get_path）。
            "mqtt_topic": "dgiot/{site}/{gateway}/{device}/{point}/data",
            # 中枢认的两套（上行 thing / 下行 device），别和上面那条混为一谈
            "dlink_topic_up": "$dg/thing/{productId}/{devaddr}/properties/report",
            "dlink_topic_down": "$dg/device/{productId}/{devaddr}/properties",
            "version": "2.1",
            "counts": {
                "sites": len(self.sites),
                "gateways": len(self.gateways),
                "channels": len(self.channels),
                "devices": len(self.devices),
                "points": len(self.points),
                "constraints": len(self.constraints),
                "datasources": len(self.datasources),
                "links": len(self.links),
            }
        }


# ═══════════════════════════════════════════════════════════
# 工厂方法: 从发现数据构建本体
# ═══════════════════════════════════════════════════════════

def build_edge_ontology() -> OntologyEngine:
    """从 2026-07-12 边缘 IO 网关 2047文件逐字精读结果构建完整本体

    数据源: 本地内部资料目录
    分析范围: 2047 文件, 含 INI/TXT/DAT/DLL/LOG/ZIO/CHM/DOC
    """
    engine = OntologyEngine()

    # ── 层1: Site ──
    engine.register(Site(
        id="industry_c1", name="示例工业园区", type="oil_field",
        location="黑龙江省某工业市",
        description="PLANT_A_SITE_C(DEVICE_C) + PLANT_A_SITE_D(DEVICE_D)。IO网关 127.0.0.1(EDGE-HOST-01)"
              " + Oracle 198.18.0.11:1521 + RTDB 198.18.0.12:8889"
    ))

    # ── 层2: Gateway (含完整已安装组件) ──
    engine.register(Gateway(
        id="gw_edge01", ip="127.0.0.1", site="industry_c1",
        hostname="EDGE-HOST-01",
        os="Windows Server 2016 (10.0.14393)",
        status="online",
        installed={
            "平台": "GENERIC_VENDOR 7.x / GENERIC_HMI v6.0.0.1",
            "守护进程": "GENERIC_SVC_WATCHDOG.exe (6服务自动重启/心跳监控)",
            "GENERIC_LEGACY_PROTO": "v6.x — 80+ Modbus TCP 到井口RTU ← 主采集入口",
            "GENERIC_SVC_IO": "workers ×7 — A11 TCP 到 127.0.0.1:8889 ← 功图采集",
            "GENERIC_HMI": "v6.0.0.1, PID 18400 — 数据汇聚 + Oracle 提交 (无直接现场连接)",
            "GENERIC_SVC_COMMIT": "12组并发提交 (DB0~DB11), 300ms实时/500ms历史",
            "GENERIC_OPC_DRV": "活跃 — 采集 WELL_A/WELL_B/WELL_C/WELL_D/WELL_E (OPC DA)",
            "Oracle Client": "11.2.0 @ E:\\app\\Administrator\\product\\11.2.0\\client_1",
            "OPC Core Components": "2.00 SDK v2.00.220 (32-bit, installed 2025-12-16)",
            "RTDB Server": "v6.0.1.9 @ GENERIC_RTDB.exe (已停用)",
        },
        channels=["ch_modbus_tcp","ch_a11_rtu","ch_oracle","ch_opc_da","ch_realtime_db",
                   "ch_eforcecon","ch_redundancy","ch_dtu_pool",
                   "ch_s7","ch_mitsubishi","ch_beckhoff","ch_omron","ch_ge"],
        notes="现场采集两大入口: GENERIC_LEGACY_PROTO(Modbus TCP :53001→80+RTU) + GENERIC_SVC_IO(A11 :8889)。"
              "GENERIC_HMI 只连 Oracle :1521 做数据出口。"
              "OPC DA(DCOM :135)从未活跃, 站内网段无实际连接。"
              "GENERIC_OPC_DRV/ 是历史废配置, 系统实际不用 OPC。"
    ))

    # ── 层3: Channels (扩展: DTU/PLC/冗余) ──
    channels = [
        # 原有通道
        Channel(id="ch_opc_da", gateway="gw_edge01", name="OPC DA Client",
            protocol="opc_da", endpoint="DCOM :135 → 198.51.100.20/.21/.22/.23/.24",
            status="running", config={
                "driver": "E:\\GENERIC_IO_ROOT\\IO Servers\\GENERIC_OPC_DRV\\vendor_api.dll",
                "progid": "KEPware.KEPServerEx.V4",
                "clsid": "{6E6170F0-FF2D-11D2-8087-00105AA8F840}",
                "binary_record": "DeviceStruct 256B (22 fields) + DefinedStruct 96B (17 fields)",
                "tag_name_len": 63,
                "is_apartment": 1,
            },
            devices=["dev_opc_device_1"]),
        Channel(id="ch_a11_rtu", gateway="gw_edge01", name="A11 RTU 功图采集",
            protocol="a11_tcp", endpoint="TCP → 127.0.0.1:8889",
            status="running", config={
                "driver": "E:\\GENERIC_IO_ROOT\\IO Servers\\GENERIC_RTU_DRV\\vendor_api.dll (v6.0.1.34)",
                "sql_service": "A11SQLSERVICE.exe → Oracle (1s周期, 1 ADO)",
                "time_sync": "开启",
                "device_check": "30min在线判定",
                "break_time_files": "1669个井点功图断点记录 (BreakTime/)",
            }, devices=[]),
        Channel(id="ch_modbus_tcp", gateway="gw_edge01", name="Modbus TCP",
            protocol="modbus_tcp", endpoint=":502 → IPv6 2001:db8:... ×20+ RTU",
            status="running", config={
                "driver": "GENERIC_MODBUS_DRV/vendor_api.dll (back/run/)",
                "scan_cycle": "100ms",
                "timeout": "3-20s",
                "fault_threshold": "4 failures → offline",
                "resume_cycle": 30,
                "fc6_write": True, "fc16_write": True,
            }, devices=[]),
        Channel(id="ch_oracle", gateway="gw_edge01", name="Oracle 数据出口",
            protocol="oracle_sql", endpoint="198.18.0.11:1521/orcl",
            status="running", config={
                "connection": "Provider=OraOLEDB.Oracle.1;User ID=YOUR_SCHEMA;Data Source=orcl",
                "password": "CHANGEME (from DataSource.ini)",
                "ado_count": 4, "execute_cycle_ms": 1000,
                "key_tables": ["GENERIC_DYNA_DIAG_T (481万行)",
                    "GENERIC_DEVICE_RUN_HIST (23万行)", "GENERIC_WELL_BASE_INFO (966口井)",
                    "GENERIC_POINT_REL_WELL (4567测点)"],
            }, devices=[]),
        Channel(id="ch_realtime_db", gateway="gw_edge01", name="RTDB 实时库",
            protocol="realtime_db", endpoint="198.18.0.12:8889",
            status="stopped", config={
                "server": "GENERIC_RTDB.exe v6.0.1.9",
                "api": "RTDBAPI.dll (313KB)",
                "tag_paths": "/gscyc/{WellID}NODE/{DeviceCode}...",
            }, devices=[]),
        Channel(id="ch_eforcecon", gateway="gw_edge01", name="eForceCon DB",
            protocol="eforcecon", status="stopped"),
        # 新增通道
        Channel(id="ch_redundancy", gateway="gw_edge01", name="冗余通道",
            protocol="redundancy", endpoint="198.51.100.102:6000/6001",
            status="running", config={
                "partner_ip": "198.51.100.102",
                "recv_port": 6000, "send_port": 6001,
                "heartbeat_ms": 1500, "timeout_count": 3,
                "failover_time": "4.5s",
            }, devices=[]),
        Channel(id="ch_dtu_pool", gateway="gw_edge01", name="DTU协议池 (16种)",
            protocol="dtu_multi", endpoint="TCP/UDP/Serial → 现场DTU设备",
            status="running", config={
                "drivers": {
                    "DTU_SUNWAY": "GENERIC_SCADA 动态IP", "DTU_SUNWAY_COMMSERVER": "通用TCP Server",
                    "DTU_SUNWAY_MULTIPORT": "TCP多端口", "DTU_SUNWAY_UDP": "通用UDP",
                    "DTU_FOUR_FAITH": "四信", "DTU_HONGDIAN": "宏电",
                    "DTU_InHand": "映翰通", "DTU_BHYN": "博海粤能",
                    "DTU_DATA6211": "唐山平升Data6211", "DTU_DATA86": "唐山平升Data6100",
                    "DTU_DLHB_HJT212": "HJ/T212国标", "DTU_DQQY": "某工业庆远",
                    "DTU_ETUNG": "亿通", "DTU_FENGSHI": "山东锋士",
                    "DTU_CAIMAO": "莱司凯茂", "DTU_LANDI": "唐山蓝迪",
                },
            }, devices=[]),
        Channel(id="ch_s7", gateway="gw_edge01", name="Siemens S7",
            protocol="s7comm", endpoint="TCP :102 → Siemens PLC",
            status="stopped", config={"driver": "s7onlinx.dll (159KB) + W95_s7.dll"},
            devices=[]),
        Channel(id="ch_mitsubishi", gateway="gw_edge01", name="Mitsubishi PLC",
            protocol="mitsubishi", endpoint="Serial/TCP → 三菱PLC",
            status="stopped", config={"driver": "MruComDll.dll (518KB)"},
            devices=[]),
        Channel(id="ch_beckhoff", gateway="gw_edge01", name="Beckhoff TwinCAT",
            protocol="twincat_ads", endpoint="ADS → Beckhoff PLC",
            status="stopped", config={"driver": "TcAdsDll.dll (221KB)"},
            devices=[]),
        Channel(id="ch_omron", gateway="gw_edge01", name="Omron PLC",
            protocol="omron", status="stopped",
            config={"driver": "HCTPXYIF.DLL + HKCANDLL.dll + IMPDRVR.dll"},
            devices=[]),
        Channel(id="ch_ge", gateway="gw_edge01", name="GE Fanuc",
            protocol="ge_snp", status="stopped",
            config={"driver": "GEFSNP32.DLL/GEFSRX32.DLL/GEFTCP32.DLL/GEFEGD32.DLL"},
            devices=[]),
    ]
    for ch in channels:
        engine.register(ch)

    # ── 层4: Devices (12 保护继电器 + 抽油机井 + 仿真设备) ──
    relay_types = [
        ("00","RELAY-L","线路保护",20,"Ia+Ib+Ic+Ua+Ub+Uc+F+P+Q+cosφ"),
        ("10","RELAY-T","变压器差动保护",15,"Ua+Ub+Uc+F"),
        ("20","DBPA-31A","电源备投",13,""),
        ("30","RELAY-B","母联保护",20,"Ia+Ib+Ic"),
        ("40","电动机保护","电动机保护",19,"Ia+Ib+Ic+Ua+Ub+Uc+F+P+cosφ"),
        ("50","DST-22D","变压器差动保护",15,""),
        ("60","DSB-22D","变压器后备保护",20,""),
        ("70","DSL-24D","线路保护",20,""),
        ("80","DGP-11","电容器差动保护",21,"F+Ias+Ibs+Ics+Ian+Ibn+Icn+I0+Iacd+Ibcd+Iccd+Iazd+Ibzd+Iczd+Ua+Ub+Uc+Uab+Ubc+Uca+U2"),
        ("90","DGP-12","电容器后备保护",24,"F+Ua+Ub+Uc+Uab+Ubc+Uca+U2+Uas+Ubs+Ucs+Uabs+Ubcs+Ucas+U2s+Uf+Ias+Ibs+Ics+Iabs+I2s+P+R+X"),
        ("100","DGP-13","电容器接地保护",22,"F+Uas+U30s+U30n+U30h+Ia+3I0+Ian+Ibn+Icn+E+U1+Rg"),
        ("110","RELAY-M/RELAY-T","电动机差动保护",19,"Ia+Ib+Ic+Ia2+Ib2+Ic2+F+Ua+Ub+Uc+P+Q+cosφ"),
    ]
    for code, model, name, ch_cnt, telemetry in relay_types:
        engine.register(Device(
            id=f"dev_relay_{code}", channel="ch_a11_rtu",
            name=f"{model} {name}",
            type="relay", protocol="a11_tcp",
            manufacturer="国电南自/四方继保", model=model,
            status="online",
        ))

    # OPC DA 通用设备
    engine.register(Device(
        id="dev_opc_device_1", channel="ch_opc_da",
        name="OPC 通用设备 (KEPware KEPServerEx V4)",
        type="opc_device", protocol="opc_da",
        manufacturer="KEPware", model="KEPServerEx V4",
        status="online",
    ))

    # 16 口井口 RTU (from runBack1.zio)
    well_rtus = [
        "DEV_A","DEV_B","S21","Y9065","Y9371","Y9721","Y9831","Y9832",
        "YK1_20","YP1","YX1_6","YX1_7","YX1_8","YZ2_7_4X","YZ4_2_3","YPing1",
    ]
    for well_id in well_rtus:
        engine.register(Device(
            id=f"dev_well_{well_id}", channel="ch_modbus_tcp",
            name=f"井口 {well_id}",
            type="oil_well", protocol="modbus_tcp",
            manufacturer="某工业基地", model="A11 RTU",
            status="online",
        ))

    # 18 台仿真泵 (from runBack1.zio DeviceTable.csv)
    for i in range(1, 19):
        engine.register(Device(
            id=f"dev_sim_sj{i:04d}", channel="ch_dtu_pool",
            name=f"仿真泵 SJ{i:04d}",
            type="simulator", protocol="force_hls_sim",
            manufacturer="GENERIC_VENDOR", model="FORCE_HLS_SIM",
            status="offline",
        ))

    # ── 层5: Points (代表性测点 + IoT 遥测公式) ──
    register_formula = "Y×170/8192 (A)"
    voltage_formula = "Y×170/8192 (V)"
    power_formula = "Y×170×8.5×√3/8192 (W)"
    freq_formula = "50 + Y×2/8192 (Hz)"

    sample_points = [
        Point(id="pt_ia", device="dev_relay_00", name="A相电流 Ia", unit="A",
              register={"address":0,"type":"uint16","formula":register_formula},
              alarm={"high":5.0,"low":0.01}, category="遥测",
              description="RELAY-L 线路保护 A 相电流"),
        Point(id="pt_ib", device="dev_relay_00", name="B相电流 Ib", unit="A",
              register={"address":1,"type":"uint16","formula":register_formula},
              alarm={"high":5.0,"low":0.01}, category="遥测"),
        Point(id="pt_ic", device="dev_relay_00", name="C相电流 Ic", unit="A",
              register={"address":2,"type":"uint16","formula":register_formula},
              alarm={"high":5.0,"low":0.01}, category="遥测"),
        Point(id="pt_ua", device="dev_relay_10", name="A相电压 Ua", unit="V",
              register={"address":0,"type":"uint16","formula":voltage_formula},
              alarm={"high":260.0,"low":198.0}, category="遥测",
              description="RELAY-T 变压器差动保护 A 相电压"),
        Point(id="pt_p", device="dev_relay_00", name="有功功率 P", unit="W",
              register={"address":6,"type":"uint16","formula":power_formula},
              alarm={}, category="遥测"),
        Point(id="pt_f", device="dev_relay_00", name="频率 F", unit="Hz",
              register={"address":9,"type":"uint16","formula":freq_formula},
              alarm={"high":50.5,"low":49.5}, category="遥测"),
        # 抽油机井测点示例
        Point(id="pt_tgp", device="dev_well_DEV_A", name="套压 TGP", unit="MPa",
              register={"protocol":"modbus_tcp","path":"/DEVICE_D/WELL_001/STATION_01WELL_001TGP"},
              alarm={"high":25.0}, category="遥测", description="套管压力"),
        Point(id="pt_zwg", device="dev_well_DEV_A", name="总无功 ZWG", unit="kVar",
              register={"protocol":"modbus_tcp","path":"/DEVICE_D/WELL_001/STATION_01WELL_001ZWG"},
              alarm={}, category="遥测"),
        Point(id="pt_zygx", device="dev_well_DEV_A", name="总有功 ZYGX", unit="kW",
              register={"protocol":"modbus_tcp","path":"/DEVICE_D/WELL_001/STATION_01WELL_001ZYGX"},
              alarm={}, category="遥测"),
        Point(id="pt_zhl", device="dev_well_DEV_A", name="总回流 ZHL", unit="t/d",
              register={"protocol":"modbus_tcp","path":"/DEVICE_D/WELL_001/STATION_01WELL_001ZHL"},
              alarm={}, category="遥测"),
    ]
    for pt in sample_points:
        engine.register(pt)

    # ── Constraints (Logic 层, 全面覆盖) ──
    constraints = [
        # --- 采集约束 (GENERIC_HMI.ini) ---
        Constraint(id="c_commit_real", name="实时提交延迟≤300ms",
            rule="CommitRealSpan=300ms → 数据采集到入库延迟≤300ms",
            entity="ch_oracle", severity="info", source="GENERIC_HMI.ini",
            action="监控 CommitRealSpan 配置"),
        Constraint(id="c_commit_batch", name="单次提交上限15000点",
            rule="CommitTagOnce=15000 → 单批最大15000标签值",
            entity="ch_oracle", severity="warning", source="GENERIC_HMI.ini",
            action="超限触发分片提交"),
        Constraint(id="c_cache_flush", name="缓存刷新阈值100K",
            rule="MaxTagValueCount=100000 → 内存缓存>100K点强制写历史文件",
            entity="ch_oracle", severity="warning", source="GENERIC_HMI.ini",
            action="IsSaveFile=1 启用文件缓存保护"),
        # --- 通道约束 (IoChannelCfg.ini) ---
        Constraint(id="c_io_timeout", name="IO 设备超时 30s",
            rule="设备无响应 >30s → 判定离线",
            entity="gw_edge01", severity="danger", source="IoChannelCfg.ini",
            action="设备状态→offline + 触发告警"),
        Constraint(id="c_channel_spacing", name="通道打开间隔 10s",
            rule="同一类型通道启动间隔 ≥10s → 防止冲击",
            entity="gw_edge01", severity="info", source="IoChannelCfg.ini",
            action="通道启动调度器控制"),
        # --- 数据库约束 (SqlFilSet.ini) ---
        Constraint(id="c_ado_pool", name="Oracle 连接池上限 4",
            rule="ADOCOUNT=4 → 最大 4 个并发 ADO 连接",
            entity="ch_oracle", severity="warning", source="SqlFilSet.ini",
            action="连接池耗尽 → 排队等待"),
        # --- 冗余约束 (RedunndancyCfg.ini) ---
        Constraint(id="c_redundancy", name="冗余心跳 1500ms×3",
            rule="心跳 1500ms, 3 次超时 (4.5s) → 主备切换",
            entity="ch_redundancy", severity="danger", source="RedunndancyCfg.ini",
            action="备机 198.51.100.102 接管"),
        # --- 设备告警约束 (Device.ini) ---
        Constraint(id="c_overcurrent", name="线路过流保护",
            rule="Ia/Ib/Ic > 5A + 持续>1s → 过流告警→跳闸",
            entity="dev_relay_00", severity="danger", source="Device.ini RELAY-L",
            action="跳闸 + SOE 事件 + 推送告警"),
        Constraint(id="c_voltage_abnormal", name="电压异常保护",
            rule="U < 198V or U > 260V + 持续>10s → 电压异常告警",
            entity="dev_relay_10", severity="danger", source="Device.ini RELAY-T",
            action="告警 + SOE + 通知调度"),
        Constraint(id="c_motor_stall", name="电动机堵转保护",
            rule="电流突变 + 转速=0 + 持续>3s → 堵转告警",
            entity="dev_relay_40", severity="danger", source="Device.ini RELAY-M",
            action="停机 + 告警 + 检修工单"),
        # --- A11 RTU 约束 (Time.ini) ---
        Constraint(id="c_time_sync", name="RTU 时间同步",
            rule="TimeSyn=1 → 每次连接同步 RTU 时钟",
            entity="ch_a11_rtu", severity="info", source="Time.ini",
            action="NTP 对齐"),
        Constraint(id="c_device_check", name="设备在线判定 30min",
            rule="StatusTime=30min → 每30分钟检查一次设备在线状态",
            entity="ch_a11_rtu", severity="warning", source="Time.ini",
            action="离线设备标记 + 重连"),
        # --- 功图数据约束 ---
        Constraint(id="c_breaktime", name="功图断点监测",
            rule="BreakTime 超过阈值未更新 → 功图数据断流告警",
            entity="ch_a11_rtu", severity="warning",
            source="GENERIC_RTU_DRV/BreakTime/ (1669 files)",
            action="标记测点 stale + 触发补采"),
        # --- 已知故障模式 ---
        Constraint(id="c_commit_crash", name="GENERIC_SVC_COMMIT 崩溃保护",
            rule="GENERIC_SVC_COMMIT 访问违规 (C0000005) → GENERIC_SVC_WATCHDOG 自动重启 (≤3次)",
            entity="gw_edge01", severity="critical",
            source="Log/ crash dumps (10 times, 2022-2023)",
            action="进程重启 + 重启次数>3 → 升级告警"),
        Constraint(id="c_data_epoch_zero", name="未初始化数据拦截",
            rule="Value=0.000000 + ts=1970-01-01 → 存储失败 (epoch zero)",
            entity="ch_oracle", severity="warning",
            source="IOSaveErr/ (大量 CommitErr)",
            action="丢弃未初始化数据 + 记录日志"),
    ]
    for c in constraints:
        engine.register(c)

    # ── DataSources ──
    datasources = [
        DataSource(id="ds_oracle", gateway="gw_edge01", type="oracle",
            connection="198.18.0.11:1521/orcl (YOUR_SCHEMA)",
            status="online", tag_count=4_814_742),
        DataSource(id="ds_realtime_db", gateway="gw_edge01", type="realtime_db",
            connection="198.18.0.12:8889",
            status="stopped", tag_count=500),
        DataSource(id="ds_redundancy", gateway="gw_edge01", type="redundancy",
            connection="198.51.100.102:6000/6001",
            status="running", tag_count=0),
        DataSource(id="ds_syncplatform", gateway="gw_edge01", type="sync",
            connection="D:\\SyncPlatform0402\\bin\\SyncTaskManager.exe",
            status="unknown", tag_count=0),
    ]
    for ds in datasources:
        engine.register(ds)

    # ── R1: 显式关系种子 (词表: maps_to/relates_to/has_defect/has_issue 对齐 DGAIOT 生态
    #    + 边缘域 feeds_into/monitors/controls/powered_by) — 数据链与电力链 ──
    seed_links = [
        # 电力链: 保护继电器 → 井口/泵 (跨通道能量依赖)
        Link("lnk_pw_a", "dev_well_DEV_A", "dev_relay_00", "powered_by",
             "DEV_A 井馈线由 RELAY-L 线路保护供电"),
        Link("lnk_pw_b", "dev_well_DEV_B", "dev_relay_00", "powered_by",
             "DEV_B 井馈线由 RELAY-L 线路保护供电"),
        Link("lnk_pw_s1", "dev_sim_sj0001", "dev_relay_40", "powered_by",
             "仿真泵母线由电动机保护供电"),
        # 监测: 保护设备 → 被保护对象 (跨通道)
        Link("lnk_mon_a", "dev_relay_00", "dev_well_DEV_A", "monitors",
             "RELAY-L 监测 DEV_A 馈线电流/电压 (Ia/Ib/Ic/Ua/Ub/Uc)"),
        Link("lnk_mon_s1", "dev_relay_40", "dev_sim_sj0001", "monitors",
             "电动机保护监测仿真泵堵转/过流"),
        # 数据链: 采集通道 → 提交出口
        Link("lnk_flow_mb", "ch_modbus_tcp", "ch_oracle", "feeds_into",
             "Modbus 遥测经 GENERIC_HMI 汇入 Oracle 提交通道 (300ms 实时)"),
        Link("lnk_flow_a11", "ch_a11_rtu", "ch_oracle", "feeds_into",
             "A11 功图数据经 A11SQLSERVICE 汇入 Oracle (1s 周期)"),
        Link("lnk_flow_red", "ch_redundancy", "ch_oracle", "feeds_into",
             "冗余同步数据汇入 Oracle 出口"),
        # 映射: 出口→通道, 测点→协议路径
        Link("lnk_map_ds", "ds_oracle", "ch_oracle", "maps_to",
             "Oracle 数据出口映射到其协议通道"),
        Link("lnk_map_rtdb", "ds_realtime_db", "ch_realtime_db", "maps_to",
             "RTDB 出口映射到实时库通道"),
        Link("lnk_map_tgp", "pt_tgp", "ch_modbus_tcp", "maps_to",
             "套压测点映射到 Modbus 采集路径",
             props={"path": "/DEVICE_D/WELL_001/STATION_01WELL_001TGP"}),
        # 泛关联
        Link("lnk_rel_bus", "dev_relay_00", "dev_relay_10", "relates_to",
             "同段母线相邻保护 (线路保护/变压器差动)"),
        Link("lnk_rel_red", "ds_redundancy", "ch_redundancy", "relates_to",
             "冗余出口与冗余通道联动"),
        # 已知缺陷/问题 (props.constraint 引用约束, 闭环到 Logic 层)
        Link("lnk_def_epoch", "ch_oracle", "ds_oracle", "has_defect",
             "epoch zero 存储失败 (大量 CommitErr)",
             props={"constraint": "c_data_epoch_zero"}),
        Link("lnk_iss_crash", "gw_edge01", "ch_oracle", "has_issue",
             "GENERIC_SVC_COMMIT C0000005 崩溃 10 次 (2022-2023, GENERIC_SVC_WATCHDOG 自动重启)",
             props={"constraint": "c_commit_crash"}),
        Link("lnk_iss_break", "ch_a11_rtu", "gw_edge01", "has_issue",
             "1669 个功图断点文件 (BreakTime/)",
             props={"constraint": "c_breaktime"}),
        # 控制: 网关 → 通道策略
        Link("lnk_ctl_mb", "gw_edge01", "ch_modbus_tcp", "controls",
             "GENERIC_LEGACY_PROTO 通道启停由网关调度 (同型通道间隔≥10s)",
             props={"constraint": "c_channel_spacing"}),
        Link("lnk_ctl_red", "gw_edge01", "ch_redundancy", "controls",
             "心跳 1500ms×3 裁决主备切换 (4.5s)",
             props={"constraint": "c_redundancy"}),
        Link("lnk_ctl_a11", "gw_edge01", "ch_a11_rtu", "controls",
             "RTU 时间同步与 30min 在线判定策略",
             props={"constraint": "c_device_check"}),
    ]
    for l in seed_links:
        engine.register(l)

    # ── R1: 约束 rule_kind 五分类标注 (mapping/validation/state/inference/automation) ──
    rule_kinds = {
        "c_commit_real": "mapping", "c_commit_batch": "mapping",
        "c_cache_flush": "mapping", "c_ado_pool": "mapping",
        "c_overcurrent": "validation", "c_voltage_abnormal": "validation",
        "c_motor_stall": "validation", "c_breaktime": "validation",
        "c_data_epoch_zero": "validation",
        "c_io_timeout": "state", "c_device_check": "state", "c_redundancy": "state",
        "c_channel_spacing": "automation", "c_time_sync": "automation",
        "c_commit_crash": "inference",
    }
    for cid, kind in rule_kinds.items():
        if cid in engine.constraints:
            engine.constraints[cid].rule_kind = kind

    return engine


# ═══════════════════════════════════════════════════════════
# 引擎装配 — 落库优先, 库空才播种
# ═══════════════════════════════════════════════════════════

def build_engine() -> OntologyEngine:
    """构建本体引擎 — 落库数据优先, 库空才退回硬编码示例种子

    **需要引擎的入口都走这里**, 不要各自 build_edge_ontology()。种子是
    演示数据, 用户建的对象只存在于库里; 直接播种造出来的引擎不含它们,
    而且失败是静默的 —— 界面照常, 只是东西不见了。

    以前 graphrag_api 与 plugin_runtime 各建各的, 后果不只是"都没回读",
    还在于**插件拿到的本体和 API 服务的本体是两个不同实例**: 通过 API
    建的对象, 插件永远看不见。

    库空(全新部署)时退回种子, 保持原有开箱行为。
    """
    engine = OntologyEngine()
    loaded = engine.load_from_parse()
    if loaded["loaded"]:
        logger.info(
            "本体: 从 parse.db 回读 — %s%s", loaded["counts"],
            f", 跳过 {loaded['skipped']} 行坏数据" if loaded["skipped"] else "")
        return engine
    logger.info("本体: parse.db 无数据, 加载示例 IO 服务器本体")
    return build_edge_ontology()
