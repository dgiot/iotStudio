# dgiot_lite

> DG-IoT 开源物联网平台 Python 轻量联动版本 | 独立运行 | 源码交付

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-cyan?logo=vue.js)](https://vuejs.org)
[![License](https://img.shields.io/badge/License-Apache_2.0-orange)](LICENSE)

---

## 定位

| 特性 | dgiot_lite | DG-IoT 主平台 |
|------|-----------|-------------|
| 语言 | Python 3.10+ | Erlang/OTP |
| 定位 | 轻量学习版 / 边缘采集 | 企业级全功能 |
| 协议 | Modbus RTU/TCP, IEC 104, OPC UA | 全协议（含GB28181视频等） |
| 设备量 | ≤ 500 台 | 千万级 |
| 部署 | 单机 Python / Docker | 集群 |
| 联动 | 可推送至 DG-IoT 主平台 | 接收 dgiot_lite 数据 |

**独立完整可用 → 可选联动 DG-IoT。**

---

## 快速开始

### 方式一：双击启动（Windows）

```
双击 start_platform.bat      → 启动物联网平台
双击 start_simulators.bat    → 启动4协议模拟器
```

打开浏览器：**http://localhost:8000**

### 方式二：命令行

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 初始化数据库（可选，首次运行自动创建）
python scripts/init_db.py

# 3. 启动平台
python run.py

# 4. 另开终端，启动模拟器（可选）
python simulators/run_all.py
```

### 方式三：Docker

```bash
cd scripts
docker-compose up -d
# 启动: IoT平台 + PostgreSQL + TDengine + EMQX
```

---

## 功能

### 数据采集
| 协议 | 实现 | 说明 |
|------|------|------|
| Modbus RTU | pymodbus RS-485 | 串口轮询，多从站 |
| Modbus TCP | pymodbus TCP | 以太网并发 |
| IEC 60870-5-104 | 自研客户端 | 总召 + 变化传输 |
| OPC UA | asyncua Client | 订阅 + 轮询 |

### 数据存储
| 数据库 | 用途 | License |
|--------|------|---------|
| TDengine 3.x | 时序遥测数据 | AGPL v3 |
| PostgreSQL 15+ | 设备档案/配置/告警 | PostgreSQL License |
| SQLite | 降级模式（零依赖） | Public Domain |

### 管理后台 (Vue3 + Element Plus)
| 页面 | 功能 |
|------|------|
| 仪表盘 | 实时KPI + 采集日志 + WebSocket 实时推送 |
| 设备管理 | 设备CRUD、通讯参数、协议选择 |
| 设备详情 | 点位配置、最新遥测数据 |
| 告警管理 | 阈值/变化率/离线告警，三级P0-P2，确认/清除 |
| 数据查询 | 时序数据按时间范围查询 |

### 数据推送
| 目标 | 协议 | 说明 |
|------|------|------|
| MQTT Broker | MQTT 3.1.1 | 自定义Topic，QoS 0/1 |
| HTTP Server | HTTP POST | JSON Body，Bearer Token |
| **DG-IoT 主平台** | MQTT（物模型格式） | 可选联动 |

---

## 项目结构

```
dgiot_lite/
├── run.py                    # 启动入口
├── start_platform.bat        # Windows 启动脚本
├── start_simulators.bat      # 模拟器启动脚本
├── config.yaml               # 主配置
├── requirements.txt          # Python 依赖
│
├── src/                      # 后端源码
│   ├── main.py               # FastAPI (REST + WebSocket)
│   ├── protocols/            # 4协议适配器
│   ├── storage/              # TDengine + PostgreSQL
│   ├── services/             # 采集/告警/推送 引擎
│   └── push/                 # MQTT/HTTP/DG-IoT 推送器
│
├── frontend-vue/             # Vue3 管理后台
│   └── src/views/            # 仪表盘/设备/告警/数据查询
│
├── simulators/               # 协议模拟器
│   ├── modbus_tcp_server.py  # 逆变器+PCS+充电桩
│   ├── iec104_server.py      # IEC 104 从站
│   ├── opcua_server.py       # OPC UA Server
│   └── run_all.py            # 一键启动全部
│
├── docs/                     # 文档
│   ├── requirements.md       # 需求规格说明书
│   ├── tech-proposal.pdf     # 技术方案 (10页)
│   └── pricing.pdf           # 报价表 (5页，脱敏)
│
├── scripts/                  # 部署
│   ├── docker-compose.yml    # 一键部署4容器
│   └── init_db.py            # 数据库初始化
│
└── tests/                    # 测试
    └── test_integration.py   # 端到端集成测试
```

---

## API 文档

启动后访问：**http://localhost:8000/docs** (Swagger UI)

| 端点 | 说明 |
|------|------|
| `GET /api/health` | 健康检查 |
| `GET/POST /api/devices` | 设备管理 |
| `GET /api/devices/{id}` | 设备详情 |
| `GET/POST /api/devices/{id}/points` | 点位配置 |
| `GET /api/alarms` | 告警列表 |
| `POST /api/alarms/{id}/confirm` | 告警确认 |
| `POST /api/alarms/{id}/clear` | 告警清除 |
| `GET /api/telemetry/{device_id}/{point_id}` | 时序数据查询 |
| `GET /api/telemetry/{device_id}/latest` | 设备最新数据 |
| `GET /api/stats` | 采集统计 |
| `POST /api/push-targets` | 添加推送目标 |
| `WS /ws` | WebSocket 实时数据 |

---

## 配置

编辑 `config.yaml`：

```yaml
db:           # PostgreSQL (无则自动降级 SQLite)
  host: 127.0.0.1
  port: 5432
tdengine:     # TDengine (无则自动降级 SQLite)
  host: 127.0.0.1
  port: 6030
mqtt:         # MQTT Broker (推送用)
  host: 127.0.0.1
  port: 1883
```

---

## 与 DG-IoT 联动

```json
// 在管理后台添加推送目标，类型选 dgiot
{
  "target_type": "dgiot",
  "config": {
    "host": "dgiot-server",
    "port": 1883,
    "username": "dgiot_admin",
    "topic": "dgiot/device/telemetry",
    "product_id": "pcs_monitor"
  }
}
```

配置后 dgiot_lite 采集数据自动推送至 DG-IoT 主平台。

---

## 维护

迪格(杭州)物联科技有限公司

- Git: `git@git.iotn2n.com:dgiot/dgiot_lite.git`
- DG-IoT 主平台: https://github.com/dgiot/dgiot
