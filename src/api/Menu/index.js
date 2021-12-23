import {
  create_object,
  del_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request/request'

export async function queryMenu(params) {
  return query_object('Menu', params)
}

export async function getToken(company) {
  return request({
    url: `token`,
    method: 'get',
    params: {
      name: company,
    },
  })
}

export async function delMenu(ObjectId) {
  return del_object('Menu', ObjectId)
}

export async function putMenu(ObjectId, params) {
  return update_object('Menu', ObjectId, params)
}

export async function postMenu(params) {
  return create_object('Menu', params)
}

// 获取所有的菜单树
export function getmenuTree() {
  return request({
    url: 'menu/tree',
    method: 'get',
  })
}

export function buildmenu() {
  return request({
    url: 'menu/build',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'menu',
    method: 'post',
    data,
  })
}

export function del(id) {
  return request({
    url: 'api/menu/' + id,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: 'menu',
    method: 'put',
    data,
  })
}

export function getNavigation() {
  return query_object('Navigation', {})
}

export function Roletree() {
  return request({
    url: 'roletree',
    method: 'get',
  })
}
