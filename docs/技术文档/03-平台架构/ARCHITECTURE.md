# DG-IoT 统一部署架构

## 原则：一套代码，两种部署，三个环境共享

```
                     ┌─ 前端 (Vue3) ─────────────────────┐
                     │  D:\ai\dgiot_lite\frontend-vue\    │
                     │  vite build → dist/                │
                     └──────────────┬─────────────────────┘
                                    │ 共用
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
    边缘中枢 (Linux)          边缘代理 (Windows)        开发 (Windows)
    Kylin-DMZ                iotStudio                 localhost
              │                     │                     │
    ┌─────────┴─────────┐  ┌────────┴────────┐  ┌────────┴────────┐
    │ 生产部署           │  │ 轻量部署         │  │ 开发调试         │
    │                    │  │                  │  │                  │
    │ Nginx :80          │  │ Vite :5173       │  │ Vite :5173       │
    │   → dist/ (静态)   │  │   → dist/ (build) │  │   → src/ (HMR)   │
    │   → Python :8000   │  │   → Python :8000 │  │   → Python :8000 │
    │                    │  │                  │  │                  │
    │ parse_lite.py      │  │ parse_lite.py    │  │ parse_lite.py    │
    │   → PG :7432       │  │   → SQLite       │  │   → SQLite       │
    │                    │  │                  │  │                  │
    │ EMQX :1883         │  │ Mini MQTT :21883 │  │ Mini MQTT :21883 │
    │ TDengine :6041     │  │ (连中枢 EMQX)    │  │ (连中枢 EMQX)    │
    └────────────────────┘  └──────────────────┘  └──────────────────┘
```

## 共用清单

| 组件 | 路径 | 边缘中枢 | 边缘代理 | 共用率 |
|------|------|:---:|:---:|:---:|
| 前端 Vue3 | `frontend-vue/` | ✅ | ✅ | **100%** |
| FastAPI | `src/main.py` | ✅ | ✅ | **100%** |
| parse_lite | `src/parse_lite.py` | ✅ | ✅ | **100%** |
| parse_db | `src/parse_db.py` | ✅ PG | ✅ SQLite | **同一接口** |
| 通道系统 | `src/channel_registry.py` | ✅ | ✅ | **100%** |
| 认证 | `src/auth.py` | ✅ | ✅ | **100%** |
| 设备/告警/遥测 | `src/main.py` 路由 | ✅ | ✅ | **100%** |

## 部署差异（仅 config.yaml + 环境变量）

```yaml
# 边缘中枢 (Linux)
parse_db: postgres           # PG 系统服务
mqtt_broker: external        # 用 EMQX
builtin_mqtt: false          # 不启内置

# 边缘代理 (Windows)
parse_db: sqlite             # 嵌入式 DB
mqtt_broker: external        # 连中枢 EMQX
builtin_mqtt: true           # 启内置 :21883
```

## Parse Server 替换路径

```
之前:  Node.js Parse Server → PostgreSQL
现在:  parse_lite.py → parse_db (PG | SQLite)

边缘中枢: parse_lite + PG (替换 dgiot-parse 服务)
边缘代理: parse_lite + SQLite (独立运行)
```

## 下一步

1. ✅ parse_db.py — DB 抽象层完成
2. ⬜ parse_lite.py → 改用 parse_db 接口
3. ⬜ Linux 验证: PARSE_DB=postgres 启动
4. ⬜ Windows 验证: PARSE_DB=sqlite 启动
5. ⬜ 前端 dist/ → Nginx 共用
