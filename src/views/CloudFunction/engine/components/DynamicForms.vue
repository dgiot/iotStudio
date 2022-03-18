<!--eslint-disable-->
<template>
  <div class="DynamicForms">
    <el-form class="form" ref="form" label-width="80px" :model="ruleContent" size="mini">
      <el-divider content-position="left">触发器(Trigger)</el-divider>
      <el-row :gutter="24">
        <el-col
          v-for="(item, index) in ruleContent.trigger.items"
          :key="index"
          :span="24"
        >
          <el-row :gutter="24">
            <el-col :lg="4" :md="6" :sm="8" :xl="8" :xs="8">
              <el-form-item :label="'触发方式' + index" prop="uri">
                <el-select
                  v-model="ruleContent.trigger.items[index].uri"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.Trigger"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 定时触发-->
            <el-col
              v-if="item.uri === 'trigger/timer'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="触发时间" prop="time">
                <el-input
                  v-model="ruleContent.trigger.items[index].params.cron"
                  placeholder="placeholder"
                  style="width: 60%"
                />
              </el-form-item>
            </el-col>
            <!--mqtt事件触发-->
            <el-col
              v-if="item.uri == 'trigger/mqtt/event'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="mqtt事件">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.mqtt"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.mqttEvent"
                    :key="item.lable"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--设备事件触发-->
            <el-col
              v-if="item.uri === 'trigger/product/event' || item.uri === 'trigger/mqtt/event'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="产品信息">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.productKey"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.Product"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="item.uri === 'trigger/product/event'||item.uri === 'trigger/mqtt/event'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="设备信息">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.deviceName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in filtersDevice(
                      ruleContent.trigger.items[index].params.productKey
                    )"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="item.uri === 'trigger/product/event' ||item.uri === 'trigger/mqtt/event'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="事件" label-width="80px">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.propertyName"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in filtersProperty(
                      ruleContent.trigger.items[index].params.productKey
                    )"
                    :key="item.identifier"
                    :label="item.name"
                    style="width: 100%"
                    :value="item.identifier"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!--设备属性触发-->
            <el-col
              v-if="item.uri == 'trigger/product/property'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="产品信息">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.productKey"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.Product"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="item.uri == 'trigger/product/property'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="设备信息">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.deviceName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in filtersDevice(
                      ruleContent.trigger.items[index].params.productKey
                    )"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="item.uri === 'trigger/product/property'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="属性" label-width="80px">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.propertyName"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in filtersProperty(
                      ruleContent.trigger.items[index].params.productKey
                    )"
                    :key="item.identifier"
                    :label="item.name"
                    style="width: 100%"
                    :value="item.identifier"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-if="item.uri === 'trigger/product/property'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="条件" label-width="80px">
                <el-select
                  v-model="ruleContent.trigger.items[index].params.compareType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in options.erlOperator"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-if="item.uri === 'trigger/product/property'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="值" label-width="80px">
                <el-input
                  v-model="ruleContent.trigger.items[index].params.compareValue"
                  placeholder="物模型比较值"
                />
              </el-form-item>
            </el-col>

            <!--            <el-col>-->
            <!--              <el-button-->
            <!--                v-if="index == 0"-->
            <!--                size="mini"-->
            <!--                style="margin-left: 10px"-->
            <!--                type="success"-->
            <!--                @click.native="ruleContent.trigger.items.push({-->
            <!--          uri: '',-->
            <!--          params: {-->
            <!--            productKey: '',-->
            <!--            compareType: '',-->
            <!--            compareValue: '',-->
            <!--            propertyName: '',-->
            <!--            eventCode: '',-->
            <!--          },-->
            <!--        })"-->
            <!--              >-->
            <!--                新增触发器-->
            <!--              </el-button>-->
            <!--              <el-button-->
            <!--                v-if="index !== 0"-->
            <!--                size="mini"-->
            <!--                style="margin-left: 10px"-->
            <!--                type="danger"-->
            <!--                @click.native="-->
            <!--                  removeTriggerItem(ruleContent.trigger.items, index, item)-->
            <!--                "-->
            <!--              >-->
            <!--                删除触发器-->
            <!--              </el-button>-->
            <!--            </el-col>-->
            <!-- mqtt事件触发-->
          </el-row>
        </el-col>
      </el-row>
      <el-divider/>

      <el-divider content-position="left">执行条件(Conditions)</el-divider>
      <el-row :gutter="24">
        <el-col
          v-for="(condition, _index) in ruleContent.condition.items"
          :key="_index"
          :span="24"
        >
          <el-row :gutter="24">
            <el-col :lg="4" :md="6" :sm="8" :xl="8" :xs="8">
              <el-form-item :label="'执行条件' + _index" prop="uri">
                <el-select
                  v-model="condition.uri"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.Condition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--            状态持续时长判断-->
            <el-col :lg="4" :md="6" :sm="8" :xl="8" :xs="8" v-if="condition.uri=='condition/device/stateContinue'">
              <el-form-item label="设备状态" prop="uri">
                <el-select
                  v-model="condition.params.state"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.line"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--            状态持续时长判断-->
            <el-col :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
                    v-if="condition.uri=='condition/device/stateContinue'">
              <el-form-item label="持续时长" prop="uri">
                <el-input
                  v-model="condition.params.times"
                  placeholder="请选择"
                >
                </el-input>
              </el-form-item>
            </el-col>

            <!--设备状态-->
            <el-col
              v-if="condition.uri == 'condition/device/deviceState'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="产品信息">
                <el-select
                  v-model="condition.params.productKey"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options.Product"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--设备状态-->
            <el-col
              v-if="condition.uri == 'condition/device/deviceState'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="设备信息">
                <el-select
                  v-model="condition.params.deviceName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in filtersDevice(
                      condition.params.productKey
                    )"
                    :key="item.objectId"
                    :label="item.name"
                    :value="item.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--设备状态-->
            <el-col
              v-if="condition.uri === 'condition/device/deviceState'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="属性" label-width="80px">
                <el-select
                  v-model="condition.params.propertyName"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in filtersProperty(
                     condition.params.productKey
                    )"
                    :key="item.identifier"
                    :label="item.name"
                    style="width: 100%"
                    :value="item.identifier"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--设备状态-->
            <el-col
              v-if="condition.uri === 'condition/device/deviceState'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="条件" label-width="80px">
                <el-select
                  v-model="condition.params.compareType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in options.erlOperator"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--设备状态-->
            <el-col
              v-if="condition.uri === 'condition/device/deviceState'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="值" label-width="80px">
                <el-input
                  v-model="condition.params.compareValue"
                  placeholder="物模型比较值"
                />
              </el-form-item>
            </el-col>

            <!--时间范围-->
            <el-col
              v-if="condition.uri === 'condition/device/time'"
              :lg="4" :md="6" :sm="8" :xl="8" :xs="8"
            >
              <el-form-item label="起止时间" label-width="80px">
                <el-date-picker
                  v-model="condition.params.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>

              </el-form-item>
            </el-col>


            <el-col>
              <el-button
                v-if="_index == 0"
                size="mini"
                style="margin-left: 10px"
                type="success"
                @click.native="ruleContent.condition.items.push({uri: '', params: {}})"
              >
                新增执行条件
              </el-button>
              <el-button
                v-if="_index !== 0"
                size="mini"
                style="margin-left: 10px"
                type="danger"
                @click.native="
                  removeTriggerItem(ruleContent.condition.items, _index, condition)
                "
              >
                删除执行条件
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--      <el-divider content-position="left">执行动作(Actions)</el-divider>-->

      <el-form-item size="mini" label-width="0">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { sqlTpl } from '@/api/Rules'
  import { queryProduct } from '@/api/Product'
  import { queryDevice } from '@/api/Device'

  export default {
    name: 'DynamicForms',
    components: {
      //someComponent
    },
    props: {
      ruleContent: {
        type: Object,
        default() {
          return {
            type: 'IFTTT',
            trigger: {
              uri: 'logical/or',
              items: [
                {
                  uri: 'trigger/product/event',
                  params: {
                    productKey: 'a1lcmeFVu97',
                  },
                },
              ],
            },
            condition: {
              uri: 'logical/and',
              items: [
                {
                  uri: 'condition/device/stateContinue',
                  params: {
                    stateName: 'event.status',
                    duration: 8,
                    compareType: '==',
                    compareValue: 1,
                  },
                },
              ],
            },
            action: [
              {
                uri: 'action/device/setProperty',
                params: {
                  productKey: 'a1lcmeFVu97',
                  deviceName: 'kEdtCEM8p9bYJYUO1rDI',
                  propertyItems: {
                    Direction: 1,
                  },
                },
              },
              {
                uri: 'action/scene/trigger',
                params: {
                  automationRuleId: 'b362b597dacc4da58d63ec2abb95355d',
                },
              },
              {
                uri: 'action/event/triggerAlarm',
                params: {},
              },
            ],
          }
        },
      },
    },

    data() {
      return {
        options: {
          erlOperator: [
            '>',
            '>=',
            '<',
            '<=',
            '==',
            '=:=',
            '/=',
            '=/=',
            '!=',
            'in',
          ], //ERLANG比较运算符  https://blog.csdn.net/u010164190/article/details/51005282
          mqttEvent: [
            { label: '消息投递', value: 'message_delivered' },
            { label: '消息确认', value: 'message_acked' },
            { label: '消息丢弃', value: 'message_dropped' },
            { label: '连接完成', value: 'client_connected' },
            { label: '连接断开', value: 'client_disconnected' },
            { label: '订阅', value: 'session_subscribed' },
            { label: '取消订阅', value: 'session_unsubscribed' },
          ], // mqtt事件
          mqttConfig: [
            { label: '消息目的 Client ID', value: 'clientid' },
            { label: '终端连接完成时间 (s)', value: 'connected_at' },
            { label: 'MQTT 消息 ID', value: 'id' },
            { label: '用户名', value: 'username' },
            { label: '客户端地址', value: 'peerhost' },
            { label: 'MQTT topic', value: 'topic' },
            { label: 'MQTT qos', value: 'qos' },
            { label: 'MQTT flags', value: 'flags' },
            { label: '事件触发时间 (ms)', value: 'timestamp' },
            {
              label: 'PUBLISH 消息到达 Broker 的时间 (ms)',
              value: 'publish_received_at',
            },
            { label: '事件触发节点', value: 'node' },
          ],
          line: [
            { label: '设备在线', value: 'online' },
            { label: '设备离线', value: 'line' },
          ],
          Product: [],
          Device: [],
          Condition: [
            {
              label: '状态持续时长判断',
              value: 'condition/device/stateContinue',
            },
            {
              label: '设备状态',
              value: 'condition/device/deviceState',
            },
            { label: '时间范围', value: 'condition/device/time' },
            // { label: '设备属性值', value: 'condition/device/property' },
          ],
          Trigger: [
            {
              label: '设备属性触发',
              value: 'trigger/product/property',
            },
            {
              label: '设备事件触发',
              value: 'trigger/product/event',
            },
            {
              label: 'mqtt事件触发',
              value: 'trigger/mqtt/event',
            },
            {
              label: '定时触发',
              value: 'trigger/timer',
            },
          ],
        },
      }
    },
    async created() {
      await this.queryOptions()
    },
    methods: {
      removeTriggerItem(items, index, item) {
        if (index !== -1) items.splice(index, 1)
      },
      filtersDevice(productId) {
        return _.filter(this.options.Device, (o) => {
          return o.product.objectId == productId
        })
      },
      filtersProperty(productId) {
        let res = []
        res = _.filter(this.options.Product, function (o) {
          if (o.objectId == productId) return o.thing.properties
        })

        if (res.length) {
          _.merge(res[0], { thing: { properties: [] } })
          dgiotlogger.log(res[0].thing.properties)
          return res[0].thing.properties
        } else {
          return []
        }
      },
      async queryOptions() {
        this.options.Device = []
        this.options.Product = []
        const { results: Product = [] } = await queryProduct({})
        this.options.Product = Product
        const { results: Device = [] } = await queryDevice({})
        this.options.Device = Device
        dgiotlogger.log('queryOptions----')
        dgiotlogger.log('Device', Device)
        dgiotlogger.log('Product', Product)
      },
      async onSubmit() {
        console.log(this.ruleContent)
        console.log('submit!')
        const res = await sqlTpl(this.ruleContent)
        console.log(res)
      },
    },
  }
</script>

<style scoped lang="scss">
  .DynamicForms {
    ::v-deep {
      .form {
        .el-row {
          border-bottom: 1px solid #fff !important;
        }
      }
    }
  }
</style>
