# ============================================================
# pythonIot — 数据推送引擎
# ============================================================
import asyncio
import inspect
import logging
from typing import Any, Dict, List

from ..protocols.base import PointValue
from ..storage.postgres import PostgresStore
from ..push.mqtt_pusher import MQTTPusher
from ..push.http_pusher import HTTPPusher
from ..push.dgiot_pusher import DGIoTBridge, DGIoTDirectTD

logger = logging.getLogger(__name__)


class PushEngine:
    """数据推送引擎

    接收采集数据，按推送目标配置转发到 MQTT / HTTP / DG-IoT。
    P1 插件化折叠: pusher 实现优先经插件注册表解析 (plugins/pushers),
    未装载/工厂缺失时回落到硬编码路径 — 装配语义不变。
    DG-IoT 联动为可选功能——未配置时不影响独立运行。
    """

    def __init__(self, pg_store: PostgresStore, registry=None):
        self.pg = pg_store
        self._registry = registry            # None → 全局 runtime 单例 (DI 供测试)
        self._pushers: Dict[str, Any] = {}   # target_id -> pusher (统一 push(message) 协议)
        self._initialized = False

    # ── pusher 解析: 插件注册表优先, 硬编码回落 ──

    def _resolve(self, target_type: str, config: dict):
        # 1) 插件注册表 (pushers 插件登记的惰性工厂)
        try:
            if self._registry is not None:
                caps = self._registry.pushers()
            else:
                from ..plugin_runtime import runtime as plugin_runtime
                caps = plugin_runtime.pushers()
            cap = caps.get(target_type)
        except Exception:
            cap = None
        if cap and callable(cap.get("factory")):
            try:
                return cap["factory"](config)
            except Exception as e:
                logger.warning(f"[push] 插件工厂 {target_type} 构造失败, 回落: {e}")

        # 2) 回落 — 历史硬编码路径
        legacy = {"mqtt": MQTTPusher, "http": HTTPPusher, "dgiot": DGIoTBridge}
        cls = legacy.get(target_type)
        if cls is None:
            return None
        return cls(config)

    @staticmethod
    def _compatible(pusher) -> bool:
        """pusher 协议探测: 需具备 async push(message) (edge_hub 等异形推送器暂不收编)"""
        push = getattr(pusher, "push", None)
        return callable(push) and inspect.iscoroutinefunction(push)

    async def start(self) -> None:
        """加载推送目标并初始化"""
        targets = await self.pg.list_push_targets()
        counts: Dict[str, int] = {}
        for t in targets:
            pusher = self._resolve(t.target_type, t.config or {})
            if pusher is None:
                logger.warning(f"[push] 未知推送类型 {t.target_type} (target={t.target_id}), 跳过")
                continue
            if not self._compatible(pusher):
                logger.warning(f"[push] {t.target_type} 推送器不符合 push(message) 协议, 跳过")
                continue
            self._pushers[t.target_id] = pusher
            counts[t.target_type] = counts.get(t.target_type, 0) + 1
        self._initialized = True
        summary = " ".join(f"{k}×{v}" for k, v in sorted(counts.items()))
        logger.info(f"[push] 启动完成 {summary}".strip())

    async def push(self, device_id: str, points: List[PointValue]) -> None:
        """推送数据"""
        if not self._initialized:
            return

        # 构造推送消息体
        message = self._build_message(device_id, points)

        # 并行推送到所有目标
        tasks = [p.push(message) for p in self._pushers.values()]
        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for r in results:
                if isinstance(r, Exception):
                    logger.warning(f"[push] 推送失败: {r}")

    def _build_message(self, device_id: str, points: List[PointValue]) -> Dict[str, Any]:
        """构造推送消息"""
        return {
            "type": "telemetry",
            "device_id": device_id,
            "timestamp": points[0].timestamp.isoformat() if points else "",
            "data": [
                {
                    "point_id": pv.point_id,
                    "point_name": pv.point_name,
                    "value": pv.value,
                    "unit": pv.unit or "",
                    "quality": pv.quality,
                }
                for pv in points
            ],
        }
