"""
OPC DA 点表统计 — 按分组前缀数测点
=====================================
通过 WinRM→VBS/ADO 从现场关系库读取 OPC DA 测点表。
与 Modbus 采集共用同一条管线。

⚠️ 本模块名原先叫 `opcda_collector.py`，当时与 `src/protocols/opcda_collector.py`
**同名不同物** —— 那是本仓历史上的一处维护陷阱：按文件名找代码会找错。
改名不是为了好看，是因为**名字说了 A、做的是 B**（这里一个测点值都不采，
只数每个分组的条数）。同族教训：`pg_store` 其实是 ParseStore，按名字推断
类型已经让人把建表入口归错过一次文件。
（那个同名文件本身是死件 —— 全仓零 import、无实例化点 —— 已删，陷阱不复存在；
改名保留：它现在说的是本模块自己的职责，不再是为了跟谁区分。）

⚠️ 真正采 OPC DA 值的是 `src/protocols/opcda_client.py`（OpenOPC 驱动，
由 `src/services/collector.py` 的 `proto == "opcda"` 分支实例化）。

**表名、站名前缀、分组前缀 —— 都是现场事实，由环境给：**
  DG_OPCDA_POINT_TABLE      测点关系表名
  DG_OPCDA_STATION_PREFIX   长名里站名段之前的固定前缀（如某个 `/` 引导段）
  DG_OPCDA_BUCKETS          逗号分隔的分组前缀，用于按前缀统计
  DG_OPCDA_SKIP_PREFIXES    可选。长名分段里要跳过的前缀（现场自有的占位段）

⚠️ 四项都**不给默认值**。原先这里写死了表名、四个分组前缀、一个要跳过的
前缀，以及某现场的点位分布行数 —— 那些是**那一个现场**的编址约定与库存，
换个现场就是错的，而且是**静默错**（统计出来的数看着像真的）。
不配 ⇒ 加载 0 个点并把原因写进日志，而不是退回某个默认现场。

用法:
  collector = OpcdaCollector(oracle_reader, event_bus)
  await collector.start(interval=300)
"""
import asyncio, logging, os, re, time
from typing import Optional, Dict, List
from dataclasses import dataclass

log = logging.getLogger("opcda")

#: 分组前缀与站名前缀的字形 —— 它们要拼进 SQL 的 LIKE 模式里。
#: 认不出就停手：拼出一句语法错误的 SQL，人只会以为"库连不上"。
_PREFIX_RE = re.compile(r"^[A-Za-z0-9_/.-]{1,64}$")


def point_table() -> str:
    """测点关系表名 —— 现场给，本仓无默认。"""
    t = os.environ.get("DG_OPCDA_POINT_TABLE", "").strip()
    if t and not re.match(r"^[A-Za-z_][A-Za-z0-9_$#]{0,29}$", t):
        raise ValueError(f"DG_OPCDA_POINT_TABLE={t!r} 不是合法的表名形状")
    return t


def _csv(env: str) -> List[str]:
    return [x.strip() for x in os.environ.get(env, "").split(",") if x.strip()]


def buckets() -> List[str]:
    """分组前缀 —— 现场给。字形不合就地抛（要拼进 LIKE）。"""
    out = _csv("DG_OPCDA_BUCKETS")
    for b in out:
        if not _PREFIX_RE.match(b):
            raise ValueError(f"DG_OPCDA_BUCKETS 里的 {b!r} 不是合法的前缀形状")
    return out


def station_prefix() -> str:
    """长名里站名段之前的固定前缀 —— 现场给。"""
    p = os.environ.get("DG_OPCDA_STATION_PREFIX", "").strip()
    if p and not _PREFIX_RE.match(p):
        raise ValueError(f"DG_OPCDA_STATION_PREFIX={p!r} 不是合法的前缀形状")
    return p


def skip_prefixes() -> List[str]:
    """长名分段里要跳过的前缀 —— 现场给，本仓无默认。"""
    return _csv("DG_OPCDA_SKIP_PREFIXES")


@dataclass
class OpcdaPoint:
    """OPC DA 测点"""
    point_id: str
    long_name: str
    describe: str
    res_id: str
    point_name: str

    @property
    def station(self) -> str:
        """提取站名 —— 长名按 `/` 分段，跳过占位段后取第一个可用段

        ⚠️ 原先这里硬编码跳过 `CY` 开头段（某现场的占位约定）。那是现场
        事实，现在由 `DG_OPCDA_SKIP_PREFIXES` 给；不配 ⇒ 除 `_` 开头外不跳
        任何段。**不给那个现场值兜底** —— 兜底等于把现场料从判断挪进常量。
        """
        skips = tuple(skip_prefixes()) + ("_",)
        for p in self.long_name.split('/'):
            if p and not p.startswith(skips):
                return p.split('_')[0] if '_' in p else p[:8]
        return 'unknown'

    @property
    def point_type(self) -> str:
        """提取测点类型（名尾的 2-4 位大写字母，如量纲缩写）"""
        match = re.search(r'([A-Z]{2,4})$', self.point_name)
        return match.group(1) if match else 'unknown'


class OpcdaCollector:
    """OPC DA 关系库采集器"""

    def __init__(self, oracle_reader, event_bus=None):
        self._oracle = oracle_reader
        self._bus = event_bus
        self._running = False
        self._task: Optional[asyncio.Task] = None
        self._stats = {"polls": 0, "points_total": 0, "errors": 0, "last_poll": None}
        self._points_cache: Dict[str, OpcdaPoint] = {}

    async def start(self, interval: float = 300):
        self._running = True
        # 先加载点位索引
        ok = await self._load_points()
        if not ok:
            log.error("[opcda] 点位索引没加载上 —— 起来了也只会发 0。"
                      "（早先这里照样打印 Started，绿灯压着红灯。）")
        self._task = asyncio.create_task(self._loop(interval))
        log.info(f"[opcda] Started interval={interval}s points={len(self._points_cache)}"
                 f" loaded={'ok' if ok else 'FAILED'}")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()

    async def _load_points(self) -> bool:
        """加载点位定义。返回是否成功 —— 静默返回空集是最坏的一种"成功"。"""
        table = point_table()
        if not table:
            log.error("[opcda] 未配置 DG_OPCDA_POINT_TABLE —— 本仓不留默认表名")
            return False
        try:
            r = self._oracle.query(
                f"SELECT POINT_ID, POINT_LONGNAME, DESCRIBE, RES_ID, WELLPOINT_NAME "
                f"FROM (SELECT * FROM {table} ORDER BY POINT_ID) "
                f"WHERE ROWNUM <= 5000"
            )
            for row in r.get('rows', []):
                pt = OpcdaPoint(
                    point_id=row.get('POINT_ID', ''),
                    long_name=row.get('POINT_LONGNAME', ''),
                    describe=row.get('DESCRIBE', ''),
                    res_id=row.get('RES_ID', ''),
                    point_name=row.get('WELLPOINT_NAME', ''),
                )
                self._points_cache[pt.point_id] = pt
            n = len(self._points_cache)
            # ROWNUM 截断是静默的：正好 5000 就是"很可能还有"。把它说出来。
            if n >= 5000:
                log.warning(f"[opcda] 点位索引停在 {n} 条 —— `ROWNUM <= 5000` 的"
                            f"截断很可能已经咬到，后面的点没进来。")
            log.info(f"[opcda] Loaded {n} point definitions")
            return True
        except Exception as e:
            log.error(f"[opcda] Load points failed: {e}")
            return False

    async def _loop(self, interval: float):
        while self._running:
            try:
                await self._poll_stats()
            except Exception as e:
                self._stats["errors"] += 1
                log.error(f"[opcda] Poll error: {e}")
            await asyncio.sleep(interval)

    async def _poll_stats(self):
        """按分组前缀统计测点数

        ⚠️ 载荷键由 `dx_points`/`jb_points`/... 改成通用的 `buckets` 字典：
        原先那四个键名就是某现场的四个前缀，留着等于把分组名写进事件契约。
        该事件目前**全仓无订阅者**（见 tests/test_eventbus_wiring_map.py），
        改键没有下游要同步。
        """
        table = point_table()
        bks = buckets()
        if not table or not bks:
            log.warning("[opcda] 未配置 DG_OPCDA_POINT_TABLE / DG_OPCDA_BUCKETS"
                        " —— 跳过本轮统计")
            return
        base = station_prefix()
        sel = ", ".join(
            f"(SELECT COUNT(*) FROM {table} WHERE POINT_LONGNAME LIKE "
            f"'{base}{b}%') AS \"B{i}\"" for i, b in enumerate(bks))
        r = self._oracle.query(f"SELECT {sel} FROM dual")
        if r['rows']:
            row = r['rows'][0]
            self._stats["polls"] += 1
            self._stats["last_poll"] = time.time()

            counts = {b: int(row.get(f'B{i}', 0) or 0) for i, b in enumerate(bks)}
            payload = {
                "source": "opcda",
                "buckets": counts,
                "total": sum(counts.values()),
                "timestamp": time.time(),
                "poll_seq": self._stats["polls"],
            }
            self._stats["points_total"] = payload["total"]

            if self._bus:
                self._bus.emit("opcda.stats", **payload)
            log.debug(f"[opcda] {counts}")

    def status(self) -> dict:
        return {"running": self._running, **self._stats}
