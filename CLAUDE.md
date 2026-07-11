# CLAUDE.md — dgiot_lite

## 项目定位
**dgiot_lite** 是 [DG-IoT](https://github.com/dgiot/dgiot) 开源物联网平台的 **Python 轻量联动版本**，由迪格(杭州)物联科技有限公司维护。

- **DG-IoT**：Erlang/OTP 全功能企业级平台（千万级承载、全协议、低代码组态）
- **dgiot_lite**：Python 轻量版本（学习入门、边缘采集、快速原型、源码交付）

两者定位互补，dgiot_lite 采集的数据可推送至 DG-IoT 主平台。

## 技术栈
- **语言**: Python 3.10+
- **后端框架**: FastAPI (异步) + uvicorn
- **协议适配**: pymodbus (Modbus RTU/TCP), 自研 IEC 104, asyncua (OPC UA), **A11 (中石油私有协议)**
- **时序存储**: TDengine 3.x / SQLite 降级
- **关系存储**: PostgreSQL 15+ / SQLite 降级 (SQLAlchemy + asyncpg)
- **消息推送**: paho-mqtt (MQTT), httpx (HTTP)
- **前端**: Vue3 + Vite + Element Plus (管理后台)
- **文档**: LaTeX (xelatex + ctex)
- **部署**: Docker + docker-compose / 裸机 Python

## 与 DG-IoT 的关系

```
DG-IoT (Erlang, 企业级)          dgiot_lite (Python, 轻量级)
┌─────────────────────┐          ┌──────────────────────┐
│  全协议 全功能       │  数据推送 │  4协议采集引擎         │
│  千万级设备承载      │ ←────── │  2D组态               │
│  低代码组态          │  MQTT   │  TDengine + PG        │
│  规则引擎 + BI       │         │  源码交付给客户         │
└─────────────────────┘          └──────────────────────┘
```

## 目录结构
```
dgiot_lite/
├── CLAUDE.md
├── requirements.txt
├── config.yaml
├── run.py                       # 启动入口
├── start_platform.bat           # Windows 一键启动
├── start_simulators.bat         # 模拟器一键启动
├── src/
│   ├── main.py                  # FastAPI 应用
│   ├── config.py
│   ├── models/device.py         # 数据模型
│   ├── protocols/               # 4协议适配器
│   ├── storage/                 # TDengine + PG
│   ├── push/                    # MQTT + HTTP 推送
│   ├── services/                # 采集/告警/推送引擎
│   └── web/                     # API 路由
├── frontend-vue/                # Vue3 管理后台
├── simulators/                  # 4协议模拟器
├── scripts/                     # Docker + 数据库初始化
├── docs/                        # 技术方案 + 报价表
└── tests/                       # 集成测试
```

## 启动
```bash
# Windows 双击
start_platform.bat          → http://localhost:8000
start_simulators.bat        → 启动全部模拟器

# 命令行
python run.py               → 启动平台
python simulators/run_all.py → 启动模拟器
```

## 生产网规则

> 详见: [[production-host-rules]]

| 机器 | IP | 角色 | 约束 |
|------|-----|------|------|
| 主站 | 11.66.12.131 | pSpace 管理 (WinRM :5985) | 只读抓包/查进程，禁止安装/重启/停服 |
| IO 服务器 | 11.66.12.130 | A11 :8889 | 被动查询，禁止直连写入 |

## 默认技能
- 文档: /latex-writer
- 前端: /vue-patterns
- 研究: /deep-research
- 画图: /diagram-tools
