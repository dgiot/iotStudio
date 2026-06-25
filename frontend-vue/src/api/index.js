import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 设备
export const getDevices = (params) => api.get('/devices', { params })
export const getDevice = (id) => api.get(`/devices/${id}`)
export const createDevice = (data) => api.post('/devices', data)
export const deleteDevice = (id) => api.delete(`/devices/${id}`)

// 点位
export const getPoints = (deviceId) => api.get(`/devices/${deviceId}/points`)
export const createPoint = (deviceId, data) => api.post(`/devices/${deviceId}/points`, data)
export const createPointsBatch = (deviceId, data) => api.post(`/devices/${deviceId}/points/batch`, data)

// 告警
export const getAlarms = (params) => api.get('/alarms', { params })
export const confirmAlarm = (id) => api.post(`/alarms/${id}/confirm`)
export const clearAlarm = (id) => api.post(`/alarms/${id}/clear`)

// 遥测
export const getTelemetry = (deviceId, pointId, params) => api.get(`/telemetry/${deviceId}/${pointId}`, { params })
export const getLatest = (deviceId) => api.get(`/telemetry/${deviceId}/latest`)

// 统计
export const getStats = () => api.get('/stats')
export const getHealth = () => api.get('/health')

export default api
