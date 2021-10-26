/**
 * @description 由于dgiot开源平台和项目地址代理api不一致，可以将项目配置文件放在以下
 */
module.exports = {
  proxy: [
    {
      path: 'iotapi',
      target: 'http://cad.iotn2n.com',
    },
    {
      path: 'group1',
      target: 'http://prod.iotn2n.com:1250',
    },
    {
      path: 'group2',
      target: 'http://prod.iotn2n.com:8012',
    },
  ],
}
