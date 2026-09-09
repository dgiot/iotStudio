# ============================================================
# P1: ActionContract 三段式执行管线 — Palantir Actions 治理壳
# ============================================================
# Stage1 校验: 动作存在 + params_schema + submit_criteria + role
# Stage2 审批门: external_side_effect=True 的动作绝不自动执行 (R2 铁律
#               机制化) — 必须持有经人审批准的授权凭证 (auth_id)
# Stage3 执行+对账: executor 注入; 外部副作用结果不明 → reconciliation
#               = "pending", 人工对账, 绝不自动重放
# 全程 JSONL 审计留痕 (params 只记 hash, 不落原文)。
# 本模块零内部依赖 (engine/authorizer/executor 以参数注入), 可被
# graphrag_api / 插件 / 测试安全导入。
import hashlib
import json
import os
import threading
import time
from typing import Any, Callable, Dict, Optional, Tuple

from src.action_defs import ActionDefinition, get as get_def, role_allowed, \
    validate_params, check_submit_criteria

RECON_STATES = {"", "pending", "succeeded", "not_run", "retry"}


def _params_fingerprint(params: Dict[str, Any]) -> str:
    raw = json.dumps(params, sort_keys=True, ensure_ascii=False, default=str)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def _audit_path() -> str:
    return os.environ.get("ACTION_AUDIT_PATH",
                          os.path.join("data", "action_audit.jsonl"))


class MemoryAuthorizer:
    """进程内授权门 — 请求→(人工)批准→凭证。测试与单机默认实现。

    request() 只登记 pending 授权并返回 auth_id; 批准必须显式调用
    approve()/reject() (对应人类决策), 管线永不自动批准。
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._auth: Dict[str, dict] = {}
        self._seq = 0

    def request(self, action: str, fingerprint: str, role: str) -> str:
        with self._lock:
            self._seq += 1
            auth_id = f"act_{int(time.time() * 1000)}_{self._seq}"
            self._auth[auth_id] = {"action": action, "fingerprint": fingerprint,
                                   "role": role, "status": "pending",
                                   "decided_by": "", "uses": 0}
            return auth_id

    def approve(self, auth_id: str, by: str) -> dict:
        with self._lock:
            rec = self._auth.get(auth_id)
            if rec is None:
                raise LookupError(f"授权 {auth_id} 不存在")
            if rec["status"] != "pending":
                raise ValueError(f"授权状态为 '{rec['status']}', 仅 pending 可批")
            rec.update(status="approved", decided_by=by)
            return dict(rec)

    def reject(self, auth_id: str, by: str) -> dict:
        with self._lock:
            rec = self._auth.get(auth_id)
            if rec is None:
                raise LookupError(f"授权 {auth_id} 不存在")
            rec.update(status="rejected", decided_by=by)
            return dict(rec)

    def verify_and_consume(self, action: str, fingerprint: str,
                           auth_id: str) -> Tuple[bool, str, str]:
        """返回 (ok, decided_by, reason); ok 时占用一次使用额度"""
        with self._lock:
            rec = self._auth.get(auth_id)
            if rec is None:
                return False, "", "授权不存在"
            if rec["action"] != action or rec["fingerprint"] != fingerprint:
                return False, "", "授权与动作/参数不匹配"
            if rec["status"] == "rejected":
                return False, rec["decided_by"], "授权已被拒绝"
            if rec["status"] == "pending":
                return False, "", "授权待审批"
            if rec["status"] == "approved":
                if rec["uses"] >= 1:
                    return False, rec["decided_by"], "授权已使用 (一次性)"
                rec["uses"] += 1
                return True, rec["decided_by"], ""
            return False, "", f"未知授权状态 '{rec['status']}'"


class ActionPipeline:
    """ActionContract 三段式管线 — 对 Palantir Actions 的治理壳"""

    def __init__(self, engine, executor: Optional[Callable] = None,
                 authorizer: Optional[Any] = None,
                 audit_path: Optional[str] = None) -> None:
        self.engine = engine
        self.executor = executor          # fn(defn, target_id, params) -> dict
        self.authorizer = authorizer or MemoryAuthorizer()
        self._audit_path = audit_path

    # ── 审计留痕 (JSONL append; params 只记指纹) ──
    def _audit(self, event: dict) -> None:
        event["ts"] = int(time.time() * 1000)
        path = self._audit_path or _audit_path()
        try:
            os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
            with open(path, "a", encoding="utf-8") as f:
                f.write(json.dumps(event, ensure_ascii=False, default=str) + "\n")
        except OSError:
            pass  # 审计落盘失败不阻断管线; 内存态仍可用

    # ── Stage 1: 校验 ──
    def _validate(self, name: str, params: Dict[str, Any], role: str,
                  target_id: str):
        defn = get_def(name)
        if defn is None:
            return None, [f"动作 '{name}' 未注册"]
        errors = validate_params(defn, params or {})
        errors += check_submit_criteria(defn, self.engine, target_id, params or {})
        if not role_allowed(defn, role):
            errors.append(f"角色 '{role}' 不允许执行 '{name}'")
        return defn, errors

    # ── 主入口 ──
    def submit(self, action: str, params: Optional[Dict[str, Any]] = None,
               role: str = "admin", target_id: str = "",
               auth_id: str = "") -> dict:
        params = params or {}
        fp = _params_fingerprint(params)

        defn, errors = self._validate(action, params, role, target_id)
        if errors:
            self._audit({"event": "rejected", "action": action, "role": role,
                         "fingerprint": fp, "errors": errors})
            return {"state": "rejected", "errors": errors}

        # Stage 2: 审批门 — 外部副作用动作必须持批准凭证 (R2 铁律)
        if defn.external_side_effect:
            ok, decided_by, reason = self.authorizer.verify_and_consume(
                action, fp, auth_id)
            if not ok:
                if not auth_id:
                    new_id = self.authorizer.request(action, fp, role)
                    self._audit({"event": "awaiting_approval", "action": action,
                                 "role": role, "fingerprint": fp, "auth_id": new_id})
                    return {"state": "awaiting_approval", "auth_id": new_id,
                            "note": "外部副作用动作需人工审批后凭 auth_id 重提"}
                self._audit({"event": "gate_denied", "action": action,
                             "fingerprint": fp, "auth_id": auth_id,
                             "reason": reason})
                return {"state": "gate_denied", "reason": reason,
                        "auth_id": auth_id}
        else:
            decided_by = "auto:readonly"

        # Stage 3: 执行 + 对账
        if self.executor is None:
            self._audit({"event": "blocked", "action": action, "fingerprint": fp,
                         "reason": "executor 未配置"})
            return {"state": "blocked", "reason": "executor 未配置"}
        result = self.executor(defn, target_id, params) or {}
        recon = result.get("reconciliation", "")
        if defn.external_side_effect:
            # 执行器明确回报的对账态才采纳; 否则按 ok 推导 (空/未知 = 结果不明)
            if recon not in ("pending", "succeeded", "not_run", "retry"):
                recon = "succeeded" if result.get("ok") else "pending"
        record = {"event": "executed", "action": action, "role": role,
                  "fingerprint": fp, "target": target_id,
                  "decided_by": decided_by, "reconciliation": recon,
                  "result": result}
        self._audit(record)
        return {"state": "executed", "result": result,
                "reconciliation": recon, "decided_by": decided_by,
                "external_side_effect": defn.external_side_effect}
