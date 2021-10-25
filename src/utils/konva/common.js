import topoThing from './component/topoThing'
import topoVideo from './component/topoVideo'

/**
 *
 * @param type lable组件类型
 * @param node 组态Label节点
 * @param event  组态Label绑定的方法事件
 * @description topo eventBus 消息路由函数方法
 */
function addNodeEvent(type, event, node) {
  /*
  * @event = = ['click','dbclick',.....]
   */
  node.on(event, (e) => {
      if (type === 'thing') {
        topoThing.on({
          node,
        })
      }
      if (type == 'video') {
        topoVideo.on({
          node,
        })
      }
    },
  )
}

export default addNodeEvent
