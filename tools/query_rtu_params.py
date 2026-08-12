#!/usr/bin/env python3
"""查询 Oracle 中 RTU 设备参数 — 寻找 LegacyComm 协议线索"""
import os, sys
sys.path.insert(0, r'D:\ai\dgiot_lite')
from oracle_reader import OracleReader

reader = OracleReader()

# 1. 设备类型统计
print('=== 设备类型 ===')
r = reader.query("SELECT DEVTYPE, COUNT(*) as CNT FROM PROJECT_DEVICEPAR GROUP BY DEVTYPE ORDER BY CNT DESC")
for row in r['rows']:
    print(f"  {row['DEVTYPE']}: {row['CNT']}")

# 2. Standard_Umodbus 设备参数
print('\n=== Standard_Umodbus 设备 (前10台) ===')
sql = """
SELECT DEVNAME, DEVADDR, DEVICEINDEX, PARAM
FROM (SELECT * FROM PROJECT_DEVICEPAR WHERE DEVTYPE='Standard_Umodbus')
WHERE ROWNUM <= 10
"""
r = reader.query(sql)
for row in r['rows']:
    print(f"  {row['DEVNAME']} | addr={row['DEVADDR']} | idx={row['DEVICEINDEX']} | param={row['PARAM'][:200] if row['PARAM'] else 'NULL'}")

# 3. 通道参数
print('\n=== 通道参数 (含 Umodbus/RTU) ===')
sql = """
SELECT CHANNELNAME, CHANNELTYPE, PARAM
FROM PROJECT_CHANNELPAR
WHERE ROWNUM <= 20
"""
r = reader.query(sql)
for row in r['rows']:
    print(f"  {row['CHANNELNAME']} | type={row['CHANNELTYPE']} | param={row['PARAM'][:300] if row['PARAM'] else 'NULL'}")

# 4. 完整 RTU 参数展开
print('\n=== RTU 完整 PARAM 字段 ===')
sql = """
SELECT DEVNAME, PARAM
FROM PROJECT_DEVICEPAR
WHERE DEVTYPE='Standard_Umodbus' AND PARAM IS NOT NULL AND ROWNUM <= 3
"""
r = reader.query(sql)
for row in r['rows']:
    print(f"\n  {row['DEVNAME']}:")
    param = row.get('PARAM', '')
    if param:
        print(f"    {param[:1000]}")

# 5. 有没有协议/端口配置表
print('\n=== 搜索协议配置表 ===')
for table in ['PROJECT_PROTOCOLPAR', 'PROJECT_COMMPAR', 'PROJECT_NETPAR', 'SYS_PROTOCOL', 'SYS_COMMCONFIG']:
    sql = f"SELECT COUNT(*) as CNT FROM {table}"
    r = reader.query(sql)
    cnt = r['rows'][0]['CNT'] if r['rows'] else 'ERR'
    print(f"  {table}: {cnt}")

# 6. 直接查所有表名
print('\n=== 含 PARAM 字段的表 ===')
sql = """
SELECT TABLE_NAME, COLUMN_NAME FROM ALL_TAB_COLUMNS
WHERE COLUMN_NAME LIKE '%PARAM%' AND OWNER='INDUSTRYPROD'
"""
r = reader.query(sql)
for row in r['rows']:
    print(f"  {row['TABLE_NAME']}.{row['COLUMN_NAME']}")
