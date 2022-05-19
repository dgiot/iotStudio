// * @Author: h7ml
// * @Date: 2021-12-13 11:06:54
// * @LastEditors: h7ml
// * @LastEditTime: 2021-12-13 11:06:54
// * @Description: 用于平台相关机密应用信息配置。建议开发者申请对应的key后替换
// * @FilePath: src\config\secret.config.js
// * @DocumentLink: http://60.205.104.205/

module.exports = {
  secret: {
    //  百度相关
    baidu: {
      // 百度地图 Ak https://lbsyun.baidu.com/apiconsole/key#/home
      map: 'WpeAb6pL4tsX2ZVd56GHbO9Ut6c4HZhG',
      // 百度统计 https://tongji.baidu.com/web/homepage/index
      statistics: '',
    },
    //  腾讯相关
    tencent: {
      // 腾讯地图 Ak https://lbs.qq.com/
      map: '',
    },
  },
}
