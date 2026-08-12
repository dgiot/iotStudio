/**
 * 用户 API — 对齐 iotView src/api/user.js
 *
 *   login(data)      → POST /auth/login
 *   getInfo(id)      → GET  /users/{id}
 *   logout()         → POST /logout
 *   getUsers(params) → GET  /users
 */
import request from './request'

/**
 * 登录 — POST /auth/login
 * 后端返回: { token, user: { id, username, role } }
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 获取用户信息 — GET /users/{id}
 */
export function getInfo(id) {
  return request({
    url: `/users/${id}`,
    method: 'get',
  })
}

/**
 * 退出登录 — POST /logout
 */
export function logout(token) {
  return request({
    url: '/logout',
    method: 'post',
    data: {},
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 用户列表 — GET /users
 */
export function getUsers(params) {
  return request({
    url: '/users',
    method: 'get',
    params,
  })
}

/**
 * 角色树 — GET /roletree
 */
export function getRoleTree(params) {
  return request({
    url: '/roletree',
    method: 'get',
    params,
  })
}

/**
 * 部门列表 — GET /classes/_Role
 */
export function getDepartmentList(params) {
  return request({
    url: '/classes/_Role',
    method: 'get',
    params,
  })
}

export default { login, getInfo, logout, getUsers, getRoleTree, getDepartmentList }
