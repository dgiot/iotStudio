# ============================================================
# 有叶云真实数据采集器 — 油液在线监测数据 → telemetry.db
# ============================================================
"""
从有叶云 API 实时采集油液数据，写入 telemetry.db。

启动:
    python tools/youyeyun_collector.py

凭证: 环境变量或配置默认值 (sell@inzoc.com / A1234567)
"""
import asyncio
import logging
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.config import cfg
from src.storage.tdengine import TDEngineStore
from src.protocols.youyeyun import YouyeyunProtocolAdapter
from src.protocols.base import ProtocolConfig

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
logger = logging.getLogger("youyeyun_collect")


async def main():
    td = TDEngineStore()
    await td.connect()
    logger.info(f"[youyeyun] TDengine connected (fallback={td._is_fallback})")

    config = ProtocolConfig(
        protocol_type="youyeyun",
        device_id="oil_monitor_b1e2",
        device_name="油液监测-北1-2",
        collect_interval=300,
        points=[],
        extra={
            "username": os.environ.get("YY_USER", "sell@inzoc.com"),
            "password": os.environ.get("YY_PASS", "A1234567"),
            "yy_device_id": os.environ.get("YY_DEVICE", "6bf6f220-d5bb-11ed-b812-ed5ae62e5bad"),
        },
    )
    adapter = YouyeyunProtocolAdapter(config)
    ok = await adapter.connect()
    if not ok:
        logger.error("[youyeyun] 登录失败")
        return
    logger.info("[youyeyun] 登录成功，开始采集...")

    count = 0
    while True:
        try:
            pts = await adapter.read_points([])
            if pts:
                rows = []
                now_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
                for p in pts:
                    try:
                        val = float(p.value)
                    except (ValueError, TypeError):
                        continue
                    rows.append({
                        "device_id": "oil_monitor_b1e2",
                        "point_id": str(p.point_id),
                        "point_name": p.point_name or str(p.point_id),
                        "value": val,
                        "unit": p.unit or "",
                        "device_type": "oil_monitor",
                        "station_id": "dqyt",
                    })
                if rows:
                    n = await td.batch_insert(rows)
                    count += 1
                    if count % 6 == 0:
                        logger.info(f"[youyeyun] 已采集 {count} 轮, 本轮 {n} 测点")
            else:
                logger.warning("[youyeyun] 空数据")

        except Exception as e:
            logger.error(f"[youyeyun] 采集失败: {e}")

        await asyncio.sleep(300)  # 5分钟一轮


if __name__ == "__main__":
    asyncio.run(main())
