const viewGenerator = require('vab-templates/view/prompt')
const curdGenerator = require('vab-templates/curd/prompt')
const componentGenerator = require('vab-templates/component/prompt')
const mockGenerator = require('vab-templates/mock/prompt')
const vuexGenerator = require('vab-templates/vuex/prompt')

module.exports = (plop) => {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('curd', curdGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('mock&api', mockGenerator)
  plop.setGenerator('vuex', vuexGenerator)
}
