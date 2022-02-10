/**
 * release
 */
// prod /data/dgiot/dgiot/lib/dgiot_api-4.3.0/priv/www
// local E:\work\code\dgiot\dgiot-dashboard\dist

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
  systemStatic: localUrl,
  Keywords,
  Description,
  dateTime,
  proxy,
  isPwa,
  pwaConfig,
  isSmp,
  ogConfig,
  CDN_URL,
  CDN,
} = require('./src/config')
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin') // 非汉化
// const MonacoWebpackPlugin = require('monaco-editor-esm-webpack-plugin') // 汉化版
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const smp = new SpeedMeasurePlugin()
// const productionGzipExtensions = ['html', 'js', 'css', 'svg']
const productionGzipExtensions =
  /\.(js|css|json|txt|html|ico|svg|ttf|woff|png|gif|woff|woff2|woff3)(\?.*)?$/i
process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = author
process.env.VUE_APP_UPDATE_TIME = dateTime
process.env.VUE_APP_VERSION = version
process.env.VUE_APP_Keywords = Keywords
process.env.VUE_APP_Description = Description
process.env.VUE_APP_URL = proxy[0].target
process.env.proxy = proxy
// process.env.VUE_APP_CDN_URL = proxy[1].target + CDN_URL
process.env.VUE_APP_CDN_URL =
  process.env.NODE_ENV === 'development' ? proxy[1].target + CDN_URL : CDN_URL
// process.env.CDN_URL = proxy[1].target + CDN_URL
process.env.CDN_URL =
  process.env.NODE_ENV === 'development' ? proxy[1].target + CDN_URL : CDN_URL
const staticUrl = process.env.CDN_URL
  ? `${process.env.CDN_URL}/assets/`
  : '/assets/'

function getChainWebpack(config) {
  config.plugins.delete('preload')
  config.plugins.delete('prefetch')
  config.plugins.delete('preload-index')
  config.plugins.delete('prefetch-index')
  /**
   * @description
   * @topo: 非汉化注释以下内容
   */
  // config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
  //   {
  //     languages: ['json', 'java', 'python', 'shell', 'sql', 'text'],
  //     // 以下为全部支持的代码语言，可根据需求添加
  //     //   ['abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dart', 'dockerfile', 'ecl', 'fsharp', 'go', 'graphql', 'handlebars', 'hcl', 'html', 'ini', 'java', 'javascript', 'json', 'julia', 'kotlin', 'less', 'lexon', 'lua', 'm3', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scala', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'systemverilog', 'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml'],
  //     features: [
  //       'format',
  //       'find',
  //       'contextmenu',
  //       'gotoError',
  //       'gotoLine',
  //       'gotoSymbol',
  //       'hover',
  //       'documentSymbols',
  //     ],
  //     // 以下为全部功能模块，可根据需求添加
  //     // ['accessibilityHelp', 'anchorSelect', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorPicker', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'documentSymbols', 'find', 'folding', 'fontZoom', 'format', 'gotoError', 'gotoLine', 'gotoSymbol', 'hover', 'iPadShowKeyboard', 'inPlaceReplace', 'indentation', 'inlineHints', 'inspectTokens', 'linesOperations', 'linkedEditing', 'links', 'multicursor', 'parameterHints', 'quickCommand', 'quickHelp', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'unusualLineTerminators', 'viewportSemanticTokens', 'wordHighlighter', 'wordOperations', 'wordPartOperations']
  //   },
  // ])
  // config.plugin('monaco').use(new MonacoWebpackPlugin())
  config.plugin('html').tap((args) => {
    var _staticUrl = localUrl
    // if (useCdn || process.env.NODE_ENV !== 'development') {
    const { css, js } = _staticUrl
    _staticUrl = {
      css: [],
      js: [],
    }
    css.forEach((_css) => {
      _staticUrl.css.push(
        `${staticUrl}css/${_css}?v=${process.env.VUE_APP_VERSION}&t=${dateTime}`
      )
    })
    js.forEach((_js) => {
      _staticUrl.js.push(
        `${staticUrl}js/${_js}?v=${process.env.VUE_APP_VERSION}&t=${dateTime}`
      )
      // _staticUrl.js.push(`${staticUrl}css/amis/sdk/sdk.js`)
    })
    args[0].staticUrl = _staticUrl
    args[0].ogConfig = ogConfig
    return args
  })
  config.resolve.symlinks(true)
  config.module.rule('svg').exclude.add(resolve('src/icon'))
  config.module
    .rule('dgiotIcon')
    .test(/\.svg$/)
    .include.add(resolve('src/icon'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'dgiot-icon-[name]',
    })
  config.when(process.env.NODE_ENV === 'development', (config) => {
    config.devtool('source-map')
  })
  // https://blog.csdn.net/weixin_34294049/article/details/97278751
  config.when(process.env.NODE_ENV === 'production', (config) => {
    if (process.env.CDN_URL) {
      console.log(`当前时间${dateTime}`)
      console.log(`当前使用了cdn,cdn资源链接地址为${process.env.CDN_URL}`)
    } else console.log(`当前未使用cdn,可能会导致打包体积过大`)
    config.performance.set('hints', false)
    config.devtool('none')
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 300000, //字节 引入的文件大于300kb才进行分割
      maxSize: 500000, //500kb，尝试将大于500kb的文件拆分成n个500kb的文件
      minChunks: 1, // 模块的最小被引用次数
      maxAsyncRequests: 5, // 按需加载的最大并行请求数
      maxInitialRequests: 3, // 一个入口最大并行请求数
      automaticNameDelimiter: '-dgiot-', // 文件名的连接符
      cacheGroups: {
        vendors: {
          name: 'vendors',
          //自定义打包模块
          test: /[\\/]node_modules[\\/]/,
          priority: -10, //优先级，先打包到哪个组里面，值越大，优先级越高
          // filename: 'vendors.js',
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
    if (imageCompression) {
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true,
        })
        .end()
    }
    if (buildGzip) {
      // https://blog.csdn.net/weixin_42164539/article/details/110389256
      config.plugin('compression').use(CompressionWebpackPlugin, [
        {
          filename: '[path][base].gz', // 一个 {Function} (asset) => asset 函数，接收原资源名（通过 asset 选项）返回新资源名
          algorithm: 'gzip', // 可以是 (buffer, cb) => cb(buffer) 或者是使用 zlib 里面的算法的 {String}
          // test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //匹配文件名
          test: productionGzipExtensions,
          threshold: 2048, //对1K以上的数据进行压缩
          minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
          deleteOriginalAssets: false, //是否删除源文件
        },
        new Webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100,
        }),
      ])
    }
    if (build7z) {
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
    }
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
          'src/dgiot/styles/variables/variables.scss'
        ) {
          return '@import "~@/dgiot/styles/variables/variables.scss";' + content
        }
        return content
      },
    },
  },
  extract: {
    filename: `output/assets/css/[name].dgiot.css?v=${process.env.VUE_APP_VERSION}&t=${dateTime}`,
    chunkFilename: `output/assets/css/[name].dgiot.css?v=${process.env.VUE_APP_VERSION}&t=${dateTime}`,
  },
}
const configure = {
  externals: {
    react: 'react',
    'react-dom': 'ReactDOM',
    bcrypt: 'bcrypt',
    'be-full': 'BeFull',
    loadsh: '_',
    JSONEditor: 'JSONEditor',
    AMap: 'VueAMap',
    konva: 'Konva',
    VCharts: 'v-charts',
    'vue-count-to': 'CountTo',
    'vue-konva': 'VueKonva',
    mockjs: 'Mock',
    'js-md5': 'md5',
    'js-base64': 'Base64',
    $: 'jquery',
    mqtt: 'mqtt',
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
    Multipane: 'vue-multipane',
    'js-cookie': 'Cookies',
    'vue-baidu-map': 'VueBaiduMap',
    echarts: 'echarts',
    screenfull: 'screenfull',
    Qs: 'qs',
    'ace-builds': 'ace',
    qs: 'Qs',
    moment: 'moment',
    jsplumb: 'jsplumb',
    JSEncrypt: 'jsencrypt',
    CodeMirror: 'codemirror',
    nprogress: 'NProgress',
    'vue-codemirror': 'vueCodemirror',
    vuedraggable: 'vuedraggable',
    'element-china-area-data': 'elementChinaAreaData',
    'vue-flv-player': 'vueFlvPlayer',
    'vue-aliplayer-v2': 'VueAliplayerV2',
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '*': resolve(''),
    },
  },
  module: {
    /**
     * @description: 汉化 Monaco 右键菜单
     * @doc: https://blog.csdn.net/m0_37986789/article/details/121135519
     * @topo: 汉化放出下列注释
     */
    // rules: [
    //   {
    //     test: /\.js/,
    //     enforce: 'pre',
    //     include: /node_modules[\\\/]monaco-editor[\\\/]esm/,
    //     use: MonacoWebpackPlugin.loader,
    //   },
    // ],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    /**
     * @description: 汉化 Monaco 右键菜单
     * @doc: https://blog.csdn.net/m0_37986789/article/details/121135519
     * @topo: 汉化放出下列注释
     */
    // new MonacoWebpackPlugin({
    //   languages: ['json','java', 'python', 'shell', 'sql','text'],
    //   filename: 'output/assets/js/monaco/[name].worker.js',
    //   features: ['format', 'find', 'contextmenu', 'gotoError', 'gotoLine', 'gotoSymbol', 'hover' , 'documentSymbols']
    // }),
    // new ForkTsCheckerWebpackPlugin(),
    // new HardSourceWebpackPlugin(),
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
    filename: `output/assets/js/[name].dgiot.js?v=${process.env.VUE_APP_VERSION}&t=${dateTime}`,
    chunkFilename: `output/assets/js/[name].dgiot.js?v=${process.env.VUE_APP_VERSION}&t=${dateTime}`,
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
