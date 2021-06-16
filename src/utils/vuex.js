/*
 * @Author: h7ml
 * @Date: 2021-03-15 11:16:40
 * @LastEditTime: 2021-03-17 21:24:25
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\utils\vuex.js
 * @Description: vuex持久化方法
 */
import { expiresTime, cookieWhiteList } from '@/config'
import cookie from 'js-cookie'
const Base64 = require('js-base64').Base64
import { isBase64 } from '@/utils'
const tempToken = {
  sessionStorage: [],
  localStorage: [],
  token: [],
}
/**
 * @description 获取token
 * @param tokenName
 * @param storage
 * @type token type ['Number','String','Boolean','Number','Undefined','Object','Function']
 * @returns {void|*}
 */
export function getToken(tokenName, storage = 'sessionStorage', type = '') {
  let res =
    'localStorage' === storage
      ? localStorage.getItem(tokenName)
      : 'sessionStorage' === storage
      ? sessionStorage.getItem(tokenName)
      : cookie.get(tokenName)
  if (res && isBase64(res)) {
    let Base64Decode = JSON.parse(Base64.decode(res))
    if (tokenName == 'avatar') {
      console.log(tokenName, Base64Decode.vuexinfo)
    }
    return Base64Decode.vuexinfo
  } else {
    return type
  }
}

/**
 * @description 存储token
 * @param tokenName
 * @param token
 * @param storage
 * @returns {void|*}
 */
export function setToken(tokenName, settoken, storage = 'sessionStorage') {
  let token = JSON.stringify({ vuexinfo: settoken })
  if ('localStorage' === storage) {
    return localStorage.setItem(tokenName, Base64.encode(token))
  } else if ('sessionStorage' === storage) {
    return sessionStorage.setItem(tokenName, Base64.encode(token))
  } else {
    return cookie.set(tokenName, Base64.encode(token), { expires: expiresTime })
  }
}

/**
 * @description 移除token
 * @param tokenName
 * @param storage
 * @returns {void|Promise<void>}
 */
export function removeToken() {
  for (const s in sessionStorage) {
    cookieWhiteList.indexOf(s) <= -1
      ? sessionStorage.removeItem(s)
      : tempToken.sessionStorage.push(s)
  }
  for (const l in localStorage) {
    cookieWhiteList.indexOf(l) <= -1
      ? localStorage.removeItem(l)
      : tempToken.sessionStorage.push(l)
  }
  // if ('localStorage' === storage) {
  //   return localStorage.removeItem(tokenName)
  // } else if ('sessionStorage' === storage) {
  //   return sessionStorage.removeItem(tokenName)
  // } else {
  //   return cookie.remove(tokenName)
  // }
}
function foreach() {
  const strCookie = document.cookie
  const arrCookie = strCookie.split('; ')
  console.log(`退出后清除Cookies ${arrCookie}`)
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split('=')
    if (arr.length > 0) DelCookie(arr[0])
  }
  console.log('tempToken', tempToken)
}
function GetCookieVal(offset) {
  let endstr = document.cookie.indexOf(';', offset)
  if (endstr == -1) endstr = document.cookie.length
  return decodeURIComponent(document.cookie.substring(offset, endstr))
}
function DelCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = GetCookie(name)
  if (cookieWhiteList.indexOf(name) < -1)
    document.cookie = name + '=' + cval + '; expires=' + exp.toGMTString()
}
function GetCookie(name) {
  const arg = name + '='
  const alen = arg.length
  const clen = document.cookie.length
  let i = 0
  while (i < clen) {
    var j = i + alen
    if (document.cookie.substring(i, j) == arg) return GetCookieVal(j)
    i = document.cookie.indexOf(' ', i) + 1
    if (i == 0) break
  }
  return null
}
export function clearCookie() {
  const date = new Date()
  date.setTime(date.getTime() - 10000)
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--; )
      cookieWhiteList.indexOf(keys[i]) < -1
        ? (document.cookie =
            keys[i] + '=0; expire=' + date.toGMTString() + '; path=/')
        : tempToken.token.push(keys[i])
  }
  foreach()
}
