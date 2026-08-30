# Security Policy / 安全策略

## English Summary / 英文概要

**Dependency vulnerability status (2026-08-31): 45 alerts → 8 moderate. Critical: 0, High: 0.**

- Fixed via `package.json` overrides (11 packages forced to patched versions) + `fabric` 6 → 7 upgrade.
- The 8 remaining moderate findings are pinned by `amis@6.13.0` internals (echarts 5.5.1 / froala-editor 3.1.1 / markdown-it 12.3.2). Upgrading them to fixed majors risks breaking amis low-code rendering; revisit after an amis major upgrade.
- `xlsx` is overridden to the official SheetJS CDN tarball (0.20.3) — the npm registry release stops at 0.18.5 (ReDoS advisory).
- Recheck command: `npm audit --registry=https://registry.npmjs.org` (the default npmmirror mirror does not support the audit endpoint).
- Note: GitHub's alert count (6) differs from `npm audit` (8) due to dependency-path evaluation differences — SECURITY.md reflects the `npm audit` result.

**Credential policy / 凭据纪律**: credentials never enter this repository. Local build artifacts (`data/`, logs) and internal tooling are gitignored.

---

## 中文详情 / Chinese Details

## 依赖安全记录

### 2026-08-31 依赖漏洞治理（dependabot 45 → 8）

`frontend-vue` 依赖漏洞治理：**45 告警 → 8 moderate**（critical 0 / high 0）。

### 已修复（package.json overrides 强制安全版）

| 包 | 修复版 | 严重度 | 来源 |
|---|---|---|---|
| tar | 7.5.22 | critical | fabric → canvas → node-pre-gyp（安装期工具） |
| brace-expansion | 1.1.18 / 2.1.4 | high | exceljs → archiver → glob → minimatch |
| postcss | 8.5.26 | high | vite |
| nanoid | 3.3.18 | high | postcss |
| ip-address | 10.7.0 | high | mqtt → socks |
| linkify-it | 5.0.2 | high | amis-ui → markdown-it |
| path-to-regexp | 6.3.0 | high | amis-core（6.x 线修复版，保持兼容） |
| tinymce | 7.9.3 | high | amis-ui 富文本（7.x 线修复版） |
| qs | 6.16.0 | moderate | amis-core |
| uuid | 11.1.1 | moderate | exceljs |
| xlsx | 0.20.3（SheetJS 官方 CDN tarball） | high | amis（npm 版止步 0.18.5，官方推荐 CDN 分发） |

另：`fabric` 直接依赖 `^6.9.1` → `^7.4.0`（升级 major，ScadaView 仅用 6 个基础形状类，已构建验证兼容）。

### 保留（8 moderate，amis 6.13.0 内部锁死）

| 包 | 锁版 | 原因 | 建议 |
|---|---|---|---|
| echarts（amis 内） | 5.5.1（精确锁版） | amis 图表组件为 echarts 5 编写，override 6.x major 风险高 | 升级 amis 主版本后复查 |
| froala-editor | 3.1.1（^3.1.1） | amis 富文本编辑器组件，4.x major 不兼容风险 | 同上 |
| markdown-it | 12.3.2（^12） | amis Markdown 渲染组件 | 同上 |

### 备注

- SheetJS 官方说明：npm registry 上的 `xlsx` 停止在 0.18.5，后续版本（含安全修复）通过 `https://cdn.sheetjs.com/` 分发；override 指向官方 tarball（安装期需联网）。
- 依赖升级采用 overrides（不改 amis 语义）而非逐包升级，避免破坏 amis 低代码渲染。
- 新增依赖请运行 `npm audit --registry=https://registry.npmjs.org` 复查（默认镜像 npmmirror 不支持 audit 接口）。
