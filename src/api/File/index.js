import request from '@/utils/request'
import store from '@/store'
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
export function UploadImg(
  file,
  scene = 'default',
  filename,
  output = 'json',
  code,
  submit = 'json',
  auth_token = store.getters['user/token']
) {
  let formData = new FormData()
  let url = ''
  const { NODE_ENV = 'development' } = process.env
  formData.append('file', file)
  formData.append('scene', scene)
  formData.append('filename', filename)
  formData.append('output', output)
  formData.append('code', code)
  formData.append('submit', submit)
  formData.append('auth_token', auth_token)
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

  return axios
    .post(url, formData, {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    })
    .catch((err) => console.log(err))
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
