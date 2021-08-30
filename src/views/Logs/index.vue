<template>
  <div class="logs logs-container">
    <div class="mqtt">
      <VabMqtt
        ref="dgiot_log"
        :key="logMqtt.key"
        :client-id="'dgiot_log' + logMqtt.key"
        :topic="logMqtt.channeltopic"
        :reconnection="true"
        @mqttMsg="mqttMsg"
        @mqttError="mqttError"
        @mqttConnectLost="mqttConnectLost"
        @mqttSuccess="mqttSuccess"
      />
    </div>
    <a-row class="logs-row">
      <a-col
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="4"
        :xxl="4"
        class="logs-row-tree"
        :style="{ height: Number($baseTableHeight(0)) + 105 + 'px' }"
      >
        <a-tree
          v-if="logTree.length"
          class="logs-row-tree-antd"
          :show-icon="true"
          :block-node="true"
          :show-line="true"
          :default-expand-all="true"
          :auto-expand-parent="true"
          :tree-data="logTree"
          @rightClick="onRightClick"
          @select="onSelect"
        >
          <template #title="{ objectId: treeKey, name, objectId, type }">
            <a-dropdown
              :disabled="!disableType.includes(type)"
              :trigger="['contextmenu']"
              @click="subLog()"
            >
              <span :title="name">
                <a-icon
                  slot="icon"
                  type="check-circle"
                  theme="twoTone"
                  two-tone-color="#52c41a"
                />
                {{ name }}
              </span>
              <template #overlay>
                <a-menu
                  :key="objectId"
                  size="mini"
                  @click.self="
                    ({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)
                  "
                >
                  <a-menu-item>
                    {{ $translateTitle('Logs.log lever') }}
                    <el-select
                      v-model="defaultLever"
                      size="mini"
                      style="width: 120px"
                      @change="handleChange"
                    >
                      <el-option
                        v-for="item in leverData"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tree>
      </a-col>
      <a-col
        :xs="24"
        :sm="24"
        :md="18"
        :lg="18"
        :xl="20"
        :xxl="20"
        class="logs-row-table"
        :class="{ 'vab-fullscreen': isFullscreen }"
        :style="{ height: Number($baseTableHeight(0)) + 25 + 'px' }"
      >
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

            <vab-query-form>
              <vab-query-form-left-panel>
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
                      <div
                        v-for="(item, index) in logcolumns"
                        :key="item + index"
                      >
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
              </vab-query-form-left-panel>
            </vab-query-form>

            <el-table
              :key="logMqtt.key"
              ref="dragTable"
              border
              resizable
              highlight-current-row
              default-expand-all
              stripe
              size="mini"
              :data="
                scroketMsg.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              :height="height"
            >
              <el-table-column
                align="center"
                :label="$translateTitle('equipment.serialnumber')"
                show-overflow-tooltip
                width="55"
                fixed="left"
              >
                <template #default="{ $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                width="160"
                prop="time"
                align="center"
                sortable
                show-overflow-tooltip
                label="time"
                fixed="left"
              >
                <template #default="{ row }">
                  <span>
                    {{
                      $moment(
                        Number(row.time.toString().substring(0, 13))
                      ).format('YYYY-MM-DD HH:mm:ss.SSS')
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in finallyColumns"
                v-show="item != 'msg'"
                :key="index"
                :prop="item"
                :label="item"
                align="center"
                sortable
                :width="
                  w80.includes(item) ? 80 : Wh120.includes(item) ? 120 : 180
                "
                show-overflow-tooltip
              />
              <el-table-column
                prop="msg"
                align="center"
                sortable
                show-overflow-tooltip
                label="msg"
                fixed="right"
              />
              <template #empty class="el_table_empty">
                <vab-empty />
              </template>
            </el-table>
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="scroketMsg.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import iotMqtt from '@/utils/iotMqtt'
  import { post_tree, putLogLevel } from '@/api/Logs'
  export default {
    name: 'RealLog',
    data() {
      return {
        logMqtt: {
          channeltopic: '',
          key: moment(new Date()).valueOf(),
        },
        currentPage: 1,
        pageSize: 20,
        isFullscreen: false,
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
        disableType: ['system', 'app', 'module'],
        dataRef: {},
        defaultLever: '',
        queryForm: {},
        logTree: [],
        clickItem: '',
        height: this.$baseTableHeight(1),
        checkList: ['pid', 'level', 'gl', 'mfa'],
        logcolumns: [
          'topic',
          'pid',
          'peername',
          'level',
          'gl',
          'clientid',
          'mfa',
        ],
        w80: ['line', 'level'],
        Wh120: ['pid', 'level', 'domain', 'gl'],
        Wh200: ['time', 'clientid', 'peername'],
        scroketMsg: [],
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
      treeQueryForm: function () {
        return {
          province: '',
          class: 'LogLevel',
          filter:
            '{"keys":["parent","name","level","name","order","type","topic"],"where":{}}',
          parent: 'parent',
        }
      },
    },
    watch: {
      'logMqtt.channeltopic': {
        handler(newName, oldName) {
          if (newName)
            this.$baseMessage(
              this.logMqtt.channeltopic +
                this.$translateTitle('websocket.subscribeSuccess'),
              'success',
              false,
              'vab-hey-message-success'
            )
          this.$baseNotify(
            this.logMqtt.channeltopic,
            'topic:',
            'success',
            '',
            5000
          )
          if (oldName) iotMqtt.unsubscribe(oldName)
        },
      },
    },
    created() {},
    mounted() {
      this.getTree(this.treeQueryForm)
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
      },
      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val
      },
      onSelect(selectedKeys, e) {
        console.log('selected', selectedKeys, e.node.dataRef)
        this.dataRef = e.node.dataRef
        console.log(e.node.dataRef)
        this.defaultLever = this.dataRef.level
        // this.clickItem = JSON.stringify(this.dataRef, null, 2)
        this.subLog()
      },
      handleHeight() {
        this.isFullscreen = !this.isFullscreen
        if (this.isFullscreen) this.height = this.$baseTableHeight(1) + 120
        else this.height = this.$baseTableHeight(1)
      },
      onRightClick(e) {
        this.clickItem = ''
        // this.dataRef = {}
        this.dataRef = e.node.dataRef
        console.log(e.node.dataRef)
        this.defaultLever = this.dataRef.level
        // this.clickItem = JSON.stringify(this.dataRef, null, 2)
        // this.subLog()
      },
      onContextMenuClick(tree, menuKey) {
        switch (menuKey) {
          case 'Level':
            break
        }
        console.log(tree, menuKey)
      },
      /**
       *
       * @param
       * @returns
       */
      async getTree(treeQueryForm) {
        // this.logTree = []
        try {
          const loading = this.$baseColorfullLoading()
          const { results = [] } = await post_tree(treeQueryForm)
          this.logTree = results
          loading.close()
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
      async handleChange(value) {
        try {
          const { type, name } = this.dataRef
          const handloading = this.$baseColorfullLoading()
          const params = {
            type: type,
            name: name,
            level: value,
          }
          const res = await putLogLevel(params)
          this.getTree(this.treeQueryForm)
          handloading.close()
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
        console.log(value) // { key: "lucy", label: "Lucy (101)" }
      },
      subLog() {
        this.clickItem = ''
        this.scroketMsg = []
        this.logMqtt.key = moment(new Date()).valueOf()
        console.log(this.dataRef, 'subLog')
        if (this.dataRef.objectId) {
          this.logMqtt.channeltopic = `${this.dataRef.topic}`
          this.$nextTick(() => {
            this.$refs.dgiot_log.clientMqtt()
            // iotMqtt.subscribe(this.logMqtt.channeltopic)
          })
        }
      },
      mqttMsg(e, key) {
        console.log(e, 'mqttMsg', key)
        this.scroketMsg.push(JSON.parse(e))
        this.logMqtt.key = key
        this.clickItem = JSON.stringify(this.scroketMsg, null, 2)
        // console.log(e, 'mqttMsg')
      },
      mqttConnectLost(e) {
        // this.$baseMessage(
        //   this.logMqtt.channeltopic +
        //     this.$translateTitle(
        //       'websocket.mqtt connection failed, automatically reconnect'
        //     ),
        //   'warning',
        //   false,
        //   'vab-hey-message-warning'
        // )
        this.$refs.dgiot_log.clientMqtt()
        console.log('mqttConnectLost', e)
      },
      mqttSuccess(clientId) {
        console.log('mqttSuccess', e)
      },
      mqttError(e) {
        this.$baseMessage(
          this.logMqtt.channeltopic +
            this.$translateTitle('websocket.subscribeFailure'),
          'error',
          false,
          'vab-hey-message-error'
        )
        console.log('mqttError', e)
      },
    },
  }
</script>
<style scoped lang="scss">
  .logs {
    ::v-deep {
      .el-table__body,
      .el-table__empty-block {
        width: 100% !important;
      }
    }
    height: calc(100vh - #{$base-top-bar-height}* 2.7) !important;
    &-row {
      &-query {
      }
      &-tree {
        overflow: scroll;
      }
    }
  }
</style>
