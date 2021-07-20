/**
 * @description 导出网络配置
 **/
var proxy = [
  {
    path: 'iotapi',
    target: 'http://prod.iotn2n.com',
  },
  {
    path: 'group1',
    target: 'http://prod.iotn2n.com:1250',
  },
  {
    path: 'group2',
    target: 'http://prod.iotn2n.com:8012',
  },
]
if (process.env.NODE_ENV == 'development') {
  const developer = require('./developer.config')
  proxy = developer.proxy
}
module.exports = {
  // 默认的接口地址，开发环境和生产环境走/mock-server
  // 当然你也可以选择自己配置成需要的接口地址，如"https://api.xxx.com"
  // 问号后边代表开发环境，冒号后边代表生产环境
  // baseURL:
  //   process.env.NODE_ENV === 'development' ? '/mock-server' : '/mock-server',
  // 多个代理
  proxy,
  baseURL: proxy[0].path,
  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json',
  // 最长请求时间
  requestTimeout: 1000 * 1 * 30,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, 201, 204, '200', '0', '201', '204'],
  // 操作失败code，支持String、Array、int多种类型
  errorCode: [401, 209, '209', '401'],
  // 数据状态的字段名称
  statusName: 'code',
  // 状态信息的字段名称
  messageName: 'msg',
  // code massage
  CODE_MESSAGE: {
    200: '服务器成功返回请求数据',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队(异步任务)',
    204: '删除数据成功',
    400: '发出信息有误',
    401: '用户没有权限(令牌、用户名、密码错误)',
    403: '用户得到授权，但是访问是被禁止的',
    404: '访问资源不存在',
    406: '请求格式不可得',
    410: '请求资源被永久删除，且不会被看到',
    500: '服务器发生错误',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
  },
}
