// * @Author: h7ml
// * @Date: 2021-10-20 18:22:35
// * @LastEditors: h7ml
// * @LastEditTime: 2021-10-20 18:22:35
// * @Description: 将konva封装到自己的js里 方便管理
// * @FilePath: src\utils\konva\core\index.js
// * @DocumentLink: https://konvajs.org/docs/index.html
import konva from 'konva'

// konva画布默认参数
let konvaAttr = {
  width: 1200, // 布局宽度
  height: 700, // 布局宽度
  scale: 100, // 缩放比例
}
// EventKey 操作konva对象的属性
let EventKey = 'clickNode'
const topo = {
  konva,
  konvaAttr: konvaAttr,
  stage: konva.Stage,
  layer: konva.layer,
  Transformer: konva.Transformer,
  data: [],
  listener: function () {
    return 'listener res'
  },
}
window.topo = topo
export default topo
