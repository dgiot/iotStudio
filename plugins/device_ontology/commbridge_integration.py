"""
LegacyComm 集成服务 — 连接 Oracle 设备配置 + EventBus + 存储
=============================================================
从 Oracle PROJECT_DEVICEPAR 加载 RTU 设备配置,
注册到 LegacyCommServer, 通过 EventBus 推送遥测数据,
写入 TDengine/SQLite.

用法:
  integration = LegacyCommIntegration(event_bus, oracle_reader)
  await integration.start(port=53001)
"""

from __future__ import annotations
import asyncio, logging, time, json
from typing import Optional, Dict, Any

from ..protocols.commbridge_server import (
    LegacyCommServer, DEVICE_TYPES, COEFFICIENTS,
    MODBUS_BASE_ADDR, MODBUS_REG_COUNT, MODBUS_SLAVE_ID,
)

log = logging.getLogger("commbridge.integration")


class LegacyCommIntegration:
    """LegacyComm 集成 — 设备加载 + 数据存储 + MQTT 推送"""

    def __init__(self, event_bus=None, storage=None, mqtt=None,
                 oracle_reader=None, port: int = 53001):
        self._bus = event_bus
        self._storage = storage
        self._mqtt = mqtt
        self._oracle = oracle_reader
        self._port = port
        self._server = LegacyCommServer(event_bus=event_bus, port=port)
        self._device_configs: Dict[str, dict] = {}
        self._running = False

    # ── 生命周期 ──

    async def start(self, load_devices: bool = True):
        """启动集成服务"""
        if load_devices and self._oracle:
            await self._load_devices_from_oracle()
        elif load_devices:
            self._load_devices_default()

        # 注册 EventBus 处理器
        if self._bus:
            self._bus.on("commbridge.data.received", self._on_telemetry_received,
                         mode="one_for_more")
            self._bus.on("commbridge.rtu.connected", self._on_rtu_connected,
                         mode="one_for_more")
            self._bus.on("commbridge.rtu.disconnected", self._on_rtu_disconnected,
                         mode="one_for_more")

        await self._server.start()
        self._running = True
        log.info(f"[commbridge.integration] 已启动 (设备:{len(self._device_configs)}台)")

    async def stop(self):
        """停止集成服务"""
        self._running = False
        await self._server.stop()

    # ── 设备加载 ──

    async def _load_devices_from_oracle(self):
        """从 Oracle PROJECT_DEVICEPAR 加载 RTU 设备配置"""
        try:
            r = self._oracle.query(
                "SELECT DEVNAME, DEVADDR, DEVICEINDEX, PARAM, DEVTYPE "
                "FROM PROJECT_DEVICEPAR WHERE DEVTYPE='Standard_Umodbus'"
            )
            for row in r.get('rows', []):
                devname = row.get('DEVNAME', '')
                devaddr = row.get('DEVADDR', '')
                param = row.get('PARAM', '')

                # 解析 PARAM 字段获取 Modbus 参数
                config = self._parse_oracle_param(param)
                config['name'] = devname
                config['address'] = devaddr

                # 用设备名作为 dtu_id
                dtu_id = devname or f"rtu_oracle_{devaddr}"
                self._device_configs[dtu_id] = config
                self._server.register_device(dtu_id, config)

            log.info(f"[commbridge.integration] 从Oracle加载了 {len(self._device_configs)} 台设备")

        except Exception as e:
            log.error(f"[commbridge.integration] Oracle加载失败: {e}, 使用默认配置")
            self._load_devices_default()

    def _parse_oracle_param(self, param: str) -> dict:
        """解析 Oracle PARAM 字段获取 Modbus 配置"""
        config = {
            "start_addr": MODBUS_BASE_ADDR,
            "reg_count": MODBUS_REG_COUNT,
            "slave_id": MODBUS_SLAVE_ID,
            "coeff_map": [0] * MODBUS_REG_COUNT,
        }
        if not param:
            return config

        try:
            # PARAM 可能是 JSON 或 key=value 格式
            if param.strip().startswith('{'):
                data = json.loads(param)
                config.update(data)
            else:
                for pair in param.split(';'):
                    pair = pair.strip()
                    if '=' in pair:
                        k, v = pair.split('=', 1)
                        k, v = k.strip(), v.strip()
                        if k in ('slave_id', 'start_addr', 'reg_count'):
                            config[k] = int(v)
        except Exception:
            pass

        return config

    def _load_devices_default(self):
        """加载默认设备配置 (用于测试)"""
        # 测试用: 创建几台默认设备
        test_devices = {
            "rtu_test_001": {"type": 0x00, "slave_id": 1, "channels": 20,
                             "start_addr": 0, "reg_count": 20,
                             "coeff_map": [1]*6 + [2]*6 + [3]*2 + [4]*2 + [0]*4},
        }
        for dtu_id, config in test_devices.items():
            self._device_configs[dtu_id] = config
            self._server.register_device(dtu_id, config)
        log.info(f"[commbridge.integration] 加载了 {len(test_devices)} 台测试设备")

    # ── EventBus 处理器 ──

    async def _on_telemetry_received(self, **payload):
        """收到遥测数据 → 存储 + MQTT"""
        dtu_id = payload.get("dtu_id", "unknown")
        values = payload.get("values", {})
        timestamp = payload.get("timestamp", time.time())

        # 写入存储
        if self._storage:
            try:
                await self._storage.write_telemetry(
                    device_id=dtu_id,
                    points=values,
                    timestamp=timestamp,
                    source="commbridge",
                )
            except Exception as e:
                log.error(f"[commbridge.integration] 存储写入失败: {e}")

        # 推送到 MQTT
        if self._mqtt:
            try:
                topic = f"dgiot/commbridge/{dtu_id}/telemetry"
                await self._mqtt.publish(topic, json.dumps({
                    "device_id": dtu_id,
                    "timestamp": timestamp,
                    **values,
                }))
            except Exception as e:
                log.error(f"[commbridge.integration] MQTT推送失败: {e}")

    async def _on_rtu_connected(self, **payload):
        """RTU 连接事件"""
        ip = payload.get("ip", "?")
        log.info(f"[commbridge.integration] RTU上线: {ip}")
        if self._mqtt:
            await self._mqtt.publish("dgiot/commbridge/events",
                                     json.dumps({"event": "connected", **payload}))

    async def _on_rtu_disconnected(self, **payload):
        """RTU 断开事件"""
        dtu_id = payload.get("dtu_id", "?")
        log.warning(f"[commbridge.integration] RTU离线: {dtu_id}")
        if self._mqtt:
            await self._mqtt.publish("dgiot/commbridge/events",
                                     json.dumps({"event": "disconnected", **payload}))

    # ── 状态 ──

    def status(self) -> dict:
        return {
            "running": self._running,
            "server": self._server.status(),
            "devices_configured": len(self._device_configs),
            "oracle_available": self._oracle is not None,
        }


# ═══════════════════════════════════════════════════════════
# RTU 模拟器 (用于测试)
# ═══════════════════════════════════════════════════════════

class RtuSimulator:
    """模拟 RTU 设备 — 用于测试 LegacyCommServer"""

    def __init__(self, dtu_id: str = "rtu_test_001", slave_id: int = 1,
                 channels: int = 20):
        self.dtu_id = dtu_id
        self.slave_id = slave_id
        self.channels = channels

    async def connect_and_respond(self, host: str = "127.0.0.1", port: int = 53001):
        """模拟 RTU: 连接 → 注册 → 响应 Modbus 查询"""
        import random, struct
        from ..protocols.commbridge_server import crc16, parse_modbus_rtu_response

        reader, writer = await asyncio.open_connection(host, port)

        # 发送注册包 (二进制: [DTU_ID 2B] [DevType 1B] [Channels 1B])
        reg_pkt = struct.pack('>HBB', hash(self.dtu_id) & 0xFFFF, 0x00, self.channels)
        writer.write(reg_pkt)
        await writer.drain()
        log.info(f"[rtu_sim] {self.dtu_id} 已注册")

        # 循环响应 Modbus 查询
        poll_count = 0
        while True:
            try:
                data = await asyncio.wait_for(reader.read(256), timeout=30)
                if not data:
                    break

                # 验证 CRC
                if len(data) >= 8:
                    request_crc = struct.unpack('<H', data[-2:])[0]
                    calc_crc = crc16(data[:-2])
                    if request_crc == calc_crc:
                        # 构造响应: func=0x03, byte_count=channels×2
                        func = data[1]
                        if func == 0x03:
                            byte_count = self.channels * 2
                            response_data = bytearray([
                                self.slave_id, 0x03, byte_count
                            ])
                            for i in range(self.channels):
                                val = int(8192 * random.uniform(0.5, 1.5))
                                response_data.extend(struct.pack('>H', val & 0xFFFF))
                            resp_crc = crc16(bytes(response_data))
                            response_data.extend(struct.pack('<H', resp_crc))
                            writer.write(bytes(response_data))
                            await writer.drain()
                            poll_count += 1

            except asyncio.TimeoutError:
                break
            except Exception as e:
                log.error(f"[rtu_sim] 错误: {e}")
                break

        writer.close()
        return poll_count
