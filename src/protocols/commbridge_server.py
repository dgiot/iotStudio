"""
LegacyComm 兼容 TCP Server — 替代 LegacyComm.exe 接管 RTU 采集 v2.0
=====================================================================
基于 7.10.pcapng 真实报文逆向 (2026-07-12):

真实协议 (已确认):
  RTU注册:    0xAA + SlaveID(1B) + ASCII_DeviceID + 0x0D
  Server→RTU: Seq(1B) + Flags(4B=0) + Len(1B) + Slave(1B) + Func(1B) + Data(N)
  RTU→Server: Seq(1B) + Flags(4B=0) + Len(1B) + Slave(1B) + Func(1B) + Data(N)
  心跳:       0x00 (单字节)

Len 字段 = 从 Slave 开始到 Data 结束的字节数 (不含 Seq+Flags)
Func 0x03 查询 Data: StartAddr(2B) + Quantity(2B)
Func 0x03 响应 Data: ByteCount(1B) + RegisterValues(N*2B)
Func 0x10 写寄存器 Data: StartAddr(2B) + Quantity(2B) + ByteCount(1B) + Values(N*2B)

数据公式: Y × Coefficient[i] (Y=16位有符号, 8192标定)
"""

from __future__ import annotations
import asyncio, struct, logging, time
from dataclasses import dataclass
from typing import Dict, Optional
from datetime import datetime

log = logging.getLogger("commbridge")

# ═══════════════════════════════════════════════════════════
# 真实协议帧操作 (基于 pcapng 报文)
# ═══════════════════════════════════════════════════════════

FRAME_HEADER = 0xAA
FRAME_TAIL = 0x0D

# 帧类型常量 (从逆向代码段确认)
FT_HEARTBEAT = 0x00
FT_REGISTER = 0xAA


def parse_registration(data: bytes) -> Optional[tuple]:
    """解析 RTU 注册包: 0xAA + SlaveID + ASCII_ID + 0x0D
    返回 (slave_id, device_id_str) 或 None
    """
    if len(data) < 4:
        return None
    if data[0] != 0xAA:
        return None
    if data[-1] != 0x0D:
        return None
    slave_id = data[1]
    # 中间是 ASCII 设备ID
    device_id = data[2:-1].decode('ascii', errors='ignore').strip()
    if not device_id:
        return None
    return (slave_id, device_id)


def build_query(seq: int, slave_id: int, func: int, data: bytes) -> bytes:
    """构造 Server→RTU 查询帧
    格式: Seq(1B) + Flags(4B=0) + Len(1B) + Slave(1B) + Func(1B) + Data(N)
    Len = 1(Slave) + 1(Func) + len(Data)
    """
    payload_len = 1 + 1 + len(data)  # Slave + Func + Data
    return struct.pack('>BIB', seq, 0, payload_len) + struct.pack('>BB', slave_id, func) + data


def build_read_query(seq: int, slave_id: int, start_addr: int, quantity: int) -> bytes:
    """构造读保持寄存器查询 (Func=0x03)"""
    data = struct.pack('>HH', start_addr, quantity)
    return build_query(seq, slave_id, 0x03, data)


def parse_response(data: bytes) -> Optional[dict]:
    """解析 RTU→Server 数据帧
    格式: Seq(1B) + Flags(4B) + Len(1B) + Slave(1B) + Func(1B) + Data(N)
    返回 {seq, slave, func, data} 或 None
    """
    if len(data) < 7:
        return None

    # 心跳: 单字节 0x00
    if len(data) == 1 and data[0] == 0x00:
        return {'seq': 0, 'slave': 0, 'func': 0, 'data': b'', 'is_heartbeat': True}

    seq = data[0]
    # flags = data[1:5]  # 总是 0x00000000
    payload_len = data[5]
    slave = data[6]
    func = data[7] if len(data) > 7 else 0
    payload = data[8:8 + payload_len - 2] if len(data) >= 8 + payload_len - 2 else data[8:]

    return {
        'seq': seq,
        'slave': slave,
        'func': func,
        'data': payload,
        'is_heartbeat': False,
    }


def parse_reg_values(data: bytes, func: int) -> Optional[dict]:
    """从响应 Data 中提取寄存器值
    Func 0x03/0x04 Data: ByteCount(1B) + Values
      - ByteCount%4==0: float32 工程值 (已转换, 不乘coefficient)
      - ByteCount%2==0: int16 原始值 (需 × coefficient)
    返回 {'values': [float], 'is_float': bool}
    """
    if func in (0x03, 0x04):
        if len(data) < 1:
            return None
        byte_count = data[0]
        if len(data) < 1 + byte_count:
            return None
        payload = data[1:1+byte_count]

        values = []
        is_float = (byte_count % 4 == 0)

        if is_float:
            # float32 — 已是工程值
            for i in range(0, byte_count, 4):
                if i + 4 <= len(payload):
                    val = struct.unpack('>f', payload[i:i+4])[0]
                    values.append(round(val, 6))
        else:
            # int16 — 原始值, 需 coefficient 转换
            for i in range(0, byte_count, 2):
                if i + 2 <= len(payload):
                    val = struct.unpack('>H', payload[i:i+2])[0]
                    if val >= 32768:
                        val = val - 65536
                    values.append(val)

        return {'values': values, 'is_float': is_float}
    return None


# ═══════════════════════════════════════════════════════════
# 数据转换 (Device.ini ChangeData)
# ═══════════════════════════════════════════════════════════

COEFFICIENTS = [
    170 / 8192,        # 0: 电流/电压
    8.5 / 8192,        # 1: 接地电流
    170 / 8192,        # 2: 相电压
    170 * 8.5 / 8192,  # 3: 有功功率
    1 / 8192,          # 4: 功率因数
    2 / 8192,          # 5: 频率 F=50+Y×2/8192
    1, 1, 1, 1,        # 6-9: 直通
]

DEVICE_TYPES = {
    0x00: ("DSL-31A 断路器", 20),
    0x10: ("DST-31A 变压器差动", 15),
    0x20: ("DBPA-31A 备用电源", 13),
    0x30: ("DSB-31A 变压器后备", 20),
    0x40: ("电动机保护", 19),
    0x50: ("DST-22D 变压器差动", 20),
    0x60: ("DSB-22D 变压器后备", 20),
    0x70: ("DSL-24D 断路器", 20),
    0x80: ("DGP-11 变压器差动", 21),
    0x90: ("DGP-12 变压器后备", 24),
    0xA0: ("DGP-13 接地保护", 22),
    0xB0: ("DMP-31A 电动机", 19),
}


def apply_formula(raw_values: list, coeff_map: list = None) -> dict:
    """应用转换公式: 物理值 = Y × Coefficient[map[i]]
    如果 coeff_map 为 None, 值已是 float32 工程值, 直接使用
    """
    result = {}
    for i, raw in enumerate(raw_values):
        if coeff_map is None:
            result[f"ch{i:02d}"] = raw  # 已是工程值
        else:
            ci = coeff_map[i] if i < len(coeff_map) else 0
            coeff = COEFFICIENTS[ci] if ci < len(COEFFICIENTS) else 1.0
            result[f"ch{i:02d}"] = round(raw * coeff, 6)
    return result


# ═══════════════════════════════════════════════════════════
# 运行时数据校验 (第二层保障)
# ═══════════════════════════════════════════════════════════

# 各设备类型的量程范围 (工程值)
RANGES = {
    "current":  (0, 500),      # 电流 0-500A (CT一次侧)
    "voltage":  (100, 400),    # 电压 100-400V
    "power":    (0, 300000),   # 功率 0-300kW
    "pressure": (0, 40),       # 套压 0-40MPa
    "stroke":   (0, 10),       # 冲程 0-10m
    "frequency":(45, 55),      # 频率 45-55Hz
    "cos_phi":  (-1, 1),       # 功率因数 -1~1
}

# 从 Oracle TAGPAR 获取的量程 (基于实际配置 RANGEMAXIMUM)
DEFAULT_RANGES = {i: (0, 1000) for i in range(30)}  # 默认0-1000


def validate_frame(parsed: dict, raw_len: int) -> bool:
    """验证帧格式一致性"""
    if not parsed:
        return False
    plen = parsed.get('data', b'')
    data_len = len(plen) if plen else 0
    # Len字段应与实际数据长度匹配
    expected_data_len = raw_len - 8  # 减去Seq+Flags+Lens+Slave+Func = 6 + 2 = 8
    return abs(expected_data_len - (data_len + 2)) <= 2  # ±2容差


def validate_values(values: list, dev_type: int, is_float: bool) -> dict:
    """校验寄存器值是否在合理范围
    返回: {ok: bool, alerts: [(index, value, reason)], stats: dict}
    """
    alerts = []
    stats = {"total": len(values), "in_range": 0, "out_of_range": 0, "zero": 0}

    for i, v in enumerate(values):
        if v == 0 or abs(v) < 0.001:
            stats["zero"] += 1
            continue

        # 根据设备类型和通道位置推断预期范围
        rng = (0, 10000)  # default wide range
        if is_float:
            # float32 工程值, 根据典型位置判断
            if i < 3:
                rng = RANGES["current"]
                label = "电流"
            elif i < 6:
                rng = RANGES["voltage"]
                label = "电压"
            elif i == 6:
                rng = RANGES["power"]
                label = "功率"
            elif i == 7:
                rng = RANGES["cos_phi"]
                label = "功率因数"
            else:
                label = f"ch{i}"
        else:
            # int16 原始值, 检查是否在 ±8192 合理范围
            if abs(v) > 32767:
                alerts.append((i, v, f"int16溢出: {v}"))
                stats["out_of_range"] += 1
                continue
            label = f"ch{i}"

        if rng[0] <= v <= rng[1]:
            stats["in_range"] += 1
        else:
            alerts.append((i, v, f"{label}越界: {v} ∉ [{rng[0]}, {rng[1]}]"))
            stats["out_of_range"] += 1

    return {
        "ok": len(alerts) == 0 or stats["out_of_range"] < stats["total"] * 0.2,
        "alerts": alerts,
        "stats": stats,
    }


def cross_validate(values: list, prev_values: list = None, is_float: bool = False) -> dict:
    """跨通道交叉验证 + 历时一致性
    L3 逻辑自洽:
      - 三相电流偏差 < 20%
      - P ≈ √3 × Uavg × Iavg × 0.85
    L4 历时一致:
      - 相邻值变化 < 50%
    返回: {ok, checks: {name: pass/fail}, delta_pct: float}
    """
    checks = {}
    n = len(values)

    # L3: 三相平衡检查 (float32, 前6个值通常是 I/U)
    if is_float and n >= 6:
        # 三相电流平衡
        if n >= 3:
            I = values[:3]
            Iavg = sum(I) / 3 if sum(I) > 0 else 1
            I_dev = max(abs(v - Iavg) for v in I) / Iavg
            checks["3phase_I_balance"] = I_dev < 0.25  # 25%内算平衡

        # 三相电压平衡
        if n >= 6:
            U = values[3:6]
            Uavg = sum(U) / 3 if sum(U) > 0 else 1
            U_dev = max(abs(v - Uavg) for v in U) / Uavg
            checks["3phase_U_balance"] = U_dev < 0.15

        # P = √3 × U × I × cosφ (仅当值是一次的工程值时有效)
        # 注意: RTU发送CT/PT二次值, 需乘以变比, 故跳过此检查
        # 如需启用, 需知道每台RTU的CT/PT配置
        # if n >= 7 and all(v > 0 for v in values[:6]):
        #     P = values[6]
        #     S_est = 1.732 * Uavg * Iavg
        #     cos_phi = values[7] if n >= 8 and 0 < values[7] <= 1 else 0.85
        #     P_est = S_est * cos_phi
        #     if P > 100 and S_est > 100:
        #         p_dev = abs(P - P_est) / max(P, 1)
        #         checks["power_consistency"] = p_dev < 0.5

    # L4: 历时一致性
    if prev_values and len(values) == len(prev_values):
        deltas = []
        for v, pv in zip(values, prev_values):
            if abs(pv) > 0.001:
                d = abs(v - pv) / abs(pv)
                deltas.append(d)
        if deltas:
            avg_delta = sum(deltas) / len(deltas)
            max_delta = max(deltas)
            checks["delta_avg"] = avg_delta < 0.3   # 平均变化<30%
            checks["delta_max"] = max_delta < 0.5   # 最大变化<50%
            checks["delta"] = round(avg_delta, 4)

    all_pass = all(checks.values())
    return {"ok": all_pass, "checks": checks}


# ═══════════════════════════════════════════════════════════
# RTU 连接状态
# ═══════════════════════════════════════════════════════════

@dataclass
class RtuConnection:
    reader: asyncio.StreamReader
    writer: asyncio.StreamWriter
    ip: str
    port: int
    dtu_id: str = ""
    slave_id: int = 1
    device_type: int = 0x00
    connected_at: float = 0.0
    last_heartbeat: float = 0.0
    last_poll: float = 0.0
    poll_count: int = 0
    err_count: int = 0
    seq: int = 0
    is_registered: bool = False
    prev_values: list = None  # 上轮值, 用于历时校验

    @property
    def addr(self) -> str:
        return f"{self.ip}:{self.port}"


# ═══════════════════════════════════════════════════════════
# LegacyComm TCP Server (真实协议版)
# ═══════════════════════════════════════════════════════════

class LegacyCommServer:
    """LegacyComm 兼容 TCP Server — 基于真实协议

    对标 LegacyComm.exe:
      - CGPRS_TCP_Host::OnRecv → _poll_loop
      - CRegister::Login → _dtu_register
      - FormatDataBuf → _process_data
      - CB_OnAcceptConnect → _handle_client
    """

    def __init__(self, event_bus=None, port: int = 53001,
                 host: str = "0.0.0.0",
                 poll_interval: float = 1.0,
                 heartbeat_timeout: float = 60.0,
                 max_connections: int = 200):
        self._bus = event_bus
        self._port = port
        self._host = host
        self._poll_interval = poll_interval
        self._heartbeat_timeout = heartbeat_timeout
        self._max_connections = max_connections

        self._server: Optional[asyncio.AbstractServer] = None
        self._connections: Dict[str, RtuConnection] = {}
        self._lock = asyncio.Lock()
        self._running = False
        self._tasks: list = []
        self._device_configs: Dict[str, dict] = {}

        # 默认通道系数映射 (DSL-31A 20通道)
        self._default_coeff_map = (
            [1] * 6 + [2] * 6 + [3] * 2 + [4] * 2 + [0] * 4
        )

    # ── 生命周期 ──

    async def start(self):
        self._server = await asyncio.start_server(
            self._handle_client, self._host, self._port
        )
        self._running = True
        addr = self._server.sockets[0].getsockname()
        log.info(f"[commbridge] TCP Server started {addr[0]}:{addr[1]} (real protocol)")
        log.info(f"[commbridge] Poll interval={self._poll_interval}s, Heartbeat timeout={self._heartbeat_timeout}s")
        self._tasks.append(asyncio.create_task(self._heartbeat_checker()))
        if self._bus:
            self._bus.emit("commbridge.started", port=self._port, host=self._host)

    async def stop(self):
        self._running = False
        for task in self._tasks:
            task.cancel()
        async with self._lock:
            for conn in list(self._connections.values()):
                try:
                    conn.writer.close()
                except Exception:
                    pass
            self._connections.clear()
        if self._server:
            self._server.close()
            await self._server.wait_closed()
        log.info("[commbridge] TCP Server stopped")
        if self._bus:
            self._bus.emit("commbridge.stopped")

    # ── 客户端处理 ──

    async def _handle_client(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        addr = writer.get_extra_info('peername')
        if not addr:
            writer.close()
            return

        ip, port = addr[0], addr[1]
        conn = RtuConnection(reader=reader, writer=writer, ip=ip, port=port,
                             connected_at=time.time(), last_heartbeat=time.time())

        async with self._lock:
            if len(self._connections) >= self._max_connections:
                log.warning(f"[commbridge] Max connections {self._max_connections}, rejecting {ip}:{port}")
                writer.close()
                return
            self._connections[conn.addr] = conn

        log.info(f"[commbridge] RTU connected: {ip}:{port} (total:{len(self._connections)})")
        if self._bus:
            self._bus.emit("commbridge.rtu.connected", ip=ip, port=port)

        try:
            await self._dtu_register(conn)
            await self._poll_loop(conn)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            log.error(f"[commbridge] {conn.dtu_id} error: {e}")
        finally:
            await self._cleanup(conn)

    async def _dtu_register(self, conn: RtuConnection):
        """DTU 注册 — 解析 0xAA + SlaveID + ASCII_ID + 0x0D"""
        try:
            data = await asyncio.wait_for(conn.reader.read(64), timeout=10.0)
            if not data:
                raise ConnectionError("Connection closed during registration")

            result = parse_registration(data)
            if result:
                slave_id, device_id = result
                conn.slave_id = slave_id
                conn.dtu_id = device_id
                conn.is_registered = True
                conn.last_heartbeat = time.time()
                log.info(f"[commbridge] {conn.addr} REG: slave={slave_id} id='{device_id}'")
            else:
                # Fallback: use IP as ID
                conn.dtu_id = f"rtu_{conn.ip.replace('.', '_')}"
                conn.is_registered = True
                log.info(f"[commbridge] {conn.addr} No registration packet, using IP: {conn.dtu_id}")

        except asyncio.TimeoutError:
            conn.dtu_id = f"rtu_{conn.ip.replace('.', '_')}"
            conn.is_registered = True
            log.info(f"[commbridge] {conn.addr} Registration timeout, using IP: {conn.dtu_id}")

        if self._bus:
            self._bus.emit("commbridge.rtu.registered",
                           ip=conn.ip, dtu_id=conn.dtu_id, slave_id=conn.slave_id)

    # ── 轮询循环 ──

    async def _poll_loop(self, conn: RtuConnection):
        """主轮询: 用真实协议格式发送查询，解析响应"""
        config = self._device_configs.get(conn.dtu_id, {})
        reg_count = config.get("reg_count", 20)
        start_addr = config.get("start_addr", 0)
        coeff_map = config.get("coeff_map", self._default_coeff_map[:reg_count])
        dev_type = config.get("type", conn.device_type)
        dev_name = DEVICE_TYPES.get(dev_type, ("Unknown", reg_count))[0]

        while self._running:
            try:
                # 发送查询帧 (真实协议格式)
                conn.seq = (conn.seq + 1) & 0xFF
                query = build_read_query(conn.seq, conn.slave_id, start_addr, reg_count)
                conn.writer.write(query)
                await conn.writer.drain()

                # 等待响应
                response = await asyncio.wait_for(conn.reader.read(512),
                                                  timeout=self._poll_interval + 2.0)
                if not response:
                    conn.err_count += 1
                    if conn.err_count > 3:
                        raise ConnectionError("Empty response x3")
                    await asyncio.sleep(self._poll_interval)
                    continue

                # 心跳处理
                if len(response) == 1 and response[0] == 0x00:
                    conn.last_heartbeat = time.time()
                    await asyncio.sleep(self._poll_interval)
                    continue

                # 解析响应帧
                parsed = parse_response(response)
                if not parsed:
                    conn.err_count += 1
                    await asyncio.sleep(self._poll_interval)
                    continue

                conn.err_count = 0
                conn.last_heartbeat = time.time()
                conn.poll_count += 1

                # 提取寄存器值
                result = parse_reg_values(parsed['data'], parsed['func'])
                if result:
                    conn.last_poll = time.time()
                    await self._process_data(conn, result['values'],
                                            coeff_map if not result['is_float'] else None,
                                            dev_type, dev_name)

                await asyncio.sleep(self._poll_interval)

            except asyncio.TimeoutError:
                conn.err_count += 1
                if conn.err_count > 5:
                    raise ConnectionError("Timeout x5")
            except ConnectionError:
                raise
            except Exception as e:
                log.error(f"[commbridge] {conn.dtu_id} poll error: {e}")
                conn.err_count += 1
                if conn.err_count > 10:
                    raise ConnectionError("Error x10")

    async def _process_data(self, conn, raw_values, coeff_map, dev_type, dev_name):
        """数据转换 + 校验 + 推送"""
        is_float = coeff_map is None

        # 校验值范围
        check = validate_values(raw_values, dev_type, is_float)
        if not check["ok"]:
            conn.err_count += 1
            log.warning(f"[validate] {conn.dtu_id} #{conn.poll_count}: "
                       f"range alerts={len(check['alerts'])} "
                       f"in_range={check['stats']['in_range']}/{check['stats']['total']}")
            for idx, val, reason in check["alerts"][:3]:
                log.debug(f"[validate] ch{idx:02d}={val} -> {reason}")
            if conn.err_count > 10:
                raise ConnectionError(f"连续校验失败: {conn.err_count}次")

        # L3/L4 交叉验证
        cross = cross_validate(raw_values, conn.prev_values, is_float)
        conn.prev_values = raw_values  # 保存本轮值供下轮对比

        if not cross["ok"]:
            conn.err_count += 1
            log.warning(f"[validate] {conn.dtu_id} #{conn.poll_count}: "
                       f"cross_checks={cross['checks']}")

        # 转换
        converted = apply_formula(raw_values, coeff_map)

        payload = {
            "dtu_id": conn.dtu_id,
            "ip": conn.ip,
            "slave_id": conn.slave_id,
            "device_type": dev_type,
            "device_name": dev_name,
            "raw": raw_values,
            "values": converted,
            "timestamp": time.time(),
            "poll_seq": conn.poll_count,
            "validated": check["ok"],
            "stats": check["stats"],
            "cross_check": cross["checks"],
        }

        if self._bus:
            self._bus.emit("commbridge.data.received", **payload)
            self._bus.emit(f"device.{conn.dtu_id}.telemetry", **payload)

    # ── 清理 ──

    async def _cleanup(self, conn: RtuConnection):
        async with self._lock:
            if conn.addr in self._connections:
                del self._connections[conn.addr]
        try:
            conn.writer.close()
        except Exception:
            pass
        log.info(f"[commbridge] {conn.dtu_id} disconnected (polls={conn.poll_count} errs={conn.err_count})")
        if self._bus:
            self._bus.emit("commbridge.rtu.disconnected",
                           ip=conn.ip, dtu_id=conn.dtu_id,
                           poll_count=conn.poll_count, err_count=conn.err_count)

    # ── 后台 ──

    async def _heartbeat_checker(self):
        while self._running:
            await asyncio.sleep(10)
            now = time.time()
            async with self._lock:
                timed_out = [(addr, conn) for addr, conn in self._connections.items()
                            if now - conn.last_heartbeat > self._heartbeat_timeout]
            for addr, conn in timed_out:
                log.warning(f"[commbridge] {conn.dtu_id} heartbeat timeout")
                async with self._lock:
                    if addr in self._connections:
                        conn.writer.close()

    # ── 管理 ──

    def status(self) -> dict:
        return {
            "running": self._running,
            "port": self._port,
            "connections": len(self._connections),
            "rtus": [{"dtu_id": c.dtu_id, "ip": c.ip, "slave": c.slave_id,
                      "polls": c.poll_count, "errors": c.err_count,
                      "uptime": round(time.time() - c.connected_at, 0)}
                     for c in self._connections.values()],
        }

    def register_device(self, dtu_id: str, config: dict):
        self._device_configs[dtu_id] = config
