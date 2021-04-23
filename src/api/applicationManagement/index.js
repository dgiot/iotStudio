import request from '@/utils/request'
// 上传图片
export function Upload({ file }) {
  return request({
    url: '/upload',
    method: 'post',
    params: {
      file,
    },
  })
}

// 获取行业信息
export function getIndustry({ order, limit, skip, keys, include, where }) {
  return request({
    url: 'iotapi/classes/Datas',
    method: 'get',
    params: {
      order,
      limit,
      skip,
      keys,
      include,
      where,
    },
  })
}

// 查询应用信息
export function getProject({ order, limit, skip, keys, include, where }) {
  return request({
    url: `/classes/Project`,
    method: 'get',
    params: {
      order,
      limit,
      skip,
      keys,
      include,
      where,
    },
  })
}

// 添加应用信息
export function addApp(body) {
  return request({
    url: `/classes/App`,
    method: 'post',
    data: {
      ACL: {
        'role:admin': {
          read: true,
          write: true,
        },
        'role:root': {
          read: true,
          write: true,
        },
        '*': {
          read: true,
          write: true,
        },
      },
      copyright: body.copyright,
      title: body.name,
      config: {
        expires: body.expires,
      },
      secret: body.secret,
      scale: body.scale,
      category: body.category,
      productIdentifier: body.productIdentifier,
      logo: body.img,
      desc: body.desc,
      background: body.background,
    },
  })
}

// 修改工程信息
export function updateApp(id, body) {
  return request({
    url: `/classes/App/${id}`,
    method: 'put',
    data: {
      copyright: body.copyright,
      title: body.name,
      config: {
        expires: body.expires,
      },
      dashboard: body.dashboard,
      secret: body.secret,
      scale: body.scale,
      category: body.category,
      productIdentifier: body.productIdentifier,
      logo: body.img,
      desc: body.desc,
      background: body.background,
    },
  })
}

// 万亿零转换
export function handleZero(value) {
  // console.log(value);
  // console.log(typeof(value));
  if (typeof value === 'number') {
    value = String(value)
    const Y = /0{8}$/
    const W = /0{4}$/
    if (Y.test(value)) {
      return value.replace(Y, '亿')
    } else if (W.test(value)) {
      return value.replace(W, '万')
    }
    return value
  } else if (typeof value === 'string') {
    const W = /万+$/
    const Y = /亿+$/
    if (Y.test(value)) {
      return value.replace(Y, '00000000')
    } else if (W.test(value)) {
      return value.replace(W, '0000')
    }
    return value
  }
}
export function uploadLicense(appid, appsecret, shuwa_iot_software) {
  return request({
    url: `/lictool`,
    method: 'get',
    params: {
      appid: appid,
      appsecret: appsecret,
      shuwa_iot_software: shuwa_iot_software,
    },
  })
}
export function uploadServer(license) {
  return request({
    url: `/licsetup`,
    method: 'get',
    params: {
      license: license,
    },
  })
}
export function offlineServer(license) {
  return request({
    url: `/licupdate`,
    method: 'get',
    params: {
      license: license,
    },
  })
}
export function setUpLictool(appname) {
  return request({
    url: '/iotapp',
    method: 'post',
    data: {
      appname: appname,
    },
  })
}
