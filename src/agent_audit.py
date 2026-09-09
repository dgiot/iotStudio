# ============================================================
# R4: 质量审计 Agent + 建议审批闭环
# ============================================================
# 设计 (对标 Ontexus 审计范式 + Palantir Actions 审批链):
#   确定性内核 — 六维检查每步都是一次 ReAct 风格 trace (tool/input/observation),
#               无 LLM 也可完整运行 (边缘优先);
#   LLM 增强层 — 可选: 对聚合发现做一轮归因 + 起草 add_link 提案 (端点/词表/去重全验) ;
#   人工闭环   — 提案 (delete_link / add_link) 入库 pending, 仅 admin 审批执行,
#               绝不自动执行 — 与 R2 对账铁律同构;
#   审计留痕   — 每次运行 + 每条提案 + 执行回执全部落库, 即 Sovereign 式
#               "agent trace = 未来后训练原料" 的数据资产。
import json
import re
import secrets
import sqlite3
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Any, Callable, Dict, List, Optional

try:
    from .ontology import LINK_RELATIONS, Link
except ImportError:
    from ontology import LINK_RELATIONS, Link

# 审计库 (独立于动作审计库; 测试可 monkeypatch 重定向)
_AGENT_DB_PATH: str = "data/aip_agent.db"

_SEV_DEDUCTION = {"high": 10, "medium": 4, "low": 1}


def _agent_db() -> sqlite3.Connection:
    db = sqlite3.connect(_AGENT_DB_PATH)
    db.execute("""CREATE TABLE IF NOT EXISTS agent_proposals (
        id TEXT PRIMARY KEY, kind TEXT, payload TEXT, rationale TEXT,
        status TEXT DEFAULT 'pending', created_at TEXT,
        decided_by TEXT DEFAULT '', decided_at TEXT DEFAULT '',
        receipt TEXT DEFAULT '')""")
    db.execute("""CREATE TABLE IF NOT EXISTS agent_runs (
        id TEXT PRIMARY KEY, started_at TEXT, score REAL, grade TEXT,
        with_llm INTEGER, findings TEXT, trace TEXT)""")
    return db


def _save_proposal(kind: str, payload: dict, rationale: str) -> dict:
    pid = f"prp_{secrets.token_hex(5)}"
    ts = datetime.now().isoformat()
    db = _agent_db()
    try:
        db.execute("INSERT INTO agent_proposals VALUES (?,?,?,?,?,?,?,?,?)",
                   (pid, kind, json.dumps(payload, ensure_ascii=False),
                    rationale, "pending", ts, "", "", ""))
        db.commit()
        return {"id": pid, "kind": kind, "payload": payload,
                "rationale": rationale, "status": "pending", "created_at": ts}
    finally:
        db.close()


def _list_proposals(status: str = None, limit: int = 100) -> list:
    sql = "SELECT id,kind,payload,rationale,status,created_at,decided_by,decided_at,receipt " \
          "FROM agent_proposals"
    args: list = []
    if status:
        sql += " WHERE status=?"
        args.append(status)
    sql += " ORDER BY created_at DESC LIMIT ?"
    args.append(int(limit))
    db = _agent_db()
    try:
        return [{"id": r[0], "kind": r[1], "payload": json.loads(r[2] or "{}"),
                 "rationale": r[3], "status": r[4], "created_at": r[5],
                 "decided_by": r[6], "decided_at": r[7],
                 "receipt": json.loads(r[8]) if r[8] else None}
                for r in db.execute(sql, args).fetchall()]
    finally:
        db.close()


def _get_proposal(proposal_id: str) -> Optional[dict]:
    db = _agent_db()
    try:
        r = db.execute("SELECT id,kind,payload,rationale,status,created_at,"
                       "decided_by,decided_at,receipt FROM agent_proposals "
                       "WHERE id=?", (proposal_id,)).fetchone()
        if r is None:
            return None
        return {"id": r[0], "kind": r[1], "payload": json.loads(r[2] or "{}"),
                "rationale": r[3], "status": r[4], "created_at": r[5],
                "decided_by": r[6], "decided_at": r[7],
                "receipt": json.loads(r[8]) if r[8] else None}
    finally:
        db.close()


def _decide_proposal(proposal_id: str, decision: str, by: str, receipt: dict = None) -> dict:
    db = _agent_db()
    try:
        r = db.execute("SELECT status FROM agent_proposals WHERE id=?",
                       (proposal_id,)).fetchone()
        if r is None:
            raise LookupError(f"提案 {proposal_id} 不存在")
        if r[0] != "pending":
            raise ValueError(f"提案状态为 '{r[0]}', 仅 pending 可审批")
        db.execute("UPDATE agent_proposals SET status=?, decided_by=?, decided_at=?, receipt=? "
                   "WHERE id=?",
                   (decision, by, datetime.now().isoformat(),
                    json.dumps(receipt, ensure_ascii=False) if receipt else "", proposal_id))
        db.commit()
        return {"id": proposal_id, "status": decision, "decided_by": by}
    finally:
        db.close()


def _save_run(report: dict) -> str:
    rid = f"run_{secrets.token_hex(5)}"
    db = _agent_db()
    try:
        db.execute("INSERT INTO agent_runs VALUES (?,?,?,?,?,?,?)",
                   (rid, report["started_at"], report["score"], report["grade"],
                    1 if report.get("with_llm") else 0,
                    json.dumps(report["findings"], ensure_ascii=False)[:50000],
                    json.dumps(report["trace"], ensure_ascii=False)[:50000]))
        db.commit()
        return rid
    finally:
        db.close()


def list_runs(limit: int = 20) -> list:
    db = _agent_db()
    try:
        rows = db.execute("SELECT id,started_at,score,grade,with_llm,findings "
                          "FROM agent_runs ORDER BY started_at DESC LIMIT ?",
                          (int(limit),)).fetchall()
        return [{"id": r[0], "started_at": r[1], "score": r[2], "grade": r[3],
                 "with_llm": bool(r[4]),
                 "finding_count": len(json.loads(r[5] or "[]"))} for r in rows]
    finally:
        db.close()


@dataclass
class AuditStep:
    """ReAct 风格 trace 步 — tool / input / observation"""
    tool: str
    input: str
    observation: str
    findings: List[dict] = field(default_factory=list)


class AuditAgent:
    """质量审计 Agent — 确定性六维检查 + 可选 LLM 归因增强 + 审批提案生成"""

    def __init__(self, engine, rag=None, receipt_fn: Optional[Callable] = None):
        self.engine = engine
        self.rag = rag
        self._receipt_fn = receipt_fn   # (action, target_id, params, status, result) -> receipt

    # ── 对外主入口 ──

    def run_audit(self, with_llm: bool = False) -> dict:
        started = datetime.now().isoformat()
        steps: List[AuditStep] = []
        steps.append(self._check_integrity())
        steps.append(self._check_isolation())
        steps.append(self._check_mapping_coverage())
        steps.append(self._check_constraint_wiring())
        steps.append(self._check_coverage())
        steps.append(self._check_naming())

        findings = [f for s in steps for f in s.findings]
        score, grade = self._score(findings)

        proposals: List[dict] = []
        for f in findings:
            p = f.get("proposal")
            if p:
                proposals.append(_save_proposal(p["kind"], p["payload"],
                                                f.get("message", "")))

        llm_note = ""
        llm_ok = False
        if with_llm and self.rag is not None and getattr(self.rag, "_llm", None):
            extra, llm_note, llm_ok = self._llm_reason(findings)
            for p in extra:
                proposals.append(_save_proposal(p["kind"], p["payload"],
                                                p.get("rationale", "LLM 建议")))
        report = {
            "started_at": started,
            "score": score, "grade": grade,
            "summary": self._summarize(findings),
            "findings": findings,
            "proposals": proposals,
            "trace": [asdict(s) for s in steps],
            "with_llm": llm_ok,
            "llm_note": llm_note or ("llm 未启用" if with_llm else "确定性模式 (with_llm=False)"),
        }
        report["run_id"] = _save_run(report)
        return report

    # ── 六维确定性检查 (每步 = trace 一步) ──

    def _check_integrity(self) -> AuditStep:
        """维1 引用完整性 — 复用 validate() (断引用/自环/未知词/rule_kind)"""
        v = self.engine.validate()
        findings = []
        for issue in v["issues"]:
            m = re.search(r"Link (\S+):", issue)
            if m and ("not found" in issue or "自环" in issue or "未知关系词" in issue):
                lid = m.group(1)
                findings.append({
                    "kind": "broken_ref", "severity": "high", "target": lid,
                    "message": issue,
                    "proposal": {"kind": "delete_link", "payload": {"link_id": lid}}})
            else:
                findings.append({"kind": "integrity", "severity": "high",
                                 "target": "", "message": issue})
        return AuditStep("integrity_check", "engine.validate()",
                         f"{len(v['issues'])} 个完整性问题",
                         findings)

    def _check_isolation(self) -> AuditStep:
        """维2 孤立实体 — 无边, 或所有邻居都是幽灵引用 (父引用悬空即事实孤立)"""
        adj = self.engine._undirected_adjacency()
        findings = []
        checked = 0
        for table in (self.engine.gateways, self.engine.channels,
                      self.engine.devices, self.engine.points,
                      self.engine.datasources):
            for eid in table:
                checked += 1
                neighbors = [e["to"] for e in adj.get(eid, [])]
                if not any(self.engine.entity_type(n) for n in neighbors):
                    findings.append({
                        "kind": "isolated", "severity": "medium", "target": eid,
                        "message": f"实体 {eid} 不在任何有效层级或关系边中 (孤立节点)",
                        "proposal": None})
        return AuditStep("isolation_check", f"{checked} runtime entities",
                         f"{len(findings)} 个孤立实体", findings)

    def _check_mapping_coverage(self) -> AuditStep:
        """维3 映射覆盖 — 通道↔数据源 maps_to 链完整性"""
        mapped_channels, mapped_ds = set(), set()
        for l in self.engine.links.values():
            if l.relation != "maps_to":
                continue
            if l.source in self.engine.channels and l.target in self.engine.datasources:
                mapped_channels.add(l.source); mapped_ds.add(l.target)
            elif l.source in self.engine.datasources and l.target in self.engine.channels:
                mapped_ds.add(l.source); mapped_channels.add(l.target)
        findings = []
        for cid in self.engine.channels:
            if cid not in mapped_channels:
                findings.append({"kind": "unmapped_channel", "severity": "low",
                                 "target": cid,
                                 "message": f"通道 {cid} 未与任何数据源建立 maps_to 映射"})
        for did in self.engine.datasources:
            if did not in mapped_ds:
                findings.append({"kind": "unmapped_datasource", "severity": "low",
                                 "target": did,
                                 "message": f"数据源 {did} 未被任何通道映射"})
        return AuditStep("mapping_check",
                         f"{len(self.engine.channels)} channels / "
                         f"{len(self.engine.datasources)} datasources",
                         f"{len(findings)} 个映射缺口", findings)

    def _check_constraint_wiring(self) -> AuditStep:
        """维4 约束接线 — constraint.entity 悬空引用 / 未接线"""
        findings = []
        unwired = 0
        for c in self.engine.constraints.values():
            if not c.entity:
                unwired += 1
                findings.append({"kind": "unwired_constraint", "severity": "low",
                                 "target": c.id,
                                 "message": f"约束 {c.id} 未接线 (entity 为空)"})
            elif self.engine.entity_type(c.entity) is None:
                findings.append({"kind": "broken_constraint_ref", "severity": "high",
                                 "target": c.id,
                                 "message": f"约束 {c.id} 指向不存在的实体 '{c.entity}'"})
        return AuditStep("constraint_check", f"{len(self.engine.constraints)} constraints",
                         f"{len(findings)} 个接线问题", findings)

    def _check_coverage(self) -> AuditStep:
        """维5 关系覆盖 — 设备无关系边 / 测点无告警配置"""
        linked_devices = set()
        for l in self.engine.links.values():
            linked_devices.update({l.source, l.target})
        findings = []
        for did, d in self.engine.devices.items():
            if did not in linked_devices:
                findings.append({"kind": "device_no_relation", "severity": "low",
                                 "target": did,
                                 "message": f"设备 {did} ({d.name}) 无任何关系边 "
                                            f"(powered_by/monitors/... 缺失)"})
        for pid, p in self.engine.points.items():
            if not p.alarm:
                findings.append({"kind": "point_no_alarm", "severity": "low",
                                 "target": pid,
                                 "message": f"测点 {pid} 无告警阈值配置"})
        return AuditStep("coverage_check",
                         f"{len(self.engine.devices)} devices / {len(self.engine.points)} points",
                         f"{len(findings)} 个覆盖缺口", findings)

    def _check_naming(self) -> AuditStep:
        """维6 命名冲突 — 同层级内重名"""
        findings = []
        for table, label in ((self.engine.devices, "device"),
                             (self.engine.channels, "channel"),
                             (self.engine.points, "point")):
            seen: Dict[str, list] = {}
            for eid, e in table.items():
                seen.setdefault(getattr(e, "name", ""), []).append(eid)
            for name, ids in seen.items():
                if name and len(ids) > 1:
                    findings.append({"kind": "duplicate_name", "severity": "low",
                                     "target": ids[0],
                                     "message": f"{label} 重名 '{name}': {', '.join(ids)}"})
        return AuditStep("naming_check", "devices+channels+points",
                         f"{len(findings)} 组重名", findings)

    # ── 评分与汇总 ──

    def _score(self, findings: List[dict]):
        """扣分制 + 每类封顶 (大面积低危覆盖缺口不应淹没结构性问题)"""
        caps = {"high": 30, "medium": 15, "low": 8}
        per_kind: Dict[str, int] = {}
        for f in findings:
            per_kind[f["kind"]] = per_kind.get(f["kind"], 0) + 1
        penalty = 0.0
        for kind, count in per_kind.items():
            sev = next(f["severity"] for f in findings if f["kind"] == kind)
            penalty += min(count * _SEV_DEDUCTION[sev], caps[sev])
        score = max(0.0, round(100.0 - penalty, 1))
        grade = "A" if score >= 90 else "B" if score >= 75 else "C" if score >= 60 else "D"
        return score, grade

    def _summarize(self, findings: List[dict]) -> dict:
        s: Dict[str, int] = {"high": 0, "medium": 0, "low": 0}
        kinds: Dict[str, int] = {}
        for f in findings:
            s[f["severity"]] += 1
            kinds[f["kind"]] = kinds.get(f["kind"], 0) + 1
        return {"severity": s, "kinds": dict(sorted(kinds.items(), key=lambda kv: -kv[1])),
                "total": len(findings)}

    # ── LLM 增强层 (可选; 全程验证, 垃圾输出安全丢弃) ──

    def _llm_reason(self, findings: List[dict]):
        """一轮 LLM 归因: 汇总发现 → 修复建议 + add_link 提案草案 (经校验后入库)"""
        try:
            digest = [{"kind": f["kind"], "severity": f["severity"],
                       "target": f["target"], "message": f["message"]} for f in findings]
            system = ("你是工业本体质量审计专家。基于发现清单给出: "
                      '1) "analysis": 归因分析 (<=300字); '
                      '2) "proposals": 修复提案数组, 每项 {kind:"add_link", payload:{source,target,relation}, rationale}。'
                      "仅当两端点都出现在发现消息里且关系词属于 maps_to/powered_by/monitors 时才提案; "
                      "没有把握就给空数组。只输出 JSON。")
            user = json.dumps(digest, ensure_ascii=False)[:6000]
            raw = self.rag._llm(system, user)
            m = re.search(r"\{.*\}|\[.*\]", raw, re.S)
            data = json.loads(m.group(0) if m else raw)
            props = data.get("proposals", []) if isinstance(data, dict) else data
            extra = []
            for p in props[:5]:
                if not isinstance(p, dict) or p.get("kind") != "add_link":
                    continue
                pl = p.get("payload", {})
                src, tgt, rel = pl.get("source"), pl.get("target"), pl.get("relation")
                if (src and tgt and rel in LINK_RELATIONS
                        and self.engine.entity_type(src) and self.engine.entity_type(tgt)
                        and src != tgt):
                    lid = f"lnk_{src}_{rel}_{tgt}"
                    if lid not in self.engine.links:
                        extra.append({"kind": "add_link",
                                      "payload": {"source": src, "target": tgt,
                                                  "relation": rel, "link_id": lid},
                                      "rationale": str(p.get("rationale", ""))[:300]})
            return extra, f"llm 归因完成, 校验后采纳 {len(extra)} 条提案", True
        except Exception as e:                       # LLM 输出不可信 → 安全丢弃
            return [], f"unavailable (LLM 归因失败: {e})", False

    # ── 提案执行 (仅审批后; 回执经 receipt_fn 落动作审计) ──

    def execute_proposal(self, proposal_id: str, by: str) -> dict:
        p = _get_proposal(proposal_id)
        if p is None:
            raise LookupError(f"提案 {proposal_id} 不存在")
        if p["status"] != "pending":
            raise ValueError(f"提案状态为 '{p['status']}', 仅 pending 可执行")
        eng = self.engine
        payload = p["payload"]
        if p["kind"] == "delete_link":
            lid = payload.get("link_id", "")
            if lid not in eng.links:
                raise ValueError(f"关系边 {lid} 已不存在 (可能已被删除)")
            removed = asdict(eng.links.pop(lid))
            result = {"removed": removed}
        elif p["kind"] == "add_link":
            src, tgt, rel = payload.get("source"), payload.get("target"), payload.get("relation")
            if rel not in LINK_RELATIONS:
                raise ValueError(f"未知关系词 '{rel}'")
            if eng.entity_type(src) is None or eng.entity_type(tgt) is None:
                raise ValueError("端点实体不存在")
            if src == tgt:
                raise ValueError("自环边不允许")
            lid = payload.get("link_id") or f"lnk_{src}_{rel}_{tgt}"
            if lid in eng.links:
                raise ValueError(f"关系边 {lid} 已存在")
            link = Link(id=lid, source=src, target=tgt, relation=rel,
                        description=f"审计提案 {proposal_id}")
            eng.register(link)
            result = {"link": asdict(link)}
        else:
            raise ValueError(f"未知提案类型 '{p['kind']}'")

        receipt = None
        if self._receipt_fn:
            receipt = self._receipt_fn(f"proposal_{p['kind']}", proposal_id, payload,
                                       "executed", result)
        return _decide_proposal(proposal_id, "approved", by, receipt)
