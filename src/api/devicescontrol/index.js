import request from '@/utils/request/request'

export function Pumpcontrol(addr, action, reportId) {
  return request({
    url: '/pump/device/' + addr + '',
    method: 'post',
    params: {
      action: action,
    },
    data: {
      reportId: reportId,
    },
  })
}

export function Pumpcurverdata(reportId, type, draw_type) {
  return request({
    url: '/pump/report/actual',
    method: 'get',
    params: {
      reportId: reportId,
      type: type,
      draw_type: draw_type,
    },
  })
}

// 获取平均值
export function getaveragedata(reportId, type, start, end) {
  return request({
    url: '/pump/data/average',
    method: 'put',
    params: {
      reportId: reportId,
      type: type,
      start: start,
      end: end,
    },
  })
}

export function CloundFile(objectid) {
  return request({
    url: '/pump/cloud_file',
    method: 'get',
    params: {
      objectid,
    },
  })
}

export function livestream(app, stream, endtime) {
  return request({
    url: '/pump/livestream',
    method: 'get',
    params: {
      app: app,
      stream: stream,
      endtime: endtime,
    },
  })
}
