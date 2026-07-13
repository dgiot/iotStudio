#!/usr/bin/env python3
"""
Loop: 项目日报 (daily-triage) · 评分 8.2
===========================================
名称    项目健康度日报
触发    每个工作日 8:00 AM (Cron: 0 8 * * 1-5)
目标    统计24h变更·平台状态·Loop运行·生成日报
输入    项目目录 · STATE.md · logs/ · Git log(24h)
停止    成功(日报) / 预算(100行) / 异常→升级
提交    日报 → STATE.md (自动)
"""
import os, sys, json, subprocess
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOG_DIR = ROOT / "logs"

def git_changes():
    """Git 24h 变更"""
    try:
        r = subprocess.run(["git", "log", "--since=24.hours", "--oneline"],
                          capture_output=True, text=True, cwd=str(ROOT))
        return r.stdout.strip().split('\n') if r.stdout.strip() else []
    except:
        return []

def loop_stats(log_file):
    """统计 Loop 运行"""
    if not Path(log_file).exists(): return {"runs": 0, "ok": 0, "fail": 0}
    with open(log_file) as f:
        lines = [json.loads(l) for l in f.readlines() if l.strip()]
    recent = [l for l in lines if (datetime.now() - datetime.fromisoformat(l["ts"][:19])).total_seconds() < 86400]
    return {
        "runs": len(recent),
        "ok": sum(1 for l in recent if l.get("all_ok")),
        "fail": sum(1 for l in recent if not l.get("all_ok")),
        "last_state": recent[-1].get("state", "N/A") if recent else "N/A",
    }

def platform_status():
    """平台快照"""
    import urllib.request
    try:
        r = urllib.request.urlopen("http://127.0.0.1:8000/api/stats", timeout=5)
        d = json.loads(r.read())
        return d
    except:
        return {}

def main():
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    commits = git_changes()
    p1 = loop_stats(LOG_DIR / "monitor_platform.jsonl")
    p2 = loop_stats(LOG_DIR / "monitor_131.jsonl")
    ps = platform_status()

    report = f"""## 日报 {now}

### 平台
- 设备: {ps.get('total_devices', '?')} 台
- 遥测: {ps.get('telemetry_rows', '?')} 条
- 告警: {ps.get('active_alarms', '?')} 活跃
- 管线: {'运行中' if ps.get('pipeline_running') else '停止'}

### Loop 巡检 (24h)
- 平台: {p1['runs']}次, {p1['ok']}OK/{p1['fail']}FAIL
- 131:  {p2['runs']}次, {p2['ok']}OK/{p2['fail']}FAIL, 状态={p2['last_state']}

### Git
- 24h提交: {len(commits)} 个
"""
    if commits:
        for c in commits[:5]:
            report += f"- {c}\n"

    print(report)
    # 写入 STATE.md
    with open(ROOT / "STATE.md", 'a', encoding='utf-8') as f:
        f.write(f"\n{report}\n")

if __name__ == '__main__':
    main()
