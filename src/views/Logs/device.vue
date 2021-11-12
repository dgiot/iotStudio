<template>
  <div
    :class="{ 'vab-fullscreen': isFullscreen }"
    class="logs logs-container"
  >
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          :model="queryForm"
          label-width="100px"
          @submit.native.prevent
        >
          <el-form-item
            :label="$translateTitle('device.Log type')"
            class="item-time"
          >
            <el-select
              v-model="queryForm.domain"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in domainOptions"
                :key="item"
                :label="$translateTitle(`deviceLog.${item}`)"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$translateTitle('Maintenance.times')"
            class="item-time"
          >
            <el-date-picker
              v-model="queryForm.searchDate"
              :end-placeholder="$translateTitle('Maintenance.end time')"
              :start-placeholder="$translateTitle('Maintenance.start time')"
              class="item-time-picker"
              format="yyyy-MM-dd"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            v-show="!isDeviceInfo"
            :label="$translateTitle('equipment.Products')"
          >
            <el-select
              v-model="queryForm.productid"
              clearable
            >
              <el-option
                v-for="(item, index) in proTableData"
                v-show="item.objectId != 0"
                :key="index"
                :label="$translateTitle(`deviceLog.${item.name}`)"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="!isDeviceInfo"
            :label="$translateTitle('equipment.devicenumber')"
          >
            <el-input
              v-model="queryForm.devaddr"
              :placeholder="$translateTitle('equipment.enterdevicenumber')"
              clearable
            />
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
                <vue-draggable
                  :list="logcolumns"
                  v-bind="dragOptions"
                >
                  <div
                    v-for="(item, index) in logcolumns"
                    :key="item + index"
                  >
                    <vab-icon icon="drag-drop-line" />
                    <el-checkbox
                      :disabled="item.disableCheck === true"
                      :label="item"
                    >
                      {{ $translateTitle(`deviceLog.${item}`) }}
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
    <el-dialog
      :visible.sync="preDialog"
      append-to-body
    >
      <vab-editor
        :key="refreshFlag"
        v-model="msg"
        :height="
          isFullscreen
            ? Number($baseTableHeight(1))
            : Number($baseTableHeight(1))
        "
        :max-lines="
          isFullscreen
            ? Number($baseTableHeight(1)) / 12
            : Number($baseTableHeight(1)) / 12
        "
        :min-lines="
          isFullscreen
            ? Number($baseTableHeight(1)) / 12
            : Number($baseTableHeight(1)) / 12
        "
        lang="json"
        theme="gob"
      />
    </el-dialog>
    <el-table
      :key="finallyColumns.length + momentKey"
      ref="dragTable"
      v-loading="loading"
      :data="logdata"
      :element-loading-text="$translateTitle('developer.Waitingtoreturn')"
      :height="height"
      :row-class-name="tableRowClassName"
      border
      class="block"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-spinner="el-icon-loading"
      highlight-current-row
      resizable
      size="mini"
      stripe
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions
            :column="2"
            :size="size"
            border
            class="margin-top"
          >
            <el-descriptions-item
              v-for="(item, key, index) in props.row"
              :key="index"
              :label="$translateTitle(`deviceLog.${key}`)"
              label-class-name="my-label"
            >
              {{ item }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column
        :label="$translateTitle('device.Log type')"
        align="center"
      >
        <template #default="{ row }">
          {{ $translateTitle(`deviceLog.${row.domain}`) }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="index"
        :label="$translateTitle(`deviceLog.${item}`)"
        :prop="item"
        align="center"
        show-overflow-tooltip
        sortable
      />
      <!--      <el-table-column-->
      <!--        prop="msg"-->
      <!--        align="center"-->
      <!--        sortable-->
      <!--        show-overflow-tooltip-->
      <!--        label="msg"-->
      <!--        fixed="right"-->
      <!--      />-->
      <el-table-column
        :label="$translateTitle('concentrator.operation')"
        align="center"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            @click="showDetail(row)"
          >
            {{ $translateTitle('concentrator.detail') }}
          </el-button>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
  import { queryLog } from '@/api/Logs'
  import { queryProduct } from '@/api/Product'

  export default {
    name: 'AccessLog',
    props: {
      productid: {
        type: String,
        default: '',
      },
      devaddr: {
        type: String,
        default: '',
      },
      deviceid: {
        type: String,
        default: '',
      },
      isDeviceInfo: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        preDialog: false,
        msg: '',
        loading: false,
        size: '',
        domainOptions: [
          'device_statuslog',
          'device_operationlog',
          'transparent',
          'event',
          'tcp_send',
          'tcp_receive',
          'readProperty',
          'writeProperty',
          'reportProperty',
          'child',
          'childReply',
          'functionInvoke',
          'readPropertyReply',
          'writePropertyReply',
          'functionReply',
          'register',
          'unregister',
          'offline',
          'online',
          'other',
          'parse_api',
        ],
        isFullscreen: false,
        height: this.$baseTableHeight(2),
        logdata: [],
        refreshFlag: moment(new Date())
          .valueOf(),
        momentKey: moment(new Date())
          .valueOf(),
        checkList: ['time', 'msg'],
        logcolumns: [
          'devaddr',
          'time',
          'msg',
          'username',
          'productname',
          'devicename',
          'status',
          'protocol',
          'thingname',
          'identifier',
          'value',
        ],
        proTableData: [],
        activeName: 'second',
        queryForm: {
          total: 0,
          count: 'objectId',
          limit: 20,
          pageNo: 1,
          pageSize: 20,
          skip: 0,
          level: '',
          peername: '',
          pid: '',
          mfa: '',
          topic: '',
          domain: [],
          searchDate: [
            moment()
              .subtract('days', 7)
              .format('YYYY-MM-DD'),
            moment(new Date())
              .format('YYYY-MM-DD'),
          ],
          order: '-createdAt',
          keys: 'count(*)',
          productid: '',
          devaddr: '',
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
    created() {
    },
    mounted() {
      if (this.productid) this.queryForm.productid = this.productid
      if (this.deviceid) this.queryForm.deviceid = this.deviceid
      if (this.$route.query.deviceid) {
        this.queryForm.deviceid = this.$route.query.deviceid
      }
      this.queryTable({})
      this.rowDrop()
      this.queryProduct()
      this.columnDrop()
    },
    methods: {
      async queryProduct() {
        // 查询产品
        this.proTableData = []
        const { results = [] } = await queryProduct({
          count: 'objectId',
          order: '-updatedAt',
          where: {
            category: 'IotHub',
          },
        })
        this.proTableData = results
      },
      handleHeight() {
        this.isFullscreen = !this.isFullscreen
        if (this.isFullscreen) {
          this.height = this.$baseTableHeight(0) + 120
        } else {
          this.height = this.$baseTableHeight(0)
        }
        this.momentKey = moment(new Date())
          .valueOf()
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
          '.el-table__body-wrapper tbody',
        )
        const _this = this
        Sortable.create(tbody, {
          //  指定父元素下可被拖拽的子元素
          draggable: '.el-table__row',
          onEnd({
            newIndex,
            oldIndex,
          }) {
            const currRow = _this.logdata.splice(oldIndex, 1)[0]
            _this.logdata.splice(newIndex, 0, currRow)
          },
        })
      },
      // 列拖拽
      columnDrop() {
        const _this = this
        const wrapperTr = this.$refs.dragTable.$el.querySelector(
          '.el-table__header-wrapper tr',
        )
        _this.sortable = Sortable.create(wrapperTr, {
          animation: 180,
          delay: 0,
          onEnd: (evt) => {
            const oldItem = _this.finallyColumns[evt.oldIndex]
            _this.finallyColumns.splice(evt.oldIndex, 1)
            _this.finallyColumns.splice(evt.newIndex, 0, oldItem)
            _this.momentKey = moment(new Date())
              .valueOf()
            setTimeout(() => {
              _this.rowDrop()
              _this.columnDrop()
            }, 1500)
          },
        })
      },
      /**
       * @desc 显示设备日志详情
       * @param row
       */
      showDetail(row) {
        this.preDialog = true
        console.log(row)
        this.msg = JSON.stringify(row, null, 2)
        this.refreshFlag = moment(new Date())
          .valueOf()
      },
      async queryTable(args = {}) {
        this.loading = true
        console.log(this.queryForm.domain)
        if (!args.limit) {
          args = this.queryForm
        }
        const loading = this.$baseColorfullLoading()
        try {
          loading.close()
          const params = {
            limit: args.limit,
            skip: args.skip,
            order: args.order,
            count: this.queryForm.count,
            // keys: 'time,msg,domain',
            include: '',
            where: {
              deviceid: this.deviceid ? this.deviceid : '',
              domain: this.queryForm.domain.length
                ? // ? {
                  //     $all: this.queryForm.domain.split(
                  //       /,(?=(?:[^']*(?:'[^']*')?[^']*)*$)/
                  //     ),
                  //   }
                { $in: this.queryForm.domain }
                : { $ne: '' },
              createdAt: {
                $gte: {
                  __type: 'Date',
                  iso: `${this.queryForm.searchDate[0]}T00:00:00.000Z`,
                },
                $lte: {
                  __type: 'Date',
                  iso: `${this.queryForm.searchDate[1]}T23:59:59.000Z`,
                },
              },
            },
          }
          // if (this.queryForm.devaddr) {
          //   params.where.devaddr = this.queryForm.devaddr // 传 设备地址，但设备地址会重复
          // }
          // if (this.queryForm.deviceid) {
          //   params.where.deviceid = this.queryForm.deviceid // 查设备日志 传设备id
          // }
          // if (this.queryForm.productid) {
          //   params.where.productid = this.queryForm.productid
          // }
          const {
            results = [],
            count: total = 0,
          } = await queryLog(params)
          results.forEach((item) => {
            item.time = this.$moment(
              Number(item.time.toString()
                .substring(0, 13)),
            )
              .format('YYYY-MM-DD HH:mm:ss')
            if (item.type != 'text') {
              const msg = JSON.parse(item.msg)
              for (let k in msg) {
                item[k] = msg[k]
              }
            }
          })
          this.logdata = results
          this.queryForm.total = total
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success',
          )
          loading.close()
        } catch (error) {
          loading.close()
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error',
          )
        }
        this.loading = false
      },
    },
  }
</script>
<style lang="scss" scoped>
  .logs {
    //height: calc(100vh - #{$base-top-bar-height} * 5.2) !important;

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
  }
</style>
