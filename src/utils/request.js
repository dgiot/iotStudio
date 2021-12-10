import {
  authentication,
  baseURL,
  contentType,
  debounce,
  errorCode,
  expiredTime,
  ignoreApi,
  localHost,
  noCookiePages,
  refreshSession,
  requestTimeout,
  statusName,
  successCode,
  tokenName,
} from '@/config'
import { globalUrl } from './utilwen'
import store from '@/store'
import { refreshToken } from '@/api/Role/index'
import router from '@/router'
import { isArray } from '@/utils/validate'
import CSI from 'csijs'
let loadingInstance

// 示例：自定义上报
const csi = new CSI({
  feID: 'dgiot',
  report: (lines) => {
    // todo 自定义你的上报逻辑
    console.log('CSI lins', lines)
  },
})

// 如果你想主动上报
csi.report()

// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]]
// 返回失败的code
// 操作正常Code数组
const errorcodeVerificationArray = isArray(errorCode)
  ? [...errorCode]
  : [...[errorCode]]

const handleData = ({ config, data, status, statusText }) => {
  if (loadingInstance) loadingInstance.close()
  // 极个别情况，若将错误code设置为0时，防止识别成false影响判断
  if (data[statusName] === 0) data[statusName] = '0'
  // 若data.code存在，覆盖默认code
  let code = data && data[statusName] ? data[statusName] : status
  // 若code属于操作正常code，则status修改为200
  if (codeVerificationArray.includes(code)) code = 200
  if (errorcodeVerificationArray.includes(code)) backHome()
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
    case 403:
      router.push({ path: '/403' })
      break
  }
  // 异常处理
  // 若data.msg存在，覆盖默认提醒消息
  // const { url = '' } = config
  // const message = `${url} 后端接口 ${code} 异常：${
  //   !data
  //     ? CODE_MESSAGE[code]
  //     : !data[messageName]
  //     ? statusText
  //     : data[messageName]
  // }`
  // Vue.prototype.$baseMessage(message, 'error', false, 'vab-hey-message-error')
  // return Promise.reject(message)
}

/**
 * @description axios初始化
 */
let serviceBaseUrl = baseURL
// 判断当前环境是否为github page和gitee page
const { hostname } = window.location
/**
 * @description 不刷新token规则
 * @type {string[]}
 */
serviceBaseUrl = globalUrl(hostname, localHost) + '/iotapi/'
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
    const { NODE_ENV = '' } = process.env
    const departmentToken = store.getters['user/departmentToken']
    const usertoken = store.getters['user/token']
    const expired_timestamp = store.getters['user/expired_timestamp']
    const nowTimestamp = new Date().getTime()
    if (
      refreshSession &&
      (expired_timestamp - nowTimestamp) / 1000 <= expiredTime
    ) {
      refreshAuthToken([
        {
          name: 'departmentToken',
          value: departmentToken,
        },
        {
          name: 'dgiot_auth_token',
          value: usertoken,
        },
      ])
    }
    const { path = '/' } = router.history.current
    let { headers = {} } = config
    config.headers['departmentToken'] = departmentToken
    if (headers['proxy'] == true) {
      dgiotlog.log('src/utils/request.js', config, 'config')
      NODE_ENV == 'production'
        ? (config.baseURL = headers.produrl)
        : (config.baseURL = headers.devurl)
    }
    _.merge(headers, {
      departmentToken: departmentToken,
      sessionToken: usertoken,
      Auth: 'h7ml',
      Timestamp: moment(new Date()).unix() + '',
    })
    if (noCookiePages.indexOf(path) == -1 && !headers[`${tokenName}`]) {
      Vue.prototype.$baseMessage(`当前页${path}未获取到${tokenName}`, 'error')
      router.push({
        path: '/login',
        replace: true,
      })
      return
    }
    // 每次请求检查token过期时间,如果即将过去,refreshToken
    if (
      config.data &&
      config.headers['Content-Type'] ===
        'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data)

    if (debounce.some((item) => config.url.includes(item)))
      loadingInstance = Vue.prototype.$baseLoading()
    // 二次拦截
    /**
     * @description 当用户切换token 后。api中含有/class/ 并且该规则出现在首位时，使用部门token
     */
    if (
      config.url.indexOf('/classes/') == 0 &&
      !ignoreApi.some((item) => config.url.includes(item))
    ) {
      console.groupCollapsed(
        `%c部门切换token拦截url日志`,
        'color:black; font-size: 18px; font-weight: 300'
      )
      dgiotlog.log(
        'src/utils/request.js',
        `拦截的url为${config.url}\n当前请求使用了部门token：为${departmentToken}\n用户登录token为${usertoken}`,
        'color:black; font-size: 18px; font-weight: 300'
      )
      console.groupEnd()
      config.headers[`${tokenName}`] = departmentToken
      if (ignoreApi.some((item) => config.url.includes(item))) {
        console.groupCollapsed(
          `%c忽略url拦截日志`,
          'color:black; font-size: 18px; font-weight: 300'
        )
        dgiotlog.log(
          'src/utils/request.js',
          `忽略的url为${config.url}\n当前请求用户登录token：为${usertoken}\n部门token为${departmentToken}`,
          'color:black; font-size: 18px; font-weight: 300'
        )
        console.groupEnd()
        config.headers[`${tokenName}`] = usertoken
      }
    }

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
      console.log('src/utils/request.js', 'error', error)
      console.log('src/utils/request.js', 'config', config)
      console.log('src/utils/request.js', 'response', response)
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
function refreshAuthToken(tokens) {
  console.groupCollapsed(
    `%c refreshAuthToken`,
    'color:#009a61; font-size: 28px; font-weight: 300'
  )
  tokens.forEach((token) => {
    if (!_.isEmpty(token.value)) {
      refreshToken(token.value)
      // 根据路由模式获取路由并根据权限过滤
      store.dispatch('user/_setToken', {
        sessionToken: Cookies.get('dgiot_auth_token'),
        expires_in: 86400,
      })
      store.dispatch('user/setDepartmentToken', {
        sessionToken: Cookies.get('departmentToken'),
        expires_in: 86400,
      })
      store.dispatch('user/setExpired', {
        time: (Date.parse(new Date()) / 1000 + 86400) * 1000,
        expires_in: 7,
      })
      console.warn('src/utils/request.js', `持续检查更新token有效期`)
    }
  })
  console.groupEnd()
}

function backHome() {
  store.dispatch('user/resetAll')
  router.push({
    path: '/login',
    replace: true,
  })
}

export default instance
