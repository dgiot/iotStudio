/*
 * @Author: h7ml
 * @Date: 2021-03-01 10:03:27
 * @LastEditTime: 2021-03-01 10:22:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dgiot-dashboard\src\api\Platform\index.js
 */
import request from '@/utils/request'
export async function Project_count(params) {
  return request({
    url: '/classes/Project',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}

export async function product_count(params) {
  return request({
    url: '/classes/Product',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}

export async function app_count(params) {
  return request({
    url: '/classes/App',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}

export async function dev_count(params) {
  return request({
    url: '/classes/Device',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}

export async function dev_active_count(params) {
  return request({
    url: '/classes/Device',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}

export async function dev_online_count(params) {
  return request({
    url: '/classes/Device',
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}
/**
 * 新建报告模板
 * @param {*} data
 * @returns
 */
export async function cereteReport(data) {
  return request({
    url: '/reportTemp',
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  })
}

/**
 * 上传报告模板文件
 * @param {*} data
 * @returns
 */
export async function postReportFile(formData) {
  return request({
    url: '/reportTemp',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}

/**
 * 修好报告模板文件
 * @param {*} data
 * @returns
 */
export async function putReportFile(data) {
  return request({
    url: '/reportTemp',
    method: 'put',
    data: data,
  })
}
