import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

/**
 * @description 导出菜单
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ExportMenu(params) {
  return request({
    url: 'menu',
    method: 'get',
    params: params,
  })
}
/**
 * @description 导入菜单
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ImportMenu(params) {
  return request({
    url: 'menu',
    method: 'post',
    data: params,
  })
}

/**
 * @description 导出parse数据
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ExportParse(params) {
  return request({
    url: 'export_data',
    method: 'get',
    params: params,
  })
}
/**
 * @description 导入parse数据
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ImportParse(params) {
  return request({
    url: 'import_data',
    method: 'post',
    data: params,
  })
}
