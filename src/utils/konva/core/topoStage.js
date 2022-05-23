import canvas from '@/utils/konva/core/canvas'
import addNodeEvent from '@/utils/konva/common'
import { parseQueryString } from '@/utils'
let info = {
  tagevent: [],
  tag: [],
  evidence: [],
  badge: [],
}
canvas.info = info
/**
 * @description 组态Stage公共函数
 * @type {{handleChildren(*=): void}}
 */
const topoStage = {
  handleChildren(args) {
    console.log(args, 'args')
    const { layer } = canvas
    info['handleArray'] = args
    const { stage } = args
    stage.find('Star').forEach((node) => {
      info['Star'] = stage.find('Star')
      node.setAttrs({
        x: 5,
        fill: 'red',
      })
      const bgSrc = node.getAttr('src').includes('//')
        ? node.getAttr('src')
        : Cookies.get('fileServer') + node.getAttr('src').includes('//')
      localStorage.setItem('konvaBg', bgSrc)
      // node.destroy()
      canvas.bgNode = node
      addNodeEvent({
        type: 'bgMoveToBottom',
        bgNode: node,
        layer: args.layer,
        stage: args.stage,
      })
    })
    stage.find('Label').forEach((node) => {
      info['Label'] = stage.find('Label')
      console.log(
        "['thing', 'amis', 'device'].indexOf(node.getAttr('name')) ",
        ['thing', 'amis', 'device'].indexOf(node.getAttr('name'))
      )
      if (['thing', 'amis', 'device'].indexOf(node.getAttr('name')) != -1) {
        const nodeTags = node.getChildren()
        nodeTags.forEach((tag) => {
          info['tag'].push(tag)
          if (location.href.includes('&type=device')) {
            // dgiotlogger.info('dgiotlogger node:', tag)
            tag.setAttrs({
              draggable: false,
            })
            return false
          }
          const event = tag.getAttr('name')
          node.on('mouseover', function (e) {
            document.body.style.cursor = 'pointer'
          })
          node.on('mouseout', function (e) {
            document.body.style.cursor = 'default'
          })
          node.on('contextmenu', (e) => {
            canvas.contextmenu = e.target
            console.log('contextmenu', e)
          })
          // tag.on('click', (e) => {
          //   console.log(e)
          //   canvas.clickItem = e.target
          //   canvas.contextmenu = e.target
          //   console.log('tag click', e.target.attrs)
          // })
          if (event) {
            info.tagevent.push({
              tag: tag,
              event: event,
              name: tag.getAttr('name'),
            })
            addNodeEvent({
              type: node.getAttr('name'),
              event: `${event}`,
              node: node,
            })
          }
        })
      }
    })
    stage.find('Text').forEach((node) => {
      info['Text'] = stage.find('Text')
      if (location.href.includes('&type=device')) {
        dgiotlogger.info('dgiotlogger node:', node)
        node
          ? node.setAttrs({
              draggable: false,
            })
          : ''
        node?.parent
          ? node.parent.setAttrs({
              draggable: false,
            })
          : ''
        // return false
      }
      if (node.getAttr('hidden') === true) node.hide()
      // node.setAttrs({
      //   scaleX: args.saleInfo.scaleX,
      //   scaleY: args.saleInfo.scaleY,
      // })
      node.on('contextmenu', (e) => {
        canvas.contextmenu = e.target
        canvas.clickItem = e.target
        console.log('contextmenu', e.target)
      })
      node.on('click', (e) => {
        canvas.contextmenu = {}
        canvas.clickItem = e.target
        // console.log('click', e.target.attrs)
        // 单击时，这里根据node bind 的控件类型，去展示对应的控件信息
      })
      node.on('dblclick', (e) => {
        if (node.getAttr('bind_amis') && node.getAttr('amis_id').length > 0)
          dgiotBus.$emit('nodeInfo', node)
      })
      node.on('mouseover', function (e) {
        document.body.style.cursor = 'pointer'
      })
      node.on('mouseout', function (e) {
        document.body.style.cursor = 'default'
      })
    })
    stage.find('Path').forEach((node) => {
      info['Path'] = stage.find('Path')
      if (['evidence', 'thing', 'device'].indexOf(node.getAttr('name')) != -1) {
        if (
          location.href.includes('preview') ||
          location.href.includes('&type=device')
        ) {
          node.setAttrs({
            draggable: false,
          })
          const urlObj = new parseQueryString(location.href)
          if (urlObj.step == 3)
            node.setAttrs({
              fill: 'yellow',
            })
          return false
        }

        // canvas.layer.batchDraw()
        // canvas.stage.batchDraw()

        info['evidence'].push(node)
        addNodeEvent({
          type: node.getAttr('name'),
          node: node,
        })
      }
      // node.setAttrs({
      //   scaleX: args.saleInfo.scaleX,
      //   scaleY: args.saleInfo.scaleY,
      // })
      // 定义事件监听
      // node.on('mouseover', function(e) {
      //   console.log('鼠标mouseover')
      //   layer.draw()
      // })
      // node.on('mouseout', function() {
      //   console.log('鼠标mouseout')
      //   layer.draw()
      // })
      // node.on('mousedown', function(e){
      //   console.log('mousedown',e)
      //   layer.draw()
      // })
      // node.on('mouseup', function(e) {
      //   console.log('鼠标移出星',e)
      //   layer.draw()
      // })
      node.on('contextmenu', (e) => {
        canvas.contextmenu = e.target
        console.log('contextmenu', e.target)
      })
      node.on('mouseover', function (e) {
        document.body.style.cursor = 'pointer'
      })
      node.on('mouseout', function (e) {
        document.body.style.cursor = 'default'
      })
      node.on('click', (e) => {
        console.log(e, 'eeeeee')
        canvas.clickItem = e.target
        canvas.contextmenu = {}
        console.log('click', e.target.attrs)
      })
    })
    console.groupCollapsed(
      '%ctopoStage log',
      'color:#009a61; font-size: 28px; font-weight: 300'
    )
    console.info(info)
    console.groupEnd()
  },
}
export default topoStage
