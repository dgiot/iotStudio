/**
 * [aclObj description] 全局获取acl
 *
 * @return  {[type]}  [return description]
 */
import store from '@/store'

export function aclObj() {
  let roles = store.getters['acl/role']
  let aclObj = {}
  roles.map((e) => {
    console.log(e.name, '')
    aclObj[`${'role' + ':' + e.name}`] = {
      read: true,
      write: true,
    }
  })
  return aclObj
}
