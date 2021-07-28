/**
 * use
 */
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import utilwen from './utils/utilwen'
// import hrmPlayer from 'hrm-player'
import '@/vab'
import './registerServiceWorker'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
/**
 * use
 */
Vue.use(utilwen)
// Vue.use(hrmPlayer)
Vue.config.productionTip = false
if (process.env.NODE_ENV !== 'development') {
  Vue.config.productionTip = true
}
Sentry.init({
  Vue,
  dsn: 'https://da2e69015f914be8a50ae8e50e7672e2@o933014.ingest.sentry.io/5882059',
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'my-site-url.com', /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

new Vue({
  el: '#dgiot',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
