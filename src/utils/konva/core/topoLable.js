import Konva from 'konva'
import { uuid } from '@/utils'
import Vue from 'vue'
import canvas from '@/utils/konva/core/canvas'

/**
 * @description 组态物模型公共函数
 * @type {{create(*, *, *): Text, on(*)}}
 */
const topoLable = {
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
    dgiotlog.log('我是取证控件', params)
    Vue.prototype.$baseEventBus.$emit(params.busTopicKey, params.msg)
  },
  on(args) {
    const params = {
      busTopicKey: dgiotBus.topicKey('dgiot_thing', 'dgiotThing'),
      msg: {
        type: 'bind_topo',
        id: args.getAttr('id'),
        text: args.findOne('Text').getAttr('text'),
      },
    }
    // dgiotlog.log(params,Vue.prototype.$dgiotBus.emit(params.busTopicKey,params.msg))
    Vue.prototype.$baseEventBus.$emit(params.busTopicKey, params.msg)
  },
  contextMenu(args) {
    if (canvas.Layering.indexOf(args.handler) > 0) {
      const contextNode = canvas.clickItem
      if (!_.isEmpty(contextNode)) {
        contextNode[`${args.handler}`]((e) => {
          dgiotlog.log(e, 'contextNode')
          canvas.layer.batchDraw()
          // canvas.stage.batchDraw()
        })
      }
      canvas.clickItem = {}
      // canvas.layer.batchDraw()
      // canvas.stage.batchDraw()
      // if(args.handler === 'remove') contextNode.destroy()
    } else {
      dgiotlog.log(args)
    }
    dgiotlog.log('contextNode args', args)
    canvas.layer.batchDraw()
    canvas.stage.batchDraw()
  },
  /**
   * @description 创建文本
   * @document https://konvajs.org/docs/shapes/Text.html
   * @param productid
   * @param text
   */
  create(thing, saleInfo, randomXy) {
    const Axis = {
      x: randomXy(600, 30),
      y: randomXy(450, 10),
    }
    const topoThing = new Konva.Text({
      x: Axis.x,
      y: Axis.y,
      text: `${thing.productid}_${uuid(3)}`,
      // fontSize: 18,
      fontFamily: 'Calibri',
      fontSize: 18,
      padding: 5,
      fill: 'white',
      width: 300,
      scaleX: saleInfo.scaleX,
      scaleY: saleInfo.scaleY,
      align: 'center',
      draggable: true,
      attrs: {
        hidden: thing.hidden,
        id: `${thing.productid}_${uuid(4)}`,
        name: 'thing',
        x: Axis.x,
        y: Axis.y,
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
    dgiotlog.log('topoLable')
    dgiotlog.log(topoThing)
    // return topoLable

    var simpleLabel = new Konva.Label({
      name: 'thing',
      opacity: 0.75,
      x: Axis.x,
      y: Axis.y,
      draggable: true,
      id: thing.productid + '_flow',
      attrs: {
        id: thing.productid + '_flow',
        name: 'thing',
        x: Axis.x,
        y: Axis.y,
      },
    })
    simpleLabel.add(
      new Konva.Tag({
        fill: 'green',
        attrs: {
          name: 'dblclick',
        },
      })
    )
    simpleLabel.add(
      new Konva.Text({
        hidden: thing.hidden ? thing.hidden : false,
        id: thing.productid + '_flow_text',
        text: 'dgiot' + '_flow_text' + uuid(5),
        fontSize: 24,
        lineHeight: 1.2,
        padding: 10,
        fontFamily: 'Calibri',
        fill: 'white',
      })
    )
    dgiotlog.log(simpleLabel)
    return simpleLabel
  },
  createdEvidence(args) {
    dgiotlog.info('createdEvidence', args.path, args)
    const Axis = {
      x: 10 + args.path.index * 100 + canvas.randomXy(60, 10),
      y: 600 + canvas.randomXy(40, 10),
    }
    // https://konvajs.org/api/Konva.Path.html#Path__anchor
    const evidencePath = new Konva.Path({
      name: 'evidence',
      id: `${args.path.productid}_evidence_${canvas.randomXy(40, 10)}_${
        args.path.icon
      }`,
      evidenceList: [],
      icon: args.path.icon,
      type: args.path.type,
      x: Axis.x,
      y: Axis.y,
      width: 36,
      height: 36,
      draggable: true,
      data: args.path.path,
      handler: 'dblclick',
      fill: args.path.fill,
      size: 36,
      scale: {
        x: 2,
        y: 2,
      },
    })
    if (args.path.type === 'delete') window.deletePath = evidencePath
    return evidencePath
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

export default topoLable
