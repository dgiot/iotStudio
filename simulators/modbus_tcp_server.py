#!/usr/bin/env python3
# ============================================================
# pythonIot — Modbus TCP 模拟器
# 模拟: 光伏逆变器 + 储能PCS + 充电桩
# 启动: python modbus_tcp_server.py
# 默认端口: 502, 1502, 2502
# ============================================================
"""
三个 Modbus TCP Server，分别模拟:
  - 端口 502:  光伏逆变器 (Holding Registers: 电压/电流/功率/发电量)
  - 端口 1502: 储能PCS     (Holding Registers: SOC/SOH/充放电功率/温度)
  - 端口 2502: 充电桩       (Holding Registers: 状态/充电功率/累计电量)

数据会自动缓慢变化，模拟真实设备行为。
"""
import asyncio
import logging
import random
import time
import math
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext, ModbusSequentialDataBlock
from pymodbus.server import StartAsyncTcpServer
from pymodbus.device import ModbusDeviceIdentification

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("modbus-sim")


# ===== 模拟器类 =====
class DeviceSimulator:
    """动态寄存器模拟器 — 支持固定值覆盖"""

    def __init__(self, base_values: dict, noise: float = 0.02):
        self.base = base_values    # {register_address: (base_value, amplitude, min, max)}
        self.noise = noise
        self._phase = {}
        self.fixed: dict = {}      # {addr: int16_value} — 固定值，优先级高于动态

    def set_fixed(self, addr: int, value: float):
        """设置固定寄存器值"""
        self.fixed[addr] = int(value)

    def clear_fixed(self, addr: int = None):
        """清除固定值"""
        if addr is None: self.fixed.clear()
        else: self.fixed.pop(addr, None)

    def update(self):
        """更新所有寄存器值，返回 {addr: int16_value}"""
        t = time.time()
        result = {}
        for addr, (base, amp, vmin, vmax) in self.base.items():
            if addr in self.fixed:
                result[addr] = self.fixed[addr]
                continue
            phase = self._phase.get(addr, random.uniform(0, math.pi * 2))
            self._phase[addr] = phase + 0.05  # 缓慢变化
            noise = random.gauss(0, amp * self.noise)
            raw = base + amp * math.sin(self._phase[addr]) + noise
            raw = max(vmin, min(vmax, raw))
            result[addr] = int(raw)
        return result

    def float_to_regs(self, value: float) -> tuple:
        """float32 → 2个uint16"""
        import struct
        b = struct.pack('>f', value)
        hi, lo = struct.unpack('>HH', b)
        return (hi, lo)

    def int32_to_regs(self, value: int) -> tuple:
        """int32 → 2个uint16"""
        hi = (value >> 16) & 0xFFFF
        lo = value & 0xFFFF
        return (hi, lo)


# ===== 逆变器模拟器 =====
class InverterSim(DeviceSimulator):
    """光伏逆变器 — 寄存器映射 (Holding Registers 0-19)"""

    def __init__(self):
        super().__init__({
            0x0000: (230.0, 5, 210, 270),   # A相电压(V)
            0x0002: (15.2, 3, 0, 30),        # A相电流(A)
            0x0004: (3480, 400, 0, 5000),    # 有功功率(W)
            0x0006: (0.98, 0.02, 0.9, 1.0), # 功率因数
            0x0008: (45.2, 3, 20, 80),       # 逆变器温度(°C)
            0x000A: (152340, 120, 0, 999999),# 日发电量(Wh)
            0x000C: (0, 0, 0, 0),            # 累计发电量高16位
            0x000E: (0, 0, 0, 0),            # 累计发电量低16位
            0x0010: (800, 50, 600, 1000),    # 直流电压(V)
            0x0012: (4.3, 0.5, 0, 10),       # 直流电流(A)
        })

    def get_registers(self) -> dict:
        vals = self.update()
        regs = {}
        for addr, val in vals.items():
            hi, lo = self.float_to_regs(val)
            regs[addr] = hi
            regs[addr + 1] = lo
        # 累计发电量 int32 (持续增长)
        total_kwh = int(152340 + time.time() % 86400 * 0.01)
        hi, lo = self.int32_to_regs(total_kwh)
        regs[0x000C] = hi
        regs[0x000E] = lo
        return regs


# ===== 储能PCS模拟器 =====
class PCSSim(DeviceSimulator):
    """储能PCS — 寄存器映射 (Holding Registers 0-19)"""

    def __init__(self):
        super().__init__({
            0x0000: (75.5, 8, 0, 100),       # SOC(%)
            0x0002: (98.2, 0.5, 80, 100),    # SOH(%)
            0x0004: (35.0, 2, 20, 50),        # 电芯温度(°C)
            0x0006: (2500, 800, -5000, 5000), # 有功功率(W), 正=放电,负=充电
            0x0008: (230.0, 3, 210, 250),     # 交流电压(V)
            0x000A: (10.8, 3, 0, 25),          # 交流电流(A)
            0x000C: (0, 0, 0, 0),             # 充放电状态 (0=待机,1=充电,2=放电)
            0x0010: (0, 0, 0, 0),             # 累计充电量高16位
            0x0012: (0, 0, 0, 0),             # 累计充电量低16位
            0x0014: (0, 0, 0, 0),             # 累计放电量高16位
            0x0016: (0, 0, 0, 0),             # 累计放电量低16位
        })

    def get_registers(self) -> dict:
        vals = self.update()
        regs = {}
        # 功率
        power = vals[0x0006]
        hi, lo = self.float_to_regs(power)
        regs[0x0006] = hi
        regs[0x0007] = lo
        # SOC, SOH, Temp
        for addr in [0x0000, 0x0002, 0x0004]:
            hi, lo = self.float_to_regs(vals[addr])
            regs[addr] = hi
            regs[addr + 1] = lo
        # 电压电流
        hi, lo = self.float_to_regs(vals[0x0008])
        regs[0x0008] = hi; regs[0x0009] = lo
        hi, lo = self.float_to_regs(vals[0x000A])
        regs[0x000A] = hi; regs[0x000B] = lo
        # 状态
        regs[0x000C] = 1 if power < -100 else (2 if power > 100 else 0)
        # 累计值
        chg = int(45200 + time.time() % 86400 * 0.005)
        dch = int(38100 + time.time() % 86400 * 0.004)
        regs[0x0010], regs[0x0011] = self.int32_to_regs(chg)
        regs[0x0012], regs[0x0013] = self.int32_to_regs(dch >> 16)
        regs[0x0014], regs[0x0015] = self.int32_to_regs(dch)
        regs[0x0016], regs[0x0017] = self.int32_to_regs(dch)
        return regs


# ===== 充电桩模拟器 =====
class ChargerSim(DeviceSimulator):
    """充电桩 — 寄存器映射 (Holding Registers 0-15)"""

    def __init__(self):
        super().__init__({
            0x0000: (3.0, 2, 0, 5),          # 状态 (0=空闲,1=充电中,2=故障,3=已充满)
            0x0002: (30.0, 20, 0, 60),        # 充电功率(kW)
            0x0004: (380.0, 5, 350, 430),     # 输出电压(V)
            0x0006: (45.0, 25, 0, 80),        # 输出电流(A)
            0x0008: (25.5, 5, 10, 50),        # 当前充电量(kWh)
            0x000A: (28500, 120, 0, 999999),  # 累计充电量高16位
            0x000C: (0, 0, 0, 0),             # 累计充电量低16位
            0x000E: (40.0, 3, 20, 60),        # 模块温度(°C)
        })

    def get_registers(self) -> dict:
        vals = self.update()
        regs = {}
        # 状态变化: 70% 充电中, 20% 空闲, 5% 故障, 5% 充满
        r = random.random()
        status = 1 if r < 0.7 else (0 if r < 0.9 else (2 if r < 0.95 else 3))
        regs[0x0000] = status
        if status != 1:
            vals[0x0002] = 0; vals[0x0006] = 0; vals[0x0008] = 0
        for addr in [0x0002, 0x0004, 0x0006, 0x0008, 0x000E]:
            hi, lo = self.float_to_regs(vals[addr])
            regs[addr] = hi; regs[addr + 1] = lo
        total = int(28500 + time.time() % 86400 * 0.02)
        regs[0x000A], regs[0x000C] = self.int32_to_regs(total)
        return regs


# ===== 服务器管理 =====
class ModbusSimServer:
    """多设备模拟服务器"""

    def __init__(self, host="0.0.0.0"):
        self.host = host
        self.inverter = InverterSim()
        self.pcs = PCSSim()
        self.charger = ChargerSim()
        self._running = False

    def build_context(self, simulator):
        """从模拟器构建 Modbus Server Context"""
        regs = simulator.get_registers()
        # 填充到足够大的寄存器空间
        block = [0] * 256
        for addr, val in regs.items():
            if addr < 256:
                block[addr] = val & 0xFFFF
        return ModbusSlaveContext(
            hr=ModbusSequentialDataBlock(0, block),  # Holding Registers (FC03/06/16)
            ir=ModbusSequentialDataBlock(0, [0] * 256),  # Input Registers (FC04)
            co=ModbusSequentialDataBlock(0, [0] * 100),  # Coils (FC01/05/15)
            di=ModbusSequentialDataBlock(0, [0] * 100),  # Discrete Inputs (FC02)
        )

    async def _update_loop(self):
        """每秒更新寄存器值（跳过固定值）"""
        while self._running:
            try:
                for sim, ctx, sim_name in [(self.inverter, self.contexts[0], "inverter"),
                                           (self.pcs, self.contexts[1], "pcs"),
                                           (self.charger, self.contexts[2], "charger")]:
                    regs = sim.get_registers()
                    for addr, val in regs.items():
                        # 固定值不覆盖（保持写入的值）
                        if addr in sim.fixed:
                            continue
                        if addr < 256:
                            ctx.setValues(3, addr, [val & 0xFFFF])
                await asyncio.sleep(1)
            except Exception as e:
                logger.error(f"更新失败: {e}")
                await asyncio.sleep(1)

    async def start_server(self, port, context, name):
        """启动单个 Modbus TCP Server"""
        identity = ModbusDeviceIdentification()
        identity.VendorName = "iotStudio"; identity.ProductName = name
        identity.Model = "SIM-2026"; identity.Version = "V1.0"
        await StartAsyncTcpServer(
            context=ModbusServerContext(slaves={1: context}, single=False),
            identity=identity,
            address=(self.host, port),
        )

    async def start(self):
        """启动三个 Modbus TCP 服务器"""
        self._running = True
        self.contexts = [self.build_context(self.inverter),
                         self.build_context(self.pcs),
                         self.build_context(self.charger)]

        asyncio.create_task(self._update_loop())

        logger.info("=" * 60)
        logger.info("Modbus TCP 模拟器启动")
        logger.info(f"  逆变器:  {self.host}:502")
        logger.info(f"  储能PCS: {self.host}:1502")
        logger.info(f"  充电桩:  {self.host}:2502")
        logger.info("=" * 60)

        await asyncio.gather(
            self.start_server(502,  self.contexts[0], "光伏逆变器"),
            self.start_server(1502, self.contexts[1], "储能PCS"),
            self.start_server(2502, self.contexts[2], "充电桩"),
        )


async def main():
    sim = ModbusSimServer()
    await sim.start()


if __name__ == "__main__":
    import sys
    print("启动 Modbus TCP 模拟器...")
    print("  端口 502  → 光伏逆变器")
    print("  端口 1502 → 储能PCS")
    print("  端口 2502 → 充电桩")
    print("  按 Ctrl+C 停止\n")
    asyncio.run(main())
