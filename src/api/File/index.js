import request from '@/utils/request/request'
import store from '@/store'
import { Message } from 'element-ui'
// 删除文件
export function Delete(params) {
  return request({
    url: 'file_info',
    method: 'Delete',
    params: params,
  })
}

/**
 *
 * @param file
 * @param scene
 * @param filename
 * @param output
 * @param code
 * @param submit
 * @param auth_token
 * @return {*}
 * @constructor
 */
export async function UploadImg(params) {
  if (!_.isObject(params)) Message.error('上传参数必须为对象')
  params = _.merge(
    {
      auth_token: store.getters['user/token'],
      scene: 'default',
      code: '',
      path: 'dgiot',
      output: 'json',
      submit: 'upload',
    },
    params
  )
  dgiotlog.log(params, 'params')
  var formData = new FormData()
  params.path = 'dgiot_file/' + params.path
  for (let key in params) {
    formData.append(key, params[key])
  }
  dgiotlog.log('formData', formData)
  const isParamsKey = [
    'file',
    'scene',
    'filename',
    'output',
    'code',
    'submit',
    'auth_token',
  ]
  await DeleteImg(params)
  var result = isParamsKey.every((e) => {
    // eslint-disable-next-line no-prototype-builtins
    return params.hasOwnProperty(`${e}`)
  })
  dgiotlog.log(process.env.VUE_APP_URL)
  let url = 'upload'
  const { NODE_ENV = 'development' } = process.env

  NODE_ENV == 'development'
    ? (url = `${process.env.VUE_APP_URL}/upload`)
    : (url = 'upload')
  if (result) {
    return axios
      .post(url, formData, {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      })
      .catch((e) => {
        dgiotlog.log(e)
        return { data: {} }
      })
  } else {
    Message.error('上传参数不正确')
    return { data: {} }
  }
}

async function DeleteImg(params) {
  return await Delete({ path: 'files/' + params.path + params.filename })
}

/*
 * @params {string} url 请求地址
 * @params {object} resOpts 请求配置参数
 */
export function exlout(params) {
  // tips: 这里直接返回的是response整体!
  params.sessionToken = store.getters['user/token']
  return axios
    .post('/excelController/exlout', params, {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      responseType: 'blob',
    })
    .catch((err) => dgiotlog.log(err))
}

/**
 *
 * @param url
 * @param params
 * @return {Promise<*>}
 * @description 请求二进制数据文件
 */
export async function downBinary(url, params) {
  return axios
    .get(url, {
      params,
      headers: {
        sessionToken: store.getters['user/token'],
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      responseType: 'blob',
    })
    .catch((err) => dgiotlog.log(err))
}
