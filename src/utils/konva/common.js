import topoLable from './core/topoLable'
import topoVideo from './core/topoVideo'
import topoBg from './core/topoBg'
import topoImage from './core/topoImage'
import topoStage from '@/utils/konva/core/topoStage'
import canvas from '@/utils/konva/core/canvas'
import topoPath from '@/utils/konva/core/topoPath'

function createThing(thing, saleInfo, randomXy) {
  return topoLable.create(thing, saleInfo, randomXy)
}

/**
 * @description 组态事件处理
 * @param type
 * @param event
 * @param node
 * @return {*}
 */
function thingEVent(type, event, node) {
  node.on(`${event}`, (e) => {
    console.warn(e)
    if (type == 'thing') {
      return topoLable.on(node)
    }

    if (type == 'video') {
      return topoVideo.on({
        node,
      })
    }
  })
}

function evidenceEVent(type, event, node) {
  node.on(`${event}`, (e) => {
    if (type == 'evidence') {
      return topoPath.emitBus(node)
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
  console.info('addNodeEvent args:', '\n:' + args)
  console.groupEnd()
  const { type, event, node, thing, saleInfo, randomXy } = args
  /*
   * @event = ['click','dblclick']
   * @document https://konvajs.org/docs/overview.html#Events
   * click, dblclick, mouseover, tap, dbltap, touchstart etc
   */
  if (type) {
    switch (type) {
      case 'handleChildren': // 公共图元处理函数
        return topoStage.handleChildren(args)
        break
      case 'createdEvidence': // 创建取证图元
        return topoLable.createdEvidence(args)
        break
      case 'createThing': // 创建物模型
        return createThing(thing, saleInfo, randomXy)
        break
      case 'thing': // 物模型图元处理
        return thingEVent(type, event, node)
        break
      case 'evidence': // 取证类型图元处理
        return evidenceEVent(type, node.getAttr('handler'), node)
        break
      case 'handleImage': // 图片类图元处理函数
        return topoImage.handleImage(args)
        break
      case 'bgMoveToBottom': //背景置底
        return topoBg.bgMoveToBottom(args)
        break
      case 'setTopoBg': // 设置背景
        return topoBg.setTopoBg(args)
        break
      case 'contextMenu': // 右键菜单
        return topoLable.contextMenu(args)
        break
    }
  }
}

export default addNodeEvent
