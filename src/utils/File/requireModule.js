/**
 *
 * @param context
 * @param path
 * @param flag
 * @param type
 * @return {{}}
 * @description require context module
 */
function requireModule(context, path, flag, type) {
  let components = {}
  if (context) {
    context.keys().forEach((fileName) => {
      let comp = context(fileName)
      components[fileName.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
    })
  }
  return components
}

export default requireModule
