import {
  create_object,
  del_object,
  get_object,
  query_object,
  update_object,
} from '@/api/shuwa_parse'
import request from '@/utils/request/request'

export async function queryChannel(params, method) {
  return query_object('Channel', params, method)
}

export async function getChannel(ObjectId) {
  return get_object('Channel', ObjectId)
}

export async function delChannel(ObjectId) {
  return del_object('Channel', ObjectId)
}

export async function putChannel(ObjectId, params) {
  return update_object('Channel', ObjectId, params)
}

export async function postChannel(params) {
  return create_object('Channel', params)
}

export async function getChannelCountByProduct(
  channellength,
  channelstart,
  product,
  type
) {
  const params = {
    count: 'objectId',
    limit: channellength,
    skip: channelstart,
    where: {
      product: product,
      type: type,
    },
  }
  return query_object('Channel', params)
}

export async function saveChanne(objectid, params) {
  return update_object('Channel', objectid, params)
}

export function channelConnect(
  type,
  host,
  port,
  username,
  password,
  database,
  name,
  sql_length,
  connect,
  ssl
) {
  return request({
    url: '/resource/' + type,
    method: 'post',
    data: {
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      name: name,
      sql_length: sql_length,
      connect: connect,
      ssl: ssl,
    },
  })
}

export function updateConnect(
  objectId,
  host,
  port,
  username,
  password,
  database,
  name,
  sql_length,
  connect,
  ssl,
  isEnable
) {
  return request({
    url: '/resource/edit/' + objectId,
    method: 'put',
    data: {
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      name: name,
      sql_length: sql_length,
      connect: connect,
      ssl: ssl,
      isEnable: isEnable,
    },
  })
}

export function deleteConnect(objectId) {
  return request({
    url: '/resource/edit/' + objectId,
    method: 'delete',
    data: {},
  })
}
