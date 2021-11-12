<template>
  <div class="logs logs-container" :class="{ 'vab-fullscreen': isFullscreen }">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="auto"
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
                <vue-draggable :list="logcolumns" v-bind="dragOptions">
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
    <el-table
      :key="finallyColumns.length + momentKey"
      ref="dragTable"
      border
      class="logs-table"
      :data="logdata"
      :height="height"
      highlight-current-row
      resizable
      :row-class-name="tableRowClassName"
      :size="size"
      stripe
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions border class="margin-top" :column="2" :size="size">
            <el-descriptions-item
              v-for="(item, key, index) in props.row.body"
              v-show="key != 'elm'"
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
        align="center"
        :label="item"
        :prop="item"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        fixed="right"
        label="msg"
        prop="msg.body"
        show-overflow-tooltip
        sortable
      />
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

  export default {
    name: 'AccessLog',
    data() {
      return {
        size: '',
        isFullscreen: false,
        height: this.$baseTableHeight(0),
        logdata: [],
        momentKey: moment(new Date()).valueOf(),
        checkList: [
          'time',
          'username',
          'ip',
          'method',
          'path',
          'code',
          'reason',
          'elapsedtime',
        ],
        logcolumns: [
          'time',
          'username',
          'ip',
          'method',
          'path',
          'code',
          'reason',
          'elapsedtime',
        ],
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
          domain: 'parse_api',
          searchDate: [
            moment().subtract('days', 7).format('YYYY-MM-DD'),
            moment(new Date()).format('YYYY-MM-DD'),
          ],
          order: '-createdAt',
          keys: 'count(*)',
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
      this.columnDrop()
    },
    methods: {
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
          const { results = [], count: total = 0 } = await queryLog(params)
          results.forEach((item, index) => {
            item.time = this.$moment(
              Number(item.time.toString().substring(0, 13))
            ).format('YYYY-MM-DD HH:mm:ss.SSS')
            const msg = JSON.parse(item.msg)
            for (let k in msg) {
              if (k == 'body') {
                item['body'] = msg['body']
              } else {
                item[k] = msg[k]
              }
            }
            if (index == 0) {
              console.log(item)
              console.log(item.body)
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
        this.momentKey = moment(new Date()).valueOf()
      },
    },
  }
</script>
<style>
  .my-label {
    font-size: 16px !important;
    text-align: center !important;
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
