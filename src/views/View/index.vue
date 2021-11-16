<template>
  <div :key="queryForm.key" class="comprehensive-table-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :disabled="queryForm.disabled"
          :inline="true"
          label-width="49px"
          :model="queryForm"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item label="表名">
            <el-input v-model="queryForm.class" size="mini" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="queryForm.title" />
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="queryForm.type" />
          </el-form-item>
          <el-form-item label="key">
            <el-input v-model="queryForm.key" />
          </el-form-item>
        </el-form>
        <el-form size="mini" style="margin-left: 20px">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
              添加
            </el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete($event)"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" border :data="list">
      <el-table-column
        align="center"
        show-overflow-tooltip
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="序号"
        show-overflow-tooltip
        width="55"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="标题"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="作者"
        prop="author"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="评级">
        <template #default="{ row }">
          <el-rate v-model="row.rate" disabled />
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template #default="{ row }">
          <el-image
            v-if="imgShow"
            :preview-src-list="imageList"
            :src="row.img"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="点击量"
        prop="pageViews"
        show-overflow-tooltip
        sortable
      />
      <el-table-column
        align="center"
        label="开关"
        prop="switch"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.switch === 0 ? '点击开启' : '点击关闭'"
            :enterable="false"
            placement="top"
          >
            <el-switch v-model="row.switch" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tooltip
            class="item"
            :content="row.status"
            effect="dark"
            placement="top-start"
          >
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="时间"
        prop="datetime"
        show-overflow-tooltip
        width="200"
      />
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="130"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <el-pagination-->
    <!--      background-->
    <!--      :current-page="queryForm.pageNo"-->
    <!--      :layout="layout"-->
    <!--      :page-size="queryForm.pageSize"-->
    <!--      :total="total"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--      @size-change="handleSizeChange"-->
    <!--    />-->
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { queryView } from '@/api/View'
  import TableEdit from './components/TableEdit'

  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    props: {
      viewForm: {
        required: true,
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        fold: false,
        queryForm: this.viewForm,
        height: this.$baseTableHeight(3) - 30,
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
      }
    },
    computed: {
      // queryForm: function () {
      //   return this.viewForm
      // },
    },
    beforeMount() {
      window.addEventListener('resize', this.handleHeight)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleHeight)
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleFold() {
        this.fold = !this.fold
        this.handleHeight()
      },
      handleHeight() {
        if (this.fold) this.height = this.$baseTableHeight(2) - 47
        else this.height = this.$baseTableHeight(3) - 30
      },
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].type = 'add'
        this.$refs['edit'].showEdit(this.queryForm)
      },
      handleEdit(row) {
        this.$refs['edit'].viewId = row.objectId
        this.$refs['edit'].type = 'edit'
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success', 'vab-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      },
      handleDetail(row) {
        if (row.id)
          this.$router.push({
            path: '/vab/table/detail',
            query: row,
          })
        else {
          if (this.selectRows.length === 1) {
            this.$router.push({
              path: '/vab/table/detail',
              query: this.selectRows[0],
            })
          } else {
            this.$baseMessage(
              '请选择一行进行详情页跳转',
              'error',
              'vab-hey-message-error'
            )
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        console.log(this.queryForm)
        this.listLoading = true
        const { results, count } = await queryView({
          keys: 'count(*)',
          order: '-updatedAt',
          where: {
            class: this.queryForm.class,
            type: this.queryForm.type,
            title: this.queryForm.title.length
              ? { $regex: this.queryForm.title }
              : { $ne: null },
            key: this.queryForm.key,
          },
        })
        this.list = results
        this.total = count
        this.listLoading = false
      },
    },
  }
</script>
