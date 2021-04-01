import request from '@/utils/request'

//const serverURL = "https://vab-unicloud-3a9da9.service.tcloudbase.com";
//const apiURL = "/notice/getList";

export function getList() {
  return request({
    url: 'schema/Notification',
    method: 'get',
  })
}
