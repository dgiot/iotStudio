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
 * @param {*} param 上传参数
 * @param {*} type  上传类型
 * @returns 上传后的信息
 */
export function UploadImg(file, config) {
  let formData = new FormData()
  let url = ''
  const { NODE_ENV = 'development' } = process.env
  formData.append('file', file)
  formData.append('output', 'json')
  formData.append('path', 'group1')
  formData.append('auth_token', store.getters['user/token'])
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
