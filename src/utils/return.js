// parse错误返回
import { Message } from 'element-ui'
// import Cookies from 'js-cookie'
export function returnLogin(error) {
  if (error.code == '209') {
    Message({
      message: '您权限过期,请重新登录',
      type: 'error',
      duration: 2 * 1000,
    })
    sessionStorage.removeItem('roles')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('token')
    localStorage.removeItem('list')
    Cookies.set('username', '' - 1)
    Cookies.set('sessionToken', '' - 1)
    location.href = '/#/login'
  } else if (error.code == 119) {
    Message({
      message: '没有操作权限 e',
      type: 'warning',
      duration: 2 * 1000,
    })
  } else {
    Message({
      message: error.message,
      type: 'error',
    })
  }
}
