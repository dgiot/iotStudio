import request from '@/utils/request/request'

export function resourceLicense() {
  return request({
    url: 'license',
    method: 'get',
  })
}
export function importLicense(file) {
  let formData = new FormData()
  // formData.append('className', className)
  formData.append('file', file)
  // console.log('formdata', formData, className, file)
  return request({
    url: 'license',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json',
    },
    data: formData,
  })
  // return request({
  //   url:'license',
  //   method:'post',
  //   header:{
  //     'Content-Type': 'multipart/form-data'
  //   }
  // })
}
export function resourceTypes() {
  return request({
    url: 'resource_types',
    method: 'get',
    params: {},
  })
}

export function putResourceTypes(data) {
  return request({
    url: 'resource_types',
    method: 'put',
    data,
  })
}

export function get_actions() {
  return request({
    url: 'actions',
    method: 'get',
  })
}

export function get_resources() {
  return request({
    url: 'resources',
    method: 'get',
  })
}

export function get_rule_id(id) {
  return request({
    url: `rule/${id}`,
    method: 'get',
  })
}

export function put_rule_id(id, data) {
  return request({
    url: `rule/${id}`,
    method: 'put',
    data: data,
  })
}

export function addRule(data) {
  // actions, ctx, description, _for, name, rawsql
  return request({
    url: 'rules',
    method: 'post',
    // data: {
    //   actions: actions,
    //   ctx: ctx,
    //   description: description,
    //   for: _for,
    //   name: name,
    //   rawsql: rawsql,
    // },
    data: data,
  })
}

export function getRule() {
  return request({
    url: 'rules',
    method: 'get',
    params: {},
  })
}

export function getRuleDetail(id) {
  return request({
    url: 'rule/' + id,
    method: 'get',
    params: {},
  })
}

export function ruleDelete(id) {
  return request({
    url: 'rule/' + id,
    method: 'delete',
    params: {},
  })
}

export function getActions() {
  return request({
    url: 'rule_actions',
    method: 'get',
    params: {},
  })
}

export function getResource() {
  return request({
    url: 'rule_resource',
    method: 'get',
    params: {},
  })
}

export function postResource(config, description, name, type) {
  return request({
    url: 'rule_resource',
    method: 'post',
    data: {
      config: config,
      description: description,
      name: name,
      type: type,
    },
  })
}

export function ruleTest(actions, ctx, description, forname, name, rawsql) {
  return request({
    url: 'rule_test',
    method: 'post',
    data: {
      actions: actions,
      ctx: ctx,
      description: description,
      for: forname,
      name: name,
      rawsql: rawsql,
    },
  })
}

/**
 * [export description]
 *
 * @param   {[type]}  params  [params description]
 *
 * @return  {[type]}          [return description]
 */
export function sqlTpl(params) {
  return request({
    url: 'rulesql',
    method: 'post',
    data: params,
  })
}
