<template>
  <div class="log log-container">
    <div>
      <a-tabs default-active-key="editor">
        <a-tab-pane key="editor">
          <span slot="tab">
            <vab-icon icon="aspect-ratio-fill" />
            {{ $translateTitle('Logs.console') }}
          </span>
          <vab-editor
            :key="refreshFlag"
            :value="msg"
            :height="
              isFullscreen
                ? Number($baseTableHeight(0))
                : Number($baseTableHeight(0))
            "
            :max-lines="
              isFullscreen
                ? Number($baseTableHeight(0)) / 12
                : Number($baseTableHeight(0)) / 12
            "
            :min-lines="
              isFullscreen
                ? Number($baseTableHeight(0)) / 12
                : Number($baseTableHeight(0)) / 12
            "
            lang="text"
            theme="gob"
          />
        </a-tab-pane>
        <a-tab-pane key="table">
          <span slot="tab">
            <vab-icon icon="table-2" />
            {{ $translateTitle('Logs.table') }}
          </span>
          <el-table
            v-loading="listLoading"
            :height="height"
            :data="
              list.slice(
                (queryForm.pageNo - 1) * queryForm.pageSize,
                queryForm.pageNo * queryForm.pageSize
              )
            "
          >
            <el-table-column
              align="center"
              sortable
              :label="$translateTitle('home.updatedAt')"
              prop="timestamp"
              show-overflow-tooltip
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
              prop="msg"
              sortable
              :label="$translateTitle('product.log')"
              show-overflow-tooltip
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
              <a-empty class="vab-data-empty" :description="false" />
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

        <a-tab-pane key="device" :disabled="!product.length">
          <span slot="tab">
            <vab-icon icon="traffic-light-line" />
            {{ $translateTitle('system.Accurate log') }}
          </span>
          <el-row :gutter="24">
            <vab-query-form>
              <vab-query-form-top-panel>
                <el-form
                  size="mini"
                  :inline="true"
                  label-width="120px"
                  @submit.native.prevent
                >
                  <el-form-item>
                    <span slot="label">
                      {{ $translateTitle('alert.productname') }}
                      <el-badge :value="product.length" class="item" />
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
              </vab-query-form-top-panel>
            </vab-query-form>
          </el-row>
          <el-table
            border
            :data="Device"
            :height="$baseTableHeight(0) - 90"
            style="width: 100%"
          >
            <el-table-column
              sortable
              show-overflow-tooltip
              align="center"
              :label="$translateTitle('equipment.devicename')"
              prop="name"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              align="center"
              :label="$translateTitle('equipment.devicenumber')"
              prop="devaddr"
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
                class="vab-data-empty"
                src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/platform/assets/empty_images/data_empty.png"
              />
            </template>
          </el-table>
        </a-tab-pane>
      </a-tabs>
      <el-dialog
        append-to-body
        :visible.sync="dialogVisible"
        width="50%"
        top="1vh"
      >
        <vab-editor
          :key="editorKey"
          :value="deviceLog"
          :height="
            isFullscreen
              ? Number($baseTableHeight(0))
              : Number($baseTableHeight(0))
          "
          :max-lines="
            isFullscreen
              ? Number($baseTableHeight(0)) / 12
              : Number($baseTableHeight(0)) / 12
          "
          :min-lines="
            isFullscreen
              ? Number($baseTableHeight(0)) / 12
              : Number($baseTableHeight(0)) / 12
          "
          lang="text"
          theme="gob"
        />
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { queryDevice } from '@/api/Device/index'
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
        default: '',
        required: false,
      },
      list: {
        type: Array,
        default: () => [],
        required: false,
      },
      product: {
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
      watch: {
        topicKey: {
          handler: function (newVal, oldval) {
            console.log('newVal topicKey', newVal)
            console.log('oldval topicKey', oldval)
            let _this = this
            if (newVal) {
              this.$dgiotBus.$off(newVal)
              this.$dgiotBus.$on(newVal, (res) => {
                console.error(res)
                const { payload } = res
                this.mqttMsg(payload)
              })
            }
            if (oldval) {
              // 取消订阅
              _this.submessage = ''
              _this.msgList = []
              _this.logKey = '99'
            }
          },
          deep: true,
          limit: true,
        },
      },
    },
    mounted() {},
    methods: {
      mqttMsg(Msg) {
        this.msgList.push({
          timestamp: moment().format('x'),
          msg: Msg,
        })
        this.editorKey = moment().format('x')
        this.deviceLog += Msg + `\n`
        // subdialog.setValue(this.submessage)
        // subdialog.gotoLine(subdialog.session.getLength())
      },
      subscriptionlog(devaddr) {
        this.subtopic = 'log/channel/' + this.channelId + '/#'
        this.pubtopic =
          'channel/' +
          this.channelId +
          '/' +
          this.queryForm.product +
          '/' +
          devaddr
        this.router = this.$dgiotBus.router(this.$route.fullPath + 'j')
        this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic)
        let subInfo = {
          router: this.router,
          topic: this.subtopic,
          qos: 2,
          ttl: 1000 * 60 * 60 * 3,
        }
        this.$dgiotBus.$emit('MqttSubscribe', subInfo)
        setTimeout(() => {
          this.$dgiotBus.$emit(
            `MqttPublish`,
            this.pubtopic,
            JSON.parse(JSON.stringify({ action: 'start_logger' })),
            0,
            false
          )
          this.editorKey = this.subtopic.split('log')[1]
        }, 500)

        this.dialogVisible = !this.dialogVisible
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
                : { $ne: null, $exists: true },
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
            'vab-hey-message-error'
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
