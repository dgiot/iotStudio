import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'

export function Upload({ file }) {
  return request({
    url: 'upload',
    method: 'post',
    params: {
      file,
    },
  })
}

export function UploadImg(param) {
  return request({
    url: 'group1/upload',
    method: 'post',
    headers: {
      proxy: true, // 是否开启代理
      url: '/dgiotproxy/shuwa_file/', // 开启代理后的真实上传路径
      'Content-Type': 'multipart/form-data',
    },
    data: param,
  })
}
