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
        >
          <el-form-item :label="$translateTitle('product.Table Name')">
            <el-select
              v-model="queryForm.class"
              allow-create
              clearable
              default-first-option
              filterable
              size="mini"
              @change="changeClass"
            >
              <el-option
                v-for="item in DbaTable"
                :key="item.className"
                :label="item.className"
                :value="item.className"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$translateTitle('product.title')">
            <el-input v-model="queryForm.title" />
          </el-form-item>
          <el-form-item :label="$translateTitle('rule.Type')">
            <el-input v-model="queryForm.type" />
          </el-form-item>
          <el-form-item label="key">
            <el-select
              v-model="queryForm.key"
              allow-create
              clearable
              default-first-option
              filterable
              size="mini"
              style="width: 100%"
            >
              <el-option
                v-for="item in keys"
                :key="item.objectId"
                :label="item.objectId"
                :value="item.objectId"
              >
                <span style="float: left">{{ item.objectId }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  <!--兼容所有表明的提示-->
                  {{
                    item.description ||
                    item.name ||
                    item.title ||
                    item.username ||
                    item.type
                  }}
                </span>
              </el-option>
            </el-select>
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
        width="auto"
      />
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('title')"
        align="center"
        :label="$translateTitle('product.title')"
        prop="title"
        show-overflow-tooltip
        width="200px"
      >
        <template #default="{ row }">
          <el-form :model="row">
            <el-form-item size="mini" style="margin-bottom: 0">
              <el-input
                v-if="row.isEdit"
                v-model="row.title"
                v-focus
                size="mini"
                @blur="blurEvent(row)"
                @focus="row.oldTitle = row.title"
              />
              <p
                v-else
                style="height: 8px; float: left; margin-left: 15px"
                v-html="row.title"
              />
              <i
                v-show="!row.isEdit"
                class="el-icon-edit"
                style="float: right; line-height: 26px; cursor: pointer"
                @click="row.isEdit = !row.isEdit"
              ></i>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('class')"
        align="center"
        :label="$translateTitle('product.Table Name')"
        prop="class"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        align="center"
        label="key"
        prop="key"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('rule.Type')"
        prop="type"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        v-show="!queryForm.hiddenRow.includes('createdAt')"
        align="center"
        :label="$translateTitle('application.createtime')"
        prop="createdAt"
        show-overflow-tooltip
        width="auto"
      />
      <el-table-column
        align="center"
        :label="$translateTitle('node.operation')"
        show-overflow-tooltip
        width="auto"
      >
        <template #default="{ row }">
          <el-button
            v-show="queryForm.showRow"
            type="text"
            @click="handleNotification(row)"
          >
            关联
          </el-button>
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
    <dgiot-parser-pagination
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
  import { getTable } from '@/api/Dba'
  import { mapMutations } from 'vuex'
  import lowcodeDesign from '@/views/CloudFunction/lowcode/components/index'
  import { queryView, putView, postView, delView, getView } from '@/api/View'
  import ViewEdit from './components/ViewEdit'

  const defaultQuery = {
    class: '',
    type: '',
    title: '',
    key: '',
    data: {
      type: 'page',
      initApi: {
        url: 'iotapi/classes/Device/parse_objectid',
        method: 'get',
        adaptor:
          'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.basedata\r\n  }',
        headers: {
          store: 'localStorage',
          dgiotReplace: 'parse_objectid',
        },
        dataType: 'json',
      },
      body: [
        {
          type: 'form',
          api: {
            method: 'put',
            url: 'iotapi/classes/Device/parse_objectid',
            headers: {
              store: 'localStorage',
              dgiotReplace: 'parse_objectid',
            },
            dataType: 'json',
            requestAdaptor:
              'return {\r\n    ...api,\r\n    data: {\r\n        basedata:{ ...api.data}\r\n    }\r\n}',
          },
          body: [
            {
              type: 'input-text',
              label: '设备名称',
              name: 'name',
            },
          ],
        },
      ],
    },
    disabled: false,
    hiddenRow: [],
  }
  export default {
    name: 'ComprehensiveTable',
    components: {
      ViewEdit,
      lowcodeDesign,
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.querySelector('input').focus()
        },
      },
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
        DbaTable: [],
        keys: [],
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
          order: '-updatedAt',
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
      this.setTreeFlag(false)
      this.fetchData()
      this.featchTable()
    },
    mounted() {
      if (this.$route.query.type == 'amis') {
        const { key, type, _class } = this.$route.query
        this.queryForm.key = key
        this.queryForm.type = type
        this.queryForm.class = _class
        this.queryForm.data = {
          type: 'page',
          initApi: {
            url: 'iotapi/classes/Device/parse_objectid',
            method: 'get',
            adaptor:
              'return {\r\n  "status":0,\r\n  "msg":"",\r\n  "data":response.data.profile\r\n  }',
            headers: {
              store: 'localStorage',
              dgiotReplace: 'parse_objectid',
            },
            dataType: 'json',
          },
          body: [
            {
              type: 'form',
              api: {
                method: 'put',
                url: 'iotapi/classes/Device/parse_objectid',
                headers: {
                  store: 'localStorage',
                  dgiotReplace: 'parse_objectid',
                },
                dataType: 'json',
                requestAdaptor:
                  'return {\r\n    ...api,\r\n    data: {\r\n        profile:{ ...api.data}\r\n    }\r\n}',
              },
              body: [
                {
                  type: 'input-text',
                  label: '设备名称',
                  name: 'name',
                },
              ],
            },
          ],
        }
      }
      this.$dgiotBus.$off('saveLowCode')
      this.$dgiotBus.$on('saveLowCode', (params) => {
        this.saveLowCode(params.id, params.data)
      })
    },
    methods: {
      ...mapMutations({
        set_amisJson: 'amis/set_amisJson',
        setTreeFlag: 'settings/setTreeFlag',
      }),
      async blurEvent(row) {
        row.isEdit = !row.isEdit
        if (row.title !== row.oldTitle)
          await putView(row.objectId, {
            title: row.title,
          })
        this.$message({
          message: '标题修改成功',
          type: 'success',
          showClose: true,
          duration: 1500,
        })
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 13:05:02
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async changeClass(_class) {
        try {
          console.log(_class)
          //  根据下拉的表,查到对应表数据
          const params = {
            order: '-updatedAt',
          }
          const { results = [] } = await this.$query_object(_class, params)
          console.log(results)
          this.keys = results
        } catch (error) {
          console.log(error)
          this.$baseMessage(
            this.$translateTitle('alert.Data request error') + `${error}`,
            'error',
            'dgiot-hey-message-error'
          )
        }
      },
      /**
       * @Author: dgiot-fe
       * @Date: 2022-04-21 12:50:35
       * @LastEditors:
       * @param
       * @return {Promise<void>}
       * @Description:
       */
      async featchTable() {
        try {
          const { results: table = [] } = await getTable()
          this.DbaTable = table
        } catch (error) {
          console.log(error)
        }
      },
      async handleNotification(rows) {
        await this.$baseEventBus.$emit('showNotificationSettings', rows)
      },
      handleAdd() {
        this.$refs['edit'].type = 'add'
        // 解决子组件修改影响父组件的显示问题
        this.$refs['edit'].DbaTable = this.DbaTable
        this.$refs['edit'].row = this.queryForm
        this.$refs['edit'].dialogFormVisible = true
      },
      async handleEdit(row) {
        const loading = this.$baseLoading(1)
        const { data = {} } = await getView(row.objectId)
        if (['amis_view', 'amis'].includes(row.type)) {
          this.$router.push({
            path: `/design/editor/amis`,
            query: {
              viewId: row.objectId,
              type: 'amis',
            },
          })
        } else {
          this.$router.push({
            path: `/design/editor/amis/`,
            query: {
              viewId: row.objectId,
              type: row.type,
            },
          })
        }
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
              this.$translateTitle('Maintenance.successfully deleted'),
              'success',
              'dgiot-hey-message-success'
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
            item.isEdit = false
            item.oldTitle = item.title
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
