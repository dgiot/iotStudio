# ============================================================
# pythonIot — 协议适配器抽象基类
# ============================================================
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional, AsyncIterator


@dataclass
class PointValue:
    """采集到的点位值"""
    device_id: str
    point_id: str
    point_name: str
    value: Any
    data_type: str = "float32"
    unit: Optional[str] = None
    quality: int = 0       # 0=good, 1=uncertain, 2=bad
    timestamp: datetime = field(default_factory=datetime.utcnow)
    extra: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ProtocolConfig:
    """协议通用配置"""
    protocol_type: str               # modbus_rtu / modbus_tcp / iec104 / opcua
    device_id: str
    device_name: str = ""
    enabled: bool = True
    collect_interval: int = 5        # 采集周期(秒)
    timeout: int = 10                # 超时(秒)
    retry: int = 3                   # 重试次数
    points: List[Dict[str, Any]] = field(default_factory=list)
    extra: Dict[str, Any] = field(default_factory=dict)


class BaseProtocolAdapter(ABC):
    """协议适配器抽象基类"""

    def __init__(self, config: ProtocolConfig):
        self.config = config
        self._connected = False

    @property
    def protocol_type(self) -> str:
        return self.config.protocol_type

    @property
    def device_id(self) -> str:
        return self.config.device_id

    @abstractmethod
    async def connect(self) -> bool:
        """建立连接"""
        ...

    @abstractmethod
    async def disconnect(self) -> None:
        """断开连接"""
        ...

    @abstractmethod
    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """读取指定点位列表

        Args:
            points: 点位配置列表 [{"point_id": "x", "point_name": "y", "protocol_addr": "...", ...}, ...]

        Returns:
            采集到的点位值列表
        """
        ...

    @abstractmethod
    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """写入单个点位"""
        ...

    async def is_connected(self) -> bool:
        return self._connected

    async def health_check(self) -> bool:
        """健康检查"""
        try:
            if not self._connected:
                await self.connect()
            return self._connected
        except Exception:
            return False
