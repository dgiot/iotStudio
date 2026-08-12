"""
Parse Cloud Functions — 移植自 parse-server/server/cloud/
=========================================================
对标 Parse.Cloud.define() 云函数机制。

端点:
  POST /api/functions/{name}  调用云函数
  GET  /api/functions          列出可用云函数

移植的函数:
  hello       — 健康检查
  exist       — 字段唯一性验证
  authorize   — OAuth 三方登录跳转 (钉钉/微信/GitHub)
  notify      — 发送通知 (钉钉/邮件)
"""
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional, Any
import logging

log = logging.getLogger("cloud")
router = APIRouter(prefix="/api/functions", tags=["Cloud Functions"])

# ═══════════════════════════════════════════════════════════
# 云函数注册表
# ═══════════════════════════════════════════════════════════

FUNCTIONS = {}


def cloud_func(name: str):
    """装饰器: 注册云函数"""
    def deco(fn):
        FUNCTIONS[name] = fn
        return fn
    return deco


# ═══════════════════════════════════════════════════════════
# 核心云函数
# ═══════════════════════════════════════════════════════════

@cloud_func("hello")
async def hello(params: dict, request: Request) -> Any:
    """健康检查 — 对标 Parse.Cloud.define('hello')"""
    return {"result": "Hi from iotStudio", "timestamp": __import__('time').time()}


@cloud_func("exist")
async def exist(params: dict, request: Request) -> Any:
    """字段唯一性验证 — 对标 Parse.Cloud.define('exist')
    Parse 表结构: objectId + data(JSON) + ACL + createdAt + updatedAt
    """
    import sqlite3, os, json
    table = params.get("table")
    key = params.get("key")
    value = params.get("value")
    ignore = params.get("ignore")

    if not table or not key or value is None:
        raise HTTPException(400, "table, key, value required")

    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'parse.db')
    if not os.path.exists(db_path):
        db_path = os.path.join(os.getcwd(), 'data', 'parse.db')
    conn = sqlite3.connect(db_path)
    try:
        # Parse 将字段存入 JSON data 列, JSON 格式带空格: "key": "value"
        patterns = [
            '%\"' + key + '\": \"' + value + '\"%',   # "key": "value"
            '%\"' + key + '\":\"' + value + '\"%',     # "key":"value" (紧凑)
            '%\"' + value + '\"%',                     # 值匹配
        ]
        row = None
        for pat in patterns:
            cur = conn.execute(
                f'SELECT objectId, data FROM \"{table}\" WHERE data LIKE ?',
                (pat,)
            )
            row = cur.fetchone()
            if row:
                break
        if row:
            obj_id = row[0]
            if ignore and str(obj_id) == str(ignore):
                raise HTTPException(404, "OBJECT_NOT_FOUND")
            return True
        raise HTTPException(404, "OBJECT_NOT_FOUND")
    finally:
        conn.close()


@cloud_func("authorize")
async def authorize(params: dict, request: Request) -> Any:
    """OAuth 三方授权跳转地址 — 对标 Parse.Cloud.define('authorize')
    参数: {state: 'dingtalk'|'github'|'wechat'}
    返回: {url: 授权地址}
    """
    from urllib.parse import urlencode

    state = params.get("state", "")
    # 配置 (可从 config.yaml 读取)
    oauth_config = {
        "dingtalk": {
            "url": "https://oapi.dingtalk.com/connect/oauth2/sns_authorize",
            "appid": "YOUR_DINGTALK_APPID",
            "scope": "snsapi_login",
        },
        "github": {
            "url": "https://github.com/login/oauth/authorize",
            "client_id": "YOUR_GITHUB_CLIENT_ID",
            "scope": "user",
        },
        "wechat": {
            "url": "https://open.weixin.qq.com/connect/qrconnect",
            "appid": "YOUR_WECHAT_APPID",
            "scope": "snsapi_login",
        },
    }

    cfg = oauth_config.get(state)
    if not cfg:
        raise HTTPException(400, f"Unknown OAuth state: {state}")

    params_dict = {
        "state": state,
        "response_type": "code",
    }
    if "appid" in cfg:
        params_dict["appid"] = cfg["appid"]
    if "client_id" in cfg:
        params_dict["client_id"] = cfg["client_id"]
    if "scope" in cfg:
        params_dict["scope"] = cfg["scope"]

    auth_url = cfg["url"] + "?" + urlencode(params_dict)
    return {"url": auth_url, "state": state}


@cloud_func("notify")
async def notify(params: dict, request: Request) -> Any:
    """发送通知 — 对标 Notification 适配器
    参数: {type: 'dingtalk'|'mail', to: 'xxx', subject: '...', body: '...'}
    """
    ntype = params.get("type", "mail")
    to = params.get("to", "")
    subject = params.get("subject", "")
    body = params.get("body", "")

    if ntype == "dingtalk":
        # 钉钉群机器人 Webhook
        import httpx
        webhook = params.get("webhook", "")
        if not webhook:
            raise HTTPException(400, "DingTalk webhook required")
        async with httpx.AsyncClient() as client:
            resp = await client.post(webhook, json={
                "msgtype": "text",
                "text": {"content": f"{subject}\n{body}"}
            }, timeout=10)
        return {"sent": resp.is_success, "type": "dingtalk"}

    elif ntype == "mail":
        # SMTP 邮件
        import smtplib
        from email.mime.text import MIMEText
        smtp_cfg = params.get("smtp", {})
        msg = MIMEText(body, "html", "utf-8")
        msg["Subject"] = subject
        msg["From"] = smtp_cfg.get("from", "dgiot@iotn2n.com")
        msg["To"] = to
        try:
            with smtplib.SMTP(smtp_cfg.get("host", "localhost"), smtp_cfg.get("port", 25)) as server:
                if smtp_cfg.get("username"):
                    server.login(smtp_cfg["username"], smtp_cfg["password"])
                server.sendmail(msg["From"], [to], msg.as_string())
            return {"sent": True, "type": "mail"}
        except Exception as e:
            log.error(f"Mail send failed: {e}")
            raise HTTPException(500, f"Mail failed: {e}")

    raise HTTPException(400, f"Unknown notify type: {ntype}")


# ═══════════════════════════════════════════════════════════
# 端点
# ═══════════════════════════════════════════════════════════

class FunctionCall(BaseModel):
    params: dict = {}

@router.post("/{name}")
async def call_function(name: str, body: FunctionCall, request: Request):
    """调用云函数 — POST /api/functions/{name}"""
    if name not in FUNCTIONS:
        raise HTTPException(404, f"Function not found: {name}")
    try:
        result = await FUNCTIONS[name](body.params, request)
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        log.error(f"Cloud function '{name}' error: {e}")
        raise HTTPException(500, str(e))

@router.get("")
async def list_functions():
    """列出可用云函数"""
    return {"functions": list(FUNCTIONS.keys())}
