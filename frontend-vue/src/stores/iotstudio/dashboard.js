/**
 * Dashboard Store — 对齐 iotView src/store/modules/dashboard.js
 * 存储首页 MQTT 实时数据 + 设备统计
 */
import { reactive, computed } from 'vue'

// ═══════════════════════════════════════════
// 本地持久化辅助
// ═══════════════════════════════════════════

function load(k, fallback) {
  try { return JSON.parse(localStorage.getItem(k) || 'null') ?? fallback } catch { return fallback }
}
function save(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

// ═══════════════════════════════════════════
// State
// ═══════════════════════════════════════════

export const state = reactive({
  pcimg:          load('_pcimg', ''),
  mimg:           load('_mimg', ''),
  devCount:       load('_dev_count', 0),
  projectCount:   load('_project_count', 0),
  appCount:       load('_app_count', 0),
  productCount:   load('_product_count', 0),
  products:       load('_Product', []),
  devOnlineCount: load('_dev_online_count', 0),
  onlineData:     load('_onlineData', []),
  devOffCount:    load('_dev_off_count', 0),
  offlineData:    load('_offlineData', []),
  chartStatus:    load('_ChartStatus', {
    columns: ['状态', '数量'],
    rows: [{ 状态: '在线', 数量: 0 }, { 状态: '离线', 数量: 0 }],
  }),
  tableData:      load('_tableData', []),

  // 大屏
  homeScreen:     load('homeScreen', 0),
  background:     load('background', ''),
})

// ═══════════════════════════════════════════
// Getters
// ═══════════════════════════════════════════

export const onlineRate = computed(() => {
  const total = state.devOnlineCount + state.devOffCount
  return total > 0 ? ((state.devOnlineCount / total) * 100).toFixed(1) + '%' : '--'
})

export const deviceStats = computed(() => ({
  online: state.devOnlineCount,
  offline: state.devOffCount,
  total: state.devOnlineCount + state.devOffCount,
  rate: onlineRate.value,
}))

// ═══════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════

export function setPcimg(img)     { state.pcimg = img;      save('_pcimg', img) }
export function setMimg(img)      { state.mimg = img;       save('_mimg', img) }
export function setDevCount(n)    { state.devCount = n;     save('_dev_count', n) }
export function setProjectCount(n){ state.projectCount = n; save('_project_count', n) }
export function setAppCount(n)    { state.appCount = n;     save('_app_count', n) }
export function setProductCount(n){ state.productCount = n; save('_product_count', n) }
export function setProducts(arr)  { state.products = arr;   save('_Product', arr) }
export function setDevOnlineCount(n)  { state.devOnlineCount = n; save('_dev_online_count', n) }
export function setOnlineData(arr)    { state.onlineData = arr;   save('_onlineData', arr) }
export function setDevOffCount(n)     { state.devOffCount = n;    save('_dev_off_count', n) }
export function setOfflineData(arr)   { state.offlineData = arr;  save('_offlineData', arr) }
export function setChartStatus(c)     { state.chartStatus = c;    save('_ChartStatus', c) }
export function setTableData(arr)     { state.tableData = arr;    save('_tableData', arr) }

export default {
  state, deviceStats, onlineRate,
  setPcimg, setMimg, setDevCount, setProjectCount, setAppCount, setProductCount,
  setProducts, setDevOnlineCount, setOnlineData, setDevOffCount, setOfflineData,
  setChartStatus, setTableData,
}
