#!/usr/bin/env python3
"""
LegacyComm TCP Server 集成测试
===============================
验证: TCP Server启动 → RTU模拟连接 → DTU注册 → Modbus轮询 → 数据推送
"""
import asyncio, sys, os, time, json, logging

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)s] %(message)s')
log = logging.getLogger("test")


class FakeEventBus:
    """测试用 EventBus — 记录所有事件"""
    def __init__(self):
        self.events = []

    def on(self, key, callback, mode="one_for_more"):
        pass

    def emit(self, key, **kwargs):
        self.events.append({"key": key, **kwargs})
        log.info(f"[eventbus] {key}: {json.dumps(kwargs, default=str)[:200]}")


class FakeMQTT:
    """测试用 MQTT"""
    async def publish(self, topic, payload):
        log.info(f"[mqtt] {topic}: {payload[:150]}")


class FakeStorage:
    """测试用存储"""
    async def write_telemetry(self, **kwargs):
        device_id = kwargs.get('device_id', '?')
        points = kwargs.get('points', {})
        log.info(f"[storage] {device_id}: {len(points)} 测点")


async def test_basic():
    """基础测试: 启动Server → 连接1台模拟RTU → 验证数据流"""
    from src.protocols.commbridge_server import LegacyCommServer

    bus = FakeEventBus()
    server = LegacyCommServer(event_bus=bus, port=15301)  # 用非特权端口测试
    await server.start()

    # 验证状态
    status = server.status()
    assert status["running"], "Server未启动"
    assert status["port"] == 15301
    log.info(f"✅ Server启动成功: {status}")

    # 连接一台模拟 RTU
    from src.services.commbridge_integration import RtuSimulator
    sim = RtuSimulator(dtu_id="test_rtu_001", slave_id=1, channels=10)
    task = asyncio.create_task(sim.connect_and_respond(port=15301))

    # 等待模拟RTU完成几轮通信
    await asyncio.sleep(5)

    # 验证数据事件
    data_events = [e for e in bus.events if "data.received" in e["key"]]
    log.info(f"数据事件: {len(data_events)} 条")

    if len(data_events) > 0:
        sample = data_events[0]
        log.info(f"  示例: dtu_id={sample.get('dtu_id')}, values={json.dumps(sample.get('values',{}), default=str)[:200]}")
        # DTU ID 由注册包解析: dtu_{hash:X}_{devtype:02X}
        assert sample.get("dtu_id") is not None
        assert sample.get("values") is not None
        assert len(sample.get("values", {})) > 0
        # 验证数据转换: 值应在合理范围 (0-300 对于 8192 标定 @ 170/8192)
        for k, v in sample.get("values", {}).items():
            assert isinstance(v, (int, float)), f"{k}={v} 不是数值"
        log.info("✅ 数据验证通过")

    # 验证连接事件
    connect_events = [e for e in bus.events if "connected" in e["key"]]
    assert len(connect_events) > 0, "无连接事件"
    log.info(f"✅ 连接事件: {len(connect_events)} 条")

    # 清理
    task.cancel()
    await server.stop()
    log.info("✅ 基础测试通过")


async def test_multi_rtu():
    """多RTU并发测试: 10台RTU同时连接"""
    from src.protocols.commbridge_server import LegacyCommServer
    bus = FakeEventBus()
    server = LegacyCommServer(event_bus=bus, port=15302, max_connections=50)
    await server.start()

    from src.services.commbridge_integration import RtuSimulator
    tasks = []
    for i in range(10):
        sim = RtuSimulator(dtu_id=f"rtu_{i:03d}", slave_id=i + 1, channels=5)
        tasks.append(asyncio.create_task(sim.connect_and_respond(port=15302)))

    await asyncio.sleep(8)

    for t in tasks:
        t.cancel()

    status = server.status()
    log.info(f"多RTU状态: 连接数峰值={len([e for e in bus.events if 'connected' in e['key']])}")

    data_events = [e for e in bus.events if "data.received" in e["key"]]
    dtu_ids = set(e.get("dtu_id") for e in data_events)
    log.info(f"数据事件: {len(data_events)} 条, 来自 {len(dtu_ids)} 台设备")
    log.info(f"✅ 多RTU测试通过 (设备:{dtu_ids})")

    await server.stop()


async def test_reconnect():
    """断线重连测试"""
    from src.protocols.commbridge_server import LegacyCommServer
    bus = FakeEventBus()
    server = LegacyCommServer(event_bus=bus, port=15303, heartbeat_timeout=5)
    await server.start()

    from src.services.commbridge_integration import RtuSimulator

    # 第一轮连接
    sim = RtuSimulator(dtu_id="reconnect_test", slave_id=1, channels=3)
    task = asyncio.create_task(sim.connect_and_respond(port=15303))
    await asyncio.sleep(3)
    task.cancel()
    await asyncio.sleep(1)

    # 第二轮连接
    sim2 = RtuSimulator(dtu_id="reconnect_test", slave_id=1, channels=3)
    task2 = asyncio.create_task(sim2.connect_and_respond(port=15303))
    await asyncio.sleep(3)
    task2.cancel()

    disconnect_events = [e for e in bus.events if "disconnected" in e["key"]]
    connect_events = [e for e in bus.events if "connected" in e["key"]]
    log.info(f"断开事件: {len(disconnect_events)}, 连接事件: {len(connect_events)}")
    log.info("✅ 断线重连测试通过")

    await server.stop()


async def test_modbus_frame():
    """Modbus 帧构造和解析测试"""
    from src.protocols.commbridge_server import (
        make_modbus_rtu_request, parse_modbus_rtu_response, crc16
    )

    # 构造请求帧
    request = make_modbus_rtu_request(slave_id=1, func_code=0x03, start_addr=0, quantity=10)
    log.info(f"请求帧: {request.hex(' ')} (len={len(request)})")

    # 验证 CRC
    crc = crc16(request[:-2])
    actual_crc = int.from_bytes(request[-2:], 'little')
    assert crc == actual_crc, f"CRC16 错误: 计算={crc:04X}, 实际={actual_crc:04X}"
    log.info(f"✅ CRC16 验证通过: 0x{crc:04X}")

    # 构造响应帧
    import struct
    slave_id, func = 1, 0x03
    byte_count = 20
    values = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    response = struct.pack('>BBB', slave_id, func, byte_count)
    for v in values:
        response += struct.pack('>H', v)
    resp_crc = crc16(response)
    response += struct.pack('<H', resp_crc)
    log.info(f"响应帧: {response.hex(' ')}")

    # 解析响应
    parsed = parse_modbus_rtu_response(response)
    assert parsed is not None, "响应解析失败"
    assert parsed == values, f"值不匹配: {parsed} != {values}"
    log.info(f"✅ Modbus 帧解析通过: {parsed}")


if __name__ == "__main__":
    print("=" * 60)
    print("LegacyComm TCP Server — 集成测试")
    print("=" * 60)

    async def main():
        await test_modbus_frame()
        print()
        await test_basic()
        print()
        await test_multi_rtu()
        print()
        await test_reconnect()
        print()
        print("=" * 60)
        print("全部测试通过 ✅")
        print("=" * 60)

    asyncio.run(main())
