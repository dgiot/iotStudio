/**
 * [aclObj description] 全局获取acl
 *
 * @return  {[type]}  [return description]
 */
import store from '@/store'

export function aclObj() {
  let roles = store.getters['user/role']
  const aclKey1 = 'role' + ':' + roles[0].name
  const aclObj = {}
  aclObj[aclKey1] = {
    read: true,
    write: true,
  }
  return aclObj
}
