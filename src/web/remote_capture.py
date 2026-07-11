"""远程抓包 — WinRM + netsh trace 管道"""
import threading, time, json, os, base64
from fastapi import APIRouter

router = APIRouter(prefix="/api/capture/remote", tags=["远程抓包"])

_remote_state = {"running": False, "packets": [], "cycles": 0, "errors": 0, "host": "11.66.12.131"}
MAX_PACKETS = 200

def _get_creds():
    """从 config.yaml 读取远程抓包凭据"""
    try:
        from config import cfg
        return cfg.remote_capture
    except:
        from dataclasses import dataclass
        @dataclass
        class RC: host="11.66.12.131"; port=5985; username="administrator"; password=""
        return RC()

def _netsh_cycle():
    """一个 netsh trace 周期: 抓30s → 停 → 解析 → 注入"""
    try:
        creds = _get_creds()
        from winrm.protocol import Protocol
        p = Protocol(endpoint=f'http://{creds.host}:{creds.port}/wsman', transport='ntlm',
                     username=creds.username, password=creds.password)
        shell = p.open_shell()
        def run(cmd):
            cid = p.run_command(shell, cmd)
            out, _, _ = p.get_command_output(shell, cid)
            return out.decode('gbk', errors='ignore').strip()

        # NetConnection + port filter for A11(8889)/Modbus(502)
        run('netsh trace stop 2>&1')
        time.sleep(1)
        r = run('netsh trace start scenario=NetConnection capture=yes capturefilter="IPv4.Port==8889 or IPv4.Port==53001 or IPv4.Port==502 or IPv4.Port==135" tracefile=C:/Users/Administrator/rem_cap.etl maxsize=80 persistent=no 2>&1')
        if 'Running' not in r:
            _remote_state["errors"] += 1
            p.close_shell(shell)
            return

        time.sleep(30)
        run('netsh trace stop 2>&1')

        # Parse ETL -> CSV (overwrite existing)
        run('del C:/Users/Administrator/rem_cap.csv /Q 2>&1')
        ps = 'powershell -c "tracerpt C:/Users/Administrator/rem_cap.etl -o C:/Users/Administrator/rem_cap.csv -of CSV -y 2>&1; Get-Content C:/Users/Administrator/rem_cap.csv -Encoding UTF8 | Select-String 8889,53001,502,135 | Select -First 50 | ForEach-Object { $_.Line }" 2>&1'
        output = run(ps)

        # Parse IP:port pairs from TCPIP events
        import re
        for line in output.split('\n'):
            # Extract src_ip:port -> dst_ip:port
            m = re.findall(r'"([\d.]+:\d+)"', line)
            if len(m) >= 2:
                proto = 'A11' if ':8889' in line else 'Modbus' if ':502' in line or ':53001' in line else 'TCP'
                entry = {
                    "ts": time.time(), "proto": proto,
                    "dir": "TX" if '131:' in m[0] else "RX",
                    "src": m[0], "dst": m[1],
                    "len": 0, "hex": "",
                    "info": "TCP连接" if proto=='TCP' else ('A11通信' if proto=='A11' else 'Modbus轮询')
                }
                _remote_state["packets"].insert(0, entry)
                if len(_remote_state["packets"]) > MAX_PACKETS:
                    _remote_state["packets"] = _remote_state["packets"][:MAX_PACKETS]

        _remote_state["cycles"] += 1
        p.close_shell(shell)
    except Exception as e:
        _remote_state["errors"] += 1

def _loop():
    while _remote_state["running"]:
        _netsh_cycle()
        time.sleep(10)

@router.post("/start")
def remote_start(host: str = "11.66.12.131", ports: str = "8889,53001,502"):
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
    ]
    for i, s in enumerate(samples):
        raw = bytes.fromhex(s["hex"].replace(' ',''))
        proto = 'A11' if raw[:2] == b'\x5a\x5a' else 'Modbus'
        _remote_state["packets"].insert(0, {
            "ts": time.time(), "proto": proto, "dir": s["dir"],
            "src": s["src"], "dst": s["dst"], "len": len(raw), "hex": s["hex"]
        })
    return {"status": "ok", "injected": len(samples)}
