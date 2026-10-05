#!/usr/bin/env python3
# ============================================================
# pythonIot — 端到端集成测试
# 验证: 设备CRUD → 点位配置 → 采集统计
#
# 用法（REQ-DEV-003 起 base URL 可配 ✓）:
#   API_BASE=http://127.0.0.1:8000/api python tests/test_integration.py     # 打指定实例（如 1.5 真构建）
#   python tests/test_integration.py                                       # 默认 http://localhost:8000/api
#   pytest tests/test_integration.py -q   或   pytest -m integration       # pytest 方式（需活服务）
#
# 边界说明:
#   * pytest.ini 默认 --ignore 本文件（它需要活服务）⇒ 常规全量跑不会带上它；
#   * 本文件既是脚本也是 pytest 用例（pytestmark = integration）；
#   * REQ-DEV-003 治理三点：
#       ① BASE 由环境变量 API_BASE 决定（此前写死 localhost:8000 ⇒ 只能打本机 app）
#       ② 设备 id 每次运行唯一（此前写死 inv_01 ⇒ 二次运行一律 400 ⇒ "冷态失败/热态通过"）
#       ③ 非预期状态码 = 失败（此前 500 被静默放过 ⇒ 这就是当初 500 没被发现的原因）
#   * **不做自动删除**：删除属破坏性动作（需 USER 点头）⇒ 每次运行会留下 it<run> 前缀的探针数据，
#     需要清理时由人工决定。
# ============================================================
import asyncio
import os
import sys
import uuid

import httpx
import pytest

pytestmark = pytest.mark.integration

BASE = os.environ.get("API_BASE", "http://localhost:8000/api").rstrip("/")
RUN = (os.environ.get("IT_RUN_ID") or uuid.uuid4().hex[:6]).lower()


def did(name: str) -> str:
    """每次运行唯一的设备 id ⇒ 重跑不再撞 400。"""
    return f"it{RUN}_{name}"


async def test():
    async with httpx.AsyncClient(timeout=10) as c:
        errors = []
        ok = lambda msg: print(f"  [OK] {msg}")
        fail = lambda msg: errors.append(msg) or print(f"  [FAIL] {msg}")

        print(f"  BASE = {BASE}   RUN = {RUN}")

        # 1. 健康检查
        print("\n--- 1. 健康检查 ---")
        r = await c.get(f"{BASE}/health")
        if r.status_code == 200 and r.json().get("status") == "ok":
            ok(f"服务正常 V{r.json().get('version')}")
        else:
            fail(f"服务异常 status={r.status_code} body={r.text[:120]}")

        # 2. 创建设备
        print("\n--- 2. 创建设备 ---")
        devices = [
            {"device_id": did("inv01"), "device_name": "光伏逆变器#1", "device_type": "inverter",
             "station_id": "station_01", "protocol": "modbus_tcp",
             "comm_params": {"host": "127.0.0.1", "port": 502, "slave_id": 1}},
            {"device_id": did("pcs01"), "device_name": "储能PCS#1", "device_type": "pcs",
             "station_id": "station_01", "protocol": "modbus_tcp",
             "comm_params": {"host": "127.0.0.1", "port": 1502, "slave_id": 2}},
            {"device_id": did("charger01"), "device_name": "直流充电桩#1", "device_type": "charger",
             "station_id": "station_01", "protocol": "modbus_tcp",
             "comm_params": {"host": "127.0.0.1", "port": 2502, "slave_id": 3}},
            {"device_id": did("pcs_iec104"), "device_name": "储能PCS(IEC104)", "device_type": "pcs",
             "station_id": "station_01", "protocol": "iec104",
             "comm_params": {"host": "127.0.0.1", "port": 2404}},
            {"device_id": did("charger_opcua"), "device_name": "充电桩(OPCUA)", "device_type": "charger",
             "station_id": "station_01", "protocol": "opcua",
             "comm_params": {"endpoint": "opc.tcp://127.0.0.1:4840", "read_mode": "subscribe"}},
        ]
        for d in devices:
            r = await c.post(f"{BASE}/devices", json=d)
            # 唯一 id ⇒ 正常态就该是 200/201；400 也不再静默放过（可能是请求形状不对）
            if r.status_code in (200, 201):
                ok(f"设备 {d['device_id']} ({d['protocol']})")
            else:
                fail(f"设备 {d['device_id']} ({d['protocol']}) status={r.status_code} body={r.text[:120]}")

        # 3. 列出设备
        print("\n--- 3. 设备列表 ---")
        r = await c.get(f"{BASE}/devices")
        if r.status_code == 200:
            devs = r.json().get("devices", [])
            mine = [d for d in devs if str(d.get("device_id", "")).startswith(f"it{RUN}_")]
            ok(f"共 {len(devs)} 台设备（本轮创建 {len(mine)} 台）")
            for d in mine:
                print(f"    {d.get('device_id')} | {d.get('device_name')} | {d.get('protocol')} | {d.get('status')}")
        else:
            fail(f"设备列表失败 status={r.status_code} body={r.text[:120]}")

        # 4. 创建点位
        print("\n--- 4. 创建点位 ---")
        points = [
            {"point_id": "inv_power", "device_id": did("inv01"), "point_name": "有功功率",
             "protocol_addr": "0x0004", "register_type": "3", "data_type": "float32", "unit": "W", "collect_interval": 5},
            {"point_id": "inv_voltage", "device_id": did("inv01"), "point_name": "A相电压",
             "protocol_addr": "0x0000", "register_type": "3", "data_type": "float32", "unit": "V", "collect_interval": 5},
            {"point_id": "pcs_soc", "device_id": did("pcs01"), "point_name": "SOC",
             "protocol_addr": "0x0000", "register_type": "3", "data_type": "float32", "unit": "%", "collect_interval": 5},
            {"point_id": "pcs_power", "device_id": did("pcs01"), "point_name": "有功功率",
             "protocol_addr": "0x0006", "register_type": "3", "data_type": "float32", "unit": "W", "collect_interval": 5},
            {"point_id": "charger_power", "device_id": did("charger01"), "point_name": "充电功率",
             "protocol_addr": "0x0002", "register_type": "3", "data_type": "float32", "unit": "kW", "collect_interval": 5},
        ]
        for p in points:
            r = await c.post(f"{BASE}/devices/{p['device_id']}/points", json=p)
            if r.status_code in (200, 201):
                ok(f"点位 {p['point_id']} ({p['point_name']})")
            else:
                fail(f"点位 {p['point_id']} status={r.status_code} body={r.text[:120]}")

        # 5. 采集统计（此前 stats['online_devices'] 直接取键 ⇒ 键缺失时抛 KeyError 而不是判失败）
        print("\n--- 5. 采集统计 ---")
        await asyncio.sleep(2)
        r = await c.get(f"{BASE}/stats")
        if r.status_code == 200:
            stats = r.json() if isinstance(r.json(), dict) else {}
            if "online_devices" in stats:
                ok(f"在线设备: {stats.get('online_devices')} | 采集次数: {stats.get('total_collects')} | 成功率: {stats.get('success_rate')}%")
            else:
                fail(f"stats 响应缺 online_devices：keys={sorted(stats)[:8]} body={r.text[:120]}")
        else:
            fail(f"stats 失败 status={r.status_code} body={r.text[:120]}")

        # 6. 告警
        print("\n--- 6. 告警列表 ---")
        r = await c.get(f"{BASE}/alarms")
        if r.status_code == 200:
            alarms = r.json() if isinstance(r.json(), dict) else {}
            ok(f"当前告警: {alarms.get('total', 0)} 条")
        else:
            fail(f"alarms 失败 status={r.status_code} body={r.text[:120]}")

        print("\n" + "=" * 50)
        if errors:
            print(f"  FAILED: {len(errors)} errors")
            for e in errors:
                print(f"    - {e}")
            return 1
        print("  ALL PASSED")
        return 0


if __name__ == "__main__":
    print("=" * 50)
    print("  pythonIot 集成测试")
    print("=" * 50)
    sys.exit(asyncio.run(test()))
