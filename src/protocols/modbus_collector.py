"""
Modbus 直连采集器 — 接管既有上位机未覆盖的设备
================================================
设备参数从现场 SCADA 侧的关系库读 → 直接 Modbus TCP 采集 → TDengine + MQTT

**要接管哪些驱动、参数表叫什么 —— 是现场事实，由环境给：**
  DG_TAKEOVER_DRIVERS     逗号分隔的驱动名列表
  DG_DEVICE_PARAM_TABLE   设备参数表名

⚠️ 两项都**不给默认值**。默认值在这里只有一种写法 —— 把某个现场的驱动名和
表名写回来，而那正是本文件清掉的东西。换个默认等于把现场料从 SQL 挪进常量：
门禁看不见了，风险一点没少。不配 ⇒ 发现 0 台设备，并把这件事写进日志。

用法:
  from src.protocols.modbus_collector import ModbusCollector
  c = ModbusCollector(site="<site>", gateway="<gateway>")
  await c.discover_devices()   # 从关系库发现设备
  await c.collect_all()        # 采集一轮
"""
import asyncio, logging, os, re, time, struct
from dataclasses import dataclass, field
from typing import Optional, Dict, List

log = logging.getLogger("modbus_collector")

#: Oracle 标识符的字形 —— 表名只允许这一种。
#: 表名进不了绑定变量（Oracle 的绑定变量管不了标识符），只能拼进 SQL，所以
#: 这里**必须**卡死字形：现场把 DG_DEVICE_PARAM_TABLE 配错一个字符就地止步，
#: 而不是拼出一句语法错误的 SQL，让人以为是库连不上。
_IDENT_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_$#]{0,29}$")


def takeover_drivers() -> List[str]:
    """要接管的设备驱动名 —— 现场给，本仓无默认。"""
    raw = os.environ.get("DG_TAKEOVER_DRIVERS", "")
    return [d.strip() for d in raw.split(",") if d.strip()]


def device_param_table() -> str:
    """设备参数表名 —— 现场给，本仓无默认。字形不合就地抛，不猜。"""
    t = os.environ.get("DG_DEVICE_PARAM_TABLE", "").strip()
    if t and not _IDENT_RE.match(t):
        raise ValueError(
            f"DG_DEVICE_PARAM_TABLE={t!r} 不是合法的 Oracle 标识符形状"
            f"（{_IDENT_RE.pattern}）—— 表名要拼进 SQL，认不出就停手。")
    return t


@dataclass
class ModbusDevice:
    name: str
    channel: str
    driver: str
    host: str = "127.0.0.1"
    port: int = 502
    timeout: float = 12.0
    cycle: int = 1000
    status: str = "unknown"
    tags: int = 0


class ModbusCollector:
    """Modbus 直连采集引擎

    site/gateway **必填、无默认**：它们进的是边缘内部主题的第 1、2 段
    （`dgiot/{site}/{gateway}/{device}/{point}/data`，见 CLAUDE.md 与
    abac.TOPIC_RE —— 两处都是 5 段、都没有 channel 段）。

    ⚠️ 原先签名给的是 `site="default"`, `gateway="gw_1"`，而本类的文档写着
    「必须显式给」。**签名与文档打架时，赢的永远是签名**：调用方写
    `ModbusCollector()` 不报错，然后往一个中枢不会路由的主题发，全程无错
    无日志。这与 `tests/test_eventbus_wiring_map.py` 里那个「新建 EventBus
    实例投进空表」同族 —— **失败形态是安静**。

    ⚠️ 本模块目前**全仓没有实例化点**，且 `_tdengine` / `_mqtt` 两个属性
    从声明起就没有被赋过值 —— `_store_and_push` 的两个出口都走不到。
    这里把主题与签名改对，是为了将来真接上时不会继承一个字段错位、
    站名写死的串。
    """

    def __init__(self, site: str, gateway: str):
        self.devices: Dict[str, ModbusDevice] = {}
        self._site = site
        self._gateway = gateway
        self._tdengine = None
        self._mqtt = None
        self._stats = {"collected": 0, "errors": 0}

    async def discover_devices(self):
        """从关系库发现要接管的设备"""
        drivers = takeover_drivers()
        table = device_param_table()
        if not drivers or not table:
            log.warning(
                "[modbus] 未配置 DG_TAKEOVER_DRIVERS / DG_DEVICE_PARAM_TABLE —— "
                "发现 0 台设备。这两项是现场事实，本仓不留默认值（见模块头）。")
            return 0

        from ..storage.oracle_bridge import get_bridge
        b = get_bridge()

        # 驱动名是**值**，走引号转义；表名是**标识符**，走 device_param_table()
        # 的字形校验 —— 两条路都要，缺一条就是"只防了一半"。
        in_list = ",".join("'" + d.replace("'", "''") + "'" for d in drivers)
        result = b.query(
            f"SELECT NAME,CHANNELNAME,DRIVERNAME,DEVDESC,UPDATECYC,TIMEOUT,STATUS "
            f"FROM {table} WHERE DRIVERNAME IN ({in_list})",
            label="devices"
        )
        for row in result.get('rows', []):
            name = row.get('NAME', '')
            if not name: continue
            # CHANNELNAME 可能是 IP，也可能是现场自己的通道编码。**本模块不猜
            # 编码规则** —— 猜错是静默的：推断出来的 host 会被直接拿去连，连不上
            # 只记一条 debug。编码规则由现场给（见模块头的环境变量）。
            ch = row.get('CHANNELNAME', '')
            host = "127.0.0.1"
            dev = ModbusDevice(
                name=name,
                channel=ch,
                driver=row.get('DRIVERNAME', ''),
                host=host, port=502,
                timeout=float(row.get('TIMEOUT', 12)),
                cycle=int(row.get('UPDATECYC', 1000)),
                status=row.get('STATUS', '0'),
            )
            self.devices[name] = dev

        by_driver: Dict[str, int] = {}
        for d in self.devices.values():
            by_driver[d.driver] = by_driver.get(d.driver, 0) + 1
        log.info(f"[modbus] 发现 {len(self.devices)} 台设备 {by_driver}")
        return len(self.devices)

    async def collect_device(self, dev: ModbusDevice) -> dict:
        """采集单台设备"""
        try:
            import pymodbus.client as pmc
            client = pmc.AsyncModbusTcpClient(dev.host, port=dev.port, timeout=dev.timeout)
            await client.connect()
            if not client.connected:
                self._stats["errors"] += 1
                return {"status": "offline", "device": dev.name}

            # 读取保持寄存器 (标准采集范围 0-99)
            result = await client.read_holding_registers(0, 100)
            values = result.registers if result and not result.isError() else []
            client.close()

            if values:
                self._stats["collected"] += 1
                # 写入 TDengine + 推 MQTT
                await self._store_and_push(dev.name, values)
                return {"status": "ok", "device": dev.name, "registers": len(values)}
            else:
                self._stats["errors"] += 1
                return {"status": "empty", "device": dev.name}
        except Exception as e:
            self._stats["errors"] += 1
            log.debug(f"[modbus] {dev.name}: {e}")
            return {"status": "error", "device": dev.name, "error": str(e)}

    async def collect_all(self) -> dict:
        """采集所有设备

        ⚠️ `[:10]` 是开发期留下的截断，**行为原样保留**（改采集策略不在本次
        范围内），但把截断**写进日志**：一个静默只采前 10 台、而调用方以为
        采全了的采集器，报出来的每个数都是真的 —— 这是「静默降级」里最难
        发现的一种。
        """
        results = []
        for dev in list(self.devices.values())[:10]:
            r = await self.collect_device(dev)
            results.append(r)
        online = sum(1 for r in results if r['status'] == 'ok')
        capped = (f"（本轮只采前 {len(results)}/{len(self.devices)} 台）"
                  if len(self.devices) > len(results) else "")
        log.info(f"[modbus] 采集完成: {online}/{len(results)} 在线{capped}")
        return {"total": len(results), "online": online, "errors": self._stats["errors"]}

    async def _store_and_push(self, device_id: str, values: list):
        """写入 TDengine 并推 MQTT

        逐寄存器出口 —— 每条报文一个点，点号与 TDengine 那侧同源
        (`reg_{i}`)。原先是把 10 个寄存器打成一个批量报文发到一个 6 段主题
        （多出一个 `ch_*` 段）：按 5 段式读，`ch_*` 占的是 **device** 段、
        设备 id 占的是 **point** 段 —— 字段整体错位一格，而且批量报文塞不进
        「一个点」的语义里。

        （此处原先逐字复述了改之前那串主题里的站名与网关名。修一处现场料
        却在说明里把那串值再抄一遍，是把清掉的东西从后门放回来 —— 说明也
        是公开仓的正文。）
        """
        batch = list(values[:10])
        if self._tdengine:
            for i, v in enumerate(batch):
                await self._tdengine.insert_point(
                    device_id=device_id, point_id=f"reg_{i}",
                    point_name=f"寄存器{i}", value=float(v), unit="",
                    device_type="rtu", station_id=self._site,
                )
        if self._mqtt:
            import json
            ts = int(time.time() * 1000)
            for i, v in enumerate(batch):
                self._mqtt.publish(
                    f"dgiot/{self._site}/{self._gateway}/{device_id}/reg_{i}/data",
                    json.dumps({"ts": ts, "value": float(v)}))

    def get_stats(self):
        return {"devices": len(self.devices), **self._stats}
