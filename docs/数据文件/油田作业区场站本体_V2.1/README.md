# 油田作业区场站 DLAS 本体

> 大庆采油厂 IO 服务器与作业区 — 全量本体系统
> 版本 V2.1 · 2026-07-21

---

## 项目结构

```
├── README.md                          ← 本文件
├── VERSION.md                         ← 版本记录
│
├── 📊 原始数据 ————————————————————
│   ├── 实体清单.xlsx                  38 条实体 (DLAS 四层分类)
│   ├── 关系矩阵.xlsx                  14 条关系 (源→目标+协议)
│   ├── 约束规则库.xlsx                18 条约束 (阈值+严重度+动作)
│   ├── pSpace_tags.csv               16,663 标签 (1032口井 × 36测点)
│   ├── 作业区IO服务器全貌.md           网络拓扑 + 物理布局 + 凭证
│   └── IO服务器采集规律与品性分析.md    采集节拍 + 资源边界 + 冲突分析
│
├── 🏗️ 本体核心 ————————————————————
│   ├── oilfield_ontology.json        完整 DLAS 四层本体 (Data/Logic/Action/Security)
│   ├── force_graph_data.json         力导图数据 (66节点 + 68连线)
│   ├── excel_entities.json           实体清单 Excel → JSON
│   ├── excel_relations.json          关系矩阵 Excel → JSON
│   ├── excel_constraints.json        约束规则 Excel → JSON
│   └── ontology_report.md            本体完整性审核报告
│
├── 🖥️ 全栈应用 ————————————————————
│   └── ontology-app/
│       ├── backend/                   FastAPI 后端 (18 个 API)
│       │   └── app.py
│       └── frontend/                  Vue3 + Vite + Element Plus
│           └── src/
│               ├── views/             7 个页面
│               │   ├── Dashboard.vue  仪表盘
│               │   ├── ForceGraph.vue 力导图
│               │   ├── Entities.vue   实体清单
│               │   ├── Relations.vue  关系矩阵
│               │   ├── Constraints.vue 约束规则
│               │   ├── Tags.vue       标签数据
│               │   └── Report.vue     审核报告
│               ├── router/           路由配置
│               ├── api/              API 封装
│               └── components/       布局组件
│
├── 🔧 工具脚本 ————————————————————
│   ├── build_ontology.py             从文档+CSV 构建本体 JSON
│   ├── build_force_html.py           生成力导图 HTML (单文件版)
│   └── read_excel.py                 读取 Excel → JSON
│
└── 📄 技术文档 ————————————————————
    └── 技术报告/ + 技术方案/          LaTeX/PDF 原始报告
```

---

## 快速启动

### 1. 启动后端

```bash
cd ontology-app
pip install fastapi uvicorn pydantic
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8766
```

### 2. 启动前端

```bash
cd ontology-app/frontend
npm install
npm run dev
```

### 3. 打开浏览器

```
http://localhost:5173
```

---

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /api/health` | 健康检查 |
| `GET /api/ontology/full` | 完整 DLAS 本体 |
| `GET /api/ontology/stats` | 统计摘要 |
| `GET /api/entities` | 实体清单(合并) |
| `GET /api/relations` | 关系矩阵 |
| `GET /api/constraints` | 约束规则 |
| `GET /api/tags/stats` | 标签统计 |
| `GET /api/tags/point-types` | 测点类型(36种) |
| `GET /api/tags/wells` | 井号列表 |
| `GET /api/tags/query` | 标签查询 |
| `GET /api/graph/data` | 力导图数据 |
| `GET /api/report` | 审核报告 |

---

## 数据规模

| 维度 | 数量 |
|------|------|
| Data 实体 | 59 |
| Logic 实体 | 9 |
| Action 实体 | 6 |
| Security 实体 | 4 |
| 关系 | 14 |
| 约束规则 | 18 |
| 标签总数 | 16,663 |
| 井数 | 1,032 |
| 测点类型 | 36 |
| 计量间 | 9 |
| 力导图节点 | 66 |
| 力导图连线 | 68 |

---

## DLAS 四层框架

```
Data    → 物理世界: 场站/服务器/设备/进程/协议/配置
Logic   → 推理决策: 采集节拍/五级校验/ChangeData公式/资源边界
Action  → 执行闭环: Modbus·OPC DA·A11 三链路 + IPC + 自动恢复
Security → 安全合规: 访问控制/生产红线/下发边界/等保2.0
```
