# ============================================================
# dgiot_lite — 告警引擎
# ============================================================
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from ..protocols.base import PointValue
from ..storage.postgres import PostgresStore

logger = logging.getLogger(__name__)


class AlarmEngine:
    """告警引擎 — 从数据库读取阈值配置"""

    def __init__(self, pg_store: PostgresStore):
        self.pg = pg_store
        self._threshold_cache: Dict[str, Dict] = {}  # point_id → {high, low, ...}
        self._active_alarms: Dict[str, str] = {}  # point_id → alarm_id
        self._on_alarm_callbacks: List[callable] = []

    def on_alarm(self, callback):
        self._on_alarm_callbacks.append(callback)

    async def _load_thresholds(self, device_id: str):
        """从数据库加载设备点位阈值"""
        points = await self.pg.list_points(device_id)
        for p in points:
            self._threshold_cache[p.point_id] = {
                "high": p.alarm_high,
                "high_high": p.alarm_high_high,
                "low": p.alarm_low,
                "low_low": p.alarm_low_low,
            }

    async def evaluate(self, device_id: str, points: List[PointValue]) -> List[Dict[str, Any]]:
        """评估一批采集值并生成告警"""
        triggered = []
        now = datetime.now(timezone.utc)

        # 确保阈值已加载
        if device_id not in [k.split(':')[0] for k in self._threshold_cache]:
            await self._load_thresholds(device_id)

        for pv in points:
            if not isinstance(pv.value, (int, float)):
                continue
            if pv.value == 0 and pv.point_id.endswith('_pf'):
                continue  # 功率因数=0 不告警

            thresholds = self._threshold_cache.get(pv.point_id, {})
            if not thresholds:
                continue

            level, msg = None, ""

            high = thresholds.get("high")
            high_high = thresholds.get("high_high")
            low = thresholds.get("low")
            low_low = thresholds.get("low_low")

            if high_high and pv.value > high_high:
                level, msg = "P0", f"{pv.point_name} {pv.value} > 上上限 {high_high}"
            elif high and pv.value > high:
                level, msg = "P1", f"{pv.point_name} {pv.value} > 上限 {high}"
            elif low_low and pv.value < low_low:
                level, msg = "P0", f"{pv.point_name} {pv.value} < 下下限 {low_low}"
            elif low and pv.value < low:
                level, msg = "P1", f"{pv.point_name} {pv.value} < 下限 {low}"

            if level:
                # 防止重复告警
                if pv.point_id in self._active_alarms:
                    continue
                alarm_id = f"ALM-{uuid.uuid4().hex[:8].upper()}"
                alarm = {
                    "alarm_id": alarm_id, "device_id": device_id,
                    "point_id": pv.point_id, "alarm_type": "threshold",
                    "alarm_level": level, "alarm_msg": msg,
                    "alarm_value": pv.value, "threshold_value": high_high or high or low_low or low,
                }
                await self.pg.create_alarm(alarm)
                self._active_alarms[pv.point_id] = alarm_id
                triggered.append(alarm)
                logger.warning(f"[alarm] {alarm_id}: {msg}")

                # 通知回调
                for cb in self._on_alarm_callbacks:
                    try: await cb(alarm)
                    except: pass

        return triggered

    async def confirm_alarm(self, alarm_id: str, operator: str = "system") -> bool:
        await self.pg.update_alarm_status(alarm_id, "confirmed", operator)
        to_remove = [pid for pid, aid in self._active_alarms.items() if aid == alarm_id]
        for pid in to_remove: self._active_alarms.pop(pid, None)
        return True

    async def clear_alarm(self, alarm_id: str, operator: str = "system") -> bool:
        await self.pg.update_alarm_status(alarm_id, "cleared", operator)
        to_remove = [pid for pid, aid in self._active_alarms.items() if aid == alarm_id]
        for pid in to_remove: self._active_alarms.pop(pid, None)
        return True
