// ---- 厂商通道插件注册表 ----
// 新增厂商通道只需在此添加一条记录 + 后端 src/protocols/ 创建对应适配器
export const VENDOR_CHANNELS = [
  {
    key: 'youyeyun', name: '油液监测', icon: '🛢',
    source: 'youyeyun.com API · 5 min 采集间隔',
    protocol: 'http_rest', desc: '有叶云油液传感器平台 — CCS液压/齿轮系统',
    devices: 2, points: 45, interval: '5 min',
    connected: false, lastSync: null,
    relatedDevices: [
      { id: 'ccs1', name: 'CCS-1液压系统-油液监测', status: 'online' },
      { id: 'gear2', name: '2号齿轮系统-油液监测', status: 'online' },
    ],
  },
  {
    key: 'boiler', name: '锅炉能效', icon: '🔥',
    source: 'Modbus TCP → SCADA · 4设备 · 19测点',
    protocol: 'modbus_tcp', desc: '锅炉房能效监测 — 温度/压力/流量/含氧量',
    devices: 4, points: 19, interval: '30s',
    connected: false, lastSync: null,
    relatedDevices: [
      { id: 'boiler1', name: '1号锅炉-燃烧效率', status: 'offline' },
      { id: 'boiler2', name: '2号锅炉-蒸汽品质', status: 'offline' },
    ],
  },
  {
    key: 'phm_vib', name: '声振温', icon: '📊',
    source: '知微 PHM / 本地模拟 · 36设备 · 10测点',
    protocol: 'http_rest', desc: '声发射/振动/温度三合一 — 旋转机械故障诊断',
    devices: 36, points: 10, interval: '10s',
    connected: false, lastSync: null,
    relatedDevices: [
      { id: 'phm01', name: '注水泵-B3-声振温', status: 'offline' },
      { id: 'phm02', name: '压缩机-C2-声振温', status: 'offline' },
    ],
  },
  {
    key: 'bolt', name: '智能螺栓', icon: '🔩',
    source: '博感 MQTT (BLE→TLV) · 17设备 · 3测点',
    protocol: 'mqtt', desc: '法兰螺栓预紧力监测 — 应变/温度/松脱预警',
    devices: 17, points: 3, interval: '60s',
    connected: false, lastSync: null,
    relatedDevices: [
      { id: 'bolt01', name: '反应器法兰-螺栓组A', status: 'offline' },
    ],
  },
  {
    key: 'video', name: '视频监控', icon: '📷',
    source: '海康 NVR → RTSP :554 · 29设备 · 2测点',
    protocol: 'rtsp', desc: '海康威视 NVR 视频流接入 — 安防/巡检',
    devices: 29, points: 2, interval: '实时',
    connected: false, lastSync: null,
    relatedDevices: [
      { id: 'cam01', name: '厂区入口-枪机#1', status: 'offline' },
    ],
  },
  {
    key: 'tdlas', name: 'TDLAS 气体检测', icon: '⛽',
    source: '激光光谱分析仪 · 1设备 · 1测点',
    protocol: 'modbus_tcp', desc: '可调谐半导体激光吸收光谱 — H₂S/CH₄ 痕量检测',
    devices: 1, points: 1, interval: '1s',
    connected: false, lastSync: null,
    relatedDevices: [
      { id: 'tdlas01', name: 'TDLAS-硫化氢监测点', status: 'offline' },
    ],
  },
]

// ---- 其他常量 ----
export const DEVICE_TYPE_MAP = {
  inverter: '逆变器', pcs: '储能PCS', charger: '充电桩', meter: '电表',
  sensor: '传感器', oilwell: '抽油机井', rtu: 'RTU终端',
  compressor: '压缩机', pipeline: '集输管线', storage: '存储', push: '推送',
}

export const DEVICE_STATUS_MAP = {
  online: '在线', offline: '离线', alarm: '告警', maintenance: '检修',
}

export const MENU_GROUPS = {
  monitor: { label: '📊 监控', order: 0 },
  device:  { label: '🔌 设备', order: 1 },
  hmi:     { label: '🗺️ 组态', order: 2 },
  data:    { label: '📡 数据', order: 3 },
  network: { label: '🔧 网络诊断', order: 4 },
  tool:    { label: '🛠️ 工具', order: 5 },
  system:  { label: '⚙️ 系统', order: 6 },
}

export const PROTOCOL_COLORS = {
  modbus_tcp: '#66d9ff', modbus_rtu: '#66bb6a', iec104: '#ffc107', opcua: '#ab47bc', opcda: '#ab47bc', a11: '#67c23a', http_rest: '#00d4aa',
}

export const PROTOCOLS = ['modbus_tcp', 'modbus_rtu', 'iec104', 'opcua', 'opcda', 'a11', 'http_rest']
export const DATA_TYPES = ['int16', 'uint16', 'int32', 'uint32', 'float32', 'float64', 'bool', 'string']
