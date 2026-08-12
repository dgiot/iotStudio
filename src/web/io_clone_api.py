"""
IO 服务器克隆 API — 扫描+复刻信息存库
======================================
Parse Class: IOServer — 持久化 IO 服务器信息和扫描结果

POST /api/io-clone/scan     → 扫描 IO 服务器
GET  /api/io-clone/servers  → IO 服务器列表
GET  /api/io-clone/{id}     → 单台 IO 服务器详情 + 扫描结果
POST /api/io-clone/{id}/rescan → 重新扫描
POST /api/io-clone/{id}/config → 更新配置
"""
from fastapi import APIRouter, HTTPException, Request
from typing import Optional
import json, asyncio

router = APIRouter(prefix="/api/io-clone", tags=["io-clone"])

def _ensure_table():
    from ..parse_lite import ensure_table, get_backend
    be = get_backend()
    be.create_table("IOServer", "objectId TEXT PRIMARY KEY, name TEXT, ip TEXT, "
                    "os TEXT, scan_result TEXT, status TEXT, config TEXT, "
                    "data TEXT, createdAt TEXT, updatedAt TEXT")


@router.post("/servers")
async def add_server(request: Request):
    """添加 IO 服务器配置"""
    from ..parse_lite import parse_create, ensure_table
    ensure_table("IOServer")
    body = await request.json()
    ip = body.get("ip", "")
    name = body.get("name", f"IO-{ip}")
    return parse_create("IOServer", {
        "objectId": body.get("objectId") or ip.replace(".", "_"),
        "name": name,
        "ip": ip,
        "config": json.dumps(body.get("config", {}), ensure_ascii=False),
        "status": "pending",
    })


@router.get("/servers")
def list_servers():
    """IO 服务器列表"""
    from ..parse_lite import parse_query
    _ensure_table()
    return parse_query("IOServer", {"limit": 100, "order": "-updatedAt"})


@router.get("/servers/{oid}")
def get_server(oid: str):
    """单台 IO 服务器详情"""
    from ..parse_lite import parse_get
    _ensure_table()
    obj = parse_get("IOServer", oid)
    if not obj:
        raise HTTPException(404, "IO 服务器不存在")
    return obj


@router.post("/servers/{oid}/scan")
async def scan_server(oid: str, request: Request):
    """扫描 IO 服务器 — WinRM 连接 → 全量扫描 → 结果存库"""
    from ..parse_lite import parse_get, parse_update

    server = parse_get("IOServer", oid)
    if not server:
        raise HTTPException(404, "IO 服务器不存在")

    config = json.loads(server.get("config", "{}"))
    ip   = server.get("ip", config.get("ip", ""))
    user = config.get("user", "")
    pwd  = config.get("password", "")
    transport = config.get("transport", "ntlm")
    port = config.get("port", 5985)
    vendor = config.get("vendor", "")
    ports  = config.get("ports", "")

    if not ip or not user:
        raise HTTPException(400, "缺少 ip/user 配置")

    # 更新状态: 扫描中
    parse_update("IOServer", oid, {"status": "scanning"})

    # 异步扫描
    try:
        import os as _os
        _os.environ.pop('HTTP_PROXY', None)
        _os.environ.pop('HTTPS_PROXY', None)
        _os.environ['NO_PROXY'] = ip

        import winrm
        session = winrm.Session(
            f"http://{ip}:{port}/wsman",
            auth=(user, pwd),
            transport=transport,
            read_timeout_sec=60,
        )

        def ps(script):
            try:
                r = session.run_ps(script)
                return (r.std_out + r.std_err).decode('gbk', errors='ignore').strip()[:5000]
            except: return ""

        def cmd(command):
            try:
                r = session.run_cmd(command)
                return (r.std_out + r.std_err).decode('gbk', errors='ignore').strip()[:5000]
            except: return ""

        vendor_kw = vendor or "force|opc|rockwell|iomonitor|factory|wonderware|siemens|modicon|mitsubishi|omron|beckhoff|codesys"
        target_ports = ports or "8889 502 135 53001 4840 102 44818"

        result = {
            "hostname": cmd("hostname").strip(),
            "os": cmd("ver").strip(),
            "whoami": cmd("whoami").strip(),
            "processes": ps(f"Get-Process | Where-Object {{$_.ProcessName -match '{vendor_kw}'}} | Select Name,Id | Format-Table -AutoSize"),
            "services": cmd(f'sc query state= all 2>nul | findstr /i "{vendor_kw.replace("|", " ")}"'),
            "software_x64": ps(f"Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object {{$_.DisplayName -match '{vendor_kw}'}} | Select DisplayName | Format-List"),
            "software_x86": ps(f"Get-ItemProperty 'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object {{$_.DisplayName -match '{vendor_kw}'}} | Select DisplayName | Format-List"),
            "ports": cmd(f'netstat -an 2>nul | findstr "{target_ports}"'),
            "opc_appids": ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Classes\\AppID' -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -match 'OPC|OpcRcw|Automation|ServerList'} | ForEach-Object {$_.PSChildName}"),
            "opc_progids": ps("Get-ChildItem 'HKLM:\\SOFTWARE\\Classes' -ErrorAction SilentlyContinue | Where-Object {$_.PSChildName -like 'OPC.*'} | Select -First 30 PSChildName"),
            "opc_dlls": cmd('cmd /c "dir C:\\Windows\\System32\\opc*.dll C:\\Windows\\SysWOW64\\opc*.dll 2>nul"'),
            "drive_D": cmd('cmd /c "dir /b D:\\ 2>nul"'),
            "drive_C_programs": cmd('cmd /c "dir /ad /b \"C:\\Program Files\" 2>nul"'),
        }

        parse_update("IOServer", oid, {
            "status": "scanned",
            "scan_result": json.dumps(result, ensure_ascii=False),
            "os": result.get("os", ""),
        })

        return {"status": "done", "result": result}

    except Exception as e:
        parse_update("IOServer", oid, {"status": "error"})
        raise HTTPException(500, f"扫描失败: {e}")


@router.put("/servers/{oid}/config")
async def update_config(oid: str, request: Request):
    """更新 IO 服务器配置 (WinRM 凭据等)"""
    from ..parse_lite import parse_get, parse_update
    server = parse_get("IOServer", oid)
    if not server:
        raise HTTPException(404, "IO 服务器不存在")

    body = await request.json()
    existing = json.loads(server.get("config", "{}"))
    existing.update(body)
    parse_update("IOServer", oid, {"config": json.dumps(existing, ensure_ascii=False)})
    return {"status": "updated"}


@router.delete("/servers/{oid}")
def delete_server(oid: str):
    from ..parse_lite import parse_delete
    return parse_delete("IOServer", oid)
