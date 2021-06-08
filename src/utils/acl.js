/**
 * [aclObj description] 全局获取acl
 *
 * @return  {[type]}  [return description]
 */
import { getToken } from '@/utils/vuex'
export function aclObj() {
  let roles = getToken('roles', 'sessionStorage')
  const aclKey1 = 'role' + ':' + roles[0].name
  const aclObj = {}
  aclObj[aclKey1] = {
    read: true,
    write: true,
  }
  return aclObj
}
