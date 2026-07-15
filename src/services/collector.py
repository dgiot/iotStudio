# ============================================================
# pythonIot — 采集调度引擎
# ============================================================
"""
采集引擎负责：
1. 从 PostgreSQL 加载设备 + 点位配置
2. 为每个设备创建对应的协议适配器实例
3. 按采集周期定时调度采集任务
4. 采集结果写入 TDengine
5. 结果转发给告警引擎和推送引擎
"""
import asyncio
import logging
import random
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple

from ..config import cfg
from ..models.device import Device, DataPoint
from ..storage.tdengine import TDEngineStore
from ..storage.postgres import PostgresStore
from ..protocols.base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)

# 点位字段 → 默认值映射
_POINT_FIELDS = {
    "point_id": "", "point_name": "", "protocol_addr": "",
    "register_type": "3", "data_type": "float32", "scale": 1.0,
    "offset": 0.0, "unit": "", "dead_zone": 0.0,
    "alarm_high": None, "alarm_low": None,
    "alarm_high_high": None, "alarm_low_low": None,
}


class CollectorEngine:
    """采集调度引擎"""

    def __init__(self, pg_store: PostgresStore, td_store: TDEngineStore):
        self.pg = pg_store
        self.td = td_store
        self._adapters: Dict[str, BaseProtocolAdapter] = {}
        self._tasks: Dict[str, asyncio.Task] = {}
        self._running = False
        self._stats: Dict[str, Dict[str, int]] = {}  # device_id → {success, fail}
        self._on_data_callbacks: List[callable] = []  # 数据回调链
        self._device_meta: Dict[str, Dict[str, str]] = {}  # device_id → {device_type, station_id}

    def on_data(self, callback):
        """注册数据回调"""
        self._on_data_callbacks.append(callback)

    async def start(self) -> None:
        """启动采集引擎（后台加载设备，不阻塞启动）"""
        self._running = True
        asyncio.create_task(self._background_load())
        logger.info(f"[collector] 后台加载设备已启动")

    async def _background_load(self):
        """后台加载设备，避免阻塞应用启动"""
        await self._load_devices()
        logger.info(f"[collector] 后台加载完成, {len(self._adapters)} 个设备")

    async def stop(self) -> None:
        """停止采集引擎"""
        self._running = False
        for task in self._tasks.values():
            task.cancel()
        for adapter in self._adapters.values():
            await adapter.disconnect()
        self._adapters.clear()
        self._tasks.clear()
        logger.info("[collector] 已停止")

    async def _load_devices(self) -> None:
        """加载所有启用的设备"""
        result = await self.pg.list_devices(page=1, page_size=500)
        devices = result[0] if isinstance(result, tuple) else result
        for dev in devices:
            # 跳过缺少必要字段的设备
            if not getattr(dev, 'device_id', None):
                continue
            if not getattr(dev, 'protocol', None):
                continue
            enabled = getattr(dev, 'enabled', True)
            status = getattr(dev, 'status', 'online')
            if enabled and status != "maintenance":
                await self._add_device(dev)

    async def _add_device(self, dev: Device) -> None:
        """添加设备采集任务"""
        points = await self.pg.list_points(dev.device_id)
        if not points:
            logger.warning(f"[collector] {dev.device_id} 无点位配置，跳过")
            return

        # 构建 ProtocolConfig
        protocol_config = ProtocolConfig(
            protocol_type=dev.protocol,
            device_id=dev.device_id,
            device_name=dev.device_name,
            collect_interval=min(getattr(p, 'collect_interval', None) or 5 for p in points),
            points=[{k: getattr(p, k, v) for k, v in _POINT_FIELDS.items()} for p in points if getattr(p, 'enabled', True)],
            extra=dev.comm_params or {},
        )

        # 创建适配器
        adapter = self._create_adapter(protocol_config)
        if adapter is None:
            return

        # 连接
        connected = await adapter.connect()
        if not connected:
            logger.error(f"[collector] {dev.device_id} 连接失败")
            return

        self._adapters[dev.device_id] = adapter
        self._device_meta[dev.device_id] = {"device_type": dev.device_type or "default", "station_id": dev.station_id or "default"}

        # 启动采集循环
        interval = max(protocol_config.collect_interval, 1)
        task = asyncio.create_task(self._collect_loop(dev.device_id, adapter, interval))
        self._tasks[dev.device_id] = task

        # 初始化统计
        self._stats[dev.device_id] = {"success": 0, "fail": 0}

        # 更新设备状态
        await self.pg.update_device_status(dev.device_id, "online")

        # OPC UA 订阅模式特殊处理
        if dev.protocol == "opcua" and dev.comm_params and dev.comm_params.get("read_mode") == "subscribe":
            try:
                from ..protocols.opcua_client import OPCUAClient
                if isinstance(adapter, OPCUAClient):
                    await adapter.setup_subscription(protocol_config.points)
            except Exception:
                pass

    @staticmethod
    def _normalize_protocol(proto: str) -> str:
        """统一协议名称 — 兼容 Parse DB 中的别名"""
        aliases = {
            "A11 RTU": "a11", "a11_tcp": "a11", "A11": "a11",
            "OPC DA": "opcda", "opc_da": "opcda",
            "Modbus RTU": "modbus_rtu",
            "force_hls_sim": "modbus_tcp",
        }
        return aliases.get(proto, proto)

    def _create_adapter(self, config: ProtocolConfig) -> Optional[BaseProtocolAdapter]:
        """创建协议适配器"""
        proto = self._normalize_protocol(config.protocol_type)
        if proto == "modbus_rtu":
            from ..protocols.modbus_rtu import ModbusRTUAdapter
            return ModbusRTUAdapter(config)
        elif proto == "modbus_tcp":
            from ..protocols.modbus_tcp import ModbusTCPAdapter
            return ModbusTCPAdapter(config)
        elif proto == "iec104":
            from ..protocols.iec104_client import IEC104Client
            return IEC104Client(config)
        elif proto == "opcua":
            from ..protocols.opcua_client import OPCUAClient
            return OPCUAClient(config)
        elif proto == "opcda":
            from ..protocols.opcda_client import OPCDAClient
            return OPCDAClient(config)
        elif proto == "a11":
            from ..protocols.a11 import A11ProtocolAdapter, A11Config
            return A11ProtocolAdapter(A11Config(
                device_id=config.device_id,
                device_name=config.device_name,
                host=config.extra.get("host", "127.0.0.1"),
                port=config.extra.get("port", 8889),
                unit_id=config.extra.get("unit_id", 0),
                heartbeat_interval=config.extra.get("heartbeat_interval", 5),
                collect_interval=config.collect_interval,
                timeout=config.timeout,
                retry=config.retry,
                points=config.points,
                dds_enabled=config.extra.get("dds_enabled", False),
                dds_port=config.extra.get("dds_port", 2500),
                extra=config.extra,
            ))
        else:
            logger.error(f"[collector] 不支持的协议: {proto}")
            return None

    async def _collect_loop(self, device_id: str, adapter: BaseProtocolAdapter, interval: int) -> None:
        """设备采集循环"""
        # 添加随机抖动避免采集风暴
        await asyncio.sleep(random.uniform(0, interval * 0.5))
        logger.info(f"[collector] {device_id} 采集循环启动 interval={interval}s running={self._running}")

        while self._running:
            start = datetime.now(timezone.utc)
            try:
                # 健康检查
                if not await adapter.is_connected():
                    await adapter.connect()

                # 读取点位
                points = adapter.config.points
                results = await adapter.read_points(points)

                if results:
                    # 写入 TDengine（带物模型标签）
                    meta = self._device_meta.get(device_id, {})
                    rows = []
                    for pv in results:
                        rows.append({
                            "device_id": pv.device_id,
                            "point_id": pv.point_id,
                            "point_name": pv.point_name,
                            "value": float(pv.value) if isinstance(pv.value, (int, float)) else 0.0,
                            "unit": pv.unit or "",
                            "quality": pv.quality,
                            "device_type": meta.get("device_type", "default"),
                            "station_id": meta.get("station_id", "default"),
                        })
                    await self.td.batch_insert(rows)

                    # 触发回调（告警 + 推送）
                    for cb in self._on_data_callbacks:
                        try:
                            await cb(device_id, results)
                        except Exception:
                            pass

                    self._stats[device_id]["success"] += 1
                    logger.debug(f"[collector] {device_id}: {len(results)} 个点位采集成功")
                else:
                    self._stats[device_id]["fail"] += 1

            except Exception as e:
                self._stats[device_id]["fail"] += 1
                logger.error(f"[collector] {device_id} 采集异常: {e}")

            # 计算下一次采集等待时间
            elapsed = (datetime.now(timezone.utc) - start).total_seconds()
            wait = max(0.1, interval - elapsed)
            await asyncio.sleep(wait)

    async def add_device(self, dev: Device) -> bool:
        """动态添加设备"""
        if dev.device_id in self._adapters:
            return False
        await self._add_device(dev)
        return dev.device_id in self._adapters

    async def remove_device(self, device_id: str) -> bool:
        """动态移除设备"""
        if device_id in self._tasks:
            self._tasks[device_id].cancel()
            del self._tasks[device_id]
        if device_id in self._adapters:
            await self._adapters[device_id].disconnect()
            del self._adapters[device_id]
        if device_id in self._stats:
            del self._stats[device_id]
        await self.pg.update_device_status(device_id, "offline")
        return True

    async def get_stats(self) -> Dict[str, Any]:
        """获取采集统计"""
        total_success = sum(s["success"] for s in self._stats.values())
        total_fail = sum(s["fail"] for s in self._stats.values())
        return {
            "total_devices": len(self._adapters),
            "online_devices": sum(1 for a in self._adapters.values() if a._connected),
            "total_collects": total_success + total_fail,
            "total_success": total_success,
            "total_fail": total_fail,
            "success_rate": round(total_success / max(1, total_success + total_fail) * 100, 2),
            "device_stats": {k: dict(v) for k, v in self._stats.items()},
        }
