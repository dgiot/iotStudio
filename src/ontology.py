"""
dgiot_lite 本体论引擎 — 4 层模型
与 Erlang dgiot_ontology.erl 对齐

层1 Site    工业厂/井场/场站 (human-readable name)
层2 Channel 协议通道 (MD5: get_channelid)
层3 Device  RTU/传感器 (MD5: get_deviceid, Gateway = Device type=gateway)
层4 Point   测点 (thing_model identifier, 产品内唯一)

MQTT Topic: $dg/thing/{product_id}/{product_id}_{devaddr}/properties/report (dlink standard)
"""
import json
from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any


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
    """层4: 设备 — RTU / PLC / 传感器 / 保护继电器"""
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


@dataclass
class DataSource:
    """数据出口 — 持久化目标"""
    id: str
    gateway: str
    type: str                         # oracle, tdengine, rtdb, eforcecon, sqlite
    connection: str = ""              # connection string
    status: str = "unknown"
    tag_count: int = 0
    tables: List[str] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════
# 本体引擎
# ═══════════════════════════════════════════════════════════

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
        self._mqtt = mqtt_client

    # ── register ──
    def register(self, node) -> str:
        """注册任意层节点"""
        table = {
            Site: self.sites, Gateway: self.gateways,
            Channel: self.channels, Device: self.devices,
            Point: self.points, Constraint: self.constraints,
            DataSource: self.datasources
        }
        t = type(node)
        if t in table:
            table[t][node.id] = node
        if isinstance(node, Point):
            return self.get_path(node.id)
        return node.id

    # ── get_path (5层) ──
    def get_path(self, point_id: str) -> str:
        """构建 MQTT topic: dgiot/{site}/{gateway}/{channel}/{device}/{point}"""
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

        return f"dgiot/{site.id}/{gateway.id}/{channel.id}/{device.id}/{point.id}"

    # ── 快捷查询 ──
    def get_points(self, device_id: str) -> List[Point]:
        return [p for p in self.points.values() if p.device == device_id]

    def get_devices(self, channel_id: str) -> List[Device]:
        return [d for d in self.devices.values() if d.channel == channel_id]

    def get_channels(self, gateway_id: str) -> List[Channel]:
        return [c for c in self.channels.values() if c.gateway == gateway_id]

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
        topic = f"{self.get_path(point_id)}/data"
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
        }

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

        db.commit(); db.close()
        return {"status": "synced", "counts": self.health()["counts"]}

    # ── validate ──
    def validate(self) -> dict:
        """完整性校验 — 检查实体间引用完整性、必要字段"""
        issues = []
        # 检查 dangling references
        for gw in self.gateways.values():
            if gw.site not in self.sites:
                issues.append(f"Gateway {gw.id}: site '{gw.site}' not found")
        for ch in self.channels.values():
            if ch.gateway not in self.gateways:
                issues.append(f"Channel {ch.id}: gateway '{ch.gateway}' not found")
        for dev in self.devices.values():
            if dev.channel not in self.channels:
                issues.append(f"Device {dev.id}: channel '{dev.channel}' not found")
        for pt in self.points.values():
            if pt.device not in self.devices:
                issues.append(f"Point {pt.id}: device '{pt.device}' not found")
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "counts": self.health()["counts"]
        }

    def health(self) -> dict:
        return {
            "ontology": "5-layer: Site > Gateway > Channel > Device > Point",
            "mqtt_topic": "dgiot/{site}/{gateway}/{channel}/{device}/{point}/data",
            "version": "2.0",
            "counts": {
                "sites": len(self.sites),
                "gateways": len(self.gateways),
                "channels": len(self.channels),
                "devices": len(self.devices),
                "points": len(self.points),
                "constraints": len(self.constraints),
                "datasources": len(self.datasources),
            }
        }


# ═══════════════════════════════════════════════════════════
# 工厂方法: 从发现数据构建本体
# ═══════════════════════════════════════════════════════════

def build_131_ontology() -> OntologyEngine:
    """从 2026-07-12 131 IO网关 2047文件逐字精读结果构建完整本体

    数据源: D:\\ai\\dgiot_lite\\io服务器分析\\IO ServerOnLine\\
    分析范围: 2047 文件, 含 INI/TXT/DAT/DLL/LOG/ZIO/CHM/DOC
    """
    engine = OntologyEngine()

    # ── 层1: Site ──
    engine.register(Site(
        id="industry_c1", name="某工业工业厂", type="oil_field",
        location="黑龙江省某工业市",
        description="PLANT_A_SITE_C(DEVICE_C) + PLANT_A_SITE_D(DEVICE_D)。IO网关 127.0.0.1(IO-SERVER-01)"
              " + Oracle 192.168.1.129:1521 + RTDB 192.168.1.102:8889"
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
            "LegacyComm": "v6.x, PID 19240 — 80+ Modbus TCP 到井口RTU ← 主采集入口",
            "IOMan": "workers ×7 — A11 TCP 到 127.0.0.1:8889 ← 功图采集",
            "IoMonitor": "v6.0.0.1, PID 18400 — 数据汇聚 + Oracle 提交 (无直接现场连接)",
            "IoCommit": "12组并发提交 (DB0~DB11), 300ms实时/500ms历史",
            "OPC_FC_Client": "活跃 — 采集 JB1V2/DX6PZ/Z22Y/Z1PZ/DX1ZRZ (OPC DA)",
            "Oracle Client": "11.2.0 @ E:\\app\\Administrator\\product\\11.2.0\\client_1",
            "OPC Core Components": "2.00 SDK v2.00.220 (32-bit, installed 2025-12-16)",
            "RTDB Server": "v6.0.1.9 @ RTDBServer64.exe (已停用)",
        },
        channels=["ch_modbus_tcp","ch_a11_rtu","ch_oracle","ch_opc_da","ch_rtdb",
                   "ch_eforcecon","ch_redundancy","ch_dtu_pool",
                   "ch_s7","ch_mitsubishi","ch_beckhoff","ch_omron","ch_ge"],
        notes="现场采集两大入口: LegacyComm(Modbus TCP :53001→80+RTU) + IOMan(A11 :8889→130)。"
              "IoMonitor 只连 Oracle :1521 做数据出口。"
              "OPC DA(DCOM :135)从未活跃, 172.23.9.x 无实际连接。"
              "OPC_FC_Client/ 是历史废配置, 系统实际不用 OPC。"
    ))

    # ── 层3: Channels (扩展: DTU/PLC/冗余) ──
    channels = [
        # 原有通道
        Channel(id="ch_opc_da", gateway="gw_131", name="OPC DA Client",
            protocol="opc_da", endpoint="DCOM :135 → 192.168.10.23/.3/.18.194/.26.6.3",
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
            protocol="oracle_sql", endpoint="192.168.1.129:1521/orcl",
            status="running", config={
                "connection": "Provider=OraOLEDB.Oracle.1;User ID=INDUSTRYPROD;Data Source=orcl",
                "password": "INDUSTRYA11_pass (from DataSource.ini)",
                "ado_count": 4, "execute_cycle_ms": 1000,
                "key_tables": ["PC_FD_PUMPJACK_FDYNA_DIA_T (481万行)",
                    "SYS_DEVICE_RUN_DETAILS_HIST (23万行)", "SYS_SINGLE_WELL_BASE_INFO (966口井)",
                    "SYS_POINTRELATION_WELL (4567测点)"],
            }, devices=[]),
        Channel(id="ch_rtdb", gateway="gw_131", name="RTDB 实时库",
            protocol="rtdb", endpoint="192.168.1.102:8889",
            status="stopped", config={
                "server": "RTDBServer64.exe v6.0.1.9",
                "api": "RTDBAPI.dll (313KB)",
                "tag_paths": "/gscyc/{WellID}NODE/{DeviceCode}...",
            }, devices=[]),
        Channel(id="ch_eforcecon", gateway="gw_131", name="eForceCon DB",
            protocol="eforcecon", status="stopped"),
        # 新增通道
        Channel(id="ch_redundancy", gateway="gw_131", name="冗余通道",
            protocol="redundancy", endpoint="192.168.10.102:6000/6001",
            status="running", config={
                "partner_ip": "192.168.10.102",
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
        "DEV_A","M5","S21","Y9065","Y9371","Y9721","Y9831","Y9832",
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
            action="备机 192.168.10.102 接管"),
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
            connection="192.168.1.129:1521/orcl (INDUSTRYPROD)",
            status="online", tag_count=4_814_742),
        DataSource(id="ds_rtdb", gateway="gw_131", type="rtdb",
            connection="192.168.1.102:8889",
            status="stopped", tag_count=500),
        DataSource(id="ds_redundancy", gateway="gw_131", type="redundancy",
            connection="192.168.10.102:6000/6001",
            status="running", tag_count=0),
        DataSource(id="ds_syncplatform", gateway="gw_131", type="sync",
            connection="D:\\SyncPlatform0402\\bin\\SyncTaskManager.exe",
            status="unknown", tag_count=0),
    ]
    for ds in datasources:
        engine.register(ds)

    return engine
