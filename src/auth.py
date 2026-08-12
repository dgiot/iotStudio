#!/usr/bin/env python3
# ============================================================
# iotStudio — JWT 认证模块
# ============================================================
import hashlib
import time
import hmac
import json
import base64
from typing import Optional
from fastapi import Request, HTTPException, Depends

# 简单 JWT（无外部依赖）
SECRET = "iotStudio_2026_secret_key"
TOKEN_EXPIRE = 86400 * 7  # 7 天

# 默认用户
USERS = {
    "admin": {
        "password": hashlib.sha256(os.environ.get("ADMIN_PASS", "changeme").encode()).hexdigest(),
        "role": "admin",
        "name": "管理员",
        "desc": "系统管理员",
        "enabled": True,
        "created": "2026-01-01",
    },
    "dgiot_dev": {
        "password": hashlib.sha256("dgiot_dev".encode()).hexdigest(),
        "role": "admin",
        "name": "DG-IoT开发者",
        "desc": "平台开发者",
        "enabled": True,
        "created": "2026-01-01",
    },
    "dgiot": {
        "password": hashlib.sha256(os.environ.get("DG_PASS","changeme").encode()).hexdigest(),
        "role": "admin",
        "name": "DG-IoT管理员",
        "desc": "平台管理员",
        "enabled": True,
        "created": "2026-01-01",
    },
    "operator": {
        "password": hashlib.sha256("oper123".encode()).hexdigest(),
        "role": "operator",
        "name": "运维操作员",
        "desc": "日常运维",
        "enabled": True,
        "created": "2026-01-01",
    },
}


def add_user(username: str, password: str, role: str = "operator", desc: str = "") -> bool:
    """添加用户"""
    if not username or username in USERS:
        return False
    USERS[username] = {
        "password": hashlib.sha256(password.encode()).hexdigest(),
        "role": role,
        "name": username,
        "desc": desc,
        "enabled": True,
        "created": time.strftime("%Y-%m-%d %H:%M"),
    }
    return True


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()


def _b64_decode(s: str) -> bytes:
    s += '=' * (4 - len(s) % 4)
    return base64.urlsafe_b64decode(s)


def create_token(username: str, role: str) -> str:
    """生成 JWT token"""
    header = _b64_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = _b64_encode(json.dumps({
        "sub": username, "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_EXPIRE,
    }).encode())
    signature = _b64_encode(hmac.new(
        SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256
    ).digest())
    return f"{header}.{payload}.{signature}"


def verify_token(token: str) -> Optional[dict]:
    """验证 JWT token，返回 payload 或 None"""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header, payload, signature = parts
        expected_sig = _b64_encode(hmac.new(
            SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256
        ).digest())
        if not hmac.compare_digest(signature, expected_sig):
            return None
        data = json.loads(_b64_decode(payload))
        if data.get("exp", 0) < time.time():
            return None
        return data
    except Exception:
        return None


def authenticate(username: str, password: str) -> Optional[str]:
    """验证用户名密码，返回 token"""
    user = USERS.get(username)
    if not user:
        return None
    if user["password"] != hashlib.sha256(password.encode()).hexdigest():
        return None
    return create_token(username, user["role"])


# ===== FastAPI 依赖注入 =====

async def get_current_user(request: Request) -> dict:
    """从 Authorization header 解析当前用户"""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "未提供认证令牌")
    token = auth[7:]
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(401, "令牌无效或已过期")
    return payload


def require_role(role: str = "admin"):
    """角色要求装饰器"""
    async def dependency(request: Request) -> dict:
        user = await get_current_user(request)
        if user.get("role") != role and role != "any":
            raise HTTPException(403, "权限不足")
        return user
    return dependency


# ===== 多租户 — Parse CLP 等效中间件 =====
# DG-IoT 用 Parse _Role + ACL/CLP 做数据隔离。
# iotStudio 等效方案: X-Tenant-ID header + tenant_id column 过滤。

async def get_current_tenant(request: Request) -> str:
    """提取当前租户 ID — 优先级: JWT > Header > default"""
    # 1. 从 JWT 中提取
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        payload = verify_token(auth[7:])
        if payload and payload.get("tenant_id"):
            return payload["tenant_id"]
    # 2. 从 Header 中提取
    tid = request.headers.get("X-Tenant-ID")
    if tid:
        return tid
    # 3. 默认
    return "default"


def require_admin(user=Depends(get_current_user)):
    """要求 admin 角色"""
    if user.get("role") != "admin":
        raise HTTPException(403, "仅管理员可操作")
    return user

