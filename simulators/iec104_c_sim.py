#!/usr/bin/env python3
# ============================================================
# iotStudio — IEC 104 Server 模拟器 (基于 c104 权威库)
# 运行: py -3.11 iec104_c_sim.py
# ============================================================
"""
Fraunhofer c104 IEC 60870-5-104 Server 模拟器

模拟: 储能PCS 从站 (common_addr=1)
遥测 IOA 100-107 (SOC, SOH, 功率, 电压, 电流, 温度等)
遥信 IOA 200-205 (运行/充电/放电/故障状态)

启动: py -3.11 iec104_c_sim.py
端口: 2404
"""
import c104
import time
import math
import random
import threading
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("iec104-c-sim")


class IEC104ServerSim:
    """IEC 104 从站模拟器 — 储能PCS"""

    def __init__(self, host="0.0.0.0", port=2404):
        self.host = host
        self.port = port
        self.server = None
        self.station = None
        self.points = {}  # ioa → point info
        self._running = False
        self._values = {}  # ioa → current value

    def setup(self):
        """创建服务器和点位"""
        self.server = c104.Server(ip=self.host, port=self.port)
        self.station = self.server.add_station(common_address=1)

        # 遥测点位 (IOA 100-107)
        telemetry_points = [
            (100, "SOC", 75.5, 8, 0, 100, "%"),
            (101, "SOH", 98.2, 0.5, 80, 100, "%"),
            (102, "有功功率", 0, 800, -5000, 5000, "W"),
            (103, "交流电压", 230.0, 3, 210, 250, "V"),
            (104, "交流电流", 10.8, 3, 0, 25, "A"),
            (105, "电芯温度", 35.0, 2, 20, 50, "°C"),
            (106, "直流电压", 650.0, 10, 600, 800, "V"),
            (107, "PCS效率", 96.5, 1, 90, 99, "%"),
        ]

        for ioa, name, base, amp, vmin, vmax, unit in telemetry_points:
            point = self.station.add_point(
                io_address=ioa,
                type=c104.Type.M_ME_NC_1,  # 短浮点遥测
                report_ms=5000,  # 5秒周期上报
            )
            self.points[ioa] = {
                "name": name, "base": base, "amp": amp,
                "min": vmin, "max": vmax, "unit": unit,
                "point": point,
            }
            self._values[ioa] = base

        # 遥信点位 (IOA 200-205)
        signal_points = [
            (200, "PCS运行状态", 1),
            (201, "充电状态", 0),
            (202, "放电状态", 1),
            (203, "故障状态", 0),
            (204, "远程/本地", 1),
            (205, "保护动作", 0),
        ]

        for ioa, name, default_val in signal_points:
            point = self.station.add_point(
                io_address=ioa,
                type=c104.Type.M_SP_NA_1,  # 单点遥信
            )
            self.points[ioa] = {"name": name, "point": point}
            self._values[ioa] = default_val

        # 遥控点位 (IOA 300)
        cmd_point = self.station.add_point(
            io_address=300,
            type=c104.Type.C_SC_NA_1,  # 单点遥控
        )
        self.points[300] = {"name": "PCS启停控制", "point": cmd_point}
        self._values[300] = 0

        logger.info(f"已创建 {len(self.points)} 个点位")

    def start(self):
        """启动服务器"""
        self._running = True
        self.setup()
        self.server.start()
        logger.info("=" * 60)
        logger.info(f"IEC 104 Server 启动 -> {self.host}:{self.port}")
        logger.info(f"  遥测 IOA: 100-107")
        logger.info(f"  遥信 IOA: 200-205")
        logger.info(f"  遥控 IOA: 300")
        logger.info(f"  库: Fraunhofer c104 v2.2.1")
        logger.info("=" * 60)

    def stop(self):
        self._running = False
        if self.server:
            self.server.stop()

    def update_values(self):
        """更新所有遥测值（模拟变化）"""
        t = time.time()
        for ioa, info in self.points.items():
            if "base" not in info:
                continue
            phase = hash(f"{ioa}_{int(t/10)}") % 360 * math.pi / 180
            noise = random.gauss(0, info["amp"] * 0.02)
            val = info["base"] + info["amp"] * math.sin(phase) + noise
            val = max(info["min"], min(info["max"], val))
            info["point"].value = round(val, 4)


def main():
    sim = IEC104ServerSim()
    try:
        sim.start()
        logger.info("开始循环更新数据...")
        while True:
            sim.update_values()
            time.sleep(1)
    except KeyboardInterrupt:
        sim.stop()
        logger.info("模拟器已停止")


if __name__ == "__main__":
    print("IEC 104 Server 启动中...")
    print("  端口: 2404")
    print("  按 Ctrl+C 停止")
    main()
