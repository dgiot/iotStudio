<template>
  <div class="logs logs-container" :class="{ 'vab-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          v-if="!$loadsh.isEmpty(queryForm)"
          ref="form"
          :inline="true"
          label-width="80px"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('device.tracetype')">
            <el-select v-model="queryForm.tracetype">
              <el-option
                v-for="item in traceData"
                :key="item"
                :label="item"
                :value="item"
              >
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('device.action')">
            <el-switch
              v-model="queryForm.action"
              active-color="#13ce66"
              :active-text="$translateTitle('device.start')"
              active-value="start"
              inactive-color="#ff4949"
              :inactive-text="$translateTitle('device.stop')"
              inactive-value="stop"
              style="display: block"
              @change="starttrace"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin: 0 10px 10px 10px !important"
              type="success"
              @click="handleHeight"
            >
              <dgiot-icon
                :icon="
                  isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'
                "
              />
            </el-button>
            <el-popover v-show="scroketMsg.length" trigger="hover">
              <el-checkbox-group v-model="checkList">
                <vue-draggable :list="logcolumns" v-bind="dragOptions">
                  <div v-for="(item, index) in logcolumns" :key="item + index">
                    <dgiot-icon icon="drag-drop-line" />
                    <el-checkbox
                      :disabled="item.disableCheck === true"
                      :label="item"
                    >
                      {{ item }}
                    </el-checkbox>
                  </div>
                </vue-draggable>
              </el-checkbox-group>
              <template #reference>
                <el-button
                  icon="el-icon-setting"
                  style="margin: 0 0 10px 0 !important"
                  type="primary"
                >
                  {{ $translateTitle('Logs.Draggable column settings') }}
                </el-button>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item :label="$translateTitle('device.topic')" prop="product">
            <el-select v-model="instructtopic">
              <el-option
                v-for="(item, index) in producttopic"
                :key="index"
                :label="item.topic"
                :value="item.topic"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('device.instruct')"
            prop="product"
          >
            <el-input v-model="instruct" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendinstruct()">
              {{ $translateTitle('device.sendinstruct') }}
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>
    <a-tabs default-active-key="editor">
      <a-tab-pane key="editor">
        <span slot="tab">
          <dgiot-icon icon="aspect-ratio-fill" />
          {{ $translateTitle('Logs.console') }}
        </span>
        <vab-editor
          :key="logMqtt.key"
          v-model="clickItem"
          :height="isFullscreen ? 1000 + 80 : 1000 + 40"
          lang="json"
          :max-lines="isFullscreen ? 1000 / 12 : 1000 / 12"
          :min-lines="isFullscreen ? 1000 / 12 : 1000 / 12"
          theme="gob"
        />
      </a-tab-pane>
      <a-tab-pane key="table">
        <span slot="tab">
          <dgiot-icon icon="table-2" />
          {{ $translateTitle('Logs.table') }}
        </span>
        <el-table
          :key="finallyColumns.length + momentKey"
          ref="dragTable"
          border
          class="logs-table"
          :data="scroketMsg"
          default-expand-all
          :height="height"
          highlight-current-row
          resizable
          :row-class-name="tableRowClassName"
          stripe
        >
          <el-table-column
            v-for="(item, index) in finallyColumns"
            :key="index"
            align="center"
            :label="item"
            :prop="item"
            show-overflow-tooltip
            sortable
            :width="
              w80.includes(item) ? 80 : Wh120.includes(item) ? 120 : 'auto'
            "
          />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-descriptions border class="margin-top" :column="2">
                <el-descriptions-item>
                  <template slot="label">
                    <i v-copy="props.row.msg" class="el-icon-copy-document"></i>
                  </template>
                  {{ props.row.msg }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </el-table-column>
          <!--      <el-table-column-->
          <!--        prop="msg"-->
          <!--        align="center"-->
          <!--        sortable-->
          <!--        show-overflow-tooltip-->
          <!--        label="msg"-->
          <!--        fixed="right"-->
          <!--      />-->
          <template #empty>
            <vab-empty />
          </template>
        </el-table>
        <vab-Pagination
          v-show="queryForm.total > 0"
          :limit.sync="queryForm.pageSize"
          :page.sync="queryForm.pageNo"
          :total="queryForm.total"
          @pagination="queryTable"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<!--eslint-disable-->
<script>
  import { postTrace } from '@/api/System'
  import { getProduct } from '@/api/Product'

  export default {
    name: 'SceneLog',
    props: {
      name: {
        type: String,
        required: true,
        default: 'name',
      },
      deviceInfo: {
        type: Object,
        required: true,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        instruct: '',
        instructtopic: '',
        producttopic: [],
        productId: '',
        ttl: 1000 * 60 * 60 * 3,
        topicKey: '',
        topic: '',
        logMqtt: {
          channeltopic: '',
          key: moment(new Date()).valueOf(),
        },
        subtopic: '',
        router: '',
        scroketMsg: [],
        clickItem: '',
        isFullscreen: false,
        height: this.$baseTableHeight(0),
        logdata: [],
        momentKey: moment(new Date()).valueOf(),
        checkList: ['time', 'topic', 'pid', 'peername'],
        logcolumns: [
          'topic',
          'time',
          'pid',
          'peername',
          'msg',
          'level',
          'gl',
          'clientid',
          'mfa',
        ],
        fold: true,
        w80: ['line', 'level'],
        Wh120: ['pid', 'domain', 'gl'],
        Wh200: ['time', 'clientid', 'peername'],
        leverData: [
          'debug',
          'info',
          'notice',
          'warning',
          'error',
          'crtical',
          'alert',
          'emergency',
        ],
        actionData: ['start', 'stop'],
        traceData: ['clientid', 'topic'],
        queryForm: {
          total: 0,
          count: 'objectId',
          limit: 20,
          pageNo: 1,
          pageSize: 20,
          skip: 0,
          level: 'info',
          logfile: 'test.txt',
          order: 1,
          action: 'start',
          tracetype: 'clientid',
        },
      }
    },
    computed: {
      dragOptions() {
        return {
          animation: 600,
          group: 'description',
        }
      },
      finallyColumns() {
        return this.logcolumns.filter((item) => this.checkList.includes(item))
      },
    },
    watch: {
      'deviceInfo.product.objectId': {
        handler: function (newVal) {
          if (newVal) this.productId = newVal
        },
        deep: true,
        limit: true,
      },
      name: {
        handler: function (newVal) {
          if (newVal == 'task') this.queryTable()
        },
        deep: true,
        limit: true,
      },
    },
    mounted() {
      this.router = this.$dgiotBus.router(location.href + this.$route.fullPath)
      this.get_topic()
    },
    created() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      get_topic() {
        // this.deviceInfo
        console.log('this.deviceInfo', this.deviceInfo)
        getProduct(this.deviceInfo.product.objectId).then((res) => {
          this.producttopic = res.topics
        })
      },
      sendinstruct() {
        const pubtopic = this.instructtopic.replace(
          '${DevAddr}',
          this.deviceInfo.devaddr
        )
        this.$dgiotBus.$emit(`MqttPublish`, pubtopic, this.instruct, 0, false)
      },
      handleHeight() {
        this.isFullscreen = !this.isFullscreen
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(0) + 120
        } else {
          this.height = this.$baseTableHeight(0)
        }
        this.momentKey = moment(new Date()).valueOf()
      },
      // 设置表格row的class
      tableRowClassName({ row }) {
        if (row.disabled) {
          return 'disabled'
        }
        return ''
      },
      // 行拖拽
      rowDrop() {
        // 此时找到的元素是要拖拽元素的父容器
        const tbody = this.$refs.dragTable.$el.querySelector(
          '.el-table__body-wrapper tbody'
        )
        const _this = this
        Sortable.create(tbody, {
          //  指定父元素下可被拖拽的子元素
          draggable: '.el-table__row',
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.logdata.splice(oldIndex, 1)[0]
            _this.logdata.splice(newIndex, 0, currRow)
          },
        })
      },
      // 列拖拽
      columnDrop() {
        const _this = this
        const wrapperTr = this.$refs.dragTable.$el.querySelector(
          '.el-table__header-wrapper tr'
        )
        _this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          onEnd: (evt) => {
            const oldItem = _this.finallyColumns[evt.oldIndex]
            _this.finallyColumns.splice(evt.oldIndex, 1)
            _this.finallyColumns.splice(evt.newIndex, 0, oldItem)
            _this.momentKey = moment(new Date()).valueOf()
            setTimeout(() => {
              _this.rowDrop()
              _this.columnDrop()
            }, 1500)
          },
        })
      },
      starttrace(val) {
        console.log('aaa', val)
        this.queryForm.action = val
        this.queryTable()
      },
      queryTable() {
        this.scroketMsg = []
        this.clickItem = ''
        this.queryForm.deviceid = this.deviceInfo.objectId
        if (this.queryForm.action == 'start') {
          this.subtopic =
            'logger_trace/trace/' + this.deviceInfo.objectId + '/#'
        }
        this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic)
        this.$dgiotBus.$emit(`MqttSubscribe`, {
          router: this.router,
          topic: this.subtopic,
          qos: 0,
          ttl: 1000 * 60 * 60 * 3,
        })
        this.$dgiotBus.$off(`${this.topicKey}`)
        this.$dgiotBus.$on(`${this.topicKey}`, (Msg) => {
          if (Msg.payload) {
            this.scroketMsg.unshift(JSON.parse(Msg.payload))
            this.logMqtt.key = this.topicKey
            this.clickItem = JSON.stringify(this.scroketMsg, null, 2)
          }
        })
        if (this.queryForm.action == 'stop') {
          this.MqttUnbscribe()
        }
        //   :
        const loading = this.$baseColorfullLoading()
        const { level, action, order, deviceid, tracetype } = this.queryForm
        const handle =
          this.queryForm.tracetype == 'clientid'
            ? this.queryForm.deviceid
            : this.queryForm.topic
        try {
          loading.close()
          const params = {
            level,
            action,
            order,
            handle: handle,
            tracetype,
            deviceid,
          }
          postTrace(params)
            .then((res) => {
              console.log(res)
              const { code = 0, error = '', msg = '' } = res
              if (code == 200) {
                this.$baseMessage(
                  this.$translateTitle('alert.Data request successfully'),
                  'success',
                  'vab-hey-message-success'
                )
              } else {
                this.$baseMessage(
                  this.$translateTitle('alert.Data request error') + `${error}`,
                  'error',
                  'vab-hey-message-error'
                )
              }
            })
            .catch((error) => {
              console.error(error)
              this.$baseMessage(
                this.$translateTitle('alert.Data request error') + `${error}`,
                'error',
                'vab-hey-message-error'
              )
            })

          loading.close()
        } catch (error) {
          loading.close()
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
        this.momentKey = moment(new Date()).valueOf()
      },
      MqttUnbscribe() {
        this.$dgiotBus.$emit('MqttUnbscribe', this.topicKey, this.subtopic)
      },
    },
  }
</script>
<style>
  .el-switch {
    display: inline !important;
  }
</style>
<style lang="scss" scoped>
  .logs {
    height: calc(100vh - #{$base-top-bar-height} * 2.7) !important;

    ::v-deep {
      .item-time {
        .el-form-item__content {
          //width: 50% !important;
          .item-time-picker {
            //width: 50% !important;
          }
        }
      }
    }

    &-row {
      &-query {
      }

      &-tree {
        overflow: scroll;
      }
    }

    &-table {
      ::v-deep {
        * {
          font-size: 14px;
          font-weight: normal;
          color: #606266;
        }
      }
    }
  }
</style>
