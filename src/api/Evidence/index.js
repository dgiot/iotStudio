/*
 * @Author:h7ml
 * @Date: 2021-11-25 21:26:17
 * @LastEditors:
 * @LastEditTime:2021-11-25 21:26:17
 * @Description:
 * @FilePath: src/api/Evidence/index.js
 * @DocumentLink: https://prod.iotn2n.com/dgiot_swagger/#/Evidence
 */
import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request'
export async function queryEvidence(params) {
  return query_object('Evidence', params)
}
/**
 * @doc-api https://prod.iotn2n.com/dgiot_swagger/#/Evidence/get_evidence
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function getEvidence(ObjectId) {
  return get_object('Evidence', ObjectId)
}
/**
 * @doc-api https://prod.iotn2n.com/dgiot_swagger/#/Evidence/delete_classes_evidence_id
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function delEvidence(ObjectId) {
  return del_object('Evidence', ObjectId)
}
/**
 * @doc-api https://prod.iotn2n.com/dgiot_swagger/#/Evidence/put_classes_evidence_id
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function putEvidence(ObjectId, params) {
  return update_object('Evidence', ObjectId, params)
}
/**
 * @doc-api https://prod.iotn2n.com/dgiot_swagger/#/Evidence/post_evidence
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function postEvidence(id, params) {
  return request({
    url: `evidence/?id=${id}`,
    method: 'post',
    data: params,
  })
}

/**
 * @doc-api http://pump.dgiotcloud.com/dgiot_swagger/#/Evidence/post_generatereport
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 */
export async function generatereport(id) {
  return request({
    url: `generatereport?id=${id}`,
    method: 'post',
  })
}

/**
 * @doc-api http://pump.dgiotcloud.com/dgiot_swagger/#/Evidence/post_drawxnqx
 * @param params
 * @return {Promise<*|ElMessageComponent>}
 * @description 生成性能曲线图
 */
export async function postDrawxnqx(params) {
  return request({
    url: 'drawxnqx',
    method: 'post',
    data: params,
  })
}
