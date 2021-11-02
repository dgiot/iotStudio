import topoThing from './core/topoThing'
import topoVideo from './core/topoVideo'
import topoBg from './core/topoBg'
import topoImage from './core/topoImage'
import topoStage from '@/utils/konva/core/topoStage'
import canvas from '@/utils/konva/core/canvas'
function createThing(thing, saleInfo, randomXy) {
  return topoThing.create(thing, saleInfo, randomXy)
}
/**
 * @description 组态事件处理
 * @param type
 * @param event
 * @param node
 * @return {*}
 */
function thingEVent(type, event, node) {
  return node.on(`${event}`, (e) => {
    if (type == 'thing') {
      topoThing.on(node)
    }
    if (type == 'video') {
      topoVideo.on({
        node,
      })
    }
  })
}
/**
 *
 * @param type lable组件类型
 * @param node 组态Label节点
 * @param event  组态Label绑定的方法事件
 * @description topo eventBus 消息路由函数方法
 */
function addNodeEvent(args) {
  console.groupCollapsed(
    `%cKonvaBus ${args.type}`,
    'color:#009a61; font-size: 28px; font-weight: 300'
  )
  console.info(
    'addNodeEvent args:',
    '\n:' + args,
  )
  console.groupEnd()
  const { type, event, node, thing, saleInfo, randomXy } = args
  /*
   * @event = ['click','dblclick']
   * @document https://konvajs.org/docs/overview.html#Events
   * click, dblclick, mouseover, tap, dbltap, touchstart etc
   */
  if (type) {
    switch (type) {
      case 'createThing':
        return createThing(thing, saleInfo, randomXy)
        break
      case 'thing':
        return  thingEVent(type, event, node)
        break
      case 'bgMoveToBottom':
        return topoBg.bgMoveToBottom(args)
        break
      case 'setTopoBg':
        return topoBg.setTopoBg(args)
        break
      case 'handleChildren':
        return topoStage.handleChildren(args)
        break
      case 'handleImage':
        return topoImage.handleImage(args)
        break
    }
  }
}

export default addNodeEvent
