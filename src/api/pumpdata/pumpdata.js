import request from '@/utils/request'

export function pumpcurve(reportId, type) {
  return request({
    url: '/shuwa_pump/get_actual_data_report',
    method: 'post',
    data: {
      reportId: reportId,
      type: type,
      draw_type: 'curve',
    },
  })
}

export function Filedata(objectid) {
  return request({
    url: '/file/cloud_file?objectid=' + objectid,
    method: 'post',
    data: {},
  })
}

export function updateFile() {
  return request({
    url: '/file/signature?type=aliyun',
    method: 'get',
    params: {},
  })
}
