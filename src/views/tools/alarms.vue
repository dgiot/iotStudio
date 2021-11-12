<template>
  <div class="alarms-view">
    <div class="page-title">
      {{ $translateTitle('leftbar.alarms') }}
    </div>
    <!-- alarms list -->
    <div class="table-title">
      {{ $translateTitle('analysis.currentAlarms') }}
    </div>
    <el-table
      v-loading="loading"
      border
      :data="currentTableData"
    >
      <el-table-column
        :label="$translateTitle('analysis.alarmName')"
        prop="name"
      />
      <el-table-column
        :label="$translateTitle('analysis.alarmMessage')"
        min-width="140px"
        prop="message"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-popover
            :open-delay="500"
            placement="top"
            trigger="hover"
            width="160"
          >
            <div
              v-for="(value, label) in row.details"
              :key="label"
            >
              {{ label }}: {{ value }}
            </div>
            <span
              slot="reference"
              class="details"
            >
              <i class="iconfont icon-bangzhu"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$translateTitle('clients.node')"
        min-width="60px"
        prop="node"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$translateTitle('analysis.activateAt')"
        prop="activate_at"
      >
        <template slot-scope="{ row }">
          {{ dateFormat(row.activate_at) }}
        </template>
      </el-table-column>
      <el-table-column>
        <span slot="header">
          {{ $translateTitle('analysis.duration') }}
          <el-popover
            placement="top"
            trigger="hover"
          >
            {{ $translateTitle('analysis.durationTips') }}
            <i
              slot="reference"
              class="el-icon-question"
            ></i>
          </el-popover>
        </span>
        <template slot-scope="{ row }">
          {{ getDuration(row.duration) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="$translateTitle('oper.oper')"
        width="120px"
      >
        <template slot-scope="{ row, $index, _self }">
          <el-popover
            :ref="`popover-${$index}`"
            placement="right"
            trigger="click"
          >
            <p>{{ $translateTitle('analysis.confirmDeactivate') }}</p>
            <div style="text-align: right">
              <el-button
                class="cache-btn"
                size="mini"
                type="text"
                @click="_self.$refs[`popover-${$index}`].doClose()"
              >
                {{ $translateTitle('oper.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleCancelAlarm(row, $index, _self)"
              >
                {{ $translateTitle('oper.confirm') }}
              </el-button>
            </div>
            <el-button
              slot="reference"
              plain
              size="mini"
              type="danger"
            >
              {{ $translateTitle('analysis.deactivate') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-title">
      {{ $translateTitle('analysis.historicalAlarm') }}
      <el-button
        class="table-oper"
        :disabled="!historicalTableData.length"
        plain
        size="mini"
        type="danger"
        @click="handleClearAll"
      >
        {{ $translateTitle('analysis.clearAll') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="historicalTableData"
    >
      <el-table-column
        :label="$translateTitle('analysis.alarmName')"
        prop="name"
      />
      <el-table-column
        :label="$translateTitle('analysis.alarmMessage')"
        min-width="140px"
        prop="message"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-popover
            :open-delay="500"
            placement="top"
            trigger="hover"
            width="160"
          >
            <div
              v-for="(value, label) in row.details"
              :key="label"
            >
              {{ label }}: {{ value }}
            </div>
            <span
              slot="reference"
              class="details"
            >
              <i class="iconfont icon-bangzhu"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$translateTitle('clients.node')"
        min-width="60px"
        prop="node"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$translateTitle('analysis.activateAt')"
        prop="activate_at"
      >
        <template slot-scope="{ row }">
          {{ dateFormat(row.activate_at) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$translateTitle('analysis.deactivateAt')"
        prop="deactivate_at"
      >
        <template slot-scope="{ row }">
          {{ dateFormat(row.deactivate_at) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--eslint-disable-->
<script>
  import { Popover, Table, TableColumn, Tooltip } from 'element-ui'
  import { getDateDiff } from '@/utils/index'
  import dateformat from '@/utils/utilwen'

  export default {
    name: 'AlarmsView',
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-popover': Popover,
      'el-tooltip': Tooltip,
    },
    data() {
      return {
        loading: false,
        currentTableData: [],
        historicalTableData: [],
        lang: window.localStorage.getItem('language') || 'en',
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.loadAlarmData('activated', 'currentTableData')
        this.loadAlarmData('deactivated', 'historicalTableData')
      },
      loadAlarmData(type, tableData) {
        this.loading = true
        this.$httpGet(`/alarms/${type}`)
          .then((response) => {
            const res = response.data
            const data = []
            res.forEach((item) => {
              item.alarms.forEach((alarm) => {
                alarm.node = item.node
                data.push(alarm)
              })
            })
            this[tableData] = data
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
            this.$message.error(
              error || this.$translateTitle('error.networkError'),
            )
          })
      },
      getDuration(duration) {
        return getDateDiff(duration / 1000)
      },
      dateFormat(date) {
        if (typeof date !== 'number' && date === 'infinity') {
          return ''
        }
        return dateformat(date / 1000, 'yyyy-mm-dd HH:MM:ss')
      },
      handleCancelAlarm(row, index, self) {
        const body = {
          node: row.node,
          name: row.name,
        }
        this.$httpPost('/alarms/deactivated', body)
          .then(() => {
            self.$refs[`popover-${index}`].doClose()
            this.loadData()
          })
          .catch((error) => {
            this.$message.error(
              error || this.$translateTitle('error.networkError'),
            )
          })
      },
      handleClearAll() {
        this.$confirm(
          this.$translateTitle('analysis.confirmClear'),
          this.$translateTitle('oper.warning'),
          {
            confirmButtonClass: 'confirm-btn',
            cancelButtonClass: 'cache-btn el-button--text',
            type: 'warning',
          },
        )
          .then(() => {
            this.$httpDelete('/alarms/deactivated')
              .then(() => {
                this.loadData()
              })
              .catch((error) => {
                this.$message.error(
                  error || this.$translateTitle('error.networkError'),
                )
              })
          })
          .catch(() => {
          })
      },
    },
  }
</script>

<style lang="scss">
  .alarms-view {
    .table-title {
      .table-title {
        margin: 24px 0 20px 0;
        font-size: 16px;

        .table-oper {
          float: right;
        }
      }

      .el-table {
        margin-bottom: 32px;
      }

      .details {
        margin-right: 5px;
        color: #a7a7a7;
        cursor: pointer;
      }
    }
  }
</style>
