# CLAUDE.md — pythonIot

## 项目名称
光储充微电网物联网平台（轻量版 / 学习版）

## 技术栈
- **语言**: Python 3.10+
- **后端框架**: FastAPI (异步) + uvicorn
- **协议适配**: pymodbus (Modbus RTU/TCP), 自研 IEC 104, opcua-asyncio (OPC UA)
- **时序存储**: TDengine 3.x (Python connector)
- **关系存储**: PostgreSQL 15+ (SQLAlchemy + asyncpg)
- **消息推送**: paho-mqtt (MQTT), httpx (HTTP)
- **前端**: HTML5 Canvas + Vanilla JS (2D 组态)
- **文档**: LaTeX (xelatex + ctex)
- **部署**: Docker + docker-compose

## 目录结构
```
pythonIot/
├── CLAUDE.md
├── requirements.txt
├── config.yaml                  # 主配置文件
├── .env.example
├── run.py                       # 启动入口
├── src/
│   ├── main.py                  # FastAPI 应用
│   ├── config.py                # 配置加载
│   ├── models/                  # 数据模型 (SQLAlchemy)
│   │   ├── device.py
│   │   ├── point.py
│   │   └── alarm.py
│   ├── protocols/               # 协议适配器
│   │   ├── base.py              # 抽象基类
│   │   ├── modbus_rtu.py
│   │   ├── modbus_tcp.py
│   │   ├── iec104_client.py
│   │   └── opcua_client.py
│   ├── storage/                 # 存储层
│   │   ├── tdengine.py
│   │   └── postgres.py
│   ├── push/                    # 数据推送
│   │   ├── mqtt_pusher.py
│   │   └── http_pusher.py
│   ├── web/                     # Web 层
│   │   ├── api.py
│   │   ├── routes/
│   │   └── templates/
│   └── services/                # 核心服务
│       ├── collector.py         # 采集调度引擎
│       ├── alarm_engine.py      # 告警引擎
│       └── push_engine.py       # 推送引擎
├── frontend/                    # 2D 组态前端
│   ├── index.html
│   └── static/
├── scripts/
│   ├── init_db.sh
│   ├── docker-compose.yml
│   └── deploy.sh
├── docs/
│   ├── requirements.md
│   ├── tech-proposal.tex
│   └── pricing.tex
└── tests/
```

## 启动
```bash
# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python scripts/init_db.py

# 启动平台
python run.py
# 或
uvicorn src.main:app --host 0.0.0.0 --port 8000

# Docker 部署
cd scripts && docker-compose up -d
```

## 关键入口
- API 文档: http://localhost:8000/docs
- 2D 组态: http://localhost:8000/scada
- 管理后台: http://localhost:8000/admin

## 默认技能
- 文档: /latex-writer
- 前端: /vue-patterns
- 后端: /backend-patterns
- 画图: /diagram-tools

## 项目配置
- 版本号: V1.0
- 文档路径: docs/
- Python 版本: ≥ 3.10
