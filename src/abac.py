"""ABAC 策略决策点 (PDP) — MQTT ACL 面

帕兰提吸收 P2 第一刀: 只学 OPA/Cedar 的形 (属性策略 + marking + 决策 API),
不引入任何外部策略引擎依赖。

契约 (与 EMQX emqx_auth_http ACL 响应同形):
    decide(subject, action, topic) -> {"decision": "allow|deny|ignore", "reason": str}
    - ignore = 本 PDP 不表态, ACL 链交给下一个判定者 (与 dgiot 自有 ACL 共存)

主题文法 (CLAUDE.md 教义, 不容变体):
    dgiot/{site}/{gateway}/{device}/{point}/data
    订阅可带通配: dgiot/{site}/# 、dgiot/{site}/{gateway}/+ 等

Marking (密级): public(0) < internal(1) < restricted(2) < secret(3)
    读 (subscribe) 要求主体 clearance 支配主题 marking; 写 (publish) 走所有权规则。

策略热更新: data/abac_policies.json mtime 变化即重载 — broker 全程不重启
(验收条件 2)。策略文件缺省时使用内置种子策略。
"""
import fnmatch
import json
import os
import re
import threading
import time

# ── 主题文法: 教义固定, 策略不可改 ──
TOPIC_RE = re.compile(
    r"^dgiot/(?P<site>[^/#/+]+)/(?P<gateway>[^/#/+]+)/(?P<device>[^/#/+]+)"
    r"/(?P<point>[^/#/+]+)/data$")
SUB_WILDCARD_RE = re.compile(r"^dgiot(?P<rest>/.*)?$")

CLEARANCE = {"public": 0, "internal": 1, "restricted": 2, "secret": 3}

SEED_POLICIES = {
    "default": "ignore",          # 无主体匹配时: ignore → 让 dgiot 自有 ACL 接手
    "subjects": [
        {"match": {"username": "dev-*"},           # 设备: 站点/设备身份在用户名里
         "attrs": {"role": "device", "site": "FROM_NAME", "device": "FROM_NAME"}},
        {"match": {"username": "gw-*"},            # 网关: 站点在用户名里 gw-{site}-*
         "attrs": {"role": "gateway", "site": "FROM_NAME", "clearance": "internal"}},
        {"match": {"username": "edge-hub"},        # 边缘中枢: 全订阅者 (内部密级)
         "attrs": {"role": "edge", "clearance": "internal"}},
        {"match": {"username": "operator-*"},
         "attrs": {"role": "operator", "clearance": "internal"}},
        {"match": {"username": "admin"},
         "attrs": {"role": "admin", "clearance": "secret"}},
    ],
    "markings": {                 # 资源密级: 站点缺省 + 设备覆盖
        "site_default": "public",
        "sites": {},
        "devices": {},
    },
}

_lock = threading.Lock()
_cache = {"mtime": None, "policies": None, "checked": 0.0}


def _policies_path():
    return os.environ.get("ABAC_POLICIES_PATH") or os.path.join(
        "data", "abac_policies.json")


def _name_attr(username: str) -> dict:
    """从用户名提取站点/设备身份: dev-{site}-{rest} → site + 设备=完整用户名"""
    if username.startswith("dev-"):
        rest = username[4:]
        if rest:
            return {"site": rest.split("-")[0], "device": username}
    if username.startswith("gw-"):
        rest = username[3:].rstrip("-")
        if rest:
            return {"site": rest.split("-")[0]}
    return {}


def load_policies(force: bool = False) -> dict:
    """mtime 变化自动重载 (热更新); 检查节流 2s"""
    path = _policies_path()
    with _lock:
        try:
            mtime = os.path.getmtime(path)
        except OSError:
            mtime = None
        if (force or _cache["policies"] is None
                or mtime != _cache["mtime"]) and mtime is not None:
            try:
                with open(path, encoding="utf-8") as f:
                    user = json.load(f)
                merged = dict(SEED_POLICIES)
                merged.update(user)
                _cache["policies"] = merged
                _cache["mtime"] = mtime
            except (OSError, ValueError):
                pass  # 坏文件: 沿用旧策略, 不崩
        _cache["checked"] = time.time()
        return _cache["policies"] or SEED_POLICIES


def resolve_subject(username: str = "", clientid: str = "") -> dict:
    """主体解析: 按 match 模板 (fnmatch glob) 找属性, FIRST-MATCH 胜。
    身份占位: FROM_NAME=从 username 提取, FROM_CLIENT=从 clientid 提取"""
    pol = load_policies()
    name_src = _name_attr(username)
    client_src = _name_attr(clientid)
    for entry in pol.get("subjects", []):
        m = entry.get("match", {})
        um, cm = m.get("username"), m.get("clientid")
        if um and username and not fnmatch.fnmatch(username, um):
            continue
        if cm and clientid and not fnmatch.fnmatch(clientid, cm):
            continue
        if not (um or cm):
            continue
        attrs = dict(entry.get("attrs", {}))
        for key in ("site", "device"):
            if attrs.get(key) == "FROM_NAME" and name_src.get(key):
                attrs[key] = name_src[key]
            elif attrs.get(key) == "FROM_CLIENT" and client_src.get(key):
                attrs[key] = client_src[key]
        return attrs
    return {}


def topic_marking(topic_fields: dict, pol: dict) -> str:
    mk = pol.get("markings", {})
    dev = mk.get("devices", {}).get(topic_fields.get("device") or "")
    if dev:
        return dev if dev in CLEARANCE else "public"
    site = mk.get("sites", {}).get(topic_fields.get("site") or "")
    if site and site in CLEARANCE:
        return site
    return mk.get("site_default", "public")


def _deny_or_default(pol: dict, reason: str) -> dict:
    if pol.get("default") == "deny":
        return {"decision": "deny", "reason": reason}
    return {"decision": "ignore", "reason": reason}


def decide(username: str = "", clientid: str = "", action: str = "",
           topic: str = "") -> dict:
    """决策入口 — action ∈ publish|subscribe (EMQX 面只有这两个动作)"""
    pol = load_policies()
    action = (action or "").lower()
    if action not in ("publish", "subscribe"):
        return {"decision": "ignore", "reason": f"unknown action '{action}'"}

    if action == "publish":
        m = TOPIC_RE.match(topic or "")
        if not m:
            # 主题文法违规 = 教义红线, 直接拒绝 (不是 ignore)
            return {"decision": "deny", "reason": "topic grammar violation"}
        fields = m.groupdict()
    else:
        m = SUB_WILDCARD_RE.match(topic or "")
        if not m:
            return {"decision": "deny", "reason": "topic grammar violation"}
        parts = [p for p in (m.group("rest") or "").split("/") if p]

        def slot(i):
            v = parts[i] if len(parts) > i else None
            return None if v in ("#", "+") else v

        fields = {"site": slot(0), "gateway": slot(1),
                  "device": slot(2), "point": slot(3)}

    subj = resolve_subject(username=username, clientid=clientid)
    role = subj.get("role")
    if role is None:
        return _deny_or_default(pol, "subject not matched by any policy")

    # ── marking 判定 (读面) ──
    clearance = subj.get("clearance", "public")
    if action == "subscribe":
        need = topic_marking(fields, pol)
        if CLEARANCE.get(clearance, 0) < CLEARANCE.get(need, 0):
            return {"decision": "deny",
                    "reason": f"clearance '{clearance}' < marking '{need}'"}

    # ── 角色规则 ──
    site, device = fields.get("site"), fields.get("device")
    if role == "device":
        if subj.get("site") != site:
            return {"decision": "deny", "reason": "cross-site access"}
        if action == "publish":
            if subj.get("device") != device:
                return {"decision": "deny", "reason": "not own device topic"}
            return {"decision": "allow", "reason": "device publishes own topic"}
        if device in (None, "+", "*") or subj.get("device") == device:
            return {"decision": "allow", "reason": "device reads own scope"}
        return {"decision": "deny", "reason": "device reads foreign topic"}

    if role == "gateway":
        if subj.get("site") != site:
            return {"decision": "deny", "reason": "cross-site access"}
        return {"decision": "allow",
                "reason": f"gateway {action} within site '{site}'"}

    if role == "edge":
        return {"decision": "allow", "reason": "edge hub full data plane"}

    if role == "operator":
        if action == "subscribe":
            return {"decision": "allow", "reason": "operator read (clearance ok)"}
        return {"decision": "deny", "reason": "operator cannot publish"}

    if role == "admin":
        return {"decision": "allow", "reason": "admin unrestricted"}

    return _deny_or_default(pol, f"role '{role}' has no rules")
