#!/usr/bin/env python3
"""测试 Oracle 连接并输出原始结果"""
import os, sys
sys.path.insert(0, r'D:\ai\dgiot_lite')
from oracle_reader import OracleReader

reader = OracleReader()

# 首先测试连通性
print("=== 连通性测试 ===")
r = reader.query("SELECT 'Hello' as msg, SYSDATE as dt FROM dual")
print(f"raw: {r}")
if r['rows']:
    print(f"OK: {r['rows'][0]}")

# 查表 - 用大写
print("\n=== 查 PROJECT_DEVICEPAR ===")
r = reader.query("SELECT count(*) as CNT FROM PROJECT_DEVICEPAR")
print(f"rows: {r['rows']}")

# 列出前5行
print("\n=== 前5行 ===")
r = reader.query("SELECT * FROM (SELECT * FROM PROJECT_DEVICEPAR) WHERE ROWNUM <= 5")
print(f"cols: {r['columns']}")
print(f"rows: {r['rows'][:2]}")
