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
