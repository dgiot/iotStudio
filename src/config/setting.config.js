/*
 * @Author: h7ml
 * @Date: 2021-03-11 09:56:54
 * @LastEditTime: 2021-03-11 20:02:46
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\config\setting.config.js
 * @Description:
 */
/**
 * @description 导出通用配置
 */
module.exports = {
  // 标题，此项修改后需要重启项目！！！ (包括初次加载雪花屏的标题 页面的标题 浏览器的标题)
  title: '物联网开发平台',
  // 标题分隔符
  titleSeparator: ' - ',
  // 标题是否反转
  // 如果为false: "page - title"
  // 如果为ture : "title - page"
  titleReverse: false,
  // 简写
  abbreviation: 'dgiot_dashboard-pro',
  // pro版本copyright可随意修改
  copyright: '杭州数蛙科技有限公司',
  // 缓存路由的最大数量
  keepAliveMaxNum: 20,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  // 不经过token校验的路由，白名单路由建议配置到与login页面同级，如果需要放行带传参的页面，请使用query传参，配置时只配置path即可
  routesWhiteList: ['/login', '/register', '/callback', '/404', '/403'],
  // 加载时显示文字
  loadingText: '正在加载中...',
  // token名称
  tokenName: 'sessionToken',
  // token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'localStorage',
  // token 有效期时长
  expiresTime: 60 * 1000 * 30,
  // token存储位置localStorage sessionStorage cookie
  storage: 'cookie',
  // 退出登录后不清空的cookie列表
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
  ],
  // token失效回退到登录页时是否记录本次的路由
  recordRoute: process.env.NODE_ENV == 'development' ? true : false,
  // 是否开启logo，不显示时设置false，请填写src/icon路径下的图标名称
  // 如需使用内置RemixIcon图标，请自行去logo组件切换注释代码(内置svg雪碧图较大，对性能有一定影响)
  logo: 'vuejs-fill',
  // 语言类型zh、en
  i18n: 'zh',
  // 消息框消失时间
  messageDuration: 3000,
  // 在哪些环境下显示高亮错误
  errorLog: ['development' /* , 'production' */],
  // 是否开启登录拦截
  loginInterception: true,
  // 是否开启登录RSA加密
  loginRSA: false,
  // intelligence(前端导出路由)和all(后端导出路由)两种方式
  authentication: 'all',
  // 是否支持游客模式，支持情况下，访问白名单，可查看所有asyncRoutes
  supportVisit: false,
  // 是否开启roles字段进行角色权限控制(如果是all模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段)
  rolesControl: false,
  // vertical column comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: false,
  // vertical column comprehensive common布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOpeneds: [''],
  // 需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  // 分栏布局和综合布局时，是否点击一级菜单默认开启第一个二级菜单
  openFirstMenu: true,
  // 代码生成机生成在view下的文件夹名称
  templateFolder: 'project',
  webpackBarName: '杭州数蛙科技有限公司',
  // 控制台输出的名称
  dateTime: new Date(),
  // 打包时间
  webpackBanner:
    ' build: 杭州数蛙科技有限公司 \n copyright: dgiot_dashboard \n time: ',
  // webpack.BannerPlugin打包输出信息
  Keywords: '一站式物联网PaaS平台|物联网应用服务',
  // 网站seo关键字
  Description: '提供物联网垂直领域应用使能平台及解决方案',
  // 网站seo描述
}
