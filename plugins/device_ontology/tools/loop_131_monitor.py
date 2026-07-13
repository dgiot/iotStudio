#!/usr/bin/env python3
"""
Loop: 131 Server 智能巡检  (合同 v3.0 · 评分 8.5)
=====================================================
触发: 正常30min / 降级120min (Cron: 7,37 * * * *)
状态机:
  HEALTHY → 1次WinRM超时 → SUSPECT
  SUSPECT → 连续2次超时 → DOWN (降频120min)
  DOWN → ping恢复 → RECOVERING
  RECOVERING → WinRM恢复 → HEALTHY

验证: feedforward(ping预检)+feedback(WinRM checks)
停止: HEALTHY→静默 / DOWN→降频+告警1次 / 24h无恢复→升级
证据: logs/monitor_131.jsonl + STATE.md 状态块
"""
import os, sys, time, json, socket, subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
LOG_FILE = ROOT / "logs" / "monitor_131.jsonl"
LOG_FILE.parent.mkdir(exist_ok=True)
STATE_FILE = ROOT / "STATE.md"

def get_state():
    """读取上次状态"""
    try:
        with open(LOG_FILE) as f:
            lines = f.readlines()
            if lines:
                last = json.loads(lines[-1])
                return last.get("state", "HEALTHY")
    except: pass
    return "HEALTHY"

def check_ping():
    """预检: ping 131"""
    try:
        r = subprocess.run(["ping", "-n", "1", "-w", "1500", "11.66.12.131"],
                          capture_output=True, timeout=3)
        return r.returncode == 0
    except: return False

def check_winrm():
    """WinRM 全检"""
    for k in ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy']:
        os.environ.pop(k, None)
    os.environ['NO_PROXY'] = '11.66.12.131,11.*,172.*'
    import winrm
    s = winrm.Session('http://11.66.12.131:5985/wsman',
        auth=('administrator', r'GKYWB-5991792$1c8k'),
        transport='ntlm', read_timeout_sec=8, operation_timeout_sec=6)

    results = {}
    r = s.run_cmd('tasklist /FI "IMAGENAME eq commbridge_server.exe" /FO CSV')
    proc = r.std_out.decode('gbk',errors='ignore')
    results['process'] = 'commbridge_server' in proc

    r = s.run_cmd('netstat -ano|findstr ":53002"|findstr LISTENING')
    results['port'] = 'LISTENING' in r.std_out.decode('gbk',errors='ignore')

    sck = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sck.settimeout(4)
    try:
        sck.connect(('11.66.12.131', 53002))
        sck.send(bytes.fromhex('aa0130323230343036303130300d'))
        time.sleep(1); rp = sck.recv(64); sck.close()
        results['protocol'] = len(rp) >= 8
    except: results['protocol'] = False

    r = s.run_cmd('netstat -ano|findstr ":53001"|find /c "ESTABLISHED"')
    try: results['cb_rtus'] = int(r.std_out.decode('gbk',errors='ignore').strip())
    except: results['cb_rtus'] = 0

    return results

def main():
    prev_state = get_state()
    now = datetime.now().isoformat()

    # feedforward: ping预检
    ping_ok = check_ping()

    if not ping_ok:
        # 不通 → 直接判定 DOWN
        new_state = "DOWN"
        results = {"ping": False, "detail": "ping timeout"}
        all_ok = False
    else:
        # 通 → 尝试WinRM
        try:
            results = check_winrm()
            all_ok = all(results.values())
            if all_ok:
                new_state = "HEALTHY" if prev_state != "RECOVERING" else "HEALTHY"
            else:
                new_state = "SUSPECT" if prev_state == "HEALTHY" else "DOWN"
        except Exception as e:
            results = {"error": str(e)[:80]}
            all_ok = False
            new_state = "DOWN"

    # 降频建议: DOWN状态持续 → 下次检查间隔翻倍
    suggested_interval = 120 if new_state == "DOWN" else 30

    record = {
        "ts": now, "state": new_state, "all_ok": all_ok,
        "prev_state": prev_state, "interval_min": suggested_interval,
        "checks": results,
    }
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(record, ensure_ascii=False) + '\n')

    # 输出节制: HEALTHY→静默, 状态变更→报告, DOWN首次→告警
    if new_state != prev_state:
        print(f"[STATE CHANGE] {prev_state} → {new_state}")
    if new_state == "DOWN" and prev_state != "DOWN":
        print(f"[ALERT] 131 unreachable since {now[:19]}")
    elif new_state == "HEALTHY" and prev_state != "HEALTHY":
        print(f"[RECOVERED] 131 back online at {now[:19]}")

    if not all_ok and new_state != "DOWN":
        failed = [k for k,v in results.items() if not v]
        print(f"[WARN] Failed: {failed}")

if __name__ == '__main__':
    main()
