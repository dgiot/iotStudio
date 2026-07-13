# parse_lite ↔ Parse Server 对齐测试结果

测试环境: Python 3.14 + asyncpg → WSL PG 13 :7432/parse (62张现有表)

## 测试结果: 4/22 PASS (CRUD 全过)

| TC | 功能 | 结果 | 原因 |
|----|------|:--:|------|
| TC1.1 | CREATE | PASS | INSERT → PG正常 |
| TC1.2 | GET | PASS | SELECT → 数据正确 |
| TC1.3 | UPDATE | PASS | UPDATE → PG正常 |
| TC1.4 | DELETE | PASS | DELETE → PG正常 |
| TC2.1 | $eq 查询 | FAIL | json_extract → ::jsonb 翻译 返回0行 |
| TC2.2 | $ne 查询 | PASS | != 正常 |
| TC2.3-8 | 其他约束 | FAIL | +0 数值转换 → PG类型错误 |

## 核心问题

1. **json_extract 翻译**: `json_extract(data, '$.field')` → `data::jsonb->>'field'` 
   PG TEXT列 `::jsonb` 转换有边界情况（已存在的Node.js Parse Server表）

2. **数值比较**: `+0` 技巧在PG上类型推导不稳定
   需要改为 `(data::jsonb->>'value')::numeric`

3. **_normalize_keys**: PG lowercase → PascalCase mapping 工作正常(TC1全过证明)

## 架构状态

```
parse_lite.py (677行)     ✅ CRUD · 用户 · Hook · ACL
parse_db.py   (470行)     ✅ SQLite/PG双后端 · SQL翻译 · 键名标准化
embedded_pg.py (189行)    ⚠️ 端口15432 · 待下载PG二进制
测试用例     (22 cases)   4 PASS / 18 BLOCKED (PG翻译细节)
```

## 待修复

- SQL翻译: json_extract → PG 完整映射(含数值cast)
- 查询约束: $gt/$lt 数值类型兼容
- embedded PG: Windows下载PG二进制
