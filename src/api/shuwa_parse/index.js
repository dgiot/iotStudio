import request from '@/utils/request'
import { Message } from 'element-ui'
/**
 * 数蛙全局通用接口方法 查询
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} params    对应参数 必传  可为{}
 */
export async function query_object(tabclass, params) {
  if (tabclass && params) {
    return request({
      url: `/classes/${tabclass}`,
      method: 'get',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: params,
    })
  } else {
    return Message({
      message: 'tabclass 和 params 字段为必传',
      type: 'error',
      duration: 1 * 1000,
    })
  }
}

/**
 * 数蛙全局通用接口方法 查询
 * @param {*} headers  请求头信息
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} params    对应参数 必传  可为{}
 */
{
}
export async function query_object_header(tabclass, params, headers) {
  if (tabclass && params) {
    return request({
      url: `/classes/${tabclass}`,
      method: 'get',
      headers: headers,
      params: params,
    })
  } else {
    return Message({
      message: 'tabclass 和 params 字段为必传',
      type: 'error',
      duration: 1 * 1000,
    })
  }
}

/**
 * 数蛙全局通用接口方法 查询单条数据
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} ObjectId   对应查询id 必传
 */
export async function get_object(tabclass, ObjectId) {
  if (tabclass && ObjectId) {
    return request({
      url: `/classes/${tabclass}/${ObjectId}`,
      method: 'get',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  } else {
    return Message({
      message: `tabclass${tabclass} 和 ObjectId${ObjectId}字段为必传`,
      type: 'error',
      duration: 1 * 1000,
    })
  }
}

/**
 * 数蛙全局通用接口方法 删除单条数据
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} ObjectId   对应查询id 必传
 */

export async function del_object(tabclass, ObjectId) {
  if (tabclass && ObjectId) {
    return request({
      url: `/classes/${tabclass}/${ObjectId}`,
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  } else {
    return Message({
      message: `tabclass${tabclass} 和 ObjectId${ObjectId}字段为必传`,
      type: 'error',
      duration: 1 * 1000,
    })
  }
}

/**
 * 数蛙全局通用接口方法 更新单条数据
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} ObjectId   对应查询id 必传
 * @param {*} data 更新的参数 必传
 */
export async function update_object(tabclass, ObjectId, data) {
  if (tabclass && ObjectId && data) {
    return request({
      url: `/classes/${tabclass}/${ObjectId}`,
      method: 'PUT',
      data: data,
    })
  } else {
    return Message({
      message: 'tabclass  ObjectId 和 data 字段为必传',
      type: 'error',
      duration: 1 * 1000,
    })
  }
}

/**
 * 数蛙全局通用接口方法 创建对象
 * @param {*} tabclass  表名 必传 不可为空
 * @param {*} data   创建对象相关参数
 */

export async function create_object(tabclass, data) {
  if (tabclass && data) {
    return request({
      url: `/classes/${tabclass}`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    })
  } else {
    return Message({
      message: 'tabclass 和 data字段为必传',
      type: 'error',
      duration: 1 * 1000,
    })
  }
}

/**
 * 数蛙全局通用接口方法 批处理
 * @param {*} tabclass  表名 必传 不可为空
 */

export async function shuwa_batch(data) {
  return request({
    url: `/batch`,
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: data,
  })
}
