#!/usr/bin/env python3
# ============================================================
# iotStudio — OPC DA 协议客户端 (基于 OpenOPC)
# pip install OpenOPC-DA
# ============================================================
"""
OPC DA Client — 使用 OpenOPC 库连接 OPC DA Server

OpenOPC 封装了 Windows COM/DCOM 调用:
  - 连接本地/远程 OPC Server
  - 浏览 (list) 服务器和项
  - 读取 (read) 同步/异步
  - 写入 (write)
  - 组 (group) 订阅 + 回调

配置示例 (config.extra):
{
    "opc_server": "Matrikon.OPC.Simulation.1",  // OPC Server ProgID
    "opc_host": "localhost",                     // 远程DCOM主机
    "items": [{"item": "Random.Int4", "point_id": "p1", "name": "随机数", "dtype": "float"}],
    "update_ms": 1000,
}
"""
import asyncio
import logging
import sys
import threading
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)

# OpenOPC 是同步阻塞库，需要在线程中运行
try:
    import OpenOPC
    HAS_OPENOPC = True
except ImportError:
    HAS_OPENOPC = False
    logger.info("OpenOPC-DA 未安装: pip install OpenOPC-DA")


class OPCDAClient(BaseProtocolAdapter):
    """OPC DA 客户端适配器 (OpenOPC)

    由于 OpenOPC 是同步 COM 库，所有 OPC 操作在独立线程中执行，
    通过 asyncio.Queue 传递数据到异步世界。
    """

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self._opc = None
        self._data_queue: asyncio.Queue = asyncio.Queue()
        self._read_thread: Optional[threading.Thread] = None
        self._items_map: Dict[str, Dict] = {}       # item_path → {point_id, name, ...}
        self._running = False

    async def connect(self) -> bool:
        if not HAS_OPENOPC:
            logger.error("[opcda] OpenOPC-DA 未安装")
            return False
        if sys.platform != "win32":
            logger.error("[opcda] OPC DA 仅支持 Windows")
            return False

        try:
            opc_server = self.config.extra.get("opc_server", "Matrikon.OPC.Simulation.1")
            opc_host = self.config.extra.get("opc_host", "localhost")

            # OpenOPC 客户端 (同步 → 线程池避免阻塞事件循环)
            loop = asyncio.get_running_loop()
            self._opc = await loop.run_in_executor(None, lambda: OpenOPC.open_client(opc_host))
            servers = await loop.run_in_executor(None, lambda: self._opc.servers())
            logger.info(f"[opcda] {self.device_id} 可用服务器: {servers[:5]}")

            await loop.run_in_executor(None, lambda: self._opc.connect(opc_server))
            logger.info(f"[opcda] {self.device_id} 连接成功 → {opc_server}")
            self._connected = True

            # 构建采集项映射
            items = self.config.extra.get("items", [])
            for it in items:
                item_path = it.get("item", it.get("item_id", ""))
                if item_path:
                    self._items_map[item_path] = {
                        "point_id": it.get("point_id", item_path.replace('.', '_')),
                        "point_name": it.get("point_name", it.get("name", item_path)),
                        "data_type": it.get("data_type", it.get("dtype", "float")),
                        "unit": it.get("unit", ""),
                        "scale": it.get("scale", 1.0),
                        "offset": it.get("offset", 0.0),
                    }

            # 验证项是否有效
            if self._items_map:
                first_key = list(self._items_map.keys())[0]
                pattern = first_key.rsplit('.', 1)[0] + '.*' if '.' in first_key else '*'
                available = await loop.run_in_executor(None, lambda: self._opc.list(pattern, recursive=True, flat=True))
                logger.info(f"[opcda] {self.device_id} 可用项示例: {available[:5]}")

            # 启动采集线程
            self._running = True
            interval = self.config.extra.get("update_ms", 1000) / 1000.0
            self._read_thread = threading.Thread(target=self._read_loop, args=(interval,), daemon=True)
            self._read_thread.start()
            logger.info(f"[opcda] {self.device_id} 采集线程启动 (间隔={interval}s, 项数={len(self._items_map)})")

            return True
        except Exception as e:
            logger.error(f"[opcda] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        self._running = False
        if self._opc:
            try:
                loop = asyncio.get_running_loop()
                await loop.run_in_executor(None, self._opc.close)
            except Exception:
                pass
            self._opc = None
        self._connected = False

    def _read_loop(self, interval: float):
        """同步读取循环 (独立线程)"""
        # 转换 items_map keys 为列表以加速
        item_paths = list(self._items_map.keys())

        while self._running and self._opc:
            try:
                if item_paths:
                    # OpenOPC 同步读取
                    values, errors, timestamps = self._opc.read(item_paths, update=interval * 1000)

                    for i, (item_path, raw_val, err, ts) in enumerate(
                            zip(item_paths, values, errors, timestamps)):
                        if err:
                            continue
                        info = self._items_map.get(item_path)
                        if not info:
                            continue

                        # 类型转换
                        try:
                            val = float(raw_val) * info["scale"] + info["offset"]
                        except (ValueError, TypeError):
                            val = 0.0

                        pv = PointValue(
                            device_id=self.device_id,
                            point_id=info["point_id"],
                            point_name=info["point_name"],
                            value=val,
                            data_type=info["data_type"],
                            unit=info.get("unit"),
                            quality=0,
                            timestamp=datetime.now(timezone.utc),
                        )
                        try:
                            self._data_queue.put_nowait(pv)
                        except asyncio.QueueFull:
                            pass

            except Exception as e:
                logger.debug(f"[opcda] read error: {e}")

            time.sleep(interval)

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """从队列取数据"""
        results = []
        wanted = {p.get("point_id") for p in points}
        while not self._data_queue.empty():
            try:
                pv = self._data_queue.get_nowait()
                if pv.point_id in wanted or not wanted:
                    results.append(pv)
            except asyncio.QueueEmpty:
                break
        return results

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        """写入 OPC 项"""
        if not self._connected or not self._opc:
            return False
        try:
            item_path = point.get("protocol_addr", "")
            if item_path in self._items_map:
                loop = asyncio.get_running_loop()
                await loop.run_in_executor(None, lambda: self._opc.write([(item_path, value)]))
                return True
        except Exception as e:
            logger.error(f"[opcda] write failed: {e}")
        return False

    async def browse(self, path: str = "*") -> List[Dict[str, Any]]:
        """浏览 OPC Server 项空间"""
        if not self._opc:
            return []
        try:
            loop = asyncio.get_running_loop()
            items = await loop.run_in_executor(None, lambda: self._opc.list(path, recursive=True, flat=True))
            return [{"item_id": it} for it in items]
        except Exception:
            return []
