// * @Author: h7ml
// * @Date: 2021-08-24 10:02:54
// * @LastEditors: vivi
// * @LastEditTime: 2021-08-24 10:02:54
// * @Description:
// * @FilePath: src\api\Data\index.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/Data
import {
  query_object,
  get_object,
  del_object,
  update_object,
  create_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'
export async function post_tree(params) {
  return request({
    url: 'tree',
    method: 'post',
    data: params,
  })
}
