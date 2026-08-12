"""系统信息 API"""
import platform, os, time, socket
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["system"])

_startup_ts = time.time()

@router.get("/system")
def system_info():
    from ..config import cfg
    info = {
        "hostname": socket.gethostname(),
        "os": f"{platform.system()} {platform.release()}",
        "python": platform.python_version(),
        "uptime": int(time.time() - _startup_ts),
        "storage_mode": cfg.storage_mode,
        "data_dir": cfg.data_dir,
    }
    try:
        import psutil
        info["cpu_percent"] = psutil.cpu_percent(interval=0.1)
        info["cpu_cores"] = psutil.cpu_count()
        mem = psutil.virtual_memory()
        info["memory_used_gb"] = round(mem.used / (1024**3), 1)
        info["memory_total_gb"] = round(mem.total / (1024**3), 1)
        info["memory_percent"] = mem.percent
        disk = psutil.disk_usage(cfg.data_dir)
        info["disk_used_gb"] = round(disk.used / (1024**3), 1)
        info["disk_total_gb"] = round(disk.total / (1024**3), 1)
        net = psutil.net_io_counters()
        info["net_sent_mb"] = round(net.bytes_sent / (1024**2), 1)
        info["net_recv_mb"] = round(net.bytes_recv / (1024**2), 1)
        interfaces = []
        for name, addrs in psutil.net_if_addrs().items():
            iface = {"name": name, "ips": [{"address": a.address} for a in addrs if a.family == 2 and not a.address.startswith("127.")]}
            if iface["ips"]:
                iface["ipv4"] = iface["ips"][0]["address"]
                interfaces.append(iface)
        info["interfaces"] = interfaces
        ports = set()
        for c in psutil.net_connections(kind='inet'):
            if c.status == 'LISTEN':
                ports.add(c.laddr.port)
        info["listening_ports"] = sorted(ports)
    except ImportError:
        info["cpu_percent"] = None
    try:
        from ..plugin_registry import health as plugin_health
        info["plugins"] = plugin_health()
    except: pass
    return info

@router.get("/plugins")
def list_plugins():
    try:
        from ..plugin_registry import list_all, health
        return {"plugins": list_all(), "health": health()}
    except:
        return {"plugins": [], "health": {}}

# ---- 远程 IO 服务器信息 (WinRM) ----
@router.get("/system/remote")
def remote_system_info(host: str = "127.0.0.1"):
    """通过 WinRM 获取远程 IO 服务器真实系统信息"""
    try:
        from winrm.protocol import Protocol
        from ..config import cfg
        rc = getattr(cfg, 'remote_capture', None) or {}
        username = rc.get('username', 'administrator') if isinstance(rc, dict) else getattr(rc, 'username', 'administrator')
        password = rc.get('password', '') if isinstance(rc, dict) else getattr(rc, 'password', '')
        port = rc.get('port', 5985) if isinstance(rc, dict) else getattr(rc, 'port', 5985)

        p = Protocol(endpoint=f'http://{host}:{port}/wsman', transport='ntlm',
                     username=username, password=password)
        shell = p.open_shell()
        def run(cmd):
            cid = p.run_command(shell, cmd)
            out, _, _ = p.get_command_output(shell, cid)
            return out.decode('gbk', errors='ignore').strip()

        hostname = run('hostname')
        sysinfo = run('systeminfo | findstr /C:"OS" /C:"System" /C:"Memory" /C:"Processor"')
        mem = run('wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /Value')
        cpu = run('wmic cpu get Name,NumberOfCores,LoadPercentage /Value')
        disk = run('wmic logicaldisk where DeviceID="C:" get Size,FreeSpace /Value')
        net = run('ipconfig | findstr "IPv4"')
        procs = run('tasklist | findstr "IoProject IOMan IoMonitor IoCommit LegacyComm"')

        p.close_shell(shell)

        # 解析为本体并存入 parse_lite
        ontology = _parse_to_ontology(hostname, host, sysinfo, mem, cpu, disk, net, procs)
        return {
            "hostname": hostname, "host": host,
            "sysinfo": sysinfo, "memory": mem, "cpu": cpu,
            "disk": disk, "network": net, "processes": procs,
            "ontology": ontology,
        }
    except Exception as e:
        return {"error": str(e), "host": host}

def _parse_to_ontology(hostname, host, sysinfo, mem, cpu, disk, net, procs):
    """将远程采集数据解析为四层本体 (Site→Gateway→Device→Point) 存入 parse_lite"""
    import re
    try:
        from ..parse_lite import parse_create, ensure_table
        from ..ontology import OntologyEngine, Site, Gateway, Device, Point
    except:
        return {"status": "parse_lite unavailable"}

    engine = OntologyEngine()
    site_id = "io_farm"
    gw_id = f"gw_{hostname}"

    # Layer 1: Site
    engine.register(Site(id=site_id, name="IO网关集群", type="control_center"))

    # Layer 2: Gateway
    engine.register(Gateway(id=gw_id, ip=host, site=site_id, hostname=hostname,
        protocols=["a11:8889", "modbus:53001", "opc_da:135"]))

    # Layer 3: Devices (from process list)
    proc_list = [p.strip() for p in procs.split('\n') if p.strip() and not p.startswith('INFO')]
    for pi, proc_line in enumerate(proc_list[:10]):
        parts = proc_line.split()
        if parts:
            dev_id = f"{gw_id}_proc_{pi}"
            engine.register(Device(id=dev_id, gateway=gw_id, name=parts[0] if parts else f"proc_{pi}",
                type="process", protocol="win32"))

    # Layer 4: Points (from CPU/Mem/Disk)
    for pi, (name, unit, val_str) in enumerate([
        ("CPU使用率", "%", re.search(r'LoadPercentage=(\d+)', cpu)),
        ("总内存", "KB", re.search(r'TotalVisibleMemorySize=(\d+)', mem)),
        ("可用内存", "KB", re.search(r'FreePhysicalMemory=(\d+)', mem)),
        ("C盘总空间", "B", re.search(r'Size=(\d+)', disk)),
        ("C盘可用", "B", re.search(r'FreeSpace=(\d+)', disk)),
    ]):
        if val_str:
            pt_id = f"{gw_id}_pt_{pi}"
            engine.register(Point(id=pt_id, device=f"{gw_id}_proc_0", name=name, unit=unit,
                alarm={"high": 90} if "CPU" in name else {}))

    # Store to parse_lite
    engine.sync_to_parse("default")
    return engine.health()


# ═══════════════════════════════════════════════════════════
# Oracle 生产数据 API (via 131 bridge)
# ═══════════════════════════════════════════════════════════

@router.get("/oracle/ping")
def oracle_ping():
    """测试 Oracle 连接"""
    try:
        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()
        return b.ping()
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/oracle/runrate")
def oracle_run_rate():
    """获取最新运行率"""
    try:
        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()
        result = b.get_run_rate()
        rows = result.get('rows', [])
        return {
            "ok": True,
            "time": rows[0].get('INSERT_TIME', '') if rows else '',
            "run_rate": rows[0].get('TODAY_RUN_RATE', '') if rows else '',
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/oracle/wells")
def oracle_wells(limit: int = 20):
    """查询单井信息"""
    try:
        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()
        result = b.get_wells(limit)
        rows = result.get('rows', [])
        # 解析测点路径
        for row in rows:
            path = row.get('POINT_LONGNAME', '')
            if not path:
                # wells query doesn't have POINT_LONGNAME, skip
                pass
        return {
            "ok": True,
            "count": len(rows),
            "wells": rows,
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/oracle/points")
def oracle_points(limit: int = 50):
    """查询测点关系"""
    try:
        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()
        result = b.get_points(limit)
        rows = result.get('rows', [])
        # 解析每个测点的路径
        for row in rows:
            path = row.get('POINT_LONGNAME', '')
            if path:
                row['ontology'] = b.parse_point_path(path)
        return {
            "ok": True,
            "count": len(rows),
            "points": rows,
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/oracle/stats")
def oracle_stats():
    """Oracle 数据库统计"""
    try:
        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()
        result = b.get_counts()
        stats = {}
        for k, v in result.items():
            if k.startswith('cnt_'):
                table = k[4:]
                rows_data = v.get('rows', [])
                stats[table] = int(rows_data[0].get('CNT', 0)) if rows_data else 0
        return {"ok": True, "stats": stats}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/oracle/query")
def oracle_query(sql: str):
    """执行自定义 SQL (只读)"""
    try:
        # 安全检查: 只允许 SELECT
        if not sql.strip().upper().startswith('SELECT'):
            return {"ok": False, "error": "Only SELECT queries allowed"}

        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()
        result = b.query(sql, label="custom")
        return {"ok": True, **result}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ═══════════════════════════════════════════════════════════
# Oracle 数据管道 API — 定时采 → TDengine → MQTT
# ═══════════════════════════════════════════════════════════

@router.post("/pipeline/start")
async def pipeline_start():
    """启动 Oracle 数据管道"""
    from ..services.oracle_pipeline import get_pipeline
    p = get_pipeline()
    result = await p.start()
    return {"ok": True, **result}


@router.post("/pipeline/stop")
async def pipeline_stop():
    """停止 Oracle 数据管道"""
    from ..services.oracle_pipeline import get_pipeline
    p = get_pipeline()
    await p.stop()
    return {"ok": True, "status": "stopped"}


@router.get("/pipeline/status")
def pipeline_status():
    """查询管道状态"""
    from ..services.oracle_pipeline import get_pipeline
    p = get_pipeline()
    return {"ok": True, **p.get_stats()}


@router.post("/pipeline/run-once")
async def pipeline_run_once():
    """手动触发一次采集"""
    from ..services.oracle_pipeline import get_pipeline
    p = get_pipeline()
    result = await p.run_once()
    return {"ok": True, **result}


# ═══════════════════════════════════════════════════════════
# 有叶云油液监测 API
# ═══════════════════════════════════════════════════════════

@router.get("/vendor_oilmon/health")
def vendor_oilmon_health():
    """有叶云设备健康检查"""
    try:
        from ..protocols.vendor_oilmon import create_adapter
        from ..config import cfg
        yy_cfg = getattr(cfg, 'vendor_oilmon', None)
        if not yy_cfg:
            return {"ok": False, "error": "有叶云未配置"}
        devices = getattr(yy_cfg, 'devices', []) or yy_cfg.get('devices', [])
        results = []
        for dev in devices:
            token = getattr(yy_cfg, 'token', '') or yy_cfg.get('token', '')
            dev_id = dev.get('uuid', '') if isinstance(dev, dict) else getattr(dev, 'uuid', '')
            dev_name = dev.get('name', '') if isinstance(dev, dict) else getattr(dev, 'name', '')
            adp = create_adapter(token=token, device_id=dev_id, name=dev_name)
            h = adp.check_health()
            results.append({"device": dev_name, **h})
        return {"ok": True, "devices": results}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/vendor_oilmon/realtime")
def vendor_oilmon_realtime():
    """有叶云实时数据"""
    try:
        from ..protocols.vendor_oilmon import create_adapter
        from ..config import cfg
        yy_cfg = getattr(cfg, 'vendor_oilmon', None)
        if not yy_cfg:
            return {"ok": False, "error": "有叶云未配置"}
        devices = getattr(yy_cfg, 'devices', []) or yy_cfg.get('devices', [])
        results = []
        for dev in devices:
            token = getattr(yy_cfg, 'token', '') or yy_cfg.get('token', '')
            dev_id = dev.get('uuid', '') if isinstance(dev, dict) else getattr(dev, 'uuid', '')
            dev_name = dev.get('name', '') if isinstance(dev, dict) else getattr(dev, 'name', '')
            adp = create_adapter(token=token, device_id=dev_id, name=dev_name)
            pts = adp.fetch_realtime()
            results.append({"device": dev_name, "points": pts})
        return {"ok": True, "devices": results}
    except Exception as e:
        return {"ok": False, "error": str(e)}
