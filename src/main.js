/**
 * use
 */
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import utilwen from './utils/utilwen'
import hrmPlayer from 'hrm-player'
import '@/vab'

/**
 * use
 */
Vue.use(utilwen)
Vue.use(hrmPlayer)
Vue.config.productionTip = false
if (process.env.NODE_ENV !== 'development') {
  Vue.config.productionTip = true
}
new Vue({
  el: '#dgiot',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
