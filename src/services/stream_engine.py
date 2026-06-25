#!/usr/bin/env python3
# ============================================================
# dgiot_lite — 边缘流式引擎
# 来源: dgiot_collector/src/core/edge_stream_engine.py
# 两层计算: 滑窗特征 + 实时规则(15种算法)
# ============================================================
import logging
import time
from typing import Dict, List, Callable
from collections import deque
from dataclasses import dataclass, field
import statistics

logger = logging.getLogger(__name__)


# ===== 滑动窗口 =====

@dataclass
class SlidingWindow:
    key: str
    max_size: int = 20
    _values: deque = field(default_factory=deque)
    _timestamps: deque = field(default_factory=deque)

    def push(self, value: float, ts: float = None):
        self._values.append(value)
        self._timestamps.append(ts or time.time())
        if len(self._values) > self.max_size:
            self._values.popleft()
            self._timestamps.popleft()

    def values(self) -> List[float]: return list(self._values)
    def size(self) -> int: return len(self._values)
    def is_ready(self, min_points: int = 2) -> bool: return len(self._values) >= min_points
    def reset(self): self._values.clear(); self._timestamps.clear()


# ===== 第一层: 滑窗特征 =====

class WindowFeatures:
    """滑窗特征计算器: avg/min/max/rate/std/trend"""

    @staticmethod
    def compute_all(w: SlidingWindow) -> dict:
        if not w.is_ready(2):
            return {}
        vals = w.values()
        return {
            "avg": statistics.mean(vals),
            "min": min(vals),
            "max": max(vals),
            "std": statistics.stdev(vals) if len(vals) >= 3 else 0.0,
            "latest": vals[-1],
            "count": len(vals),
            "trend": "up" if len(vals) >= 2 and vals[-1] > vals[0] else ("down" if len(vals) >= 2 and vals[-1] < vals[0] else "flat"),
            "rate": (vals[-1] - vals[0]) / (w._timestamps[-1] - w._timestamps[0]) if len(vals) >= 2 and w._timestamps[-1] > w._timestamps[0] else 0.0,
        }


# ===== 第二层: 15种边缘告警算法 =====

class EdgeRules:
    """实时规则引擎 — 纯内存 deque, 单条 < 1ms"""

    alarms_count = 0

    @staticmethod
    def _compare(val: float, op: str, thr: float) -> bool:
        if op == ">": return val > thr
        if op == ">=": return val >= thr
        if op == "<": return val < thr
        if op == "<=": return val <= thr
        if op == "==": return abs(val - thr) < 0.001
        return False

    # --- 基础算法 (1-6) ---

    @classmethod
    def threshold(cls, val: float, high: float = None, low: float = None) -> dict:
        """阈值检测"""
        if high and val > high:
            return {"alarm": True, "level": "P1", "msg": f"超上限 {high}", "algo": "threshold"}
        if low and val < low:
            return {"alarm": True, "level": "P1", "msg": f"低下限 {low}", "algo": "threshold"}
        return {"alarm": False, "algo": "threshold"}

    @classmethod
    def sudden_change(cls, w: SlidingWindow, thr: float) -> dict:
        """突变检测: 相邻两点差值超过阈值"""
        vals = w.values()
        if len(vals) < 2: return {"alarm": False}
        diff = abs(vals[-1] - vals[-2])
        return {"alarm": diff > thr, "level": "P1" if diff > thr else "",
                "msg": f"突变 {diff:.2f} > {thr}" if diff > thr else "", "algo": "sudden_change"}

    @classmethod
    def trend_detect(cls, w: SlidingWindow, min_points: int = 5) -> dict:
        """趋势检测: 连续N点上升/下降"""
        vals = w.values()
        if len(vals) < min_points: return {"alarm": False}
        up = all(vals[i] > vals[i-1] for i in range(-min_points+1, 0))
        down = all(vals[i] < vals[i-1] for i in range(-min_points+1, 0))
        if up: return {"alarm": True, "level": "P2", "msg": f"连续{min_points}点上升", "algo": "trend"}
        if down: return {"alarm": True, "level": "P2", "msg": f"连续{min_points}点下降", "algo": "trend"}
        return {"alarm": False, "algo": "trend"}

    @classmethod
    def volatility(cls, w: SlidingWindow, thr: float) -> dict:
        """波动率检测: 标准差超过阈值"""
        vals = w.values()
        if len(vals) < 3: return {"alarm": False}
        std = statistics.stdev(vals)
        return {"alarm": std > thr, "level": "P2" if std > thr else "",
                "msg": f"波动 {std:.2f} > {thr}" if std > thr else "", "algo": "volatility"}

    @classmethod
    def threshold_count(cls, w: SlidingWindow, limit: float, op: str, count_thr: int) -> dict:
        """频次检测: 窗口内超过阈值的次数"""
        vals = w.values()
        cnt = sum(1 for v in vals if cls._compare(v, op, limit))
        return {"alarm": cnt >= count_thr, "level": "P2",
                "msg": f"超限频次 {cnt}/{len(vals)} >= {count_thr}" if cnt >= count_thr else "", "algo": "threshold_count"}

    @classmethod
    def sliding_avg(cls, w: SlidingWindow, thr: float, op: str) -> dict:
        """滑动平均检测"""
        if not w.is_ready(3): return {"alarm": False}
        avg = statistics.mean(w.values())
        return {"alarm": cls._compare(avg, op, thr), "level": "P1",
                "msg": f"均值 {avg:.2f} {op} {thr}" if cls._compare(avg, op, thr) else "", "algo": "sliding_avg"}

    # --- 扩展算法 (7-15) ---

    @classmethod
    def rate_of_change(cls, w: SlidingWindow, threshold: float) -> dict:
        """变化率检测"""
        if len(w.values()) < 2: return {"alarm": False}
        rate = (w.values()[-1] - w.values()[-2]) / max(0.1, w._timestamps[-1] - w._timestamps[-2])
        return {"alarm": abs(rate) > threshold, "level": "P1", "msg": f"变化率 {rate:.2f}/s" if abs(rate) > threshold else "", "algo": "roc"}

    @classmethod
    def peak_detect(cls, w: SlidingWindow, threshold: float, lookback: int = 2) -> dict:
        """波峰检测"""
        vals = w.values()
        if len(vals) < lookback + 2: return {"alarm": False}
        peak = vals[-lookback-1]
        left = max(vals[:-lookback-1]) if len(vals[:-lookback-1]) > 0 else peak
        right = max(vals[-lookback:]) if len(vals[-lookback:]) > 0 else peak
        return {"alarm": peak > left and peak > right and peak > threshold,
                "level": "P1", "msg": f"波峰 {peak:.2f}" if peak > threshold else "", "algo": "peak"}

    @classmethod
    def continuous_abnormal(cls, w: SlidingWindow, threshold: float, op: str, count: int) -> dict:
        """连续异常检测"""
        vals = w.values()
        if len(vals) < count: return {"alarm": False}
        consecutive = sum(1 for v in vals[-count:] if cls._compare(v, op, threshold))
        return {"alarm": consecutive >= count, "level": "P1",
                "msg": f"连续{count}点异常" if consecutive >= count else "", "algo": "continuous"}

    @classmethod
    def deviation_from_baseline(cls, w: SlidingWindow, baseline: float, pct_thr: float) -> dict:
        """基线偏离检测"""
        if not w.is_ready(3): return {"alarm": False}
        avg = statistics.mean(w.values())
        dev = abs(avg - baseline) / baseline * 100 if baseline != 0 else 0
        return {"alarm": dev > pct_thr, "level": "P1",
                "msg": f"偏离基线 {dev:.1f}%" if dev > pct_thr else "", "algo": "deviation"}

    @classmethod
    def range_check(cls, val: float, min_v: float, max_v: float) -> dict:
        """量程校验"""
        if val < min_v or val > max_v:
            return {"alarm": True, "level": "P0", "msg": f"量程异常 {val} not in [{min_v},{max_v}]", "algo": "range"}
        return {"alarm": False, "algo": "range"}


# ===== 流式处理引擎 =====

class StreamEngine:
    """边缘流式引擎 — 管理所有设备的窗口和规则"""

    def __init__(self):
        self._windows: Dict[str, SlidingWindow] = {}  # key = "device_id:point_id"
        self._callbacks: List[Callable] = []

    def on_alarm(self, cb: Callable): self._callbacks.append(cb)

    def push(self, device_id: str, point_id: str, value: float):
        """推送一个数据点"""
        key = f"{device_id}:{point_id}"
        if key not in self._windows:
            self._windows[key] = SlidingWindow(key=key, max_size=20)
        w = self._windows[key]
        w.push(value)

        # 计算滑窗特征
        features = WindowFeatures.compute_all(w)

        # 执行内置规则
        alarms = []
        alarms.append(EdgeRules.sudden_change(w, abs(features.get("avg", 0)) * 0.5))
        alarms.append(EdgeRules.trend_detect(w, 5))
        alarms.append(EdgeRules.volatility(w, abs(features.get("avg", 0)) * 0.3))

        for a in alarms:
            if a.get("alarm"):
                for cb in self._callbacks:
                    try: cb(device_id, point_id, a)
                    except: pass

        return {"features": features, "alarms": [a for a in alarms if a.get("alarm")]}

    def get_window(self, device_id: str, point_id: str) -> Optional[SlidingWindow]:
        return self._windows.get(f"{device_id}:{point_id}")
