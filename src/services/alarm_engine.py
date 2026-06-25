# ============================================================
# pythonIot — 告警引擎
# ============================================================
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from ..protocols.base import PointValue
from ..storage.postgres import PostgresStore

logger = logging.getLogger(__name__)


class AlarmEngine:
    """告警引擎

    评估规则:
    - 阈值告警: value > alarm_high → P1, value > alarm_high_high → P0
    - 速率告警: (value - last_value) / dt > rate_limit → P1
    - 状态告警: device offline → P0
    """

    def __init__(self, pg_store: PostgresStore):
        self.pg = pg_store
        self._last_values: Dict[str, tuple] = {}  # point_id → (value, timestamp)
        self._active_alarms: Dict[str, str] = {}   # point_id → alarm_id (防重复)
        self._on_alarm_callbacks: List[callable] = []

    def on_alarm(self, callback):
        self._on_alarm_callbacks.append(callback)

    async def evaluate(self, device_id: str, points: List[PointValue]) -> List[Dict[str, Any]]:
        """评估一批采集值，返回触发的告警列表"""
        triggered = []
        now = datetime.now(timezone.utc)

        for pv in points:
            if not isinstance(pv.value, (int, float)):
                continue

            # 查找点位配置（通过 point_id 匹配）
            alarms = await self._check_threshold(device_id, pv, now)
            alarms += await self._check_rate(device_id, pv, now)
            triggered.extend(alarms)

        # 触发回调（推送通知）
        for alarm in triggered:
            for cb in self._on_alarm_callbacks:
                try:
                    await cb(alarm)
                except Exception:
                    pass

        return triggered

    async def _check_threshold(self, device_id: str, pv: PointValue, now: datetime) -> List[Dict]:
        """检查阈值告警"""
        alarms = []
        # 从点位额外信息中获取阈值
        extra = pv.extra if hasattr(pv, 'extra') else {}

        high = extra.get("alarm_high")
        high_high = extra.get("alarm_high_high")
        low = extra.get("alarm_low")
        low_low = extra.get("alarm_low_low")

        level = None
        msg = ""

        if high_high and pv.value > high_high:
            level = "P0"
            msg = f"{pv.point_name} 值 {pv.value} 超过上上限 {high_high}"
        elif high and pv.value > high:
            level = "P1"
            msg = f"{pv.point_name} 值 {pv.value} 超过上限 {high}"
        elif low_low and pv.value < low_low:
            level = "P0"
            msg = f"{pv.point_name} 值 {pv.value} 低于下下限 {low_low}"
        elif low and pv.value < low:
            level = "P1"
            msg = f"{pv.point_name} 值 {pv.value} 低于下限 {low}"

        if level:
            # 防重复
            if pv.point_id in self._active_alarms:
                return alarms
            alarm_id = f"ALM-{uuid.uuid4().hex[:8].upper()}"
            alarm = {
                "alarm_id": alarm_id,
                "device_id": device_id,
                "point_id": pv.point_id,
                "alarm_type": "threshold",
                "alarm_level": level,
                "alarm_msg": msg,
                "alarm_value": pv.value,
                "threshold_value": high_high or high or low_low or low,
            }
            await self.pg.create_alarm(alarm)
            self._active_alarms[pv.point_id] = alarm_id
            alarms.append(alarm)
            logger.warning(f"[alarm] {alarm_id}: {msg}")

        return alarms

    async def _check_rate(self, device_id: str, pv: PointValue, now: datetime) -> List[Dict]:
        """检查变化率告警"""
        alarms = []
        last = self._last_values.get(pv.point_id)
        self._last_values[pv.point_id] = (pv.value, now)

        if last is None:
            return alarms

        last_val, last_ts = last
        dt = (now - last_ts).total_seconds()
        if dt <= 0:
            return alarms

        rate = abs(pv.value - last_val) / dt
        rate_limit = pv.extra.get("rate_limit", float('inf')) if hasattr(pv, 'extra') else float('inf')

        if rate > rate_limit:
            alarm_id = f"ALM-{uuid.uuid4().hex[:8].upper()}"
            alarm = {
                "alarm_id": alarm_id,
                "device_id": device_id,
                "point_id": pv.point_id,
                "alarm_type": "rate",
                "alarm_level": "P1",
                "alarm_msg": f"{pv.point_name} 变化率 {rate:.2f}/s 超过限值 {rate_limit}/s",
                "alarm_value": pv.value,
                "threshold_value": rate_limit,
            }
            await self.pg.create_alarm(alarm)
            alarms.append(alarm)

        return alarms

    async def clear_alarm(self, alarm_id: str, operator: str = "system") -> bool:
        """清除告警"""
        await self.pg.update_alarm_status(alarm_id, "cleared", operator)
        # 清除防重复记录
        to_remove = [pid for pid, aid in self._active_alarms.items() if aid == alarm_id]
        for pid in to_remove:
            del self._active_alarms[pid]
        return True

    async def confirm_alarm(self, alarm_id: str, operator: str = "system") -> bool:
        """确认告警"""
        await self.pg.update_alarm_status(alarm_id, "confirmed", operator)
        return True
