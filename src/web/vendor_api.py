"""厂商通道 API — 全部从 parse_lite Channel 表动态读取

本模块**不含任何具体通道名**。通道由 Channel 表声明，取值全部来自记录本身：

    key            ← Channel.objectId 去掉 ch_ 前缀
    name / desc    ← Channel.name / config.description
    host / devices / points / interval ← Channel.config.*
    relatedDevices ← Channel.config.relatedDevices

形制对齐 dgiot 的 data/loaded_plugins.tmpl：清单是数据，不进代码。
底座只负责「把 Channel 表里有的东西读出来」，不负责知道装的是谁 ——
否则每来一个部署就要改一次底座，而底座里就多留了一份别人的现场清单。
"""
import time as _time

from fastapi import APIRouter

router = APIRouter(prefix="/api/vendor", tags=["vendor"])


def _db_channels():
    """从 parse_lite 读取所有通道"""
    from ..parse_lite import parse_query
    r = parse_query("Channel", {"limit": 50})
    return r.get("results", [])


def _to_vendor(ch, key_override=None):
    """Channel DB 记录 → 前端 Vendor 格式"""
    cfg = ch.get("config", {}) if isinstance(ch.get("config"), dict) else {}
    key = key_override or ch.get("objectId", "").replace("ch_", "")
    return {
        "key": key,
        "name": ch.get("name", key),
        "icon": _icon_for(ch.get("cType", "")),
        "source": _source_for(cfg),
        "protocol": ch.get("cType", ""),
        "desc": cfg.get("description", ch.get("cType", "")),
        "devices": int(cfg.get("devices", 0)),
        "points": int(cfg.get("points", 0)),
        "interval": str(cfg.get("interval", "30s")),
        "connected": ch.get("status") == "running",
        "lastSync": ch.get("updatedAt", "")[:16] if ch.get("updatedAt") else _time.strftime("%Y-%m-%d %H:%M"),
        "relatedDevices": _related_devices(cfg),
        "config": cfg,
    }


def _icon_for(c_type):
    """协议图标 —— 只表达「这是一条什么协议的通道」，不表达行业。

    `http_rest` 原先是 🛢（油罐）—— 那是某个部署的业务图标，
    通用 HTTP 接入用它会把行业含义带给每一个部署。
    """
    return {"oracle_sql": "🗄️", "http_rest": "🌐", "modbus_tcp": "🔥",
            "mqtt": "🔩", "rtsp": "📷"}.get(c_type, "📡")


def _source_for(cfg):
    """通道来源描述 —— 一律从通道配置拼。

    原先这里是一张 `{key: 描述}` 表，条目把某个部署的主机名、设备数、
    测点数写死在底座代码里；`_related_devices` 原先是一张 7 组的写死清单，
    每组的设备名都取自某个具体现场。两处一并改掉：这些值本来就在
    Channel.config 里，读它即可。
    """
    return " · ".join((
        str(cfg.get("host") or "—"),
        f"{cfg.get('devices', 0)}设备",
        f"{cfg.get('points', 0)}测点",
    ))


def _related_devices(cfg):
    """关联设备 —— 由通道配置给出（config.relatedDevices）。"""
    rel = cfg.get("relatedDevices") if isinstance(cfg, dict) else None
    return rel if isinstance(rel, list) else []


@router.get("/list")
def list_vendors():
    """列出全部厂商通道（从 DB 动态加载）

    原先 DB 为空时会落进一段 7 条写死的「默认通道集」兜底。那份兜底本身就是
    一份名单，且与 Channel 表并存会出现「同一个通道两处定义」。演示数据应由
    seed 脚本写进 Channel 表，不由底座代持。
    """
    vendors = []
    seen = set()
    for ch in _db_channels():
        key = ch.get("objectId", "").replace("ch_", "")
        if key not in seen and ch.get("status") == "running":
            seen.add(key)
            vendors.append(_to_vendor(ch, key))
    return {"ok": True, "vendors": vendors}


@router.get("/{key}/status")
def get_vendor_status(key: str):
    """获取单个通道状态（从 DB）

    原先这里对两个具体 key 各有一段特判，读一个**不存在的模块**
    （`services.oracle_pipeline`）取实时统计 —— ImportError 被 except 吞掉，
    于是永远返回写在 except 里的常量。那两段是装饰，不是功能：真要有实时
    数据源，把它挂到通道自己的 config 上，而不是在底座里按 key 特判。
    """
    from ..parse_lite import parse_query

    ch = parse_query("Channel", {"where": f'{{"objectId":"ch_{key}"}}'})
    if ch.get("count", 0) > 0:
        return _to_vendor(ch["results"][0], key)

    return {"key": key, "connected": False, "devices": 0, "points": 0, "relatedDevices": []}
