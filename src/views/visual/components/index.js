const components = ['Picture', 'VText', 'VButton', 'Group', 'RectShape']
const componentLayout = require.context('./layouts', true, /\.vue$/)
// components.forEach((key) => {
//   Vue.component(key, () => import(`@/views/visual/components/${key}`))
// })
componentLayout.keys.forEach((key) => {
  const componentConfig = requireLayout(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})
