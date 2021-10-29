import topoThing from './component/topoThing'
import topoVideo from './component/topoVideo'
// import dgiotBus from '@dgiot/dgiot-mqtt-dashboard/src/utils/bus'
/**
 *
 * @param type lable组件类型
 * @param node 组态Label节点
 * @param event  组态Label绑定的方法事件
 * @description topo eventBus 消息路由函数方法
 */
function addNodeEvent(type, event, node) {
  /*
   * @event = ['click','dblclick']
   * @document https://konvajs.org/docs/overview.html#Events
   * click, dblclick, mouseover, tap, dbltap, touchstart etc
   */
  if (type) {
    node.on(event, (e) => {
      //
      console.log('交互处理')
      console.info(
        'addNodeEvent msg:',
        '\ntype:' + type,
        '\nevent:' + event,
        '\nnode:' + node,
        '\ne' + e,
        '\ntype' + type,
        '\nid' + node.getAttr('id'),
        '\ngetChildren' + node.findOne("Text"),
        '\nText' + node.findOne("Text").getAttr('text')
      )
      if (type === 'thing') {
        topoThing.on({
          node,
        })
        const busTopicKey = window.dgiotBus.topicKey(
          'dgiot_thing',
          'dgiotThing'
        )
        const msg = {
          type:"bind_topo",
          id: node.getAttr('id'),
          text: node.findOne("Text").getAttr('text'),
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
}

export default addNodeEvent
