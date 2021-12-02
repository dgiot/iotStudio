export function aclObj(roles) {
  if (!roles) return
  let aclObj = {}
  roles.map((e) => {
    dgiotlog.log(e.name, '')
    aclObj[`${'role' + ':' + e.name}`] = {
      read: true,
      write: true,
    }
  })
  return aclObj
}
