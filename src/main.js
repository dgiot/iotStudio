/**
 * use
 */
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import utilwen from './utils/utilwen'
import MqttMixin from './mixins/MqttMixin'
import { isPwa } from './config'

import '@/vab'
Vue.use(utilwen)
Vue.mixin(MqttMixin)
if (isPwa) require('./registerServiceWorker')
process.env.NODE_ENV !== 'development'
  ? (Vue.config.productionTip = true)
  : (Vue.config.productionTip = false)
new Vue({
  el: '#dgiot',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
