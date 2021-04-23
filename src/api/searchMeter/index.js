import request from '@/utils/request'

export function SearchMeter(vcaddr, route, session, operation) {
  return request({
    url: '/research',
    method: 'put',
    params: {
      devaddr: vcaddr,
      route,
      session,
      operation,
    },
  })
}
export function AuthMeter(addrs, auth) {
  return request({
    url: '/change_status',
    method: 'put',
    data: {
      addrs: addrs,
    },
    params: {
      auth: auth,
    },
  })
}
