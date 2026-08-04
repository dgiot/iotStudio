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
import json, logging, os, socket, time, threading
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

    链路 (takeover 模式):
      设备 ──A11帧──→ 本桥接 (监听 :8889)
                      ├──→ 解析 (A11Message) → 数据点 → 入库/上游
                      └──→ 透传原帧 → 原 IO 服务器 (零影响)
    """

    def __init__(self, config: dict):
        self.config = config or {}
        self.mode = self.config.get("mode", "bypass")
        self.port = self.config.get("server_port", 8889)
        self.original_io_ip = self.config.get("original_io_ip", "")
        self.original_io_port = self.config.get("original_io_port", 8889)
        self.running = False
        self._server = None
        self._thread: Optional[threading.Thread] = None
        self._callbacks = []
        self._stats = {"frames": 0, "decoded": 0, "forwarded": 0, "errors": 0,
                       "clients": 0}

    # ── 生命周期 ──

    def start(self) -> bool:
        self.running = True
        logger.info(f"[zone] A11桥接启动 mode={self.mode} port={self.port} "
                    f"透传→ {self.original_io_ip}:{self.original_io_port or '-'}")
        if self.mode != "bypass":
            self._server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self._server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self._server.bind(("0.0.0.0", self.port))
            self._server.listen(32)
            self._server.settimeout(1)
            self._thread = threading.Thread(target=self._accept_loop,
                                            daemon=True,
                                            name=f"a11-bridge-{self.port}")
            self._thread.start()
            logger.info(f"[zone] A11桥接监听 :{self.port}")
        return True

    def stop(self):
        self.running = False
        if self._server:
            try:
                self._server.close()
            except Exception:
                pass
            self._server = None
        if self._thread:
            self._thread.join(timeout=3)
            self._thread = None
        logger.info(f"[zone] A11桥接停止 (无残留连接)")

    def on_data(self, cb):
        """注册解码数据回调 (数据点 → 平台)"""
        self._callbacks.append(cb)

    # ── 帧处理 ──

    def handle_frame(self, raw: bytes) -> List[dict]:
        """处理一帧 A11 数据: 解码 + 透传 + 回调"""
        self._stats["frames"] += 1
        points = []
        try:
            from src.protocols.a11 import A11Message
            msgs = A11Message.decode_batch(raw)
            for m in msgs:
                points.append({"type": m.type_name,
                               "category": m.category,
                               "msg_type": m.msg_type,
                               "payload": m.payload.hex()[:64]})
            self._stats["decoded"] += len(points)
            for cb in self._callbacks:
                try:
                    cb(points)
                except Exception:
                    pass
        except Exception as e:
            self._stats["errors"] += 1
            logger.warning(f"[zone] A11 解析失败: {e}")

        # 透传 (takeover/stable 且配置了原 IO)
        if self.mode in ("takeover", "stable") and self.original_io_ip:
            self._forward(raw)
        return points

    def _forward(self, raw: bytes):
        """透传原帧到原 IO 服务器 (零修改原业务)"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(5)
            s.connect((self.original_io_ip, self.original_io_port))
            s.send(raw)
            s.close()
            self._stats["forwarded"] += 1
        except Exception as e:
            self._stats["errors"] += 1
            logger.warning(f"[zone] A11 透传失败: {e}")

    # ── 监听 (takeover/stable) ──

    def _accept_loop(self):
        while self.running and self._server:
            try:
                conn, addr = self._server.accept()
                self._stats["clients"] += 1
                threading.Thread(target=self._client_loop,
                                 args=(conn, addr), daemon=True).start()
            except socket.timeout:
                continue
            except OSError:
                break

    def _client_loop(self, conn, addr):
        conn.settimeout(30)
        try:
            while self.running:
                data = conn.recv(4096)
                if not data:
                    break
                self.handle_frame(data)
        except Exception:
            pass
        finally:
            conn.close()

    def set_mode(self, mode: str) -> bool:
        """切换桥接阶段: bypass → takeover → stable (可回退)"""
        if mode not in ("bypass", "takeover", "stable"):
            return False
        self.mode = mode
        logger.info(f"[zone] A11桥接切换: {mode}")
        return True

    def status(self) -> dict:
        return {"mode": self.mode, "port": self.port,
                "original_io": f"{self.original_io_ip}:{self.original_io_port}",
                "running": self.running, **self._stats}


class OpcAdapter:
    """OPC DA 适配 — 单 DCS 端点 (厂家差异在此隔离)

    连接方式:
      优先 OpenOPC (跨进程 DCOM, 支持远程)
      回退 win32com 本地 COM
      无 COM 环境 → 模拟模式 (自测/无 Windows 场景)

    流程: DCOM 连接 → Browse tag 树 → 读取核心点 → 数值与 pSpace 比对
    """

    def __init__(self, config: dict):
        self.config = config or {}
        self.vendor = self.config.get("vendor", "unknown")
        self.endpoint = self.config.get("endpoint", "")
        self.opc_server = self.config.get("opc_server",
                                          "Kepware.KEPServerEX.V6")
        self.host = self.config.get("host", self.endpoint)
        self.running = False
        self._opc = None
        self._items = self.config.get("items", [])
        self._stats = {"tags": 0, "reads": 0, "errors": 0,
                       "connected": False, "mode": "init"}

    def start(self) -> bool:
        self.running = True
        self._stats["mode"] = self._connect()
        logger.info(f"[zone] OPC DA适配启动 vendor={self.vendor} "
                    f"endpoint={self.endpoint} "
                    f"server={self.opc_server} mode={self._stats['mode']}")
        return True

    def _connect(self) -> str:
        """建立 DCOM 连接, 返回模式: openopc/win32com/simulate/error"""
        try:
            import OpenOPC
            self._opc = OpenOPC.client()
            self._opc.connect(self.opc_server, self.host)
            self._stats["connected"] = True
            return "openopc"
        except Exception as e1:
            logger.info(f"[zone] OpenOPC 连接失败({e1}), 尝试 win32com")
        try:
            import win32com.client
            self._opc = win32com.client.Dispatch("OPC.Automation.1")
            self._opc.Connect(self.opc_server, self.host)
            self._stats["connected"] = True
            return "win32com"
        except Exception as e2:
            logger.info(f"[zone] win32com 失败({e2}), 模拟模式")
            self._stats["mode"] = "simulate"
            return "simulate"

    def browse(self, limit: int = 200) -> List[str]:
        """浏览 tag 树 (全量拉取, 替代 ID 扫描)"""
        if self._stats["mode"] == "openopc":
            try:
                tags = self._opc.list(self.host, recursive=True)
                self._stats["tags"] = len(tags)
                return [str(t) for t in tags[:limit]]
            except Exception as e:
                self._stats["errors"] += 1
                logger.warning(f"[zone] Browse 失败: {e}")
        return []

    def read(self, items: List[str] = None) -> List[dict]:
        """读取点位值"""
        items = items or self._items
        self._stats["reads"] += len(items)
        if self._stats["mode"] in ("openopc", "win32com") and self._opc:
            try:
                vals = self._opc.read(items)
                out = []
                for item, v in zip(items, vals):
                    if isinstance(v, tuple):
                        v = v[0]
                    out.append({"item": item, "value": v, "quality": 192})
                return out
            except Exception as e:
                self._stats["errors"] += 1
                logger.warning(f"[zone] OPC 读取失败: {e}")
        # 模拟模式 (无 COM 环境)
        import random
        return [{"item": it, "value": round(random.uniform(10, 500), 2),
                 "quality": 192, "simulated": True} for it in items]

    def compare_with_pspace(self, pspace_values: dict) -> dict:
        """直采值与 pSpace 数值比对 (一致性验证)"""
        results = []
        for it, pv in pspace_values.items():
            direct = self.read([it])[0]
            if isinstance(pv, (int, float)) and isinstance(direct["value"], (int, float)):
                dev = abs(pv - direct["value"]) / max(1e-6, abs(pv))
                results.append({"item": it, "pspace": pv, "direct": direct["value"],
                                "deviation": round(dev * 100, 3)})
        consistent = all(r["deviation"] < 1.0 for r in results)
        return {"checked": len(results), "consistent": consistent,
                "details": results[:20]}

    def stop(self):
        if self._opc and self._stats["mode"] == "openopc":
            try:
                self._opc.close()
            except Exception:
                pass
        self._opc = None
        self.running = False

    def status(self) -> dict:
        return {"vendor": self.vendor, "endpoint": self.endpoint,
                "server": self.opc_server, "running": self.running,
                **self._stats}


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

    # 5. A11 桥接: bypass 模式只观察, 不转发
    ok = adapter._a11.handle_frame(b"\x6a\x6a\x5a\x5a" + b"\x00" * 10)
    print(f"[5] A11 桥接: bypass 模式 frames={adapter._a11.status()['frames']} "
          f"forwarded={adapter._a11.status()['forwarded']}")
    assert adapter._a11.status()["forwarded"] == 0, "bypass 不应转发"

    # 6. A11 桥接: takeover 模式透传原 IO (模拟原 IO 服务器)
    import struct
    orig_srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    orig_srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    orig_srv.bind(("127.0.0.1", 18899))
    orig_srv.listen(2)
    got = []

    def _orig_accept():
        try:
            conn, _ = orig_srv.accept()
            data = conn.recv(4096)
            got.append(data)
            conn.close()
        except Exception:
            pass
    threading.Thread(target=_orig_accept, daemon=True).start()

    takeover_cfg = ZoneConfig(
        zone_id="zone_131",
        a11_bridge={"mode": "takeover", "server_port": 18898,
                    "original_io_ip": "127.0.0.1",
                    "original_io_port": 18899})
    bridge = A11Bridge(takeover_cfg.a11_bridge)
    bridge.start()
    time.sleep(0.3)
    # 模拟设备发 A11 帧到桥接
    pdu = b"\x6a\x6a\x5a\x5a" + struct.pack("<HH", 0x0017, 0) + b"\x00" * 20
    frame = struct.pack(">HHHB", 1, 0, len(pdu) + 1, 1) + pdu
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.settimeout(2)
    client.connect(("127.0.0.1", 18898))
    client.sendall(frame)
    client.close()
    time.sleep(0.8)
    bridge.stop()
    orig_srv.close()
    print(f"[6] A11 takeover 透传: decoded={bridge._stats['decoded']} "
          f"forwarded={bridge._stats['forwarded']} 原IO收到={len(got)}帧")
    assert bridge._stats["decoded"] >= 1, "A11 帧未解码"
    assert len(got) >= 1, "原 IO 未收到透传帧"

    # 7. OPC DA 适配: 模拟模式 + 数值比对
    opc_cfg = {"vendor": "rockwell", "endpoint": "172.23.9.3",
               "opc_server": "Kepware.KEPServerEX.V6",
               "items": ["Channel1.Device1.oil_pressure",
                         "Channel1.Device1.current_a"]}
    opc = OpcAdapter(opc_cfg)
    opc.start()
    st7 = opc.status()
    print(f"[7] OPC DA 适配: mode={st7['mode']} connected={st7['connected']} "
          f"(无 COM 环境为 simulate)")
    vals = opc.read()
    print(f"    读取 {len(vals)} 点: {vals[0]['item']}={vals[0]['value']}")
    assert len(vals) == 2, "OPC 读取失败"
    cmp = opc.compare_with_pspace(
        {"Channel1.Device1.oil_pressure": vals[0]["value"] * 0.999,
         "Channel1.Device1.current_a": vals[1]["value"]})
    print(f"    与 pSpace 比对: checked={cmp['checked']} "
          f"consistent={cmp['consistent']}")
    opc.stop()

    adapter.stop()
    print("zone_adapter selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("zone_adapter selftest OK")
