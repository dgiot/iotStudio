import request from '@/utils/request/request'

export function list_dir(path) {
  return request({
    url: 'list_dir',
    method: 'get',
    params: {
      path: path,
    },
  })
}

export function file_info(path) {
  return request({
    url: 'file_info',
    method: 'get',
    params: {
      path: path,
    },
  })
}

export function delete_file(path) {
  return request({
    url: 'file_info',
    method: 'DELETE',
    params: {
      path: path,
    },
  })
}

// export function joinNode(action, node) {
//   return request({
//     url: 'cluster?action=' + action,
//     method: 'post',
//     data: {
//       node: node,
//     },
//   })
// }
