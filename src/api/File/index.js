import { uuid } from '@/utils'
import request from '@/utils/request'
import store from '@/store'
import { fromData } from 'ssri'
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
const token = store.getters['user/token']
export function UploadImg(file, config) {
  let formData = new FormData()
  formData.append('file', file)
  formData.append('output', 'json')
  formData.append('path', 'group1')
  formData.append('auth_token', token)
  return request({
    url: 'group1/upload',
    ...config,
    method: 'post',
    data: formData,
  })
}
