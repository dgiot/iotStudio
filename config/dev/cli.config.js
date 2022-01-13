/**
 * @description 导出vue/cli配置 开发板
 */
module.exports = {
  // 开发以及部署时的URL
  // hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"
  // history模式默认使用"/"或者"/二级目录/"，记住只有hash时publicPath可以为空！！！
  publicPath: './', //https://www.cnblogs.com/lemoncool/p/10876407.html
  // 生产环境构建文件的目录名
  outputDir: 'dev',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 进行编译的依赖
  transpileDependencies: ['resize-detector'],
  // 开发环境端口号
  devPort: '80',
  // 需要自动注入并加载的模块
  providePlugin: {},
  // npm run build时是否自动生成7z压缩包
  build7z: false,
  // npm run build时是否生成gzip
  buildGzip: true,
  // npm run build时是否开启图片压缩，由于国内网路原因image-webpack-loader必须使用cnpm安装，如无法使用cnpm，请配置false
  imageCompression: false,
  // 是否启用cdn，如果不启用。则将cdn资源文件下载到本地，并替换引入资源地址。
  useCdn: true,
  // 忽略cdn下载的文件关键字
  ignoreCdn: ['php', 'bugtags', '1279876845', 'qq'],
  // iconfront 的id //
  iconfontId: ['font_2759556_r8d9wroaw8'],
  // 是否开启 SpeedMeasurePlugin 打包速度输出日志插件
  isSmp: false,
  // 代理后的文件地址
  CDN_URL: '/dgiot_dashboard/public',
  // cdn资源文件 https://blog.csdn.net/qq_37210523/article/details/106267946
  CDN: '//dgiot.netlify.app', // '//1.117.219.248:1250/group1/dgiot_dashboard'
}
