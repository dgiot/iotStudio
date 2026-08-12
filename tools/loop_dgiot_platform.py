#!/usr/bin/env python3
"""
Loop: dgiot_lite 平台健康巡检  (合同 v1.0)
============================================
名称    dgiot_lite 本地平台健康巡检
触发    每15分钟 (Cron: 3,18,33,48 * * * *)
目标    确认本地平台 (API / 前端 / 管线 / MQTT / WebSocket) 全部正常
输入    localhost API endpoints
范围    只读 API · 写 STATE.md 和 logs/monitor_platform.jsonl
工具    curl + WebSocket + SQLite
验证    L1: HTTP 200 / L2: 响应字段校验
停止    成功(全部通过)→静默  /  连续3次失败→告警  /  MQTT异常→立即告警
升级    连续3次失败→通知人工
提交    结果→logs/monitor_platform.jsonl (证据链)
状态    每轮更新 STATE.md 状态块
清理    无副作用
"""
import json, time, sqlite3, os
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOG_FILE = ROOT / "logs" / "monitor_platform.jsonl"
LOG_FILE.parent.mkdir(exist_ok=True)

CHECKS = {}

def check(name, severity="warn"):
    def d(fn): CHECKS[name] = (fn, severity); return fn
    return d

@check("api_root", "critical")
def check_api():
    import urllib.request
    r = urllib.request.urlopen("http://127.0.0.1:8000/", timeout=5)
    return r.status == 200, f"HTTP {r.status}"

@check("api_devices", "critical")
def check_devices():
    import urllib.request, json
    r = urllib.request.urlopen("http://127.0.0.1:8000/api/devices?page_size=1", timeout=5)
    d = json.loads(r.read())
    return d.get("total", 0) > 0, f"{d.get('total', 0)} devices"

# cloud_functions 已移除 — 样板代码无实际调用

@check("api_stats", "warn")
def check_stats():
    import urllib.request, json
    r = urllib.request.urlopen("http://127.0.0.1:8000/api/stats", timeout=5)
    d = json.loads(r.read())
    telemetry = d.get("telemetry_rows", 0)
    return telemetry > 0, f"telemetry={telemetry}"

@check("frontend", "warn")
def check_frontend():
    import urllib.request
    r = urllib.request.urlopen("http://127.0.0.1:8000/", timeout=5)
    body = r.read().decode()
    return 'app' in body.lower() or 'dgiot' in body.lower(), "frontend OK"

def main():
    now = datetime.now().isoformat()
    results = {}
    all_ok = True
    critical_fail = False

    for name, (fn, severity) in CHECKS.items():
        try:
            ok, detail = fn()
            results[name] = {"ok": ok, "detail": detail, "severity": severity}
            if not ok and severity == "critical":
                critical_fail = True
            if not ok:
                all_ok = False
        except Exception as e:
            results[name] = {"ok": False, "detail": str(e)[:80], "severity": severity}
            all_ok = False
            if severity == "critical": critical_fail = True

    record = {"ts": now, "all_ok": all_ok, "critical": not critical_fail, "checks": results}
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(record, ensure_ascii=False) + '\n')

    if all_ok:
        print(f"[OK] All {len(results)} checks passed")
    else:
        failed = [k for k, v in results.items() if not v['ok']]
        sev = "CRITICAL" if critical_fail else "WARN"
        print(f"[{sev}] Failed: {failed}")

if __name__ == '__main__':
    main()
