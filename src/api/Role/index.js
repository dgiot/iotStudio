/*
 * @Author: h7ml
 * @Date: 2021-03-15 09:07:01
 * @LastEditTime: 2021-03-15 17:24:20
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\api\Role\index.js
 * @Description:
 */
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request/request'

export async function queryRole(params) {
  return query_object('_Role', params)
}

/**
 * @description 查询部门用户
 * @docs-api https://prod.iotn2n.com/dgiot_swagger/#/_Role/get_roleuser
 * @param params
 * @return {Promise<*>}
 */
export async function getRoleuser(params) {
  return request({
    url: `roleuser`,
    method: 'get',
    params: params,
  })
}

/**
 * @description 用户转岗
 * @docs-api https://prod.iotn2n.com/dgiot_swagger/#/_Role/put_roleuser
 * @param params
 * @return {Promise<*>}
 */
export async function putRoleuser(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `roleuser`,
    method: 'put',
    data: data,
  })
}

/**
 * @description 入职多部门
 * @docs-api https://prod.iotn2n.com/dgiot_swagger/#/_Role/post_roleuser
 * @param params
 * @return {Promise<*>}
 */
export async function postRoleuser(data) {
  return request({
    url: `roleuser`,
    method: 'post',
    data: data,
  })
}

/**
 * @description 离职
 * @docs-api https://prod.iotn2n.com/dgiot_swagger/#/_Role/delete_roleuser
 * @param params
 * @return {Promise<*>}
 */
export async function deleteRoleuser(params) {
  return request({
    url: `roleuser`,
    method: 'delete',
    params: params,
  })
}

export async function queryRoledepartment(params) {
  return request({
    url: 'role',
    method: 'get',
    params: params,
  })
}

export async function getRole(ObjectId) {
  return get_object('_Role', ObjectId)
}

export async function delRole(ObjectId) {
  return del_object('_Role', ObjectId)
}

export async function putRole(ObjectId, params) {
  return update_object('_Role', ObjectId, params)
}

export async function postRole(params) {
  return create_object('_Role', params)
}

export function roletree() {
  return request({
    url: 'roletree',
    method: 'get',
  })
}

/**
 * @description 切换部门时的token
 * @docs-api https://prod.iotn2n.com/dgiot_swagger/#/_User/get_token
 * @param department
 * @return {Promise<*>}
 */
export async function departmentToken(department) {
  return request({
    url: `token?name=${department}`,
    method: 'get',
  })
}

/**
 * @description 刷新用户token
 * @docs-api https://prod.iotn2n.com/dgiot_swagger/#/_User/get_refresh_session
 * @param department
 * @return {Promise<*>}
 */
export async function refreshToken(token) {
  return request({
    url: `refresh_session/${token}`,
    method: 'get',
  })
}

export async function saveRole(data) {
  return request({
    url: 'role',
    method: 'put',
    data,
  })
}

export function getServer(pro) {
  return request({
    url: 'apihub',
    method: 'get',
    params: {
      appname: pro,
    },
  })
}

export function saveRoletemp(name) {
  return request({
    url: `roletemp?name=${name}&tempname=${name}`,
    method: 'post',
  })
}

export async function roleMenu(name) {
  return request({
    url: `role?name=${name}`,
    method: 'get',
  })
}

export async function addRoles(data) {
  return request({
    url: `role`,
    method: 'post',
    data: data,
  })
}
