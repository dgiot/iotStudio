"""
Rules Engine — 边缘规则引擎
EventBus 驱动 + SQLite 规则库 + 条件匹配 + 动作执行
"""
import json, time, sqlite3, logging
from pathlib import Path
from typing import Optional, List, Any

log = logging.getLogger("rules")

RULE_DB = Path(__file__).parent.parent.parent / "data" / "rules.db"

class RulesEngine:
    def __init__(self, event_bus=None):
        self._bus = event_bus
        self._db = sqlite3.connect(str(RULE_DB))
        self._db.executescript("""
            CREATE TABLE IF NOT EXISTS rules (
                id TEXT PRIMARY KEY, name TEXT, enabled INTEGER DEFAULT 1,
                condition TEXT, action TEXT, severity TEXT DEFAULT 'warn',
                description TEXT, created TEXT, updated TEXT
            );
            CREATE TABLE IF NOT EXISTS rule_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ts TEXT, rule_id TEXT, device_id TEXT, point TEXT,
                value REAL, matched INTEGER, action_result TEXT
            );
        """)
        self._load_rules()
        if self._bus:
            self._bus.on("telemetry.received", self._on_telemetry)

    def _load_rules(self):
        self._rules = self._db.execute(
            "SELECT * FROM rules WHERE enabled=1").fetchall()
        log.info(f"[rules] loaded {len(self._rules)} rules")

    async def evaluate(self, device_id: str, points: List[Any]) -> None:
        """采集管道回调 — 处理一批采集值，逐点匹配规则"""
        for pv in points:
            try:
                val = getattr(pv, 'value', pv.get('value', 0)) if isinstance(pv, dict) else getattr(pv, 'value', 0)
                pid = getattr(pv, 'point_id', pv.get('point_id', '')) if isinstance(pv, dict) else getattr(pv, 'point_id', '')
                for row in self._rules:
                    try:
                        cond = json.loads(row[3])
                        action = json.loads(row[4])
                        if self._match(cond, device_id, pid, val):
                            self._execute(row[0], device_id, pid, val, action, cond)
                    except: pass
            except: pass

    def add_rule(self, rule_id: str, name: str, condition: dict,
                 action: dict, severity="warn", desc=""):
        """添加规则
        condition: {"field": "value", "op": ">", "threshold": 100}
        action: {"type": "alarm|notify|webhook", "target": "..."}
        """
        now = time.strftime("%Y-%m-%dT%H:%M:%S")
        self._db.execute("INSERT OR REPLACE INTO rules VALUES (?,?,1,?,?,?,?,?,?)",
                         (rule_id, name, json.dumps(condition),
                          json.dumps(action), severity, desc, now, now))
        self._db.commit()
        self._load_rules()

    def _on_telemetry(self, device_id, point, value, **kw):
        for row in self._rules:
            try:
                cond = json.loads(row[3])
                action = json.loads(row[4])
                if self._match(cond, device_id, point, value):
                    self._execute(row[0], device_id, point, value, action, cond)
            except: pass

    def _match(self, cond, device_id, point, value):
        if cond.get("device") and device_id != cond["device"]:
            return False
        if cond.get("point") and point != cond["point"]:
            return False
        op = cond.get("op", ">")
        threshold = cond.get("threshold")
        if threshold is not None:
            try:
                v = float(value)
                t = float(threshold)
                if op == ">" and v <= t: return False
                if op == "<" and v >= t: return False
                if op == ">=" and v < t: return False
                if op == "<=" and v > t: return False
                if op == "==" and v != t: return False
            except: return False
        return True

    def _execute(self, rule_id, device_id, point, value, action, cond):
        now = time.strftime("%Y-%m-%dT%H:%M:%S")
        atype = action.get("type", "log")
        result = "ok"

        if atype == "alarm":
            if self._bus:
                self._bus.emit("alarm.triggered", rule_id=rule_id,
                               device_id=device_id, point=point, value=value,
                               severity=cond.get("severity", "warn"),
                               message=f"{device_id}/{point}={value}")
            result = "alarm_created"

        elif atype == "notify":
            log.warning(f"[rule] {device_id}/{point}={value} → {action.get('message','')}")

        elif atype == "webhook":
            import urllib.request
            try:
                urllib.request.urlopen(action["url"],
                    data=json.dumps({"device":device_id,"point":point,"value":value}).encode(),
                    timeout=5)
                result = "webhook_sent"
            except Exception as e:
                result = f"webhook_fail:{e}"

        self._db.execute("INSERT INTO rule_log VALUES (NULL,?,?,?,?,?,?,?)",
                         (now, rule_id, device_id, point, value, 1, result))
        self._db.commit()
