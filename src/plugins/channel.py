# ============================================================
# PluginChannel — 插件通道，对标 dgiot_bridge 行为模式
# ============================================================
import asyncio, logging, time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional
from datetime import datetime

from protocols.base import BaseProtocolAdapter, ProtocolConfig, PointValue

log = logging.getLogger("plugin.channel")

class ChannelStatus(Enum):
    init = "init"
    connecting = "connecting"
    online = "online"
    offline = "offline"
    error = "error"
    stopped = "stopped"

@dataclass
class ChannelStats:
    collected: int = 0
    errors: int = 0
    bytes_in: int = 0
    last_collect: Optional[datetime] = None
    latency_ms: float = 0.0

@dataclass
class PluginChannel:
    """一个协议插件的通道实例

    对标 dgiot dgiot_channel: 每种协议一个通道实例，生命周期由 ChannelManager 统一管理
    """
    channel_id: str                         # 通道唯一ID, 如 ch_modbus_tcp_01
    name: str                               # 显示名
    cType: str                              # 协议类型: modbus_tcp/opcda/a11/iec104/mqtt/http_rest/dtu/rtsp...
    protocol: str                           # 协议名称(中文): Modbus TCP / OPC DA / A11专有...
    host: str = ""
    port: int = 0
    status: ChannelStatus = ChannelStatus.init
    stats: ChannelStats = field(default_factory=ChannelStats)

    # 协议特有配置
    config: Dict[str, Any] = field(default_factory=dict)
    # 关联的 Product (物模型) / Device
    product_id: str = ""
    device_ids: List[str] = field(default_factory=list)
    # 采集间隔(秒)
    interval: int = 5

    # 运行时
    _adapter: Optional[BaseProtocolAdapter] = None
    _task: Optional[asyncio.Task] = None
    _factory: Optional[Callable] = None     # 工厂函数: (config) -> BaseProtocolAdapter

    async def start(self) -> bool:
        """启动通道: 创建适配器 → 连接 → 启动采集循环"""
        if not self._factory:
            log.error(f"[{self.channel_id}] no factory, cannot start")
            return False
        try:
            self.status = ChannelStatus.connecting
            pc = ProtocolConfig(
                protocol_type=self.cType, device_id=self.channel_id,
                device_name=self.name, collect_interval=self.interval,
                extra=self.config
            )
            self._adapter = self._factory(pc)
            ok = await self._adapter.connect()
            if ok:
                self.status = ChannelStatus.online
                self._task = asyncio.create_task(self._run_loop())
                log.info(f"[{self.channel_id}] online — {self.cType}")
            else:
                self.status = ChannelStatus.offline
            return ok
        except Exception as e:
            self.status = ChannelStatus.error
            log.error(f"[{self.channel_id}] start failed: {e}")
            return False

    async def stop(self):
        """停止通道"""
        if self._task: self._task.cancel()
        if self._adapter:
            try: await self._adapter.disconnect()
            except: pass
        self.status = ChannelStatus.stopped
        log.info(f"[{self.channel_id}] stopped")

    async def _run_loop(self):
        """采集循环"""
        while True:
            try:
                t0 = time.monotonic()
                await self._collect_once()
                self.stats.latency_ms = (time.monotonic() - t0) * 1000
                self.stats.last_collect = datetime.utcnow()
            except asyncio.CancelledError: break
            except Exception as e:
                self.stats.errors += 1
                log.warning(f"[{self.channel_id}] collect error: {e}")
            await asyncio.sleep(self.interval)

    async def _collect_once(self):
        """单次采集 — 子类可覆写"""
        if not self._adapter or self.status != ChannelStatus.online:
            return
        points = self.config.get("points", [])
        if points:
            results = await self._adapter.read_points(points)
            self.stats.collected += len(results)
            self.stats.bytes_in += sum(len(str(r.value)) for r in results)

    async def health_check(self) -> bool:
        if self._adapter:
            return await self._adapter.health_check()
        return False

    def to_dict(self) -> dict:
        return {
            "device_id": self.channel_id, "name": self.name,
            "cType": self.cType, "protocol": self.protocol,
            "status": self.status.value, "host": self.host, "port": self.port,
            "devices": len(self.device_ids),
            "points": self.stats.collected,
            "desc": f"{self.cType.upper()} · {self.host}:{self.port}" if self.host else self.cType,
            "interval": self.interval, "product": self.product_id,
            "stats": {
                "collected": self.stats.collected, "errors": self.stats.errors,
                "latency_ms": round(self.stats.latency_ms, 1),
                "last": self.stats.last_collect.isoformat() if self.stats.last_collect else None
            }
        }
