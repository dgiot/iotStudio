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

/**
 *
 * @param {*} param 上传参数
 * @param {*} type  上传类型
 * @returns 上传后的信息
 */
export function UploadImg(param, type) {
  let flag = false
  let meassage = ''
  let imgType = ['gif', 'jpg', 'jpeg', 'png', 'GIF', 'JPG', 'PNG']
  if (!type) {
    meassage = '文件类型为必传参数'
  } else {
    if (imgType.indexOf(type) > -1) {
      flag = !/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|)$/.test(type)
      if (!flag) {
        meassage = '文件类型非图片类型'
      }
    }
  }
  if (!flag) {
    return Vue.prototype.$baseMessage(
      Vue.prototype.$translateTitle(meassage),
      'error'
    )
  } else {
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
}
