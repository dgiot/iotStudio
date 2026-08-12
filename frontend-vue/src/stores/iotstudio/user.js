/**
 * 用户 Store — 对齐 iotView src/store/modules/user.js
 *
 * iotView state shape (Vuex → Vue3 reactive):
 *   token, name, nick, avatar, objectId, introduction
 *   email, phone, sex, org_type, roles
 *   project: {max, curr, total}
 *   department: {objectId, name}
 *
 * 差异: iotView 用 Vuex + js-md5, 我们用 reactive + auth utils
 */
import { reactive, computed } from 'vue'
import { login as loginApi, logout as logoutApi, getInfo, getUsers } from '../../api'
import {
  getToken, setToken, removeToken,
  getObjectId, setObjectId, removeObjectId,
  getDepartmentId, setDepartmentId, removeDepartmentId,
  getDepartmentName, setDepartmentName, removeDepartmentName,
  setLocalUser, removeLocalUser, getLocalUser,
} from '../../utils/auth'
import { resetRouter } from '../../router'

// ═══════════════════════════════════════════
// State (iotView shape)
// ═══════════════════════════════════════════

const localUser = getLocalUser()

export const state = reactive({
  token: getToken() || '',
  name: localUser.username || '',
  nick: localUser.nick || '',
  avatar: localUser.avatar || '',
  objectId: getObjectId() || localUser.objectId || '',
  introduction: '',
  email: localUser.email || '',
  phone: localUser.phone || '',
  sex: '',
  org_type: '',
  roles: [],
  project: {
    max: -1,
    curr: -1,
    total: -1,
  },
  department: {
    objectId: getDepartmentId() || '',
    name: getDepartmentName() || '',
  },
})

// ═══════════════════════════════════════════
// Getters (computed)
// ═══════════════════════════════════════════

export const token      = computed(() => state.token)
export const name       = computed(() => state.name)
export const nick       = computed(() => state.nick)
export const avatar     = computed(() => state.avatar)
export const objectId   = computed(() => state.objectId)
export const roles      = computed(() => state.roles)
export const department = computed(() => state.department)
export const isLoggedIn = computed(() => !!state.token)

// ═══════════════════════════════════════════
// Actions (iotView 兼容)
// ═══════════════════════════════════════════

/**
 * 登录 — 对齐 iotView user/login action
 * 流程: login API → 解析 response → commit state → 写 cookie + localStorage
 */
export async function login(userInfo) {
  const { username, password } = userInfo
  const response = await loginApi({ username: username.trim(), password })

  const { token: sessionToken, user } = response
  if (!sessionToken) {
    const msg = response?.data?.error || '登录失败'
    if (msg.indexOf('locked') >= 0) {
      throw new Error('由于多次登录失败，您的帐户被锁定。请在10分钟后再试。')
    }
    throw new Error(msg || '账号或密码错误，请检查后重试')
  }

  const objectId = user?.id || ''
  const nickName = user?.nick || username
  const email    = user?.email || ''
  const phone    = user?.phone || ''
  const role     = user?.role || 'user'
  const roleList = user?.roles || [{ objectId: 'default', name: role, org_type: 'default' }]

  // Commit state
  state.token    = sessionToken
  state.name     = username
  state.nick     = nickName
  state.email    = email
  state.phone    = phone
  state.objectId = objectId
  state.avatar   = user?.avatar || ''
  state.email    = email
  state.phone    = phone
  state.sex      = user?.sex || ''
  state.org_type = roleList[0]?.org_type || ''
  state.roles    = roleList

  const deptId   = roleList[0]?.objectId || 'default'
  const deptName = roleList[0]?.name || role

  state.department.objectId = deptId
  state.department.name     = deptName

  // Cookie + localStorage (iotView 双重存储)
  setToken(sessionToken)
  setObjectId(objectId)
  setDepartmentId(deptId)
  setDepartmentName(deptName)

  // iotView 标准 localStorage keys
  localStorage.setItem('sessionToken', sessionToken)
  localStorage.setItem('dgiot_userid', objectId)
  localStorage.setItem('dgiot_username', username)
  localStorage.setItem('dgiot_nick', nickName)
  if (phone) localStorage.setItem('dgiot_phone', phone)
  localStorage.setItem('dgiot_deptId', deptId)
  localStorage.setItem('dgiot_deptName', deptName)

  // iotStudio 兼容
  setLocalUser({ objectId, username, nick: nickName, email, phone, deptId, deptName, avatar: state.avatar })

  return response
}

/**
 * 获取用户信息 — 对齐 iotView user/getInfo action
 */
export async function getUserInfo() {
  if (!state.objectId) throw new Error('未登录')
  const response = await getInfo(state.objectId)

  const { data } = response
  if (!data) throw new Error('获取用户信息失败')

  const info = Array.isArray(data) ? data[0] : data
  const { username, nick, email, objectId: oid, roles: r } = info

  state.name     = username || state.name
  state.nick     = nick || state.nick
  state.email    = email || state.email
  state.objectId = oid || state.objectId
  if (r) state.roles = r

  return info
}

/**
 * 退出登录 — 对齐 iotView user/logout action
 */
export async function logout() {
  try {
    await logoutApi(state.token)
  } catch { /* 忽略 logout API 错误 */ }

  // Reset state
  state.token    = ''
  state.name     = ''
  state.nick     = ''
  state.objectId = ''
  state.roles    = []
  state.department.objectId = ''
  state.department.name     = ''

  // 清除持久化
  removeToken()
  removeObjectId()
  removeDepartmentId()
  removeDepartmentName()
  removeLocalUser()
  localStorage.removeItem('sessionToken')

  resetRouter()
}

/**
 * 清除 token (不调 API) — 对齐 iotView user/resetToken action
 */
export function resetToken() {
  state.token    = ''
  state.roles    = []
  state.objectId = ''
  removeToken()
  removeObjectId()
  removeDepartmentId()
  removeDepartmentName()
  removeLocalUser()
}

// ═══════════════════════════════════════════
// 默认导出 (iotView store modules 兼容)
// ═══════════════════════════════════════════

export default {
  state,
  token, name, nick, avatar, objectId, roles, department, isLoggedIn,
  login, getUserInfo, logout, resetToken,
}
