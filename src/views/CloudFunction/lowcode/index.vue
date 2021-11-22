<template>
  <div :key="queryForm.key" class="comprehensive-table-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :inline="true"
          label-width="49px"
          :model="queryForm"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item :label="$translateTitle('product.Table Name')">
            <el-input v-model="queryForm.class" size="mini" />
          </el-form-item>
          <el-form-item :label="$translateTitle('product.title')">
            <el-input v-model="queryForm.title" />
          </el-form-item>
          <el-form-item :label="$translateTitle('rule.Type')">
            <el-input v-model="queryForm.type" />
          </el-form-item>
          <el-form-item label="key">
            <el-input v-model="queryForm.key" />
          </el-form-item>
          <el-form-item label="id">
            <el-input v-model="queryForm.objectId" size="mini" />
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
          <el-button type="text" @click="handleLowCode(row.objectId)">
            {{ $translateTitle('application.preview') }}
          </el-button>
          <el-button type="text" @click="handleEdit(row)">
            {{ $translateTitle('product.Design') }}
          </el-button>
          <!--          <el-button type="text" @click="handleEdit(row)">编辑</el-button>-->
          <el-button type="text" @click="handleDelete(row)">
            {{ $translateTitle('task.Delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <vab-parser-pagination
      :pagination="paginations"
      :query-payload="queryPayload"
      @pagination="fetchData"
      @paginationQuery="paginationQuery"
    />
    <view-edit ref="edit" @fetch-data="fetchData" />
    <lowcodeDesign ref="lowcodeDesign" @objectId="lowcodeId" />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import lowcodeDesign from '@/views/CloudFunction/lowcode/components/index'
  import { queryView, putView, postView, delView, getView } from '@/api/View'
  import ViewEdit from './components/ViewEdit'
  const defaultQuery = {
    class: '',
    type: '',
    title: '',
    key: '',
    data: [],
    disabled: false,
    hiddenRow: [],
  }
  export default {
    name: 'ComprehensiveTable',
    components: {
      ViewEdit,
      lowcodeDesign,
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
        required: false,
        type: Object,
        default: () => defaultQuery,
      },
    },
    data() {
      return {
        lowcodeId: '',
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
          excludeKeys: 'data',
          include: '',
          order: '-createdAt',
          limit: 10,
          skip: 0,
          count: 'objectId',
        },
        queryForm: this.viewForm,
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
      this.$dgiotBus.$off('saveLowCode')
      this.$dgiotBus.$on('saveLowCode', (params) => {
        this.saveLowCode(params.id, params.data)
      })
    },
    methods: {
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
      }),
      handleAdd() {
        this.$refs['edit'].type = 'add'
        this.$refs['edit'].showEdit(this.queryForm)
      },
      async handleEdit(row) {
        const loading = this.$baseLoading(1)
        const { data = {} } = await getView(row.objectId)
        this.$router.push({
          path: `/design/editor/${row.type}`,
          query: {
            viewId: row.objectId,
            type: row.type,
          },
        })
        loading.close()
        this.set_amisJson(data)
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
      async handleLowCode(lowcodeId) {
        const loading = this.$baseColorfullLoading(1)
        const res = await getView(lowcodeId)
        loading.close()
        this.$dgiotBus.$emit('lowcodePreview', res)
      },
      async saveLowCode(lowcodeId, payload) {
        const loading = this.$baseColorfullLoading(1)
        const res = await putView(lowcodeId, payload)
        loading.close()
      },
      async paginationQuery(queryPayload) {
        this.queryPayload = queryPayload
      },
      async fetchData(params) {
        if (_.isEmpty(params)) params = this.queryPayload
        this.queryPayload.where = {
          class: this.queryForm.class
            ? { $regex: this.queryForm.class }
            : { $ne: null },
          type: this.queryForm.type
            ? { $regex: this.queryForm.type }
            : { $ne: null },
          title: this.queryForm.title
            ? { $regex: this.queryForm.title }
            : { $ne: null },
          key: this.queryForm.key
            ? { $regex: this.queryForm.key }
            : { $ne: null },
          objectId: this.queryForm.objectId
            ? { $regex: this.queryForm.objectId }
            : { $ne: null },
        }
        const { count, order, excludeKeys, limit, skip, where } = params
        console.log(this.queryForm)
        this.listLoading = true
        const { results, count: total } = await queryView({
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
        this.$dgiotBus.$emit('lowcodeLen', total)
        this.paginations.total = total
        this.listLoading = false
      },
    },
  }
</script>
