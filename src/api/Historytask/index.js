import request from '@/utils/request/request'

export function Historytask(start, length, di, datetime, searchvalue) {
  return request({
    url: '/shuwa_task/historyVcaddr',
    method: 'get',
    params: {
      node: null,
      start: start,
      length: length,
      di: di,
      datetime: datetime,
      'search[value]': searchvalue,
    },
  })
}

export function Historydi() {
  return request({
    url: '/shuwa_task/diList',
    method: 'get',
  })
}

export function Histoymeterdetail(node, di, datetime, vcaddr) {
  return request({
    url: 'shuwa_task/historyMeter',
    method: 'get',
    params: {
      node: node,
      di: di,
      datetime: datetime,
      vcaddr: vcaddr,
    },
  })
}

export function Diselect() {
  return request({
    url: '/shuwa_task/diList',
    method: 'get',
    data: {},
  })
}

export function Alltasks(start, length, draw, searchvalue) {
  return request({
    url: '/shuwa_task/task',
    method: 'get',
    params: {
      start: start,
      length: length,
      draw: draw,
      'search[value]': searchvalue,
    },
  })
}

export function Addtasks(
  name,
  frozendate,
  downchannel,
  starttime,
  endtime,
  meter,
  freq,
  unit,
  upchannel
) {
  return request({
    url: '/shuwa_task/task',
    method: 'post',
    data: {
      name: name,
      frozendate: frozendate,
      downchannel: downchannel,
      starttime: starttime,
      endtime: endtime,
      meter: meter,
      freq: freq,
      unit: unit,
      upchannel: upchannel,
    },
  })
}

export function Taskdetail(start, length, tid, rid, starttime, freq, search) {
  return request({
    url: '/shuwa_task/vcaddr',
    method: 'get',
    params: {
      start: start,
      length: length,
      tid: tid,
      rid: rid,
      starttime: starttime,
      freq: freq,
      search: search,
    },
  })
}

export function Taskmeterdetail(tid, rid, starttime, vcaddr, freq, fdate, di) {
  return request({
    url: 'shuwa_task/meter',
    method: 'get',
    params: {
      tid: tid,
      rid: rid,
      starttime: starttime,
      vcaddr: vcaddr,
      freq: freq,
      fdate: fdate,
      di: di,
    },
  })
}

export function Removetask(id) {
  return request({
    url: '/shuwa_task/task',
    method: 'DELETE',
    data: {
      id: id,
    },
  })
}

// 抄表
export function Supporttask(data) {
  return request({
    url: '/shuwa_task/readMeter',
    method: 'post',
    data: {
      datetime: data.datetime,
      di: data.di,
      pn: data.pn,
      taskid: data.taskid,
      vcaddr: data.vcaddr,
      tattr: data.tattr,
    },
  })
}
