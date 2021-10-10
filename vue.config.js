/**
 * release
 */
// prod /data/dgiot/lib/dgiot_api-4.3.0/priv/www
// flow /data/dgiot/lib/dgiot_api-1.6.4/priv/www
// local D:\msys64\home\vivi\dgiot_dashboard\dist

/**
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
  buildGzip,
  imageCompression,
  webpackBanner,
  webpackBarName,
  cdnUrl,
  localUrl,
  Keywords,
  Description,
  dateTime,
  proxy,
  useCdn,
  isPwa,
  pwaConfig,
  isSmp,
} = require('./src/config')
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = author
process.env.VUE_APP_UPDATE_TIME = dateTime
process.env.VUE_APP_VERSION = version
process.env.VUE_APP_Keywords = Keywords
process.env.VUE_APP_Description = Description
process.env.VUE_APP_URL = proxy[0].target
process.env.proxy = proxy
function getChainWebpack(config) {
  config.plugin('html').tap((args) => {
    var _staticUrl = useCdn || process.env.useCdn ? cdnUrl : localUrl
    // if (useCdn || process.env.NODE_ENV !== 'development') {
    const { css, js } = _staticUrl
    _staticUrl = { css: [], js: [] }
    css.forEach((_css) => {
      let i =
        _css.substring(_css.lastIndexOf('/') + 1).indexOf('.css') != -1
          ? `/assets/css/${_css.substring(_css.lastIndexOf('/') + 1)}`
          : `/assets/css/${_css.substring(_css.lastIndexOf('/') + 1)}.css`
      _staticUrl.css.push(i)
    })
    js.forEach((_js) => {
      let i =
        _js.substring(_js.lastIndexOf('/') + 1).indexOf('.js') != -1
          ? `/assets/js/${_js.substring(_js.lastIndexOf('/') + 1)}`
          : `/assets/js/${_js.substring(_js.lastIndexOf('/') + 1)}.js`
      _staticUrl.js.push(i)
    })
    args[0].staticUrl = _staticUrl
    return args
  })
  config.resolve.symlinks(true)
  config.module.rule('svg').exclude.add(resolve('src/icon'))
  config.module
    .rule('vabIcon')
    .test(/\.svg$/)
    .include.add(resolve('src/icon'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'vab-icon-[name]',
    })
  config.when(process.env.NODE_ENV === 'development', (config) => {
    config.devtool('source-map')
  })
  // https://blog.csdn.net/weixin_34294049/article/details/97278751
  config.when(process.env.NODE_ENV === 'production', (config) => {
    config.performance.set('hints', false)
    config.plugins.delete('prefetch')
    config.devtool('none')
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 30000, //字节 引入的文件大于300kb才进行分割
      maxSize: 700000, //700kb，尝试将大于700kb的文件拆分成n个700kb的文件
      minChunks: 1, // 模块的最小被引用次数
      maxAsyncRequests: 5, // 按需加载的最大并行请求数
      maxInitialRequests: 3, // 一个入口最大并行请求数
      automaticNameDelimiter: '-dgiot-', // 文件名的连接符
      cacheGroups: {
        libs: {
          name: 'libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
        elementUI: {
          name: 'element',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
        },
      },
    })
    config
      .plugin('banner')
      .use(Webpack.BannerPlugin, [`${webpackBanner}${dateTime}`])
    if (imageCompression)
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true,
        })
        .end()
    if (buildGzip)
      // https://blog.csdn.net/weixin_42164539/article/details/110389256
      config.plugin('compression').use(CompressionWebpackPlugin, [
        {
          filename: '[path][base].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 8192,
          minRatio: 0.8,
        },
      ])
    if (build7z)
      config.plugin('fileManager').use(FileManagerPlugin, [
        {
          events: {
            onEnd: {
              archive: [
                {
                  source: `./${outputDir}`,
                  destination: `./${outputDir}/${abbreviation}_${dateTime}.zip`,
                },
              ],
            },
          },
        },
      ])
  })
}
const resolve = (dir) => {
  return path.join(__dirname, dir)
}
const proxyStatic = {}
const cssExport = {
  requireModuleExtension: true,
  sourceMap: true,
  loaderOptions: {
    scss: {
      additionalData(content, loaderContext) {
        const { resourcePath, rootContext } = loaderContext
        const relativePath = path.relative(rootContext, resourcePath)
        if (
          relativePath.replace(/\\/g, '/') !==
          'src/vab/styles/variables/variables.scss'
        )
          return '@import "~@/vab/styles/variables/variables.scss";' + content
        return content
      },
    },
  },
  extract: {
    filename: `assets/css/[name].dgiot.css?v=${
      process.env.VUE_APP_VERSION
    }&t=${new Date().getTime()}`,
    chunkFilename: `assets/css/[name].dgiot.css?v=${
      process.env.VUE_APP_VERSION
    }&t=${new Date().getTime()}`,
  },
}
const configure = {
  externals: {
    bcrypt: 'bcrypt',
    'be-full': 'BeFull',
    JSONEditor: 'JSONEditor',
    AMap: 'VueAMap',
    'topology-vue': 'topology',
    konva: 'Konva',
    VCharts: 'v-charts',
    'vue-count-to': 'CountTo',
    'vue-konva': 'VueKonva',
    mockjs: 'Mock',
    'js-md5': 'md5',
    'js-base64': 'Base64',
    $: 'jquery',
    ace: 'ace',
    mqtt: 'mqtt',
    'cos-js-sdk-v5': 'COS',
    'paho-mqtt': 'paho',
    Sortable: 'Sortable',
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    clipboard: 'clipboard',
    lodash: 'lodash',
    'vue-i18n': 'VueI18n',
    XLSX: 'xlsx',
    colors: 'colors',
    FileSaver: 'file-saver',
    'js-cookie': 'Cookies',
    'vue-baidu-map': 'VueBaiduMap',
    echarts: 'echarts',
    screenfull: 'screenfull',
    qs: 'qs',
    moment: 'moment',
    jsplumb: 'jsplumb',
    JSEncrypt: 'jsencrypt',
    CodeMirror: 'codemirror',
    nprogress: 'NProgress',
    'vue-codemirror': 'vueCodemirror',
    vuedraggable: 'vuedraggable',
    'element-china-area-data': 'elementChinaAreaData',
    'vue-flv-player': 'vueFlvPlayer',
    'ezuikit-js': 'EZUIKit',
    fuzzy: 'fuzzy',
    'vue-aliplayer-v2': 'VueAliplayerV2',
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '*': resolve(''),
    },
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new Webpack.ProvidePlugin(providePlugin),
    new WebpackBar({
      name: webpackBarName,
    }),
    // new MiniCssExtractPlugin({
    //   // 修改打包后css文件名
    //   filename: `assets/css/[name].dgiot.css `,
    //   chunkFilename: `assets/css/[name].dgiot.css`,
    // }),
  ],
  output: {
    // 输出重构  打包编译后的 文件名称  【模块名称.版本号】
    filename: `assets/js/[name].dgiot.js?v=${
      process.env.VUE_APP_VERSION
    }&t=${new Date().getTime()}`,
    chunkFilename: `assets/js/[name].dgiot.js?v=${
      process.env.VUE_APP_VERSION
    }&t=${new Date().getTime()}`,
  },
}
const pwa = isPwa ? pwaConfig : {}
proxy.forEach((url) => {
  proxyStatic[`${url.path}`] = {
    target: url.target,
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      ['^' + `${url.path}`]: '',
    },
  }
})
const devServer = {
  hot: true,
  port: devPort,
  open: true,
  noInfo: false,
  overlay: {
    warnings: true,
    errors: true,
  },
  proxy: proxyStatic,
}
const configureWebpack = isSmp ? smp.wrap(configure) : configure
module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer,
  pwa,
  configureWebpack,
  chainWebpack(config) {
    return getChainWebpack(config)
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: cssExport,
}
