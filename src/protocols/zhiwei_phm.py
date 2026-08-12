# ============================================================
# dgiot_lite — 知微 PHM REST API 协议适配器 (声振温诊断)
# ============================================================
"""
知微 PHM (青理工) 设备健康诊断平台 API 适配器。

对接方式: REST API (端口 5051 bridge 或直连)
数据内容: CM301 声振温传感器 → 振动分析 → 故障诊断结果

配置示例 (config.extra):
{
    "api_url": "http://10.99.0.x:5051/api/v1",
    "api_key": "your-api-key",
    "poll_interval": 300,
    "devices": [
        {"sn": "CM301_001", "name": "北1-2-注水泵"},
        {"sn": "CM301_002", "name": "北1-2-压缩机"}
    ]
}

注意: 需要知微平台提供 API 文档后才能实际对接。
当前为框架占位，采集返回已配置的设备列表。
"""
import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)


class ZhiweiPhmAdapter(BaseProtocolAdapter):
    """知微 PHM 平台 REST API 适配器 (框架)"""

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self._api_url = config.extra.get("api_url", "")
        self._api_key = config.extra.get("api_key", "")
        self._devices = config.extra.get("devices", [])
        self._session = None

    async def connect(self) -> bool:
        """连接知微 API"""
        if not self._api_url:
            logger.warning(f"[phm] {self.device_id} 未配置 api_url")
            self._connected = False
            return False
        try:
            import httpx
            self._session = httpx.AsyncClient(
                base_url=self._api_url,
                headers={"Authorization": f"Bearer {self._api_key}"},
                timeout=30,
            )
            self._connected = True
            logger.info(f"[phm] {self.device_id} 已连接 {self._api_url}")
            return True
        except Exception as e:
            logger.error(f"[phm] {self.device_id} 连接失败: {e}")
            return False

    async def disconnect(self) -> None:
        if self._session:
            await self._session.aclose()
            self._session = None
        self._connected = False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """采集设备健康状态 (需要知微 API 文档完善)"""
        if not self._connected or not self._session:
            await self.connect()
            if not self._connected:
                return []

        results = []
        ts = datetime.now(timezone.utc)

        # 框架: 返回设备列表占位
        for dev in self._devices:
            sn = dev.get("sn", "unknown")
            name = dev.get("name", sn)
            results.append(PointValue(
                device_id=self.device_id,
                point_id=f"{sn}_connected",
                point_name=f"{name} 连接状态",
                value=1, data_type="uint16", unit="",
                timestamp=ts,
            ))

        if not results:
            results.append(PointValue(
                device_id=self.device_id,
                point_id="status",
                point_name="PHM 状态",
                value=1, data_type="uint16", unit="",
                timestamp=ts,
            ))

        logger.info(f"[phm] {self.device_id} 返回 {len(results)} 个点位 (待 API 文档完善)")
        return results

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        return False

    async def read_holding(self, addr: int, count: int = 1,
                           slave_id: Optional[int] = None) -> Optional[list]:
        return None


# -- 插件注册 --
try:
    from ..plugin_registry import register
    register("vendor_phm", version="1.0", category="protocol",
             adapter="ZhiweiPhmAdapter",
             config={
                 "api_url": "http://10.99.0.x:5051/api/v1",
                 "api_key": "",
                 "devices": [{"sn": "", "name": ""}],
             })
except ImportError:
    pass
