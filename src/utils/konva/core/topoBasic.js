import Konva from 'konva'
import { uuid } from '@/utils'
import Vue from 'vue'
import canvas from '@/utils/konva/core/canvas'

/**
 * @description 组态物模型公共函数
 * @type {{create(*, *, *): Text, on(*)}}
 */
const topoBasic = {
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
  create(thing, saleInfo, randomXy) {
    console.log('传递内容', thing)

    console.log('传递内容', thing)
    const Axis = {
      x: thing.x ? thing.x : randomXy(600, 30),
      y: thing.y ? thing.y : randomXy(450, 10),
    }
    const topoId = uuid(5)
    const topoThing = new Konva.Text({
      x: Axis.x,
      y: Axis.y,
      text: `${thing.productid}_${uuid(3)}`,
      // fontSize: 18,
      fontFamily: 'Calibri',
      fontSize: 12,
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
        name: thing.type, //'thing'
        x: Axis.x,
        y: Axis.y,
        draggable: true,
      },
      className: 'Label',
      children: [
        {
          attrs: {
            name: thing.type, //'dblclick',
          },
          className: 'Tag',
        },
        {
          attrs: {
            id: `${thing.productid}_${topoId}`,
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
    console.log('topoBasic')
    console.log(topoThing)
    // return topoBasic

    var simpleLabel = new Konva.Label({
      name: 'thing',
      opacity: 0.75,
      x: Axis.x,
      y: Axis.y,
      draggable: true,
      id: thing.productid + '_text' + topoId,
      attrs: {
        id: thing.productid + '_text' + topoId,
        name: thing.type, //'thing',
        x: Axis.x,
        y: Axis.y,
      },
    })
    simpleLabel.add(
      new Konva.Tag({
        fill: 'rgba(0, 0, 0, 0)',
        attrs: {
          name: 'dblclick',
        },
      })
    )
    if (thing.type == 'knovaimage') {
      var imageObj = new Image()
      imageObj.src = 'http://dev.iotn2n.com/dgiot_file/topo/png/pump.gif'
      simpleLabel.add(
        new Konva.Image({
          name: 'device',
          id: thing.productid + '_konvaimage' + topoId,
          x: Axis.x,
          y: Axis.y,
          image: imageObj,
          width: 106,
          height: 118,
          // draggable: true,
        })
      )
      // simpleLabel.add(
      //   new Konva.Path({
      //     name: 'evidence',
      //     id: thing.productid + '_konvaimage' + topoId,
      //     evidenceList: [],
      //     icon: args.path.icon,
      //     type: args.path.type,
      //     x: Axis.x,
      //     y: Axis.y,
      //     width: 36,
      //     height: 36,
      //     draggable: true,
      //     data: 'M7 9v6h4l5 5V4l-5 5H7z',
      //     handler: 'dblclick',
      //     fill: '#0ff',
      //     size: 36,
      //     scale: {
      //       x: 2,
      //       y: 2,
      //     },
      //   })
      // )
      // var animations = {
      //   idle: [
      //     // x, y, width, height (4 frames)
      //     2, 2, 70, 119, 71, 2, 74, 119, 146, 2, 81, 119, 226, 2, 76, 119,
      //   ],
      //   punch: [
      //     // x, y, width, height (4 frames)
      //     2, 138, 74, 122, 76, 138, 84, 122, 346, 138, 120, 122,
      //   ],
      // }
      // var imageObj = new Image()
      // simpleLabel.add(
      //   new Konva.Sprite({
      //     x: 50,
      //     y: 50,
      //     image: imageObj,
      //     animation: 'idle',
      //     animations: animations,
      //     frameRate: 7,
      //     frameIndex: 0,
      //   })
      // )
      console.log(' console.log(simpleLabel)', simpleLabel)
      return simpleLabel
      // let konvaImage = topoBasic.createImage(thing, saleInfo, randomXy, Axis)
      // return konvaImage
    }
    simpleLabel.add(
      new Konva.Text({
        hidden: thing.hidden ? thing.hidden : false,
        id: thing.productid + '_' + uuid(5) + '_text',
        text: 'dgiot_text' + topoId,
        fontSize: 20,
        fontWeight: 800,
        lineHeight: 1.2,
        width: 300,
        padding: 10,
        fontFamily: 'Calibri',
        fill: '#e63f32',
        type: thing.type,
      })
    )
    console.log('static', simpleLabel)
    return simpleLabel
  },
  createImage(args) {
    console.info(
      'src/utils/konva/core/topoBasic.js',
      'createdEvidence',
      // args.path,
      args
    )
    const Axis = {
      x: 10 + args.path.index * 100 + canvas.randomXy(60, 10),
      y: 600 + canvas.randomXy(40, 10),
    }
    let simpleImage = ''
    const topoId = uuid(5)
    // if (args.type == 'createImage') {
    var imageObj = new Image()
    imageObj.src = args.image
    // imageObj.onload = () => {
    simpleImage = new Konva.Image({
      name: 'konvaimage',
      id: args.productid + '_konvaimage' + topoId,
      x: Axis.x,
      y: Axis.y,
      image: imageObj,
      width: 106,
      height: 118,
      type: 'konvaimage',
      // handler: 'dblclick',
      draggable: true,
    })
    simpleImage.setAttrs({
      src: args.image,
    })
    // } else if (args.type == 'gifimage') {

    // }

    return simpleImage
  },
  createGifImage(args) {
    console.info(
      'src/utils/konva/core/topoBasic.js',
      'gifImage',
      // args.path,
      args
    )
    const Axis = {
      x: 10 + args.path.index * 100 + canvas.randomXy(60, 10),
      y: 600 + canvas.randomXy(40, 10),
    }
    var imageObj = new Image()
    imageObj.src = args.image
    let simpleImage = ''
    const topoId = uuid(5)
    // imageObj.onload = () => {
    var animations = args.animations
    //  {
    //   idle: [
    //     // x, y, width, height (4 frames)
    //     2, 2, 70, 119, 71, 2, 74, 119, 146, 2, 81, 119, 226, 2, 76, 119,
    //   ],
    // }
    simpleImage = new Konva.Sprite({
      x: 50,
      y: 50,
      image: imageObj,
      type: 'sprite',
      name: 'sprite',
      id: args.productid + '_sprite' + topoId,
      animation: 'idle',
      animations: animations,
      frameRate: 7,
      frameIndex: 0,
      draggable: true,
    })

    simpleImage.setAttrs({
      src: args.image,
    })

    return simpleImage
  },
  createVueComponent(args) {
    console.info(
      'src/utils/konva/core/topoBasic.js',
      'gifImage',
      // args.path,
      args
    )

    let vueComponet = ''
    const topoId = uuid(5)
    vueComponet = new Konva.Rect({
      x: 100,
      y: 100,
      width: args.data.width || 300,
      height: args.data.height || 200,
      type: args.chart,
      fill: args.data.fill || 'rgba(30, 30, 30,0.7)',
      text: args.text,
      name: 'vuecomponent',
      id: args.productid + '_vuecomponent' + topoId,
      draggable: true,
    })

    // vueComponet.setAttrs({
    //   src: args.image,
    // })

    return vueComponet
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

export default topoBasic
