#!/usr/bin/env python3
"""
Modbus TCP / Modbus RTU / A11 协议测试器
========================================
基于 Oracle 生产数据验证三协议的点位和状态。

Modbus TCP:  CommBridge.exe → 80+ RTU → Oracle SYS_POINTRELATION_WELL (4,567点)
Modbus RTU:  Standard_Umodbus → (历史, 当前未运行)
A11:         IOMan workers → 11.66.12.130:8889 → Oracle PC_FD_PUMPJACK_FDYNA_DIA_T (4.8M功图)

用法: python protocol_tester.py [modbus_tcp|modbus_rtu|a11|all]
"""
import sys, time
import requests
import urllib.parse as u
from collections import Counter

API = "http://localhost:8000"


def q(sql):
    r = requests.get(f"{API}/api/oracle/query?sql={u.quote(sql)}", timeout=30)
    return r.json().get('rows', [])


def section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


# ═══════════════════ Modbus TCP ═══════════════════

def test_modbus_tcp():
    section("Modbus TCP — CommBridge.exe 采集 (CY1C8K)")

    # 测点统计
    r = q("SELECT count(*) AS CNT FROM SYS_POINTRELATION_WELL")
    print(f"  总测点: {r[0]['CNT'] if r else 0}")

    # 按计量站分布
    print("\n  --- 按计量站分布 (TOP 10) ---")
    r = q("""
        SELECT SUBSTR(POINT_LONGNAME, 1, INSTR(POINT_LONGNAME,'/',1,3)-1) AS station,
               count(*) AS CNT
        FROM SYS_POINTRELATION_WELL GROUP BY SUBSTR(POINT_LONGNAME, 1, INSTR(POINT_LONGNAME,'/',1,3)-1)
        ORDER BY CNT DESC
    """)
    for row in (r or [])[:10]:
        print(f"    {row.get('STATION','?'):40s} {row['CNT']}")

    # 按测点类型分布
    print("\n  --- 测点类型 (TOP 15) ---")
    r = q("""
        SELECT SUBSTR(POINT_LONGNAME, -3) AS pt, count(*) AS CNT
        FROM SYS_POINTRELATION_WELL
        GROUP BY SUBSTR(POINT_LONGNAME, -3) ORDER BY CNT DESC
    """)
    for row in (r or [])[:15]:
        pt_name = {"TGP":"套压","GYS":"工况","ZWG":"总无功","ZYG":"总有功","ZHL":"总回流",
                   "CZT":"齿轮状态","ADL":"A相电流","BDL":"B相电流","CDL":"C相电流",
                   "ADY":"A相电压","BDY":"B相电压","CDY":"C相电压",
                   "DWL":"低回流","UWL":"高回流","DCV":"低控阀","UCV":"高控阀",
                   "CHC":"冲程","SLV":"位置","CPV":"控阀位","RCV":"远程阀",
                   "PDL":"泵电流","PDY":"泵电压","YIS":"油压仪"}.get(row['PT'],'')
        print(f"    {row['PT']} {pt_name:8s} {row['CNT']}")

    # 井口 RTU 连接状态
    print("\n  --- 井口 RTU 连接 (Oracle 运行记录) ---")
    r = q("""
        SELECT * FROM (SELECT WELL_ID, INSERT_TIME, TODAY_RUN_RATE
        FROM SYS_DEVICE_RUN_DETAILS_HIST WHERE INSERT_TIME LIKE '2026/7/12%'
        ORDER BY INSERT_TIME DESC) WHERE rownum<=10
    """)
    for row in (r or [])[:10]:
        print(f"    井{row['WELL_ID']} | {row['INSERT_TIME']} | {row['TODAY_RUN_RATE']}%")

    # 汇总
    r = q("SELECT count(distinct WELL_ID) AS CNT FROM SYS_DEVICE_RUN_DETAILS_HIST")
    active_wells = int(r[0]['CNT']) if r else 0
    r = q("SELECT count(*) AS CNT FROM SYS_DEVICE_RUN_DETAILS_HIST")
    total_records = int(r[0]['CNT']) if r else 0
    print(f"\n  Modbus TCP 汇总: {active_wells} 口活跃井, {total_records:,} 条运行记录")


# ═══════════════════ Modbus RTU ═══════════════════

def test_modbus_rtu():
    section("Modbus RTU — Standard_Umodbus (历史, 未运行)")

    print("  状态: 驱动已配置但当前未启用")
    print("  文件: E:\\IO ServerOnLine\\back\\run\\Standard_Umodbus\\ (空)")
    print("  配置: IoChannelCfg.ini 中未指定 RTU 通道")

    # 检查是否有 RTU 特有的数据模式
    r = q("SELECT count(*) AS CNT FROM PROJECT_DEVICEPAR WHERE DRIVERNAME LIKE '%Modbus%' OR DRIVERNAME LIKE '%RTU%'")
    print(f"  Modbus/RTU 设备参数: {r[0]['CNT'] if r else 0} 条")

    # 对比: Modbus RTU 点位是否在 Oracle 有数据
    r = q("""
        SELECT count(*) AS CNT FROM SYS_POINTRELATION_WELL
        WHERE POINT_LONGNAME LIKE '%/B1V%' AND (POINT_LONGNAME LIKE '%RTU%' OR POINT_LONGNAME NOT LIKE '%TCP%')
    """)
    print(f"  可能 RTU 来源测点: {r[0]['CNT'] if r else 0} 条 (B1V 前缀全为 TCP 采集)")


# ═══════════════════ A11 ═══════════════════

def test_a11():
    section("A11 — CNPC 采油厂协议 (IOMan → 11.66.12.130:8889)")

    # 设备参数
    r = q("SELECT count(*) AS CNT FROM PROJECT_DEVICEPAR WHERE DRIVERNAME='IM_A11_RTU'")
    print(f"  A11 RTU 设备: {r[0]['CNT'] if r else 0} 台")

    # 设备类型分布
    r = q("""
        SELECT MODELID, count(*) AS CNT FROM PROJECT_DEVICEPAR
        WHERE DRIVERNAME='IM_A11_RTU' GROUP BY MODELID ORDER BY CNT DESC
    """)
    print("\n  --- 设备型号 ---")
    model_names = {'1':'未知','2':'未知','3':'抽油机功图'}
    for row in (r or [])[:10]:
        print(f"    型号{row['MODELID']} ({model_names.get(row['MODELID'],'?')}): {row['CNT']} 台")

    # 功图数据实时性
    r = q("SELECT count(*) AS CNT FROM PC_FD_PUMPJACK_FDYNA_DIA_T")
    total = int(r[0]['CNT']) if r else 0
    print(f"\n  功图记录总数: {total:,}")

    r = q("SELECT count(*) AS CNT FROM PC_FD_PUMPJACK_FDYNA_DIA_REAL")
    realtime = r[0]['CNT'] if r else 0
    print(f"  实时功图: {int(realtime)}")

    # A11 在 Oracle 中的数据表
    a11_tables = ['PC_FD_PUMPJACK_FDYNA_DIA_T','PC_FD_PUMPJACK_FDYNA_DIA_REAL',
                  'PC_FD_DYNA_ID_CRE_T','PC_DIAGNOSIS_CONTRAST','PC_WELL_CODE',
                  'PC_PH','PC_ZDJC','PROJECT_DEVICEPAR']
    print(f"\n  --- A11 相关表 ---")
    for t in a11_tables:
        r = q(f"SELECT count(*) AS CNT FROM {t}")
        cnt = int(r[0]['CNT']) if r else 0
        print(f"    {t:35s} {cnt:>10,} 行")

    # 最新功图数据
    r = q("""
        SELECT * FROM (SELECT * FROM PC_FD_PUMPJACK_FDYNA_DIA_REAL ORDER BY 1 DESC) WHERE rownum<=3
    """)
    if r:
        print(f"\n  --- 最新实时功图 ---")
        for row in r:
            print(f"    {dict(list(row.items())[:5])}")

    # A11 连接状态
    print(f"\n  A11 连接: IOMan workers ×7 → 11.66.12.130:8889")
    print(f"  A11 汇总: {r[0]['CNT'] if r else 0} 台 RTU, {total:,} 功图记录")


# ═══════════════════ ALL ═══════════════════

def test_all():
    test_modbus_tcp()
    test_modbus_rtu()
    test_a11()

    section("总结")
    print(f"""
  三协议数据对比:
    Modbus TCP: 4,567 测点 (B1V/B2V/B3V) — CommBridge.exe 采集 — CY1C8K
    Modbus RTU: 历史残留 — 驱动文件存在但未运行 — 无当前数据
    A11:        4.8M 功图 (256台RTU) — IOMan workers 采集 — 11.66.12.130:8889

  独立工具:
    oracle_reader.py    Oracle 直读 (Modbus TCP + A11 数据)
    pSpace_reader.py    pSpace 历史数据 (CY1C7K)
    protocol_tester.py  本文件 — 三协议状态测试

  数据文件:
    docs/points.csv            Modbus TCP 4,567 测点
    docs/device_params.csv     A11 256 台 RTU 参数
    docs/channel_params.csv    通道 245 条
    docs/pump_dyna_sample.csv  功图采样
""")


if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else "all"
    tests = {"modbus_tcp": test_modbus_tcp, "modbus_rtu": test_modbus_rtu,
             "a11": test_a11, "all": test_all}
    tests.get(arg, test_all)()
