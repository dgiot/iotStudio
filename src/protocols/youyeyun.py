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
from typing import Optional, Dict, List

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
