/**
 * 管理台 API — 用户 / 角色 / 部门 / 菜单 / 视图
 *
 * 全部走 request 实例：它的请求拦截器会挂 sessionToken / departmentToken，
 * 后端 require_admin 认的就是这两个头。
 *
 * ⚠️ 别再用裸 fetch 调 /api/admin/*：不带那两个头一律 401。
 *    （原 UsersView 就是裸 fetch，页面因此一直是空的。）
 */
import request from './request'

// ── 用户 ──
export const getUsers = () => request({ url: '/admin/users', method: 'get' })
export const setUserRole = (id, role) =>
  request({ url: `/admin/users/${id}/role`, method: 'put', data: { role } })
export const setUserDepartment = (id, department) =>
  request({ url: `/admin/users/${id}/department`, method: 'put', data: { role: department } })

// ── 角色 / 部门 ──
export const getRoles = () => request({ url: '/admin/roles', method: 'get' })
export const createRole = (data) => request({ url: '/admin/roles', method: 'post', data })
export const getDepartments = () => request({ url: '/admin/departments', method: 'get' })

// ── 菜单覆写 ──
export const getMenus = () => request({ url: '/admin/menus', method: 'get' })
export const saveMenu = (data) => request({ url: '/admin/menus', method: 'put', data })
export const deleteMenu = (path) =>
  request({ url: `/admin/menus/${encodeURI(path)}`, method: 'delete' })
export const resetMenus = () => request({ url: '/admin/menus/reset', method: 'post' })

// ── 视图（组态/拓扑画布存档）──
export const getViews = (type = '') =>
  request({ url: '/views', method: 'get', params: type ? { type } : {} })
export const getView = (id) => request({ url: `/views/${id}`, method: 'get' })
export const createView = (data) => request({ url: '/views', method: 'post', data })
export const updateView = (id, data) => request({ url: `/views/${id}`, method: 'put', data })
export const deleteView = (id) => request({ url: `/views/${id}`, method: 'delete' })
export const setDefaultView = (id) => request({ url: `/views/${id}/default`, method: 'put' })
/**
 * 取默认视图（含画布）。site 三态与后端一致，别合并成「有就传没就不传」：
 *   undefined —— 不按站点过滤，全部里挑
 *   ''        —— 只看不绑站点的那些（组态页没带 ?site= 时就是这个语义）
 *   'xxx'     —— 看 xxx 站的；没设默认则回退到不绑站点的那份
 * 空串必须真的发出去（`?site=`）—— 省掉它就变成"不按站点过滤"，会串到别人站点的画布。
 */
export const getDefaultView = (type, site = undefined) =>
  request({
    url: `/views/default/${type}`, method: 'get',
    params: site === undefined ? {} : { site },
  })
