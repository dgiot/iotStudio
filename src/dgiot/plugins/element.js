import ElementUI from 'element-ui'
import '@/dgiot/styles/variables/element-variables.scss'
import 'element-ui/lib/theme-chalk/display.css'
import i18n from '@/i18n'
import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.use(ElementUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value),
})
