"""
DeviceShadow — 设备影子状态机 (对标 DG-IoT dgiot_shadow gen_statem)
====================================================================
每个设备一个 Shadow 实例, 管理生命周期状态迁移.

状态机:
  init ──→ authenticate ──→ online ──→ {normal, alarm, offline}
                                    ↑__________↓
                                  心跳/告警/超时触发迁移

迁移规则:
  online  + heartbeat_timeout(30s)  → offline
  online  + alarm_event             → alarm
  alarm   + heartbeat_timeout(60s)  → offline
  alarm   + heartbeat_ok            → online
  alarm   + auto_clear(60s无新告警) → online
  offline + heartbeat_ok            → online

用法:
  shadow = DeviceShadow("rtu_001", product="oilwell")
  shadow.transition("online")
  shadow.heartbeat()            # 更新心跳
  shadow.raise_alarm("过流")    # 触发告警
  print(shadow.state)           # "alarm"
"""
import time
import threading
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any, Callable
from datetime import datetime, timezone


class State(Enum):
    INIT = "init"
    AUTHENTICATE = "auth"
    ONLINE = "online"
    NORMAL = "normal"
    ALARM = "alarm"
    OFFLINE = "offline"


# 状态迁移表
TRANSITIONS = {
    State.INIT: [State.AUTHENTICATE],
    State.AUTHENTICATE: [State.ONLINE],
    State.ONLINE: [State.NORMAL, State.OFFLINE],
    State.NORMAL: [State.ALARM, State.OFFLINE],
    State.ALARM: [State.NORMAL, State.OFFLINE],
    State.OFFLINE: [State.ONLINE],
}


@dataclass
class ShadowConfig:
    heartbeat_timeout: float = 30.0   # normal 心跳超时 (秒)
    alarm_heartbeat_timeout: float = 60.0  # alarm 心跳超时
    alarm_auto_clear: float = 60.0    # 无新告警自动恢复
    alarm_threshold: int = 3          # 连续 error 进入 alarm
    reconnect_interval: float = 5.0   # 离线重连间隔


class DeviceShadow:
    """设备影子 — 一设备一实例"""

    def __init__(self, device_id: str, product: str = "default",
                 config: ShadowConfig = None,
                 on_state_change: Optional[Callable] = None):
        self.device_id = device_id
        self.product = product
        self.cfg = config or ShadowConfig()
        self._on_state_change = on_state_change  # 状态变更回调

        # 状态
        self.state: State = State.INIT
        self._last_heartbeat: float = 0
        self._error_count: int = 0
        self._last_alarm_time: float = 0
        self._alarm_msgs: List[str] = []
        self._props: Dict[str, Any] = {}

        # 后台检查定时器
        self._running: bool = False
        self._timer: Optional[threading.Timer] = None

    # ── 状态迁移 ──

    def transition(self, new_state: State) -> bool:
        """尝试状态迁移"""
        if new_state not in TRANSITIONS.get(self.state, []):
            return False

        old = self.state
        self.state = new_state
        if self._on_state_change:
            self._on_state_change(self.device_id, old.value, new_state.value)
        return True

    # ── 心跳 ──

    def heartbeat(self) -> State:
        """收到设备心跳"""
        self._last_heartbeat = time.time()

        if self.state == State.INIT:
            self.transition(State.AUTHENTICATE)
        elif self.state == State.AUTHENTICATE:
            self.transition(State.ONLINE)
        elif self.state == State.ONLINE:
            self.transition(State.NORMAL)
        elif self.state == State.OFFLINE:
            self.transition(State.ONLINE)
            self.transition(State.NORMAL)

        self._error_count = 0
        return self.state

    # ── 告警 ──

    def raise_alarm(self, msg: str = "") -> State:
        """触发告警"""
        self._error_count += 1
        self._alarm_msgs.append(msg)
        self._last_alarm_time = time.time()

        if self._error_count >= self.cfg.alarm_threshold:
            if self.state in (State.NORMAL, State.ONLINE):
                self.transition(State.ALARM)
        return self.state

    def clear_alarm(self) -> State:
        """手动清除告警"""
        self._error_count = 0
        self._alarm_msgs.clear()
        if self.state == State.ALARM:
            self.transition(State.NORMAL)
        return self.state

    # ── 离线 ──

    def mark_offline(self, reason: str = "") -> State:
        """标记离线"""
        self.transition(State.OFFLINE)
        return self.state

    # ── 属性 ──

    def set_prop(self, key: str, value: Any):
        self._props[key] = value

    def get_prop(self, key: str) -> Optional[Any]:
        return self._props.get(key)

    def set_props(self, props: Dict[str, Any]):
        self._props.update(props)

    # ── 自动巡检 ──

    def _check_timeout(self):
        """检查心跳超时"""
        now = time.time()
        if self.state in (State.NORMAL, State.ONLINE):
            if now - self._last_heartbeat > self.cfg.heartbeat_timeout:
                self.transition(State.OFFLINE)
        elif self.state == State.ALARM:
            if now - self._last_heartbeat > self.cfg.alarm_heartbeat_timeout:
                self.transition(State.OFFLINE)
            elif now - self._last_alarm_time > self.cfg.alarm_auto_clear:
                self.clear_alarm()

    def start_monitor(self, interval: float = 10):
        """启动后台超时检查"""
        self._running = True

        def _loop():
            while self._running:
                self._check_timeout()
                time.sleep(interval)

        self._timer = threading.Thread(target=_loop, daemon=True)
        self._timer.start()

    def stop_monitor(self):
        self._running = False

    # ── 快照 ──

    def snapshot(self) -> dict:
        return {
            "device_id": self.device_id, "product": self.product,
            "state": self.state.value,
            "last_heartbeat": self._last_heartbeat,
            "error_count": self._error_count,
            "alarms": self._alarm_msgs[-5:],  # 最近5条
            "props": self._props,
        }


# ── 全局影子注册表 ──
_shadows: Dict[str, DeviceShadow] = {}


def get_shadow(device_id: str, product: str = "default") -> DeviceShadow:
    if device_id not in _shadows:
        _shadows[device_id] = DeviceShadow(device_id, product)
    return _shadows[device_id]


def all_shadows() -> Dict[str, DeviceShadow]:
    return _shadows


def remove_shadow(device_id: str):
    s = _shadows.pop(device_id, None)
    if s:
        s.stop_monitor()
