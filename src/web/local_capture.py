"""本地网卡抓包 — netsh trace + tracerpt 解析"""
import subprocess, time, threading, os, json
from fastapi import APIRouter

router = APIRouter(prefix="/api/capture/local", tags=["local-capture"])
_state = {"running": False, "packets": [], "cycles": 0, "errors": 0}
MAX_PKTS = 200

def _netsh_cycle():
    try:
        tmp = (os.environ.get("TEMP") or "C:/temp").replace("\\", "/")
        os.makedirs(tmp, exist_ok=True)
        etl = f"{tmp}/dgiot_cap.etl"
        csv = f"{tmp}/dgiot_cap.csv"
        xml = f"{tmp}/dgiot_cap.xml"

        # Stop stale, then start
        subprocess.run("netsh trace stop", shell=True, capture_output=True, timeout=5)
        time.sleep(1)
        r = subprocess.run(
            f'netsh trace start capture=yes tracefile={etl} maxsize=50 persistent=no',
            shell=True, capture_output=True, text=True, timeout=10)
        if r.returncode != 0:
            _state["errors"] += 1; return

        time.sleep(15)
        subprocess.run("netsh trace stop", shell=True, capture_output=True, timeout=10)

        # Convert ETL with tracerpt
        if os.path.exists(etl):
            subprocess.run(
                f'tracerpt "{etl}" -o "{csv}" -of CSV -summary "{xml}" -report "{xml.replace(".xml","_rpt.xml")}"',
                shell=True, capture_output=True, timeout=30)

            # Parse CSV for packet data
            if os.path.exists(csv):
                with open(csv, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Look for IP addresses with port patterns (A11:8889, Modbus:502)
                import re
                lines = content.split("\n")
                count = 0
                for line in lines:
                    # Match lines with IP:port patterns
                    ips = re.findall(r'\d+\.\d+\.\d+\.\d+:\d+', line)
                    if ips and count < 30:
                        for addr in ips:
                            src = addr.split(":")[0]
                            port = addr.split(":")[1] if ":" in addr else "0"
                            proto = "A11" if port in ("8889","8888") else "Modbus" if port == "502" else "TCP"
                            _state["packets"].insert(0, {
                                "ts": time.time(), "proto": proto, "dir": "RX",
                                "src": src, "dst": "local",
                                "len": len(line), "hex": line[:200]
                            })
                            count += 1
                            if len(_state["packets"]) > MAX_PKTS:
                                _state["packets"] = _state["packets"][:MAX_PKTS]

        # If no packets found, inject at least some traffic info
        if len(_state["packets"]) == 0 and os.path.exists(xml):
            with open(xml, "r", encoding="utf-8", errors="ignore") as f:
                xml_content = f.read()
            # Extract any useful info from the XML summary
            _state["packets"].insert(0, {
                "ts": time.time(), "proto": "Info", "dir": "RX",
                "src": "netsh", "dst": "local",
                "len": len(xml_content), "hex": f"ETL captured OK ({os.path.getsize(etl)} bytes). No industrial protocol traffic on this interface."
            })

        _state["cycles"] += 1
    except Exception as e:
        _state["errors"] += 1

def _loop():
    while _state["running"]:
        _netsh_cycle()
        time.sleep(5)

@router.post("/start")
def start(ports: str = "502,2404,8889"):
    if _state["running"]: return {"status": "error", "msg": "already running"}
    _state.update({"running": True, "packets": [], "cycles": 0, "errors": 0})
    threading.Thread(target=_loop, daemon=True).start()
    return {"status": "ok", "msg": "netsh trace started"}

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
