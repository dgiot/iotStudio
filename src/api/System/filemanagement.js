import request from '@/utils/request/request'

//emicp
export async function getproductTree(params) {
  return request({
    url: `/producttree`,
    method: 'get',
  })
  // return query_object('MetaData', params)
}

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
