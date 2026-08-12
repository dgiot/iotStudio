"""IEC 60870-5-104 协议适配器插件 — SCADA/电力远动通信"""
import asyncio
import logging
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

log = logging.getLogger("iec104")


@dataclass
class Iec104Config:
    """IEC 104 协议配置

    Attributes:
        host: 远动装置 IP 地址
        port: TCP 端口 (默认 2404)
        common_address: 公共地址 (链路地址)
        cause_of_transmission: 传输原因 (1=周期, 2=背景, 3=突发, 20=总召)
        timeout: 连接/读写超时 (秒)
        retry: 重试次数
    """
    host: str = "127.0.0.1"
    port: int = 2404
    common_address: int = 1
    cause_of_transmission: int = 3
    timeout: int = 10
    retry: int = 3


class Iec104Adapter:
    """IEC 60870-5-104 协议适配器 — SCADA/电力远动通信

    对接变电站/配电网远动装置，支持遥测、遥信、遥控。
    完整协议实现见 iec104_client.py (基于 BaseProtocolAdapter)，
    本插件提供符合 plugin_registry 标准的接入接口。
    """

    def __init__(self, config: Iec104Config):
        self.config = config
        self._reader: Optional[asyncio.StreamReader] = None
        self._writer: Optional[asyncio.StreamWriter] = None
        self._connected = False

    async def connect(self) -> bool:
        """建立 TCP 连接并启动数据传输

        连接成功后需发送 STARTDT 激活帧 (U 帧 0x07 0x00 0x00 0x00)，
        接收 STARTDT_CONF 后进入数据传输状态。
        """
        try:
            self._reader, self._writer = await asyncio.wait_for(
                asyncio.open_connection(self.config.host, self.config.port),
                timeout=self.config.timeout,
            )
            # 发送 STARTDT 激活
            startdt = b'\x68\x04\x04\x68\x07\x00\x00\x00'
            self._writer.write(startdt)
            await self._writer.drain()
            # 等待 STARTDT_CONF
            resp = await asyncio.wait_for(self._reader.read(8), timeout=3)
            if resp and resp[4] == 0x0b:
                self._connected = True
                log.info(f"[iec104] 连接成功 {self.config.host}:{self.config.port}")
                return True
            log.warning(f"[iec104] {self.config.host}:{self.config.port} STARTDT 确认失败")
            await self.disconnect()
            return False
        except Exception as e:
            log.error(f"[iec104] 连接失败 {self.config.host}:{self.config.port}: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        """断开连接 — 发送 STOPDT 后关闭 socket"""
        if self._writer:
            try:
                stopdt = b'\x68\x04\x04\x68\x13\x00\x00\x00'
                self._writer.write(stopdt)
                await self._writer.drain()
            except Exception:
                pass
            self._writer.close()
            try:
                await self._writer.wait_closed()
            except Exception:
                pass
        self._connected = False
        log.info(f"[iec104] 已断开 {self.config.host}:{self.config.port}")

    async def read_point(self, point_id: str) -> Optional[Dict[str, Any]]:
        """读取单个遥测/遥信点

        通过 IOA (信息体地址) 匹配读取。完整实现应解析 ASDU 响应，
        当前版本为简化存根，需配合 iec104_client.py 或自定义解析逻辑。

        Args:
            point_id: 信息体地址 (IOA) 字符串

        Returns:
            {"point_id": str, "value": Any, "quality": int, "ts": str} 或 None
        """
        if not self._connected:
            return None
        # 存根 — 真实场景下发送总召并解析响应
        return {"point_id": point_id, "value": None, "quality": 0, "ts": ""}

    async def health(self) -> Dict[str, Any]:
        """健康检查 — 测试连接可达性"""
        if self._connected:
            return {"ok": True, "msg": "已连接"}
        try:
            ok = await self.connect()
            return {"ok": ok, "msg": "已连接" if ok else "重连失败"}
        except Exception as e:
            return {"ok": False, "msg": str(e)}


# -- plugin registration --
try:
    from plugin_registry import register
    register("iec104", version="1.0", category="protocol",
             adapter="Iec104Adapter",
             config={
                 "host": "127.0.0.1",
                 "port": 2404,
                 "common_address": 1,
                 "cause_of_transmission": 3,
             })
except ImportError:
    pass
