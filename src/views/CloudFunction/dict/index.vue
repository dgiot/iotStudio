<template>
  <div :key="queryForm.key" class="comprehensive-table-container">
    <dgiot-query-form>
      <dgiot-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="49px"
          :model="queryForm"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('product.Table Name')">
            <el-input v-model="queryForm.class" readonly size="mini" />
          </el-form-item>
          <el-form-item label="key">
            <el-input v-model="queryForm.key" readonly size="mini" />
          </el-form-item>
          <el-form-item :label="$translateTitle('product.title')">
            <!--            <el-input v-model="queryForm.title" />-->
            <el-select
              v-model="queryForm.title"
              allow-create
              default-first-option
              filterable
              placeholder="请选择"
              size="mini"
              style="width: 95%"
            >
              <el-option
                v-for="(item, index) in titleOption"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('rule.Type')">
            <el-select
              v-model="queryForm.type"
              allow-create
              default-first-option
              filterable
              :placeholder="$translateTitle('rule.Type')"
              size="mini"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in dicttype"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd" />
            <el-button
              icon="el-icon-search"
              type="success"
              @click="fetchData()"
            />
          </el-form-item>
        </el-form>
      </dgiot-query-form-top-panel>
    </dgiot-query-form>

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
        v-show="!queryForm.hiddenRow.includes('title')"
        align="center"
        :label="$translateTitle('product.title')"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('class')"
        align="center"
        :label="$translateTitle('product.Table Name')"
        prop="class"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="key"
        prop="key"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$translateTitle('rule.Type')"
        prop="type"
        show-overflow-tooltip
      />
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('createdAt')"
        align="center"
        :label="$translateTitle('application.createtime')"
        prop="createdAt"
        show-overflow-tooltip
        width="140"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('node.operation')"
        show-overflow-tooltip
        width="130"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleDict(row.objectId)">
            设计
          </el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dgiot-parser-pagination
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
    <dict-edit ref="edit" @fetch-data="fetchData" />
    <dictDesign ref="dictDesign" @objectId="dictId" />
  </div>
</template>

<script>
  import dictDesign from '@/views/CloudFunction/dict/components/index'
  import { delDict, getDict, putDict, queryDict } from '@/api/Dict'
  import dictEdit from './components/dictEdit'

  const defaultQuery = {
    class: '',
    type: '',
    title: '',
    key: '',
    data: {},
    disabled: false,
    hiddenRow: [],
  }
  export default {
    name: 'ComprehensiveTable',
    components: {
      dictEdit,
      dictDesign,
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
      dictForm: {
        required: false,
        type: Object,
        default: () => defaultQuery,
      },
    },
    data() {
      return {
        dictId: '',
        paginations: {
          // 每页显示个数选择器的选项设置
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          // 组件布局，子组件名用逗号分隔
          layout: 'total, sizes, prev, pager, next, jumper',
          // 是否为分页按钮添加背景色
          background: true,
          // 是否显示本控件
          hidden: false,
          // 是否使用小型分页样式
          small: false,
          // 每页显示条目个数，支持 .sync 修饰符
          pageSize: 10,
          // 总条目数
          total: 0,
          // 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
          pageCount: 0,
          // 页码按钮的数量，当总页数超过该值时会折叠 大于等于 5 且小于等于 21 的奇数
          pagerCount: 7,
          // 当前页数，支持 .sync 修饰符
          currentPage: 1,
          // 每页显示个数选择器的下拉框类名
          popperClass: '',
          // 替代图标显示的上一页文字
          prevText: '',
          // 替代图标显示的下一页文字
          nextText: '',
          // 是否禁用
          disabled: false,
          // 只有一页时是否隐藏
          hideOnSinglePage: false,
        },
        queryPayload: {
          include: '',
          order: '-createdAt',
          limit: 10,
          skip: 0,
          count: 'objectId',
        },
        queryForm: this.dictForm,
        dicttype: ['dict', 'word', 'rule', 'datav'],
        titleOption: ['worddict', 'ruledict'],
        list: [],
        imageList: [],
        listLoading: true,
        selectRows: '',
      }
    },
    created() {
      this.fetchData()
    },
    mounted() {
      this.$dgiotBus.$off('saveDict')
      this.$dgiotBus.$on('saveDict', (params) => {
        this.saveDict(params.id, params.data)
      })
    },
    methods: {
      handleAdd() {
        this.$refs['edit'].type = 'add'
        console.log('this.queryForm', this.queryForm)
        this.$refs['edit'].showEdit(this.queryForm)
      },
      handleEdit(row) {
        this.$refs['edit'].dictId = row.objectId
        this.$refs['edit'].type = 'edit'
        console.log('row', row)
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
            const res = await delDict(row.objectId)
            this.$baseMessage(
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
            )
            this.fetchData()
          }
        )
      },
      async handleDict(dictId) {
        const loading = this.$baseColorfullLoading(1)
        const res = await getDict(dictId)
        loading.close()
        this.$dgiotBus.$emit('dictDesign', res)
      },
      async saveDict(dictId, payload) {
        const loading = this.$baseColorfullLoading(1)
        const res = await putDict(dictId, payload)
        loading.close()
      },
      async paginationQuery(queryPayload) {
        this.queryPayload = queryPayload
      },
      async fetchData(params) {
        if (_.isEmpty(params)) params = this.queryPayload
        this.queryPayload.where = {}
        this.queryForm.class
          ? (this.queryPayload.where.class = { $regex: this.queryForm.class })
          : ''
        this.queryForm.type
          ? (this.queryPayload.where.type = { $regex: this.queryForm.type })
          : ''
        this.queryForm.title
          ? (this.queryPayload.where.title = { $regex: this.queryForm.title })
          : ''
        this.queryForm.key
          ? (this.queryPayload.where.key = { $regex: this.queryForm.key })
          : ''
        this.queryForm.objectId
          ? (this.queryPayload.where.objectId = {
              $regex: this.queryForm.objectId,
            })
          : ''
        const { count, order, excludeKeys, limit, skip, where } = params
        console.log(this.queryForm)
        this.listLoading = true
        const { results, count: total } = await queryDict({
          count,
          order,
          excludeKeys,
          limit,
          skip,
          where,
        })
        if (results)
          results.forEach((item) => {
            item.createdAt = moment(item.createdAt).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })
        this.list = results
        this.$dgiotBus.$emit('dictLen', total)
        this.paginations.total = total
        this.listLoading = false
      },
    },
  }
</script>
