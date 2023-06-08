import Konva from 'konva'
import { uuid } from '@/utils'
import Vue from 'vue'
import canvas from '@/utils/konva/core/canvas'

/**
 * @description 组态物模型公共函数
 * @type {{create(*, *, *): Text, on(*)}}
 */
const topoLine = {
  evidence(args) {
    const params = {
      busTopicKey: dgiotBus.topicKey('dgiot_evidence', 'dgiotEvidence'),
      msg: {
        type: 'bind_evidence',
        id: args.getAttr('id'),
        evidenceList: args.getAttr('evidenceList'),
        node: args,
      },
    }
    Vue.prototype.$baseEventBus.$emit(params.busTopicKey, params.msg)
  },
  on(args) {
    console.log(args, 'args')
    //  const msg =  {
    //    type: 'bind_topo',
    //    id: args.getAttr('id'),
    //    text: args.findOne('Text').getAttr('text'),
    // }
    let id = ''
    if (args.children) {
      console.log(args.children)
      args.children.forEach((topo) => {
        id = topo.getAttr('id')
      })
    }
    const msg = {
      type: 'bind_topo',
      id: id,
      text: args.findOne('Text').getAttr('text'),
    }
    const params = {
      busTopicKey: dgiotBus.topicKey('dgiot_thing', 'dgiotThing'),
      msg: msg,
    }
    console.log(params, 'bind_topo')
    // console.log(
    //   params,
    //   Vue.prototype.$baseEventBus.$emit(params.busTopicKey, params.msg)
    // )
    Vue.prototype.$baseEventBus.$emit(params.busTopicKey, params.msg)
  },
  contextMenu(args) {
    if (canvas.Layering.indexOf(args.handler) > 0) {
      const contextNode = canvas.clickItem
      if (!_.isEmpty(contextNode)) {
        contextNode[`${args.handler}`]((e) => {
          console.log(e, 'contextNode')
          canvas.layer.batchDraw()
          // canvas.stage.batchDraw()
        })
      }
      canvas.clickItem = {}
      // canvas.layer.batchDraw()
      // canvas.stage.batchDraw()
      if (args.handler === 'remove') {
        if (args.contextmenu.args) args.contextmenu.args.destroy()
        if (args.contextmenu) args.contextmenu.destroy()
      }
    } else {
      console.log(args)
    }
    console.log('contextNode args', args)
    canvas.layer.batchDraw()
    canvas.stage.batchDraw()
  },
  /**
   * @description 创建文本
   * @document https://konvajs.org/docs/shapes/Text.html
   * @param productid
   * @param text
   */
  create(thing, args) {
    console.log('输出内容', thing, args, canvas.stage)
    let linelayer =
      canvas.stage.find('#line_layer')[0] ||
      new Konva.Layer({ id: 'line_layer' })
    if (canvas.stage.find('#line_layer').length <= 0) {
      canvas.stage.add(linelayer)
    }
    console.log('layer_line', linelayer)
    for (let index = 0; index < 150; index++) {
      var blackLine = new Konva.Line({
        points: [0, 0, 0, 1000],
        stroke: 'black',
        draggable: false,
        strokeWidth: 0.2,
        // dash: [20, 4],
        lineCap: 'round',
        lineJoin: 'round',
      })
      blackLine.move({
        x: 10 + 10 * index,
        y: 0,
      })
      linelayer.add(blackLine)
    }
    for (let index = 0; index < 200; index++) {
      var blackLine = new Konva.Line({
        points: [0, 0, 2000, 0],
        stroke: 'black',
        draggable: false,
        strokeWidth: 0.2,
        // dash: [20, 4],
        lineCap: 'round',
        lineJoin: 'round',
      })
      blackLine.move({
        x: 0,
        y: 10 + 10 * index,
      })
      linelayer.add(blackLine)
    }

    // return simpleLabel
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

export default topoLine
