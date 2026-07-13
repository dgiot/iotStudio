// ---- 厂商通道 — 从 DB 动态加载, 此处仅作类型定义 ----
export const CHANNEL_ICONS = {
  oracle_sql: '🗄️', http_rest: '🛢', modbus_tcp: '🔥', mqtt: '🔩', rtsp: '📷',
}

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
