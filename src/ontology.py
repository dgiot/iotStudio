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
    installed: Dict[str, str] = field(default_factory=dict)   # {"IoMonitor":"7.x","Oracle":"11.2.0"}
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
    """SWRL 规则 / 安全判据"""
    id: str
    name: str
    rule: str                         # SWRL-like: "temperature>85 + duration>60s → alarm L1"
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
            from rdflib import Graph, Namespace, RDF, RDFS, OWL, Literal
        except ImportError as e:
            raise RuntimeError("OWL 导出需要 rdflib (pip install rdflib)") from e
        DG = Namespace("http://dgiot.cloud/ontology#")
        g = Graph()
        g.bind("dgiot", DG); g.bind("owl", OWL); g.bind("rdfs", RDFS)
        g.add((DG[""], RDF.type, OWL.Ontology))
        classes = {"site": "Site", "gateway": "Gateway", "channel": "Channel",
                   "device": "Device", "point": "Point",
                   "constraint": "Constraint", "datasource": "DataSource"}
        for cls in classes.values():
            g.add((DG[cls], RDF.type, OWL.Class))
            g.add((DG[cls], RDFS.label, Literal(cls)))
        hier = [("hasGateway", "Site", "Gateway"), ("hasChannel", "Gateway", "Channel"),
                ("hasDevice", "Channel", "Device"), ("hasPoint", "Device", "Point"),
                ("hasConstraint", "Device", "Constraint")]
        for prop, dom, rng in hier:
            g.add((DG[prop], RDF.type, OWL.ObjectProperty))
            g.add((DG[prop], RDFS.domain, DG[dom]))
            g.add((DG[prop], RDFS.range, DG[rng]))
        for rel in sorted(LINK_RELATIONS):
            g.add((DG[rel], RDF.type, OWL.ObjectProperty))
            g.add((DG[rel], RDFS.label, Literal(rel)))
        individuals = [
            (self.sites, "Site"), (self.gateways, "Gateway"), (self.channels, "Channel"),
            (self.devices, "Device"), (self.points, "Point"),
            (self.constraints, "Constraint"), (self.datasources, "DataSource"),
        ]
        for table, cls in individuals:
            for eid, e in table.items():
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

def build_131_ontology() -> OntologyEngine:
    """从 2026-07-12 131 IO网关 2047文件逐字精读结果构建完整本体

    数据源: 本地内部资料目录
    分析范围: 2047 文件, 含 INI/TXT/DAT/DLL/LOG/ZIO/CHM/DOC
    """
    engine = OntologyEngine()

    # ── 层1: Site ──
    engine.register(Site(
        id="industry_c1", name="示例工业园区", type="oil_field",
        location="黑龙江省某工业市",
        description="PLANT_A_SITE_C(DEVICE_C) + PLANT_A_SITE_D(DEVICE_D)。IO网关 127.0.0.1(IO-SERVER-01)"
              " + Oracle 192.0.2.1.129:1521 + RTDB 192.0.2.1.102:8889"
    ))

    # ── 层2: Gateway (含完整已安装组件) ──
    engine.register(Gateway(
        id="gw_131", ip="127.0.0.1", site="industry_c1",
        hostname="IO-SERVER-01",
        os="Windows Server 2016 (10.0.14393)",
        status="online",
        installed={
            "平台": "GENERIC_VENDOR ForceControl 7.x / IoMonitor v6.0.0.1",
            "守护进程": "psNTService.exe (6服务自动重启/心跳监控)",
            "LegacyComm": "v6.x — 80+ Modbus TCP 到井口RTU ← 主采集入口",
            "IOMan": "workers ×7 — A11 TCP 到 127.0.0.1:8889 ← 功图采集",
            "IoMonitor": "v6.0.0.1, PID 18400 — 数据汇聚 + Oracle 提交 (无直接现场连接)",
            "IoCommit": "12组并发提交 (DB0~DB11), 300ms实时/500ms历史",
            "OPC_FC_Client": "活跃 — 采集 JB1V2/DX6PZ/Z22Y/Z1PZ/DX1ZRZ (OPC DA)",
            "Oracle Client": "11.2.0 @ E:\\app\\Administrator\\product\\11.2.0\\client_1",
            "OPC Core Components": "2.00 SDK v2.00.220 (32-bit, installed 2025-12-16)",
            "RTDB Server": "v6.0.1.9 @ RTDBServer64.exe (已停用)",
        },
        channels=["ch_modbus_tcp","ch_a11_rtu","ch_oracle","ch_opc_da","ch_realtime_db",
                   "ch_eforcecon","ch_redundancy","ch_dtu_pool",
                   "ch_s7","ch_mitsubishi","ch_beckhoff","ch_omron","ch_ge"],
        notes="现场采集两大入口: LegacyComm(Modbus TCP :53001→80+RTU) + IOMan(A11 :8889→130)。"
              "IoMonitor 只连 Oracle :1521 做数据出口。"
              "OPC DA(DCOM :135)从未活跃, 10.0.0.x 无实际连接。"
              "OPC_FC_Client/ 是历史废配置, 系统实际不用 OPC。"
    ))

    # ── 层3: Channels (扩展: DTU/PLC/冗余) ──
    channels = [
        # 原有通道
        Channel(id="ch_opc_da", gateway="gw_131", name="OPC DA Client",
            protocol="opc_da", endpoint="DCOM :135 → 198.51.100.20/.3/.18.194/.26.6.3",
            status="running", config={
                "driver": "E:\\IO ServerOnLine\\IO Servers\\OPC_FC_Client\\ioapi.dll",
                "progid": "KEPware.KEPServerEx.V4",
                "clsid": "{6E6170F0-FF2D-11D2-8087-00105AA8F840}",
                "binary_record": "DeviceStruct 256B (22 fields) + DefinedStruct 96B (17 fields)",
                "tag_name_len": 63,
                "is_apartment": 1,
            },
            devices=["dev_opc_device_1"]),
        Channel(id="ch_a11_rtu", gateway="gw_131", name="A11 RTU 功图采集",
            protocol="a11_tcp", endpoint="TCP → 127.0.0.1:8889",
            status="running", config={
                "driver": "E:\\IO ServerOnLine\\IO Servers\\IM_A11_RTU\\ioapi.dll (v6.0.1.34)",
                "sql_service": "A11SQLSERVICE.exe → Oracle (1s周期, 1 ADO)",
                "time_sync": "开启",
                "device_check": "30min在线判定",
                "break_time_files": "1669个井点功图断点记录 (BreakTime/)",
            }, devices=[]),
        Channel(id="ch_modbus_tcp", gateway="gw_131", name="Modbus TCP",
            protocol="modbus_tcp", endpoint=":502 → IPv6 240C:8042:... ×20+ RTU",
            status="running", config={
                "driver": "Standard_Umodbus/Ioapi.dll (back/run/)",
                "scan_cycle": "100ms",
                "timeout": "3-20s",
                "fault_threshold": "4 failures → offline",
                "resume_cycle": 30,
                "fc6_write": True, "fc16_write": True,
            }, devices=[]),
        Channel(id="ch_oracle", gateway="gw_131", name="Oracle 数据出口",
            protocol="oracle_sql", endpoint="192.0.2.1.129:1521/orcl",
            status="running", config={
                "connection": "Provider=OraOLEDB.Oracle.1;User ID=INDUSTRYDB;Data Source=orcl",
                "password": "CHANGEME (from DataSource.ini)",
                "ado_count": 4, "execute_cycle_ms": 1000,
                "key_tables": ["PC_FD_PUMPJACK_FDYNA_DIA_T (481万行)",
                    "SYS_DEVICE_RUN_DETAILS_HIST (23万行)", "SYS_SINGLE_WELL_BASE_INFO (966口井)",
                    "SYS_POINTRELATION_WELL (4567测点)"],
            }, devices=[]),
        Channel(id="ch_realtime_db", gateway="gw_131", name="RTDB 实时库",
            protocol="realtime_db", endpoint="192.0.2.1.102:8889",
            status="stopped", config={
                "server": "RTDBServer64.exe v6.0.1.9",
                "api": "RTDBAPI.dll (313KB)",
                "tag_paths": "/gscyc/{WellID}NODE/{DeviceCode}...",
            }, devices=[]),
        Channel(id="ch_eforcecon", gateway="gw_131", name="eForceCon DB",
            protocol="eforcecon", status="stopped"),
        # 新增通道
        Channel(id="ch_redundancy", gateway="gw_131", name="冗余通道",
            protocol="redundancy", endpoint="198.51.100.102:6000/6001",
            status="running", config={
                "partner_ip": "198.51.100.102",
                "recv_port": 6000, "send_port": 6001,
                "heartbeat_ms": 1500, "timeout_count": 3,
                "failover_time": "4.5s",
            }, devices=[]),
        Channel(id="ch_dtu_pool", gateway="gw_131", name="DTU协议池 (16种)",
            protocol="dtu_multi", endpoint="TCP/UDP/Serial → 现场DTU设备",
            status="running", config={
                "drivers": {
                    "DTU_SUNWAY": "三维GENERIC_VENDOR动态IP", "DTU_SUNWAY_COMMSERVER": "通用TCP Server",
                    "DTU_SUNWAY_MULTIPORT": "TCP多端口", "DTU_SUNWAY_UDP": "通用UDP",
                    "DTU_FOUR_FAITH": "四信", "DTU_HONGDIAN": "宏电",
                    "DTU_InHand": "映翰通", "DTU_BHYN": "博海粤能",
                    "DTU_DATA6211": "唐山平升Data6211", "DTU_DATA86": "唐山平升Data6100",
                    "DTU_DLHB_HJT212": "HJ/T212国标", "DTU_DQQY": "某工业庆远",
                    "DTU_ETUNG": "亿通", "DTU_FENGSHI": "山东锋士",
                    "DTU_CAIMAO": "莱司凯茂", "DTU_LANDI": "唐山蓝迪",
                },
            }, devices=[]),
        Channel(id="ch_s7", gateway="gw_131", name="Siemens S7",
            protocol="s7comm", endpoint="TCP :102 → Siemens PLC",
            status="stopped", config={"driver": "s7onlinx.dll (159KB) + W95_s7.dll"},
            devices=[]),
        Channel(id="ch_mitsubishi", gateway="gw_131", name="Mitsubishi PLC",
            protocol="mitsubishi", endpoint="Serial/TCP → 三菱PLC",
            status="stopped", config={"driver": "MruComDll.dll (518KB)"},
            devices=[]),
        Channel(id="ch_beckhoff", gateway="gw_131", name="Beckhoff TwinCAT",
            protocol="twincat_ads", endpoint="ADS → Beckhoff PLC",
            status="stopped", config={"driver": "TcAdsDll.dll (221KB)"},
            devices=[]),
        Channel(id="ch_omron", gateway="gw_131", name="Omron PLC",
            protocol="omron", status="stopped",
            config={"driver": "HCTPXYIF.DLL + HKCANDLL.dll + IMPDRVR.dll"},
            devices=[]),
        Channel(id="ch_ge", gateway="gw_131", name="GE Fanuc",
            protocol="ge_snp", status="stopped",
            config={"driver": "GEFSNP32.DLL/GEFSRX32.DLL/GEFTCP32.DLL/GEFEGD32.DLL"},
            devices=[]),
    ]
    for ch in channels:
        engine.register(ch)

    # ── 层4: Devices (12 保护继电器 + 抽油机井 + 仿真设备) ──
    relay_types = [
        ("00","DSL-31A","线路保护",20,"Ia+Ib+Ic+Ua+Ub+Uc+F+P+Q+cosφ"),
        ("10","DST-31A","变压器差动保护",15,"Ua+Ub+Uc+F"),
        ("20","DBPA-31A","电源备投",13,""),
        ("30","DSB-31A","母联保护",20,"Ia+Ib+Ic"),
        ("40","电动机保护","电动机保护",19,"Ia+Ib+Ic+Ua+Ub+Uc+F+P+cosφ"),
        ("50","DST-22D","变压器差动保护",15,""),
        ("60","DSB-22D","变压器后备保护",20,""),
        ("70","DSL-24D","线路保护",20,""),
        ("80","DGP-11","电容器差动保护",21,"F+Ias+Ibs+Ics+Ian+Ibn+Icn+I0+Iacd+Ibcd+Iccd+Iazd+Ibzd+Iczd+Ua+Ub+Uc+Uab+Ubc+Uca+U2"),
        ("90","DGP-12","电容器后备保护",24,"F+Ua+Ub+Uc+Uab+Ubc+Uca+U2+Uas+Ubs+Ucs+Uabs+Ubcs+Ucas+U2s+Uf+Ias+Ibs+Ics+Iabs+I2s+P+R+X"),
        ("100","DGP-13","电容器接地保护",22,"F+Uas+U30s+U30n+U30h+Ia+3I0+Ian+Ibn+Icn+E+U1+Rg"),
        ("110","DMP-31A/DST-31A","电动机差动保护",19,"Ia+Ib+Ic+Ia2+Ib2+Ic2+F+Ua+Ub+Uc+P+Q+cosφ"),
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
              description="DSL-31A 线路保护 A 相电流"),
        Point(id="pt_ib", device="dev_relay_00", name="B相电流 Ib", unit="A",
              register={"address":1,"type":"uint16","formula":register_formula},
              alarm={"high":5.0,"low":0.01}, category="遥测"),
        Point(id="pt_ic", device="dev_relay_00", name="C相电流 Ic", unit="A",
              register={"address":2,"type":"uint16","formula":register_formula},
              alarm={"high":5.0,"low":0.01}, category="遥测"),
        Point(id="pt_ua", device="dev_relay_10", name="A相电压 Ua", unit="V",
              register={"address":0,"type":"uint16","formula":voltage_formula},
              alarm={"high":260.0,"low":198.0}, category="遥测",
              description="DST-31A 变压器差动保护 A 相电压"),
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
        # --- 采集约束 (IoMonitor.ini) ---
        Constraint(id="c_commit_real", name="实时提交延迟≤300ms",
            rule="CommitRealSpan=300ms → 数据采集到入库延迟≤300ms",
            entity="ch_oracle", severity="info", source="IoMonitor.ini",
            action="监控 CommitRealSpan 配置"),
        Constraint(id="c_commit_batch", name="单次提交上限15000点",
            rule="CommitTagOnce=15000 → 单批最大15000标签值",
            entity="ch_oracle", severity="warning", source="IoMonitor.ini",
            action="超限触发分片提交"),
        Constraint(id="c_cache_flush", name="缓存刷新阈值100K",
            rule="MaxTagValueCount=100000 → 内存缓存>100K点强制写历史文件",
            entity="ch_oracle", severity="warning", source="IoMonitor.ini",
            action="IsSaveFile=1 启用文件缓存保护"),
        # --- 通道约束 (IoChannelCfg.ini) ---
        Constraint(id="c_io_timeout", name="IO 设备超时 30s",
            rule="设备无响应 >30s → 判定离线",
            entity="gw_131", severity="danger", source="IoChannelCfg.ini",
            action="设备状态→offline + 触发告警"),
        Constraint(id="c_channel_spacing", name="通道打开间隔 10s",
            rule="同一类型通道启动间隔 ≥10s → 防止冲击",
            entity="gw_131", severity="info", source="IoChannelCfg.ini",
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
            entity="dev_relay_00", severity="danger", source="Device.ini DSL-31A",
            action="跳闸 + SOE 事件 + 推送告警"),
        Constraint(id="c_voltage_abnormal", name="电压异常保护",
            rule="U < 198V or U > 260V + 持续>10s → 电压异常告警",
            entity="dev_relay_10", severity="danger", source="Device.ini DST-31A",
            action="告警 + SOE + 通知调度"),
        Constraint(id="c_motor_stall", name="电动机堵转保护",
            rule="电流突变 + 转速=0 + 持续>3s → 堵转告警",
            entity="dev_relay_40", severity="danger", source="Device.ini DMP-31A",
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
            source="IM_A11_RTU/BreakTime/ (1669 files)",
            action="标记测点 stale + 触发补采"),
        # --- 已知故障模式 ---
        Constraint(id="c_commit_crash", name="IoCommit 崩溃保护",
            rule="IoCommit 访问违规 (C0000005) → psNTService 自动重启 (≤3次)",
            entity="gw_131", severity="critical",
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
        DataSource(id="ds_oracle", gateway="gw_131", type="oracle",
            connection="192.0.2.1.129:1521/orcl (INDUSTRYDB)",
            status="online", tag_count=4_814_742),
        DataSource(id="ds_realtime_db", gateway="gw_131", type="realtime_db",
            connection="192.0.2.1.102:8889",
            status="stopped", tag_count=500),
        DataSource(id="ds_redundancy", gateway="gw_131", type="redundancy",
            connection="198.51.100.102:6000/6001",
            status="running", tag_count=0),
        DataSource(id="ds_syncplatform", gateway="gw_131", type="sync",
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
             "DEV_A 井馈线由 DSL-31A 线路保护供电"),
        Link("lnk_pw_b", "dev_well_DEV_B", "dev_relay_00", "powered_by",
             "DEV_B 井馈线由 DSL-31A 线路保护供电"),
        Link("lnk_pw_s1", "dev_sim_sj0001", "dev_relay_40", "powered_by",
             "仿真泵母线由电动机保护供电"),
        # 监测: 保护设备 → 被保护对象 (跨通道)
        Link("lnk_mon_a", "dev_relay_00", "dev_well_DEV_A", "monitors",
             "DSL-31A 监测 DEV_A 馈线电流/电压 (Ia/Ib/Ic/Ua/Ub/Uc)"),
        Link("lnk_mon_s1", "dev_relay_40", "dev_sim_sj0001", "monitors",
             "电动机保护监测仿真泵堵转/过流"),
        # 数据链: 采集通道 → 提交出口
        Link("lnk_flow_mb", "ch_modbus_tcp", "ch_oracle", "feeds_into",
             "Modbus 遥测经 IoMonitor 汇入 Oracle 提交通道 (300ms 实时)"),
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
        Link("lnk_iss_crash", "gw_131", "ch_oracle", "has_issue",
             "IoCommit C0000005 崩溃 10 次 (2022-2023, psNTService 自动重启)",
             props={"constraint": "c_commit_crash"}),
        Link("lnk_iss_break", "ch_a11_rtu", "gw_131", "has_issue",
             "1669 个功图断点文件 (BreakTime/)",
             props={"constraint": "c_breaktime"}),
        # 控制: 网关 → 通道策略
        Link("lnk_ctl_mb", "gw_131", "ch_modbus_tcp", "controls",
             "LegacyComm 通道启停由网关调度 (同型通道间隔≥10s)",
             props={"constraint": "c_channel_spacing"}),
        Link("lnk_ctl_red", "gw_131", "ch_redundancy", "controls",
             "心跳 1500ms×3 裁决主备切换 (4.5s)",
             props={"constraint": "c_redundancy"}),
        Link("lnk_ctl_a11", "gw_131", "ch_a11_rtu", "controls",
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

    **需要引擎的入口都走这里**, 不要各自 build_131_ontology()。种子是
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
    return build_131_ontology()
