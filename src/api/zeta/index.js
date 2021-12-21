import request from '@/utils/Request/request'

export function ZetaEtag(tag, status) {
  return request({
    url: 'zeta/etag/' + tag,
    method: 'get',
    params: {
      status: status,
    },
  })
}

export function ZetaEtagHistroy(tag, limit, timestamp) {
  return request({
    url: 'zeta/etag/history/' + tag,
    method: 'get',
    params: {
      limit: limit,
      timestamp: timestamp,
    },
  })
}

export function ZetaEtagTopn(limit, skip, status) {
  return request({
    url: 'zeta/etag/tag/topn',
    method: 'get',
    params: {
      limit: limit,
      skip: skip,
      status: status,
    },
  })
}
