// * @Author: h7ml
// * @Date: 2021-08-24 10:02:54
// * @LastEditors: h7ml
// * @LastEditTime: 2021-08-24 10:02:54
// * @Description:
// * @FilePath: src\api\Data\index.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/Data
import request from '@/utils/request/request'

export async function post_tree(params) {
  return request({
    url: 'tree',
    method: 'post',
    data: params,
  })
}
