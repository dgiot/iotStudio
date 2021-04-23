import request from '@/utils/request'
// 获取模板
export function getReport(start, len) {
  return request({
    url: '/pump/templet?dataType=pump_report&start=' + start + '&len=' + len,
    method: 'GET',
    data: {},
  })
}
export function getReportdetail(id) {
  return request({
    url: '/pump/templet/' + id + '',
    method: 'GET',
    data: {},
  })
}
// 新增模板
export function addReport(reportdata, id) {
  return request({
    url: '/pump/templet',
    method: 'POST',
    data: {
      data: reportdata,
      id: id,
      dataType: 'pump_report',
    },
  })
}

export function getModule() {
  return request({
    url: '/pump/templet?dataType=pump_report&start=0&len=1000',
    method: 'GET',
    data: {},
  })
}
export function deriveReport(reportId) {
  return request({
    url: '/pump/report/config?reportId=' + reportId,
    method: 'GET',
    data: {},
  })
}
