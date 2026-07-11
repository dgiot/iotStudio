"""
dgiot_lite 本体论引擎 — 4 层模型
与 Erlang dgiot_ontology.erl 对齐

层1 Site    采油厂/井场
层2 Gateway IO服务器/协议网关
层3 Device  RTU/传感器/执行器
层4 Point   测点

MQTT Topic: dgiot/{site}/{gateway}/{device}/{point}/data
"""
import json
from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any


@dataclass
class Site:
    """层1: 物理站点"""
    id: str
    name: str
    type: str = "oil_field"          # oil_field, factory, substation ...
    location: Optional[str] = None


@dataclass
class Gateway:
    """层2: 协议网关 / IO服务器"""
    id: str
    ip: str
    site: str                        # Site.id
    hostname: str = ""
    protocols: List[str] = field(default_factory=list)  # ["modbus_tcp:53001", "a11:8889"]
    devices: List[str] = field(default_factory=list)     # Device.id[]


@dataclass
class Device:
    """层3: 设备 / RTU / 传感器"""
    id: str
    gateway: str                     # Gateway.id
    name: str
    type: str = "rtu"                # rtu, sensor, plc ...
    protocol: str = "modbus"
    slaveid: int = 1
    points: List[str] = field(default_factory=list)  # Point.id[]


@dataclass
class Point:
    """层4: 测点"""
    id: str
    device: str                      # Device.id
    name: str
    unit: str = ""
    register: Dict[str, Any] = field(default_factory=dict)  # {"address":40300, "type":"float32_AB", "protocol":"modbus"}
    alarm: Dict[str, float] = field(default_factory=dict)   # {"high":3.0, "low":0.1}
    range: List[float] = field(default_factory=list)        # [0, 10]


class OntologyEngine:
    """4层本体论引擎 — 与 Erlang dgiot_ontology 接口一致"""

    def __init__(self, mqtt_client=None):
        self.sites: Dict[str, Site] = {}
        self.gateways: Dict[str, Gateway] = {}
        self.devices: Dict[str, Device] = {}
        self.points: Dict[str, Point] = {}
        self._mqtt = mqtt_client

    # ── register ──
    def register(self, node) -> str:
        """注册任意层节点，返回 MQTT topic 路径"""
        table = {Site: self.sites, Gateway: self.gateways, Device: self.devices, Point: self.points}
        table[type(node)][node.id] = node
        if isinstance(node, Point):
            return self.get_path(node.id)
        return node.id

    # ── get_path ──
    def get_path(self, point_id: str) -> str:
        """构建 MQTT topic: dgiot/{site}/{gateway}/{device}/{point}"""
        point = self.points.get(point_id)
        if not point:
            raise KeyError(f"Point {point_id} not found")
        device = self.devices.get(point.device)
        if not device:
            raise KeyError(f"Device {point.device} not found")
        gateway = self.gateways.get(device.gateway)
        if not gateway:
            raise KeyError(f"Gateway {device.gateway} not found")
        site = self.sites.get(gateway.site)
        if not site:
            raise KeyError(f"Site {gateway.site} not found")
        return f"dgiot/{site.id}/{gateway.id}/{device.id}/{point.id}"

    # ── get_points ──
    def get_points(self, device_id: str) -> List[Point]:
        return [p for p in self.points.values() if p.device == device_id]

    # ── get_devices ──
    def get_devices(self, gateway_id: str) -> List[Device]:
        return [d for d in self.devices.values() if d.gateway == gateway_id]

    # ── push_point ──
    def push_point(self, point_id: str, value: float, quality: int = 192):
        """推送测点值到 MQTT"""
        topic = f"{self.get_path(point_id)}/data"
        payload = json.dumps({"ts": int(__import__("time").time() * 1000), "v": value, "q": quality})
        if self._mqtt:
            self._mqtt.publish(topic, payload)
        return topic, payload

    # ── export / import ──
    def to_dict(self) -> dict:
        return {
            "sites": {k: asdict(v) for k, v in self.sites.items()},
            "gateways": {k: asdict(v) for k, v in self.gateways.items()},
            "devices": {k: asdict(v) for k, v in self.devices.items()},
            "points": {k: asdict(v) for k, v in self.points.items()},
        }

    # ── sync to Parse ──
    def sync_to_parse(self, tenant_id: str = "default"):
        """将本体实体同步到 parse_lite (DG-IoT Device/Product 类)"""
        try:
            from .parse_lite import parse_create
        except ImportError:
            from parse_lite import parse_create

        # Sync sites → Device (device_type=site)
        for s in self.sites.values():
            parse_create("Device", {
                "objectId": f"site_{s.id}", "devaddr": f"site_{s.id}",
                "name": s.name, "device_type": "site",
                "basedata": {"site_type": s.type, "location": s.location},
                "isEnable": True, "tenant_id": tenant_id,
            })

        # Sync gateways → Device (device_type=gateway)
        for g in self.gateways.values():
            parse_create("Device", {
                "objectId": f"gw_{g.id}", "devaddr": f"gw_{g.id}",
                "name": g.hostname or g.id, "ip": g.ip,
                "device_type": "gateway",
                "basedata": {"protocols": g.protocols, "site": g.site},
                "isEnable": True, "tenant_id": tenant_id,
            })

        # Sync devices → Device
        for d in self.devices.values():
            parse_create("Device", {
                "objectId": d.id, "devaddr": d.id,
                "name": d.name, "device_type": d.type,
                "protocol": d.protocol,
                "basedata": {"slave_id": d.slaveid, "gateway": d.gateway},
                "isEnable": True, "tenant_id": tenant_id,
            })

        return {"status": "synced", "counts": self.health()["counts"]}

    def health(self) -> dict:
        return {
            "ontology": "4-layer: Site > Gateway > Device > Point",
            "mqtt_topic": "dgiot/{site}/{gateway}/{device}/{point}/data",
            "counts": {
                "sites": len(self.sites),
                "gateways": len(self.gateways),
                "devices": len(self.devices),
                "points": len(self.points),
            }
        }


# ── 快捷工厂 ──
def from_io_ontology(io_json_path: str) -> OntologyEngine:
    """从 io_ontology.json 创建本体引擎"""
    with open(io_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    engine = OntologyEngine()

    # 导入 servers → gateways
    for srv in data.get("servers", []):
        gw = Gateway(
            id=srv["id"].replace("io:", ""),
            ip=srv["ip"],
            site="site_default",
            hostname=srv.get("hostname", ""),
        )
        engine.register(gw)

    # 导入 data_sources → devices
    for ds in data.get("data_sources", []):
        dev = Device(
            id=f"ds_{ds['id']}",
            gateway=f"server_{ds.get('endpoint', '').split(':')[0] or '1'}",
            name=ds["name"],
            protocol=ds.get("protocol", ""),
        )
        engine.register(dev)

    return engine
