#!/usr/bin/env python3
# ============================================================
# iotStudio — JWT 认证模块
# ============================================================
import hashlib
import logging
import time
import hmac
import json
import base64
import os
import secrets
from typing import Optional
from fastapi import Request, HTTPException, Depends

log = logging.getLogger("auth")

# 简单 JWT（无外部依赖）
# 签名密钥不能用字面量：本目录是公开提交副本，写死等于把签发权交给所有人
# （谁都能自签一个 role=admin 的 token）。取值顺序：
#   环境变量 IOTSTUDIO_SECRET → data/secret.key（data/ 已 gitignore）→ 首次生成并落盘
# 落盘而非每次随机，是为了重启后既有 token 仍有效；升级到本版时旧 token 会失效一次。
def _load_secret() -> str:
    env = os.environ.get("IOTSTUDIO_SECRET")
    if env:
        return env
    path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "secret.key"
    )
    try:
        with open(path, encoding="utf-8") as fh:
            val = fh.read().strip()
        if val:
            return val
    except OSError:
        pass
    val = secrets.token_hex(32)
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(val)
        os.chmod(path, 0o600)
    except OSError:
        pass  # 只读盘：退化为进程内随机，重启换密钥，但不影响可用性
    return val


SECRET = _load_secret()
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

# 内置账号统一归到默认部门——管理页要显示部门列，不能有的有有的没有
for _u in USERS.values():
    _u.setdefault("department", "default")

# ═══════════════════════════════════════════════════════════
# 扩展账号 — 从 data/users.local.json 读（data/ 已 gitignore）
# ═══════════════════════════════════════════════════════════
# 本目录是**公开**提交副本，账号密码写进源码 = 写进公开历史，收不回来。
# 所以源码里只留上面几个演示账号，真实/模拟账号一律落在本地文件：
#
#   {"users": {"zhangsan": {"password": "明文或64位sha256", "role": "operator",
#                           "name": "张三", "department": "prod-dept", "desc": "…"}}}
#
# 明文密码在装载时哈希；已经是 64 位十六进制的按 sha256 直接用。
_USERS_LOCAL = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "users.local.json"
)


def _looks_like_sha256(s: str) -> bool:
    return len(s) == 64 and all(c in "0123456789abcdefABCDEF" for c in s)


def load_local_users(path: str = None) -> int:
    """装载扩展账号，返回装载条数。文件不存在 / 格式错都只是不打紧——静默跳过。"""
    p = path or _USERS_LOCAL
    if not os.path.exists(p):
        return 0
    try:
        with open(p, "r", encoding="utf-8") as f:
            raw = json.load(f)
    except Exception:
        return 0
    n = 0
    for username, d in (raw.get("users") or {}).items():
        if not username or not isinstance(d, dict):
            continue
        pw = str(d.get("password", ""))
        if not pw:
            continue
        USERS[username] = {
            "password": pw if _looks_like_sha256(pw) else hashlib.sha256(pw.encode()).hexdigest(),
            "role": d.get("role", "operator"),
            "name": d.get("name", username),
            "desc": d.get("desc", ""),
            "department": d.get("department", "default"),
            "enabled": d.get("enabled", True),
            "created": d.get("created", "-"),
            "source": "local",
        }
        n += 1
    return n


load_local_users()


def add_user(username: str, password: str, role: str = "operator", desc: str = "",
             department: str = "default", name: str = "") -> bool:
    """添加用户"""
    if not username or username in USERS:
        return False
    USERS[username] = {
        "password": hashlib.sha256(password.encode()).hexdigest(),
        "role": role,
        "name": name or username,
        "desc": desc,
        "department": department,
        "enabled": True,
        "created": time.strftime("%Y-%m-%d %H:%M"),
        "source": "runtime",
    }
    return True


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()


def _b64_decode(s: str) -> bytes:
    s += '=' * (4 - len(s) % 4)
    return base64.urlsafe_b64decode(s)


def _resolve_tenant(username: str) -> str:
    """用户名 → 租户。**全仓唯一解析处**，与 parse_lite._tenant_bundle 共用同一份查询。

    不在本模块另写一份角色查询 —— 「租户有两个来源」正是这一层的病根之一。

    ⚠️ 解析失败**返回 "default"，不返回空串**。空串在消费侧（parse_lite._tenant_visible）
    正好读作「不传租户 = 不过滤」—— 于是「查角色表出错」会静默变成「放行全部」，
    一个数据库抖动就等于关掉了隔离。回落成 default 与「用户没分角色」同一个桶，
    而多租户部署里别人家的命名空间照样看不见。
    """
    try:
        from .parse_lite import parse_tenants_of_username
        return parse_tenants_of_username(username).get("tenant_id") or "default"
    except Exception as e:
        log.warning(f"[auth] 解析 {username!r} 的租户失败, 回落 default: {e}")
        return "default"


def create_token(username: str, role: str, tenant_id: str = None) -> str:
    """生成 JWT token

    payload 里带 tenant_id 不是可选项：前端把 JWT 塞在 `sessionToken` 头里
    （frontend-vue/src/api/request.js:20），verify_token 直接成功 ⇒
    `_user_from_session`（唯一带 tenant_id 的那条分支）**对前端永不触发**。
    不带上，前端请求里 user.tenant_id 恒为 None，底座那套租户过滤就永远没有输入 ——
    机制写得再全，也只是又一处「有定义、没执行者」。
    """
    data = {
        "sub": username, "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_EXPIRE,
    }
    if tenant_id:
        data["tenant_id"] = tenant_id
    header = _b64_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = _b64_encode(json.dumps(data).encode())
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
    # 签发时解析一次（1 次查询在登录，不是每请求）
    return create_token(username, user["role"], _resolve_tenant(username))


# ===== FastAPI 依赖注入 =====

def extract_token(request: Request) -> Optional[str]:
    """从请求里取 JWT。

    兼容三种携带方式（按优先级）：
      1. Authorization: Bearer <jwt>   —— 标准写法，curl / 第三方集成用
      2. sessionToken: <jwt>           —— iotView 风格，前端 request.js 拦截器发的
      3. departmentToken: <jwt>        —— iotView 风格，同上（旧版键名）
    前端只发 2/3，后端原先只认 1，导致挂了 get_current_user 的
    /api/graphrag/* 全部 401（表现为「点图谱分析就报错」并弹回登录页）。
    """
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    for key in ("sessionToken", "departmentToken"):
        val = request.headers.get(key)
        if val:
            return val
    return None


def _user_from_session(token: str) -> Optional[dict]:
    """把 parse_lite 的会话行映射成和 JWT payload 同形的 dict。

    ⚠️ 本仓库有两套并行的登录态，别混：
      · auth.py 这套 —— `USERS` 字典 + 三段式 JWT，给脚本 / 第三方集成用
      · parse_lite 这套 —— `_User` / `_Session` 表 + `r:` 开头的不透明令牌，
        由 /api/login（parse_router）签发，**前端用的一直是这套**
    挂 get_current_user 的接口如果不认后者，前端带着真令牌进来照样 401 ——
    而前端 axios 拦截器遇 401 会清 token 跳登录页，表现为「一点就弹回登录」。
    """
    try:
        from .parse_lite import parse_get_user_by_session
        u = parse_get_user_by_session(token)
    except Exception:
        return None
    if not u:
        return None
    # 与 JWT payload 对齐：sub 放用户名（各接口按 sub 读操作人）
    return {
        "sub": u.get("username", ""),
        "role": u.get("role", "user"),
        "userId": u.get("objectId", ""),
        "tenant_id": u.get("tenant_id", "default"),
        "tenants": u.get("tenants", []),
        "via": "session",
    }


async def get_current_user(request: Request) -> dict:
    """解析当前用户 —— 兼容 Authorization / sessionToken / departmentToken，
    且兼容 JWT 与 _Session 两种令牌形态。"""
    token = extract_token(request)
    if not token:
        raise HTTPException(401, "未提供认证令牌")
    payload = verify_token(token)
    if payload is None:
        payload = _user_from_session(token)
    if payload is None:
        raise HTTPException(401, "令牌无效或已过期")
    # 老 token（签发时还没带 tenant_id）在这里补齐。
    # 补它的理由不是兼容，是**同形**：同一个人的 JWT 与会话两条路必须给出同一个租户，
    # 否则同一个人换个登录方式就看到不同的数据 —— 那不是策略，是 bug。
    if payload.get("tenant_id") is None and payload.get("sub"):
        payload["tenant_id"] = _resolve_tenant(payload["sub"])
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

