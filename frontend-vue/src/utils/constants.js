// ---- 厂商通道 — 从 DB 动态加载, 此处仅作类型定义 ----
export const CHANNEL_ICONS = {
  oracle_sql: '🗄️', http_rest: '🛢', modbus_tcp: '🔥', mqtt: '🔩', rtsp: '📷',
}

// ---- 其他常量 ----
export const DEVICE_TYPE_MAP = {
  inverter: '逆变器', pcs: '储能PCS', charger: '充电桩', meter: '电表',
  sensor: '传感器', oilwell: '抽油机井', oil_well: '抽油机井', rtu: 'RTU终端',
  compressor: '压缩机', pipeline: '集输管线', storage: '存储', push: '推送',
  relay: '保护装置', simulator: '仿真设备',
  GENERIC_OPC_DRV: 'OPC DA注水站', GENERIC_RTU_DRV: 'A11 RTU井口', GENERIC_MODBUS_DRV: '标准Modbus',
  DSL_31A: '断路器', DST_31A: '变压器差动', DSB_31A: '变压器后备', Motor_Prot: '电动机保护',
  DBPA_31A: '备自投', DGP_13: '接地保护',
}

export const DEVICE_STATUS_MAP = {
  online: '在线', offline: '离线', alarm: '告警', maintenance: '检修',
}

// 菜单分组 —— 按「人怎么找东西」分，不按代码模块分
// 重排要点：图谱主题从 数据/底座/工具 三组归一；原「网络诊断」组去掉杂物改叫「接入」；
//           原「工具」组撤销（成员各归其位）；台账类重复项移出菜单见 router hidden。
export const MENU_GROUPS = {
  monitor: { label: '📊 监控', order: 0 },
  device:  { label: '🔌 设备', order: 1 },
  hmi:     { label: '🗺️ 组态', order: 2 },
  data:    { label: '📡 数据', order: 3 },
  graph:   { label: '🕸️ 图谱', order: 3.5 },
  network: { label: '🔧 接入', order: 4 },
  base:    { label: '🧩 底座', order: 5 },
  system:  { label: '⚙️ 系统', order: 6 },
}

export const PROTOCOL_COLORS = {
  modbus_tcp: '#66d9ff', modbus_rtu: '#66bb6a', iec104: '#ffc107', opcua: '#ab47bc', opcda: '#ab47bc', a11: '#67c23a', http_rest: '#00d4aa',
}

export const PROTOCOLS = ['modbus_tcp', 'modbus_rtu', 'iec104', 'opcua', 'opcda', 'a11', 'http_rest']
export const DATA_TYPES = ['int16', 'uint16', 'int32', 'uint32', 'float32', 'float64', 'bool', 'string']
