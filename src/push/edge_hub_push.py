"""
边缘中枢数据推送 — MQTT 通道 (对齐 DG-IoT dlink 上行)
========================================================
链路:
  Parse 写入 → afterSave Hook → EventBus → PushEngine → EdgeHubPusher → 中枢

**中枢只认 dlink 一套主题**（apps/dgiot_dlink/src/proctol/dgiot_mqtt_message.erl）:
  $dg/thing/{productId}/{devaddr}/properties/report
第二段是**裸 devaddr**，不是 `{productId}_{devaddr}` —— 后者在中枢 ACL 里
被 legacy 规则放行，但中枢分发器把第二段直接喂给
`get_deviceid(ProductId, DevAddr)`，带前缀会算出另一台设备的 id。
判据是 check_device_addr/2：第二段按 "/" 切开后首个元素必须逐字等于 clientid 里的 devaddr。

## 三种接入身份（identity_mode）

dlink ACL 是「一条连接一个设备身份」，而 PushEngine 是「一条消息扇出给所有
pusher」—— 结构上对不上，所以身份必须显式选。三种模式在 ACL 里都有依据:

  device   —— 一设备一连接。clientid=`{pid}_{devaddr}`，username=`{pid}`，
              password=deviceSecret。发布 `$dg/thing/{pid}/{devaddr}/…`。
              最贴合真实设备，但**连接数 = 设备数**，需要连接池上限。
              ACL: dgiot_mqtt_acl.erl 两条主力规则。

  user     —— 一连接推全部。clientid=`{Token:34}{type}`，username=`{userId}`，
              发布 `$dg/thing/{deviceId}/…`（第二段是 10 位 deviceId 而非 devaddr）。
              边缘网关代理多设备时的正解，但要一个对目标设备有权限的账号凭据。
              ACL: acl.erl:92 那条 + check_device_acl/3 逐台校验。

  loopback —— 本机旁路。username=`dgiot` 且源 IP 127.0.0.1 时 ACL 无条件 allow。
              **仅当边缘与 hub 同机时成立**，跨机直接失效。不需要任何凭据，
              适合先把端到端链路验通。主题仍用 device 形态（旁路不解放主题正确性）。

默认 device —— 最合规的那种。另两种要显式配置，因为它们各自有前提
（凭据 / 同机），不该被默认继承。

## 凭据怎么拿

deviceSecret 是连接凭据，**不能进 PushEngine 的消息体** —— 消息是扇出给所有
pusher 的（含 HTTP webhook），塞进去等于把设备密钥交给每一个出口。
所以走注入的 resolver: `resolver(devaddr) -> {"product_id":…, "device_secret":…} | None`，
由接线方（main.py）提供，pusher 只管缓存和用。
"""
import json, os, time, logging
from typing import Any, Dict, Optional

log = logging.getLogger("edge_hub")

#: 身份模式
MODE_DEVICE = "device"      # 一设备一连接（dlink 设备身份）
MODE_USER = "user"          # 一连接推全部（用户 token 身份）
MODE_LOOPBACK = "loopback"  # 本机旁路（仅同机部署）
MODES = (MODE_DEVICE, MODE_USER, MODE_LOOPBACK)

#: 连接池上限。设备模式下一设备一条连接，无上限时设备一多就会打爆
#: broker 的 max_connections 然后整批掉线 —— 宁可拒绝新的并记一笔。
DEFAULT_MAX_CONNECTIONS = 64

#: 身份缓存有效期（秒）。0 = 永久缓存。默认与 device_identity 的刷新周期
#: 同量级：两者相加是"中枢改了密钥/加了设备 → 边缘跟上"的最坏延迟。
DEFAULT_IDENTITY_TTL = 300

#: 边缘网关标识的环境变量名 —— 现场给。
#: 这个值只进两处：loopback 模式的 MQTT client_id（`edge_hub_{网关}`）与
#: status()["gateway"]。**都不进主题**（主题走 dgiot_ids.dlink_topic，与网关名无关）。
#: 但 client_id 是**发给 broker 的**，broker 日志与 $SYS 树里看得见 ⇒ 一样是现场信息。
ENV_GATEWAY = "DG_EDGE_GATEWAY"

#: 未配置时的占位。刻意写成一眼看出「没配」的形状 —— 与隔壁 `tenant="default"`
#: 同族，是**描述缺失**而不是某个现场的名字。本仓纪律：兜底值绝不能长得比
#: 证据更像现场真值，否则「没标注」会被读成「现场真值」。
GATEWAY_UNSET = "edge-local"


def edge_gateway() -> str:
    """网关标识 —— 现场给（`DG_EDGE_GATEWAY`），本仓无现场默认值。

    ⚠️ 这里原先的签名默认值是一个**现场机器名**，出处是一份现场 OPC 探测脚本的
    部署注释。那份脚本已从本仓删除（死件：全仓零 import、无实例化点），所以此处
    只留结论、不再指向一个已不存在的文件。而本模块**全仓没有一处调用方显式传
    gateway**（`get_edge_pusher()` 只传 tenant；插件工厂给的是不含 gateway 的
    config dict）⇒ 每个部署都会拿到那个默认值，loopback 的 client_id 一致地
    自称那台机器。

    这与 `modbus_collector` 的 `site="default" / gateway="gw_1"` 同型：**默认值在
    这里只有一种写法 —— 把某个现场的名字写回来**。区别只在于处置：那边是死件、
    可以径直改必填；这边是活件、且有两条不传 gateway 的调用路径，改必填会打断
    它们，所以改为环境给 + 显式占位，并把「没配」这件事出声（见 __init__）。

    ⚠️ 本条说明**刻意不复述那个默认值**。修一处现场料却在说明里把那串值再抄
    一遍，等于从后门放回来 —— 说明也是公开仓的正文。
    ⚠️ 写下这句告诫时，本条的第一版**正在下方把那串值抄了回来**。触发器是
    「解释」这个动作本身，不是粗心：**越是想说清「为什么不能出现 X」，越容易
    在句子里把 X 写出来。** 于是这里的判据不是「记得住」，而是改完 grep 一遍。
    """
    return os.environ.get(ENV_GATEWAY, "").strip() or GATEWAY_UNSET


class EdgeHubPusher:
    """边缘中枢 MQTT 推送器 — 对标 DG-IoT EdgeHub

    构造:
      - 直连注入: EdgeHubPusher(mqtt_client=<paho client>, …) —— 测试/单连接场景
      - PushEngine 插件工厂: EdgeHubPusher(<config dict>) —— config:
        {host, port, tenant, gateway, identity_mode, product_id, device_secret,
         user_token, user_id, user_password, super_pwd, max_connections,
         identity_ttl}
        连接惰性建立（首次推送时），失败静默降级（不阻断采集）。
      - 生产接线: 身份查表由 main.py 注入 (DeviceIdentityRegistry)，见 set_resolver。

    `gateway` 可以省 —— 省了取 `DG_EDGE_GATEWAY`，都没有则用占位 `edge-local`
    （见 `edge_gateway()`）。**本类不设现场默认值**：原先这里写死的是某现场的
    机器号，而全仓没有一处调用方传 gateway，等于每个部署都自称那台机器。
    """

    def __init__(self, mqtt_client=None, tenant: str = "default",
                 gateway: Optional[str] = None, resolver=None):
        cfg = mqtt_client if isinstance(mqtt_client, dict) else {}
        if cfg:
            tenant = cfg.get("tenant", tenant)
            gateway = cfg.get("gateway", gateway)
            mqtt_client = None

        self._conn = None
        if cfg:
            self._conn = {"host": cfg.get("host", "127.0.0.1"),
                          "port": int(cfg.get("port", 1883))}
        self._cfg = cfg
        self._tenant = tenant
        # 网关名的三级来源：显式实参 → config dict（上面那行）→ DG_EDGE_GATEWAY。
        # 三级都没有才落到占位 —— 见 edge_gateway() 的说明。
        self._gateway_id = gateway or edge_gateway()

        mode = str(cfg.get("identity_mode", MODE_DEVICE)).lower()
        if mode not in MODES:
            log.warning(f"[edge_hub] 未知 identity_mode='{mode}'，回落到 {MODE_DEVICE}")
            mode = MODE_DEVICE
        self._mode = mode

        # 只在 loopback 模式下出声：**这是唯一把这个值发出去的地方**（client_id）。
        # device/user 模式网关名只进 status()，没配也不算缺 —— 无条件告警是自造
        # 假阳性。出声用构造期一次性，不放在 _make_client 里：那里是**按设备**
        # 调的（见下面身份缓存那段同样的顾虑：不能每个测点刷一行日志）。
        if self._mode == MODE_LOOPBACK and self._gateway_id == GATEWAY_UNSET:
            log.warning(
                f"[edge_hub] 未配置 {ENV_GATEWAY}（config 里也没有 gateway）—— "
                f"loopback 的 client_id 会用占位 {GATEWAY_UNSET!r}，不是现场网关名。"
                f"跨部署的同机旁路会撞同一个 client_id。")

        self._resolver = resolver
        # devaddr → (身份, 缓存时刻)。带 TTL 是因为 deviceSecret 会轮换 ——
        # 永久缓存会让边缘拿着旧密钥一直重连失败，且症状是"重启才好"。
        self._identity_cache: Dict[str, tuple] = {}
        self._identity_ttl = max(0, int(cfg.get("identity_ttl", DEFAULT_IDENTITY_TTL)))
        # 解析不到的设备按 devaddr 只告警一次：不缓存失败结果（否则新建设备
        # 要等重启才认），但也不能每个测点刷一行日志。
        self._warned_unknown: set = set()

        # 连接池: key → (client, last_used)。device 模式按 (pid,devaddr) 分池，
        # user/loopback 模式恒定一把（key 固定），走同一套代码路径。
        self._clients: Dict[str, Any] = {}
        self._client_used: Dict[str, float] = {}
        self._max_connections = int(cfg.get("max_connections", DEFAULT_MAX_CONNECTIONS))

        # 直连注入的 client —— 单连接语义，保持向后兼容
        self._mqtt = mqtt_client
        self._stats = {"pushed": 0, "failed": 0, "rejected": 0, "last": None}

    # ── 身份解析 ──

    def set_resolver(self, resolver):
        """注入凭据解析器: resolver(devaddr) -> {"product_id", "device_secret"} | None"""
        self._resolver = resolver
        self._identity_cache.clear()
        self._warned_unknown.clear()

    def _identity(self, devaddr: str) -> Optional[dict]:
        """devaddr → {product_id, device_secret, device_id}

        解析失败返回 None 并**不发布** —— 拼不出身份时宁可这条不发。
        发一个身份不对的主题，中枢那边是收下并记到别的设备账上，
        没有任何症状；不发至少 stats 里看得见。
        """
        if not devaddr or devaddr == "?":
            return None
        hit = self._identity_cache.get(devaddr)
        if hit:
            ident, at = hit
            if not self._identity_ttl or (time.time() - at) < self._identity_ttl:
                return ident

        ident = None
        if self._resolver:
            try:
                got = self._resolver(devaddr)
                if got and got.get("product_id"):
                    ident = self._build_identity(devaddr, got)
            except Exception as e:  # noqa: BLE001 - 解析失败不该中断采集
                log.warning(f"[edge_hub] 凭据解析失败 devaddr={devaddr}: {e}")

        # 单身份配置（无 resolver 时的退路：配置里直接给一对 product/devaddr）
        if ident is None and self._cfg.get("product_id"):
            ident = self._build_identity(devaddr, self._cfg)

        if ident is None:
            # **不缓存失败**：注册表还没刷到这台新设备时缓存了 None，
            # 等它刷到了这里也还是 None，症状就成了"新设备要重启边缘才上线"。
            if devaddr not in self._warned_unknown:
                self._warned_unknown.add(devaddr)
                log.warning(f"[edge_hub] devaddr={devaddr} 查不到 product_id，"
                            f"跳过（不发布）—— 以后再遇到不再重复告警")
            return None

        self._identity_cache[devaddr] = (ident, time.time())
        return ident

    @staticmethod
    def _build_identity(devaddr: str, src: dict) -> Optional[dict]:
        """把 {product_id, device_secret} 补全成完整身份

        devaddr 存在身份里而不是靠遍历缓存反查 —— 缓存是 devaddr→身份 的单向表，
        反查既 O(n) 又在两个 devaddr 解析出同一身份时给错答案。
        """
        pid = str(src.get("product_id") or "")
        if not pid:
            return None
        from ..models.dgiot_ids import device_id
        return {"devaddr": devaddr,
                "product_id": pid,
                "device_secret": src.get("device_secret") or "",
                "device_id": device_id(pid, devaddr)}

    # ── 主题 ──

    def _topic_for(self, ident: dict, *suffix: str) -> str:
        """按身份模式拼中枢主题

        user 模式第二段是 **deviceId**（10 位 md5），device/loopback 模式是
        **devaddr**。这不是风格差异 —— ACL 两种规则匹配的就是两种串。
        """
        from ..models.dgiot_ids import dlink_topic
        if self._mode == MODE_USER:
            head = ident["device_id"]        # 10 位 md5，不是 devaddr
            tail = "/".join(suffix)
            return f"$dg/thing/{head}" + (f"/{tail}" if tail else "")
        return dlink_topic(ident["product_id"], ident["devaddr"], *suffix)

    # ── 连接池 ──

    def _make_client(self, ident: dict):
        """按模式建一条连接。返回 None 表示建不起来（配置缺项/连不上）"""
        import paho.mqtt.client as mqtt
        host = (self._conn or {}).get("host", "127.0.0.1")
        port = (self._conn or {}).get("port", 1883)

        if self._mode == MODE_USER:
            token = self._cfg.get("user_token") or ""
            user_id = self._cfg.get("user_id") or ""
            if not token or not user_id:
                log.warning("[edge_hub] user 模式缺 user_token/user_id，无法接入")
                return None
            # ACL: clientid = <<Token:34/binary, _Type/binary>>, username = UserId
            c = mqtt.Client(client_id=f"{token}edge")
            c.username_pw_set(user_id, self._cfg.get("user_password") or "")
        elif self._mode == MODE_LOOPBACK:
            # ACL: username == <<"dgiot">> 且 PeerHost == 127.0.0.1 -> allow
            # 源 IP 由部署决定，这里只能保证 username；不同机时这条会失败，
            # 且失败方式是 broker 直接断连 —— 所以只在同机用。
            c = mqtt.Client(client_id=f"edge_hub_{self._gateway_id}")
            c.username_pw_set("dgiot", self._cfg.get("super_pwd") or "")
        else:
            # ACL: clientid = <<ProductID:10/binary, "_", DeviceAddr/binary>>, username = ProductID
            from ..models.dgiot_ids import dlink_client_id, dlink_username
            c = mqtt.Client(client_id=dlink_client_id(ident["product_id"], ident["devaddr"]))
            c.username_pw_set(dlink_username(ident["product_id"]),
                              ident.get("device_secret") or "")

        c.connect_async(host, port)
        c.loop_start()
        return c

    def _client_for(self, ident: dict):
        """取（或建）该身份对应的连接。超上限时淘汰最久未用的那把。"""
        if self._mqtt:                      # 直连注入路径：单连接语义
            return self._mqtt
        if ident is None:
            return None
        if not self._conn:                  # 没配 host/port 也没注入 client
            return None

        key = ident["device_id"] if self._mode == MODE_USER else \
            f"{ident['product_id']}_{ident['devaddr']}"
        if self._mode == MODE_LOOPBACK:
            key = "_loopback"               # 旁路模式只需一条连接（身份不由 clientid 承载）

        if key in self._clients:
            self._client_used[key] = time.time()
            return self._clients[key]

        if len(self._clients) >= self._max_connections:
            oldest = min(self._client_used, key=self._client_used.get)
            try:
                self._clients[oldest].loop_stop()
                self._clients[oldest].disconnect()
            except Exception:  # noqa: BLE001 - 淘汰失败不该影响新连接
                pass
            self._clients.pop(oldest, None)
            self._client_used.pop(oldest, None)
            log.info(f"[edge_hub] 连接池满，淘汰 {oldest}")

        try:
            c = self._make_client(ident)
        except Exception as e:  # noqa: BLE001 - 连不上要静默降级
            log.warning(f"[edge_hub] MQTT 连接失败, 静默降级: {e}")
            return None
        if c is None:
            return None
        self._clients[key] = c
        self._client_used[key] = time.time()
        return c

    def set_mqtt(self, client):
        self._mqtt = client

    # ── 推送方法 ──

    def push_telemetry(self, device_id: str, point_id: str, value: float,
                       unit: str = "", ts: float = None, channel: str = "oracle_pipe") -> bool:
        """推遥测数据到中枢 —— 走 dlink 主题

        `device_id` 在本仓库里就是 **devaddr**（见 parse_store.update_device_status
        按 {"devaddr": device_id} 查）。product/devaddr 由此反查身份。
        """
        ident = self._identity(device_id)
        if ident is None:
            self._stats["rejected"] += 1
            return False
        return self._publish(self._topic_for(ident, "properties", "report"),
                             {"ts": ts or time.time(), "value": value,
                              "unit": unit, "quality": 192},
                             ident=ident)

    # ── 统一 push(message) 协议 — PushEngine 兼容适配层 ──

    async def push(self, message: dict) -> bool:
        """统一消息协议: 只处理 telemetry

        device/alarm/stats 三类的中枢出口已删除 —— 中枢认的上行主题是个闭集
        （properties/report、init/request、firmware/report、report），
        没有这三个后缀，发出去没人消费。边缘内部要留痕就进日志，
        不要再借 MQTT 当内部总线。
        """
        mtype = message.get("type", "telemetry")
        if mtype == "telemetry":
            ts = message.get("timestamp")
            if isinstance(ts, str) and ts:
                try:
                    from datetime import datetime
                    ts = datetime.fromisoformat(ts).timestamp()
                except ValueError:
                    ts = None
            else:
                ts = None
            ok = True
            for pt in message.get("data") or []:
                ok = self.push_telemetry(
                    message.get("device_id", "?"), pt.get("point_id", "?"),
                    pt.get("value", 0), pt.get("unit", ""), ts=ts) and ok
            return ok
        log.warning(f"[edge_hub] 未知消息类型 '{mtype}', 丢弃")
        return False

    # ── 内部 ──

    def _publish(self, topic: str, payload: dict, ident: dict) -> bool:
        client = self._client_for(ident)
        if not client:
            log.debug(f"[edge_hub] MQTT not connected, skip: {topic}")
            self._stats["failed"] += 1
            return False
        try:
            msg = json.dumps(payload, ensure_ascii=False, default=str)
            client.publish(topic, msg, qos=1)
            self._stats["pushed"] += 1
            self._stats["last"] = time.time()
            return True
        except Exception as e:
            self._stats["failed"] += 1
            log.error(f"[edge_hub] MQTT push failed: {e}")
            return False

    def status(self) -> dict:
        return {"gateway": self._gateway_id, "tenant": self._tenant,
                "identity_mode": self._mode,
                "connections": len(self._clients),
                **self._stats}


# 全局单例
_edge_pusher: Optional[EdgeHubPusher] = None


def get_edge_pusher(tenant: str = "default",
                    gateway: Optional[str] = None) -> EdgeHubPusher:
    """全局单例。`gateway` 不传 ⇒ 由 `DG_EDGE_GATEWAY` 决定。

    （原先这条路径靠的是签名里那个写死的现场机器号 —— 见 edge_gateway()。）
    """
    global _edge_pusher
    if not _edge_pusher:
        _edge_pusher = EdgeHubPusher(tenant=tenant, gateway=gateway)
    return _edge_pusher
