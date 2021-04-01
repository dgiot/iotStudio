// Configuration for your app
const path = require('path')
function rootPath(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = function (ctx) {
  return {
    boot: [
      // references /src/boot/<name>.js
      'i18n',
      'axios',
      'x2js',
      'EventBus',
    ],
    css: ['app.styl'],
    extras: [
      'material-icons', // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QExpansionItem',
        'QSelect',
        'QInput',
        'QColor',
        'QSlider',
        'QPopupProxy',
      ],
      directives: ['Ripple', 'ClosePopup'],
      // Quasar plugins
      plugins: ['Notify'],
    },
  }
}
