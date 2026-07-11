#!/usr/bin/env python3
"""
A11 实时演示 — 模拟器 + 健康监控 + 数据采集 三合一
====================================================
启动后自动运行: 模拟器 → 健康检查 → 数据采集 → 循环
"""
import asyncio, json, sys, os, time, random
from datetime import datetime
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

async def main():
    print("=" * 65)
    print("  A11 协议实时演示")
    print("  模拟器 + 健康监控 + 数据采集 全链路")
    print("=" * 65)

    # 1. 启动模拟器
    print("\n[1/4] 启动 A11 模拟器...")
    from simulators.a11_simulator import A11Simulator
    sim = A11Simulator(host='127.0.0.1', port=19999)
    await sim.start()
    await asyncio.sleep(0.5)

    # 2. 单次健康检查
    print("[2/4] 健康检查...")
    from loops.a11_health_monitor import run_health_check
    health = await run_health_check('127.0.0.1:19999')
    print(f"  结果: {health['status']} (成功率: {health.get('success_rate', 0):.0f}%)")

    # 3. 数据采集循环 (模拟真实采集)
    print("[3/4] 数据采集循环...")
    from protocols.a11 import A11Config, A11ProtocolAdapter, A11Message

    config = A11Config(device_id='demo-rtu-001', host='127.0.0.1', port=19999,
                       heartbeat_interval=0, collect_interval=1)
    adapter = A11ProtocolAdapter(config)
    connected = await adapter.connect()
    print(f"  连接: {'OK' if connected else 'FAIL'}")

    # 采集10轮
    points = [
        {'point_id': 'temp', 'point_name': '井口温度', 'a11_type': 0x0539, 'unit': 'degC'},
        {'point_id': 'press', 'point_name': '井口压力', 'a11_type': 0x0539, 'unit': 'MPa'},
    ]

    samples = []
    for i in range(10):
        values = await adapter.read_points(points)
        if values:
            for v in values:
                samples.append(v)
            print(f"  [{i+1:2d}] {len(values)} 个测点: " +
                  ", ".join(f"{v.point_name}={v.value} {v.unit}" for v in values[:3]))
        await asyncio.sleep(1)

    await adapter.disconnect()

    # 4. 汇总报告
    print(f"\n[4/4] 汇总报告")
    print(f"  采集轮次: 10")
    print(f"  测点总数: {len(samples)}")
    print(f"  模拟器统计: {dict(sim.stats)}")
    print(f"  健康状态: {health['status']}")

    # 显示采样值
    if samples:
        temps = [float(s.value) for s in samples if hasattr(s, 'point_name') and '温度' in str(s.point_name)]
        press = [float(s.value) for s in samples if hasattr(s, 'point_name') and '压力' in str(s.point_name)]
        if temps:
            print(f"\n  温度采样: {[round(t, 1) for t in temps[:5]]}...")
        if press:
            print(f"  压力采样: {[round(p, 2) for p in press[:5]]}...")

    await sim.stop()
    print("\n演示完成。")

if __name__ == '__main__':
    asyncio.run(main())
