import store from '@/store'
import VueI18n from 'vue-i18n'
import elEn from 'element-ui/lib/locale/lang/en'
import elZh from 'element-ui/lib/locale/lang/zh-CN'
import elJp from 'element-ui/lib/locale/lang/ja'
import en from './en'
import zh from './zh'
import jp from './jp'
Vue.use(VueI18n)

const messages = {
  en: {
    ...en,
    ...elEn,
  },
  zh: {
    ...zh,
    ...elZh,
  },
  jp: {
    ...jp,
    ...elJp,
  },
}
console.log(messages)
function getLanguage() {
  return store.getters['settings/language'] || 'zh'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages,
})

export default i18n
