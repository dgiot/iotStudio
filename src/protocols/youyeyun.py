"""有叶云 HTTP REST 协议适配器 — 油液在线监测"""
import time
import logging
import requests
from dataclasses import dataclass, field
from typing import Optional

log = logging.getLogger("youyeyun")

YOUYEYUN_BASE = "https://www.youyeyun.com/zhc/system"


@dataclass
class YouyeyunConfig:
    token: str
    device_id: str = ""          # 有叶云设备 UUID
    device_name: str = ""
    poll_interval: int = 300     # 采集间隔 (秒)


class YouyeyunAdapter:
    """有叶云 HTTP REST 协议适配器 — 对接油液传感器厂商平台"""

    def __init__(self, config: YouyeyunConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            "authorization": config.token,
            "x-authorization": f"Bearer {config.token}",
            "lang": "zh-CN",
        })
        self._last_sync = 0

    # ---- HTTP 工具 ----

    def _get(self, path: str, params: dict = None) -> Optional[dict]:
        url = f"{YOUYEYUN_BASE}{path}"
        try:
            r = self.session.get(url, params=params, timeout=30)
            d = r.json()
            if d.get("code") != 200:
                log.error(f"[{self.config.device_name}] API error: {d.get('msg')}")
                return None
            return d
        except Exception as e:
            log.error(f"[{self.config.device_name}] Request failed: {e}")
            return None

    # ---- 传感器发现 ----

    def discover_sensors(self) -> list:
        """拉取传感器拓扑 → 返回 [{sensor_id, sensor_name, points: [{key_id, key_name, unit}]}]"""
        d = self._get("/dataanalysis/getSenorInfo", {"deviceId": self.config.device_id})
        if not d:
            return []
        sensors = []
        for s in d.get("data", []):
            sensors.append({
                "sensor_id": s.get("senorId"),
                "sensor_name": s.get("senorName"),
                "points": [
                    {
                        "key_id": p.get("keyId"),
                        "key_name": p.get("keyName"),
                        "key_alias": p.get("key", ""),
                        "unit": p.get("unit", ""),
                        "status": p.get("status", 1),
                    }
                    for p in s.get("senors", [])
                ],
            })
        log.info(f"[{self.config.device_name}] Discovered {len(sensors)} sensors")
        return sensors

    # ---- 实时值 ----

    def fetch_realtime(self) -> list:
        """拉取实时值 → [{key_id, key_name, value, unit}]"""
        d = self._get("/dataanalysis/getSenorInfo", {"deviceId": self.config.device_id})
        if not d:
            return []
        points = []
        for sensor in d.get("data", []):
            for p in sensor.get("senors", []):
                raw = p.get("value")
                try:
                    val = float(raw) if raw is not None and raw != "" else None
                except (ValueError, TypeError):
                    val = None
                points.append({
                    "key_id": p.get("keyId"),
                    "key_name": p.get("keyName"),
                    "value": val,
                    "unit": p.get("unit", ""),
                })
        self._last_sync = time.time()
        return points

    # ---- 时序历史 ----

    def fetch_ts(self, key_id: str, hours: int = 24) -> list:
        """拉取单个测点的历史时序"""
        now = int(time.time() * 1000)
        start = now - hours * 3600000

        # 污染度测点用专用接口 (keyId 40-53)
        if key_id.isdigit() and 40 <= int(key_id) <= 53:
            ep = "/dataanalysis/getPollutionDegree"
        else:
            ep = "/dataanalysis/getTsKvLatestByDeviceIdAndTsKvId"

        d = self._get(ep, {"deviceId": self.config.device_id, "keyId": key_id, "startTime": start, "endTime": now})
        if not d:
            return []
        return [
            {
                "value": float(r.get("value", 0)) if r.get("value") else None,
                "time": r.get("createTime", ""),
                "pollution_level": r.get("pollutionLevel", ""),
            }
            for r in d.get("data", [])
        ]

    # ---- 全量同步 ----

    def full_sync(self) -> dict:
        """全量同步：传感器元数据 + 实时值 + 24h 历史"""
        sensors = self.discover_sensors()
        realtime = self.fetch_realtime()
        all_ts = {}
        for s in sensors:
            for p in s["points"]:
                ts = self.fetch_ts(p["key_id"], 24)
                if ts:
                    all_ts[p["key_id"]] = ts
        return {
            "sensors": sensors,
            "realtime": realtime,
            "ts": all_ts,
        }

    # ---- 健康状态 ----

    def check_health(self) -> dict:
        """健康检查"""
        try:
            d = self._get("/dataanalysis/getSenorInfo", {"deviceId": self.config.device_id})
            ok = d is not None and d.get("code") == 200
            return {"ok": ok, "msg": "已连接" if ok else "API异常"}
        except Exception as e:
            return {"ok": False, "msg": str(e)}


# ---- 工厂 ----

def create_adapter(token: str, device_id: str, name: str = "", interval: int = 300) -> YouyeyunAdapter:
    return YouyeyunAdapter(YouyeyunConfig(
        token=token, device_id=device_id, device_name=name, poll_interval=interval,
    ))

# -- plugin registration --
try:
    from plugin_registry import register
    register("http_rest_youyeyun", version="1.0", category="protocol",
             adapter="YouyeyunAdapter",
             config={"token": "", "device_id": "", "poll_interval": 300})
except ImportError: pass
