import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

export async function queryMenu(params) {
  return query_object('Menu', params)
}

export async function getMenu(name) {
  return get_object('Menu', ObjectId)
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
export function getMenusTree() {
  return request({
    url: 'menus/tree',
    method: 'get',
  })
}

export function buildMenus() {
  return request({
    url: 'menus/build',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'menus',
    method: 'post',
    data,
  })
}

export function del(id) {
  return request({
    url: 'api/menus/' + id,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: 'menus',
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
