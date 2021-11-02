import Konva from 'konva'
import { uuid } from '@/utils'
import addNodeEvent from '@/utils/konva/common'
import Vue from 'vue'
/**
 * @description 组态物模型公共函数
 * @type {{create(*, *, *): Text, on(*)}}
 */
const topoThing = {
  on(args) {
    const params = {
      busTopicKey: dgiotBus.topicKey('dgiot_thing', 'dgiotThing'),
      msg: {
        type: 'bind_topo',
        id: args.getAttr('id'),
        text: args.findOne('Text').getAttr('text'),
      },
    }
    // console.log(params,Vue.prototype.$dgiotBus.emit(params.busTopicKey,params.msg))
    Vue.prototype.$baseEventBus.$emit(params.busTopicKey,params.msg)
  },
  /**
   * @description 创建文本
   * @document https://konvajs.org/docs/shapes/Text.html
   * @param productid
   * @param text
   */
  create(thing, saleInfo, randomXy) {
    const topoThing = new Konva.Text({
      x: randomXy(100, 50),
      y: randomXy(70, 30),
      text: `${thing.productid}_${uuid(3)}`,
      // fontSize: 18,
      fontFamily: 'Calibri',
      fill: 'yellow', // 没有绑定组态设置为黄色，绑定后改为绿色
      width: 300,
      padding: 20,
      scaleX: saleInfo.scaleX,
      scaleY: saleInfo.scaleY,
      align: 'center',
      draggable: true,
      attrs: {
        hidden: thing.hidden,
        id: `${thing.productid}_${uuid(4)}`,
        name: 'thing',
        x: randomXy(300, 10),
        y: randomXy(170, 30),
        draggable: true,
      },
      className: 'Label',
      children: [
        {
          attrs: {
            name: 'dblclick',
          },
          className: 'Tag',
        },
        {
          attrs: {
            id: `${thing.productid}_${uuid(5)}`,
            text: 'dgiot',
            // fontSize: 50,
            lineHeight: 1.2,
            padding: 10,
            fill: 'green',
          },
          className: 'Text',
        },
      ],
    })
    return topoThing
  },
  /**
   * @description 绑定组态
   */
  bindTopo() {},
  /**
   * @description 保存组态
   */
  saveTopo() {},
  /**
   * @description 处理设备界面进入组态 设置组态不可点击移动等属性
   */
  deviceThing() {},
  /**
   * @description 更新组态
   */
  upTopo() {},
}

export default topoThing
