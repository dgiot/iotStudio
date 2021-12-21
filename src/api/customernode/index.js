import request from '@/utils/Request/request'

export function addCustomer(parentId, name) {
  return request({
    url: '/suke/add_customernode',
    method: 'post',
    params: {
      parentId: parentId,
      name: name,
    },
  })
}
