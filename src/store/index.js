/*
 * @Author: h7ml
 * @Date: 2021-01-14 14:35:36
 * @LastEditTime: 2021-03-25 20:33:20
 * @LastEditors: h7ml
 * @FilePath: \shuwa_dashboard\src\store\acl.js
 * @Description:
 */
/**
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 */
import * as pkg from '../../package.json'

const info = require('@/config/index')
Vue.use(Vuex)
const files = require.context('./modules', false, /\.js$/)
const modules = {}
const plugins = []
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})
const store = new Vuex.Store({
  modules,
  // plugins: [createLogger()],
  plugins,
})
export default store
info.secret = Base64.encode(JSON.stringify(info.secret))
info.secretMsg =
  'dgiot.secret字段属于机密信息,为了安全起见不予直接展示。已使用Base64加密'
// 解密方法 Base64.decode(dgiot.secret)
// if (!window.isInnerIp) getTags()

function getTags() {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.github.com/repos/dgiot/dgiot-dashboard/tags`)
      .then((res) => {
        res.data.forEach((t) => {
          t.message = getMessage(t)
        })
        info.tag = res.data
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function getMessage(tag) {
  return new Promise((resolve, reject) => {
    axios
      .get(tag.commit.url)
      .then((res) => {
        tag.message = res.data
        if (pkg.default.version === tag.name.replace('v', '')) {
          info.latest = _.merge(res.data, { tag: tag })
          info.latestTime = moment(tag.message.commit.committer.date).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          dgiotlogger.log(info.latestTime)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

window.dashboard = info
window.dgiot = info
console.log(
  `%c dashboard %c version v${dashboard.version} %c`,
  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
  'background:transparent'
)
