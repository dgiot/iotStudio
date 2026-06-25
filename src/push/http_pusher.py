# ============================================================
# pythonIot — HTTP 推送器
# ============================================================
import json
import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False


class HTTPPusher:
    """HTTP 数据推送器"""

    def __init__(self, push_config: Dict[str, Any]):
        self.config = push_config
        self.endpoint = push_config.get("endpoint", "")
        self.method = push_config.get("method", "POST")
        self.headers = push_config.get("headers", {"Content-Type": "application/json"})
        self.token = push_config.get("token", "")
        self.timeout = push_config.get("timeout", 10)
        self._client = None

    async def push(self, message: Dict[str, Any]) -> bool:
        """推送消息到 HTTP 端点"""
        if not self.endpoint:
            return False
        if not HAS_HTTPX:
            logger.debug("[http] httpx 未安装，跳过推送")
            return False

        try:
            if self._client is None:
                self._client = httpx.AsyncClient(timeout=self.timeout)

            headers = dict(self.headers)
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"

            payload = json.dumps(message, ensure_ascii=False)
            resp = await self._client.post(
                self.endpoint,
                content=payload,
                headers=headers,
            )
            return resp.status_code < 400
        except Exception as e:
            logger.error(f"[http] 推送失败: {e}")
            return False
