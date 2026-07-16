# ============================================================
# 设备完整性子系统 — 模拟数据注入器
# ============================================================
"""
为无法连接真实的子系统注入模拟数据, 验证全链路闭环。

启动:
    python tools/subsystem_simulator.py

模拟内容:
    1. 博感 MQTT — SA210 螺栓松动 + SVT 振动 (TLV → MQTT)
    2. 海康 RTSP — 模拟视频流状态
    3. 知微 PHM — 模拟诊断结果
    4. 锅炉 Modbus — 模拟 YJ-NX-1 数据
    5. 有叶云 — 真实 API (在线可用)
"""
import asyncio
import json
import logging
import os
import random
import struct
import sys
import time
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.config import cfg
from src.storage.tdengine import TDEngineStore

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
logger = logging.getLogger("subsystem_sim")

INTERVAL = 10  # 每 10 秒一轮


# ===== 博感 MQTT TLV 编码 =====

def _tlv_field(t: int, val: int, signed: bool = False) -> bytes:
    """编码 TLV 字段"""
    if signed and val < 0:
        val = val & 0xFFFF  # 转小端无符号
    if t <= 0x1F:
        return bytes([t, val & 0xFF])
    elif t <= 0x5F:
        return bytes([t, val & 0xFF, (val >> 8) & 0xFF])
    elif t <= 0x9F:
        return bytes([t, val & 0xFF, (val >> 8) & 0xFF, (val >> 16) & 0xFF, (val >> 24) & 0xFF])
    elif t <= 0xBF:
        # MAC 地址 (6字节, hex string 转 bytes)
        if isinstance(val, str):
            return bytes([t]) + bytes.fromhex(val.replace(":", ""))
        return bytes([t]) + b"\x00" * 6
    return bytes([t, 0])


def encode_bogan_data(mac: str, angle: float, temp: float, battery: float) -> bytes:
    """编码博感 SA210 螺栓数据 (消息类型 0x10)"""
    data = b"\x10"  # 消息类型: 传感器上报
    data += _tlv_field(0xA0, mac.replace(":", ""))  # 设备MAC
    data += _tlv_field(0x40, int(angle * 100), signed=True)  # 角度 (0.01°)
    data += _tlv_field(0x20, int(temp * 10))  # 温度 (0.1°C)
    data += _tlv_field(0x50, int(battery * 100))  # 电压 (0.01V)
    return data


# ===== 模拟器核心 =====

class SubsystemSimulator:
    """子系统模拟数据生成器"""

    def __init__(self):
        self.td = TDEngineStore()
        self._running = False
        self._generation = 0

        # 博感设备
        self.bogan_devices = [
            {"mac": "ec:a2:4a:56:0c:89", "did": "bolt_b1e2_01", "name": "北1-2-螺栓1号"},
            {"mac": "ec:a2:4a:56:0c:8a", "did": "bolt_b1e2_02", "name": "北1-2-螺栓2号"},
            {"mac": "ec:a2:4a:56:0c:8b", "did": "bolt_b9_01", "name": "北9-螺栓1号"},
            {"mac": "ec:a2:4a:56:0c:8c", "did": "bolt_b15_01", "name": "北15-螺栓1号"},
        ]

        # RTSP 设备
        self.rtsp_devices = [
            {"did": "cam_b1e2_01", "name": "北1-2-防爆球机"},
            {"did": "cam_b1e2_02", "name": "北1-2-热成像枪机"},
            {"did": "cam_b9_01", "name": "北9-双光谱云台"},
            {"did": "cam_b15_01", "name": "北15-球机"},
        ]

        # PHM 设备
        self.phm_devices = [
            {"did": "phm_b1e2_pump", "name": "北1-2-注水泵"},
            {"did": "phm_b1e2_comp", "name": "北1-2-压缩机"},
            {"did": "phm_b9_pump", "name": "北9-注水泵"},
        ]

        # 锅炉设备
        self.boiler_devices = [
            {"did": "boiler_n4_01", "name": "南四联-锅炉1号"},
            {"did": "boiler_b15_01", "name": "北15-锅炉1号"},
        ]

    async def start(self):
        await self.td.connect()
        self._running = True
        logger.info(f"[subsystem_sim] 启动 (fallback={self.td._is_fallback})")
        while self._running:
            self._generation += 1
            await self._sim_bogan()
            await self._sim_rtsp()
            await self._sim_phm()
            await self._sim_boiler()
            if self._generation % 6 == 0:  # 每分钟打印一次
                logger.info(f"[subsystem_sim] 第{self._generation}轮完成")
            await asyncio.sleep(INTERVAL)

    def stop(self):
        self._running = False

    async def _write(self, rows):
        if rows:
            await self.td.batch_insert(rows)

    async def _sim_bogan(self):
        """模拟博感螺栓数据"""
        rows = []
        for dev in self.bogan_devices:
            angle = random.uniform(-0.5, 2.0)  # 松动角度 (-0.5°~2.0°)
            temp = random.uniform(15, 45)        # 温度
            batt = random.uniform(2.8, 3.4)      # 电池电压
            ts_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            rows.append({
                "device_id": dev["did"], "point_id": "angle",
                "point_name": "松动角度", "value": round(angle, 2),
                "unit": "°", "device_type": "smart_bolt", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "temperature",
                "point_name": "温度", "value": round(temp, 1),
                "unit": "°C", "device_type": "smart_bolt", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "battery",
                "point_name": "电池电压", "value": round(batt, 2),
                "unit": "V", "device_type": "smart_bolt", "station_id": "dqyt",
            })
        await self._write(rows)

    async def _sim_rtsp(self):
        """模拟视频流状态"""
        rows = []
        for dev in self.rtsp_devices:
            online = 1 if random.random() > 0.1 else 0  # 90% 在线率
            fps = random.uniform(10, 25) if online else 0
            rows.append({
                "device_id": dev["did"], "point_id": "stream_online",
                "point_name": "视频流在线", "value": online,
                "unit": "", "device_type": "video", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "fps",
                "point_name": "帧率", "value": round(fps, 1),
                "unit": "fps", "device_type": "video", "station_id": "dqyt",
            })
        await self._write(rows)

    async def _sim_phm(self):
        """模拟知微 PHM 诊断结果"""
        fault_types = ["正常", "轴承磨损", "不平衡", "对中不良", "松动"]
        f_prob = [0.6, 0.15, 0.1, 0.1, 0.05]  # 60% 正常
        rows = []
        for dev in self.phm_devices:
            fault = random.choices(fault_types, weights=f_prob, k=1)[0]
            health = 100 if fault == "正常" else random.randint(40, 85)
            rows.append({
                "device_id": dev["did"], "point_id": "health_score",
                "point_name": "健康分", "value": health,
                "unit": "", "device_type": "phm", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "fault_type",
                "point_name": "故障类型", "value": 0 if fault == "正常" else 1,
                "unit": "", "device_type": "phm", "station_id": "dqyt",
            })
        await self._write(rows)

    async def _sim_boiler(self):
        """模拟锅炉能效数据"""
        rows = []
        for dev in self.boiler_devices:
            rows.append({
                "device_id": dev["did"], "point_id": "temperature",
                "point_name": "排烟温度", "value": round(random.uniform(120, 200), 1),
                "unit": "°C", "device_type": "boiler", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "pressure",
                "point_name": "蒸汽压力", "value": round(random.uniform(0.6, 1.2), 2),
                "unit": "MPa", "device_type": "boiler", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "efficiency",
                "point_name": "热效率", "value": round(random.uniform(82, 95), 1),
                "unit": "%", "device_type": "boiler", "station_id": "dqyt",
            })
            rows.append({
                "device_id": dev["did"], "point_id": "flow_rate",
                "point_name": "蒸汽流量", "value": round(random.uniform(1.5, 5.0), 2),
                "unit": "t/h", "device_type": "boiler", "station_id": "dqyt",
            })
        await self._write(rows)


async def main():
    sim = SubsystemSimulator()
    await sim.start()

if __name__ == "__main__":
    asyncio.run(main())
