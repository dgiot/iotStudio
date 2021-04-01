// 针对数组、对象的深拷贝
function deepClone(originObject) {
  var deepObject = Array.isArray(originObject) ? [] : {}
  if (originObject && typeof originObject === 'object') {
    for (var key in originObject) {
      // 如果子属性为引用数据类型，递归复制
      if (originObject.hasOwnProperty(key)) {
        if (originObject[key] && typeof originObject[key] === 'object') {
          deepObject[key] = deepClone(originObject[key])
        } else {
          deepObject[key] = originObject[key]
        }
      }
    }
  }
  return deepObject
}
export default deepClone
