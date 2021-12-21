// * @Author: dext7r
// * @Date: 2021-12-16 21:35:04
// * @LastEditors: dext7r
// * @LastEditTime: 2021-12-16 21:35:04
// * @Description:
// * @FilePath: src\api\Opc\index.js
// * @DocumentLink: http://prod.iotn2n.com/dgiot_swagger/#/OPC
import request from '@/utils/Request/request'

/**
 * @docs-api http://prod.iotn2n.com/dgiot_swagger/#/OPC/post_head
 * @param data
 * @return {Promise<*>}
 * @description 获取表头
 */
export async function postHead(data) {
  return request({
    url: 'head',
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: data,
  })
}
