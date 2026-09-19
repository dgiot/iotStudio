"""
设备接入身份注册表 — devaddr → {product_id, device_secret}
=============================================================
给 `EdgeHubPusher` 的 resolver 供数。存在的理由是**同步/异步形状对不上**:
pusher 的 `push_telemetry` 是同步方法，在里面直接查身份；而 ParseStore
全是 async。把 async 桥进同步路径（`asyncio.run` 会撞上已在跑的事件循环、
`run_coroutine_threadsafe` 要自己管 loop 引用）都是往热路径里塞雷，
所以改成「装载本地快照 + 后台定期刷新」，查表退化成一次 dict 查找。

**一致性地平线**：快照每 `refresh_interval` 秒整体换一次，pusher 侧还有一层
按 devaddr 的身份缓存 TTL。所以「中枢新建了一台设备 / 轮换了一次密钥，
边缘多久能跟上」= 两个周期之和，不是"重启才生效"。旧快照在换的瞬间被
整体丢弃而不是逐条合并 —— 半新半旧的表比全旧更难排查。

**为什么 product 要取 Pointer 的 objectId**：中枢认的 productId 是 Parse
objectId（`md5("Product"+categoryId+devType+name)[:10]`，见 models/dgiot_ids.py），
不是产品名。设备行里的 `product` 是指向 Product 的 Pointer，objectId 就
在那里面。取不到就返回 None —— 让 pusher 拒发，而不是拼个发得出去但
中枢记到别家账上的主题。
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, Optional

from ..models.dgiot_ids import is_object_id

log = logging.getLogger("device_identity")

#: 默认刷新周期（秒）。与 EdgeHubPusher 的 identity_ttl 同量级，
#: 两者相加才是"改中枢配置到边缘生效"的真实延迟。
DEFAULT_REFRESH_INTERVAL = 300

#: 单页拉取条数 —— 分页拉全量，避免一次把上万条设备塞进一次响应
PAGE_SIZE = 500


def _get(row: Any, *names: str, default=None):
    """从 dict / SimpleNamespace / ORM 对象上按多个候选名取值

    设备行有三条来源（Parse REST、ORM、parse.db 裸表），字段名不完全一致
    （devaddr / device_id，deviceSecret / device_secret），这里统一抹平。
    """
    for n in names:
        v = row.get(n) if isinstance(row, dict) else getattr(row, n, None)
        if v not in (None, ""):
            return v
    return default


def _pointer_id(value: Any) -> str:
    """从 Pointer / 字符串里取出 objectId

    Parse Pointer 形如 {"__type":"Pointer","className":"Product","objectId":"…"}。
    有些老数据直接存字符串，也认。
    """
    if isinstance(value, dict):
        return str(value.get("objectId") or "")
    if isinstance(value, str):
        return value
    return ""


class DeviceIdentityRegistry:
    """可调用的同步查表对象 —— 直接当 resolver 传给 EdgeHubPusher"""

    def __init__(self, pg_store, refresh_interval: int = DEFAULT_REFRESH_INTERVAL):
        self._pg = pg_store
        self._interval = max(30, int(refresh_interval))
        self._map: Dict[str, dict] = {}
        self._task: Optional[asyncio.Task] = None
        self._loaded = False
        self._error: Optional[str] = None

    # ── 装载 ──

    async def load(self) -> int:
        """全量拉一次设备表，成功则整体替换快照

        拉取失败**保留旧快照**：一次网络抖动不该让整个边缘侧突然推不出去。
        但会把错误记在 status() 里，别让"用着三天前的表"这种事无声无息。
        """
        try:
            rows = await self._fetch_all()
        except Exception as e:  # noqa: BLE001 - 刷新失败不该中断采集
            self._error = str(e)
            log.warning(f"[identity] 设备表刷新失败，沿用旧快照({len(self._map)} 条): {e}")
            return len(self._map)

        fresh: Dict[str, dict] = {}
        skipped = 0
        for r in rows:
            devaddr = str(_get(r, "devaddr", "device_id", default="") or "")
            if not devaddr:
                continue
            pid = _pointer_id(_get(r, "product", default=""))
            if not pid or not is_object_id(pid):
                # 非 10 位 objectId 落在这里。现有数据两种情况都有：
                #   本仓 parse_lite 生成的 Product objectId 是 20 位 hex
                #   Device 行根本没挂 product 指针
                # 两者拼出的 clientid 都过不了中枢 ACL（定长 10），broker
                # 静默 deny —— 提前挡掉并计数，别让它无声消失。
                skipped += 1
                continue
            fresh[devaddr] = {
                "product_id": pid,
                "device_secret": str(_get(r, "deviceSecret", "device_secret", default="") or ""),
            }

        self._map = fresh
        self._loaded = True
        self._error = None
        if skipped:
            log.warning(f"[identity] {skipped} 台设备没有可用的 product objectId，已跳过 —— "
                        f"这些设备推不到中枢。两种常见原因：本仓 parse_lite 生成的 "
                        f"objectId 是 20 位（中枢是 10 位 md5，两套 id 不同源）；"
                        f"或 Device 行没挂 product 指针")
        log.info(f"[identity] 设备接入身份表已装载: {len(fresh)} 台")
        return len(fresh)

    async def _fetch_all(self) -> list:
        """分页拉全量设备。走 ParseStore 的公开 API，不碰它的内部字段。"""
        rows: list = []
        page = 1
        while True:
            items, total = await self._pg.list_devices(page=page, page_size=PAGE_SIZE)
            rows.extend(items or [])
            if not items or len(rows) >= (total or 0):
                break
            page += 1
        return rows

    # ── 后台刷新 ──

    def start(self) -> None:
        """启动后台刷新循环（幂等）。在事件循环里调用。"""
        if self._task and not self._task.done():
            return
        self._task = asyncio.create_task(self._loop())

    async def _loop(self) -> None:
        while True:
            try:
                await asyncio.sleep(self._interval)
                await self.load()
            except asyncio.CancelledError:
                raise
            except Exception as e:  # noqa: BLE001 - 循环不能因单次异常退出
                self._error = str(e)
                log.warning(f"[identity] 刷新循环异常: {e}")

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass
            self._task = None

    # ── resolver 接口（同步）──

    def __call__(self, devaddr: str) -> Optional[dict]:
        """EdgeHubPusher 的 resolver 签名 —— 纯内存查表，不阻塞"""
        return self._map.get(devaddr)

    def status(self) -> dict:
        return {"devices": len(self._map), "loaded": self._loaded,
                "refresh_interval": self._interval, "error": self._error}
