/**
 * use
 */
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import utilwen from './utils/utilwen'
import { isPwa } from './config'
import dgiotStore from '@dgiot/dgiot-mqtt-dashboard/src/store'
import dgiotBus from '@dgiot/dgiot-mqtt-dashboard/src/utils/bus'
import dgiotMixin from '@dgiot/dgiot-mqtt-dashboard/src/mixins/mqtt'
Vue.use(dgiotBus)
Vue.mixin(dgiotMixin)
import '@/vab'
Vue.use(utilwen)
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
