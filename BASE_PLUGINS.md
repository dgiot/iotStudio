# IOT 底座插件（plugins-base 合并）

本目录记录了从 `plugins-base`（IOT 底座通用插件仓）**合并**进 iotStudio 的内容与映射，合并形式为**按能力归位**，源内容不丢失。

## 合并映射

| 源文件（plugins-base） | 合并落点（iotStudio） | 说明 |
|---|---|---|
| `vue-shell/Shell.vue` | `frontend-vue/src/components/ShellDark/index.vue` | 深色布局模板（可选，自动注册但不上路由；主布局为 AppLayout） |
| `vue-shell/basePlugins.js` | `frontend-vue/src/plugins/base-plugin.js` | 双类插件改写为 iotStudio 插件注册格式（与 7 插件同构） |
| `vue-shell/icons.js` | `frontend-vue/src/assets/base-icons.js` | 图标集 |
| `vue-shell/CloseLoop.vue` | `frontend-vue/src/components/CloseLoop/index.vue` | 闭环控制组件（自动注册） |
| `vue-shell/iot/DeviceView.vue` 等 3 件 | `frontend-vue/src/views/iot/` | 轻量契约视图（`/api/iot/*`，与 Parse 版视图互补共存） |
| `plugins/ontology-graph/ontology_view.html` | `frontend-vue/public/ontology_graph.html` | ECharts Force 图（与 `ontology.html` DLAS 树形互补），入口 `/ontology-graph`；echarts 用本地 `public/vendor/echarts.min.js`（离网可运行，不走 CDN） |
| `plugins/ontology-graph/ontology_server.py` | `scripts/ontology_server.py` | 部署脚本 — 图数据独立服务（回环 48765，`ONTOLOGY_GRAPH` 环境变量可配数据路径），与 `audit_ontology.py` 等同目录 |
| `plugins/dsh-tools/dsh-mobile-check.cjs` | `scripts/dsh-mobile-check.cjs` | 部署脚本 — 移动端验收（凭据走 `DSH_AUTH_USER/PASS` 环境变量） |
| `README.md` | `docs/plugins-base.md` | 本文件 |

## 接线点（本次合并已接）

1. **路由**：`frontend-vue/src/router/index.js` → `/iot/devices`、`/iot/products`、`/iot/channels`、`/ontology-graph`（组 `base`）
2. **菜单组**：`frontend-vue/src/utils/constants.js` → `MENU_GROUPS.base`（🧩 底座）
3. **url 型外链**：`frontend-vue/src/components/Sidebar/index.vue` → `meta.external` 项渲染为 `<a target="_blank">`（新窗口，不触发 el-menu 路由）
4. **API**：`frontend-vue/src/api/index.js` → `iotDevices/iotProducts/iotChannels`（`GET /api/iot/*`）

## 契约（tab 型三视图）

```
GET /api/iot/devices|products|channels → { total, items:[{id,code,name,type,model,protocol,status,online,location,last_active}] }
```

iotStudio 主视图走 Parse（Device/Product/Channel 类）；轻量契约视图供后端以标准接口接入的场景复用。

## 底座服务

| 服务 | 端口 | 说明 |
|---|---|---|
| `scripts/ontology_server.py` | 48765 | 本体图谱图数据（`GET /graph`）+ 视图 + 健康检查，仅 127.0.0.1 |

## 开发知识（源自 vue-shell/README.md，合并保留）

- **编译坑（Vue 3 编译提升）**：`v-if` 与 `v-for` 同元素会触发 Vue 3 编译提升 → `p.url` TypeError 白屏；必须用 `<template v-for>` 包裹提升写法（见 `views/iot/*.vue` 与 `Sidebar/index.vue` 外部菜单分支的写法）。
- **双类插件语义**（源自 basePlugins.js）：tab 型 = 工程内视图（`/api/iot/*` 契约，后端实现标准接口即可复用）；url 型 = 底座服务外链（`meta.external`，新窗口）。
- **服务端口纪律**：本体图谱服务用冷僻端口段（48765，dsh 家族 48757-48760 之后），新服务先扫描占用避免冲突。

## 来源说明

- 数据：本体图 `ontology_graph_v3.json` 为本地构建产物（不入库），`/ontology-graph` 视图内嵌示例数据（92 节点 / 59 边，qwen2.5:7b 全本地语义提取）
- 上库纪律：凭据永不入 git；本地构建脚本（build/governance）与内部工具不入库
