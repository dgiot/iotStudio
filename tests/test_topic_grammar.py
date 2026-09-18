# -*- coding: utf-8 -*-
"""MQTT 主题登记表 — 每个出口都得表态

起因：`ch_edge_hub` 通道在通道列表里显示 running、MQTT 也连上了，发的却是
`dgiot/{site}/{gateway}/ch_edge_hub/{device}/{point}` 形状的主题（**站名与
网关名当时是写死的字面量**，不是插值）—— 这个命名空间中枢
（github 的 dgiot-github、gitee 的 tools/dgiot 两条线）的 Erlang 源码里
零命中。它不是"发进空气"：本仓 `main.py` 和 `ch_mqtt_bridge` 都订阅
`dgiot/#` 再转 EventBus，所以消息**真的回来了**，只是从没出过本机。

这就是最难发现的一类：链路上每一段都有日志、都成功，唯独"到没到中枢"
没人验证。同时本仓还有 `$dg/thing/...` 这一套**真的**对齐 dlink 的主题，
两套并存 —— 于是"某些数据能到、某些到不了"，取决于写那一行的人当时参考了谁。

所以这里不判对错，只要求**表态**：src/ 与 plugins/ 下每一个 MQTT 主题
字面量都必须在 REGISTRY 里，并写明它属于哪一类。新加一个主题就得多写一行，
写的时候自然会问"中枢认不认"。
"""
import pathlib
import re

import pytest

# 分类
HUB_UP     = "HUB_UP"       # 中枢认的上行语法（dgiot_mqtt_acl/message 里能找到）
HUB_DOWN   = "HUB_DOWN"     # 中枢下行语法（$dg/device/...）
EDGE_LOCAL = "EDGE_LOCAL"   # 中枢不认，只在边缘侧环回（本地 broker → EventBus）
ACL_PREFIX = "ACL_PREFIX"   # 不是主题，是内置 broker 的 ACL 前缀匹配

#: 主题字面量 → (分类, 说明)
REGISTRY = {
    # ── 对齐 dlink 的：中枢主题的唯一语法 ──
    "$dg/thing/{product_id_}/{devaddr}":
        (HUB_UP, "dgiot_ids.dlink_topic — 上行主题的唯一构造口"),
    "$dg/thing/{head}":
        (HUB_UP, "edge_hub_push user 模式：第二段是 deviceId(10位md5)，不是 devaddr"),
    "$dg/thing/{client.product_id}/":
        (HUB_UP, "modbus_rtu_server → EventBus task.channel_report"),
    "$dg/device/{product_id_}/{devaddr}":
        (HUB_DOWN, "dgiot_ids.dlink_down_topic — 下行主题的唯一构造口"),
    # 下行主题在 action 定义/文档串里也要出现（操作员得看见到底发去哪儿）。
    # 它们不是发射点，但同样得表态 —— 上面那条是构造口，这条是引用口径。
    "$dg/device/{productId}/{devaddr}/properties":
        (HUB_DOWN, "action_defs/actions_core/actions_pipeline 的 description，"
                   "以及 ontology.health 的 dlink_topic_down（均非发射点）"),
    "$dg/thing/{productId}/{devaddr}/properties/report":
        (HUB_UP, "ontology.health 的 dlink_topic_up（自述串，非发射点）"),

    # ── 中枢不认的：本机 MQTT 当进程间总线在用 ──
    "dgiot/{site}/{gateway}/{device}/{point}/data":
        (EDGE_LOCAL, "ontology.health 的自述串。与 CLAUDE.md 的『规范』"
                     "和 abac.TOPIC_RE 三方一致（都是 5 段、无 channel）。"
                     "这里原先多写一个 {channel} 段，是本仓唯一那么写的地方，已订正"),
    "dgiot/{self._site}/{self._gateway}/{device_id}/reg_{i}/data":
        (EDGE_LOCAL, "modbus_collector 逐寄存器直发。原先是硬编码 —— 站点名与"
                     "网关名写死进主题，且字段整体错位一格（多出的 `ch_*` 段"
                     "占了 device 段、设备 id 占了 point 段）。注：_mqtt/"
                     "_tdengine 从未被赋值，该分支实为死代码，本模块全仓也无"
                     "实例化点。"
                     "⚠️ 本条原先**逐字复述了改之前那串主题**：修一处现场料、"
                     "却在说明里把那串值再抄一遍，等于从后门放回来 —— 说明也"
                     "是公开仓的正文。故此处只描述形状，不复述值"),

    # ── ACL 前缀（不是主题） ──
    "dgiot/stat":
        (ACL_PREFIX, "内置 broker 角色 ACL 的子串匹配"),
    "dgiot/":
        (ACL_PREFIX, "内置 broker 默认角色的前缀匹配"),
}

#: 扫描范围
SCAN_DIRS = ("src", "plugins")

# 双引号优先（字面量内部可能含单引号，如 f"...{d.get('k','?')}..."）
_PATTERNS = [
    re.compile(r'(?<![A-Za-z0-9_])f?"((?:\$dg|dgiot)/[^"]*)"'),
    re.compile(r"(?<![A-Za-z0-9_])f?'((?:\$dg|dgiot)/[^']*)'"),
]


def _scan() -> dict:
    """扫出 src/ 与 plugins/ 下的主题字面量 → [文件:行]"""
    root = pathlib.Path(__file__).resolve().parents[1]
    found: dict = {}
    for base in SCAN_DIRS:
        for p in (root / base).rglob("*.py"):
            for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
                for pat in _PATTERNS:
                    for m in pat.finditer(line):
                        lit = m.group(1)
                        if lit.endswith("/#"):     # 订阅通配，不是发布主题
                            continue
                        found.setdefault(lit, []).append(
                            f"{p.relative_to(root).as_posix()}:{i}")
                    else:
                        continue
                    break
    return found


def test_every_topic_literal_is_registered():
    """新增主题必须表态 —— 报告两个方向的漂移

    多出来的（代码里发了但没登记）和少掉的（登记了但没人发了）都要修，
    否则这张表很快就跟代码对不上，变成一份没人信的历史文档。
    """
    found = _scan()
    unregistered = sorted(set(found) - set(REGISTRY))
    stale = sorted(set(REGISTRY) - set(found))
    msg = []
    if unregistered:
        msg.append("未登记的主题（请判断中枢认不认，再补进 REGISTRY）:\n" +
                   "\n".join(f"  {lit!r}\n      {', '.join(found[lit])}"
                             for lit in unregistered))
    if stale:
        msg.append("REGISTRY 里已无人使用的条目（请删掉）:\n" +
                   "\n".join(f"  {lit!r}" for lit in stale))
    assert not msg, "\n\n".join(msg)


def test_hub_classified_topics_actually_use_the_hub_namespace():
    """标成 HUB_* 的必须真的长成中枢的形状 —— 别标错分类骗过上面那条"""
    for lit, (kind, _) in REGISTRY.items():
        if kind == HUB_UP:
            assert lit.startswith("$dg/thing/"), f"{lit!r} 标了 HUB_UP 但不是 $dg/thing/ 形状"
        elif kind == HUB_DOWN:
            assert lit.startswith("$dg/device/"), f"{lit!r} 标了 HUB_DOWN 但不是 $dg/device/ 形状"
        else:
            assert not lit.startswith("$dg/"), f"{lit!r} 用了 $dg/ 命名空间却不是 HUB_*"


def test_edge_local_topics_dont_leak_into_the_dlink_path():
    """标成 EDGE_LOCAL 的不能出现在 dlink 主题构造器里

    `dgiot_ids.dlink_topic()` 是上行主题的唯一出口，它必须只产出 $dg/thing/。
    这条防的是"顺手把某个边缘内部主题塞进 id 模块"—— 那样两套语法就合流了，
    以后再想分开就得连带改调用方。
    """
    from src.models.dgiot_ids import dlink_topic
    t = dlink_topic("152224c5ee", "DTU001", "properties", "report")
    assert t == "$dg/thing/152224c5ee/DTU001/properties/report"
    assert "dgiot/" not in t.replace("$dg/thing/", "")


def test_registry_classifications_are_known_values():
    kinds = {k for k, _ in REGISTRY.values()}
    assert kinds <= {HUB_UP, HUB_DOWN, EDGE_LOCAL, ACL_PREFIX}, f"冒出了新分类: {kinds}"
    for lit, (_kind, why) in REGISTRY.items():
        assert why.strip(), f"{lit!r} 没写说明 —— 分类要能被人复核"


# ── 与中枢源码对表（有中枢检出时才跑） ──

HUB_CANDIDATES = (
    pathlib.Path("D:/ai/github/dgiot-github/apps"),
    pathlib.Path("D:/ai/gitee/tools/dgiot/apps"),
)


@pytest.mark.parametrize("hub_apps", HUB_CANDIDATES, ids=lambda p: p.parts[-3])
def test_hub_source_recognises_the_hub_topics(hub_apps):
    """拿中枢 Erlang 源码复核 HUB_UP 的分类，而不是拿我的记忆复核

    只在有中枢检出时跑 —— 这个仓库不该依赖一个不在仓库里的路径。
    """
    if not hub_apps.is_dir():
        pytest.skip(f"无中枢检出: {hub_apps}")
    src = "\n".join(p.read_text(encoding="utf-8", errors="replace")
                    for p in hub_apps.rglob("*.erl"))
    assert '"$dg/thing/' in src, "中枢源码里找不到 $dg/thing/ —— 路径选错了？"
    for lit, (kind, _) in REGISTRY.items():
        if kind != HUB_UP:
            continue
        # 字面量里的插值段在中枢源码里都是变量，比对固定前缀即可
        head = lit.split("{", 1)[0]
        assert head in src, f"{lit!r} 的前缀 {head!r} 在中枢源码里找不到"


@pytest.mark.parametrize("hub_apps", HUB_CANDIDATES, ids=lambda p: p.parts[-3])
def test_hub_acl_grants_no_dgiot_namespace_topics(hub_apps):
    """ACL 是硬证据：中枢放行的主题里一个 `dgiot/...` 都没有

    比"前缀在中枢源码里出现过吗"有根据 —— `dgiot/` 这个串在中枢里确实存在
    （`global/dgiot`、`dgiot/ping/logs` 这类内部主题），拿它做前缀匹配会两头
    失真。这里改成直接读 ACL 模块里的主题字面量：中枢给设备放的权限**全部**
    在 `$dg/` 命名空间下。

    这条失败就意味着"中枢其实支持某个 dgiot/ 主题、我们误判成边缘内部了"——
    是整套 EDGE_LOCAL 分类里唯一能证伪的地方。
    """
    if not hub_apps.is_dir():
        pytest.skip(f"无中枢检出: {hub_apps}")
    acl = list(hub_apps.rglob("dgiot_mqtt_acl.erl"))
    if not acl:
        pytest.skip(f"中枢检出里没有 dgiot_mqtt_acl.erl: {hub_apps}")
    txt = acl[0].read_text(encoding="utf-8", errors="replace")

    # 取 ACL 里所有 Erlang 二进制字面量，挑出"像主题的"：
    # 含 `/` 且不是裸的 "/"（分隔符）。username/role 那种单词自然被排除。
    literals = set(re.findall(r'<<"([^"]*)"', txt))
    topicish = {s for s in literals if "/" in s and s != "/"}
    assert topicish, "没扫到任何主题字面量 —— ACL 的写法变了？"
    assert "$dg/thing/" in topicish, "没扫到 $dg/thing/ —— ACL 模块选错了？"

    offenders = sorted(s for s in topicish if not s.startswith("$dg/"))
    assert not offenders, (
        f"中枢 ACL 里出现了非 $dg/ 命名空间的主题: {offenders}\n"
        f"—— 若有设备主题落在 dgiot/ 下，REGISTRY 里的 EDGE_LOCAL 分类要重判")
