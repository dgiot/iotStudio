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
/**
 * @description 获取token
 * @param tokenName
 * @param storage
 * @returns {void|*}
 */
export function getToken(tokenName, storage) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenName) || ''
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenName) || ''
    } else if ('cookie' === storage) {
      return cookie.get(tokenName) || ''
    } else {
      return localStorage.getItem(tokenName) || ''
    }
  } else {
    return localStorage.getItem(tokenName) || ''
  }
}

/**
 * @description 存储token
 * @param tokenName
 * @param token
 * @param storage
 * @returns {void|*}
 */
export function setToken(tokenName, token, storage) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenName, token)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenName, token)
    } else if ('cookie' === storage) {
      return cookie.set(tokenName, token, { expires: expiresTime })
    } else {
      return localStorage.setItem(tokenName, token)
    }
  } else {
    return localStorage.setItem(tokenName, token)
  }
}

/**
 * @description 移除token
 * @param tokenName
 * @param storage
 * @returns {void|Promise<void>}
 */
export function removeToken(tokenName, storage) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.removeItem(tokenName)
    } else if ('cookie' === storage) {
      return cookie.remove(tokenName)
    } else {
      return localStorage.removeItem(tokenName)
    }
  } else {
    return localStorage.removeItem(tokenName)
  }
}
function foreach() {
  var strCookie = document.cookie
  var arrCookie = strCookie.split('; ')
  console.log(`退出后清除Cookies ${arrCookie}`)
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split('=')
    if (arr.length > 0) DelCookie(arr[0])
  }
}
function GetCookieVal(offset) {
  var endstr = document.cookie.indexOf(';', offset)
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
  var arg = name + '='
  var alen = arg.length
  var clen = document.cookie.length
  var i = 0
  while (i < clen) {
    var j = i + alen
    if (document.cookie.substring(i, j) == arg) return GetCookieVal(j)
    i = document.cookie.indexOf(' ', i) + 1
    if (i == 0) break
  }
  return null
}
export function clearCookie() {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--; )
      if (cookieWhiteList.indexOf(keys[i]) < -1)
        document.cookie =
          keys[i] + '=0; expire=' + date.toGMTString() + '; path=/'
  }
  foreach()
}
