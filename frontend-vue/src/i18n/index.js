import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ja from './ja'
import ru from './ru'
import es from './es'
import ar from './ar'

export const LANGS = { zh: '中文', en: 'English', ja: '日本語', ru: 'Русский', es: 'Español', ar: 'العربية' }
const saved = localStorage.getItem('dgiot_lang')
const locale = saved && LANGS[saved] ? saved : 'zh'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh',
  messages: { zh, en, ja, ru, es, ar }
})

export default i18n
export const toggleLang = () => {
  const keys = Object.keys(LANGS)
  const idx = keys.indexOf(i18n.global.locale.value)
  const next = keys[(idx + 1) % keys.length]
  i18n.global.locale.value = next
  localStorage.setItem('dgiot_lang', next)
}
