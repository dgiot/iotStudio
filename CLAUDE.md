# CLAUDE.md — DGIOT IoT Studio

## 项目定位

DGIOT IoT Studio 是 DGIOT 平台的边缘侧应用框架——Python 采集引擎 + Vue 3 管理后台，负责设备接入、流式计算、边缘自治。

## 架构

```
边缘端 (Python)  →  MQTT/HTTP  →  DG-IoT 中枢 (Erlang)  →  Vue3 应用层
```

## 技术栈

- Python 3.10+ / FastAPI
- Vue 3 / Element Plus / ECharts
- SQLite 默认，可选 PostgreSQL + TDengine
- 协议: Modbus RTU/TCP, OPC UA/DA, MQTT, IEC 104

## 目录结构

```
src/            FastAPI 后端
frontend-vue/   Vue 3 管理后台
simulators/     协议模拟器
scripts/        工具脚本
tests/          测试用例
plugins/        插件体系
```

## 启动

```bash
pip install -r requirements.txt
python run.py    # http://localhost:8000
```

## 提交纪律

- 本目录为公开提交副本，禁止放入内部文档、客户数据、凭证
- 提交前运行 pre-push hook 敏感词扫描
- 内部开发在 D:\ai\，审查后复制到此处
