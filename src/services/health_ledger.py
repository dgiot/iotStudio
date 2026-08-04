#!/usr/bin/env python3
"""
多作业区 IO 服务器体检台账 — 全厂区总览
========================================
对标需求: 搭桥手术前的每个作业区 IO 服务器全面体检
绑定场景: 大庆采油二厂(南4联合站等) / 采油三厂(北9注水站等)

功能:
  - 批量体检: 一次巡检所有作业区 IO 服务器
  - 台账总览: 全部服务器 READY/CAUTION/BLOCKED 一览表
  - 横向对比: 同维度跨服务器对比 (找最差的)
  - 趋势记录: 每次体检存档, 观察健康变化
  - 报告输出: JSON 台账 + 控制台表格

用法:
  ledger = HealthLedger()
  ledger.add_server("11.66.12.131", "采油二厂-南4联合站", scan_data={...})
  ledger.add_server("11.66.12.130", "采油二厂-北9注水站", scan_data={...})
  report = ledger.run_all()          # 批量体检
  ledger.save("health_ledger.json")  # 台账持久化

自测: python -m src.services.health_ledger
"""
import json, logging, os, time
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from .io_health_check import IOHostHealthChecker, HealthReport

logger = logging.getLogger("health_ledger")


@dataclass
class ServerEntry:
    """一台 IO 服务器的体检配置"""
    ip: str
    name: str                       # 作业区/站点名 (如 采油二厂-南4联合站)
    zone: str = ""                  # 作业区
    scan_data: dict = field(default_factory=dict)
    winrm_config: dict = field(default_factory=dict)


@dataclass
class LedgerEntry:
    """台账一行"""
    ip: str
    name: str
    zone: str
    total_score: int
    verdict: str
    worst_item: str = ""            # 最差维度
    items: Dict[str, dict] = field(default_factory=dict)
    checked_at: float = 0.0


class HealthLedger:
    """多作业区 IO 服务器体检台账"""

    def __init__(self):
        self.servers: List[ServerEntry] = []
        self.entries: List[LedgerEntry] = []
        self._history: Dict[str, List[dict]] = {}   # ip → 历次体检

    # ── 服务器登记 ──

    def add_server(self, ip: str, name: str, zone: str = "",
                   scan_data: dict = None, winrm_config: dict = None):
        """登记一台 IO 服务器"""
        self.servers.append(ServerEntry(ip=ip, name=name, zone=zone,
                                        scan_data=scan_data or {},
                                        winrm_config=winrm_config or {}))
        return self

    # ── 批量体检 ──

    def run_all(self) -> List[LedgerEntry]:
        """体检全部已登记服务器"""
        self.entries = []
        for s in self.servers:
            try:
                checker = IOHostHealthChecker(
                    ip=s.ip, hostname=s.name,
                    winrm_config=s.winrm_config, scan_data=s.scan_data)
                report = checker.check()
                entry = self._to_entry(s, report)
            except Exception as e:
                logger.error(f"[ledger] {s.ip} 体检失败: {e}")
                entry = LedgerEntry(ip=s.ip, name=s.name, zone=s.zone,
                                    total_score=0, verdict="ERROR",
                                    worst_item=f"体检异常: {e}",
                                    checked_at=time.time())
            self.entries.append(entry)
            # 历史存档
            self._history.setdefault(s.ip, []).append(entry.__dict__)
        self._sort()
        return self.entries

    def _to_entry(self, server: ServerEntry, report: HealthReport) -> LedgerEntry:
        items = {}
        worst = min(report.items, key=lambda i: i.score)
        for it in report.items:
            items[it.name] = {"status": it.status, "score": it.score,
                              "summary": it.summary}
        return LedgerEntry(ip=server.ip, name=server.name, zone=server.zone,
                           total_score=report.total(),
                           verdict=report.verdict,
                           worst_item=f"{worst.name}: {worst.summary}",
                           items=items, checked_at=report.timestamp)

    def _sort(self):
        """排序: BLOCKED 最前, 分数升序 (最差的排前面)"""
        rank = {"BLOCKED": 0, "CAUTION": 1, "READY": 2, "ERROR": 3}
        self.entries.sort(key=lambda e: (rank.get(e.verdict, 9),
                                         e.total_score))

    # ── 台账查询 ──

    def summary(self) -> dict:
        """总览统计"""
        counts = {"READY": 0, "CAUTION": 0, "BLOCKED": 0, "ERROR": 0}
        for e in self.entries:
            counts[e.verdict] = counts.get(e.verdict, 0) + 1
        return {"total": len(self.entries), **counts,
                "avg_score": round(sum(e.total_score for e in self.entries)
                                   / max(1, len(self.entries)), 1)}

    def worst_items(self, top: int = 5) -> List[dict]:
        """横向对比: 最差的 N 项 (找需要优先处理的)"""
        flat = []
        for e in self.entries:
            for name, it in e.items.items():
                if it["status"] != "GREEN":
                    flat.append({"ip": e.ip, "name": e.name, "item": name,
                                 "status": it["status"], "score": it["score"],
                                 "summary": it["summary"]})
        flat.sort(key=lambda x: x["score"])
        return flat[:top]

    def table(self) -> str:
        """控制台表格"""
        lines = ["作业区 IO 服务器体检台账", "=" * 78,
                 f"{'IP':<16}{'站点':<24}{'分数':>5}  {'结论':<8}最差维度",
                 "-" * 78]
        mark = {"READY": "✓", "CAUTION": "△", "BLOCKED": "✗", "ERROR": "!"}
        for e in self.entries:
            lines.append(f"{e.ip:<16}{e.name:<24}{e.total_score:>5}  "
                         f"{mark.get(e.verdict,'?'):<1}{e.verdict:<7}"
                         f"{e.worst_item[:40]}")
        lines.append("-" * 78)
        s = self.summary()
        lines.append(f"共 {s['total']} 台: READY {s['READY']} | "
                     f"CAUTION {s['CAUTION']} | BLOCKED {s['BLOCKED']} | "
                     f"ERROR {s['ERROR']}  | 平均 {s['avg_score']} 分")
        return "\n".join(lines)

    # ── 持久化 ──

    def save(self, path: str = "health_ledger.json") -> str:
        payload = {
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "summary": self.summary(),
            "servers": [e.__dict__ for e in self.entries],
            "worst_items": self.worst_items(10),
            "history": self._history,
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        logger.info(f"[ledger] 台账已保存: {path}")
        return path


# ═══════════════════════════════════════════
# 自测 — 大庆多作业区场景
# ═══════════════════════════════════════════

def _selftest():
    # 采油二厂第四作业区 — 南4联合站 (131, 实测健康)
    healthy = {
        "collect_beat": {"commit_real_span": 300, "commit_his_span": 500,
                         "commit_tag_once": 15000, "max_tag_count": 1000000},
        "cpu_pct": 5, "mem_pct": 30, "tcp_conn": 203,
        "processes": "commbridge ioman iomonitor iocommit",
        "ports": "53001 8889 135 7001",
        "links": {"rtu_connections": 191, "opc_dcom": 5, "a11_channels": 7},
        "protocol_stats": {"frames": 95326, "errors": 16},
        "conflict": {"ado_pool_free": 3, "commit_gap_ms": 240},
        "data_stats": {"points_total": 46709, "write_latency_ms": 700},
    }
    # 采油三厂第八作业区 — 北9注水站 (CPU 高 + 进程缺)
    risky = dict(healthy)
    risky.update({"cpu_pct": 92, "mem_pct": 85,
                  "processes": "iomonitor", "ports": "135 7001"})
    # 萨北21站 (节拍偏大)
    caution = dict(healthy)
    caution["collect_beat"] = {"commit_real_span": 2000,
                               "commit_his_span": 3000,
                               "commit_tag_once": 30000,
                               "max_tag_count": 1000000}

    ledger = HealthLedger()
    ledger.add_server("11.66.12.131", "南4联合站", "采油二厂-第四作业区",
                      scan_data=healthy)
    ledger.add_server("11.66.12.130", "北9注水站", "采油三厂-第八作业区",
                      scan_data=risky)
    ledger.add_server("11.66.12.129", "萨北21站", "采油三厂-第八作业区",
                      scan_data=caution)
    ledger.add_server("11.66.12.128", "北15联合站", "采油三厂-第八作业区",
                      scan_data=healthy)

    ledger.run_all()
    print(ledger.table())
    print()
    s = ledger.summary()
    print(f"[1] 台账统计: {s}")
    print(f"[2] 最差项 TOP3:")
    for w in ledger.worst_items(3):
        print(f"    {w['ip']} {w['item']}: {w['summary']}")

    assert s["BLOCKED"] == 1 and s["CAUTION"] == 1 and s["READY"] == 2
    assert ledger.entries[0].verdict == "BLOCKED", "BLOCKED 应排最前"
    print("[3] 排序与统计正确")
    print("health_ledger selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("health_ledger selftest OK")
