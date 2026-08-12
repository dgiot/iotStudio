/**
 * v-permission — 权限控制指令 (对齐 iotView src/directive/permission/permission.js)
 *
 * 用法: v-permission="['admin', 'editor']"
 * 无权限 → 移除 DOM 元素
 */

function getRoles() {
  try {
    const deptName = localStorage.getItem('dgiot_deptName') || ''
    const user = JSON.parse(localStorage.getItem('dgiot_user') || '{}')
    return [deptName, user.role].filter(Boolean)
  } catch { return [] }
}

function checkPermission(el, binding) {
  const { value } = binding
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      const roles = getRoles()
      const hasPermission = roles.some(role => permissionRoles.includes(role))
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
  }
}

export default {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  },
}
