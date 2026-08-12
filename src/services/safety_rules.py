"""
dgiot_lite — 安全判据引擎 (Safety Rules Engine)

基于 shixu 项目 rule_engine.py 移植，提供 L1/L2/L3 + ESD 共 26 条安全规则评估。

规则类型：
    threshold     高/高高/低/低低 阈值比较 (L1, ESD)
    trend         连续 N 点趋于阈值 (L2)
    rate_of_change  变化率检测 Δ/Δt (L2)
    combination   多点联合判断 (L3)
    esd           SIL 级紧急关断

集成方式（与 AlarmEngine 并列）：

    safety = SafetyPipeline(pg_store)
    collector.on_data(safety.evaluate)         # 注册到采集回调链
    safety.start_timeout_checker()             # 启动 L2 超时监控

    # 或通过 on_safety_event 自定义响应
    safety.on_safety_event(lambda e: print(f"[{e.level}] {e.message}"))
"""

import logging
import threading
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Tuple

from ..protocols.base import PointValue
from ..storage.postgres import PostgresStore

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# 枚举与数据结构
# ──────────────────────────────────────────────


class SafetyLevel(str, Enum):
    """安全等级，对应处置时间与自动化程度"""

    L1_AUTO = "L1"  # <2s, 95% 自动化处置
    L2_REMOTE = "L2"  # <30s, 远程确认
    L3_EMERGENCY = "L3"  # <1min, 紧急 / ESD


class RuleType(str, Enum):
    """规则类型"""

    THRESHOLD = "threshold"
    TREND = "trend"
    RATE_OF_CHANGE = "rate_of_change"
    COMBINATION = "combination"
    ESD = "esd"


@dataclass
class SafetyRule:
    """安全规则定义（与 shixu AlarmRule 对应但更结构化）"""

    rule_id: str
    name: str
    level: SafetyLevel
    rule_type: RuleType
    description: str
    action: str
    point_pattern: str  # "GAS-01~20", "VIB-201~212", "GAS-01~20,TDL-01~06"

    # 阈值（按需设置）
    threshold_high: Optional[float] = None
    threshold_high_high: Optional[float] = None
    threshold_low: Optional[float] = None
    threshold_low_low: Optional[float] = None

    # 趋势 / 变化率
    consecutive_count: int = 1
    rate_limit: Optional[float] = None  # %/min

    # L2 超时
    timeout_seconds: int = 0
    default_action_on_timeout: str = ""

    # ESD
    sil_level: int = 0

    verification_method: str = ""

    # ── 点位匹配 ──

    def matches_point(self, point_id: str) -> bool:
        """检查 point_id 是否匹配此规则的点位模式"""
        if not point_id:
            return False
        # 数字范围: "GAS-01~20"
        if "~" in self.point_pattern and "," not in self.point_pattern:
            return self._match_range(point_id)
        # 逗号分隔（组合规则的多点位匹配在主逻辑中处理；此处只做首个模式匹配）
        if "," in self.point_pattern:
            first = self.point_pattern.split(",")[0].strip()
            return self._match_single(point_id, first)
        # 通配后缀
        if self.point_pattern.endswith("*"):
            return point_id.startswith(self.point_pattern[:-1])
        # 精确匹配
        return point_id == self.point_pattern

    def _match_range(self, point_id: str) -> bool:
        """处理 'GAS-01~20' 范围匹配"""
        try:
            prefix, high_str = self.point_pattern.split("~")
            # 提取数字前缀部分, e.g. "GAS-0" from "GAS-01"
            alpha_part = prefix.rstrip("0123456789")
            low_str = prefix[len(alpha_part) :]
            if not point_id.startswith(alpha_part):
                return False
            num_str = point_id[len(alpha_part) :]
            num_str = "".join(ch for ch in num_str if ch.isdigit())
            low, high = int(low_str), int(high_str)
            num = int(num_str) if num_str else 0
            return low <= num <= high
        except (ValueError, IndexError):
            return False

    @staticmethod
    def _match_single(point_id: str, pattern: str) -> bool:
        pattern = pattern.strip()
        if pattern.endswith("*"):
            return point_id.startswith(pattern[:-1])
        return point_id == pattern

    def get_point_prefix(self) -> str:
        """获取点位前缀用于分组统计"""
        return self.point_pattern.replace("~", "-").split("-")[0] if "-" in self.point_pattern else self.point_pattern


@dataclass
class SafetyEvent:
    """安全事件"""

    event_id: str
    rule_id: str
    rule_name: str
    level: SafetyLevel
    device_id: str
    point_id: str
    value: float
    threshold_value: float
    message: str
    action: str
    timestamp: datetime

    status: str = "pending"  # pending / acknowledged / resolved / timeout
    acknowledged_by: str = ""
    resolved_at: Optional[datetime] = None


# ──────────────────────────────────────────────
# 26 条安全规则定义
# ──────────────────────────────────────────────

L1_RULES: List[SafetyRule] = [
    SafetyRule(
        rule_id="RULE-101",
        name="可燃气体预警",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="GAS-01~20",
        description="GAS-01~20 > 预警阈值",
        action="启动通风+声光报警",
        threshold_high=20.0,
        verification_method="季度测试",
    ),
    SafetyRule(
        rule_id="RULE-102",
        name="TDLAS泄漏报警",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="TDL-01~06",
        description="TDL-01~06 > 20%LEL",
        action="自动关上游阀+报警",
        threshold_high=20.0,
        verification_method="季度测试",
    ),
    SafetyRule(
        rule_id="RULE-103",
        name="储罐液位高高报",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="LI-501",
        description="LI-501 > 90%",
        action="关进料阀+开排液阀",
        threshold_high_high=90.0,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="RULE-104",
        name="压缩机振动报警",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="VIB-201~212",
        description="VIB-201~212 > 7.1mm/s",
        action="记录+增采集频率至1kHz",
        threshold_high_high=7.1,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="RULE-105",
        name="烟火检测",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="VIS-07",
        description="VIS-07(%) > 85%",
        action="启动消防联动+停周边设备",
        threshold_high_high=85.0,
        verification_method="季度演练",
    ),
    SafetyRule(
        rule_id="RULE-106",
        name="吸附器切换时序",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="ACT-301",
        description="ACT-301 执行中",
        action="DCS自动6步时序",
        threshold_high=1.0,
        verification_method="每次验证",
    ),
    SafetyRule(
        rule_id="RULE-107",
        name="安全违规",
        level=SafetyLevel.L1_AUTO,
        rule_type=RuleType.THRESHOLD,
        point_pattern="VIS-08",
        description="VIS-08(%) > 90%",
        action="语音警告+记录+推送",
        threshold_high_high=90.0,
        verification_method="实时",
    ),
]

L2_RULES: List[SafetyRule] = [
    SafetyRule(
        rule_id="RULE-201",
        name="振动持续超限",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.TREND,
        point_pattern="VIB-201~212",
        description="VIB-201~212 连续3次超 4.5mm/s",
        action="建议停压缩机检查",
        threshold_high=4.5,
        consecutive_count=3,
        timeout_seconds=30,
        default_action_on_timeout="默认停机",
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="RULE-202",
        name="油液磨屑超标",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.THRESHOLD,
        point_pattern="OIL-01",
        description="OIL-01 > 200ppm",
        action="建议更换润滑油+检查轴承",
        threshold_high=200.0,
        timeout_seconds=30,
        default_action_on_timeout="默认产生工单",
    ),
    SafetyRule(
        rule_id="RULE-203",
        name="声纹异常",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.THRESHOLD,
        point_pattern="ACO-201~206",
        description="ACO-201~206 高频能量 > 20%",
        action="密封泄漏核查",
        threshold_high=20.0,
        timeout_seconds=30,
        default_action_on_timeout="默认派机器人",
    ),
    SafetyRule(
        rule_id="RULE-204",
        name="仪表偏差",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.THRESHOLD,
        point_pattern="VIS-01",
        description="VIS-01 与 DCS 差 > 10%",
        action="仪表校验",
        threshold_high=10.0,
        timeout_seconds=30,
        default_action_on_timeout="默认产校验工单",
    ),
    SafetyRule(
        rule_id="RULE-205",
        name="螺栓松动",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.THRESHOLD,
        point_pattern="BOLT-01~22",
        description="BOLT-01~22 预紧力 < 80%",
        action="法兰紧固",
        threshold_low=80.0,
        timeout_seconds=30,
        default_action_on_timeout="默认产维修工单",
    ),
    SafetyRule(
        rule_id="RULE-206",
        name="压力波动预警",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.RATE_OF_CHANGE,
        point_pattern="PI-201",
        description="PI-201 波动 > 10%/min",
        action="可能喘振，建议降载",
        rate_limit=10.0,
        timeout_seconds=30,
        default_action_on_timeout="默认启动防喘振",
    ),
    SafetyRule(
        rule_id="RULE-207",
        name="跑冒滴漏疑点",
        level=SafetyLevel.L2_REMOTE,
        rule_type=RuleType.THRESHOLD,
        point_pattern="VIS-03",
        description="VIS-03 + TDL 无泄漏",
        action="可能是水或旧油，派机器人复核",
        threshold_high=1.0,
        timeout_seconds=30,
        default_action_on_timeout="默认派机器人复核",
    ),
]

L3_RULES: List[SafetyRule] = [
    SafetyRule(
        rule_id="RULE-301",
        name="ESD触发",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="ESD-01~07",
        description="ESD-01~07 任一触发",
        action="启动ESD+数孪推演",
        threshold_high=1.0,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="RULE-302",
        name="气体+TDLAS双重报警",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.COMBINATION,
        point_pattern="GAS-01~20,TDL-01~06",
        description="GAS + TDL 同时报警",
        action="泄漏应急+疏散",
        threshold_high=20.0,
        verification_method="季度演练",
    ),
    SafetyRule(
        rule_id="RULE-303",
        name="烟火+红外双重触发",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.COMBINATION,
        point_pattern="VIS-07,IR-*",
        description="VIS-07 + 红外超温同时触发",
        action="消防应急+停车+报火警",
        threshold_high=85.0,
        verification_method="季度演练",
    ),
    SafetyRule(
        rule_id="RULE-304",
        name="全网断电",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.COMBINATION,
        point_pattern="PWR-*",
        description="断电 > 10s + UPS 启动",
        action="断电应急+保关键负载",
        threshold_low=0.0,
        verification_method="半年演练",
    ),
    SafetyRule(
        rule_id="RULE-305",
        name="机器人+传感器双重失效",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.COMBINATION,
        point_pattern="ROB-*,SEN-*",
        description="ROB故障 + 传感器失效",
        action="人工干预+派机动维修",
        threshold_high=1.0,
        verification_method="半年演练",
    ),
]

ESD_RULES: List[SafetyRule] = [
    SafetyRule(
        rule_id="ESD-01",
        name="压缩机振动高高报",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="VIB-201~212",
        description="VIB > 11.1mm/s",
        action="紧急停机+放空",
        threshold_high_high=11.1,
        sil_level=2,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="ESD-02",
        name="压缩机轴位移超限",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="SI-201",
        description="SI-201 > 0.7mm",
        action="紧急停机",
        threshold_high_high=0.7,
        sil_level=2,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="ESD-03",
        name="压缩机出口超压",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="PI-201",
        description="PI-201 > 4.2MPa",
        action="防喘振阀全开+停机",
        threshold_high_high=4.2,
        sil_level=2,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="ESD-04",
        name="脱甲烷塔超压",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="PI-403",
        description="PI-403 > 1.6MPa",
        action="开安全阀+关进料",
        threshold_high_high=1.6,
        sil_level=2,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="ESD-05",
        name="储罐液位高高高",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="LI-501",
        description="LI-501 > 95%",
        action="关进料阀+开切水阀",
        threshold_high_high=95.0,
        sil_level=2,
        verification_method="月度测试",
    ),
    SafetyRule(
        rule_id="ESD-06",
        name="可燃气体联锁级",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="GAS-01~20",
        description="GAS >= 50%LEL",
        action="自动关上游阀门+通风",
        threshold_high_high=50.0,
        sil_level=1,
        verification_method="季度测试",
    ),
    SafetyRule(
        rule_id="ESD-07",
        name="火灾探测器触发",
        level=SafetyLevel.L3_EMERGENCY,
        rule_type=RuleType.ESD,
        point_pattern="FIRE-01",
        description="火警=1",
        action="启动消防+停装置",
        threshold_high=0.5,
        sil_level=2,
        verification_method="月度测试",
    ),
]

# 全量规则索引
ALL_RULES: Dict[str, SafetyRule] = {}
for _r in L1_RULES + L2_RULES + L3_RULES + ESD_RULES:
    ALL_RULES[_r.rule_id] = _r


# ──────────────────────────────────────────────
# 安全判据管道
# ──────────────────────────────────────────────


class SafetyPipeline:
    """安全判据管道

    接收采集数据点，逐点匹配规则，触发安全事件。
    与 AlarmEngine 并列工作——AlarmEngine 负责 P0/P1 通用阈值告警，
    SafetyPipeline 负责 L1/L2/L3 安全判据 + ESD 关断。

    使用方式：
        from .services.safety_rules import SafetyPipeline

        safety = SafetyPipeline(pg_store)
        collector.on_data(safety.evaluate)         # 挂入采集回调链
        safety.start_timeout_checker()             # 启动 L2 超时检查线程
    """

    def __init__(
        self,
        pg_store: Optional[PostgresStore] = None,
        rules: Optional[Dict[str, SafetyRule]] = None,
    ):
        self.pg = pg_store
        self.rules = rules or ALL_RULES

        # -- 运行时状态 --
        self._active_events: Dict[str, SafetyEvent] = {}  # event_id → event
        self._history: List[SafetyEvent] = []  # 全量历史
        self._last_values: Dict[str, float] = {}  # point_id → 上一次值
        self._consecutive_counts: Dict[str, int] = {}  # "{dev}:{pid}:{rid}" → 计数
        self._dedup: Dict[str, datetime] = {}  # "{dev}:{rid}" → 上次触发时间
        self._comb_state: Dict[str, Set[str]] = {}  # rid → 已触发点集合

        # -- 回调 --
        self._callbacks: List[Callable] = []

    # ── 回调注册 ──

    def on_safety_event(self, callback: Callable[[SafetyEvent], Any]):
        """注册安全事件回调"""
        self._callbacks.append(callback)

    # ── 主要评估入口（与 AlarmEngine.evaluate 签名一致） ──

    async def evaluate(
        self, device_id: str, points: List[PointValue]
    ) -> List[SafetyEvent]:
        """评估一批采集值，返回本次新触发的安全事件

        签名与 AlarmEngine.evaluate(device_id, points) 一致，
        可直接挂入 collector.on_data() 回调链。
        """
        triggered: List[SafetyEvent] = []

        for pv in points:
            if not isinstance(pv.value, (int, float)):
                continue

            event = self._evaluate_point(device_id, pv)
            if event:
                triggered.append(event)
                await self._persist_event(event)
                self._notify_callbacks(event)

        return triggered

    # ── 单点评估 ──

    def _evaluate_point(self, device_id: str, pv: PointValue) -> Optional[SafetyEvent]:
        """对单点执行全量规则匹配"""
        pid = pv.point_id
        val = pv.value

        prev = self._last_values.get(pid, val)
        self._last_values[pid] = val

        for rule in self.rules.values():
            # 点位不匹配跳过
            if not rule.matches_point(pid):
                continue

            # 5 分钟去重窗口
            dk = f"{device_id}:{rule.rule_id}"
            last = self._dedup.get(dk)
            if last and (datetime.now() - last).total_seconds() < 300:
                continue

            event = self._check_rule(rule, device_id, pv, prev)
            if event:
                self._dedup[dk] = datetime.now()
                self._active_events[event.event_id] = event
                self._history.append(event)
                return event

        return None

    def _check_rule(
        self, rule: SafetyRule, device_id: str, pv: PointValue, prev: float
    ) -> Optional[SafetyEvent]:
        """根据规则类型分发检查"""
        pid = pv.point_id
        val = pv.value
        ck = f"{device_id}:{pid}:{rule.rule_id}"
        consec = self._consecutive_counts.get(ck, 0)

        if rule.rule_type in (RuleType.THRESHOLD, RuleType.ESD):
            return self._check_threshold(rule, device_id, pv)

        if rule.rule_type == RuleType.TREND:
            return self._check_trend(rule, device_id, pv, prev, consec, ck)

        if rule.rule_type == RuleType.RATE_OF_CHANGE:
            return self._check_rate(rule, device_id, pv, prev)

        if rule.rule_type == RuleType.COMBINATION:
            return self._check_combination(rule, device_id, pv)

        return None

    # ── 规则检查实现 ──

    def _check_threshold(
        self, rule: SafetyRule, device_id: str, pv: PointValue
    ) -> Optional[SafetyEvent]:
        """阈值检查：高高报 → 高报 → 低低报 → 低报"""
        val = pv.value
        name = pv.point_name or pv.point_id

        if rule.threshold_high_high is not None and val > rule.threshold_high_high:
            return self._build_event(
                rule, device_id, pv, rule.threshold_high_high,
                f"{name} {val:.1f} > 高高报 {rule.threshold_high_high}",
            )
        if rule.threshold_high is not None and val > rule.threshold_high:
            return self._build_event(
                rule, device_id, pv, rule.threshold_high,
                f"{name} {val:.1f} > 高报 {rule.threshold_high}",
            )
        if rule.threshold_low_low is not None and val < rule.threshold_low_low:
            return self._build_event(
                rule, device_id, pv, rule.threshold_low_low,
                f"{name} {val:.1f} < 低低报 {rule.threshold_low_low}",
            )
        if rule.threshold_low is not None and val < rule.threshold_low:
            return self._build_event(
                rule, device_id, pv, rule.threshold_low,
                f"{name} {val:.1f} < 低报 {rule.threshold_low}",
            )
        return None

    def _check_trend(
        self, rule: SafetyRule, device_id: str,
        pv: PointValue, prev: float, consec: int, ck: str,
    ) -> Optional[SafetyEvent]:
        """趋势检查：连续 N 次超阈值"""
        val = pv.value
        name = pv.point_name or pv.point_id

        if rule.threshold_high is not None and val > rule.threshold_high:
            if val > prev:
                self._consecutive_counts[ck] = consec + 1
            if consec + 1 >= rule.consecutive_count:
                self._consecutive_counts[ck] = 0
                return self._build_event(
                    rule, device_id, pv, rule.threshold_high,
                    f"{name} 连续{rule.consecutive_count}次超 {rule.threshold_high} "
                    f"(当前{val:.1f})",
                )
        else:
            self._consecutive_counts[ck] = 0

        return None

    def _check_rate(
        self, rule: SafetyRule, device_id: str,
        pv: PointValue, prev: float,
    ) -> Optional[SafetyEvent]:
        """变化率检查：Δ/Δt %"""
        if prev <= 0:
            return None
        rate = abs(pv.value - prev) / prev * 100
        if rule.rate_limit is not None and rate > rule.rate_limit:
            return self._build_event(
                rule, device_id, pv, rule.rate_limit,
                f"{pv.point_name or pv.point_id} 变化率 {rate:.1f}%/min "
                f"> {rule.rate_limit}%/min",
            )
        return None

    def _check_combination(
        self, rule: SafetyRule, device_id: str, pv: PointValue
    ) -> Optional[SafetyEvent]:
        """组合检查：多点全部触发才生效"""
        pid = pv.point_id
        rid = rule.rule_id
        val = pv.value

        if rid not in self._comb_state:
            self._comb_state[rid] = set()

        # 判断当前点是否达到触发条件
        triggered = False
        if rule.threshold_high is not None and val > rule.threshold_high:
            triggered = True
        elif rule.threshold_low is not None and val < rule.threshold_low:
            triggered = True
        if triggered:
            self._comb_state[rid].add(pid)
        else:
            self._comb_state[rid].discard(pid)

        # 期望的点位集合
        expected = self._combination_points(rule.point_pattern)
        if expected and self._comb_state[rid] == expected:
            self._comb_state[rid] = set()  # 消费后重置
            return self._build_event(
                rule, device_id, pv, rule.threshold_high or 0,
                f"{rule.name}: 多点联合触发 ({rule.description})",
            )
        return None

    @staticmethod
    def _combination_points(pattern: str) -> Set[str]:
        """从逗号分隔模式提取点位前缀集合"""
        parts = [p.strip().rstrip("-*") for p in pattern.split(",")]
        return set(parts) if len(parts) > 1 else set()

    # ── 事件构建 ──

    def _build_event(
        self, rule: SafetyRule, device_id: str,
        pv: PointValue, threshold: float, msg: str,
    ) -> SafetyEvent:
        return SafetyEvent(
            event_id=f"SAFE-{uuid.uuid4().hex[:8].upper()}",
            rule_id=rule.rule_id,
            rule_name=rule.name,
            level=rule.level,
            device_id=device_id,
            point_id=pv.point_id,
            value=pv.value if isinstance(pv.value, (int, float)) else 0.0,
            threshold_value=threshold,
            message=msg,
            action=rule.action,
            timestamp=datetime.now(),
        )

    # ── 持久化 ──

    async def _persist_event(self, event: SafetyEvent):
        """通过 pg_store 写入告警记录"""
        if not self.pg:
            return
        try:
            await self.pg.create_alarm({
                "alarm_id": event.event_id,
                "device_id": event.device_id,
                "point_id": event.point_id,
                "alarm_type": f"safety_{event.level.value}",
                "alarm_level": event.level.value,
                "alarm_msg": event.message,
                "alarm_value": event.value,
                "threshold_value": event.threshold_value,
                "rule_id": event.rule_id,
            })
            logger.info("[safety] %s %s -> %s", event.event_id, event.message, event.action)
        except Exception as exc:
            logger.error("[safety] persist fail %s: %s", event.event_id, exc)

    # ── 回调通知 ──

    def _notify_callbacks(self, event: SafetyEvent):
        for cb in self._callbacks:
            try:
                cb(event)
            except Exception as exc:
                logger.warning("[safety] callback error: %s", exc)

    # ── L2 远程确认 ──

    async def acknowledge(self, event_id: str, operator: str = "system") -> bool:
        """远程确认 L2 安全事件"""
        event = self._active_events.get(event_id)
        if not event:
            return False
        event.status = "acknowledged"
        event.acknowledged_by = operator
        if self.pg:
            await self.pg.update_alarm_status(event_id, "confirmed", operator)
        logger.info("[safety] %s acknowledged by %s", event_id, operator)
        return True

    # ── 事件清除 ──

    async def resolve_event(self, event_id: str, operator: str = "system") -> bool:
        """清除安全事件"""
        event = self._active_events.pop(event_id, None)
        if not event:
            return False
        event.status = "resolved"
        event.resolved_at = datetime.now()
        if self.pg:
            await self.pg.update_alarm_status(event_id, "resolved", operator)
        logger.info("[safety] %s resolved by %s", event_id, operator)
        return True

    # ── ESD 强制触发 ──

    async def trigger_esd(self, esd_rule_id: str, device_id: str) -> Optional[SafetyEvent]:
        """强制触发 ESD 关断（供人工/上位机调用）"""
        rule = self.rules.get(esd_rule_id)
        if not rule or rule.rule_type != RuleType.ESD:
            logger.warning("[safety] ESD rule %s not found or not ESD type", esd_rule_id)
            return None

        event = SafetyEvent(
            event_id=f"ESD-{uuid.uuid4().hex[:8].upper()}",
            rule_id=rule.rule_id,
            rule_name=rule.name,
            level=SafetyLevel.L3_EMERGENCY,
            device_id=device_id,
            point_id="ESD",
            value=1.0,
            threshold_value=0.0,
            message=f"ESD手动触发: {rule.action}",
            action=rule.action,
            timestamp=datetime.now(),
        )
        self._active_events[event.event_id] = event
        self._history.append(event)
        await self._persist_event(event)
        self._notify_callbacks(event)
        logger.warning("[safety] ESD TRIGGER %s on %s: %s", esd_rule_id, device_id, rule.action)
        return event

    # ── L2 超时监控 ──

    def start_timeout_checker(self, interval: float = 5.0):
        """启动 L2 超时后台线程，默认每 5s 轮询"""

        def _loop():
            while True:
                time.sleep(interval)
                now = datetime.now()
                to_remove: List[str] = []
                for eid, ev in self._active_events.items():
                    if ev.level == SafetyLevel.L2_REMOTE and ev.status == "pending":
                        rule = self.rules.get(ev.rule_id)
                        timeout = rule.timeout_seconds if rule else 30
                        if (now - ev.timestamp).total_seconds() >= timeout:
                            action = rule.default_action_on_timeout if rule else "默认动作"
                            ev.status = "timeout"
                            ev.resolved_at = now
                            logger.warning(
                                "[safety] L2 timeout %s (%ds) -> %s",
                                ev.rule_id, timeout, action,
                            )
                            to_remove.append(eid)
                for eid in to_remove:
                    self._active_events.pop(eid, None)

        thread = threading.Thread(target=_loop, daemon=True, name="safety-timeout")
        thread.start()
        logger.info("[safety] L2 timeout checker started (interval=%ss)", interval)

    # ── 查询接口 ──

    def stats(self) -> Dict[str, Any]:
        """引擎统计"""
        by_level: Dict[str, int] = {}
        for ev in self._history:
            lv = ev.level.value
            by_level[lv] = by_level.get(lv, 0) + 1
        return {
            "total_events": len(self._history),
            "active": len(self._active_events),
            "by_level": by_level,
            "rules": len(self.rules),
            "tracked_points": len(self._last_values),
        }

    def get_active_events(self, level: Optional[SafetyLevel] = None) -> List[SafetyEvent]:
        if level:
            return [e for e in self._active_events.values() if e.level == level]
        return list(self._active_events.values())

    def get_rule(self, rule_id: str) -> Optional[SafetyRule]:
        return self.rules.get(rule_id)

    def list_rules(self, level: Optional[SafetyLevel] = None) -> List[SafetyRule]:
        if level:
            return [r for r in self.rules.values() if r.level == level]
        return list(self.rules.values())
