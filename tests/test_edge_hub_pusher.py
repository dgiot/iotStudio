# ============================================================
# EdgeHubPusher 测试 — 统一 push(message) 协议 + dlink 身份三模式
#
# 重点不在"能不能发出去"，在**发到哪个主题、以什么身份**：中枢那边
# 主题/身份不对不会报错，只会把数据记到别的设备账上或直接丢。
# 所以每个模式都要把 clientid / username / topic 三者一起钉住。
# ============================================================
import asyncio
import json

from src.push.edge_hub_push import (
    MODE_DEVICE, MODE_LOOPBACK, MODE_USER, EdgeHubPusher,
)

PID = "152224c5ee"          # 10 位 objectId（中枢 ACL 按定长 10 匹配）
DEVADDR = "DTU001"
#: md5("Device" + PID + DEVADDR)[:10]
DID = "f76adfca3e"


class FakeMqtt:
    def __init__(self):
        self.published = []

    def publish(self, topic, msg, qos=1):
        self.published.append((topic, json.loads(msg), qos))
        return True


def _resolver(devaddr):
    """凭据解析器 —— 生产环境由 main.py 接线，这里给一台已知设备"""
    if devaddr == DEVADDR:
        return {"product_id": PID, "device_secret": "s3cret"}
    return None


def _pusher(client=None, **cfg):
    cfg.setdefault("identity_mode", MODE_DEVICE)
    p = EdgeHubPusher(cfg, resolver=_resolver)
    if client is not None:
        p._mqtt = client          # 直连注入：绕过连接池
    return p


def _telemetry_msg(devaddr=DEVADDR):
    from datetime import datetime
    return {
        "type": "telemetry",
        "device_id": devaddr,
        "timestamp": datetime(2026, 9, 9, 12, 0, 0).isoformat(),
        "data": [
            {"point_id": "p1", "point_name": "P1", "value": 1.5, "unit": "A", "quality": 192},
            {"point_id": "p2", "point_name": "P2", "value": 2.5, "unit": "V", "quality": 192},
        ],
    }


# ── 主题与身份 ──

def test_telemetry_goes_to_dlink_topic():
    """遥测必须落在中枢认的主题上，第二段是**裸 devaddr**"""
    c = FakeMqtt()
    p = _pusher(c)
    assert p.push_telemetry(DEVADDR, "pt1", 3.14, "A") is True
    topic, payload, qos = c.published[0]
    assert topic == f"$dg/thing/{PID}/{DEVADDR}/properties/report"
    assert topic.split("/")[3] == DEVADDR          # 不是 {pid}_{devaddr}
    assert payload["value"] == 3.14 and qos == 1


def test_device_mode_client_identity(monkeypatch):
    """device 模式 clientid/username 必须按 ACL：{pid}_{devaddr} / {pid}"""
    made = _capture_clients(monkeypatch)
    p = _pusher(identity_mode=MODE_DEVICE)
    p._conn = {"host": "127.0.0.1", "port": 1883}
    p.push_telemetry(DEVADDR, "pt1", 1.0)

    assert len(made) == 1
    c = made[0]
    assert c.kwargs["client_id"] == f"{PID}_{DEVADDR}"
    assert c.username == PID
    assert c.password == "s3cret"


def test_user_mode_uses_device_id_segment(monkeypatch):
    """user 模式：一连接推全部，主题第二段换成 10 位 **deviceId**（不是 devaddr）"""
    made = _capture_clients(monkeypatch)
    p = _pusher(identity_mode=MODE_USER, user_token="t" * 34, user_id="u1")
    p._conn = {"host": "127.0.0.1", "port": 1883}
    p.push_telemetry(DEVADDR, "pt1", 1.0)

    assert made[0].kwargs["client_id"] == f"{'t' * 34}edge"
    assert made[0].username == "u1"
    topic = p._topic_for(p._identity(DEVADDR), "properties", "report")
    assert topic == f"$dg/thing/{DID}/properties/report"
    assert DEVADDR not in topic


def test_user_mode_without_credentials_is_refused(monkeypatch):
    """user 模式缺凭据时建不出连接 —— 不能拿半套身份去连"""
    made = _capture_clients(monkeypatch)
    p = _pusher(identity_mode=MODE_USER, user_id="u1")   # 少 user_token
    p._conn = {"host": "127.0.0.1", "port": 1883}
    assert p.push_telemetry(DEVADDR, "pt1", 1.0) is False
    assert made == []


def test_loopback_mode_uses_dgiot_username(monkeypatch):
    """loopback 模式走 ACL 旁路：username=dgiot（源 IP 由部署保证是同机）"""
    made = _capture_clients(monkeypatch)
    p = _pusher(identity_mode=MODE_LOOPBACK)
    p._conn = {"host": "127.0.0.1", "port": 1883}
    p.push_telemetry(DEVADDR, "pt1", 1.0)
    assert made[0].username == "dgiot"


def test_unknown_mode_falls_back_to_device(monkeypatch):
    """写错的模式名不能静默变成"无身份" —— 回落到最严格的那种"""
    p = _pusher(identity_mode="carrier_pigeon")
    assert p._mode == MODE_DEVICE


# ── 拒绝路径（中枢那侧没有症状，只能在这侧拦住）──

def test_unknown_devaddr_is_rejected_not_published():
    """查不到 product 的设备**不发布** —— 拼不出身份发出去就是记到别人账上"""
    c = FakeMqtt()
    p = _pusher(c)
    assert p.push_telemetry("UNKNOWN_DEV", "pt1", 1.0) is False
    assert c.published == []
    assert p._stats["rejected"] == 1


def test_placeholder_devaddr_is_rejected():
    c = FakeMqtt()
    p = _pusher(c)
    assert p.push_telemetry("?", "pt1", 1.0) is False
    assert c.published == []


# ── 统一 push 协议 ──

def test_push_telemetry_routes_per_point():
    c = FakeMqtt()
    p = _pusher(c)
    ok = asyncio.run(p.push(_telemetry_msg()))
    assert ok is True
    assert len(c.published) == 2
    t1, p1, _ = c.published[0]
    assert t1 == f"$dg/thing/{PID}/{DEVADDR}/properties/report"
    assert p1["value"] == 1.5 and p1["unit"] == "A" and p1["quality"] == 192
    from datetime import datetime
    assert abs(p1["ts"] - datetime(2026, 9, 9, 12, 0, 0).timestamp()) < 1  # ISO → epoch
    assert c.published[1][0] == t1          # 同设备两点同一主题


def test_push_protocol_device_alarm_stats_have_no_hub_outlet():
    """device/alarm/stats 的 MQTT 出口已删 —— 两者都发不出去，且都不该发

    中枢认的上行是个闭集（properties/report、init/request、firmware/report、
    report），没有这三个后缀。**两条路都是错的**：
      - 硬塞进 `$dg/thing/...`：中枢会丢（不在闭集里），症状是"发出去了但没到"；
      - 退回 `dgiot/...` 边缘内部主题：本仓 main.py / ch_mqtt_bridge 订阅
        `dgiot/#` 再转回 EventBus，于是它绕本机一圈又回来，看着像送达。

    （这条原先断言的正是第二种做法 —— 保留 `dgiot/.../meta`、`/alarm`、
    `/stats` 三个边缘内部主题。用户已裁决删掉全部三个出口，所以断言反过来：
    三类都返回 False、一个字节都不发。要留痕就进日志。）
    """
    c = FakeMqtt()
    p = _pusher(c)
    assert asyncio.run(p.push({"type": "device", "data": {"devaddr": "d9", "name": "n"}})) is False
    assert asyncio.run(p.push({"type": "alarm", "data": {"device_id": "d9", "level": "high"}})) is False
    assert asyncio.run(p.push({"type": "stats", "data": {"n": 1}})) is False
    assert c.published == [], f"这三类不该再有任何出口，却发了: {c.published}"


def test_push_protocol_unknown_type_rejected():
    c = FakeMqtt()
    p = _pusher(c)
    assert asyncio.run(p.push({"type": "carrier_pigeon"})) is False
    assert c.published == []


def test_push_without_client_fails_gracefully():
    """无 client 且非 config 路径 → 记失败不抛异常"""
    p = EdgeHubPusher(resolver=_resolver)
    assert asyncio.run(p.push(_telemetry_msg())) is False
    assert p._stats["failed"] == 2


# ── 工厂与连接池 ──

def test_config_dict_factory_path():
    """PushEngine 插件工厂路径: config dict → 连接参数解析, 不立即连网"""
    p = EdgeHubPusher({"host": "198.51.100.9", "port": "21883",
                       "tenant": "t1", "gateway": "gw9"})
    assert p._mqtt is None
    assert p._conn == {"host": "198.51.100.9", "port": 21883}
    assert p._tenant == "t1" and p._gateway_id == "gw9"
    assert p.status()["connections"] == 0


def test_connection_pool_evicts_oldest(monkeypatch):
    """设备模式下连接数 = 设备数 —— 必须封顶，否则打爆 broker 整批掉线"""
    made = _capture_clients(monkeypatch)
    p = EdgeHubPusher({"identity_mode": MODE_DEVICE, "max_connections": 2},
                      resolver=lambda d: {"product_id": PID, "device_secret": "s"})
    p._conn = {"host": "127.0.0.1", "port": 1883}
    for dev in ("D1", "D2", "D3"):
        p.push_telemetry(dev, "pt", 1.0)
    assert len(p._clients) == 2
    assert len(made) == 3                    # 第三台触发了一次淘汰+新建
    assert made[-1].client_id == f"{PID}_D3"


def test_push_engine_compatible_probe_accepts_edge_hub():
    from src.services.push_engine import PushEngine
    assert PushEngine._compatible(_pusher(FakeMqtt())) is True


def _capture_clients(monkeypatch):
    """拦下 paho Client 的构造，只记录 clientid/username —— 不真连网"""
    made = []

    class _Stub:
        def __init__(self, client_id=None, **kw):
            self.client_id = client_id
            self.kwargs = {"client_id": client_id, **kw}
            self.username = None
            self.password = None
            made.append(self)

        def username_pw_set(self, username, password=None):
            self.username, self.password = username, password

        def connect_async(self, *a, **kw):
            pass

        def loop_start(self):
            pass

        def loop_stop(self):
            pass

        def disconnect(self):
            pass

        def publish(self, *a, **kw):
            return True

    import paho.mqtt.client as mqtt
    monkeypatch.setattr(mqtt, "Client", _Stub)
    return made
