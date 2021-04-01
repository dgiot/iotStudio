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
// defaultRoutes
const defaultRoutes = {
  path: '/roles',
  name: 'User',
  component: 'Layout',
  redirect: '/structures',
  meta: {
    title: '多租户',
    icon: 'admin-fill',
  },
  children: [
    {
      path: '/roles/menu',
      name: 'Menu_management',
      component: '@/views/roles/menu',
      meta: {
        icon: 'menu-2-fill',
        title: '菜单管理',
      },
    },
    {
      path: '/roles/roles',
      name: 'Role_management',
      component: '@/views/roles/rolelist/roles',
      meta: {
        title: '角色管理',
        icon: 'admin-line',
      },
    },
  ],
}
// 出错路由重定向
const errorRoutes = { path: '*', redirect: '/404', hidden: true }
module.exports = {
  indexRoutes,
  errorRoutes,
  defaultRoutes,
}
