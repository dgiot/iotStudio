<template>
  <div class="log log-container">
    <div>
      <a-tabs default-active-key="editor" @change="stopchannel">
        <a-tab-pane key="editor">
          <span slot="tab">
            <dgiot-icon icon="aspect-ratio-fill" />
            {{ $translateTitle('Logs.console') }}
          </span>
          <dgiot-editor
            :key="refreshFlag"
            lang="text"
            :max-lines="isFullscreen ? 1000 / 12 : 1000 / 12"
            :min-lines="isFullscreen ? 1000 / 12 : 1000 / 12"
            theme="gob"
            :value="msg"
          />
        </a-tab-pane>
        <a-tab-pane key="table">
          <span slot="tab">
            <dgiot-icon icon="table-2" />
            {{ $translateTitle('Logs.table') }}
          </span>
          <el-table
            v-loading="listLoading"
            :data="
              list.slice(
                (queryForm.pageNo - 1) * queryForm.pageSize,
                queryForm.pageNo * queryForm.pageSize
              )
            "
          >
            <el-table-column
              align="center"
              :label="$translateTitle('home.updatedAt')"
              prop="timestamp"
              show-overflow-tooltip
              sortable
              width="230px"
            >
              <template #default="{ row }">
                <span>
                  {{
                    $moment(Number(row.timestamp)).format(
                      'YYYY-MM-DD HH:mm:ss.SSS'
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$translateTitle('product.log')"
              prop="msg"
              show-overflow-tooltip
              sortable
            >
              <template #default="{ row }">
                <el-input v-model="row.msg">
                  <el-button
                    slot="prepend"
                    v-copyText="row.msg"
                    icon="el-icon-copy-document"
                  />
                </el-input>
              </template>
            </el-table-column>
            <template #empty>
              <a-empty class="dgiot-data-empty" :description="false" />
            </template>
          </el-table>
          <el-pagination
            background
            :current-page="queryForm.pageNo"
            :layout="layout"
            :page-size="queryForm.pageSize"
            :total="list.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </a-tab-pane>

        <a-tab-pane key="device">
          <span slot="tab">
            <dgiot-icon icon="traffic-light-line" />
            {{ $translateTitle('system.Accurate log') }}
          </span>
          <el-row :gutter="24">
            <dgiot-query-form>
              <dgiot-query-form-top-panel>
                <el-form
                  :inline="true"
                  label-width="120px"
                  size="mini"
                  @submit.native.prevent
                >
                  <el-form-item>
                    <span slot="label">
                      {{ $translateTitle('alert.productname') }}
                      <el-badge class="item" :value="product.length" />
                    </span>
                    <el-select
                      v-model="queryForm.product"
                      @change="queryDevice()"
                    >
                      <el-option
                        v-for="item in product"
                        :key="item.name"
                        :label="item.name"
                        :value="item.objectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </dgiot-query-form-top-panel>
            </dgiot-query-form>
          </el-row>
          <el-table border :data="Device" style="width: 100%">
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.devicename')"
              prop="name"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              align="center"
              :label="$translateTitle('equipment.devicenumber')"
              prop="devaddr"
              show-overflow-tooltip
              sortable
            />
            <el-table-column
              align="center"
              :label="$translateTitle('product.log')"
            >
              <template #default="{ row }">
                <el-button type="text" @click="subscriptionlog(row.devaddr)">
                  {{ $translateTitle('product.subscriptionlog') }}
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-image
                class="dgiot-data-empty"
                :src="
                  require('../../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                "
              />
            </template>
          </el-table>
        </a-tab-pane>
      </a-tabs>
      <el-dialog
        append-to-body
        top="1vh"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <dgiot-editor
          :key="editorKey"
          lang="text"
          :max-lines="isFullscreen ? 1000 / 12 : 1000 / 12"
          :min-lines="isFullscreen ? 1000 / 12 : 1000 / 12"
          theme="gob"
          :value="deviceLog"
        />
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { queryDevice } from '@/api/Device/index'
  import { subupadte } from '@/api/System'
  import { queryProduct } from '@/api/Product'

  export default {
    name: 'MqttLog',
    components: {},
    props: {
      channelId: {
        type: String,
        default: '',
        required: false,
      },
      msg: {
        type: String,
        default: 'Starting the log' + `\n`,
        required: false,
      },
      list: {
        type: Array,
        default: () => [],
        required: false,
      },
      refreshFlag: {
        type: String,
        default: '',
        required: false,
      },
    },
    data() {
      return {
        product: [],
        router: '',
        pubtopic: '',
        topicKey: '',
        dialogVisible: false,
        editorKey: moment().format('x'),
        deviceLog: '',
        loading: false,
        Device: [],
        height: this.$baseTableHeight(0) + 60,
        clickItem: '',
        isFullscreen: false,
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          product: '',
          device: '',
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
        },
      }
    },
    watch: {
      product(data) {
        if (data?.length) {
          this.queryForm.product = data[0].objectId
          this.queryDevice()
        }
      },
    },
    mounted() {},
    async beforeDestroy() {
      // this.$dgiotBus.$emit('MqttUnbscribe', this.topicKey, this.subtopic)
      await this.$unSubscribe(this.subtopic)
    },
    methods: {
      async stopchannel(val) {
        if (val == 'device') {
          this.productinformation(this.channelId)
          this.$dgiotBus.$emit(
            'MqttUnbscribe',
            this.$dgiotBus.router(this.$route.fullPath),
            '$dg/user/' + this.channelId + '/#'
          )
        } else if (val == 'editor') {
          subupadte(this.channelId, 'start_logger')
          let subtopic = '$dg/user/channel/' + this.channelId + '/#'
          await this.$nopostsubscribe(subtopic)
          _this = this
          _this.msg = 'Starting the log' + `\n`
          this.$dgiotBus.$off(this.$mqttInfo.topicKey)
          this.$dgiotBus.$on(this.$mqttInfo.topicKey, (res) => {
            const { payloadString } = res
            this.mqttMsg(payloadString)
          })
        }
      },
      mqttMsg(Msg) {
        this.editorKey = moment().format('x')
        this.deviceLog += Msg + `\n`
      },
      async subscriptionlog(devaddr) {
        this.editorKey = moment().format('x')
        this.deviceLog = 'Starting the log' + `\n`
        this.pubtopic =
          'channel/' +
          this.channelId +
          '/' +
          this.queryForm.product +
          '/' +
          devaddr
        this.subtopic = '$dg/user/' + this.pubtopic
        await this.$subscribe(this.subtopic)
        console.log(this.$mqttInfo)
        this.$dgiotBus.$off(this.$mqttInfo.topicKey)
        this.$dgiotBus.$on(this.$mqttInfo.topicKey, (res) => {
          const { payloadString } = res
          //  过滤登录时候，首页mqtt乱码的情况
          this.mqttMsg(payloadString)
        })

        this.dialogVisible = !this.dialogVisible
      },
      async productinformation(ChannelId) {
        try {
          const params = {
            order: '-createdAt',
            skip: 0,
            where: {
              $relatedTo: {
                object: {
                  __type: 'Pointer',
                  className: 'Channel',
                  objectId: ChannelId,
                },
                key: 'product',
              },
            },
          }
          const { results = [], count: total = 0 } = await queryProduct(params)
          this.product = results
        } catch (error) {
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      async queryDevice() {
        try {
          const loading = this.$baseColorfullLoading()
          const params = {
            order: '-createdAt',
            keys: 'objectId,name,devaddr',
            where: {
              product: this.queryForm.product
                ? this.queryForm.product
                : {
                    $ne: null,
                    $exists: true,
                  },
            },
          }
          const { results } = await queryDevice(params)
          loading.close()
          this.Device = results
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },

      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      async fetchData() {
        //   this.listLoading = true
        //   const {
        //     data: { list, total },
        //   } = await getList(this.queryForm)
        //   this.list = list
        //   this.total = total
        //   this.listLoading = false
      },
    },
  }
</script>
