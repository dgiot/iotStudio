<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-05-12 18:02:23
* @LastEditors: 18:02
* @LastEditTime: 2022-05-12 18:02:23
* @Description:
* @FilePath: src\views\CloudPressure\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
-->
<template>
  <div
    ref="pressure-table"
    class="pressure-container"
    :class="{ 'dgiot-fullscreen': isFullscreen }"
  >
    <dgiot-query-form>
      <dgiot-query-form-left-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="0"
          :model="queryForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.name" placeholder="请输入压测任务名" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              native-type="submit"
              type="primary"
              @click="handleQuery"
            >
              查询
            </el-button>
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click.native="handleAdd"
            >
              添加
            </el-button>
          </el-form-item>
        </el-form>
      </dgiot-query-form-left-panel>
    </dgiot-query-form>

    <a-tabs v-model="activeKey">
      <a-tab-pane key="task" tab="新增任务">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :border="border"
          :data="list"
          :size="lineHeight"
          :stripe="stripe"
        >
          <el-table-column
            align="center"
            label="序号"
            show-overflow-tooltip
            sortable
            width="95"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in finallyColumns"
            :key="index"
            align="center"
            :label="item.label"
            sortable
            :width="item.width"
          >
            <template #default="{ row }">
              <span v-if="item.label === '评级'">
                <el-rate v-model="row.rate" disabled />
              </span>
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" fixed="right" label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="handleClick(row, 'setting')">
                查看配置
              </el-button>
              <el-button type="text" @click="handleClick(row, 'edit')">
                修改配置
              </el-button>
              <el-button
                type="text"
                @click="
                  handleClick(row, row.isEnable == false ? 'start' : 'stop')
                "
              >
                {{ row.isEnable == false ? '启动压测' : '停止压测' }}
              </el-button>
              <el-button type="text" @click="handleClick(row, 'clone')">
                克隆任务
              </el-button>
              <el-button type="text" @click="handleClick(row, 'delete')">
                删除任务
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-image
              class="dgiot-data-empty"
              :src="
                require('../../../public/assets/images/platform/assets/empty_images/data_empty.png')
              "
            />
          </template>
        </el-table>
        <el-pagination
          background
          :current-page="queryForm.size"
          :layout="layout"
          :page-size="queryForm.limit"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </a-tab-pane>
      <a-tab-pane key="report" tab="任务报告">
        <dgiot-empty />
      </a-tab-pane>
    </a-tabs>
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { queryDevice, getDevice, delDevice, postDevice } from '@/api/Device'
  import TableEdit from '@/views/DeviceCloud/empty/tableEdit'

  export default {
    name: 'Pressure',
    components: {
      TableEdit,
    },
    props: {},
    data() {
      return {
        activeKey: 'task',
        infoData: 'Empty',
        isFullscreen: false,
        border: true,
        height: this.$baseTableHeight(1),
        stripe: true,
        lineHeight: 'medium',
        checkList: ['压测任务', '开始时间', '结束时间', '压测任务状态'],
        columns: [
          {
            label: '压测任务',
            width: 'auto',
            prop: 'name',
            sortable: true,
            disableCheck: true,
          },
          {
            label: '开始时间',
            width: '200',
            prop: 'createdAt',
            sortable: true,
          },
          {
            label: '结束时间',
            width: '200',
            prop: 'updatedAt',
            sortable: true,
          },
          {
            label: '压测任务状态',
            width: '200',
            prop: 'isEnable',
            sortable: true,
          },
        ],
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          skip: 0,
          limit: 10,
          name: '',
          search: '',
          type: 'name',
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
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      },
    },
    watch: {},
    mounted() {},
    created() {
      this.fetchData()
    },
    destroyed() {},
    methods: {
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleClick(col, type) {
        switch (type) {
          case 'setting':
            this.$message({
              type: 'success',
              message: '你的弹出配置事件',
              showClose: true,
            })
            break
          case 'edit':
            this.$message({
              type: 'success',
              message: '你的弹出框修改事件',
              showClose: true,
            })
            break
          case 'start':
            this.$message({
              type: 'success',
              message: '启动任务请求',
              showClose: true,
            })
            break
          case 'stop':
            this.$message({
              type: 'success',
              message: '停止任务请求',
              showClose: true,
            })
            break
          case 'clone':
            this.$message({
              type: 'success',
              message: '克隆任务请求',
              showClose: true,
            })
            break
          case 'delete':
            this.handleDelete(row)
            break
        }
      },
      handleDelete(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await delDevice(row.objectId)
          this.$baseMessage(msg, 'success', 'dgiot-hey-message-success')
          await this.fetchData()
        })
      },
      handleSizeChange(val) {
        this.queryForm.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.skip = Number(val - 1) * Number(this.queryForm.limit)
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.limit = 10
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          skip: this.queryForm.skip,
          limit: this.queryForm.limit,
          count: 'objectId',
          order: '-createdAt',
          excludeKeys: 'properties',
          where: {},
        }
        this.queryForm.name
          ? (params.where.name = { $regex: this.queryForm.name })
          : ''
        const { count = 0, results = [] } = await queryDevice(params)
        results.forEach((i) => {
          i.createdAt = this.$moment(i.createdAt).format('YYYY-MM-DD HH:mm:ss')
          i.updatedAt = this.$moment(i.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        })
        this.list = results
        this.total = count
        this.listLoading = false
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 0px !important;
  }

  .index-container {
    width: 100%;
    heigth: 100%;
  }
</style>
