import request from '@/utils/request'

export function Upload(node, country, province, city, path) {
  return request({
    url: '/vconcentrator/import_data',
    method: 'post',
    data: {
      node: node,
      country: country,
      province: province,
      city: city,
      path: path,
    },
  })
}
export function addmeterforuser(meterdata) {
  return request({
    url: '/yhgx',
    method: 'post',
    data: {
      yhabh: meterdata.yhabh,
      ccbh: meterdata.ccbh,
      vcaddr: meterdata.vcaddr,
      pn: parseInt(meterdata.pn),
      addr: meterdata.addr,
      organization: meterdata.organization,
      city: meterdata.city,
      country: meterdata.country,
      province: meterdata.province,
      mod: meterdata.mod,
      version: meterdata.version,
    },
  })
}
export function CountAll(path) {
  return request({
    url: '/count/' + path,
    method: 'get',
    data: {},
  })
}
