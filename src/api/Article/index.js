// * @Author: h7ml
// * @Date: 2021-08-23 18:12:12
// * @LastEditors: h7ml
// * @LastEditTime: 2021-08-23 18:12:12
// * @Description: dgiot doc api
// * @FilePath: src\api\Article\index.js
// * @DocumentLink: http://60.205.104.205/swagger/#/Article
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/Parse'

export async function createArticle(params) {
  return create_object(
    'Article',
    // eslint-disable-next-line no-undef
    _.merge(params, {
      ACL: {
        '*': {
          read: true,
          write: false,
        },
      },
      // timestamp: moment(new Date()).valueOf(),
    })
  )
}

export async function getArticle(ObjectId) {
  return get_object('Article', ObjectId)
}

export async function delArticle(ObjectId) {
  return del_object('Article', ObjectId)
}

export async function putArticle(ObjectId, params) {
  return update_object('Article', ObjectId, params)
}

export async function queryArticle(params) {
  return query_object('Article', params)
}
