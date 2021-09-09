<template>
  <div class="logs logs-container" :class="{ 'vab-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          v-if="!$loadsh.isEmpty(queryForm)"
          ref="form"
          :inline="true"
          label-width="auto"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item label="level">
            <el-select v-model="queryForm.level">
              <el-option
                v-for="item in leverData"
                :key="item"
                :label="item"
                :value="item"
              >
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="action">
            <el-select v-model="queryForm.action">
              <el-option
                v-for="item in actionData"
                :key="item"
                :label="item"
                :value="item"
              >
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="tracetype">
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

          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="queryTable({})"
            />
            <el-button
              style="margin: 0 10px 10px 10px !important"
              type="success"
              @click="handleHeight"
            >
              <vab-icon
                :icon="
                  isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'
                "
              />
            </el-button>

            <el-popover trigger="hover">
              <el-checkbox-group v-model="checkList">
                <vue-draggable v-bind="dragOptions" :list="logcolumns">
                  <div v-for="(item, index) in logcolumns" :key="item + index">
                    <vab-icon icon="drag-drop-line" />
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
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>
    <a-tabs default-active-key="editor">
      <a-tab-pane key="editor">
        <span slot="tab">
          <vab-icon icon="aspect-ratio-fill" />
          {{ $translateTitle('Logs.console') }}
        </span>
        <vab-editor
          :key="logMqtt.key"
          v-model="clickItem"
          :height="
            isFullscreen
              ? Number($baseTableHeight(0)) + 80
              : Number($baseTableHeight(0)) + 40
          "
          :max-lines="
            isFullscreen
              ? Number($baseTableHeight(0) + 80) / 12
              : Number($baseTableHeight(0) - 80) / 12
          "
          :min-lines="
            isFullscreen
              ? Number($baseTableHeight(0) + 80) / 12
              : Number($baseTableHeight(0) - 80) / 12
          "
          lang="json"
          theme="gob"
        />
      </a-tab-pane>
      <a-tab-pane key="table">
        <span slot="tab">
          <vab-icon icon="table-2" />
          {{ $translateTitle('Logs.table') }}
        </span>
        <el-table
          ref="dragTable"
          :key="finallyColumns.length + momentKey"
          class="logs-table"
          border
          resizable
          highlight-current-row
          default-expand-all
          stripe
          :row-class-name="tableRowClassName"
          :data="scroketMsg"
          :height="height"
        >
          <el-table-column
            width="160"
            prop="time"
            align="center"
            sortable
            show-overflow-tooltip
            label="time"
            fixed="left"
          />
          <el-table-column
            v-for="(item, index) in finallyColumns"
            :key="index"
            :prop="item"
            :label="item"
            align="center"
            sortable
            :width="
              w80.includes(item) ? 80 : Wh120.includes(item) ? 120 : 'auto'
            "
            show-overflow-tooltip
          />
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-descriptions class="margin-top" :column="2" border>
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
          :total="queryForm.total"
          :page.sync="queryForm.pageNo"
          :limit.sync="queryForm.pageSize"
          @pagination="queryTable"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import MQTTConnect from '@/utils/MQTTConnect'
  const { options, iotMqtt } = MQTTConnect
  import { getMqttEventId, getTopicEventId } from '@/utils'
  import { postTrace } from '@/api/System'
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
        productId: '',
        ttl: 1000 * 60 * 60 * 3,
        topicKey: '',
        topic: '',
        logMqtt: {
          channeltopic: '',
          key: moment(new Date()).valueOf(),
        },
        scroketMsg: [],
        clickItem: '',
        isFullscreen: false,
        height: this.$baseTableHeight(0),
        logdata: [],
        momentKey: moment(new Date()).valueOf(),
        checkList: ['topic', 'time', 'pid', 'peername'],
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
      this.topicKey = getTopicEventId(this.topic, this.$route.fullPath)
      this.topic = 'logger_trace/trace/' + this.$route.query.deviceid + '/#'
      // this.$bus.$off(`${this.topicKey}`)
      this.bus(this.topicKey, this.topic, this.ttl)
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
      bus(topicKey, topic) {
        console.log(' this.topic ', topic)
        this.$bus.$off(`${this.topicKey}`)
        this.$bus.$on(`${this.topicKey}`, (res) => {
          const { msg = '', timestamp } = res
          if (!_.isEmpty(msg)) this.mqttMsg(msg, res, timestamp)
        })
      },
      handleHeight() {
        this.isFullscreen = !this.isFullscreen
        if (this.isFullscreen) this.height = this.$baseTableHeight(0) + 120
        else this.height = this.$baseTableHeight(0)
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
      queryTable() {
        this.scroketMsg = []
        this.clickItem = ''
        this.queryForm.topic = 'logger_trace/trace/' + this.productId + '/#'
        // this.topic = this.queryForm.topic + this.logMqtt.key + ''
        this.queryForm.deviceid = this.deviceInfo.objectId
        if (this.queryForm.action == 'start')
          this.$bus.$emit(getMqttEventId('subscribe'), {
            topicKey: this.topicKey,
            topic: this.topic,
            ttl: this.ttl,
          })
        //   :
        const loading = this.$baseColorfullLoading()
        const { level, action, topic, order, deviceid, tracetype } =
          this.queryForm
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
      mqttMsg(e, msg, key) {
        // const msg =   {
        //   "topic": "testtopic",
        //   "time": 1631083271442413,
        //   "pid": "<0.21153.0>",
        //   "peername": "183.128.48.161:55095",
        //   "msg": "PUBLISH to testtopic: <<\"{ \\\"msg\\\": \\\"Hello, World!\\\" }\">>",
        //   "level": "info",
        //   "gl": "<0.1629.0>",
        //   "clientid": "6e0f054b82",
        //   "mfa": "emqx_tracer/trace/2"
        // }
        this.scroketMsg.push(JSON.parse(e))
        this.logMqtt.key = key
        this.clickItem = JSON.stringify(this.scroketMsg, null, 2)
        console.log('payload,msg,key', msg, key)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .logs {
    height: calc(100vh - #{$base-top-bar-height}* 2.7) !important;
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
