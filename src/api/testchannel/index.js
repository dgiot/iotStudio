import request from '@/utils/Request/request'

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
