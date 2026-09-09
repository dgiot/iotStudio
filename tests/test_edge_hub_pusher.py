# ============================================================
# EdgeHubPusher 统一 push(message) 协议适配层测试
# (最后一个收编推送器: config-dict 工厂路径 + 消息路由)
# ============================================================
import asyncio
import json

from src.push.edge_hub_push import EdgeHubPusher


class FakeMqtt:
    def __init__(self):
        self.published = []

    def publish(self, topic, msg, qos=1):
        self.published.append((topic, json.loads(msg), qos))
        return True


def _telemetry_msg():
    from datetime import datetime
    return {
        "type": "telemetry",
        "device_id": "dev1",
        "timestamp": datetime(2026, 9, 9, 12, 0, 0).isoformat(),
        "data": [
            {"point_id": "p1", "point_name": "P1", "value": 1.5, "unit": "A", "quality": 192},
            {"point_id": "p2", "point_name": "P2", "value": 2.5, "unit": "V", "quality": 192},
        ],
    }


def test_config_dict_factory_path():
    """PushEngine 插件工厂路径: config dict → 连接参数解析, 不立即连网"""
    p = EdgeHubPusher({"host": "10.0.0.9", "port": "21883", "tenant": "t1",
                       "gateway": "gw9", "username": "u", "password": "p"})
    assert p._mqtt is None
    assert p._conn == {"host": "10.0.0.9", "port": 21883,
                       "username": "u", "password": "p"}
    assert p._tenant == "t1" and p._gateway_id == "gw9"


def test_direct_mqtt_client_path_unchanged():
    """直连注入路径向后兼容"""
    c = FakeMqtt()
    p = EdgeHubPusher(mqtt_client=c, tenant="default")
    assert p._mqtt is c and p._conn is None
    assert p.push_telemetry("dev1", "pt1", 3.14, "A")
    topic, payload, qos = c.published[0]
    assert topic == "dgiot/default/gw_131/ch_oracle_pipe/dev1/pt1"
    assert payload["value"] == 3.14 and qos == 1


def test_push_protocol_telemetry_routes_per_point():
    c = FakeMqtt()
    p = EdgeHubPusher(mqtt_client=c)
    ok = asyncio.run(p.push(_telemetry_msg()))
    assert ok is True
    assert len(c.published) == 2
    t1, p1, _ = c.published[0]
    assert t1 == "dgiot/default/gw_131/ch_oracle_pipe/dev1/p1"
    assert p1["value"] == 1.5 and p1["unit"] == "A" and p1["quality"] == 192
    from datetime import datetime
    assert abs(p1["ts"] - datetime(2026, 9, 9, 12, 0, 0).timestamp()) < 1  # ISO → epoch
    assert c.published[1][0].endswith("/dev1/p2")


def test_push_protocol_device_alarm_stats():
    c = FakeMqtt()
    p = EdgeHubPusher(mqtt_client=c)
    assert asyncio.run(p.push({"type": "device", "data": {"devaddr": "d9", "name": "n"}}))
    assert asyncio.run(p.push({"type": "alarm", "data": {"device_id": "d9", "level": "high"}}))
    assert asyncio.run(p.push({"type": "stats", "data": {"n": 1}}))
    topics = [t for t, _, _ in c.published]
    assert topics[0].endswith("/d9/meta")
    assert topics[1].endswith("/d9/alarm")
    assert topics[2] == "dgiot/default/gw_131/stats"


def test_push_protocol_unknown_type_rejected():
    c = FakeMqtt()
    p = EdgeHubPusher(mqtt_client=c)
    assert asyncio.run(p.push({"type": "carrier_pigeon"})) is False
    assert c.published == []


def test_push_protocol_without_client_fails_gracefully():
    """无 mqtt 且非 config 路径 → 记失败不抛异常"""
    p = EdgeHubPusher()
    assert asyncio.run(p.push(_telemetry_msg())) is False
    assert p._stats["failed"] == 2


def test_push_engine_compatible_probe_accepts_edge_hub():
    from src.services.push_engine import PushEngine
    assert PushEngine._compatible(EdgeHubPusher(mqtt_client=FakeMqtt())) is True
