/**
 * @description Dlink 协议
 * @docs-api https://dev.iotn2n.com/dgiot_swagger/#/Protocol/get_protocol
 */
/**
 * @description /protocol 获取协议列表
 * @returns {Promise<*>}
 */
import request from '@/utils/request/request'
export async function getProtocol() {
  return request({
    url: `/protocol`,
    method: 'get',
    headers: {
      accept: 'application/json',
    },
  })
}
