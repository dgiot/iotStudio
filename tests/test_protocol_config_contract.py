"""REQ-DEV-002 回归用例 —— 协议适配器与 ProtocolConfig 的字段契约。

背景（2026-10-05 实测）：`collector._add_device()` 递进来的是**通用** `ProtocolConfig`
（`src/protocols/base.py`，协议私有字段落在 `extra=dev.comm_params` 里），而
`opcua.py` / `iec104.py` 直接读 `self.config.endpoint_url` / `.host` / `.port`——
**连异常处理块自己也读这些字段** ⇒ 处理异常时再抛 `AttributeError` ⇒
创建这两种设备的 HTTP 请求被升级成 **500**（`REQ-OPS-004` 定性报告 §3）。

本用例固化两条契约：
1. 适配器必须能从 `extra` 解析出协议私有字段；
2. `connect()` / `disconnect()` 在任何失败情形下**只返回 False，绝不抛异常**。

两个用例都不需要真实设备（端口 1 必然拒绝连接），因此可离线、可重复运行。
"""
import asyncio

from src.protocols.base import ProtocolConfig


def _generic_config(protocol: str, extra: dict) -> ProtocolConfig:
    return ProtocolConfig(
        protocol_type=protocol,
        device_id="req_dev_002_probe",
        device_name="REQ-DEV-002 probe",
        collect_interval=5,
        points=[],
        extra=extra,
    )


def test_opcua_adapter_accepts_generic_config_and_never_raises():
    from src.protocols.opcua import OpcUaAdapter

    cfg = _generic_config("opcua", {"endpoint": "opc.tcp://127.0.0.1:1", "read_mode": "subscribe"})
    adapter = OpcUaAdapter(cfg)

    # 1) 私有字段从 extra 解析出来
    assert adapter._endpoint == "opc.tcp://127.0.0.1:1"

    # 2) 连不上 ⇒ False，且**不抛**
    assert asyncio.run(adapter.connect()) is False

    # 3) 断开同样不得抛
    asyncio.run(adapter.disconnect())


def test_iec104_adapter_accepts_generic_config_and_never_raises():
    from src.protocols.iec104 import Iec104Adapter

    cfg = _generic_config("iec104", {"host": "127.0.0.1", "port": 1})
    adapter = Iec104Adapter(cfg)

    assert (adapter._host, adapter._port) == ("127.0.0.1", 1)
    assert asyncio.run(adapter.connect()) is False
    asyncio.run(adapter.disconnect())
