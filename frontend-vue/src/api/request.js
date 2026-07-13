/**
 * 请求层 — 对齐 iotView src/utils/request.js
 *
 * Axios 实例 + 拦截器 (departmentToken / sessionToken / 401 → login)
 */
import axios from 'axios'
import router from '../router'
import { getToken, removeToken, removeLocalUser } from '../utils/auth'

const request = axios.create({
  baseURL: '/api',
  timeout: 50000,  // 对齐 iotView
})

// 请求拦截 — departmentToken + sessionToken
request.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['departmentToken'] = token
      config.headers['sessionToken'] = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截 — 直接返回 data (对齐 iotView) · 401 跳登录
request.interceptors.response.use(
  response => {
    const { data, status } = response
    if (status >= 300) {
      return Promise.reject(new Error(data?.error || 'Request failed'))
    }
    return data
  },
  error => {
    console.log(error)
    if (error.response?.status === 401) {
      removeToken()
      removeLocalUser()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request
