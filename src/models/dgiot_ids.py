"""
DG-IoT 平台侧 ID 派生 — 与中枢 dgiot_parse_id.erl 逐字对齐
=============================================================
中枢（Erlang）认设备只认两个 ID：productId 与 deviceId。两者都不是
"人取的名字"，而是 Parse 的 objectId —— 由类名 + 业务字段 md5 取前 10 位
hex 得来。边缘侧要拼出中枢认的 MQTT 主题，就必须自己算出同样的值。

**权威源**（改这里之前先把两处 Erlang 读一遍）:
  apps/dgiot_parse/src/utils/dgiot_parse_id.erl
    get_objectid(<<"Device">>, _) ->
        <<Did:10/binary, _/binary>> = dgiot_utils:to_md5(<<"Device", Product/binary, DevAddr/binary>>),
    get_objectid(<<"Product">>, _) ->
        <<Pid:10/binary, _/binary>> = dgiot_utils:to_md5(<<"Product", Categoryid/binary, DevType/binary, Name/binary>>),

为什么必须逐字复刻而不是"大致对上"：deviceId 是中枢侧查设备的键。
差一个字节就落到另一台设备（或落空），而且**不会报错** —— 消息照发，
中枢照收，只是收进了别人的账上。这类错最难查，所以宁可在这里把
公式连同出处一起钉死，也不要在调用点各算各的。

**为什么是 10 位**：中枢 ACL 里全是定长匹配
（`<<ProductID:10/binary, "_", DeviceAddr/binary>>`、`<<DeviceId:10/binary>>`），
md5 的 32 位 hex 被截断到 10 位。截断长度是协议的一部分，不是实现细节。

**编码也已核对**（大小写不一致会静默产出错 id，值得单独记一笔）:
  apps/dgiot/src/utils/dgiot_utils.erl
    to_md5(V) -> list_to_binary(lists:flatten(
        [io_lib:format("~2.16.0b", [D]) || D <- binary_to_list(erlang:md5(V))]));
  `~2.16.0b` 的 `b` 是**小写** hex（`B` 才是大写），按字节补零到两位，
  md5 直接算在 binary 上。等价于 Python 的
  `hashlib.md5(raw.encode("utf-8")).hexdigest()`（lowercase、UTF-8）。
"""
from __future__ import annotations

import hashlib

#: objectId 的截断长度 —— 中枢 ACL 按定长 10 匹配，不可随意调整
ID_LEN = 10


def _object_id(class_name: str, *parts: str) -> str:
    """md5(类名 + 各业务字段)[:10] —— 复刻 dgiot_parse_id:get_objectid

    拼接顺序即签名顺序，无分隔符（Erlang 那边也是直接 binary 相加）。
    """
    raw = class_name + "".join(p or "" for p in parts)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()[:ID_LEN]


def device_id(product_id: str, devaddr: str) -> str:
    """deviceId = md5("Device" + productId + devaddr)[:10]

    注意 **productId 必须已是 objectId**（10 位），不是产品名 ——
    中枢 get_deviceid 传进来的是 product Pointer 的 objectId。
    """
    return _object_id("Device", product_id, devaddr)


def product_id(category_id: str, dev_type: str, name: str) -> str:
    """productId = md5("Product" + categoryId + devType + name)[:10]

    categoryId —— 产品分类的 objectId；分类为空时传空串（Erlang 那边
    取不到就是 <<"">>，同样参与拼接）。
    """
    return _object_id("Product", category_id, dev_type, name)


def is_object_id(value: str) -> bool:
    """长得像不像**中枢认的** objectId（10 位小写 hex）

    用途是**校验而不是转换** —— 拿到一个 id 先问"中枢会不会认它"，
    而不是自己重算（重算只在边缘自建产品时才用得上，见 product_id）。

    ⚠️ 本仓现有数据的实测结果（2026-09-12，data/parse.db）:
      Product 7 条  —— objectId 全是 **20 位** hex。本仓 parse_lite 的
                       `_oid()` 是 `secrets.token_hex(10)`，而中枢是
                       `to_md5(...)[:10]`：**两套 id 体系不同源**。
                       同一个产品，这边 `b509fbe508995774fa60`，
                       按中枢公式算是 `6bafdf1516`，毫无关系。
      Device 14 条  —— objectId 是 `pv_001`/`ess_001` 这类可读串，6~12 位。
      两者的 `product` / `deviceSecret` 字段：**0 条有值**。

    所以现有数据一条都推不到中枢 —— 这个判据会把它们全拦下。拦是对的：
    20 位 productId 拼出的 clientid `b509fbe508995774fa60_pv_001`
    过不了 ACL 的 `<<ProductID:10/binary, "_", DeviceAddr/binary>>`
    （第 11 字节是 `9` 不是 `_`），broker 直接 deny，而 deny 在我们这侧
    是**静默**的。本地拦下至少 stats 里看得见。
    """
    if not isinstance(value, str) or len(value) != ID_LEN:
        return False
    return all(c in "0123456789abcdef" for c in value)


def dlink_topic(product_id_: str, devaddr: str, *suffix: str) -> str:
    """中枢上行主题 —— `$dg/thing/{productId}/{devaddr}/{suffix...}`

    **第二段是纯 devaddr，不是 `{productId}_{devaddr}`。**

    这一条踩过坑，写清楚免得后人再改回去：`{productId}_{devaddr}` 那种形态
    在中枢 ACL 里确实存在（dgiot_mqtt_acl.erl:55 那条 legacy 规则放行它），
    看着像"规范"，但它过不了中枢自己的分发器 ——
    dgiot_mqtt_message.erl:65 把第二段当 DevAddr 直接喂给
    `dgiot_parse_id:get_deviceid(ProductId, DevAddr)`，
    带上前缀就等于把 `{pid}_{devaddr}` 当成 devaddr 去算 md5，
    结果指向另一台设备。ACL 只判"这段字符串等不等于 clientid 里的 devaddr"
    （check_device_addr/2：第二段按 "/" 切开后首个元素必须逐字相等），
    它**不验证这段是否真能查到设备** —— 放行和路由正确是两回事。
    """
    tail = "/".join(suffix)
    return f"$dg/thing/{product_id_}/{devaddr}" + (f"/{tail}" if tail else "")


def dlink_down_topic(product_id_: str, devaddr: str, *suffix: str) -> str:
    """中枢下行主题 —— `$dg/device/{productId}/{devaddr}/{suffix...}`

    与上行是**两个词**：上行 `thing`（物上报），下行 `device`（平台下发给设备）。
    别把 `properties/report` 当成万能后缀：上行是 `.../properties/report`，
    下行属性设置是 `.../properties`（**没有 report**）——
    见 dgiot_mqtt_message.erl:90 与 dgiot_task_dao.erl:100，两处逐字相同。

    第二段同样是**裸 devaddr**，理由与上行一致：ACL 的 check_device_addr/2
    只判"这段等不等于 clientid 里的 devaddr"，不验证它能否查到设备。

    为什么需要这个函数：本仓原先有三套自造的 `dgiot/.../cmd` 下行变体
    （graphrag_api 六种拼法 + action 插件的 `dgiot/cmd/{id}`）。它们**中枢
    一个都不认**，发布出去是静默丢弃，调用方却拿到"已送达"的主题串。
    收口到中枢真有的那一个形态。
    """
    tail = "/".join(suffix)
    return f"$dg/device/{product_id_}/{devaddr}" + (f"/{tail}" if tail else "")


def dlink_client_id(product_id_: str, devaddr: str) -> str:
    """中枢 ACL 认的 clientid —— `{productId}_{devaddr}`（注意这里**有**下划线）

    与主题第二段不同：主题里要裸 devaddr，clientid 里要拼起来。
    dgiot_mqtt_acl.erl 两条主力规则都按 `<<ProductID:10/binary, "_", DeviceAddr/binary>>`
    匹配 clientid，再从里面把 DeviceAddr 拆出来去比对主题第二段。
    """
    return f"{product_id_}_{devaddr}"


def dlink_username(product_id_: str) -> str:
    """中枢 ACL 要求的 username —— 就是 productId

    ACL 里每条设备规则都带 `username := ProductID`。用别的方式认证
    （例如 username="dgiot"）走的是另一条 loopback 旁路，不是设备身份。
    """
    return product_id_
