import {
  baseURL,
  contentType,
  debounce,
  messageName,
  requestTimeout,
  statusName,
  successCode,
  tokenName,
} from '@/config'
import store from '@/store'

import router from '@/router'
import { isArray } from '@/utils/validate'

let loadingInstance

// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]]
// 不需要token请求的路由
const noCookiePages = ['', '/login']
// 返回失败的code
const errCode = [200, 209, 401]
const CODE_MESSAGE = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队(异步任务)',
  204: '删除数据成功',
  400: '发出信息有误',
  401: '用户没有权限(令牌、用户名、密码错误)',
  403: '用户得到授权，但是访问是被禁止的',
  404: '访问资源不存在',
  406: '请求格式不可得',
  410: '请求资源被永久删除，且不会被看到',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}

const handleData = ({ config, data, status, statusText }) => {
  if (loadingInstance) loadingInstance.close()
  // 极个别情况，若将错误code设置为0时，防止识别成false影响判断
  if (data[statusName] === 0) data[statusName] = '0'
  // 若data.code存在，覆盖默认code
  let code = data && data[statusName] ? data[statusName] : status
  // 若code属于操作正常code，则status修改为200
  if (codeVerificationArray.includes(code)) code = 200
  switch (code) {
    case 200:
      // 业务层级错误处理，以下是假定restful有一套统一输出格式(指不管成功与否都有相应的数据格式)情况下进行处理
      // 例如响应内容：
      // 错误内容：{ status: 1, msg: '非法参数' }
      // 正确内容：{ status: 200, data: {  }, msg: '操作正常' }
      // 修改返回内容为 `data` 内容，对于绝大多数场景已经无须再关心业务状态码(code)和消息(msg)
      // return data.data ? data.data : data.msg
      // 或者依然保持完整的格式
      return data
    case errCode.indexOf(Number(code)) !== -1:
      backHome()
      break
    case 403:
      router.push({ path: '/403' })
      break
  }
  // 异常处理
  // 若data.msg存在，覆盖默认提醒消息
  const { url = '' } = config
  const message = `${url} 后端接口 ${code} 异常：${
    !data
      ? CODE_MESSAGE[code]
      : !data[messageName]
      ? statusText
      : data[messageName]
  }`
  Vue.prototype.$baseMessage(message, 'error', false, 'vab-hey-message-error')
  return Promise.reject(message)
}

/**
 * @description axios初始化
 */
let serviceBaseUrl = baseURL
const { hostname } = window.location
let localHost = [
  'dgiotdashboard-8gb17b3673ff6cdd-1253666439.tcloudbaseapp.com',
  'dgiiot.gitee.io',
  '127.0.0.1',
  'localhost',
]
if (localHost.indexOf(hostname)) {
  serviceBaseUrl = process.env.VUE_APP_URL + '/iotapi/'
}
const instance = axios.create({
  baseURL: serviceBaseUrl,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    const token = store.getters['user/token']
    const { path = '/' } = router.history.current
    let { headers = {} } = config
    // 不规范写法 可根据setting.config.js tokenName配置随意自定义headers
    // if (token) config.headers[tokenName] = token
    if (headers['_company']) {
      const { sessionToken = '' } = config.headers
      config.headers[`${tokenName}`] = sessionToken
    } else if (token) {
      config.headers[`${tokenName}`] = token
    } else if (noCookiePages.indexOf(path) == -1 && !headers[`${tokenName}`]) {
      Vue.prototype.$baseMessage(`当前页${path}未获取到${tokenName}`, 'error')
      router.push({ path: '/login', replace: true })
      return
    }

    if (
      config.data &&
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data)
    if (debounce.some((item) => config.url.includes(item)))
      loadingInstance = Vue.prototype.$baseLoading()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description axios响应拦截器
 */
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response, config } = error
    if (response) {
      return handleData(response)
    } else {
      console.log('error', error)
      console.log('config', config)
      console.log('response', response)
      Vue.prototype.$baseMessage(
        `请求出错：请求链接：${config.url}，错误信息：${error}`,
        'error'
      )
      return {}
    }
    // if (response === undefined) {
    //   Vue.prototype.$baseMessage(
    //     '未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起',
    //     'error'
    //   )
    //   return {}
    // } else return handleData(response)
  }
)
function backHome() {
  store.dispatch('user/resetAll')
  router.push({ path: '/login', replace: true })
}
export default instance
