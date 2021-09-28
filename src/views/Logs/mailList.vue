<template>
  <div class="system-log-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="60px"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item label="账号">
            <el-input
              v-model.trim="queryForm.account"
              clearable
              placeholder="请输入账号"
            />
          </el-form-item>
          <el-form-item label="周期">
            <el-date-picker
              v-model="queryForm.searchDate"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              start-placeholder="开始日期"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click.native="queryData"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list">
      <el-table-column
        align="center"
        label="日志类型"
        prop="type"
        show-overflow-tooltip
        width="230px"
      />
      <el-table-column
        align="center"
        label="账号"
        prop="account"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="执行结果"
        prop="executeResult"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span v-if="row.executeResult === '登录成功'">
            <span class="vab-dot vab-dot-success"><span></span></span>
            {{ row.executeResult }}
          </span>
          <span v-else>
            <span class="vab-dot vab-dot-error"><span></span></span>
            {{ row.executeResult }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录IP" prop="ip" />
      <el-table-column
        align="center"
        label="访问时间"
        prop="datetime"
        show-overflow-tooltip
      />
      <template #empty></template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/Mock/SystemLog'

  export default {
    name: 'SystemLog',
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const {
          data: { list, total },
        } = await getList(this.queryForm)
        this.list = list
        this.total = total
        this.listLoading = false
      },
    },
  }
</script>
