"""远程抓包 — WinRM + netsh trace 管道"""
import threading, time, json, os, base64
from fastapi import APIRouter

router = APIRouter(prefix="/api/capture/remote", tags=["远程抓包"])

_remote_state = {"running": False, "packets": [], "cycles": 0, "errors": 0, "host": "192.168.10.131"}
MAX_PACKETS = 200

def _get_creds():
    """从 config.yaml 读取远程抓包凭据"""
    try:
        from config import cfg
        rc = cfg.remote_capture
        if isinstance(rc, dict):
            return rc
        return {"host": rc.host, "port": rc.port, "username": rc.username, "password": rc.password}
    except:
        pass
    # Fallback to hardcoded (WinRM test script works with these)
    return {"host": "192.168.10.131", "port": 5985, "username": "administrator",
            "password": r"CHANGEME"}

def _netsh_cycle():
    """一个 netsh trace 周期: 抓30s → 停 → 解析 → 注入"""
    try:
        creds = _get_creds()
        from winrm.protocol import Protocol
        h, pt, u, pw = creds['host'], creds['port'], creds['username'], creds['password']
        p = Protocol(endpoint=f'http://{h}:{pt}/wsman', transport='ntlm', username=u, password=pw)
        shell = p.open_shell()
        def run(cmd):
            cid = p.run_command(shell, cmd)
            out, _, _ = p.get_command_output(shell, cid)
            return out.decode('gbk', errors='ignore').strip()

        # Clean old files, start NetConnection capture
        run('powershell -c "Remove-Item C:/Users/Administrator/rem_cap.* -Force -ErrorAction SilentlyContinue" 2>&1')
        run('netsh trace stop 2>&1')
        time.sleep(1)
        r = run('netsh trace start scenario=NetConnection capture=yes tracefile=C:/Users/Administrator/rem_cap.etl maxsize=20 persistent=no 2>&1')
        if 'Running' not in r:
            _remote_state["errors"] += 1
            p.close_shell(shell)
            return

        time.sleep(15)
        run('netsh trace stop 2>&1')

        # Convert ETL -> CSV, then search for A11 hex
        run('tracerpt C:/Users/Administrator/rem_cap.etl -o C:/Users/Administrator/rem_cap.csv -of CSV -y 2>&1')
        output = run('powershell -c "Get-Content C:/Users/Administrator/rem_cap.csv -Encoding UTF8 -TotalCount 10000 | Select-String 5a5a,6a6a,Modbus,MBAP,OPC,0500,DCOM,RPC,CoInitialize | Select -First 20 | Out-String" 2>&1')

        # Extract hex payloads from NDIS-PacketCapture lines
        import re
        proto_map = {'A11':'130:8889', 'Modbus':'device:502', 'OPC-DA':'device:135'}
        for m in re.finditer(r'[0-9A-Fa-f]{60,}', output):
            try:
                h = m.group()
                if len(h) % 2: h = h[:-1]  # pad to even
                raw = bytes.fromhex(h)
                idx = raw.find(b'\x5a\x5a')
                if idx >= 0:
                    proto = 'A11'; pkt = raw[idx:idx+200]
                elif raw.find(b'\x05\x00') >= 0 and (raw.find(b'\x05\x00') < 20):
                    proto = 'OPC-DA'; pkt = raw[:150]
                elif len(raw) >= 8 and raw[2:4] == b'\x00\x00' and raw[7] in (1,2,3,4,5,6,15,16):
                    proto = 'Modbus'; pkt = raw[:120]
                elif raw.find(b'\x00\x00') >= 0 and len(raw) > 30:
                    proto = 'TCP'; pkt = raw[:100]
                else:
                    continue
                entry = {"ts": time.time(), "proto": proto, "dir": "RX",
                    "src": "131", "dst": proto_map.get(proto,""),
                    "len": len(pkt), "hex": pkt.hex(' ')[:300],
                    "info": proto+"帧"}
                _remote_state["packets"].insert(0, entry)
                if len(_remote_state["packets"]) > MAX_PACKETS:
                    _remote_state["packets"] = _remote_state["packets"][:MAX_PACKETS]
            except: pass

        _remote_state["cycles"] += 1
        p.close_shell(shell)
    except Exception as e:
        _remote_state["errors"] += 1
        import traceback, sys
        print(f"[remote_capture] ERROR: {e}", file=sys.stderr)
        traceback.print_exc()

def _loop():
    while _remote_state["running"]:
        _netsh_cycle()
        time.sleep(10)

@router.post("/start")
def remote_start(host: str = "192.168.10.131", ports: str = "8889,53001,502"):
    if _remote_state["running"]:
        return {"status": "error", "msg": "已在运行"}
    _remote_state.update({"running": True, "packets": [], "cycles": 0, "errors": 0, "host": host})
    threading.Thread(target=_loop, daemon=True).start()
    return {"status": "ok", "msg": f"远程抓包已启动: {host}", "ports": ports}

@router.post("/stop")
def remote_stop():
    _remote_state["running"] = False
    return {"status": "ok", "cycles": _remote_state["cycles"], "packets": len(_remote_state["packets"])}

@router.get("/status")
def remote_status():
    return {"running": _remote_state["running"], "cycles": _remote_state["cycles"],
            "packets": len(_remote_state["packets"]), "errors": _remote_state["errors"],
            "host": _remote_state["host"]}

@router.get("/packets")
def remote_packets(limit: int = 30):
    pkts = _remote_state["packets"][:limit]
    return {"total": len(_remote_state["packets"]), "packets": pkts}

@router.post("/inject-sample")
def inject_sample():
    """注入真实 A11 帧样本用于演示"""
    samples = [
        {"hex": "5a5ab2040100260062f02f000900000a0024060000230000005c43593143384b5c5a363131535957535c5a44303130383338444f565856333031564323", "dir": "TX", "src": "131:62535", "dst": "130:8889"},
        {"hex": "5a5a170000003900b28735000500800a00000000006a6a", "dir": "RX", "src": "130:8889", "dst": "131:62531"},
        {"hex": "df05000000060103012b0004", "dir": "TX", "src": "131:53001", "dst": "11.249.61.243:502"},
        {"hex": "05000003100000008c080000b8760200640800000100030002ac", "dir": "RX", "src": "192.168.10.23:58648", "dst": "131:49778"},
        {"hex": "05000b03100000007800280066020000d016d016", "dir": "RX", "src": "192.168.10.23:3514", "dst": "131:135"},
    ]
    for i, s in enumerate(samples):
        raw = bytes.fromhex(s["hex"].replace(' ',''))
        proto = 'A11' if raw[:2] == b'\x5a\x5a' else 'OPC-DA' if raw[0] == 0x05 else 'Modbus'
        _remote_state["packets"].insert(0, {
            "ts": time.time(), "proto": proto, "dir": s["dir"],
            "src": s["src"], "dst": s["dst"], "len": len(raw), "hex": s["hex"]
        })
    return {"status": "ok", "injected": len(samples)}
