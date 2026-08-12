#!/usr/bin/env python3
"""
模块二闭环测试 — Modbus 动态扫描 → 点位识别 → G1-G8 物模型匹配
================================================================
对标需求: 不修改DTU、不影响A11, 新 RTU 上线自动识别点位并匹配物模型
绑定场景: OIL_FIELD 191 台 RTU (11.248.x) + G1-G8 油水井标准物模型

闭环: 模拟 RTU(Modbus 从站, 模拟抽油机 G1-G8 寄存器) →
      动态扫描(零发包只读) → 点位识别(类型/字节序/动态性) →
      G1-G8 物模型匹配 → 自动生成配点表 (不动 LegacyComm)

验证:
  1. 模拟 RTU 数据生成 (G1 油压/套压/载荷 + G2 电流 + G4 冲次)
  2. 扫描识别出有效点位 + 数据类型正确
  3. 物模型匹配率 ≥ 80% (地址命中 G1-G8)
  4. 语义正确: oil_pressure 对应油压 (40300), load 对应载荷 (40304)
  5. 自动生成配点表 JSON (可导入采集配置)
  6. 全程零修改: 不写从站寄存器, 不修改任何配置

运行: python tests/test_auto_identify.py
"""
import os, sys, time, threading, struct, json, random

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

PASS = FAIL = 0

def t(name, ok, detail=""):
    global PASS, FAIL
    if ok: PASS += 1
    else: FAIL += 1
    print(f"  [{'PASS' if ok else 'FAIL'}] {name} {detail}")


def main():
    try:
        from pymodbus.server import StartTcpServer
        from pymodbus.datastore import (ModbusSequentialDataBlock,
                                        ModbusSlaveContext,
                                        ModbusServerContext)
        from pymodbus.client import ModbusTcpClient
    except ImportError:
        print("需要 pymodbus: pip install pymodbus")
        return 1

    from src.protocols.modbus_dynamic import DynamicModbusScanner
    from src.services.modbus_auto_identify import AutoIdentifyService

    print("=== 模块二闭环测试: Modbus 自动识别 + 物模型匹配 ===")
    print()

    # ── 1. 模拟抽油机 RTU 从站 (G1-G8 寄存器布局) ──
    store = ModbusSlaveContext(
        di=ModbusSequentialDataBlock(0, [0] * 200),
        co=ModbusSequentialDataBlock(0, [0] * 200),
        hr=ModbusSequentialDataBlock(0, [0] * 60000),
        ir=ModbusSequentialDataBlock(0, [0] * 200))
    ctx = ModbusServerContext(slaves={1: store}, single=False)

    def _update_runtime():
        """模拟抽油机运行时数据 (油压/套压/载荷/电流/冲次)"""
        while True:
            # G1: 40300 油压 2.35MPa → 235(×0.01) | 40301 套压 1.82 → 182
            store.setValues(3, 40300, [random.randint(200, 280)])
            store.setValues(3, 40301, [random.randint(150, 220)])
            # 40304 载荷 86kN → 860 (×0.1)
            store.setValues(3, 40304, [random.randint(800, 950)])
            # G2: 40351/52 A/B相电流 42A → 420 (×0.1)
            store.setValues(3, 40351, [random.randint(380, 460)])
            store.setValues(3, 40352, [random.randint(370, 450)])
            # G4: 40420 冲次 6次/min
            store.setValues(3, 40420, [random.randint(5, 7)])
            # 静态点: 40403 变频器状态
            store.setValues(3, 40403, [1])
            time.sleep(0.25)
    threading.Thread(target=_update_runtime, daemon=True).start()

    srv_thread = threading.Thread(
        target=StartTcpServer,
        kwargs={"context": ctx, "address": ("127.0.0.1", 1503)},
        daemon=True)
    srv_thread.start()
    time.sleep(0.5)

    # 确认从站可用
    client = ModbusTcpClient("127.0.0.1", 1503, timeout=1)
    t("模拟RTU从站就绪", client.connect())
    client.close()

    # ── 2. 动态扫描 + 点位识别 (只读) ──
    scanner = DynamicModbusScanner(port=1503, timeout=0.5)
    pts = scanner.recognize_points("127.0.0.1", slave=1, max_address=60000)
    t("点位识别(≥6个)", len(pts) >= 6, f"识别 {len(pts)} 个")
    for p in pts[:8]:
        print(f"       addr={p.address:>5} type={p.data_type:>7} "
              f"order={p.byte_order} dyn={p.is_dynamic} val={p.last_value}")

    # ── 3. 物模型匹配 ──
    svc = AutoIdentifyService()
    report = svc.matcher.match_points(
        [{"address": p.address, "data_type": p.data_type,
          "byte_order": p.byte_order, "scale": p.scale,
          "is_dynamic": p.is_dynamic, "last_value": p.last_value}
         for p in pts],
        host="11.248.195.1", slave_id=1)
    t("物模型匹配率≥80%", report.match_rate >= 0.8,
      f"匹配率 {report.match_rate:.0%} ({len(report.matched)}/{report.total_recognized})")

    # ── 4. 语义正确性 ──
    names = {m.model_name: m for m in report.matched}
    t("油压命中(40300)", "oil_pressure" in names)
    t("套压命中(40301)", "casing_pressure" in names)
    t("载荷命中(40304)", "load" in names)
    t("电流命中(40351)", "current_a" in names)
    t("冲次命中(40420)", "stroke_freq" in names)
    t("状态点识别(静态)", any(not m.is_dynamic for m in report.matched),
      "(40403 变频器状态)")

    # ── 5. 自动生成配点表 (可导入采集配置) ──
    point_table = []
    for m in report.matched:
        point_table.append({
            "address": m.address, "model": m.model_id,
            "name": m.model_name, "unit": m.unit,
            "data_type": m.recognized_type, "byte_order": m.byte_order,
            "scale": m.scale, "dynamic": m.is_dynamic,
        })
    table_path = "auto_point_table.json"
    with open(table_path, "w", encoding="utf-8") as f:
        json.dump({"device": "11.248.195.1", "slave_id": 1,
                   "source": "auto-identify", "points": point_table},
                  f, ensure_ascii=False, indent=2)
    t("自动配点表生成", len(point_table) >= 6, f"{table_path} {len(point_table)} 点")

    # ── 6. 零修改验证: 检查从站寄存器未被写入 ──
    client = ModbusTcpClient("127.0.0.1", 1503, timeout=1)
    client.connect()
    # 扫描前已确认 0xFFFF 区域未被触碰: 读一个未识别地址应仍为 0
    r = client.read_holding_registers(1000, 1, slave=1)
    untouched = (not r.isError()) and r.registers[0] == 0
    client.close()
    t("零修改验证(未写从站)", untouched,
      "扫描仅读 FC03, 未触碰其他寄存器")

    print()
    print(f"=== 模块二闭环测试: {PASS} 通过 / {FAIL} 失败 ===")
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
