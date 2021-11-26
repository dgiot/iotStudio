import request from '@/utils/request'

/**
 * @doc-apis https://pump.dgiotcloud.com/dgiot_swagger/#/Data/post_upload
 * @param params
 * @return {*}
 */
export function dgiotUpload(params) {
  return request({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    url: '/upload',
    method: 'post',
    data: params,
  })
}
