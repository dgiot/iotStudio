#!/usr/bin/env python3
# ============================================================
# pythonIot — 一键启动全部模拟器
# 启动: python run_all.py
# ============================================================
"""
同时启动 Modbus TCP + IEC 104 + OPC UA 三个模拟器。
Modbus RTU 在 Windows 上需虚拟串口，此处暂用 TCP 模式代替。
"""
import asyncio
import logging
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("sim-master")

BANNER = r"""
╔══════════════════════════════════════════════════════╗
║         pythonIot 协议模拟器 — 全启动                 ║
║                                                      ║
║  Modbus TCP  ── :502   (逆变器 slave_id=1)            ║
║  Modbus TCP  ── :1502  (储能PCS slave_id=2)           ║
║  Modbus TCP  ── :2502  (充电桩 slave_id=3)            ║
║  IEC 104     ── :2404  (储能PCS common_addr=1)        ║
║  OPC UA      ── :4840  (充电桩+环境传感器)             ║
║                                                      ║
║  按 Ctrl+C 停止全部                                   ║
╚══════════════════════════════════════════════════════╝
"""


async def main():
    print(BANNER)

    # 导入模拟器
    from modbus_tcp_server import ModbusSimServer
    from iec104_server import IEC104Slave

    tasks = []

    # 1. Modbus TCP
    modbus = ModbusSimServer()
    tasks.append(asyncio.create_task(modbus.start(), name="modbus-tcp"))

    # 2. IEC 104
    iec104 = IEC104Slave()
    tasks.append(asyncio.create_task(iec104.start(), name="iec104"))

    # 3. OPC UA (可选)
    try:
        from opcua_server import OPCUASimServer
        opcua = OPCUASimServer()
        tasks.append(asyncio.create_task(opcua.start(), name="opcua"))
    except ImportError:
        logger.warning("asyncua 未安装，跳过 OPC UA 模拟器")
        logger.warning("安装: pip install asyncua")

    logger.info(f"全部模拟器已启动 ({len(tasks)} 个进程)")
    await asyncio.gather(*tasks, return_exceptions=True)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n全部模拟器已停止")
