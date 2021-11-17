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
              type="success"
              @click="fetchData()"
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
        label="objectId"
        prop="objectId"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="标题"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="表名"
        prop="class"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="类型"
        prop="type"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="创建时间"
        prop="createdAt"
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
          <el-button type="text" @click="handleDetail(row)">设计</el-button>
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
  import { queryView, putView, postView, delView, getView } from '@/api/View'
  import TableEdit from './components/TableEdit'
  import moment from 'moment'
  import { delProduct } from '@/api/Product'
  const defaultQuery = {
    class: '',
    type: '',
    title: '',
    key: '',
  }
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
        default: () => defaultQuery,
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
      handleHeight() {
        if (this.fold) this.height = this.$baseTableHeight(2) - 47
        else this.height = this.$baseTableHeight(3) - 30
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
        console.log(row.data, row.objectId)
        this.$baseConfirm(
          this.$translateTitle(
            'Maintenance.Are you sure you want to delete the current item'
          ),
          null,
          async () => {
            const res = await delView(row.objectId)
            this.$baseMessage(
              this.$translateTitle('successfully deleted'),
              'success',
              'vab-hey-message-success'
            )
            this.fetchData()
          }
        )
      },
      handleDetail(row) {
        this.$baseEventBus.$emit('lowcodeDesign', row)
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
        if (results)
          results.forEach((item) => {
            item.createdAt = moment(item.createdAt).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })
        this.list = results
        this.$baseEventBus.$emit('lowcodeLen', count)
        this.total = count
        this.listLoading = false
      },
    },
  }
</script>
