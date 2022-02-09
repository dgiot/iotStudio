/**
 * @Author: h7ml
 * @Date: 2021-11-30 18:09:04
 * @LastEditors: h7ml
 * @LastEditTime: 2021-11-30 18:09:04
 * @Description: 对接浙里办
 * @FilePath: src/config/gov.config.js
 * @DocumentLink: https://www.yuque.com/pianai-khshe/eeasg2/ctfs7m
 * @type {{js: string[]}}
 */

const govConfig = {
  js: [
    '//zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web1/site/script/zjzwfw-2019/zjzwfw_2019_wbdy_top.js', // 政务服务网头部
    '//detest.jxt.zj.gov.cn/web-third-js/static/js/header.js', // 页面公共头部测试服
    // '//de-pc.jxt.zj.gov.cn/web-third-js/static/js/header.js', // 页面公共头部 正式服
    '//zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web1/site/script/1083/2009211541482763.js', // 政务服务网尾部
    '//d.alicdn.com/alilog/mlog/aplus.js?id=202951085', // 浙江政务埋点
  ],
}
module.exports = govConfig
