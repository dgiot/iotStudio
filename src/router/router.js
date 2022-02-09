/**
 * @url http://prod.iotn2n.com:1337/dashboard/apps/shuwa_parse_server/browser/Menu
 * @type {{results: {}}}
 * @api
 */
const router = require('./router.json')
export default router.results
const routerArr = require('./parse_router.json')
// let routerId = []
routerArr.results.map((e) => {
  return e.objectId
})
