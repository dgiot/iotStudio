'use strict'
exports.__esModule = true
exports.loadScript = void 0
function loadScript(url) {
  // 如果是数组
  var promiseList = []
  url.forEach(function (item) {
    var p = new Promise(function (resolve, reject) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = item
      script.onload = function () {
        script.onload = null
        script.onerror = null
        resolve()
      }
      script.onerror = function () {
        script.onload = null
        script.onerror = null
        reject()
      }
      var head = document.getElementsByTagName('head')[0]
      ;(head || document.body).appendChild(script)
    })
    promiseList.push(p)
  })
  return Promise.all(promiseList)
}
exports.loadScript = loadScript
