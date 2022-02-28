function formatDate(value) {
  if (typeof value == 'undefined') {
    return ''
  } else {
    let date = new Date(parseInt(value))
    let y = date.getFullYear()
    let MM = date.getMonth() + 1
    MM = MM < 10 ? '0' + MM : MM
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let m = date.getMinutes()
    m = m < 10 ? '0' + m : m
    let s = date.getSeconds()
    s = s < 10 ? '0' + s : s
    return y + '年' + MM + '月' + d + '日' + h + '时' + m + '分' + s + '秒'
  }
}

module.exports = {
  title: '物联网开发平台',
  titleSeparator: ' - ',
  titleReverse: false,
  abbreviation: 'dgiot-dashboard-pro',
  copyright: '杭州数蛙科技有限公司',
  keepAliveMaxNum: 20,
  routerMode: 'hash',
  routesWhiteList: [
    '/login',
    '/register',
    '/callback',
    '/404',
    '/403',
    '/datav',
    '/jwtLogin',
    '/quick',
    '/lite',
    '/dev',
  ],
  loadingText: '正在加载中...',
  // token名称
  tokenName: 'sessionToken',
  tokenTableName: 'dgiot_auth_token',
  // token 有效期时长
  expiresTime: 60 * 1000 * 30,
  storage: 'cookie',
  refreshSession: true,
  noCookiePages: ['', '/login', '/jwtLogin', '/quick', '/lite', '/dev'],
  localHost: [
    'tcloudbaseapp.com',
    'gitee.io',
    'github.io',
    'netlify.app',
    'vercel.app',
    'surge.sh',
    'h7ml.icu',
  ],
  expiredTime: 60 * 10,
  ignoreApi: ['Navigation', 'Notification', '_User'],
  cookieWhiteList: [
    'cdnResource',
    'language',
    'theme',
    'collapse',
    'title',
    'backgroundimage',
    'logo',
    'Copyright',
    'title',
    'name',
    '_pcimg',
    '_mimg',
    'fileServer',
  ],
  recordRoute: process.env.NODE_ENV == 'development' ? true : false,
  logo: 'vuejs-fill',
  i18n: 'zh',
  messageDuration: 3000,
  errorLog: ['development'],
  loginInterception: true,
  loginRSA: false,
  authentication: 'all',
  supportVisit: false,
  rolesControl: false,
  uniqueOpened: false,
  defaultOpeneds: [''],
  debounce: ['doEdit'],
  clearConsole: false,
  openFirstMenu: true,
  templateFolder: 'project',
  webpackBarName: '杭州数蛙科技有限公司',
  dateTime: formatDate(Math.round(new Date())),
  noReloadRouter: ['Workbench'],
  // 打包时间
  webpackBanner:
    ' build: 杭州数蛙科技有限公司 \n copyright: dgiot-dashboard \n author: h7ml(h7ml@qq.com) \n Time: ',
  Keywords: '一站式物联网PaaS平台|物联网应用服务',
  Description: '提供物联网垂直领域应用使能平台及解决方案',
}
