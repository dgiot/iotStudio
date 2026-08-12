/**
 * API 聚合入口 — 对齐 iotView 模块分离结构
 *
 * 子模块:
 *   request.js     — axios 实例 + 拦截器
 *   parse.js       — Parse CRUD (queryObject/createObject/updateObject/deleteObject)
 *   user.js        — 认证 (login/logout/getInfo)
 *   navigation.js  — 菜单 (getNavigationList)
 *
 * 快捷别名: 设备/产品/通道/告警/遥测/系统
 */
import request from './request'
import Parse from './parse'

// ── 子模块重导出 ──
export { default as request } from './request'
export { default as Parse } from './parse'

export { login, logout, getInfo, getUsers, getRoleTree, getDepartmentList } from './user'
export { getNavigationList, getNavigationByGroup } from './navigation'

// ═══════════════════════════════════════════════════════════
// 快捷别名 — 设备/产品/通道/告警/测点
// ═══════════════════════════════════════════════════════════

const CLASS = (name) => `/classes/${name}`

// 设备
export const getDevices      = (p) => Parse.queryObject(CLASS('Device'), p)
export const getDevice       = (id) => Parse.queryObject(CLASS('Device'), {}, id)
export const createDevice    = (d) => Parse.createObject(CLASS('Device'), d)
export const updateDevice    = (id, d) => Parse.updateObject(CLASS('Device'), d, id)
export const deleteDevice    = (id) => Parse.deleteObject(CLASS('Device'), {}, id)

// 产品
export const getProducts     = (p) => Parse.queryObject(CLASS('Product'), p)
export const createProduct   = (d) => Parse.createObject(CLASS('Product'), d)

// 通道
export const getChannels     = (p) => Parse.queryObject(CLASS('Channel'), p)
export const createChannel   = (d) => Parse.createObject(CLASS('Channel'), d)

// 告警
export const getAlarms       = (p) => Parse.queryObject(CLASS('Alarm'), p)
export const confirmAlarm    = (id) => request({ url: `/alarms/${id}/confirm`, method: 'post' })
export const clearAlarm      = (id) => request({ url: `/alarms/${id}/clear`, method: 'post' })

// 测点
export const getPoints       = (deviceId) => request({ url: `/devices/${deviceId}/points`, method: 'get' })
export const createPoint     = (deviceId, data) => request({ url: `/devices/${deviceId}/points`, method: 'post', data })
export const updatePoint     = (deviceId, pointId, data) => request({ url: `/devices/${deviceId}/points/${pointId}`, method: 'put', data })

// 遥测
export const getTelemetry    = (deviceId, pointId, params = {}) => request({ url: `/telemetry/${deviceId}/${pointId}`, method: 'get', params })
export const getLatest       = (deviceId) => request({ url: `/telemetry/${deviceId}/latest`, method: 'get' })

// 系统
export const getHealth       = () => request({ url: '/health', method: 'get' })
export const getStats        = () => request({ url: '/stats', method: 'get' })

// 批量
export const batch           = (reqs) => Parse.batch(reqs)

export default request
