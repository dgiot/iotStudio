import request from '@/utils/request'

export async function StartDashboard(data) {
  return request({
    url: `dashboard`,
    method: 'post',
    data: data,
  })
}
