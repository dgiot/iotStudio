"""
Oracle 数据管道 — 定时采 Oracle → 写 TDengine → 推 MQTT

流水线:
  131(ADB/ADO) → Oracle(129:1521) → OracleBridge → parse_point_path
    → TDengine(192.168.10.167:6041) or SQLite(fallback)
    → MQTT(127.0.0.1:1883)

配置:
  config.yaml → tdengine + mqtt + oracle_pipeline

用法:
  from src.services.oracle_pipeline import OraclePipeline
  pipeline = OraclePipeline()
  await pipeline.start()
"""
import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class OraclePipeline:
    """Oracle → TDengine → MQTT 定时采集管道

    采集策略:
      - 运行率: 每 60s 拉一次 (高频)
      - 设备状态: 每 300s 拉一次
      - 功图记录: 每 600s 拉最新批次
    """

    def __init__(self):
        self._running = False
        self._tasks: List[asyncio.Task] = []
        self._tdengine = None
        self._mqtt = None
        self._vendor_oilmon_adapters = []  # 有叶云适配器列表
        self._stats = {
            "cycles": 0, "points_written": 0, "mqtt_pushed": 0,
            "errors": 0, "started_at": None, "last_cycle": None,
            "vendor_oilmon_points": 0,
        }

    async def start(self):
        """启动管道"""
        if self._running:
            return {"status": "already running"}

        # 初始化 TDengine
        from ..storage.tdengine import TDEngineStore
        self._tdengine = TDEngineStore()
        td_ok = await self._tdengine.connect()
        logger.info(f"[pipeline] TDengine: {'connected' if td_ok else 'fallback SQLite'} (is_fallback={self._tdengine._is_fallback})")

        # 初始化 MQTT
        try:
            import paho.mqtt.client as mqtt
            from ..config import cfg
            mqtt_cfg = cfg.mqtt if hasattr(cfg, 'mqtt') else None
            if mqtt_cfg:
                self._mqtt = mqtt.Client(client_id=getattr(mqtt_cfg, 'client_id', 'dgiot_lite_pipeline'))
                if getattr(mqtt_cfg, 'username', ''):
                    self._mqtt.username_pw_set(mqtt_cfg.username, mqtt_cfg.password)
                self._mqtt.connect_async(mqtt_cfg.host, mqtt_cfg.port)
                self._mqtt.loop_start()
                logger.info(f"[pipeline] MQTT connected to {mqtt_cfg.host}:{mqtt_cfg.port}")
            else:
                logger.info("[pipeline] MQTT not configured, skipping push")
        except ImportError:
            logger.info("[pipeline] paho-mqtt not installed, skipping push")
        except Exception as e:
            logger.warning(f"[pipeline] MQTT init failed: {e}")

        # 初始化有叶云适配器
        try:
            from ..protocols.vendor_oilmon import create_adapter, vendor_aConfig
            from ..config import cfg
            yy_cfg = cfg.vendor_oilmon if hasattr(cfg, 'vendor_oilmon') else None
            if yy_cfg:
                for dev in (yy_cfg.devices if hasattr(yy_cfg, 'devices') else
                            yy_cfg.get('devices', []) if isinstance(yy_cfg, dict) else []):
                    did = dev.get('uuid', '') if isinstance(dev, dict) else getattr(dev, 'uuid', '')
                    dname = dev.get('name', '') if isinstance(dev, dict) else getattr(dev, 'name', '')
                    adp = create_adapter(token='', device_id=did, name=dname)
                    # 先登录获取 token
                    adp.login()
                    # 初始采集
                    sensor_data = adp.full_sync()
                    if sensor_data:
                        sensors_count = len(sensor_data.get('sensors', []))
                        pts_count = len(sensor_data.get('realtime', []))
                        logger.info(f"[pipeline] 有叶云 [{dname}]: {sensors_count} sensors, {pts_count} points")
                    self._vendor_oilmon_adapters.append(adp)
        except ImportError:
            logger.info("[pipeline] 有叶云协议模块未加载")
        except Exception as e:
            logger.warning(f"[pipeline] 有叶云初始化失败: {e}")

        self._running = True
        self._stats["started_at"] = datetime.now(timezone.utc).isoformat()

        # 单循环: 不同频率的采集任务串行执行, 避免 WinRM 并发冲突
        self._tasks.append(asyncio.create_task(self._main_loop()))

        logger.info(f"[pipeline] Pipeline started (Oracle + {len(self._vendor_oilmon_adapters)} vendor_oilmon devices)")
        return {"status": "started", "tdengine": "fallback" if self._tdengine._is_fallback else "connected",
                "vendor_oilmon_devices": len(self._vendor_oilmon_adapters)}

    async def stop(self):
        """停止管道"""
        self._running = False
        for t in self._tasks:
            t.cancel()
        if self._mqtt:
            self._mqtt.loop_stop()
            self._mqtt.disconnect()
        if self._tdengine:
            await self._tdengine.close()
        logger.info("[pipeline] stopped")

    # ═══════════════════════════════════════════════════════════
    # 采集循环 (单线程串行, 避免 WinRM 并发认证冲突)
    # ═══════════════════════════════════════════════════════════

    async def _main_loop(self):
        """主循环: 每 60s 跑一次, 按计数器决定执行哪些任务"""
        tick = 0
        while self._running:
            try:
                # 每次都采集运行率
                await self._collect_run_rate()

                # 每 5 个 tick (300s/5min) 采有叶云油液数据
                if tick % 5 == 0 and self._vendor_oilmon_adapters:
                    await self._collect_vendor_oilmon()

                # 每 5 个 tick (300s) 采一次测点
                if tick % 5 == 0:
                    await self._collect_points(limit=100)

                # 每 10 个 tick (600s) 更新统计
                if tick % 10 == 0:
                    await self._collect_stats()

                tick += 1
            except Exception as e:
                self._stats["errors"] += 1
                logger.error(f"[pipeline] loop error: {e}")

            await asyncio.sleep(60)

    # ═══════════════════════════════════════════════════════════
    # 数据采集方法
    # ═══════════════════════════════════════════════════════════

    async def _query_oracle(self, sql: str, label: str = "q") -> dict:
        """通过 OracleBridge 查询 (串行化以避免 WinRM 并发冲突)"""
        from ..storage.oracle_bridge import get_bridge
        loop = asyncio.get_event_loop()
        # 使用 asyncio.Lock 确保同一时间只有一个 Oracle 查询
        if not hasattr(self, '_query_lock'):
            self._query_lock = asyncio.Lock()
        async with self._query_lock:
            return await loop.run_in_executor(None, lambda: get_bridge().query(sql, label=label))

    async def _collect_run_rate(self):
        """采集最新运行率"""
        result = await self._query_oracle(
            "SELECT * FROM (SELECT INSERT_TIME, TODAY_RUN_RATE "
            "FROM SYS_DEVICE_RUN_DETAILS_HIST ORDER BY INSERT_TIME DESC) WHERE rownum <= 1",
            label="run_rate"
        )
        rows = result.get('rows', [])
        if not rows:
            return

        row = rows[0]
        rate = float(row.get('TODAY_RUN_RATE', 0))
        ts_str = row.get('INSERT_TIME', '')

        # 写 TDengine
        await self._tdengine.insert_point(
            device_id="oil_field_industry", point_id="run_rate",
            point_name="运行率", value=rate, unit="%",
            device_type="oil_field", station_id="DEVICE_D",
            quality=192,
        )

        # 推 MQTT
        self._push_mqtt("dgiot/industry_c1/gw_131/ch_oracle/run_rate/data", {
            "ts": ts_str, "value": rate, "unit": "%", "quality": 192,
        })

        self._stats["cycles"] += 1
        self._stats["points_written"] += 1
        self._stats["last_cycle"] = datetime.now(timezone.utc).isoformat()

        # 推送到 EventBus
        try:
            from ..eventbus import bus
            bus.emit("pipeline.point_written", device_id="oil_field_industry",
                     point_id="run_rate", value=rate, unit="%")
        except: pass

        logger.info(f"[pipeline] RunRate: {rate}% @ {ts_str}")

    async def _collect_points(self, limit: int = 100):
        """采集测点关系数据"""
        result = await self._query_oracle(
            f"SELECT * FROM (SELECT POINT_ID, POINT_LONGNAME, DESCRIBE, RES_ID, WELLPOINT_NAME "
            f"FROM SYS_POINTRELATION_WELL ORDER BY POINT_ID) WHERE rownum <= {limit}",
            label="points"
        )
        rows = result.get('rows', [])
        from ..storage.oracle_bridge import get_bridge
        bridge = get_bridge()
        count = 0

        for row in rows:
            path = row.get('POINT_LONGNAME', '')
            parsed = bridge.parse_point_path(path)

            site = parsed.get('site', 'default')
            well = parsed.get('well', 'unknown')
            pt_code = parsed.get('point_code', 'unknown')
            desc = row.get('DESCRIBE', '')
            res_id = row.get('RES_ID', '')
            point_id = row.get('POINT_ID', '')

            # 写 TDengine
            await self._tdengine.insert_point(
                device_id=well, point_id=pt_code,
                point_name=desc, value=0.0, unit="",
                device_type="oil_well", station_id=site,
                quality=0,
            )

            # 推 MQTT (仅推送结构化信息，不是实时值)
            self._push_mqtt(f"dgiot/{site}/gw_131/ch_a11_rtu/{well}/{pt_code}/meta", {
                "point_id": point_id, "res_id": res_id,
                "describe": desc, "path": path,
                "ontology": parsed,
            })
            count += 1

        self._stats["points_written"] += count
        self._stats["mqtt_pushed"] += count
        logger.info(f"[pipeline] Points: {count} synced")

    async def _collect_vendor_oilmon(self):
        """采集有叶云油液监测数据 (每 5 分钟)"""
        for adp in self._vendor_oilmon_adapters:
            try:
                realtime = adp.fetch_realtime()
                loop = asyncio.get_event_loop()
                for pt in realtime:
                    if pt.get('value') is None:
                        continue
                    # 写 TDengine
                    await self._tdengine.insert_point(
                        device_id=adp.config.device_id,
                        point_id=str(pt.get('key_id', 'unknown')),
                        point_name=pt.get('key_name', ''),
                        value=pt['value'],
                        unit=pt.get('unit', ''),
                        device_type="oil_monitor",
                        station_id="vendor_oilmon",
                        quality=192,
                    )
                    # 推 MQTT
                    self._push_mqtt(
                        f"dgiot/vendor_oilmon/{adp.config.device_name}/{pt['key_id']}/data",
                        {"ts": datetime.now(timezone.utc).isoformat(),
                         "value": pt['value'], "unit": pt.get('unit', ''),
                         "key_name": pt.get('key_name', ''), "quality": 192},
                    )
                count = len([p for p in realtime if p.get('value') is not None])
                self._stats["vendor_oilmon_points"] += count
                self._stats["points_written"] += count
                self._stats["mqtt_pushed"] += count
                logger.info(f"[pipeline] 有叶云 [{adp.config.device_name}]: {count} points")
            except Exception as e:
                self._stats["errors"] += 1
                logger.error(f"[pipeline] 有叶云 error: {e}")

    async def _collect_stats(self):
        """采集数据库统计 + OPC DA"""
        from ..storage.oracle_bridge import get_bridge
        bridge = get_bridge()
        loop = asyncio.get_event_loop()
        stats = await loop.run_in_executor(None, bridge.get_counts)

        # OPC DA 点位统计
        try:
            opcda_result = await self._query_oracle(
                "SELECT "
                "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/DX%') AS DX, "
                "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/JB%') AS JB, "
                "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/Z1%') AS Z1, "
                "(SELECT COUNT(*) FROM SYS_POINTRELATION_STATION WHERE POINT_LONGNAME LIKE '/DEVICE_D/Z2%') AS Z2 "
                "FROM dual",
                "opcda_stats"
            )
            if opcda_result and opcda_result.get('rows'):
                stats['opcda'] = opcda_result['rows'][0]
        except Exception as e:
            logger.warning(f"[pipeline] OPC DA stats failed: {e}")
            stats['opcda'] = {'error': str(e)}

        # 推 MQTT
        self._push_mqtt("dgiot/industry_c1/gw_131/ch_oracle/stats/data", {
            "ts": datetime.now(timezone.utc).isoformat(),
            "tables": stats,
        })
        logger.info(f"[pipeline] Stats: {json.dumps(stats)}")

    # ═══════════════════════════════════════════════════════════
    # MQTT 推送
    # ═══════════════════════════════════════════════════════════

    def _push_mqtt(self, topic: str, payload: dict):
        """推送 JSON 消息到 MQTT"""
        if not self._mqtt:
            return
        try:
            msg = json.dumps(payload, ensure_ascii=False, default=str)
            self._mqtt.publish(topic, msg, qos=1)
            self._stats["mqtt_pushed"] += 1
        except Exception as e:
            logger.debug(f"[pipeline] MQTT push failed: {e}")

    # ═══════════════════════════════════════════════════════════
    # 查询接口
    # ═══════════════════════════════════════════════════════════

    def get_stats(self) -> dict:
        return {
            "running": self._running,
            "tdengine": "connected" if self._tdengine and not self._tdengine._is_fallback else "fallback",
            "mqtt": "connected" if self._mqtt else "disabled",
            **self._stats,
        }

    async def run_once(self) -> dict:
        """手动触发一次全量采集"""
        await self._collect_run_rate()
        await self._collect_points(limit=50)
        return {"status": "ok", "stats": self._stats}


# ═══════════════════════════════════════════════════════════════
# 全局实例
# ═══════════════════════════════════════════════════════════════

_pipeline: Optional[OraclePipeline] = None


def get_pipeline() -> OraclePipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = OraclePipeline()
    return _pipeline
