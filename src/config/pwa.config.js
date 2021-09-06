/**
 * @description pwa配置
 * @document https://cli.vuejs.org/core-plugins/pwa.html
 */
module.exports = {
  // 是否启用pwa功能
  isPwa: true,
  pwaConfig: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      name: 'dgiot_dashboard',
      short_name: 'dgiot_dashboard',
      description: '提供物联网垂直领域应用使能平台及解决方案',
      display: 'standalone',
      orientation: 'portrait-primary',
      prefer_related_applications: false,
      background_color: '#ffffff',
      lang: 'zh-CN',
      start_url: '/',
      scope: '/',
      theme_color: '#4fc08d',
      icons: [
        {
          src: './assets/img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './assets/img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: './assets/img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './assets/img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },
}
