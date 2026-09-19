# P2 ABAC — 策略决策点 (PDP) 单测: 属性/所有权/marking/热更新
import json
import os
import time

import pytest

import src.abac as abac


@pytest.fixture(autouse=True)
def _isolated(tmp_path, monkeypatch):
    monkeypatch.setenv("ABAC_POLICIES_PATH", str(tmp_path / "policies.json"))
    abac._cache.update({"mtime": None, "policies": None, "checked": 0.0})


# ── 主题文法 (教义红线) ──
def test_publish_topic_grammar_violation_denied():
    r = abac.decide(username="dev-siteA-d1", action="publish",
                    topic="dgiot/siteA/gw1/d1/pt1")          # 缺 /data 尾
    assert r["decision"] == "deny"
    r = abac.decide(username="dev-siteA-d1", action="publish",
                    topic="mytopic/whatever")                # 自造变体
    assert r["decision"] == "deny" and "grammar" in r["reason"]


def test_publish_correct_grammar():
    r = abac.decide(username="dev-siteA-d1", action="publish",
                    topic="dgiot/siteA/gw1/dev-siteA-d1/pt1/data")
    assert r["decision"] == "allow"


# ── 设备: 所有权规则 ──
def test_device_publishes_own_topic_only():
    ok = abac.decide(username="dev-siteA-d1", action="publish",
                     topic="dgiot/siteA/gw1/dev-siteA-d1/pt1/data")
    foreign_dev = abac.decide(username="dev-siteA-d1", action="publish",
                              topic="dgiot/siteA/gw1/dev-siteA-d2/pt1/data")
    foreign_site = abac.decide(username="dev-siteA-d1", action="publish",
                               topic="dgiot/siteB/gw1/dev-siteA-d1/pt1/data")
    assert ok["decision"] == "allow"
    assert foreign_dev["decision"] == "deny" and "own" in foreign_dev["reason"]
    assert foreign_site["decision"] == "deny" and "cross-site" in foreign_site["reason"]


def test_device_reads_own_scope():
    ok = abac.decide(username="dev-siteA-d1", action="subscribe",
                     topic="dgiot/siteA/+/dev-siteA-d1/#")
    foreign = abac.decide(username="dev-siteA-d1", action="subscribe",
                          topic="dgiot/siteA/+/dev-siteA-d2/#")
    assert ok["decision"] == "allow"
    assert foreign["decision"] == "deny"


def test_device_slot_wildcard_is_own_scope():
    """device 槽位写通配 = 站内读 (scope), 不是「读外设备」

    走的是 `device is None` 那一支 —— 上面那条用例只覆盖了「具名是自己的设备」那半。
    """
    for topic in ("dgiot/siteA/gw1/+/p1/data",   # "+" 已被 slot() 归一成 None
                  "dgiot/siteA/gw1/#"):          # 该槽位缺席
        r = abac.decide(username="dev-siteA-d1", action="subscribe", topic=topic)
        assert r["decision"] == "allow", (topic, r)


def test_star_is_not_an_mqtt_wildcard():
    """`*` 不是 MQTT 通配符 (规范只有 +/#) ⇒ 它是字面设备名, 走「读外设备」那一支

    旧写法 `device in (None, "+", "*")` 把它与 None 并列放行, 于是任何设备
    都能读一个名叫 * 的设备的主题。
    """
    r = abac.decide(username="dev-siteA-d1", action="subscribe",
                    topic="dgiot/siteA/gw1/*/p1/data")
    assert r["decision"] == "deny", r
    assert "foreign" in r["reason"]


# ── 网关: 站点范围 ──
def test_gateway_within_site_only():
    ok = abac.decide(username="gw-siteA-x", action="publish",
                     topic="dgiot/siteA/gw-siteA-x/dev-x/pt1/data")
    cross = abac.decide(username="gw-siteA-x", action="publish",
                        topic="dgiot/siteB/gw-siteA-x/dev-x/pt1/data")
    assert ok["decision"] == "allow"
    assert cross["decision"] == "deny" and "cross-site" in cross["reason"]


def test_edge_hub_full_plane():
    for action, topic in (("publish", "dgiot/siteA/g/ d/ p/data".replace(" ", "")),
                          ("subscribe", "dgiot/#")):
        r = abac.decide(username="edge-hub", action=action, topic=topic)
        assert r["decision"] == "allow", r


def test_operator_read_only():
    r = abac.decide(username="operator-1", action="subscribe", topic="dgiot/siteA/#")
    p = abac.decide(username="operator-1", action="publish",
                    topic="dgiot/siteA/gw1/dev1/pt1/data")
    assert r["decision"] == "allow"
    assert p["decision"] == "deny"


def test_admin_unrestricted():
    r = abac.decide(username="admin", action="publish",
                    topic="dgiot/x/g/d/p/data")
    assert r["decision"] == "allow"


# ── marking: 同主体, 两种密级, 读写结果不同 (验收 1) ──
def test_marking_same_token_two_results(tmp_path):
    pol_path = str(tmp_path / "policies.json")
    with open(pol_path, "w", encoding="utf-8") as f:
        json.dump({"markings": {"site_default": "public",
                                "sites": {"siteB": "restricted"},
                                "devices": {}}}, f)
    abac.load_policies(force=True)
    pub = abac.decide(username="operator-1", action="subscribe", topic="dgiot/siteA/#")
    res = abac.decide(username="operator-1", action="subscribe", topic="dgiot/siteB/#")
    assert pub["decision"] == "allow"
    assert res["decision"] == "deny"
    assert "internal" in res["reason"] and "restricted" in res["reason"]


def test_device_marking_override():
    with open(abac._policies_path(), "w", encoding="utf-8") as f:
        json.dump({"markings": {"site_default": "public",
                                "sites": {}, "devices": {"dev-secret-1": "secret"}}}, f)
    abac.load_policies(force=True)
    r = abac.decide(username="operator-1", action="subscribe",
                    topic="dgiot/siteA/+/dev-secret-1/#")
    assert r["decision"] == "deny" and "secret" in r["reason"]


# ── 未知主体: default=ignore (让 dgiot 自有 ACL 链接手) ──
def test_unknown_subject_ignored_by_default():
    r = abac.decide(username="stranger", action="publish",
                    topic="dgiot/siteA/gw1/dev1/pt1/data")
    assert r["decision"] == "ignore"


# ── 热更新: 策略文件 mtime 变化即生效 (验收 2 的 PDP 侧) ──
def test_policy_hot_reload():
    first = abac.decide(username="operator-1", action="subscribe",
                        topic="dgiot/siteB/#")
    assert first["decision"] == "allow"           # 种子: siteB 未标 restricted
    with open(abac._policies_path(), "w", encoding="utf-8") as f:
        json.dump({"markings": {"site_default": "public",
                                "sites": {"siteB": "restricted"}, "devices": {}}}, f)
    os.utime(abac._policies_path(), (time.time() + 2, time.time() + 2))
    second = abac.decide(username="operator-1", action="subscribe",
                         topic="dgiot/siteB/#")
    assert second["decision"] == "deny"           # 不重启任何进程, 策略即生效


def test_bad_policy_file_keeps_old():
    with open(abac._policies_path(), "w", encoding="utf-8") as f:
        json.dump({"markings": {"site_default": "public", "sites": {},
                                "devices": {}}}, f)
    abac.load_policies(force=True)
    with open(abac._policies_path(), "w", encoding="utf-8") as f:
        f.write("{broken json")                   # 坏文件
    os.utime(abac._policies_path(), (time.time() + 3, time.time() + 3))
    r = abac.decide(username="operator-1", action="subscribe",
                    topic="dgiot/siteB/#")
    assert r["decision"] == "allow"               # 沿用旧策略, 不崩


# ── 缺席的输入不得被当成满足的约束 ──
# 这里四条都对应同一个曾经存在的洞: 规则声明了某一维, 但那一维没拿到时,
# 旧代码让规则照常成立。种子里第一条恰好是低权的 dev-*, 所以从行为上看不出来;
# 换个把 admin 写在前的部署就是匿名即管理员。

def _write_policy(pol: dict):
    with open(abac._policies_path(), "w", encoding="utf-8") as f:
        json.dump(pol, f, ensure_ascii=False)
    abac.load_policies(force=True)


def test_no_username_no_subject():
    """不带用户名的连接不该拿到任何主体的属性"""
    assert abac.resolve_subject(username="", clientid="") == {}
    assert abac.resolve_subject(username="", clientid="whatever") == {}


def test_no_username_cannot_ride_the_first_rule():
    """匿名连接不能白拿种子第一条规则的 role

    旧行为下这里会 allow: role=device + site 留着未解析的占位符 "FROM_NAME",
    而主题里正好可以写 FROM_NAME, 于是 subj.site == site 那条检查放行。
    """
    sub = abac.decide(username="", action="subscribe", topic="dgiot/FROM_NAME/#")
    pub = abac.decide(username="", action="publish",
                      topic="dgiot/FROM_NAME/gw/FROM_NAME/pt1/data")
    assert sub["decision"] != "allow", sub
    assert pub["decision"] != "allow", pub
    assert sub["decision"] == "ignore"            # 无主体 → 交回 ACL 链


def test_policy_order_does_not_grant_anonymous_privilege():
    """把 admin 写在第一条, 匿名连接也不能变成 admin

    这条是那个洞的要害: 危害不取决于种子写了什么, 取决于策略文件的书写顺序。
    """
    _write_policy({"subjects": [{"match": {"username": "admin"},
                                 "attrs": {"role": "admin", "clearance": "secret"}}]})
    r = abac.decide(username="", action="publish", topic="dgiot/x/g/d/p/data")
    assert r["decision"] == "ignore", r


def test_clientid_rule_still_works_without_username():
    """只声明 clientid 的规则照常生效 —— 修的是「没给」，不是把这一维废掉"""
    _write_policy({"subjects": [
        {"match": {"clientid": "dev-*"},
         "attrs": {"role": "device", "site": "FROM_CLIENT", "device": "FROM_CLIENT"}}]})
    sub = abac.resolve_subject(username="", clientid="dev-siteA-d1")
    assert sub == {"role": "device", "site": "siteA", "device": "dev-siteA-d1"}, sub


def test_rule_whose_identity_cannot_be_resolved_does_not_apply():
    """声明了身份占位却提取不出来 → 整条规则不成立, 不留下字面量占位符

    glob 写 sensor-* 而提取约定只认 dev-/gw- 前缀。旧行为下 attrs 会留着
    字面量 "FROM_NAME" 参与决策 —— 拿占位符当站点名用。
    """
    _write_policy({"subjects": [
        {"match": {"username": "sensor-*"},
         "attrs": {"role": "device", "site": "FROM_NAME", "device": "FROM_NAME"}}]})
    assert abac.resolve_subject(username="sensor-1") == {}
    assert abac.decide(username="sensor-1", action="publish",
                       topic="dgiot/FROM_NAME/gw/FROM_NAME/pt1/data")["decision"] \
        != "allow"
