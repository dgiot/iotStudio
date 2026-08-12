#!/usr/bin/env python3
"""
Modbus TCP 动态扫描与点位识别
==============================
对标需求: Modbus TCP 点位和 IP 动态变化时的动态感知 + 不影响原业务的采集

能力:
  1. 网段扫描   — 发现网络中新上线的 Modbus 设备 (IP 动态变化自适应)
  2. 从站扫描   — 发现设备下的从站地址 (1~247)
  3. 点位识别   — 识别有效寄存器 + 推断数据类型/字节序/缩放/动态性
  4. 差异感知   — 快照 diff: 设备上线/下线、点位新增/消失
  5. 零侵入     — 全部只读 (FC03), 独立短连接, 超时 500ms, 不修改任何配置

用法:
  scanner = DynamicModbusScanner()
  # ① 网段发现
  devices = scanner.discover_network("11.248", start=195, end=205)
  # ② 设备点位识别
  points = scanner.recognize_points("11.248.195.1", 502, slave=1)
  # ③ 定时巡检 + 差异
  report = scanner.patrol("11.248", 195, 205, interval_s=30)

自测: python -m src.protocols.modbus_dynamic
"""
import logging, socket, struct, time, json
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from pymodbus.client import ModbusTcpClient
    MODBUS_AVAILABLE = True
except ImportError:
    MODBUS_AVAILABLE = False
    ModbusTcpClient = None

logger = logging.getLogger("modbus_dynamic")

# 识别参数
MAX_REGISTERS = 65536           # 寄存器寻址上限
DEFAULT_SCAN_SPAN = 64          # 单轮扫描寄存器跨度（避免超时）
SAMPLES = 3                     # 点位识别采样次数
SAMPLE_INTERVAL = 0.3           # 采样间隔 (s)
DYNAMIC_THRESHOLD = 1e-4        # 两次采样相对变化 > 阈值 → 动态点
PORT_TIMEOUT = 0.5              # 单连接超时 (s)
CONCURRENCY = 16                # 并发上限


@dataclass
class ModbusDevice:
    """发现的 Modbus 设备"""
    host: str
    port: int = 502
    slave_ids: List[int] = field(default_factory=list)
    points: int = 0
    first_seen: float = 0.0
    last_seen: float = 0.0


@dataclass
class RecognizedPoint:
    """识别出的点位"""
    address: int                # 寄存器起始地址
    register_count: int         # 1=16bit / 2=32bit
    data_type: str              # uint16/int16/uint32/int32/float32
    byte_order: str             # AB (大端标准) / BA (小端)
    scale: float                # 缩放系数（依据典型量程推断, 默认 1.0）
    is_dynamic: bool            # True=实时变化点, False=静态点(配置/状态)
    sample_values: List[float] = field(default_factory=list)
    last_value: float = 0.0


def _read_register(client: ModbusTcpClient, addr: int, slave: int,
                   count: int = 1) -> Optional[List[int]]:
    """只读保持寄存器 (FC03) — 零侵入"""
    try:
        r = client.read_holding_registers(addr, count, slave=slave)
        if r.isError():
            return None
        return list(r.registers)
    except Exception:
        return None


class DynamicModbusScanner:
    """Modbus TCP 动态扫描器 — 网段发现 + 点位识别 + 差异巡检"""

    def __init__(self, port: int = 502, timeout: float = PORT_TIMEOUT,
                 max_workers: int = CONCURRENCY):
        self.port = port
        self.timeout = timeout
        self.max_workers = min(max_workers, 32)
        self._devices: Dict[str, ModbusDevice] = {}
        self._last_points: Dict[str, List[RecognizedPoint]] = {}

    # ═══════════════════════════════════════
    # 1. 网段扫描 — 发现新上线设备 (IP 动态)
    # ═══════════════════════════════════════

    def _probe_host(self, host: str) -> Optional[float]:
        """探测单台主机是否为 Modbus 设备, 返回握手延迟"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(self.timeout)
            t0 = time.time()
            sock.connect((host, self.port))
            lat = (time.time() - t0) * 1000
            sock.close()
            return lat
        except Exception:
            return None

    def discover_network(self, ip_prefix: str, start: int = 1, end: int = 254,
                         deep: bool = False) -> List[ModbusDevice]:
        """扫描网段发现 Modbus 设备 (如 prefix='11.248', 195~205)

        deep=True 时进一步探测从站, 确认是 Modbus 从站而非任意 TCP 服务
        """
        hosts = [f"{ip_prefix}.{i}" for i in range(start, end + 1)]
        found = []
        with ThreadPoolExecutor(max_workers=self.max_workers) as ex:
            futs = {ex.submit(self._probe_host, h): h for h in hosts}
            for f in as_completed(futs):
                lat = f.result()
                if lat is not None:
                    host = futs[f]
                    dev = ModbusDevice(host=host, port=self.port,
                                       first_seen=time.time(), last_seen=time.time())
                    if deep:
                        slaves = self.scan_slaves(host)
                        dev.slave_ids = slaves
                        if not slaves:
                            continue
                    self._devices[host] = dev
                    found.append(dev)
                    logger.info(f"[discover] 发现设备 {host}:{self.port} "
                                f"lat={lat:.1f}ms slaves={dev.slave_ids}")
        return found

    # ═══════════════════════════════════════
    # 2. 从站扫描
    # ═══════════════════════════════════════

    def scan_slaves(self, host: str, start: int = 1, end: int = 247,
                    sample_addr: int = 0) -> List[int]:
        """扫描从站地址, 返回响应的从站列表 (只读 FC03)"""
        active = []
        with ThreadPoolExecutor(max_workers=self.max_workers) as ex:
            futs = {}
            for sid in range(start, min(end, 247) + 1):
                futs[ex.submit(self._probe_slave, host, sid, sample_addr)] = sid
            for f in as_completed(futs):
                if f.result():
                    active.append(futs[f])
        active.sort()
        if host in self._devices:
            self._devices[host].slave_ids = active
        return active

    def _probe_slave(self, host: str, slave: int, addr: int = 0) -> bool:
        c = ModbusTcpClient(host, self.port, timeout=self.timeout)
        try:
            if not c.connect():
                return False
            r = c.read_holding_registers(addr, 1, slave=slave)
            return not r.isError()
        except Exception:
            return False
        finally:
            c.close()

    # ═══════════════════════════════════════
    # 3. 点位识别 — 有效性 + 类型 + 字节序 + 动态性
    # ═══════════════════════════════════════

    def recognize_points(self, host: str, slave: int = 1,
                         scan_span: int = DEFAULT_SCAN_SPAN,
                         max_address: int = 4096) -> List[RecognizedPoint]:
        """识别从站有效点位

        流程:
          a) 分段扫描寄存器, 保留可读且非 0xFFFF/全零 的地址
          b) 对候选点连续 SAMPLES 次采样, 判断动态/静态
          c) 相邻 32bit 组合, 推断 float32/uint32 及字节序
        """
        c = ModbusTcpClient(host, self.port, timeout=self.timeout)
        if not c.connect():
            logger.warning(f"[recognize] 无法连接 {host}")
            return []
        points: List[RecognizedPoint] = []

        try:
            # 候选寄存器扫描
            candidates = []
            addr = 0
            while addr < max_address:
                cnt = min(scan_span, max_address - addr)
                regs = _read_register(c, addr, slave, cnt)
                if regs is None:
                    break  # 超过设备寄存器范围
                for i, v in enumerate(regs):
                    a = addr + i
                    if v != 0xFFFF and v != 0:
                        candidates.append(a)
                addr += cnt
                time.sleep(0.02)  # 节流, 避免冲击设备

            # 采样识别
            for base_addr in candidates:
                samples = self._sample(c, base_addr, slave)
                if not samples:
                    continue
                pt = self._classify(base_addr, samples)
                points.append(pt)
        finally:
            c.close()

        self._last_points[f"{host}:{slave}"] = points
        logger.info(f"[recognize] {host} slave={slave} 识别点位 {len(points)} 个")
        return points

    def _sample(self, client, addr: int, slave: int,
                n: int = SAMPLES) -> List[List[int]]:
        """对 addr 与 addr+1 连续采样 n 次 (32bit 组合需要)"""
        out = []
        for _ in range(n):
            v = _read_register(client, addr, slave, 2)  # 读 2 个寄存器
            if v is None:
                return []
            out.append(v)
            time.sleep(SAMPLE_INTERVAL)
        return out

    @staticmethod
    def _classify(base_addr: int, samples: List[List[int]]) -> RecognizedPoint:
        """分类: 数据类型 / 字节序 / 动态性 / 缩放"""
        # 32bit 组合尝试 (大端 AB: reg0<<16|reg1, 小端 BA: reg1<<16|reg0)
        ab = [((s[0] << 16) | s[1]) for s in samples]
        ba = [((s[1] << 16) | s[0]) for s in samples]

        # float32 合理性检测
        def _valid_float(x):
            try:
                import math
                f = struct.unpack('>f', struct.pack('>I', x & 0xFFFFFFFF))[0]
                return math.isfinite(f) and abs(f) < 1e12 and abs(f) > 1e-10
            except Exception:
                return False

        # 判动态: 采样值是否变化
        def _is_dynamic(vals):
            v0 = vals[0]
            return any(abs(v - v0) > max(DYNAMIC_THRESHOLD, abs(v0) * 1e-3)
                       for v in vals[1:])

        # 字节序与类型推断
        if all(_valid_float(v) for v in ab) and _is_dynamic(ab):
            data_type, byte_order, regs, vals = "float32", "AB", 2, ab
        elif all(_valid_float(v) for v in ba) and _is_dynamic(ba):
            data_type, byte_order, regs, vals = "float32", "BA", 2, ba
        elif all(v <= 0xFFFF for v in [s[0] for s in samples]):
            data_type, byte_order, regs, vals = "uint16", "AB", 1, [s[0] for s in samples]
        else:
            data_type, byte_order, regs, vals = "uint32", "AB", 2, ab

        # 缩放推断: 依据变化粒度, 常见 0.01 (压力/温度工程值)
        scale = 1.0
        if data_type == "float32":
            scale = 1.0  # float 已含小数点
        elif regs == 1 and max(vals) > 1000 and _is_dynamic(vals):
            scale = 0.01

        last_v = vals[-1]
        return RecognizedPoint(
            address=base_addr, register_count=regs, data_type=data_type,
            byte_order=byte_order, scale=scale, is_dynamic=_is_dynamic(vals),
            sample_values=vals, last_value=last_v)

    # ═══════════════════════════════════════
    # 4. 差异巡检 — 动态感知变化
    # ═══════════════════════════════════════

    def patrol(self, ip_prefix: str, start: int, end: int,
               interval_s: float = 30, rounds: int = 0) -> dict:
        """定时巡检网段, 输出设备/点位变化报告 (rounds=0 无限)"""
        report = {"discovered": [], "lost": [], "point_changes": []}
        round_no = 0
        while rounds == 0 or round_no < rounds:
            round_no += 1
            t0 = time.time()

            # 设备发现
            now_devs = self.discover_network(ip_prefix, start, end, deep=True)
            now_hosts = {d.host for d in now_devs}
            old_hosts = set(self._devices.keys())
            for h in now_hosts - old_hosts:
                report["discovered"].append({"host": h, "at": time.time()})
            for h in old_hosts - now_hosts:
                report["lost"].append({"host": h, "at": time.time()})
                self._devices.pop(h, None)

            # 点位识别 (每个新设备)
            for dev in now_devs:
                for sid in dev.slave_ids[:4]:  # 单轮最多 4 个从站
                    pts = self.recognize_points(dev.host, slave=sid)
                    key = f"{dev.host}:{sid}"
                    old = self._last_points.get(key, [])
                    if old:
                        old_addrs = {p.address for p in old}
                        new_addrs = {p.address for p in pts}
                        for a in new_addrs - old_addrs:
                            report["point_changes"].append(
                                {"type": "new", "host": dev.host, "slave": sid,
                                 "address": a, "at": time.time()})
                        for a in old_addrs - new_addrs:
                            report["point_changes"].append(
                                {"type": "gone", "host": dev.host, "slave": sid,
                                 "address": a, "at": time.time()})
                    self._last_points[key] = pts

            logger.info(f"[patrol] 第{round_no}轮: 新增设备={len(report['discovered'])} "
                        f"丢失={len(report['lost'])} 点位变化={len(report['point_changes'])}")
            elapsed = time.time() - t0
            if interval_s - elapsed > 0:
                time.sleep(interval_s - elapsed)
        return report

    # ═══════════════════════════════════════
    # 输出
    # ═══════════════════════════════════════

    def export_points(self, host: str, slave: int = 1) -> List[dict]:
        """导出识别点表 (用于生成采集配置, 不修改线上配置)"""
        pts = self._last_points.get(f"{host}:{slave}", [])
        return [asdict(p) for p in pts]

    def to_json(self, path: str = "modbus_discovery.json") -> None:
        out = {"scanned_at": time.time(), "devices": [
            {"host": d.host, "port": d.port, "slave_ids": d.slave_ids,
             "points": d.points, "first_seen": d.first_seen,
             "last_seen": d.last_seen} for d in self._devices.values()]}
        with open(path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)


# ═══════════════════════════════════════════
# 自测
# ═══════════════════════════════════════════

def _selftest():
    """本地模拟 Modbus 从站验证识别 (pymodbus server)"""
    import threading
    try:
        from pymodbus.server import StartTcpServer
        from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext
        HAS_SERVER = True
    except ImportError:
        HAS_SERVER = False

    if not (MODBUS_AVAILABLE and HAS_SERVER):
        print("SKIP: 需要 pymodbus (pip install pymodbus)")
        return

    # 模拟从站: addr0=动态uint16, addr10-11=float32 大端, addr100=静态
    import random
    store = ModbusSlaveContext(
        di=ModbusSequentialDataBlock(0, [0] * 1000),
        co=ModbusSequentialDataBlock(0, [0] * 1000),
        hr=ModbusSequentialDataBlock(0, [0] * 1000),
        ir=ModbusSequentialDataBlock(0, [0] * 1000))
    ctx = ModbusServerContext(slaves={1: store}, single=False)

    def _updater():
        while True:
            store.setValues(3, 0, [random.randint(1000, 2000)])
            store.setValues(3, 10, [0x3F80, 0x0000])  # 1.0 float32 BE
            store.setValues(3, 100, [42])             # 静态点
            time.sleep(0.2)
    threading.Thread(target=_updater, daemon=True).start()

    t = threading.Thread(target=StartTcpServer, kwargs={
        "context": ctx, "address": ("127.0.0.1", 1502)}, daemon=True)
    t.start()
    time.sleep(0.5)

    sc = DynamicModbusScanner(port=1502, timeout=0.5)
    devs = sc.discover_network("127.0.0", start=1, end=1, deep=False)
    print(f"[1] 网段扫描: {len(devs)} 台 (期望 1)")
    slaves = sc.scan_slaves("127.0.0.1", 1, 5)
    print(f"[2] 从站扫描: {slaves} (期望 [1])")
    pts = sc.recognize_points("127.0.0.1", slave=1, max_address=200)
    for p in pts:
        print(f"[3] 点位: addr={p.address:>3} type={p.data_type:>7} "
              f"order={p.byte_order} dyn={p.is_dynamic} val={p.last_value}")
    print(f"[4] 识别点位总数: {len(pts)} (期望 ≥3)")
    assert len(devs) == 1, "网段扫描失败"
    assert 1 in slaves, "从站扫描失败"
    assert len(pts) >= 3, "点位识别失败"


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("modbus_dynamic selftest OK")
