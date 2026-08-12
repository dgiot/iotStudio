# CLAUDE.md — dgiot_lite

## 项目定位
**dgiot_lite** 是 [DG-IoT](https://github.com/dgiot/dgiot) 开源物联网平台的 **Python 轻量联动版本**，由DGIOT LLC (Dallas, TX)维护。

- **DG-IoT**：Erlang/OTP 全功能企业级平台（千万级承载、全协议、低代码组态）
- **dgiot_lite**：Python 轻量版本（学习入门、边缘采集、快速原型、源码交付）

两者定位互补，dgiot_lite 采集的数据可推送至 DG-IoT 主平台。

## 架构原则

### 底座 vs 项目分离
- **`dgiot_lite/`** = 公共底座，只放平台核心代码
- 底座按**插件点**组织（每个协议/模块是独立插件）
- 项目文档/投标材料归入 `D:\svn_work\项目投标\` 跟踪
- 项目专用测试脚本归入对应项目的 `04-模拟环境/`

### 项目结构规范 (对标OIL_FIELD时序数据)
```
D:\svn_work\项目投标\<项目名>\
├── 01-生产环境\      # 现场配置/拓扑/IP
├── 02-数据字典\      # 点表/SN码/实体清单
├── 03-协议文档\      # 协议规范/转发表
├── 04-模拟环境\      # 模拟器/测试脚本
├── 06-采集工具\      # 采集脚本
├── 07-本体知识库\    # 物模型/本体
└── 08-申报材料\      # 合同/方案/交付
```

### 工作约定
- 底座只改协议适配器/存储引擎/API路由 — 不改项目材料
- 项目材料走 SVN 投标体系跟踪 — 不改底座代码
- 新项目在 `D:\svn_work\项目投标\` 建目录，按 01~08 结构组织

## 技术栈
- **语言**: Python 3.10+
- **后端框架**: FastAPI (异步) + uvicorn
- **协议适配**: pymodbus (Modbus RTU/TCP), 自研 IEC 104, asyncua (OPC UA), **A11 (行业私有协议)**
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
| 主站 | 192.168.10.131 | RTDB 管理 (WinRM :5985) | 只读抓包/查进程，禁止安装/重启/停服 |
| IO 服务器 | 192.168.10.130 | A11 :8889 | 被动查询，禁止直连写入 |

## 默认技能
- 文档: /latex-writer
- 前端: /vue-patterns
- 研究: /deep-research
- 画图: /diagram-tools
