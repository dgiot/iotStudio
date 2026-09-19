"""时序价值分析（P9-lite，TDgpt 式）：把「检测→量化」做成纯函数。

设计：分析逻辑与数据来源解耦——纯函数只吃 series（[{ts, v}, ...]），
SDK 的 IotStudio.td_anomaly/td_forecast 负责从 TDengine 拉数据再喂进来。
价值口径显式声明（loss_per_incident 是**假设参数**，不是编造的数字）。
"""
import math
import statistics
from datetime import datetime


def anomalies(series, band=3.0, key="v"):
    """3-sigma 异常检测：返回 {count, indices, mean, std, points}。

    series: [{ts, v, ...}, ...]（按时间升序）
    band: 偏离均值的标准差倍数（默认 3.0）
    """
    if not series:
        return {"count": 0, "indices": [], "mean": 0.0, "std": 0.0,
                "points": [], "series_len": 0}
    vals = [float(p.get(key, 0.0)) for p in series]
    mean = statistics.mean(vals)
    std = statistics.pstdev(vals) if len(vals) > 1 else 0.0
    threshold = band * std
    indices = [i for i, v in enumerate(vals)
               if abs(v - mean) > threshold] if threshold > 0 else []
    points = [series[i] for i in indices]
    return {"count": len(indices), "indices": indices, "mean": mean,
            "std": std, "points": points, "series_len": len(series)}


def forecast(series, horizon=5, method="naive", key="v"):
    """朴素/线性外推预测：返回未来 horizon 个 {t, v}。

    明确标注是**统计外推**，非模型预测——价值样本用，不做虚假精度。
    """
    if not series:
        return []
    vals = [float(p.get(key, 0.0)) for p in series]
    n = len(vals)
    if method == "linear" and n >= 2:
        xs = list(range(n))
        slope, intercept = _linreg(xs, vals)
        last_ts = _ts_of(series[-1])
        step = _step_of(series)
        return [{"t": last_ts + step * (i + 1),
                 "v": round(intercept + slope * (n + i), 4)}
                for i in range(horizon)]
    last = vals[-1]
    last_ts = _ts_of(series[-1])
    step = _step_of(series)
    return [{"t": last_ts + step * (i + 1), "v": last} for i in range(horizon)]


def value_report(series, band=3.0, loss_per_incident=1.0, key="v"):
    """把异常检测结果翻译成「可量化价值」。

    loss_per_incident: 每次异常 = 避免一次非计划停机的损失（**显式假设参数**）。
    返回可直接对外陈述的样本结论。
    """
    a = anomalies(series, band=band, key=key)
    n = a["count"]
    return {
        "problem": "测点偏离 3σ 的异常（非计划停机/质量风险信号）",
        "solution": f"对 {a['series_len']} 个采样点做 {band}σ 异常检测",
        "metric": {"points": a["series_len"], "anomalies": n,
                   "mean": round(a["mean"], 4), "std": round(a["std"], 4)},
        "value": round(n * loss_per_incident, 2),
        "unit": "元",
        "assumption": f"每次异常 ≈ 避免损失 {loss_per_incident} 元（假设参数）",
    }


def _ts_of(p):
    v = p.get("ts") or p.get("t") or p.get("time") or 0
    if isinstance(v, (int, float)):
        return float(v)
    if isinstance(v, str):
        try:
            # ISO-8601（带/不带毫秒、Z 后缀）→ epoch 毫秒
            s = v.replace("Z", "+00:00")
            return datetime.fromisoformat(s).timestamp() * 1000
        except Exception:
            return 0.0
    return 0.0


def _step_of(series):
    if len(series) < 2:
        return 1
    a, b = _ts_of(series[0]), _ts_of(series[1])
    return max(1.0, abs(b - a))


def _linreg(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = sum((x - mx) ** 2 for x in xs)
    slope = num / den if den else 0.0
    intercept = my - slope * mx
    return slope, intercept
