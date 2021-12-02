import Konva from 'konva'
import { uuid } from '@/utils'
import Vue from 'vue'
import canvas from '@/utils/konva/core/canvas'

/**
 * @description 组态物模型公共函数
 * @type {{create(*, *, *): Text, on(*)}}
 */
const topoPath = {
  emitBus(args) {
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
}

export default topoPath
