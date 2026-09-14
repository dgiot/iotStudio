"""
Modbus 直连采集器 — 接管 IoMonitor 未采集的设备
================================================
从 Oracle PROJECT_DEVICEPAR 读取设备配置 → 直接 Modbus TCP 采集 → TDengine + MQTT

接管设备:
  Standard_Umodbus: 50 台 (Modbus RTU over TCP)
  OPC_FC_Client:   34 台 (通过 Modbus TCP fallback)

用法:
  from src.protocols.modbus_collector import ModbusCollector
  c = ModbusCollector()
  await c.discover_devices()   # 从 Oracle 发现设备
  await c.collect_all()         # 采集一轮
"""
import asyncio, logging, time, struct
from dataclasses import dataclass, field
from typing import Optional, Dict, List

log = logging.getLogger("modbus_collector")


@dataclass
class ModbusDevice:
    name: str
    channel: str
    driver: str
    host: str = "127.0.0.1"
    port: int = 502
    timeout: float = 12.0
    cycle: int = 1000
    status: str = "unknown"
    tags: int = 0


class ModbusCollector:
    """Modbus 直连采集引擎 — 对标 LegacyComm

    site/gateway 必须显式给：它们进的是边缘内部主题的第 1、2 段
    （`dgiot/{site}/{gateway}/{device}/{point}/data`，见 CLAUDE.md 与
    abac.TOPIC_RE —— 两处都是 5 段、都没有 channel 段）。原先这两个值
    在推送点硬编码成 DEVICE_D / gw_131 —— 那是某现场的站名，
    既不该进公开仓，也换不了现场。

    ⚠️ 本模块目前**全仓没有实例化点**，且 `_tdengine` / `_mqtt` 两个属性
    从声明起就没有被赋过值 —— `_store_and_push` 的两个出口都走不到。
    这里把主题改对，是为了将来真接上时不会继承一个字段错位的串。
    """

    def __init__(self, site: str = "default", gateway: str = "gw_1"):
        self.devices: Dict[str, ModbusDevice] = {}
        self._site = site
        self._gateway = gateway
        self._tdengine = None
        self._mqtt = None
        self._stats = {"collected": 0, "errors": 0}

    async def discover_devices(self):
        """从 Oracle 发现 Standard_Umodbus + OPC_FC_Client 设备"""
        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()

        # 从 Oracle 拉设备参数
        result = b.query(
            "SELECT NAME,CHANNELNAME,DRIVERNAME,DEVDESC,UPDATECYC FROM "
            "PROJECT_DEVICEPAR WHERE DRIVERNAME IN ('Standard_Umodbus','OPC_FC_Client')",
            label="devices"
        )
        for row in result.get('rows', []):
            name = row.get('NAME', '')
            if not name: continue
            # 从 CHANNELNAME 推断 IP/端口 (格式如 "02204010192" 或 "192.168.x.x")
            ch = row.get('CHANNELNAME', '')
            host = "127.0.0.1"
            if ch.startswith('02'):
                # 井号编码: 02204010192 → 02-204-01-92 → 推断网络段
                pass  # 需要通过 LegacyComm 通道映射
            dev = ModbusDevice(
                name=name,
                channel=ch,
                driver=row.get('DRIVERNAME', ''),
                host=host, port=502,
                timeout=float(row.get('TIMEOUT', 12)),
                cycle=int(row.get('UPDATECYC', 1000)),
                status=row.get('STATUS', '0'),
            )
            self.devices[name] = dev

        log.info(f"[modbus] 发现 {len(self.devices)} 台设备 ({sum(1 for d in self.devices.values() if d.driver=='Standard_Umodbus')} RTU + {sum(1 for d in self.devices.values() if d.driver=='OPC_FC_Client')} OPC)")
        return len(self.devices)

    async def collect_device(self, dev: ModbusDevice) -> dict:
        """采集单台设备"""
        try:
            import pymodbus.client as pmc
            client = pmc.AsyncModbusTcpClient(dev.host, port=dev.port, timeout=dev.timeout)
            await client.connect()
            if not client.connected:
                self._stats["errors"] += 1
                return {"status": "offline", "device": dev.name}

            # 读取保持寄存器 (标准采集范围 0-99)
            result = await client.read_holding_registers(0, 100)
            values = result.registers if result and not result.isError() else []
            client.close()

            if values:
                self._stats["collected"] += 1
                # 写入 TDengine + 推 MQTT
                await self._store_and_push(dev.name, values)
                return {"status": "ok", "device": dev.name, "registers": len(values)}
            else:
                self._stats["errors"] += 1
                return {"status": "empty", "device": dev.name}
        except Exception as e:
            self._stats["errors"] += 1
            log.debug(f"[modbus] {dev.name}: {e}")
            return {"status": "error", "device": dev.name, "error": str(e)}

    async def collect_all(self) -> dict:
        """采集所有设备"""
        results = []
        for dev in list(self.devices.values())[:10]:  # 先采前 10 台测试
            r = await self.collect_device(dev)
            results.append(r)
        online = sum(1 for r in results if r['status'] == 'ok')
        log.info(f"[modbus] 采集完成: {online}/{len(results)} 在线")
        return {"total": len(results), "online": online, "errors": self._stats["errors"]}

    async def _store_and_push(self, device_id: str, values: list):
        """写入 TDengine 并推 MQTT

        逐寄存器出口 —— 每条报文一个点，点号与 TDengine 那侧同源
        (`reg_{i}`)。原先是把 10 个寄存器打成一个批量报文发到
        `dgiot/DEVICE_D/gw_131/ch_modbus_rtu/{device_id}/data`：按 5 段式读，
        `ch_modbus_rtu` 占的是 **device** 段、设备 id 占的是 **point** 段 ——
        字段整体错位一格，而且批量报文塞不进"一个点"的语义里。
        """
        batch = list(values[:10])
        if self._tdengine:
            for i, v in enumerate(batch):
                await self._tdengine.insert_point(
                    device_id=device_id, point_id=f"reg_{i}",
                    point_name=f"寄存器{i}", value=float(v), unit="",
                    device_type="rtu", station_id=self._site,
                )
        if self._mqtt:
            import json
            ts = int(time.time() * 1000)
            for i, v in enumerate(batch):
                self._mqtt.publish(
                    f"dgiot/{self._site}/{self._gateway}/{device_id}/reg_{i}/data",
                    json.dumps({"ts": ts, "value": float(v)}))

    def get_stats(self):
        return {"devices": len(self.devices), **self._stats}
