<template>
  <div class="logs logs-container">
    <a-row class="logs-row">
      <a-col
        class="logs-row-tree"
        :lg="6"
        :md="6"
        :sm="24"
        :style="{ height: Number($baseTableHeight(0)) + 105 + 'px' }"
        :xl="4"
        :xs="24"
        :xxl="4"
      >
        <a-tree
          v-if="logTree.length"
          :auto-expand-parent="true"
          :block-node="true"
          class="logs-row-tree-antd"
          :default-expand-all="true"
          :show-icon="true"
          :show-line="true"
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
                  theme="twoTone"
                  two-tone-color="#52c41a"
                  type="check-circle"
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
        class="logs-row-table"
        :class="{ 'dgiot-fullscreen': isFullscreen }"
        :lg="18"
        :md="18"
        :sm="24"
        :style="{ height: Number($baseTableHeight(0)) + 25 + 'px' }"
        :xl="20"
        :xs="24"
        :xxl="20"
      >
        <a-tabs default-active-key="editor">
          <a-tab-pane key="editor">
            <span slot="tab">
              <dgiot-icon icon="aspect-ratio-fill" />
              {{ $translateTitle('Logs.console') }}
            </span>
            <dgiot-editor
              :key="key"
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

            <dgiot-query-form>
              <dgiot-query-form-left-panel>
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

                <el-popover trigger="hover">
                  <el-checkbox-group v-model="checkList">
                    <dgiot-draggable :list="logcolumns" />
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
              </dgiot-query-form-left-panel>
            </dgiot-query-form>

            <el-table
              :key="key"
              ref="dragTable"
              border
              :data="
                scroketMsg.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              default-expand-all
              :height="height"
              highlight-current-row
              resizable
              size="mini"
              stripe
            >
              <el-table-column
                align="center"
                fixed="left"
                :label="$translateTitle('equipment.serialnumber')"
                show-overflow-tooltip
                width="55"
              >
                <template #default="{ $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                fixed="left"
                label="time"
                prop="time"
                show-overflow-tooltip
                sortable
                width="160"
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
                align="center"
                :label="item"
                :prop="item"
                show-overflow-tooltip
                sortable
                :width="
                  w80.includes(item) ? 80 : Wh120.includes(item) ? 120 : 180
                "
              />
              <el-table-column
                align="center"
                fixed="right"
                label="msg"
                prop="msg"
                show-overflow-tooltip
                sortable
              />
              <!--              eslint-disable-next-line-->
              <template #empty class="el_table_empty">
                <dgiot-empty />
              </template>
            </el-table>
            <el-pagination
              :current-page="currentPage"
              layout="total, sizes, prev, pager, next, jumper"
              :page-size="pageSize"
              :page-sizes="[10, 20, 30, 50, 100]"
              :total="scroketMsg.length"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { post_tree, putLogLevel } from '@/api/Logs'

  export default {
    name: 'RealLog',
    data() {
      return {
        logMqtt: {
          channeltopic: '',
          key: moment(new Date()).valueOf(),
        },
        key: moment(new Date()).valueOf(),
        subtopic: '',
        topicKey: '',
        router: '',
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
    watch: {},
    mounted() {
      this.router = this.$dgiotBus.router(this.$route.fullPath)
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
        dgiotlog.log('selected', selectedKeys, e.node.dataRef)
        this.dataRef = e.node.dataRef
        dgiotlog.log(e.node.dataRef)
        this.defaultLever = this.dataRef.level
        // this.clickItem = JSON.stringify(this.dataRef, null, 2)
        this.subLog()
      },
      handleHeight() {
        this.isFullscreen = !this.isFullscreen
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(1) + 120
        } else {
          this.height = this.$baseTableHeight(1)
        }
      },
      onRightClick(e) {
        this.clickItem = ''
        // this.dataRef = {}
        this.dataRef = e.node.dataRef
        dgiotlog.log(e.node.dataRef)
        this.defaultLever = this.dataRef.level
        // this.clickItem = JSON.stringify(this.dataRef, null, 2)
        // this.subLog()
      },
      onContextMenuClick(tree, menuKey) {
        switch (menuKey) {
          case 'Level':
            break
        }
        dgiotlog.log(tree, menuKey)
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
            'dgiot-hey-message-success'
          )
        } catch (error) {
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
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
          dgiotlog.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
        dgiotlog.log(value) // { key: "lucy", label: "Lucy (101)" }
      },
      async subLog() {
        this.clickItem = ''
        this.scroketMsg = []
        this.key = moment(new Date()).valueOf()
        if (this.dataRef.objectId) {
          this.subtopic = `${this.dataRef.topic}`
          this.topicKey = this.$dgiotBus.topicKey(this.router, this.subtopic)
          await this.$subscribe(this.subtopic)
          console.log(this.$mqttInfo)
          console.warn('订阅mqtt', this.subtopic)
          this.$baseMessage(
            this.subtopic + this.$translateTitle('websocket.subscribeSuccess'),
            'success',
            false,
            'dgiot-hey-message-success'
          )
          this.$baseNotify(this.subtopic, 'topic:', 'success', '', 5000)
          this.handleMqttMsg()
        }
      },
      handleMqttMsg() {
        this.scroketMsg = []
        this.clickItem = ''
        this.$dgiotBus.$off(this.$mqttInfo.topicKey)
        this.$dgiotBus.$on(this.$mqttInfo.topicKey, (Msg) => {
          dgiotlog.log('收到消息', Msg)
          if (Msg.payloadString) {
            this.scroketMsg.push(JSON.parse(Msg.payloadString))
            this.key = moment(new Date()).valueOf()
            this.clickItem = JSON.stringify(this.scroketMsg, null, 2)
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .logs {
    ::v-deep {
      .el-table__body,
      .el-table__empty-block {
        width: 100% !important;
      }
    }

    height: calc(100vh - #{$base-top-bar-height} * 2.7) !important;

    &-row {
      &-query {
      }

      &-tree {
        overflow: scroll;
      }
    }
  }
</style>
