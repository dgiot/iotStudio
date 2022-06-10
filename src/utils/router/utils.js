/**
 * @description 路由统一处理
 */
export default class router {
  constructor() {
    this.menu = []
  }

  compute(router) {
    this.menu = []
    router.forEach((item) => {
      if (item.children && item.meta) {
        item.children.forEach((i, k) => {
          if (i.meta) {
            // i.name = i.name
            i.path = i.url
            i.component = i.meta.component
            i.hidden = i.meta.hidden || false
            i.meta.noKeepAlive = i.meta.noKeepAlive || false
            i.menuHidden = i.meta.menuHidden || false
            i.alwaysShow = i.meta.alwaysShow || false
            // i.meta.title = i.meta.title
            // i.meta.icon = i.meta.icon
          }
        })
      }
      if (item.meta && item.meta.redirect) {
        this.menu.push({
          hidden: item.meta.hidden || false,
          menuHidden: item.meta.menuHidden || false,
          alwaysShow: item.meta.alwaysShow || false,
          name: item.name,
          path: item.url,
          component: item.meta.component,
          redirect: item.meta.redirect,
          meta: {
            title: item.meta.title,
            icon: item.meta.icon,
            noKeepAlive: item.meta.noKeepAlive || false,
          },
          children: item.children,
        })
      } else if (item.meta) {
        this.menu.push({
          hidden: item.hidden || false,
          menuHidden: item.menuHidden || false,
          alwaysShow: item.alwaysShow || false,
          name: item.name,
          path: item.url,
          component: item.meta.component,
          meta: {
            title: item.meta.title,
            icon: item.meta.icon,
            noKeepAlive: item.meta.noKeepAlive || false,
          },
          children: item.children,
        })
      }
    })
    return this.menu
  }
}
