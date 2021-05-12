/**
 * [aclObj description] 全局获取acl
 *
 * @return  {[type]}  [return description]
 */
function aclObj() {
  let roles = JSON.parse(Cookies.get('roles'))
  const aclKey1 = 'role' + ':' + roles[0].name
  const aclObj = {}
  aclObj[aclKey1] = {
    read: true,
    write: true,
  }
  return aclObj
}
