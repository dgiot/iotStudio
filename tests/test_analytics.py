"""时序价值分析纯函数单测（不依赖 live TDengine）。"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "sdk"))
from iotstudio_sdk.analytics import anomalies, forecast, value_report  # noqa: E402


def test_anomalies_flags_outliers():
    series = [{"ts": i, "v": 20.0} for i in range(20)]
    series[10] = {"ts": 10, "v": 200.0}  # 明显异常（远离均值，即使撑大 std 仍超 3σ）
    r = anomalies(series)
    assert r["count"] == 1
    assert r["indices"] == [10]


def test_anomalies_noise_is_clean():
    series = [{"ts": i, "v": 20.0 + (i % 3) * 0.1} for i in range(30)]
    r = anomalies(series, band=3.0)
    assert r["count"] == 0


def test_anomalies_empty_and_single():
    assert anomalies([])["count"] == 0
    assert anomalies([{"ts": 0, "v": 1.0}])["count"] == 0


def test_forecast_naive_carries_last():
    series = [{"ts": i * 10, "v": 20.0} for i in range(5)]
    out = forecast(series, horizon=3, method="naive")
    assert len(out) == 3
    assert out[0]["v"] == 20.0
    assert out[-1]["t"] == 40 + 10 * 3


def test_forecast_linear_trends():
    series = [{"ts": i, "v": float(i)} for i in range(5)]  # 0..4
    out = forecast(series, horizon=2, method="linear")
    assert len(out) == 2
    assert out[0]["v"] == 5.0  # 线性外推下一步


def test_value_report_quantifies_assumed_loss():
    series = [{"ts": i, "v": 20.0} for i in range(10)]
    series[3] = {"ts": 3, "v": 999.0}
    r = value_report(series, band=3.0, loss_per_incident=5000.0)
    assert r["metric"]["anomalies"] == 1
    assert r["value"] == 5000.0
    assert "assumption" in r and "5000.0" in r["assumption"]


def test_forecast_handles_iso_ts_strings():
    # TDengine 返回的 ts 是 ISO 字符串，不得触发 str-str 相减
    series = [{"ts": f"2026-09-10T07:11:3{i}.764Z", "v": 20.0 + i}
              for i in range(5)]
    out = forecast(series, horizon=2, method="linear")
    assert len(out) == 2
    assert all(isinstance(p["t"], float) for p in out)
