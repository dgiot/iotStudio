<!--eslint-disable-->
<template>
  <div class="DynamicForms">
    <el-form
      class="form"
      ref="form"
      label-width="80px"
      :model="ruleContent"
      size="mini"
    >
      <el-form-item :label="$translateTitle('rule.rule Id')">
        <el-input
          v-model="formInline.ruleId"
          :readonly="$route.query.title == '编辑'"
          type="text"
        />
      </el-form-item>
      <el-form-item :label="$translateTitle('rule.Remarks')">
        <el-input v-model="formInline.remarks" type="text" />
      </el-form-item>
      <el-divider content-position="left">触发器(Trigger)</el-divider>
      <el-row :gutter="24">
        <el-col
          v-for="(item, index) in ruleContent.trigger.items"
          :key="index"
          :span="24"
        >
          <el-row :gutter="24">
            <el-col :lg="4" :md="6" :sm="8" :xl="8" :xs="8">
              <el-form-item
                label-width="60px"
                :label="'方式' + (Number(index) + 1)"
                :prop="item + '.uri'"
                :rules="[
                  {
                    required: true,
                    message: '请选择触发方式',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select v-model="item.uri" placeholder="请选择触发方式">
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
              :lg="6"
              :md="8"
              :sm="10"
              :xl="10"
              :xs="10"
            >
              <el-form-item
                label="触发时间"
                :prop="item + '.params.cron'"
                :rules="[
                  {
                    required: true,
                    message: '请填写触发时间',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="item.params.cron"
                  placeholder="请填写触发时间"
                  style="width: 60%"
                />
              </el-form-item>
            </el-col>
            <!--mqtt事件触发-->
            <el-col
              v-if="item.uri == 'trigger/mqtt/event'"
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="mqtt事件"
                :prop="item + '.params.mqtt'"
                :rules="[
                  {
                    required: true,
                    message: '请选择mqtt事件',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.mqtt"
                  placeholder="请选择mqtt事件"
                >
                  <el-option
                    v-for="_item in options.mqttEvent"
                    :key="_item.lable"
                    :label="_item.label"
                    :value="_item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <!--设备事件触发-->
            <el-col
              v-if="
                item.uri === 'trigger/product/event' ||
                item.uri === 'trigger/mqtt/event'
              "
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="产品信息"
                :prop="item + '.params.productKey'"
                :rules="[
                  {
                    required: true,
                    message: '请选择产品信息',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.productKey"
                  placeholder="请选择产品信息"
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
              v-if="
                item.uri === 'trigger/product/event' ||
                item.uri === 'trigger/mqtt/event'
              "
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="设备信息"
                :prop="item + '.params.deviceName'"
              >
                <el-select
                  v-model="item.params.deviceName"
                  placeholder="请选择设备信息"
                >
                  <el-option
                    v-for="deviceName in filtersDevice(item.params.productKey)"
                    :key="deviceName.objectId"
                    :label="deviceName.name"
                    :value="deviceName.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                item.uri === 'trigger/product/event' ||
                item.uri === 'trigger/mqtt/event'
              "
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="事件"
                :prop="item + '.params.propertyName'"
                :rules="[
                  {
                    required: true,
                    message: '请选择物模型事件',
                    trigger: 'change',
                  },
                ]"
                label-width="80px"
              >
                <el-select
                  v-model="item.params.propertyName"
                  placeholder="请选择物模型事件"
                  style="width: 100%"
                >
                  <el-option
                    v-for="propertyName in filtersProperty(
                      item.params.productKey
                    )"
                    :key="propertyName.identifier"
                    :label="propertyName.name"
                    style="width: 100%"
                    :value="propertyName.identifier"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!--设备属性触发-->
            <el-col
              v-if="item.uri == 'trigger/product/property'"
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="产品信息"
                :prop="item + '.params.productKey'"
                :rules="[
                  {
                    required: true,
                    message: '请选择产品信息',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.productKey"
                  placeholder="请选择产品信息"
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
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="设备信息"
                :prop="item + '.params.deviceName'"
                :rules="[
                  {
                    required: true,
                    message: '请选择设备信息',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.deviceName"
                  placeholder="请选择设备信息"
                >
                  <el-option
                    v-for="device in filtersDevice(item.params.productKey)"
                    :key="device.objectId"
                    :label="device.name"
                    :value="device.objectId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="item.uri === 'trigger/product/property'"
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="属性"
                label-width="80px"
                :prop="item + '.params.propertyName'"
                :rules="[
                  {
                    required: true,
                    message: '请选择物模型属性',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.propertyName"
                  placeholder="请选择物模型属性"
                  style="width: 100%"
                >
                  <el-option
                    v-for="propert in filtersProperty(item.params.productKey)"
                    :key="propert.identifier"
                    :label="propert.name"
                    style="width: 100%"
                    :value="propert.identifier"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-if="item.uri === 'trigger/product/property'"
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="条件"
                label-width="80px"
                :prop="item + '.params.compareType'"
                :rules="[
                  {
                    required: true,
                    message: '请选择比较条件',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.compareType"
                  placeholder="请选择比较条件"
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
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="值"
                label-width="80px"
                :prop="item + '.params.compareValue'"
                :rules="[
                  {
                    required: true,
                    message: '请输入物模型比较值',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="item.params.compareValue"
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
      <el-divider />

      <el-divider content-position="left">执行条件(Conditions)</el-divider>
      <el-row :gutter="24">
        <el-col
          v-for="(condition, _index) in ruleContent.condition.items"
          :key="_index"
          :span="24"
        >
          <el-row :gutter="24">
            <el-col :lg="4" :md="6" :sm="8" :xl="8" :xs="8">
              <el-form-item
                label-width="60px"
                :label="'条件' + (Number(_index) + 1)"
                :prop="condition + '.uri'"
                :rules="[
                  {
                    required: true,
                    message: '请选择执行条件',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select v-model="condition.uri" placeholder="请选择执行条件">
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
            <el-col
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
              v-if="condition.uri == 'condition/device/stateContinue'"
            >
              <el-form-item
                label="设备状态"
                :prop="condition + '.params.state'"
                :rules="[
                  {
                    required: true,
                    message: '请选择设备状态',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="condition.params.state"
                  placeholder="请选择设备状态"
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
            <el-col
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
              v-if="condition.uri == 'condition/device/stateContinue'"
            >
              <el-form-item
                label="持续时长"
                :prop="condition + '.params.times'"
                :rules="[
                  {
                    required: true,
                    message: '请选择设备状态',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="condition.params.times"
                  placeholder="请选择"
                ></el-input>
              </el-form-item>
            </el-col>

            <!--设备状态-->
            <el-col
              v-if="condition.uri == 'condition/device/deviceState'"
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="产品信息"
                :prop="condition + '.params.productKey'"
                :rules="[
                  {
                    required: true,
                    message: '请选择产品信息',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="condition.params.productKey"
                  placeholder="请选择产品信息"
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
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="设备信息"
                :prop="condition + '.params.deviceName'"
                :rules="[
                  {
                    required: false,
                    message: '请选择设备信息',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="condition.params.deviceName"
                  placeholder="请选择设备信息"
                >
                  <el-option
                    v-for="item in filtersDevice(condition.params.productKey)"
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
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="属性"
                :prop="condition + '.params.propertyName'"
                :rules="[
                  {
                    required: true,
                    message: '请选择设备属性',
                    trigger: 'change',
                  },
                ]"
                label-width="80px"
              >
                <el-select
                  v-model="condition.params.propertyName"
                  placeholder="请选择设备属性"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in filtersProperty(condition.params.productKey)"
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
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="条件"
                :prop="condition + '.params.compareType'"
                :rules="[
                  { required: true, message: '请选择条件', trigger: 'change' },
                ]"
                label-width="80px"
              >
                <el-select
                  v-model="condition.params.compareType"
                  placeholder="请选择条件"
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
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="值"
                :prop="condition + '.params.compareValue'"
                :rules="[
                  {
                    required: true,
                    message: '请选择物模型比较值',
                    trigger: 'change',
                  },
                ]"
                label-width="80px"
              >
                <el-input
                  v-model="condition.params.compareValue"
                  placeholder="物模型比较值"
                />
              </el-form-item>
            </el-col>

            <!--时间范围-->
            <el-col
              v-if="condition.uri === 'condition/device/time'"
              :lg="4"
              :md="6"
              :sm="8"
              :xl="8"
              :xs="8"
            >
              <el-form-item
                label="起止时间"
                :prop="condition + '.params.compareValue'"
                :rules="[
                  {
                    required: true,
                    message: '请选择起止时间',
                    trigger: 'change',
                  },
                ]"
                label-width="80px"
              >
                <el-date-picker
                  v-model="condition.params.time"
                  value-format="timestamp"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col>
              <el-button
                v-if="_index == 0"
                size="mini"
                style="margin-left: 10px"
                type="success"
                @click.native="
                  ruleContent.condition.items.push({ uri: '', params: {} })
                "
              >
                新增执行条件
              </el-button>
              <el-button
                v-if="_index !== 0"
                size="mini"
                style="margin-left: 10px"
                type="danger"
                @click.native="
                  removeTriggerItem(
                    ruleContent.condition.items,
                    _index,
                    condition
                  )
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
  import { getDlinkJson } from '@/api/Dlink'
  import { sqlTpl } from '@/api/Rules'
  import { queryProduct } from '@/api/Product'
  import { queryDevice } from '@/api/Device'

  export default {
    name: 'DynamicForms',
    components: {
      //someComponent
    },
    props: {
      formInline: {
        type: Object,
        default() {
          return {}
        },
      },
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
                    productKey: '',
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
                    stateName: '',
                    duration: '',
                    compareType: '',
                    compareValue: '',
                  },
                },
              ],
            },
            action: [
              {
                uri: 'action/device/setProperty',
                params: {
                  productKey: '',
                  deviceName: '#',
                  propertyItems: {
                    Direction: '',
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
        rules: {},
        options: {},
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
        let arr = _.filter(this.options.Device, (o) => {
          return o.product.objectId == productId
        })
        arr.push({
          objectId: '#',
          name: '所有设备',
        })
        return arr
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
        this.options = await getDlinkJson('rule-options')
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
        const res = await sqlTpl(
          _.merge(this.ruleContent, {
            description: this.formInline.remarks,
            ruleid: this.formInline.ruleId,
          })
        )
        this.$emit('childByValue', res.template || res, this.ruleContent)
        this.$router.go(-1)
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
