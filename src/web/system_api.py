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
