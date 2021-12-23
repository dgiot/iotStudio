/*
 * @Author: h7ml
 * @Date: 2021-03-12 10:00:15
 * @LastEditTime: 2021-03-15 12:41:02
 * @LastEditors: h7ml
 * @FilePath: \dgiot-dashboard\src\utils\pageTitle.js
 * @Description:
 */
import { title, titleReverse, titleSeparator } from '@/config'
import store from '@/store/index'
import { translateTitle } from '@/utils/utilwen'

/**
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle) {
  // dgiotlog.log(translateTitle(`route.${pageTitle}`))
  pageTitle = translateTitle(`route.${pageTitle}`)
  let newTitles = []
  if (pageTitle) newTitles.push(pageTitle)
  if (title) newTitles.push(title)
  if (titleReverse) newTitles = newTitles.reverse()
  let retutnTitle = newTitles.join(titleSeparator)
  if (store.getters['settings/title']) {
    retutnTitle = newTitles
      .join(titleSeparator)
      .replace('shuwa Admin Pro', store.getters['settings/title'])
  }
  return retutnTitle
}
