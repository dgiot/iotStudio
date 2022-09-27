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
      <el-form-item :label="$translateTitle('equipment.Products')">
        <span style="fontSize:16px"> {{options.Product.name}} </span>
      </el-form-item>
      <el-form-item :label="$translateTitle('rule.rule Id')">
        <span v-if="formInline.flag">
           {{formInline.ruleId}}
        </span>
        <span v-else-if="$route.query.title == '编辑'" style="fontSize:16px"> {{formInline.ruleId}} </span>
        <el-input
            v-else
            v-model="formInline.ruleId"
            type="text"
        />
      </el-form-item>
      <el-form-item :label="$translateTitle('rule.Remarks')">
        <el-input :disabled="formInline.flag" v-model="formInline.remarks" type="text"/>
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
                <el-select :disabled="formInline.flag" v-model="item.uri" placeholder="请选择触发方式">
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
<!--            <el-col-->
<!--              v-if="item.uri === 'trigger/timer'"-->
<!--              :lg="6"-->
<!--              :md="8"-->
<!--              :sm="10"-->
<!--              :xl="10"-->
<!--              :xs="10"-->
<!--            >-->
<!--              <el-form-item-->
<!--                label="触发时间"-->
<!--                :prop="item + '.params.cron'"-->
<!--                :rules="[-->
<!--                  {-->
<!--                    required: true,-->
<!--                    message: '请填写触发时间',-->
<!--                    trigger: 'blur',-->
<!--                  },-->
<!--                ]"-->
<!--              >-->
<!--                <el-input-->
<!--                  v-model="item.params.cron"-->
<!--                  placeholder="请填写触发时间"-->
<!--                  style="width: 60%"-->
<!--                />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <!--mqtt事件触发-->
<!--            <el-col-->
<!--              v-if="item.uri == 'trigger/mqtt/event'"-->
<!--              :lg="4"-->
<!--              :md="6"-->
<!--              :sm="8"-->
<!--              :xl="8"-->
<!--              :xs="8"-->
<!--            >-->
<!--              <el-form-item-->
<!--                label="mqtt事件"-->
<!--                :prop="item + '.params.mqtt'"-->
<!--                :rules="[-->
<!--                  {-->
<!--                    required: true,-->
<!--                    message: '请选择mqtt事件',-->
<!--                    trigger: 'change',-->
<!--                  },-->
<!--                ]"-->
<!--              >-->
<!--                <el-select-->
<!--                  v-model="item.params.mqtt"-->
<!--                  placeholder="请选择mqtt事件"-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="_item in options.mqttEvent"-->
<!--                    :key="_item.lable"-->
<!--                    :label="_item.label"-->
<!--                    :value="_item.value"-->
<!--                  />-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <!--设备事件触发-->
<!--            <el-col-->
<!--              v-if="-->
<!--                item.urif === 'trigger/product/event' ||-->
<!--                item.uri === 'trigger/mqtt/event'-->
<!--              "-->
<!--              :lg="4"-->
<!--              :md="6"-->
<!--              :sm="8"-->
<!--              :xl="8"-->
<!--              :xs="8"-->
<!--            >-->
<!--              <el-form-item-->
<!--                label="设备信息"-->
<!--                :prop="item + '.params.deviceName'"-->
<!--              >-->
<!--                <el-select-->
<!--                  v-model="item.params.deviceName"-->
<!--                  placeholder="请选择设备信息"-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="deviceName in options.Device"-->
<!--                    :key="deviceName.objectId"-->
<!--                    :label="deviceName.name"-->
<!--                    :value="deviceName.objectId"-->
<!--                  >-->
<!--                    <span style="float: left">{{ deviceName.name }}</span>-->
<!--                    <span style="float: right; font-size: 13px; color: #8492a6">-->
<!--                      {{ deviceName.objectId }}-->
<!--                    </span>-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col-->
<!--              v-if="-->
<!--                item.uri === 'trigger/product/event' ||-->
<!--                item.uri === 'trigger/mqtt/event'-->
<!--              "-->
<!--              :lg="4"-->
<!--              :md="6"-->
<!--              :sm="8"-->
<!--              :xl="8"-->
<!--              :xs="8"-->
<!--            >-->
<!--              <el-form-item-->
<!--                label="事件"-->
<!--                :prop="item + '.params.propertyName'"-->
<!--                :rules="[-->
<!--                  {-->
<!--                    required: true,-->
<!--                    message: '请选择物模型事件',-->
<!--                    trigger: 'change',-->
<!--                  },-->
<!--                ]"-->
<!--                label-width="80px"-->
<!--              >-->
<!--                <el-select-->
<!--                  v-model="item.params.propertyName"-->
<!--                  placeholder="请选择物模型事件"-->
<!--                  style="width: 100%"-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="propertyName in options.properties"-->
<!--                    :key="propertyName.identifier"-->
<!--                    :label="propertyName.name"-->
<!--                    style="width: 100%"-->
<!--                    :value="propertyName.identifier"-->
<!--                  />-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->

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
                label="设备"
                :prop="item + '.params.deviceName'"
                :rules="[
                  {
                    required: true,
                    message: '请选择设备',
                    trigger: 'change',
                  },
                ]"
              >
                <el-select
                  v-model="item.params.deviceName"
                  placeholder="请选择设备"
                  :disabled="formInline.flag"
                >
                  <el-option
                    v-for="deviceName in options.Device"
                    :key="deviceName.objectId"
                    :label="deviceName.name"
                    :value="deviceName.objectId"
                  >
                    <span style="float: left">{{ deviceName.name }}</span>
                    <span style="float: right; font-size: 13px; color: #8492a6">
                      {{ deviceName.objectId }}
                    </span>
                  </el-option>
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
                  :disabled="formInline.flag"
                >
                  <el-option
                    v-for="propert in options.properties"
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
                    :disabled="formInline.flag"
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
                    :disabled="formInline.flag"
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
<!--                     uri: '',-->
<!--                     params: {-->
<!--                       productKey: '',-->
<!--                       compareType: '',-->
<!--                       compareValue: '',-->
<!--                       propertyName: '',-->
<!--                       eventCode: '',-->
<!--                     },-->
<!--                   })"-->
<!--              >-->
<!--                新增触发器-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                v-if="index !== 0"-->
<!--                size="mini"-->
<!--                style="margin-left: 10px"-->
<!--                type="danger"-->
<!--                @click.native="-->
<!--                             removeTriggerItem(ruleContent.trigger.items, index, item)-->
<!--                           "-->
<!--              >-->
<!--                删除触发器-->
<!--              </el-button>-->
<!--            </el-col>-->
          </el-row>
        </el-col>
      </el-row>
      <el-divider/>

      <el-form-item size="mini" label-width="0">
        <el-button v-if="!formInline.flag" type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getDlinkJson } from '@/api/Dlink'
  import { sqlTpl } from '@/api/Rules'
  import { getProduct } from '@/api/Product'
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
            trigger: {
              items: [
                {
                  uri: 'trigger/product/property',
                  params: {
                    productKey: '',
                  },
                },
              ],
            },
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
      await this.queryOptions(this.$route.query.productid)
    },
    methods: {
      removeTriggerItem(items, index, item) {
        if (index !== -1) items.splice(index, 1)
      },
      async queryOptions(productid) {
        this.options = await getDlinkJson('rule-options')
        this.options.Device = []
        this.options.Product = {}
        this.options.properties = []
        const Product = await getProduct(productid)
        this.options.Product = Product

        let properties = Product.thing.properties
        this.options.properties = properties

        const params = {
          where: { product: productid },
        }
        const { results: Device = [] } = await queryDevice(params)
        Device.push({
          objectId: '#',
          name: '所有设备',
        })
        this.options.Device = Device
        dgiotlogger.log('queryOptions----')
        dgiotlogger.log('Device', Device)
        dgiotlogger.log('Product', Product)
        dgiotlogger.log('properties', properties)
      },
      async onSubmit() {
        const res = await sqlTpl(
          _.merge(this.ruleContent, {
            productid: this.$route.query.productid
              ? this.$route.query.productid
              : 'test',
            description: this.formInline.remarks,
            ruleid: this.formInline.ruleId,
          })
        )
        this.$emit('childByValue', res.template || res, this.ruleContent)
        if (!this.$route.query.debug == true) this.$router.go(-1)
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
