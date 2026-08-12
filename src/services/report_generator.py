#!/usr/bin/env python3
"""
自动报表生成器 — 日报/周报/月报
=================================
对标模块7: 运行状态综合监控与运维分析服务
输出: HTML报表（可打印/导出PDF） + JSON数据
"""
import os, json, time, sqlite3, statistics
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from typing import Optional

REPORT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "reports")


class ReportGenerator:
    """日报/周报/月报自动生成"""

    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                                   "data", "telemetry.db")
        self._db_path = db_path
        os.makedirs(REPORT_DIR, exist_ok=True)

    # ── 日报 ──

    def daily(self, date: str = None) -> dict:
        """生成日报
        date: YYYY-MM-DD，默认昨天
        """
        if date is None:
            date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
        return self._generate("日报", date, date)

    # ── 周报 ──

    def weekly(self, end_date: str = None) -> dict:
        """生成周报（最近7天）"""
        if end_date is None:
            end = datetime.now()
        else:
            end = datetime.fromisoformat(end_date)
        start = end - timedelta(days=7)
        return self._generate("周报", start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d"))

    # ── 月报 ──

    def monthly(self, year_month: str = None) -> dict:
        """生成月报"""
        if year_month is None:
            now = datetime.now()
            if now.month == 1:
                start = f"{now.year-1}-12-01"
                end = f"{now.year}-{now.month:02d}-{now.day:02d}"
            else:
                start = f"{now.year}-{now.month-1:02d}-01"
                end = now.strftime("%Y-%m-%d")
        else:
            y, m = year_month.split("-")
            start = f"{y}-{m}-01"
            end = f"{y}-{m}-31"
        return self._generate("月报", start, end)

    # ── 核心生成逻辑 ──

    def _generate(self, report_type: str, start: str, end: str) -> dict:
        data = self._collect_data(start, end)
        html = self._render_html(report_type, start, end, data)

        # 保存
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{report_type}_{start}_{end}_{ts}"
        html_path = os.path.join(REPORT_DIR, f"{filename}.html")
        json_path = os.path.join(REPORT_DIR, f"{filename}.json")

        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2, default=str)

        return {
            "report_type": report_type,
            "period": f"{start} ~ {end}",
            "data": data,
            "html": html_path,
            "json": json_path,
        }

    def _collect_data(self, start: str, end: str) -> dict:
        """从 telemetry.db 收集统计"""
        stats = {
            "period": f"{start} ~ {end}",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "summary": {},
            "devices": {},
            "alarms": {},
            "trends": {},
        }

        if not os.path.exists(self._db_path):
            stats["summary"]["note"] = "无遥测数据"
            return stats

        db = sqlite3.connect(self._db_path)
        db.row_factory = sqlite3.Row

        try:
            # 总采集量
            row = db.execute(
                "SELECT COUNT(*) as cnt FROM telemetry WHERE ts >= ? AND ts <= ?",
                (start, end)
            ).fetchone()
            total_points = row["cnt"] if row else 0

            # 活跃设备数
            row = db.execute(
                "SELECT COUNT(DISTINCT device_id) as cnt FROM telemetry WHERE ts >= ? AND ts <= ?",
                (start, end)
            ).fetchone()
            active_devices = row["cnt"] if row else 0

            # 按设备统计
            dev_rows = db.execute(
                "SELECT device_id, COUNT(*) as cnt, AVG(value) as avg_val, "
                "MIN(value) as min_val, MAX(value) as max_val "
                "FROM telemetry WHERE ts >= ? AND ts <= ? "
                "GROUP BY device_id ORDER BY cnt DESC LIMIT 20",
                (start, end)
            ).fetchall()

            device_stats = {}
            for r in dev_rows:
                device_stats[r["device_id"]] = {
                    "points": r["cnt"],
                    "avg_value": round(r["avg_val"], 4) if r["avg_val"] else 0,
                    "min_value": round(r["min_val"], 4) if r["min_val"] else 0,
                    "max_value": round(r["max_val"], 4) if r["max_val"] else 0,
                }

            # 每日趋势
            trend_rows = db.execute(
                "SELECT DATE(ts) as day, COUNT(*) as cnt "
                "FROM telemetry WHERE ts >= ? AND ts <= ? "
                "GROUP BY DATE(ts) ORDER BY day",
                (start, end)
            ).fetchall()
            trends = {r["day"]: r["cnt"] for r in trend_rows}

            stats["summary"] = {
                "total_points": total_points,
                "active_devices": active_devices,
                "avg_daily_points": total_points / max(1, len(trends)),
            }
            stats["devices"] = device_stats
            stats["trends"] = trends

        except Exception as e:
            stats["summary"]["error"] = str(e)
        finally:
            db.close()

        return stats

    def _render_html(self, report_type: str, start: str, end: str, data: dict) -> str:
        s = data["summary"]
        devices = data.get("devices", {})
        trends = data.get("trends", {})

        dev_rows = ""
        for did, info in list(devices.items())[:20]:
            dev_rows += f"""
            <tr>
              <td>{did}</td>
              <td>{info['points']:,}</td>
              <td>{info['avg_value']}</td>
              <td>{info['min_value']}</td>
              <td>{info['max_value']}</td>
            </tr>"""

        trend_rows = ""
        max_cnt = max(trends.values()) if trends else 1
        for day, cnt in sorted(trends.items()):
            bar_w = int(cnt / max_cnt * 200)
            trend_rows += f"""
            <tr>
              <td>{day}</td>
              <td>{cnt:,}</td>
              <td><div style="background:#4a9eff;height:16px;width:{bar_w}px;border-radius:2px"></div></td>
            </tr>"""

        return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>{report_type} — 时序数据采集与应用管理系统</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:'Microsoft YaHei',sans-serif;max-width:900px;margin:0 auto;padding:30px;color:#333}}
h1{{font-size:22px;border-bottom:2px solid #4a9eff;padding-bottom:10px;margin-bottom:20px}}
.meta{{color:#888;font-size:13px;margin-bottom:20px}}
.kpi{{display:flex;gap:16px;margin-bottom:24px}}
.kpi-item{{flex:1;background:#f0f4ff;border:1px solid #d0d8f0;border-radius:8px;padding:16px;text-align:center}}
.kpi-item .v{{font-size:28px;font-weight:bold;color:#4a9eff}}
.kpi-item .l{{font-size:12px;color:#888;margin-top:4px}}
h2{{font-size:16px;margin:20px 0 10px;color:#555}}
table{{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px}}
th{{background:#f5f5f5;padding:8px 12px;text-align:left;font-weight:600;border-bottom:1px solid #ddd}}
td{{padding:8px 12px;border-bottom:1px solid #eee}}
.footer{{margin-top:30px;padding-top:10px;border-top:1px solid #ddd;font-size:11px;color:#aaa;text-align:center}}
</style>
</head>
<body>
<h1>{report_type} — 时序数据采集与应用管理系统</h1>
<div class="meta">周期: {start} ~ {end} | 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}</div>

<div class="kpi">
  <div class="kpi-item"><div class="v">{s.get('total_points', 0):,}</div><div class="l">总采集点数</div></div>
  <div class="kpi-item"><div class="v">{s.get('active_devices', 0)}</div><div class="l">活跃设备</div></div>
  <div class="kpi-item"><div class="v">{s.get('avg_daily_points', 0):,.0f}</div><div class="l">日均采集量</div></div>
</div>

<h2>每日采集趋势</h2>
<table>
  <tr><th>日期</th><th>采集量</th><th>趋势</th></tr>
  {trend_rows}
</table>

<h2>设备统计 (TOP 20)</h2>
<table>
  <tr><th>设备ID</th><th>采集数</th><th>平均值</th><th>最小值</th><th>最大值</th></tr>
  {dev_rows}
</table>

<div class="footer">本报告由 iotStudio 时序数据采集与应用管理系统自动生成</div>
</body>
</html>"""


# ── 快捷入口 ──

def generate_daily(date: str = None) -> str:
    return ReportGenerator().daily(date)["html"]

def generate_weekly(end_date: str = None) -> str:
    return ReportGenerator().weekly(end_date)["html"]

def generate_monthly(ym: str = None) -> str:
    return ReportGenerator().monthly(ym)["html"]


if __name__ == "__main__":
    gen = ReportGenerator()
    result = gen.daily()
    print(f"日报: {result['json']}")
    print(f"设备: {result['data']['summary'].get('active_devices', 0)} 活跃")
    print(f"点数: {result['data']['summary'].get('total_points', 0):,}")
