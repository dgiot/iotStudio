/**
 * Parse REST API — iotStudio 标准 (适配 dgiot_lite)
 * ====================================================
 * 映射 iotStudio src/api/Parse/index.js 7个核心函数
 * 适配: element-ui → element-plus, axios → dgiot fetch
 */
import { get, post, put, del } from '../index'
import { ElMessage as Message } from 'element-plus'

const API = '/api'

// ── 查询对象列表 ──
export async function query_object(tabclass, params = {}) {
  if (!tabclass) { Message({ message: 'tabclass required', type: 'error' }); return }
  return get(`${API}/classes/${tabclass}`, params)
}

// ── 查询单条 ──
export async function get_object(tabclass, ObjectId) {
  if (!tabclass || !ObjectId) { Message({ message: 'tabclass and ObjectId required', type: 'error' }); return }
  return get(`${API}/classes/${tabclass}/${ObjectId}`)
}

// ── 创建对象 ──
export async function create_object(tabclass, data) {
  if (!tabclass || !data) { Message({ message: 'tabclass and data required', type: 'error' }); return }
  return post(`${API}/classes/${tabclass}`, data)
}

// ── 更新对象 ──
export async function update_object(tabclass, ObjectId, data) {
  if (!tabclass || !ObjectId || !data) { Message({ message: 'tabclass, ObjectId and data required', type: 'error' }); return }
  return put(`${API}/classes/${tabclass}/${ObjectId}`, data)
}

// ── 删除对象 ──
export async function del_object(tabclass, ObjectId) {
  if (!tabclass || !ObjectId) { Message({ message: 'tabclass and ObjectId required', type: 'error' }); return }
  return del(`${API}/classes/${tabclass}/${ObjectId}`)
}

// ── 批量操作 ──
export async function shuwa_batch(requests) {
  return post(`${API}/batch`, { requests })
}

// ── 登录/用户 ──
export async function login(username, password) {
  return post(`${API}/login`, { username, password })
}

export async function register(username, password, email = '') {
  return post(`${API}/users`, { username, password, email })
}

// ── 云函数 ──
export async function call_function(name, params = {}) {
  return post(`${API}/functions/${name}`, { params })
}
