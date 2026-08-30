# iotStudio — IoT Edge Application Framework

[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green)](https://fastapi.tiangolo.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-cyan)](https://vuejs.org)
[![SQLite](https://img.shields.io/badge/SQLite-zero-install-orange)](https://sqlite.org)

> Python lightweight edition | Edge agent | Protocol collection | Source delivery | Works with the DG-IoT main platform

---

## Architecture

```
iotStudio (Edge)              DG-IoT (Hub)              iotStudio (App)
Python · lightweight          Erlang · high-perf        Vue3 · low-code
┌────────────────┐  MQTT/HTTP ┌──────────────────┐  REST  ┌──────────────┐
│ parse_lite      │ ─────────→ │ EMQX aggregation  │ ←───── │ 12-page admin │
│ SQLite / PG     │ ←───────── │ Parse Server      │        │ 7-plugin arch │
│ TDengine TSDB   │            │ TDengine · cluster │        │ dynamic menus │
│ protocol·collect│            │ rules·alarms·onto │        │ 2D SCADA·topo │
└────────────────┘            └──────────────────┘        └──────────────┘
  <1000 devices/nodes           >100k device aggregation     user layer
```

The Python edition is an **edge agent**: it collects from field protocols and pushes data to the Erlang-based DG-IoT hub **over MQTT** (topic format `dgiot/{site}/{gateway}/{device}/{point}/data`, aligned with the DG-IoT thing-model). Databases are **not shared** — the edge keeps its local SQLite/PG, the hub owns MongoDB (Parse Server) + TDengine cluster. HTTP forwarding is available as an alternative target.

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the platform (SQLite, zero install — no PG/TDengine required)
python run.py
# → http://localhost:8000    Admin console
# → http://localhost:8000/docs   Swagger API

# 3. (Optional) Initialize seed data
python scripts/init_dgiot.py
```

---

## Core Features

### Data Collection
| Protocol | File | Notes |
|------|------|------|
| Modbus TCP/RTU | `protocols/modbus_tcp.py` | Multi-slave polling, register scan |
| A11 | `protocols/a11.py` | Oil & gas production IoT 5a5a frames |
| OPC UA | pymodbus / asyncua | Subscribe + polling |
| OPC DA | DCOM discovery | RSLinx protocol recognisable |
| IEC 104 | `protocols/` | Power telecontrol protocol |

### Storage
| Option | Use | Install |
|------|------|------|
| SQLite | Default (zero install) | Built-in |
| PostgreSQL | Production multi-tenant | Optional |
| TDengine 3.x | Time-series data | Optional, falls back to SQLite |

### Parse-lite (Parse Server Python compatibility layer)
| Feature | Notes |
|------|------|
| CRUD | `POST/GET/PUT/DELETE /classes/{ClassName}` |
| Query | `$ne $lt $gt $in $nin $exists $regex $or $and` |
| Users | signup / login / logout / session |
| Roles | `_Role` create, hierarchy, user binding |
| ACL | Object-level `{user/role}:{read/write}` |
| CLP | Class-level find/get/create/update/delete |
| Batch | `POST /batch` (max 50) |
| Hooks | beforeSave / afterSave / beforeDelete / afterDelete |

### Multi-Tenancy
| Feature | File |
|------|------|
| Tenant CRUD | `web/tenant_api.py` |
| Role hierarchy | `tenants.parent_id` (aligned with DG-IoT `_Role.roles`) |
| User-tenant binding | `user_roles` table |
| Request isolation | `X-Tenant-ID` header + JWT |

### Ontology Engine
```
Site (industrial site) → Gateway (IO gateway) → Device (RTU/site) → Point (measurement)
                                                    ↓
                        MQTT: dgiot/{site}/{gateway}/{device}/{point}/data
```
`ontology.py` — four-layer model + `sync_to_parse()` auto-creates Parse Device objects.

---

## Admin Console (12 pages, 7 groups)

```
📊 Monitor    Dashboard (KPI + trends + alarm levels + logs)
🔌 Devices    Device mgmt · Product mgmt (TSL partitions + import/export)
🗺️ SCADA      SCADA view (device topology + process, linked tabs)
📡 Data       Analytics · Alarm mgmt · Stream computing · Predictive maintenance
🔧 Network    Packet parsing · Channel mgmt · Edge agent
🛠️ Tools     MQTT debug · Simulator mgmt
⚙️ System     Overview · Ops mgmt · User mgmt
```

### Plugin Architecture
```js
// manifest.js — enable per deployment
hub:     false,  // no edge-hub integration needed → Vite tree-shakes it out
network: true,   // packet parsing needed
```

Channel plugins enable per `manifest.js`; custom vendor protocols are supported.

---

## Project Structure

```
iotStudio/
├── run.py                    # Entry point
├── config.yaml               # TDengine/MQTT/Parse config
├── src/
│   ├── main.py               # FastAPI application
│   ├── parse_lite.py         # Parse Server Python compatibility layer
│   ├── ontology.py           # 4-layer ontology engine
│   ├── auth.py               # JWT + multi-tenant middleware
│   ├── protocols/            # Modbus/A11/OPC/IEC104
│   ├── storage/tdengine.py   # TDengine + SQLite fallback
│   ├── models/               # dgiot_schema + device ORM
│   ├── services/             # collector · phm · safety_rules
│   └── web/                  # tenant_api · iot_contract
├── frontend-vue/
│   └── src/
│       ├── plugins/          # 7 plugins (manifest tree-shaking)
│       ├── views/            # 12 pages Vue3 SFC
│       └── components/       # ChannelCard · NotifyBell · RunningCards
├── scripts/                  # init · seed data · ontology server
├── simulators/               # protocol simulators
└── tests/                    # integration tests
```

---

## Configuration

`config.yaml`:

```yaml
# Storage (falls back to SQLite if absent)
tdengine:
  host: "192.168.10.167"       # remote TDengine (optional)
  port: 6041

# Embedded Parse-lite
parse:
  db_path: "./data/parse.db"   # SQLite single-node

# Multi-tenancy
storage_mode: "sqlite"         # sqlite | postgres
```

---

## API

| Endpoint | Notes |
|------|------|
| `GET /api/health` | Health check |
| `GET/POST /api/devices` | Device mgmt (DG-IoT Device) |
| `GET/POST /api/tenants` | Tenant mgmt (DG-IoT _Role) |
| `POST /api/roleuser` | User-role assignment |
| `GET /api/alarms` | Alarm list |
| `GET /api/telemetry/{device_id}/{point_id}` | Time-series query |
| `GET /api/stats` | Collection stats |
| `WS /ws` | WebSocket realtime push |
| `GET /api/iot/devices|products|channels` | Base-plugin contract views |

---

## Integration with DG-IoT

iotStudio pushes collected data to the DG-IoT hub over MQTT:

```
iotStudio ──MQTT──→ EMQX (:1883) ──→ Parse Server ──→ TDengine
  edge agent          hub aggregation      storage        TSDB
```

Data format follows the DG-IoT thing-model standard: edge collection → hub aggregation, end to end.

---

## IOT Base Plugins (merged)

This repo merged the shared IOT base plugin package (`plugins-base`) with capability-based placement — nothing lost. See [BASE_PLUGINS_EN.md](BASE_PLUGINS_EN.md) for the full merge map.

- **Layout template**: `frontend-vue/src/components/ShellDark/` (dark layout, optional) + `CloseLoop/` component + `assets/base-icons.js`
- **Lightweight contract views**: `/iot/devices|products|channels` (`/api/iot/*`, `views/iot/`; backend included in `src/web/iot_contract.py`)
- **Ontology graph**: `/ontology-graph` → `public/ontology_graph.html` (ECharts force graph, local vendor assets, offline-capable; complements the `ontology.html` DLAS tree)
- **Deployment scripts**: `scripts/ontology_server.py` (ontology graph service, loopback 48765), `scripts/dsh-mobile-check.cjs` (mobile acceptance, credentials via env vars) — alongside `init_db`/`seed_*`/`audit_ontology`
- **URL-type external links**: menu items with `meta.external` open in a new window (Sidebar support)

---

## Maintenance

DGIOT LLC (Dallas, TX) — [DG-IoT Platform](https://github.com/dgiot/dgiot)
