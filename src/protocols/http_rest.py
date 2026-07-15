# ============================================================
# dgiot_lite — HTTP REST 通用协议适配器
# ============================================================
"""
通用 HTTP REST 协议适配器，用于从 REST API 轮询数据。

配置示例 (config.extra):
{
    "url": "http://api.example.com/data",
    "method": "GET",
    "headers": {"Authorization": "Bearer xxx"},
    "json_path": "$.data.points",       # JSONPath 提取数据
    "point_mapping": {
        "field_ia": "Ia",               # 响应字段 → 测点ID
        "field_ua": "Ua"
    },
    "auth": {
        "type": "bearer | basic | none",
        "token_url": "http://api.example.com/login",
        "credentials": {"user": "x", "pass": "y"}
    },
    "poll_interval": 300
}
"""
import json, time, logging
from typing import Any, Dict, List, Optional
from datetime import datetime

import httpx

from .base import BaseProtocolAdapter, ProtocolConfig, PointValue

logger = logging.getLogger(__name__)


class HttpRestAdapter(BaseProtocolAdapter):
    """通用 HTTP REST 协议适配器 — 定时轮询外部 REST API"""

    def __init__(self, config: ProtocolConfig):
        super().__init__(config)
        self.client: Optional[httpx.AsyncClient] = None
        self._token: Optional[str] = None
        self._token_expires: float = 0

    async def connect(self) -> bool:
        try:
            self.client = httpx.AsyncClient(timeout=self.config.timeout or 30)
            await self._ensure_auth()
            self._connected = True
            logger.info(f"[http_rest] {self.device_id} 连接成功 url={self.config.extra.get('url','')}")
            return True
        except Exception as e:
            logger.error(f"[http_rest] {self.device_id} 连接失败: {e}")
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if self.client:
            await self.client.aclose()
        self._connected = False

    async def _ensure_auth(self) -> None:
        """确保认证有效，必要时重新登录"""
        auth = self.config.extra.get("auth", {})
        if not auth or auth.get("type", "none") == "none":
            return

        now = time.time()
        if self._token and now < self._token_expires:
            return  # 当前 token 仍有效

        if auth["type"] == "bearer":
            token_url = auth.get("token_url", "")
            creds = auth.get("credentials", {})
            if token_url and creds:
                try:
                    r = await self.client.post(token_url, json=creds)
                    data = r.json()
                    self._token = data.get("token") or data.get("access_token") or ""
                    self._token_expires = now + (data.get("expires_in", 3600) - 60)
                    self.client.headers.update({"Authorization": f"Bearer {self._token}"})
                    logger.info(f"[http_rest] {self.device_id} 登录成功")
                except Exception as e:
                    logger.warning(f"[http_rest] {self.device_id} 登录失败: {e}")

        elif auth["type"] == "basic":
            creds = auth.get("credentials", {})
            if creds:
                import base64
                raw = f"{creds.get('user','')}:{creds.get('pass','')}".encode()
                encoded = base64.b64encode(raw).decode()
                self.client.headers.update({"Authorization": f"Basic {encoded}"})

    async def _resolve_json_path(self, data: Any, path: str) -> Any:
        """简易 JSONPath 解析（仅支持 $.key.subkey 形式）"""
        if not path or path == "$":
            return data
        parts = path.replace("$.", "").split(".")
        current = data
        for part in parts:
            if isinstance(current, dict):
                current = current.get(part)
            elif isinstance(current, list):
                try:
                    idx = int(part)
                    current = current[idx] if idx < len(current) else None
                except ValueError:
                    return None
            else:
                return None
            if current is None:
                return None
        return current

    async def read_points(self, points: List[Dict[str, Any]]) -> List[PointValue]:
        """轮询 REST API 并解析测点值"""
        if not self.client or not self._connected:
            await self.connect()
            if not self._connected:
                return []

        extra = self.config.extra
        url = extra.get("url", "")
        method = extra.get("method", "GET").upper()
        json_path = extra.get("json_path", "$")
        mapping = extra.get("point_mapping", {})
        headers = extra.get("headers", {})

        if not url:
            logger.warning(f"[http_rest] {self.device_id} 未配置 url")
            return []

        try:
            await self._ensure_auth()

            # 发送请求
            req_kwargs = {"headers": {**headers}}
            if method == "POST" and extra.get("body"):
                import json as _json
                req_kwargs["content"] = _json.dumps(extra["body"]).encode() if isinstance(extra["body"], dict) else extra["body"]
            elif method == "GET" and extra.get("params"):
                req_kwargs["params"] = extra["params"]

            if method == "GET":
                resp = await self.client.get(url, **req_kwargs)
            elif method == "POST":
                resp = await self.client.post(url, **req_kwargs)
            else:
                resp = await self.client.request(method, url, **req_kwargs)

            resp.raise_for_status()
            raw_data = resp.json()

            # 按 JSONPath 提取数据
            items = await self._resolve_json_path(raw_data, json_path)
            if items is None:
                items = raw_data
            if not isinstance(items, list):
                items = [items]

            results = []
            for item in items if isinstance(items, list) else [items]:
                if not isinstance(item, dict):
                    continue
                for field, point_id in mapping.items():
                    val = item.get(field)
                    if val is not None:
                        try:
                            val = float(val)
                        except (ValueError, TypeError):
                            continue
                        results.append(PointValue(
                            device_id=self.device_id,
                            point_id=point_id,
                            point_name=point_id,
                            value=val,
                            data_type="float32",
                            unit="",
                            timestamp=datetime.utcnow(),
                        ))

            # 无 mapping 时直接将响应值作为测点
            if not results and isinstance(raw_data, dict):
                for k, v in raw_data.items():
                    try:
                        results.append(PointValue(
                            device_id=self.device_id, point_id=k,
                            point_name=k, value=float(v),
                            data_type="float32", unit="",
                            timestamp=datetime.utcnow(),
                        ))
                    except (ValueError, TypeError):
                        pass

            logger.info(f"[http_rest] {self.device_id} 读取成功 url={url} points={len(results)}")
            return results

        except Exception as e:
            logger.warning(f"[http_rest] {self.device_id} 读取失败 url={url}: {e}")
            self._connected = False
            return []

    async def read_holding(self, addr: int, count: int = 1, slave_id: Optional[int] = None) -> Optional[list]:
        """REST 不支持寄存器读取"""
        return None
