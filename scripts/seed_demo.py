#!/usr/bin/env python3
# ============================================================
# dgiot_lite — Demo 数据一键填充
# 创建: 5台设备 + 25个点位，匹配模拟器
# ============================================================
import httpx
import asyncio
import sys

BASE = "http://localhost:8000/api"

DEVICES = [
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
     "comm_params": {"host": "127.0.0.1", "port": 2404, "common_addr": 1}},
    {"device_id": "charger_opcua", "device_name": "充电桩(OPCUA)", "device_type": "charger",
     "station_id": "station_01", "protocol": "opcua",
     "comm_params": {"endpoint": "opc.tcp://127.0.0.1:4840", "read_mode": "subscribe"}},
]

POINTS = {
    "inv_01": [
        {"point_id": "inv_power", "point_name": "有功功率", "protocol_addr": "0x0004", "register_type": "3", "data_type": "float32", "unit": "W", "collect_interval": 5},
        {"point_id": "inv_voltage", "point_name": "A相电压", "protocol_addr": "0x0000", "register_type": "3", "data_type": "float32", "unit": "V", "collect_interval": 5},
        {"point_id": "inv_current", "point_name": "A相电流", "protocol_addr": "0x0002", "register_type": "3", "data_type": "float32", "unit": "A", "collect_interval": 5},
        {"point_id": "inv_temp", "point_name": "逆变器温度", "protocol_addr": "0x0008", "register_type": "3", "data_type": "float32", "unit": "°C", "collect_interval": 10},
        {"point_id": "inv_pf", "point_name": "功率因数", "protocol_addr": "0x0006", "register_type": "3", "data_type": "float32", "unit": "", "collect_interval": 10},
    ],
    "pcs_01": [
        {"point_id": "pcs_soc", "point_name": "SOC", "protocol_addr": "0x0000", "register_type": "3", "data_type": "float32", "unit": "%", "collect_interval": 5},
        {"point_id": "pcs_power", "point_name": "有功功率", "protocol_addr": "0x0006", "register_type": "3", "data_type": "float32", "unit": "W", "collect_interval": 5},
        {"point_id": "pcs_soh", "point_name": "SOH", "protocol_addr": "0x0002", "register_type": "3", "data_type": "float32", "unit": "%", "collect_interval": 10},
        {"point_id": "pcs_temp", "point_name": "电芯温度", "protocol_addr": "0x0004", "register_type": "3", "data_type": "float32", "unit": "°C", "collect_interval": 10},
        {"point_id": "pcs_voltage", "point_name": "交流电压", "protocol_addr": "0x0008", "register_type": "3", "data_type": "float32", "unit": "V", "collect_interval": 10},
    ],
    "charger_01": [
        {"point_id": "charger_status", "point_name": "充电状态", "protocol_addr": "0x0000", "register_type": "3", "data_type": "uint16", "unit": "", "collect_interval": 5},
        {"point_id": "charger_power", "point_name": "充电功率", "protocol_addr": "0x0002", "register_type": "3", "data_type": "float32", "unit": "kW", "collect_interval": 5},
        {"point_id": "charger_voltage", "point_name": "输出电压", "protocol_addr": "0x0004", "register_type": "3", "data_type": "float32", "unit": "V", "collect_interval": 5},
        {"point_id": "charger_current", "point_name": "输出电流", "protocol_addr": "0x0006", "register_type": "3", "data_type": "float32", "unit": "A", "collect_interval": 5},
        {"point_id": "charger_energy", "point_name": "当前充电量", "protocol_addr": "0x0008", "register_type": "3", "data_type": "float32", "unit": "kWh", "collect_interval": 10},
    ],
    "pcs_iec104": [
        {"point_id": "iec104_soc", "point_name": "SOC(IEC104)", "protocol_addr": "100", "register_type": "", "data_type": "float32", "unit": "%", "collect_interval": 5},
        {"point_id": "iec104_power", "point_name": "有功功率(IEC104)", "protocol_addr": "102", "register_type": "", "data_type": "float32", "unit": "W", "collect_interval": 5},
        {"point_id": "iec104_voltage", "point_name": "交流电压(IEC104)", "protocol_addr": "103", "register_type": "", "data_type": "float32", "unit": "V", "collect_interval": 5},
        {"point_id": "iec104_temp", "point_name": "电芯温度(IEC104)", "protocol_addr": "105", "register_type": "", "data_type": "float32", "unit": "°C", "collect_interval": 10},
        {"point_id": "iec104_soh", "point_name": "SOH(IEC104)", "protocol_addr": "101", "register_type": "", "data_type": "float32", "unit": "%", "collect_interval": 10},
    ],
    "charger_opcua": [
        {"point_id": "opcua_status", "point_name": "充电状态(OPCUA)", "protocol_addr": "ns=2;s=Charger_01.Status", "register_type": "", "data_type": "int32", "unit": "", "collect_interval": 5},
        {"point_id": "opcua_power", "point_name": "充电功率(OPCUA)", "protocol_addr": "ns=2;s=Charger_01.ChargePower", "register_type": "", "data_type": "float64", "unit": "kW", "collect_interval": 5},
        {"point_id": "opcua_voltage", "point_name": "输出电压(OPCUA)", "protocol_addr": "ns=2;s=Charger_01.OutputVoltage", "register_type": "", "data_type": "float64", "unit": "V", "collect_interval": 5},
        {"point_id": "opcua_temp", "point_name": "模块温度(OPCUA)", "protocol_addr": "ns=2;s=Charger_01.ModuleTemp", "register_type": "", "data_type": "float64", "unit": "°C", "collect_interval": 10},
        {"point_id": "opcua_energy", "point_name": "累计充电量(OPCUA)", "protocol_addr": "ns=2;s=Charger_01.TotalEnergy", "register_type": "", "data_type": "float64", "unit": "kWh", "collect_interval": 10},
    ],
}


async def main():
    async with httpx.AsyncClient(timeout=15) as c:
        ok, fail = 0, 0

        # 1. 检查服务
        print(">>> 检查平台服务...")
        try:
            r = await c.get(f"{BASE}/health")
            assert r.json()["status"] == "ok"
            print(f"   [OK] 平台 V{r.json()['version']} 运行中")
        except Exception as e:
            print(f"   [FAIL] 平台未启动! {e}")
            print("   请先运行: python run.py")
            return 1

        # 2. 创建设备
        print("\n>>> 创建设备...")
        for d in DEVICES:
            r = await c.post(f"{BASE}/devices", json=d)
            if r.status_code in (200, 201):
                print(f"   [OK] {d['device_id']} ({d['device_name']}) — {d['protocol']}")
                ok += 1
            elif r.status_code == 400:
                print(f"   [SKIP] {d['device_id']} 已存在")
                ok += 1
            else:
                print(f"   [FAIL] {d['device_id']}: {r.status_code}")
                fail += 1

        # 3. 创建点位
        print("\n>>> 创建点位...")
        for device_id, pts in POINTS.items():
            # 先查一下设备是否存在
            r = await c.get(f"{BASE}/devices/{device_id}")
            if r.status_code != 200:
                print(f"   [SKIP] 设备 {device_id} 不存在")
                continue
            for p in pts:
                p["device_id"] = device_id
                r = await c.post(f"{BASE}/devices/{device_id}/points", json=p)
                if r.status_code in (200, 201):
                    print(f"   [OK] {device_id}/{p['point_id']} — {p['point_name']}")
                    ok += 1
                elif r.status_code == 400:
                    ok += 1
                else:
                    print(f"   [FAIL] {device_id}/{p['point_id']}: {r.status_code}")
                    fail += 1

        # 4. 汇总
        print(f"\n{'='*50}")
        print(f"  OK: {ok}  |  FAIL: {fail}")
        if ok > 0:
            print()
            print("  >>> 下一步: 启动模拟器")
            print("  python simulators/run_all.py")
            print("  或双击 start_simulators.bat")
            print()
            print("  然后打开 http://localhost:8000 查看实时数据!")
        return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
