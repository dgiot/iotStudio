import request from '@/utils/request'
import store from '@/store'
import { Message } from 'element-ui'
export function Upload({ file }) {
  return request({
    url: 'upload',
    method: 'post',
    params: {
      file,
    },
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
export function UploadImg(params) {
  if (!_.isObject(params)) Message.error('上传参数必须为对象')
  // const p = {
  //   file,
  //   scene = 'default',
  //   filename,
  //   output = 'json',
  //   path
  //   code,
  //   submit = 'json',
  //   auth_token = store.getters['user/token'],
  // }
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
  console.log(params, 'params', result)
  var formData = new FormData()
  for (let key in params) {
    formData.append(key, params[key])
  }
  const isParamsKey = [
    'file',
    'scene',
    'filename',
    'output',
    'code',
    'submit',
    'auth_token',
  ]
  var result = isParamsKey.every((e) => {
    return params.hasOwnProperty(`${e}`)
  })
  let url = ''
  const { NODE_ENV = 'development' } = process.env
  console.log('formData', formData)
  NODE_ENV == 'development'
    ? (url = 'http://flow.hzmctech.com/group1/upload')
    : (url = 'group1/upload')
  // formData.append('auth_token', 'r:44f639018ab7251d2b2730a55c49103f')
  // return request({
  //   url: 'group1/upload',
  //   ...config,
  //   method: 'post',
  //   data: formData,
  // })
  if (result) {
    return axios
      .post(url, formData, {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      })
      .catch((err) => console.log(err))
  } else {
    Message.error('上传参数不正确')
    return false
  }
}

// 需要返回整体 所以不能用该方法

// export function exlout(config) {
//   return request({
//     url: 'excelController/exlout',
//     method: 'post',
//     data: config,
//     headers: {
//       withCredentials: true,
//       responseType: 'blob',
//       produrl: '/dgiotproxy/shuwa_report/',
//       devurl: 'group2/',
//       proxy: true,
//     },
//     // responseType: 'blob',
//   })
// }

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
    .catch((err) => console.log(err))
}
