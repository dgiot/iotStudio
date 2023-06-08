export function aclObj(roles) {
  if (!roles) return
  let aclObj = {}
  roles.map((e) => {
    aclObj[`${'role' + ':' + e.name}`] = {
      read: true,
      write: true,
    }
  })
  return aclObj
}
