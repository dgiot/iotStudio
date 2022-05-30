let systemStatic = {
  css: [
    'normalize.css',
    'nprogress.css',
    'material_icons.css',
    'iview.css',
    'antd.min.css',
    'google.css',
    'materialdesignicons.min.css',
    'style.min.css',
    'codemirror.css',
    'lint.css',
    'vditor.css',
    'xterm.css',
    // 'aliplayer-min.css',
    'amis/lib/themes/cxd.css',
    'amis/lib/helper.css',
  ],
  js: [
    'vue.js',
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
    'aliplayer-min.js',
    'analytics.js',
    'vue-qr.js',
  ],
}
let runTimeStatic = {
  css: [
    'material_icons.css',
    'antd.min.css',
    'google.css',
    'materialdesignicons.min.css',
    'style.min.css',
    'codemirror.css',
    'lint.css',
    'amis/lib/themes/cxd.css',
    'amis/lib/helper.css',
  ],
  js: [
    'jszip.min.js',
    'jsplumb.min.js',
    'javascript.js',
    'json-lint.js',
    'vditor.js',
  ],
}
if (process.env.NODE_ENV !== 'development') systemStatic.js[0] = 'vue.min.js'

module.exports = { systemStatic, runTimeStatic }
