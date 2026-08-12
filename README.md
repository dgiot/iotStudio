# iotStudio — 物联网边缘应用框架

[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green)](https://fastapi.tiangolo.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-cyan)](https://vuejs.org)
[![SQLite](https://img.shields.io/badge/SQLite-零安装-orange)](https://sqlite.org)

> Python 轻量版本 | 边缘代理 | 协议采集 | 源码交付 | 支持联动 DG-IoT 主平台

---

## 架构定位

```
iotStudio (边缘)              DG-IoT (中枢)              iotStudio (应用)
Python · 轻量代理              Erlang · 高性能              Vue3 · 低代码
┌────────────────┐  MQTT/HTTP ┌──────────────────┐  REST  ┌──────────────┐
│ parse_lite      │ ─────────→ │ EMQX 汇聚         │ ←───── │ 12页管理后台  │
│ SQLite / PG     │ ←───────── │ Parse Server      │        │ 7插件架构     │
│ TDengine 时序   │            │ TDengine · 集群    │        │ 动态菜单      │
│ 协议·采集·解析  │            │ 规则·告警·本体    │        │ 2D组态·拓扑   │
└────────────────┘            └──────────────────┘        └──────────────┘
  <1000 设备/节点              >10万 设备汇聚                用户交互层
```

---

## 快速开始

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 启动平台 (SQLite 零安装, 无需 PG/TDengine)
python run.py
# → http://localhost:8000    管理后台
# → http://localhost:8000/docs   Swagger API

# 3. (可选) 初始化种子数据
python scripts/init_dgiot.py
```

---

## 核心特性

### 数据采集
| 协议 | 文件 | 说明 |
|------|------|------|
| Modbus TCP/RTU | `protocols/modbus_tcp.py` | 多从站轮询，寄存器扫描 |
| A11 (CNPC) | `protocols/a11.py` | 行业油气生产物联网 5a5a 帧 |
| OPC UA | pymodbus / asyncua | 订阅 + 轮询 |
| OPC DA | DCOM 识别 | RSLinx 协议可识 |
| IEC 104 | `protocols/` | 电力远动规约 |

### 数据存储
| 方案 | 用途 | 安装 |
|------|------|------|
| SQLite | 默认 (零安装) | 内置 |
| PostgreSQL | 生产环境多租户 | 可选 |
| TDengine 3.x | 时序数据 | 可选, 无则降级 SQLite |

### Parse-lite (Parse Server Python 兼容层)
| 功能 | 说明 |
|------|------|
| CRUD | `POST/GET/PUT/DELETE /classes/{ClassName}` |
| 查询 | `$ne $lt $gt $in $nin $exists $regex $or $and` |
| 用户 | signup / login / logout / session |
| 角色 | `_Role` 创建, 层级, 用户关联 |
| ACL | 对象级 `{user/role}:{read/write}` |
| CLP | 类级 find/get/create/update/delete |
| 批量 | `POST /batch` (max 50) |
| Hooks | beforeSave / afterSave / beforeDelete / afterDelete |

### 多租户
| 功能 | 文件 |
|------|------|
| 租户 CRUD | `web/tenant_api.py` |
| 角色层级 | `tenants.parent_id` (对齐 DG-IoT `_Role.roles`) |
| 用户-租户关联 | `user_roles` 表 |
| 请求隔离 | `X-Tenant-ID` header + JWT |

### 本体引擎
```
Site (工业站点) → Gateway (IO网关) → Device (RTU/站点) → Point (测点)
                                                    ↓
                        MQTT: dgiot/{site}/{gateway}/{device}/{point}/data
```
`ontology.py` — 四层模型 + `sync_to_parse()` 自动创建 Parse Device 对象。

---

## 管理后台 (12 页 7 组)

```
📊 监控     仪表盘 (KPI+趋势+告警等级+日志)
🔌 设备     设备管理 · 产品管理 (TSL分区+导入导出)
🗺️ 组态     组态视图 (设备拓扑+流程组态 tabs 联调)
📡 数据     数据分析 · 告警管理 · 流计算引擎 · 预测性维护
🔧 网络     报文解析 · 通道管理 · 边缘代理
🛠️ 工具     MQTT调试 · 模拟器管理
⚙️ 系统     系统概览 · 运维管理 · 用户管理
```

### 插件架构
```js
// manifest.js — 部署时按需启用
hub:     false,  // 不需要边缘中枢联调 → Vite tree-shake 自动裁掉
network: true,   // 需要报文解析
```

6 个厂商通道插件：🛢 油液监测 · 🔥 锅炉能效 · 📊 声振温 · 🔩 智能螺栓 · 📷 视频监控 · ⛽ TDLAS 气体检测

---

## 项目结构

```
iotStudio/
├── run.py                    # 启动入口
├── config.yaml               # TDengine/MQTT/Parse 配置
├── src/
│   ├── main.py               # FastAPI 应用
│   ├── parse_lite.py         # Parse Server Python 兼容层
│   ├── ontology.py           # 4层本体引擎
│   ├── auth.py               # JWT + 多租户中间件
│   ├── protocols/            # Modbus/A11/OPC/IEC104/vendor_a
│   ├── storage/tdengine.py   # TDengine + SQLite 降级
│   ├── models/               # dgiot_schema + device ORM
│   ├── services/             # collector · phm · safety_rules
│   └── web/                  # tenant_api
├── frontend-vue/
│   └── src/
│       ├── plugins/          # 7插件 (manifest tree-shaking)
│       ├── views/            # 12页 Vue3 SFC
│       └── components/       # ChannelCard · NotifyBell · RunningCards
├── scripts/                  # 初始化 · 种子数据
├── simulators/               # 协议模拟器
└── tests/                    # 集成测试
```

---

## 配置

`config.yaml`:

```yaml
# 存储 (无则降级 SQLite)
tdengine:
  host: "192.168.10.167"       # 远端 TDengine (可选)
  port: 6041

# Parse-lite 嵌入式
parse:
  db_path: "./data/parse.db"   # SQLite 单机版

# 多租户
storage_mode: "sqlite"         # sqlite | postgres
```

---

## API

| 端点 | 说明 |
|------|------|
| `GET /api/health` | 健康检查 |
| `GET/POST /api/devices` | 设备管理 (DG-IoT Device) |
| `GET/POST /api/tenants` | 租户管理 (DG-IoT _Role) |
| `POST /api/roleuser` | 用户-角色分配 |
| `GET /api/alarms` | 告警列表 |
| `GET /api/telemetry/{device_id}/{point_id}` | 时序查询 |
| `GET /api/stats` | 采集统计 |
| `WS /ws` | WebSocket 实时推送 |

---

## 与 DG-IoT 联动

iotStudio 采集数据通过 MQTT 推送至 DG-IoT 主平台：

```
iotStudio  ──MQTT──→  EMQX (:1883)  ──→  Parse Server  ──→  TDengine
  边缘代理              中枢汇聚             存储引擎           时序引擎
```

数据格式对齐 DG-IoT 物模型标准，实现边缘采集 → 中心汇聚的全链路。

---

## 维护

DGIOT LLC (Dallas, TX) — [DG-IoT 主平台](https://github.com/dgiot/dgiot)
