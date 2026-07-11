# dgiot_lite 插件架构设计

## 架构总览

```
┌────────────────────────────────────────────────────┐
│  dgiot_lite 应用层                                  │
│                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │ 设备  │ │ 组态 │ │ 数据 │ │ 网络 │ │ 中枢 │ ...  │
│  │Plugin│ │Plugin│ │Plugin│ │Plugin│ │Plugin│      │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘     │
│     │        │        │        │        │           │
│  ┌──┴────────┴────────┴────────┴────────┴──────┐   │
│  │          Plugin Registry                     │   │
│  │   register() · getRoutes() · getMenus()     │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐   │
│  │          manifest.js                         │   │
│  │   device:true  hmi:false  data:true ...      │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────┬─────────────────────────────┘
                       │ HTTP / MQTT
┌──────────────────────▼─────────────────────────────┐
│  DG-IOT 边缘中枢 (平台层)                             │
│  EMQX :1883 · Parse :1337 · PG :7432                │
└─────────────────────────────────────────────────────┘
```

## 插件接口

```js
// 每个插件导出以下结构
{
  name: 'device',           // 唯一标识
  version: '1.0',           // 语义版本
  description: '设备管理',   // 说明

  // Vue Router 路由 (lazy loaded)
  routes: [
    { path, name, component: () => import(...), meta: {...} }
  ],

  // 侧边栏菜单
  menu: {
    group: 'device',
    label: '设备管理',
    icon: 'Monitor',
    items: [{ title, path, icon }]
  },

  // Pinia store (可选)
  store: defineStore('device', ...),

  // 安装钩子
  onInstall(app) {
    // 注册全局组件、指令、provide/inject
  }
}
```

## 部署裁剪

```js
// manifest.js — 控制部署哪些插件
export const MANIFEST = {
  device:  true,   // ✅ 设备管理
  hmi:     true,   // ✅ 组态
  data:    false,  // ❌ 不需要数据分析 → Vite 自动 tree-shake
  network: false,  // ❌ 不需要报文解析
  tool:    true,   // ✅ MQTT 调试
}

// 打包后体积 = 仅已启用插件的代码
```

## 21 页面 → 7 插件

| 插件 | 页面 | manifest key |
|------|------|-------------|
| 设备管理 | DeviceList, DeviceDetail, Products | `device` |
| 监控仪表 | Dashboard, Telemetry, Alarms, Stream, Phm | `data` |
| 工业组态 | HMI, SCADA, Topology | `hmi` |
| 网络诊断 | A11Analysis, Channels, EdgeProxy | `network` |
| 调试工具 | MqttTool, Simulators | `tool` |
| 系统管理 | SystemOverview, Maintenance, Users | `system` |
| 边缘中枢 | 桥接, 数据推送, 联调 | `hub` |

## 后端插件（后续）

```python
# src/plugins/ — Python 端插件
class DevicePlugin:
    name = "device"
    routes = []          # FastAPI APIRouter
    models = []          # SQLAlchemy models
    mqtt_topics = []     # MQTT 订阅主题
    def on_startup(self): ...
```
