/*
 * @Author: h7ml
 * @Date: 2021-04-07 9:47:01
 * @LastEditTime: 2021-04-07 9:47:01
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\api\Proxy\index.js
 * @Description: 全局反向代理
 */
import request from '@/utils/request'
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
