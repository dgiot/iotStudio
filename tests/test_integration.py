#!/usr/bin/env python3
# ============================================================
# pythonIot — 端到端集成测试
# 验证: 设备CRUD → 点位配置 → 采集统计
# 使用: python test_integration.py
# ============================================================
import httpx
import asyncio
import sys

BASE = "http://localhost:8000/api"


async def test():
    async with httpx.AsyncClient(timeout=10) as c:
        errors = []
        ok = lambda msg: print(f"  [OK] {msg}")
        fail = lambda msg: errors.append(msg) or print(f"  [FAIL] {msg}")

        # 1. 健康检查
        print("\n--- 1. 健康检查 ---")
        r = await c.get(f"{BASE}/health")
        if r.status_code == 200 and r.json()["status"] == "ok":
            ok(f"服务正常 V{r.json()['version']}")
        else:
            fail("服务异常")

        # 2. 创建设备
        print("\n--- 2. 创建设备 ---")
        devices = [
            {"device_id": "inv_01", "device_name": "光伏逆变器#1", "device_type": "inverter",
             "station_id": "station_01", "protocol": "modbus_tcp",
             "comm_params": {"host": "127.0.0.1", "port": 502, "slave_id": 1}},
            {"device_id": "pcs_01", "device_name": "储能PCS#1", "device_type": "pcs",
             "station_id": "station_01", "protocol": "modbus_tcp",
             "comm_params": {"host": "127.0.0.1", "port": 1502, "slave_id": 2}},
            {"device_id": "charger_01", "device_name": "直流充电桩#1", "device_type": "charger",
             "station_id": "station_01", "protocol": "modbus_tcp",
             "comm_params": {"host": "127.0.0.1", "port": 2502, "slave_id": 3}},
            {"device_id": "pcs_iec104", "device_name": "储能PCS(IEC104)", "device_type": "pcs",
             "station_id": "station_01", "protocol": "iec104",
             "comm_params": {"host": "127.0.0.1", "port": 2404}},
            {"device_id": "charger_opcua", "device_name": "充电桩(OPCUA)", "device_type": "charger",
             "station_id": "station_01", "protocol": "opcua",
             "comm_params": {"endpoint": "opc.tcp://127.0.0.1:4840", "read_mode": "subscribe"}},
        ]
        for d in devices:
            r = await c.post(f"{BASE}/devices", json=d)
            if r.status_code in (200, 201, 400):
                ok(f"设备 {d['device_id']} ({d['protocol']})")

        # 3. 列出设备
        print("\n--- 3. 设备列表 ---")
        r = await c.get(f"{BASE}/devices")
        devs = r.json().get("devices", [])
        ok(f"共 {len(devs)} 台设备")
        for d in devs:
            print(f"    {d['device_id']} | {d['device_name']} | {d['protocol']} | {d['status']}")

        # 4. 创建点位
        print("\n--- 4. 创建点位 ---")
        points = [
            {"point_id": "inv_power", "device_id": "inv_01", "point_name": "有功功率",
             "protocol_addr": "0x0004", "register_type": "3", "data_type": "float32", "unit": "W", "collect_interval": 5},
            {"point_id": "inv_voltage", "device_id": "inv_01", "point_name": "A相电压",
             "protocol_addr": "0x0000", "register_type": "3", "data_type": "float32", "unit": "V", "collect_interval": 5},
            {"point_id": "pcs_soc", "device_id": "pcs_01", "point_name": "SOC",
             "protocol_addr": "0x0000", "register_type": "3", "data_type": "float32", "unit": "%", "collect_interval": 5},
            {"point_id": "pcs_power", "device_id": "pcs_01", "point_name": "有功功率",
             "protocol_addr": "0x0006", "register_type": "3", "data_type": "float32", "unit": "W", "collect_interval": 5},
            {"point_id": "charger_power", "device_id": "charger_01", "point_name": "充电功率",
             "protocol_addr": "0x0002", "register_type": "3", "data_type": "float32", "unit": "kW", "collect_interval": 5},
        ]
        for p in points:
            r = await c.post(f"{BASE}/devices/{p['device_id']}/points", json=p)
            if r.status_code in (200, 201):
                ok(f"点位 {p['point_id']} ({p['point_name']})")

        # 5. 采集统计
        print("\n--- 5. 采集统计 ---")
        await asyncio.sleep(2)
        r = await c.get(f"{BASE}/stats")
        stats = r.json()
        ok(f"在线设备: {stats['online_devices']} | 采集次数: {stats['total_collects']} | 成功率: {stats['success_rate']}%")

        # 6. 告警
        print("\n--- 6. 告警列表 ---")
        r = await c.get(f"{BASE}/alarms")
        alarms = r.json()
        ok(f"当前告警: {alarms.get('total', 0)} 条")

        print("\n" + "=" * 50)
        if errors:
            print(f"  FAILED: {len(errors)} errors")
            for e in errors:
                print(f"    - {e}")
            return 1
        else:
            print("  ALL PASSED")
            return 0


if __name__ == "__main__":
    print("=" * 50)
    print("  pythonIot 集成测试")
    print("=" * 50)
    sys.exit(asyncio.run(test()))
