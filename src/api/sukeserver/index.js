import request from '@/utils/Request/request'

export function addSukeyys(
  name,
  id,
  url,
  para,
  status_url,
  status_para,
  default1
) {
  return request({
    url: '/suke/add_yys',
    method: 'post',
    params: {
      name: name,
      id: id,
      url: url,
      para: para,
      status_url,
      status_para: status_para,
      default: default1,
    },
  })
}

export function searchSuketype(start, length, type) {
  return request({
    url: '/suke/query_info',
    method: 'get',
    params: {
      skip: start,
      limit: length,
      type: type,
    },
  })
}

export function editSukeyys(
  objectId,
  name,
  id,
  url,
  para,
  status_url,
  status_para,
  default1
) {
  return request({
    url: '/suke/edit_yys',
    method: 'put',
    params: {
      objectId: objectId,
      name: name,
      id: id,
      url: url,
      para: para,
      status_url,
      status_para: status_para,
      default: default1,
    },
  })
}

export function addSukedevtype(name, code, remark, status) {
  return request({
    url: '/suke/add_devtype',
    method: 'post',
    params: {
      name: name,
      number: code,
      remark: remark,
      enable: status,
    },
  })
}

export function editorSukedevtype(objectId, name, code, remark, status) {
  return request({
    url: '/suke/edit_devtype',
    method: 'put',
    params: {
      objectId: objectId,
      name: name,
      number: code,
      remark: remark,
      enable: status,
    },
  })
}

// 增加suke指令
export function addSkzl(form) {
  return request({
    url: '/suke/add_zl',
    method: 'post',
    params: {
      hardwareType: form.hardwareType,
      name: form.name,
      nameEncrypt: form.nameEncrypt,
      needReply: form.needReply,
      remark: form.remark,
      enable: form.enable,
    },
  })
}

export function editorSkzl(form) {
  return request({
    url: '/suke/edit_zl',
    method: 'put',
    params: {
      objectId: form.objectId,
      hardwareType: form.hardwareType,
      name: form.name,
      nameEncrypt: form.nameEncrypt,
      needReply: form.needReply,
      remark: form.remark,
      enable: form.enable,
    },
  })
}

// 查询指令
export function queryzlinfo(form, skip, limit) {
  return request({
    url: '/suke/query_zl_info',
    method: 'get',
    params: {
      hardwareType: form.hardwareType,
      name: form.name,
      needReply: form.needReply,
      enable: form.enable,
      skip: skip,
      limit: limit,
    },
  })
}

// 查询设备
export function searchSukeuser(form, skip, limit) {
  return request({
    url: '/suke/query_suke_dev',
    method: 'get',
    params: {
      hardwareType: form.hardwareType,
      customerId: form.customer,
      hardware_number: form.hardware_number,
      status: form.status,
      ol_status: form.ol_status,
      auth: form.auth,
      skip: skip,
      limit: limit,
    },
  })
}

// 查询设备类型
export function querydevinfo(form, skip, limit) {
  return request({
    url: '/suke/query_devtype_info',
    method: 'get',
    params: {
      name: form.name,
      number: form.number,
      enable: form.enable,
      skip: skip,
      limit: limit,
    },
  })
}

export function queryyysinfo(form, skip, limit) {
  return request({
    url: '/suke/query_yys_info',
    method: 'get',
    params: {
      name: form.name,
      id: form.id,
      url: form.url,
      para: form.para,
      skip: skip,
      limit: limit,
    },
  })
}
