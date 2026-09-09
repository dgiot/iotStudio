# CLAUDE.md — DGIOT IoT Studio

This file provides guidance to AI coding agents (Claude Code / DSH / CodeBuddy) when working with code in this repository.

## 项目定位

DG-IoT 平台的边缘侧应用框架——Python 采集引擎 + Vue 3 管理后台。一句话：把协议异构的现场设备，经统一采集管道推送到 DG-IoT 中枢（Erlang/EMQX）。

**核心哲学（六步 FDE 工作流的边缘映射）**：
设备建模 → 点表映射 → 协议采集 → 流式计算 → 推送中枢 → 仪表呈现。

## 架构

```
边缘端 (Python)  →  MQTT/HTTP  →  DG-IoT 中枢 (Erlang)  →  Vue3 应用层
```

## 技术栈

- Python 3.10+ / FastAPI
- Vue 3 / Element Plus / ECharts
- SQLite 默认，可选 PostgreSQL + TDengine
- 协议: Modbus RTU/TCP, OPC UA/DA, MQTT, IEC 104

## 构建与运行

```bash
pip install -r requirements.txt    # 依赖
python run.py                      # 后端 http://localhost:8000
cd frontend-vue && npm run dev     # 前端开发服
python scripts/init_dgiot.py       # 初始化 dgiot_schema
```

**禁忌（Do NOT）**：
- 禁止把内部文档、客户数据、凭证写入本仓库（本目录是公开提交副本）
- MQTT 主题必须走规范：`dgiot/{site}/{gateway}/{device}/{point}/data`，不得自造变体
- 涉及 WSL/中枢环境的脚本只经 `scripts/` 下的脚本文件执行（UTF-8 无 BOM、纯 ASCII 注释），不写内联引号
- 模拟器端口不得与已有服务冲突（本机已占：TDengine 6030/6041、PG 7432、MQTT 18883）

## 测试

```bash
pytest tests/ -x -q               # 全量
pytest tests/ -k mqtt -x -q       # 按关键字
python scripts/hub_smoke.py       # 中枢回环冒烟（需中枢 1883 可达）
```

## 热工作流（主开发循环）

1. 改 `src/` 采集/模型层 → `run.py` 重载
2. `simulators/` 起协议模拟器 → 观察推送日志
3. `pytest -k <module>` 定点验证 → 一个"继续"= 一个已提交里程碑（文档三线同步）

## 技能（skills/）

- `skills/edge-onboarding` — 设备接入 → 物模型映射 → 推送验证方法论
  触发词：接入设备 / 新增协议 / 点表映射 / 采集配置 / 推送验证

## 目录结构

```
src/            FastAPI 后端
frontend-vue/   Vue 3 管理后台
simulators/     协议模拟器
scripts/        工具脚本（init_dgiot / hub_smoke / deploy_hub）
tests/          测试用例
plugins/        插件体系
skills/         AI 协作方法论（对齐 dgaiot 仓库模式）
```

## 中枢联动

中枢（hub）侧一键部署：`scripts/deploy_hub.sh`（openEuler/Kylin，开源精简版，只装必要）。
数据链路教义：海量设备 ──MQTT──▶ DG-IoT 中枢 ──`dgiot/#` 订阅──▶ 边缘。

## 提交纪律

- 本目录为公开提交副本，禁止放入内部文档、客户数据、凭证
- 提交前运行 pre-push hook 敏感词扫描
- 内部开发在 D:\ai\，审查后复制到此处
