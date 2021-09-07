import MQTTConnect from '@/utils/MQTTConnect'
import { Map2Json, getMqttEventId, getTopicEventId } from '@/utils'
const { iotMqtt } = MQTTConnect
import { mapGetters, mapMutations } from 'vuex'
const MqttMixin = {
  name: 'MqttMixin',
  data() {
    return {
      consoleTale: [],
      MapTopic: new Map(),
    }
  },
  computed: {
    ...mapGetters({
      objectId: 'user/objectId',
      mapTopic: 'mqttMsg/mapTopic',
      routerOpenTime: 'router/routerOpenTime',
    }),
  },
  created() {
    const _this = this
    _this.$bus.$off(getMqttEventId('publish'))
    _this.$bus.$on(getMqttEventId('subscribe'), (arg) => {
      const { topic, router, ttl } = arg
      _this.subscribe(topic, router, ttl)
    })
  },
  methods: {
    ...mapMutations({
      setMapTopic: 'mqttMsg/setMapTopic',
    }),
    connectCheckTopic() {
      const map = Map2Json(this.mapTopic)
      for (let key in map)
        if (map[key] > Number(moment().format('x')))
          this.subscribe(key, map[key] - Number(moment().format('x')))
        else this.unsubscribe(key)
    },
    /**
     *
     * @param topic
     * @param payloadString
     * @return {Vue|*}
     */
    busSendMsg(topic, payloadString, Message) {
      const nowTime = Number(moment().format('x'))
      const map = Map2Json(this.mapTopic)
      for (let router in map) {
        if (this.checkTopic(map[router].topic, topic)) {
          const topicKey = getTopicEventId(map[router].topic, router)
          this.$bus.$emit(topicKey, {
            topic: topic,
            msg: payloadString,
            Message: Message,
          })
        }
        if (Number(map[router].endtime) < nowTime)
          this.unsubscribe(map[router].topic, router)
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
     * @param splitTopic
     * @param splitkey
     * @return {boolean}
     */
    checkTopic(splitTopic, splitKey) {
      const map = Map2Json(this.mapTopic)
      let length = splitTopic.length > splitKey.length ? splitKey : splitTopic
      for (let k in length) {
        if (splitKey[k] == '#') {
          return true
        } else if (splitKey[k] == '+' || splitTopic[k] == splitKey[k]) {
        } else {
          return false
        }
      }
      return false
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
      if (_.isEmpty(options.id)) {
        console.info(
          '%c%s',
          'color: green;font-size: 24px;',
          'options 为空 不连接mqtt'
        )
        return false
      } else {
        console.info(
          '%c%s',
          'color: green;font-size: 24px;',
          `${options.time} mqtt连接信息` + JSON.stringify(options)
        )
      }
      iotMqtt.init({
        id: options.id,
        ip: options.ip,
        port: options.port,
        userName: options.userName,
        passWord: options.passWord,
        success: (msg = `clientId为${_this.clientId},iotMqtt连接成功`) => {
          _this.mqttSuccess(msg)
          if (_this.mapTopic) _this.connectCheckTopic()
        },
        error: function (msg = `iotMqtt接失败,自动重连`) {
          _this.mqttError(msg)
        },
        connectLost: function (msg = `iotMqtt连接丢失`) {
          _this.connectLost()
        },
        onMessage: function (Message) {
          _this.onMessage(Message)
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
      iotMqtt.subscribe(this.objectId)
      this.subscribe(this.objectId)
    },
    /**
     *
     * @param msg
     */
    mqttError(msg = 'error') {
      console.groupCollapsed(
        '%ciotMqtt Connection failed',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.error('%c%s', 'color: red;font-size: 24px;', msg)
      console.groupEnd()
      this.reconnect()
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
      const {
        destinationName = 'destinationName',
        duplicate = 'duplicate',
        payloadBytes = 'payloadBytes',
        payloadString = 'payloadString',
        qos = 'qos',
        retained = 'retained',
      } = Message
      const table = {
        destinationName: destinationName,
        duplicate: duplicate,
        payloadBytes: payloadBytes,
        payloadString: payloadString,
        qos: qos,
        retained: retained,
      }
      this.consoleTale.push(table)
      console.groupCollapsed(
        '%ciotMqtt onMessage',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.table(this.consoleTale)
      console.groupEnd()

      this.busSendMsg(destinationName, payloadString, Message)
    },
    /**
     *
     * @param topic
     * @param timeout
     */
    subscribe: function (topic, router, timeout = 1000 * 60 * 60 * 3) {
      let endtime = Number(moment().format('x')) + timeout
      this.MapTopic.set(router, { topic: topic, endtime: endtime })
      this.setMapTopic(this.MapTopic)
      iotMqtt.subscribe(topic)
      console.groupCollapsed(
        '%ciotMqtt subscribe',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.info(
        '%c%s',
        'color: green;font-size: 24px;',
        'subscribe topic:   ' + topic
      )
      console.groupEnd()
    },
    unsubscribe: function (topic, router) {
      iotMqtt.unsubscribe(topic)
      const map = this.mapTopic
      if (!_.isEmpty(map)) {
        console.info(map)
        map.delete(topic)
        map.delete(router)
        this.setMapTopic(map)
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
      iotMqtt.reconnect()
      console.groupCollapsed(
        '%ciotMqtt reconnect',
        'color:#009a61; font-size: 28px; font-weight: 300'
      )
      console.warn('%c%s', 'color: yellow;font-size: 24px;', msg)
      console.groupEnd()
    },
    /**
     *
     * @param topic
     * @param obj
     */
    sendMessage(topic, obj) {
      // 数据发送
      try {
        console.groupCollapsed(
          '%csendMsg',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.groupEnd()
        iotMqtt.sendMessage(topic, obj)
      } catch (err) {
        console.groupCollapsed(
          '%ciotMqtt sendMessage error',
          'color:#009a61; font-size: 28px; font-weight: 300'
        )
        console.warn('%c%s', 'color: red;font-size: 24px;', msg)
        console.groupEnd()
      }
    },
  },
}
export default MqttMixin
