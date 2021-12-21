import store from '@/store'
import request from '@/utils/Request/request'

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
  // return request({
  //   url: `export_data?classname=${className}`,
  //   method: 'post',
  //   data: params,
  //   headers: {
  //     responseType: 'blob',
  //   },
  // })
  const _token = store.getters['user/token']
  dgiotlog.log('_token', _token)
  // eslint-disable-next-line no-undef
  return axios
    .post(`iotapi/export_data?classname=${className}`, params, {
      responseType: 'blob',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        sessionToken: _token,
      },
    })
    .catch((err) => dgiotlog.log(err))
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
  dgiotlog.log('formdata', formData, className, file)
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
