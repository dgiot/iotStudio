#!/usr/bin/env python3
"""
作业区适配层 — ZoneAdapter 编排器
====================================
对标需求: 每个 IO 服务器 = 一个作业区适配单元
  A11 桥接 (不改DTU, 不影响原业务) + OPC DA 适配 (DCS厂家差异)
  + Modbus 动态感知 (RTU点位识别) + IO 本机业务 (Oracle/pSpace节拍)

设计原则:
  1. 配置驱动 — 厂家/点位/节拍差异全进 zones/zone_xxx.yaml, 代码零改动
  2. 作业区间隔离 — 一个作业区异常不影响其他作业区
  3. 体检先行 — 搭桥前必须过 8 维度体检 READY
  4. 三阶段演进 — A11 桥接 bypass → takeover → stable, 全程可回退

用法:
  adapter = ZoneAdapter("zone_131")              # 从 zones/zone_131.yaml 加载
  adapter.check_health()                          # 术前体检 (READY?)
  adapter.start()                                 # 启动适配层
  adapter.status()                                # 各子模块状态
  adapter.stop()                                  # 停止 (零残留)

自测: python -m src.services.zone_adapter
"""
import json, logging, os, time, threading
from dataclasses import dataclass, field
from typing import Dict, List, Optional

logger = logging.getLogger("zone_adapter")

ZONES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)))), "zones")


@dataclass
class ZoneConfig:
    """作业区配置 (zones/zone_xxx.yaml / json)"""
    zone_id: str
    name: str = ""
    zone: str = ""                       # 所属作业区 (采油二厂-第四作业区)
    a11_bridge: dict = field(default_factory=dict)
    opc_adapters: List[dict] = field(default_factory=list)
    modbus: dict = field(default_factory=dict)
    io_business: dict = field(default_factory=dict)
    health: dict = field(default_factory=dict)


class A11Bridge:
    """A11 桥接 — 三阶段演进 (bypass → takeover → stable)

    bypass:   旁路验证, 只读观察不干预 (对标 gateway_migration BYPASS)
    takeover: 接管处理 + 透传原 IO (对标 TAKEOVER)
    stable:   独立运行, 不依赖原链路 (对标 STABLE)
    """

    def __init__(self, config: dict):
        self.config = config or {}
        self.mode = self.config.get("mode", "bypass")
        self.port = self.config.get("server_port", 8889)
        self.running = False
        self._stats = {"frames": 0, "forwarded": 0, "errors": 0}

    def start(self) -> bool:
        self.running = True
        logger.info(f"[zone] A11桥接启动 mode={self.mode} port={self.port}")
        return True

    def stop(self):
        self.running = False
        logger.info(f"[zone] A11桥接停止 (无残留连接)")

    def forward(self, raw: bytes) -> bool:
        """透传帧到原 IO (takeover 模式)"""
        self._stats["frames"] += 1
        if self.mode == "bypass":
            return True  # 旁路: 只观察不转发
        try:
            # TODO: 透传到原 IO 服务器 (gateway_migration 接管逻辑)
            self._stats["forwarded"] += 1
            return True
        except Exception as e:
            self._stats["errors"] += 1
            return False

    def status(self) -> dict:
        return {"mode": self.mode, "port": self.port,
                "running": self.running, **self._stats}


class OpcAdapter:
    """OPC DA 适配 — 单 DCS 端点 (厂家差异在此隔离)"""

    def __init__(self, config: dict):
        self.config = config or {}
        self.vendor = self.config.get("vendor", "unknown")
        self.endpoint = self.config.get("endpoint", "")
        self.running = False
        self._stats = {"tags": 0, "reads": 0, "errors": 0}

    def start(self) -> bool:
        self.running = True
        logger.info(f"[zone] OPC DA适配启动 vendor={self.vendor} "
                    f"endpoint={self.endpoint}")
        return True

    def stop(self):
        self.running = False

    def status(self) -> dict:
        return {"vendor": self.vendor, "endpoint": self.endpoint,
                "running": self.running, **self._stats}


class ZoneAdapter:
    """作业区适配层 — 配置驱动的子模块编排器"""

    def __init__(self, zone_id: str, config: ZoneConfig = None):
        self.zone_id = zone_id
        self.config = config or self._load_config(zone_id)
        self._a11: Optional[A11Bridge] = None
        self._opc: List[OpcAdapter] = []
        self._threads: List[threading.Thread] = []
        self._health_report: Optional[dict] = None
        self._running = False

    # ── 配置加载 ──

    def _load_config(self, zone_id: str) -> ZoneConfig:
        """从 zones/zone_{id}.yaml 或 .json 加载"""
        # zone_id="zone_131" → zones/zone_131.json; zone_id="131" 同样兼容
        zone_key = zone_id[5:] if zone_id.startswith("zone_") else zone_id
        for ext in (".yaml", ".yml", ".json"):
            path = os.path.join(ZONES_DIR, f"zone_{zone_key}{ext}")
            if not os.path.exists(path):
                continue
            if ext == ".json":
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            else:
                try:
                    import yaml
                    with open(path, "r", encoding="utf-8") as f:
                        data = yaml.safe_load(f)
                except ImportError:
                    logger.error(f"[zone] {zone_id} 需要 pyyaml 读配置")
                    return ZoneConfig(zone_id=zone_id)
            logger.info(f"[zone] 配置加载: {path}")
            return ZoneConfig(zone_id=zone_id, **{k: v for k, v in data.items()
                                                  if k in ZoneConfig.__dataclass_fields__})
        logger.warning(f"[zone] 未找到配置 zones/zone_{zone_id}.yaml, 用默认")
        return ZoneConfig(zone_id=zone_id)

    # ── 术前体检 (搭桥前必须 READY) ──

    def check_health(self) -> dict:
        """8 维度体检 — READY 才允许启动适配层"""
        from .io_health_check import IOHostHealthChecker
        ip = self.config.io_business.get("io_ip", "")
        scan = {k: v for k, v in self.config.health.items()}
        if not scan:
            # 无注入数据时, 用配置里可用的参数
            scan = {"links": {"rtu_connections":
                              self.config.modbus.get("expected_rtu", 0)}}
        checker = IOHostHealthChecker(ip=ip or self.zone_id,
                                      hostname=self.config.name,
                                      scan_data=scan)
        report = checker.check()
        self._health_report = report.to_dict()
        return self._health_report

    # ── 适配层生命周期 ──

    def start(self, require_healthy: bool = True) -> dict:
        """启动作业区适配层 (默认要求体检 READY)"""
        if require_healthy:
            health = self.check_health()
            if health["verdict"] == "BLOCKED":
                return {"status": "blocked",
                        "msg": f"体检 BLOCKED: {health['total_score']}分, "
                               f"禁止搭桥", "health": health}

        self._a11 = A11Bridge(self.config.a11_bridge)
        self._a11.start()
        self._opc = [OpcAdapter(c) for c in self.config.opc_adapters]
        for a in self._opc:
            a.start()
        self._running = True
        logger.info(f"[zone] 作业区 {self.zone_id} 适配层启动: "
                    f"A11({self._a11.mode}) + OPC({len(self._opc)}端点)")
        return {"status": "running", "zone": self.zone_id,
                "health": self._health_report}

    def stop(self):
        if self._a11:
            self._a11.stop()
        for a in self._opc:
            a.stop()
        for t in self._threads:
            t.join(timeout=3)
        self._running = False
        logger.info(f"[zone] 作业区 {self.zone_id} 适配层停止")

    def status(self) -> dict:
        return {"zone_id": self.zone_id, "name": self.config.name,
                "zone": self.config.zone, "running": self._running,
                "health_verdict": (self._health_report or {}).get("verdict",
                                                                  "UNCHECKED"),
                "a11_bridge": self._a11.status() if self._a11 else None,
                "opc_adapters": [a.status() for a in self._opc]}


# ═══════════════════════════════════════════
# 自测
# ═══════════════════════════════════════════

def _selftest():
    # 131 作业区配置 (健康: READY)
    cfg = ZoneConfig(
        zone_id="zone_131",
        name="南4联合站",
        zone="采油二厂-第四作业区",
        a11_bridge={"mode": "bypass", "server_port": 8889,
                    "heartbeat_interval": 3000},
        opc_adapters=[
            {"vendor": "rockwell", "endpoint": "172.23.9.3"},
            {"vendor": "rockwell", "endpoint": "172.23.9.23"},
            {"vendor": "siemens", "endpoint": "172.26.6.3"},
        ],
        modbus={"rtu_range": "11.248.195-205", "model": "G1-G8_standard",
                "expected_rtu": 191},
        io_business={"oracle_dsn": "DQYTPROD", "commit_span": 300,
                     "io_ip": "11.66.12.131"},
        health={"collect_beat": {"commit_real_span": 300,
                                 "commit_his_span": 500,
                                 "commit_tag_once": 15000},
                "cpu_pct": 5, "mem_pct": 30, "tcp_conn": 203,
                "processes": "commbridge ioman iomonitor iocommit",
                "ports": "53001 8889 135 7001",
                "links": {"rtu_connections": 191, "opc_dcom": 5,
                          "a11_channels": 7},
                "protocol_stats": {"frames": 95326, "errors": 16},
                "conflict": {"ado_pool_free": 3, "commit_gap_ms": 240},
                "data_stats": {"points_total": 46709,
                               "write_latency_ms": 700}},
    )
    adapter = ZoneAdapter("zone_131", config=cfg)

    # 1. 体检先行
    health = adapter.check_health()
    print(f"[1] 术前体检: {health['verdict']} ({health['total_score']}分) "
          f"期望 READY")
    assert health["verdict"] == "READY", "体检应 READY"

    # 2. 启动适配层
    st = adapter.start(require_healthy=True)
    print(f"[2] 启动: {st['status']}")
    assert st["status"] == "running"

    # 3. 状态总览
    status = adapter.status()
    print(f"[3] 状态: A11={status['a11_bridge']['mode']} "
          f"OPC={len(status['opc_adapters'])}端点 "
          f"vendor={[a['vendor'] for a in status['opc_adapters']]}")
    assert len(status["opc_adapters"]) == 3

    # 4. 隔离性: 130 作业区 (BLOCKED) 被拒
    risky = ZoneConfig(zone_id="zone_130", name="北9注水站",
                       health={"cpu_pct": 95, "processes": "iomonitor"})
    adapter2 = ZoneAdapter("zone_130", config=risky)
    st2 = adapter2.start(require_healthy=True)
    print(f"[4] 130 作业区 (体检差): {st2['status']} 期望 blocked")
    assert st2["status"] == "blocked", "BLOCKED 作业区应禁止搭桥"

    # 5. A11 桥接透传 (bypass 模式不转发)
    ok = adapter._a11.forward(b"\x6a\x6a\x5a\x5a" + b"\x00" * 10)
    print(f"[5] A11 桥接: bypass 模式 frame={adapter._a11.status()['frames']}")
    assert ok

    adapter.stop()
    print("zone_adapter selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("zone_adapter selftest OK")
