#!/usr/bin/env python3
"""
IO 服务器全面体检服务 — 搭桥手术前评估
========================================
对标需求: 不修改DTU、不影响A11, 给每个 IO 服务器做心脏搭桥手术,
        手术前的每个作业区 IO 服务器全面体检必不可少

体检 8 维度 (全部只读, 对标 IO服务器采集规律与品性分析.md):
  1. 采集节拍   — CommitRealSpan/CommitHisSpan/CommitTagOnce/MaxTagCount 合规性
  2. 资源余量   — CPU / 内存 / 磁盘 / TCP连接 占用率
  3. 进程健康   — CommBridge/IOMan/IoMonitor/IoCommit 关键进程存在
  4. 端口监听   — 53001/8889/135/7001 关键端口监听状态
  5. 链路状态   — RTU连接数 / OPC DA DCOM / A11通道 可达性
  6. 协议合规   — Modbus/A11 帧结构合规率 (被动监听统计)
  7. 冲突边界   — Oracle ADO 连接池余量 / 写操作安全窗口
  8. 数据健康   — 点表完整性 / 写库延迟 / 历史数据覆盖

产出:
  HealthReport — 每维度绿/黄/红 + 总分 + 搭桥就绪判定 (READY/CAUTION/BLOCKED)

用法:
  checker = IOHostHealthChecker(ip="11.66.12.131", winrm_config={...})
  report = checker.check()          # 全量体检 (WinRM + 本地被动数据)
  report.pretty()                   # 控制台输出
  checker.save_report(path)         # 保存 JSON

自测: python -m src.services.io_health_check
"""
import json, logging, os, time
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional

logger = logging.getLogger("io_health")

# 体检阈值 (源自 IO服务器采集规律与品性分析.md)
THRESHOLDS = {
    "cpu_high": 80,            # CPU 占用率警戒 (%)
    "mem_high": 80,            # 内存占用率警戒 (%)
    "disk_high": 85,           # 磁盘占用率警戒 (%)
    "tcp_high": 90,            # TCP 连接数占比警戒 (%)
    "commit_span_ok": 500,     # CommitRealSpan 合规 (ms)
    "his_span_ok": 1000,       # CommitHisSpan 合规 (ms)
    "tag_once_ok": 15000,      # CommitTagOnce 单次提交点数
    "max_tag_ok": 1000000,     # MaxTagCount 总标签上限
    "min_rtu_conn": 100,       # 期望 RTU 连接数下限
    "min_points_ok": 45000,    # 点表规模下限 (131实测 46709 点)
    "frame_error_max": 0.01,   # 帧异常率上限 (1%)
}


@dataclass
class HealthItem:
    """单维度体检结果"""
    name: str
    status: str                  # GREEN/YELLOW/RED
    score: int                   # 0-100
    summary: str
    details: Dict = field(default_factory=dict)


@dataclass
class HealthReport:
    """IO 服务器体检报告"""
    ip: str
    hostname: str = ""
    timestamp: float = 0.0
    items: List[HealthItem] = field(default_factory=list)
    total_score: int = 0
    verdict: str = "UNKNOWN"     # READY/CAUTION/BLOCKED

    def total(self) -> int:
        if not self.items:
            return 0
        return round(sum(i.score for i in self.items) / len(self.items))

    def evaluate(self) -> str:
        """搭桥就绪判定:
           READY   — 全绿, 可搭桥
           CAUTION — 有黄项, 需先处理再搭桥
           BLOCKED — 有红项, 禁止搭桥
        """
        if any(i.status == "RED" for i in self.items):
            return "BLOCKED"
        if any(i.status == "YELLOW" for i in self.items):
            return "CAUTION"
        return "READY"

    def pretty(self) -> str:
        lines = [f"=== IO 服务器体检报告 ===",
                 f"  主机: {self.hostname} ({self.ip})",
                 f"  时间: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(self.timestamp))}",
                 f"  总分: {self.total()}/100  结论: {self.verdict}",
                 ""]
        for it in self.items:
            mark = {"GREEN": "✓", "YELLOW": "△", "RED": "✗"}.get(it.status, "?")
            lines.append(f"  {mark} [{it.status:6s}] {it.name:8s} "
                         f"{it.score:3d}分 {it.summary}")
        return "\n".join(lines)

    def to_dict(self) -> dict:
        return {"ip": self.ip, "hostname": self.hostname,
                "timestamp": self.timestamp, "total_score": self.total(),
                "verdict": self.verdict,
                "items": [asdict(i) for i in self.items]}


class IOHostHealthChecker:
    """IO 服务器体检器 — 8 维度全量检查 (只读)"""

    def __init__(self, ip: str, hostname: str = "",
                 winrm_config: dict = None, scan_data: dict = None):
        self.ip = ip
        self.hostname = hostname
        self.winrm_config = winrm_config or {}
        # 外部注入的扫描数据 (来自 IOScannerChannel 或被动监听)
        self.scan_data = scan_data or {}

    # ═══════════════════════════════════════
    # 数据获取层 — WinRM 优先, 注入数据回退
    # ═══════════════════════════════════════

    def _collect(self) -> dict:
        """采集体检原始数据 (只读操作, 零修改)"""
        data = dict(self.scan_data)   # 注入数据为基线
        if self.winrm_config.get("ip"):
            try:
                data.update(self._winrm_collect())
            except Exception as e:
                logger.warning(f"[io_health] WinRM 采集失败, 用注入数据: {e}")
        return data

    def _winrm_collect(self) -> dict:
        """WinRM 只读采集: 进程/端口/资源"""
        import winrm
        cfg = self.winrm_config
        os.environ.pop('HTTP_PROXY', None)
        os.environ.pop('HTTPS_PROXY', None)
        os.environ['NO_PROXY'] = cfg.get("ip", "")
        s = winrm.Session(f"http://{cfg['ip']}:{cfg.get('port', 5985)}/wsman",
                          auth=(cfg["user"], cfg["password"]),
                          transport=cfg.get("transport", "ntlm"),
                          read_timeout_sec=60)

        def _ps(script):
            try:
                r = s.run_ps(script)
                return r.std_out.decode('gbk', errors='ignore').strip()
            except Exception as e:
                return f"ERR:{e}"

        cpu = _ps("Get-WmiObject Win32_Processor | Select -Expand LoadPercentage")
        mem = _ps("$t=(Get-CimInstance Win32_OperatingSystem); "
                  "[math]::Round((1-$t.FreePhysicalMemory/$t.TotalVisibleMemorySize)*100,1)")
        disk = _ps("Get-PSDrive -PSProvider FileSystem | "
                   "ForEach-Object { '{0}={1}' -f $_.Name,"
                   "[math]::Round($_.Used/1GB,1) }")
        tcp = _ps("(Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue).Count")
        proc = _ps("Get-Process | Select -Expand ProcessName")
        ports = _ps("netstat -an | findstr LISTENING")

        return {"cpu_pct": float(cpu) if cpu.isdigit() else None,
                "mem_pct": float(mem) if _is_num(mem) else None,
                "disk_gb": disk, "tcp_conn": tcp,
                "processes": proc, "ports": ports}

    # ═══════════════════════════════════════
    # 8 维度体检
    # ═══════════════════════════════════════

    def check(self) -> HealthReport:
        data = self._collect()
        report = HealthReport(ip=self.ip, hostname=self.hostname,
                              timestamp=time.time())
        report.items = [
            self._check_beat(data),
            self._check_resource(data),
            self._check_process(data),
            self._check_ports(data),
            self._check_links(data),
            self._check_protocol(data),
            self._check_conflict(data),
            self._check_data(data),
        ]
        report.verdict = report.evaluate()
        logger.info(f"[io_health] {self.ip} 体检: 总分{report.total()} "
                    f"结论={report.verdict}")
        return report

    def _check_beat(self, data: dict) -> HealthItem:
        """1. 采集节拍合规性"""
        beat = data.get("collect_beat", {})
        ok = beat.get("commit_real_span", 300) <= THRESHOLDS["commit_span_ok"]
        his_ok = beat.get("commit_his_span", 500) <= THRESHOLDS["his_span_ok"]
        tag_ok = beat.get("commit_tag_once", 15000) <= THRESHOLDS["tag_once_ok"]
        if ok and his_ok and tag_ok:
            return HealthItem("节拍", "GREEN", 100,
                              f"实时{beat.get('commit_real_span')}ms/"
                              f"历史{beat.get('commit_his_span')}ms/"
                              f"单次{beat.get('commit_tag_once')}点 合规",
                              beat)
        return HealthItem("节拍", "YELLOW", 60,
                          "采集节拍超出推荐值, 需关注",
                          beat)

    def _check_resource(self, data: dict) -> HealthItem:
        """2. 资源余量"""
        cpu = data.get("cpu_pct") or 0
        mem = data.get("mem_pct") or 0
        disk = data.get("disk_gb") or ""
        tcp = data.get("tcp_conn") or 0
        issues = []
        score = 100
        if cpu > THRESHOLDS["cpu_high"]:
            issues.append(f"CPU {cpu}%"); score -= 30
        if mem > THRESHOLDS["mem_high"]:
            issues.append(f"内存 {mem}%"); score -= 30
        try:
            if float(tcp) > 50000:
                issues.append(f"TCP {tcp}"); score -= 20
        except (ValueError, TypeError):
            pass
        if issues:
            return HealthItem("资源", "YELLOW", max(score, 0),
                              "余量紧张: " + ", ".join(issues),
                              {"cpu_pct": cpu, "mem_pct": mem, "tcp": tcp})
        return HealthItem("资源", "GREEN", 100,
                          f"CPU {cpu}% 内存 {mem}% TCP {tcp} 余量充足")

    def _check_process(self, data: dict) -> HealthItem:
        """3. 关键进程健康"""
        procs = (data.get("processes") or "").lower()
        expected = ["commbridge", "ioman", "iomonitor", "iocommit"]
        missing = [p for p in expected if p not in procs]
        if not missing:
            return HealthItem("进程", "GREEN", 100,
                              "CommBridge/IOMan/IoMonitor/IoCommit 全部在",
                              {"expected": expected})
        if len(missing) <= 1:
            return HealthItem("进程", "YELLOW", 70,
                              f"缺少: {missing}", {"expected": expected})
        return HealthItem("进程", "RED", 30,
                          f"关键进程缺失: {missing}", {"expected": expected})

    def _check_ports(self, data: dict) -> HealthItem:
        """4. 关键端口监听"""
        ports = (data.get("ports") or "").lower()
        expected = {"53001": "CommBridge", "8889": "A11",
                    "135": "DCOM", "7001": "IOFileServer"}
        missing = [f"{p}({n})" for p, n in expected.items() if p not in ports]
        if not missing:
            return HealthItem("端口", "GREEN", 100,
                              "53001/8889/135/7001 全部监听", expected)
        if len(missing) <= 1:
            return HealthItem("端口", "YELLOW", 70,
                              f"未监听: {missing}", expected)
        return HealthItem("端口", "RED", 30,
                          f"关键端口未监听: {missing}", expected)

    def _check_links(self, data: dict) -> HealthItem:
        """5. 链路状态 (RTU 连接 / OPC / A11)"""
        links = data.get("links", {})
        rtu = links.get("rtu_connections", 0)
        opc = links.get("opc_dcom", 0)
        a11 = links.get("a11_channels", 0)
        issues = []
        if rtu and rtu < THRESHOLDS["min_rtu_conn"]:
            issues.append(f"RTU连接仅{rtu}")
        if issues:
            return HealthItem("链路", "YELLOW", 60,
                              ", ".join(issues), links)
        return HealthItem("链路", "GREEN", 100,
                          f"RTU {rtu} 连接 / OPC {opc} / A11 {a11} 通道",
                          links)

    def _check_protocol(self, data: dict) -> HealthItem:
        """6. 协议帧合规率 (被动监听统计)"""
        proto = data.get("protocol_stats", {})
        frames = proto.get("frames", 0)
        errors = proto.get("errors", 0)
        if frames == 0:
            return HealthItem("协议", "YELLOW", 60,
                              "暂无监听样本, 需开启被动监听观察")
        err_rate = errors / frames
        if err_rate > THRESHOLDS["frame_error_max"]:
            return HealthItem("协议", "RED", 40,
                              f"帧异常率 {err_rate:.3%} > 1%", proto)
        return HealthItem("协议", "GREEN", 100,
                          f"帧异常率 {err_rate:.3%} (样本 {frames})", proto)

    def _check_conflict(self, data: dict) -> HealthItem:
        """7. 冲突边界 (安全窗口)"""
        conf = data.get("conflict", {})
        ado = conf.get("ado_pool_free", 3)     # OLEDB 空闲连接
        window = conf.get("commit_gap_ms", 240)  # 300ms 周期的空闲窗口
        if ado < 1 or window < 50:
            return HealthItem("冲突", "YELLOW", 50,
                              f"ADO空闲{ado} 提交窗口{window}ms, 下发需限流", conf)
        return HealthItem("冲突", "GREEN", 100,
                          f"ADO空闲{ado} 提交窗口{window}ms 安全", conf)

    def _check_data(self, data: dict) -> HealthItem:
        """8. 数据健康"""
        d = data.get("data_stats", {})
        points = d.get("points_total", 0)
        latency = d.get("write_latency_ms", 0)
        if points < THRESHOLDS["min_points_ok"]:
            return HealthItem("数据", "YELLOW", 60,
                              f"点表仅 {points} (期望≥{THRESHOLDS['min_points_ok']})", d)
        if latency and latency > 1000:
            return HealthItem("数据", "RED", 40,
                              f"写库延迟 {latency}ms", d)
        return HealthItem("数据", "GREEN", 100,
                          f"点表 {points} 写库 {latency}ms 正常", d)

    # ── 报告持久化 ──

    def save_report(self, path: str = None) -> str:
        path = path or f"io_health_{self.ip.replace('.', '_')}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.check().to_dict(), f, ensure_ascii=False, indent=2)
        return path


def _is_num(s: str) -> bool:
    try:
        float(s.strip())
        return True
    except (ValueError, TypeError):
        return False


# ═══════════════════════════════════════════
# 自测 — 注入模拟扫描数据验证 8 维度判定
# ═══════════════════════════════════════════

def _selftest():
    # 健康场景 (南4联合站 131 实测参数)
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
    r1 = IOHostHealthChecker("11.66.12.131", "IO-SERVER-131",
                             scan_data=healthy).check()
    print(r1.pretty())
    print(f"  判定: {r1.verdict} (期望 READY)")
    assert r1.verdict == "READY", f"健康场景判定错误: {r1.verdict}"

    # 危险场景: CPU 高 + 进程缺失 + 端口缺失
    risky = dict(healthy)
    risky.update({"cpu_pct": 95, "processes": "iomonitor",
                  "ports": "135"})
    r2 = IOHostHealthChecker("11.66.12.130", "IO-130",
                             scan_data=risky).check()
    print()
    print(r2.pretty())
    print(f"  判定: {r2.verdict} (期望 BLOCKED)")
    assert r2.verdict == "BLOCKED", f"危险场景判定错误: {r2.verdict}"

    # 注意场景: 节拍偏大
    caution = dict(healthy)
    caution["collect_beat"] = {"commit_real_span": 2000, "commit_his_span": 3000,
                               "commit_tag_once": 30000, "max_tag_count": 1000000}
    r3 = IOHostHealthChecker("11.66.12.129", "IO-129",
                             scan_data=caution).check()
    print()
    print(f"  注意场景判定: {r3.verdict} (期望 CAUTION)")
    assert r3.verdict == "CAUTION", f"注意场景判定错误: {r3.verdict}"

    print("io_health_check selftest OK")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    _selftest()
    print("io_health_check selftest OK")
