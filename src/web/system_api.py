"""系统信息 API"""
import platform, os, time, socket
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["system"])

_startup_ts = time.time()


def _jsonable(v):
    """把插件注册项里的值降级成可 JSON 化的形式。

    注册项是内部结构，不是 API 契约：`adapter`（顶层与 metadata 里各有一份）
    按设计是**类对象**（plugin_registry.py:47 校验它必须是
    BaseProtocolAdapter 子类），原样返回会让 FastAPI 的 jsonable_encoder 抛
    `TypeError: vars() argument must have __dict__ attribute` ⇒ HTTP 500。
    这里统一递归降级，而不是逐个字段打补丁 —— 否则注册项一长出新字段，
    就会再 500 一次。
    """
    if isinstance(v, type):
        return v.__name__
    if isinstance(v, dict):
        return {str(k): _jsonable(x) for k, x in v.items()}
    if isinstance(v, (list, tuple, set)):
        return [_jsonable(x) for x in v]
    if v is None or isinstance(v, (str, int, float, bool)):
        return v
    return repr(v)


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
    """插件清单 + 健康度 + 前端模块开关。

    三个消费方，各自要一段，**三段各有各的出处**：
      · plugins/health — plugin_registry（协议驱动那套）
      · frontend       — PluginManager.frontend_modules()，即
                         data/plugins_state.json 的 frontend 段

    ★ `frontend` 这一段是 loader.js:29 一直在要的键：
      `data && data.frontend ? data.frontend : null`。
      本端点此前只返 {plugins, health}，于是那个三元式**恒为 null**，
      前端永远走构建期兜底 —— 后端动态启停整套能力（set_frontend 有、
      持久化有、loader 的判断分支也有）从来没有生效过。
      漏的是最后这一根线，不是能力本身。

    注册项原样返回会 500：`adapter` 是类对象、`metadata` 里也有不可序列化的值，
    FastAPI 的 jsonable_encoder 抛 `TypeError: vars() argument must have
    __dict__ attribute` —— 而本函数的 try/except 抓不到它：**序列化发生在
    return 之后**。故经 `_jsonable` 递归降级后再返回。
    """
    try:
        from ..plugin_registry import list_all, health
        plugins = [{k: _jsonable(v) for k, v in p.items()} for p in list_all()]
    except Exception:
        plugins, health_doc = [], {}
    else:
        health_doc = health()

    # frontend 段独立取：它的出处在 PluginManager，不在 plugin_registry。
    # 取不到时**不补默认值** —— 补 {} 会让「后端说全开」与「后端没答」长得一样，
    # 而 loader 对这两者的处理必须不同（见 loader.js:44 的 backendMap 判断）。
    frontend = None
    try:
        from ..plugin_runtime import runtime
        frontend = runtime.frontend_modules()
    except Exception:
        pass

    out = {"plugins": plugins, "health": health_doc}
    if frontend is not None:
        out["frontend"] = frontend
    return out

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
        # 要盯的进程名是**部署侧事实**（每个现场的软件栈不同），公开仓不留真值。
        # 经环境变量给：DG_EDGE_PROCESSES="Proc1 Proc2 ..."（无默认值，照 CLAUDE.md 里
        # `DG_HUB_HOST` 那条惯例）。
        # 没配时**不查**，且回一个显式说明串 —— 不能返回空串：空串在 UI 上读作
        # 「这些进程都没在跑」，那是个看起来成功的错答案。
        want = os.environ.get('DG_EDGE_PROCESSES', '').strip()
        procs = (run(f'tasklist | findstr "{want}"') if want
                 else '(DG_EDGE_PROCESSES 未配置 —— 未查询进程)')

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
# Oracle 生产数据 API (via edge bridge)
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
# 原先此处有 4 个 Oracle 数据管道端点（pipeline/start · stop · status · run-once）。
# 它们 import 的 services/oracle_pipeline 已由 1effe9217「移除厂商专属插件与内部
# 管道引用」有意删除，但这 4 个调用方没跟着清 —— 于是成了 4 个恒 500 的端点
# （GET /api/pipeline/status 实测 HTTP 500：ModuleNotFoundError）。一并删除。
# ═══════════════════════════════════════════════════════════

