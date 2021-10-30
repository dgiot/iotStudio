import konva from 'konva'
/**
 * @description konva事件二次封装后放到该文件
 * @type {{width: number, scale: number, height: number}}
 */
let konvaAttr = {
  width: 1200, // 布局宽度
  height: 700, // 布局高度
  scale: 100, // 缩放比例
}
import {randomXy} from '@/utils/index'
/**
 * @description EventKey 操作konva对象的属性
 * @type {string}
 */
let EventKey = 'clickNode'
/**
 * @description 鼠标右键操作项
 * @type {string[]}
 */
const Layering =['moveDown','moveToBottom','moveToTop','moveUp']
const canvas = {
  konva,
  konvaAttr: konvaAttr,
  activeShape: {},
  stage: konva.stage,
  layer: konva.layer,
  randomXy,
  Konvajson: {},
  clickItem:{},
  contextmenu:{},
  Transformer: konva.Transformer,
  data: [],
  Layering,
  EventKey,
  handlerArgs:{},
  listener: function () {
    return 'listener res'
  },
  toDataURL:''
}
export default canvas
