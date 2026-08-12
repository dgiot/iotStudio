#!/usr/bin/env python3
# ============================================================
# iotStudio — Modbus RTU Server 模拟器
# 模拟 RS-485 电表设备
# ============================================================
"""
Modbus RTU 从站模拟器 — 模拟 RS-485 电表

Windows 需要虚拟串口对 (com0com):
  https://sourceforge.net/projects/com0com/
  安装后创建 COM2-COM3 虚拟串口对
  本脚本监听 COM2，iotStudio 连接 COM3

Linux/macOS:
  socat -d -d pty,raw,echo=0 pty,raw,echo=0  # 创建虚拟串口对

启动: python modbus_rtu_server.py --port COM2 --baudrate 9600
"""
import asyncio
import logging
import random
import struct
import sys
import time
import math
from argparse import ArgumentParser

from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext, ModbusSequentialDataBlock
from pymodbus.server import StartAsyncSerialServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.transaction import ModbusRtuFramer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("modbus-rtu-sim")


class RTUDeviceSim:
    """电表寄存器模拟器 — 缓慢变化"""

    def __init__(self):
        self._phase = {}
        # 电表典型寄存器
        self._base = {
            0x0000: (230.0, 3, 210, 270),    # A相电压
            0x0002: (15.2, 3, 0, 30),         # A相电流
            0x0004: (3480, 400, 0, 5000),     # 有功功率
            0x0006: (0.98, 0.02, 0.9, 1.0),  # 功率因数
            0x0008: (50.02, 0.001, 49.9, 50.1), # 频率
            0x000A: (230.0, 3, 210, 270),    # B相电压
            0x000C: (14.8, 3, 0, 30),         # B相电流
            0x000E: (230.0, 3, 210, 270),    # C相电压
            0x0010: (15.0, 3, 0, 30),         # C相电流
            0x0012: (152340, 120, 0, 999999), # 正向有功总电量 (累计)
            0x0014: (9800, 500, 0, 99999),    # 反向有功总电量
            0x0016: (0, 0, 0, 1),             # 运行状态 (0=正常,1=故障)
        }

    def get_regs(self) -> list:
        """返回 100 个寄存器的值 (uint16)"""
        t = time.time()
        block = [0] * 100

        for addr, (base, amp, vmin, vmax) in self._base.items():
            phase = self._phase.get(addr, random.uniform(0, math.pi * 2))
            self._phase[addr] = phase + 0.03
            noise = random.gauss(0, amp * 0.01)
            val = base + amp * math.sin(phase) + noise
            val = max(vmin, min(vmax, val))
            hi, lo = float_to_regs(val)
            block[addr] = hi
            block[addr + 1] = lo

        # 累计值持续增长
        total = int(152340 + t % 86400 * 0.01)
        hi, lo = int32_to_regs(total)
        block[0x0012] = hi
        block[0x0013] = lo

        return block


def float_to_regs(value: float) -> tuple:
    """float32 → 2 uint16"""
    b = struct.pack('>f', value)
    return struct.unpack('>HH', b)


def int32_to_regs(value: int) -> tuple:
    """int32 → 2 uint16"""
    return ((value >> 16) & 0xFFFF, value & 0xFFFF)


async def update_loop(context, dev_sim, interval=1.0):
    """定时更新寄存器"""
    while True:
        regs = dev_sim.get_regs()
        for addr, val in enumerate(regs):
            if val != 0:
                context[0].setValues(3, addr, [val])  # 3=holding register
        await asyncio.sleep(interval)


async def main():
    parser = ArgumentParser(description="Modbus RTU Server 模拟器")
    parser.add_argument("--port", default="COM2" if sys.platform == "win32" else "/dev/ttyUSB0",
                        help="串口名称 (Windows: COM2, Linux: /dev/ttyUSB0)")
    parser.add_argument("--baudrate", type=int, default=9600)
    parser.add_argument("--slave-id", type=int, default=1)
    args = parser.parse_args()

    print("=" * 60)
    print(f"Modbus RTU Server 模拟器")
    print(f"  串口: {args.port}")
    print(f"  波特率: {args.baudrate}")
    print(f"  从站 ID: {args.slave_id}")
    print(f"  模拟设备: 三相电表 (电压/电流/功率/电量)")
    print(f"  寄存器: Holding Registers 0x0000-0x0017")
    if sys.platform == "win32":
        print(f"")
        print(f"  Windows: 需安装 com0com 虚拟串口")
        print(f"  https://sourceforge.net/projects/com0com/")
    print("=" * 60)

    # 构建数据块
    dev_sim = RTUDeviceSim()
    block = dev_sim.get_regs()

    store = ModbusSlaveContext(
        hr=ModbusSequentialDataBlock(0, block),
        ir=ModbusSequentialDataBlock(0, [0] * 100),
        co=ModbusSequentialDataBlock(0, [0] * 100),
        di=ModbusSequentialDataBlock(0, [0] * 100),
        zero_mode=True,
    )

    slaves = {args.slave_id: store}
    context = ModbusServerContext(slaves=slaves, single=False)

    identity = ModbusDeviceIdentification()
    identity.VendorName = "iotStudio"
    identity.ProductName = "Smart Meter Simulator"
    identity.Model = "RTU-METER-01"
    identity.Version = "V1.0"

    # 启动更新循环
    asyncio.create_task(update_loop(context, dev_sim))

    # 启动 RTU Server
    await StartAsyncSerialServer(
        context=context,
        identity=identity,
        framer=ModbusRtuFramer,
        port=args.port,
        baudrate=args.baudrate,
        parity='N',
        stopbits=1,
        bytesize=8,
        timeout=1,
    )


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nModbus RTU Server 已停止")
