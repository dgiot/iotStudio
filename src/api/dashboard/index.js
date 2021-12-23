import request from '@/utils/request/request'

export async function Startdashboard(data) {
  return request({
    url: `dashboard`,
    method: 'post',
    data: data,
  })
}
