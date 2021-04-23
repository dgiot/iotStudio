import request from '@/utils/request'

export function getEcharts(datetime, di, statistics_time) {
  return request({
    url: '/shuwa_task/time_line_chart',
    method: 'post',
    data: {
      datetime: datetime,
      di: di,
      statistics_time: statistics_time,
    },
  })
}
