<template>
  <div class="logs logs-container" :class="{ 'vab-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="100px"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item
            class="item-time"
            :label="$translateTitle('Maintenance.times')"
          >
            <el-date-picker
              v-model="queryForm.searchDate"
              class="item-time-picker"
              :end-placeholder="$translateTitle('Maintenance.end time')"
              format="yyyy-MM-dd"
              :start-placeholder="$translateTitle('Maintenance.start time')"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item :label="$translateTitle('equipment.Products')">
            <el-select v-model="queryForm.productid" clearable>
              <el-option
                v-for="(item, index) in proTableData"
                v-show="item.objectId != 0"
                :key="index"
                :label="item.name"
                :value="item.objectId"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('equipment.devicenumber')">
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
    <el-tabs v-model="activeName" :height="height" @tab-click="changetabs">
      <el-tab-pane :label="$translateTitle('equipment.statuslog')" name="first">
        <el-table
          ref="dragTable"
          :key="finallyColumns.length + momentKey"
          border
          resizable
          highlight-current-row
          default-expand-all
          stripe
          :row-class-name="tableRowClassName"
          size="mini"
          :data="logdata"
          :height="height"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-descriptions
                class="margin-top"
                :column="2"
                :size="size"
                border
              >
                <el-descriptions-item
                  v-for="(item, key, index) in props.row"
                  :key="index"
                  :label="key"
                  label-class-name="my-label"
                >
                  {{ item }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in finallyColumns"
            :key="index"
            :prop="item"
            :label="item"
            align="center"
            sortable
            show-overflow-tooltip
          />
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
      </el-tab-pane>
      <el-tab-pane
        :label="$translateTitle('equipment.operationlog')"
        name="second"
      >
        <el-table
          ref="dragTable"
          :key="finallyColumns.length + momentKey"
          border
          resizable
          highlight-current-row
          stripe
          :row-class-name="tableRowClassName"
          size="mini"
          :data="logdata"
          :height="height"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-descriptions
                class="margin-top"
                :column="2"
                :size="size"
                border
              >
                <el-descriptions-item
                  v-for="(item, key, index) in props.row"
                  :key="index"
                  :label="key"
                  label-class-name="my-label"
                >
                  {{ item }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in finallyColumns"
            :key="index"
            :prop="item"
            :label="item"
            align="center"
            sortable
            show-overflow-tooltip
          />
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { queryLog } from '@/api/Logs'
  import { queryProduct } from '@/api/Product'

  export default {
    name: 'AccessLog',
    data() {
      return {
        size: '',
        isFullscreen: false,
        height: this.$baseTableHeight(0),
        logdata: [],
        momentKey: moment(new Date()).valueOf(),
        checkList: ['time', 'productname', 'devicename', 'status'],
        logcolumns: ['time', 'productname', 'devicename', 'status'],
        proTableData: [],
        activeName: 'first',
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
          domain: 'device_statuslog',
          searchDate: [
            moment().subtract('days', 7).format('YYYY-MM-DD'),
            moment(new Date()).format('YYYY-MM-DD'),
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
    created() {},
    mounted() {
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
      changetabs(tab) {
        this.checkList = []
        this.logcolumns = []
        if (tab.name == 'second') {
          this.queryForm.domain = 'device_operationlog'
          ;(this.checkList = [
            'time',
            'username',
            'productname',
            'devicename',
            'status',
            'protocol',
            'thingname',
            'identifier',
            'value',
          ]),
            (this.logcolumns = [
              'time',
              'username',
              'productname',
              'devicename',
              'status',
              'protocol',
              'thingname',
              'identifier',
              'value',
            ])
        } else {
          this.queryForm.domain = 'device_statuslog'
          ;(this.checkList = ['time', 'productname', 'devicename', 'status']),
            (this.logcolumns = ['time', 'productname', 'devicename', 'status'])
        }
        this.queryTable({})
      },
      async queryTable(args = {}) {
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
            keys: 'time,msg',
            include: '',
            where: {
              domain: this.queryForm.domain
                ? {
                    $all: this.queryForm.domain.split(
                      /,(?=(?:[^']*(?:'[^']*')?[^']*)*$)/
                    ),
                  }
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
          if (this.queryForm.devaddr) {
            params.where.devaddr = this.queryForm.devaddr
          }
          if (this.queryForm.productid) {
            params.where.productid = this.queryForm.productid
          }
          const { results = [], count: total = 0 } = await queryLog(params)
          results.forEach((item) => {
            item.time = this.$moment(
              Number(item.time.toString().substring(0, 13))
            ).format('YYYY-MM-DD HH:mm:ss')
            var msg = JSON.parse(item.msg)
            for (let k in msg) {
              item[k] = msg[k]
            }
          })
          this.logdata = results
          this.queryForm.total = total
          this.$baseMessage(
            this.$translateTitle('alert.Data request successfully'),
            'success',
            'vab-hey-message-success'
          )
          loading.close()
        } catch (error) {
          loading.close()
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'vab-hey-message-error'
          )
        }
      },
    },
  }
</script>
<style scoped lang="scss">
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
  }
</style>
