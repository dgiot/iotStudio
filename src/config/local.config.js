// * @Author: h7ml
// * @Date: 2021-10-08 10:32:25
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-08 10:32:25
// * @Description:
// * @FilePath: src\config\local.config.js
// * @DocumentLink: http://prod.iotn2n.com/swagger/#/
// 系统启动时加载的文件
let systemStatic = {
  css: [
    'normalize.css',
    'nprogress.css',
    'material_icons.css', // 谷歌字体图标
    'iview.css', // iview 组件库
    'antd.min.css',
    'google.css',
    'materialdesignicons.min.css',
    'style.min.css',
    'codemirror.css',
    'lint.css',
    'vditor.css',
    'xterm.css',
    //  amis 相关
    'amis/lib/themes/cxd.css',
    'amis/lib/helper.css',
    'amis/lib/themes/antd.css',
  ],
  js: [
    'vue.js', // 这里如果使用了min.js 则无法在控制台使用vue-devtools
    'mqttws31.js',
    'vue-router.min.js',
    'vuedraggable.umd.min.js',
    'vue-i18n.min.js',
    'echarts.min.js',
    'echarts-amap.min.js',
    'nprogress.js',
    'vue-baidu-map.js',
    'konva.min.js',
    'vue-konva.min.js',
    'react.production.min.js',
    'react-dom.production.min.js',
    'ace-builds-1.4.14/src-min-noconflict/ace.js',
    'qs.js',
    'mock.js',
    'base64.js',
    'vuex.min.js',
    'mqtt.min.js',
    'jquery.min.js',
    'index.min.js',
    'bmap.min.js',
    'dayjs.min.js',
    'lodash.min.js',
    'clipboard.min.js',
    'axios.min.js',
    'js-cookie.js',
    'index.js',
    'moment.min.js',
    'screenfull.js',
    'app.js',
    'index.js',
    'antd.min.js',
    'iview.min.js',
    'vuetify.min.js',
    'resize-observer-polyfill.js',
    'vue-aliplayer-v2.js',
    'Sortable.min.js',
    'vue-flv-player.umd.min.js',
    'md5.min.js',
    'codemirror.js',
    'vue-codemirror.js',
    'vue-multipane.js',
    'bcryptjs.js',
    'macarons.js',
  ],
}
// 运行时加载的文件
let runTimeStatic = {
  css: [
    'material_icons.css', // 谷歌字体图标
    'iview.css', // iview 组件库
    'antd.min.css',
    'google.css',
    'materialdesignicons.min.css',
    'style.min.css',
    'codemirror.css',
    'lint.css',
    //  amis 相关
    'amis/lib/themes/cxd.css',
    'amis/lib/helper.css',
    'amis/lib/themes/antd.css',
  ],
  js: [
    'jszip.min.js',
    'jsplumb.min.js',
    'javascript.js',
    'json-lint.js',
    'vditor.js',
    'aliplayer-min.js',
  ],
}
if (process.env.NODE_ENV !== 'development') {
  systemStatic.js[0] = 'vue.min.js'
}

module.exports = { systemStatic, runTimeStatic }
