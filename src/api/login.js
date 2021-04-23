/* eslint-disable space-before-blocks */
import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: JSON.stringify({
      username,
      password,
    }),
  })
}
export function gettables(vcaddr, start, length, draw) {
  return request({
    url: '/data_source/DLT645/vcons',
    method: 'get',
    params: {
      draw: draw,
      'search[regex]': vcaddr,
      start: start,
      length: length,
    },
  })
}

export function gettables1(vcaddr, start, length, draw) {
  return request({
    url: '/data_source/DLT645/devs',
    method: 'get',
    params: {
      draw,
      'search[regex]': vcaddr,
      start,
      length,
    },
  })
}
export function makesure(vcaddr, data) {
  return request({
    method: 'post',
    url: '/edit_vcon',
    data: {
      config: data,
      vcaddr: vcaddr,
    },
  })
}
export function startcon(addrs) {
  return request({
    method: 'post',
    url: '/start_dev?type=DLT645&key=vcons',
    data: {
      addrs: addrs,
    },
  })
}
export function stopcon(addrs) {
  return request({
    method: 'post',
    url: '/stop_dev?type=DLT645&key=vcons',
    data: {
      addrs: addrs,
    },
  })
}
export function submittime(time, vcaddrs) {
  return request({
    method: 'post',
    url: '/change_time',
    data: {
      time: time,
      vcaddrs: vcaddrs,
    },
  })
}
export function getcondetail(start, length, condition, draw) {
  return request({
    method: 'post',
    url: '/dba/task_statistics',
    data: {
      start: start,
      length: length,
      draw: draw,
      condition,
    },
  })
}
export function startconnect(vcaddr) {
  return request({
    method: 'post',
    url: '/start_connect',
    data: {
      vcaddr: vcaddr,
    },
  })
}
export function detailforcon(start, length, vcaddr, draw) {
  return request({
    method: 'get',
    url: '/data_source/DLT645/devs',
    params: {
      start: start,
      length: length,
      vcon: vcaddr,
      draw: draw,
    },
  })
}
export function getmeterinfo(addr) {
  return request({
    url: '/data_source/DLT645/devs',
    method: 'get',
    params: {
      'search[regex]': addr,
    },
  })
}
// shuwa_device/data_source?node=' + node+'&key=devs&type=VMOTE
// 进入二采详情
export function getdevsreport(start, length, draw, devsreport) {
  return request({
    url: '/data_source/VMOTE/devs',
    method: 'get',
    params: {
      draw: draw,
      'search[regex]': devsreport,
      start: start,
      length: length,
    },
  })
}
export function searchdevs(devsreport, start, length, draw) {
  return request({
    url: '/data_source/VMOTE/devs',
    method: 'get',
    params: {
      draw: draw,
      'search[regex]': devsreport,
      start: start,
      length: length,
    },
  })
}
// 智能电表
// export function getmetersearch(value, start, length, draw) {
//   return request({
//     url: '/data_source/MSC/devs',
//     method: 'get',
//     params: {
//       draw: draw,
//       type:'DLT645',
//       key:'devs',
//       'search[regex]': value,
//       start: start,
//       length: length
//     }
//   })
// }
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token },
  })
}

export function logoutBtn() {
  return request({
    url: '/user/logout',
    method: 'post',
    // headers: {
    //   Authorization: "Logout 123456789"
    // }
  })
}
export function addcon(config) {
  return request({
    url: '/add_vcon',
    method: 'post',
    data: {
      config: config,
    },
  })
}
export function passwordreset(account, code, password) {
  return request({
    url: '/verify_code/passwordreset',
    method: 'post',
    params: {
      account: account,
      code: code,
    },
    data: {
      password: password,
    },
  })
}
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h =
    (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() + 1 <= 10
      ? '0' + date.getMinutes()
      : date.getMinutes()) + ':'
  var s =
    date.getSeconds() + 1 <= 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
export function unixtime() {
  var date = new Date()
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  if (s > 9) {
    s = date.getSeconds()
  } else {
    s = '0' + date.getSeconds()
  }
  return Y + M + D + h + m + s
}

export function timetounix(val) {
  var nowTime = val
  var date = new Date(nowTime)
  var time = date.getTime()
  time = time / 1000
  return time
}
export function Phonelogin(phone, nationcode) {
  return request({
    url: '/sendsms?account=' + phone + '&nationcode=' + nationcode,
    method: 'post',
    data: {},
  })
}
export function Verify(actions, phone, code) {
  return request({
    url: '/verify_code/' + actions + '?account=' + phone + '&code=' + code,
    method: 'post',
    data: {},
  })
}
export function UpdatedMenu(role, menus) {
  return request({
    url: '/add_menu',
    method: 'put',
    data: {
      role: 'role:' + role,
      items: menus,
    },
  })
}
export function UpdatedRole(role, roles) {
  return request({
    url: '/add_permission',
    method: 'put',
    data: {
      role: 'role:' + role,
      items: roles,
    },
  })
}
export function Sitepro(pro) {
  return request({
    url: 'iotapi/classes/Site/' + pro,
    method: 'get',
    data: {},
  })
}
// export function sessionme() {
//   return request({
//     method: 'get',
//     url: '/session/me',
//     data: {}
//   })
// }
export function utc2beijing(utc_datetime) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  var date = new Date(utc_datetime)
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D =
    (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h =
    (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m =
    (date.getMinutes() + 1 <= 10
      ? '0' + date.getMinutes()
      : date.getMinutes()) + ':'
  var s =
    date.getSeconds() + 1 <= 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
