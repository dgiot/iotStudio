/**
 * use
 */
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import { clearConsole, isPwa } from './config'
import dgiotStore from '@dgiot/dgiot-mqtt-dashboard/src/store'
import VueAmisSdk from 'vue-amis-sdk/packages/index'
import { VuePlugin } from 'vuera'
import '@/dgiot'
import 'amis/lib/themes/cxd.css'
import 'amis/lib/themes/ang.css'
import 'amis/lib/helper.css'
import 'amis/sdk/sdk.css'
import 'amis-editor/dist/style.css'

//列表自动滚动
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

// import 'amis-core/lib/index.js'
Vue.use(VueAmisSdk)
Vue.use(VuePlugin)
window.dgiotlogger =
  process.env.NODE_ENV !== 'development' && clearConsole
    ? new Lajax({
        url: 'http://umini.shujupie.com/web_logs',
        autoLogError: true, //是否自动记录未捕获错误true
        autoLogRejection: false, //是否自动记录Promise错误true
        autoLogAjax: false, //是否自动记录 ajax 请求true
        //logAjaxFilter:function(ajaxUrl, ajaxMethod) {
        //    return false;//ajax 自动记录条件过滤函数true记录false不记录
        //},
        stylize: true, //是否要格式化 console 打印的内容true
        showDesc: false, //是否显示初始化描述信息true
        customDesc: function (lastUnsend, reqId, idFromServer) {
          return 'dgiot 前端日志模块加载完成。'
        },
        interval: 1000000, //日志发送到服务端的间隔时间10000毫秒
        maxErrorReq: 3, //发送日志请求连续出错的最大次数
      })
    : console
dgiotlogger.info('dgiot-dashboard环境变量：', dgiot)
if (isPwa) require('./registerServiceWorker')
process.env.NODE_ENV !== 'development'
  ? (Vue.config.productionTip = true)
  : (Vue.config.productionTip = false)
new Vue({
  el: '#dgiot',
  i18n,
  dgiotStore,
  store,
  router,
  render: (h) => h(App),
})
