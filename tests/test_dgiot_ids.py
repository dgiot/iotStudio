# -*- coding: utf-8 -*-
"""中枢 ID 派生契约锁 — 对齐 dgiot_parse_id.erl

这些断言不是在测"我们的实现算得对"，是在钉住**与中枢的约定**。
中枢那边是纯函数、无 DB 校验：id 算错不报错，只是消息落到别的设备账上。
所以每一条都要能独立地回答"凭什么"。
"""
import hashlib

from src.models.dgiot_ids import (
    ID_LEN, device_id, dlink_client_id, dlink_topic, dlink_username,
    is_object_id, product_id,
)


def test_device_id_matches_hub_formula():
    """deviceId = md5("Device" + productId + devaddr)[:10] —— 照抄 Erlang"""
    pid, devaddr = "152224c5ee", "DTU001"
    expect = hashlib.md5(f"Device{pid}{devaddr}".encode("utf-8")).hexdigest()[:ID_LEN]
    assert device_id(pid, devaddr) == expect


def test_product_id_matches_hub_formula():
    """productId = md5("Product" + categoryId + devType + name)[:10]"""
    expect = hashlib.md5("Productcat1pump抽油机".encode("utf-8")).hexdigest()[:ID_LEN]
    assert product_id("cat1", "pump", "抽油机") == expect


def test_ids_are_lowercase_hex_of_fixed_length():
    """小写 + 定长 10 —— 中枢 to_md5 用 ~2.16.0b（小写），ACL 按 10 位定长匹配

    大写会让 ACL 的 <<ProductID:10/binary>> 匹配不上（长度对但内容不等），
    属于"看着对、实际被拒"的一类。
    """
    for v in (product_id("c", "t", "n"), device_id("p", "d")):
        assert len(v) == ID_LEN
        assert v == v.lower()
        assert all(c in "0123456789abcdef" for c in v)


def test_empty_parts_still_concatenate():
    """分类为空的 product 也要算得出 —— Erlang 那边取不到就是 <<"">>，照样参与拼接"""
    assert product_id("", "pump", "泵") == hashlib.md5("Productpump泵".encode()).hexdigest()[:ID_LEN]


def test_dlink_topic_second_segment_is_bare_devaddr():
    """⚠️ 回归锁：主题第二段必须是**裸 devaddr**，不是 `{productId}_{devaddr}`

    `{pid}_{devaddr}` 那种写法在中枢 ACL 里确实被放行（legacy 规则），
    但中枢分发器把第二段直接喂给 get_deviceid(ProductId, DevAddr)，
    带前缀就会算出**另一台设备**的 id。ACL 只比对字符串，
    不验证这段能否查到设备 —— 放行 ≠ 路由正确。这条断言就是拦这个的。
    """
    t = dlink_topic("152224c5ee", "DTU001", "properties", "report")
    assert t == "$dg/thing/152224c5ee/DTU001/properties/report"
    assert t.split("/")[3] == "DTU001"
    assert "152224c5ee_DTU001" not in t


def test_dlink_topic_accepts_multiple_suffix_segments():
    assert dlink_topic("p", "d") == "$dg/thing/p/d"
    assert dlink_topic("p", "d", "init", "request") == "$dg/thing/p/d/init/request"


def test_client_id_joins_but_topic_does_not():
    """clientid 里**要**拼起来，主题里**不能** —— 两者容易串味，分开钉"""
    assert dlink_client_id("152224c5ee", "DTU001") == "152224c5ee_DTU001"
    assert dlink_username("152224c5ee") == "152224c5ee"


def test_is_object_id_rejects_readable_seed_ids():
    """种子数据用的是 "inverter"/"pcs" 这类可读串，中枢不认 —— 判据要能识别"""
    assert is_object_id("152224c5ee")
    assert not is_object_id("inverter")      # 可读串
    assert not is_object_id("152224C5EE")    # 大写
    assert not is_object_id("152224c5e")     # 少一位
    assert not is_object_id("")
    assert not is_object_id(None)


def test_ontology_dlink_topic_requires_platform_fields():
    """本体拼中枢主题时缺 devaddr/product 必须抛，不能拼个发得出去但被丢的串"""
    import pytest
    from src.ontology import Device, OntologyEngine, Point, Site, Gateway, Channel

    eng = OntologyEngine()
    eng.register(Site(id="s1", name="站"))
    eng.register(Gateway(id="g1", ip="198.51.100.1", site="s1"))
    eng.register(Channel(id="c1", gateway="g1", name="通道", protocol="modbus_tcp"))
    # 显式不给 devaddr/product —— 正是"本体只有内部 id"的那种设备
    eng.register(Device(id="dev1", channel="c1", name="设备"))
    eng.register(Point(id="pt1", device="dev1", name="测点"))

    with pytest.raises(KeyError):
        eng.dlink_topic("pt1")

    # 补齐平台侧字段后可拼
    eng.devices["dev1"].devaddr = "DTU001"
    eng.devices["dev1"].product = "152224c5ee"
    assert eng.dlink_topic("pt1") == "$dg/thing/152224c5ee/DTU001/properties/report"


def test_ontology_get_path_is_not_a_topic():
    """get_path 归位后不再带 `dgiot/` 前缀 —— 防止有人又把它当主题用"""
    from src.ontology import Device, OntologyEngine, Point, Site, Gateway, Channel

    eng = OntologyEngine()
    eng.register(Site(id="s1", name="站"))
    eng.register(Gateway(id="g1", ip="198.51.100.1", site="s1"))
    eng.register(Channel(id="c1", gateway="g1", name="通道", protocol="modbus_tcp"))
    eng.register(Device(id="dev1", channel="c1", name="设备"))
    eng.register(Point(id="pt1", device="dev1", name="测点"))

    p = eng.get_path("pt1")
    assert p == "s1/g1/c1/dev1/pt1"
    assert not p.startswith("dgiot/")
    assert "$dg" not in p
