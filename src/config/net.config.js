/**
 * @description 导出网络配置
 **/
module.exports = {
  // 默认的接口地址，开发环境和生产环境走/mock-server
  // 当然你也可以选择自己配置成需要的接口地址，如"https://api.xxx.com"
  // 问号后边代表开发环境，冒号后边代表生产环境
  // baseURL:
  //   process.env.NODE_ENV === 'development' ? '/mock-server' : '/mock-server',
  baseURL: 'iotapi',
  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json',
  // 最长请求时间
  requestTimeout: 1000 * 10,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, 201, 204, '200', '0', '201', '204'],
  // 数据状态的字段名称
  statusName: 'code',
  // 状态信息的字段名称
  messageName: 'msg',
  // 服务器代理地址
  proxyUrl: 'https://prod.iotn2n.com',
}
