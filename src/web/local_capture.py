"""本地网卡抓包 — 使用 netsh trace (无需 Npcap/scapy)"""
import subprocess, time, threading, re, os
from fastapi import APIRouter

router = APIRouter(prefix="/api/capture/local", tags=["local-capture"])

_state = {"running": False, "packets": [], "cycles": 0, "errors": 0}
MAX_PKTS = 200

def _netsh_cycle():
    try:
        trace_file = os.path.join(os.environ.get("TEMP", "C:/temp"), "dgiot_cap.etl").replace('\\', '/')
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

        # Parse via tracerpt
        csv_file = trace_file.replace('.etl', '.csv')
        subprocess.run(f'tracerpt "{trace_file}" -o "{csv_file}" -of CSV', shell=True, capture_output=True, timeout=30, encoding='utf-8', errors='ignore')

        if os.path.exists(csv_file):
            with open(csv_file, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    matches = re.findall(r'[0-9A-Fa-f]{40,}', line)
                    for m in matches:
                        try:
                            raw = bytes.fromhex(m)
                            if len(raw) > 20:
                                pstart = 0
                                for i in range(len(raw)-1):
                                    if raw[i:i+2] == b'\x5a\x5a': pstart = i; break
                                if pstart == 0:
                                    ihl = (raw[14] & 0x0F) * 4
                                    tcp_s = 14 + ihl
                                    doff = ((raw[tcp_s+12] >> 4) & 0x0F) * 4
                                    pstart = tcp_s + doff
                                if pstart < len(raw):
                                    pkt = raw[pstart:pstart+80]
                                    proto = 'A11' if pkt[:2]==b'\x5a\x5a' else 'Modbus' if len(pkt)>7 and pkt[7] in (1,2,3,4,5,6,15,16) else 'TCP'
                                    _state["packets"].insert(0, {
                                        "ts": time.time(), "proto": proto, "dir": "RX",
                                        "src": "local", "dst": "device", "len": len(pkt),
                                        "hex": pkt.hex(' ')
                                    })
                                    if len(_state["packets"]) > MAX_PKTS:
                                        _state["packets"] = _state["packets"][:MAX_PKTS]
                        except: pass
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
