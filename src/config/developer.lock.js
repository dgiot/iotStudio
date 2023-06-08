/**
 * @description 由于dgiot开源平台和项目地址代理api不一致，可以将项目配置文件放在以下。代理链接后面不要写/
 */
module.exports = {
  proxy: [
    /**
     * @description iotapi 联调接口。开发使用
     */
    {
      path: 'iotapi',
      target: 'http://127.0.0.1:5080',
    },
    /**
     * @description 静态资源目录。开发使用
     */
    {
      path: 'dgiot_dashboard',
      target: 'http://127.0.0.1:5080',
    },
    /**
     * @description dgiot_file文件资源目录。开发使用
     */
    {
      path: 'dgiot_file',
      target: 'http://127.0.0.1:5080',
    },
    /**
     * @description amis server 开发使用
     */
    {
      path: 'baidubce',
      target: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock',
    },
    {
      path: 'amis',
      target: 'https://aisuda.bce.baidu.com/amis/api/mock2',
    },
  ],
}
