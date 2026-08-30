# IOT Base Plugins (merged from plugins-base)

This document records what was **merged** from `plugins-base` (the shared IOT base plugin repo) into iotStudio, and where each piece landed. The merge follows **capability-based placement** — no source content is lost.

## Merge Map

| Source (plugins-base) | Landing (iotStudio) | Notes |
|---|---|---|
| `vue-shell/Shell.vue` | `frontend-vue/src/components/ShellDark/index.vue` | Dark layout template (optional; auto-registered but not routed — main layout is AppLayout) |
| `vue-shell/basePlugins.js` | `frontend-vue/src/plugins/base-plugin.js` | Dual-type plugins rewritten to iotStudio plugin registration format (same shape as the 7 plugins) |
| `vue-shell/icons.js` | `frontend-vue/src/assets/base-icons.js` | Icon set |
| `vue-shell/CloseLoop.vue` | `frontend-vue/src/components/CloseLoop/index.vue` | Closed-loop control component (auto-registered) |
| `vue-shell/iot/DeviceView.vue` etc. ×3 | `frontend-vue/src/views/iot/` | Lightweight contract views (`/api/iot/*`, coexist with the Parse-backed views) |
| `plugins/ontology-graph/ontology_view.html` | `frontend-vue/public/ontology_graph.html` | ECharts force graph (complements the `ontology.html` DLAS tree), entry `/ontology-graph`; echarts served from local `public/vendor/echarts.min.js` (offline-capable, no CDN) |
| `plugins/ontology-graph/ontology_server.py` | `scripts/ontology_server.py` | Deployment script — graph data standalone service (loopback 48765, `ONTOLOGY_GRAPH` env overrides data path), alongside `audit_ontology.py` etc. |
| `plugins/dsh-tools/dsh-mobile-check.cjs` | `scripts/dsh-mobile-check.cjs` | Deployment script — mobile acceptance check (credentials via `DSH_AUTH_USER/PASS` env vars) |
| `README.md` | `BASE_PLUGINS.md` (repo root; `docs/` is gitignored) | This document |

## Wiring (already connected by this merge)

1. **Routes**: `frontend-vue/src/router/index.js` → `/iot/devices`, `/iot/products`, `/iot/channels`, `/ontology-graph` (group `base`)
2. **Menu group**: `frontend-vue/src/utils/constants.js` → `MENU_GROUPS.base` (🧩 Base)
3. **URL-type external links**: `frontend-vue/src/components/Sidebar/index.vue` → `meta.external` items render as `<a target="_blank">` (new window, bypasses el-menu routing)
4. **API**: `frontend-vue/src/api/index.js` → `iotDevices/iotProducts/iotChannels` (`GET /api/iot/*`)

## Contract (tab-type three views)

```
GET /api/iot/devices|products|channels → { total, items:[{id,code,name,type,model,protocol,status,online,location,last_active}] }
```

**Backend implementation included** (`src/web/iot_contract.py`, commit a1fce9fd): `devices`/`products` read the parse.db tables (Device/Product), `channels` reads ChannelManager snapshots; third-party backends may reuse the views by implementing the same standard contract.

## Base Services

| Service | Port | Notes |
|---|---|---|
| `scripts/ontology_server.py` | 48765 | Ontology graph data (`GET /graph`) + view + health check, loopback 127.0.0.1 only; view falls back to `frontend-vue/public/ontology_graph.html` (same source) when absent |

## Dev Notes (preserved from vue-shell/README.md)

- **Compilation pitfall (Vue 3 hoisting)**: `v-if` and `v-for` on the same element trigger Vue 3 compile hoisting → `p.url` TypeError white screen; wrap with `<template v-for>` instead (see `views/iot/*.vue` and the external-menu branch in `Sidebar/index.vue`).
- **Dual-type plugin semantics** (from basePlugins.js): tab-type = in-app views (`/api/iot/*` contract, reusable by any backend implementing the standard interface); url-type = base-service external links (`meta.external`, new window).
- **Port discipline**: ontology graph service uses the uncommon port range (48765, after the dsh family 48757–48760); scan for occupancy before starting new services.

## Provenance

- Data: `ontology_graph_v3.json` is a local build artifact (not committed); the `/ontology-graph` view embeds sample data (92 nodes / 59 edges, extracted fully locally by qwen2.5:7b).
- Repo discipline: credentials never enter git; local build scripts (build/governance) and internal tools are not committed.
