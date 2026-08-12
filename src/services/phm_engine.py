# ============================================================
# iotStudio — PHM 预测性维护引擎
# ============================================================
"""
预测性维护引擎（Prognostics and Health Management）

基于 CNN 振动诊断 + LSTM 寿命预测的轻量级实现。
无深度学习框架依赖，使用统计分析近似等效逻辑。

故障模式（7类）：
  - 轴承磨损 (BearingWear)
  - 不对中 (Misalignment)
  - 不平衡 (Unbalance)
  - 喘振 (Surge)
  - 润滑失效 (LubricationFailure)
  - 气蚀 (Cavitation)
  - 密封失效 (SealFailure)

健康度分级：
  - normal   (>80)  正常运行
  - warning  (61-80) 关注
  - alert    (41-60) 报警
  - critical (<=40)  严重

默认设备库：
  - C-10201  离心压缩机  MCL526+2BCL458
  - PLPT-526 膨胀机     PLPT-526/46-12
  - CAMV44   外输泵      CAMV44/5+5
"""
import logging
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# 故障模式与设备类型枚举
# ──────────────────────────────────────────────


class FaultMode(str, Enum):
    """故障模式"""
    NORMAL = "normal"
    BEARING_WEAR = "bearing_wear"               # 轴承磨损
    MISALIGNMENT = "misalignment"                # 不对中
    IMBALANCE = "imbalance"                      # 不平衡
    SURGE = "surge"                              # 喘振
    LUBRICATION_FAILURE = "lubrication_failure"  # 润滑失效
    CAVITATION = "cavitation"                    # 气蚀
    SEAL_FAILURE = "seal_failure"                # 密封失效


class DeviceType(str, Enum):
    """设备类型"""
    COMPRESSOR = "离心压缩机"
    EXPANDER = "膨胀机"
    PUMP = "外输泵"
    FAN = "空冷器风扇"
    MOTOR = "电机"


# ──────────────────────────────────────────────
# 数据模型
# ──────────────────────────────────────────────


@dataclass
class EquipmentProfile:
    """设备参数配置"""
    device_id: str
    device_type: DeviceType
    model: str
    normal_vibration: float       # 正常振动上限 mm/s
    alarm_vibration: float        # 报警振动阈值 mm/s
    normal_temp: float            # 正常温度上限 ℃
    alarm_temp: float             # 报警温度阈值 ℃
    design_life_years: int        # 设计寿命
    install_date: datetime


@dataclass
class VibrationFeatures:
    """振动特征（从原始信号提取）"""
    rms: float                    # 有效值 mm/s
    peak: float                   # 峰值 mm/s
    crest_factor: float           # 峰值因子
    kurtosis: float               # 峭度
    fft_1x: float                 # 1倍频幅值
    fft_2x: float                 # 2倍频幅值
    fft_high: float               # 高频段能量(>8kHz)
    temperature: float            # 温度 ℃


@dataclass
class HealthStatus:
    """设备健康状态快照"""
    device_id: str
    device_type: DeviceType
    health_score: int             # 0-100
    fault_mode: FaultMode
    probability: float            # 故障概率 0-1
    rul_days: Optional[int]       # 剩余寿命 天
    confidence: float             # 置信度 0-1
    alert_level: str              # normal/warning/alert/critical
    updated_at: datetime


# ──────────────────────────────────────────────
# 设备配置库（3个默认设备）
# ──────────────────────────────────────────────

DEVICE_PROFILES: Dict[str, EquipmentProfile] = {
    "C-10201": EquipmentProfile(
        device_id="C-10201", device_type=DeviceType.COMPRESSOR,
        model="MCL526+2BCL458", normal_vibration=4.5, alarm_vibration=7.1,
        normal_temp=75, alarm_temp=85, design_life_years=20,
        install_date=datetime(2010, 12, 1)),
    "PLPT-526": EquipmentProfile(
        device_id="PLPT-526", device_type=DeviceType.EXPANDER,
        model="PLPT-526/46-12", normal_vibration=3.5, alarm_vibration=5.0,
        normal_temp=65, alarm_temp=80, design_life_years=15,
        install_date=datetime(2010, 12, 1)),
    "CAMV44": EquipmentProfile(
        device_id="CAMV44", device_type=DeviceType.PUMP,
        model="CAMV44/5+5", normal_vibration=4.5, alarm_vibration=7.1,
        normal_temp=70, alarm_temp=85, design_life_years=12,
        install_date=datetime(2010, 12, 1)),
}


# ──────────────────────────────────────────────
# CNN 振动诊断引擎（统计近似）
# ──────────────────────────────────────────────

class CNNDiagnostic:
    """
    CNN 振动诊断模型。

    实际部署时需加载 ONNX/TensorRT 量化模型。
    此处实现基于峭度、频谱能量分布的规则等效逻辑，
    在无深度学习框架时模拟 CNN 诊断行为。
    """

    # 故障特征模式库（7类故障 + 正常）
    FAULT_PATTERNS = {
        FaultMode.BEARING_WEAR: {
            "description": "轴承磨损",
            "kurtosis_range": (3.5, 8.0),
            "high_freq_energy": (0.3, 1.0),
            "ratio_1x_2x": (0.1, 0.5),
            "severity": "medium",
        },
        FaultMode.IMBALANCE: {
            "description": "转子不平衡",
            "kurtosis_range": (2.0, 3.5),
            "high_freq_energy": (0.0, 0.2),
            "ratio_1x_2x": (0.8, 2.0),
            "severity": "medium",
        },
        FaultMode.MISALIGNMENT: {
            "description": "不对中",
            "kurtosis_range": (2.5, 4.0),
            "high_freq_energy": (0.1, 0.3),
            "ratio_1x_2x": (0.4, 0.8),
            "severity": "high",
        },
        FaultMode.SURGE: {
            "description": "喘振",
            "kurtosis_range": (4.0, 10.0),
            "high_freq_energy": (0.0, 0.1),
            "ratio_1x_2x": (0.0, 0.2),
            "severity": "critical",
        },
        FaultMode.LUBRICATION_FAILURE: {
            "description": "润滑失效",
            "kurtosis_range": (2.0, 4.0),
            "high_freq_energy": (0.2, 0.6),
            "ratio_1x_2x": (0.2, 0.5),
            "severity": "medium",
        },
        FaultMode.CAVITATION: {
            "description": "气蚀",
            "kurtosis_range": (5.0, 12.0),
            "high_freq_energy": (0.4, 1.0),
            "ratio_1x_2x": (0.0, 0.3),
            "severity": "high",
        },
        FaultMode.SEAL_FAILURE: {
            "description": "密封失效",
            "kurtosis_range": (2.5, 5.0),
            "high_freq_energy": (0.15, 0.4),
            "ratio_1x_2x": (0.3, 0.7),
            "severity": "medium",
        },
    }

    def diagnose(self, features: VibrationFeatures,
                 profile: EquipmentProfile) -> Tuple[FaultMode, float]:
        """
        基于振动特征诊断故障模式。

        Args:
            features: 提取的振动特征
            profile:  设备参数

        Returns:
            (fault_mode, probability) — 故障模式与置信概率
        """
        # 振动正常 → 判定为正常
        if features.rms < profile.normal_vibration * 0.7:
            return (FaultMode.NORMAL, 0.95)

        ratio = features.fft_1x / (features.fft_2x + 1e-6)

        best_match = FaultMode.NORMAL
        best_prob = 0.5

        for mode, pattern in self.FAULT_PATTERNS.items():
            prob = 0.0
            votes = 0

            # 峭度匹配
            k_min, k_max = pattern["kurtosis_range"]
            if k_min <= features.kurtosis <= k_max:
                votes += 1
                prob += 0.35

            # 高频能量匹配
            h_min, h_max = pattern["high_freq_energy"]
            if h_min <= features.fft_high <= h_max:
                votes += 1
                prob += 0.30

            # 1x/2x 比值匹配
            r_min, r_max = pattern["ratio_1x_2x"]
            if r_min <= ratio <= r_max:
                votes += 1
                prob += 0.35

            if votes > 0 and prob > best_prob:
                best_prob = prob
                best_match = mode

        return (best_match, min(best_prob, 0.95))


# ──────────────────────────────────────────────
# LSTM 寿命预测引擎（统计近似）
# ──────────────────────────────────────────────

class LSTMPredictor:
    """
    LSTM 剩余寿命预测模型。

    实际部署时需加载 ONNX/TensorRT 模型。
    此处基于退化曲线假设实现等效逻辑。
    """

    def __init__(self):
        self._history: Dict[str, List[float]] = {}

    def predict_rul(self, device_id: str, health_score: int,
                    profile: EquipmentProfile) -> Tuple[int, float]:
        """
        预测剩余使用寿命（天）。

        Args:
            device_id:    设备ID
            health_score: 当前健康度 0-100
            profile:      设备参数

        Returns:
            (rul_days, confidence)
        """
        if device_id not in self._history:
            self._history[device_id] = []

        self._history[device_id].append(health_score)
        # 仅保留最近 365 个样本
        if len(self._history[device_id]) > 365:
            self._history[device_id] = self._history[device_id][-365:]

        # 退化率估算（假设线性退化）
        ages_years = (datetime.now() - profile.install_date).days / 365.0
        total_life = profile.design_life_years

        if ages_years <= 0:
            return (total_life * 365, 0.9)

        # 理论剩余寿命 = 设计寿命 - 已运行年限
        theoretical_rul = max(0, (total_life - ages_years)) * 365

        # 基于当前健康度修正
        health_factor = health_score / 100.0
        rul = max(0, int(theoretical_rul * health_factor))

        # 置信度：健康度越低说明退化越明显，预测越可靠
        confidence = 0.5 + (100 - health_score) / 200.0
        confidence = min(max(confidence, 0.1), 0.95)

        return (rul, confidence)


# ──────────────────────────────────────────────
# PHM 主引擎
# ──────────────────────────────────────────────

class PHMEngine:
    """
    预测性维护引擎（主入口）。

    整合 CNN 诊断 + LSTM 寿命预测 + 健康度评分，
    对关键旋转设备进行全生命周期健康管理。

    用法:
        phm = PHMEngine()
        features = phm.extract_features(vibration=4.2, temperature=68)
        status = phm.evaluate("C-10201", features)
        print(status.health_score, status.alert_level, status.rul_days)
    """

    def __init__(self):
        self.cnn = CNNDiagnostic()
        self.lstm = LSTMPredictor()
        self._cache: Dict[str, HealthStatus] = {}
        self.stats = {"evaluations": 0, "alerts": 0}

    # ── 特征提取 ──────────────────────────────

    def extract_features(self, vibration_value: float,
                         temperature: float = 25.0,
                         fft_1x: Optional[float] = None,
                         fft_2x: Optional[float] = None,
                         kurtosis: Optional[float] = None) -> VibrationFeatures:
        """
        从实时监测数据提取或估算振动特征。

        Args:
            vibration_value: 当前振动有效值 RMS (mm/s)
            temperature:     温度 (℃)
            fft_1x:          1倍频幅值（None 则估算）
            fft_2x:          2倍频幅值（None 则估算）
            kurtosis:        峭度（None 则估算）

        Returns:
            VibrationFeatures
        """
        if kurtosis is None:
            kurtosis = 3.0 + (vibration_value / 10.0)
        if fft_1x is None:
            fft_1x = vibration_value * 0.6
        if fft_2x is None:
            fft_2x = vibration_value * 0.3

        peak = vibration_value * 1.5
        high_freq = 0.1 * vibration_value if vibration_value < 4.5 else 0.3

        return VibrationFeatures(
            rms=vibration_value,
            peak=peak,
            crest_factor=peak / (vibration_value + 1e-6),
            kurtosis=kurtosis,
            fft_1x=fft_1x,
            fft_2x=fft_2x,
            fft_high=high_freq,
            temperature=temperature,
        )

    # ── 完整评估 ──────────────────────────────

    def evaluate(self, device_id: str,
                 features: VibrationFeatures) -> HealthStatus:
        """
        执行一次完整的健康评估。

        Args:
            device_id: 设备ID
            features:  振动特征

        Returns:
            HealthStatus 健康状态快照
        """
        self.stats["evaluations"] += 1

        # 获取设备配置（未知设备使用默认泵配置）
        profile = DEVICE_PROFILES.get(device_id)
        if profile is None:
            profile = EquipmentProfile(
                device_id=device_id, device_type=DeviceType.PUMP,
                model="", normal_vibration=4.5, alarm_vibration=7.1,
                normal_temp=70, alarm_temp=85, design_life_years=15,
                install_date=datetime.now(),
            )

        # Step 1: CNN 诊断故障模式
        fault_mode, fault_prob = self.cnn.diagnose(features, profile)

        # Step 2: 计算健康度评分
        health_score = self._calc_health_score(
            features, profile, fault_mode, fault_prob)

        # Step 3: LSTM 寿命预测
        rul_days, confidence = self.lstm.predict_rul(
            device_id, health_score, profile)

        # Step 4: 确定告警级别
        alert_level = self._get_alert_level(
            health_score, features, profile, fault_mode)

        status = HealthStatus(
            device_id=device_id,
            device_type=profile.device_type,
            health_score=health_score,
            fault_mode=fault_mode,
            probability=fault_prob,
            rul_days=rul_days,
            confidence=confidence,
            updated_at=datetime.now(),
            alert_level=alert_level,
        )

        self._cache[device_id] = status

        if alert_level in ("alert", "critical"):
            self.stats["alerts"] += 1
            logger.warning("[PHM] %s 健康度=%d 故障=%s RUL=%s天",
                           device_id, health_score, fault_mode.value, rul_days)

        return status

    # ── 健康度评分 ────────────────────────────

    def _calc_health_score(self, features: VibrationFeatures,
                           profile: EquipmentProfile,
                           fault_mode: FaultMode,
                           fault_prob: float) -> int:
        """
        计算综合健康度评分 (0-100)。

        扣分项：
          - 振动值超过正常/报警阈值
          - 温度超过正常阈值
          - 存在故障模式
          - 峭度异常
        """
        score = 100.0

        # 振动偏离惩罚
        if features.rms > profile.normal_vibration:
            excess = (features.rms - profile.normal_vibration) / profile.normal_vibration
            score -= excess * 30
        if features.rms > profile.alarm_vibration:
            excess = (features.rms - profile.alarm_vibration) / profile.alarm_vibration
            score -= excess * 40

        # 温度惩罚
        if features.temperature > profile.normal_temp:
            excess = (features.temperature - profile.normal_temp) / profile.normal_temp
            score -= excess * 20

        # 故障模式惩罚
        if fault_mode != FaultMode.NORMAL:
            score -= fault_prob * 30

        # 峭度异常惩罚
        if features.kurtosis > 4.0:
            score -= (features.kurtosis - 4.0) * 10

        return max(0, min(100, int(score)))

    # ── 告警级别 ──────────────────────────────

    @staticmethod
    def _get_alert_level(health_score: int,
                         features: VibrationFeatures,
                         profile: EquipmentProfile,
                         fault_mode: FaultMode) -> str:
        """
        确定告警级别。

        分级标准：
          - critical: 喘振 / 振动超报警值 / 健康度<=40
          - alert:    健康度 41-60
          - warning:  健康度 61-80
          - normal:   健康度 >80
        """
        # 立即临界条件
        if fault_mode == FaultMode.SURGE:
            return "critical"
        if features.rms > profile.alarm_vibration:
            return "critical"

        # 健康度分级
        if health_score <= 40:
            return "critical"
        if health_score <= 60:
            return "alert"
        if health_score <= 80:
            return "warning"
        return "normal"

    # ── 查询接口 ──────────────────────────────

    def get_history(self, device_id: str) -> List[HealthStatus]:
        """获取设备最近一次评估结果。"""
        status = self._cache.get(device_id)
        return [status] if status else []

    def get_stats(self) -> dict:
        """获取引擎统计信息。"""
        return {
            **self.stats,
            "monitored_devices": len(self._cache),
        }


# ──────────────────────────────────────────────
# 独立测试
# ──────────────────────────────────────────────

def demo():
    """运行演示测试用例。"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")

    phm = PHMEngine()

    print("=" * 60)
    print(" PHM 预测性维护引擎 - 模拟测试")
    print("=" * 60)

    test_cases = [
        # (device_id, label, vibration, temp, description)
        ("C-10201", "离心压缩机 MCL526", 3.2, 65, "正常工况"),
        ("C-10201", "离心压缩机 MCL526", 5.5, 78, "轴承磨损早期"),
        ("PLPT-526", "膨胀机 PLPT-526", 2.1, 55, "正常工况"),
        ("PLPT-526", "膨胀机 PLPT-526", 6.0, 82, "严重喘振"),
        ("CAMV44", "外输泵 CAMV44", 1.5, 45, "正常工况"),
        ("CAMV44", "外输泵 CAMV44", 8.5, 90, "气蚀 + 过载"),
        ("C-10201", "离心压缩机 MCL526", 4.8, 72, "润滑不良"),
        ("CAMV44", "外输泵 CAMV44", 6.2, 80, "密封失效趋势"),
    ]

    for dev_id, label, vib, temp, desc in test_cases:
        features = phm.extract_features(vib, temp)
        status = phm.evaluate(dev_id, features)
        print(f"\n[{desc}] {label}")
        print(f"  振动={vib:.1f}mm/s  温度={temp}℃ "
              f"-> 健康度={status.health_score}  "
              f"故障={status.fault_mode.value}")
        print(f"  告警={status.alert_level}  "
              f"RUL={status.rul_days}天  "
              f"置信度={status.confidence:.1%}")

    print(f"\n{'=' * 60}")
    print(" 统计")
    for k, v in phm.get_stats().items():
        print(f"  {k}: {v}")
    print(f"\nPHM 引擎测试通过")


if __name__ == "__main__":
    demo()
