#!/usr/bin/env python3
# ============================================================
# pythonIot — IEC 60870-5-104 模拟服务器
# 模拟: 储能PCS 站控层从站
# 启动: python iec104_server.py
# 默认端口: 2404
# ============================================================
"""
IEC 104 从站模拟器，模拟一个储能PCS设备。
支持:
  - 总召响应
  - 周期+突发遥测上送
  - 时钟同步

ASDU 类型:
  - M_ME_NC_1 (13): 短浮点遥测值
  - M_SP_NA_1 (1):  单点遥信
"""
import asyncio
import logging
import random
import struct
import time
import math

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("iec104-sim")


class IEC104Slave:
    """IEC 104 从站模拟器"""

    def __init__(self, host="0.0.0.0", port=2404):
        self.host = host
        self.port = port
        self._server = None
        self._send_seq = 0
        self._recv_seq = 0
        self._ioa_values = self._init_ioa_map()

    def _init_ioa_values(self):
        """初始化 IOA 映射表 (模拟PCS数据)"""
        return {
            # 遥测 (IOA 100-115)
            100: {"name": "SOC", "base": 75.5, "amp": 8, "min": 0, "max": 100, "unit": "%"},
            101: {"name": "SOH", "base": 98.2, "amp": 0.5, "min": 80, "max": 100, "unit": "%"},
            102: {"name": "有功功率", "base": 2500, "amp": 800, "min": -5000, "max": 5000, "unit": "W"},
            103: {"name": "交流电压", "base": 230.0, "amp": 3, "min": 210, "max": 250, "unit": "V"},
            104: {"name": "交流电流", "base": 10.8, "amp": 3, "min": 0, "max": 25, "unit": "A"},
            105: {"name": "电芯温度", "base": 35.0, "amp": 2, "min": 20, "max": 50, "unit": "C"},
            106: {"name": "直流电压", "base": 650.0, "amp": 10, "min": 600, "max": 800, "unit": "V"},
            107: {"name": "效率", "base": 96.5, "amp": 1, "min": 90, "max": 99, "unit": "%"},
            # 遥信 (IOA 200-205)
            200: {"name": "PCS运行状态", "value": 1},  # 0=停机,1=运行
            201: {"name": "充电状态", "value": 0},
            202: {"name": "放电状态", "value": 1},
            203: {"name": "故障状态", "value": 0},
            204: {"name": "远程/本地", "value": 1},   # 0=本地,1=远程
            205: {"name": "保护动作", "value": 0},
        }

    def get_measurement(self, ioa):
        """获取遥测值（带缓慢变化）"""
        if ioa not in self._ioa_values:
            return 0.0
        cfg = self._ioa_values[ioa]
        if "base" not in cfg:
            return 0.0
        t = time.time()
        phase = hash(f"{ioa}_{int(t/10)}") % 360 * math.pi / 180
        noise = random.gauss(0, cfg["amp"] * 0.02)
        val = cfg["base"] + cfg["amp"] * math.sin(phase) + noise
        return round(max(cfg["min"], min(cfg["max"], val)), 4)

    def build_asdu_measurement(self, ioa, quality=0):
        """构建 M_ME_NC_1 ASDU"""
        val = self.get_measurement(ioa)
        # ASDU: type_id(1) + num(1) + cause(2) + common_addr(2) + ioa(3) + value(4)
        asdu = bytes([13])  # M_ME_NC_1
        asdu += bytes([1])  # 1 element
        asdu += struct.pack('<H', 0x1400)  # cause=20 (总召响应) 或改为 0x0100 (周期)
        asdu += bytes([0x01, 0x00])  # common_addr=1
        asdu += struct.pack('<I', ioa)[:3]  # IOA (3 bytes)
        asdu += struct.pack('<f', val)  # float32 value
        # 质量描述符
        asdu += bytes([quality])  # QDS
        return asdu

    def build_asdu_signal(self, ioa):
        """构建 M_SP_NA_1 ASDU"""
        cfg = self._ioa_values.get(ioa, {})
        val = cfg.get("value", 0)
        # ASDU: type_id(1) + num(1) + cause(2) + common_addr(2) + ioa(3) + SPI(1)
        asdu = bytes([1])  # M_SP_NA_1
        asdu += bytes([1])  # 1 element
        asdu += struct.pack('<H', 0x0300)  # cause=3 (突发)
        asdu += bytes([0x01, 0x00])  # common_addr=1
        asdu += struct.pack('<I', ioa)[:3]  # IOA
        asdu += bytes([val & 0x01])  # SPI
        return asdu

    def build_i_frame(self, asdu):
        """包装为 I 帧"""
        ctrl = struct.pack('<HH', self._send_seq << 1, self._recv_seq << 1)
        self._send_seq = (self._send_seq + 1) % 32768
        length = 4 + len(asdu)
        frame = b'\x68' + bytes([length, length]) + b'\x68' + ctrl + asdu
        return frame

    def parse_frame(self, data):
        """解析客户端发来的帧"""
        if len(data) < 2 or data[0] != 0x68:
            return None
        apdu_len = data[1]
        if len(data) < apdu_len + 2:
            return None
        ctrl = struct.unpack('<H', data[4:6])[0]
        frame_type = ctrl & 0x03
        asdu = data[8:apdu_len + 2] if apdu_len > 4 else b''
        return {"type": frame_type, "ctrl": ctrl, "asdu": asdu}

    async def handle_client(self, reader, writer):
        """处理客户端连接"""
        addr = writer.get_extra_info('peername')
        logger.info(f"[IEC104] 客户端连接: {addr}")

        buffer = b''
        try:
            while True:
                data = await asyncio.wait_for(reader.read(4096), timeout=30)
                if not data:
                    break
                buffer += data

                # 解析帧
                while len(buffer) >= 2 and buffer[0] == 0x68 and len(buffer) >= buffer[1] + 2:
                    frame_len = buffer[1] + 2
                    frame = buffer[:frame_len]
                    buffer = buffer[frame_len:]

                    parsed = self.parse_frame(frame)
                    if parsed is None:
                        continue

                    # 处理 U 帧
                    if parsed["type"] == 3:
                        cmd = parsed["ctrl"] & 0xFC
                        if cmd == 0x07:  # STARTDT
                            logger.info("[IEC104] 收到 STARTDT → 发送确认")
                            response = b'\x68\x04\x04\x68' + bytes([0x0B, 0x00, 0x00, 0x00])
                            writer.write(response)
                            await writer.drain()

                            # 发送总召响应
                            await self.send_gi_response(writer)

                    # 处理 I 帧中收到的序列号
                    if parsed["type"] == 0:
                        recv_seq = (parsed["ctrl"] >> 1) & 0x7FFF
                        self._recv_seq = (recv_seq + 1) % 32768

                        # 检查 ASDU 类型
                        if parsed["asdu"]:
                            asdu_type = parsed["asdu"][0]
                            if asdu_type == 100:  # C_IC_NA_1 (总召)
                                logger.info("[IEC104] 收到总召命令 → 发送遥测数据")
                                await self.send_gi_response(writer)
                            elif asdu_type == 103:  # C_CS_NA_1 (时钟同步)
                                logger.info("[IEC104] 收到时钟同步")
                            elif asdu_type == 45:  # C_SC_NA_1 (遥控)
                                logger.info("[IEC104] 收到遥控命令 — 忽略")

        except asyncio.TimeoutError:
            pass
        except Exception as e:
            logger.error(f"[IEC104] 连接异常: {e}")
        finally:
            writer.close()
            await writer.wait_closed()
            logger.info(f"[IEC104] 客户端断开: {addr}")

    async def send_gi_response(self, writer):
        """发送总召响应（遥测+遥信）"""
        # 遥测 IOA 100-107
        for ioa in range(100, 108):
            asdu = self.build_asdu_measurement(ioa)
            asdu = asdu[:2] + struct.pack('<H', 0x1400) + asdu[4:]  # cause=20
            frame = self.build_i_frame(asdu)
            writer.write(frame)
            await asyncio.sleep(0.01)

        # 遥信 IOA 200-205
        for ioa in range(200, 206):
            asdu = self.build_asdu_signal(ioa)
            asdu = asdu[:2] + struct.pack('<H', 0x1400) + asdu[4:]
            frame = self.build_i_frame(asdu)
            writer.write(frame)
            await asyncio.sleep(0.01)

        await writer.drain()
        logger.info(f"[IEC104] 总召响应完成: {8}遥测 + {6}遥信")

        # 启动周期上送任务
        asyncio.create_task(self.periodic_send(writer))

    async def periodic_send(self, writer):
        """周期上送遥测数据（每15秒）"""
        try:
            while True:
                await asyncio.sleep(15)
                for ioa in [100, 102, 103, 104]:  # 关键点位
                    asdu = self.build_asdu_measurement(ioa)
                    asdu = asdu[:2] + struct.pack('<H', 0x0100) + asdu[4:]  # cause=1 (周期)
                    frame = self.build_i_frame(asdu)
                    writer.write(frame)
                await writer.drain()
        except Exception:
            pass

    async def start(self):
        """启动服务器"""
        self._server = await asyncio.start_server(
            self.handle_client, self.host, self.port
        )
        logger.info("=" * 60)
        logger.info(f"IEC 104 模拟器启动 → {self.host}:{self.port}")
        logger.info(f"  模拟设备: 储能PCS (common_addr=1)")
        logger.info(f"  遥测 IOA: 100-107 (SOC/功率/电压/电流/温度等)")
        logger.info(f"  遥信 IOA: 200-205 (运行/充电/放电/故障状态)")
        logger.info("=" * 60)

        async with self._server:
            await self._server.serve_forever()


async def main():
    slave = IEC104Slave(host="0.0.0.0", port=2404)
    await slave.start()


if __name__ == "__main__":
    print("启动 IEC 104 模拟器...")
    print("  端口 2404 → 储能PCS (common_addr=1)")
    print("  按 Ctrl+C 停止\n")
    asyncio.run(main())
