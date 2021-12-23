import request from '@/utils/request/request'

export function Mainstationvalue(
  vcaddr,
  session,
  operation,
  datatype,
  pn_start,
  pn_end,
  starttime,
  endtime,
  route,
  protocol,
  data
) {
  return request({
    url: '/readdata',
    method: 'POST',
    params: {
      from: 'web',
      vcaddr: vcaddr,
      session: session,
      operation: operation,
      datatype: datatype,
      pn_start: pn_start,
      pn_end: pn_end,
      starttime: starttime,
      endtime: endtime,
      route: route,
      protocol: protocol,
    },
    data: {
      dis: data,
    },
  })
}

export function Getlhz(form, session, operation, type) {
  return request({
    url: '/measured_point/control',
    method: 'POST',
    params: {
      vcaddr: form.vcaddr,
      from: 'web',
      session: session,
      operation: operation,
      control: type,
      datatype: form.datatype,
      protocol: form.protocol,
      route: form.route,
      pn: form.pn,
      meteraddr: form.meteraddr,
    },
  })
}
