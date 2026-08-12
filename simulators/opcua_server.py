#!/usr/bin/env python3
# ============================================================
# pythonIot — OPC UA 模拟服务器
# 模拟: 充电桩 + 环境监测传感器
# 启动: python opcua_server.py
# 默认端口: 4840
# ============================================================
"""
OPC UA Server 模拟器，模拟充电桩设备。
变量会随时间自动变化。
"""
import asyncio
import logging
import random
import time
import math

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("opcua-sim")

try:
    from asyncua import Server, ua
    HAS_ASYNCUA = True
except ImportError:
    HAS_ASYNCUA = False
    logger.warning("asyncua 未安装！请执行: pip install asyncua")


class OPCUASimServer:
    """OPC UA 模拟服务器"""

    def __init__(self, host="0.0.0.0", port=4840):
        self.host = host
        self.port = port
        self.server = None
        self._variables = {}  # node_id → variable object

    async def start(self):
        if not HAS_ASYNCUA:
            logger.error("asyncua 未安装，无法启动")
            return

        self.server = Server()
        await self.server.init()
        self.server.set_endpoint(f"opc.tcp://{self.host}:{self.port}")
        self.server.set_server_name("pythonIot Charger Simulator")

        # 注册命名空间
        uri = "http://pythoniot.dgiot.com/simulator"
        idx = await self.server.register_namespace(uri)

        # 创建对象
        charger = await self.server.nodes.objects.add_object(idx, "Charger_01")
        env = await self.server.nodes.objects.add_object(idx, "Environment")

        # --- 充电桩变量 ---
        charger_vars = {
            "Status":         (0, 0, 5),        # 状态 (0=空闲,1=充电,2=故障,3=已充满)
            "ChargePower":    (30.0, 0, 60),     # 充电功率(kW)
            "OutputVoltage":  (380.0, 350, 430), # 输出电压(V)
            "OutputCurrent":  (45.0, 0, 80),     # 输出电流(A)
            "SessionEnergy":  (25.5, 0, 50),     # 当前充电量(kWh)
            "TotalEnergy":    (28500, 0, 999999),# 累计充电量(kWh)
            "ModuleTemp":     (40.0, 20, 60),    # 模块温度(°C)
            "ConnectorLock":  (1, 0, 1),         # 枪锁状态
        }

        for name, (default, vmin, vmax) in charger_vars.items():
            var = await charger.add_variable(idx, name, default)
            await var.set_writable()
            self._variables[f"Charger_01.{name}"] = {
                "var": var, "default": default, "min": vmin, "max": vmax,
            }

        # --- 环境变量 ---
        env_vars = {
            "AmbientTemp":     (28.5, 15, 45),   # 环境温度(°C)
            "Humidity":        (65.0, 30, 95),   # 湿度(%)
            "Irradiance":      (800, 0, 1200),   # 辐照度(W/m²)
            "WindSpeed":       (3.5, 0, 15),     # 风速(m/s)
        }

        for name, (default, vmin, vmax) in env_vars.items():
            var = await env.add_variable(idx, name, default)
            await var.set_writable()
            self._variables[f"Environment.{name}"] = {
                "var": var, "default": default, "min": vmin, "max": vmax,
            }

        # 启动服务器
        await self.server.start()

        logger.info("=" * 60)
        logger.info(f"OPC UA 模拟器启动 → opc.tcp://{self.host}:{self.port}")
        logger.info(f"  充电桩变量: {list(charger_vars.keys())}")
        logger.info(f"  环境变量:   {list(env_vars.keys())}")
        logger.info("=" * 60)

        # 启动数据更新循环
        asyncio.create_task(self._update_loop())

    async def _update_loop(self):
        """每秒更新变量值"""
        while self.server:
            try:
                t = time.time()
                for name, cfg in self._variables.items():
                    var = cfg["var"]
                    phase = hash(f"{name}_{int(t/10)}") % 360 * math.pi / 180
                    noise = random.gauss(0, abs(cfg["default"]) * 0.02)
                    amp = abs(cfg["default"]) * 0.15
                    val = cfg["default"] + amp * math.sin(phase) + noise
                    val = max(cfg["min"], min(cfg["max"], val))

                    # 特殊处理
                    if "Status" in name:
                        r = random.random()
                        val = 1 if r < 0.7 else (0 if r < 0.9 else (2 if r < 0.95 else 3))
                        await var.write_value(int(val), ua.VariantType.Int32)
                    elif "TotalEnergy" in name:
                        val = cfg["default"] + int(t % 86400 * 0.02)
                        await var.write_value(float(val), ua.VariantType.Double)
                    elif isinstance(cfg["default"], int):
                        await var.write_value(int(val), ua.VariantType.Int32)
                    else:
                        await var.write_value(round(float(val), 4), ua.VariantType.Double)

                await asyncio.sleep(1)
            except Exception as e:
                logger.error(f"更新异常: {e}")
                await asyncio.sleep(1)

    async def stop(self):
        if self.server:
            await self.server.stop()


async def main():
    sim = OPCUASimServer()
    try:
        await sim.start()
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        await sim.stop()
        logger.info("OPC UA 模拟器已停止")


if __name__ == "__main__":
    if not HAS_ASYNCUA:
        print("=" * 60)
        print("  asyncua 未安装!")
        print("  请执行: pip install asyncua")
        print("  然后重新运行此脚本")
        print("=" * 60)
    else:
        print("启动 OPC UA 模拟器...")
        asyncio.run(main())
