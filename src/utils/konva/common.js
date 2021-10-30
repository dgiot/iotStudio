import topoThing from './core/topoThing'
import topoVideo from './core/topoVideo'
import topoBg from './core/topoBg'
import topoStage from '@/utils/konva/core/topoStage'

function createThing(productid, saleInfo, randomXy) {
  return topoThing.create(productid, saleInfo, randomXy)
}

/**
 * @description 组态事件处理
 * @param type
 * @param event
 * @param node
 * @return {*}
 */
function thingEVent(type, event, node) {
  return node.on(event, (e) => {
    if (type === 'thing') {
      topoThing.on({
        node,
      })
      const busTopicKey = window.dgiotBus.topicKey('dgiot_thing', 'dgiotThing')
      const msg = {
        type: 'bind_topo',
        id: node.getAttr('id'),
        text: node.findOne('Text').getAttr('text'),
      }
      dgiotBus.emit(busTopicKey, msg)
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
  const { type, event, node, productid, saleInfo, randomXy } = args
  /*
   * @event = ['click','dblclick']
   * @document https://konvajs.org/docs/overview.html#Events
   * click, dblclick, mouseover, tap, dbltap, touchstart etc
   */
  if (type) {
    switch (type) {
      case 'createThing':
        console.groupCollapsed(
          '%cKonvaBus common createThing',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.info(
          'addNodeEvent msg:',
          '\ntype:' + type,
          '\nproductid:' + productid,
          '\nsaleInfo:',
          saleInfo,
          '\nrandomXy' + randomXy
        )
        console.groupEnd()
        return createThing(productid, saleInfo, randomXy)
        break
      case 'thing':
        console.groupCollapsed(
          '%cKonvaBus common thingEVent',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.info(
          'addNodeEvent msg:',
          '\ntype:' + type,
          '\nevent:' + event,
          '\nnode:' + node,
          '\ne' + e,
          '\ntype' + type,
          '\nid' + node.getAttr('id'),
          '\ngetChildren' + node.findOne('Text'),
          '\nText' + node.findOne('Text').getAttr('text')
        )
        console.groupEnd()
        thingEVent(type, event, node)
        break
      case 'bgMoveToBottom':
        return topoBg.bgMoveToBottom(args)
        break
      case 'setTopoBg':
        return topoBg.setTopoBg(args)
        break
      case 'handleChildren':
        console.groupCollapsed(
          '%cKonvaBus common handleChildren',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.info(args)
        console.groupEnd()
        return topoStage.handleChildren(args)
        break
    }
  }
}

export default addNodeEvent
