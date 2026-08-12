"""
PHM Cloud Platform 适配器 — test.pubsci.top
Keycloak OIDC 认证 → PHM 云平台 API

认证:
  POST /realms/phm/protocol/openid-connect/token
  grant_type=password 或 refresh_token
  client_id=phm-web

API (通过内网 localhost:18183):
  /api/devices     — 设备管理
  /api/telemetry   — 遥测数据
  /api/alarm       — 告警
  /api/tenant      — 租户
  /api/dashboard   — 仪表盘

JWT 信息:
  用户: qut-admin (SUPER_ADMIN)
  租户: qut
  Audience: phm-cloud-platform, account
"""
import time
import logging
import requests
from dataclasses import dataclass, field
from typing import Optional, Dict, List

log = logging.getLogger("phm")

BASE_URL = "https://test.pubsci.top"
AUTH_URL = f"{BASE_URL}/realms/phm/protocol/openid-connect/token"
CLIENT_ID = "phm-web"


@dataclass
class PHMConfig:
    username: str = "qut-admin"
    password: str = "qut-admin"
    client_id: str = "phm-web"
    api_base: str = "http://localhost:18183"  # 后端 API 内网地址
    poll_interval: int = 60  # 采集间隔 (秒)
    refresh_token: str = ""  # 预置 refresh_token (优先于密码登录)


class PHMAdapter:
    """PHM 云平台协议适配器"""

    def __init__(self, config: PHMConfig = None):
        self.config = config or PHMConfig()
        self.session = requests.Session()
        self.session.verify = False
        self._access_token: Optional[str] = None
        self._refresh_token: Optional[str] = self.config.refresh_token or None
        self._token_expires: float = 0
        self._last_sync: float = 0

    # ── 认证 ──

    def login(self) -> bool:
        """密码登录获取 Token"""
        try:
            r = self.session.post(AUTH_URL, data={
                "grant_type": "password",
                "client_id": self.config.client_id,
                "username": self.config.username,
                "password": self.config.password,
            }, timeout=15)
            if r.status_code != 200:
                log.error(f"[phm] Login failed: {r.status_code} {r.text[:200]}")
                return False
            return self._save_token(r.json())
        except Exception as e:
            log.error(f"[phm] Login error: {e}")
            return False

    def refresh(self) -> bool:
        """用 refresh_token 刷新"""
        if not self._refresh_token:
            return self.login()
        try:
            r = self.session.post(AUTH_URL, data={
                "grant_type": "refresh_token",
                "client_id": self.config.client_id,
                "refresh_token": self._refresh_token,
            }, timeout=15)
            if r.status_code != 200:
                log.warning(f"[phm] Refresh failed, re-login...")
                return self.login()
            return self._save_token(r.json())
        except Exception as e:
            log.error(f"[phm] Refresh error: {e}")
            return False

    def _save_token(self, data: dict) -> bool:
        self._access_token = data.get("access_token", "")
        self._refresh_token = data.get("refresh_token", "")
        self._token_expires = time.time() + data.get("expires_in", 300) - 30
        self.session.headers.update({
            "Authorization": f"Bearer {self._access_token}",
        })
        log.info(f"[phm] Token OK, expires in {data.get('expires_in')}s")
        return True

    def _ensure_auth(self) -> bool:
        """确保 Token 有效"""
        if self._access_token and time.time() < self._token_expires:
            return True
        if self._refresh_token:
            return self.refresh()
        return self.login()

    # ── API 调用 ──

    def _api_get(self, path: str, params: dict = None) -> Optional[dict]:
        """调用 PHM API"""
        if not self._ensure_auth():
            return None
        url = f"{self.config.api_base}{path}"
        try:
            r = self.session.get(url, params=params, timeout=30)
            if r.status_code == 200:
                return r.json()
            elif r.status_code == 401:
                log.warning(f"[phm] 401 on {path}, re-auth...")
                self._access_token = None
                if self._ensure_auth():
                    r = self.session.get(url, params=params, timeout=30)
                    if r.status_code == 200:
                        return r.json()
            log.error(f"[phm] API {path}: {r.status_code} {r.text[:100]}")
            return None
        except Exception as e:
            log.error(f"[phm] API {path}: {e}")
            return None

    def _api_post(self, path: str, data: dict = None) -> Optional[dict]:
        if not self._ensure_auth():
            return None
        url = f"{self.config.api_base}{path}"
        try:
            r = self.session.post(url, json=data, timeout=30)
            if r.status_code == 200:
                return r.json()
            log.error(f"[phm] POST {path}: {r.status_code}")
            return None
        except Exception as e:
            log.error(f"[phm] POST {path}: {e}")
            return None

    # ── 业务 API ──

    def get_devices(self, page: int = 0, size: int = 100) -> Optional[dict]:
        """获取设备列表"""
        return self._api_get("/api/devices", {"page": page, "size": size})

    def get_device_detail(self, device_id: str) -> Optional[dict]:
        """获取设备详情"""
        return self._api_get(f"/api/device/{device_id}")

    def get_telemetry(self, device_id: str, key: str,
                      start: str = None, end: str = None, limit: int = 100) -> Optional[dict]:
        """获取遥测数据"""
        params = {"deviceId": device_id, "key": key, "limit": limit}
        if start: params["start"] = start
        if end: params["end"] = end
        return self._api_get("/api/telemetry", params)

    def get_alarms(self, status: str = "active", limit: int = 100) -> Optional[dict]:
        """获取告警列表"""
        return self._api_get("/api/alarm", {"status": status, "limit": limit})

    def get_dashboard(self) -> Optional[dict]:
        """获取仪表盘概览"""
        return self._api_get("/api/dashboard")

    # ── 采集接口 (供 Pipeline 调用) ──

    def fetch_devices_summary(self) -> List[dict]:
        """采集所有设备摘要信息"""
        result = self.get_devices(size=1000)
        if not result:
            return []
        devices = result.get("content", result.get("data", []))
        return [
            {
                "device_id": d.get("id", ""),
                "name": d.get("name", ""),
                "type": d.get("type", ""),
                "status": d.get("status", ""),
                "tenant": d.get("tenant", ""),
            }
            for d in devices
        ]

    def fetch_realtime(self, device_id: str, keys: List[str]) -> List[dict]:
        """采集设备实时遥测"""
        points = []
        for key in keys:
            data = self.get_telemetry(device_id, key, limit=1)
            if data:
                rows = data.get("content", data.get("data", []))
                if rows:
                    points.append({
                        "device_id": device_id,
                        "key": key,
                        "value": rows[0].get("value"),
                        "ts": rows[0].get("ts", ""),
                    })
        return points

    # ── 健康检查 ──

    def check_health(self) -> dict:
        """健康检查"""
        try:
            if not self._ensure_auth():
                return {"ok": False, "msg": "认证失败"}
            # 简单检查: 拉设备列表
            r = self.get_devices(size=1)
            return {"ok": r is not None, "msg": "已连接" if r else "API异常"}
        except Exception as e:
            return {"ok": False, "msg": str(e)}


# ── 工厂 ──

def create_adapter(username: str = "qut-admin", password: str = "qut-admin",
                   api_base: str = "http://localhost:18183", interval: int = 60) -> PHMAdapter:
    return PHMAdapter(PHMConfig(
        username=username, password=password, api_base=api_base, poll_interval=interval
    ))


# -- plugin registration --
try:
    from plugin_registry import register
    register("phm_platform", version="1.0", category="protocol",
             adapter="PHMAdapter",
             config={"username": "qut-admin", "password": "qut-admin",
                     "api_base": "http://localhost:18183", "poll_interval": 60})
except ImportError:
    pass
