import store from '@/store'
import request from '@/utils/request/request'

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
    headers: {
      responseType: 'blob',
    },
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
 * @description 导出Parse
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ExportParse(className, params) {
  const _token = store.getters['user/token']
  console.log('_token', _token)
  // eslint-disable-next-line no-undef
  return axios
    .post(`/iotapi/export_data?classname=${className}`, params, {
      responseType: 'blob',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        sessionToken: _token,
      },
    })
    .catch((err) => console.log(err))
}

/**
 * @description 导入Parse
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ImportParse(className, file) {
  let formData = new FormData()
  formData.append('className', className)
  formData.append('file', file)
  console.log('formdata', formData, className, file)
  return request({
    url: 'import_data',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
    data: formData,
  })
}

/**
 * @description 导入物模型
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function ImportWmx(type, productid, file) {
  let formData = new FormData()
  formData.append('type', type)
  formData.append('objectId', productid)
  formData.append('file', file)
  console.log('formdata', formData, productid, file)
  return request({
    url: 'import_wmxdata',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
    data: formData,
  })
}
