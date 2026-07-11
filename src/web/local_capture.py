"""本地网卡抓包 — 使用 netsh trace (无需 Npcap/scapy)"""
import subprocess, time, threading, re, os
from fastapi import APIRouter

router = APIRouter(prefix="/api/capture/local", tags=["local-capture"])

_state = {"running": False, "packets": [], "cycles": 0, "errors": 0}
MAX_PKTS = 200

def _netsh_cycle():
    try:
        tmp_dir = os.environ.get("TEMP", "C:/temp").replace('\\', '/')
        os.makedirs(tmp_dir, exist_ok=True)
        trace_file = f"{tmp_dir}/dgiot_cap.etl"
        # Stop stale trace first
        subprocess.run('netsh trace stop', shell=True, capture_output=True, timeout=5, encoding='utf-8', errors='ignore')
        time.sleep(1)
        # Start fresh trace
        r = subprocess.run(
            f'netsh trace start capture=yes tracefile={trace_file} maxsize=80 persistent=no',
            shell=True, capture_output=True, text=True, timeout=10, encoding='utf-8', errors='ignore')
        if 'Running' not in r.stdout:
            _state["errors"] += 1; return
        time.sleep(15)
        subprocess.run('netsh trace stop', shell=True, capture_output=True, timeout=10, encoding='utf-8', errors='ignore')

        # 直接从 ETL 文件读原始 hex (跳过 CSV 解析)
        if os.path.exists(trace_file):
            with open(trace_file, 'rb') as f:
                raw_data = f.read()
            # 搜索 5a5a (A11) 和 Modbus 特征
            for i in range(0, len(raw_data)-20, 2):
                chunk = raw_data[i:i+80]
                if chunk[:2] == b'\x5a\x5a' or (len(chunk)>=8 and chunk[2:4]==b'\x00\x00' and chunk[7] in (1,2,3,4,5,6,15,16)):
                    proto = 'A11' if chunk[:2]==b'\x5a\x5a' else 'Modbus'
                    _state["packets"].insert(0, {
                        "ts": time.time(), "proto": proto, "dir": "RX",
                        "src": "local", "dst": "device", "len": min(len(chunk), 80),
                        "hex": chunk[:80].hex(' ')
                    })
                    if len(_state["packets"]) > MAX_PKTS:
                        _state["packets"] = _state["packets"][:MAX_PKTS]
                    if len(_state["packets"]) >= 20: break
        _state["cycles"] += 1
    except: _state["errors"] += 1

def _loop():
    while _state["running"]:
        _netsh_cycle()
        time.sleep(5)

@router.post("/start")
def start(ports: str = "502,2404,8889"):
    if _state["running"]: return {"status": "error", "msg": "already running"}
    _state.update({"running": True, "packets": [], "cycles": 0, "errors": 0})
    threading.Thread(target=_loop, daemon=True).start()
    return {"status": "ok", "msg": f"netsh trace started (ports: {ports})"}

@router.post("/stop")
def stop():
    _state["running"] = False
    return {"status": "ok", "cycles": _state["cycles"], "packets": len(_state["packets"])}

@router.get("/packets")
def packets(limit: int = 30):
    return {"total": len(_state["packets"]), "packets": _state["packets"][:limit]}

@router.get("/status")
def status():
    return _state
