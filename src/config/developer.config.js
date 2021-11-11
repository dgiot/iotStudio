/**
 * @description 由于dgiot开源平台和项目地址代理api不一致，可以将项目配置文件放在以下
 */
module.exports = {
  proxy: [
    {
      path: 'iotapi',
      target: 'http://pump.dgiotcloud.com:5075',
    },
    {
      path: 'group1',
      target: 'http://prod.iotn2n.com:1250',
    },
    {
      path: 'dgiot_file',
      target: 'http://prod.iotn2n.com',
    }
  ],
}
