"""
iotStudio GraphRAG — 本体图检索增强生成 (v1.0)
=================================================

基于 OntologyEngine 5 层模型的 GraphRAG 实现。
不引入 Neo4j/LangChain 等重型依赖，直接用本体图 + LLM 实现三层检索:

  Level 1: local_context()  — 单实体上下文检索
  Level 2: community_summary() — 层级社区摘要
  Level 3: graph_answer()    — 自然语言 → 图遍历 → LLM 回答

LLM 后端:
  - 可插拔 llm_call 回调，支持 Claude/GPT/本地模型
  - 内置 httpx 调用 Claude API (复用现有 httpx 依赖)

用法:
  from .ontology import build_131_ontology
  from .graphrag import GraphRAG

  engine = build_131_ontology()
  rag = GraphRAG(engine, llm_api_key="sk-...")
  answer = rag.ask("DEV_A 井的套压安全吗？")
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any, Callable, Dict, List, Optional

try:
    from .ontology import OntologyEngine
except ImportError:
    from ontology import OntologyEngine

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════
# EntityIndex — 纯 Python TF-IDF 语义实体索引 (零依赖)
# ═══════════════════════════════════════════════════════════


class EntityIndex:
    """纯 Python TF-IDF 实体索引 — 零外部依赖

    对 OntologyEngine 中全部实体构建倒排索引，支持:
      - TF-IDF 余弦相似度语义搜索
      - LLM 重排序 (可选，有 LLM 时自动启用)
      - 增量更新

    用法:
      idx = EntityIndex(engine)
      results = idx.search("变压器保护电流", top_k=5)
      # → [(entity_id, score, layer, name), ...]
    """

    def __init__(self, engine: OntologyEngine = None):
        self._docs: Dict[str, str] = {}       # entity_id → text
        self._meta: Dict[str, dict] = {}       # entity_id → {layer, name, type}
        self._term_to_docs: Dict[str, set] = {}  # term → set of doc_ids
        self._doc_vectors: Dict[str, Dict[str, float]] = {}  # entity_id → {term: tfidf}
        self._idf: Dict[str, float] = {}       # term → idf
        self._doc_count = 0
        if engine:
            self.build(engine)

    # ── 构建索引 ──
    def build(self, engine: OntologyEngine):
        """从 OntologyEngine 构建全文索引"""
        self._docs.clear(); self._meta.clear()
        self._term_to_docs.clear(); self._doc_vectors.clear()
        self._idf.clear(); self._doc_count = 0

        # 实体别名 (领域术语 → 实体ID) — 提升模糊查询匹配率
        _aliases = {
            "ch_a11_rtu": "A11 A11通道 A11采集 功图采集 RTU通道 行业协议",
            "ch_modbus_tcp": "modbus modbus通道 modbus采集",
            "dev_relay_00": "线路保护 DSL 过流保护 DSL-31A",
            "dev_relay_10": "变压器保护 变压器差动 DST 差动保护 DST-31A",
            "dev_relay_40": "电动机保护 电机保护 堵转 马达保护",
            "dev_relay_50": "变压器差动 DST-22D 变压器",
            "pt_tgp": "套压 套管压力 井口压力 压力",
            "pt_ia": "电流 A相电流 过流 相电流",
            "pt_ua": "电压 A相电压 相电压",
            "c_overcurrent": "过流 过流保护 过流跳闸 电流保护 跳闸",
            "c_voltage_abnormal": "电压异常 电压保护 过压 欠压",
            "c_motor_stall": "堵转 电机堵转 电动机保护",
        }

        for entity, layer in [
            *((s, "site") for s in engine.sites.values()),
            *((g, "gateway") for g in engine.gateways.values()),
            *((c, "channel") for c in engine.channels.values()),
            *((d, "device") for d in engine.devices.values()),
            *((p, "point") for p in engine.points.values()),
        ]:
            eid = entity.id
            # 构建富文本: name + type + description + 路径上下文 + 别名
            parts = [getattr(entity, 'name', '')]
            if eid in _aliases:
                parts.append(_aliases[eid])
            if hasattr(entity, 'type') and entity.type:
                parts.append(entity.type)
            if hasattr(entity, 'description') and entity.description:
                parts.append(entity.description)
            if hasattr(entity, 'protocol') and entity.protocol:
                parts.append(entity.protocol)
            if hasattr(entity, 'manufacturer') and entity.manufacturer:
                parts.append(entity.manufacturer)
            if hasattr(entity, 'model') and entity.model:
                parts.append(entity.model)
            if hasattr(entity, 'category') and entity.category:
                parts.append(entity.category)

            # 路径上下文
            try:
                if hasattr(entity, 'device') and entity.device:
                    dev = engine.devices.get(entity.device)
                    if dev: parts.append(dev.name)
                    ch = engine.channels.get(dev.channel) if dev else None
                    if ch: parts.append(f"{ch.name} {ch.protocol}")
            except: pass
            try:
                if hasattr(entity, 'channel') and entity.channel:
                    ch = engine.channels.get(entity.channel)
                    if ch: parts.append(f"{ch.name} {ch.protocol}")
                    gw = engine.gateways.get(ch.gateway) if ch else None
                    if gw: parts.append(gw.hostname)
            except: pass

            text = " ".join(p for p in parts if p)
            self._docs[eid] = text
            self._meta[eid] = {
                "layer": layer,
                "name": getattr(entity, 'name', eid),
                "type": getattr(entity, 'type', '') or getattr(entity, 'protocol', ''),
            }

        self._doc_count = len(self._docs)
        self._build_tfidf()

    def _tokenize(self, text: str) -> List[str]:
        """中英文混合分词"""
        import re
        tokens = []
        # 中文: 单字 + 双字组合 (bigram)
        chinese = re.findall(r'[一-鿿]+', text)
        for seg in chinese:
            tokens.extend(seg)  # unigram
            tokens.extend(seg[i:i+2] for i in range(len(seg)-1))  # bigram
        # 英文/数字: 按空格和标点切分
        english = re.findall(r'[a-zA-Z0-9_]+', text)
        tokens.extend(t.lower() for t in english)
        return [t for t in tokens if len(t) >= 1]

    def _build_tfidf(self):
        """构建 TF-IDF 向量"""
        # 第一遍: 统计文档频率
        for eid, text in self._docs.items():
            terms = set(self._tokenize(text))
            for t in terms:
                if t not in self._term_to_docs:
                    self._term_to_docs[t] = set()
                self._term_to_docs[t].add(eid)

        # 计算 IDF
        import math
        N = max(self._doc_count, 1)
        for term, docs in self._term_to_docs.items():
            self._idf[term] = math.log((N + 1) / (len(docs) + 1)) + 1

        # 第二遍: 构建文档向量
        for eid, text in self._docs.items():
            tokens = self._tokenize(text)
            tf = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            # TF normalization (log scale) + TF-IDF
            vec = {}
            for t, freq in tf.items():
                vec[t] = (1 + math.log(freq)) * self._idf.get(t, 0)
            self._doc_vectors[eid] = vec

    # ── 检索 ──
    def search(self, query: str, top_k: int = 10) -> List[Dict[str, Any]]:
        """TF-IDF 语义搜索

        Returns:
          [{entity_id, score, layer, name, type}, ...] 按 score 降序
        """
        import math
        q_tokens = self._tokenize(query)
        if not q_tokens:
            return []

        # 构建查询向量
        q_vec = {}
        for t in q_tokens:
            q_vec[t] = q_vec.get(t, 0) + 1
        for t, freq in q_vec.items():
            q_vec[t] = (1 + math.log(freq)) * self._idf.get(t, 0)

        # 计算余弦相似度
        q_norm = math.sqrt(sum(v * v for v in q_vec.values()))
        if q_norm == 0:
            return []

        scores = []
        for eid, d_vec in self._doc_vectors.items():
            dot = sum(q_vec.get(t, 0) * d_vec.get(t, 0) for t in q_vec)
            d_norm = math.sqrt(sum(v * v for v in d_vec.values()))
            if d_norm == 0:
                continue
            sim = dot / (q_norm * d_norm)
            if sim > 0:
                scores.append((eid, sim))

        scores.sort(key=lambda x: -x[1])
        results = []
        for eid, score in scores[:top_k]:
            meta = self._meta.get(eid, {})
            results.append({
                "id": eid,
                "score": round(score, 4),
                "layer": meta.get("layer", ""),
                "name": meta.get("name", eid),
                "type": meta.get("type", ""),
            })
        return results

    # ── LLM 重排序 ──
    def rerank(self, query: str, candidates: List[Dict],
               llm_call: Callable = None, top_k: int = 5) -> List[Dict]:
        """用 LLM 对候选实体重排序 — 理解用户意图再匹配

        Args:
          query: 用户查询
          candidates: TF-IDF 候选列表 (top 20)
          llm_call: LLM 调用函数
          top_k: 返回数量

        Returns:
          重排序后的候选列表
        """
        if not llm_call or len(candidates) <= top_k:
            return candidates[:top_k]

        # 构建 LLM prompt
        cand_text = "\n".join(
            f"{i+1}. [{c['layer']}] {c['name']} (id={c['id']}, type={c.get('type','')}) score={c['score']}"
            for i, c in enumerate(candidates[:20])
        )

        prompt = f"""用户查询: "{query}"

以下是从工业物联网本体中检索到的候选实体:

{cand_text}

请从候选列表中选出与用户查询最相关的实体 ID（最多 {top_k} 个）。
只返回 JSON 数组: ["id1", "id2", ...]
如果都不相关，返回空数组 []。"""

        try:
            response = llm_call(
                "你是工业物联网本体搜索引擎。根据用户查询重排序实体。只输出JSON数组。",
                prompt,
            )
            # 提取 JSON 数组
            import re
            match = re.search(r'\[(.*?)\]', response.replace('\n', ''))
            if match:
                ids = json.loads(f"[{match.group(1)}]")
                # 按 LLM 给出的顺序重建结果
                id_set = set(ids)
                reranked = [c for c in candidates if c["id"] in id_set]
                # 保持 LLM 给出的顺序
                reranked.sort(key=lambda c: ids.index(c["id"]) if c["id"] in ids else 999)
                return reranked[:top_k]
        except Exception as e:
            logger.warning(f"LLM rerank failed: {e}")

        return candidates[:top_k]

    def __len__(self):
        return self._doc_count


# ═══════════════════════════════════════════════════════════
# LiveContextStore — 实时遥测数据集成 (v1.0)
# ═══════════════════════════════════════════════════════════

class LiveContextStore:
    """实时遥测数据查询 — 从 telemetry.db 读取测点当前值

    与 OntologyEngine 本体结构配合，为 GraphRAG 回答注入实时数值。

    用法:
      live = LiveContextStore("data/telemetry.db")
      snap = live.device_snapshot("dev_well_DEV_A")
      # → {"device_id":"dev_well_DEV_A", "points": [
      #      {"point_id":"pt_tgp","value":8.52,"unit":"MPa","ts":"..."}, ...]}
    """

    def __init__(self, db_path: str = None):
        import os as _os
        if db_path is None:
            # 默认路径: iotStudio/data/telemetry.db
            db_path = _os.path.join(
                _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))),
                "data", "telemetry.db"
            )
        self._db_path = db_path
        self._available = _os.path.exists(db_path)

    @property
    def available(self) -> bool:
        return self._available

    def _connect(self):
        import sqlite3
        return sqlite3.connect(self._db_path)

    # ── 单测点最新值 ──
    def point_latest(self, point_id: str) -> Optional[Dict[str, Any]]:
        """获取单个测点的最新值"""
        if not self._available:
            return None
        try:
            db = self._connect()
            row = db.execute(
                "SELECT ts, device_id, point_id, point_name, value, unit, quality "
                "FROM telemetry WHERE point_id = ? ORDER BY ts DESC LIMIT 1",
                (point_id,)
            ).fetchone()
            db.close()
            if row:
                return {
                    "ts": row[0], "device_id": row[1], "point_id": row[2],
                    "point_name": row[3], "value": round(row[4], 4) if row[4] else 0,
                    "unit": row[5], "quality": row[6],
                }
        except Exception:
            pass
        return None

    # ── 设备所有测点最新值 ──
    def device_snapshot(self, device_id: str) -> Dict[str, Any]:
        """获取设备所有测点的最新值快照"""
        if not self._available:
            return {"device_id": device_id, "points": [], "available": False}

        try:
            db = self._connect()
            # 每个 point_id 取最新一条
            rows = db.execute(
                "SELECT t.point_id, t.point_name, t.value, t.unit, t.quality, t.ts "
                "FROM telemetry t "
                "INNER JOIN ("
                "  SELECT point_id, MAX(ts) as max_ts FROM telemetry "
                "  WHERE device_id = ? GROUP BY point_id"
                ") latest ON t.point_id = latest.point_id AND t.ts = latest.max_ts "
                "WHERE t.device_id = ?",
                (device_id, device_id)
            ).fetchall()
            db.close()

            points = [
                {"point_id": r[0], "point_name": r[1], "value": round(r[2], 4) if r[2] else 0,
                 "unit": r[3], "quality": r[4], "ts": r[5]}
                for r in rows
            ]
            return {"device_id": device_id, "points": points, "count": len(points), "available": True}
        except Exception:
            return {"device_id": device_id, "points": [], "available": True, "error": "query failed"}

    # ── 站点/通道/网关聚合 ──
    def channel_summary(self, engine: OntologyEngine, channel_id: str) -> Dict[str, Any]:
        """通道级聚合: 统计在线设备数、活跃测点数、告警测点数"""
        devices = engine.get_devices(channel_id)
        total_pts = 0
        online_devs = 0
        alarm_pts = 0

        for dev in devices:
            snap = self.device_snapshot(dev.id)
            if snap["points"]:
                online_devs += 1
                total_pts += snap["count"]
                # 检查是否有超阈值
                for pt in snap["points"]:
                    engine_pt = engine.points.get(pt["point_id"])
                    if engine_pt and engine_pt.alarm:
                        alarm = engine_pt.alarm
                        v = pt["value"]
                        if ("high" in alarm and v > alarm["high"]) or \
                           ("low" in alarm and v < alarm["low"]):
                            alarm_pts += 1

        return {
            "channel_id": channel_id,
            "devices": len(devices),
            "devices_online": online_devs,
            "total_points": total_pts,
            "alarm_points": alarm_pts,
            "available": self._available,
        }

    # ── 增强上下文 (注入实时值) ──
    def enhance_context(self, engine: OntologyEngine, entity_id: str) -> Dict[str, Any]:
        """增强 local_context — 为 Point/Device 注入实时值

        如果 entity 是 Point: 附加最新值 + 阈值判定
        如果 entity 是 Device: 附加所有测点最新值
        """
        ctx = engine.local_context(entity_id)
        if "error" in ctx or not self._available:
            ctx["live"] = {"available": False}
            return ctx

        layer = ctx["layer"]
        live_info = {"available": True, "ts": ""}

        if layer == "point":
            latest = self.point_latest(entity_id)
            if latest:
                live_info["value"] = latest["value"]
                live_info["unit"] = latest["unit"]
                live_info["ts"] = latest["ts"]
                # 阈值判定
                entity = engine.points.get(entity_id)
                if entity and entity.alarm:
                    alarm = entity.alarm
                    v = latest["value"]
                    if "hh" in alarm and v > alarm["hh"]:
                        live_info["status"] = "critical_high"
                    elif "high" in alarm and v > alarm["high"]:
                        live_info["status"] = "high"
                    elif "ll" in alarm and v < alarm["ll"]:
                        live_info["status"] = "critical_low"
                    elif "low" in alarm and v < alarm["low"]:
                        live_info["status"] = "low"
                    else:
                        live_info["status"] = "normal"
                    live_info["threshold"] = alarm

        elif layer == "device":
            snap = self.device_snapshot(entity_id)
            live_info["point_count"] = snap.get("count", 0)
            live_info["point_values"] = {
                p["point_id"]: {"value": p["value"], "unit": p["unit"], "ts": p["ts"]}
                for p in snap.get("points", [])[:20]
            }
            if snap.get("points"):
                live_info["ts"] = max(p["ts"] for p in snap["points"] if p.get("ts"))

        ctx["live"] = live_info
        # 更新 text_context 附加实时值
        if live_info.get("value") is not None:
            status_icon = {"normal": "✅", "high": "⚠️", "low": "⚠️", "critical_high": "🚨", "critical_low": "🚨"}.get(live_info.get("status"), "")
            ctx["text_context"] += f"\n【实时值】{status_icon} {live_info['value']} {live_info.get('unit','')} | 状态: {live_info.get('status','unknown')} | 时间: {live_info.get('ts','')}"
        elif live_info.get("point_count", 0) > 0:
            ctx["text_context"] += f"\n【实时数据】{live_info['point_count']} 个测点有数据 | 时间: {live_info.get('ts','')}"

        return ctx


# ═══════════════════════════════════════════════════════════
# TrendAnalyzer — 时序历史趋势分析 (v1.0)
# ═══════════════════════════════════════════════════════════

class TrendAnalyzer:
    """时序趋势分析 — 从 telemetry.db 查询历史数据，检测趋势/异常

    用法:
      ta = TrendAnalyzer("data/telemetry.db")
      trend = ta.analyze("pt_tgp", hours=1)
      # → {points: [{ts, value}], stats: {min,max,avg,change_rate}, anomaly: bool}
    """

    def __init__(self, db_path: str = None):
        import os as _os
        if db_path is None:
            db_path = _os.path.join(
                _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))),
                "data", "telemetry.db"
            )
        self._db_path = db_path
        self._available = _os.path.exists(db_path)

    @property
    def available(self) -> bool:
        return self._available

    def query(self, point_id: str, hours: float = 1, limit: int = 200) -> List[Dict]:
        """查询测点历史数据"""
        if not self._available:
            return []
        try:
            import sqlite3
            db = sqlite3.connect(self._db_path)
            # 取时间范围
            if hours > 0:
                cutoff = f"datetime('now', '-{hours} hours')"
                rows = db.execute(
                    "SELECT ts, value FROM telemetry WHERE point_id = ? AND ts >= "
                    f"datetime('now', '-{hours} hours') ORDER BY ts LIMIT ?",
                    (point_id, limit)
                ).fetchall()
            else:
                rows = db.execute(
                    "SELECT ts, value FROM telemetry WHERE point_id = ? ORDER BY ts DESC LIMIT ?",
                    (point_id, limit)
                ).fetchall()
            db.close()
            return [{"ts": r[0], "value": round(r[1], 4)} for r in rows]
        except Exception:
            return []

    def analyze(self, point_id: str, hours: float = 1) -> Dict[str, Any]:
        """趋势分析: 数据 + 统计 + 异常检测"""
        points = self.query(point_id, hours)
        if not points:
            return {"point_id": point_id, "points": [], "available": self._available, "stats": {}}

        values = [p["value"] for p in points]
        n = len(values)
        v_min, v_max = min(values), max(values)
        v_avg = round(sum(values) / n, 4)
        v_range = round(v_max - v_min, 4)

        # 变化率
        change_rate = round((values[-1] - values[0]) / max(abs(values[0]), 0.001), 4) if n >= 2 else 0

        # 波动率 (标准差/均值)
        import math
        variance = sum((v - v_avg) ** 2 for v in values) / n
        volatility = round(math.sqrt(variance) / max(abs(v_avg), 0.001), 4) if v_avg != 0 else 0

        # 异常检测
        anomalies = []
        # 1. 跳变检测: 相邻点变化 > 3σ
        if n >= 5:
            threshold = 3 * math.sqrt(variance) if variance > 0 else max(v_range * 0.5, 0.1)
            for i in range(1, n):
                if abs(values[i] - values[i-1]) > threshold:
                    anomalies.append({"index": i, "ts": points[i]["ts"], "value": values[i],
                                      "type": "jump", "delta": round(values[i] - values[i-1], 4)})

        # 2. 平坦线检测: 连续 10 点无变化
        if n >= 10:
            flat_run = 0
            for i in range(1, n):
                if values[i] == values[i-1]:
                    flat_run += 1
                    if flat_run >= 10:
                        anomalies.append({"index": i, "ts": points[i]["ts"], "value": values[i],
                                          "type": "flatline", "duration": flat_run})
                        break
                else:
                    flat_run = 0

        return {
            "point_id": point_id,
            "points": points,
            "count": n,
            "available": self._available,
            "hours": hours,
            "stats": {
                "min": v_min, "max": v_max, "avg": v_avg, "range": v_range,
                "change_rate": change_rate,         # 首尾变化率
                "volatility": volatility,            # 变异系数
                "direction": "up" if change_rate > 0.05 else ("down" if change_rate < -0.05 else "stable"),
            },
            "anomalies": anomalies,
            "has_anomaly": len(anomalies) > 0,
            "text_summary": self._summarize(point_id, points, v_min, v_max, v_avg, change_rate, volatility, anomalies),
        }

    @staticmethod
    def _summarize(point_id, points, v_min, v_max, v_avg, change_rate, volatility, anomalies) -> str:
        """生成趋势文本摘要 — LLM 友好"""
        n = len(points)
        lines = [
            f"测点 {point_id}: 过去时间段内共 {n} 个数据点",
            f"  范围: {v_min} ~ {v_max}, 均值: {v_avg}",
            f"  变化率: {change_rate:+.2%}, 波动率: {volatility:.2%}",
        ]
        if anomalies:
            lines.append(f"  异常: {len(anomalies)} 处")
            for a in anomalies[:3]:
                lines.append(f"    [{a['type']}] @{a['ts']} value={a['value']}")
        else:
            lines.append("  未检测到异常")
        return "\n".join(lines)


def parse_time_range(expr: str) -> Dict[str, Any]:
    """自然语言时间表达式 → (hours, label)

    支持:
      - "1h" / "过去1小时" / "最近1小时" / "last 1 hour" → hours=1
      - "6h" / "过去6小时" → hours=6
      - "24h" / "今天" / "过去24小时" / "last 24 hours" → hours=24
      - "昨天" / "yesterday" → hours=24, offset=24 (前24-48小时)
      - "7d" / "本周" / "过去7天" / "上周" / "last 7 days" → hours=168
      - "30d" / "本月" / "过去30天" → hours=720

    Returns:
      {hours: float, label: str, error: str|None}
    """
    import re
    expr = expr.strip().lower()

    # 精确数字匹配
    m = re.match(r'(\d+\.?\d*)\s*(h|hour|hours|d|day|days|w|week|weeks)', expr)
    if m:
        val = float(m.group(1))
        unit = m.group(2)
        if unit.startswith('d'):
            hours = val * 24
        elif unit.startswith('w'):
            hours = val * 168
        else:
            hours = val
        return {"hours": hours, "label": expr, "error": None}

    # 中文/英文语义匹配
    patterns = [
        (r'(过去|最近|近|last|past)\s*(\d+\.?\d*)\s*(小时|h|hour|hours)', lambda m: float(m.group(2))),
        (r'(过去|最近|近|last|past)\s*(\d+\.?\d*)\s*(天|日|d|day|days)', lambda m: float(m.group(2)) * 24),
        (r'(过去|最近|近|last|past)\s*(\d+\.?\d*)\s*(周|星期|w|week|weeks)', lambda m: float(m.group(2)) * 168),
        (r'^今天$|^today$|^24h$|^24小时$', lambda m: 24),
        (r'^昨天$|^yesterday$', lambda m: 24),
        (r'^本周$|^this week$|^7d$|^7天$', lambda m: 168),
        (r'^上周$|^last week$', lambda m: 168),
        (r'^本月$|^this month$|^30d$|^30天$', lambda m: 720),
        (r'^1h$|^1小时$|^一小时$|^one hour$', lambda m: 1),
        (r'^6h$|^6小时$', lambda m: 6),
        (r'^12h$|^12小时$', lambda m: 12),
    ]

    for pattern, extractor in patterns:
        m = re.match(pattern, expr)
        if m:
            hours = extractor(m)
            return {"hours": hours, "label": expr, "error": None}

    return {"hours": 1, "label": "1h (默认)", "error": f"无法解析 '{expr}'，使用默认值1小时"}


# ═══════════════════════════════════════════════════════════
# LLM 后端接口
# ═══════════════════════════════════════════════════════════

# 可注入的 LLM 调用签名
LlmCallable = Callable[[str, str], str]  # (system_prompt, user_prompt) -> response
LlmStreamCallable = Callable[[str, str], Any]  # generator yielding str chunks


def _build_claude_caller(api_key: str, model: str = "claude-sonnet-5",
                         base_url: str = "https://api.anthropic.com/v1") -> LlmCallable:
    """构建 Claude API 调用器 — 使用项目已有的 httpx"""

    def call(system_prompt: str, user_prompt: str) -> str:
        import httpx

        resp = httpx.post(
            f"{base_url}/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 1024,
                "system": system_prompt,
                "messages": [
                    {"role": "user", "content": user_prompt},
                ],
            },
            timeout=30.0,
        )
        if resp.status_code != 200:
            logger.error(f"Claude API error {resp.status_code}: {resp.text[:500]}")
            return f"[LLM 调用失败: HTTP {resp.status_code}]"
        data = resp.json()
        return data["content"][0]["text"]

    return call


def _build_openai_caller(api_key: str, model: str = "gpt-4o",
                         base_url: str = "https://api.openai.com/v1") -> LlmCallable:
    """构建 OpenAI 兼容 API 调用器 (也支持 vLLM/Ollama 等兼容服务)"""

    def call(system_prompt: str, user_prompt: str) -> str:
        import httpx

        resp = httpx.post(
            f"{base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 1024,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                **({"options": {"num_gpu": 0}} if "11434" in base_url else {}),
            },
            timeout=60.0,
        )
        if resp.status_code != 200:
            logger.error(f"OpenAI API error {resp.status_code}: {resp.text[:500]}")
            return f"[LLM 调用失败: HTTP {resp.status_code}]"
        return resp.json()["choices"][0]["message"]["content"]

    return call


# ═══════════════════════════════════════════════════════════
# GraphRAG 核心
# ═══════════════════════════════════════════════════════════

GRAPH_RAG_SYSTEM_PROMPT = """你是 DG-IoT 工业物联网平台的智能助手，负责基于本体知识图谱回答用户问题。

## 你的知识来源
你收到的上下文来自工厂现场的 5 层本体模型：
- Site (站点) → Gateway (IO网关) → Channel (协议通道) → Device (设备) → Point (测点)
- 以及关联的 Constraint (安全约束规则)

## 回答规则
1. **基于上下文**: 只根据提供的上下文回答，不要编造信息
2. **承认边界**: 如果上下文不足以回答问题，明确告知用户
3. **工业用语**: 使用工业自动化/物联网专业术语，保持简洁
4. **告警标注**: 如果关联约束被触发，明确标注严重级别
5. **数值精确**: 引用数值时保留原始精度和单位

## 回答格式
- 先给出直接结论 (1-2句)
- 再列出支持证据 (context中哪些信息支持这个结论)
- 如有不确定，标注 [推测] 或 [待确认]
"""


class GraphRAG:
    """GraphRAG — 本体图检索增强问答

    Parameters:
      engine: OntologyEngine 实例 (含完整 5 层实体数据)
      llm_call: LLM 调用函数 (system_prompt, user_prompt) -> str
                不传则使用 API key 构建 Claude 调用器
      llm_api_key: Claude/OpenAI API key
      llm_model: 模型名称
      llm_provider: "claude" | "openai"
      llm_base_url: API base URL (用于代理或兼容服务)
    """

    def __init__(
        self,
        engine: OntologyEngine,
        llm_call: LlmCallable = None,
        llm_api_key: str = None,
        llm_model: str = None,
        llm_provider: str = "claude",
        llm_base_url: str = None,
        telemetry_db: str = None,
    ):
        self.engine = engine

        # ── 实时数据 + 趋势分析 ──
        self._live = LiveContextStore(telemetry_db)
        self._trend = TrendAnalyzer(telemetry_db)

        # LLM 后端初始化
        if llm_call:
            self._llm = llm_call
        elif llm_api_key:
            if llm_provider == "openai":
                model = llm_model or "gpt-4o"
                base_url = llm_base_url or "https://api.openai.com/v1"
                self._llm = _build_openai_caller(llm_api_key, model, base_url)
            else:
                model = llm_model or "claude-sonnet-5"
                base_url = llm_base_url or "https://api.anthropic.com/v1"
                self._llm = _build_claude_caller(llm_api_key, model, base_url)
        else:
            # 尝试从环境变量自动检测
            anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
            openai_key = os.environ.get("OPENAI_API_KEY")
            if anthropic_key:
                model = llm_model or "claude-sonnet-5"
                self._llm = _build_claude_caller(anthropic_key, model)
                llm_provider = "claude"
            elif openai_key:
                model = llm_model or "gpt-4o"
                self._llm = _build_openai_caller(openai_key, model)
                llm_provider = "openai"
            else:
                logger.warning("No LLM configured — GraphRAG will use local-only mode (no LLM answers)")
                self._llm = None

        self._provider = llm_provider
        self._llm_model = llm_model
        self._llm_base_url = llm_base_url

        # ── 流式 LLM ──
        self._llm_stream = self._build_stream_caller() if self._llm else None

        # ── 实体语义索引 ──
        self._index = EntityIndex(engine)
        logger.info(f"GraphRAG initialized: {self.engine.health()['counts']}, index={len(self._index)} docs, LLM={self._provider if self._llm else 'none'}")

    def _build_stream_caller(self):
        """构建流式 LLM 调用器"""
        if not self._llm:
            return None

        def stream(system_prompt: str, user_prompt: str):
            import httpx, json as _json
            if self._provider == "openai":
                url = f"{self._llm_base_url or 'https://api.openai.com/v1'}/chat/completions"
                headers = {"Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY','')}", "Content-Type": "application/json"}
                body = {"model": self._llm_model or "gpt-4o", "messages": [{"role":"system","content":system_prompt},{"role":"user","content":user_prompt}], "stream": True, "max_tokens": 1024}
            else:
                url = f"{self._llm_base_url or 'https://api.anthropic.com/v1'}/messages"
                headers = {"x-api-key": os.environ.get('ANTHROPIC_API_KEY',''), "anthropic-version": "2023-06-01", "content-type": "application/json"}
                body = {"model": self._llm_model or "claude-sonnet-5", "max_tokens": 1024, "system": system_prompt, "messages": [{"role":"user","content":user_prompt}], "stream": True}
            try:
                with httpx.stream("POST", url, headers=headers, json=body, timeout=30.0) as resp:
                    for line in resp.iter_lines():
                        if line.startswith("data: "):
                            data = line[6:]
                            if data == "[DONE]":
                                break
                            try:
                                obj = _json.loads(data)
                                if self._provider == "openai":
                                    delta = obj.get("choices",[{}])[0].get("delta",{})
                                    if "content" in delta:
                                        yield delta["content"]
                                else:
                                    t = obj.get("type","")
                                    if t == "content_block_delta":
                                        yield obj.get("delta",{}).get("text","")
                            except: pass
            except Exception as e:
                yield f"[stream error: {e}]"
        return stream

    # ── 语义搜索 (公开) ──
    def search(self, query: str, top_k: int = 10, use_llm_rerank: bool = True) -> List[Dict]:
        """语义实体搜索 — TF-IDF + 可选 LLM 重排序

        Args:
          query: 搜索查询
          top_k: 返回数量
          use_llm_rerank: 是否使用 LLM 重排序 (需有 LLM)

        Returns:
          [{id, score, layer, name, type}, ...]
        """
        # TF-IDF 粗筛 top-20
        candidates = self._index.search(query, top_k=20)
        if not candidates:
            # 降级到关键词搜索
            return self.engine.search_entities(query, top_k)

        # LLM 重排序
        if use_llm_rerank and self._llm and len(candidates) > top_k:
            candidates = self._index.rerank(query, candidates, self._llm, top_k)

        return candidates[:top_k]

    # ── Level 1: 实体问答 ──
    def ask_entity(self, question: str, entity_id: str = None) -> Dict[str, Any]:
        """针对特定实体的问答 — GraphRAG Local Search

        如果未指定 entity_id，自动从 question 中搜索匹配实体。
        """
        # 1. 语义实体匹配
        if entity_id is None:
            matches = self.search(question, top_k=3)
            if not matches:
                return {"answer": "未找到与问题相关的实体", "entities": [], "context": ""}
            entity_id = matches[0]["id"]

        # 2. 收集上下文
        ctx = self.engine.local_context(entity_id)
        if "error" in ctx:
            return {"answer": f"实体 '{entity_id}' 未找到", "entities": [], "context": ""}

        # 3. LLM 回答 (有 LLM 则用，否则返回结构化上下文)
        if self._llm:
            user_prompt = f"""## 用户问题
{question}

## 目标实体上下文
{ctx['text_context']}

## 关联安全规则
{json.dumps(ctx.get('constraints', []), ensure_ascii=False, indent=2) if ctx.get('constraints') else '无关联规则'}

请根据以上上下文回答用户问题。"""
            answer = self._llm(GRAPH_RAG_SYSTEM_PROMPT, user_prompt)
        else:
            answer = self._format_local_answer(ctx, question)

        return {
            "answer": answer,
            "entity": {"id": entity_id, "layer": ctx["layer"], "name": ctx["entity"].get("name", "")},
            "context": ctx["text_context"],
            "matched_entities": self.search(question, top_k=5),
        }

    # ── Level 2: 社区问答 ──
    def ask_community(self, question: str, level: str = "site",
                      entity_id: str = None) -> Dict[str, Any]:
        """针对层级社区的问答 — GraphRAG Community Summary

        Args:
          question: 自然语言问题
          level: "site" | "gateway" | "channel"
          entity_id: 指定实体，不传则汇总全部
        """
        # 1. 生成社区摘要
        summary = self.engine.community_summary(level, entity_id)
        if "error" in summary:
            return {"answer": summary["error"], "summary": summary}

        # 2. LLM 回答
        if self._llm:
            user_prompt = f"""## 用户问题
{question}

## {level.upper()} 级别社区摘要
{summary['text_summary']}

## 详细统计
{json.dumps(summary.get('stats', summary.get('entities', [])), ensure_ascii=False, indent=2)}

请根据以上摘要回答用户问题。如果数据不足以回答，请说明需要哪些额外信息。"""
            answer = self._llm(GRAPH_RAG_SYSTEM_PROMPT, user_prompt)
        else:
            answer = summary["text_summary"]

        return {"answer": answer, "level": level, "summary": summary}

    # ── Level 3: 全局问答 (自动路由) ──
    def ask(self, question: str) -> Dict[str, Any]:
        """GraphRAG 全局问答 — 自动选择检索策略

        路由逻辑:
          - 含具体设备/测点名 → ask_entity (Local Search)
          - 含"整体/全部/汇总/态势" → ask_community (Community Summary)
          - 其他 → ask_community("site") 全局视图
        """
        q = question.lower()

        # 检测是否为汇总/全局类问题
        community_keywords = ["整体", "全部", "汇总", "态势", "概况", "统计", "总共", "所有",
                              "overview", "summary", "all", "total", "report"]
        is_community = any(w in q for w in community_keywords)

        if is_community:
            # 尝试判断层级
            if any(w in q for w in ["通道", "channel", "协议"]):
                return self.ask_community(question, "channel")
            elif any(w in q for w in ["服务器", "网关", "gateway", "io"]):
                return self.ask_community(question, "gateway")
            else:
                return self.ask_community(question, "site")

        # 默认走实体 Local Search — 语义搜索 + 关键词 fallback
        semantic_matches = self.search(question, top_k=5)

        # 融合关键词精确匹配 (双向子串)
        kw_matches = self.engine.search_entities(question, top_k=5)
        # 补充: 检查实体名/ID/协议词是否在query中 (反向匹配)
        for layer_entities, layer_name in [
            (self.engine.devices, "device"), (self.engine.points, "point"),
            (self.engine.channels, "channel"), (self.engine.sites, "site"),
        ]:
            for ent in layer_entities.values():
                orig_id = getattr(ent, 'id', '')
                eid = orig_id.lower()
                name = getattr(ent, 'name', '')
                name_lower = name.lower()
                # 协议字段 (channel专属)
                proto = getattr(ent, 'protocol', '').lower() if hasattr(ent, 'protocol') else ''
                q_lower = question.lower()
                # 收集匹配词 (拆分ID/名称/协议为细粒度token)
                import re as _re
                raw_tokens = set(
                    _re.split(r'[_\-\s/]+', eid) +
                    _re.split(r'[_\-\s/]+', name_lower) +
                    (_re.split(r'[_\-\s/]+', proto) if proto else [])
                )
                tokens = {t for t in raw_tokens if len(t) >= 2}
                tokens.discard('')
                matched = False
                for t in tokens:
                    if t in q_lower:
                        matched = True
                        break
                if matched and not any(m["id"] == orig_id for m in kw_matches):
                    kw_matches.append({
                        "id": orig_id, "layer": layer_name, "name": name or orig_id,
                        "score": 80,
                    })
        kw_matches.sort(key=lambda x: -x.get("score", 0))

        # 合并: 关键词命中 → boost TF-IDF 分数 (不覆盖排序)
        kw_ids = {kw["id"] for kw in kw_matches if kw.get("score", 0) >= 60}
        for m in semantic_matches:
            if m["id"] in kw_ids:
                m["score"] = min(m["score"] * 1.8, 1.0)
                m["keyword_boost"] = True
        # 纯关键词命中追加
        for kw in kw_matches:
            if kw.get("score", 0) >= 60 and kw["id"] not in {m["id"] for m in semantic_matches}:
                semantic_matches.append({**kw, "score": 0.25, "source": "keyword_only"})

        matches = sorted(semantic_matches, key=lambda x: -x.get("score", 0))

        # 协议名特殊boost: 用户明确提协议名 → 大幅提升对应通道 (合并后执行)
        protocols_mentioned = [p for p in ['modbus','opc','a11','iec104','s7','dtu']
                               if p in question.lower()]
        if protocols_mentioned:
            for m in matches:
                if m.get("layer") == "channel":
                    proto = self.engine.channels.get(m["id"])
                    if proto and any(p in proto.protocol.lower() for p in protocols_mentioned):
                        m["score"] = min(m.get("score", 0) * 3.0, 1.0)
            matches.sort(key=lambda x: -x.get("score", 0))

        # TF-IDF 分数范围 0-1, keyword 0-100, 统一阈值判断
        has_good_match = any(
            m.get("score", 0) >= 0.15 or m.get("score", 0) >= 60
            for m in matches[:3]
        )

        if matches and has_good_match:
            entity_id = matches[0]["id"]
            return self.ask_entity(question, entity_id)

        # 没有匹配实体 → 降级到社区摘要
        return self.ask_community(question, "site")

    # ── 辅助 ──
    @staticmethod
    def _format_local_answer(ctx: dict, question: str) -> str:
        """无 LLM 时的模板化回答"""
        lines = [f"📍 {ctx['layer'].upper()}: {ctx['entity'].get('name', '')}"]
        if ctx.get("parent_chain"):
            path = " > ".join(p["name"] for p in reversed(ctx["parent_chain"]))
            lines.append(f"路径: {path}")
        if ctx.get("constraints"):
            lines.append(f"关联规则 ({len(ctx['constraints'])}条):")
            for r in ctx["constraints"]:
                lines.append(f"  [{r['severity']}] {r['name']}: {r['rule']}")
        if ctx.get("siblings"):
            lines.append(f"同级节点: {len(ctx['siblings'])}个")
        if ctx.get("children"):
            lines.append(f"子节点: {len(ctx['children'])}个")
        lines.append("\n[无 LLM 后端 — 返回结构化上下文]")
        return "\n".join(lines)

    def status(self) -> dict:
        """GraphRAG 状态"""
        return {
            "engine": self.engine.health(),
            "llm_provider": self._provider if self._llm else "none",
            "ready": self._llm is not None,
            "live_data": self._live.available,
            "index": len(self._index),
        }

    # ── 流式回答 (SSE) ──
    def ask_stream(self, question: str):
        """流式问答生成器 — 逐 token yield，用于 SSE 推送

        Yields:
          {"type": "entity", "data": {...}}   — 匹配到的实体
          {"type": "context", "data": "..."}  — 上下文文本
          {"type": "token", "data": "..."}    — LLM token (仅 LLM 模式)
          {"type": "done", "data": {...}}     — 完成
        """
        # 1. 实体匹配
        matches = self.search(question, top_k=3)
        entity_id = matches[0]["id"] if matches else None
        if entity_id:
            yield {"type": "entity", "data": {"id": entity_id, "name": matches[0].get("name", ""), "layer": matches[0].get("layer", "")}}

        # 2. 上下文收集
        ctx = self._live.enhance_context(self.engine, entity_id) if entity_id else {}
        text_ctx = ctx.get("text_context", "") if "error" not in ctx else ""
        yield {"type": "context", "data": text_ctx[:500]}

        # 3. LLM 流式生成 (或模板化输出)
        if self._llm:
            user_prompt = f"## 用户问题\n{question}\n\n## 实体上下文\n{text_ctx}\n\n请基于上下文回答。"
            try:
                for chunk in self._llm_stream(GRAPH_RAG_SYSTEM_PROMPT, user_prompt):
                    yield {"type": "token", "data": chunk}
            except Exception as e:
                yield {"type": "token", "data": f"\n[LLM 流式错误: {e}]"}
        else:
            # 无 LLM — 模拟流式输出模板化回答
            answer = self._format_local_answer(ctx if "error" not in ctx else {}, question)
            for char in answer:
                yield {"type": "token", "data": char}

        yield {"type": "done", "data": {"entity_id": entity_id}}

    # ── 实时数据查询 ──
    def live_context(self, entity_id: str) -> Dict[str, Any]:
        """增强上下文 — 含实时遥测值 + 阈值判定"""
        return self._live.enhance_context(self.engine, entity_id)

    def live_snapshot(self, device_id: str) -> Dict[str, Any]:
        """设备实时快照 — 所有测点最新值"""
        return self._live.device_snapshot(device_id)

    def live_point(self, point_id: str) -> Optional[Dict[str, Any]]:
        """单测点最新值"""
        return self._live.point_latest(point_id)

    def live_channel(self, channel_id: str) -> Dict[str, Any]:
        """通道级实时聚合"""
        return self._live.channel_summary(self.engine, channel_id)

    def trend(self, point_id: str, hours: float = 1) -> Dict[str, Any]:
        """测点历史趋势分析"""
        return self._trend.analyze(point_id, hours)

    # ── 告警自动诊断 ──
    def analyze_alarm(self, entity_id: str, alarm_info: Dict = None) -> Dict[str, Any]:
        """告警自动诊断 — 图上下文 + 实时值 + 约束规则 → 故障分析报告

        Args:
          entity_id: 告警关联的实体 ID (device/point)
          alarm_info: 告警信息 {type, level, message, value, threshold, ...}

        Returns:
          {
            "entity_id": "...",
            "diagnosis": "...",       # 自然语言诊断 (有LLM) 或 结构化摘要 (无LLM)
            "severity": "danger",
            "related_constraints": [...],
            "affected_siblings": [...],
            "recommended_actions": [...],
            "context": {...},
          }
        """
        alarm_info = alarm_info or {}

        # 1. 收集图上下文 + 实时值
        ctx = self._live.enhance_context(self.engine, entity_id)
        if "error" in ctx:
            return {"entity_id": entity_id, "diagnosis": f"实体 {entity_id} 未找到", "error": ctx["error"]}

        layer = ctx["layer"]

        # 2. 关联约束
        constraints = ctx.get("constraints", [])
        triggered = [c for c in constraints if c.get("severity") in ("danger", "critical", "warning")]

        # 3. 同级节点状态
        siblings = ctx.get("siblings", [])
        sibling_with_live = []
        for sib in siblings[:5]:
            if sib.get("id"):
                live_ctx = self._live.enhance_context(self.engine, sib["id"])
                live_data = live_ctx.get("live", {})
                sibling_with_live.append({
                    "id": sib["id"], "name": sib.get("name", ""),
                    "value": live_data.get("value"),
                    "status": live_data.get("status", "unknown"),
                })

        # 4. 实时值
        live = ctx.get("live", {})
        current_value = live.get("value")
        alarm_status = live.get("status", "unknown")

        # 5. 生成诊断
        if self._llm:
            diagnosis = self._llm_diagnose(entity_id, ctx, alarm_info, triggered, sibling_with_live)
        else:
            diagnosis = self._template_diagnose(ctx, alarm_info, triggered, sibling_with_live, alarm_status, current_value)

        # 6. 推荐动作
        actions = []
        for c in triggered:
            if c.get("action"):
                actions.append({"source": c["name"], "action": c["action"]})
        if alarm_status in ("high", "critical_high", "low", "critical_low"):
            actions.append({"source": "阈值判定", "action": f"当前值 {current_value} 超出阈值范围，建议立即检查"})
        if not actions:
            actions.append({"source": "自动诊断", "action": "无紧急动作，建议例行巡检"})

        return {
            "entity_id": entity_id,
            "entity_name": ctx["entity"].get("name", entity_id) if isinstance(ctx["entity"], dict) else entity_id,
            "layer": layer,
            "diagnosis": diagnosis,
            "severity": alarm_info.get("level", alarm_info.get("severity", "warning")),
            "alarm_status": alarm_status,
            "current_value": current_value,
            "triggered_constraints": triggered,
            "affected_siblings": sibling_with_live,
            "recommended_actions": actions,
            "context": ctx,
        }

    def _llm_diagnose(self, entity_id, ctx, alarm_info, triggered, siblings) -> str:
        """LLM 生成自然语言故障诊断"""
        prompt = f"""## 告警信息
实体: {entity_id}
告警类型: {alarm_info.get('type', 'unknown')}
严重级别: {alarm_info.get('level', alarm_info.get('severity', 'warning'))}
告警消息: {alarm_info.get('message', '')}

## 实体上下文
{ctx.get('text_context', '')}

## 触发约束 ({len(triggered)}条)
{json.dumps(triggered, ensure_ascii=False, indent=2)}

## 同级节点状态
{json.dumps(siblings, ensure_ascii=False, indent=2)}

请以工业自动化专家身份，给出简洁的故障诊断报告：
1. 故障原因 (1-2句)
2. 影响范围
3. 建议处理步骤 (3条以内)"""

        try:
            return self._llm(
                "你是工业自动化故障诊断专家。根据上下文给出简明的诊断报告和可操作建议。",
                prompt,
            ).strip()
        except Exception as e:
            logger.warning(f"LLM diagnosis failed: {e}")
            return self._template_diagnose(ctx, alarm_info, triggered, siblings, "unknown", None)

    @staticmethod
    def _template_diagnose(ctx, alarm_info, triggered, siblings, alarm_status, current_value) -> str:
        """无 LLM 时的模板化诊断"""
        name = ctx["entity"].get("name", "") if isinstance(ctx["entity"], dict) else ""
        lines = [
            f"## 告警诊断: {name}",
            f"严重级别: {alarm_info.get('level', alarm_info.get('severity', 'warning'))}",
            f"告警状态: {alarm_status}",
        ]
        if current_value is not None:
            unit = ctx.get("live", {}).get("unit", "")
            lines.append(f"当前值: {current_value} {unit}")
        if triggered:
            lines.append(f"\n### 关联约束 ({len(triggered)}条)")
            for c in triggered:
                lines.append(f"- [{c.get('severity','')}] {c.get('name','')}: {c.get('rule','')}")
        if siblings:
            abnormal = [s for s in siblings if s.get("status") not in ("normal", "unknown")]
            lines.append(f"\n### 同级节点: {len(siblings)}个, 异常: {len(abnormal)}个")
            for s in abnormal:
                lines.append(f"- {s['name']}: {s.get('value')} (状态: {s['status']})")
        lines.append("\n### 建议动作")
        for c in triggered:
            if c.get("action"):
                lines.append(f"- {c['action']}")
        if not triggered:
            lines.append("- 例行巡检")
        lines.append("\n[无 LLM 后端 — 模板化诊断]")
        return "\n".join(lines)


# ═══════════════════════════════════════════════════════════
# 命令行入口
# ═══════════════════════════════════════════════════════════

def main():
    """命令行 GraphRAG 问答

    用法:
      python -m src.graphrag "DEV_A 井的套压安全吗？"
      python -m src.graphrag --summary   # 打印社区摘要
      python -m src.graphrag --context pt_tgp   # 打印实体上下文
      python -m src.graphrag --subgraph dev_relay_00  # 导出子图 JSON
    """
    import argparse

    parser = argparse.ArgumentParser(description="DG-IoT GraphRAG 问答")
    parser.add_argument("question", nargs="?", default="", help="自然语言问题")
    parser.add_argument("--entity", "-e", default=None, help="指定实体 ID")
    parser.add_argument("--level", "-l", default="site", choices=["site", "gateway", "channel"])
    parser.add_argument("--summary", "-s", action="store_true", help="打印社区摘要")
    parser.add_argument("--context", "-c", default=None, metavar="ENTITY_ID", help="打印实体上下文")
    parser.add_argument("--subgraph", "-g", default=None, metavar="ENTITY_ID", help="导出子图 JSON")
    parser.add_argument("--no-llm", action="store_true", help="不使用 LLM (仅结构化输出)")
    args = parser.parse_args()

    from .ontology import build_131_ontology

    print("加载 示例 IO 服务器本体...")
    engine = build_131_ontology()
    print(f"  实体: {engine.health()['counts']}")

    if args.no_llm:
        rag = GraphRAG(engine, llm_call=None)
    else:
        rag = GraphRAG(engine)  # 自动检测环境变量

    if args.subgraph:
        sg = engine.subgraph(args.subgraph)
        print(json.dumps(sg, ensure_ascii=False, indent=2))
        return

    if args.context:
        ctx = engine.local_context(args.context)
        print(f"\n{'='*60}")
        print(ctx["text_context"])
        print(f"\n约束: {len(ctx['constraints'])}条 | 同级: {len(ctx['siblings'])}个 | 子节点: {len(ctx['children'])}个")
        return

    if args.summary:
        result = rag.ask_community("整体态势", args.level)
    elif args.question:
        result = rag.ask(args.question)
    else:
        result = rag.ask_community("整体态势", "site")

    print(f"\n{'='*60}")
    print(f"GraphRAG 回答:")
    print(f"{'='*60}")
    print(result.get("answer", str(result)))


if __name__ == "__main__":
    main()
