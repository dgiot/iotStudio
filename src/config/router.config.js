/**
 *
 * @type {{redirect: string, path: string, component: string, children: [{path: string, component: string, meta: {icon: string, title: string, noClosable: boolean}, name: string}], meta: {icon: string, title: string}, name: string}}
 */
// indexRoutes 首页路由
const indexRoutes = {
  path: '/',
  name: 'Root',
  component: 'Layout',
  redirect: '/index',
  meta: {
    title: '总控台',
    icon: 'home-2-line',
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      component: '@/views/equipment_management/platform_overview',
      meta: {
        title: '总控台',
        icon: 'home-2-line',
        noClosable: true,
      },
    },
  ],
}
// 出错路由重定向
const errorRoutes = { path: '*', redirect: '/404', hidden: true }
module.exports = {
  indexRoutes: indexRoutes,
  errorRoutes: errorRoutes,
}
