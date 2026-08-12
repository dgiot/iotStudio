/**
 * auth.js — 对齐 iotView src/utils/auth.js
 * Cookie + localStorage 双重 token 存储
 */
import Cookies from 'js-cookie'

// ── Cookie Keys (iotView 标准) ──
const TokenKey = 'Admin-Token'
const IdKey = 'Admin-Id'
const DeptIdKey = 'Department-Id'
const DeptNameKey = 'Department-Name'

// ── Token ──
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// ── ObjectId ──
export function getObjectId() {
  return Cookies.get(IdKey)
}

export function setObjectId(id) {
  return Cookies.set(IdKey, id)
}

export function removeObjectId() {
  return Cookies.remove(IdKey)
}

// ── Department ──
export function getDepartmentId() {
  return Cookies.get(DeptIdKey)
}

export function setDepartmentId(id) {
  return Cookies.set(DeptIdKey, id)
}

export function removeDepartmentId() {
  return Cookies.remove(DeptIdKey)
}

export function getDepartmentName() {
  return Cookies.get(DeptNameKey)
}

export function setDepartmentName(name) {
  return Cookies.set(DeptNameKey, name)
}

export function removeDepartmentName() {
  return Cookies.remove(DeptNameKey)
}

// ── localStorage 辅助 (iotView 兼容) ──
export function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem('dgiot_user') || '{}')
  } catch { return {} }
}

export function setLocalUser(user) {
  localStorage.setItem('dgiot_user', JSON.stringify(user))
  // 同时写 iotView 标准 key
  if (user.objectId) localStorage.setItem('dgiot_userid', user.objectId)
  if (user.username) localStorage.setItem('dgiot_username', user.username)
  if (user.nick) localStorage.setItem('dgiot_nick', user.nick)
  if (user.phone) localStorage.setItem('dgiot_phone', user.phone)
  if (user.deptId) localStorage.setItem('dgiot_deptId', user.deptId)
  if (user.deptName) localStorage.setItem('dgiot_deptName', user.deptName)
}

export function removeLocalUser() {
  localStorage.removeItem('dgiot_user')
  localStorage.removeItem('dgiot_token')
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('dgiot_userid')
  localStorage.removeItem('dgiot_username')
  localStorage.removeItem('dgiot_nick')
  localStorage.removeItem('dgiot_phone')
  localStorage.removeItem('dgiot_deptId')
  localStorage.removeItem('dgiot_deptName')
}
