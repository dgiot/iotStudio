# ============================================================
# 部署租户表 (多租户) — 命名空间归属的**唯一**来源
# ============================================================
"""
框架③「一公司一部署，料不互见」的落点。

**为什么归属由部署声明，不由包声明。** 一个包卖给第二家公司时，包内写死的归属
当场就是错的 —— 而且错得很安静：包照样装载、页面照样打开，只是甲公司的人看得见
乙公司的本体。谁知道这台机器上装了哪些插件，谁才知道它们是谁的。

  IOTSTUDIO_NS_TENANT="<插件名>=<租户ID>,<插件名>=<租户ID>"

取值形制照抄 plugin_runtime._env_plugin_roots（空项跳过、去重、不抛）。

**「无主」是两句话，不是一句。** 装载层与查询层各管一句，两层不产生第二套语义：

  · 装载层（本模块 tenant_of）—— **≥2 个租户的部署不允许无主**，未映射即抛错，
    由既有的插件失败隔离机制接住。于是双租户部署里根本出现不了无主命名空间。
  · 查询层（graph_store 的 only=）—— **无主 = 共享**。单租户部署（演示、POC）
    一件插件都不必登记归属，行为与今天逐字相同。

两条合起来才是「按部署规模判定」：规模小的时候不添麻烦，规模大的时候不给漏洞。
**只有查询层那一句是不够的** —— 双租户部署里一个漏登记的插件就是全租户可见，
而「漏登记」在下一次装载之前不会有任何东西报出来。

归属的形状照 dgiot：dgiot 收口 View 查询时算的是 `$relatedTo _Role.views`
（apps/dgiot_parse/src/dgiot_parse_rest.erl:132-171）—— 「先算出这个调用者被允许的
id 集合，再拿它约束查询」。图库这边的 `only: Set[str]` 是同一个骨架，不是另起一套。

⚠️ **本模块刻意不做缓存。** 环境变量进程内不变，缓存本来划算；但本仓刚吃过一次
模块级缓存的亏 —— 夹具换了库没换缓存，头一个用例过、其余全红，根因在夹具不在
被测代码（tests/test_tenant_scope.py 的 tmp_parse_db 记着这件事）。这里一次读
环境 + 解一个小串，省不下什么，却会给每个测试夹具埋一个必须先清掉的全局态。
"""
from __future__ import annotations

import logging
import os
from typing import Dict, List, Optional, Set

log = logging.getLogger("tenant.scope")

# 命名空间归属表 —— 形制与 IOTSTUDIO_PLUGIN_PATH 并列，运维一眼认得出
_NS_TENANT_ENV = "IOTSTUDIO_NS_TENANT"


def _parse_map(raw: str) -> Dict[str, str]:
    """`ns=租户,ns=租户` → dict。

    两个「跳过」不是一回事，别混：
      · 空项（`a,,b` 或尾逗号造成的空串）—— 静默跳过，这是分隔符的产物
      · 缺 `=`（写了 ns 没写租户）—— **出声跳过**。这是打错了，不是没写；
        静默丢掉它，运维会以为登记成功了。而它是否真的被兜住，取决于那个 ns
        在这台机器上到底有没有被装载 —— 不能指望。
    """
    out: Dict[str, str] = {}
    for part in (raw or "").split(","):
        part = part.strip()
        if not part:
            continue
        if "=" not in part:
            log.warning(f"[tenant] {_NS_TENANT_ENV} 里 {part!r} 缺 '=租户'，已跳过"
                        f"（写成 {part}=<租户> 才生效）")
            continue
        ns, _, tenant = part.partition("=")
        ns, tenant = ns.strip(), tenant.strip()
        if not ns or not tenant:
            log.warning(f"[tenant] {_NS_TENANT_ENV} 里 {part!r} 有一侧是空的，已跳过")
            continue
        if ns in out and out[ns] != tenant:
            log.warning(f"[tenant] {_NS_TENANT_ENV} 里 {ns!r} 声明了两次"
                        f"（{out[ns]!r} → {tenant!r}），以最后一次为准")
        out[ns] = tenant
    return out


def deployment_tenants() -> Set[str]:
    """本部署声明出来的全部租户（去重后的值集合）。

    注意这是**声明出来的**租户，不是库里的用户实际拥有的租户 —— 后者是
    parse_lite 的 `_Role`。两者不必相等：一台只服务甲公司的机器上，
    库里躺着乙公司的角色行也不影响它是一台单租户部署。
    """
    return set(_parse_map(os.environ.get(_NS_TENANT_ENV, "")).values())


def tenant_of(ns: str) -> Optional[str]:
    """命名空间 → 归属租户；无主时按**部署规模**判定。

      · 部署里 0/1 个租户 → 返回 None（无主 = 共享，行为与今天一字不变）
      · 部署里 ≥2 个租户   → raise，由装载层的失败隔离接住

    抛错而不是返回一个「默认租户」，是因为后者会把「漏登记」变成「登记给了
    某个具体租户」—— 那不但多租户之间仍然串，连错在哪都看不出来了。
    """
    m = _parse_map(os.environ.get(_NS_TENANT_ENV, ""))
    if ns in m:
        return m[ns]
    tenants = sorted(set(m.values()))
    if len(tenants) >= 2:
        raise ValueError(
            f"多租户部署（{len(tenants)} 个租户: {tenants}）里命名空间 {ns!r} 没有声明归属。"
            f"请在 {_NS_TENANT_ENV} 里补上，如 {ns}={tenants[0]}。"
            f" —— 无主命名空间在多租户部署里会是**全部租户可见**，所以宁可不装载。"
        )
    return None


def describe() -> dict:
    """自述 —— 供 /api/graph/providers 与启动日志用。

    `unowned_policy` 把「按部署规模判定」这条裁决**变成一个值**。
    写成注释的话，读的人得先找到这段注释才知道今天的策略是什么；
    写成值，它是查出来的。
    """
    m = _parse_map(os.environ.get(_NS_TENANT_ENV, ""))
    tenants = sorted(set(m.values()))
    return {
        "env": _NS_TENANT_ENV,
        "declared": dict(sorted(m.items())),
        "tenants": tenants,
        "multi_tenant": len(tenants) >= 2,
        "unowned_policy": "raise" if len(tenants) >= 2 else "shared",
    }
