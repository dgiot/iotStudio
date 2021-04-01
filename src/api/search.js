const data = [
  {
    url: 'https://www.iotn2n.com',
    value: '杭州数蛙-一站式物联网PaaS平台|物联网应用服务|杭州数蛙',
  },
  {
    url: 'https://tech.iotn2n.com/',
    value: '数蛙技术团队',
  },
  {
    url: process.env.VUE_APP_server,
    value: process.env.VUE_APP_TITLE,
  },
]

//const serverURL = "https://vab-unicloud-3a9da9.service.tcloudbase.com";
//const apiURL = "/search/getList";

export function getList() {
  return {
    code: 200,
    msg: 'success',
    data,
  }
}
