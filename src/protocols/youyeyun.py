"""
有叶云 协议适配器 — 油液在线监测
双认证:
  V1: JWT Token (x-authorization header) — /zhc/system/...
  V2: appKey + SHA1 签名 — /zhc/api/v1/... (OpenAPI)

凭证:
  账号: sell@inzoc.com / A1234567
  Token 通过 POST /zhc/login 获取
"""
import time
import hashlib
import logging
import requests
from dataclasses import dataclass
from typing import Optional, Dict, List, Any

log = logging.getLogger("youyeyun")

SYS_BASE = "https://www.youyeyun.com/zhc/system"
LOGIN_URL = "https://www.youyeyun.com/zhc/login"


@dataclass
class YouyeyunConfig:
    username: str = "sell@inzoc.com"
    password: str = "A1234567"
    token: str = ""           # JWT Token (优先使用)
    app_key: str = ""         # OpenAPI v2
    secret: str = ""          # OpenAPI v2
    device_id: str = ""
    device_name: str = ""
    poll_interval: int = 300


class YouyeyunAdapter:
    """有叶云协议适配器 — 自动登录 + 双认证"""

    def __init__(self, config: YouyeyunConfig):
        self.config = config
        self.session = requests.Session()
        if config.token:
            self._set_auth_header(config.token)
        self._last_sync: float = 0

    def _set_auth_header(self, token: str):
        self.config.token = token
        self.session.headers.update({
            "authorization": token,
            "x-authorization": f"Bearer {token}",
            "lang": "zh-CN",
        })

    def login(self) -> bool:
        """账号密码登录获取 Token"""
        try:
            r = self.session.post(LOGIN_URL, json={
                "username": self.config.username,
                "password": self.config.password,
            }, timeout=15)
            d = r.json()
            if d.get("code") != 200:
                log.error(f"[youyeyun] Login failed: {d.get('msg')}")
                return False
            self._set_auth_header(d["token"])
            log.info(f"[youyeyun] Login OK, token: {d['token'][:30]}...")
            return True
        except Exception as e:
            log.error(f"[youyeyun] Login error: {e}")
            return False

    def _get(self, path: str, params: dict = None) -> Optional[dict]:
        url = f"{SYS_BASE}{path}"
        try:
            r = self.session.get(url, params=params, timeout=30)
            d = r.json()
            if d.get("code") != 200:
                # Token expired, re-login
                if "token" in str(d.get("msg", "")).lower() or "登录" in str(d.get("msg", "")):
                    log.info(f"[youyeyun] Token expired, re-login...")
                    if self.login():
                        r = self.session.get(url, params=params, timeout=30)
                        d = r.json()
                if d.get("code") != 200:
                    return None
            return d
        except Exception as e:
            log.error(f"[{self.config.device_name}] {path}: {e}")
            return None

    # ── 业务接口 ──

    def discover_sensors(self) -> List[dict]:
        d = self._get("/dataanalysis/getSenorInfo", {"deviceId": self.config.device_id})
        if not d: return []
        return [
            {"sensor_id": s.get("senorId"), "sensor_name": s.get("senorName"),
             "points": [{"key_id": p.get("keyId"), "key_name": p.get("keyName"),
                         "unit": p.get("unit", "")} for p in s.get("senors", [])]}
            for s in d.get("data", [])
        ]

    def fetch_realtime(self) -> List[dict]:
        d = self._get("/dataanalysis/getSenorInfo", {"deviceId": self.config.device_id})
        if not d: return []
        points = []
        for sensor in d.get("data", []):
            for p in sensor.get("senors", []):
                raw = p.get("value")
                try:
                    val = float(raw) if raw is not None and raw != "" else None
                except (ValueError, TypeError):
                    val = None
                points.append({
                    "key_id": p.get("keyId"), "key_name": p.get("keyName"),
                    "value": val, "unit": p.get("unit", ""),
                })
        self._last_sync = time.time()
        return points

    def full_sync(self) -> dict:
        return {"sensors": self.discover_sensors(), "realtime": self.fetch_realtime()}

    def check_health(self) -> dict:
        try:
            d = self._get("/dataanalysis/getSenorInfo", {"deviceId": self.config.device_id})
            return {"ok": d is not None, "msg": "已连接" if d else "API异常"}
        except Exception as e:
            return {"ok": False, "msg": str(e)}


def create_adapter(token: str = "", device_id: str = "", name: str = "") -> YouyeyunAdapter:
    return YouyeyunAdapter(YouyeyunConfig(
        token=token, device_id=device_id, device_name=name,
    ))


# ===== BaseProtocolAdapter 包装 =====
import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional as _Opt
from .base import BaseProtocolAdapter as _BaseAdapter, ProtocolConfig as _PConfig, PointValue as _PV

class YouyeyunProtocolAdapter(_BaseAdapter):
    """有叶云 BaseProtocolAdapter 包装 — 接入 dgiot_lite 采集引擎"""

    def __init__(self, config: _PConfig):
        super().__init__(config)
        self._yy = YouyeyunAdapter(YouyeyunConfig(
            username=config.extra.get("username", "sell@inzoc.com"),
            password=config.extra.get("password", "A1234567"),
            token=config.extra.get("token", ""),
            device_id=config.extra.get("yy_device_id", ""),
            device_name=config.device_name,
        ))

    async def connect(self) -> bool:
        loop = asyncio.get_running_loop()
        ok = await loop.run_in_executor(None, self._yy.login)
        self._connected = ok
        return ok

    async def disconnect(self) -> None:
        self._yy.session.close()
        self._connected = False

    async def read_points(self, points: List[Dict[str, Any]]) -> List[_PV]:
        loop = asyncio.get_running_loop()
        data = await loop.run_in_executor(None, self._yy.fetch_realtime)
        now = datetime.now(timezone.utc)
        results = []
        for pt in data:
            if pt["value"] is not None:
                results.append(_PV(
                    device_id=self.device_id,
                    point_id=str(pt.get("key_id", pt["key_name"])),
                    point_name=pt["key_name"],
                    value=pt["value"],
                    unit=pt.get("unit", ""),
                    timestamp=now,
                ))
        # 如果 points 参数有过滤，只返回请求的
        if points and results:
            wanted = {p.get("point_id") or p.get("protocol_addr", "") for p in points}
            if wanted:
                results = [r for r in results if r.point_id in wanted]
        return results

    async def write_point(self, point: Dict[str, Any], value: Any) -> bool:
        return False  # 有叶云 API 不支持写入

    async def read_holding(self, addr: int, count: int = 1,
                           slave_id: _Opt[int] = None) -> _Opt[list]:
        return None


# -- plugin_registry 注册 (供 collector.py 插件点发现) --
try:
    from ..plugin_registry import register as _p_register
    _p_register("youyeyun", version="2.1", category="protocol",
                adapter="YouyeyunProtocolAdapter",
                config={
                    "username": "sell@inzoc.com",
                    "yy_device_id": "6bf6f220-d5bb-11ed-b812-ed5ae62e5bad",
                    "poll_interval": 300,
                })
except ImportError:
    pass

# -- @protocol 自动注册 --
try:
    from ..channel_base import protocol, BaseChannel
    @protocol('http_rest_youyeyun', version='2.1')
    class _YouyeyunChannel(BaseChannel):
        def __init__(self, cid, cfg=None): super().__init__(cid, cfg); self._adapter = None
        async def init(self, **kw):
            self._adapter = YouyeyunAdapter(YouyeyunConfig(**(self.config or {})))
            self.status = 'running'; return True
        async def handle_message(self, msg): return self._adapter.fetch_realtime()
        async def handle_event(self, ev, **kw): return {'event': ev}
        async def stop(self): self.status = 'stopped'
except ImportError: pass
