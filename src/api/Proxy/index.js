import request from '@/utils/request'

export async function fileUpload(data) {
  return request({
    url: '/dgiotproxy/file/fileUpload',
    method: 'post',
    data,
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
}

export async function deleteFile(params) {
  return request({
    url: 'dgiotproxy/file/deleteFile',
    method: 'GET',
    params,
  })
}

export async function upload(data, _upurl) {
  return request({
    url: '/upload',
    method: 'post',
    withCredentials: true,
    data,
    header: {
      proxy: _upurl,
    },
  })
}
