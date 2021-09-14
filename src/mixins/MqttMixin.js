import MQTTConnect from '@/utils/MQTTConnect'
import { Map2Json } from '@/utils'
import { reconnect, maxReconnectNum } from '../config'
import store from '@/store'
// window.store = store
const { iotMqtt } = MQTTConnect
const MqttMixin = {
  name: 'MqttMixin',
  data() {
    return {
      consoleTale: [],
      MapTopic: new Map(),
      HistoryMsg: new Map(),
      countNum: 0,
      reconnectNum: 0,
      isReconnect: reconnect,
      maxReconnectNum: maxReconnectNum,
    }
  },
  computed: {
    objectId() {
      return store.getters['user/objectId']
    },
    routerOpenTime() {
      return store.getters['router/routerOpenTime']
    },
    pathRouter() {
      return store.getters['mqttDB/pathRouter']
    },
    connectStatus() {
      return store.getters['mqttDB/connectStatus']
    },
    MqttTopic() {
      return store.getters['mqttDB/MqttTopic']
    },
    mqttSettings() {
      return store.getters['mqttDB/mqttSettings']
    },
  },
  created() {
    const _this = this
    /**
     * @description MqttConnect enentbus
     */
    _this.$bus.$off('MqttConnect')
    _this.$bus.$on('MqttConnect', (options) => {
      if (options) {
        _this.connectMqtt(options)
        const tempRouter = {}
        tempRouter[`${options.router}`] = `${options.router}`
        store.dispatch('mqttDB/setPathRouter', tempRouter)
      }
    })
    /**
     * @description MqttStatus enentbus
     */
    _this.$bus.$off('MqttStatus')
    _this.$bus.$on('MqttStatus', (router) => {
      if (router) {
        const tempRouter = {}
        tempRouter[`${router}`] = `${router}`
        store.dispatch('mqttDB/setPathRouter', tempRouter)
        _this.routerAck('init')
      }
    })
    /**
     *@description disconnect enentbus
     */
    _this.$bus.$off('mqttDisconnect')
    _this.$bus.$on('mqttDisconnect', (timestamp) => {
      if (timestamp) {
        _this.disconnect()
      }
    })
    /**
     *@description MqttSubscribe enentbus
     */
    _this.$bus.$off('MqttSubscribe')
    _this.$bus.$on('MqttSubscribe', (args) => {
      if (!_.isEmpty(args)) _this.subscribe(args)
    })
    /**
     *@description MqttUnbscribe enentbus
     */
    _this.$bus.$off('MqttUnbscribe')
    _this.$bus.$on('MqttUnbscribe', (topicKey, topic) => {
      if (topicKey && topic) _this.unsubscribe(topicKey, topic)
    })
    /**
     *@description MqttPublish enentbus
     */
    _this.$bus.$off('')
    _this.$bus.$on('MqttPublish', (topic, obj, qos = 0, retained = false) => {
      if (!_.isEmpty(topic)) _this.sendMessage(topic, obj, qos, retained)
    })
  },
  mounted() {},
  methods: {
    routerAck(type) {
      let _this = this
      if (_this.pathRouter) {
        for (let router in _this.pathRouter) {
          _this.$bus.$emit(router, {
            settings: _this.mqttSettings,
            connectStatus: _this.connectStatus,
            topics: _this.MqttTopic,
            type,
          })
        }
      }
    },
    connectCheckTopic(map) {
      for (let topickey in map) {
        if (map[topickey].endtime > Number(moment().format('x')))
          this.subscribe({
            topickey: topickey,
            topic: map[topickey].topic,
            ttl: map[topickey].endtime - Number(moment().format('x')),
          })
        else this.unsubscribe(topickey, map[topickey].topic)
      }
    },
    /**
     *
     * @param topic
     * @param payloadString
     * @return {Vue|*}
     */
    busSendMsg(topic, payloadString, Message) {
      const nowTime = Number(moment().format('x'))
      const map = Map2Json(this.MqttTopic)
      for (let topicKey in map) {
        if (this.checkTopic(map[topicKey].topic, topic)) {
          const args = {
            topic: topic,
            msg: payloadString,
            Message: Message,
            timestamp: moment().format('x'),
          }
          console.error(topicKey)
          this.$bus.$emit(`${topicKey}`, args)
          console.groupCollapsed(
            '%ciotMqtt SendMsg payloadString',
            'color:#009a61; font-size: 28px; font-weight: 300'
          )
          console.groupEnd()
          console.table({ topic, topicKey, args })
        }
        if (Number(map[topicKey].endtime) < nowTime)
          this.unsubscribe(map[topicKey].topic, topicKey)
      }
      console.groupCollapsed(
        '%ciotMqtt busSendMsg payloadString',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.warn('%c%s', 'font-size: 24px;', payloadString)
      console.groupEnd()
    },
    /**
     *
     * @param subTopic 订阅的topic  包含#和+ 通配符
     * @param pubTopic 发布的topic 一定不包含通配符
     * @return {boolean}
     */
    checkTopic(subTopic, pubTopic) {
      let length = pubTopic.length < subTopic.length ? pubTopic : subTopic // 返回短的topic 短的topic 包含#/+
      for (let k in length) {
        if (subTopic[k] == '#' || subTopic == pubTopic) {
          return true
        } else if (subTopic[k] == '+' || subTopic[k] == subTopic[k]) {
          // return true
        } else {
          return false
        }
      }
    },
    /**
     *
     * @param options
     * @return {boolean}
     */
    initMqtt(options = {}) {
      options = _.merge(options, {
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
      })
      let _this = this
      if (_.isEmpty(options.clientId)) {
        console.info(
          '%c%s',
          'color: green;font-size: 24px;',
          'options 为空 不连接mqtt'
        )
        return false
      } else {
        console.groupCollapsed(
          '%ciotMqtt connect msg',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.table(options)
        console.groupEnd()
      }
      _this.$bus.$emit('MqttConnect', options)
    },
    connectMqtt(options) {
      const _this = this
      store.dispatch('mqttDB/setConnectStatus', 'connecting')
      iotMqtt.init({
        id: options.clientId || options.id,
        ip: options.ip,
        port: options.port,
        userName: options.userName,
        passWord: options.passWord,
        success: (msg = `clientId为${options.clientId},iotMqtt连接成功`) => {
          store.dispatch('mqttDB/setConnectStatus', 'connected')
          _this.mqttSuccess(msg)
          if (!_.isEmpty(this.MqttTopic)) {
            _this.connectCheckTopic(Map2Json(this.MqttTopic))
          }
          _this.$nextTick(() => {
            _this.subscribe({
              topicKey: md5(_this.$route.fullPath),
              topic: 'dgiot/topic/test',
              ttl: 1000 * 60 * 60 * 3,
            })
          })
          iotMqtt.subscribe('dgiot/topic/test', 0)
          _this.routerAck('connected')
        },
        error: function (msg = `iotMqtt接失败,自动重连`) {
          store.dispatch('mqttDB/setConnectStatus')
          // _this.connectLost()
          _this.mqttError(msg)
          _this.routerAck('disconnected')
        },
        connectLost: function (msg = `iotMqtt连接丢失`) {
          store.dispatch('mqttDB/setConnectStatus', 'disconnected')
          // _this.connectLost()
          _this.mqttError(msg)
          _this.routerAck('disconnected')
        },
        onMessage: function (Message) {
          const {
            destinationName = 'destinationName',
            duplicate = 'duplicate',
            payloadString = 'payloadString',
            qos = 0,
            retained = 'retained',
          } = Message
          _this.onMessage({
            destinationName,
            duplicate,
            payloadString,
            qos,
            retained,
          })
        },
      })
    },
    /**
     *
     * @param msg
     */
    mqttSuccess(msg = 'success') {
      console.groupCollapsed(
        '%ciotMqtt connection succeeded',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.info('%c%s', 'color: green;font-size: 24px;', msg)
      console.groupEnd()
      // iotMqtt.subscribe(this.objectId)
      // this.subscribe(this.objectId)
    },
    disconnect(msg = 'disconnect mqtt') {
      console.groupCollapsed(
        '%ciotMqtt connection succeeded',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.info('%c%s', 'color: green;font-size: 24px;', msg)
      console.groupEnd()
      iotMqtt.client.disconnect()
      // iotMqtt.subscribe(this.objectId)
      // this.subscribe(this.objectId)
    },
    /**
     *
     * @param msg
     */
    mqttError(msg = 'error') {
      let _this = this
      console.groupCollapsed(
        '%ciotMqtt Connection failed',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.error('%c%s', 'color: red;font-size: 24px;', msg)
      console.groupEnd()
      if (this.isReconnect) {
        _this.reconnect()
      } else console.info('reconnect 为' + reconnect, '不自動重連')
    },
    /**
     *
     * @param msg
     */
    connectLost(msg = 'connectLost') {
      console.groupCollapsed(
        '%ciotMqtt Connection lost',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.error('%c%s', 'color: red;font-size: 24px;', msg)
      console.groupEnd()
    },
    /**
     *
     * @param Message
     */
    onMessage(Message) {
      let _this = this
      _this.countNum++ >= 10 ? (_this.countNum = 0) : _this.countNum
      const {
        destinationName = 'destinationName',
        duplicate = 'duplicate',
        payloadBytes = 'payloadBytes',
        payloadString = 'payloadString',
        qos = 0,
        retained = 'retained',
      } = Message
      // 判断是否为二进制
      if (_.isTypedArray(Message)) {
        const str = String.fromCharCode.apply(null, new Uint8Array(Message))
        const res = JSON.parse(str)
        console.log(res)
        this.HistoryMsg.set(_this.countNum, {
          111: Message,
          type: 'Uint8Array ',
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
        })
      } else {
        this.HistoryMsg.set(_this.countNum, {
          111: Message,
          type: 'json',
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS'),
        })
      }

      const table = {
        destinationName: destinationName,
        duplicate: duplicate,
        payloadBytes: payloadBytes,
        payloadString: payloadString,
        qos: qos,
        retained: retained,
      }
      _this.consoleTale.push(table)
      console.groupCollapsed(
        '%ciotMqtt onMessage',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.table(_this.consoleTale)
      console.groupEnd()
      store.dispatch('mqttDB/setHistoryMsg', _this.HistoryMsg)
      this.busSendMsg(destinationName, payloadString, Message)
    },
    /**
     *
     * @param topickey
     * @param topic
     * @param ttl
     */
    subscribe: function (args) {
      let _this = this
      // const MapTopic = new Map()
      const {
        topicKey,
        topic,
        ttl,
        created = moment().format('x'),
        qos = 0,
      } = args
      const endTime = Number(moment().format('x')) + ttl
      _this.MapTopic.set(topicKey, {
        topic: topic,
        endtime: endTime,
        created: created,
        qos: qos,
      })
      store.dispatch('mqttDB/setMqttTopic', _this.MapTopic)
      if (!_.isEmpty(topic)) {
        iotMqtt.subscribe(topic, qos)
        console.groupCollapsed(
          '%ciotMqtt subscribe',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.table(args)
        console.groupEnd()
      } else console.error('no topic')
    },
    /**
     *
     * @param topicKey 存储在vuex的key
     * @param topic mqtt subscribe topic
     */
    unsubscribe: function (topicKey, topic) {
      iotMqtt.unsubscribe(topic)
      const map = this.MqttTopic
      if (!_.isEmpty(map)) {
        map.delete(topicKey)
        store.dispatch('mqttDB/setMqttTopic', map)
      }
      console.info('%c%s', 'color: green;font-size: 24px;', map)
      console.groupCollapsed(
        '%ciotMqtt unsubscribe',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.info(
        '%c%s',
        'color: green;font-size: 24px;',
        'unsubscribe: topic' + topic
      )
      console.groupEnd()
    },
    /**
     *
     * @param msg
     */
    reconnect: function (msg = '自动重连mqtt') {
      const _this = this
      _this.reconnectNum++
      const maxReconnectNum =
        _this.maxReconnectNum < 4 ? 4 : _this.maxReconnectNum
      if (_this.reconnectNum < maxReconnectNum) {
        iotMqtt.reconnect()
        console.groupCollapsed(
          '%ciotMqtt reconnect',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(
          '%c%s',
          'color: black; font-size: 24px;',
          '当前重连次数：' + _this.reconnectNum + '次' + msg
        )
        console.groupEnd()
      } else {
        console.error(
          '%c%s',
          'color: black;font-size: 24px;',
          '当前重连次数大于' +
            maxReconnectNum +
            '次,不再自动重连,重连第' +
            _this.reconnectNum +
            '次'
        )
      }
    },
    /**
     *
     * @param topic
     * @param obj
     */
    sendMessage(topic, obj, qos = 0, retained = false) {
      if (_.isEmpty(obj)) {
        console.groupCollapsed(
          '%csendMsg',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.error(topic, obj, '没有发送消息的内容')
        console.groupEnd()
        return
      }
      // 数据发送
      try {
        iotMqtt.sendMessage(topic, obj, qos, retained)
        console.groupCollapsed(
          '%csendMsg',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.log(topic, obj)
        console.groupEnd()
      } catch (err) {
        console.log('error', err)
        console.groupCollapsed(
          '%ciotMqtt sendMessage error',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.warn('%c%s', 'color: red;font-size: 24px;', err)
        console.groupEnd()
      }
    },
  },
}
export default MqttMixin
