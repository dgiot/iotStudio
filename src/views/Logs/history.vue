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
          <el-form-item label="level">
            <el-select v-model="queryForm.level" clearable>
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
          <el-form-item v-show="!fold" label="pid">
            <el-input v-model="queryForm.pid" clearable />
          </el-form-item>
          <el-form-item v-show="!fold" label="domain">
            <el-input v-model="queryForm.domain" clearable />
          </el-form-item>
          <el-form-item v-show="!fold" label="mfa">
            <el-input v-model="queryForm.mfa" clearable />
          </el-form-item>

          <el-form-item v-show="!fold" label="clientid">
            <el-input v-model="queryForm.clientid" clearable />
          </el-form-item>
          <el-form-item v-show="!fold" label="topic">
            <el-input v-model="queryForm.topic" clearable />
          </el-form-item>
          <el-form-item v-show="!fold" label="peername" label-width="80px">
            <el-input v-model="queryForm.peername" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="fold = !fold">
              <span v-if="fold">
                {{ $translateTitle('Maintenance.Unfold') }}
              </span>
              <span v-else>{{ $translateTitle('Maintenance.merge') }}</span>
              <vab-icon
                class="vab-dropdown"
                :class="{ 'vab-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button>
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
      :data="logdata"
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
        :width="w80.includes(item) ? 80 : Wh120.includes(item) ? 120 : 'auto'"
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
  </div>
</template>

<script>
  import { queryLog } from '@/api/Logs'
  export default {
    name: 'HistoryLog',
    data() {
      return {
        isFullscreen: false,
        height: this.$baseTableHeight(0),
        logdata: [],
        momentKey: moment(new Date()).valueOf(),
        checkList: ['pid', 'level', 'mfa', 'line'],
        logcolumns: [
          'pid',
          'level',
          'domain',
          'mfa',
          'line',
          'clientid',
          'topic',
          'peername',
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
          domain: '',
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
      async queryTable(args = {}) {
        if (!args.limit) {
          args = this.queryForm
        }
        const loading = this.$baseColorfullLoading()
        console.log(this.queryForm, 'queryForm', args)
        try {
          loading.close()
          const params = {
            limit: args.limit,
            skip: args.skip,
            order: args.order,
            count: this.queryForm.count,
            include: '',
            where: {
              level: this.queryForm.level
                ? this.queryForm.level
                : { $ne: '3333' },
              pid: this.queryForm.pid
                ? { $regex: this.queryForm.pid, $options: 'i' }
                : { $ne: '3333' },
              mfa: this.queryForm.mfa
                ? { $regex: this.queryForm.mfa, $options: 'i' }
                : { $ne: '3333' },
              domain: this.queryForm.domain
                ? {
                    $all: this.queryForm.domain.split(
                      /,(?=(?:[^']*(?:'[^']*')?[^']*)*$)/
                    ),
                  }
                : { $ne: '' },
              topic: this.queryForm.topic
                ? { $regex: this.queryForm.topic, $options: 'i' }
                : { $ne: '3333' },
              peername: this.queryForm.peername
                ? { $regex: this.queryForm.peername, $options: 'i' }
                : { $ne: '3333' },
              clientid: this.queryForm.clientid
                ? { $regex: this.queryForm.clientid, $options: 'i' }
                : { $ne: '3333' },
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
          results.forEach((item) => {
            item.time = this.$moment(
              Number(item.time.toString().substring(0, 13))
            ).format('YYYY-MM-DD HH:mm:ss.SSS')
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
          console.log(error)
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
<style scoped lang="scss">
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
