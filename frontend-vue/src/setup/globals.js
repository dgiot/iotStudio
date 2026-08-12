/**
 * 全局 API 挂载 — 对标 iotStudio dgiot/plugins/dgiot.js
 * 挂载到 window.$dg 和 Vue globalProperties
 */
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'

const $dg = {
  // ── 令牌 ──
  getToken() {
    return localStorage.getItem('dgiot_token') || ''
  },
  setToken(t) { localStorage.setItem('dgiot_token', t) },

  // ── 消息 ──
  msg(text, type = 'info') { ElMessage({ message: text, type, duration: 2500 }) },
  notify(title, message, type = 'info') { ElNotification({ title, message, type }) },
  async confirm(text, title = '确认') {
    try { await ElMessageBox.confirm(text, title); return true }
    catch { return false }
  },
  async alert(text, title = '提示') {
    await ElMessageBox.alert(text, title)
  },

  // ── 加载 ──
  loading: null,
  showLoading(text = '加载中...') {
    this.loading = ElMessage({ message: text, type: 'info', duration: 0, icon: 'Loading' })
  },
  hideLoading() { this.loading?.close(); this.loading = null },

  // ── 存储 ──
  store: {
    get(k) { try { return JSON.parse(localStorage.getItem('dgiot_' + k)) } catch { return null } },
    set(k, v) { localStorage.setItem('dgiot_' + k, JSON.stringify(v)) },
    remove(k) { localStorage.removeItem('dgiot_' + k) },
  },

  // ── 工具 ──
  tableHeight(formType = 'normal') {
    const h = window.innerHeight
    return formType === 'complex' ? h - 280 : h - 200
  },

  // ── 权限 ──
  hasPermission(perm) {
    const perms = this.store.get('permissions') || []
    return perms.includes(perm) || perms.includes('SUPER_ADMIN')
  },
}

if (typeof window !== 'undefined') {
  window.$dg = $dg
}

export default $dg
export function install(app) {
  app.config.globalProperties.$dg = $dg
  app.provide('$dg', $dg)
}
