import request from '@/utils/Request/request'

export async function Startdashboard(data) {
  return request({
    url: `dashboard`,
    method: 'post',
    data: data,
  })
}
