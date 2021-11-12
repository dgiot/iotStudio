import request from '@/utils/request'

// 上传表格
export function Upload(data) {
  return request({
    url: '/yhgx/transaction/add',
    method: 'post',
    data: {
      addr: data.addr_web,
      appeui: data.appeui,
      deveui: data.deveui,
      num: data.num,
      organization: data.organization,
      others: data.others,
      pn: data.pn,
      vcaddr: data.vcaddr_web,
      yhabh: data.yhabh,
    },
  })
}

// 数据回滚
export function RollBack(data) {
  return request({
    url: '/yhgx/transaction/rollback',
    method: 'post',
    data: {
      data,
    },
  })
}

// 校验
export function Verify(data) {
  return request({
    url: '/yhgx/transaction/check',
    method: 'post',
    data: {
      data,
    },
  })
}

// 查看状态
export function State() {
  return request({
    url: '/yhgx/transaction/state',
    method: 'get',
  })
}

// 提交入库
export function Import(data) {
  return request({
    url: '/yhgx/transaction/commit',
    method: 'post',
    data: {
      data,
    },
  })
}
